import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

const PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zu', label: 'isiZulu' },
  { value: 'xh', label: 'isiXhosa' },
  { value: 'af', label: 'Afrikaans' },
  { value: 'st', label: 'Sesotho' },
];

export default function SignupPage() {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState('');
  const [fullName, setFullName] = useState('');
  const [province, setProvince] = useState('');
  const [language, setLanguage] = useState('en');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!ageGroup) {
      setError('Please select an age group.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          age_group: ageGroup,
          full_name: fullName,
          province,
          preferred_language: language,
          phone,
        },
      },
    });
    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    router.push('/');
  };

  return (
    <Layout>
      <Head>
        <title>Create an Account | SafeHaven</title>
      </Head>

      <section className="auth-wrap">
        <div className="auth-card">
          <p className="eyebrow">Create an account</p>
          <h1>Join SafeHaven</h1>
          <p className="sub">Your account is private and never shared.</p>

          <form onSubmit={handleSignup}>
            <label className="field-label">I am</label>
            <div className="age-options">
              <button
                type="button"
                className={`age-btn ${ageGroup === 'under18' ? 'selected' : ''}`}
                onClick={() => setAgeGroup('under18')}
              >
                Under 18
              </button>
              <button
                type="button"
                className={`age-btn ${ageGroup === '18plus' ? 'selected' : ''}`}
                onClick={() => setAgeGroup('18plus')}
              >
                18 or older
              </button>
            </div>

            <label className="field-label" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label className="field-label" htmlFor="province">Province</label>
            <select
              id="province"
              required
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              <option value="" disabled>Select your province</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <label className="field-label" htmlFor="language">Preferred language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>

            <label className="field-label" htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              placeholder="Optional"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="switch-auth">
            Already have an account? <Link href="/login">Log in</Link>
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
          margin-bottom: 12px;
        }
        .sub {
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 26px;
        }
        .field-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
          margin-top: 18px;
        }
        .age-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .age-btn {
          background: white;
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 12px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
        }
        .age-btn.selected {
          border-color: var(--rose);
          background: var(--blush);
          color: var(--rose-deep);
        }
        input,
        select {
          width: 100%;
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 0.92rem;
          font-family: inherit;
          background: white;
          color: var(--ink);
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
