/**
 * Procedural garment artwork.
 * Every seed product ships with generated SVG "studio shots" so the store looks complete
 * with zero image hosting. In the admin, paste real image URLs to replace them.
 */

const cache = new Map();

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  const mix = (c) => Math.round((t - c) * p + c);
  return `#${((1 << 24) + (mix(r) << 16) + (mix(g) << 8) + mix(b)).toString(16).slice(1)}`;
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parts(type, view, c) {
  const front = view !== 'back';
  switch (type) {
    case 'dropshoulder': {
      const n = front ? 172 : 120;
      return {
        body: `M206 96 L96 130 L28 300 L108 322 L140 262 L140 646 L460 646 L460 262 L492 322 L572 300 L504 130 L394 96 Q300 ${n} 206 96 Z`,
        neck: `M206 96 Q300 ${n} 394 96`,
        hem: 626,
        hx: [148, 452],
        extra: '',
      };
    }
    case 'polo': {
      const n = front ? 150 : 118;
      const placket = front
        ? `<rect x="288" y="168" width="24" height="120" rx="3" fill="${c.rib}" stroke="${c.outline}" stroke-width="1.5"/>
           <circle cx="300" cy="192" r="4.5" fill="${c.line}" fill-opacity=".6"/>
           <circle cx="300" cy="230" r="4.5" fill="${c.line}" fill-opacity=".6"/>
           <circle cx="300" cy="268" r="4.5" fill="${c.line}" fill-opacity=".6"/>`
        : '';
      return {
        body: `M200 92 L118 128 L52 236 L128 272 L166 222 L166 640 L434 640 L434 222 L472 272 L548 236 L482 128 L400 92 Q300 ${n} 200 92 Z`,
        neck: `M200 92 Q300 ${n} 400 92`,
        hem: 620,
        hx: [174, 426],
        extra: `${placket}
          <path d="M194 88 L268 98 L300 178 L250 152 Z" fill="${c.rib}" stroke="${c.outline}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M406 88 L332 98 L300 178 L350 152 Z" fill="${c.rib}" stroke="${c.outline}" stroke-width="2" stroke-linejoin="round"/>
          <path d="M60 232 L132 264 M540 232 L468 264" stroke="${c.rib}" stroke-width="10" stroke-linecap="round"/>`,
      };
    }
    case 'hoodie': {
      const n = front ? 190 : 130;
      const hoodInner = front
        ? `<path d="M222 108 C214 54 386 54 378 108 Q300 178 222 108 Z" fill="${c.shadow}" stroke="${c.outline}" stroke-width="1.5"/>
           <path d="M276 176 L272 262 M324 176 L328 262" stroke="${c.line}" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
           <circle cx="272" cy="266" r="4" fill="${c.line}" fill-opacity=".6"/><circle cx="328" cy="266" r="4" fill="${c.line}" fill-opacity=".6"/>
           <path d="M212 470 L388 470 L414 566 L186 566 Z" fill="none" stroke="${c.outline}" stroke-width="2.5" stroke-linejoin="round"/>`
        : `<path d="M226 112 C222 70 378 70 374 112" fill="none" stroke="${c.outline}" stroke-width="2"/>`;
      return {
        body: `M200 104 L112 142 L46 430 L118 446 L162 262 L162 624 L438 624 L438 262 L482 446 L554 430 L488 142 L400 104 Q300 ${n} 200 104 Z`,
        neck: `M200 104 Q300 ${n} 400 104`,
        hem: 604,
        hx: [170, 430],
        pre: `<path d="M196 108 C176 14 424 14 404 108 Q300 ${n} 196 108 Z" fill="${c.rib}" stroke="${c.outline}" stroke-width="2.5" stroke-linejoin="round"/>`,
        extra: `${hoodInner}
          <path d="M48 424 L120 440 M552 424 L480 440" stroke="${c.rib}" stroke-width="12" stroke-linecap="round"/>`,
      };
    }
    case 'jacket': {
      const zip = front
        ? `<path d="M300 122 L300 660" stroke="#c9c9c9" stroke-width="5" stroke-dasharray="2 4"/>
           <rect x="292" y="112" width="16" height="22" rx="4" fill="#d9d9d9"/>
           <rect x="186" y="470" width="58" height="104" rx="8" fill="none" stroke="${c.outline}" stroke-width="2.5"/>
           <rect x="356" y="470" width="58" height="104" rx="8" fill="none" stroke="${c.outline}" stroke-width="2.5"/>`
        : '';
      return {
        body: `M224 88 L116 134 L52 470 L124 486 L166 250 L166 660 L434 660 L434 250 L476 486 L548 470 L484 134 L376 88 Q300 124 224 88 Z`,
        neck: `M224 88 Q300 124 376 88`,
        hem: 640,
        hx: [174, 426],
        extra: `${zip}
          <path d="M224 88 L262 58 L338 58 L376 88 L340 146 L300 122 L260 146 Z" fill="${c.rib}" stroke="${c.outline}" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M54 462 L126 478 M546 462 L474 478" stroke="${c.rib}" stroke-width="12" stroke-linecap="round"/>`,
      };
    }
    case 'tshirt':
    default: {
      const n = front ? 170 : 118;
      return {
        body: `M200 92 L118 128 L52 236 L128 272 L166 222 L166 640 L434 640 L434 222 L472 272 L548 236 L482 128 L400 92 Q300 ${n} 200 92 Z`,
        neck: `M200 92 Q300 ${n} 400 92`,
        hem: 620,
        hx: [174, 426],
        extra: `<path d="M60 232 L132 264 M540 232 L468 264" stroke="${c.rib}" stroke-width="8" stroke-linecap="round" opacity=".7"/>`,
      };
    }
  }
}

function buildSvg({ type, color, view, graphic }) {
  const dark = luminance(color) < 0.22;
  const c = {
    outline: shade(color, dark ? 0.38 : -0.32),
    rib: shade(color, dark ? 0.16 : -0.12),
    shadow: shade(color, -0.55),
    line: dark ? '#ffffff' : '#000000',
  };
  const p = parts(type, view, c);
  const flat = view === 'flat';
  const bg1 = flat ? '#e6e2d8' : '#3b3b3b';
  const bg2 = flat ? '#b7b2a6' : '#131313';
  const vb = view === 'detail' ? '150 40 300 360' : '0 0 600 720';
  const tx = view === 'detail' ? 0.24 : 0.1;
  const front = view !== 'back';

  const chestGraphic =
    graphic && front && view !== 'detail'
      ? `<g transform="translate(300 320)">
           <circle r="54" fill="none" stroke="#D4AF37" stroke-width="3"/>
           <circle r="44" fill="none" stroke="#D4AF37" stroke-opacity=".5" stroke-width="1"/>
           <text y="14" text-anchor="middle" font-family="Georgia, serif" font-size="38" fill="#D4AF37">TW</text>
         </g>`
      : '';
  const detailGraphic =
    graphic && view === 'detail'
      ? `<g transform="translate(300 250)"><circle r="40" fill="none" stroke="#D4AF37" stroke-width="3"/><text y="12" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#D4AF37">TW</text></g>`
      : '';
  const backLabel = !front
    ? `<text x="300" y="${type === 'hoodie' ? 156 : 146}" text-anchor="middle" font-family="Georgia, serif" font-size="12" fill="${c.line}" fill-opacity=".55">TrioW</text>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="600" height="720">
<defs>
  <radialGradient id="bg" gradientUnits="userSpaceOnUse" cx="300" cy="260" r="520"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></radialGradient>
  <linearGradient id="sh" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset=".28" stop-color="#000" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient>
  <pattern id="tx" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#000" stroke-opacity="${tx}" stroke-width="2"/></pattern>
  <filter id="bl" x="-30%" y="-300%" width="160%" height="700%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="bs"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<rect x="-600" y="-720" width="1800" height="2160" fill="url(#bg)"/>
<ellipse cx="300" cy="684" rx="190" ry="14" fill="#000" fill-opacity="${flat ? 0.25 : 0.55}" filter="url(#bl)"/>
${p.pre || ''}
<path d="${p.body}" fill="${color}" stroke="${c.outline}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="${p.body}" fill="url(#tx)"/>
<path d="${p.body}" fill="url(#sh)"/>
<g stroke="#000" stroke-opacity=".16" stroke-width="8" fill="none" stroke-linecap="round" filter="url(#bs)">
  <path d="M212 330 Q242 420 216 520"/><path d="M392 300 Q366 400 388 500"/>
</g>
<path d="${p.neck}" fill="none" stroke="${c.rib}" stroke-width="14" stroke-linecap="round"/>
<path d="${p.neck}" fill="none" stroke="${c.outline}" stroke-width="1.5" transform="translate(0 7)" stroke-opacity=".7"/>
${p.extra}
<path d="M${p.hx[0]} ${p.hem} L${p.hx[1]} ${p.hem}" stroke="${c.line}" stroke-opacity=".28" stroke-width="2" stroke-dasharray="6 5" fill="none"/>
${chestGraphic}${detailGraphic}${backLabel}
</svg>`;
}

export function garmentImage({ type = 'tshirt', color = '#1f1f1f', view = 'front', graphic = false }) {
  const key = `${type}|${color}|${view}|${graphic}`;
  if (cache.has(key)) return cache.get(key);
  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildSvg({ type, color, view, graphic }))}`;
  cache.set(key, uri);
  return uri;
}

export const VIEWS = ['front', 'back', 'detail', 'flat'];

/** Real URLs win; otherwise four generated studio views. */
export function getProductImages(product) {
  const custom = (product.images || []).filter(Boolean);
  if (custom.length) return custom;
  return VIEWS.map((view) =>
    garmentImage({ type: product.art || 'tshirt', color: product.color || '#1f1f1f', view, graphic: !!product.graphic })
  );
}
