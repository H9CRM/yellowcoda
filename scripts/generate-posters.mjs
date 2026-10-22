import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public/posters');
await mkdir(out, { recursive: true });
const formats = { square:1080, portrait:1350, story:1920 };
const campaigns = [
  { slug:'fit', eyebrow:'THE FIT EDIT', lines:['A better fit','starts here.'], copy:'YOUR WATCH. YOUR WRIST. YOUR STRAP.', bg:'#EDE9DF', ink:'#17231D', accent:'#A47B43', leather:'#8F5D3D', line:'#D0C9B9' },
  { slug:'colour', eyebrow:'THE COLOUR STUDY', lines:['A new colour.','A new view.'], copy:'A STRAP DIRECTION FOR A FAMILIAR WATCH.', bg:'#17231D', ink:'#F7F2E7', accent:'#D3B66D', leather:'#A7643C', line:'#566158' },
  { slug:'personal', eyebrow:'MADE PERSONAL', lines:['Small details.','A different feel.'], copy:'EXPLORE THE LEATHER. DISCUSS THE FINISH.', bg:'#D9C08C', ink:'#17231D', accent:'#FFF3D2', leather:'#4D382C', line:'#AA8D59' }
];

function poster(c, height) {
  const story = height === 1920;
  const artY = story ? 1120 : height === 1350 ? 870 : 730;
  const artScale = story ? 1.25 : height === 1350 ? .95 : .70;
  const headlineY = story ? 300 : 260;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="${height}" viewBox="0 0 1080 ${height}" role="img" aria-labelledby="title desc">
<title id="title">${c.lines.join(' ')} — YellowCada campaign poster</title><desc id="desc">Original editorial poster with an illustrated leather watch strap, clear typography and YellowCada branding.</desc>
<defs><linearGradient id="leather" x2="1" y2="1"><stop stop-color="${c.leather}"/><stop offset=".55" stop-color="${c.leather}"/><stop offset="1" stop-color="#261D19"/></linearGradient><radialGradient id="glow"><stop stop-color="${c.accent}" stop-opacity=".26"/><stop offset="1" stop-color="${c.accent}" stop-opacity="0"/></radialGradient></defs>
<rect width="1080" height="${height}" fill="${c.bg}"/><circle cx="800" cy="${artY}" r="490" fill="url(#glow)"/>
<path d="M80 74H1000" stroke="${c.line}" stroke-width="2"/><text x="80" y="128" fill="${c.ink}" font-family="Arial,sans-serif" font-size="26" font-weight="700" letter-spacing="7">YELLOWCADA</text><text x="1000" y="128" text-anchor="end" fill="${c.ink}" font-family="Arial,sans-serif" font-size="20" letter-spacing="4">ATELIER / 01</text>
<text x="80" y="${headlineY-80}" fill="${c.accent}" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="7">${c.eyebrow}</text>
<text x="75" y="${headlineY+70}" fill="${c.ink}" font-family="Georgia,serif" font-size="108" letter-spacing="-5">${c.lines[0]}</text><text x="75" y="${headlineY+175}" fill="${c.ink}" font-family="Georgia,serif" font-size="108" letter-spacing="-5">${c.lines[1]}</text>
<g transform="translate(770 ${artY}) rotate(-25) scale(${artScale})"><rect x="-88" y="-410" width="176" height="820" rx="65" fill="url(#leather)" stroke="#281D18" stroke-width="3"/><path d="M-67 -315H67M-67 315H67" stroke="#EAD6B2" stroke-width="3" stroke-dasharray="6 10"/><circle r="180" fill="#B9B8AE"/><circle r="164" fill="#101713" stroke="#EFE9DD" stroke-width="5"/><circle r="143" fill="#1B2820" stroke="#627668" stroke-width="2"/><g stroke="#D6C693" stroke-width="4"><path d="M0 -125V-110M0 125V110M-125 0H-110M125 0H110"/></g><path d="M0 14L-55 -52M0 14L70 -22" stroke="#F7F1DC" stroke-width="8" stroke-linecap="round"/><circle cy="14" r="10" fill="#D3B66D"/></g>
<path d="M80 ${height-176}H1000" stroke="${c.line}" stroke-width="2"/><text x="80" y="${height-117}" fill="${c.ink}" font-family="Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="3">${c.copy}</text><text x="80" y="${height-60}" fill="${c.ink}" font-family="Arial,sans-serif" font-size="18" letter-spacing="4">WATCH STRAPS / DESIGN DIRECTIONS</text><text x="1000" y="${height-60}" text-anchor="end" fill="${c.ink}" font-family="Georgia,serif" font-size="28">Y.</text>
</svg>`;
}

for (const campaign of campaigns) for (const [format,height] of Object.entries(formats)) {
  await writeFile(path.join(out, `${campaign.slug}-${format}.svg`), poster(campaign,height), 'utf8');
}
console.log('Generated 9 original poster SVGs.');
