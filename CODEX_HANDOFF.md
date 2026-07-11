# Codex Handoff

This repository is the working copy for `caim33/literature-review`.

Use this file when starting a new Codex thread or moving work to another machine. It is the portable context that should survive beyond the current local conversation.

## Repository

- Local path on this machine: `/Users/caim/Documents/VLA`
- Remote: `https://github.com/caim33/literature-review.git`
- Branch: `main`
- If GitHub push/fetch fails on this machine, use the local Clash proxy:

```bash
git -c http.proxy=http://127.0.0.1:7897 -c https.proxy=http://127.0.0.1:7897 push origin main
```

- Main areas:
  - `VLA/`: VLA learning and literature materials
  - `VLM/`: VLM learning page/materials
  - `WM/`: world model learning page/materials
  - `RL/`: reinforcement learning page/materials
  - `vla-learning-map/`: VLA learning map assets/pages

## Clone On New Computer

```bash
cd ~/Documents
git clone https://github.com/caim33/literature-review.git VLA
cd VLA
```

Then open this folder with Codex and ask:

```text
Please read CODEX_HANDOFF.md and continue from the latest repository state.
```

## Current User Preferences

- The user prefers practical learning routes over exhaustive paper lists.
- For RL, traditional algorithms should be understood as foundations, not treated as the main application focus.
- RL content should prioritize fundamentals plus important algorithms used in LLM/VLA/robotics practice.
- Commonly used algorithms and topics for the user include PPO, GRPO, RLVR, reward/verifier-based training, robotics policy training, and teacher/student training such as Teacher PPO / TPPO.
- Pages should be visual and easy to scan, similar in spirit to the VLA page.
- Dense glossary/reference sections should be compact by default, with expand/search behavior.

## RL Page State

The `RL/` page has already been expanded from a thin route into a more useful visual RL learning map.

Important RL page decisions:

- Main emphasis: PPO / GRPO / RLVR / LLM post-training / VLA and robotics RL.
- Traditional RL methods remain as background/foundation material.
- The learning route is staged and practical rather than paper-heavy.
- Glossary behavior was made compact: core terms show first, full glossary can expand, search reveals more.
- Added or clarified terms include:
  - `Termination`
  - `TPPO` as Teacher PPO in the user's robotics context
  - RLVR, verifier, DAPO, GSPO, DPPO, RLPD, residual RL, safe RL, model-based RL, DQN/Q-learning
- Previous pushed commits related to RL include:
  - `aa9e9f5 Improve RL learning map layout`
  - `30aa4d5 Add RL termination and Teacher PPO terms`

Validation command for the RL site:

```bash
node RL/validate-site.mjs
```

## WeCP RL Interview Reference

The user wanted a local fixed version of the WeCP RL interview Q&A page because the original formula rendering was garbled.

Tracked files:

```text
RL/reference/build-wecp-fixed.mjs
RL/reference/wecp-rl-interview-fixed.html
RL/reference/wecp-rl-interview.extract.md
RL/reference/wecp-rl-interview.html
RL/reference/wecp-rl-interview.index.json
```

Generated local page:

```text
RL/reference/wecp-rl-interview-fixed.html
```

Regenerate it with:

```bash
node RL/reference/build-wecp-fixed.mjs
```

Current generated result:

- 90 visible Q&A cards
- 47 formula fixes
- 8 comparison tables
- Beginner 40 / Intermediate 40 / Experienced 10 answers visible from the extracted source

Important implementation details:

- The fixed page is standalone local HTML with search, difficulty filtering, collapsible Q&A cards, formula blocks, and comparison tables.
- Formula blocks convert `_...`, `_{...}`, `^...`, and `^{...}` into real `<sub>` / `<sup>` rendering.
- This fixed the visible issue where formulas such as `δ_t = r_{t+1} + γ V(s_{t+1}) - V(s_t)` were previously displayed with raw underscores/braces.
- The in-app browser may block direct `file://` automation. For browser verification, run a temporary local server from repo root:

```bash
python3 -m http.server 8787 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8787/RL/reference/wecp-rl-interview-fixed.html
```

Stop the temporary server after verification.

## Recent Handoff Context

The user asked to sync the important Codex conversation context into this handoff and push it.

Before this handoff update, the repository was clean on `main` and synced with `origin/main` at:

```text
00062ad Add Codex handoff and reference artifacts
```

After updating this file, commit and push `CODEX_HANDOFF.md`.

## Recommended Next Steps

When continuing work:

1. Read this file first.
2. Run `git status --short --branch`.
3. For RL page edits, run `node RL/validate-site.mjs` before committing.
4. For WeCP reference edits, run `node RL/reference/build-wecp-fixed.mjs` and inspect formula rendering.
5. Keep the RL page practical and visual; avoid turning it into a long undifferentiated paper list.
