# Recall Response Workbench

> This project was created using the [WebMCP Agent Skill from the Web AI Agent Skills collection](https://github.com/webmaxru/web-ai-agent-skills).

A small, polished WebMCP Challenge submission showing how an agent and a human can safely coordinate an exact-lot product recall. The app deterministically generates **8,420** orders in-browser, finds exactly **37** orders from affected lot `L24-091`, and explicitly excludes **213** orders from confusable lot `L24-019`.

No credentials, runtime secrets, customer data, external APIs, or server are required.

## Live demo and source

- **Project GitHub Pages site:** https://webmaxru.github.io/webmcp-recall-response-workbench/
  — deployed through this repository's own GitHub Pages workflow and anonymously
  smoke-tested with HTTP 200 on 2026-09-03. It must remain free and
  unrestricted through September 21, 2026 at 5:00 p.m. PT.
- **Source repository:** https://github.com/webmaxru/webmcp-recall-response-workbench
  (public; GitHub detects the root `LICENSE` as MIT)
- **Demo video:** [Watch the 2:22 narrated Codex/WebMCP walkthrough](https://youtu.be/04OXd6_Sppc)

## Why WebMCP improves this workflow

Recall response normally requires a person or brittle automation to reconcile lot
codes, fulfillment states, and multiple response systems screen by screen. WebMCP
turns those steps into explicit, validated browser operations while the same
evidence remains visible. The agent can exhaustively trace and classify thousands of
orders; the human can verify exact-lot exclusions, cancel staged drafts, and retain
the final release decision. This combination is safer and more inspectable than
opaque click automation or a disconnected agent-only workflow.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For production validation:

```bash
npm test
npm run typecheck
npm run build
```

## Architecture

- `src/domain.ts` — deterministic order generator and the single recall workflow service used by people, rehearsal mode, and WebMCP.
- `src/webmcp.ts` — complete top-level imperative tool set, input validation, annotations, cancellation, one-time registration, and lifecycle cleanup.
- `src/App.tsx` — visible shared state, rehearsal control, review panel, confirmation gate, receipt, and registration host.
- `src/*.test.ts` — exact ground-truth, guardrail, input, synchronization, registration, and cleanup tests.

The app is static-hostable, including from a project subpath. Vite uses relative production asset URLs (`base: "./"`). State is intentionally local and ephemeral. `RecallWorkbench` is the sole state transition boundary, so tool-driven and reviewer-driven actions cannot drift into separate workflows.

## WebMCP tool contract

The complete atomic tool set is registered **once in the top-level page** using `document.modelContext`, with `navigator.modelContext` only as a Chrome 149-era fallback. All nine `registerTool` calls are initiated in one synchronous task before their promises settle. Registration is all-or-nothing: the first synchronous throw or asynchronous rejection unregisters every initiated name, aborts that lifecycle, and reports no ready names. One document-lifetime `AbortController` scopes successful registration. All nine tools remain statically registered; the domain service—not discovery—enforces stage order with corrective errors.

| Tool | Domain precondition | Read-only | Input | Result / effect |
|---|---|---:|---|---|
| `get_recall_case` | Always | Yes | `recallId` | Selected case, exact lot, confusable lot, severity, 8,420 candidates |
| `trace_affected_stock` | Case ready | No | `recallId`, `lot` | 8,420 scanned, 37 exact matches, 213 explicit exclusions |
| `find_impacted_fulfillments` | Stock traced | No | `recallId`, `lot` | Counts for warehouse, in-transit, delivered, returned |
| `classify_recall_actions` | Fulfillments found | No | `recallId`, `lot` | Mutually exclusive action classes totaling 37 |
| `preview_recall_scope` | Classified | No | `recallId`, `lot` | Synchronizes the visible scope preview; zero durable changes |
| `stage_inventory_quarantine` | Scope previewed | No | `recallId`, `lot` | Stages warehouse quarantine; does not commit |
| `stage_customer_and_carrier_response` | Quarantine staged | No | `recallId`, `lot`, `template` | Stages 9 carrier intercept requests and 18 customer outreach drafts; releases neither |
| `cancel_staged_recall` | A draft is staged | No | `recallId` | Clears staged drafts; zero durable changes |
| `get_recall_receipt` | Review confirmed | Yes | `recallId` | Reads the receipt with `confirmationSource: "Visible review control"`, or reports that none exists yet |

The four order classifications remain mutually exclusive. An in-transit order is classified as **intercept**, while the staged response package contains both its carrier intercept request and a customer notification draft. Customer outreach is therefore a communication layer covering 9 in-transit plus 9 delivered orders, not a second order classification.

All outputs are deterministic first-party demo data, so `untrustedContentHint` is `false`. Only tools that leave application state unchanged—reading the selected case and reading the final receipt—use `readOnlyHint: true`. Workflow transitions, visible previews, staging, and cancellation use `false`, even when they make no durable operational change. Every callback validates inputs and accepts `execute(input, options?)`, reading `options?.signal` so older previews and polyfills may omit the second argument. Mutating callbacks reject if an available signal is already aborted, then synchronously flush the React/DOM transition and return without a post-commit paint wait. Read-only callbacks may await UI synchronization because they do not commit workflow state.

There is deliberately **no** WebMCP confirm, commit, or send tool. Final commit occurs through the visible normal page control. Ordinary browser or Codex actuation may reach that control; any host or browser safety policies apply independently and are not implemented or attested by this app. `get_recall_receipt` is always registered but returns a receipt only after confirmation.

## Test with OpenAI Codex / ChatGPT Site Tools

1. Deploy the built app as a top-level HTTPS page or run it on localhost.
2. Open that page directly; do not embed it in an iframe.
3. In a Site Tools-capable ChatGPT/Codex environment, enable site tools and select the current tab/site.
4. Ask: “Read the selected recall, trace the exact affected lot, classify all actions, and stage a review. Do not commit or send anything.”
5. Watch the page update after every tool call. Confirm that no consequential WebMCP tool is offered at **Awaiting review**.
6. Inspect the 37 / 213 scope and activate **Confirm quarantine & release response** through the visible page control. Any host or browser safety policy applies independently.
7. Ask: “Read the recall receipt.” The already-registered read tool now returns the confirmed receipt.

### Current OpenAI limitations

OpenAI ChatGPT/Codex Site Tools currently discover imperative tools registered by the top-level page. They do **not** currently support declarative WebMCP tools and do **not** discover tools registered inside iframes. This project therefore uses no declarative tools and no iframe registration. Availability and product UI may change while WebMCP remains a preview technology.

## Chrome 149+ preview fallback

1. Use the ChatGPT desktop in-app browser or Google Chrome 149 or later. Chrome 149 uses the legacy `navigator.modelContext` surface; newer builds prefer `document.modelContext`.
2. Enable `chrome://flags/#enable-webmcp-testing` and relaunch.
3. Serve the app from `http://localhost` or HTTPS, then open it as the top-level page.
4. Use the Model Context Tool Inspector (if available) to inspect and invoke tools with the deterministic inputs in [TESTING.md](TESTING.md).
5. If the status says unavailable, verify the flag, secure context, top-level browsing context, and browser version.

The Model Context Tool Inspector is a development aid, not a runtime dependency.

## Rehearsal mode

**Run guided rehearsal** drives the same `RecallWorkbench` methods and visible states as WebMCP, ending before review confirmation. It exists so judges can see the core product immediately when WebMCP is unavailable; it is clearly labeled and is not a substitute for tool discovery or invocation.

## Accessibility and hosting

The UI uses semantic regions, native buttons, visible focus styles, status announcements, a skip link, high contrast, reduced visual density on mobile, and no motion-dependent interaction. The public source repository includes validation-only CI plus `.github/workflows/deploy-pages.yml`, which builds `dist` and deploys it through the official GitHub Pages actions. The Pages workflow and anonymous HTTP 200 smoke test passed on 2026-09-03. `vercel.json`, `netlify.toml`, and `public/_headers` provide origin isolation, `Origin-Agent-Cluster: ?1`, and a self-only `tools` Permissions Policy where the host supports custom response headers. GitHub Pages does not provide repository-defined custom response headers.

## Limitations

- All orders and receipts are deterministic mock data held in memory.
- Refreshing or starting another guided rehearsal resets the workflow and clears the prior confirmed receipt.
- The sample performs no real quarantine, carrier intercept, or customer messaging.
- `demoChecksum` is a deterministic rehearsal label, not a cryptographic digest or durable audit record.
- WebMCP is browser-preview technology and availability depends on the client.
- This is a focused workflow demonstration, not a regulatory compliance system.

## Judge credentials

**None required.** The app has no login.

## Hackathon scope and prior work

Repository history begins with the WebMCP challenge implementation and does not show
a separate pre-existing application being reused. The deterministic recall model,
WebMCP tools, UI, tests, and submission documentation in this repository are the
challenge project.

## License

[MIT](LICENSE)
