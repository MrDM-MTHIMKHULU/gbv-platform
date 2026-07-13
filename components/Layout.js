import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import QuickExitButton from './QuickExitButton';
import { supabase } from '../lib/supabaseClient';

export default function Layout({ children }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    router.events.on('routeChangeStart', closeMenu);
    return () => router.events.off('routeChangeStart', closeMenu);
  }, [router.events]);

  const changeLanguage = (e) => {
    const locale = e.target.value;
    router.push(router.pathname, router.asPath, { locale });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      <QuickExitButton label={t('quick_exit')} />

      <div className="e-bar">
        <span>{t('emergency_prompt')}</span>
        <a href="tel:10111">SAPS 10111</a>
        <span className="e-divider">·</span>
        <a href="tel:0800428428">{t('emergency_gbv')}</a>
      </div>

      <nav>
        <Link href="/" className="logo">SafeHaven</Link>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link href="/map">{t('nav_find_help')}</Link></li>
          <li><Link href="/rights">{t('nav_rights')}</Link></li>
          <li><Link href="/support">{t('nav_support')}</Link></li>
          <li><Link href="/chat">Chat</Link></li>
          {user ? (
            <>
              <li>
                <Link href="/profile" className="auth-link">Profile</Link>
              </li>
              <li>
                <button className="auth-btn" onClick={handleLogout}>Log out</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" className="auth-link">Log in</Link>
            </li>
          )}
          <li>
            <select
              aria-label="Choose language"
              className="lang-select"
              value={router.locale}
              onChange={changeLanguage}
            >
              <option value="en">English</option>
              <option value="zu">isiZulu</option>
            </select>
          </li>
        </ul>
      </nav>

      <main>{children}</main>

      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-logo">SafeHaven</p>
            <p className="footer-tagline">{t('footer_tagline')}</p>
          </div>
          <div className="footer-col">
            <p className="footer-heading">{t('footer_heading_support')}</p>
            <Link href="/map">{t('footer_find_shelter')}</Link>
            <Link href="/rights">{t('footer_legal_rights')}</Link>
            <Link href="/support">{t('footer_talk')}</Link>
          </div>
          <div className="footer-col">
            <p className="footer-heading">{t('footer_heading_platform')}</p>
            <Link href="/about-abuse">{t('footer_about_abuse')}</Link>
            <Link href="/">{t('footer_languages')}</Link>
            <Link href="/">{t('footer_about')}</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('footer_bottom')}</span>
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
          padding: 0 5%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid var(--sand);
        }
        nav :global(.logo) {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--rose-deep);
          letter-spacing: -0.02em;
          text-decoration: none;
          flex-shrink: 0;
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
        }
        .menu-toggle span {
          width: 22px;
          height: 2px;
          background: var(--ink);
          display: block;
        }

        .nav-links {
          display: flex;
          gap: 20px;
          list-style: none;
          align-items: center;
          flex-wrap: wrap;
        }
        .nav-links :global(a) {
          text-decoration: none;
          color: var(--muted);
          font-size: 0.88rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .auth-link {
          color: var(--rose-deep) !important;
        }
        .auth-btn {
          background: none;
          border: 1px solid var(--sand);
          border-radius: 6px;
          padding: 6px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          white-space: nowrap;
        }
        .lang-select {
          background: var(--blush);
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          color: var(--rose-deep);
          font-weight: 600;
        }

        @media (max-width: 860px) {
          nav {
            padding: 0 4%;
            padding-right: 90px;
          }
          .menu-toggle {
            display: flex;
          }
          .nav-links {
            display: none;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background: var(--white);
            border-bottom: 1px solid var(--sand);
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            padding: 16px 5% 20px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
          }
          .nav-links.open {
            display: flex;
          }
          .nav-links li {
            width: 100%;
          }
          .nav-links :global(a) {
            display: block;
            padding: 10px 0;
            font-size: 0.95rem;
            width: 100%;
          }
          .auth-btn,
          .lang-select {
            width: 100%;
            margin: 6px 0;
            text-align: left;
            padding: 10px 12px;
          }
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
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
}
