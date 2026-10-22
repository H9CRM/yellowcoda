import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { randomBytes } from 'node:crypto';
import { db } from '../server/db.mjs';
import { passwordHash } from '../server/security.mjs';
import { email } from '../server/domain.mjs';
const args=process.argv.slice(2);const i=args.indexOf('--email');
const prompt=createInterface({input:stdin,output:stdout});
try {
  const address=email(i>=0?args[i+1]:await prompt.question('Administrator email: '));
  const existing=db.prepare('SELECT id FROM admins WHERE email=?').get(address);
  if(existing&&!args.includes('--reset')) throw new Error('Administrator already exists. Add --reset only to deliberately reset this account.');
  const password=randomBytes(21).toString('base64url')+'!7a';
  const hash=await passwordHash(password);
  if(existing) {db.prepare('UPDATE admins SET password_hash=? WHERE id=?').run(hash,existing.id);db.prepare('DELETE FROM sessions WHERE admin_id=?').run(existing.id);}
  else db.prepare('INSERT INTO admins(email,password_hash) VALUES(?,?)').run(address,hash);
  console.log(`\nAdministrator created. Store these credentials securely.\nEmail: ${address}\nPassword: ${password}\n\nRun npm start and open /admin. No universal/default password exists.\n`);
} catch(e) {console.error(e.message);process.exitCode=1;} finally {prompt.close();db.close();}
