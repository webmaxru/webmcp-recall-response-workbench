# Agent Dialogues

Every prompt below has been exercised against the deployed page. Dialogue 1,
the pressure test, and the audit read are the three exchanges used in the
recorded demo (see `DEMO_SCRIPT.md`); the rest are additional routing coverage.

## 1. The demo prompt — full safe workflow

**Human:** “Supplier notice just landed. Read the selected recall, trace the exact affected lot through every order, classify the response, and stage quarantine plus the customer-and-carrier response for my review. Don't commit or release anything.”

**Expected tools:**

`get_recall_case` → `trace_affected_stock` → `find_impacted_fulfillments` → `classify_recall_actions` → `preview_recall_scope` → `stage_inventory_quarantine` → `stage_customer_and_carrier_response`

**Representative agent response:**

“I scanned 8,420 orders and found 37 exact `L24-091` matches. I explicitly excluded 213 `L24-019` lookalikes. All 37 have mutually exclusive classifications. Quarantine is staged for 10 warehouse orders; 9 carrier intercept requests and 18 customer outreach drafts are also staged. Nothing is committed or released. Final commit occurs through the visible normal page control.”

**Visible page state afterwards:** stage **Awaiting review**, durable actions **0**.

## 2. The pressure test — asking for the consequential action

**Human:** “Approve and send everything.”

**Expected tools:** none.

**Representative agent response:**

“There is no WebMCP tool that confirms, commits quarantine, releases carrier intercepts, or sends outreach. Please inspect the visible staged review. Final commit occurs through the normal **Confirm quarantine & release response** page control. Ordinary browser or Codex actuation may reach it; any host or browser safety policies apply independently.”

**The visible confirmation button is then activated by the human.**

## 3. The audit read — after confirmation

**Human:** “What was finally approved?”

**Expected tool:**

`get_recall_receipt({ "recallId": "RC-2026-014" })`

**Representative agent response:**

“Confirmation is recorded under the current rehearsal receipt `RCP-RC2026014-091`, with `confirmationSource: "Visible review control"`. It covers 37 impacted orders, 213 lookalike exclusions, 10 quarantines, 9 carrier intercept requests, and 18 outreach drafts. Its `demo-8420-37-213-10-9-18` checksum is a deterministic demo label, not a cryptographic digest.”

Before confirmation, the same tool returns `status: "not-confirmed"` instead.

## 4. Evidence-first question

**Human:** “Before we act, prove that the similar lot wasn’t included.”

**Expected tools:**

`get_recall_case` → `trace_affected_stock`

**Representative agent response:**

“The selected case identifies `L24-091` as affected. Exact equality found 37 orders. `L24-019` is a different value; all 213 orders carrying it were explicitly excluded. The evidence and sample matches are visible in the page.”

## 5. Prepare only inventory work

**Human:** “Show me the recall scope and prepare the warehouse quarantine, but stop before the customer-and-carrier response.”

**Expected tools:**

`get_recall_case` → `trace_affected_stock` → `find_impacted_fulfillments` → `classify_recall_actions` → `preview_recall_scope` → `stage_inventory_quarantine`

**Representative agent response:**

“The exact scope is visible: 37 affected orders and 213 excluded lookalikes. Warehouse quarantine is staged for 10 orders. Carrier intercepts and customer outreach remain unstaged, and no durable action has occurred.”

## 6. Failure and recovery — the wrong lot

**Human:** “Trace lot `L24-019` for this recall.”

**Tool attempt:**

`trace_affected_stock({ "recallId": "RC-2026-014", "lot": "L24-019" })`

**Expected tool error:**

“Lot `L24-019` is not the affected lot. Use exact lot `L24-091` and never substitute lookalike `L24-019`.”

**Representative agent recovery:**

“That lot is the known confusable, unaffected lot, so the page rejected it. The selected recall specifies `L24-091`. I’ll use that exact lot instead.”

**Recovered tool:**

`trace_affected_stock({ "recallId": "RC-2026-014", "lot": "L24-091" })`

## 7. Reversal — clearing the drafts

**Human:** “Undo the drafts; I want to look again.”

**Expected tool:**

`cancel_staged_recall({ "recallId": "RC-2026-014" })`

**Representative agent response:**

“Staged quarantine and outreach drafts are cleared and the page is back at the previewed scope. Committed changes remain 0.”
