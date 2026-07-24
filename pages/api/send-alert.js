import { createClient } from '@supabase/supabase-js';

// Best-effort in-memory cooldown. This resets whenever the serverless
// function cold-starts, so it is not a bulletproof rate limit across all
// instances, but it stops the obvious abuse case (the same warm instance
// being hit repeatedly) without needing a new database table. If this
// endpoint ever needs a hard guarantee, move this to a Supabase table
// keyed by user id instead.
const lastSentAt = new Map();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const userId = userData.user.id;

  const lastSent = lastSentAt.get(userId);
  if (lastSent && Date.now() - lastSent < COOLDOWN_MS) {
    return res.status(429).json({ error: 'Too many alerts, please wait before sending another' });
  }

  const { contactEmail, senderName, mapLink } = req.body;

  if (!contactEmail) {
    return res.status(400).json({ error: 'Missing contact email' });
  }

  const name = senderName?.trim() || 'Someone using the platform';

  const bodyText = mapLink
    ? `${name} needs help. This isn't a test.\n\nTheir location: ${mapLink}`
    : `${name} needs help. This isn't a test.\n\nLocation could not be determined. Please try calling them.`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        // IMPORTANT: alerts@resend.dev is Resend's shared TESTING address.
        // On an unverified account it can only send to the account owner's
        // own verified signup email, nobody else. To actually deliver to a
        // real trusted contact, verify a domain you control at
        // resend.com/domains, then change this to an address on that
        // domain, e.g. 'alerts@yourdomain.org'.
        from: 'Emergency Alert <alerts@resend.dev>',
        to: [contactEmail],
        subject: `URGENT: ${name} needs help`,
        text: bodyText,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Resend error:', errText);
      return res.status(500).json({ error: 'Could not send alert' });
    }

    lastSentAt.set(userId, Date.now());
    return res.status(200).json({ sent: true });
  } catch (err) {
    console.error('Send alert error:', err);
    return res.status(500).json({ error: 'Could not send alert' });
  }
}
