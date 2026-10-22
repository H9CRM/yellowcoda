import { assert } from './security.mjs';
// Structural raster validation and metadata removal; not a decoder or malware scan.
const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
const crc32=b=>{let c=0xffffffff;for(const n of b)c=table[(c^n)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
const validDimensions=(w,h)=>w>=10&&h>=10&&w<=6000&&h<=6000&&w*h<=24000000;
export function normaliseImage(buffer) {
 assert(buffer.length>=32&&buffer.length<=4*1024*1024,'Use a JPEG or PNG between 32 bytes and 4 MB.');
 if(buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))){
  assert(buffer.toString('ascii',12,16)==='IHDR'&&buffer.readUInt32BE(8)===13,'Invalid PNG header.');
  const w=buffer.readUInt32BE(16),h=buffer.readUInt32BE(20);assert(validDimensions(w,h),'Image dimensions must be 10–6000 px and at most 24 megapixels.');
  const chunks=[buffer.subarray(0,8)];let pos=8,hasData=false,ended=false;
  while(pos+12<=buffer.length){
   const len=buffer.readUInt32BE(pos),end=pos+12+len;assert(end<=buffer.length,'Invalid PNG chunk.');const kind=buffer.toString('ascii',pos+4,pos+8);
   assert(/^[A-Za-z]{4}$/.test(kind),'Invalid PNG chunk type.');assert(crc32(buffer.subarray(pos+4,end-4))===buffer.readUInt32BE(end-4),'PNG checksum validation failed.');
   if(['IHDR','PLTE','tRNS','IDAT','IEND'].includes(kind))chunks.push(buffer.subarray(pos,end));
   else assert(kind[0]===kind[0].toLowerCase(),'Unsupported required PNG chunk.');
   if(kind==='IDAT')hasData=true;pos=end;if(kind==='IEND'){ended=true;break;}
  }
  assert(hasData&&ended,'Incomplete PNG image.');return{buffer:Buffer.concat(chunks),mime:'image/png',extension:'png',width:w,height:h};
 }
 assert(buffer[0]===255&&buffer[1]===216,'Only valid JPEG and PNG images are accepted. SVG, GIF, HTML and documents are not allowed.');
 const kept=[buffer.subarray(0,2)];let pos=2,foundSize=false,foundScan=false,ended=false,w=0,h=0;
 while(pos<buffer.length){
  const start=pos;assert(buffer[pos]===255,'Malformed JPEG marker.');while(buffer[pos]===255)pos++;assert(pos<buffer.length,'Incomplete JPEG marker.');const marker=buffer[pos++];
  if(marker===217){kept.push(Buffer.from([255,217]));ended=true;break;}
  assert(![0,216,1].includes(marker)&&!(marker>=208&&marker<=215),'Invalid JPEG marker position.');
  assert(pos+2<=buffer.length,'Invalid JPEG segment.');const len=buffer.readUInt16BE(pos);assert(len>=2&&pos+len<=buffer.length,'Invalid JPEG segment size.');
  if([192,193,194].includes(marker)){assert(len>=8,'Invalid JPEG frame.');h=buffer.readUInt16BE(pos+3);w=buffer.readUInt16BE(pos+5);foundSize=true;}
  if(!(marker>=224&&marker<=239)&&marker!==254)kept.push(buffer.subarray(start,pos+len));
  pos+=len;
  if(marker===218){
   foundScan=true;const scanStart=pos;
   while(pos+1<buffer.length){
    if(buffer[pos]!==255){pos++;continue;}
    const next=buffer[pos+1];if(next===0||(next>=208&&next<=215)){pos+=2;continue;}
    // A marker ends this scan. The outer loop handles metadata between scans.
    break;
   }
   kept.push(buffer.subarray(scanStart,pos));
  }
 }
 assert(foundSize&&foundScan&&ended&&validDimensions(w,h),'Use a valid baseline or progressive JPEG of at most 24 megapixels.');
 return{buffer:Buffer.concat(kept),mime:'image/jpeg',extension:'jpg',width:w,height:h};
}
