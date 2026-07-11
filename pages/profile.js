import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import EmergencyAlert from '../components/EmergencyAlert';
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

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [province, setProvince] = useState('');
  const [language, setLanguage] = useState('en');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) {
        router.push('/login');
        return;
      }
      setEmail(user.email);
      const meta = user.user_metadata || {};
      setFullName(meta.full_name || '');
      setAgeGroup(meta.age_group || '');
      setProvince(meta.province || '');
      setLanguage(meta.preferred_language || 'en');
      setPhone(meta.phone || '');
      setEmergencyContact({
        name: meta.emergency_contact_name || '',
        phone: meta.emergency_contact_phone || '',
        email: meta.emergency_contact_email || '',
      });
      setLoading(false);
    });
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        age_group: ageGroup,
        province,
        preferred_language: language,
        phone,
      },
    });

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage('Your details have been updated.');
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-wrap">
          <p>Loading your profile…</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>My Profile | SafeHaven</title>
      </Head>

      <section className="auth-wrap">
        <div className="auth-card">
          <p className="eyebrow">My profile</p>
          <h1>Your details</h1>
          <p className="sub">
            Update your information any time. Your email can&apos;t be
            changed here — contact support if you need to update it.
          </p>

          <form onSubmit={handleSave}>
            <label className="field-label">Email</label>
            <input type="email" value={email} disabled />

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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label className="field-label" htmlFor="province">Province</label>
            <select
              id="province"
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

            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}

            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>

          <EmergencyAlert initialContacts={emergencyContact} senderName={fullName} />
        </div>
      </section>

      <style jsx>{`
        .loading-wrap {
          text-align: center;
          padding: 100px 24px;
          color: var(--muted);
        }
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
        input:disabled {
          background: var(--sand);
          color: var(--muted);
        }
        .error {
          color: var(--rose-deep);
          font-size: 0.85rem;
          margin-top: 14px;
        }
        .success {
          color: var(--teal);
          font-size: 0.85rem;
          margin-top: 14px;
          font-weight: 600;
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
