import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import crypto from 'crypto';

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

  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ error: 'Missing itemId' });
  }

  // Step 1: confirm this item really belongs to the requesting user, using
  // the user's own token so RLS enforces that on its own. We never accept
  // an itemId and just trust it belongs to whoever asked.
  const userClient = supabaseForUser(token);
  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  const user = userData.user;

  const { data: item, error: fetchError } = await userClient
    .from('evidence_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (fetchError || !item) {
    return res.status(404).json({ error: 'Evidence item not found' });
  }
  if (item.user_id !== user.id) {
    return res.status(403).json({ error: 'This item does not belong to you' });
  }

  // Step 2: re-download the file and recompute its hash right now.
  const { data: fileData, error: downloadError } = await userClient.storage
    .from('evidence')
    .download(item.file_path);

  if (downloadError || !fileData) {
    return res.status(500).json({ error: 'Could not read the stored file' });
  }

  const arrayBuffer = await fileData.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const currentHash = crypto.createHash('sha256').update(buffer).digest('hex');
  const matches = currentHash === item.sha256_hash;

  // Step 3: write the verification result using the ADMIN client, since
  // there is deliberately no update policy granting regular users write
  // access to this table at all. This is the one place that's allowed to
  // write last_verified_at / last_verified_match, and it only ever writes
  // a result it just computed itself, never something supplied by a request.
  const { error: updateError } = await supabaseAdmin
    .from('evidence_items')
    .update({
      last_verified_at: new Date().toISOString(),
      last_verified_match: matches,
    })
    .eq('id', itemId);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  return res.status(200).json({
    matches,
    checkedAt: new Date().toISOString(),
  });
}
