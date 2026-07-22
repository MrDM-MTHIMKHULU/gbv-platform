import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';

// Alphabetical by first name. Keep it this way when adding/removing people.
const TEAM = [
  { initials: 'DM', name: 'Den Mthimkhulu', gender: 'male', linkedin: '#' },
  { initials: 'KC', name: 'Khaviso Hatlane', gender: 'male', linkedin: '#' },
  { initials: 'L', name: 'Lina Mtshatsha', gender: 'female', linkedin: '#' },
  { initials: 'SJ', name: 'Sibohelo Moshasha', gender: 'female', linkedin: '#' },
  { initials: 'S', name: 'Sihle Majodina', gender: 'male', linkedin: '#' },
];

const AUDIENCES = [
  {
    tag: 'If it\u2019s happening to you',
    text: 'Clear information on your rights, shelters near you, and someone to talk to, right now if you need to.',
  },
  {
    tag: 'If you want to understand it',
    text: 'Structured lessons on what abuse looks like, consent, and healthy relationships, for anyone who wants to learn.',
  },
  {
    tag: 'If someone you know needs you',
    text: 'A dedicated course on how to support a friend, family member, or colleague without making things harder for them.',
  },
];

const FEATURES = [
  {
    tag: 'Jennet, our AI agent',
    text: 'A real conversational assistant scoped strictly to GBV, trained to recognise when to stop being an assistant and hand someone a phone number instead.',
  },
  {
    tag: 'Verified, not scraped',
    text: 'Every shelter, hotline, and legal process on this platform is checked against Legal Aid South Africa, gov.za, and each organisation\u2019s own published contact details.',
  },
  {
    tag: 'A guided rights wizard',
    text: 'Five questions, no login required, nothing stored, that walk you to the legal information relevant to your specific situation.',
  },
  {
    tag: 'Built for two different readers',
    text: 'A 16-year-old and a 35-year-old in an abusive marriage need different information delivered in a different tone. The whole platform, colours included, adjusts for that.',
  },
  {
    tag: 'An emergency alert, not a gimmick',
    text: 'Save a trusted contact and share your live location with one tap, by SMS through your own messaging app, or automatically by email.',
  },
  {
    tag: 'Real data, honestly presented',
    text: 'Live province-by-province coverage gaps next to cited SAPS and HSRC statistics, including the reporting caveats most platforms leave out.',
  },
];

export default function AboutUsPage() {
  return (
    <Layout>
      <Head>
        <title>About Us | SafeHaven</title>
        <meta
          name="description"
          content="SafeHaven brings scattered GBV information, shelters, legal rights, and support into one place, for survivors, for people learning, and for people who want to help."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">About Us</p>
        <h1>
          Information shouldn&apos;t be the hardest part
          <span> of getting to safety.</span>
        </h1>
        <p className="sub">
          SafeHaven is a centralised support platform for gender-based
          violence in South Africa. Support exists, shelters exist, legal
          protections exist, but the information about them is scattered.
          We bring it into one place.
        </p>
      </section>

      <section className="audiences">
        <p className="audiences-lead">
          SafeHaven isn&apos;t only for people currently experiencing abuse.
          It&apos;s also for people who want to understand what GBV looks
          like before it touches their own life, and for the friends, family,
          and colleagues who want to help someone else through it.
        </p>
        <div className="audience-grid">
          {AUDIENCES.map((a) => (
            <div className="audience-card" key={a.tag}>
              <p className="audience-tag">{a.tag}</p>
              <p className="audience-text">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="intro-block">
        <p>
          The creation of SafeHaven is inspired by UNESCO&apos;s Information
          for All Programme (IFAP) and is designed around three of its
          strategic priorities: <strong>Information Accessibility</strong>,{' '}
          <strong>Information Literacy</strong>, and{' '}
          <strong>Multilingualism in Cyberspace</strong>, applied to a
          marginalised group: women and girls.
        </p>
      </section>

      <section className="ifap-grid-section">
        <div className="ifap-grid">
          <div className="ifap-card">
            <p className="ifap-tag">Information Accessibility</p>
            <p className="ifap-text">
              In South Africa, GBV information is not scarce, it is
              fragmented. Legal guidance, shelters, crisis hotlines,
              healthcare services, and support organisations are scattered
              across government websites, NGOs, PDFs, and independent
              platforms. For someone experiencing abuse, often with limited
              time, limited internet access, and genuine fear for their
              safety, that fragmentation becomes a barrier to getting the
              information they need. SafeHaven centralises verified GBV
              information into a single, easy-to-use platform, so essential
              support is easier to find, understand, and act upon.
            </p>
          </div>
          <div className="ifap-card">
            <p className="ifap-tag">Information Literacy</p>
            <p className="ifap-text">
              Access to information alone isn&apos;t enough. People also need
              to be able to interpret it, recognise different forms of
              abuse, understand their legal rights, tell myths from facts,
              and make informed decisions. SafeHaven supports this through
              structured educational resources, including courses, ebooks,
              quizzes, and guided learning pathways that build practical
              knowledge, not just answer a single question in the moment.
            </p>
          </div>
          <div className="ifap-card">
            <p className="ifap-tag">Multilingualism in Cyberspace</p>
            <p className="ifap-text">
              True accessibility also means being available in languages
              people actually understand. South Africa has 11 official
              languages, yet most digital resources exist only in English or
              a handful of others. SafeHaven embraces multilingualism in
              cyberspace by offering multilingual content today and building
              an architecture designed to grow into all eleven official
              languages over time, so language is never the barrier standing
              between someone and life-saving information.
            </p>
          </div>
        </div>
        <p className="ifap-closing">
          By combining information accessibility, information literacy, and
          multilingualism in cyberspace, SafeHaven aims to reduce information
          inequalities and empower women and girls with reliable,
          understandable, and inclusive GBV information when they need it
          most.
        </p>
      </section>

      <section className="pillars">
        <div className="pillar">
          <p className="pillar-tag">Our Vision</p>
          <p className="pillar-text">
            A South Africa where no one, whether they&apos;re in crisis,
            trying to understand what&apos;s happening to them, or trying to
            help someone else, has to piece together safety information from
            scattered PDFs and disconnected hotline lists.
          </p>
        </div>
        <div className="pillar">
          <p className="pillar-tag">Our Mission</p>
          <p className="pillar-text">
            To bring shelters, legal rights, hotlines, education, and
            safety tools into a single, trustworthy platform, in the
            languages South Africans actually speak, built for survivors,
            for learners, and for allies alike.
          </p>
        </div>
      </section>

      <section className="features-section">
        <p className="eyebrow center">More Than a Directory</p>
        <h2>What makes SafeHaven different</h2>
        <p className="features-lead">
          It&apos;s not enough for information to exist. How it&apos;s
          delivered matters just as much as what&apos;s delivered.
        </p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.tag}>
              <p className="feature-tag">{f.tag}</p>
              <p className="feature-text">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="team-section">
        <p className="eyebrow center">Meet the Team</p>
        <h2>The people behind SafeHaven</h2>

        <div className="team-grid">
          {TEAM.map((member) => (
            <a
              href={member.linkedin}
              className="team-card"
              key={member.name}
              target="_blank"
              rel="noreferrer"
            >
              <div className={`avatar ${member.gender}`}>{member.initials}</div>
              <p className="team-name">{member.name}</p>
              <span className="team-linkedin">
                LinkedIn
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.6v1.7h.05c.5-.9 1.8-1.9 3.7-1.9 3.9 0 4.65 2.6 4.65 5.9V21h-4v-5.4c0-1.3 0-3-1.85-3s-2.1 1.4-2.1 2.9V21H9z" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 20px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .eyebrow.center {
          text-align: center;
        }
        .page-header h1 {
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          font-weight: 800;
          color: var(--ink);
          line-height: 1.25;
          margin-bottom: 18px;
        }
        .page-header h1 span {
          color: var(--rose-deep);
        }
        .sub {
          font-size: 1rem;
          color: var(--muted);
          line-height: 1.7;
        }

        .audiences {
          max-width: 900px;
          margin: 20px auto 0;
          padding: 20px 24px 0;
        }
        .audiences-lead {
          font-size: 0.98rem;
          color: var(--ink);
          line-height: 1.75;
          text-align: center;
          max-width: 720px;
          margin: 0 auto 34px;
        }
        .audience-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .audience-card {
          background: white;
          border: 1px solid var(--sand);
          border-radius: 14px;
          padding: 24px 22px;
        }
        .audience-tag {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--rose-deep);
          margin-bottom: 10px;
          line-height: 1.4;
        }
        .audience-text {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.6;
        }

        .intro-block {
          max-width: 680px;
          margin: 0 auto;
          padding: 50px 24px 10px;
        }
        .intro-block p {
          font-size: 0.95rem;
          color: var(--ink);
          line-height: 1.8;
          margin-bottom: 18px;
        }
        .intro-block strong {
          color: var(--rose-deep);
        }

        .ifap-grid-section {
          max-width: 1000px;
          margin: 40px auto 0;
          padding: 0 24px;
        }
        .ifap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 34px;
        }
        .ifap-card {
          background: var(--warm);
          border-radius: 16px;
          padding: 26px 24px;
        }
        .ifap-tag {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          color: var(--rose-deep);
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .ifap-text {
          font-size: 0.86rem;
          color: var(--ink);
          line-height: 1.7;
        }
        .ifap-closing {
          font-size: 0.95rem;
          color: var(--ink);
          line-height: 1.8;
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }

        .pillars {
          max-width: 900px;
          margin: 50px auto 10px;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .pillar {
          background: var(--warm);
          border-radius: 16px;
          padding: 30px 26px;
        }
        .pillar-tag {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 12px;
        }
        .pillar-text {
          font-size: 0.92rem;
          color: var(--ink);
          line-height: 1.7;
        }

        .features-section {
          max-width: 1000px;
          margin: 90px auto 0;
          padding: 0 24px;
          text-align: center;
        }
        .features-section h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .features-lead {
          font-size: 0.95rem;
          color: var(--muted);
          max-width: 560px;
          margin: 0 auto 40px;
          line-height: 1.6;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          text-align: left;
        }
        .feature-card {
          background: var(--warm);
          border-radius: 14px;
          padding: 24px 22px;
        }
        .feature-tag {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 10px;
          line-height: 1.4;
        }
        .feature-text {
          font-size: 0.84rem;
          color: var(--muted);
          line-height: 1.65;
        }

        .team-section {
          max-width: 900px;
          margin: 90px auto 0;
          padding: 0 24px 100px;
          text-align: center;
        }
        .team-section h2 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 44px;
        }

        .team-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
        }

        :global(.team-card) {
          flex: 0 1 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 16px;
          padding: 32px 20px 26px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        :global(.team-card:hover) {
          border-color: var(--rose);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
          transform: translateY(-2px);
        }

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--rose) 0%, var(--rose-deep) 100%);
        }
        .avatar.female {
          background: linear-gradient(135deg, var(--rose) 0%, var(--plum) 100%);
        }
        .avatar.male {
          background: linear-gradient(135deg, var(--teal) 0%, var(--rose-deep) 100%);
        }

        .team-name {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .team-linkedin {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--muted);
        }
        :global(.team-card:hover) .team-linkedin {
          color: var(--rose-deep);
        }

        @media (max-width: 760px) {
          .pillars,
          .audience-grid,
          .feature-grid,
          .ifap-grid {
            grid-template-columns: 1fr;
          }
          .team-card {
            flex-basis: 100%;
            max-width: 300px;
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
