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

## VLM Page State

The user asked for a `VLM/` learning page that references the existing `VLA/` page style and is visual, not just a text-heavy paper list.

Important VLM page requirements from the conversation:

- Include multimodal large models such as BAGEL.
- Do not create a separate BAGEL-only section. BAGEL should stay inside the unified multimodal model flow.
- Include GitHub/project links where useful.
- Publish to `https://caim33.github.io/literature-review/VLM/`.
- The user specifically said the VLA page has many images and that they wanted VLM paradigm figures visible too.

Current VLM implementation:

- `VLM/index.html` exposes both `#visual-figures` and `#paper-figures`.
- The top nav includes `范式图` and `论文图`.
- `VLM/app.js` renders both `renderVisualFigures()` and `renderPaperFigureGuides()`.
- `VLM/data.js` contains `visualFigureGuides` and `paperFigureGuides`.
- `VLM/assets/figures/` contains local paper figure images for CLIP, BLIP-2, Flamingo, LLaVA, Qwen2.5-VL, InternVL, Janus-Pro, Transfusion, and BAGEL.
- `VLM/styles.css` includes VLA-like paper figure card styles and mobile stacking behavior.
- `VLM/test-content.mjs` verifies data contracts, local image assets, page anchors, renderer hooks, cache-busting strings, and that BAGEL has no dedicated page section.

Relevant pushed commits:

- `ad31751 Add visible VLM paradigm figures`
- `260fa3d Add VLM paper figure guides`

Validation command for the VLM page:

```bash
node VLM/test-content.mjs
```

Expected passing output:

```text
OK: 6 families, 28 models, 29 benchmarks, 73 references
```

Future VLM cautions:

- Keep `#paper-figures` image-first because the user wanted to see real paper/paradigm figures.
- Keep BAGEL in the unified model/grid/resource flow; do not add `id="bagel"` or a `renderBagelCase()` dedicated section unless the user explicitly changes that requirement.
- For any VLM page change, run `node VLM/test-content.mjs` before reporting completion.

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
cd RL
node validate-site.mjs
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

## WM Page State And Conversation Notes

The user has been building `WM/` as a robot-oriented world model learning map. Preserve these content decisions:

- Keep the robot line prominent. Autonomous-driving examples can appear, but should be lighter than robot manipulation / humanoid / VLA-related material.
- Put paradigm differences early. The user found it hard to read paper cards before understanding how the routes differ.
- Use a side drawer contents menu, not a static `#contents` section. The user specifically wanted a directory that can be opened while reading.
- Paper cards should be grouped by route, not mixed together.
- Every important paper figure should have a collapsible detailed interpretation. A short `takeaway` alone is not enough for a beginner.
- Simplified diagrams should look like clear paper pipeline figures: inputs, latent/state/action/value blocks, model block, outputs, and arrows. Avoid vague decorative diagrams.
- `VLA + WM` should be framed as **system composition** or **WM support for VLA**, not as another prediction target.
- `Cosmos` belongs primarily in the WM / generative simulator / world foundation model route. It can support VLA, but should not be placed as the mainstream VLA policy family.
- The WM tests currently expect Cosmos branches and versions to stay explicit: `Cosmos Predict`, `Cosmos Transfer`, `Cosmos Reason`, `Cosmos Predict2.5`, `Cosmos Transfer2.5`, `Cosmos Reason2`, and `Cosmos 3`.
- WAM should have its own route. Do not bury it inside `VLA + WM`.

Validation command for the WM page:

```bash
node WM/test-content.mjs
```

## WM / WAM Conceptual Notes

Use these explanations if a future thread needs to continue the learning page or answer user questions.

### Main WM Paradigm Split

- **Generative video / simulator WM**: predicts future video, video latents, scenes, or simulation rollouts. Useful for imagination, data generation, evaluation, and sometimes planning.
- **Decoder-free latent dynamics**: does not reconstruct pixels; predicts latent state, reward, Q, or value directly for control. TD-MPC-style methods live here.
- **JEPA-style representation predictive WM**: predicts future or hidden embeddings, not pixels. It learns predictable abstract state rather than photorealistic appearance.
- **WAM / World Action Model**: asks how pretrained video/world backbones can become action/control models. The core is video-world prior plus action generation or action-conditioned prediction.
- **VLA + WM system composition**: combines a VLA policy with a WM/evaluator/simulator/planner, instead of merging them into one prediction target.

### TD-MPC / Decoder-Free Planning Explanation

If the user asks why decoder-free WM is different from video generation:

- It learns latent dynamics that directly serve reward/Q/value, not image reconstruction.
- Short-horizon rollout plus terminal value reduces compounding error because the model only imagines a few steps, then lets a learned value estimate summarize longer-term return.
- In CEM planning, sample candidate action sequences, roll them through the latent model, score them with reward plus terminal value or Q, refit the sampling distribution around high-scoring sequences, and execute the first action.
- A policy prior can guide CEM by proposing action sequences or biasing the sampling distribution; value/Q decides which imagined sequence is worth executing.

### JEPA

- JEPA means **Joint Embedding Predictive Architecture**.
- It predicts target embeddings from context embeddings, usually with a teacher / stop-gradient target encoder, and no pixel decoder.
- The important mental model: **do not reconstruct world appearance; predict abstract world state**.
- Place JEPA under representation-predictive / decoder-free WM, not under generic future-video generation.

### Cosmos Policy

The user asked whether video and action are compressed into the same latent space.

Precise answer:

- Yes at the interface level: action, proprio, value, and image slots are all represented as latent-frame-shaped tensors in one sequence.
- No in the semantic VAE sense: action/proprio/value are not encoded by the video VAE. They are normalized, duplicated/reshaped, and packed as pseudo latent frames.
- The diffusion backbone denoises target slots in latent space.
- Image latents can be decoded by the video VAE into RGB.
- Action/proprio/value latents are not decoded as images; they are deterministically unpacked / averaged / unnormalized back to vectors or scalars.

Useful diagrams:

```text
Direct policy:
obs image -> VAE -> obs latent
proprio -> packed latent
language -> text condition
obs/proprio/language condition -> Cosmos diffusion -> action latent -> unpack -> action chunk
```

```text
Planning:
obs + language -> sample action chunks
obs + action latent -> diffusion predicts future image/proprio/value latents
value selects best action; execute first action and replan
```

### V-JEPA 2

The user asked about arXiv `2506.09985`, **V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning**.

Key interpretation:

- V-JEPA 2 is a decoder-free, JEPA-style video world model.
- It predicts embeddings, not RGB frames.
- Base V-JEPA 2 is action-free video representation learning.
- Robot version `V-JEPA 2-AC` freezes the V-JEPA 2 encoder and trains an action-conditioned predictor:

```text
current image -> frozen V-JEPA 2 encoder -> current visual embedding
current embedding + proprio + candidate action -> AC predictor -> future embedding
goal image -> frozen encoder -> goal embedding
planner chooses actions whose imagined future embedding is close to goal embedding
```

- Planning is MPC/CEM-like in embedding space, with a goal image as the target. It does not generate future RGB.
- Position it under JEPA / decoder-free representation predictive WM, and contrast it with Cosmos-style generative video/world models.

## Research / Proposal Notes

Architecture proposal notes are kept separate from page-state handoff notes.

- VLA / VLM / WM condition architecture proposal: `VLA_CONDITION_ARCHITECTURE_PROPOSAL.md`
- Current diagram artifacts:
  - `vla_vlm_wm_condition_architecture.svg`
  - `vla_vlm_wm_condition_architecture.png`

## Recent Handoff Context

The user asked to sync the important Codex conversation context and keep proposal discussion separate from page-state notes.

Before this handoff update, the repository was clean on `main` and synced with `origin/main` at:

```text
ef0824f
```

After updating this file, commit and push `CODEX_HANDOFF.md` and `VLA_CONDITION_ARCHITECTURE_PROPOSAL.md`.

## Recommended Next Steps

When continuing work:

1. Read this file first.
2. Run `git status --short --branch`.
3. For VLM page edits, run `node VLM/test-content.mjs` before committing.
4. For RL page edits, run `cd RL && node validate-site.mjs` before committing.
5. For WeCP reference edits, run `node RL/reference/build-wecp-fixed.mjs` and inspect formula rendering.
6. Keep the RL page practical and visual; avoid turning it into a long undifferentiated paper list.
