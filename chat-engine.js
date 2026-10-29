/* A small, transparent scripted simulator. No message leaves the browser. */
(function (root) {
  'use strict';

  const voices = {
    Hana: { topic: /\b(art|draw|drawing|illustrat|manga|anime|cafe|coffee|playlist|music)/, story: 'I am sketching the little café near my studio. I love how ordinary places have their own stories.', question: 'What is something small that caught your attention recently?', venue: 'the fictional Blossom Café', interest: 'your sketches' },
    Ren: { topic: /\b(game|gaming|ramen|cook|food|animal|shelter|dog|cat)/, story: 'I am building a tiny game about running a ramen shop. My animal-shelter friends keep suggesting that every customer should be a cat.', question: 'What do you like to do when you want to unwind?', venue: 'the fictional Lantern Board-game Café', interest: 'your cozy game' },
    Alex: { topic: /\b(book|read|poem|poet|poetry|story|stories|pun|wordplay)/, story: 'I am choosing poems for our next bookshop evening. I like writing that makes an everyday moment feel new.', question: 'Is there a book or a story you keep returning to?', venue: 'the fictional Open Book Café', interest: 'your poetry night' },
    Sora: { topic: /\b(garden|plant|herb|nature|walk|photo|camera|wildlife|hike|hiking)/, story: 'My balcony herbs are finally growing. I have also been photographing the birds that visit them.', question: 'What kind of places do you like to explore?', venue: 'the fictional Garden Café', interest: 'your balcony garden' },
    Maya: { topic: /\b(science|teach|school|game|board|music|concert|learn)/, story: 'I am planning a science activity and a board-game evening. Both involve a little trial and error!', question: 'What is something you have enjoyed learning lately?', venue: 'the fictional Lantern Board-game Café', interest: 'your board-game evenings' },
    Theo: { topic: /\b(sound|music|album|band|gig|record|concert|game)/, story: 'I have been making a game soundscape from sounds around the city. I also found a record I cannot stop replaying.', question: 'What have you been listening to lately?', venue: 'the fictional Record-shop Café', interest: 'your sound design' }
  };

  const normalize = text => text.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  const coach = (level, title, detail) => ({ level, title, detail });
  const genericCoach = () => coach(0, 'A conversation cue', 'These replies follow a small set of patterns, so they may miss your meaning. A real person’s response can be different. Ask if you are unsure.');
  const voiceFor = session => voices[session.person.name] || { topic: /\b(hobby|interest|work|weekend)/, story: 'I enjoy spending time on my hobbies and discovering new places.', question: 'What do you enjoy doing in your free time?', venue: 'the fictional Blossom Café', interest: session.person.interests?.[0] || 'your interests' };

  function createSession(person, topic = 1) {
    if (!person || !person.name || Number(person.age) < 18) throw new TypeError('The simulator needs an adult character profile.');
    const session = {
      person: { name: person.name, age: person.age, pronouns: person.pronouns || 'they / them', communication: person.communication || 'Please ask what works for me.', interests: [...(person.interests || [])] },
      topic: Math.max(0, Math.min(2, Number(topic) || 0)), stage: 'opener', goodTurns: 0, declinedMeet: false, declinedBy: null,
      repeatedInvites: 0, ended: false, plan: { day: '', time: '', venue: '' }, lastMessage: '', lastIntent: '',
      lastTopic: false, turns: 0, opening: ''
    };
    session.opening = `Hi! I am ${person.name}. I noticed we have a chance to chat here. What caught your eye in my profile?`;
    return session;
  }

  function getStage(session) { return session.ended ? 'ended' : session.stage; }

  function getSuggestions(session) {
    const voice = voiceFor(session);
    if (session.ended) return [];
    if (session.declinedBy === 'user') return ['I would like to keep chatting for now.', 'Would you like to meet for coffee now?', 'Thanks for the conversation. I am going to head off.'];
    if (session.declinedMeet) return ['Thanks for being clear. We can keep chatting.', `Can you tell me more about ${voice.interest}?`, 'Thanks for the conversation. I am going to head off.'];
    if (session.stage === 'ready') return ['Thanks! I look forward to meeting you.', 'I have changed my mind about meeting.'];
    if (session.stage === 'planning') {
      if (!session.plan.day || !session.plan.time || !session.plan.venue) return [`How about Saturday at 2 pm at ${voice.venue}?`, 'I would rather keep chatting for now.'];
      return ['Yes, that plan works for me. See you there!', 'I have changed my mind about meeting.'];
    }
    if (session.stage === 'invitation') return [`Would you like to meet for coffee at ${voice.venue}?`, 'What if you would rather keep chatting?', 'I am flirting with you. Is that welcome?'];
    if (session.stage === 'connection') return [voice.question, 'What kind of place do you enjoy for a first date?', 'How do you prefer to communicate?'];
    return [`Hi! I would love to hear about ${voice.interest}.`, 'How has your week been?', 'How do you prefer to communicate?'];
  }

  function result(session, reply, hint = genericCoach()) {
    return { reply, coach: hint, suggestions: getSuggestions(session), stage: getStage(session), ended: session.ended };
  }

  function buildPlan(session, text) {
    const day = text.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
    const time = text.match(/\b((?:1[0-2]|[1-9])(?::[0-5]\d)?\s*(?:am|pm)|(?:[01]?\d|2[0-3]):[0-5]\d|noon|midday)\b/i);
    const publicPlace = /\b(?:caf[eé](?=\s|[?.!,]|$)|(?:coffee shop|bookshop|bookstore|library|museum|park|restaurant|record.shop)\b)/i.test(text);
    if (day) session.plan.day = day[0][0].toUpperCase() + day[0].slice(1).toLowerCase();
    if (time) session.plan.time = time[0];
    // The venue is always an explicitly fictional public location. Never retain an address.
    if (publicPlace) session.plan.venue = voiceFor(session).venue;
    return Boolean(session.plan.day && session.plan.time && session.plan.venue);
  }

  function respond(session, input) {
    if (!session || !session.person) throw new TypeError('Create a session first.');
    if (typeof input !== 'string' || !input.trim()) return result(session, 'Write a short message when you are ready.', coach(0, 'Take your time', 'You can type your own message or choose one of the suggested starters.'));
    if (input.length > 600) return result(session, 'Could we take that one thought at a time?', coach(0, 'Try a shorter message', 'Keep each practice message to 600 characters or fewer. A clear question is often easier to answer.'));
    if (session.ended) return result(session, 'This practice conversation has ended. Start a new chat if you want to try a different approach.', coach(0, 'A conversation can end', 'A new practice session is a reset, not a way to persuade a real person after a no.'));

    const text = normalize(input);
    const voice = voiceFor(session);
    session.turns++;

    const cancel = /\b(changed my mind|change my mind|cancel (?:our |the )?(?:date|meet|plan)|do not want to meet|don't want to meet|rather not meet|not ready to meet|rather keep chatting|keep it (?:in|on) (?:the )?app)\b/;
    if (/(?:what if you (?:would |wouldn't |didn't )?|would you |do you )rather keep chatting|practice (?:a |the )?(?:no|decline|rejection)/.test(text)) {
      session.declinedMeet = true; session.declinedBy = 'character'; session.stage = 'connection'; session.plan = { day: '', time: '', venue: '' };
      return result(session, 'Thanks for asking. I would rather keep chatting here for now. I am not ready to meet.', coach(0, 'Practice accepting a no', 'The character has declined a meeting. Acknowledge it without trying to change their mind. Staying in the app is a valid outcome.'));
    }
    if (cancel.test(text) || /^(?:no(?: thanks| thank you)?|not now|not yet|not interested)[.! ]*$/.test(text)) {
      session.declinedMeet = true; if (session.declinedBy !== 'character') session.declinedBy = 'user'; session.stage = 'connection'; session.plan = { day: '', time: '', venue: '' };
      return result(session, 'Of course. We do not have to meet. We can stay in the app, or end the conversation if you prefer.', coach(0, 'Your choice matters too', 'You can change your mind, even after a plan is agreed. A successful conversation does not have to lead to a date.'));
    }
    if (/\b(goodbye|bye|head off|end (?:the |this )?(?:chat|conversation)|stop chatting|stop messaging|leave me alone)\b/.test(text)) {
      session.ended = true; session.stage = 'ended';
      return result(session, 'Thanks for telling me. Take care!', coach(0, 'End clearly and kindly', 'You do not owe someone continued conversation. A polite goodbye is enough.'));
    }

    const boundaryText = text
      .replace(/\b(?:you (?:do not|don't|never) owe me|i (?:do not|don't) owe you) (?:a )?(?:kiss|sex|anything)/g, '')
      .replace(/\bno pressure\b/g, '')
      .replace(/\b(?:i |we )?(?:do not|don't|never|won't|will not) (?:want to |want |expect |need |have to )*(?:have )?sex\b/g, '');
    const pressure = /\b(you owe me (?:a )?(?:kiss|sex|date|nudes?|affection)|you have to kiss|you must kiss|do not be a tease|don't be a tease|stop being a tease|you already said yes|won't take no|will not take no|make you (?:kiss|have sex)|i paid.*(?:kiss|sex))\b/.test(boundaryText);
    const vulgar = /\b(nice ass|show me (?:your )?(?:boobs|tits|nudes)|send (?:me )?(?:a )?nudes?|(?:your|nice) (?:tits|boobs)|fuck you)\b/.test(boundaryText);
    if (pressure || vulgar) {
      session.lastIntent = 'boundary';
      if (pressure || session.declinedMeet) { session.ended = true; session.stage = 'ended'; session.plan = { day: '', time: '', venue: '' }; }
      return result(session, pressure ? 'I do not owe you affection or a date. I am ending this conversation.' : 'I do not want sexual comments about my body or requests for intimate images. Please respect that boundary.', coach(3, 'Boundary crossed · stop', 'This wording can pressure or objectify someone. A prior yes or a paid meal does not create an obligation. Stop; do not bargain. This pattern-based cue may miss context.'));
    }

    if (/\b(phone number|whatsapp|home address|your address|where (?:exactly )?do you live|send.*(?:location|address))\b/.test(text)) {
      return result(session, 'I would rather keep chatting in the app. If we decide to meet, let us use a public place rather than exchange private addresses.', coach(0, 'Ask, never assume', 'A match does not require sharing personal contact details. This simulator uses fictional public venues; do not enter real addresses or phone numbers.'));
    }

    const privatePlace = /\b(?:my|your|our) (?:place|home|house|apartment|flat|bedroom)|\bcome over\b|\bhotel room\b/.test(text) && !/\b(?:not|rather than|instead of|no need to)\b.*\b(?:home|house|place|come over)\b/.test(text);
    if (privatePlace) {
      return result(session, 'For a first meeting, I would prefer a public place. Could we choose a café or bookshop instead?', coach(2, 'Private invitation · clarify', '“Come over” can imply intimacy, but does not mean agreement to sex. A public first meeting leaves more room to leave comfortably. Respect the preference.'));
    }

    if (/\b(pronouns?|they them|he him|she her)\b/.test(text)) {
      return result(session, `My pronouns are ${session.person.pronouns}. When you talk directly to me, “you” works as usual. ${voice.question}`, coach(0, 'Use the person’s stated pronouns', 'Use their profile pronouns when talking about them. A brief correction is enough if you make a mistake.'));
    }
    if (/\b(?:i am|i'm|i have|my) (?:autistic|autism|asd|adhd|neurodivergent)\b/.test(text)) {
      if (text !== session.lastMessage) session.goodTurns++;
      session.lastMessage = text;
      if (!session.declinedMeet && !['planning', 'ready'].includes(session.stage)) session.stage = session.goodTurns >= 2 ? 'invitation' : 'connection';
      return result(session, 'Thanks for sharing that with me. Is there anything you would like me to know about how you prefer to chat or make plans?', coach(0, 'You choose what to share', 'You do not have to explain a diagnosis or provide medical details. Describe the preferences you want someone to know.'));
    }
    if (/\b(communicat|autis|asd\b|adhd|neurodiv|quieter table|sensory|eye contact|direct words|time to think|pause)/.test(text)) {
      if (text !== session.lastMessage) session.goodTurns++;
      session.lastMessage = text;
      if (!session.declinedMeet && !['planning', 'ready'].includes(session.stage)) session.stage = session.goodTurns >= 2 ? 'invitation' : 'connection';
      return result(session, session.person.communication, coach(0, 'Ask about individual preferences', 'This is what this character says works for them. A diagnosis is not a script for someone’s needs, attraction, or consent.'));
    }

    const sexualTopic = /\b(sex|sexual|turning me on|kiss|hook up|intima(?:te|cy)?|protection|testing)\b/.test(boundaryText) || /\b(?:you are|you're|you look) (?:so |very |really )?hot\b/.test(boundaryText);
    if (sexualTopic && !/\b(?:no|do not|don't|not|never)\b.{0,30}\b(?:sex|kiss|sexual)\b/.test(text)) {
      if (session.topic < 2) return result(session, 'I would rather keep this chat focused on getting to know each other. We have not agreed to sexual conversation.', coach(2, 'Intimate topic · check first', 'The intimacy topic is not selected. Sexual language is not required to build connection or suggest a date.'));
      const asksPermission = /\b(can we|could we|would you be comfortable|is it okay|is it ok|want to talk|like to talk|welcome|boundaries|protection|testing)\b/.test(text);
      return result(session, asksPermission ? 'We can talk about boundaries in general. I prefer clear questions, no pressure, and being able to change my mind. Agreeing to a conversation is not agreeing to intimacy.' : 'I am comfortable discussing boundaries, but I have not agreed to sexual comments about me. Could you check what kind of conversation is welcome?', coach(2, 'Intimate topic · check the context', 'An adult topic setting does not mean the character consents to sexual attention. Ask before changing the tone. This is non-graphic language practice.'));
    }

    if (/\b(flirt(?:ing)?|romantic|attracted|like your (?:smile|humor|sense of humor)|enjoy your company)\b/.test(text)) {
      return result(session, session.declinedMeet ? 'Thank you for being direct. I would like to keep this friendly and stay in the app.' : 'Thanks for being clear. A little friendly flirting is welcome, but I still want to get to know you. There is no need to rush.', coach(1, 'Flirty · leave room for an answer', 'Clear interest can be kind. A positive response to flirting is not agreement to meet, touch, or have sex.'));
    }

    const invite = /\b(?:would you like|want to|shall we|let's|lets|can we|could we|fancy|up for)\b.{0,90}\b(?:meet|coffee|tea|caf[eé]|bookshop|bookstore|park|date|lunch|museum|walk)\b/.test(text)
      || /\b(?:meet up|meet for|go on a date|grab (?:a )?coffee)\b/.test(text)
      || /\b(?:coffee|caf[eé]|bookshop|lunch)\b.{0,30}\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(text);

    if (invite && session.declinedBy === 'user') {
      session.declinedMeet = false; session.declinedBy = null; session.stage = 'invitation';
    }
    if (invite && session.declinedBy === 'character') {
      session.repeatedInvites++;
      if (session.repeatedInvites >= 2) { session.ended = true; session.stage = 'ended'; }
      return result(session, session.ended ? 'I have already said I do not want to meet. I am ending this chat now.' : 'I would still rather stay in the app. Please do not keep asking me to meet.', coach(3, 'A no is not a negotiation', 'The character has declined this meeting. Accept the answer rather than changing the wording to ask again.'));
    }

    if (session.stage === 'ready') {
      return result(session, `Our fictional plan is ${session.plan.day} at ${session.plan.time}, at ${session.plan.venue}. I will message here if anything changes.`, coach(0, 'From the app to a public first meet', 'In a real situation, arrange your own transport, tell someone you trust about the plan, and keep an easy way to leave. This is a simulation, not an actual booking.'));
    }

    if (session.stage === 'planning') {
      const wasComplete = Boolean(session.plan.day && session.plan.time && session.plan.venue);
      if (buildPlan(session, text)) {
        const contradicted = /\b(?:not|don't|doesn't|cannot|can't|won't|unsure|maybe|perhaps)\b/.test(text);
        const confirmation = !contradicted && /\b(yes|confirmed|confirm|works for me|sounds good|sounds great|see you|agreed|perfect|that works)\b/.test(text);
        if (contradicted) {
          session.plan = { day: '', time: '', venue: '' };
          return result(session, 'No problem. That plan is not confirmed. Would you prefer a different public place, day, or time, or to keep chatting here?', coach(0, 'Check a mixed answer', 'A yes followed by a qualification is not a clear confirmation. Ask what works instead of assuming agreement.'));
        }
        if (wasComplete && confirmation) {
          session.stage = 'ready';
          return result(session, `Yes — ${session.plan.day} at ${session.plan.time}, at ${session.plan.venue}. We will each make our own way there, and either of us can change our mind. See you in this practice scenario!`, coach(0, 'A plan, not a promise of intimacy', 'You have agreed on a public venue, day, and time. In real life, confirm again if plans change and let someone you trust know where you will be.'));
        }
        return result(session, `How about ${session.plan.day} at ${session.plan.time}, at ${session.plan.venue}? Does that exact plan work for you?`, coach(0, 'Confirm both people’s choice', 'A concrete plan needs a public venue, a day, and a time. Now confirm or decline; neither person is obliged to continue.'));
      }
      const missing = [!session.plan.day && 'a day of the week', !session.plan.time && 'a time with am/pm or a 24-hour time', !session.plan.venue && 'a public café or bookshop'].filter(Boolean);
      return result(session, `Could we choose ${missing.join(', and ')}? For this practice, we can use ${voice.venue}.`, coach(0, 'Make the plan clear', 'Use a day, time, and public place. “Sometime” or “later” can mean different things to different people. The simulator recognizes weekday names and times such as 2 pm or 14:00.'));
    }

    if (invite) {
      if (session.goodTurns < 2) return result(session, 'I would like to chat a little more before deciding whether to meet. Could we get to know one another first?', coach(0, 'Match does not mean ready to meet', 'The character wants more conversation. Respond to that preference instead of repeating the invitation.'));
      session.stage = 'planning';
      buildPlan(session, text);
      if (session.plan.day && session.plan.time && session.plan.venue) return result(session, `I would be interested in meeting. ${session.plan.day} at ${session.plan.time}, at ${session.plan.venue} sounds like a possible plan. Does that work for you?`, coach(0, 'An invitation can be accepted or declined', 'Confirm the details only if you want to. A meeting is not the goal at any cost.'));
      return result(session, 'I would be interested in a short first meet in a public place. What day and time would work, and which public venue shall we use?', coach(0, 'Move from interest to a clear invitation', 'A specific, low-pressure public meeting is easier to consider than an ambiguous invitation home. Use fictional details here.'));
    }

    if (/\b(sorry|apologi[sz]e|respect (?:your|that)|thanks for (?:telling|being clear)|no pressure|do not owe|don't owe|do not want.*sex|don't want.*sex)\b/.test(text)) {
      return result(session, `Thank you for saying that clearly. ${session.declinedMeet ? 'We can keep chatting here without planning a date.' : voice.question}`, coach(0, 'Respect makes room for choice', 'Accepting a boundary does not earn a future yes. Keep the next topic comfortable for both people.'));
    }

    const isGreeting = /^(?:hi|hey|hello|hiya|good (?:morning|evening))(?:[ !.,]|$)/.test(text) && text.split(' ').length < 6;
    const meaningful = voice.topic.test(text) || /\b(week|weekend|free time|hobb|enjoy|favorite|favourite|tell me|what|how|why|which|i like|i love|i enjoy|recently|yesterday|that sounds)\b/.test(text);
    if (meaningful && text !== session.lastMessage) {
      session.goodTurns++;
      if (!session.declinedMeet) session.stage = session.goodTurns >= 2 ? 'invitation' : 'connection';
      session.lastMessage = text;
      if (/\b(first date|kind of place|where.*meet|public place)\b/.test(text)) return result(session, `For a first date I would prefer a public place such as ${voice.venue}. We can keep it short and make our own way there. What kind of setting works for you?`, coach(0, 'Ask before planning', 'Talking about preferences is different from agreeing to a meeting. Ask rather than treating a preference as a yes.'));
      if (voice.topic.test(text) && !session.lastTopic) {
        session.lastTopic = true;
        return result(session, `${voice.story} ${voice.question}`, coach(0, 'Start with the profile', 'You connected with a stated interest. A short response about yourself can help the conversation feel reciprocal.'));
      }
      return result(session, session.goodTurns % 2 ? `${voice.story} What has your week been like?` : `That gives us something to talk about. I like hearing what matters to someone. ${voice.question}`, coach(0, 'Make space for a reply', 'Share a little about yourself and ask one clear question. Two messages do not guarantee that a real person will want to meet.'));
    }
    if (isGreeting) return result(session, `Hi! I am glad you said hello. You could ask me about ${voice.interest}, or tell me about something you enjoy.`, coach(0, 'Give your opener something to answer', 'A greeting plus a specific question is often easier to respond to than just “hi.”'));
    return result(session, `I did not quite follow that. Could you ask a direct question about ${voice.interest}, tell me about your week, or choose one of the suggested replies?`, genericCoach());
  }

  const api = { createSession, respond, getSuggestions, getStage };
  root.ChindaChat = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
