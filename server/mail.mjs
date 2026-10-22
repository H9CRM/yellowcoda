import { db } from './db.mjs';
export function queueMail(to,subject,body) {
  db.prepare('INSERT INTO outbox(recipient,subject,body) VALUES(?,?,?)').run(to,subject,body);
}
let sending=false;
export const mailConfigured=()=>Boolean(process.env.RESEND_API_KEY&&process.env.EMAIL_FROM);
export async function flushOutbox() {
  if(sending||!mailConfigured()) return {configured:mailConfigured(),sent:0};
  sending=true;let sent=0;
  try {
    const items=db.prepare("SELECT * FROM outbox WHERE status='pending' AND next_attempt<=? AND attempts<8 ORDER BY id LIMIT 10").all(Date.now());
    for(const item of items){
      // Provider idempotency key avoids duplicate sends after retryable failures.
      try {
        const response=await fetch('https://api.resend.com/emails',{
          method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`yellowcada-mail-${item.id}-${item.created_at}`},
          body:JSON.stringify({from:process.env.EMAIL_FROM,to:[item.recipient],subject:item.subject,text:item.body}),signal:AbortSignal.timeout(12000),
        });
        const result=await response.json();
        if(!response.ok) throw new Error(`Email provider returned ${response.status}.`);
        db.prepare("UPDATE outbox SET status='sent',provider_id=?,attempts=attempts+1,last_error=NULL WHERE id=?").run(String(result.id||''),item.id);sent++;
      } catch(error) {
        db.prepare('UPDATE outbox SET attempts=attempts+1,last_error=?,next_attempt=? WHERE id=?').run(String(error.message).slice(0,300),Date.now()+Math.min(3600000,60000*(2**item.attempts)),item.id);
      }
    }
  } finally {sending=false;}
  return {configured:true,sent};
}
