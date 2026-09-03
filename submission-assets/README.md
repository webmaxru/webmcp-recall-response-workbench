# Submission Media Assets

> This project was created using the [WebMCP Agent Skill from the Web AI Agent Skills collection](https://github.com/webmaxru/web-ai-agent-skills).

This folder contains the final narration and captions for the published
**2:22** demo, safely under the three-minute limit.
`DEMO_SCRIPT.md` in the repository root is the authoritative storyboard:
operator setup, exact prompts, on-screen actions, the per-tool-call scroll and
cursor choreography, and the four segments to speed up in post.

Before submitting:

1. Record the deployed app as a top-level page, not inside an iframe.
2. Open on the problem and the stakes. The first ten seconds must not be a project name or a feature list — the opening voiceover hook must carry them even while the full-site scroll tour (item 3 below) is on screen.
3. **Start a fresh Codex session and collapse the Codex sidebar on camera, as the first thing the recording shows** (0:00–0:06 in `DEMO_SCRIPT.md`) — do not do this before capture begins. Immediately after, run the full-site scroll tour: top → smooth scroll to the bottom → brief hold → smooth scroll back to top, timed to 0:06–0:30 so it plays under the opening hook, not as a silent tour.
4. The final recording **must show real Codex Site Tool discovery and tool calls** against the page. A video showing only **Run guided rehearsal** is not sufficient — rehearsal mode is deliberately excluded from the recorded flow.
5. Drive the whole seven-step chain from the single prompt P1, keeping the page and the transcript in frame together so each tool call is visibly paired with a state change. For every retrieval or state change, scroll the in-app Browser to the specific relevant area *just before* the event lands and hold a clearly visible cursor or cursor halo over the exact case/metric/table row/staging card/control being discussed — see "Per-tool-call on-page focus" in `DEMO_SCRIPT.md` for the concrete target of each of the seven calls.
6. Show that there is no consequential WebMCP tool after staging, then activate the visible normal page control before the agent reads the receipt. Do not claim that a host or browser policy approved the action; such policies apply independently, and do not claim the agent was prevented from reaching the button.
7. Keep the exact fixture claims: 8,420 candidate orders, 37 affected `L24-091` orders, and 213 excluded `L24-019` lookalikes.
8. Accelerate only the marked latency windows (1.5×–4×) and never cut across a visible state change.
9. **Cursor fallback (post-production only):** if the review pass shows the Codex/background-automation session did not render a visible system cursor during its own page interactions, overlay a high-contrast cursor with a subtle click halo synchronized to the recorded interaction coordinates, instead of re-recording. This overlay is a visual pointer only — it must never imply a click or state change that did not actually happen.
10. Use the verified live URL linked below.

Generated files:

- `VOICEOVER.txt` — clean spoken-prose narration for the current script.
  Unchanged by the latest choreography revision: the full-site scroll tour and
  the on-camera session start both fit inside the existing 0:00–0:30 spoken
  hook without moving any line, so no retiming was needed to preserve the hook.
- `demo-captions.srt` — captions synchronized to the published 2:22 video and
  `VOICEOVER.txt`.
- `screenshots/01-overview.png`
- `screenshots/02-staged-review.png`
- `screenshots/03-confirmation-gate.png`
- `screenshots/04-confirmed-receipt.png`

Recorded video files are intentionally not part of this folder or the repository.
Keep rehearsal captures, drafts, and final masters only in the ignored
`../submission-video/` directory.

Adjust caption boundaries to the final edit without changing factual claims.

Live demo: https://webmaxru.github.io/webmcp-recall-response-workbench/

Source: https://github.com/webmaxru/webmcp-recall-response-workbench
(public; the root MIT license is detected by GitHub).

Published demo: https://youtu.be/04OXd6_Sppc

The local final master remains only in ignored `submission-video/`;
`demo-captions.srt` is kept as the final caption source.
