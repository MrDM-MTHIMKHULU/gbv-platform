export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contactEmail, senderName, mapLink } = req.body;

  if (!contactEmail) {
    return res.status(400).json({ error: 'Missing contact email' });
  }

  const name = senderName?.trim() || 'Someone using SafeHaven';

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
        from: 'SafeHaven Alerts <alerts@resend.dev>',
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

    return res.status(200).json({ sent: true });
  } catch (err) {
    console.error('Send alert error:', err);
    return res.status(500).json({ error: 'Could not send alert' });
  }
}
