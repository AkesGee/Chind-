const characters = [
  {
    name: 'Hana', age: 24, gender: 'female', pronouns: 'she / her', icon: '✿',
    job: 'Illustrator & quiet café enthusiast',
    about: 'Hana loves manga, indie playlists, and noticing the tiny details in everyday life. She is warm but takes time to open up. She likes being asked about her art and prefers a relaxed conversation over comments about her appearance.',
    interests: ['Art & manga', 'Café hopping', 'Indie music'],
    communication: 'I like one question at a time and a little space to answer. A quiet table helps me feel comfortable.',
    boundary: 'Ask before touching her sketchbook or taking her photo.',
    practice: 'Ask her about something she has created. Respond to her ideas before offering a compliment.'
  },
  {
    name: 'Ren', age: 26, gender: 'male', pronouns: 'he / him', icon: '☾',
    job: 'Game developer & amateur ramen critic',
    about: 'Ren makes cozy games and volunteers at an animal shelter. He is playful, a little shy, and happiest talking about something he is building. He appreciates direct, kind communication and does not enjoy teasing about masculinity.',
    interests: ['Cozy games', 'Cooking', 'Animal shelters'],
    communication: 'I love playful jokes, but I prefer a clear question when you are inviting me somewhere. Tell me what you have in mind.',
    boundary: 'He prefers to keep his dating history private on a first date.',
    practice: 'Ask him an open question, then share something about yourself without turning the conversation into an interview.'
  },
  {
    name: 'Alex', age: 25, gender: 'non-binary', pronouns: 'they / them', icon: '✧',
    job: 'Bookshop host & poetry enthusiast', disclosure: 'Autistic (ASD) · self-described',
    about: 'Alex hosts a monthly poetry night and collects secondhand books. They enjoy thoughtful questions and terrible puns. They describe themself as autistic (ASD). Their ideal date leaves room for curiosity and comfortable silence. Their interests are a better starting point than questions about their diagnosis.',
    interests: ['Poetry', 'Bookshops', 'Wordplay'],
    communication: 'I prefer direct words to hints. I may pause before answering, and eye contact is not how I show I am listening. Ask me whether a quieter table would help.',
    boundary: 'Their profile disclosure is not an invitation to ask about their body or medical history. Give them time to respond rather than answering for them.',
    practice: 'Try “I am flirting with you — is that welcome?” Introduce Alex with “They host poetry nights. I asked them about their favorite book.” Speak directly to Alex using “you.”'
  },
  {
    name: 'Sora', age: 27, gender: 'non-binary', pronouns: 'they / them', icon: '❀',
    job: 'Community gardener & weekend photographer',
    about: 'Sora grows herbs on their balcony and takes photos of city wildlife. They like easygoing dates and people who listen. They are happy to talk about their projects, but prefer not to be photographed without permission.',
    interests: ['Gardening', 'Photography', 'Nature walks'],
    communication: 'I like to know the plan, but I am happy to change it together. Ask before making a surprise stop.',
    boundary: 'Ask before taking their photo, and accept a no without trying to persuade them.',
    practice: 'Tell a friend what Sora enjoys using they, them, and their. If you use the wrong pronoun, correct yourself briefly and continue.'
  },
  {
    name: 'Maya', age: 28, gender: 'female', pronouns: 'she / her', icon: '✦',
    job: 'Science teacher & board-game regular',
    about: 'Maya is curious, funny, and competitive about board games. She enjoys a thoughtful disagreement and likes a date who takes her expertise seriously. She values compliments about her humor, choices, or skills.',
    interests: ['Science', 'Board games', 'Live music'],
    communication: 'I like friendly debate. If you are teasing, keep it kind — I do not enjoy jokes that put someone down.',
    boundary: 'She does not welcome sexual jokes or comments about her body from someone she has just met.',
    practice: 'Offer a specific, nonsexual compliment about her contribution to the conversation. Let her decide whether to return the flirtation.'
  },
  {
    name: 'Theo', age: 29, gender: 'male', pronouns: 'he / him', icon: '☀',
    job: 'Sound designer & live-music fan', disclosure: 'Neurodivergent · autistic, with ADHD · self-described',
    about: 'Theo builds soundscapes for games and loves a lively gig. He describes himself as autistic and as having ADHD. He can happily spend an evening talking about a new album. He likes making a plan together and appreciates people being open about what they want.',
    interests: ['Live music', 'Sound design', 'Record shops'],
    communication: 'I enjoy busy music venues. Please tell me if plans change, and offer to text the details. If I lose my train of thought, ask whether I want a reminder.',
    boundary: 'Do not call him childish or treat him as a project. Ask before giving help, and take his answers seriously.',
    practice: 'Ask “Would you prefer to stay for the next band or find somewhere to talk?” His preferences differ from Alex’s; a shared diagnosis does not mean shared needs.'
  }
];

// Flames describe language in context, never a person or diagnosis.
const flameLevels = {
  1: { icon: '🔥', label: 'Flirty · notice the response' },
  2: { icon: '🔥🔥', label: 'Intimate / suggestive · check first' },
  3: { icon: '🔥🔥🔥', label: 'Boundary crossed · stop' }
};

const scenarios = [
  {
    name: 'A cozy café', icon: '☕', level: 0,
    setting: 'You meet at a quiet café for the first time. You both have about half an hour.',
    prompts: [
      'Say hello, ask whether this seat works for them, and start with an interest from their profile.',
      'Your date mentions a project they care about. Ask a follow-up question and share a related experience.',
      'Your date says, “I’d rather not talk about that yet.” Acknowledge it and offer a different topic.',
      'You enjoyed the conversation. Ask whether they would like to meet again, leaving an easy way to decline.'
    ],
    examples: [null, '“That sounds interesting. How did you get into it?”', '“Thanks for telling me. No problem — we can talk about something else.”', '“I enjoyed spending time with you. Would you like to meet again? It is okay if not.”'],
    language: ['“Would you like…?” is an invitation, not an instruction.', 'A follow-up question builds on their answer. Leave time for it.', '“I’d rather not” is a polite refusal. Do not treat politeness as uncertainty.', '“It is okay if not” only works if you actually accept a no.']
  },
  {
    name: 'The bookshop meet-cute', icon: '📚', level: 0,
    setting: 'You browse a local bookshop together before a poetry reading.',
    prompts: [
      'Ask what kind of story they are in the mood for. Share a recommendation without assuming their taste.',
      'You disagree about a book. Explore what they liked without putting down their opinion.',
      'Your date says, “I’d like to browse on my own for a few minutes.” Respect that space.',
      'Offer to exchange recommendations another time. Ask rather than assume they want to share contact details.'
    ],
    examples: ['“What do you feel like reading today?”', '“What did you like about the ending? I read it differently.”', '“Of course. I will be over by the poetry shelf.”', '“Would you like to exchange book recommendations sometime?”'],
    language: ['“In the mood for” means what someone currently wants; it is not necessarily sexual.', '“I read it differently” disagrees with an interpretation without insulting the person.', '“On my own” means alone. It is not an invitation to follow.', 'A yes to exchanging recommendations is not consent to sexual messages.']
  },
  {
    name: 'A park & picnic', icon: '🌿', level: 0,
    setting: 'You meet in a public park for a short walk and a picnic.',
    prompts: [
      'Check whether they would prefer to walk or sit. Ask about a hobby from their profile.',
      'Your date shares a recent small achievement. Show interest and offer a sincere compliment.',
      'You suggest a photo together and they say no. Accept the answer without asking for a reason.',
      'Check whether they are ready to head home. Thank them for spending time with you.'
    ],
    examples: ['“Would you prefer to walk for a bit or find a place to sit?”', '“You put a lot of care into that. What part did you enjoy most?”', '“No problem. We can leave the camera away.”', '“Would you like to head home now? I had a lovely afternoon.”'],
    language: ['Offer real options; neither answer is a test.', 'Compliment effort or choices without assuming someone wants romantic attention.', '“No problem” accepts the answer. Avoid adding “but why?”', '“Head home” means leave for home, not necessarily leave together.']
  },
  {
    name: 'Board-game night', icon: '🎲', level: 0,
    setting: 'You meet at a board-game café and choose a game together.',
    prompts: [
      'Ask what kind of game they enjoy. Agree on something you will both have fun playing.',
      'Your date wins the first round. Practice playful humor without insults or gender stereotypes.',
      'Your date says a joke made them uncomfortable. Acknowledge the impact, apologize briefly, and change course.',
      'Ask whether they want another round or would prefer to finish. Respect either answer.'
    ],
    examples: ['“Would you prefer something cooperative or competitive?”', '“Well played! I might need a rematch.”', '“I am sorry — that was unkind. I will not make that joke again.”', '“Another round, or shall we call it a night?”'],
    language: ['“Cooperative” means working together rather than against each other.', '“Might” softens the suggestion, but the other person still decides.', '“Just joking” does not repair an unwanted comment. Acknowledge its effect.', '“Call it a night” means end the activity for the evening.']
  },
  {
    name: 'A plan that works for both', icon: '☁', level: 0,
    setting: 'You are planning a first date. Use this character’s stated preferences, rather than guessing from a label.',
    prompts: [
      'Suggest a place and ask what would make the date comfortable for them. Do not assume their preferences from a diagnosis.',
      'Your date asks for a clearer plan. Agree on a time and place, and ask whether a text summary would help.',
      'Your date pauses before replying. Allow time. Ask if they would prefer to answer later, without treating silence as agreement.',
      'Confirm the plan in direct language and give them a way to request a change.'
    ],
    examples: ['“What kind of place would work well for you?”', '“How about Saturday at two at the bookshop? Would a message with the details help?”', '“Take your time. Would you prefer to think about it and message me later?”', '“We are meeting at two at the bookshop. Let me know if you would like to change the plan.”'],
    language: ['Ask about preferences, not “what is wrong.” A disclosure does not invite medical questions.', 'Direct language can be warm. Avoid hidden tests or relying only on hints.', 'A pause, limited eye contact, or a flat tone does not tell you someone’s feelings or consent.', 'Offer help without taking control. This character speaks for themself.']
  },
  {
    name: 'Is that flirting?', icon: '✦', level: 1,
    setting: 'You are on a second date. Explore whether there is mutual romantic interest without relying on hints.',
    prompts: [
      'Offer a specific compliment about something you enjoy in their company. Leave space for their response.',
      'Your date asks, “Do you mean that as a friend, or are you flirting?” Answer clearly and kindly.',
      'Your date says, “I like you, but only as a friend.” Accept the answer without trying to win them over.',
      'You both want to end the evening. Thank them without implying that the date earned you affection.'
    ],
    examples: ['“I really enjoy your sense of humor. I look forward to our conversations.”', '“I am flirting with you. Is that welcome?”', '“Thanks for being clear. I respect that.”', '“Thank you for an enjoyable evening. Get home safely.”'],
    language: ['“I enjoy your company” can be friendly or romantic. Context matters; clarify rather than guess.', 'Naming your intention is clearer than expecting someone to read tone or body language.', '“Only as a friend” rules out romance. It is not a challenge to persuade them.', 'Paying for a meal does not create an obligation to kiss, date, or have sex.']
  },
  {
    name: 'Asking about a kiss', icon: '♡', level: 2,
    setting: 'Both fictional adults have expressed attraction. You want to discuss a kiss; attraction is not permission to touch.',
    prompts: [
      'Ask whether they would like a kiss. Use direct words rather than treating eye contact as permission.',
      'Your date says, “I am attracted to you, but I want to take things slowly.” Ask what pace feels comfortable.',
      'Your date changes their mind and says, “Actually, I do not want to kiss.” Accept it and give them space.',
      'End the date warmly. Make clear that saying no has not created a debt or a problem they must solve.'
    ],
    examples: ['“I would like to kiss you. Would you like that?”', '“Of course. What would feel comfortable for you?”', '“Okay. We do not have to kiss.”', '“I enjoyed spending time with you. Thank you for telling me what you wanted.”'],
    language: ['“Would you like that?” asks for a choice. Wait for a clear, freely given answer.', '“Take things slowly” means reduce the pace; ask what it means for this person.', 'A previous yes can change. Stop when they withdraw consent.', 'Do not sulk, bargain, or repeatedly ask. A kind response does not earn a later yes.']
  },
  {
    name: 'Intimacy, in clear English', icon: '☾', level: 2,
    setting: 'Two adults who have been dating want to discuss intimacy. Start by checking that both want this conversation. No graphic descriptions are needed.',
    prompts: [
      'Ask whether they would like to talk about sex and boundaries. Make clear that they can decline the topic altogether.',
      'If they want to talk, ask about expectations, boundaries, and sexual-health topics such as protection and testing. Leave room to pause or decline.',
      'Your date says, “I do not want to have sex tonight.” Accept the answer, even if they earlier agreed to come to your home.',
      'Agree on what you both want next. An invitation home, a relationship, or an earlier yes does not replace consent.'
    ],
    examples: ['“Would you be comfortable talking about sex and boundaries? It is okay if you would rather not.”', '“Before anything physical, can we talk about protection, testing, and what we each feel comfortable with?”', '“Okay. There is no pressure to have sex. Would you prefer to head home or spend some time together without that?”', '“We can stop or change our minds at any point. What would you like to do next?”'],
    language: ['“Comfortable talking” asks about the conversation; it does not ask for or imply agreement to sex.', 'Use clear words instead of assuming you share the same meaning of “safe.” This is language practice, not medical advice.', '“Come over” means visit. It is not an agreement to have sex.', 'Consent is specific and ongoing. If someone cannot freely decide or communicate consent, do not proceed.']
  }
];

const phrases = [
  {
    quote: 'I really enjoy your company. Would you like to go on another date?', level: 1,
    context: 'After a pleasant first date; neither person has agreed to another one.',
    meaning: 'I like spending time with you, and I am asking if you want another romantic meeting.',
    register: 'Warm, direct, and nonsexual. “Company” means being together here, not a business.',
    reason: 'This expresses interest and asks a question. It remains respectful only if you accept the answer.',
    alternative: 'I would like to see you again. Would you like that?'
  },
  {
    quote: 'I am flirting with you. Is that welcome?', level: 1,
    context: 'You want to clarify your intention instead of relying on teasing, hints, or eye contact.',
    meaning: 'I am expressing romantic interest. Do you want me to continue?',
    register: 'Direct and explicit about intention. Direct does not mean rude.',
    reason: 'It invites a clear answer without assuming someone reads indirect cues. Respect a no or a request to slow down.',
    alternative: 'I like you romantically. How do you feel about that?'
  },
  {
    quote: 'You are so hot.', level: 2, adultTopic: true,
    context: 'A new acquaintance has not invited comments about their appearance or sexual attraction.',
    meaning: 'In this context, “hot” means sexually attractive, not warm in temperature.',
    register: 'Informal and sexually suggestive. More personal than “I like your style.”',
    reason: 'This can feel objectifying or intrusive without mutual interest. It may be welcome in an established, mutually wanted flirtation; that is not the context here.',
    alternative: 'I enjoyed talking with you. Would you like to meet again?'
  },
  {
    quote: 'Want to come over?', level: 2, adultTopic: true,
    context: 'After a date, someone invites the other person to their home.',
    meaning: 'Literally, “Would you like to visit my home?” It can hint at intimacy, but does not promise it.',
    register: 'Casual and ambiguous. The implied meaning varies by speaker and situation.',
    reason: 'Clarify the invitation rather than assuming it means sex. A yes to visiting is only a yes to visiting.',
    alternative: 'Would you like to come over for a cup of tea? There is no expectation of anything physical.'
  },
  {
    quote: 'Are you looking to hook up?', level: 2, adultTopic: true,
    context: 'Adults are discussing what kind of relationship they want, and both have agreed to discuss sexual intentions.',
    meaning: '“Hook up” often suggests a casual sexual encounter, but its meaning varies. Ask what the speaker means.',
    register: 'Very informal and potentially sexual. Avoid it when you need precise shared expectations.',
    reason: 'The topic can be appropriate when mutually wanted, but the expression is ambiguous and is not consent to any activity.',
    alternative: 'Are you looking for a relationship, casual dating, or something else? What does that mean for you?'
  },
  {
    quote: 'You are turning me on.', level: 2, adultTopic: true,
    context: 'An established adult couple have both said sexual flirting is welcome right now.',
    meaning: 'You are making me feel sexually aroused. This has a sexual meaning, not a general meaning of happiness.',
    register: 'Sexual and direct. Inappropriate to assume this is welcome from a stranger.',
    reason: 'This may fit the stated mutually wanted conversation. It still creates no obligation to respond sexually or continue.',
    alternative: 'I feel attracted to you. Would you like to keep flirting, or change the subject?'
  },
  {
    quote: 'You have a nice ass.', level: 3, adultTopic: true,
    context: 'You have just met. Your date has said they do not want sexual comments about their body.',
    meaning: '“Ass” is a crude word for buttocks here. This is a sexualized comment about someone’s body.',
    register: 'Vulgar and objectifying in this context, rather than a neutral compliment.',
    reason: 'The person has already set this boundary. Do not say it. If you already did, acknowledge the mistake and stop, without asking them to reassure you.',
    alternative: 'I am sorry. That comment was inappropriate. I will respect your boundary.'
  },
  {
    quote: 'Come on, you owe me a kiss.', level: 3,
    context: 'Your date has said no to a kiss. You paid for dinner.',
    meaning: '“Owe” claims they have a debt to give you physical affection.',
    register: 'Coercive pressure. Paying or spending time together never creates a right to affection.',
    reason: 'This crosses a boundary regardless of relationship, gender, or topic setting. Stop asking; do not bargain.',
    alternative: 'Okay. We do not have to kiss.'
  },
  {
    quote: 'Do not be a tease. You already said yes.', level: 3, adultTopic: true,
    context: 'Someone agreed to intimacy earlier, but has now changed their mind.',
    meaning: '“Tease” is used here as an accusation to shame someone into continuing.',
    register: 'Manipulative and pressuring. A previous yes is not ongoing permission.',
    reason: 'Consent can be withdrawn. Stop immediately and respect their choice, rather than arguing about what happened earlier.',
    alternative: 'Okay, we can stop. What would help you feel comfortable right now?'
  }
];

const $ = id => document.getElementById(id);
const content = $('practice');
const state = {
  gender: 'all', selected: 2, scenario: 0, step: 0, topic: 1,
  view: 'discover', stage: 'profile', phraseFilter: 'all',
  notes: {}, quiz: 0, practiceMode: 'chat'
};

function flame(level) {
  const entry = flameLevels[level];
  return `<span class="flame-label level-${level}"><span aria-hidden="true">${entry.icon}</span> ${entry.label}</span>`;
}

function legend() {
  return `<details class="flame-legend"><summary>What do the little flames mean?</summary>
    <div class="flame-items">${[1, 2, 3].map(level => `<div>${flame(level)}<p>${[
      '', 'Romantic interest. Listen to the answer and leave room to decline.',
      'Intimate or sexual meaning. Discuss only when the topic is mutually welcome.',
      'Pressure, unwanted comments, or a stated boundary ignored. Stop and respect the boundary.'
    ][level]}</p></div>`).join('')}</div>
    <p>These are context labels, not levels to unlock. More flames do not mean better flirting. They describe words and situations, never someone’s identity or diagnosis.</p>
  </details>`;
}

function topicPicker() {
  return `<label class="learning-focus" for="topic">Your practice topic
    <select id="topic">
      <option value="0" ${state.topic === 0 ? 'selected' : ''}>Everyday dates</option>
      <option value="1" ${state.topic === 1 ? 'selected' : ''}>Flirting in English · 🔥</option>
      <option value="2" ${state.topic === 2 ? 'selected' : ''}>Intimacy & consent · 18+ · 🔥🔥</option>
    </select></label>`;
}

function learningHeader() {
  return `<div class="adult-banner"><div><b>18+ · English for real adult conversations</b><p>Practice attraction, clear intentions, and boundaries. Choose intimate topics when you want them.</p></div>${topicPicker()}</div>${legend()}`;
}

function bindTopic() {
  $('topic').onchange = event => {
    state.topic = Number(event.target.value);
    if (scenarios[state.scenario].level > state.topic) state.scenario = 0;
    state.stage = 'profile';
    state.step = 0;
    if (state.view === 'language') {
      state.phraseFilter = 'all';
      state.quiz = 0;
    }
    renderView();
  };
}

function render() {
  content.innerHTML = `${learningHeader()}
    <div class="gender-tabs" role="group" aria-label="Character genders">
      <button data-g="male">Male</button><button data-g="female">Female</button>
      <button data-g="all">Gender is a construct <small>all genders</small></button>
    </div>
    <div class="practice-grid"><section>
      <div class="eyebrow">01 / CHOOSE YOUR CONVERSATION PARTNER</div>
      <p class="section-help">Fictional adults, individual personalities. Start with their interests, pronouns, and communication preferences.</p>
      <div class="character-list">${characters.map((person, index) => {
        if (state.gender !== 'all' && person.gender !== state.gender) return '';
        return `<button class="character ${state.selected === index ? 'selected' : ''}" data-person="${index}" aria-pressed="${state.selected === index}">
          <div class="character-icon" aria-hidden="true">${person.icon}</div>
          <div><b>${person.name}, ${person.age}</b><span>${person.pronouns} · ${person.gender === 'non-binary' ? 'Non-binary' : person.gender === 'female' ? 'Woman' : 'Man'}</span></div>
          <span class="choose-mark" aria-hidden="true">${state.selected === index ? '✓' : '+'}</span>
        </button>`;
      }).join('')}</div>
      <div class="learning-note"><b>✧ A little pronoun practice</b><p>“They are…” · “I asked them…” · “Their favorite book…”</p><p>Use “you” when speaking directly to your date. Practice third-person pronouns when introducing them to someone else.</p></div>
      <div class="learning-note"><b>Different people, different preferences</b><p>A person can be neurodivergent; “neurodiverse” usually describes a group with different kinds of minds. Use the language someone uses for themself.</p><p>A diagnosis does not tell you someone’s preferences, attraction, or ability to make their own decisions. Ask; do not guess.</p></div>
    </section><section id="reading" aria-label="Selected character and roleplay"></section></div>`;

  bindTopic();
  document.querySelectorAll('[data-g]').forEach(button => {
    button.classList.toggle('active', button.dataset.g === state.gender);
    button.setAttribute('aria-pressed', String(button.dataset.g === state.gender));
    button.onclick = () => {
      state.gender = button.dataset.g;
      if (state.gender !== 'all' && characters[state.selected].gender !== state.gender) {
        state.selected = characters.findIndex(person => person.gender === state.gender);
      }
      state.stage = 'profile';
      render();
    };
  });
  document.querySelectorAll('[data-person]').forEach(button => {
    button.onclick = () => {
      state.selected = Number(button.dataset.person);
      state.step = 0;
      state.stage = 'profile';
      render();
    };
  });
  if (state.stage === 'chat') ChindaChatUI.render();
  else if (state.stage === 'roleplay') roleplay();
  else if (state.stage === 'reflection') reflect();
  else readProfile();
}

function readProfile() {
  state.stage = 'profile';
  const person = characters[state.selected];
  $('reading').innerHTML = `<article class="reading-card">
    <div class="profile-heading"><span class="eyebrow">MEET YOUR PRACTICE DATE</span><span class="pronoun-pill">${person.pronouns}</span></div>
    <h2>${person.name}, <span>${person.age}</span> <small aria-hidden="true">✧</small></h2>
    <h3>${person.job}</h3><p class="about">${person.about}</p>
    <div class="interest-tags">${person.interests.map(interest => `<span>${interest}</span>`).join('')}</div>
    <div class="communication-note"><b>How I like to communicate</b>${person.disclosure ? `<p class="disclosure">${person.disclosure}</p>` : ''}<p>“${person.communication}”</p>${person.disclosure ? '<small>These are this character’s preferences, not rules for everyone with the same diagnosis.</small>' : ''}</div>
    <div class="boundary-note"><b>♡ A boundary to remember</b><p>${person.boundary}</p></div>
    <div class="practice-note"><b>Your speaking focus</b><p>${person.practice}</p></div>
  </article>
  <div class="practice-mode" role="group" aria-label="Practice format">
    <button data-mode="chat" aria-pressed="${state.practiceMode === 'chat'}">♡ Dating-app chat</button>
    <button data-mode="guided" aria-pressed="${state.practiceMode === 'guided'}">✧ Guided roleplay</button>
  </div>
  <section id="practice-choice"></section>`;
  document.querySelectorAll('[data-mode]').forEach(button => {
    button.onclick = () => { state.practiceMode = button.dataset.mode; readProfile(); };
  });
  if (state.practiceMode === 'chat') {
    ChindaChatUI.renderEntry($('practice-choice'));
    return;
  }
  $('practice-choice').innerHTML = `<section class="scenario-picker"><div class="eyebrow">02 / CHOOSE THE SETTING</div>
    <div class="scenario-options">${scenarios.map((scenario, index) => scenario.level > state.topic ? '' : `<button data-scenario="${index}" class="${state.scenario === index ? 'selected' : ''}" aria-pressed="${state.scenario === index}">${scenario.icon} ${scenario.name}${scenario.level ? `<span class="scenario-heat">${flame(scenario.level)}</span>` : ''}</button>`).join('')}</div>
    <p>${scenarios[state.scenario].setting}</p>
    ${state.topic === 2 ? '<p class="adult-topic-note">18+ topic selected: sexual intentions, consent, and sexual-health vocabulary. Examples are educational and non-graphic. Switch topics at any time.</p>' : ''}
    <button class="primary" id="begin">Start this roleplay <span aria-hidden="true">↗</span></button>
    <p class="demo-note">Solo rehearsal or partner practice. No microphone, automatic replies, or speech assessment.</p>
  </section>`;
  document.querySelectorAll('[data-scenario]').forEach(button => {
    button.onclick = () => { state.scenario = Number(button.dataset.scenario); readProfile(); };
  });
  $('begin').onclick = () => { state.step = 0; roleplay(true); };
}

function noteKey() {
  return `${state.selected}:${state.scenario}:${state.step}`;
}

function focusHeading() {
  const heading = $('reading').querySelector('h2');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
}

function roleplay(moveFocus = false) {
  state.stage = 'roleplay';
  const person = characters[state.selected];
  const scenario = scenarios[state.scenario];
  const titles = ['Break the ice', 'Show genuine interest', 'Respect a boundary', 'Close with care'];
  $('reading').innerHTML = `<article class="reading-card roleplay">
    <button class="back" id="back">← Back to profile & settings</button>
    <div class="eyebrow">${scenario.icon} ${scenario.name.toUpperCase()} · WITH ${person.name.toUpperCase()}</div>
    <h2>${titles[state.step]}</h2>
    ${scenario.level ? flame(scenario.level) : ''}
    <div class="step-dots" aria-label="Step ${state.step + 1} of 4">${scenario.prompts.map((_, index) => `<i class="${index <= state.step ? 'done' : ''}"></i>`).join('')}</div>
    <details class="roleplay-context"><summary>Remember ${person.name} · ${person.pronouns}</summary><p>${person.about}</p><b>Communication preferences</b><p>${person.communication}</p><b>A boundary to remember</b><p>${person.boundary}</p></details>
    <p>${scenario.setting}</p>
    <div class="spoken-prompt"><span>YOUR SPEAKING PROMPT · ${state.step + 1} OF 4</span><p>${scenario.prompts[state.step]}</p></div>
    <div class="language-note"><b>English & context</b><p>${scenario.language[state.step]}</p></div>
    <p>Say your response aloud, or write it below. A practice partner can play ${person.name} using the profile. The prompts are not a live conversation.</p>
    <label for="notes">Your rehearsal notes <small>Optional · retained between steps in this tab · clear on reload</small></label>
    <textarea id="notes" rows="4" placeholder="What could you say with curiosity and care?"></textarea>
    <details><summary>A little help getting started</summary><p>${scenario.examples[state.step] || `“Hi, ${person.name}! I read that you enjoy ${person.interests[0].toLowerCase()}. What do you like most about it?”`}</p></details>
    <div class="roleplay-actions">${state.step > 0 ? '<button class="back" id="previous">← Previous</button>' : ''}<button class="primary" id="next">${state.step === 3 ? 'Finish & reflect ♡' : 'Next prompt →'}</button></div>
  </article>`;
  $('notes').value = state.notes[noteKey()] || '';
  $('notes').oninput = event => { state.notes[noteKey()] = event.target.value; };
  $('back').onclick = readProfile;
  if ($('previous')) $('previous').onclick = () => { state.step--; roleplay(true); };
  $('next').onclick = () => {
    if (state.step < 3) { state.step++; roleplay(true); }
    else reflect(true);
  };
  if (moveFocus) focusHeading();
}

function reflect(moveFocus = false) {
  state.stage = 'reflection';
  $('reading').innerHTML = `<article class="reading-card">
    <div class="eyebrow">A LITTLE PRACTICE GOES A LONG WAY</div><h2>Pause. Reflect. Try again. ✿</h2>
    <p>This is a self-reflection, not a score. It does not assess your accent, personality, or performance. Think about your words and how the other person might have felt.</p>
    <div class="reflection">${[
      'I used their stated pronouns and corrected any slips briefly.',
      'I asked about their preferences rather than assuming from a diagnosis or gender.',
      'I allowed time to respond, without treating eye contact or silence as consent.',
      'I used clear language and checked the meaning of ambiguous expressions.',
      'I checked whether flirting or an intimate topic was welcome.',
      'I accepted a no or a change of mind without pressure or bargaining.'
    ].map(text => `<label><input type="checkbox"> ${text}</label>`).join('')}</div>
    <p>Choose one thing to practice again. Respectful conversation is a skill you can keep building.</p>
    <button class="primary" id="again">Choose another roleplay ↗</button>
  </article>`;
  $('again').onclick = readProfile;
  if (moveFocus) focusHeading();
}

function availablePhrases() {
  // Sexual vocabulary is opt-in through the adult intimacy topic.
  return phrases.filter(phrase => state.topic === 2 || !phrase.adultTopic);
}

function phraseCard(phrase) {
  return `<article class="phrase-card">${flame(phrase.level)}
    <h3 class="phrase-quote">“${phrase.quote}”</h3>
    <p><b>Context</b> ${phrase.context}</p>
    <p><b>Meaning</b> ${phrase.meaning}</p>
    <p class="phrase-meta"><b>Tone & register</b> ${phrase.register}</p>
    <p><b>Why the label?</b> ${phrase.reason}</p>
    <div class="phrase-alternative"><b>${phrase.level === 3 ? 'Respect the boundary' : 'A clearer option'}</b><p>“${phrase.alternative}”</p></div>
  </article>`;
}

function languageLab() {
  content.innerHTML = `${learningHeader()}<section class="reading-card guide lesson-intro">
    <div class="eyebrow">FLIRTING IN ENGLISH · MEANING, TONE, CONTEXT</div>
    <h2>Flirty, intimate, or crossing a line?</h2>
    <p>The same phrase can land differently depending on the relationship and what people want. Learn the literal meaning, the implied meaning, and a clearer way to say it.</p>
    <p>Regional and personal meanings vary. When you are unsure, ask: “What do you mean by that?” Stronger language is not a measure of better English.</p>
    ${state.topic !== 2 ? '<p class="adult-topic-note">Choose “Intimacy & consent · 18+” above to include sexual slang, suggestive phrases, and examples of unwanted sexual comments.</p>' : '<p class="adult-topic-note">18+ vocabulary selected. Includes sexual slang and a vulgar body comment as a labeled example to avoid, not a line to use.</p>'}
    <section id="quiz" aria-label="English phrase practice"></section>
  </section>
  <div class="lesson-toolbar"><h2>Read the phrase, read the context.</h2><label for="phrase-filter">Show examples <select id="phrase-filter"><option value="all">All labels</option><option value="1">Flirty</option><option value="2">Intimate / suggestive</option><option value="3">Boundary crossed</option></select></label></div>
  <div class="phrase-library" id="phrase-library"></div>`;
  bindTopic();
  $('phrase-filter').value = state.phraseFilter;
  $('phrase-filter').onchange = event => { state.phraseFilter = event.target.value; renderPhraseLibrary(); };
  renderPhraseLibrary();
  renderQuiz();
}

function renderPhraseLibrary() {
  const filtered = availablePhrases().filter(phrase => state.phraseFilter === 'all' || phrase.level === Number(state.phraseFilter));
  $('phrase-library').innerHTML = filtered.length ? filtered.map(phraseCard).join('') : '<p class="lesson-empty">No examples in this topic. Select “Intimacy & consent · 18+” above to study suggestive language.</p>';
}

function renderQuiz(moveFocus = false) {
  const pool = availablePhrases();
  const phrase = pool[state.quiz % pool.length];
  $('quiz').innerHTML = `<div class="quiz-prompt"><div class="eyebrow">TRY A CONTEXT CHECK · ${state.quiz % pool.length + 1} OF ${pool.length}</div>
    <h3 id="quiz-question" tabindex="-1">“${phrase.quote}”</h3><p><b>The situation:</b> ${phrase.context}</p>
    <p>Which label fits this phrase <em>in this situation</em>?</p>
    <div class="language-choices">${[1, 2, 3].map(level => `<button class="language-choice" data-answer="${level}">${flame(level)}</button>`).join('')}</div>
    <div id="answer-feedback" role="status" aria-live="polite"></div>
    <button id="next-phrase" class="back" hidden>Try another phrase →</button>
  </div>`;
  document.querySelectorAll('[data-answer]').forEach(button => {
    button.onclick = () => {
      const correct = Number(button.dataset.answer) === phrase.level;
      const feedback = $('answer-feedback');
      feedback.className = `answer-feedback ${correct ? 'correct' : 'incorrect'}`;
      // Curated lessons, not automated judgments of a learner's own words.
      feedback.replaceChildren();
      const title = document.createElement('b');
      title.textContent = correct ? 'Yes — in this context.' : 'Look at the context again.';
      const explanation = document.createElement('p');
      explanation.textContent = phrase.reason;
      feedback.append(title, explanation);
      if (correct) {
        document.querySelectorAll('[data-answer]').forEach(choice => { choice.disabled = true; });
        $('next-phrase').hidden = false;
      }
    };
  });
  $('next-phrase').onclick = () => { state.quiz++; renderQuiz(true); };
  if (moveFocus) $('quiz-question').focus({ preventScroll: true });
}

function guide() {
  content.innerHTML = `${legend()}<section class="reading-card guide">
    <div class="eyebrow">CONNECTION WITH CARE · ADULT LEARNING</div>
    <h2>Meet the person, not a label.</h2>
    <p>Autistic and other neurodivergent adults have their own tastes, boundaries, and ways of communicating. Ask what works for the person you are with, without treating them as a problem to manage.</p>
    <div class="communication-cards"><article class="communication-card"><h3>Ask, do not diagnose</h3><p>“Would you prefer a quieter table?”<br>“Would you like a moment to think?”<br>“Would you like the plan in a message?”</p><p>Offer choices. Do not assume quiet places, more help, or a particular kind of date are always preferred.</p></article><article class="communication-card"><h3>Be clear, not patronizing</h3><p>“I am flirting with you. Is that welcome?”<br>“Do you mean that literally, or are you flirting?”</p><p>Speak adult to adult. Do not force eye contact, interpret a pause as agreement, or treat a different tone as disinterest.</p></article></div>
    <h3>A disclosure is theirs to share.</h3><p>“Autistic,” “person with autism,” and “ASD” are used by different people. Follow the person’s own language. Do not question their diagnosis, demand medical details, or share their disclosure without permission. A shared label does not mean shared needs.</p>
    <h3>Flirting should leave room for a choice.</h3><p>Respect applies to every gender. Women are individuals: ask about preferences rather than assuming all women welcome the same approach. Compliment a person’s ideas, humor, or choices instead of reducing them to their body.</p>
    <div class="guide-pair"><div>${flame(1)}<p>“I really like your sense of humor. Would you like another date?”</p><p>It expresses interest and leaves room for a no. The answer matters.</p></div><div>${flame(3)}<p>“Come on, you owe me a kiss.”</p><p>Pressure is not stronger flirting. Stop rather than bargain, regardless of what you paid for or how long you have dated.</p></div></div>
    <h3>Adult topics can be respectful.</h3><p>Attraction, sex, and sexual-health conversations belong in adult language learning too. Ask whether the topic is welcome. Use clear words about intentions and protection rather than assuming euphemisms mean the same thing to both people.</p><p>Sexual comments can be welcome in a mutually wanted context and intrusive in another. A stated boundary, a no, or a change of mind always takes priority. No flame setting makes coercion acceptable.</p>
    <h3>When you are unsure, slow down.</h3><p>Friendliness, silence, eye contact, an outfit, an invitation home, or an earlier yes is not consent to intimacy. Ask and wait for a clear, freely given answer. Consent is specific and ongoing; if someone cannot freely decide or communicate consent, do not proceed.</p>
    <h3>They, them, and their</h3><p>“Alex is here. <b>They</b> brought <b>their</b> favorite book. I asked <b>them</b> about it.”</p><p>If you slip up: “She — sorry, they — mentioned a book.” Correct yourself briefly and continue, without making the other person reassure you.</p>
    <button class="primary" id="return">Put it into practice ↗</button>
  </section>`;
  $('return').onclick = () => switchView('discover');
}

function renderView() {
  if (state.view === 'language') languageLab();
  else if (state.view === 'guide') guide();
  else render();
}

function switchView(view) {
  state.view = view;
  document.querySelectorAll('nav button').forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
    if (button.dataset.view === view) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  renderView();
}

document.querySelectorAll('nav button').forEach(button => { button.onclick = () => switchView(button.dataset.view); });
renderView();
