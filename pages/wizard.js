import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';

const STEPS = [
  {
    key: 'danger',
    question: 'Are you in immediate danger right now?',
    options: [
      { value: 'yes', label: 'Yes, right now' },
      { value: 'no', label: 'No, but I need help' },
    ],
  },
  {
    key: 'relationship',
    question: 'What is your relationship to this person?',
    options: [
      { value: 'partner', label: 'Spouse, partner, or ex-partner' },
      { value: 'family', label: 'Family member' },
      { value: 'household', label: 'Someone I live with' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    key: 'abuseType',
    question: 'What kind of abuse are you experiencing?',
    options: [
      { value: 'physical', label: 'Physical' },
      { value: 'emotional', label: 'Emotional, verbal, or financial' },
      { value: 'sexual', label: 'Sexual' },
      { value: 'stalking', label: 'Stalking or controlling behaviour' },
    ],
  },
  {
    key: 'children',
    question: 'Are children involved in your situation?',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    key: 'need',
    question: 'What kind of help are you looking for right now?',
    options: [
      { value: 'order', label: 'A protection order' },
      { value: 'leave', label: 'Help leaving safely' },
      { value: 'advice', label: 'Legal advice for my situation' },
      { value: 'info', label: 'Just information, for now' },
    ],
  },
];

export default function WizardPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value) => {
    const key = STEPS[step].key;
    const next = { ...answers, [key]: value };
    setAnswers(next);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setStep(0);
    setShowResults(false);
  };

  return (
    <Layout>
      <Head>
        <title>Legal Rights Wizard | SafeHaven</title>
        <meta
          name="description"
          content="Answer a few questions to get guidance tailored to your situation."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Legal rights wizard</p>
        <h1>
          {showResults ? 'Here&apos;s what applies to your situation' : 'A few questions, to guide you'}
        </h1>
        {!showResults && (
          <p className="sub">
            This takes about a minute. Nothing you answer here is saved or
            sent anywhere — it only exists in your browser right now.
          </p>
        )}
      </section>

      {!showResults ? (
        <section className="wizard">
          <div className="progress">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              />
            ))}
          </div>

          <div className="question-card">
            <p className="question-num">
              Question {step + 1} of {STEPS.length}
            </p>
            <h2>{STEPS[step].question}</h2>
            <div className="options">
              {STEPS[step].options.map((opt) => (
                <button
                  key={opt.value}
                  className="option-btn"
                  onClick={() => handleAnswer(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {step > 0 && (
              <button className="back-btn" onClick={handleBack}>
                ← Back
              </button>
            )}
          </div>
        </section>
      ) : (
        <ResultsScreen answers={answers} onRestart={handleRestart} />
      )}

      <style jsx>{`
        .page-header {
          max-width: 680px;
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
          margin-bottom: 18px;
        }
        .page-header h1 {
          font-size: clamp(1.7rem, 3.6vw, 2.4rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        .sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 460px;
          margin: 0 auto;
        }

        .wizard {
          max-width: 560px;
          margin: 0 auto;
          padding: 30px 24px 100px;
        }
        .progress {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--sand);
        }
        .dot.active {
          background: var(--rose);
          width: 22px;
          border-radius: 4px;
        }
        .dot.done {
          background: var(--rose-deep);
        }

        .question-card {
          background: var(--warm);
          border-radius: 16px;
          padding: 36px 28px;
        }
        .question-num {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--rose-deep);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        .question-card h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 24px;
          line-height: 1.35;
        }
        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .option-btn {
          background: white;
          border: 1px solid var(--sand);
          border-radius: 10px;
          padding: 16px 18px;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
        }
        .option-btn:hover {
          border-color: var(--rose);
          background: var(--blush);
        }
        .back-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 20px;
          cursor: pointer;
          padding: 0;
        }
      `}</style>
    </Layout>
  );
}

function ResultsScreen({ answers, onRestart }) {
  const recommendations = buildRecommendations(answers);

  return (
    <section className="results">
      {answers.danger === 'yes' && (
        <div className="danger-banner">
          <p className="danger-title">If you can, prioritise your safety right now</p>
          <div className="danger-contacts">
            <a href="tel:10111">SAPS 10111</a>
            <a href="tel:0800428428">GBV Command Centre 0800 428 428</a>
          </div>
        </div>
      )}

      <div className="rec-list">
        {recommendations.map((rec) => (
          <div className="rec-card" key={rec.title}>
            <p className="rec-title">{rec.title}</p>
            <p className="rec-text">{rec.text}</p>
            {rec.link && (
              <Link href={rec.link.href} className="rec-link">
                {rec.link.label} →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="results-actions">
        <Link href="/support" className="btn-primary">Talk to someone</Link>
        <button className="btn-secondary" onClick={onRestart}>
          Start over
        </button>
      </div>

      <style jsx>{`
        .results {
          max-width: 640px;
          margin: 0 auto;
          padding: 30px 24px 100px;
        }
        .danger-banner {
          background: var(--rose-deep);
          color: white;
          border-radius: 14px;
          padding: 22px 24px;
          margin-bottom: 28px;
          text-align: center;
        }
        .danger-title {
          font-weight: 700;
          margin-bottom: 12px;
        }
        .danger-contacts {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .danger-contacts a {
          color: white;
          font-weight: 800;
          font-size: 1.05rem;
          text-decoration: none;
        }

        .rec-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 36px;
        }
        .rec-card {
          background: var(--warm);
          border-radius: 12px;
          padding: 22px 22px;
        }
        .rec-title {
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 8px;
          font-size: 1.02rem;
        }
        .rec-text {
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--muted);
          margin-bottom: 10px;
        }
        .rec-link {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--rose-deep);
          text-decoration: none;
        }

        .results-actions {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .results-actions :global(.btn-primary) {
          background: var(--rose);
          color: white;
          padding: 14px 28px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          border-radius: 8px;
        }
        .btn-secondary {
          background: none;
          border: 1px solid var(--sand);
          color: var(--ink);
          padding: 14px 28px;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}

function buildRecommendations(answers) {
  const recs = [];

  if (answers.need === 'order' || answers.relationship) {
    recs.push({
      title: 'You likely qualify for a protection order',
      text: 'Under South African law, this covers spouses, partners, ex-partners, family members, and people you share a home or child with — go to the Magistrate\u2019s Court nearest you and ask for the Clerk of the Court. It\u2019s free, and an interim order can often be granted the same day.',
      link: { href: '/rights', label: 'See the full step-by-step process' },
    });
  }

  if (answers.children === 'yes') {
    recs.push({
      title: 'Custody protection may also apply',
      text: 'If children are involved, you may be able to include custody-related protections as part of your application, or pursue this separately through the Family Advocate\u2019s office.',
      link: { href: '/rights', label: 'Learn about your options' },
    });
  }

  if (answers.need === 'leave') {
    recs.push({
      title: 'If you\u2019re planning to leave',
      text: 'Where possible, keep copies of important documents (ID, children\u2019s papers) somewhere safe, let one trusted person know your plan, and consider contacting a shelter in advance so they know to expect you.',
      link: { href: '/map', label: 'Find a shelter near you' },
    });
  }

  if (answers.need === 'advice' || answers.abuseType) {
    recs.push({
      title: 'Get free legal advice',
      text: 'Legal Aid South Africa offers free advice on your specific situation, including whether a protection order, divorce, or criminal charge makes sense for you.',
      link: { href: '/support', label: 'See contact details' },
    });
  }

  if (answers.need === 'info') {
    recs.push({
      title: 'Understand what you\u2019re experiencing',
      text: 'It can help to first understand whether what\u2019s happening fits a recognised pattern of abuse — this isn\u2019t about needing a label, just information.',
      link: { href: '/about-abuse', label: 'Read about types of abuse' },
    });
  }

  if (recs.length === 0) {
    recs.push({
      title: 'Talk to someone who can guide you',
      text: 'Every situation is different — a free call to Legal Aid or the GBV Command Centre can help you figure out the right next step for you specifically.',
      link: { href: '/support', label: 'See who to contact' },
    });
  }

  return recs;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
