# VLA / VLM / WM Condition Architecture Proposal

This note captures the proposal discussion for a decoupled VLA architecture. It is intentionally kept separate from the page-state handoff notes in `CODEX_HANDOFF.md`.

## Core Framing

The latest discussion explored a decoupled VLA architecture:

```text
VLM semantic conditions + WM dynamics conditions
-> condition encoders
-> Flow Matching DiT action head
-> robot action chunk
```

The preferred design is not a monolithic VLA that asks the action head to learn language grounding, scene semantics, future prediction, and low-level action generation all at once. The cleaner framing is:

```text
VLM tells the policy what matters.
WM predicts what will happen.
The Flow Matching action head generates how to act.
```

Current diagram artifacts:

```text
vla_vlm_wm_condition_architecture.svg
vla_vlm_wm_condition_architecture.png
```

Older reference artifacts:

```text
vla_flow_condition_architecture.svg
vla_flow_condition_architecture.png
```

## Current Diagram Content

The latest architecture diagram contains:

- `Qwen3-VL` as the VLM module.
- A separate `World Model` module beside the VLM.
- VLM semantic condition cards:
  - `2D to 3D Trajectory`
  - `Object Grounding`
  - `Phase Belief`
  - `Body Part Role`
  - `Affordance Map`
  - `Contact Map`
  - `Target Region`
- WM dynamics condition cards:
  - `Future Image`
  - `Object Pose Residual`
- Split condition processing:
  - `Per-step Trajectory Encoder`
  - `Global Condition Token Encoder` with separate `Current Tokens` and `Future Tokens`
- Flow Matching action head:
  - `Noisy Action Tokens x_t -> Action Encoder -> Step-wise Fusion`
  - `Per-step Trajectory Encoder -> Step-wise Fusion`
  - `Global Condition Token Encoder -> DiT Blocks`
  - `Robot State -> DiT Blocks` as state/proprioception tokens

Important architecture constraints:

- Robot state should enter the DiT blocks, not the Action Encoder.
- Not every condition should fuse with action tokens per step.
- The 2D trajectory is special because it is time-aligned with the action horizon. It can go through the per-step trajectory encoder and be fused with action-step tokens.
- Other VLM/WM conditions should usually enter as global condition tokens through cross-attention, AdaLN, or FiLM-style conditioning.
- Global conditions should distinguish current conditions from future conditions.
- The WM formula for future-prior conditioning should not include robot state if the WM is only predicting from image and instruction:

```text
z_wm = g(image, instruction)
```

For action evaluation, reranking, reward, or planning, the WM should instead be action-conditioned:

```text
future_i = WM(image, instruction, state, candidate_action_i)
score_i  = R(future_i, instruction)
```

## Affordance vs Contact

The previous diagram mixed affordance and contact. The latest diagram separates them into two cards:

```text
Affordance Map -> interaction prior
Contact Map    -> touch region
```

Use the distinction:

- `Affordance Map`: interaction possibility or function, e.g. pullable, pressable, graspable, placeable, containable.
- `Contact Map`: where physical contact should occur during an action or phase, e.g. hand-object contact, push region, grasp patch.

Potential next refinement: keep `Affordance Map` routed as a global current condition; optionally route `Contact Map` as a phase-aware or per-step condition only if the method predicts a time-aligned contact schedule.

## World Model Roles

The user summarized three main WM roles. Keep the precision that WM is usually a consequence predictor; reward comes from a reward head, success classifier, VLM verifier, or preference model on top of predicted futures.

1. RL post-training reward / critic:

```text
WM(image, instruction, state, action_chunk) -> predicted rollout
R(predicted rollout, instruction) -> reward / value
```

2. Future image / future latent as condition:

```text
WM(image, instruction) -> future image / future tokens / future state prior
```

3. Candidate action scoring:

```text
sample candidate action chunks from Flow Matching VLA
WM(image, instruction, state, action_i) -> future_i
R(future_i, instruction) -> score_i
rerank / guide / execute
```

Additional WM uses discussed:

- Safety / risk verifier: predict collisions, spills, unstable states, or constraint violations.
- Belief / occlusion completion: infer hidden object state, pose belief, and uncertainty.
- Data engine / imagination: generate synthetic rollouts, relabel transitions, mine failures, or augment future-image supervision.
- Progress monitor: compare predicted future and observed future to detect execution drift.
- Dynamics prior: provide contact, object motion, residual pose, or physical-change tokens.

Reward model without RL:

- It is not optimizing the policy through policy gradients.
- It can rerank multiple sampled action chunks.
- It can guide flow/diffusion sampling if differentiable.
- It can provide an MPC-style cost.
- It can filter or reweight training data.
- It can support DPO-style or preference-style supervised updates.

Clean test-time pipeline:

```text
Flow Matching VLA samples N action chunks
-> action-conditioned WM predicts future outcome for each chunk
-> reward / verifier scores each predicted future
-> rerank or guide sampling
-> execute selected action chunk
```

## VLM Roles Beyond The Current Diagram

Current diagram cards already cover:

- `2D trajectory -> 3D trajectory`
- object grounding
- phase belief
- body part role
- affordance map
- contact map
- target region / point / bbox

Additional VLM-derived conditions that may be useful:

- Semantic relevance map: task-relevant visual regions.
- Functional part map: handle, rim, lid, button, hinge, blade, grip.
- Constraint / forbidden-region map: do not touch, avoid, keep away, keep upright.
- Goal region / desired-state map: where the object should end up.
- Relation map: inside, on top of, left of, aligned with, inserted into.
- Occlusion / belief map: hidden object or hidden part likelihood.
- Physical property map: fragile, slippery, deformable, liquid, sharp, hot, heavy.
- Support / stability map: stable placement vs edge/unstable regions.
- Progress / success evidence map: image regions that prove task success or failure.
- Tool-use reasoning: choose intermediate tool or object.
- Failure diagnosis / recovery: explain mismatch and produce recovery subgoal.
- VLM verifier: judge whether current or predicted future satisfies the instruction.

Useful condition grouping for Flow Matching:

```text
c_step:
  2D/3D trajectory, optionally time-aligned contact schedule

c_current:
  grounding, body part, affordance, contact map if static, functional parts,
  semantic relevance, constraints, physical properties

c_future:
  future image tokens, object pose residual, target region, goal relation,
  desired predicates, success evidence

verifier path:
  candidate actions -> WM rollout -> VLM/RM score -> rerank/guidance
```

## Candidate Paper Buckets

Candidate references mentioned in the discussion. Verify exact claims and dates before formal citation:

- VLM/action decoupling and VLA action heads: HAMSTER, Octo, pi0, GR00T N1, Helix, Hi-VLA.
- 2D/3D condition interfaces: HAMSTER, RT-Trajectory, RT-Affordance, MOKA, KALIE, RoboPoint, Track2Act, ATM, General Flow, RoboTAP.
- World model / future prediction / reward: PlaNet, Dreamer, DreamerV3, MuZero, TD-MPC / TD-MPC2, VIP, LIV, RoboCLIP, VLM-RM, RoboReward, Cosmos Policy.
