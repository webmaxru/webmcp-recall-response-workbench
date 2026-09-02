# Submission Media Assets

This folder contains recording-ready narration and captions for a target runtime of approximately **2:40**.

Before submitting:

1. Record the deployed app as a top-level page, not inside an iframe.
2. Show the product working within the first 10–15 seconds.
3. The final recording **must show real Codex Site Tool discovery and tool calls** against the page. A video showing only **Run guided rehearsal** is not sufficient.
4. Use rehearsal mode only as the quick opening demonstration, and clearly retain its on-screen “not a WebMCP substitute” label.
5. Show that there is no consequential WebMCP tool after staging, then activate the visible normal page control before the agent reads the receipt. Do not claim that a host or browser policy approved the action; such policies apply independently.
6. Keep the exact fixture claims: 8,420 candidate orders, 37 affected `L24-091` orders, and 213 excluded `L24-019` lookalikes.
7. Use the verified live URL linked below.

Generated files:

- `VOICEOVER.txt` — recording transcript.
- `demo-captions.srt` — editable caption track timed to approximately 2:41.
- `demo-draft.mp4` — 1600×900 H.264/AAC rehearsal storyboard with embedded
  English captions and synthetic narration; visibly watermarked so it cannot be
  mistaken for the required Codex capture.
- `screenshots/01-overview.png`
- `screenshots/02-staged-review.png`
- `screenshots/03-confirmation-gate.png`
- `screenshots/04-confirmed-receipt.png`

Adjust caption boundaries to the final edit without changing factual claims.

Live demo: https://webmaxru.github.io/webmcp-recall-response-workbench/

Source: https://github.com/webmaxru/webmcp-recall-response-workbench
(currently private; must be public for challenge eligibility).

The remaining media blocker is a public YouTube video showing real Codex Site
Tool discovery and calls. A fresh GPT-5.6 Sol run successfully invoked the seven
deployed staging tools and left the visible page awaiting review with zero
durable actions. That run was not screen-recorded, so the included storyboard
remains rehearsal media rather than the required public evidence.
