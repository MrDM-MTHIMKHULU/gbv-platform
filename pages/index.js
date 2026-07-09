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
        <a href="tel:10111">Call SAPS 10111</a>
        <a href="tel:0800428428">GBV Command Centre 0800 428 428</a>
      </div>

      {/* Nav */}
      <nav>
        <div className="logo">
          Safe<em>Haven</em>
        </div>
        <ul className="nav-links">
          <li>
            <Link href="/map">Find help</Link>
          </li>
          <li>
            <Link href="/rights">Your rights</Link>
          </li>
          <li>
            <Link href="/support">Support</Link>
          </li>
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
        <div className="hero-left">
          <div className="hero-tag">A safe place to start</div>
          <h1>
            You&apos;re not alone.
            <strong>Help is here.</strong>
          </h1>
          <p className="hero-desc">
            Free, confidential support for women and girls facing gender-based
            violence in South Africa — information, shelters, and legal guidance,
            in your language.
          </p>
          <div className="hero-actions">
            <Link href="/map" className="btn-primary">
              Find help near me
            </Link>
            <Link href="/rights" className="btn-ghost">
              Know your rights
            </Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-cards">
            <Link href="/about-abuse" className="hero-card">
              <p className="hero-card-title">Is this abuse?</p>
              <p className="hero-card-sub">Recognise the signs</p>
            </Link>
            <Link href="/map" className="hero-card">
              <p className="hero-card-title">Shelters near me</p>
              <p className="hero-card-sub">Search by province</p>
            </Link>
            <Link href="/rights" className="hero-card">
              <p className="hero-card-title">Protection orders</p>
              <p className="hero-card-sub">Understand the process</p>
            </Link>
            <Link href="/support" className="hero-card">
              <p className="hero-card-title">Talk to someone</p>
              <p className="hero-card-sub">Hotlines, any time</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-brand">
          Safe<em>Haven</em>
        </div>
        <p className="footer-note">
          This site does not track your visit. Use Quick Exit at any time.
        </p>
      </footer>

      <style jsx>{`
        .e-bar {
          background: var(--ink);
          color: var(--cream);
          text-align: center;
          padding: 11px 20px;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .e-bar a {
          color: var(--blush);
          font-weight: 700;
          text-decoration: none;
          border-bottom: 1px solid var(--blush);
        }

        nav {
          background: rgba(250, 246, 244, 0.95);
          padding: 0 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--sand);
        }
        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--rose);
        }
        .logo em {
          font-style: italic;
          color: var(--ink);
          font-weight: 300;
        }
        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
          align-items: center;
        }
        .nav-links :global(a) {
          text-decoration: none;
          color: var(--muted);
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .lang-select {
          background: var(--warm);
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--rose);
          font-weight: 600;
        }

        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 88vh;
        }
        .hero-left {
          background: var(--ink);
          padding: 80px 7% 80px 8%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .hero-tag {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--rose-soft);
          margin-bottom: 24px;
        }
        .hero-left :global(h1) {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 5vw, 4.5rem);
          font-weight: 300;
          line-height: 1.08;
          color: var(--white);
          margin-bottom: 28px;
        }
        .hero-left :global(strong) {
          font-weight: 700;
          color: var(--rose-soft);
          display: block;
        }
        .hero-desc {
          color: var(--fog);
          font-size: 1.02rem;
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 44px;
          font-weight: 300;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hero-actions :global(.btn-primary) {
          background: var(--rose);
          color: white;
          padding: 15px 30px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 4px;
        }
        .hero-actions :global(.btn-ghost) {
          background: transparent;
          color: var(--cream);
          border: 1px solid rgba(250, 246, 244, 0.25);
          padding: 15px 30px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 4px;
        }

        .hero-right {
          background: var(--warm);
          display: flex;
          align-items: center;
          padding: 40px;
        }
        .hero-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
        }
        .hero-cards :global(.hero-card) {
          background: var(--white);
          border: 1px solid var(--sand);
          border-radius: 10px;
          padding: 26px 20px;
          text-decoration: none;
          display: block;
        }
        .hero-cards :global(.hero-card-title) {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .hero-cards :global(.hero-card-sub) {
          font-size: 0.85rem;
          color: var(--muted);
        }

        footer {
          background: var(--ink);
          padding: 40px 6%;
          text-align: center;
        }
        .footer-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: var(--rose-soft);
          margin-bottom: 8px;
        }
        .footer-brand em {
          font-style: italic;
          color: var(--cream);
          font-weight: 300;
        }
        .footer-note {
          font-size: 0.78rem;
          color: var(--fog);
        }

        @media (max-width: 860px) {
          .hero {
            grid-template-columns: 1fr;
          }
          .nav-links {
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}
