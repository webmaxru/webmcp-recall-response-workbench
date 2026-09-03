# WebMCP Challenge Compliance

## Publication

- **Configured live URL:** https://webmaxru.github.io/webmcp-recall-response-workbench/
  (currently HTTP 404; working deployment remains a blocker and must remain free
  and unrestricted through September 21, 2026 at 5:00 p.m. PT)
- **Repository:** https://github.com/webmaxru/webmcp-recall-response-workbench
  (public; GitHub detects the root MIT license)
- **Source:** Complete runnable source is included in this repository.
- **License:** MIT (`LICENSE`).
- **Local recording policy:** MP4 drafts and final masters remain only under the
  ignored `submission-video/` directory and are not committed.
- **Required final video:** public YouTube recording under three minutes showing
  real Codex Site Tool discovery and calls, recorded from a fresh Codex session
  per `DEMO_SCRIPT.md` (current local final-master runtime 2:22).
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
- [x] Repository-side GitHub Pages deployment workflow
- [ ] Working public HTTPS deployment (configured URL currently returns 404)
- [x] Four clean screenshots, exact captions, and a validated 2:22 local final master
- [x] Fresh GPT-5.6 Sol Codex run discovered and invoked the deployed Site Tools,
      completed all seven staging steps, and left zero durable actions
- [ ] Upload the validated Codex Site Tool final master publicly to YouTube
- [ ] Paste `SUBMISSION.md` copy into Devpost

Repository **Settings → Pages** must select **GitHub Actions** as the source. The
workflow intentionally does not change repository settings through an API.

## Explicit OpenAI compatibility limitations

Current OpenAI ChatGPT/Codex Site Tools do not support declarative WebMCP tools and do not discover iframe-registered tools. This project registers imperative tools from the top-level page and contains no iframe integration. A Site Tools-capable environment is still required for OpenAI-driven discovery and invocation. Product availability, browser support, and WebMCP behavior remain preview constraints outside this project’s control.

## Data and safety

All names, orders, timestamps, and receipts are deterministic mock data. There are no secrets, external services, analytics, or production actions. “Staging” changes only visible in-memory review state. Final commit occurs through a visible normal page control. Ordinary browser or Codex actuation may reach it, and any host or browser safety policies apply independently. The confirmed receipt and its non-cryptographic `demoChecksum` exist only for the current in-memory rehearsal; reset clears them.
