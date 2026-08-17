// One-time (re-run when lesson content changes) script.
// Generates natural-sounding MP3 narration for every lesson using
// Google Cloud Text-to-Speech (Neural2 voice), then uploads each file
// to a public Supabase Storage bucket called "lesson-audio".
//
// Run locally with: node scripts/generate-lesson-audio.js
//
// Requires these env vars (put them in a local .env file, never commit it):
//   GOOGLE_TTS_API_KEY          - from Google Cloud Console (Text-to-Speech API enabled)
//   NEXT_PUBLIC_SUPABASE_URL    - same one your app already uses
//   SUPABASE_SERVICE_ROLE_KEY   - same one used in lib/supabaseAdmin.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { COURSES } = require('../lib/courseData');
const { ADVANCED_COURSES } = require('../lib/allyCourseData');

const GOOGLE_TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'lesson-audio';
const VOICE_NAME = 'en-US-Neural2-F'; // warm, natural-sounding female voice

if (!GOOGLE_TTS_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing GOOGLE_TTS_API_KEY, NEXT_PUBLIC_SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY in your env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function synthesize(text) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: 'en-US', name: VOICE_NAME },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0 },
      }),
    }
  );
  const json = await res.json();
  if (!json.audioContent) {
    throw new Error('Google TTS error: ' + JSON.stringify(json));
  }
  return Buffer.from(json.audioContent, 'base64');
}

async function uploadAudio(path, buffer) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: 'audio/mpeg', upsert: true });
  if (error) throw error;
  console.log('Uploaded:', path);
}

async function run() {
  // Basic courses (lib/courseData.js)
  for (const course of COURSES) {
    for (const lesson of course.lessons) {
      const path = `${course.id}/${lesson.id}.mp3`;
      console.log('Generating:', path);
      const audio = await synthesize(lesson.content);
      await uploadAudio(path, audio);
    }
  }

  // Ally & Bystanders style advanced courses (lib/allyCourseData.js)
  // Only lesson content is narrated, quizzes are skipped on purpose.
  for (const course of ADVANCED_COURSES) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        const path = `${course.id}/${lesson.id}.mp3`;
        console.log('Generating:', path);
        const audio = await synthesize(lesson.content);
        await uploadAudio(path, audio);
      }
    }
  }

  console.log('Done. All lesson audio generated and uploaded.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
