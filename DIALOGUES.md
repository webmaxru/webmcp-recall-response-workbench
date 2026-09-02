# Agent Dialogues

## 1. Full safe workflow

**Human:** “Read the selected recall, trace the exact affected lot through every order, classify the response, and stage quarantine plus the customer-and-carrier response for my review. Do not commit or release anything.”

**Expected tools:**

`get_recall_case` → `trace_affected_stock` → `find_impacted_fulfillments` → `classify_recall_actions` → `preview_recall_scope` → `stage_inventory_quarantine` → `stage_customer_and_carrier_response`

**Representative agent response:**

“I scanned 8,420 orders and found 37 exact `L24-091` matches. I explicitly excluded 213 `L24-019` lookalikes. All 37 have mutually exclusive classifications. Quarantine is staged for 10 warehouse orders; 9 carrier intercept requests and 18 customer outreach drafts are also staged. Nothing is committed or released. Final commit occurs through the visible normal page control.”

## 2. Evidence-first question

**Human:** “Before we act, prove that the similar lot wasn’t included.”

**Expected tools:**

`get_recall_case` → `trace_affected_stock`

**Representative agent response:**

“The selected case identifies `L24-091` as affected. Exact equality found 37 orders. `L24-019` is a different value; all 213 orders carrying it were explicitly excluded. The evidence and sample matches are visible in the page.”

## 3. Prepare only inventory work

**Human:** “Show me the recall scope and prepare the warehouse quarantine, but stop before the customer-and-carrier response.”

**Expected tools:**

`get_recall_case` → `trace_affected_stock` → `find_impacted_fulfillments` → `classify_recall_actions` → `preview_recall_scope` → `stage_inventory_quarantine`

**Representative agent response:**

“The exact scope is visible: 37 affected orders and 213 excluded lookalikes. Warehouse quarantine is staged for 10 orders. Carrier intercepts and customer outreach remain unstaged, and no durable action has occurred.”

## Failure and recovery

**Human:** “Trace lot `L24-019` for this recall.”

**Tool attempt:**

`trace_affected_stock({ "recallId": "RC-2026-014", "lot": "L24-019" })`

**Expected tool error:**

“Lot `L24-019` is not the affected lot. Use exact lot `L24-091` and never substitute lookalike `L24-019`.”

**Representative agent recovery:**

“That lot is the known confusable, unaffected lot, so the page rejected it. The selected recall specifies `L24-091`. I’ll use that exact lot instead.”

**Recovered tool:**

`trace_affected_stock({ "recallId": "RC-2026-014", "lot": "L24-091" })`

## Final approval dialogue

**Human:** “Everything looks right. Approve and send it.”

**Representative agent response before approval:**

“There is no WebMCP tool that confirms, commits quarantine, releases carrier intercepts, or sends outreach. Please inspect the visible staged review. Final commit occurs through the normal **Confirm quarantine & release response** page control. Ordinary browser or Codex actuation may reach it; any host or browser safety policies apply independently.”

**The visible confirmation button is activated.**

**Human:** “Now give me the receipt.”

**Expected tool:**

`get_recall_receipt({ "recallId": "RC-2026-014" })`

**Representative agent response:**

“Confirmation is recorded under the current rehearsal receipt `RCP-RC2026014-091`. It covers 37 impacted orders, 213 lookalike exclusions, 10 quarantines, 9 carrier intercept requests, and 18 outreach drafts. Its `demo-8420-37-213-10-9-18` checksum is a deterministic demo label, not a cryptographic digest.”
