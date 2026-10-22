import { useId } from 'react';
import { strapLeathers } from '../../data/strapDirections';

/** The two-part illustration stays readable in prerendered HTML and responds to the selected concept. */
export default function StrapPreview({ direction }) {
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const leather = strapLeathers.find(item => item.id === direction.leather) || strapLeathers[0];
  const stitch = direction.stitch === 'contrast' ? '#ead5ad' : leather.tonalStitch;
  const metal = direction.hardware === 'brass' ? ['#5b4425','#f3d99b','#9d783d','#e5c580','#71512a'] : ['#4a5351','#f4f3e8','#79827e','#e1e5df','#5a6360'];
  const leatherId = `${prefix}-leather`;
  const metalId = `${prefix}-metal`;
  const shineId = `${prefix}-shine`;
  const shadowId = `${prefix}-shadow`;

  return <svg viewBox="0 0 600 680" role="img" aria-label={`${leather.name} illustrative two-part leather watch strap with ${direction.stitch === 'contrast' ? 'contrast' : 'tonal'} stitching and a ${direction.hardware === 'brass' ? 'warm brass' : 'brushed steel'} buckle`} className="h-auto w-full max-w-[540px] overflow-visible" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={leatherId} x1="0" x2="1"><stop stopColor={leather.dark}/><stop offset=".12" stopColor={leather.base}/><stop offset=".48" stopColor={leather.light}/><stop offset=".86" stopColor={leather.base}/><stop offset="1" stopColor={leather.dark}/></linearGradient>
      <linearGradient id={metalId} x1="0" y1="0" x2="1" y2="1"><stop stopColor={metal[0]}/><stop offset=".2" stopColor={metal[1]}/><stop offset=".43" stopColor={metal[2]}/><stop offset=".7" stopColor={metal[3]}/><stop offset="1" stopColor={metal[4]}/></linearGradient>
      <linearGradient id={shineId} x1="0" x2="1"><stop stopColor="#fff" stopOpacity=".16"/><stop offset=".45" stopColor="#fff" stopOpacity=".02"/><stop offset="1" stopColor="#000" stopOpacity=".2"/></linearGradient>
      <filter id={shadowId} x="-80%" y="-30%" width="280%" height="190%"><feDropShadow dx="16" dy="28" stdDeviation="18" floodColor="#2e271f" floodOpacity=".29"/></filter>
    </defs>
    <g filter={`url(#${shadowId})`}>
      <g transform="translate(115 165) rotate(-9 55 150)">
        <path d="M0 0 Q55 -5 110 0 L104 285 Q53 306 6 285 Z" fill={`url(#${leatherId})`} stroke={leather.dark} strokeWidth="2"/>
        <path d="M0 0 Q55 -5 110 0 L104 285 Q53 306 6 285 Z" fill={`url(#${shineId})`}/>
        <path d="M10 12 L16 272 Q55 289 94 272 L101 12" fill="none" stroke={stitch} strokeWidth="2" strokeDasharray="4.5 3.5" opacity=".94"/>
        <rect x="-2" y="-40" width="114" height="62" rx="10" fill="none" stroke={`url(#${metalId})`} strokeWidth="12"/>
        <path d="M55 -37 L55 20" stroke={`url(#${metalId})`} strokeWidth="7" strokeLinecap="round"/>
        <rect x="0" y="52" width="110" height="25" rx="4" fill={`url(#${leatherId})`} stroke={leather.dark} strokeWidth="2"/>
        <rect x="0" y="94" width="110" height="23" rx="4" fill={`url(#${leatherId})`} stroke={leather.dark} strokeWidth="2"/>
        <path d="M8 57 H102 M8 99 H102" stroke="#fff" strokeOpacity=".12"/>
      </g>
      <g transform="translate(347 115) rotate(9 55 205)">
        <path d="M0 0 Q55 -5 110 0 L102 368 Q83 399 54 433 Q24 400 8 368 Z" fill={`url(#${leatherId})`} stroke={leather.dark} strokeWidth="2"/>
        <path d="M0 0 Q55 -5 110 0 L102 368 Q83 399 54 433 Q24 400 8 368 Z" fill={`url(#${shineId})`}/>
        <path d="M10 12 L18 364 Q37 392 54 416 Q76 390 93 363 L101 12" fill="none" stroke={stitch} strokeWidth="2" strokeDasharray="4.5 3.5" opacity=".94"/>
        {[151,177,203,229,255,281,307,333].map(y => <g key={y}><ellipse cx="55" cy={y} rx="4.1" ry="5.1" fill={leather.dark}/><ellipse cx="55" cy={y+1} rx="2.4" ry="3.2" fill="#171714" opacity=".8"/></g>)}
      </g>
    </g>
  </svg>;
}
