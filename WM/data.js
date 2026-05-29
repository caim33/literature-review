const wmMapData = {
  meta: {
    title: "WM Learning Map",
    subtitle: "World Models for Robotics, VLA, Humanoids, and Physical AI",
    updated: "2026-05-29",
    note: "Robot-first world model map. Autonomous driving is kept as a lightweight side route for transferable simulation and evaluation ideas."
  },
  glossary: [
    {
      term: "WM",
      meaning: "World Model: predicts future observations, latent states, reward, value, contact, progress, or risk under candidate actions. For robotics, action conditioning and closed-loop usefulness matter more than visual beauty."
    },
    {
      term: "Latent Dynamics",
      meaning: "Predicting future in a compact state representation instead of raw pixels. PlaNet, Dreamer, TD-MPC, JEPA-style systems all rely on this idea in different forms."
    },
    {
      term: "Visual MPC",
      meaning: "Model Predictive Control over predicted videos or latents: sample action sequences, imagine futures, score them, execute the first action, then replan."
    },
    {
      term: "VLA + WM",
      meaning: "Hybrid robot stack where a VLA proposes actions or subgoals, while a WM simulates consequences, reranks candidates, predicts failures, or creates synthetic training data."
    },
    {
      term: "Interactive Simulator",
      meaning: "A generative model with a step-like interface: it reacts to actions over time, so agents can train, evaluate, or plan inside it."
    }
  ],
  foundations: [
    {
      term: "Agent",
      analogy: "做决定的人",
      meaning: "在机器人里通常是策略模型或控制系统；它根据观测和目标选择动作。",
      robotExample: "VLA 看到桌面图像和指令“把杯子放进水槽”，输出一段手臂动作。"
    },
    {
      term: "Environment",
      analogy: "被行动改变的世界",
      meaning: "机器人交互的外部系统，可以是真实厨房、仿真器、数据集回放器，或者一个学出来的交互模拟器。",
      robotExample: "杯子、桌面、人的干预、相机延迟和机械臂动力学都属于环境的一部分。"
    },
    {
      term: "State / Observation",
      analogy: "真实世界 vs 你看到的画面",
      meaning: "state 是完整世界状态；observation 是智能体实际拿到的信息。机器人通常只能看到 RGB、深度、本体状态和少量传感器。",
      robotExample: "杯子内部是否有水是真实状态；相机被手挡住时，模型只拿到部分观测。"
    },
    {
      term: "Action",
      analogy: "你准备怎么动",
      meaning: "动作可以是关节位置、末端位姿、速度、gripper 开合、action chunk、键鼠输入或高层子目标。",
      robotExample: "连续 16 步的 delta end-effector pose 就是一段 action chunk。"
    },
    {
      term: "Transition Model",
      analogy: "如果这样做，下一秒会怎样",
      meaning: "world model 的核心：学习动作如何把当前状态或观测变成未来状态、未来观测或未来 latent。",
      robotExample: "如果夹爪从左侧推杯子，模型预测杯子会向右滑、可能碰到盘子。"
    },
    {
      term: "Rollout / Imagination",
      analogy: "在脑内试演几步",
      meaning: "给模型一串候选动作，让它一步步预测未来。rollout 可以在像素、latent、reward/value 或任务进度空间里发生。",
      robotExample: "机器人先想象三种抓取轨迹，选最不容易碰撞的一条执行。"
    },
    {
      term: "Planning / Reranking",
      analogy: "想完再选",
      meaning: "利用 WM 预测结果给候选动作打分，选择最可能成功、风险最低或进度最大的动作。",
      robotExample: "VLA 提出 8 个动作候选，WM 预测其中两个会碰撞，reranker 选择安全的那个。"
    },
    {
      term: "Model Bias",
      analogy: "脑补错了还很自信",
      meaning: "学出来的模型和真实世界不一致，策略可能利用模型漏洞，在想象中成功但真机失败。",
      robotExample: "WM 没学好摩擦，想象里杯子会滑到目标点，真机上却卡住。"
    }
  ],
  modelFreeVsModelBased: [
    {
      axis: "学什么",
      modelFree: "直接学策略或价值：看到什么就做什么，或估计这个动作值不值。",
      modelBased: "额外学世界如何变化：执行动作后，未来状态、观测、奖励或风险会怎样。",
      robotTakeaway: "VLA 多数偏 model-free policy；WM 给它补上后果预测。"
    },
    {
      axis: "数据效率",
      modelFree: "常需要大量真实交互或示教数据，因为每个动作后果都要从数据里见过。",
      modelBased: "可以在模型里做 imagined rollout，用较少真实数据试更多候选。",
      robotTakeaway: "真机数据贵，所以机器人特别需要 WM 或仿真器帮忙省试错。"
    },
    {
      axis: "部署方式",
      modelFree: "推理快：输入观测，直接输出动作。",
      modelBased: "推理慢一些：要预测未来、搜索或重排候选动作。",
      robotTakeaway: "常见混合方案是 VLA 快速提议，WM 在关键时刻慢速校验。"
    },
    {
      axis: "主要风险",
      modelFree: "遇到分布外场景容易反应错，且不一定知道自己会失败。",
      modelBased: "模型误差会累积，策略可能钻模型漏洞。",
      robotTakeaway: "真实系统通常需要 uncertainty、safety filter 和真机反馈闭环。"
    },
    {
      axis: "评估重点",
      modelFree: "看真实任务成功率、泛化、动作稳定性和延迟。",
      modelBased: "除了成功率，还要看预测是否可控、闭环是否稳定、是否提升规划。",
      robotTakeaway: "漂亮视频不是最终指标；能不能让机器人少失败才是指标。"
    }
  ],
  predictionTargets: [
    {
      name: "未来像素 / 视频",
      predicts: "未来几帧 RGB、深度或多视角视频。",
      usefulFor: "目标图像控制、可视化调试、生成数据、交互式模拟器。",
      caution: "视频清晰不代表动作可控，也不代表接触物理正确。"
    },
    {
      name: "Latent State",
      predicts: "压缩后的 belief state、离散 token 或连续 hidden state。",
      usefulFor: "Dreamer/PlaNet/TD-MPC 式规划和想象学习。",
      caution: "latent 看不见，必须用下游控制效果验证它是否有用。"
    },
    {
      name: "Reward / Value / Q",
      predicts: "动作之后能获得多少回报，或某个未来状态有多好。",
      usefulFor: "MPC、MCTS、candidate reranking、policy improvement。",
      caution: "只预测价值可能不可解释，而且容易被策略 exploit。"
    },
    {
      name: "Success / Failure / Progress",
      predicts: "任务是否会成功、是否卡住、当前做到哪一步。",
      usefulFor: "长程 household task、失败恢复、human intervention 触发。",
      caution: "需要明确任务阶段标签或从轨迹中学 progress。"
    },
    {
      name: "Contact / Force / Collision",
      predicts: "手、物体、桌面、身体之间的接触和碰撞风险。",
      usefulFor: "双手操作、人形 whole-body feasibility、安全过滤。",
      caution: "纯视觉数据常常不够，最好结合本体、力觉或仿真标签。"
    },
    {
      name: "Occupancy / 3D / Scene State",
      predicts: "空间占据、物体 pose、agent 运动、可通行区域。",
      usefulFor: "移动操作、人形导航、自动驾驶闭环仿真。",
      caution: "3D 表示适合空间，但未必能处理灵巧接触细节。"
    }
  ],
  robotWorkflow: [
    {
      step: "1",
      title: "观测当前世界",
      detail: "机器人读取 RGB/深度、本体状态、历史动作和语言目标，形成当前上下文。"
    },
    {
      step: "2",
      title: "VLA 或 planner 生成候选",
      detail: "策略先给出若干 action chunk、末端轨迹、子目标或技能调用。"
    },
    {
      step: "3",
      title: "WM 想象后果",
      detail: "对每个候选动作做短 horizon rollout，预测未来图像、latent、成功率、碰撞或进度。"
    },
    {
      step: "4",
      title: "Scorer / safety filter 重排",
      detail: "把任务成功、风险、平滑性、可达性和安全约束合成分数，选出最合适的动作。"
    },
    {
      step: "5",
      title: "Controller 执行",
      detail: "低层控制器把动作变成关节命令、全身平衡、抓取闭环和碰撞规避。"
    },
    {
      step: "6",
      title: "真实反馈回流",
      detail: "执行结果、失败、人工接管和纠错数据回到数据池，用于更新 VLA、WM 或 critic。"
    }
  ],
  systemArchitecture: {
    title: "Robot WM System Architecture",
    caption: "这张图是机器人 WM 的通用架构：不是每篇论文都有全部模块，但读 Dreamer、Visual Foresight、TD-MPC、UniSim、VLA+WM 时都可以映射到这里。",
    nodes: [
      { id: "obs", label: "Observation / State", note: "RGB-D, proprioception, history", x: 40, y: 90, w: 160, h: 64, kind: "input" },
      { id: "enc", label: "Encoder", note: "pixels -> latent", x: 250, y: 90, w: 130, h: 64, kind: "model" },
      { id: "latent", label: "Latent State", note: "belief / tokens / slots", x: 430, y: 90, w: 150, h: 64, kind: "state" },
      { id: "dyn", label: "Dynamics Model", note: "z, a -> future z / o", x: 630, y: 90, w: 170, h: 64, kind: "model" },
      { id: "rollout", label: "Imagined Rollout", note: "short horizon futures", x: 850, y: 90, w: 170, h: 64, kind: "future" },
      { id: "score", label: "Reward / Value / Risk", note: "success, collision, progress", x: 850, y: 220, w: 170, h: 64, kind: "score" },
      { id: "planner", label: "Planner / Reranker", note: "MPC, CEM, critic", x: 630, y: 220, w: 170, h: 64, kind: "policy" },
      { id: "policy", label: "Policy / VLA", note: "candidate actions", x: 430, y: 220, w: 150, h: 64, kind: "policy" },
      { id: "act", label: "Action", note: "chunk / trajectory / skill", x: 250, y: 220, w: 130, h: 64, kind: "action" },
      { id: "world", label: "Real Robot World", note: "feedback logs", x: 40, y: 220, w: 160, h: 64, kind: "world" }
    ],
    edges: [
      ["obs", "enc"], ["enc", "latent"], ["latent", "dyn"], ["dyn", "rollout"], ["rollout", "score"], ["score", "planner"], ["policy", "planner"], ["planner", "act"], ["act", "world"], ["world", "obs"], ["act", "dyn"]
    ]
  },
  paperFigures: [
    {
      title: "Dreamer / PlaNet：Latent Imagination",
      source: "Ha & Schmidhuber 2018, PlaNet 2019, Dreamer/DreamerV3",
      originalMedia: {
        type: "image",
        src: "https://dreamrl.github.io/assets/pages/1.png",
        alt: "Dreamer paper overview page with latent imagination architecture",
        caption: "Dreamer 论文页里的总览图：从真实经验训练 latent world model，再在模型想象的轨迹里更新 actor 和 value。",
        sourceUrl: "https://dreamrl.github.io/",
        sourceLabel: "Dreamer project page"
      },
      thesis: "核心不是把视频生成得好看，而是把历史压进 latent belief state，在想象轨迹里训练 actor-critic 或做规划。",
      nodes: [
        { id: "obs", label: "Pixels / State", x: 40, y: 90, w: 130, h: 58, kind: "input" },
        { id: "enc", label: "Encoder", x: 220, y: 90, w: 120, h: 58, kind: "model" },
        { id: "rssm", label: "RSSM / Latent Dynamics", x: 390, y: 80, w: 180, h: 78, kind: "state" },
        { id: "imag", label: "Imagined Trajectories", x: 620, y: 80, w: 180, h: 78, kind: "future" },
        { id: "actor", label: "Actor + Critic", x: 850, y: 90, w: 130, h: 58, kind: "policy" }
      ],
      edges: [["obs", "enc"], ["enc", "rssm"], ["rssm", "imag"], ["imag", "actor"], ["actor", "rssm"]],
      readingFocus: [
        "RSSM/belief state 怎么融合历史动作和观测。",
        "训练 loss 是重建、reward、discount、value，还是多步 latent prediction。",
        "策略是在模型里训练，还是每步在线规划。"
      ]
    },
    {
      title: "Visual Foresight：Video Prediction + MPC",
      source: "Finn & Levine 2016, SV2P/SAVP, Visual Foresight 2018",
      originalMedia: {
        type: "image",
        src: "https://bair.berkeley.edu/static/blog/visual_rl/shorts1.png",
        alt: "Visual Foresight robot manipulation example with predicted future frames",
        caption: "Visual Foresight 官方 BAIR 图：机器人用自监督视频预测模型想象动作后果，再用 visual MPC 完成真实操作任务。",
        sourceUrl: "https://bair.berkeley.edu/blog/2018/11/30/visual-rl/",
        sourceLabel: "BAIR Visual Foresight post"
      },
      thesis: "给一批候选动作，预测每条动作会产生的视频，再按目标像素/目标图像/分类器 reward 选动作。",
      nodes: [
        { id: "goal", label: "Goal Image / Pixels", x: 40, y: 70, w: 150, h: 58, kind: "score" },
        { id: "cands", label: "Action Candidates", x: 40, y: 180, w: 150, h: 58, kind: "action" },
        { id: "video", label: "Action-Conditioned Video Model", x: 250, y: 120, w: 220, h: 78, kind: "model" },
        { id: "future", label: "Predicted Futures", x: 540, y: 120, w: 170, h: 78, kind: "future" },
        { id: "score", label: "Goal Scoring", x: 780, y: 120, w: 140, h: 78, kind: "score" },
        { id: "mpc", label: "MPC Execute First Action", x: 970, y: 120, w: 170, h: 78, kind: "policy" }
      ],
      edges: [["cands", "video"], ["video", "future"], ["goal", "score"], ["future", "score"], ["score", "mpc"], ["mpc", "cands"]],
      readingFocus: [
        "动作候选怎么采样：random shooting、CEM 还是 policy proposal。",
        "目标怎么定义：像素点、目标图像、语言还是 learned reward。",
        "预测 horizon 多长，receding horizon 怎么闭环纠错。"
      ]
    },
    {
      title: "TD-MPC / TD-MPC2：Task-Oriented Latent MPC",
      source: "TD-MPC 2022, TD-MPC2 2023",
      originalMedia: {
        type: "image",
        src: "https://www.nicklashansen.com/td-mpc/images/1.png",
        alt: "TD-MPC planning architecture with latent dynamics and value estimates",
        caption: "TD-MPC 官方图：TOLD latent dynamics 负责短程 rollout，reward/Q/value 给 MPC 打分，最后只执行第一步动作。",
        sourceUrl: "https://www.nicklashansen.com/td-mpc/",
        sourceLabel: "TD-MPC project page"
      },
      thesis: "不追求像素重建，学习直接服务 reward/Q/value 的 latent dynamics，再用短 horizon MPC 和 terminal value 控制。",
      nodes: [
        { id: "obs", label: "Observation", x: 40, y: 110, w: 130, h: 58, kind: "input" },
        { id: "enc", label: "Encoder", x: 220, y: 110, w: 110, h: 58, kind: "model" },
        { id: "latent", label: "Task Latent", x: 380, y: 110, w: 130, h: 58, kind: "state" },
        { id: "dyn", label: "Latent Dynamics", x: 560, y: 80, w: 160, h: 58, kind: "model" },
        { id: "q", label: "Reward + Q + Value", x: 560, y: 180, w: 160, h: 58, kind: "score" },
        { id: "cem", label: "CEM / MPC", x: 780, y: 110, w: 140, h: 78, kind: "policy" },
        { id: "act", label: "Action", x: 970, y: 120, w: 110, h: 58, kind: "action" }
      ],
      edges: [["obs", "enc"], ["enc", "latent"], ["latent", "dyn"], ["dyn", "q"], ["q", "cem"], ["cem", "act"], ["act", "dyn"]],
      readingFocus: [
        "为什么 decoder-free：它预测决策需要的量，不一定重建图像。",
        "短 horizon rollout + terminal value 如何降低 compounding error。",
        "CEM 规划时动作序列、policy prior 和 Q/value 怎么结合。"
      ]
    },
    {
      title: "Genie / UniSim / IRASim：Interactive Simulator",
      source: "UniSim 2023, Genie 2024, IRASim 2024, Cosmos 2025",
      originalMedia: {
        type: "image",
        src: "https://gen-irasim.github.io/assets/images/intro.png",
        alt: "IRASim overview figure for robot manipulation world model",
        caption: "IRASim 官方总览图：把机器人轨迹、动作和视频生成对齐，用 action-aligned simulator 产生可用于训练与评估的机器人未来。",
        sourceUrl: "https://gen-irasim.github.io/",
        sourceLabel: "IRASim project page"
      },
      thesis: "把生成模型变成可交互环境：给历史、prompt 或动作，生成下一帧/下一状态，让 agent 能继续闭环。",
      nodes: [
        { id: "context", label: "Prompt / History", x: 40, y: 100, w: 150, h: 64, kind: "input" },
        { id: "action", label: "Action / Latent Action", x: 250, y: 190, w: 170, h: 64, kind: "action" },
        { id: "sim", label: "Generative World Simulator", x: 250, y: 80, w: 220, h: 78, kind: "model" },
        { id: "next", label: "Next Frame / State", x: 560, y: 100, w: 170, h: 64, kind: "future" },
        { id: "agent", label: "Agent / Policy", x: 780, y: 100, w: 150, h: 64, kind: "policy" }
      ],
      edges: [["context", "sim"], ["action", "sim"], ["sim", "next"], ["next", "agent"], ["agent", "action"], ["next", "sim"]],
      readingFocus: [
        "action 是真实机器人动作、键鼠动作，还是从视频里学到的 latent action。",
        "是否支持 step-by-step 交互，而不是一次性生成整段视频。",
        "生成数据是否真的提升下游机器人或 agent 表现。"
      ]
    },
    {
      title: "VLA + WM Hybrid：Proposal, Rollout, Rerank",
      source: "GR-1, OpenVLA/π0 systems, RoboDreamer, IRASim, GR00T/Cosmos direction",
      originalMedia: {
        type: "image",
        src: "https://research.nvidia.com/labs/gear/flare/videos/flare_architecture.svg",
        alt: "FLARE architecture diagram for VLA policy with latent world modeling tokens",
        caption: "FLARE 官方架构图：在 VLA 策略里加入 future tokens，让策略不必生成整张未来图像，也能对齐未来 latent state。",
        sourceUrl: "https://research.nvidia.com/labs/gear/flare/",
        sourceLabel: "NVIDIA FLARE project page"
      },
      thesis: "现实机器人系统最可能是混合架构：VLA 给动作候选，WM 做短程想象，critic/safety/controller 决定是否执行。",
      nodes: [
        { id: "obs", label: "Vision + Language + State", x: 40, y: 110, w: 190, h: 64, kind: "input" },
        { id: "vla", label: "VLA Proposal", x: 280, y: 110, w: 140, h: 64, kind: "policy" },
        { id: "wm", label: "WM Rollout", x: 470, y: 80, w: 150, h: 64, kind: "model" },
        { id: "critic", label: "Critic / Reranker", x: 670, y: 80, w: 160, h: 64, kind: "score" },
        { id: "safety", label: "Safety Filter", x: 670, y: 190, w: 160, h: 64, kind: "score" },
        { id: "ctrl", label: "Whole-Body Controller", x: 880, y: 110, w: 190, h: 64, kind: "action" },
        { id: "logs", label: "Real Robot Logs", x: 470, y: 250, w: 150, h: 64, kind: "world" }
      ],
      edges: [["obs", "vla"], ["vla", "wm"], ["wm", "critic"], ["wm", "safety"], ["critic", "ctrl"], ["safety", "ctrl"], ["ctrl", "logs"], ["logs", "vla"], ["logs", "wm"]],
      readingFocus: [
        "VLA 输出的是单步动作、action chunk、轨迹、技能，还是 visual subgoal。",
        "WM 是在线重排、离线生成数据，还是训练辅助 loss。",
        "系统如何处理延迟、安全、失败恢复和真实部署日志。"
      ]
    }
  ],
  misconceptions: [
    {
      myth: "会生成视频就是 World Model",
      reality: "不够。机器人 WM 至少要能被动作控制，并且预测结果能服务规划、评估或训练。"
    },
    {
      myth: "视频越清晰，机器人越会做事",
      reality: "画质和控制能力不是一回事。机器人更需要可控性、接触正确性和闭环稳定。"
    },
    {
      myth: "WM 一定要预测像素",
      reality: "不一定。很多强 WM 预测 latent、reward、value、Q、occupancy 或 progress。"
    },
    {
      myth: "有了 WM 就不需要 VLA",
      reality: "短期更现实的是混合系统：VLA 负责语义和动作提议，WM 负责想象、校验和重排。"
    },
    {
      myth: "长视频生成等于长程规划",
      reality: "长程规划还需要目标、价值、可执行动作、纠错和闭环反馈。连续生成不等于能完成任务。"
    },
    {
      myth: "自动驾驶 WM 可以直接搬到灵巧操作",
      reality: "驾驶的 BEV/occupancy 和闭环评估值得借鉴，但灵巧操作有更强的遮挡、接触和手物耦合。"
    }
  ],
  milestones: [
    { year: "1990", label: "Dyna", lane: "theory", note: "Model learning and planning become one reinforcement learning loop." },
    { year: "2016", label: "Robot Video Prediction", lane: "robot", note: "Action-conditioned video prediction starts to look like a useful robot dynamics model." },
    { year: "2018", label: "World Models / PETS", lane: "control", note: "Latent imagination and uncertainty-aware MBRL become modern reference points." },
    { year: "2019", label: "PlaNet / Dreamer / MuZero", lane: "control", note: "Latent planning, imagined actor-critic, and value-equivalent dynamics split into durable branches." },
    { year: "2022", label: "DayDreamer / TD-MPC", lane: "robot", note: "World models move closer to real robots and task-oriented latent MPC." },
    { year: "2023", label: "DreamerV3 / UniSim / GAIA-1", lane: "foundation", note: "Scalable world-model RL, interactive real-world simulation, and driving world models accelerate." },
    { year: "2024", label: "Genie / RoboDreamer / IRASim", lane: "foundation", note: "Latent actions, robot imagination, and action-aligned simulation become central." },
    { year: "2025", label: "Cosmos / V-JEPA 2 / GR00T N1", lane: "systems", note: "Physical AI world foundation models and humanoid VLA systems begin to converge." }
  ],
  equations: [
    {
      title: "动作条件世界模型",
      mathml: "<math display=\"block\"><mi>p</mi><mo>(</mo><msub><mi>o</mi><mrow><mi>t</mi><mo>+</mo><mn>1</mn><mo>:</mo><mi>t</mi><mo>+</mo><mi>H</mi></mrow></msub><mo>|</mo><msub><mi>o</mi><mrow><mn>0</mn><mo>:</mo><mi>t</mi></mrow></msub><mo>,</mo><msub><mi>a</mi><mrow><mi>t</mi><mo>:</mo><mi>t</mi><mo>+</mo><mi>H</mi></mrow></msub><mo>,</mo><mi>g</mi><mo>)</mo></math>",
      explain: "机器人 WM 的基本形式：给定历史观测、候选动作和目标，预测未来观测或状态。"
    },
    {
      title: "Latent Dynamics",
      mathml: "<math display=\"block\"><msub><mi>z</mi><mrow><mi>t</mi><mo>+</mo><mn>1</mn></mrow></msub><mo>∼</mo><msub><mi>p</mi><mi>θ</mi></msub><mo>(</mo><msub><mi>z</mi><mi>t</mi></msub><mo>,</mo><msub><mi>a</mi><mi>t</mi></msub><mo>)</mo><mo>,</mo><mspace width=\"0.5em\"/><msub><mi>o</mi><mi>t</mi></msub><mo>∼</mo><msub><mi>p</mi><mi>θ</mi></msub><mo>(</mo><msub><mi>o</mi><mi>t</mi></msub><mo>|</mo><msub><mi>z</mi><mi>t</mi></msub><mo>)</mo></math>",
      explain: "PlaNet/Dreamer 式路线用 latent belief state 承载世界状态，再在 latent 里想象。"
    },
    {
      title: "Visual MPC",
      mathml: "<math display=\"block\"><msup><mi>A</mi><mo>*</mo></msup><mo>=</mo><munder><mi>argmax</mi><mi>A</mi></munder><mrow><mo>[</mo><mi>R</mi><mo>(</mo><mtext>rollout</mtext><mo>(</mo><mi>A</mi><mo>)</mo><mo>)</mo><mo>−</mo><mi>λ</mi><mi>C</mi><mo>(</mo><mi>A</mi><mo>)</mo><mo>]</mo></mrow></math>",
      explain: "采样多段动作，rollout 未来，按目标图像、距离、碰撞或安全代价选最优动作序列。"
    },
    {
      title: "Dreamer 想象学习",
      mathml: "<math display=\"block\"><mi>J</mi><mo>(</mo><mi>π</mi><mo>)</mo><mo>=</mo><msub><mi>𝔼</mi><mrow><msub><mi>p</mi><mi>θ</mi></msub><mo>,</mo><mi>π</mi></mrow></msub><mo>[</mo><munder><mo>∑</mo><mi>t</mi></munder><msup><mi>γ</mi><mi>t</mi></msup><msub><mi>r</mi><mi>t</mi></msub><mo>]</mo></math>",
      explain: "Dreamer 不只在线规划，而是在学到的 latent 模型中训练 actor-critic。"
    },
    {
      title: "VLA + WM 重排",
      mathml: "<math display=\"block\"><msup><mi>a</mi><mo>*</mo></msup><mo>=</mo><munder><mi>argmax</mi><mrow><mi>a</mi><mo>∈</mo><msub><mi>π</mi><mtext>VLA</mtext></msub></mrow></munder><mrow><mo>[</mo><mi>S</mi><mo>(</mo><msub><mi>f</mi><mtext>WM</mtext></msub><mo>(</mo><mi>o</mi><mo>,</mo><mi>a</mi><mo>)</mo><mo>)</mo><mo>]</mo></mrow></math>",
      explain: "VLA 生成候选动作，WM 预测后果，评分器按成功、风险、进度或安全约束重排。"
    },
    {
      title: "JEPA 式预测",
      mathml: "<math display=\"block\"><mi>L</mi><mo>=</mo><mo>∥</mo><mi>q</mi><mo>(</mo><msub><mi>z</mi><mtext>context</mtext></msub><mo>,</mo><mi>a</mi><mo>)</mo><mo>−</mo><mtext>sg</mtext><mo>(</mo><msub><mi>z</mi><mtext>target</mtext></msub><mo>)</mo><mo>∥</mo></math>",
      explain: "JEPA 不预测高熵像素细节，而预测抽象表征；这对物理理解和规划更有吸引力。"
    }
  ],
  paradigms: [
    {
      name: "Pixel video prediction",
      examples: "Finn video prediction, SV2P, Visual Foresight",
      strength: "直观，可用于目标图像、像素点或视频 rollout。",
      caution: "长时程容易模糊漂移，视觉真实不等于控制可靠。"
    },
    {
      name: "Latent model-based RL",
      examples: "PlaNet, DreamerV3, TD-MPC2",
      strength: "直接服务 reward/value/control，样本效率和规划接口清楚。",
      caution: "表示是否捕捉接触、物体状态和长程任务进度，需要下游验证。"
    },
    {
      name: "Interactive generative simulator",
      examples: "UniSim, Genie, IRASim, Cosmos",
      strength: "能生成可交互环境、长尾数据和机器人训练/评估样本。",
      caution: "关键看 action controllability、闭环稳定和 sim-to-real，而不是 demo 画质。"
    },
    {
      name: "VLA + WM hybrid",
      examples: "GR-1, OpenVLA + critic, π0 + rollout, GR00T stack",
      strength: "把 VLA 的语义泛化和 WM 的反事实想象结合，最贴近可部署机器人系统。",
      caution: "接口复杂：候选动作粒度、延迟、评分函数和安全边界都要设计。"
    },
    {
      name: "JEPA / masked latent prediction",
      examples: "CPC, I-JEPA, V-JEPA, V-JEPA 2",
      strength: "避免浪费容量预测像素噪声，更可能学到可规划表征。",
      caution: "自监督表征强不等于自动有动作条件和可控 dynamics。"
    },
    {
      name: "Driving / 3D simulation side route",
      examples: "GAIA-1, Vista, OccWorld, Waymax",
      strength: "闭环评估、多传感器一致性、长尾场景生成非常成熟。",
      caution: "驾驶动作空间和机器人接触操作差异大，只借鉴仿真与评估方法。"
    }
  ],
  readingPath: [
    {
      phase: "Phase 1",
      title: "建立 WM 直觉",
      goal: "先理解世界模型为什么不只是预测视频，而是为了规划和控制。",
      read: ["World Models", "PETS", "PlaNet", "DreamerV3"],
      output: "能解释 latent dynamics、imagination rollout、model bias 和 MPC。"
    },
    {
      phase: "Phase 2",
      title: "进入机器人视觉动力学",
      goal: "看懂动作条件视频预测如何变成机器人控制器。",
      read: ["Finn video prediction", "SV2P", "Visual Foresight", "Deep Visual Foresight"],
      output: "能画出 action-conditioned video model + visual MPC 的 pipeline。"
    },
    {
      phase: "Phase 3",
      title: "读真实机器人 WM",
      goal: "理解 latent WM 怎样在真实机器人小数据、在线学习和 task-oriented control 中工作。",
      read: ["DayDreamer", "TD-MPC2", "Diffuser", "Trajectory Transformer"],
      output: "能比较在线规划、想象 actor-critic、trajectory generation 的差异。"
    },
    {
      phase: "Phase 4",
      title: "接上 VLA / 人形",
      goal: "把 WM 放进 VLA 和 humanoid stack：提议、rollout、重排、失败预测、whole-body execution。",
      read: ["GR-1", "OpenVLA", "π0", "GR00T N1", "RoboDreamer", "IRASim"],
      output: "能设计一个 VLA proposal + WM evaluator + controller 的混合系统。"
    },
    {
      phase: "Phase 5",
      title: "补 foundation 与理论",
      goal: "理解 JEPA、生成式交互世界和 Physical AI foundation model 的长期方向。",
      read: ["CPC", "I-JEPA", "V-JEPA 2", "UniSim", "Genie 2", "Cosmos"],
      output: "能区分强视频模型、交互式 simulator 和真正可控 WM。"
    }
  ],
  routes: [
    {
      id: "classic-mbrl",
      title: "经典 MBRL 与控制型 WM",
      question: "最窄义的 WM 是什么？它学环境动态，并用这个模型做规划、搜索、价值学习或策略改进。",
      takeaway: "这条线是所有 WM 的地基。Dyna/PILCO/PETS 解释为什么模型误差和不确定性重要；PlaNet/Dreamer/TD-MPC2 则把像素输入、latent dynamics 和控制目标合在一起。",
      priority: "先读",
      branches: [
        "Dyna-style learning：真实经验训练模型，再用模型生成想象经验或做规划。",
        "Uncertainty-aware dynamics：用 GP、probabilistic ensemble、short rollout 抑制模型误差。",
        "Latent model-based RL：把高维视觉压成 belief state，在 latent 中训练策略或做 MPC。",
        "Value-equivalent model：不重建像素，只预测 reward/value/policy/Q 等对决策足够的信息。"
      ],
      patterns: [
        "不要把 rollout horizon 拉太长；短 rollout + terminal value 常常更稳。",
        "像素重建不是目标，控制可用性才是目标。",
        "机器人系统里要关心 latency、replanning rate 和模型是否会被 policy exploit。"
      ],
      references: [
        { title: "Dyna: Integrated Architectures for Learning, Planning, and Reacting", year: "1990", type: "paper", url: "https://papersdb.cs.ualberta.ca/~papersdb/view_publication.php?pub_id=505", value: "模型学习与规划结合的经典起点。" },
        { title: "PILCO: A Model-Based and Data-Efficient Approach to Policy Search", year: "2011", type: "paper", url: "https://is.mpg.de/en/publications/deisenrothrt2011", value: "用 GP dynamics 和不确定性传播实现极高样本效率。" },
        { title: "Embed to Control", year: "2015", type: "paper", url: "https://arxiv.org/abs/1506.07365", value: "从图像学习局部线性 latent dynamics，连接 VAE 与 optimal control。" },
        { title: "World Models", year: "2018", type: "paper", url: "https://arxiv.org/abs/1803.10122", value: "VAE + MDN-RNN + controller，让 agent 在 learned dream 中训练。" },
        { title: "PETS", year: "2018", type: "paper", url: "https://arxiv.org/abs/1805.12114", value: "probabilistic ensemble + trajectory sampling + MPC 的深度 MBRL 经典基线。" },
        { title: "PlaNet", year: "2019", type: "paper", url: "https://arxiv.org/abs/1811.04551", value: "RSSM latent dynamics + CEM planning，从像素做连续控制。" },
        { title: "MBPO", year: "2019", type: "paper", url: "https://arxiv.org/abs/1906.08253", value: "从真实 replay buffer 分叉短模型 rollout，训练 off-policy policy。" },
        { title: "Dreamer", year: "2019", type: "paper", url: "https://arxiv.org/abs/1912.01603", value: "在 RSSM imagined latent trajectories 中训练 actor-critic。" },
        { title: "MuZero", year: "2019", type: "paper", url: "https://arxiv.org/abs/1911.08265", value: "学习 value-equivalent dynamics，用 MCTS 做决策。" },
        { title: "DreamerV3", year: "2023", type: "paper", url: "https://arxiv.org/abs/2301.04104", value: "统一配置跨大量任务，展示 world-model RL 的规模化潜力。" },
        { title: "TD-MPC2", year: "2023", type: "paper", url: "https://arxiv.org/abs/2310.16828", value: "decoder-free task-oriented latent dynamics + terminal value + MPC。" }
      ]
    },
    {
      id: "robot-visual-dynamics",
      title: "机器人视觉动力学与 Visual Foresight",
      question: "如果机器人执行一段动作，画面、物体、接触和目标会怎样变化？",
      takeaway: "这条线最贴近 manipulation 的 WM 祖先。它把 action-conditioned video prediction 接到 MPC，让机器人不用显式建模物体类别和接触方程，也能通过想象选择动作。",
      priority: "先读",
      branches: [
        "Action-conditioned video prediction：输入当前帧和动作，预测未来帧或像素运动。",
        "Stochastic video prediction：处理多未来分布，避免平均化导致的模糊。",
        "Visual MPC：用预测视频评估候选动作，按目标像素、目标图像或 learned reward 执行。",
        "Goal-conditioned foresight：把语言、目标图像、点位或子目标接入视频预测。"
      ],
      patterns: [
        "看论文时重点问：action 是什么粒度？预测多少步？用什么 reward 选动作？",
        "视觉预测模型适合推、抓、移动物体，但对长程语义任务和复杂接触会累积误差。",
        "这条线非常适合连接 VLA：VLA 产候选动作，Visual Foresight 负责重排。"
      ],
      references: [
        { title: "Action-Conditional Video Prediction using Deep Networks in Atari Games", year: "2015", type: "paper", url: "https://arxiv.org/abs/1507.08750", value: "明确把动作条件未来帧预测用于环境建模。" },
        { title: "Learning Visual Predictive Models of Physics for Playing Billiards", year: "2015", type: "paper", url: "https://arxiv.org/abs/1511.07404", value: "用视觉预测做简单物理场景中的动作规划。" },
        { title: "Unsupervised Learning for Physical Interaction through Video Prediction", year: "2016", type: "paper", url: "https://arxiv.org/abs/1605.07157", value: "用机器人推物数据学习动作条件视频和像素运动。" },
        { title: "Deep Visual Foresight for Planning Robot Motion", year: "2016", type: "paper", url: "https://arxiv.org/abs/1610.00696", value: "把视频预测模型接到 MPC，形成机器人 visual foresight。" },
        { title: "SV2P: Stochastic Variational Video Prediction", year: "2017", type: "paper", url: "https://arxiv.org/abs/1710.11252", value: "用 latent variable 建模多种可能未来，减少 deterministic prediction 的模糊。" },
        { title: "SAVP: Stochastic Adversarial Video Prediction", year: "2018", type: "paper", url: "https://arxiv.org/abs/1804.01523", value: "结合随机潜变量和 adversarial loss 改善视频预测质量。" },
        { title: "Visual Foresight: Model-Based Deep RL for Vision-Based Robotic Control", year: "2018", type: "paper", url: "https://arxiv.org/abs/1812.00568", value: "系统化目标图像、像素点和 classifier-based reward 的 visual MPC。" },
        { title: "Learning Latent Plans from Play", year: "2019", type: "paper", url: "https://arxiv.org/abs/1903.01973", value: "从无结构 play data 中学习可用于机器人控制的 latent plans。" }
      ]
    },
    {
      id: "real-robot-latent",
      title: "真实机器人 Latent WM",
      question: "怎样让 WM 不只在 Atari 或 MuJoCo 中有效，而能帮真实机器人更省数据地学习？",
      takeaway: "真实机器人 WM 更关心小数据、在线更新、控制稳定和安全边界。DayDreamer 证明 Dreamer 可直接上机器人；TD-MPC2 则代表 task-oriented latent MPC 的强势路线。",
      priority: "重点",
      branches: [
        "Online world-model RL：边交互边更新模型和策略，减少真实数据需求。",
        "Decoder-free latent control：不追求像素重建，把 latent 学成服务 Q/value/planning 的状态。",
        "Trajectory generative planning：把轨迹当 token 或 diffusion sample，生成可执行计划。",
        "Failure-aware latent state：对真实机器人要额外预测碰撞、失稳、接触失败和任务进度。"
      ],
      patterns: [
        "真实机器人上，模型的保守性和不确定性估计往往比平均预测误差更重要。",
        "WM 输出不一定是视频，也可以是未来 latent、reward、value、success probability。",
        "与 whole-body controller 接口要清楚：WM 规划的是末端、关节、base 还是高层子目标？"
      ],
      references: [
        { title: "DayDreamer: World Models for Physical Robot Learning", year: "2022", type: "paper", url: "https://arxiv.org/abs/2206.14176", value: "把 Dreamer 式 world-model RL 直接用于多种真实机器人任务。" },
        { title: "TD-MPC", year: "2022", type: "paper", url: "https://arxiv.org/abs/2203.04955", value: "task-oriented latent dynamics + TD learning + MPC 的强控制基线。" },
        { title: "TD-MPC2", year: "2023", type: "paper", url: "https://arxiv.org/abs/2310.16828", value: "把 TD-MPC 扩展到多任务和大模型，强调 decoder-free world model。" },
        { title: "Trajectory Transformer", year: "2021", type: "paper", url: "https://arxiv.org/abs/2106.02039", value: "将离线 RL 和 planning 表述为轨迹序列建模。" },
        { title: "Decision Transformer", year: "2021", type: "paper", url: "https://arxiv.org/abs/2106.01345", value: "把 return-conditioned control 变成序列建模，为 action token 范式铺路。" },
        { title: "Planning with Diffusion for Flexible Behavior Synthesis", year: "2022", type: "paper", url: "https://arxiv.org/abs/2205.09991", value: "用 diffusion 生成轨迹，把规划视为去噪采样。" },
        { title: "Diffusion Policy", year: "2023", type: "paper", url: "https://arxiv.org/abs/2303.04137", value: "本身是动作生成器而非 WM，但成为 VLA/WM hybrid 的重要动作头。" },
        { title: "Masked World Models for Visual Control", year: "2022", type: "paper", url: "https://arxiv.org/abs/2206.14244", value: "把 masked visual pretraining 和 latent dynamics 解耦，用于视觉控制。" }
      ]
    },
    {
      id: "generative-sim",
      title: "生成式交互模拟器",
      question: "能不能训练一个可交互的真实世界模拟器，让机器人在模型里练习、评估和发现失败？",
      takeaway: "这是近年最热的 WM 方向。UniSim、Genie、RoboDreamer、IRASim、Cosmos 把视频生成、动作条件和 embodied data 接起来，但关键仍是可控性、闭环稳定和 sim-to-real。",
      priority: "重点",
      branches: [
        "Universal simulators：混合机器人、导航、视频数据，学习可交互真实世界动态。",
        "Latent action discovery：从无动作标签视频中学习可控 action space。",
        "Robot action simulation：把机器人动作和每帧变化对齐，服务 manipulation 数据生成。",
        "Physical AI world foundation models：面向机器人/自动驾驶的 text/image/video-to-world 平台。"
      ],
      patterns: [
        "判断生成式 WM 时看三件事：是否 action-controllable、是否能闭环交互、是否提升下游机器人。",
        "Sora/Gen-3 这类强视频模型是 world simulator 候选，但没有公开 step/action 接口时只能算弱 WM。",
        "对机器人最有价值的不是长视频，而是稀有失败、未见物体组合和危险动作的可控合成。"
      ],
      references: [
        { title: "UniSim: Learning Interactive Real-World Simulators", year: "2023", type: "paper", url: "https://arxiv.org/abs/2310.06114", value: "用多源数据学习交互式真实世界模拟器，并用于 agent 训练。" },
        { title: "Genie: Generative Interactive Environments", year: "2024", type: "paper", url: "https://arxiv.org/abs/2402.15391", value: "从互联网视频学习 latent action，生成可逐帧控制的环境。" },
        { title: "RoboDreamer: Learning Compositional World Models for Robot Imagination", year: "2024", type: "paper", url: "https://arxiv.org/abs/2404.12377", value: "用组合式视频 world model 帮助机器人想象未见物体-动作组合。" },
        { title: "IRASim: Learning Interactive Real-Robot Action Simulators", year: "2024", type: "paper", url: "https://arxiv.org/abs/2406.14540", value: "强调机器人动作与视频帧的细粒度对齐，生成交互式动作模拟。" },
        { title: "Pandora: Towards General World Model with Natural Language Actions", year: "2024", type: "paper", url: "https://arxiv.org/abs/2406.09455", value: "用自然语言动作控制视频状态模拟，连接 LLM 和视频 world model。" },
        { title: "DIAMOND", year: "2024", type: "paper", url: "https://arxiv.org/abs/2405.12399", value: "用 diffusion world model 在 Atari 中训练 RL，展示 neural game engine 思路。" },
        { title: "GameNGen", year: "2024", type: "paper", url: "https://arxiv.org/abs/2408.14837", value: "用扩散模型实时模拟 DOOM，说明交互神经引擎的可能性。" },
        { title: "Genie 2", year: "2024", type: "blog", url: "https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/", value: "DeepMind 展示从图像/文本生成可玩 3D 环境的 foundation world model。" },
        { title: "Cosmos World Foundation Model Platform", year: "2025", type: "paper", url: "https://arxiv.org/abs/2501.03575", value: "NVIDIA 面向 Physical AI 的世界基础模型平台，服务合成数据和物理场景生成。" },
        { title: "Sora: Video Generation Models as World Simulators", year: "2024", type: "report", url: "https://openai.com/research/video-generation-models-as-world-simulators", value: "把大规模视频生成定位为 world simulator 候选，但公开接口不是机器人闭环 WM。" }
      ]
    },
    {
      id: "vla-wm-hybrid",
      title: "VLA + WM 混合架构",
      question: "VLA 会直接反应，但它会不会先想一下？WM 可以成为 VLA 的慢速想象和校验层。",
      takeaway: "最实用的近期路线不是纯 WM 替代 VLA，而是 VLA proposal + WM rollout/evaluator + safety/reranker + controller。GR-1、OpenVLA、π0、GR00T、RoboDreamer、IRASim 都能放进这条线理解。",
      priority: "重点",
      branches: [
        "VLA proposal：从视觉、语言和状态生成动作 chunk、轨迹或子目标。",
        "WM evaluation：对候选动作 rollout，预测成功、碰撞、物体变化、任务进度或失败风险。",
        "Synthetic data engine：用 WM 生成长尾场景、未见物体组合和纠错数据。",
        "Auxiliary prediction：给 VLA 加未来帧、latent、progress、affordance 等辅助目标。"
      ],
      patterns: [
        "VLA 和 WM 的动作接口要一致：token、delta pose、joint action、trajectory chunk 或 latent action。",
        "在线部署时 WM 可能只做短 horizon 重排，长 horizon 规划交给高层 planner。",
        "不要只看生成质量，要看是否提升真实机器人 success rate、recovery 和安全性。"
      ],
      references: [
        { title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control", year: "2023", type: "paper", url: "https://arxiv.org/abs/2307.15818", value: "现代 VLA 标志性工作，为 VLA+WM 提供 policy 侧对照。" },
        { title: "OpenVLA", year: "2024", type: "paper", url: "https://arxiv.org/abs/2406.09246", value: "开源 VLA 基线，适合研究 WM critic/reranker 如何接入。" },
        { title: "π0: A Vision-Language-Action Flow Model for General Robot Control", year: "2024", type: "paper", url: "https://arxiv.org/abs/2410.24164", value: "VLM + flow action expert 的通用机器人控制路线，适合与 WM 组合。" },
        { title: "GR-1: Unleashing Large-Scale Video Generative Pre-training for Visual Robot Manipulation", year: "2023", type: "paper", url: "https://arxiv.org/abs/2312.13139", value: "同时预测动作和未来图像，体现 VLA 与视频生成预训练的合流。" },
        { title: "RoboDreamer", year: "2024", type: "paper", url: "https://arxiv.org/abs/2404.12377", value: "用语言分解和视频 world model 增强机器人组合泛化。" },
        { title: "IRASim", year: "2024", type: "paper", url: "https://arxiv.org/abs/2406.14540", value: "机器人动作条件交互模拟器，可作为 VLA 训练/评估的 world model。" },
        { title: "GR00T N1: Open Foundation Model for Humanoid Robots", year: "2025", type: "paper", url: "https://arxiv.org/abs/2503.14734", value: "开放人形机器人 foundation model，展示 VLA、动作生成和仿真栈融合方向。" },
        { title: "Gemini Robotics", year: "2025", type: "paper", url: "https://arxiv.org/abs/2503.20020", value: "把 Gemini 多模态模型扩展到 physical action，适合作为 VLA 系统参照。" }
      ]
    },
    {
      id: "humanoid-system2",
      title: "人形机器人慢速想象层",
      question: "对人形机器人，WM 最应该预测什么：画面、接触、身体稳定、双手协作，还是任务进度？",
      takeaway: "人形不是机械臂 VLA 的简单放大。WM 最有价值的是作为 System 2：对 VLA 的动作做短 horizon 物理前瞻、接触风险评估、长程进度判断和失败恢复建议。",
      priority: "深入",
      branches: [
        "Bimanual contact foresight：预测双手、物体、桌面和身体姿态耦合后的变化。",
        "Whole-body feasibility：把候选末端动作交给全身控制前，先预测平衡、碰撞和可达性风险。",
        "Progress/failure model：判断长程任务做到哪一步、哪里可能失败、是否需要重新规划。",
        "Human-video bridge：从人类视频学习 latent action、affordance 和任务结构，再 retarget 到机器人。"
      ],
      patterns: [
        "人形 WM 的状态不该只有 RGB，最好包含手、腕、base、重心、接触、物体 pose 和任务进度。",
        "慢速 WM 不必每个控制 tick 运行；它可以在 chunk 边界、风险升高或任务切换时介入。",
        "未来系统更可能是 VLA + WM + whole-body RL/MPC + safety filter，而不是单模型端到端包办。"
      ],
      references: [
        { title: "ALOHA: Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware", year: "2023", type: "paper", url: "https://arxiv.org/abs/2304.13705", value: "双臂精细操作和 action chunking 的重要基础，对 WM 接触预测很有参考价值。" },
        { title: "RoboSet", year: "2023", type: "paper", url: "https://arxiv.org/abs/2304.07709", value: "灵巧操作数据集，提醒 WM 不能只看夹爪抓放。" },
        { title: "Structured World Models from Human Videos", year: "2023", type: "paper", url: "https://arxiv.org/abs/2308.10901", value: "从人类视频学习结构化 affordance/action 空间并迁移到机器人。" },
        { title: "V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning", year: "2025", type: "paper", url: "https://arxiv.org/abs/2506.09985", value: "JEPA 式视频表征走向物理推理和机器人规划，是人类视频到机器人 WM 的关键线索。" },
        { title: "GR00T N1", year: "2025", type: "paper", url: "https://arxiv.org/abs/2503.14734", value: "开放人形机器人 foundation model，可作为 VLA + action model + sim workflow 的系统样本。" },
        { title: "Cosmos", year: "2025", type: "paper", url: "https://arxiv.org/abs/2501.03575", value: "Physical AI world foundation model，对人形合成数据和仿真评估有直接关联。" },
        { title: "Diffusion Policy", year: "2023", type: "paper", url: "https://arxiv.org/abs/2303.04137", value: "连续多峰动作 chunk 建模强，是人形低层动作头的重要基线。" },
        { title: "Behavior Transformers", year: "2022", type: "paper", url: "https://arxiv.org/abs/2206.11251", value: "将离散 mode selection 与连续控制结合，适合理解多模态行为克隆。" }
      ]
    },
    {
      id: "representation-theory",
      title: "表示学习与理论底座",
      question: "WM 应该预测像素、token、latent、对象、因果变量，还是可控状态？",
      takeaway: "长期价值在于可预测、可控、可规划的表征。CPC/MAE/JEPA 解释如何从自监督预测学表示；object-centric 和 causal representation 则提醒我们要学到可组合、可干预的世界状态。",
      priority: "深入",
      branches: [
        "Predictive coding / active inference：智能体通过预测误差和生成模型理解世界。",
        "Contrastive and masked prediction：从 CPC、MAE 到 VideoMAE/MWM，学习视觉/视频表征。",
        "JEPA-style latent prediction：预测抽象表示而不是像素细节。",
        "Object-centric and causal WM：把世界拆成对象、关系、可干预变量和可控状态。"
      ],
      patterns: [
        "SSM/Mamba 是序列骨干，不自动等于 WM；必须动作条件化并服务预测/控制。",
        "JEPA 很适合做机器人 WM 表征层，但还需要 action-conditioned dynamics 接上控制。",
        "object-centric/causal 表示适合物理推理，但在真实复杂视频中仍然很难。"
      ],
      references: [
        { title: "Predictive Coding in the Visual Cortex", year: "1999", type: "paper", url: "https://www.cnbc.cmu.edu/~tai/microns_papers/rao_ballard.pdf", value: "把感知解释为分层预测误差最小化的经典论文。" },
        { title: "The Free-Energy Principle", year: "2010", type: "paper", url: "https://www.nature.com/articles/nrn2787", value: "active inference/free energy 的核心理论入口。" },
        { title: "CPC: Representation Learning with Contrastive Predictive Coding", year: "2018", type: "paper", url: "https://arxiv.org/abs/1807.03748", value: "预测未来 latent 的自监督表示学习源头之一。" },
        { title: "Slot Attention", year: "2020", type: "paper", url: "https://arxiv.org/abs/2006.15055", value: "对象槽位表示，为 object-centric WM 提供基础模块。" },
        { title: "C-SWM: Contrastive Structured World Models", year: "2019", type: "paper", url: "https://arxiv.org/abs/1911.12247", value: "对象/关系结构化 dynamics，用于组合式物理推理。" },
        { title: "MAE", year: "2021", type: "paper", url: "https://arxiv.org/abs/2111.06377", value: "masked autoencoding 的视觉表征基线，影响后续 masked world modeling。" },
        { title: "VideoMAE", year: "2022", type: "paper", url: "https://arxiv.org/abs/2203.12602", value: "把 masked autoencoding 扩展到视频表征学习。" },
        { title: "I-JEPA", year: "2023", type: "paper", url: "https://arxiv.org/abs/2301.08243", value: "在 joint embedding 空间预测图像区域，避免像素重建高熵细节。" },
        { title: "V-JEPA", year: "2024", type: "paper", url: "https://arxiv.org/abs/2404.08471", value: "JEPA 扩展到视频预测，面向更抽象的动态理解。" },
        { title: "Towards Causal Representation Learning", year: "2021", type: "paper", url: "https://arxiv.org/abs/2102.11107", value: "解释为什么可干预变量和因果表示对泛化重要。" },
        { title: "V-JEPA 2", year: "2025", type: "paper", url: "https://arxiv.org/abs/2506.09985", value: "将自监督视频模型推向理解、预测和机器人规划。" }
      ]
    },
    {
      id: "driving-3d-sim",
      title: "自动驾驶与 3D 仿真旁支",
      question: "自动驾驶 WM 对机器人有什么可借鉴？主要是闭环仿真、多传感器一致性、长尾场景和评估指标。",
      takeaway: "这条线少读但有用。驾驶域比 manipulation 更成熟地处理 closed-loop simulation、BEV/occupancy prediction 和 safety benchmark；但它的动作空间和接触物理与机器人差别很大。",
      priority: "旁支",
      branches: [
        "可控驾驶视频生成：给定历史、多视角、文本、轨迹或 ego action 生成未来场景。",
        "BEV/occupancy world model：预测 3D 占据、flow 和 agent 运动，而非直接预测像素。",
        "闭环仿真评估：用 sim agents、collision/off-road、route completion、comfort 等指标评估 planner。",
        "神经传感器仿真：从真实 logs 重建可重放、可扰动的 sensor simulator。"
      ],
      patterns: [
        "机器人可借鉴评估设计：action controllability、closed-loop stability、long-tail coverage。",
        "不要把驾驶视频生成的成功直接外推到灵巧操作；接触和手部遮挡是另一类难题。",
        "occupancy/BEV 思路可迁移到移动操作和人形导航。"
      ],
      references: [
        { title: "GAIA-1", year: "2023", type: "paper", url: "https://arxiv.org/abs/2309.17080", value: "Wayve 的视频、文本、动作条件自动驾驶生成式 world model。" },
        { title: "DriveDreamer", year: "2023", type: "paper", url: "https://arxiv.org/abs/2309.09777", value: "真实驾驶数据上的 diffusion world model。" },
        { title: "OccWorld", year: "2023", type: "paper", url: "https://arxiv.org/abs/2311.16038", value: "3D occupancy tokenizer + GPT-like 时空预测，代表 occupancy WM。" },
        { title: "Waymax", year: "2023", type: "paper", url: "https://arxiv.org/abs/2310.08710", value: "基于 Waymo Open Motion Dataset 的加速闭环仿真平台。" },
        { title: "Drive-WM", year: "2023", type: "paper", url: "https://arxiv.org/abs/2311.17918", value: "把多视角未来生成接入 planning tree。" },
        { title: "Vista", year: "2024", type: "paper", url: "https://arxiv.org/abs/2405.17398", value: "高保真、可泛化、多控制粒度的驾驶 world model。" },
        { title: "Drive-OccWorld", year: "2024", type: "paper", url: "https://arxiv.org/abs/2408.14197", value: "4D occupancy/flow/action-conditioned planning，可迁移理解空间状态预测。" },
        { title: "NeuRAD", year: "2023", type: "paper", url: "https://arxiv.org/abs/2311.15260", value: "相机+LiDAR neural rendering，代表神经传感器仿真方向。" }
      ]
    }
  ]
};

const evidenceLabels = {
  paper: "论文/技术报告",
  project: "项目/代码",
  blog: "官方 blog",
  "model-card": "模型卡",
  benchmark: "基准/评测",
  official: "官方资料",
  report: "报告/官方说明"
};

for (const route of wmMapData.routes) {
  for (const reference of route.references) {
    reference.evidence = evidenceLabels[reference.type] || "资料";
  }
}

if (typeof module !== "undefined") {
  module.exports = wmMapData;
}

if (typeof window !== "undefined") {
  window.vlaMapData = wmMapData;
}
