import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Layout from '../components/Layout';
import JennetChat from '../components/JennetChat';
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
                '--rose': '#f97316',
                '--rose-deep': '#c2410c',
                '--blush': '#ffedd5',
                '--teal': '#eab308',
                '--teal-light': '#fef9c3',
                '--warm': '#fed7aa',
                '--ink': '#7c2d12',
              }
            : undefined
        }
      >

      {isGirl && (
        <div className="mode-badge">
          <span>A space made just for you</span>
        </div>
      )}

      {isGirl ? (
        <section className="hero">
          <p className="eyebrow">Hey, you</p>
          <h1>
            Something feel off at home?
            <span> Let&apos;s figure it out together.</span>
          </h1>
          <p className="hero-desc">
            No judgment, no pressure. Just clear answers about what abuse
            can look like and people who&apos;ll actually listen.
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

      <section className="showcase">
        <div className="showcase-block">
          <div className="showcase-text">
            <p className="section-tag">Jennet AI Agent</p>
            <h2 className="section-title">
              Ask Jennet anything
              <br />
              <strong>about GBV.</strong>
            </h2>
            <p className="section-body">
              Jennet is an AI agent trained on gender-based violence in the
              South African context. She knows the law, she knows the
              resources, and she responds with empathy — no judgement, no
              pressure.
            </p>
            <Link href="/chat" className="btn-primary">
              Ask Jennet
            </Link>
          </div>
          <div className="showcase-visual">
            <JennetChat compact />
          </div>
        </div>

        <div className="showcase-block reverse">
          <div className="showcase-text">
            <p className="section-tag">Find Shelter</p>
            <h2 className="section-title">
              Shelters near you,
              <br />
              <strong>across South Africa.</strong>
            </h2>
            <p className="section-body">
              An interactive map of every verified shelter and safe house
              across all 9 provinces — with contact details you can trust.
            </p>
            <Link href="/map" className="btn-primary">
              Find shelter near me
            </Link>
          </div>
          <div className="showcase-visual">
            <div className="mini-map">
              <p className="mini-map-num">127+</p>
              <p className="mini-map-label">verified shelters &amp; services</p>
              <p className="mini-map-num small">9</p>
              <p className="mini-map-label">provinces covered</p>
            </div>
          </div>
        </div>

        <div className="showcase-block">
          <div className="showcase-text">
            <p className="section-tag">Data Intelligence</p>
            <h2 className="section-title">
              The data behind
              <br />
              <strong>the crisis.</strong>
            </h2>
            <p className="section-body">
              Verified figures on how GBV services are actually distributed
              across South Africa — and exactly where the gaps are, province
              by province.
            </p>
            <Link href="/insights" className="btn-primary">
              View the data
            </Link>
          </div>
          <div className="showcase-visual">
            <div className="mini-chart">
              <p className="mini-chart-title">Verified services by province</p>
              <div className="mini-bar-row">
                <span className="mini-bar-label">Western Cape</span>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="mini-bar-row">
                <span className="mini-bar-label">Gauteng</span>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: '84%' }} />
                </div>
              </div>
              <div className="mini-bar-row">
                <span className="mini-bar-label">KwaZulu-Natal</span>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: '68%' }} />
                </div>
              </div>
              <div className="mini-bar-row">
                <span className="mini-bar-label">Limpopo</span>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
          </div>
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
          <h2>Pick what you need right now</h2>
          <div className="resource-grid">
            <Link href="/about-abuse" className="resource-card resource-rose">
              <p className="resource-title">Wait, is this actually abuse?</p>
              <p className="resource-sub">Some things are sneaky. Let&apos;s check.</p>
            </Link>
            <Link href="/support" className="resource-card resource-teal">
              <p className="resource-title">Call Childline</p>
              <p className="resource-sub">Free, secret, and they get it &mdash; 116</p>
            </Link>
            <Link href="/chat" className="resource-card resource-plum">
              <p className="resource-title">Just ask, no pressure</p>
              <p className="resource-sub">Chat privately, no one else sees it</p>
            </Link>
            <Link href="/support" className="resource-card resource-rose">
              <p className="resource-title">Who can I actually tell?</p>
              <p className="resource-sub">We&apos;ll help you figure that out</p>
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
        .mode-badge {
          text-align: center;
          padding: 14px 0 0;
        }
        .mode-badge span {
          display: inline-block;
          background: var(--rose-deep);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
        }
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

        .showcase {
          max-width: 1080px;
          margin: 0 auto;
          padding: 90px 24px 40px;
          display: flex;
          flex-direction: column;
          gap: 90px;
        }
        .showcase-block {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
        }
        .showcase-block.reverse .showcase-text {
          order: 2;
        }
        .showcase-block.reverse .showcase-visual {
          order: 1;
        }
        .section-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .section-title {
          font-size: clamp(1.7rem, 3.4vw, 2.4rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--ink);
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .section-title strong {
          color: var(--rose-deep);
        }
        .section-body {
          font-size: 1rem;
          line-height: 1.65;
          color: var(--muted);
          margin-bottom: 28px;
          max-width: 440px;
        }
        .showcase-text :global(.btn-primary) {
          display: inline-block;
          background: var(--rose);
          color: white;
          padding: 14px 28px;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          border-radius: 8px;
        }

        .showcase-visual {
          display: flex;
          justify-content: center;
        }

        .mini-chart {
          background: var(--warm);
          border-radius: 16px;
          padding: 30px;
          width: 100%;
          max-width: 400px;
        }
        .mini-chart-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 20px;
        }
        .mini-bar-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .mini-bar-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--ink);
        }
        .mini-bar-track {
          background: var(--sand);
          border-radius: 6px;
          height: 10px;
          overflow: hidden;
        }
        .mini-bar-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 6px;
        }

        .mini-map {
          background: var(--teal-light);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        .mini-map-num {
          font-size: 2.6rem;
          font-weight: 800;
          color: var(--ink);
        }
        .mini-map-num.small {
          font-size: 2rem;
          margin-top: 20px;
        }
        .mini-map-label {
          font-size: 0.85rem;
          color: var(--muted);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .showcase-visual :global(.jennet-chat) {
          max-width: 400px;
          width: 100%;
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
          .showcase {
            gap: 60px;
          }
          .showcase-block,
          .showcase-block.reverse .showcase-text,
          .showcase-block.reverse .showcase-visual {
            grid-template-columns: 1fr;
            order: initial;
          }
          .showcase-block {
            display: flex;
            flex-direction: column;
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
