import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

// ---------------------------------------------------------------------------
// PLACEHOLDER CONTENT
// These are sample entries so you can see the layout in action. Replace the
// `file` field with a real path (e.g. '/library/know-your-rights.pdf') once
// you upload actual PDFs/ebooks, and the card will automatically become a
// working download instead of a "Coming soon" placeholder.
// ---------------------------------------------------------------------------
const CATEGORIES = [
  'All',
  'Understanding abuse',
  'Know your rights',
  'Safety planning',
  'Healing & recovery',
  'Digital safety',
];

const RESOURCES = [
  {
    id: 'r1',
    title: 'Is This Abuse? A Plain-Language Guide',
    type: 'eBook',
    category: 'Understanding abuse',
    description:
      'Recognising physical, emotional, financial, and digital abuse, in everyday language, with real-life examples.',
    length: '24 pages',
    languages: ['EN', 'ZU'],
    file: null,
  },
  {
    id: 'r2',
    title: 'Protection Orders, Step by Step',
    type: 'PDF',
    category: 'Know your rights',
    description:
      'How to apply for a protection order in South Africa, what it costs (nothing), and what happens in court.',
    length: '12 pages',
    languages: ['EN'],
    file: null,
  },
  {
    id: 'r3',
    title: 'Your Rights After Sexual Assault',
    type: 'PDF',
    category: 'Know your rights',
    description:
      'What to expect at a Thuthuzela Care Centre, your right to medical care without opening a case, and reporting options.',
    length: '8 pages',
    languages: ['EN', 'ZU', 'AF'],
    file: null,
  },
  {
    id: 'r4',
    title: 'Building a Safety Plan',
    type: 'eBook',
    category: 'Safety planning',
    description:
      'A guided workbook for preparing to leave safely: documents to gather, people to tell, and what to pack.',
    length: '18 pages',
    languages: ['EN', 'ZU'],
    file: null,
  },
  {
    id: 'r5',
    title: 'Covering Your Digital Tracks',
    type: 'PDF',
    category: 'Digital safety',
    description:
      'How to clear browser history, use Quick Exit, and keep devices from being monitored by an abuser.',
    length: '6 pages',
    languages: ['EN'],
    file: null,
  },
  {
    id: 'r6',
    title: 'After the Shelter: Rebuilding',
    type: 'eBook',
    category: 'Healing & recovery',
    description:
      'A gentle guide to trauma, counselling options, and practical first steps once you are safe.',
    length: '30 pages',
    languages: ['EN', 'SO'],
    file: null,
  },
  {
    id: 'r7',
    title: 'Talking to Children About Safety',
    type: 'PDF',
    category: 'Understanding abuse',
    description:
      'Age-appropriate ways to help children understand what is happening and that it is not their fault.',
    length: '10 pages',
    languages: ['EN', 'ZU'],
    file: null,
  },
  {
    id: 'r8',
    title: 'Free Legal Aid: What You Qualify For',
    type: 'PDF',
    category: 'Know your rights',
    description:
      'A breakdown of the means test and how to access free representation through Legal Aid SA.',
    length: '7 pages',
    languages: ['EN'],
    file: null,
  },
];

const LANG_LABEL = { EN: 'English', ZU: 'isiZulu', AF: 'Afrikaans', SO: 'Sesotho' };

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === activeCategory);

  return (
    <Layout>
      <Head>
        <title>Resource Library, SafeHaven</title>
        <meta
          name="description"
          content="Free guides, ebooks, and plain-language resources on gender-based violence, rights, and safety in South Africa."
        />
      </Head>

      <section className="hero">
        <p className="eyebrow">Resource Library</p>
        <h1>
          Read at your own pace,
          <span> keep what you need.</span>
        </h1>
        <p className="hero-desc">
          Free guides and ebooks you can read online, download, or save for
          later. Every resource is written in plain language, no legal
          jargon, no judgement.
        </p>
      </section>

      <div className="sample-banner">
        <strong>Sample layout.</strong> The titles below show how the library
        will look. Real PDFs and ebooks will be added soon.
      </div>

      <section className="filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      <section className="grid">
        {filtered.map((r) => (
          <article className="card" key={r.id}>
            <div className="card-top">
              <span className={`badge badge-${r.type.toLowerCase()}`}>{r.type}</span>
              <span className="card-length">{r.length}</span>
            </div>
            <h3 className="card-title">{r.title}</h3>
            <p className="card-desc">{r.description}</p>
            <div className="card-langs">
              {r.languages.map((l) => (
                <span className="lang-pill" key={l} title={LANG_LABEL[l]}>
                  {l}
                </span>
              ))}
            </div>
            <button className="card-btn" disabled={!r.file}>
              {r.file ? `Read ${r.type}` : 'Coming soon'}
            </button>
          </article>
        ))}
      </section>

      <style jsx>{`
        .hero {
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
          padding: 80px 24px 20px;
        }
        .eyebrow {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 18px;
        }
        .hero h1 {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          line-height: 1.2;
          color: var(--ink);
          margin-bottom: 18px;
          letter-spacing: -0.02em;
        }
        .hero h1 span {
          color: var(--rose-deep);
        }
        .hero-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 480px;
          margin: 0 auto;
        }

        .sample-banner {
          max-width: 700px;
          margin: 24px auto 0;
          background: var(--blush);
          color: var(--rose-deep);
          border-radius: 10px;
          padding: 12px 20px;
          font-size: 0.85rem;
          text-align: center;
        }
        .sample-banner strong {
          font-weight: 800;
        }

        .filters {
          max-width: 1000px;
          margin: 40px auto 0;
          padding: 0 24px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .filter-chip {
          background: var(--white);
          border: 1px solid var(--sand);
          color: var(--muted);
          font-size: 0.82rem;
          font-weight: 600;
          padding: 9px 18px;
          border-radius: 999px;
          cursor: pointer;
        }
        .filter-chip.active {
          background: var(--rose);
          border-color: var(--rose);
          color: white;
        }

        .grid {
          max-width: 1080px;
          margin: 36px auto 0;
          padding: 0 24px 90px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 22px;
        }

        .card {
          background: var(--white);
          border: 1px solid var(--sand);
          border-radius: 14px;
          padding: 22px;
          display: flex;
          flex-direction: column;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .badge {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .badge-pdf {
          background: var(--warm);
          color: var(--rose-deep);
        }
        .badge-ebook {
          background: var(--teal-light);
          color: #0e6e65;
        }
        .card-length {
          font-size: 0.75rem;
          color: var(--muted);
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .card-desc {
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--muted);
          margin-bottom: 16px;
          flex-grow: 1;
        }

        .card-langs {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
        }
        .lang-pill {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--muted);
          border: 1px solid var(--sand);
          border-radius: 6px;
          padding: 2px 7px;
        }

        .card-btn {
          background: var(--rose);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 11px 0;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .card-btn:disabled {
          background: var(--sand);
          color: var(--muted);
          cursor: not-allowed;
        }
      `}</style>
    </Layout>
  );
}
