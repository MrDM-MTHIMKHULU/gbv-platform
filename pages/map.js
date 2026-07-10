import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';

export default function MapPage() {
  return (
    <Layout>
      <Head>
        <title>Find Help Near You | SafeHaven</title>
        <meta
          name="description"
          content="Search verified shelters, clinics, and legal aid offices across South Africa."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Find help near you</p>
        <h1>Verified shelters, clinics &amp; legal aid</h1>
        <p className="sub">
          Search by province and service type. Every listing includes a phone
          number and address — verified before it&apos;s added to this map.
        </p>
      </section>

      <section className="map-wrap">
        <iframe
          title="SafeHaven service map"
          src="https://datastudio.google.com/embed/reporting/40f1ad2b-8328-4089-9158-2be5908979b5/page/Nfb3F"
          width="100%"
          height="600"
          frameBorder="0"
          allowFullScreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </section>

      <section className="map-note">
        <p>
          Don&apos;t see a service near you, or notice something outdated?
          This directory is maintained by volunteers — accuracy matters, so
          please let us know if a listing needs updating.
        </p>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 40px;
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
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 18px;
          letter-spacing: -0.02em;
        }
        .sub {
          font-size: 1.02rem;
          line-height: 1.6;
          color: var(--muted);
          max-width: 500px;
          margin: 0 auto;
        }

        .map-wrap {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px 40px;
        }
        .map-wrap iframe {
          border-radius: 12px;
          border: 1px solid var(--sand);
        }

        .map-note {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 24px 90px;
          text-align: center;
        }
        .map-note p {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
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
