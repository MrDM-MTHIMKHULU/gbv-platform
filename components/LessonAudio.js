import { useEffect, useRef, useState } from 'react';

const RATES = [0.75, 1, 1.25, 1.5];
const WPM_AT_1X = 155;

function splitSentences(text) {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);
}

export default function LessonAudio({ text }) {
  const [supported, setSupported] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [elapsedWords, setElapsedWords] = useState(0);

  const utteranceRef = useRef(null);
  const sentencesRef = useRef([]);
  const cumulativeWordsRef = useRef([]);
  const totalWordsRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    const sentences = splitSentences(text);
    sentencesRef.current = sentences;
    let running = 0;
    cumulativeWordsRef.current = sentences.map((s) => {
      const before = running;
      running += s.split(/\s+/).length;
      return before;
    });
    totalWordsRef.current = running;
    setElapsedWords(0);
    setPlaying(false);
    window.speechSynthesis.cancel();
  }, [text]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sentenceIndexFromWords = (words) => {
    const cum = cumulativeWordsRef.current;
    let idx = 0;
    for (let i = 0; i < cum.length; i++) {
      if (cum[i] <= words) idx = i;
    }
    return idx;
  };

  const speakFrom = (words) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const startIdx = sentenceIndexFromWords(words);
    const remaining = sentencesRef.current.slice(startIdx).join(' ');
    const u = new SpeechSynthesisUtterance(remaining);
    u.rate = rate;
    u.volume = muted ? 0 : 1;

    let wordsInThisUtterance = 0;
    const baseWords = cumulativeWordsRef.current[startIdx] || 0;

    u.onboundary = (e) => {
      if (e.name === 'word' || e.charIndex !== undefined) {
        wordsInThisUtterance += 1;
        setElapsedWords(baseWords + wordsInThisUtterance);
      }
    };
    u.onend = () => {
      setPlaying(false);
      setElapsedWords(totalWordsRef.current);
    };

    utteranceRef.current = u;
    synth.speak(u);
    setPlaying(true);
  };

  const togglePlay = () => {
    if (!supported) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      const startWords =
        elapsedWords >= totalWordsRef.current - 1 ? 0 : elapsedWords;
      speakFrom(startWords);
    }
  };

  const handleSeek = (e) => {
    if (!supported) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const targetWords = Math.round(pct * totalWordsRef.current);
    setElapsedWords(targetWords);
    if (playing) speakFrom(targetWords);
  };

  const changeRate = (r) => {
    setRate(r);
    setSettingsOpen(false);
    if (playing) speakFrom(elapsedWords);
  };

  const toggleMute = () => {
    setMuted((m) => !m);
    if (playing) speakFrom(elapsedWords);
  };

  if (!supported) return null;

  const totalWords = totalWordsRef.current || 1;
  const pct = Math.min(100, (elapsedWords / totalWords) * 100);
  const totalSec = Math.round((totalWords / WPM_AT_1X) * 60);
  const elapsedSec = Math.round((elapsedWords / totalWords) * totalSec);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="lesson-audio">
      <button className="play-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? '❚❚' : '▶'}
      </button>

      <span className="time">
        {fmt(elapsedSec)} / {fmt(totalSec)}
      </span>

      <div className="seek-track" onClick={handleSeek}>
        <div className="seek-fill" style={{ width: `${pct}%` }} />
      </div>

      <span className="rate-label">{rate}x</span>

      <button className="icon-btn" onClick={toggleMute} aria-label="Mute">
        {muted ? '🔇' : '🔊'}
      </button>

      <div className="settings-wrap">
        <button
          className="icon-btn"
          onClick={() => setSettingsOpen((o) => !o)}
          aria-label="Playback speed"
        >
          ⚙
        </button>
        {settingsOpen && (
          <div className="settings-menu">
            {RATES.map((r) => (
              <button
                key={r}
                className={`speed-option ${r === rate ? 'active' : ''}`}
                onClick={() => changeRate(r)}
              >
                {r}x
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .lesson-audio {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--blush);
          border: 1px solid var(--sand);
          border-radius: 999px;
          padding: 8px 16px;
          margin-bottom: 22px;
        }
        .play-btn {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          background: var(--rose);
          color: white;
          font-size: 0.75rem;
          cursor: pointer;
          flex-shrink: 0;
        }
        .time {
          font-size: 0.75rem;
          color: var(--muted);
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }
        .seek-track {
          flex: 1;
          height: 6px;
          background: var(--sand);
          border-radius: 4px;
          cursor: pointer;
          position: relative;
        }
        .seek-fill {
          height: 100%;
          background: var(--rose);
          border-radius: 4px;
        }
        .rate-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--muted);
          flex-shrink: 0;
        }
        .icon-btn {
          background: none;
          border: none;
          font-size: 0.9rem;
          cursor: pointer;
          flex-shrink: 0;
        }
        .settings-wrap {
          position: relative;
        }
        .settings-menu {
          position: absolute;
          bottom: 30px;
          right: 0;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 8px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 10;
        }
        .speed-option {
          background: none;
          border: none;
          padding: 8px 16px;
          font-size: 0.78rem;
          text-align: left;
          cursor: pointer;
          color: var(--ink);
        }
        .speed-option.active {
          background: var(--blush);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
