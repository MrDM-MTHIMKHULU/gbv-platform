import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import { HOTSPOTS_2020, CURRENT_HOTSPOTS } from '../lib/gbvData';

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

      <section className="hotspots">
        <p className="eyebrow center">Known GBV hotspot areas</p>
        <h2>Is your area a known hotspot?</h2>
        <p className="hotspots-sub">
          Officially designated 22 September 2020 by government&apos;s
          Inter-Ministerial Committee on GBVF, based on FY2019/20 data. This
          designation was last confirmed still in effect in May 2022 — treat
          it as a standing list rather than a live ranking.
        </p>

        <div className="hotspot-groups">
          {Object.entries(HOTSPOTS_2020).map(([province, stations]) => (
            <details className="hotspot-group" key={province}>
              <summary>
                {province} <span className="count">({stations.length})</span>
              </summary>
              <ul>
                {stations.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="current-note">
          <p className="current-title">
            Currently highest case-volume stations for rape
          </p>
          <p className="current-sub">
            SAPS Q3 2024/25 (Oct–Dec 2024) — a live proxy pending an updated
            official list. Overlaps substantially with the stations above.
          </p>
          <ol className="current-list">
            {CURRENT_HOTSPOTS.Rape.slice(0, 5).map((h) => (
              <li key={h.station}>
                {h.station} <span>— {h.province}</span>
              </li>
            ))}
          </ol>
        </div>
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
        .eyebrow.center {
          text-align: center;
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
          padding: 0 24px 40px;
          text-align: center;
        }
        .map-note p {
          font-size: 0.9rem;
          color: var(--muted);
          line-height: 1.6;
        }

        .hotspots {
          max-width: 700px;
          margin: 0 auto;
          padding: 50px 24px 100px;
          border-top: 1px solid var(--sand);
        }
        .hotspots h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--ink);
          text-align: center;
          margin-bottom: 14px;
        }
        .hotspots-sub {
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.6;
          text-align: center;
          max-width: 560px;
          margin: 0 auto 32px;
        }

        .hotspot-groups {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 40px;
        }
        .hotspot-group {
          background: var(--warm);
          border-radius: 10px;
          padding: 14px 18px;
        }
        .hotspot-group summary {
          cursor: pointer;
          font-weight: 700;
          color: var(--ink);
          font-size: 0.92rem;
        }
        .hotspot-group .count {
          color: var(--muted);
          font-weight: 400;
        }
        .hotspot-group ul {
          margin: 12px 0 0;
          padding-left: 20px;
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.9;
        }

        .current-note {
          background: var(--blush);
          border-radius: 12px;
          padding: 22px 24px;
        }
        .current-title {
          font-weight: 800;
          color: var(--ink);
          font-size: 0.95rem;
          margin-bottom: 6px;
        }
        .current-sub {
          font-size: 0.8rem;
          color: var(--muted);
          line-height: 1.55;
          margin-bottom: 14px;
        }
        .current-list {
          padding-left: 20px;
          font-size: 0.88rem;
          color: var(--ink);
          line-height: 1.8;
        }
        .current-list span {
          color: var(--muted);
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
