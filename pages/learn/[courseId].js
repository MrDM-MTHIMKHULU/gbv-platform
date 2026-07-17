import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';
import { COURSES } from '../../lib/courseData';

export default function CoursePage() {
  const router = useRouter();
  const { courseId } = router.query;
  const [user, setUser] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [activeLesson, setActiveLesson] = useState(null);
  const [saving, setSaving] = useState(false);

  const course = COURSES.find((c) => c.id === courseId);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user && courseId) loadProgress(data.user.id, courseId);
    });
  }, [courseId]);

  useEffect(() => {
    if (course && !activeLesson) setActiveLesson(course.lessons[0].id);
  }, [course]);

  const loadProgress = async (userId, cId) => {
    const { data } = await supabase
      .from('course_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('course_id', cId);
    setCompleted(new Set((data || []).map((r) => r.lesson_id)));
  };

  const markComplete = async (lessonId) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSaving(true);
    await supabase.from('course_progress').upsert({
      user_id: user.id,
      course_id: courseId,
      lesson_id: lessonId,
    });
    setCompleted((prev) => new Set(prev).add(lessonId));
    setSaving(false);
  };

  if (!course) {
    return (
      <Layout>
        <section className="page-header">
          <h1>Course not found</h1>
          <Link href="/learn">Back to Learning Hub</Link>
        </section>
      </Layout>
    );
  }

  const lesson = course.lessons.find((l) => l.id === activeLesson) || course.lessons[0];
  const isDone = completed.has(lesson.id);
  const doneCount = completed.size;

  return (
    <Layout>
      <Head>
        <title>{course.title} | SafeHaven</title>
        <meta name="description" content={course.tagline} />
      </Head>

      <section className="page-header">
        <p className="eyebrow">
          <Link href="/learn">Learning hub</Link> / {course.title}
        </p>
        <h1>{course.title}</h1>
        <p className="sub">{course.tagline}</p>
        {!user && (
          <p className="login-note">
            <Link href="/login">Log in</Link> to save your progress.
          </p>
        )}
      </section>

      <section className="course-layout">
        <aside className="lesson-list">
          {course.lessons.map((l, i) => (
            <button
              key={l.id}
              className={`lesson-item ${activeLesson === l.id ? 'active' : ''}`}
              onClick={() => setActiveLesson(l.id)}
            >
              <span className="lesson-num">
                {completed.has(l.id) ? '✓' : i + 1}
              </span>
              <span>{l.title}</span>
            </button>
          ))}
          <p className="progress-summary">
            {doneCount} of {course.lessons.length} complete
          </p>
        </aside>

        <div className="lesson-body">
          <h2>{lesson.title}</h2>
          {lesson.content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}

          <button
            className={`complete-btn ${isDone ? 'done' : ''}`}
            onClick={() => markComplete(lesson.id)}
            disabled={isDone || saving}
          >
            {isDone ? 'Completed' : 'Mark as complete'}
          </button>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px 30px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .eyebrow :global(a) {
          color: var(--rose);
        }
        .page-header h1 {
          font-size: clamp(1.7rem, 3.6vw, 2.3rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 12px;
        }
        .sub {
          font-size: 0.95rem;
          color: var(--muted);
        }
        .login-note {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 14px;
        }
        .login-note :global(a) {
          color: var(--rose-deep);
          font-weight: 700;
        }

        .course-layout {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 24px 100px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 40px;
        }
        .lesson-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .lesson-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: none;
          border: none;
          text-align: left;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--muted);
          cursor: pointer;
        }
        .lesson-item.active {
          background: var(--blush);
          color: var(--ink);
        }
        .lesson-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--sand);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .lesson-item.active .lesson-num {
          background: var(--rose);
          color: white;
        }
        .progress-summary {
          font-size: 0.78rem;
          color: var(--muted);
          margin-top: 12px;
          padding: 0 12px;
        }

        .lesson-body h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
        }
        .lesson-body p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .complete-btn {
          background: var(--rose);
          color: white;
          border: none;
          padding: 12px 26px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          margin-top: 10px;
        }
        .complete-btn.done {
          background: var(--teal);
          cursor: default;
        }
        .complete-btn:disabled {
          opacity: 0.7;
        }

        @media (max-width: 700px) {
          .course-layout {
            grid-template-columns: 1fr;
          }
          .lesson-list {
            flex-direction: row;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: COURSES.map((c) => ({ params: { courseId: c.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ locale, params }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
