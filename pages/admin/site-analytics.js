import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function AdminSiteAnalyticsPage() {
  const [status, setStatus] = useState('loading'); // loading | unauthorized | ready | error
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data, error } = await supabase.rpc('get_admin_signup_stats');

    if (error) {
      const authError = error.message?.toLowerCase().includes('not authorized');
      setStatus(authError ? 'unauthorized' : 'error');
      return;
    }

    setStats(data);
    setStatus('ready');
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p>Loading…</p>
        </div>
      </Layout>
    );
  }

  if (status === 'unauthorized') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p className="msg-title">Not authorized</p>
          <p className="msg-sub">
            This page is only visible to admin accounts. If this should be
            you, ask whoever set up the project to add your account to the
            admin_users table.
          </p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
          }
          .msg-title {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--ink);
            margin-bottom: 10px;
          }
          .msg-sub {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.6;
          }
        `}</style>
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p className="msg-title">Couldn&apos;t load this data</p>
          <p className="msg-sub">Something went wrong fetching it.</p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
          }
          .msg-title {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--ink);
            margin-bottom: 10px;
          }
          .msg-sub {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.6;
          }
        `}</style>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Site Analytics | SafeHaven Admin</title>
      </Head>

      <section className="page-header">
        <p className="eyebrow">Admin only</p>
        <h1>Who SafeHaven is reaching</h1>
        <p className="sub">
          {stats.total} registered account{stats.total === 1 ? '' : 's'} so
          far. Aggregate counts only, no individual user is identifiable
          here.
        </p>
      </section>

      <section className="content">
        <div className="block">
          <h2>By age group</h2>
          <RatioBars data={relabelAgeGroups(stats.byAgeGroup)} />
        </div>

        <div className="block">
          <h2>By province</h2>
          <RatioBars data={stats.byProvince} variant="alt" />
        </div>

        <div className="block">
          <h2>By preferred language</h2>
          <RatioBars data={relabelLanguages(stats.byLanguage)} />
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px 20px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .page-header h1 {
          font-size: clamp(1.7rem, 3.6vw, 2.3rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .sub {
          font-size: 0.92rem;
          color: var(--muted);
          line-height: 1.6;
        }

        .content {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px 24px 100px;
        }
        .block {
          margin-bottom: 48px;
        }
        .block h2 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
        }
      `}</style>
    </Layout>
  );
}

// Self-contained: styled-jsx scopes styles per component, so this needs its
// own <style jsx> rather than relying on the parent page's styles, which
// was the bug last time (bars rendered as plain unstyled text).
function RatioBars({ data, variant = '' }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return <p className="empty">No data yet.</p>;
  }

  return (
    <div className="bars">
      {entries.map(([label, value]) => (
        <div className="bar-row" key={label}>
          <span className="bar-label">{label}</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${variant}`}
              style={{ width: `${(value / max) * 100}%` }}
            />
          </div>
          <span className="bar-value">{value}</span>
        </div>
      ))}
      <style jsx>{`
        .bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .bar-row {
          display: grid;
          grid-template-columns: 140px 1fr 36px;
          align-items: center;
          gap: 10px;
        }
        .bar-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--ink);
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
          background: var(--rose);
        }
        .bar-fill.alt {
          background: var(--teal);
        }
        .bar-value {
          font-size: 0.82rem;
          color: var(--muted);
          text-align: right;
        }
        .empty {
          font-size: 0.88rem;
          color: var(--muted);
        }
        @media (max-width: 600px) {
          .bar-row {
            grid-template-columns: 100px 1fr 30px;
          }
        }
      `}</style>
    </div>
  );
}

function relabelAgeGroups(obj) {
  const map = { under18: 'Under 18', '18plus': '18 and older' };
  const out = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    out[map[k] || k] = v;
  });
  return out;
}

function relabelLanguages(obj) {
  const map = { en: 'English', zu: 'isiZulu', xh: 'isiXhosa', af: 'Afrikaans', st: 'Sesotho' };
  const out = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
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
