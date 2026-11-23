/** Fondos de foto, coordenadas 0 0 1600 1200. Sin texto ni recursos externos. */
import type { ReactNode } from 'react';

const W = 1600, H = 1200;
const O = { stroke: '#3b2147', strokeWidth: 4, strokeLinejoin: 'round' as const };

function Stops({ c }: { c: string[] }) {
  return <>{c.map((x, i) => <stop key={i} offset={c.length === 1 ? 0 : i / (c.length - 1)} stopColor={x} />)}</>;
}
const Lin = ({ id, c, v = true }: { id: string; c: string[]; v?: boolean }) => (
  <linearGradient id={id} x1="0" y1="0" x2={v ? '0' : '1'} y2={v ? '1' : '0'}><Stops c={c} /></linearGradient>
);
const Rad = ({ id, c }: { id: string; c: string[] }) => (
  <radialGradient id={id} cx="0.5" cy="0.5" r="0.5"><Stops c={c} /></radialGradient>
);
const star = (x: number, y: number, r: number) => {
  const k = r * 0.25;
  return `M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z`;
};
const cloud = (x: number, y: number, s: number, fill: string) => (
  <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="20" rx="110" ry="34" fill={fill} /><circle cx="-40" cy="-6" r="42" fill={fill} />
    <circle cx="20" cy="-24" r="52" fill={fill} /><circle cx="70" cy="4" r="36" fill={fill} />
    <ellipse cx="-10" cy="-30" rx="26" ry="12" fill="#fff" opacity="0.7" />
  </g>
);
const flower = (x: number, y: number, r: number, petal: string, i: number) => (
  <g key={i} transform={`translate(${x} ${y})`}>
    {[0, 72, 144, 216, 288].map((a) => (
      <ellipse key={a} cx="0" cy={-r} rx={r * 0.55} ry={r * 0.8} fill={petal} {...O} strokeWidth={2.5} transform={`rotate(${a})`} />
    ))}
    <circle r={r * 0.6} fill="#ffd23f" {...O} strokeWidth={2.5} /><circle cx={-r * 0.2} cy={-r * 0.2} r={r * 0.2} fill="#fff" opacity="0.7" />
  </g>
);

export function BgDefault() {
  return (
    <g>
      <defs>
        <Lin id="sc-def-a" c={['#ffd6ee', '#f1dcff', '#d4f6ff']} />
        <Rad id="sc-def-b" c={['#ffffff', '#ffffff00']} />
      </defs>
      <rect width={W} height={H} fill="url(#sc-def-a)" />
      <circle cx="800" cy="560" r="560" fill="url(#sc-def-b)" opacity="0.8" />
      {[[200, 200, 60, '#fff'], [1400, 260, 80, '#ffe3f3'], [300, 800, 90, '#fff'], [1350, 840, 70, '#efe1ff'], [120, 520, 40, '#ffd23f'], [1480, 560, 46, '#ff8ac6']].map(([x, y, r, f], i) => (
        <circle key={i} cx={x as number} cy={y as number} r={r as number} fill={f as string} opacity="0.7" />
      ))}
      {[[260, 360, 36], [1300, 400, 44], [420, 980, 30], [1230, 1010, 36], [700, 140, 26]].map(([x, y, r], i) => (
        <path key={i} d={star(x, y, r)} fill="#fff" opacity="0.95" />
      ))}
      <ellipse cx="800" cy="1090" rx="380" ry="60" fill="#ff8ac6" opacity="0.35" />
    </g>
  );
}

export function BgRunway() {
  const lights = Array.from({ length: 9 }, (_, i) => 120 + i * 170);
  return (
    <g>
      <defs>
        <Lin id="sc-run-a" c={['#2b1450', '#5b2a8f', '#c23fa0']} />
        <Lin id="sc-run-f" c={['#ffe3f3', '#ff8ac6', '#c23fa0']} />
        <Lin id="sc-run-c" c={['#ff2d95', '#a3135f']} v={false} />
        <radialGradient id="sc-run-s" cx="0.5" cy="0" r="1"><stop offset="0" stopColor="#fff6c8" stopOpacity="0.95" /><stop offset="1" stopColor="#fff6c8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sc-run-a)" />
      <rect x="0" y="0" width="300" height={H} fill="url(#sc-run-c)" />
      <rect x="1300" y="0" width="300" height={H} fill="url(#sc-run-c)" />
      {[60, 140, 220, 1380, 1460, 1540].map((x) => <path key={x} d={`M${x} 0Q${x + 20} 600 ${x} 1100`} stroke="#ffb3dc" strokeWidth="6" fill="none" opacity="0.5" />)}
      <polygon points="800,0 400,1100 1200,1100" fill="url(#sc-run-s)" opacity="0.8" />
      <polygon points="300,0 60,1000 560,1000" fill="url(#sc-run-s)" opacity="0.45" />
      <polygon points="1300,0 1040,1000 1540,1000" fill="url(#sc-run-s)" opacity="0.45" />
      {lights.map((x, i) => <g key={x}><circle cx={x} cy="60" r="20" fill={['#ffd23f', '#ff8ac6', '#22d3c5'][i % 3]} {...O} strokeWidth={3} /><circle cx={x - 6} cy="54" r="6" fill="#fff" opacity="0.8" /></g>)}
      <path d="M250 1200L420 760H1180L1350 1200Z" fill="url(#sc-run-f)" {...O} />
      <path d="M420 760H1180L1220 820H380Z" fill="#fff" opacity="0.5" />
      <path d="M800 760V1200" stroke="#fff" strokeWidth="6" strokeDasharray="30 30" opacity="0.6" />
      {[[520, 900], [1080, 920], [700, 1000], [900, 840]].map(([x, y], i) => <path key={i} d={star(x, y, 28)} fill="#fff" opacity="0.9" />)}
    </g>
  );
}

export function BgGarden() {
  return (
    <g>
      <defs>
        <Lin id="sc-gar-a" c={['#7fd8ff', '#c9f1ff', '#f4fff0']} />
        <Lin id="sc-gar-g" c={['#7be08a', '#2fbf4a', '#1f9b3e']} />
        <Lin id="sc-gar-h" c={['#5fd36f', '#2a9f45']} />
      </defs>
      <rect width={W} height={H} fill="url(#sc-gar-a)" />
      <circle cx="1350" cy="180" r="110" fill="#fff6a8" opacity="0.5" /><circle cx="1350" cy="180" r="70" fill="#ffd23f" {...O} />
      <circle cx="1325" cy="155" r="18" fill="#fff" opacity="0.7" />
      {cloud(300, 220, 1.2, '#fff')}{cloud(820, 130, 0.9, '#fff')}
      <path d="M0 700Q200 560 420 680T860 650T1280 670T1600 620V1200H0Z" fill="url(#sc-gar-h)" {...O} />
      <path d="M0 860Q300 780 700 850T1600 820V1200H0Z" fill="url(#sc-gar-g)" {...O} />
      {[[140, 800, 38, '#ff5fb0'], [320, 930, 46, '#ffd23f'], [1420, 830, 40, '#ff6f61'], [1250, 960, 52, '#9b4dff'], [230, 1080, 50, '#fff'], [1480, 1100, 46, '#ff8ac6'], [60, 960, 34, '#3a8bff'], [1100, 1100, 40, '#ffd23f'], [420, 780, 30, '#fff'], [1360, 740, 28, '#ff5fb0']].map(([x, y, r, c], i) => (
        <g key={i}><path d={`M${x} ${(y as number) + (r as number)}V${(y as number) + 90}`} stroke="#1f9b3e" strokeWidth="8" strokeLinecap="round" />{flower(x as number, y as number, r as number, c as string, i)}</g>
      ))}
      <g transform="translate(1000 560)">
        <ellipse cx="0" cy="0" rx="22" ry="12" fill="#ffd23f" {...O} strokeWidth={3} /><ellipse cx="-24" cy="-16" rx="22" ry="14" fill="#ff8ac6" {...O} strokeWidth={3} transform="rotate(-30 -24 -16)" /><ellipse cx="24" cy="-16" rx="22" ry="14" fill="#ff8ac6" {...O} strokeWidth={3} transform="rotate(30 24 -16)" />
      </g>
    </g>
  );
}

export function BgBeach() {
  return (
    <g>
      <defs>
        <Lin id="sc-bea-a" c={['#4cc3ff', '#a8e6ff', '#fff3c4']} />
        <Lin id="sc-bea-w" c={['#22d3c5', '#2f9bff']} />
        <Lin id="sc-bea-s" c={['#fff0b8', '#ffd98a', '#f2b866']} />
      </defs>
      <rect width={W} height={H} fill="url(#sc-bea-a)" />
      <circle cx="260" cy="200" r="120" fill="#ffd23f" {...O} /><circle cx="226" cy="168" r="30" fill="#fff" opacity="0.6" />
      {cloud(900, 200, 1.1, '#fff')}{cloud(1350, 330, 0.8, '#fff')}
      <rect y="560" width={W} height="300" fill="url(#sc-bea-w)" />
      <path d="M0 640Q100 610 200 640T400 640T600 640T800 640T1000 640T1200 640T1400 640T1600 640" stroke="#fff" strokeWidth="8" fill="none" opacity="0.7" />
      <path d="M0 730Q100 700 200 730T400 730T600 730T800 730T1000 730T1200 730T1400 730T1600 730" stroke="#fff" strokeWidth="8" fill="none" opacity="0.5" />
      <path d="M0 830Q200 770 420 830T860 820T1280 830T1600 800V1200H0Z" fill="url(#sc-bea-s)" {...O} />
      <path d="M0 830Q200 770 420 830T860 820T1280 830T1600 800" stroke="#fff" strokeWidth="14" fill="none" opacity="0.8" />
      <g transform="translate(1320 820)">
        <path d="M0 0V-300" stroke="#8a5a33" strokeWidth="14" strokeLinecap="round" />
        <path d="M-210 -250Q0 -420 210 -250Q0 -300 -210 -250Z" fill="#ff2d95" {...O} /><path d="M-70 -310Q-20 -340 0 -300Q-40 -290 -70 -310Z" fill="#fff" opacity="0.6" />
        <path d="M-210 -250Q-120 -300 0 -300Q-100 -270 -150 -240Z" fill="#ffd23f" {...O} strokeWidth={3} />
      </g>
      <g transform="translate(240 980)">
        <path d="M-70 0Q-70 -80 0 -80T70 0Z" fill="#ff8ac6" {...O} />
        <path d="M0 -80L-30 0M0 -80L30 0M0 -80V0" stroke="#fff" strokeWidth="5" opacity="0.7" />
        <path d="M-18 -92Q0 -118 18 -92Z" fill="#ffd23f" {...O} strokeWidth={3} />
      </g>
      <g transform="translate(1100 1050)"><path d={star(0, 0, 50).replace(/Q/g, 'L')} fill="#ff6f61" {...O} /><circle cx="0" cy="0" r="10" fill="#fff" opacity="0.7" /></g>
      <path d="M1200 920a20 12 0 1 0 0.1 0Z" fill="#fff" opacity="0.5" />
    </g>
  );
}

export function BgCastle() {
  const tower = (x: number, w: number, top: number, roof: string, i: number) => (
    <g key={i}>
      <rect x={x} y={top} width={w} height={1000 - top} fill="url(#sc-cas-w)" {...O} />
      <path d={`M${x - 14} ${top}L${x + w / 2} ${top - 150}L${x + w + 14} ${top}Z`} fill={roof} {...O} />
      <path d={`M${x + w / 2} ${top - 150}V${top - 210}`} stroke="#3b2147" strokeWidth="5" /><path d={`M${x + w / 2} ${top - 210}l50 14l-50 14Z`} fill="#ff2d95" {...O} strokeWidth={3} />
      <path d={`M${x + w / 2 - 14} ${top + 80}a14 14 0 0 1 28 0V${top + 130}h-28Z`} fill="#6b3fa8" {...O} strokeWidth={3} />
    </g>
  );
  return (
    <g>
      <defs>
        <Lin id="sc-cas-a" c={['#7d6bff', '#e39bff', '#ffd6ee']} />
        <Lin id="sc-cas-w" c={['#fff3fb', '#ffd6ee', '#f0a6d6']} v={false} />
        <Lin id="sc-cas-g" c={['#7be08a', '#2fbf4a']} />
      </defs>
      <rect width={W} height={H} fill="url(#sc-cas-a)" />
      {[[200, 160], [500, 90], [1100, 130], [1400, 220], [760, 220], [90, 360]].map(([x, y], i) => <path key={i} d={star(x, y, 22 + (i % 3) * 8)} fill="#fff" opacity="0.9" />)}
      {cloud(180, 420, 0.9, '#ffffffcc')}{cloud(1420, 480, 1, '#ffffffcc')}
      {tower(130, 190, 520, '#9b4dff', 0)}{tower(1280, 190, 520, '#9b4dff', 1)}{tower(380, 170, 430, '#ff2d95', 2)}{tower(1050, 170, 430, '#ff2d95', 3)}
      <rect x="300" y="640" width="1000" height="360" fill="url(#sc-cas-w)" {...O} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={300 + i * 100} y="610" width="50" height="40" fill="#ffd6ee" {...O} strokeWidth={3} />)}
      <path d="M690 1000V830a110 110 0 0 1 220 0V1000Z" fill="#8a4fd8" {...O} /><path d="M800 720V1000" stroke="#3b2147" strokeWidth="4" />
      <path d="M800 640l24 50h-48Z" fill="#ffd23f" {...O} strokeWidth={3} />
      <path d="M0 960Q400 900 800 960T1600 940V1200H0Z" fill="url(#sc-cas-g)" {...O} />
      {[[100, 1060], [1500, 1080], [320, 1130], [1280, 1120]].map(([x, y], i) => flower(x, y, 26, ['#ff5fb0', '#ffd23f', '#fff', '#9b4dff'][i], i))}
    </g>
  );
}

export function BgStars() {
  const pts = Array.from({ length: 34 }, (_, i) => [(i * 211) % 1560 + 20, (i * 137) % 1000 + 30, 8 + ((i * 7) % 5) * 6] as const);
  return (
    <g>
      <defs>
        <Lin id="sc-sta-a" c={['#120a3d', '#3b1a7a', '#8a3fb8']} />
        <Rad id="sc-sta-m" c={['#fffbe0', '#ffe9a0', '#ffd23f']} />
        <Rad id="sc-sta-g" c={['#c28bff66', '#c28bff00']} />
      </defs>
      <rect width={W} height={H} fill="url(#sc-sta-a)" />
      <circle cx="800" cy="600" r="620" fill="url(#sc-sta-g)" />
      {pts.map(([x, y, r], i) => <path key={i} d={star(x, y, r)} fill={['#fff', '#ffe9a0', '#bfe3ff', '#ffc2e6'][i % 4]} opacity={0.6 + (i % 4) * 0.1} />)}
      <circle cx="1330" cy="260" r="130" fill="url(#sc-sta-m)" /><circle cx="1380" cy="230" r="120" fill="#3b1a7a" opacity="0.0" />
      <path d="M1250 200a130 130 0 1 0 130 130a100 100 0 0 1 -130 -130Z" fill="#fff6c0" opacity="0.0" />
      <circle cx="1295" cy="225" r="22" fill="#f2c45a" opacity="0.5" /><circle cx="1365" cy="305" r="14" fill="#f2c45a" opacity="0.5" />
      <path d="M0 1010Q400 940 800 1010T1600 990V1200H0Z" fill="#5a2a9e" {...O} /><path d="M0 1010Q400 940 800 1010T1600 990" stroke="#c9a1ff" strokeWidth="8" fill="none" opacity="0.7" />
      {cloud(200, 1020, 1, '#c9a1ff')}{cloud(1400, 1050, 1.1, '#e0c4ff')}
      <path d="M180 360Q420 260 560 120" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      <path d={star(180, 360, 40)} fill="#fff" />
    </g>
  );
}

export function BgRainbow() {
  const cols = ['#ff3b5c', '#ff9a1f', '#ffd21f', '#3ddc84', '#3a8bff', '#9b4dff'];
  return (
    <g>
      <defs><Lin id="sc-rai-a" c={['#8fdcff', '#d4f6ff', '#fff0fa']} /><Lin id="sc-rai-g" c={['#7be08a', '#2fbf4a']} /></defs>
      <rect width={W} height={H} fill="url(#sc-rai-a)" />
      {cols.map((c, i) => <path key={c} d={`M${60 + i * 36} 1000A${740 - i * 36} ${740 - i * 36} 0 0 1 ${1540 - i * 36} 1000`} stroke={c} strokeWidth="38" fill="none" />)}
      <path d="M80 940A720 720 0 0 1 800 270" stroke="#fff" strokeWidth="10" fill="none" opacity="0.35" strokeLinecap="round" />
      {cloud(160, 1010, 1.6, '#fff')}{cloud(1440, 1010, 1.6, '#fff')}
      <path d="M0 1050Q400 990 800 1050T1600 1030V1200H0Z" fill="url(#sc-rai-g)" {...O} />
      {[[300, 1120], [1300, 1130], [600, 1150], [1000, 1150]].map(([x, y], i) => flower(x, y, 26, ['#ff5fb0', '#ffd23f', '#9b4dff', '#fff'][i], i))}
      {[[260, 250, 30], [1350, 200, 36], [800, 130, 26], [1450, 520, 24]].map(([x, y, r], i) => <path key={i} d={star(x, y, r)} fill="#ffd23f" {...O} strokeWidth={3} />)}
      {cloud(400, 220, 0.8, '#fff')}{cloud(1150, 330, 0.7, '#fff')}
    </g>
  );
}

export function BgBedroom() {
  return (
    <g>
      <defs>
        <Lin id="sc-bed-w" c={['#ffd6ee', '#ffb8e0']} />
        <Lin id="sc-bed-f" c={['#e8b98a', '#c98f5e']} />
        <Lin id="sc-bed-b" c={['#c9a1ff', '#9b4dff']} />
      </defs>
      <rect width={W} height="860" fill="url(#sc-bed-w)" />
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={100 + i * 190} cy={80 + (i % 2) * 70} r="14" fill="#fff" opacity="0.5" />)}
      <rect y="860" width={W} height="340" fill="url(#sc-bed-f)" /><path d="M0 860H1600" stroke="#3b2147" strokeWidth="4" />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${i * 400} 860L${i * 400 - 200} 1200`} stroke="#a8754a" strokeWidth="3" opacity="0.6" />)}
      <rect x="130" y="160" width="330" height="380" rx="26" fill="#9be3ff" {...O} /><rect x="160" y="190" width="270" height="320" rx="14" fill="url(#sc-bed-b)" opacity="0" />
      <rect x="160" y="190" width="270" height="320" rx="14" fill="#c4f0ff" /><path d="M295 190V510M160 350H430" stroke="#fff" strokeWidth="12" /><circle cx="360" cy="260" r="36" fill="#ffd23f" opacity="0.9" />
      <path d="M130 160Q295 260 460 160" fill="#ff8ac6" {...O} opacity="0.9" />
      <g transform="translate(1160 460)">
        <rect x="0" y="120" width="400" height="260" rx="20" fill="url(#sc-bed-b)" {...O} /><rect x="0" y="60" width="60" height="400" rx="16" fill="#ff2d95" {...O} />
        <rect x="60" y="120" width="330" height="80" rx="18" fill="#fff" {...O} /><path d="M70 220H400V380H70Z" fill="#ffd23f" {...O} opacity="0.95" />
        {[100, 180, 260, 340].map((x) => <circle key={x} cx={x} cy="300" r="14" fill="#ff8ac6" />)}
        <circle cx="30" cy="40" r="22" fill="#ffd23f" {...O} />
      </g>
      <g transform="translate(120 700)"><path d="M0 0h260v40H0z" fill="#fff" {...O} /><path d="M10 40v120M250 40v120" stroke="#3b2147" strokeWidth="8" />
        <circle cx="60" cy="-30" r="34" fill="#ff8a1f" {...O} /><circle cx="60" cy="-30" r="22" fill="#fff" opacity="0.3" /><circle cx="170" cy="-24" r="28" fill="#22d3c5" {...O} /></g>
      <ellipse cx="800" cy="1050" rx="420" ry="90" fill="#ff8ac6" {...O} opacity="0.9" /><ellipse cx="800" cy="1050" rx="300" ry="58" fill="#ffd6ee" />
      <path d="M1340 140l12 24 26 4-19 18 5 26-24-13-24 13 5-26-19-18 26-4Z" fill="#ffd23f" {...O} strokeWidth={3} />
      <path d="M760 40V160" stroke="#3b2147" strokeWidth="4" /><path d="M700 160H820l-12 50H712Z" fill="#fff3a8" {...O} />
    </g>
  );
}

export function BgParty() {
  const cols = ['#ff2d95', '#ffd23f', '#22d3c5', '#9b4dff', '#3a8bff', '#ff8a1f'];
  const balloon = (x: number, y: number, c: string, i: number) => (
    <g key={i}><path d={`M${x} ${y + 70}Q${x + 20} ${y + 200} ${x - 10} ${y + 330}`} stroke="#3b2147" strokeWidth="3" fill="none" opacity="0.6" />
      <ellipse cx={x} cy={y} rx="52" ry="66" fill={c} {...O} /><path d={`M${x - 8} ${y + 66}l8 12l8 -12Z`} fill={c} {...O} strokeWidth={3} />
      <ellipse cx={x - 18} cy={y - 24} rx="10" ry="20" fill="#fff" opacity="0.6" transform={`rotate(20 ${x - 18} ${y - 24})`} /></g>
  );
  return (
    <g>
      <defs><Lin id="sc-par-a" c={['#ff8ac6', '#ffd6ee', '#fff3b8']} /><Lin id="sc-par-f" c={['#c9a1ff', '#9b4dff']} /></defs>
      <rect width={W} height={H} fill="url(#sc-par-a)" />
      <path d="M0 60Q400 200 800 60T1600 60" stroke="#3b2147" strokeWidth="4" fill="none" />
      {Array.from({ length: 12 }, (_, i) => { const x = 60 + i * 135; const y = 60 + Math.sin(i * 0.9) * 0 + (i % 2 ? 80 : 120) ; return <path key={i} d={`M${x} ${y - 40}l50 0l-25 70Z`} fill={cols[i % 6]} {...O} strokeWidth={3} />; })}
      {[[150, 330], [330, 400], [1270, 340], [1450, 410], [90, 640], [1520, 650]].map(([x, y], i) => balloon(x, y, cols[i % 6], i))}
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i * 197) % 1560 + 10} y={(i * 113) % 900 + 120} width="16" height="8" rx="3" fill={cols[i % 6]} transform={`rotate(${i * 37} ${(i * 197) % 1560 + 18} ${(i * 113) % 900 + 124})`} opacity="0.85" />)}
      <path d="M0 960Q400 900 800 960T1600 940V1200H0Z" fill="url(#sc-par-f)" {...O} />
      <g transform="translate(1180 880)"><rect width="260" height="130" rx="14" fill="#fff" {...O} /><rect y="-60" width="260" height="60" rx="14" fill="#ff8ac6" {...O} />
        <path d="M0 0q32 30 65 0t65 0t65 0t65 0" fill="#fff" {...O} strokeWidth={3} />
        {[50, 130, 210].map((x) => <g key={x}><rect x={x - 5} y="-100" width="10" height="40" fill="#22d3c5" {...O} strokeWidth={3} /><path d={`M${x} -134q-14 18 0 30q14 -12 0 -30Z`} fill="#ffd23f" {...O} strokeWidth={3} /></g>)}</g>
      <g transform="translate(180 920)"><rect width="150" height="130" rx="10" fill="#22d3c5" {...O} /><rect x="62" width="26" height="130" fill="#ffd23f" {...O} strokeWidth={3} />
        <path d="M75 0q-60 -50 -20 -60q30 0 20 60q10 -60 40 -60q40 10 -20 60Z" fill="#ff2d95" {...O} strokeWidth={3} /></g>
      {[[700, 180, 30], [940, 240, 26], [820, 100, 34]].map(([x, y, r], i) => <path key={i} d={star(x, y, r)} fill="#fff" />)}
    </g>
  );
}

export const BACKGROUND_LIST: { id: string; Component: () => ReactNode; swatch: string }[] = [
  { id: 'bg-default', Component: BgDefault, swatch: '#ffd6ee' },
  { id: 'bg-runway', Component: BgRunway, swatch: '#c23fa0' },
  { id: 'bg-garden', Component: BgGarden, swatch: '#7be08a' },
  { id: 'bg-beach', Component: BgBeach, swatch: '#4cc3ff' },
  { id: 'bg-castle', Component: BgCastle, swatch: '#e39bff' },
  { id: 'bg-stars', Component: BgStars, swatch: '#3b1a7a' },
  { id: 'bg-rainbow', Component: BgRainbow, swatch: '#8fdcff' },
  { id: 'bg-bedroom', Component: BgBedroom, swatch: '#ffb8e0' },
  { id: 'bg-party', Component: BgParty, swatch: '#ffd23f' },
];
