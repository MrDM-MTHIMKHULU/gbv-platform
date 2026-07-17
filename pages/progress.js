import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { COURSES } from '../lib/courseData';
import { ADVANCED_COURSES } from '../lib/allyCourseData';

// Combine every course into one generic shape, so adding a new course later
// (basic or advanced) needs no changes to this page at all.
function getAllCourses() {
  const basic = COURSES.map((c) => ({
    id: c.id,
    title: c.title,
    lessonIds: c.lessons.map((l) => l.id),
    quizzes: [],
  }));

  const advanced = ADVANCED_COURSES.map((c) => {
    const lessonIds = c.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const quizzes = [
      ...c.modules.map((m) => ({ id: m.quiz.id, label: `${m.title} quiz` })),
      { id: c.finalAssessment.id, label: 'Final assessment' },
    ];
    return { id: c.id, title: c.title, lessonIds, quizzes };
  });

  return [...basic, ...advanced];
}

export default function ProgressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [progressByCourse, setProgressByCourse] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [certifiedCourses, setCertifiedCourses] = useState(new Set());

  const allCourses = getAllCourses();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      load(data.user.id);
    });
  }, []);

  const load = async (userId) => {
    const { data: progressRows } = await supabase
      .from('course_progress')
      .select('course_id, lesson_id')
      .eq('user_id', userId);

    const byCourse = {};
    (progressRows || []).forEach((row) => {
      byCourse[row.course_id] = byCourse[row.course_id] || new Set();
      byCourse[row.course_id].add(row.lesson_id);
    });
    setProgressByCourse(byCourse);

    const { data: quizRows } = await supabase
      .from('quiz_scores')
      .select('course_id, quiz_id, score, total, passed')
      .eq('user_id', userId);
    const byQuiz = {};
    (quizRows || []).forEach((row) => {
      byQuiz[`${row.course_id}:${row.quiz_id}`] = row;
    });
    setQuizScores(byQuiz);

    const { data: certRows } = await supabase
      .from('certificates')
      .select('course_id')
      .eq('user_id', userId);
    setCertifiedCourses(new Set((certRows || []).map((r) => r.course_id)));

    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="msg-wrap">
          <p>Loading your progress…</p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
            color: var(--muted);
          }
        `}</style>
      </Layout>
    );
  }

  // Overall totals, across every course, for the donut chart.
  const totalLessons = allCourses.reduce((sum, c) => sum + c.lessonIds.length, 0);
  const totalDone = allCourses.reduce(
    (sum, c) => sum + (progressByCourse[c.id]?.size || 0),
    0
  );
  const overallPct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;

  const donutStyle = {
    background: `conic-gradient(var(--rose) ${overallPct * 3.6}deg, var(--sand) 0deg)`,
  };

  return (
    <Layout>
      <Head>
        <title>My Progress | SafeHaven</title>
      </Head>

      <section className="page-header">
        <p className="eyebrow">My progress</p>
        <h1>Your learning, at a glance</h1>
        <p className="sub">
          Every course, quiz, and certificate in one place.
        </p>
      </section>

      <section className="content">
        <div className="block overall-block">
          <div className="donut" style={donutStyle}>
            <div className="donut-hole">
              <p className="donut-pct">{overallPct}%</p>
              <p className="donut-label">overall</p>
            </div>
          </div>
          <div className="overall-detail">
            <p className="overall-num">
              {totalDone} <span>/ {totalLessons} lessons completed</span>
            </p>
            <p className="overall-sub">
              Across {allCourses.length} course{allCourses.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>

        <div className="block">
          <h2>Progress by course</h2>
          {allCourses.map((c) => {
            const done = progressByCourse[c.id]?.size || 0;
            const total = c.lessonIds.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const hasCert = certifiedCourses.has(c.id);
            return (
              <div className="course-bar-row" key={c.id}>
                <div className="course-bar-top">
                  <span className="course-bar-label">{c.title}</span>
                  <span className="course-bar-pct">{pct}%</span>
                </div>
                <div className="course-bar-track">
                  <div
                    className="course-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="course-bar-bottom">
                  <span>{done} of {total} lessons</span>
                  {hasCert && <span className="cert-tag">Certified</span>}
                </div>
              </div>
            );
          })}
        </div>

        {allCourses.some((c) => c.quizzes.length > 0) && (
          <div className="block">
            <h2>Quiz performance</h2>
            {allCourses
              .filter((c) => c.quizzes.length > 0)
              .map((c) => (
                <div key={c.id} className="quiz-course-group">
                  <p className="quiz-course-title">{c.title}</p>
                  {c.quizzes.map((q) => {
                    const result = quizScores[`${c.id}:${q.id}`];
                    const pct = result
                      ? Math.round((result.score / result.total) * 100)
                      : 0;
                    return (
                      <div className="quiz-bar-row" key={q.id}>
                        <span className="quiz-bar-label">{q.label}</span>
                        <div className="quiz-bar-track">
                          <div
                            className={`quiz-bar-fill ${
                              result?.passed ? 'passed' : result ? 'failed' : ''
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="quiz-bar-value">
                          {result ? `${result.score}/${result.total}` : 'Not taken'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        )}

        <div className="block">
          <h2>Certificates earned</h2>
          {certifiedCourses.size === 0 ? (
            <p className="empty">
              No certificates yet. Complete a course&apos;s final assessment
              to earn one.
            </p>
          ) : (
            allCourses
              .filter((c) => certifiedCourses.has(c.id))
              .map((c) => (
                <div className="cert-row" key={c.id}>
                  <span>{c.title}</span>
                  <a
                    href={`/api/certificate?courseId=${c.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </div>
              ))
          )}
        </div>

        <div className="block">
          <Link href="/learn" className="back-link">
            Back to Learning Hub
          </Link>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px 20px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .page-header h1 {
          font-size: clamp(1.7rem, 3.6vw, 2.3rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .sub {
          font-size: 0.92rem;
          color: var(--muted);
        }

        .content {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px 24px 100px;
        }
        .block {
          margin-bottom: 48px;
        }
        .block h2 {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
        }
        .empty {
          font-size: 0.88rem;
          color: var(--muted);
        }

        .overall-block {
          display: flex;
          align-items: center;
          gap: 30px;
          background: var(--warm);
          border-radius: 16px;
          padding: 30px;
        }
        .donut {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .donut-hole {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .donut-pct {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--ink);
        }
        .donut-label {
          font-size: 0.68rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .overall-num {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--ink);
        }
        .overall-num span {
          font-weight: 400;
          font-size: 0.9rem;
          color: var(--muted);
        }
        .overall-sub {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 4px;
        }

        .course-bar-row {
          margin-bottom: 22px;
        }
        .course-bar-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .course-bar-label {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.92rem;
        }
        .course-bar-pct {
          font-weight: 700;
          color: var(--rose-deep);
          font-size: 0.88rem;
        }
        .course-bar-track {
          background: var(--sand);
          border-radius: 6px;
          height: 9px;
          overflow: hidden;
          margin-bottom: 6px;
        }
        .course-bar-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 6px;
        }
        .course-bar-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--muted);
        }
        .cert-tag {
          background: var(--teal);
          color: white;
          font-weight: 800;
          font-size: 0.68rem;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 999px;
        }

        .quiz-course-group {
          margin-bottom: 24px;
        }
        .quiz-course-title {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.88rem;
          margin-bottom: 10px;
        }
        .quiz-bar-row {
          display: grid;
          grid-template-columns: 140px 1fr 70px;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .quiz-bar-label {
          font-size: 0.78rem;
          color: var(--ink);
        }
        .quiz-bar-track {
          background: var(--sand);
          border-radius: 6px;
          height: 8px;
          overflow: hidden;
        }
        .quiz-bar-fill {
          height: 100%;
          background: var(--muted);
          border-radius: 6px;
        }
        .quiz-bar-fill.passed {
          background: #0e6e65;
        }
        .quiz-bar-fill.failed {
          background: #c2410c;
        }
        .quiz-bar-value {
          font-size: 0.75rem;
          color: var(--muted);
          text-align: right;
        }

        .cert-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: var(--teal-light);
          border-radius: 10px;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--ink);
        }
        .cert-row :global(a) {
          color: var(--rose-deep);
          font-weight: 800;
          text-decoration: none;
        }

        .back-link {
          font-size: 0.85rem;
          color: var(--muted);
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
