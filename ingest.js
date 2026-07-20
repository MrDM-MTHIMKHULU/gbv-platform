// Run locally with: node ingest.js
// Not part of the deployed site, this is a one-off script you run whenever
// you add or update source documents.
//
// Setup: npm install @supabase/supabase-js dotenv
// .env needs: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ---------------------------------------------------------------------------
// 1. Define your source documents here.
//    Each entry becomes a labelled chunk in the knowledge base.
//    Start small and add more as you go, e.g. one entry per section of an Act.
// ---------------------------------------------------------------------------
const DOCUMENTS = [
  {
    source: 'Domestic Violence Act 116 of 1998, Section 4',
    topic: 'Protection Orders',
    content: `PASTE THE ACTUAL SECTION TEXT HERE, or load it from a .txt file with fs.readFileSync.`,
  },
  {
    source: 'Legal Aid South Africa, Means Test Guide',
    topic: 'Legal Aid',
    content: `PASTE THE ACTUAL GUIDE TEXT HERE.`,
  },
  // Add more entries: Sexual Offences Act sections, Protection from Harassment
  // Act, shelter directory notes, SAPS procedure guides, etc.
];

// ---------------------------------------------------------------------------
// 2. Simple chunking: splits long content into ~500-word pieces.
//    Adjust chunkSize if a section is very long or very short.
// ---------------------------------------------------------------------------
function chunkText(text, chunkSize = 500) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

async function embed(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }),
    }
  );
  const data = await res.json();
  return data.embedding?.values;
}

async function run() {
  for (const doc of DOCUMENTS) {
    const chunks = chunkText(doc.content);
    console.log(`Embedding ${chunks.length} chunk(s) from: ${doc.source}`);

    for (const chunk of chunks) {
      const embedding = await embed(chunk);
      if (!embedding) {
        console.error(`Failed to embed a chunk from ${doc.source}, skipping.`);
        continue;
      }

      const { error } = await supabase.from('document_chunks').insert({
        content: chunk,
        source: doc.source,
        topic: doc.topic,
        embedding,
      });

      if (error) console.error('Insert error:', error);
    }
  }

  console.log('Done.');
}

run();
