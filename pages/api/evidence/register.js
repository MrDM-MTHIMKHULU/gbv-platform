import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Follows the same auth pattern as pages/api/certificate.js: the anon key
// plus the user's own access token, so Row Level Security still applies —
// this route can only ever act as the logged-in user, not as an admin.
function supabaseForUser(token) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const { filePath, fileType, originalFilename, fileSizeBytes, note } = req.body;
  if (!filePath || !fileType) {
    return res.status(400).json({ error: 'Missing filePath or fileType' });
  }

  const supabase = supabaseForUser(token);

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  const user = userData.user;

  // Defense in depth: the storage RLS policy already restricts uploads to
  // the user's own folder, but we check it again here rather than trusting
  // the client's claimed path blindly.
  if (!filePath.startsWith(`${user.id}/`)) {
    return res.status(403).json({ error: 'File path does not belong to this user' });
  }

  // Re-download the file from storage (not from anything the client sent
  // in this request) and hash it here. This is the step that actually
  // matters: the hash reflects what the server can see is really stored,
  // not a value the browser reported about a file it might not even have
  // uploaded correctly.
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('evidence')
    .download(filePath);

  if (downloadError || !fileData) {
    return res.status(500).json({ error: 'Could not read uploaded file to verify it' });
  }

  const arrayBuffer = await fileData.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

  const { data: row, error: insertError } = await supabase
    .from('evidence_items')
    .insert({
      user_id: user.id,
      file_path: filePath,
      file_type: fileType,
      original_filename: originalFilename || null,
      file_size_bytes: fileSizeBytes || buffer.length,
      note: note || null,
      sha256_hash: sha256Hash,
    })
    .select()
    .single();

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  return res.status(200).json({ item: row });
}
