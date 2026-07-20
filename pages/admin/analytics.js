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

  const totalCertificates = certificates.reduce((sum, c) => sum + c.issued, 0);
  const avgPassRate = quizStats.length
    ? Math.round(quizStats.reduce((sum, q) => sum + q.pass_rate, 0) / quizStats.length)
    : null;

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

      <section className="stat-row">
        <StatCard label="Registered accounts" value={signupStats?.total ?? '—'} color="rose" />
        <StatCard label="Certificates issued" value={totalCertificates} color="teal" />
        <StatCard label="Courses with activity" value={courseSummary.length} color="plum" />
        <StatCard
          label="Average quiz pass rate"
          value={avgPassRate !== null ? `${avgPassRate}%` : '—'}
          color="rose"
        />
      </section>

      <section className="content">
        {signupStats && (
          <div className="block">
            <h2>Who SafeHaven is reaching</h2>
            <p className="block-sub">
              {signupStats.total} registered accounts so far. Admin-only, no
              individual user is identifiable here, only aggregate counts.
            </p>

            <div className="donut-row">
              <DonutChart
                title="By age group"
                data={relabelAgeGroups(signupStats.byAgeGroup)}
                colors={['#c2185b', '#f97316']}
              />
              <DonutChart
                title="By preferred language"
                data={relabelLanguages(signupStats.byLanguage)}
                colors={['#c2185b', '#0f6e63', '#f97316', '#8e1046', '#eab308']}
              />
            </div>

            <p className="sub-heading">By province</p>
            <RatioBars data={signupStats.byProvince} variant="alt" />
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
            <div className="quiz-grid">
              {quizStats.map((q) => (
                <div className="quiz-card" key={`${q.course_id}:${q.quiz_id}`}>
                  <p className="quiz-name">
                    {lessonTitles[`${q.course_id}:${q.quiz_id}`] || q.quiz_id}
                  </p>
                  <div className="quiz-meta">
                    <span>{q.attempts} attempts</span>
                    <span>Avg {q.avg_score}</span>
                  </div>
                  <div className={`pass-badge ${q.pass_rate >= 70 ? 'good' : q.pass_rate >= 40 ? 'mid' : 'low'}`}>
                    {q.pass_rate}% pass rate
                  </div>
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
            <div className="cert-grid">
              {certificates.map((c) => (
                <div className="cert-card" key={c.course_id}>
                  <p className="cert-num">{c.issued}</p>
                  <p className="cert-name">{courseTitles[c.course_id] || c.course_id}</p>
                </div>
              ))}
            </div>
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

        .stat-row {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .donut-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .quiz-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .quiz-card {
          background: var(--warm);
          border-radius: 12px;
          padding: 16px 18px;
        }
        .quiz-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 8px;
        }
        .quiz-meta {
          display: flex;
          gap: 14px;
          font-size: 0.78rem;
          color: var(--muted);
          margin-bottom: 10px;
        }
        .pass-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 999px;
        }
        .pass-badge.good {
          background: #dcfce7;
          color: #166534;
        }
        .pass-badge.mid {
          background: #fef9c3;
          color: #854d0e;
        }
        .pass-badge.low {
          background: #fee2e2;
          color: #991b1b;
        }

        .cert-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .cert-card {
          background: var(--teal-light);
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
        }
        .cert-num {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--rose-deep);
          margin-bottom: 4px;
        }
        .cert-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink);
        }

        @media (max-width: 700px) {
          .stat-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .donut-row,
          .quiz-grid,
          .cert-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>

      <style jsx>{`
        .stat-card {
          border-radius: 14px;
          padding: 20px 18px;
          text-align: center;
        }
        .stat-card.rose {
          background: var(--blush);
        }
        .stat-card.teal {
          background: var(--teal-light);
        }
        .stat-card.plum {
          background: var(--warm);
        }
        .stat-value {
          font-size: 1.9rem;
          font-weight: 800;
          color: var(--rose-deep);
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}

function DonutChart({ title, data, colors }) {
  const entries = Object.entries(data || {}).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (total === 0) {
    return (
      <div className="donut-card">
        <p className="donut-title">{title}</p>
        <p className="empty">No data yet.</p>
        <style jsx>{`
          .donut-card {
            background: var(--warm);
            border-radius: 14px;
            padding: 20px;
          }
          .donut-title {
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--ink);
            margin-bottom: 10px;
          }
          .empty {
            font-size: 0.85rem;
            color: var(--muted);
          }
        `}</style>
      </div>
    );
  }

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  let offsetAccum = 0;

  const arcs = entries.map(([label, value], i) => {
    const fraction = value / total;
    const dash = fraction * circumference;
    const arc = {
      label,
      value,
      color: colors[i % colors.length],
      dashArray: `${dash} ${circumference - dash}`,
      dashOffset: -offsetAccum,
    };
    offsetAccum += dash;
    return arc;
  });

  return (
    <div className="donut-card">
      <p className="donut-title">{title}</p>
      <div className="donut-body">
        <svg viewBox="0 0 120 120" className="donut-svg">
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth="18"
              strokeDasharray={arc.dashArray}
              strokeDashoffset={arc.dashOffset}
              transform="rotate(-90 60 60)"
            />
          ))}
        </svg>
        <ul className="donut-legend">
          {arcs.map((arc) => (
            <li key={arc.label}>
              <span className="dot" style={{ background: arc.color }} />
              {arc.label} ({arc.value})
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .donut-card {
          background: var(--warm);
          border-radius: 14px;
          padding: 20px;
        }
        .donut-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 14px;
        }
        .donut-body {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .donut-svg {
          width: 100px;
          height: 100px;
          flex-shrink: 0;
        }
        .donut-legend {
          list-style: none;
          font-size: 0.78rem;
          color: var(--ink);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .donut-legend li {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        @media (max-width: 420px) {
          .donut-body {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
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

      <style jsx>{`
        .bar-row {
          display: grid;
          grid-template-columns: 140px 1fr 36px;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
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
        @media (max-width: 600px) {
          .bar-row {
            grid-template-columns: 100px 1fr 30px;
          }
        }
      `}</style>
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
