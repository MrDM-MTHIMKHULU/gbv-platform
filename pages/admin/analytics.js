import { useEffect, useState } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';
import { COURSES } from '../../lib/courseData';
import { ADVANCED_COURSES } from '../../lib/allyCourseData';

// Build a lookup from lesson_id/course_id to a human-readable label, so the
// dashboard can show "Trust vs. control" instead of a raw id.
function buildLabelMaps() {
  const courseTitles = {};
  const lessonTitles = {};

  COURSES.forEach((c) => {
    courseTitles[c.id] = c.title;
    c.lessons.forEach((l) => {
      lessonTitles[`${c.id}:${l.id}`] = l.title;
    });
  });

  ADVANCED_COURSES.forEach((c) => {
    courseTitles[c.id] = c.title;
    c.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        lessonTitles[`${c.id}:${l.id}`] = l.title;
      });
      lessonTitles[`${c.id}:${m.quiz.id}`] = `${m.title} (quiz)`;
    });
    lessonTitles[`${c.id}:${c.finalAssessment.id}`] = 'Final assessment';
  });

  return { courseTitles, lessonTitles };
}

export default function AdminAnalyticsPage() {
  const [status, setStatus] = useState('loading'); // loading | unauthorized | ready | error
  const [lessonEngagement, setLessonEngagement] = useState([]);
  const [courseSummary, setCourseSummary] = useState([]);
  const [quizStats, setQuizStats] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [signupStats, setSignupStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const [lessonRes, courseRes, quizRes, certRes, signupRes] = await Promise.all([
      supabase.rpc('get_admin_lesson_engagement'),
      supabase.rpc('get_admin_course_summary'),
      supabase.rpc('get_admin_quiz_stats'),
      supabase.rpc('get_admin_certificates_issued'),
      supabase.rpc('get_admin_signup_stats'),
    ]);

    if (lessonRes.error || courseRes.error || quizRes.error || certRes.error || signupRes.error) {
      const anyAuthError = [lessonRes, courseRes, quizRes, certRes, signupRes].some(
        (r) => r.error?.message?.toLowerCase().includes('not authorized')
      );
      setStatus(anyAuthError ? 'unauthorized' : 'error');
      return;
    }

    setLessonEngagement(lessonRes.data || []);
    setCourseSummary(courseRes.data || []);
    setQuizStats(quizRes.data || []);
    setCertificates(certRes.data || []);
    setSignupStats(signupRes.data || null);
    setStatus('ready');
  };

  const { courseTitles, lessonTitles } = buildLabelMaps();

  if (status === 'loading') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p>Loading…</p>
        </div>
      </Layout>
    );
  }

  if (status === 'unauthorized') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p className="msg-title">Not authorized</p>
          <p className="msg-sub">
            This page is only visible to admin accounts. If this should be
            you, ask whoever set up the project to add your account to the
            admin_users table.
          </p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
          }
          .msg-title {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--ink);
            margin-bottom: 10px;
          }
          .msg-sub {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.6;
          }
        `}</style>
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout>
        <div className="msg-wrap">
          <p className="msg-title">Couldn&apos;t load analytics</p>
          <p className="msg-sub">Something went wrong fetching the data.</p>
        </div>
        <style jsx>{`
          .msg-wrap {
            max-width: 500px;
            margin: 0 auto;
            padding: 100px 24px;
            text-align: center;
          }
          .msg-title {
            font-size: 1.3rem;
            font-weight: 800;
            color: var(--ink);
            margin-bottom: 10px;
          }
          .msg-sub {
            font-size: 0.9rem;
            color: var(--muted);
            line-height: 1.6;
          }
        `}</style>
      </Layout>
    );
  }

  const topLessons = [...lessonEngagement].slice(0, 10);
  const maxCompletions = Math.max(...topLessons.map((l) => l.completions), 1);
  const maxLearners = Math.max(...courseSummary.map((c) => c.learners), 1);

  return (
    <Layout>
      <Head>
        <title>Admin Analytics | SafeHaven</title>
      </Head>

      <section className="page-header">
        <p className="eyebrow">Admin only</p>
        <h1>Learning engagement</h1>
        <p className="sub">
          Aggregated activity across all learners. No individual user&apos;s
          activity is shown here, only totals and averages.
        </p>
      </section>

      <section className="content">
        {signupStats && (
          <div className="block">
            <h2>Who SafeHaven is reaching</h2>
            <p className="block-sub">
              {signupStats.total} registered accounts so far. Admin-only, no
              individual user is identifiable here, only aggregate counts.
            </p>

            <p className="sub-heading">By age group</p>
            <RatioBars data={relabelAgeGroups(signupStats.byAgeGroup)} variant="" />

            <p className="sub-heading">By province</p>
            <RatioBars data={signupStats.byProvince} variant="alt" />

            <p className="sub-heading">By preferred language</p>
            <RatioBars data={relabelLanguages(signupStats.byLanguage)} variant="" />
          </div>
        )}

        <div className="block">
          <h2>Learners per course</h2>
          {courseSummary.length === 0 ? (
            <p className="empty">No course activity yet.</p>
          ) : (
            courseSummary.map((c) => (
              <div className="bar-row" key={c.course_id}>
                <span className="bar-label">
                  {courseTitles[c.course_id] || c.course_id}
                </span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${(c.learners / maxLearners) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{c.learners}</span>
              </div>
            ))
          )}
        </div>

        <div className="block">
          <h2>Most engaged topics</h2>
          <p className="block-sub">
            Lessons with the most completions across all learners, top 10.
          </p>
          {topLessons.length === 0 ? (
            <p className="empty">No lesson completions yet.</p>
          ) : (
            topLessons.map((l) => (
              <div className="bar-row" key={`${l.course_id}:${l.lesson_id}`}>
                <span className="bar-label">
                  {lessonTitles[`${l.course_id}:${l.lesson_id}`] || l.lesson_id}
                </span>
                <div className="bar-track">
                  <div
                    className="bar-fill alt"
                    style={{ width: `${(l.completions / maxCompletions) * 100}%` }}
                  />
                </div>
                <span className="bar-value">{l.completions}</span>
              </div>
            ))
          )}
        </div>

        <div className="block">
          <h2>Quiz performance</h2>
          {quizStats.length === 0 ? (
            <p className="empty">No quiz attempts yet.</p>
          ) : (
            <div className="quiz-table">
              <div className="quiz-row quiz-head">
                <span>Quiz</span>
                <span>Attempts</span>
                <span>Avg score</span>
                <span>Pass rate</span>
              </div>
              {quizStats.map((q) => (
                <div className="quiz-row" key={`${q.course_id}:${q.quiz_id}`}>
                  <span>{lessonTitles[`${q.course_id}:${q.quiz_id}`] || q.quiz_id}</span>
                  <span>{q.attempts}</span>
                  <span>{q.avg_score}</span>
                  <span>{q.pass_rate}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="block">
          <h2>Certificates issued</h2>
          {certificates.length === 0 ? (
            <p className="empty">No certificates issued yet.</p>
          ) : (
            certificates.map((c) => (
              <div className="cert-row" key={c.course_id}>
                <span>{courseTitles[c.course_id] || c.course_id}</span>
                <span className="cert-count">{c.issued}</span>
              </div>
            ))
          )}
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
          line-height: 1.6;
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
          margin-bottom: 6px;
        }
        .block-sub {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 18px;
        }
        .sub-heading {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--ink);
          margin: 20px 0 8px;
        }
        .ratio-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 4px;
        }
        .empty {
          font-size: 0.88rem;
          color: var(--muted);
        }

        .bar-row {
          display: grid;
          grid-template-columns: 180px 1fr 36px;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .bar-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--ink);
        }
        .bar-track {
          background: var(--sand);
          border-radius: 6px;
          height: 10px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 6px;
        }
        .bar-fill.alt {
          background: var(--teal);
        }
        .bar-value {
          font-size: 0.8rem;
          color: var(--muted);
          text-align: right;
        }

        .quiz-table {
          display: flex;
          flex-direction: column;
        }
        .quiz-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 8px;
          padding: 10px 0;
          border-bottom: 1px solid var(--sand);
          font-size: 0.85rem;
        }
        .quiz-head {
          font-weight: 700;
          color: var(--muted);
          font-size: 0.72rem;
          text-transform: uppercase;
        }

        .cert-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--teal-light);
          border-radius: 10px;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--ink);
        }
        .cert-count {
          font-weight: 800;
          color: var(--rose-deep);
        }
      `}</style>
    </Layout>
  );
}

function RatioBars({ data, variant }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return <p className="empty">No data yet.</p>;
  }

  return (
    <div className="ratio-bars">
      {entries.map(([label, value]) => (
        <div className="bar-row" key={label}>
          <span className="bar-label">{label}</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${variant}`}
              style={{ width: `${(value / max) * 100}%` }}
            />
          </div>
          <span className="bar-value">{value}</span>
        </div>
      ))}
    </div>
  );
}

function relabelAgeGroups(obj) {
  const map = { under18: 'Under 18', '18plus': '18 and older' };
  const out = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    out[map[k] || k] = v;
  });
  return out;
}

function relabelLanguages(obj) {
  const map = { en: 'English', zu: 'isiZulu', xh: 'isiXhosa', af: 'Afrikaans', st: 'Sesotho' };
  const out = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    out[map[k] || k] = v;
  });
  return out;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
