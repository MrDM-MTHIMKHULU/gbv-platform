import Head from 'next/head';
import Link from 'next/link';
import QuickExitButton from '../components/QuickExitButton';

export default function Home() {
  return (
    <>
      <Head>
        <title>Safe Space | Support for Women and Girls</title>
        <meta
          name="description"
          content="Free, confidential support for women and girls experiencing gender-based violence in South Africa."
        />
      </Head>

      <div style={{ minHeight: '100vh', background: '#ffffff', color: '#4a0e2b' }}>
        {/* Top bar: language selector + quick exit */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            borderBottom: '1px solid #fbcfe8',
          }}
        >
          <select
            aria-label="Choose language"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #fbcfe8',
              fontSize: '14px',
              color: '#4a0e2b',
              background: '#fff0f6',
            }}
          >
            <option>English</option>
            <option>isiZulu</option>
            <option>isiXhosa</option>
            <option>Afrikaans</option>
            <option>Sesotho</option>
          </select>

          <QuickExitButton />
        </header>

        {/* Hero */}
        <section
          style={{
            textAlign: 'center',
            padding: '48px 20px 32px',
            background: '#fff0f6',
          }}
        >
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 12px' }}>
            You&apos;re not alone. Help is here.
          </h1>
          <p style={{ fontSize: '16px', color: '#9d174d', maxWidth: '480px', margin: '0 auto' }}>
            Free, confidential support for women and girls facing gender-based violence
            in South Africa — in your language.
          </p>
        </section>

        {/* Action cards */}
        <section
          style={{
            maxWidth: '640px',
            margin: '32px auto',
            padding: '0 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <ActionCard
            href="/map"
            title="Find help near me"
            description="Shelters, clinics, counselling and legal aid on a map."
          />
          <ActionCard
            href="/rights"
            title="Know your rights"
            description="Plain-language guides to protection orders and the law."
          />
          <ActionCard
            href="/support"
            title="Talk to someone"
            description="Hotlines and contacts, available any time."
          />
          <ActionCard
            href="/about-abuse"
            title="Is this abuse?"
            description="Information to help you recognise the signs."
          />
        </section>

        {/* Emergency bar */}
        <section
          style={{
            background: '#c2185b',
            color: '#ffffff',
            textAlign: 'center',
            padding: '14px 20px',
            marginTop: '32px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          In immediate danger? Call 10177 (Police) or 0800 150 150 (GBV Command Centre)
        </section>

        <footer
          style={{
            textAlign: 'center',
            padding: '20px',
            fontSize: '12px',
            color: '#9d174d',
          }}
        >
          This site does not track your visit. Use Quick Exit at any time.
        </footer>
      </div>
    </>
  );
}

function ActionCard({ href, title, description }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        background: '#ffffff',
        border: '1px solid #fbcfe8',
        borderRadius: '10px',
        padding: '18px',
        textDecoration: 'none',
        color: '#4a0e2b',
      }}
    >
      <p style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>{title}</p>
      <p style={{ fontSize: '13px', color: '#9d174d', margin: 0 }}>{description}</p>
    </Link>
  );
}
