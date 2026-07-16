// Compiled from SAPS Quarterly Crime Statistics (Q3 2024/25, Q3 2025/26, Q4
// 2025/26), SAPS Annual Crime Report, Stats SA GPSJS 2024/25, and the HSRC
// First South African National GBV Study. Last updated July 2026.
// SAPS figures are administrative case counts reported to police, not
// prevalence, pair with the underreporting note wherever these are shown.

export const LAST_UPDATED = 'July 2026';

export const UNDERREPORTING_NOTE =
  "SAPS figures below are cases reported to police, not how often GBV actually happens. South Africa's rape reporting rate is estimated at roughly 5%, so these numbers represent a small, non-random fraction of real incidence.";

export const NATIONAL_HEADLINES = [
  {
    value: '5,578',
    label: 'women killed (femicide), FY2023/24',
    note: '+33.8% year-on-year, roughly 5x the global femicide rate.',
  },
  {
    value: '42,569',
    label: 'rape cases reported to SAPS, FY2023/24',
  },
  {
    value: '~95%',
    label: 'of rapes are estimated to go unreported to police',
  },
  {
    value: '33.1%',
    label: 'of women 18+ have experienced physical violence in their lifetime',
    note: '≈7.31 million women, HSRC, published December 2024.',
  },
];

// Q3 2024/25 (Oct–Dec 2024), the most detailed public province-level SAPS
// release. Rates are per 100,000 population. "share" is % of national total.
export const PROVINCES = [
  {
    name: 'Eastern Cape',
    sexualOffences: { cases: 2341, share: 15.6, change: -7.0 },
    rape: { cases: 1905, share: 16.1, rate: 28.7 },
    sexualAssault: { cases: 256, share: 11.7 },
    murder: { cases: 1300, share: 18.7, rate: 19.6 },
  },
  {
    name: 'Free State',
    sexualOffences: { cases: 1073, share: 7.2, change: 0 },
    rape: { cases: 844, share: 7.2, rate: 28.4 },
    sexualAssault: { cases: 141, share: 6.4 },
    murder: { cases: 263, share: 3.8, rate: 8.9 },
  },
  {
    name: 'Gauteng',
    sexualOffences: { cases: 2955, share: 19.7, change: -3.6 },
    rape: { cases: 2300, share: 19.5, rate: 13.6 },
    sexualAssault: { cases: 517, share: 23.6 },
    murder: { cases: 1741, share: 25.0, rate: 10.3 },
  },
  {
    name: 'KwaZulu-Natal',
    sexualOffences: { cases: 2818, share: 18.8, change: 7.4 },
    rape: { cases: 2283, share: 19.3, rate: 19.2 },
    sexualAssault: { cases: 396, share: 18.1, change: 12.8 },
    murder: { cases: 1493, share: 21.5, rate: 12.6 },
  },
  {
    name: 'Limpopo',
    sexualOffences: { cases: 1355, share: 9.0, change: 0 },
    rape: { cases: 1138, share: 9.6, rate: 18.8 },
    sexualAssault: { cases: 125, share: 5.7 },
    murder: { cases: 203, share: 2.9, rate: 3.4 },
  },
  {
    name: 'Mpumalanga',
    sexualOffences: { cases: 941, share: 6.3, change: 1.6 },
    rape: { cases: 784, share: 6.6, rate: 15.8 },
    sexualAssault: { cases: 115, share: 5.3 },
    murder: { cases: 350, share: 5.0, rate: 7.1 },
  },
  {
    name: 'North West',
    sexualOffences: { cases: 1086, share: 7.3, change: -11.6 },
    rape: { cases: 875, share: 7.4, rate: 20.3 },
    sexualAssault: { cases: 128, share: 5.9 },
    murder: { cases: 296, share: 4.3, rate: 6.9 },
  },
  {
    name: 'Northern Cape',
    sexualOffences: { cases: 447, share: 3.0, change: 0 },
    rape: { cases: 321, share: 2.7, rate: 23.8 },
    sexualAssault: { cases: 74, share: 3.4, change: -1 },
    murder: { cases: 109, share: 1.6, rate: 8.1 },
  },
  {
    name: 'Western Cape',
    sexualOffences: { cases: 1957, share: 13.1, change: -4.6 },
    rape: { cases: 1353, share: 11.5, rate: 18.0 },
    sexualAssault: { cases: 436, share: 19.9 },
    murder: { cases: 1198, share: 17.2, rate: 16.0 },
  },
];

export const TREND_FLAGS = [
  {
    tag: 'Rising trend',
    text: 'KwaZulu-Natal is the only major province with a rising sexual-offences trend Q3 2024/25 vs Q3 2023/24 (+7.4%), most others are flat or declining.',
  },
  {
    tag: 'Rate vs volume',
    text: 'Eastern Cape and Free State top the rape-rate-per-100k measure, not Gauteng, despite Gauteng having the highest raw case volume.',
  },
  {
    tag: 'Sharpest decline',
    text: 'North West saw the sharpest provincial decline in sexual offences of any province (-11.6%) in the same comparison.',
  },
  {
    tag: 'Service failure',
    text: "Western Cape reported the highest national numbers of rapes recorded in police holding cells/deportation centres and in graveyards (Q4 2025/26), coinciding with rape-kit shortages at some stations, including the Nyanga FCS unit.",
  },
];

// Officially designated 22 September 2020 by the Inter-Ministerial Committee
// on GBVF, based on FY2019/20 data. Last confirmed still in effect: May 2022
// (parliamentary briefing), no public update identified since. Treat as a
// standing 2020-era designation, not a live ranking.
export const HOTSPOTS_2020 = {
  Gauteng: ['Mamelodi', 'Tembisa', 'Temba', 'Alexandra', 'Moroka', 'Dobsonville', 'Diepsloot', 'Honeydew', 'Orange Farm'],
  'KwaZulu-Natal': ['Umlazi', 'Empangeni', 'Inanda', 'Plessislaer', 'Osizweni', 'KwaMashu', 'Ntuzuma'],
  'Western Cape': ['Delft', 'Nyanga', 'Khayelitsha', 'Mfuleni', 'Mitchells Plain', 'Kraaifontein', 'Gugulethu', 'Bellville'],
  'Eastern Cape': ['Kwazakhele', 'Mthatha', 'Butterworth'],
  'Free State': ['Bloemspruit', 'Kopanong'],
  'North West': ['Ikageng'],
};

// SAPS's own Top 30 station rankings, Q3 2024/25 (Oct–Dec 2024), the best
// available live proxy for current hotspot status pending an updated
// official list. Overlaps substantially with the 2020 designated list.
export const CURRENT_HOTSPOTS = {
  'Sexual Offences': [
    { station: 'Inanda', province: 'KwaZulu-Natal', cases: 114, change: 56.2 },
    { station: 'Umlazi', province: 'KwaZulu-Natal', cases: 93 },
    { station: 'Lusikisiki', province: 'Eastern Cape', cases: 91 },
    { station: 'Thohoyandou', province: 'Limpopo', cases: 86 },
    { station: 'Bloemspruit', province: 'Free State', cases: 82 },
    { station: 'Mthatha', province: 'Eastern Cape', cases: 82 },
    { station: 'Ivory Park', province: 'Gauteng', cases: 76, change: 43.4 },
    { station: 'Delft', province: 'Western Cape', cases: 76 },
    { station: 'Plessislaer', province: 'KwaZulu-Natal', cases: 74 },
    { station: 'Roodepoort', province: 'Gauteng', cases: 71 },
  ],
  Rape: [
    { station: 'Inanda', province: 'KwaZulu-Natal', cases: 91, change: 44.4 },
    { station: 'Umlazi', province: 'KwaZulu-Natal', cases: 79 },
    { station: 'Lusikisiki', province: 'Eastern Cape', cases: 79 },
    { station: 'Mthatha', province: 'Eastern Cape', cases: 77 },
    { station: 'Thohoyandou', province: 'Limpopo', cases: 75 },
    { station: 'Bloemspruit', province: 'Free State', cases: 64 },
    { station: 'Plessislaer', province: 'KwaZulu-Natal', cases: 63 },
    { station: 'Ivory Park', province: 'Gauteng', cases: 61 },
    { station: 'Roodepoort', province: 'Gauteng', cases: 58 },
    { station: 'Mfuleni', province: 'Western Cape', cases: 55 },
  ],
  'Sexual Assault': [
    { station: 'Mitchells Plain', province: 'Western Cape' },
    { station: 'Delft', province: 'Western Cape' },
    { station: 'Inanda', province: 'KwaZulu-Natal' },
    { station: 'Kwadukuza', province: 'KwaZulu-Natal' },
    { station: 'Mountain Rise', province: 'KwaZulu-Natal' },
    { station: 'Phoenix', province: 'KwaZulu-Natal' },
    { station: 'Hillbrow', province: 'Gauteng' },
    { station: 'East London', province: 'Eastern Cape' },
    { station: 'Florida', province: 'Gauteng' },
    { station: 'Sunnyside', province: 'Gauteng' },
  ],
  'Contact Crime': [
    { station: 'Cape Town Central', province: 'Western Cape' },
    { station: 'Durban Central', province: 'KwaZulu-Natal' },
    { station: 'Mitchells Plain', province: 'Western Cape' },
    { station: 'Chatsworth', province: 'KwaZulu-Natal' },
    { station: 'Mfuleni', province: 'Western Cape' },
    { station: 'Roodepoort', province: 'Gauteng' },
    { station: 'Delft', province: 'Western Cape' },
    { station: 'Park Road (Mangaung)', province: 'Free State' },
    { station: 'JHB Central', province: 'Gauteng' },
    { station: 'Phoenix', province: 'KwaZulu-Natal' },
  ],
};

// Domestic-violence-linked cases by province, Q3 2024/25 (Oct–Dec 2024).
export const DV_LINKED_BY_PROVINCE = {
  'Eastern Cape': { murder: 54, attemptedMurder: 28, rape: 149, sexualAssault: 11, assaultGBH: 1271 },
  'Free State': { murder: 30, attemptedMurder: 82, rape: 117, sexualAssault: 7, assaultGBH: 828 },
  Gauteng: { murder: 40, attemptedMurder: 59, rape: 181, sexualAssault: 31, assaultGBH: 2178 },
  'KwaZulu-Natal': { murder: 88, attemptedMurder: 153, rape: 241, sexualAssault: 41, assaultGBH: 1664 },
  Limpopo: { murder: 19, attemptedMurder: 13, rape: 76, sexualAssault: 9, assaultGBH: 581 },
  Mpumalanga: { murder: 18, attemptedMurder: 13, rape: 44, sexualAssault: 5, assaultGBH: 524 },
  'North West': { murder: 17, attemptedMurder: 14, rape: 79, sexualAssault: 6, assaultGBH: 673 },
  'Northern Cape': { murder: 10, attemptedMurder: 37, rape: 21, sexualAssault: 5, assaultGBH: 205 },
  'Western Cape': { murder: 39, attemptedMurder: 58, rape: 172, sexualAssault: 48, assaultGBH: 1557 },
};

// National totals of the above, summed across all 9 provinces, a real,
// computable "case type" breakdown (not the same as SAPS's overall crime
// categories, specifically the subset flagged as domestic-violence-linked).
export const NATIONAL_CASE_TYPES = [
  { label: 'Assault (GBH)', value: 9481, pct: 82.5 },
  { label: 'Rape', value: 1080, pct: 9.4 },
  { label: 'Attempted murder', value: 457, pct: 4.0 },
  { label: 'Murder', value: 315, pct: 2.7 },
  { label: 'Sexual assault', value: 163, pct: 1.4 },
];
export const NATIONAL_CASE_TYPES_TOTAL = 11496;
export const NATIONAL_CASE_TYPES_NOTE =
  'Domestic-violence-linked cases only, summed across all 9 provinces, SAPS Q3 2024/25 (Oct–Dec 2024). This is a subset of total crime, not all reported GBV.';

export const CHRONIC_HOTSPOT_NOTES = [
  'KwaZulu-Natal: Inanda and Umlazi (eThekwini district) are the most consistent national leaders across both the official hotspot list and current case-volume rankings.',
  "Eastern Cape: Lusikisiki and Mthatha (OR Tambo district) rank highly for rape specifically despite the province's smaller population.",
  'Western Cape: Delft, Nyanga, Mfuleni, Mitchells Plain, Khayelitsha and Kraaifontein form a dense hotspot cluster within the City of Cape Town Metro.',
  'Gauteng: Ivory Park, Tembisa, Roodepoort, Alexandra and Diepsloot cluster around Johannesburg/Ekurhuleni/Tshwane, high volume, driven by population size.',
  'Free State: Bloemspruit (Mangaung) is a standout, a single station that consistently ranks in the national top 5–10 for sexual offences and rape.',
  "Limpopo: Thohoyandou (Vhembe district) is disproportionately prominent given the province's otherwise low crime rates.",
];
