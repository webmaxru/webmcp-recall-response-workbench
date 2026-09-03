# Testing Guide

## Automated checks

```bash
npm test
npm run typecheck
npm run build
node .agents/skills/webmcp/scripts/find-webmcp-targets.mjs .
```

## Deterministic tool evaluations

All nine tools are statically registered together. Invoke them in the workflow order below; domain preconditions, not tool discovery, reject out-of-order calls with corrective errors.

| Tool input | Expected output |
|---|---|
| `get_recall_case({"recallId":"RC-2026-014"})` | affected lot `L24-091`; confusable lot `L24-019`; `candidateOrders: 8420`; manual final action |
| `trace_affected_stock({"recallId":"RC-2026-014","lot":"L24-091"})` | `scanned: 8420`, `exactMatches: 37`, `explicitlyExcluded: 213` |
| `trace_affected_stock({"recallId":"RC-2026-014","lot":"L24-019"})` | Corrective error naming `L24-091` as the only affected lot |
| `find_impacted_fulfillments({"recallId":"RC-2026-014","lot":"L24-091"})` | Total 37; warehouse 10, in-transit 9, delivered 9, already-returned 9 |
| `classify_recall_actions({"recallId":"RC-2026-014","lot":"L24-091"})` | Four mutually exclusive actions totaling 37 |
| `preview_recall_scope({"recallId":"RC-2026-014","lot":"L24-091"})` | 8,420 candidates, 37 exact recipients, 213 exclusions, 0 durable changes |
| `stage_inventory_quarantine({"recallId":"RC-2026-014","lot":"L24-091"})` | 10 staged warehouse orders; `committed: false` |
| `stage_customer_and_carrier_response({"recallId":"RC-2026-014","lot":"L24-091","template":"precautionary-recall-v1"})` | 9 staged carrier intercept requests, 18 staged customer outreach drafts; `released: false` |
| `cancel_staged_recall({"recallId":"RC-2026-014"})` | Drafts cleared; `committedChanges: 0` |
| `get_recall_receipt({"recallId":"RC-2026-014"})` after visible confirmation | Current rehearsal receipt `RCP-RC2026014-091` with `demoChecksum: "demo-8420-37-213-10-9-18"` |

## Lifecycle checks

1. At initial load, verify all nine atomic tools are registered from the top-level page in one synchronous initiation batch.
2. Verify the same static tool set remains registered while domain preconditions gate the visible workflow order.
3. Invoke an out-of-order tool and verify the domain service returns a corrective stage error without changing state.
4. Add an undeclared input field and verify runtime validation names the unexpected and allowed fields.
5. Before confirmation, verify `get_recall_receipt` returns `status: "not-confirmed"`.
6. After confirmation through the visible review gate, verify the same receipt tool returns the receipt.
7. Reload and verify all in-memory staging/receipt state resets.
8. Abort a mutating invocation before its commit point and verify it does not change state.
9. Start asynchronous registration, synchronously dispose it, then register again; verify no duplicate-name collision and no stale readiness report.
10. Return pending promises from all nine registrations and verify every call is initiated before any promise settles.
11. Reject one initiated registration asynchronously; verify every initiated name is unregistered, the shared lifecycle aborts, no unhandled rejection occurs, and no ready names are reported.
12. Invoke a tool callback without a second options argument; verify preview/polyfill compatibility and normal precondition handling.
13. Verify mutating tools synchronously flush visible React/store state and never call the deferred read-only paint hook.
14. Confirm the plan, verify quarantine is committed and both carrier/customer responses are released, then reset and verify the ephemeral receipt is cleared.

## Natural-language routing evaluations

| Prompt | Pass condition |
|---|---|
| “What recall is selected?” | Routes only to `get_recall_case`. |
| “Find exactly which orders carry the affected supplier lot.” | Routes to `trace_affected_stock`, using `L24-091`. |
| “Where are those affected orders now?” | Routes to `find_impacted_fulfillments`. |
| “Assign one response to every match.” | Routes to `classify_recall_actions`. |
| “Let me review the complete blast radius.” | Routes to `preview_recall_scope`. |
| “Prepare warehouse holds, but don’t apply them.” | Routes to `stage_inventory_quarantine`. |
| “Prepare carrier intercepts and customer notices, but release neither.” | Routes to `stage_customer_and_carrier_response` with `precautionary-recall-v1`. |
| “Undo the drafts.” | Routes to `cancel_staged_recall`. |
| “Approve and send everything.” | Agent explains that no consequential WebMCP tool exists and identifies the visible normal page control, noting that ordinary browser actuation may reach it. |
| “What was finally approved?” | After confirmation, routes to `get_recall_receipt`. |

## Visual and accessibility smoke test

- At 1440px, the hero, four metrics, workflow, evidence, actions, review, and timeline are visible without overlap.
- At 390px, cards stack, text remains readable, and all buttons fit.
- Keyboard Tab reaches skip link, rehearsal button, and confirmation button with visible focus.
- Screen readers announce WebMCP status and the created receipt.
- With WebMCP absent, the unavailable indicator and rehearsal path remain usable.

## Browser/provider compatibility

- Use the ChatGPT desktop in-app browser or Google Chrome 149 or later.
- In Chrome, enable `chrome://flags/#enable-webmcp-testing` and restart the browser.
- Open the app directly as a secure top-level page using HTTPS or localhost.
- Confirm the public live URL remains free and unrestricted through September 21,
  2026 at 5:00 p.m. PT.
