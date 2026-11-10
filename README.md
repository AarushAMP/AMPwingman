# AMPwingman

AMPwingman is a small AI writing wingman for dating conversations. It can suggest a first message based on a profile detail, draft a reply, or polish a message in the tone you choose.

**You stay in control:** AMPwingman drafts suggestions only. It does not access dating apps, scrape profiles, or send messages.

## Features

- Start a chat, write a reply, or polish your own draft
- Choose a warm, playful, witty, or direct tone
- Get three short alternatives and copy one to edit
- No database and no prompt logging by this app
- Your API key stays on your own server, never in browser code

## Run it on your computer

You need Node.js 20.6 or newer and an OpenAI API key. API usage may incur charges under your OpenAI platform account.

1. Download or clone this repository.
2. Copy `.env.example` to a new file named `.env`.
3. Open `.env` and replace `replace_with_your_own_key` with your API key. Keep `.env` private; Git ignores it.
4. In Terminal, go to the project folder and run:

   ```sh
   npm install
   npm start
   ```

5. Open http://localhost:3000 in your browser.
6. Stop the server with `Ctrl+C` in Terminal when you’re done.

The model can be changed in `.env` to one available to your API account.

## Privacy and good use

- Use short profile snippets. Remove names, usernames, locations, and other private details.
- When you ask for suggestions, the text you entered is sent to OpenAI through its API. AMPwingman itself does not save the prompt or response. Review the AI provider’s current data controls before using personal information.
- Edit suggestions so they honestly sound like you. Respect a match’s boundaries and lack of interest.

## Project files

- `public/` contains the page, styles, and browser interactions.
- `server.mjs` calls the OpenAI Responses API and returns suggestions.
- `.env` holds your private local API key and must never be committed.
