const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'..','chinda-v2.js'),'utf8');
function harness(g=0,p=0){
 const models=code.slice(code.indexOf('const people='),code.indexOf('const qs='));
 const response=code.slice(code.indexOf('function reply(s){'),code.indexOf("qs('#composer')"));
 return new Function(models+"let person="+p+",goal="+g+",plan=null,confirmed=false,ended=false,awaiting=false;let lastCoach;function coach(title,detail){lastCoach={title,detail}};"+response+"return {send:reply,status:()=>({plan,confirmed,ended,awaiting,lastCoach})};")();
}
test('all five goals are offered',()=>{for(const s of ['Making and accepting plans','Declining an invitation','Postponing or rescheduling','Not a good fit','Asking for socials'])assert.ok(code.includes(s));});
test('availability alone is not acceptance',()=>{const s=harness();assert.match(s.send('Yes, I am free'),/what did you have in mind/i);assert.equal(s.status().confirmed,false);});
test('invitation without a day is not a confirmed plan',()=>{const s=harness();assert.match(s.send('Would you like coffee at Blossom Café at three?'),/what day/i);assert.equal(s.status().plan,null);});
test('specific public plan can be proposed and independently confirmed',()=>{const s=harness();assert.match(s.send('Would you like coffee at Blossom Café on Saturday at 3 pm?'),/works for me/i);assert.equal(s.status().confirmed,false);s.send('Yes, that works for me');assert.equal(s.status().confirmed,true);});
test('a changed time clears a formerly confirmed plan',()=>{const s=harness();s.send('Would you like coffee at Blossom Café on Saturday at 3 pm?');s.send('Yes, that works for me');s.send("I can't do Saturday. Would Sunday work?");assert.equal(s.status().confirmed,false);assert.equal(s.status().plan,null);});
test('rejecting a first meeting does not require persuasion',()=>{const s=harness(1);assert.match(s.send('Thank you, but I would rather not meet.'),/respect/i);assert.equal(s.status().ended,true);});
test('kind mismatch finishes a conversation',()=>{const s=harness(3);assert.match(s.send("I don't think we are the right fit"),/wish you well/i);assert.equal(s.status().ended,true);});
test('no social accounts are requested or recorded',()=>{const s=harness(4);assert.match(s.send('Would you like to swap Instagram?'),/rather keep chatting here/i);assert.equal(s.status().plan,null);});
test('contact-like strings are redirected',()=>{const s=harness();assert.match(s.send('My number is 1234567890'),/do not need to share/i);});
test('rendering inserts user text only via textContent',()=>{assert.match(code,/el\.textContent=text/);assert.doesNotMatch(code,/innerHTML\s*=/);});
