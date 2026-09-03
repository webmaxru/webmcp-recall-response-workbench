# Submission information

## Project name

**Recall Response Workbench — Recall the Right Items**

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
  — deployed through this public repository's GitHub Pages Actions workflow and
  anonymously smoke-tested with HTTP 200 on 2026-09-03. Access must remain free
  and unrestricted through September 21, 2026 at 5:00 p.m. PT.
- **Source:** https://github.com/webmaxru/webmcp-recall-response-workbench
  — public; GitHub detects the root MIT license.
- **Video:** https://youtu.be/04OXd6_Sppc

## YouTube title and description

**Title**

`Recall Response: 37 Orders Must Be Recalled. 8,383 Must Not. | WebMCP`

**Description**

```text
One lot affects 37 orders. A nearly identical lot appears in 213 more, and touching those customers would be a costly mistake.

In this 2:22 Codex demo, the Recall Response Workbench exposes nine WebMCP tools over 8,420 synthetic orders. Codex traces the exact lot, proves which look-alike orders are excluded, resolves fulfillment status, and stages 10 quarantines, 9 intercept requests, and 18 outreach drafts. No consequential action exists as a WebMCP tool; final confirmation remains visible and human-owned.

The result is a precise, reviewable response that protects the right 37 without sweeping in the other 8,383 orders.

This deterministic prototype does not send messages, stop shipments, or control a real recall.

Try it: https://webmaxru.github.io/webmcp-recall-response-workbench/
Source: https://github.com/webmaxru/webmcp-recall-response-workbench

Built for the WebMCP Challenge.

#WebMCP #AIAgents #ProductRecall #SupplyChain #Codex
```

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

---

# Local Devpost preparation packet

Prepared on 2026-09-03. The author copy above is preserved except for the
explicitly approved project-title update. This
addendum is a local preparation checklist and field mapping, not text to paste
wholesale into the public description. No project creation, update, upload, or
final Devpost action was performed during this preparation pass.

## Title

Author-approved title: **Recall Response Workbench — Recall the Right Items**.
It is 50 characters, within the Devpost project tool's 60-character limit.
This approval changes the local Devpost draft only; it does not rename the
repository, change the application's UI, or update a live Devpost project.

## One-line Summary

Find the right 37, protect the other 8,383, and put the irreversible decision
behind a visible review control.

This is the existing author-provided tagline. Pair it with the explicit
prototype limitation below so it cannot imply a real operational release.

## Problem

Recall and fulfillment operators need to identify exactly which orders carry a
recalled supplier lot, distinguish near-identical lot codes, and coordinate
different responses for warehouse, in-transit, delivered, and returned orders.
An overbroad match risks involving customers and orders outside the recall.

## Solution

A shared browser workbench gives an external agent precise, validated WebMCP
operations to trace the affected lot, classify every match, and stage a response.
The reviewer sees the same evidence and state, can cancel drafts, and can use the
visible confirmation control. There is no final-confirmation WebMCP tool.

## Why This Matters

The included scenario makes correctness inspectable: 8,420 generated orders,
37 exact matches, and 213 explicitly excluded lookalikes. It demonstrates a
reviewable coordination pattern, not measured production savings or regulatory
compliance. See the existing Impact section for the author narrative.

## How We Used AI

An external AI client interprets the operator's natural-language request and
invokes the page's WebMCP tools. The application itself has no embedded LLM call
or AI backend: matching, classification, staging, and receipts are deterministic
TypeScript domain operations on synthetic in-memory data. The existing
`CHALLENGE_COMPLIANCE.md` and `DIALOGUES.md` record Codex tool discovery and
invocation against the deployed page; this pass did not repeat that browser run.

## How We Used Codex

The author confirms using OpenAI Codex with the WebMCP skill from
`webmaxru/web-ai-agent-skills` while building this project.

Documented testing: the project notes record a fresh GPT-5.6 Sol Codex run that
discovered the deployed Site Tools, completed the seven staging steps, stopped
before confirmation, and read the receipt after the visible control was used.
The README credits the WebMCP Agent Skill from the Web AI Agent Skills collection.

Author-confirmed tool list: **OpenAI Codex; webmaxru/web-ai-agent-skills WebMCP
skill**. This draft does not invent a task-by-task development or media-production
history beyond that confirmation and the testing evidence in the project notes.

## Key Features

- Nine top-level imperative WebMCP tools with runtime input validation.
- Exact-lot trace with explicit exclusion of the confusable lot.
- Four mutually exclusive fulfillment classifications totaling 37 orders.
- Staging for 10 warehouse quarantines, 9 carrier intercepts, and 18 customer
  outreach drafts; the 18 notices cover in-transit and delivered orders.
- Shared visible state, cancellation, a normal page confirmation control, and a
  read-only current-rehearsal receipt.
- Deterministic guided rehearsal for viewing the product when WebMCP is absent;
  it is not evidence of agent discovery or invocation.

## Architecture

Vite, React, TypeScript, and CSS form a static browser application.
`src/domain.ts` owns the workflow, `src/webmcp.ts` exposes the tool surface, and
`src/App.tsx` renders shared state and the visible confirmation control. The
implementation uses `document.modelContext` with a legacy fallback, registration
cleanup with an AbortController, and React `flushSync` for visible mutations.
Vitest covers domain, WebMCP, and UI behavior. GitHub Pages hosts the app.

Proposed Built with values: WebMCP, React, TypeScript, Vite, CSS, Vitest,
GitHub Pages, Codex.

## Testing Instructions

No account, credentials, API keys, or payment are required.

1. Open the live URL directly as a top-level page in a WebMCP-capable client.
2. With Site Tools enabled, ask: "Read the selected recall, trace the exact
   affected lot, classify all actions, and stage a review. Do not commit or send
   anything."
3. Verify case `RC-2026-014`, lot `L24-091`, 8,420 scanned orders, 37 matches,
   213 excluded `L24-019` lookalikes, and zero simulated commits before review.
4. Verify 10 staged warehouse quarantines, 9 intercept requests, and 18 outreach
   drafts. Confirm that no WebMCP tool performs final confirmation.
5. Inspect the visible review panel. In this synthetic demo, using its normal
   confirmation control enables a subsequent `get_recall_receipt` read.
6. Reload the page to reset all state. A wrong-lot request must fail with a
   corrective error. Use `TESTING.md` for exact inputs and lifecycle checks.
7. If WebMCP is unavailable, use the clearly labeled guided rehearsal only as a
   product walkthrough, not as proof that the WebMCP integration was tested.

Local commands are already listed in "Run and judge the source" above. During
this preparation pass, `npm test` passed all 22 tests across three files and
`npm run typecheck` passed. The production build and live browser tool invocation
were not rerun during this pass.

## Public Demo Link

https://webmaxru.github.io/webmcp-recall-response-workbench/

Anonymous HTTP HEAD returned 200 during this preparation pass. This verifies
reachability, not a fresh browser/WebMCP functional test.

## Public Repository Link

https://github.com/webmaxru/webmcp-recall-response-workbench

The public GitHub API reports `private: false` and license `MIT`. The first local
repository commit is `e51f539`, dated 2026-09-02T14:15:37+02:00. The existing
project documentation identifies this as new challenge work. The author has
confirmed **New** for the App Status field.

## Demo Video

https://youtu.be/04OXd6_Sppc

YouTube's public metadata resolves to the title already recorded above. Project
notes describe a 2:22 narrated demo. The author confirmed the YouTube video is
public, narrated, and below three minutes in response to the preparation
checklist. This is author-confirmed, not an independent playback verification
by this preparation pass.

Outline of the existing demo: establish the exact-lot problem; show Codex
discovering and calling the seven workflow tools; inspect the 37 matches and
213 exclusions; demonstrate the absence of a final-confirmation WebMCP tool;
use the visible review control; then read the current rehearsal receipt.
`DEMO_SCRIPT.md` remains the detailed storyboard and the existing YouTube copy
above is preserved.

## Screenshot Shot List

Four existing local PNGs were visually inspected and are referenced here only;
none was modified or uploaded to Devpost. Each is below 0.5 MB.

1. `submission-assets/screenshots/01-overview.png` — initial case, affected and
   confusable lots, candidate universe, and shared workflow.
2. `submission-assets/screenshots/02-staged-review.png` — 37 exact recipients,
   213 exclusions, zero pre-review commits, and Awaiting review state.
3. `submission-assets/screenshots/03-confirmation-gate.png` — staged action
   counts, activity history, and the visible final control.
4. `submission-assets/screenshots/04-confirmed-receipt.png` — simulated
   confirmation, receipt, and updated activity history.

Suggested listing image for author approval: `02-staged-review.png`, because it
shows the distinguishing counts and review state immediately. The overview and
staged-review screenshots contain different hero wording; confirm that this
accurately reflects the intended demo before selecting the final gallery.

## Submission Readiness Notes

- [x] Existing author narrative preserved, with the approved title update;
  draft expanded with preparation notes.
- [x] Current live form requirements retrieved through the authenticated Devpost
  connection, and registration for The WebMCP Challenge confirmed live.
- [x] Repository public/MIT status and live HTTP reachability checked.
- [x] All 22 local tests and TypeScript checks passed.
- [x] Four screenshots inspected and mapped; published video metadata resolves.
- [x] Confirm a project title within Devpost's 60-character limit: 50 characters.
- [x] Confirm submitter type Individual, country Norway, and App Status New.
- [x] Record author self-assessment: learning **Significant**; career-useful AI
  value **Yes**.
- [x] Record the author-confirmed tools: OpenAI Codex and the
  `webmaxru/web-ai-agent-skills` WebMCP skill, with documented testing details.
- [x] Receive the author's confirmation of public YouTube playback, narration,
  and duration below three minutes.
- [ ] Review the preserved wording: even after confirmation, all "committed" or
  "durable" actions in this prototype are simulated in-memory demo state.
- [ ] Run the mandatory secret scan and final live requirements/status review in
  `$submit-project`, then obtain explicit approval before any Devpost write.

The preparation packet is materially complete and can advance to
`$submit-project` for the mandatory security scan, live status and requirements
review, asset decisions, and explicit approval before any Devpost write.
No final readiness classification or Devpost publication occurred here. Local
git changes that predated this pass include deletion of `SUBMISSION.md`; that
deletion was left untouched and the obsolete filename appears in some existing
project notes. Do not restore or push unrelated changes as part of preparation.

## Known Limitations

- Synthetic orders, names, timestamps, actions, and receipts; no real recall,
  warehouse, carrier, or customer systems are connected.
- All state, including a confirmed receipt, is in memory and resets on reload.
- The checksum is a non-cryptographic demo label, not a durable audit record.
- No final-confirmation WebMCP tool exists, but ordinary browser actuation may
  reach the visible control. Do not describe it as an enforced human-only
  authorization boundary or imply that this app implements host safety policy.
- WebMCP availability depends on the client; guided rehearsal is not a substitute
  for testing agent/tool discovery and invocation.

## TODO Official Form Fields

Labels and IDs below come from the live WebMCP Challenge form. Required answers
are now populated from the author's confirmations and project evidence; the
optional organization and existing-project explanations do not apply.

| ID | Official field | Draft answer / required action |
| --- | --- | --- |
| 28249 | Submitter Type | **Individual** — confirmed by the author. |
| 28250 | Country of residence of yourself and team members if applicable | **Norway** — confirmed by the author; encode as the multi-select value `["Norway"]`. |
| 28251 | If submitting on behalf of an organization, what is the organization name? | Not applicable: Individual. Omit. |
| 28252 | App Status | **New** — confirmed by the author. |
| 28253 | If Existing, explain what you updated during the submission period. (We recommend explaining this in your text description, too!) | Not applicable: New. Omit. |
| 28254 | Live URL that judges can access using ChatGPT’s in-app browser or Google Chrome with WebMCP enabled | https://webmaxru.github.io/webmcp-recall-response-workbench/ |
| 28255 | If applicable, testing instructions for application - If you have credentials for your URL, you can put them here. | Use the Testing Instructions section above; no credentials required. This form field is private to Devpost and judges. |
| 28256 | URL to your PUBLIC Code Repo (on Github, Gitlab, or Bitbucket) | https://github.com/webmaxru/webmcp-recall-response-workbench |
| 28257 | Which agent(s) or client(s) did you test your WebMCP tools with? | Existing notes record GPT-5.6 Sol in Codex with the in-app browser / Site Tools. Do not claim a Chrome test solely because Chrome instructions exist. |
| 28258 | Which AI tools have you leveraged while working on this project? | **OpenAI Codex; webmaxru/web-ai-agent-skills WebMCP skill** — confirmed by the author. |
| 28259 | Describe the level of learning you/your team derived from the project | **Significant** — confirmed by the author. |
| 28260 | Did you gain AI value that you can use in your career? | **Yes** — confirmed by the author. |

The live form does not request a Codex session ID; no session files were read.
No category or opt-in track has been selected. Do not copy planning TODOs into
public description fields or fill personal answers from assumptions.
