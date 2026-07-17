import { useState } from 'react';

export default function QuizBlock({ questions, passScore, onComplete, label = 'Quiz' }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const choose = (qIndex, optIndex) => {
    if (submitted) return;
    const next = [...answers];
    next[qIndex] = optIndex;
    setAnswers(next);
  };

  const allAnswered = answers.every((a) => a !== null);

  const submit = () => {
    if (!allAnswered) return;
    const score = questions.reduce(
      (sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0),
      0
    );
    const passed = score >= passScore;
    setSubmitted(true);
    onComplete({ score, total: questions.length, passed });
  };

  const retake = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  const score = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0),
    0
  );
  const passed = score >= passScore;

  return (
    <div className="quiz-block">
      <p className="quiz-label">{label}</p>

      {questions.map((q, qi) => (
        <div className="quiz-question" key={qi}>
          <p className="quiz-q-text">
            {qi + 1}. {q.q}
          </p>
          <div className="quiz-options">
            {q.options.map((opt, oi) => {
              let cls = 'quiz-option';
              if (submitted) {
                if (oi === q.correct) cls += ' correct';
                else if (oi === answers[qi]) cls += ' incorrect';
              } else if (answers[qi] === oi) {
                cls += ' selected';
              }
              return (
                <button
                  key={oi}
                  className={cls}
                  onClick={() => choose(qi, oi)}
                  disabled={submitted}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button className="quiz-submit" onClick={submit} disabled={!allAnswered}>
          Submit
        </button>
      ) : (
        <div className={`quiz-result ${passed ? 'passed' : 'failed'}`}>
          <p className="quiz-result-score">
            {score} / {questions.length}
          </p>
          <p className="quiz-result-label">
            {passed
              ? 'Passed. You can continue.'
              : `Not quite, you need ${passScore} or more to pass. Try again.`}
          </p>
          {!passed && (
            <button className="quiz-retake" onClick={retake}>
              Retake quiz
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .quiz-block {
          background: var(--warm);
          border-radius: 14px;
          padding: 24px;
          margin-top: 20px;
        }
        .quiz-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--rose);
          margin-bottom: 16px;
        }
        .quiz-question {
          margin-bottom: 20px;
        }
        .quiz-q-text {
          font-weight: 700;
          color: var(--ink);
          font-size: 0.92rem;
          margin-bottom: 10px;
        }
        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .quiz-option {
          text-align: left;
          background: white;
          border: 1.5px solid var(--sand);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.85rem;
          color: var(--ink);
          cursor: pointer;
        }
        .quiz-option.selected {
          border-color: var(--rose);
          background: var(--blush);
        }
        .quiz-option.correct {
          border-color: #0e6e65;
          background: var(--teal-light);
        }
        .quiz-option.incorrect {
          border-color: #c2410c;
          background: var(--blush);
        }
        .quiz-option:disabled {
          cursor: default;
        }
        .quiz-submit,
        .quiz-retake {
          background: var(--rose);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
        }
        .quiz-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .quiz-result {
          border-radius: 10px;
          padding: 16px 18px;
        }
        .quiz-result.passed {
          background: var(--teal-light);
        }
        .quiz-result.failed {
          background: var(--blush);
        }
        .quiz-result-score {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--ink);
        }
        .quiz-result-label {
          font-size: 0.88rem;
          color: var(--ink);
          margin: 6px 0 12px;
        }
      `}</style>
    </div>
  );
}
