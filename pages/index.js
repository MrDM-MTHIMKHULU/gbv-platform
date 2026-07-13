import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const { t } = useTranslation('common');
  const [ageGroup, setAgeGroup] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAgeGroup(data.user?.user_metadata?.age_group ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAgeGroup(session?.user?.user_metadata?.age_group ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const isGirl = ageGroup === 'under18';

  return (
    <Layout>
      <Head>
        <title>SafeHaven — GBV Support Platform</title>
        <meta
          name="description"
          content="A free platform providing centralised GBV information, resources, and support for South African women and girls."
        />
      </Head>

      <div
        style={
          isGirl
            ? {
                '--rose': '#8b5cf6',
                '--rose-deep': '#6d28d9',
                '--blush': '#f3e8ff',
                '--teal': '#0891b2',
                '--teal-light': '#fef9c3',
                '--warm': '#ffedd5',
                '--ink': '#312e81',
              }
            : undefined
        }
      >

      {isGirl ? (
        <section className="hero">
          <p className="eyebrow">A safe, private space for you</p>
          <h1>
            Something doesn&apos;t feel right?
            <span> You deserve to feel safe.</span>
          </h1>
          <p className="hero-desc">
            Learn what abuse can look like, get support finding a trusted
            adult to talk to, and know that none of this is your fault.
          </p>
          <div className="hero-actions">
            <Link href="/about-abuse" className="btn-primary">Is this abuse?</Link>
            <Link href="/support" className="btn-secondary">Talk to someone</Link>
          </div>
        </section>
      ) : (
        <section className="hero">
          <p className="eyebrow">{t('hero_eyebrow')}</p>
          <h1>
            {t('hero_title_1')}
            <span> {t('hero_title_2')}</span>
          </h1>
          <p className="hero-desc">{t('hero_desc')}</p>
          <div className="hero-actions">
            <Link href="/map" className="btn-primary">{t('hero_btn_map')}</Link>
            <Link href="/rights" className="btn-secondary">{t('hero_btn_rights')}</Link>
          </div>
        </section>
      )}

      <section className="stats">
        <div className="stat">
          <p className="stat-num">127+</p>
          <p className="stat-label">{t('stat_shelters')}</p>
        </div>
        <div className="stat">
          <p className="stat-num">9</p>
          <p className="stat-label">{t('stat_provinces')}</p>
        </div>
        <div className="stat">
          <p className="stat-num">5</p>
          <p className="stat-label">{t('stat_languages')}</p>
        </div>
        <div className="stat">
          <p className="stat-num">24/7</p>
          <p className="stat-label">{t('stat_available')}</p>
        </div>
      </section>

      <section className="how">
        <h2>{t('how_title')}</h2>
        <div className="how-grid">
          <div className="how-step">
            <p className="how-num">01</p>
            <p className="how-title">{t('how_1_title')}</p>
            <p className="how-text">{t('how_1_text')}</p>
          </div>
          <div className="how-step">
            <p className="how-num">02</p>
            <p className="how-title">{t('how_2_title')}</p>
            <p className="how-text">{t('how_2_text')}</p>
          </div>
          <div className="how-step">
            <p className="how-num">03</p>
            <p className="how-title">{t('how_3_title')}</p>
            <p className="how-text">{t('how_3_text')}</p>
          </div>
        </div>
      </section>

      {isGirl ? (
        <section className="resources">
          <h2>Where to start</h2>
          <div className="resource-grid">
            <Link href="/about-abuse" className="resource-card resource-rose">
              <p className="resource-title">Is this abuse?</p>
              <p className="resource-sub">Learn to recognise the signs</p>
            </Link>
            <Link href="/support" className="resource-card resource-teal">
              <p className="resource-title">Talk to Childline</p>
              <p className="resource-sub">Free, confidential, and here for you — 116</p>
            </Link>
            <Link href="/chat" className="resource-card resource-plum">
              <p className="resource-title">Ask a question</p>
              <p className="resource-sub">Chat privately with our assistant</p>
            </Link>
            <Link href="/support" className="resource-card resource-rose">
              <p className="resource-title">Find a trusted adult</p>
              <p className="resource-sub">You don&apos;t have to handle this alone</p>
            </Link>
          </div>
        </section>
      ) : (
        <section className="resources">
          <h2>{t('resources_title')}</h2>
          <div className="resource-grid">
            <Link href="/about-abuse" className="resource-card resource-rose">
              <p className="resource-title">{t('resource_abuse_title')}</p>
              <p className="resource-sub">{t('resource_abuse_sub')}</p>
            </Link>
            <Link href="/map" className="resource-card resource-teal">
              <p className="resource-title">{t('resource_map_title')}</p>
              <p className="resource-sub">{t('resource_map_sub')}</p>
            </Link>
            <Link href="/rights" className="resource-card resource-plum">
              <p className="resource-title">{t('resource_rights_title')}</p>
              <p className="resource-sub">{t('resource_rights_sub')}</p>
            </Link>
            <Link href="/support" className="resource-card resource-rose">
              <p className="resource-title">{t('resource_support_title')}</p>
              <p className="resource-sub">{t('resource_support_sub')}</p>
            </Link>
          </div>
        </section>
      )}

      <section className="cta">
        <h2>{t('cta_title')}</h2>
        <p>{t('cta_desc')}</p>
        <Link href="/map" className="btn-primary">{t('cta_btn')}</Link>
      </section>

      </div>

      <style jsx>{`
        .hero {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: 90px 24px 60px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 20px;
        }
        .hero h1 {
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--ink);
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .hero h1 span {
          color: var(--rose-deep);
        }
        .hero-desc {
          font-size: 1.1rem;
          line-height: 1.65;
          color: var(--muted);
          max-width: 520px;
          margin: 0 auto 40px;
          font-weight: 400;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-actions :global(.btn-primary) {
          background: var(--rose);
          color: white;
          padding: 15px 30px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          border-radius: 8px;
        }
        .hero-actions :global(.btn-secondary) {
          background: var(--white);
          color: var(--ink);
          border: 1px solid var(--sand);
          padding: 15px 30px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          border-radius: 8px;
        }

        .stats {
          background: var(--ink);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 44px 6%;
          gap: 20px;
        }
        .stat {
          text-align: center;
          color: var(--cream);
        }
        .stat-num {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--rose);
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--sand);
          font-weight: 400;
        }

        .how {
          max-width: 1000px;
          margin: 0 auto;
          padding: 90px 24px 40px;
        }
        .how h2 {
          font-size: 1.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 48px;
          color: var(--ink);
        }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .how-num {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--rose);
          margin-bottom: 12px;
        }
        .how-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: var(--ink);
        }
        .how-text {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--muted);
        }

        .resources {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 24px 90px;
        }
        .resources h2 {
          font-size: 1.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 40px;
          color: var(--ink);
        }
        .resource-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        .resource-grid :global(.resource-card) {
          display: block;
          padding: 26px 20px;
          border-radius: 12px;
          text-decoration: none;
        }
        .resource-grid :global(.resource-rose) {
          background: var(--blush);
        }
        .resource-grid :global(.resource-teal) {
          background: var(--teal-light);
        }
        .resource-grid :global(.resource-plum) {
          background: var(--warm);
        }
        .resource-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .resource-sub {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.5;
        }

        .cta {
          background: var(--rose-deep);
          color: white;
          text-align: center;
          padding: 80px 24px;
        }
        .cta h2 {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 14px;
        }
        .cta p {
          font-size: 1rem;
          color: var(--blush);
          margin-bottom: 32px;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta :global(.btn-primary) {
          background: white;
          color: var(--rose-deep);
          padding: 15px 34px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          border-radius: 8px;
        }

        @media (max-width: 860px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .how-grid,
          .resource-grid {
            grid-template-columns: 1fr;
          }
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
