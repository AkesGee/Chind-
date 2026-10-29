# Chinda ✦

A cute anime-inspired English and dating-app practice app for adults (18+). Choose a fictional adult character, read their interests, pronouns, individual communication preferences, and boundaries, then start a simulated chat. Includes male, female, and non-binary characters, including two autistic adults with different preferences.

In **Dating-app chat**, type your own messages or edit suggested messages before sending. A local scripted character replies to common conversation patterns. Practice an opener, reciprocal conversation, a low-pressure invitation, and a clear fictional public meeting plan. A complete plan needs a day, time, public venue, and a separate confirmation. Declining, staying in the app, or changing your mind are valid outcomes. Once a plan is agreed, you can optionally rehearse the first meeting. The separate **Guided roleplay** format remains available.

The chatbot is a transparent, rule-based simulator, not generative AI or a real match. Its vocabulary and context recognition are limited. Its small flame hints are practice cues, not authoritative judgments of intent, consent, English proficiency, or personality. The simulator does not book meetings or contact other people.

Choose everyday dates, flirting, or opt into the intimacy and consent topic. The latter includes non-graphic sexual-health conversation prompts, sexual slang, and a labeled vulgar example to avoid. Small flame markers distinguish flirty language, intimate/suggestive language requiring a context check, and boundary-crossing language that needs to stop. Flames describe words in context, never diagnoses or people, and are not progression levels.

The English phrase library explains meaning, register, context, and alternatives. Its interactive context checks use curated explanations; they do not assess a learner's own speech. The respect guide covers pronouns, neurodivergent communication preferences, individual choice, and consent.

The pink visual theme uses original decorative SVGs: Japanese-inspired sakura and wave patterns, Tibetan-inspired geometric woven borders, and Himalayan mountain silhouettes. The artwork is decorative; it does not change the lessons or use religious text. Static hosting should include `index.html`, `style.css`, `theme.css`, `chat.css`, `chat-engine.js`, `chat-ui.js`, `app.js`, and the `assets` directory.

Run `npm run dev` from this directory. The app serves on port 3000. Python 3 is required; there are no package dependencies or build steps.

Run `npm test` for the scripted conversation engine's tests. The tests cover conversation flow, public-meeting confirmation, refusal, cancellation, and context-sensitive boundary handling.

The app does not record speech, assess language, or send chat messages externally. Chat transcripts, drafts, and rehearsal notes remain in memory in the current tab and clear on reload. Conversations are separate for each character and practice topic. No backend, credentials, or persistent user storage are required. The app identifies its adult audience but does not implement age verification.
