import Head from 'next/head';
import Link from 'next/link';
import QuickExitButton from '../components/QuickExitButton';

export default function Home() {
  return (
    <>
      <Head>
        <title>SafeHaven — GBV Support Platform</title>
        <meta
          name="description"
          content="A free platform providing centralised GBV information, resources, and support for South African women and girls."
        />
      </Head>

      <QuickExitButton />

      {/* Emergency bar */}
      <div className="e-bar">
        <span>In immediate danger?</span>
        <a href="tel:10111">SAPS 10111</a>
        <span className="e-divider">·</span>
        <a href="tel:0800428428">GBV Command Centre 0800 428 428</a>
      </div>

      {/* Nav */}
      <nav>
        <div className="logo">SafeHaven</div>
        <ul className="nav-links">
          <li><Link href="/map">Find help</Link></li>
          <li><Link href="/rights">Your rights</Link></li>
          <li><Link href="/support">Support</Link></li>
          <li>
            <select aria-label="Choose language" className="lang-select">
              <option>English</option>
              <option>isiZulu</option>
              <option>isiXhosa</option>
              <option>Afrikaans</option>
              <option>Sesotho</option>
            </select>
          </li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">Free · Confidential · Available in 5 languages</p>
        <h1>
          Support for women and girls,
          <span> when you need it most.</span>
        </h1>
        <p className="hero-desc">
          SafeHaven brings shelters, legal guidance, and someone to talk to into
          one place — built for South Africa, in the languages you speak.
        </p>
        <div className="hero-actions">
          <Link href="/map" className="btn-primary">Find help near me</Link>
          <Link href="/rights" className="btn-secondary">Know your rights</Link>
        </div>
      </section>

      {/* Impact stats */}
      <section className="stats">
        <div className="stat">
          <p className="stat-num">127+</p>
          <p className="stat-label">Verified shelters &amp; services listed</p>
        </div>
        <div className="stat">
          <p className="stat-num">9</p>
          <p className="stat-label">Provinces covered</p>
        </div>
        <div className="stat">
          <p className="stat-num">5</p>
          <p className="stat-label">South African languages</p>
        </div>
        <div className="stat">
          <p className="stat-num">24/7</p>
          <p className="stat-label">Emergency numbers, always visible</p>
        </div>
      </section>

      {/* How it works */}
      <section className="how">
        <h2>How SafeHaven helps</h2>
        <div className="how-grid">
          <div className="how-step">
            <p className="how-num">01</p>
            <p className="how-title">Find services near you</p>
            <p className="how-text">
              Search shelters, clinics, and legal aid offices by province and
              see exactly what each one offers before you go.
            </p>
          </div>
          <div className="how-step">
            <p className="how-num">02</p>
            <p className="how-title">Understand your options</p>
            <p className="how-text">
              Plain-language guides explain protection orders, reporting
              abuse, and what South African law allows you to do.
            </p>
          </div>
          <div className="how-step">
            <p className="how-num">03</p>
            <p className="how-title">Get support, safely</p>
            <p className="how-text">
              Everything on this site can be closed instantly with Quick
              Exit, and nothing here is stored or tracked.
            </p>
          </div>
        </div>
      </section>

      {/* Resource preview */}
      <section className="resources">
        <h2>Where to start</h2>
        <div className="resource-grid">
          <Link href="/about-abuse" className="resource-card resource-rose">
            <p className="resource-title">Is this abuse?</p>
            <p className="resource-sub">Recognise the signs of different forms of abuse</p>
          </Link>
          <Link href="/map" className="resource-card resource-teal">
            <p className="resource-title">Shelters near me</p>
            <p className="resource-sub">An interactive map of verified services by province</p>
          </Link>
          <Link href="/rights" className="resource-card resource-plum">
            <p className="resource-title">Protection orders</p>
            <p className="resource-sub">A step-by-step guide to applying, free of charge</p>
          </Link>
          <Link href="/support" className="resource-card resource-rose">
            <p className="resource-title">Talk to someone</p>
            <p className="resource-sub">Hotlines and counselling services, any time of day</p>
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="cta">
        <h2>You don&apos;t have to figure this out alone.</h2>
        <p>Everything on SafeHaven is free, confidential, and built to work even on a slow connection.</p>
        <Link href="/map" className="btn-primary">Start here</Link>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-logo">SafeHaven</p>
            <p className="footer-tagline">
              Centralised GBV information and support, built for South
              African women and girls.
            </p>
          </div>
          <div className="footer-col">
            <p className="footer-heading">Support</p>
            <Link href="/map">Find a shelter</Link>
            <Link href="/rights">Your legal rights</Link>
            <Link href="/support">Talk to someone</Link>
          </div>
          <div className="footer-col">
            <p className="footer-heading">Platform</p>
            <Link href="/about-abuse">About abuse</Link>
            <Link href="/">Languages</Link>
            <Link href="/">About SafeHaven</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>SafeHaven · Built for South African women and girls</span>
          <span className="footer-emergency">GBV Command Centre: 0800 428 428</span>
        </div>
      </footer>

      <style jsx>{`
        .e-bar {
          background: var(--ink);
          color: var(--cream);
          text-align: center;
          padding: 10px 20px;
          font-size: 0.82rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .e-bar :global(a) {
          color: var(--blush);
          font-weight: 700;
          text-decoration: none;
        }
        .e-divider {
          opacity: 0.4;
        }

        nav {
          background: var(--white);
          padding: 0 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--sand);
        }
        .logo {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--rose-deep);
          letter-spacing: -0.02em;
        }
        .nav-links {
          display: flex;
          gap: 28px;
          list-style: none;
          align-items: center;
        }
        .nav-links :global(a) {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .lang-select {
          background: var(--blush);
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          color: var(--rose-deep);
          font-weight: 600;
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

        footer {
          background: var(--ink);
          padding: 60px 6% 24px;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
          max-width: 1000px;
          margin: 0 auto 40px;
        }
        .footer-logo {
          font-size: 1.2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 10px;
        }
        .footer-tagline {
          font-size: 0.88rem;
          color: var(--sand);
          line-height: 1.6;
          max-width: 300px;
        }
        .footer-heading {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--rose);
          margin-bottom: 14px;
        }
        .footer-col :global(a) {
          display: block;
          color: var(--sand);
          text-decoration: none;
          font-size: 0.88rem;
          margin-bottom: 10px;
        }
        .footer-bottom {
          max-width: 1000px;
          margin: 0 auto;
          border-top: 1px solid #33283c;
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--sand);
        }
        .footer-emergency {
          color: var(--rose);
          font-weight: 700;
        }

        @media (max-width: 860px) {
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .how-grid,
          .resource-grid {
            grid-template-columns: 1fr;
          }
          .footer-top {
            grid-template-columns: 1fr;
          }
          .nav-links {
            gap: 14px;
          }
        }
      `}</style>
    </>
  );
}
