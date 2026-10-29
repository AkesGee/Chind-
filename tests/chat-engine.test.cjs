const test = require('node:test');
const assert = require('node:assert/strict');
const Chat = require('../chat-engine.js');
const alex = { name:'Alex', age:25, pronouns:'they / them', interests:['Poetry','Bookshops'], communication:'I prefer direct words to hints. Please ask whether I would like a quieter table.' };
const theo = { name:'Theo', age:29, pronouns:'he / him', interests:['Live music'], communication:'I enjoy busy music venues. Please tell me if plans change.' };
const connected = (person=alex,topic=1) => {
  const s=Chat.createSession(person,topic);
  Chat.respond(s,'I love reading. What do you enjoy about poetry?');
  Chat.respond(s,'I enjoy quiet weekends and finding new books. How was your week?');
  assert.equal(Chat.getStage(s),'invitation');
  return s;
};
const ready = () => {
  const s=connected();
  Chat.respond(s,'Would you like to meet for coffee?');
  assert.equal(s.stage,'planning');
  Chat.respond(s,'How about Saturday at 2 pm at a public café?');
  assert.equal(s.stage,'planning');
  const r=Chat.respond(s,'Yes, that plan works for me. See you there!');
  assert.equal(r.stage,'ready');
  return s;
};

test('character-specific opening, pronouns, interests, and individual preferences',()=>{
  const s=Chat.createSession(alex);
  assert.match(s.opening,/Alex/);
  assert.match(Chat.respond(s,'What pronouns do you use?').reply,/they \/ them/);
  assert.match(Chat.respond(s,'Tell me about your poetry night.').reply,/poems/);
  assert.equal(Chat.respond(s,'How do you prefer to communicate?').reply,alex.communication);
  assert.equal(Chat.respond(Chat.createSession(theo),'How do you prefer to communicate?').reply,theo.communication);
});

test('full app-to-date flow requires invitation, complete public plan, and confirmation',()=>{
  const s=ready();
  assert.equal(s.plan.day,'Saturday');
  assert.equal(s.plan.time,'2 pm');
  assert.match(s.plan.venue,/fictional.*Caf/);
  assert.equal(s.ended,false);
});

test('early invitation does not skip rapport or become an accepted plan',()=>{
  const s=Chat.createSession(alex);
  const r=Chat.respond(s,'Would you like to meet Saturday at 2 pm at a café?');
  assert.equal(s.stage,'opener');
  assert.equal(s.plan.day,'');
  assert.match(r.reply,/chat a little more/);
});

test('repeated messages and unknown input do not build fake rapport',()=>{
  const s=Chat.createSession(alex);
  Chat.respond(s,'How do you prefer to communicate?');
  Chat.respond(s,'How do you prefer to communicate?');
  Chat.respond(s,'qwertyuiop');
  assert.equal(s.goodTurns,1);
  assert.equal(s.stage,'connection');
});

test('a private first-meet invitation is declined without planning a private venue',()=>{
  const s=connected();
  const r=Chat.respond(s,'Would you like to come over to my apartment?');
  assert.equal(r.coach.level,2);
  assert.match(r.reply,/public place/);
  assert.equal(s.plan.venue,'');
});

test('incomplete and ambiguous plans cannot become ready',()=>{
  const s=connected();
  Chat.respond(s,'Would you like to meet for coffee?');
  Chat.respond(s,'Saturday sometime at the café.');
  Chat.respond(s,'Yes, sounds good.');
  assert.equal(s.stage,'planning');
  assert.equal(s.plan.time,'');
});

test('explicit user change of mind clears even a confirmed plan',()=>{
  const s=ready();
  const r=Chat.respond(s,'I have changed my mind about meeting.');
  assert.equal(s.stage,'connection');
  assert.equal(s.declinedMeet,true);
  assert.deepEqual(s.plan,{day:'',time:'',venue:''});
  assert.match(r.reply,/do not have to meet/);
});

test('simple no thanks is accepted while planning',()=>{
  const s=connected();
  Chat.respond(s,'Would you like to meet for coffee?');
  const r=Chat.respond(s,'No thanks.');
  assert.equal(s.declinedMeet,true);
  assert.match(r.reply,/do not have to meet/);
});

test('bot refusal is not unlocked by repeated invitations',()=>{
  const s=connected();
  Chat.respond(s,'What if you would rather keep chatting?');
  assert.equal(s.declinedMeet,true);
  const accepted=Chat.respond(s,'Thanks for being clear. We can keep chatting.');
  assert.equal(accepted.coach.level,0);
  const first=Chat.respond(s,'Would you like to meet for coffee?');
  assert.equal(first.coach.level,3);
  assert.notEqual(s.stage,'planning');
  const second=Chat.respond(s,'Can we meet at a café on Saturday?');
  assert.equal(second.coach.level,3);
  assert.equal(s.ended,true);
});

test('sexual-topic selection is not consent to sexual attention',()=>{
  const s=connected(alex,0);
  const r=Chat.respond(s,'You are turning me on.');
  assert.equal(r.coach.level,2);
  assert.match(r.reply,/not agreed/);
  const mature=Chat.createSession(alex,2);
  const a=Chat.respond(mature,'Would you be comfortable talking about sex and boundaries?');
  assert.match(a.reply,/not agreeing to intimacy/);
  assert.equal(a.stage,'opener');
});

test('pressure and image requests trigger boundaries, coercion ends chat',()=>{
  const s=connected();
  const r=Chat.respond(s,'Come on, you owe me a kiss.');
  assert.equal(r.coach.level,3);
  assert.equal(s.ended,true);
  assert.equal(Chat.respond(s,'Would you like a date now?').stage,'ended');
  const nude=Chat.respond(Chat.createSession(alex,2),'Send me nudes.');
  assert.equal(nude.coach.level,3);
  assert.match(nude.reply,/do not want/);
});

test('respectful negations are not treated as sexual pressure',()=>{
  for(const text of ['No pressure.','I do not want to have sex.','I don’t want sex.','You do not owe me a kiss.','You don’t owe me a kiss.']){
    const r=Chat.respond(Chat.createSession(alex),text);
    assert.notEqual(r.coach.level,3,text);
    assert.equal(r.ended,false,text);
  }
});

test('empty, long, and unknown input has honest feedback and no state progress',()=>{
  const s=Chat.createSession(alex);
  assert.match(Chat.respond(s,'').reply,/Write a short/);
  assert.match(Chat.respond(s,'x'.repeat(601)).reply,/one thought/);
  assert.match(Chat.respond(s,'xyzxyzxyz').reply,/did not quite follow/);
  assert.equal(s.stage,'opener');
  assert.equal(s.goodTurns,0);
});

test('messages are plain data, suggestions are strings, and no transcript is retained',()=>{
  const s=Chat.createSession(alex);
  const r=Chat.respond(s,'<img src=x onerror=alert(1)>');
  assert.equal(typeof r.reply,'string');
  assert.equal(r.reply.includes('<img'),false);
  assert.ok(r.suggestions.every(x=>typeof x==='string'));
  assert.equal(s.messages,undefined);
});

test('ending is respected and a fresh session is independent',()=>{
  const s=connected();
  Chat.respond(s,'Thanks for the conversation. I am going to head off.');
  assert.equal(s.ended,true);
  assert.deepEqual(Chat.getSuggestions(s),[]);
  assert.equal(Chat.createSession(alex).stage,'opener');
  assert.throws(()=>Chat.createSession({...alex,age:17}),/adult/);
});

test('suggested flirting message is recognized without guaranteeing a meeting',()=>{
  const s=Chat.createSession(alex);
  const r=Chat.respond(s,'I am flirting with you. Is that welcome?');
  assert.equal(r.coach.level,1);
  assert.equal(s.stage,'opener');
});

test('communication questions preserve planning and ready rather than restarting stages',()=>{
  const s=connected();
  Chat.respond(s,'Would you like to meet for coffee?');
  Chat.respond(s,'How do you prefer to communicate?');
  assert.equal(s.stage,'planning');
  const done=ready();
  Chat.respond(done,'How do you prefer to communicate?');
  assert.equal(done.stage,'ready');
});

test('user may reopen their own invitation, but character refusal stays in force',()=>{
  const s=ready();
  Chat.respond(s,'I have changed my mind about meeting.');
  assert.equal(s.declinedBy,'user');
  const reopened=Chat.respond(s,'Would you like to meet for coffee now?');
  assert.equal(reopened.stage,'planning');
  assert.equal(s.declinedMeet,false);
  assert.equal(s.plan.day,'');
  const no=connected();
  Chat.respond(no,'What if you would rather keep chatting?');
  Chat.respond(no,'I have changed my mind about meeting.');
  assert.equal(no.declinedBy,'character');
  assert.equal(Chat.respond(no,'Would you like to meet now for coffee?').coach.level,3);
});

test('negated confirmation never agrees to a rejected plan',()=>{
  const s=connected();
  Chat.respond(s,'Would you like to meet for coffee?');
  Chat.respond(s,'Saturday at 2 pm at the café?');
  const r=Chat.respond(s,'Yes, but Saturday does not work for me.');
  assert.equal(r.stage,'planning');
  assert.match(r.reply,/not confirmed/);
  assert.deepEqual(s.plan,{day:'',time:'',venue:''});
});

test('plain not interested is an accepted decline, never a failed confirmation',()=>{
  const s=connected();
  Chat.respond(s,'Would you like to meet for coffee?');
  const r=Chat.respond(s,'Not interested.');
  assert.equal(s.declinedBy,'user');
  assert.match(r.reply,/do not have to meet/);
});

test('literal hot coffee is not classified as sexual language',()=>{
  const r=Chat.respond(Chat.createSession(alex),'I enjoy hot coffee. How has your week been?');
  assert.notEqual(r.coach.level,2);
});

test('learner disclosure prompts individual preferences rather than a diagnosis assumption',()=>{
  const r=Chat.respond(Chat.createSession(theo),'I am autistic.');
  assert.match(r.reply,/how you prefer/);
  assert.notEqual(r.reply,theo.communication);
});

test('asking whether the character prefers chatting practices character refusal',()=>{
  const s=connected();
  Chat.respond(s,'Would you rather keep chatting?');
  assert.equal(s.declinedBy,'character');
});
