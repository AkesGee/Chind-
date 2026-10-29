/* Scripted conversations live only in this tab. User text is always rendered as text. */
(() => {
  const conversations = new Map();
  const phases = ['opener', 'connection', 'invitation', 'planning', 'ready'];
  const phaseLabels = ['Say hello', 'Find a connection', 'Suggest a date', 'Agree the details', 'App → first meet'];
  const maximumLength = 600;

  function key() { return `${state.selected}:${state.topic}`; }
  function current() {
    if (!conversations.has(key())) {
      const session = ChindaChat.createSession(characters[state.selected], state.topic);
      conversations.set(key(), {
        session, messages: [{ from: 'bot', text: session.opening }],
        coach: null, closed: false, draft: ''
      });
    }
    return conversations.get(key());
  }

  function renderEntry(target) {
    const person = characters[state.selected];
    const existing = conversations.get(key());
    target.innerHTML = `<section class="chat-entry">
      <div class="eyebrow">02 / START WITH A MESSAGE</div>
      <h3>A match is just the beginning.</h3>
      <p>Chat with a simulated ${person.name}, find a shared interest, and practice suggesting a first meeting that works for both of you.</p>
      <ul class="chat-feature-list"><li>Type your own messages or edit a suggested opener.</li><li>Practice clear invitations, boundaries, and a public meeting plan.</li><li>Get small English and context hints along the way.</li></ul>
      <button class="primary" id="start-chat">${existing ? 'Return to your practice chat' : 'Match & start chatting'} <span aria-hidden="true">♡</span></button>
      <p class="chat-disclosure">Scripted simulator, not a real person or generative AI. Replies respond to common practice phrases. No account or microphone needed.</p>
    </section>`;
    document.getElementById('start-chat').onclick = () => { render(true); };
  }

  function appendMessage(message) {
    const person = characters[state.selected];
    const item = document.createElement('div');
    item.className = `chat-message from-${message.from}`;
    const author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = message.from === 'user' ? 'You' : message.from === 'bot' ? `${person.name} · simulated` : 'Practice note';
    const body = document.createElement('p');
    body.className = 'message-body';
    body.textContent = message.text;
    item.append(author, body);
    document.getElementById('chat-messages').append(item);
  }

  function scrollMessages() {
    const log = document.getElementById('chat-messages');
    log.scrollTop = log.scrollHeight;
  }

  function updateProgress(record) {
    const stage = ChindaChat.getStage(record.session);
    const position = phases.indexOf(stage);
    const list = document.getElementById('chat-progress');
    list.replaceChildren();
    phaseLabels.forEach((label, index) => {
      const item = document.createElement('li');
      item.className = index < position ? 'complete' : index === position ? 'current' : '';
      if (index === position) item.setAttribute('aria-current', 'step');
      item.textContent = label;
      list.append(item);
    });
  }

  function updatePlan(record) {
    const container = document.getElementById('chat-plan');
    container.replaceChildren();
    const heading = document.createElement('h3');
    const agreed = record.session.stage === 'ready' && !record.session.ended && !record.closed;
    heading.textContent = agreed ? 'Your fictional first-meet plan' : 'Build a plan together';
    container.append(heading);
    const details = document.createElement('dl');
    for (const [label, field] of [['Public place', 'venue'], ['Day', 'day'], ['Time', 'time']]) {
      const term = document.createElement('dt');
      term.textContent = label;
      const value = document.createElement('dd');
      value.textContent = record.session.plan?.[field] || 'Not agreed yet';
      details.append(term, value);
    }
    container.append(details);
    const note = document.createElement('p');
    note.textContent = agreed ? 'Practice plan agreed. No real meeting is booked. Either person can still change their mind.' : 'A first meeting needs a clear invitation, a public place, a day, a time, and agreement from both people.';
    container.append(note);
    if (agreed) {
      const button = document.createElement('button');
      button.className = 'primary';
      button.id = 'practice-first-meet';
      button.textContent = 'Rehearse the first meeting →';
      button.onclick = () => {
        const venue = (record.session.plan?.venue || '').toLowerCase();
        state.scenario = /book/.test(venue) ? 1 : /park/.test(venue) ? 2 : 0;
        state.step = 0;
        state.practiceMode = 'guided';
        roleplay(true);
      };
      container.append(button);
    }
  }

  function updateCoach(record) {
    const panel = document.getElementById('chat-coach');
    panel.replaceChildren();
    const hint = record.coach;
    if (!hint) {
      const heading = document.createElement('b');
      heading.textContent = 'A little help with your words';
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Start with an interest from their profile. Ask one question, leave room for an answer, and share something about yourself.';
      panel.append(heading, paragraph);
      return;
    }
    if (hint.level > 0) {
      const wrapper = document.createElement('div');
      // Only the fixed, trusted flame template is parsed as HTML.
      wrapper.innerHTML = flame(hint.level);
      panel.append(wrapper);
    }
    const title = document.createElement('b');
    title.textContent = hint.title;
    const paragraph = document.createElement('p');
    paragraph.textContent = hint.detail;
    panel.append(title, paragraph);
  }

  function updateSuggestions(record) {
    const choices = document.getElementById('chat-suggestions');
    choices.replaceChildren();
    if (record.closed || record.session.ended) return;
    ChindaChat.getSuggestions(record.session).slice(0, 3).forEach(text => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.onclick = () => {
        const input = document.getElementById('chat-input');
        input.value = text;
        record.draft = text;
        updateComposer(record);
        input.focus();
      };
      choices.append(button);
    });
  }

  function updateComposer(record) {
    const input = document.getElementById('chat-input');
    const stopped = record.closed || record.session.ended;
    document.getElementById('chat-counter').textContent = `${input.value.length} / ${maximumLength}`;
    document.getElementById('chat-send').disabled = stopped || !input.value.trim() || input.value.length > maximumLength;
    input.disabled = stopped;
    document.getElementById('end-chat').disabled = stopped;
    const notice = document.getElementById('chat-notice');
    notice.textContent = stopped ? 'Practice chat ended. You can review it here or start over.' : '';
  }

  function updatePanels(record) {
    updateProgress(record);
    updatePlan(record);
    updateCoach(record);
    updateSuggestions(record);
    updateComposer(record);
  }

  function sendMessage(record) {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text || text.length > maximumLength || record.closed || record.session.ended) return;
    const sent = { from: 'user', text };
    record.messages.push(sent);
    appendMessage(sent);
    const result = ChindaChat.respond(record.session, text);
    const received = { from: 'bot', text: result.reply };
    record.messages.push(received);
    appendMessage(received);
    record.coach = result.coach;
    record.draft = '';
    input.value = '';
    updatePanels(record);
    scrollMessages();
    if (!input.disabled) input.focus({ preventScroll: true });
    else document.getElementById('chat-notice').focus({ preventScroll: true });
  }

  function render(moveFocus = false) {
    state.stage = 'chat';
    const person = characters[state.selected];
    const record = current();
    document.getElementById('reading').innerHTML = `<article class="reading-card chat-card">
      <div class="chat-topbar"><button class="back" id="chat-back">← Profile & practice options</button><div class="chat-tools"><button id="restart-chat">Start over</button><button id="end-chat">End practice</button></div></div>
      <div class="chat-person"><div class="character-icon" aria-hidden="true">${person.icon}</div><div><h2 id="chat-heading" tabindex="-1">Chat with ${person.name}</h2><span>${person.pronouns}</span></div><span class="chat-presence">Scripted simulator</span></div>
      <p class="chat-disclosure">Fictional adults. Messages stay in this tab and clear on reload. Replies follow common practice phrases, not generative AI; they may miss nuance.</p>
      <ol class="chat-progress" id="chat-progress" aria-label="From app to first meeting"></ol>
      <div class="chat-layout"><div class="chat-main">
        <div class="chat-log" id="chat-messages" role="log" aria-label="Practice conversation with ${person.name}" aria-live="polite" aria-relevant="additions" tabindex="0"></div>
        <p class="chat-notice" id="chat-notice" role="status" tabindex="-1"></p>
        <div class="chat-suggestions" id="chat-suggestions" role="group" aria-label="Suggested messages to edit before sending"></div>
        <form class="chat-composer" id="chat-form"><label for="chat-input">Your message <small>Type freely, or choose and edit a suggestion.</small></label><textarea id="chat-input" rows="3" maxlength="${maximumLength}" placeholder="Ask about something in their profile…" aria-describedby="chat-counter"></textarea><div class="composer-footer"><small id="chat-counter">0 / ${maximumLength}</small><button type="submit" class="primary" id="chat-send" disabled>Send message ↗</button></div></form>
      </div><aside class="chat-sidebar">
        <details class="chat-context"><summary>${person.name}’s profile reminders</summary><p>${person.about}</p><b>How I communicate</b><p>${person.communication}</p><b>A boundary</b><p>${person.boundary}</p></details>
        <div class="chat-coach" id="chat-coach" role="status" aria-live="polite"></div>
        <p class="chat-disclosure">Hints spot a few wording cues. They cannot judge intent, consent, or your English proficiency.</p>
        <div class="chat-plan" id="chat-plan"></div>
      </aside></div>
      <details class="chat-reflection"><summary>Pause & reflect</summary><p>Did I read their profile, make space for their answers, and ask instead of assume? Did I accept a boundary without pressure? A good outcome can also be deciding not to meet.</p><p>For a real first meeting, agree on a public place, keep control of your travel, and let someone you trust know your plan. Do not put real addresses or contact details into this exercise.</p></details>
    </article>`;
    record.messages.forEach(appendMessage);
    const input = document.getElementById('chat-input');
    input.value = record.draft;
    input.oninput = () => { record.draft = input.value; updateComposer(record); };
    input.onkeydown = event => {
      if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        sendMessage(record);
      }
    };
    document.getElementById('chat-form').onsubmit = event => { event.preventDefault(); sendMessage(record); };
    document.getElementById('chat-back').onclick = readProfile;
    document.getElementById('restart-chat').onclick = () => { conversations.delete(key()); render(true); };
    document.getElementById('end-chat').onclick = () => {
      record.closed = true;
      const message = { from: 'system', text: 'You ended the practice. No messages were sent to a real person.' };
      record.messages.push(message);
      appendMessage(message);
      updatePanels(record);
      scrollMessages();
      document.getElementById('chat-notice').focus({ preventScroll: true });
    };
    updatePanels(record);
    scrollMessages();
    if (moveFocus) {
      document.getElementById('chat-heading').focus();
    }
  }

  globalThis.ChindaChatUI = { render, renderEntry };
})();
