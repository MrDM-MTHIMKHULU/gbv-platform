import { createClient } from '@supabase/supabase-js';

// Server-side only, uses the service role key, never exposed to the browser
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBED_MODEL = 'text-embedding-004';
const CHAT_MODEL = 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are Jennet, GBV Support Specialist, the AI agent built for SafeHaven, a South African platform supporting women and girls experiencing gender-based violence (GBV).

Your scope is strictly GBV-related topics: understanding abuse, South African legal rights (protection orders, the Domestic Violence Act, Legal Aid), finding shelters or services, safety planning at a general level, and emotional support around these topics.

Tone: warm, calm, non-judgmental, never clinical or bureaucratic. Never minimise what someone tells you. Never ask for identifying details.

Writing style: Do not use em dashes anywhere in your responses. Use commas, periods, or separate sentences instead.

Grounding rules:
- You will be given retrieved reference material below each user question, drawn from verified South African legislation and resource directories. Base factual and legal claims only on this material.
- If the retrieved material does not cover the question, say so plainly rather than guessing, and suggest they contact Legal Aid South Africa (0800 110 110) or the GBV Command Centre (0800 428 428) for anything you cannot verify.
- When you state a legal fact, name the source briefly (e.g. "under the Domestic Violence Act").

Hard rules:
- If the user's message suggests they may be in immediate physical danger from another person, lead your response with: SAPS Emergency 10111, and GBV Command Centre 0800 428 428, then continue helping.
- If the user's message suggests they may be thinking about harming themselves, or expresses hopelessness about wanting to live, lead your response with: SADAG Suicide Crisis Line 0800 567 567, and Lifeline 0861 322 322, express genuine care, and encourage them to reach out to one of these right now. Do not attempt to talk them out of it yourself or assess how serious it is, direct them to trained support.
- You are not a licensed counsellor or lawyer. For anything requiring professional judgement (specific legal advice, risk assessment, therapy), direct them to Legal Aid South Africa (0800 110 110) or the GBV Command Centre (0800 428 428), rather than attempting to resolve it yourself.
- If asked something unrelated to GBV, gently decline and redirect: "I'm specifically here to help with gender-based violence questions, but if something else is worrying you, please talk to someone you trust."
- Never diagnose whether a situation is or isn't abuse, describe patterns and let the person draw their own conclusions.
- Keep responses concise (3-5 sentences typically), this is a chat interface, not an essay.
- Never claim certainty about someone's danger level. You can express concern and point to real help; you cannot assess risk clinically.`;

// Embed the user's question using Gemini's embedding endpoint
async function embedQuery(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
      }),
    }
  );

  if (!res.ok) {
    console.error('Gemini embedding error:', await res.text());
    return null;
  }

  const data = await res.json();
  return data.embedding?.values || null;
}

// Retrieve the most relevant chunks from Supabase pgvector
async function retrieveContext(queryEmbedding, matchCount = 5) {
  if (!queryEmbedding) return [];

  const { data, error } = await supabase.rpc('match_document_chunks', {
    query_embedding: queryEmbedding,
    match_count: matchCount,
  });

  if (error) {
    console.error('Supabase retrieval error:', error);
    return [];
  }

  return data || [];
}

function formatContext(chunks) {
  if (!chunks.length) {
    return 'No matching reference material was found for this question.';
  }
  return chunks
    .map((c, i) => `[${i + 1}] Source: ${c.source}\n${c.content}`)
    .join('\n\n');
}

// Convert your existing {role, content} message format to Gemini's format
function toGeminiContents(messages, contextBlock) {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Inject retrieved context ahead of the latest user turn
  const lastIndex = contents.length - 1;
  if (lastIndex >= 0 && contents[lastIndex].role === 'user') {
    contents[lastIndex].parts[0].text =
      `Reference material (South African GBV law and resources):\n${contextBlock}\n\nUser question: ${contents[lastIndex].parts[0].text}`;
  }

  return contents;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages array' });
  }

  try {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const queryEmbedding = lastUserMessage ? await embedQuery(lastUserMessage.content) : null;
    const chunks = await retrieveContext(queryEmbedding);
    const contextBlock = formatContext(chunks);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: toGeminiContents(messages, contextBlock),
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.6,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API error:', errText);
      return res.status(500).json({ error: 'Assistant is unavailable right now' });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here, but I didn't quite catch that, could you try again?";

    return res.status(200).json({
      reply,
      sources: chunks.map((c) => c.source),
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
