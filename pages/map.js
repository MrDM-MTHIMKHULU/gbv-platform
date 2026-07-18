import dynamic from 'next/dynamic';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';

// Leaflet needs the browser (window/document), so this must never render
// on the server. ssr: false handles that.
const SheltersMap = dynamic(() => import('../components/SheltersMap'), {
  ssr: false,
  loading: () => <p className="map-loading">Loading map…</p>,
});

export default function MapPage() {
  return (
    <Layout>
      <Head>
        <title>Find Help Near You | SafeHaven</title>
        <meta
          name="description"
          content="Search verified shelters, clinics, and legal aid offices across South Africa, and see known GBV hotspot areas."
        />
      </Head>

      <section className="page-header">
        <p className="eyebrow">Find help near you</p>
        <h1>Verified shelters, clinics &amp; legal aid</h1>
        <p className="sub">
          Search by province, or tap &quot;Find shelters near me&quot; to sort
          by distance. Amber pins mark known GBV hotspot areas.
        </p>
      </section>

      <section className="map-section">
        <SheltersMap />
      </section>

      <section className="map-note">
        <p>
          Don&apos;t see a service near you, or notice something outdated?
          This directory is maintained by volunteers, accuracy matters, so
          please let us know if a listing needs updating.
        </p>
      </section>

      <section className="hotspots-note">
        <p className="hotspots-title">About the hotspot markers</p>
        <p className="hotspots-text">
          Amber pins combine two sources: the 30 GBVF hotspot stations
          officially designated on 22 September 2020 by government&apos;s
          Inter-Ministerial Committee (based on FY2019/20 data, last
          confirmed still in effect May 2022), and the current top-ranked
          stations by case volume from SAPS&apos;s Q3 2024/25 report. Tap a
          pin to see which category applies to that area.
        </p>
      </section>

      <style jsx>{`
        .page-header {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: 70px 24px 30px;
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
          max-width: 520px;
          margin: 0 auto;
        }

        .map-section {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px 30px;
        }
        :global(.map-loading) {
          text-align: center;
          padding: 60px;
          color: var(--muted);
        }

        .map-note {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 24px 30px;
          text-align: center;
        }
        .map-note p {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
        }

        .hotspots-note {
          max-width: 700px;
          margin: 0 auto;
          padding: 30px 24px 100px;
          border-top: 1px solid var(--sand);
        }
        .hotspots-title {
          font-weight: 800;
          color: var(--ink);
          font-size: 0.95rem;
          margin-bottom: 10px;
          text-align: center;
        }
        .hotspots-text {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.65;
          text-align: center;
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
