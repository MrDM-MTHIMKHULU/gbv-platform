import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

const TOOLS = [
  {
    href: '/admin/analytics',
    icon: '📊',
    title: 'Learning Analytics',
    desc: 'See course completions, top topics, quiz pass rates, and certificates issued across every learner.',
  },
  {
    href: '/admin/shelters',
    icon: '📍',
    title: 'Shelters & Hotspots',
    desc: 'Add, edit, or remove pins on the Find Help map.',
  },
  {
    href: '/admin/documents',
    icon: '📚',
    title: 'Guides & Ebooks',
    desc: 'Add, edit, or remove documents shown in the Library.',
  },
];

export default function AdminHubPage() {
  const [status, setStatus] = useState('loading');

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
        <h1>Run the platform</h1>
        <p className="sub">
          Tools only admin accounts can see or use.
        </p>
      </section>

      <section className="content">
        {TOOLS.map((tool) => (
          <Link href={tool.href} key={tool.href} className="tool-link">
            <div className="tool-card">
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-body">
                <p className="tool-title">{tool.title}</p>
                <p className="tool-desc">{tool.desc}</p>
              </div>
              <div className="tool-arrow">→</div>
            </div>
          </Link>
        ))}
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
          font-size: 0.95rem;
          color: var(--muted);
        }

        .content {
          max-width: 640px;
          margin: 0 auto;
          padding: 10px 24px 100px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        :global(.tool-link) {
          text-decoration: none;
          display: block;
        }

        .tool-card {
          display: flex;
          align-items: center;
          gap: 18px;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 14px;
          padding: 22px 24px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        :global(.tool-link:hover) .tool-card {
          border-color: var(--rose);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        .tool-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: var(--blush);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .tool-body {
          flex: 1;
        }
        .tool-title {
          font-size: 1rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 4px;
        }
        .tool-desc {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
        }
        .tool-arrow {
          font-size: 1.2rem;
          color: var(--rose);
          flex-shrink: 0;
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
