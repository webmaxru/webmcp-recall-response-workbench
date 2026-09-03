# Devpost Submission Copy

## Project name

Recall Response Workbench

## Tagline

Find the right 37, protect the other 8,383, and put the irreversible decision behind a visible review control.

## Why is this a strong fit for WebMCP?

Product recalls are ideal structured-agent work: many precise, auditable steps happen inside a UI, but the final operational decision should remain with an accountable person. WebMCP lets the page expose exact business operations instead of asking an agent to scrape tables or guess which controls to click. The tool set follows the recall lifecycle—read, trace, resolve, classify, preview, and stage—while the visible page stays synchronized after every call.

The demo makes WebMCP’s value concrete. It searches 8,420 generated orders, returns exactly 37 orders for lot `L24-091`, and explicitly proves that 213 orders from the confusable `L24-019` lot were excluded.

## How is the user experience better?

The user receives a reviewable answer, not an opaque automation result. Exact-match evidence, fulfillment states, action classifications, staging status, and activity history are visible in one responsive workbench. Agents can do the repetitive reconciliation, while final commit occurs through a visible normal page control. The complete atomic tool set is registered once, and domain preconditions reject out-of-order actions with corrective errors.

The product also works immediately in demos: a clearly labeled deterministic rehearsal invokes the same domain service when WebMCP is unavailable and still stops at the visible review gate.

## What can humans and agents now do together?

An agent can read the selected recall, trace an exact supplier lot, find affected fulfillments, classify a response for every match, preview the scope, and stage 10 warehouse quarantines, 9 carrier intercept requests, and 18 customer outreach drafts. Classifications remain mutually exclusive: each in-transit order is an intercept, while its response package also includes a customer notice. A reviewer can inspect the evidence, verify the 37 exact recipients and 213 exclusions, cancel drafts, or activate the visible final control. Ordinary browser or Codex actuation may also reach that control. Any host or browser safety policies apply independently; the app’s safety claim is specifically that no consequential WebMCP tool exists. After confirmation, the agent can read—never create through WebMCP—the current rehearsal receipt.

## How was it implemented?

The submission is a static Vite + React + TypeScript app with plain CSS and deterministic in-memory data. Imperative WebMCP tools are registered atomically in the top-level document through `document.modelContext`, with a legacy `navigator.modelContext` fallback. All registrations are initiated together; when any failure is observed, the lifecycle rolls back its successfully registered tools and aborts pending work. An `AbortController` manages registration lifetime; callbacks accept optional execution options for older previews and polyfills, validate input in code, and define the synchronous domain transition as the mutation commit point before paint synchronization.

Read-only and mutation annotations are accurate. Mutating tools commit through a synchronous React `flushSync` boundary and do not yield to paint hooks after state mutation. The app does not expose a confirm, commit, release, or send WebMCP tool. Vitest covers exact counts, carrier/customer staging, ephemeral receipt reset, confusable-lot rejection, one-time registration, asynchronous cleanup, duplicate protection, and synchronous visible mutation.

## Impact

This prototype demonstrates how explicit browser tools can reduce brittle UI automation and make a high-consequence workflow easier to audit. It does not claim measured production savings or regulatory approval. Its grounded claim is narrower: for the included deterministic scenario, every one of 8,420 orders is evaluated, all 37 affected orders are identified, all 213 confusable-lot orders are excluded, and zero durable actions occur before review confirmation.

## Submission links and publication status

- **Configured live URL:** https://webmaxru.github.io/webmcp-recall-response-workbench/
  — currently returns HTTP 404, so the submission is blocked until a working
  deployment is published and re-tested. The source includes a standard GitHub
  Pages Actions workflow; repository Pages must use **GitHub Actions** as its source.
  Once published, access must remain free and unrestricted through September 21,
  2026 at 5:00 p.m. PT.
- **Source:** https://github.com/webmaxru/webmcp-recall-response-workbench
  — public; GitHub detects the root MIT license.
- **Video:** no MP4 is committed. Recording drafts and final masters remain only
  under the ignored local `submission-video/` directory. Publish a final YouTube
  recording that follows `DEMO_SCRIPT.md` — a fresh Codex session showing real Site
  Tool discovery and calls. The current final-master runtime is 2:22. Use the
  generated upload-ready caption file at `submission-assets/demo-captions.srt`.

## Run and judge the source

Requirements: a current Node.js 20 or 22 release supported by Vite.

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

Open the Vite URL directly as a top-level page. Use the ChatGPT desktop in-app
browser or Google Chrome 149 or later. Chrome testing requires a secure context
(`http://localhost` or HTTPS) and
`chrome://flags/#enable-webmcp-testing`. Confirm that nine tools register,
confusable lot `L24-019` is rejected, out-of-order calls return corrective errors,
visible state advances before tool completion, and no WebMCP tool can confirm or
release the staged response.

Repository history begins with this challenge implementation; no separate
pre-existing application is evidenced. The recall domain model, UI, WebMCP surface,
tests, and documentation are the hackathon work.
