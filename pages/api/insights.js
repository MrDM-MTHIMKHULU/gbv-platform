const SHEET_CSV_URL = process.env.SHELTER_SHEET_CSV_URL;

// This route is public and unauthenticated, on purpose, it only ever powers
// the public /insights page. Signup/user demographic data must NEVER be
// added back here; that lives behind get_admin_signup_stats() in
// pages/admin/analytics.js instead, which checks is_admin() server-side.
export default async function handler(req, res) {
  try {
    const coverageStats = await getCoverageStats();
    return res.status(200).json({ coverageStats });
  } catch (err) {
    console.error('Insights API error:', err);
    return res.status(500).json({ error: 'Could not load insights' });
  }
}

async function getCoverageStats() {
  if (!SHEET_CSV_URL) {
    return { total: 0, byProvince: {}, byType: {}, unavailable: true };
  }

  const response = await fetch(SHEET_CSV_URL);
  const csvText = await response.text();
  const rows = parseCsv(csvText);

  if (rows.length === 0) {
    return { total: 0, byProvince: {}, byType: {}, unavailable: true };
  }

  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const provinceIdx = headers.findIndex((h) => h.includes('province'));
  const typeIdx = headers.findIndex((h) => h.includes('type'));

  const byProvince = {};
  const byType = {};

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const province = row[provinceIdx]?.trim();
    const type = row[typeIdx]?.trim();

    if (province) byProvince[province] = (byProvince[province] || 0) + 1;
    if (type) byType[type] = (byType[type] || 0) + 1;
  }

  return {
    total: rows.length - 1,
    byProvince,
    byType,
  };
}

function parseCsv(text) {
  return text
    .trim()
    .split('\n')
    .map((line) => line.split(',').map((cell) => cell.replace(/^"|"$/g, '')));
}
