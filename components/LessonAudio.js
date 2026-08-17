import { useEffect, useRef, useState } from 'react';

const RATES = [0.75, 1, 1.25, 1.5];

export default function LessonAudio({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setErrored(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * duration;
    setCurrent(audio.currentTime);
  };

  const changeRate = (r) => {
    setRate(r);
    setSettingsOpen(false);
    if (audioRef.current) audioRef.current.playbackRate = r;
  };

  const toggleMute = () => {
    setMuted((m) => !m);
    if (audioRef.current) audioRef.current.muted = !muted;
  };

  if (errored) return null;

  const pct = duration ? (current / duration) * 100 : 0;
  const fmt = (s) => {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  return (
    <div className="lesson-audio">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setErrored(true)}
      />

      <button className="play-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? '❚❚' : '▶'}
      </button>

      <span className="time">
        {fmt(current)} / {fmt(duration)}
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
