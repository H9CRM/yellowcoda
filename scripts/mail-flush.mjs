import { flushOutbox } from '../server/mail.mjs';
import { db } from '../server/db.mjs';
try{const result=await flushOutbox();console.log(result.configured?`${result.sent} messages sent. Check the admin outbox for individual status.`:'Provider not configured. Nothing was sent. Set RESEND_API_KEY and EMAIL_FROM.');}finally{db.close();}
