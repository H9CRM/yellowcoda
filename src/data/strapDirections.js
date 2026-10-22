export const strapLeathers = [
  { id:'cognac', name:'Cognac', base:'#9b5a37', light:'#c88959', dark:'#442719', tonalStitch:'#c49067' },
  { id:'midnight', name:'Midnight', base:'#353532', light:'#696a66', dark:'#171918', tonalStitch:'#797b75' },
  { id:'olive', name:'Olive', base:'#64684d', light:'#92977a', dark:'#323927', tonalStitch:'#aab08b' },
];

export const strapStitches = [
  { id:'tonal', name:'Tone on tone' },
  { id:'contrast', name:'Contrast' },
];

export const strapHardware = [
  { id:'steel', name:'Brushed steel' },
  { id:'brass', name:'Warm brass' },
];

export function normalizeStrapDirection(direction) {
  if (!direction || typeof direction !== 'object') return null;
  const leather = strapLeathers.find(item => item.id === direction.leather);
  const stitch = strapStitches.find(item => item.id === direction.stitch);
  const hardware = strapHardware.find(item => item.id === direction.hardware);
  return leather && stitch && hardware ? { leather:leather.id, stitch:stitch.id, hardware:hardware.id } : null;
}

export function formatStrapDirection(direction) {
  const valid = normalizeStrapDirection(direction);
  if (!valid) return '';
  return `${strapLeathers.find(item => item.id === valid.leather).name} colour direction · ${strapStitches.find(item => item.id === valid.stitch).name.toLowerCase()} stitching · ${strapHardware.find(item => item.id === valid.hardware).name.toLowerCase()} buckle`;
}
