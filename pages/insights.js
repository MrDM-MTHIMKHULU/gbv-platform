import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import {
  LAST_UPDATED,
  UNDERREPORTING_NOTE,
  NATIONAL_HEADLINES,
  PROVINCES,
  TREND_FLAGS,
  CURRENT_HOTSPOTS,
} from '../lib/gbvData';

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [hotspotTab, setHotspotTab] = useState('Sexual Offences');

  useEffect(() => {
    fetch('/api/insights')
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError('Could not load insights'));
  }, []);

  const provincesByRapeRate = [...PROVINCES].sort((a, b) => b.rape.rate - a.rape.rate);

  return (
    <Layout>
      <Head>
        <title>Data Insights | SafeHaven</title>
        <meta
          name="description"
          content="Verified SAPS and HSRC data on GBV in South Africa, and how GBV services are distributed across provinces."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Data intelligence</p>
        <h1>The data behind the crisis</h1>
        <p className="sub">
          Verified figures from SAPS and HSRC on where GBV is reported most —
          and how that compares to where help is actually available.
        </p>
      </section>

      <section className="disclaimer">
        <p>{UNDERREPORTING_NOTE}</p>
      </section>

      <section className="content">
        <div className="block">
          <h2>National headline figures</h2>
          <div className="headline-grid">
            {NATIONAL_HEADLINES.map((h) => (
              <div className="headline-card" key={h.label}>
                <p className="headline-value">{h.value}</p>
                <p className="headline-label">{h.label}</p>
                {h.note && <p className="headline-note">{h.note}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="block">
          <h2>Reported cases by province</h2>
          <p className="block-sub">
            SAPS Q3 2024/25 (Oct–Dec 2024) — sorted by rape rate per 100,000
            people, the clearest per-capita comparison across provinces of
            very different sizes.
          </p>
          <div className="province-table">
            <div className="province-row province-head">
              <span>Province</span>
              <span>Rape rate /100k</span>
              <span>Sexual offences</span>
              <span>Murder rate /100k</span>
            </div>
            {provincesByRapeRate.map((p) => (
              <div className="province-row" key={p.name}>
                <span className="province-name">{p.name}</span>
                <span>{p.rape.rate}</span>
                <span>
                  {p.sexualOffences.cases.toLocaleString()}
                  {typeof p.sexualOffences.change === 'number' && (
                    <ChangeBadge value={p.sexualOffences.change} />
                  )}
                </span>
                <span>{p.murder.rate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="block">
          <h2>What the trends show</h2>
          <div className="flag-list">
            {TREND_FLAGS.map((f) => (
              <div className="flag-card" key={f.tag}>
                <p className="flag-tag">{f.tag}</p>
                <p className="flag-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="block">
          <h2>Where the gap is widest</h2>
          {data && !data.coverageStats.unavailable ? (
            <ResourceGap coverage={data.coverageStats.byProvince} />
          ) : (
            <p className="empty-note">
              Shelter data isn&apos;t connected yet — once your service sheet
              is linked, this section will pair real service counts against
              reported cases per province to show exactly where the gap is
              widest.
            </p>
          )}
        </div>

        <div className="block">
          <h2>Known hotspot stations</h2>
          <p className="block-sub">
            SAPS&apos;s own Top 30 station rankings by case volume, Q3 2024/25
            — the best available live proxy for hotspot status. This overlaps
            substantially with the officially designated 2020 GBVF hotspot
            list.
          </p>
          <div className="tab-row">
            {Object.keys(CURRENT_HOTSPOTS).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${hotspotTab === tab ? 'active' : ''}`}
                onClick={() => setHotspotTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="hotspot-list">
            {CURRENT_HOTSPOTS[hotspotTab].map((h, i) => (
              <div className="hotspot-row" key={h.station}>
                <span className="hotspot-rank">{i + 1}</span>
                <span className="hotspot-station">{h.station}</span>
                <span className="hotspot-province">{h.province}</span>
                {typeof h.cases === 'number' && (
                  <span className="hotspot-cases">
                    {h.cases} cases
                    {typeof h.change === 'number' && <ChangeBadge value={h.change} />}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {data && (
          <div className="block">
            <h2>Who SafeHaven is reaching</h2>
            <p className="block-sub">
              {data.signupStats.total} registered accounts so far.
            </p>

            <p className="sub-heading">By age group</p>
            <BarList
              data={relabelAgeGroups(data.signupStats.byAgeGroup)}
              color="var(--rose-deep)"
            />

            <p className="sub-heading">By province</p>
            <BarList data={data.signupStats.byProvince} color="var(--rose)" />

            <p className="sub-heading">By preferred language</p>
            <BarList
              data={relabelLanguages(data.signupStats.byLanguage)}
              color="var(--teal)"
            />
          </div>
        )}

        <div className="block sources">
          <p>
            Sources: SAPS Quarterly Crime Statistics (Q3 2024/25, Q3 2025/26,
            Q4 2025/26), SAPS Annual Crime Report, Stats SA GPSJS 2024/25, and
            the HSRC First South African National GBV Study. Last updated{' '}
            {LAST_UPDATED}.
          </p>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 30px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 18px;
        }
        .page-header h1 {
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
          letter-spacing: -0.02em;
        }
        .sub {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 500px;
          margin: 0 auto;
        }

        .disclaimer {
          max-width: 700px;
          margin: 0 auto 20px;
          padding: 0 24px;
        }
        .disclaimer p {
          background: var(--warm);
          border-left: 3px solid var(--rose);
          border-radius: 8px;
          padding: 14px 18px;
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--ink);
        }

        .msg-box {
          max-width: 500px;
          margin: 0 auto;
          padding: 40px 24px;
          text-align: center;
          color: var(--muted);
        }

        .content {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px 24px 100px;
        }
        .block {
          margin-bottom: 56px;
        }
        .block h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 10px;
        }
        .block-sub {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .sub-heading {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--ink);
          margin: 24px 0 10px;
        }
        .empty-note {
          font-size: 0.9rem;
          color: var(--muted);
          background: var(--warm);
          border-radius: 10px;
          padding: 18px 20px;
        }

        .headline-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .headline-card {
          background: var(--blush);
          border-radius: 12px;
          padding: 20px;
        }
        .headline-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--rose-deep);
          margin-bottom: 6px;
        }
        .headline-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.4;
        }
        .headline-note {
          font-size: 0.78rem;
          color: var(--muted);
          margin-top: 6px;
          line-height: 1.5;
        }

        .province-table {
          display: flex;
          flex-direction: column;
        }
        .province-row {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.3fr 1fr;
          gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid var(--sand);
          font-size: 0.82rem;
          align-items: center;
        }
        .province-head {
          font-weight: 700;
          color: var(--muted);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .province-name {
          font-weight: 700;
          color: var(--ink);
        }

        .flag-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .flag-card {
          background: var(--teal-light);
          border-radius: 10px;
          padding: 16px 18px;
        }
        .flag-tag {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .flag-text {
          font-size: 0.85rem;
          color: var(--ink);
          line-height: 1.55;
        }

        .tab-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .tab-btn {
          background: var(--warm);
          border: none;
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
        }
        .tab-btn.active {
          background: var(--rose);
          color: white;
        }
        .hotspot-list {
          display: flex;
          flex-direction: column;
        }
        .hotspot-row {
          display: grid;
          grid-template-columns: 24px 1.4fr 1fr 1.2fr;
          gap: 8px;
          padding: 10px 0;
          border-bottom: 1px solid var(--sand);
          font-size: 0.85rem;
          align-items: center;
        }
        .hotspot-rank {
          color: var(--rose);
          font-weight: 800;
        }
        .hotspot-station {
          font-weight: 700;
          color: var(--ink);
        }
        .hotspot-province {
          color: var(--muted);
        }
        .hotspot-cases {
          color: var(--muted);
          text-align: right;
        }

        .sources p {
          font-size: 0.78rem;
          color: var(--muted);
          line-height: 1.6;
          border-top: 1px solid var(--sand);
          padding-top: 20px;
        }

        @media (max-width: 600px) {
          .headline-grid {
            grid-template-columns: 1fr;
          }
          .province-row,
          .hotspot-row {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </Layout>
  );
}

function ChangeBadge({ value }) {
  if (!value) return null;
  const up = value > 0;
  return (
    <span
      style={{
        marginLeft: 6,
        fontSize: '0.72rem',
        fontWeight: 700,
        color: up ? '#c2410c' : '#0e6e65',
      }}
    >
      {up ? '▲' : '▼'} {Math.abs(value)}%
    </span>
  );
}

function ResourceGap({ coverage }) {
  const rows = PROVINCES.map((p) => {
    const services = coverage[p.name] || 0;
    const gapIndex = services > 0 ? +(services / p.sexualOffences.cases).toFixed(4) : 0;
    return { name: p.name, cases: p.sexualOffences.cases, services, gapIndex };
  }).sort((a, b) => a.gapIndex - b.gapIndex);

  return (
    <div className="gap-list">
      {rows.map((r) => (
        <div className="gap-row" key={r.name}>
          <span className="gap-name">{r.name}</span>
          <span className="gap-detail">
            {r.cases.toLocaleString()} sexual offence cases · {r.services}{' '}
            verified service{r.services === 1 ? '' : 's'}
          </span>
          <span className="gap-index">
            {r.services > 0 ? r.gapIndex : 'no data'}
          </span>
        </div>
      ))}
      <style jsx>{`
        .gap-list {
          display: flex;
          flex-direction: column;
        }
        .gap-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 0;
          border-bottom: 1px solid var(--sand);
        }
        .gap-name {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.92rem;
        }
        .gap-detail {
          font-size: 0.8rem;
          color: var(--muted);
        }
        .gap-index {
          font-size: 0.75rem;
          color: var(--rose-deep);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function BarList({ data, color }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return <p className="empty">No data yet.</p>;
  }

  return (
    <div className="bar-list">
      {entries.map(([label, value]) => (
        <div className="bar-row" key={label}>
          <span className="bar-label">{label}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${(value / max) * 100}%`, background: color }}
            />
          </div>
          <span className="bar-value">{value}</span>
        </div>
      ))}
      <style jsx>{`
        .bar-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .bar-row {
          display: grid;
          grid-template-columns: 130px 1fr 30px;
          align-items: center;
          gap: 10px;
        }
        .bar-label {
          font-size: 0.82rem;
          color: var(--ink);
          font-weight: 600;
        }
        .bar-track {
          background: var(--sand);
          border-radius: 6px;
          height: 10px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 6px;
        }
        .bar-value {
          font-size: 0.8rem;
          color: var(--muted);
          text-align: right;
        }
        .empty {
          font-size: 0.85rem;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}

function relabelAgeGroups(obj) {
  const map = { under18: 'Under 18', '18plus': '18 and older' };
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    out[map[k] || k] = v;
  });
  return out;
}

function relabelLanguages(obj) {
  const map = { en: 'English', zu: 'isiZulu', xh: 'isiXhosa', af: 'Afrikaans', st: 'Sesotho' };
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    out[map[k] || k] = v;
  });
  return out;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
