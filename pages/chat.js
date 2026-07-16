import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import JennetChat from '../components/JennetChat';

export default function ChatPage() {
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
        <JennetChat />
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
