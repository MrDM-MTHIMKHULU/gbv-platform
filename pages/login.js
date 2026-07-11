import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError('Incorrect email or password.');
      return;
    }

    router.push('/');
  };

  return (
    <Layout>
      <Head>
        <title>Log In | SafeHaven</title>
      </Head>

      <section className="auth-wrap">
        <div className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h1>Log in to SafeHaven</h1>

          <form onSubmit={handleLogin}>
            <label className="field-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="field-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="switch-auth">
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </p>
        </div>
      </section>

      <style jsx>{`
        .auth-wrap {
          max-width: 440px;
          margin: 0 auto;
          padding: 70px 24px 100px;
        }
        .auth-card {
          background: var(--warm);
          border-radius: 16px;
          padding: 36px 30px;
        }
        .eyebrow {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 10px;
        }
        .auth-card h1 {
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 24px;
        }
        .field-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
          margin-top: 18px;
        }
        input {
          width: 100%;
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 0.92rem;
          font-family: inherit;
        }
        .error {
          color: var(--rose-deep);
          font-size: 0.85rem;
          margin-top: 14px;
        }
        .submit-btn {
          width: 100%;
          background: var(--rose);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          margin-top: 24px;
          cursor: pointer;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .switch-auth {
          text-align: center;
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 20px;
        }
        .switch-auth :global(a) {
          color: var(--rose-deep);
          font-weight: 700;
          text-decoration: none;
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
