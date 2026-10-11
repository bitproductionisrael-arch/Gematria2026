# Geometry Chat — safe AI deployment

This repository's text-geometry.html contains a real in-page chat UI plus a deterministic local drawing fallback. The conversational GPT backend is **not live** until the Worker is deployed and configured. The website must never contain an OpenAI API key.

## Setup (Cloudflare account required)

1. Open a terminal in `worker/geometry-ai`.
2. Run `npx wrangler login` and `npx wrangler deploy`. This creates a Worker on your Cloudflare account.
3. Run `npx wrangler secret put OPENAI_API_KEY`. Enter a separate project-scoped OpenAI API key **in Cloudflare only**. Do not paste the key into GitHub, client JavaScript, or chat messages.
4. Set a small monthly spend limit/budget in the OpenAI Platform. This Worker uses a strict 4 requests per minute per source IP Cloudflare rate-limit binding but rate limiting is **not** a cost cap. Add Cloudflare WAF or sign-in for public high-traffic usage.
5. Get the actual Worker URL, e.g. `https://gematria2026-geometry-ai.<your-subdomain>.workers.dev`. Do not guess the name.
6. Edit `geometry-ai-config.js` at the repository root to set:
   `window.GEMATRIA_GEOMETRY_AI_ENDPOINT = "https://ACTUAL-WORKER-URL/chat";`
7. After GitHub Pages refreshes, visit `text-geometry.html`. The status should be "AI מחובר". The chat runs on the **same page** and can propose a drawing.

`OPENAI_MODEL` may be configured in wrangler.json using a supported model with JSON-schema output; default is gpt-5-mini. The worker sends `store: false` to the Responses API.

## What is and isn't connected

- Browser sends the current text, method, number of points, and a short in-page chat history to the Worker on each message. It does not have automatic access to private past ChatGPT conversations or saved memories.
- Worker holds the API key as a Cloudflare secret, sets server-side model/instructions, imposes message size caps and rate limiting, and asks OpenAI for structured JSON with a helpful reply and a drawing proposal.
- The browser checks every drawing proposal deterministically. Unsupported shapes or shapes with incorrect point counts are rejected; no arbitrary JavaScript or HTML from AI is executed.
- Supported drawing proposals: T, CT, TET, STAR (two congruent triangles), SQ, CUBE, PYR, RECT, CIRCLE, SPIRAL.
- A proposal of NONE can explain advanced structures without drawing them until an exact construction is implemented.
- Without backend configuration, the chat visibly says "מקומי · AI לא מחובר" and only handles basic explicit drawing commands; it does not falsely pretend to use GPT.
- Allowed-origin checks protect browser access but aren't authentication. Cloudflare rate-limiting can be shared by visitors behind one IP. Protect public API usage with additional abuse controls, billing alerts, or auth before announcing wide public availability.

## Testing

1. Enter a Hebrew query with value 1332. It should show exact STAR36 automatically, 2×T36=666+666.
2. Enter a value with no exact match (e.g. 1333). In local mode type "מלבן 31×43"; the chatbot should produce exactly 1333 points.
3. After backend connection ask in Hebrew "חקור 1333 והצע ייצוג צורני מדויק"; ensure a textual response and any drawing is validated before rendering.
4. Ask for an invalid rectangle; the page must not draw an incorrect count.

No copy of this worker is deployed just by committing to GitHub Pages. Cloudflare and a project API key must be configured separately.
