# Codex Handoff

This repository is the working copy for `caim33/literature-review`.

Use this file when moving from the old local Codex process to a new computer or a new Codex thread.

## Repository

- Local path on old machine: `/Users/caim/Documents/VLA`
- Remote: `https://github.com/caim33/literature-review.git`
- Current branch: `main`
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

## Important Local Files To Preserve

Before retiring the old computer, make sure the following currently untracked files are committed and pushed if they should be kept:

```text
RL/reference/build-wecp-fixed.mjs
RL/reference/wecp-rl-interview.extract.md
RL/reference/wecp-rl-interview.html
RL/reference/wecp-rl-interview.index.json
vla_flow_condition_architecture.png
vla_flow_condition_architecture.svg
vla_vlm_wm_condition_architecture.png
vla_vlm_wm_condition_architecture.svg
CODEX_HANDOFF.md
```

Suggested command:

```bash
git add CODEX_HANDOFF.md RL/reference/build-wecp-fixed.mjs RL/reference/wecp-rl-interview.extract.md RL/reference/wecp-rl-interview.html RL/reference/wecp-rl-interview.index.json vla_flow_condition_architecture.png vla_flow_condition_architecture.svg vla_vlm_wm_condition_architecture.png vla_vlm_wm_condition_architecture.svg
git commit -m "Add Codex handoff and reference artifacts"
git push origin main
```

## Current Codex Context

The user is moving work away from the current computer and wants the new computer to continue smoothly.

Recent discussion:

- The current Codex thread is local to the old machine.
- A running local Codex process should not be treated as movable state.
- The reliable migration path is:
  1. Commit and push important repository files.
  2. Clone the repository on the new computer.
  3. Start a new Codex thread in the cloned repository.
  4. Ask Codex to read this handoff file.

Codex conversation history itself may not be available after cloning. Treat this file as the portable context.

## Recommended Next Steps

On the old computer:

1. Review `git status --short`.
2. Commit and push the files listed above.
3. Confirm the new computer can clone and open the repository.

On the new computer:

1. Clone the repo.
2. Open the repo in Codex.
3. Ask Codex to read `CODEX_HANDOFF.md`.
4. Continue work from the repository files rather than relying on the old local conversation.

