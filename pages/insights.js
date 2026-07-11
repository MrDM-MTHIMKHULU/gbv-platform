import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';

export default function InsightsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/insights')
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError('Could not load insights'));
  }, []);

  return (
    <Layout>
      <Head>
        <title>Data Insights | SafeHaven</title>
        <meta
          name="description"
          content="Analysis of service coverage and platform usage across South Africa."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Data insights</p>
        <h1>Where the gaps are</h1>
        <p className="sub">
          A look at how GBV services are distributed across South Africa,
          and who SafeHaven is currently reaching.
        </p>
      </section>

      {error && (
        <div className="msg-box">
          <p>{error}</p>
        </div>
      )}

      {!data && !error && (
        <div className="msg-box">
          <p>Loading insights…</p>
        </div>
      )}

      {data && (
        <section className="content">
          <div className="block">
            <h2>Service coverage by province</h2>
            {data.coverageStats.unavailable ? (
              <p className="empty-note">
                Shelter data isn&apos;t connected yet — publish your Google
                Sheet as CSV and add the URL to see this chart.
              </p>
            ) : (
              <>
                <p className="block-sub">
                  {data.coverageStats.total} verified services mapped across
                  South Africa. The imbalance below is exactly the kind of
                  information gap this platform exists to help close.
                </p>
                <BarList
                  data={data.coverageStats.byProvince}
                  color="var(--rose)"
                />
              </>
            )}
          </div>

          <div className="block">
            <h2>Service types available</h2>
            {!data.coverageStats.unavailable && (
              <BarList data={data.coverageStats.byType} color="var(--teal)" />
            )}
          </div>

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
        </section>
      )}

      <style jsx>{`
        .page-header {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 40px;
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
      `}</style>
    </Layout>
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
