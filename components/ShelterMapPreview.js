// A lightweight, static preview for the homepage: an approximate South
// African silhouette with a scatter of dots suggesting where shelters and
// services are spread across the country. It is explicitly illustrative,
// not a real map, so it carries no Leaflet bundle, no tile requests, and
// no Supabase query. The real, verified, filterable map lives at /map.
//
// Coordinates for both the outline and the dots were hand-projected from
// approximate longitude/latitude, they are stylised for recognisability,
// not survey-accurate. That's fine here because the caption says so.

const DOTS = [
  { x: 85, y: 368, label: 'Cape Town area' },
  { x: 194, y: 370, label: 'George area' },
  { x: 279, y: 369, label: 'Gqeberha area' },
  { x: 330, y: 340, label: 'East London area' },
  { x: 365, y: 306, label: 'Mthatha area' },
  { x: 425, y: 259, label: 'Durban area' },
  { x: 409, y: 252, label: 'Pietermaritzburg area' },
  { x: 295, y: 239, label: 'Bloemfontein area' },
  { x: 256, y: 229, label: 'Kimberley area' },
  { x: 161, y: 221, label: 'Upington area' },
  { x: 345, y: 160, label: 'Johannesburg area' },
  { x: 349, y: 148, label: 'Pretoria area' },
  { x: 323, y: 146, label: 'Rustenburg area' },
  { x: 280, y: 151, label: 'Mahikeng area' },
  { x: 424, y: 141, label: 'Nelspruit area' },
  { x: 383, y: 98, label: 'Polokwane area' },
];

const SA_OUTLINE =
  'M33.5,222.5 L71.3,330.5 L84.8,376.4 L128,392.6 L184.7,373.7 L279.2,368.3 ' +
  'L341.3,344 L398,290 L425,260.3 L452,222.5 L476.3,176.6 L449.3,141.5 ' +
  'L433.1,57.8 L381.8,52.4 L335.9,63.2 L263,146.9 L144.2,122.6 L125.3,219.8 Z';

export default function ShelterMapPreview() {
  return (
    <div className="shelter-map-preview">
      <svg viewBox="0 0 500 420" role="img" aria-label="Illustrative map of shelter coverage across South Africa">
        <path d={SA_OUTLINE} className="sa-outline" />
        {DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r="6" className="sa-dot">
            <title>{d.label}</title>
          </circle>
        ))}
      </svg>
      <p className="preview-caption">
        Illustrative, not exact locations. See the full interactive map for
        verified addresses.
      </p>

      <style jsx>{`
        .shelter-map-preview {
          width: 100%;
          padding: 24px 24px 18px;
          background: var(--warm);
        }
        svg {
          width: 100%;
          height: auto;
          display: block;
        }
        .sa-outline {
          fill: var(--teal-light);
          stroke: var(--ink);
          stroke-opacity: 0.15;
          stroke-width: 2;
        }
        .sa-dot {
          fill: var(--rose);
          stroke: white;
          stroke-width: 1.5;
        }
        .preview-caption {
          margin-top: 12px;
          font-size: 0.72rem;
          color: var(--muted);
          text-align: center;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
