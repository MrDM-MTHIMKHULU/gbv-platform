import { createClient } from '@supabase/supabase-js';

const SHEET_CSV_URL = process.env.SHELTER_SHEET_CSV_URL;

export default async function handler(req, res) {
  try {
    const signupStats = await getSignupStats();
    const coverageStats = await getCoverageStats();

    return res.status(200).json({ signupStats, coverageStats });
  } catch (err) {
    console.error('Insights API error:', err);
    return res.status(500).json({ error: 'Could not load insights' });
  }
}

async function getSignupStats() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw error;

  const users = data.users || [];
  const byAgeGroup = {};
  const byProvince = {};
  const byLanguage = {};

  users.forEach((u) => {
    const meta = u.user_metadata || {};
    const age = meta.age_group || 'Not specified';
    const province = meta.province || 'Not specified';
    const lang = meta.preferred_language || 'en';

    byAgeGroup[age] = (byAgeGroup[age] || 0) + 1;
    byProvince[province] = (byProvince[province] || 0) + 1;
    byLanguage[lang] = (byLanguage[lang] || 0) + 1;
  });

  return {
    total: users.length,
    byAgeGroup,
    byProvince,
    byLanguage,
  };
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
