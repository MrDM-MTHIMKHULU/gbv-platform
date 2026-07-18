import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import MythFactGame from '../../components/MythFactGame';
import { supabase } from '../../lib/supabaseClient';
import { COURSES } from '../../lib/courseData';
import { ADVANCED_COURSES } from '../../lib/allyCourseData';

const COURSE_ICONS = {
  'gbv-awareness': '📖',
  'healthy-relationships': '💛',
  consent: '🤝',
  'online-safety': '🔒',
};

const DOWNLOADS = [
  {
    file: '/downloads/know-your-rights-guide.pdf',
    icon: '⚖️',
    title: 'Know Your Rights',
    desc: 'Applying for a protection order under the Domestic Violence Act.',
  },
  {
    file: '/downloads/safety-planning-guide.pdf',
    icon: '🛡️',
    title: 'Building Your Safety Plan',
    desc: "A practical guide, whether you're staying, leaving, or unsure.",
  },
];

export default function LearnPage() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [ageGroup, setAgeGroup] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAgeGroup(data.user?.user_metadata?.age_group ?? null);
      setUser(data.user ?? null);
      if (data.user) loadProgress(data.user.id);
    });
  }, []);

  const isGirl = ageGroup === 'under18';

  const loadProgress = async (userId) => {
    const { data } = await supabase
      .from('course_progress')
      .select('course_id, lesson_id')
      .eq('user_id', userId);

    const byCourse = {};
    (data || []).forEach((row) => {
      byCourse[row.course_id] = byCourse[row.course_id] || new Set();
      byCourse[row.course_id].add(row.lesson_id);
    });
    setProgress(byCourse);
  };

  return (
    <Layout>
      <Head>
        <title>Learning Hub | SafeHaven</title>
        <meta
          name="description"
          content="Interactive lessons, a myth vs fact game, and downloadable guides on gender-based violence."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Learning hub</p>
        <h1>Learn at your own pace</h1>
        <p className="sub">
          Short lessons, a myth vs fact game, and guides you can keep.
        </p>
      </section>

      <section className="content">
        <div className="block">
          <h2>Myth or fact?</h2>
          <p className="block-sub">Tap an answer to see if you're right.</p>
          <MythFactGame />
        </div>

        <div className="block">
          <h2>Courses</h2>
          {!user && (
            <p className="login-note">
              <Link href="/login">Log in</Link> to save your progress. You
              can still browse without an account.
            </p>
          )}
          <div className="course-grid">
            {COURSES.map((c) => {
              const done = progress[c.id]?.size || 0;
              const total = c.lessons.length;
              const pct = Math.round((done / total) * 100);
              return (
                <Link href={`/learn/${c.id}`} className="card-link" key={c.id}>
                  <div className="course-card">
                    <div className="course-icon">{COURSE_ICONS[c.id] || '📘'}</div>
                    <p className="course-title">{c.title}</p>
                    <p className="course-tagline">{c.tagline}</p>
                    <div className="course-progress-track">
                      <div
                        className="course-progress-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="course-progress-label">
                      {done} of {total} lessons
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {!isGirl && (
          <div className="block">
            <h2>Advanced courses</h2>
            <p className="block-sub">
              Full courses with modules, quizzes, and a certificate on
              completion.
            </p>
            <div className="course-grid">
              {ADVANCED_COURSES.map((c) => (
                <Link href={`/learn/course/${c.id}`} className="card-link" key={c.id}>
                  <div className="course-card advanced">
                    <div className="course-icon">🎓</div>
                    <p className="course-title">{c.title}</p>
                    <p className="course-tagline">{c.subtitle}</p>
                    <p className="course-progress-label">
                      {c.modules.length} modules · {c.estimatedMinutes} min ·
                      certificate
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="block">
          <h2>Guides to download</h2>
          <p className="block-sub">Save these, or share with someone who needs them.</p>
          <div className="download-list">
            {DOWNLOADS.map((d) => (
              <a href={d.file} className="card-link" key={d.file} download>
                <div className="download-card">
                  <div className="download-icon">{d.icon}</div>
                  <div className="download-body">
                    <p className="download-title">{d.title}</p>
                    <p className="download-desc">{d.desc}</p>
                  </div>
                  <span className="download-cta">↓</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 30px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 18px;
        }
        .page-header h1 {
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
        }
        .sub {
          font-size: 1rem;
          color: var(--muted);
          line-height: 1.6;
          max-width: 480px;
          margin: 0 auto;
        }

        .content {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 24px 100px;
        }
        .block {
          margin-bottom: 60px;
        }
        .block h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 10px;
        }
        .block-sub {
          font-size: 0.9rem;
          color: var(--muted);
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .login-note {
          font-size: 0.88rem;
          color: var(--muted);
          background: var(--warm);
          border-radius: 10px;
          padding: 14px 18px;
          margin-bottom: 20px;
        }
        .login-note :global(a) {
          color: var(--rose-deep);
          font-weight: 700;
        }

        :global(.card-link) {
          text-decoration: none;
          display: block;
        }

        .course-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .course-card {
          background: white;
          border: 1px solid var(--sand);
          border-radius: 14px;
          padding: 22px;
          height: 100%;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        :global(.card-link:hover) .course-card {
          border-color: var(--rose);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }
        .course-card.advanced {
          background: var(--blush);
          border-color: var(--blush);
        }
        .course-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--warm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          margin-bottom: 14px;
        }
        .course-card.advanced .course-icon {
          background: white;
        }
        .course-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 6px;
        }
        .course-tagline {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .course-progress-track {
          background: var(--warm);
          border-radius: 6px;
          height: 8px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .course-progress-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 6px;
        }
        .course-progress-label {
          font-size: 0.75rem;
          color: var(--muted);
          font-weight: 600;
        }

        .download-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .download-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--teal-light);
          border-radius: 12px;
          padding: 18px 20px;
          transition: box-shadow 0.15s ease;
        }
        :global(.card-link:hover) .download-card {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }
        .download-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .download-body {
          flex: 1;
        }
        .download-title {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.95rem;
          margin-bottom: 3px;
        }
        .download-desc {
          font-size: 0.82rem;
          color: var(--muted);
          line-height: 1.4;
        }
        .download-cta {
          font-size: 1.1rem;
          color: var(--rose-deep);
          font-weight: 800;
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .course-grid {
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
