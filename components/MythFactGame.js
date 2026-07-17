import { useState } from 'react';

const ITEMS = [
  {
    statement: 'Jealousy is a sign of love.',
    answer: 'myth',
    explanation:
      'Healthy relationships are built on trust, not on controlling behaviour. Jealousy is often a sign of insecurity or a need for control, not affection.',
  },
  {
    statement: 'Abuse is always physical.',
    answer: 'myth',
    explanation:
      'Emotional, verbal, financial, and psychological abuse can be just as damaging as physical abuse, and often happen first.',
  },
  {
    statement: 'A person can withdraw consent at any point, even during.',
    answer: 'fact',
    explanation:
      'Consent is ongoing. It can be withdrawn at any time, for any reason, no matter what was agreed to earlier.',
  },
  {
    statement: 'If someone doesn\'t leave, it means the abuse isn\'t that bad.',
    answer: 'myth',
    explanation:
      'Leaving is often the most dangerous time in an abusive relationship. People stay for many real reasons: safety, finances, children, and fear.',
  },
  {
    statement: 'Controlling someone\'s money or access to work can be a form of abuse.',
    answer: 'fact',
    explanation:
      'This is called financial abuse, and it\'s one of the most common ways abusers isolate and trap a partner.',
  },
  {
    statement: 'Only women experience gender-based violence.',
    answer: 'myth',
    explanation:
      'GBV affects people of all genders, though women and girls are disproportionately affected in South Africa.',
  },
  {
    statement: 'A protection order is only for physical violence.',
    answer: 'myth',
    explanation:
      'Under South Africa\'s Domestic Violence Act, protection orders also cover emotional, verbal, financial abuse, harassment, and stalking.',
  },
];

export default function MythFactGame() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const item = ITEMS[index];

  const choose = (choice) => {
    if (selected) return;
    setSelected(choice);
    if (choice === item.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= ITEMS.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="myth-game">
        <p className="result-score">
          {score} / {ITEMS.length}
        </p>
        <p className="result-label">
          {score === ITEMS.length
            ? 'Perfect score! You know your stuff.'
            : score >= ITEMS.length / 2
            ? 'Good instincts. A few worth a second look.'
            : 'Worth going through these again, myths like these are common.'}
        </p>
        <button className="restart-btn" onClick={restart}>
          Play again
        </button>
        <style jsx>{gameStyles}</style>
      </div>
    );
  }

  return (
    <div className="myth-game">
      <p className="progress-label">
        {index + 1} of {ITEMS.length}
      </p>
      <p className="statement">&ldquo;{item.statement}&rdquo;</p>

      {!selected ? (
        <div className="choice-row">
          <button className="choice-btn myth" onClick={() => choose('myth')}>
            Myth
          </button>
          <button className="choice-btn fact" onClick={() => choose('fact')}>
            Fact
          </button>
        </div>
      ) : (
        <div className={`feedback ${selected === item.answer ? 'correct' : 'incorrect'}`}>
          <p className="feedback-title">
            {selected === item.answer ? 'Correct!' : `Actually, that's a ${item.answer}.`}
          </p>
          <p className="feedback-text">{item.explanation}</p>
          <button className="next-btn" onClick={next}>
            {index + 1 >= ITEMS.length ? 'See results' : 'Next'}
          </button>
        </div>
      )}

      <style jsx>{gameStyles}</style>
    </div>
  );
}

const gameStyles = `
  .myth-game {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 16px;
    padding: 28px;
    max-width: 480px;
  }
  .progress-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--rose);
    margin-bottom: 16px;
  }
  .statement {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.5;
    margin-bottom: 24px;
  }
  .choice-row {
    display: flex;
    gap: 12px;
  }
  .choice-btn {
    flex: 1;
    padding: 14px;
    border-radius: 10px;
    border: 1.5px solid var(--sand);
    background: var(--warm);
    font-weight: 700;
    font-size: 0.92rem;
    color: var(--ink);
    cursor: pointer;
  }
  .choice-btn:hover {
    border-color: var(--rose);
  }
  .feedback {
    border-radius: 12px;
    padding: 18px 20px;
  }
  .feedback.correct {
    background: var(--teal-light);
  }
  .feedback.incorrect {
    background: var(--blush);
  }
  .feedback-title {
    font-weight: 800;
    color: var(--ink);
    margin-bottom: 8px;
  }
  .feedback-text {
    font-size: 0.9rem;
    color: var(--ink);
    line-height: 1.6;
    margin-bottom: 16px;
  }
  .next-btn,
  .restart-btn {
    background: var(--rose);
    color: white;
    border: none;
    padding: 10px 22px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 0.88rem;
    cursor: pointer;
  }
  .result-score {
    font-size: 2.4rem;
    font-weight: 800;
    color: var(--rose-deep);
    text-align: center;
  }
  .result-label {
    text-align: center;
    color: var(--muted);
    font-size: 0.92rem;
    margin: 10px 0 20px;
  }
  .restart-btn {
    display: block;
    margin: 0 auto;
  }
`;
