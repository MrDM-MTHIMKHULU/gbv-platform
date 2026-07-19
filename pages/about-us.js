import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';

const TEAM = [
  { initials: 'KC', name: 'Khaviso Hatlane', surname: 'Hatlane', gender: 'male', linkedin: '#' },
  { initials: 'S', name: 'Sihle Majodina', surname: 'Majodina', gender: 'male', linkedin: '#' },
  { initials: 'SJ', name: 'Sibohelo Moshasha', surname: 'Moshasha', gender: 'female', linkedin: '#' },
  { initials: 'DM', name: 'Den Mthimkhulu', surname: 'Mthimkhulu', gender: 'male', linkedin: '#' },
  { initials: 'L', name: 'Lina Mtshatsha', surname: 'Mtshatsha', gender: 'female', linkedin: '#' },
];

export default function AboutUsPage() {
  return (
    <Layout>
      <Head>
        <title>About Us | SafeHaven</title>
        <meta
          name="description"
          content="SafeHaven brings scattered GBV information, shelters, legal rights, and support into one place for women and girls in South Africa."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">About Us</p>
        <h1>
          Information shouldn&apos;t be the hardest part
          <span> of getting to safety.</span>
        </h1>
        <p className="sub">
          SafeHaven is a centralised support platform for women and girls
          experiencing gender-based violence in South Africa. Support exists,
          shelters exist, legal protections exist, but the information about
          them is scattered. We bring it into one place.
        </p>
      </section>

      <section className="intro-block">
        <p>
          The Creation of SafeHaven is inspired by UNESCO&apos;s Information
          for All Programme (IFAP), specifically the priority of
          <strong> information accessibility</strong>, applied to a
          marginalised group: women and girls.
        </p>
        <p>
          GBV information in South Africa is not scarce, it is fragmented,
          scattered across dozens of disconnected websites, PDFs, hotline
          lists, and government departments. For someone in crisis, often
          with limited time and real fear for their safety, that fragmentation
          is itself a form of inaccessibility.
        </p>
      </section>

      <section className="pillars">
        <div className="pillar">
          <p className="pillar-tag">Our Vision</p>
          <p className="pillar-text">
            A South Africa where no woman or girl in crisis has to piece
            together her own safety from scattered PDFs and disconnected
            hotline lists, where the right information is always one place
            away, not twenty.
          </p>
        </div>
        <div className="pillar">
          <p className="pillar-tag">Our Mission</p>
          <p className="pillar-text">
            To bring shelters, legal rights, hotlines, and safety information
            into a single, trustworthy platform, built with two audiences in
            mind: girls who need to recognise what&apos;s happening to them,
            and women who need to act on it.
          </p>
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

        .intro-block {
          max-width: 680px;
          margin: 0 auto;
          padding: 30px 24px 10px;
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

        .team-section {
          max-width: 900px;
          margin: 80px auto 0;
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
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        :global(.team-card) {
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
          .pillars {
            grid-template-columns: 1fr;
          }
          .team-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .team-grid {
            grid-template-columns: 1fr;
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
