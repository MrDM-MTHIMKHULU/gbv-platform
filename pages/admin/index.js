import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function AdminHubPage() {
  const [status, setStatus] = useState('loading'); // loading | unauthorized | ready

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setStatus('unauthorized');
        return;
      }
      const { data: adminResult } = await supabase.rpc('is_admin');
      setStatus(adminResult ? 'ready' : 'unauthorized');
    });
  }, []);

  if (status === 'loading') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p>Loading…</p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
            color: var(--muted);
          }
        `}</style>
      </Layout>
    );
  }

  if (status === 'unauthorized') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p className="msg-title">Not authorized</p>
          <p className="msg-sub">This area is only visible to admin accounts.</p>
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
        <title>Admin | SafeHaven</title>
      </Head>

      <section className="page-header">
        <p className="eyebrow">Admin</p>
        <h1>Admin tools</h1>
        <p className="sub">Everything only you and other admins can see.</p>
      </section>

      <section className="content">
        <Link href="/admin/analytics" className="admin-card">
          <p className="admin-card-title">Learning Analytics</p>
          <p className="admin-card-desc">
            Aggregated engagement across all learners: course completions,
            most-engaged topics, quiz pass rates, certificates issued.
          </p>
        </Link>

        <Link href="/admin/shelters" className="admin-card">
          <p className="admin-card-title">Manage Shelters &amp; Hotspots</p>
          <p className="admin-card-desc">
            Add, edit, or remove the shelters and hotspot areas shown on the
            Find Help map.
          </p>
        </Link>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px 30px;
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
        }

        .content {
          max-width: 640px;
          margin: 0 auto;
          padding: 20px 24px 100px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .admin-card {
          display: block;
          background: var(--blush);
          border-radius: 14px;
          padding: 26px;
          text-decoration: none;
        }
        .admin-card-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .admin-card-desc {
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.6;
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
