import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import MythFactGame from '../../components/MythFactGame';
import { supabase } from '../../lib/supabaseClient';
import { COURSES } from '../../lib/courseData';
import { ADVANCED_COURSES } from '../../lib/allyCourseData';

const DOWNLOADS = [
  {
    file: '/downloads/know-your-rights-guide.pdf',
    title: 'Know Your Rights: Protection Orders in South Africa',
    desc: 'A step-by-step guide to applying for a protection order under the Domestic Violence Act.',
  },
  {
    file: '/downloads/safety-planning-guide.pdf',
    title: 'Building Your Safety Plan',
    desc: 'A practical guide to planning for your safety, whether you\'re staying, leaving, or unsure.',
  },
];

export default function LearnPage() {
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState({});
  const [ageGroup, setAgeGroup] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAgeGroup(data.user?.user_metadata?.age_group ?? null);
    });
  }, []);

  const isGirl = ageGroup === 'under18';

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) loadProgress(data.user.id);
    });
  }, []);

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
          Short lessons, an interactive myth vs fact game, and guides you can
          download and keep.
        </p>
      </section>

      <section className="content">
        <div className="block">
          <h2>Myth or fact?</h2>
          <p className="block-sub">
            Test what you know. Tap an answer to see if you're right.
          </p>
          <MythFactGame />
        </div>

        <div className="block">
          <h2>Courses</h2>
          {!user && (
            <p className="login-note">
              <Link href="/login">Log in</Link> to save your progress across
              visits. You can still browse lessons without an account.
            </p>
          )}
          <div className="course-grid">
            {COURSES.map((c) => {
              const done = progress[c.id]?.size || 0;
              const total = c.lessons.length;
              const pct = Math.round((done / total) * 100);
              return (
                <Link href={`/learn/${c.id}`} className="course-card" key={c.id}>
                  <p className="course-title">{c.title}</p>
                  <p className="course-tagline">{c.tagline}</p>
                  <div className="course-progress-track">
                    <div
                      className="course-progress-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="course-progress-label">
                    {done} of {total} lessons complete
                  </p>
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
                <Link href={`/learn/course/${c.id}`} className="course-card" key={c.id}>
                  <p className="course-title">{c.title}</p>
                  <p className="course-tagline">{c.subtitle}</p>
                  <p className="course-progress-label">
                    {c.modules.length} modules · {c.estimatedMinutes} min ·
                    certificate on completion
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="block">
          <h2>Guides to download</h2>
          <p className="block-sub">
            Save these for later, or share them with someone who needs them.
          </p>
          <div className="download-list">
            {DOWNLOADS.map((d) => (
              <a href={d.file} className="download-card" key={d.file} download>
                <p className="download-title">{d.title}</p>
                <p className="download-desc">{d.desc}</p>
                <span className="download-cta">Download PDF</span>
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

        .course-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .course-card {
          display: block;
          background: var(--blush);
          border-radius: 14px;
          padding: 22px;
          text-decoration: none;
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
          background: white;
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
          display: block;
          background: var(--teal-light);
          border-radius: 12px;
          padding: 20px 22px;
          text-decoration: none;
        }
        .download-title {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.98rem;
          margin-bottom: 6px;
        }
        .download-desc {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 12px;
          line-height: 1.5;
        }
        .download-cta {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--rose-deep);
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
