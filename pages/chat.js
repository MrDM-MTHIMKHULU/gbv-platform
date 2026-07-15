import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi, I'm Jennet. I'm here to help with questions about abuse, your rights, or finding support in South Africa. What's on your mind?",
    },
  ]);
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
    <Layout>
      <Head>
        <title>Ask Jennet | SafeHaven</title>
        <meta
          name="description"
          content="Ask Jennet, SafeHaven's AI agent, anything about abuse, your rights, or finding support in South Africa."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Talk it through</p>
        <h1>Ask Jennet</h1>
        <p className="sub">
          Jennet is an AI agent, not a person and not a substitute for
          professional help. In an emergency, call{' '}
          <a href="tel:10111">10111</a> or the{' '}
          <a href="tel:0800428428">GBV Command Centre on 0800 428 428</a>.
        </p>
      </section>

      <section className="chat-wrap">
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
            placeholder="Type your question…"
            rows={1}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
          padding: 60px 24px 24px;
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
          margin-bottom: 14px;
          letter-spacing: -0.02em;
        }
        .sub {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 500px;
          margin: 0 auto;
        }
        .sub :global(a) {
          color: var(--rose-deep);
          font-weight: 700;
        }

        .chat-wrap {
          max-width: 640px;
          margin: 0 auto;
          padding: 0 24px 80px;
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
          max-width: 78%;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 0.92rem;
          line-height: 1.55;
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
