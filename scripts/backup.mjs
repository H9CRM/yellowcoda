import { mkdirSync, cpSync, writeFileSync, chmodSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { db } from '../server/db.mjs';
import { config, ROOT } from '../server/config.mjs';
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const folder=path.join(ROOT,'backups',stamp);mkdirSync(path.join(folder,'assets'),{recursive:true,mode:0o700});
try{
 const snapshot=path.join(folder,'yellowcada.sqlite');
 db.prepare('VACUUM INTO ?').run(snapshot);chmodSync(snapshot,0o600);
 const snapshotDb=new DatabaseSync(snapshot,{readOnly:true});const assets=snapshotDb.prepare('SELECT filename FROM assets').all();snapshotDb.close();
 for(const asset of assets){cpSync(path.join(config.dataDir,'assets',asset.filename),path.join(folder,'assets',asset.filename));chmodSync(path.join(folder,'assets',asset.filename),0o600);}
 writeFileSync(path.join(folder,'MANIFEST.json'),JSON.stringify({createdAt:new Date().toISOString(),database:'yellowcada.sqlite',assets:assets.length,warning:'Private backup contains customer data and access secrets. Encrypt, restrict access and test restoration.'},null,2),{mode:0o600});
 console.log(`Consistent database snapshot and ${assets.length} assets saved to ${folder}\nKeep this backup private and encrypt before off-site storage.`);
}catch(error){console.error('Backup failed:',error.message);process.exitCode=1;}finally{db.close();}
