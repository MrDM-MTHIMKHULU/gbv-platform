import { useState, useRef, useEffect } from 'react';

const GREETING =
  "Hi, I'm Jennet. I'm here to help with questions about abuse, your rights, or finding support in South Africa. What's on your mind?";

export default function JennetChat({ compact = false }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([
          ...nextMessages,
          {
            role: 'assistant',
            content:
              "I'm having trouble responding right now. If this is urgent, please call the GBV Command Centre on 0800 428 428.",
          },
        ]);
      }
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting right now. If this is urgent, please call the GBV Command Centre on 0800 428 428.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`jennet-chat ${compact ? 'compact' : ''}`}>
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`bubble-row ${m.role}`}>
            <div className={`bubble ${m.role}`}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="bubble-row assistant">
            <div className="bubble assistant typing">Typing…</div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Jennet anything about GBV…"
          rows={1}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>

      <style jsx>{`
        .jennet-chat {
          width: 100%;
        }
        .chat-window {
          background: var(--warm);
          border-radius: 16px;
          padding: 24px;
          height: 420px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 14px;
        }
        .compact .chat-window {
          height: 280px;
          padding: 18px;
        }
        .bubble-row {
          display: flex;
        }
        .bubble-row.user {
          justify-content: flex-end;
        }
        .bubble-row.assistant {
          justify-content: flex-start;
        }
        .bubble {
          max-width: 82%;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 0.92rem;
          line-height: 1.55;
        }
        .compact .bubble {
          font-size: 0.85rem;
          padding: 10px 14px;
        }
        .bubble.user {
          background: var(--rose);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .bubble.assistant {
          background: white;
          color: var(--ink);
          border: 1px solid var(--sand);
          border-bottom-left-radius: 4px;
        }
        .bubble.typing {
          color: var(--muted);
          font-style: italic;
        }

        .chat-input-row {
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }
        textarea {
          flex: 1;
          resize: none;
          border: 1px solid var(--sand);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.92rem;
          font-family: inherit;
          max-height: 120px;
        }
        button {
          background: var(--rose);
          color: white;
          border: none;
          padding: 12px 22px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
