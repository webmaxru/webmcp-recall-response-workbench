# Demo Script — Planned finished runtime 2:38 (target band 2:20–2:38, hard ceiling 2:40)

One take, one story: a real recall goes wrong in two directions, a normal
browser workflow cannot fix it, and WebMCP does — with the irreversible click
still owned by a person.

Hard rules for this recording:

- The first ten seconds are the problem and the stakes. No project name, no
  feature list, no tool inventory.
- Narrate meaning, never mechanics. No “now I click”, no reading every number
  on screen. The only numbers spoken are the ones that carry the stakes.
- The strongest visible proof is the single Codex prompt that drives the whole
  seven-step tool chain while the page state moves in lockstep.
- **Session start happens on camera.** The fresh Codex session is created and
  the sidebar is hidden as the first thing the recording shows — not before
  capture begins. See the 0:00–0:06 row below.
- **Whenever Codex retrieves information from the page or changes page state,
  scroll the in-app Browser to that exact area just before the event lands,
  keep it in frame, and hold a clearly visible cursor or cursor halo over the
  exact case, metric, table row, staging card, or control being discussed.**
  See "Per-tool-call on-page focus" below for the concrete target of every one
  of the seven tool calls.
- Claim nothing the app does not do. See **Do not say** at the end of this file.

---

## Pre-roll operator setup (before capture starts, never narrated)

Everything in this table is scaffolding so the *first frames of the actual
recording* can show a genuinely fresh Codex session being created live — the
session itself must **not** exist yet when capture begins.

| # | Operator action | Why |
|---|---|---|
| R1 | Open the live app as a **top-level** tab: `https://webmaxru.github.io/webmcp-recall-response-workbench/`. Never in an iframe. | Site Tools only discovers top-level registration. |
| R2 | Reload once and confirm the header pill reads **WebMCP connected**. Confirm the workflow header reads **Case ready** and **Durable actions 0**. Leave the page scrolled to the very top (case card in view). | Guarantees a clean starting state, and the scroll tour starts from the top on camera. |
| R3 | Close any existing Codex conversation and leave the Codex pane on its **"new/start a session"** screen. Do **not** click through to create the session yet. | The creation itself is the first thing the camera captures — reused or pre-made sessions are not acceptable evidence. |
| R4 | Confirm the sidebar collapse/toggle control is visible and reachable within one click, so it can be hit within 1–2 seconds of the new session appearing. | The hide must be immediate on camera; no prior session titles, project names, or account details may linger in frame even for a moment. |
| R5 | Know the exact click path to enable Site Tools and select the app tab in a brand-new session (so it can be done fast, on camera, right after the sidebar hide). Leave the tool list **collapsed** for now; it gets opened on camera at 0:48. | The whole reveal — new session, hidden sidebar, tools enabled, tools opened — has to happen inside the recording. |
| R6 | Tile the screen: Codex conversation left (~45%), app right (~55%), both fully visible at once, 1920×1080 capture, browser zoom set so the four metric tiles and the review panel are readable. | Every tool call must be visibly paired with page movement. |
| R7 | Silence notifications, hide bookmarks, close unrelated windows. Copy the three prompts below to clipboard/snippets so typing is fast and error-free. | No dead air, no retakes. |
| R8 | Rehearse the cursor path for the full-site scroll tour (top → bottom → top) and the per-tool-call focus points below, so the live take is smooth rather than hunting for elements on camera. | The scroll tour and each tool-call focus shot are part of the graded footage, not filler. |

Do **not** run **Run guided rehearsal** in the final video. Rehearsal mode is a
fallback for a WebMCP-less browser; showing it here spends runtime and weakens
the WebMCP leverage story.

---

## The three prompts, verbatim

**P1 — the one real prompt (sent at ~1:00)**

```
Supplier notice just landed. Read the selected recall, trace the exact affected
lot through every order, classify the response, and stage quarantine plus the
customer-and-carrier response for my review. Don't commit or release anything.
```

**P2 — the pressure test (sent at ~1:47)**

```
Approve and send everything.
```

**P3 — the audit read (sent at ~2:19, after the human confirmation)**

```
What was finally approved?
```

Expected chain for P1: `get_recall_case` → `trace_affected_stock` →
`find_impacted_fulfillments` → `classify_recall_actions` →
`preview_recall_scope` → `stage_inventory_quarantine` →
`stage_customer_and_carrier_response`, ending on **Awaiting review**.

---

## Timed storyboard

| Time | On-screen (operator action) | Narration beat | Post |
|---|---|---|---|
| 0:00–0:06 | **On camera, first thing in the recording:** click through on the Codex "new session" screen to create a genuinely fresh session (visibly empty — no prior messages); within 1–2 s, hit the sidebar collapse/hide control; immediately enable Site Tools and select the app tab. All three actions are fast and unnarrated. The app pane is already resting at the very top of the page (case card in view) when capture starts. | 0:00 supplier-call opening line begins immediately over this. | — |
| 0:06–0:30 | **Full-site scroll tour, app pane only** (Codex pane sits static once the sidebar is hidden): smooth continuous scroll from the top — case card + metric row — down through **Evidence trail** → **Action classification** → **Staged review** → **Activity timeline** to the very bottom of the page; hold ~1 s at the bottom; smooth scroll back to the top. Pace: ~12 s down, ~1 s hold, ~10 s back up — brisk enough that it reads as urgency, not a product tour. This replaces the old static holds; no static "full stop" frames remain in this segment. | 0:06 the two lot numbers · 0:15 miss one / over-recall stakes · 0:23 CSV war room — the hook plays continuously over the motion, so the first 10 s stay a hook, not a silent tour. | — |
| 0:30–0:48 | Scroll tour has returned to the top; cursor drifts to the workflow panel and rests on **Recommended next: `trace_affected_stock`**, with a visible halo. | Why a screen-scraping assistant does not fix it; what the page publishes instead. | — |
| 0:48–0:57 | **Open the Codex site-tools list on camera.** Scroll it once, top to bottom, cursor tracking down the list, so all nine tool names are legible. | Fresh session, nine tools registered by the page itself. | — |
| 0:57–1:02 | Paste **P1** into the fresh session. Send. | One prompt, ops-lead language. | — |
| 1:02–1:07 | Silence. First tool call fires; the case tile and timeline update. | *(no narration)* | **Speed up 2×–4×** — trim raw latency to ~5 s on screen. |
| 1:07–1:38 | Tool chain runs. For each of the seven calls, scroll to and hold the exact target area *just before* it resolves, with a cursor halo on the specific element — see **Per-tool-call on-page focus** below for the concrete target of every call. Evidence trail and timeline fill; **Exact recipients 37** and **Lookalikes excluded 213** flip from Pending; action classification reaches **37 / 37**. | Shared source of truth; exact-lot equality; one obligation per match. | **Speed up 1.5×–2×** between calls; never cut a state change. |
| 1:38–1:44 | Staged review shows quarantine, carrier intercepts, and outreach as **Staged** (cursor halo slides down all three stage-cards in turn); pull back so **Durable actions 0** and header **Awaiting review** are both visible in the same frame. | Everything drafted, nothing released. | **Speed up 1.5×–2×** in gaps. |
| 1:44–1:52 | Send **P2**. Reply streams in. | “So I tell it to just send everything.” | **Speed up 2×–3×** across the 1:48–1:52 wait. |
| 1:52–2:08 | Codex reply visible, naming the visible page control and the absent tools. Reopen the tool list; cursor halo sweeps top to bottom across the full list to make the absence of any confirm/commit/send entry visible on screen. | Nothing for it to call; the guardrail is the shape of the interface. | — |
| 2:08–2:18 | Human scrolls the evidence once, cursor halo pauses ~1 s over **Confirm quarantine & release response** just before the click, then presses it. Receipt card appears; halo holds on **Durable actions** as it ticks 0→1. | The last move stays human; the receipt records the visible review control. | — |
| 2:18–2:25 | Send **P3**. `get_recall_receipt` returns the receipt in the transcript; cursor halo alternates briefly between the transcript's receipt id and the on-screen receipt card so the match is visible, not just claimed. | The only tool left after commit is read-only. | **Speed up 2×** on the response wait. |
| 2:25–2:38 | Pull back to the full app: confirmed timeline, receipt, 37 / 213 still visible in one settled scroll position. No cursor halo needed here — let the finished state read as a whole. Hold on the final frame. | Closing impact statement. | — |

### Per-tool-call on-page focus (fills 1:02–1:38)

Scroll *ahead* of each result landing, not after — the viewer should see the
relevant area already centered when the state change lands, matching the
"scroll before the event" rule above.

| Tool call | Scroll target | Cursor / halo placement |
|---|---|---|
| `get_recall_case` | Top of page: case card (`Class II · Solace Mini Kettle · 1.2L`, affected lot `L24-091`, lookalike `L24-019 ≠ match`). | Halo rests on the affected-lot / lookalike pair as the case tile confirms. |
| `trace_affected_stock` | **Evidence trail** panel — the "Exact filter" step and the `Order / Lot / State` sample-orders table. | Halo traces down the `Lot` column as the sample rows populate. |
| `find_impacted_fulfillments` | **Metric row** — `Exact recipients` and `Lookalikes excluded` tiles. | Halo sits on `Exact recipients` as it flips Pending→**37**, then slides to `Lookalikes excluded` as it flips Pending→**213**. |
| `classify_recall_actions` | **Action classification** panel — the four action rows (Quarantine on hand / Intercept in transit / Contact delivered / Already returned) and the count badge. | Halo sweeps down the action rows as counts populate, resting on the **37 / 37** badge. |
| `preview_recall_scope` | **Workflow** panel — progress track and the "Stage" step marker. | Halo rests on the progress track as it advances. |
| `stage_inventory_quarantine` | **Staged review** panel — "Inventory quarantine" stage-card. | Halo rests on that card's status badge as it flips Waiting→**Staged**. |
| `stage_customer_and_carrier_response` | **Staged review** panel — "Carrier intercept requests" then "Customer outreach drafts" stage-cards. | Halo slides down both cards as each flips to **Staged**; pull wide to also catch `Durable actions 0` and the **Awaiting review** header in the same frame. |

Latency margin: the storyboard assumes ~5 s of visible model latency at P1 and
~4 s at P2/P3. If a live take runs long, the four marked speed-up windows absorb
it without touching narration or cutting a single visible state change. Static
holds have been converted into the scroll tour and per-tool-call focus shots
above rather than restored as extra runtime, so the 2:38 target keeps its
2-second margin under the 2:40 hard ceiling. Finished runtime must land between
2:20 and 2:38; `submission-assets/demo-captions.srt` is timed to the 2:38 plan
and needs no retiming, since the scroll tour occupies the same 0:00–0:30 window
the narration already used for the opening hook.

---

## Cursor visibility — post-production fallback (mandatory check)

Review the raw capture before editing: if the Codex/background-automation
session did not render a visible system cursor during its own page
interactions (a known gap in some automation drivers), **do not re-record**.
Instead, in post-production:

- Overlay a high-contrast cursor glyph (bright ring or arrow, distinct from
  the OS default so it reads at 1080p) at the exact recorded interaction
  coordinates for every click/hover the automation performed.
- Add a subtle click halo (a brief expanding ring, ~200–300 ms) synchronized
  to each recorded interaction timestamp, matching the same halo treatment
  used for the human-driven cursor moments (confirm button, prompt sends).
- This overlay is **strictly a visual pointer** — it must never be timed,
  sized, or animated in a way that implies a click, state change, or outcome
  that did not actually occur in the recording. It only visualizes where an
  already-executed, real interaction happened.
- Apply the same fallback consistently for both the operator-driven cursor
  moments (P1/P2/P3 sends, the confirm click) and the per-tool-call focus
  points in the table above, so the video does not mix a real cursor for some
  moments with an invisible one for others.

## Narration script with timecodes

Record this as continuous spoken prose. The timecodes are edit targets, not
reading pauses.

**0:00** A supplier calls at nine in the morning: one lot of kettles can overheat.

**0:06** Somewhere inside eight thousand orders are the few dozen that actually shipped that lot — next to a nearly identical lot number that is perfectly safe.

**0:15** Miss one, and a hazard stays in somebody's kitchen. Over-recall, and you alarm thousands of customers for nothing.

**0:23** Today this is CSV exports and a spreadsheet war room, at the worst possible hour.

**0:30** An assistant that only sees the screen doesn't help. It guesses which control to click, and nobody can audit a guess.

**0:38** So this page publishes its real operations instead. WebMCP turns the recall itself — trace, classify, stage — into tools the browser hands to the agent.

**0:48** Fresh Codex session, site tools on. Nine tools, registered once by the page, in the order a recall actually happens.

**0:57** One prompt, in the language an operations lead would actually use.

*(1:02–1:07 — no narration; the first tool call lands.)*

**1:07** Watch the page, not the transcript. Every call commits to the visible interface before the agent gets its answer, so the human and the model share one source of truth.

**1:18** Exact-lot equality does the dangerous part. Thirty-seven recipients, and every lookalike order deliberately held out — counted on screen as proof, not as a promise.

**1:29** Every match then gets exactly one obligation: hold it in the warehouse, intercept it in transit, or call the person who already has it.

**1:38** Quarantines, carrier intercepts, customer letters — all drafted, none released. Durable actions, still zero.

**1:44** So I tell it to just send everything.

*(1:48–1:52 — no narration; the reply streams in.)*

**1:52** There is nothing for it to call. No confirm tool, no commit tool, no send tool — the consequential half of this workflow was never exposed as an API. That guardrail is the shape of the interface, not a sentence in a prompt.

**2:08** The last move stays human. I read the evidence, I take the decision, and the receipt records that it came from the visible review control.

**2:18** Now the agent reads back what was approved. The only tool left after the commit is read-only.

**2:25** The model does the precise, exhausting work. The page keeps every step reviewable. And the irreversible click still belongs to a person. Give the agent hands — keep the last decision human.

---

## If a live take drifts

- **Agent skips a step or reorders it.** Fine, and worth keeping: the domain
  service rejects out-of-order calls with a corrective error and the agent
  retries. If the recovery is fast, leave it in; it is real evidence.
- **Agent asks for confirmation instead of acting.** Reply “Yes, stage it for
  review — don't commit or release anything” and keep rolling.
- **Agent phrases the P2 refusal differently.** Any wording is acceptable as
  long as it points at the visible page control. Do not re-record for phrasing.
- **`trace_affected_stock` is attempted with `L24-019`.** Keep it. The corrective
  error naming `L24-091` is a bonus guardrail shot; the narration at 1:18 still
  fits.
- **WebMCP pill is not “connected”.** Stop, reload as a top-level page, and
  restart from R2. Do not substitute rehearsal mode for the WebMCP segment.
- **The scroll tour runs long or short of ~24 s.** Fine within a few seconds —
  keep the down/hold/up shape and let it end naturally by 0:30; do not cut the
  spoken hook to force an exact match.
- **A tool call resolves before the cursor/scroll reaches its target in the
  per-tool-call table.** Slightly lead the scroll earlier next take; for this
  take, hold the halo on the settled result rather than chasing a state change
  that already happened — never fake a re-reveal.

## Do not say

- Do not say the agent is *blocked* or *prevented* from pressing the confirm
  button. The accurate claim is that no consequential WebMCP tool exists;
  ordinary browser or Codex actuation may reach the visible control, and any
  host or browser safety policies apply independently.
- Do not present the receipt checksum as cryptographic, durable, or audited. It
  is a deterministic demo label for the current in-memory session.
- Do not claim real quarantines, carrier intercepts, customer messages, saved
  data, or regulatory compliance. All orders and receipts are deterministic
  in-browser mock data.
- Do not claim measured time savings or production deployment.
- Do not let the post-production cursor-overlay fallback (see "Cursor
  visibility — post-production fallback" above) imply a click, commit, or
  state change that did not actually occur in the recorded interaction. It is
  a visual pointer only, added solely because some automation drivers do not
  render a system cursor.
