import Link from 'next/link';
import QuickExitButton from './QuickExitButton';

export default function Layout({ children }) {
  return (
    <>
      <QuickExitButton />

      <div className="e-bar">
        <span>In immediate danger?</span>
        <a href="tel:10111">SAPS 10111</a>
        <span className="e-divider">·</span>
        <a href="tel:0800428428">GBV Command Centre 0800 428 428</a>
      </div>

      <nav>
        <Link href="/" className="logo">SafeHaven</Link>
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

      <main>{children}</main>

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
        nav :global(.logo) {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--rose-deep);
          letter-spacing: -0.02em;
          text-decoration: none;
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
