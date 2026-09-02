# WebMCP Challenge Compliance

## Publication

- **Live URL:** https://webmaxru.github.io/webmcp-recall-response-workbench/
- **Repository:** https://github.com/webmaxru/webmcp-recall-response-workbench
  (currently private; must be public before submission)
- **Source:** Complete runnable source is included in this repository.
- **License:** MIT (`LICENSE`).
- **Draft video:** `submission-assets/demo-draft.mp4` (2:41, narrated,
  captioned, and visibly watermarked as a rehearsal storyboard).
- **Required final video:** public YouTube recording under three minutes showing
  real Codex Site Tool discovery and calls.
- **Judge credentials:** None required.

## Submission checklist

- [x] Browser application with visible human workflow
- [x] Top-level imperative JavaScript WebMCP registration
- [x] `document.modelContext` preferred; legacy `navigator.modelContext` fallback
- [x] Awaited `registerTool` calls inside `try/catch`
- [x] AbortController registration cleanup and callback cancellation checks
- [x] Strict runtime validation beyond JSON Schema
- [x] Accurate read-only and untrusted-content annotations
- [x] Visible state synchronized before tool results resolve
- [x] 8,420 deterministic generated orders
- [x] Exactly 37 `L24-091` matches
- [x] Exactly 213 `L24-019` exclusions
- [x] Warehouse, in-transit, delivered, and returned states
- [x] Preview and reversible quarantine, carrier-intercept, and customer-outreach staging
- [x] No WebMCP final confirm, commit, or send tool
- [x] Visible confirmation gate with no consequential WebMCP tool
- [x] Read-only post-confirmation receipt
- [x] Deterministic in-app rehearsal mode
- [x] Responsive and accessible static UI
- [x] Automated tests, typecheck, and production build
- [x] Vercel and Netlify static hosting configuration
- [x] Persistent live HTTPS deployment smoke-tested
- [x] Four clean screenshots and a narrated rehearsal storyboard captured
- [x] Fresh GPT-5.6 Sol Codex run discovered and invoked the deployed Site Tools,
      completed all seven staging steps, and left zero durable actions
- [ ] Make the private repository public
- [ ] Record real Codex Site Tool footage and upload it publicly to YouTube
- [ ] Paste `SUBMISSION.md` copy into Devpost

## Explicit OpenAI compatibility limitations

Current OpenAI ChatGPT/Codex Site Tools do not support declarative WebMCP tools and do not discover iframe-registered tools. This project registers imperative tools from the top-level page and contains no iframe integration. A Site Tools-capable environment is still required for OpenAI-driven discovery and invocation. Product availability, browser support, and WebMCP behavior remain preview constraints outside this project’s control.

## Data and safety

All names, orders, timestamps, and receipts are deterministic mock data. There are no secrets, external services, analytics, or production actions. “Staging” changes only visible in-memory review state. Final commit occurs through a visible normal page control. Ordinary browser or Codex actuation may reach it, and any host or browser safety policies apply independently. The confirmed receipt and its non-cryptographic `demoChecksum` exist only for the current in-memory rehearsal; reset clears them.
