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
    caption: "这张图把 VLA 放在策略/候选动作生成器的位置：VLA 读取视觉、语言目标、本体状态和历史上下文，提出 action chunk、轨迹或技能调用；WM 再对这些候选做动作条件 rollout，交给 scorer/safety/reranker 选择，最后由低层控制器执行。",
    viewBox: "0 0 1340 360",
    nodes: [
      { id: "goal", label: "Language Goal", note: "task / instruction", x: 40, y: 50, w: 160, h: 60, kind: "input" },
      { id: "obs", label: "Observation + State", note: "RGB-D, proprioception", x: 40, y: 145, w: 180, h: 64, kind: "input" },
      { id: "hist", label: "History / Memory", note: "past obs + actions", x: 40, y: 240, w: 180, h: 60, kind: "state" },
      { id: "vla", label: "VLA Policy", note: "proposal module", x: 280, y: 110, w: 160, h: 70, kind: "policy" },
      { id: "cands", label: "Candidate Actions", note: "chunks / trajectories", x: 500, y: 110, w: 180, h: 70, kind: "action" },
      { id: "wm", label: "World Model", note: "state, action -> future", x: 500, y: 235, w: 180, h: 70, kind: "model" },
      { id: "future", label: "Imagined Futures", note: "state, video, contact", x: 740, y: 235, w: 180, h: 70, kind: "future" },
      { id: "score", label: "Scorer / Safety", note: "success, risk, progress", x: 740, y: 110, w: 180, h: 70, kind: "score" },
      { id: "selected", label: "Selected Action", note: "best safe candidate", x: 980, y: 110, w: 150, h: 70, kind: "action" },
      { id: "ctrl", label: "Low-Level Controller", note: "tracking / whole-body", x: 980, y: 235, w: 150, h: 70, kind: "action" },
      { id: "world", label: "Real Robot World", note: "environment feedback", x: 1180, y: 235, w: 140, h: 70, kind: "world" }
    ],
    edges: [
      ["goal", "vla"], ["obs", "vla"], ["hist", "vla"], ["vla", "cands"], ["obs", "wm"], ["hist", "wm"], ["cands", "wm"], ["wm", "future"], ["future", "score"], ["cands", "score"], ["score", "selected"], ["selected", "ctrl"], ["ctrl", "world"], ["world", "obs"], ["world", "hist"]
    ]
  },
  paperFigures: [
    {
      title: "Dreamer / PlaNet：Latent Imagination",
      source: "Ha & Schmidhuber 2018, PlaNet 2019, Dreamer/DreamerV3",
      originalMedia: {
        type: "image",
        src: "assets/paper-figures/dreamerv3-method.png",
        alt: "DreamerV3 method diagram with RSSM world model and actor critic imagination",
        caption: "DreamerV3 机制图：encoder/RSSM/decoder/reward/value heads 学 world model，actor-critic 在 imagined latent rollout 里学习。",
        sourceUrl: "https://github.com/danijar/dreamerv3",
        sourceLabel: "DreamerV3 repository"
      },
      supportingMedia: [
        {
          type: "image",
          src: "assets/paper-figures/planet-rssm.png",
          alt: "PlaNet RSSM architecture comparison",
          caption: "PlaNet 的 RSSM 图：deterministic recurrent memory 加 stochastic state，解释为什么 Dreamer/PlaNet 都围绕 belief state 做 latent dynamics。",
          sourceUrl: "https://planetrl.github.io/",
          sourceLabel: "PlaNet project page"
        }
      ],
      viewBox: "0 0 1160 420",
      cardClass: "wide",
      diagramClass: "pipeline",
      thesis: "核心不是把视频生成得好看，而是把历史压进 latent belief state，在想象轨迹里训练 actor-critic 或做规划。",
      detail: "这条线先用 encoder 把当前观测压到 stochastic + deterministic belief state，再用 RSSM 根据动作在 latent 里往前滚。decoder/reward/discount/value heads 让 world model 学到可训练信号；actor 和 critic 不直接在真环境里反复试，而是在 imagined latent trajectory 上优化策略。",
      deepDive: {
        summary: "从 belief state、RSSM、imagined rollout 三个词读懂 Dreamer/PlaNet。",
        sections: [
          {
            title: "先看什么",
            body: "先不要盯着 decoder 生成图像，而是看历史观测和动作如何被压进 RSSM belief。这个 belief 是模型对当前世界状态的记忆：它同时包含过去动作造成的影响、当前图像提供的新证据，以及模型对看不见状态的猜测。"
          },
          {
            title: "机制怎么跑",
            body: "训练时，encoder 把观测变成 latent，RSSM 用上一时刻 latent 和动作预测下一 latent，再用观测修正 belief。prediction heads 会预测图像、reward、discount 或 value，提供训练信号。控制时，模型在 latent 里滚出 imagined trajectory，actor/critic 用这些想象轨迹更新策略。"
          },
          {
            title: "为什么重要",
            body: "真实机器人不能无限试错，Dreamer/PlaNet 的价值是把昂贵交互换成模型里的想象。只要 belief 抓住了任务相关状态，策略就能在模型里比较许多未来，而不必每次都在真机上撞桌子、掉杯子或浪费数据。"
          },
          {
            title: "容易误解",
            body: "不要把它理解成先生成清晰视频再照着执行。像素 decoder 主要是训练 world model 的辅助信号，真正服务控制的是 latent belief 和 reward/value。PlaNet 更偏在线 planning，Dreamer 更偏在 imagination 中学 actor-critic。"
          }
        ]
      },
      stages: [
        { label: "Representation", x: 24, y: 34, w: 320, h: 340 },
        { label: "Latent World Model", x: 370, y: 34, w: 350, h: 340 },
        { label: "Imagination Control", x: 746, y: 34, w: 390, h: 340 }
      ],
      nodes: [
        { id: "hist", label: "History", note: "obs + actions", x: 52, y: 82, w: 120, h: 58, kind: "input" },
        { id: "obs", label: "Pixels / State", note: "o_t", x: 52, y: 194, w: 120, h: 58, kind: "input" },
        { id: "enc", label: "Encoder", note: "embed o_t", x: 210, y: 194, w: 110, h: 58, kind: "model" },
        { id: "belief", label: "RSSM Belief", note: "h_t + z_t", x: 406, y: 150, w: 150, h: 72, kind: "state" },
        { id: "dyn", label: "Latent Dynamics", note: "z,a -> z'", x: 588, y: 150, w: 120, h: 72, kind: "model" },
        { id: "heads", label: "Prediction Heads", note: "image / reward / discount", x: 494, y: 270, w: 170, h: 62, kind: "score" },
        { id: "imag", label: "Imagined Rollout", note: "latent trajectory", x: 770, y: 150, w: 150, h: 72, kind: "future" },
        { id: "critic", label: "Critic Value", note: "score futures", x: 962, y: 82, w: 130, h: 58, kind: "score" },
        { id: "actor", label: "Actor Policy", note: "improve actions", x: 962, y: 236, w: 130, h: 58, kind: "policy" }
      ],
      edges: [
        { from: "hist", to: "belief", label: "memory" },
        { from: "obs", to: "enc", label: "encode" },
        { from: "enc", to: "belief", label: "posterior" },
        { from: "belief", to: "dyn", label: "state" },
        { from: "dyn", to: "belief", label: "prior update" },
        { from: "belief", to: "heads", label: "train WM" },
        { from: "dyn", to: "imag", label: "rollout" },
        { from: "imag", to: "critic", label: "value" },
        { from: "imag", to: "actor", label: "policy grad" },
        { from: "actor", to: "dyn", label: "actions" }
      ],
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
        src: "assets/paper-figures/visual-foresight-mpc-overview.png",
        alt: "Visual Foresight visual MPC overview figure",
        caption: "Visual Foresight 论文机制图：训练时收集无标注交互数据学习视频预测模型，测试时用该模型做 sampling-based visual MPC。",
        sourceUrl: "https://arxiv.org/abs/1812.00568",
        sourceLabel: "Visual Foresight paper"
      },
      supportingMedia: [
        {
          type: "image",
          src: "assets/paper-figures/visual-foresight-video-model.png",
          alt: "Visual Foresight video prediction computation graph",
          caption: "动作条件视频预测计算图：给历史图像和动作序列，逐步预测未来图像/像素运动，供 MPC 评分候选动作。",
          sourceUrl: "https://arxiv.org/abs/1812.00568",
          sourceLabel: "Visual Foresight paper"
        }
      ],
      viewBox: "0 0 1160 420",
      cardClass: "wide",
      diagramClass: "pipeline",
      thesis: "给一批候选动作，预测每条动作会产生的视频，再按目标像素/目标图像/分类器 reward 选动作。",
      detail: "Visual Foresight 是典型 receding-horizon visual MPC：从当前图像和历史帧出发，采样多条未来动作序列，用动作条件视频模型预测每条序列的未来画面，再按目标图像、指定像素或 learned reward 打分。执行时只落地第一步动作，拿到新相机观测后重新采样和规划。",
      deepDive: {
        summary: "把它当成“看视频预测来做 MPC”，关键是每步重规划。",
        sections: [
          {
            title: "先看什么",
            body: "先看左侧的当前图像、历史帧和 visual goal，再看中间的 action-conditioned video predictor。它不是无条件生成视频，而是问：如果机器人执行这段动作序列，未来画面会怎样变化。"
          },
          {
            title: "机制怎么跑",
            body: "测试时会采样很多候选动作序列，每条序列都送进视频预测模型，得到未来帧或像素运动。然后用目标图像、指定像素距离、分类器或 learned reward 给每条视频打分，选出分数最好的动作序列。"
          },
          {
            title: "为什么重要",
            body: "这条路线非常直观：目标在图像里，预测也在图像里，评分也可以在图像空间完成。对推、拉、移动物体这类视觉反馈强的任务，它能用相对少的人工标注，把无标注交互视频变成规划模型。"
          },
          {
            title: "容易误解",
            body: "不要以为模型生成一整段视频后机器人就 open-loop 执行到底。Visual MPC 的关键是 receding horizon：只执行第一步动作，然后拿到新观测重新预测和重排。这样可以不断纠正视频预测误差。"
          }
        ]
      },
      stages: [
        { label: "Visual Context", x: 24, y: 34, w: 275, h: 340 },
        { label: "Video Prediction", x: 324, y: 34, w: 345, h: 340 },
        { label: "MPC Selection", x: 694, y: 34, w: 442, h: 340 }
      ],
      nodes: [
        { id: "hist", label: "Image History", note: "frames + robot state", x: 52, y: 98, w: 150, h: 58, kind: "input" },
        { id: "goal", label: "Visual Goal", note: "image / pixels / reward", x: 52, y: 238, w: 150, h: 58, kind: "score" },
        { id: "cands", label: "Candidate Actions", note: "sample sequences", x: 250, y: 168, w: 150, h: 58, kind: "action" },
        { id: "video", label: "Video Predictor", note: "action-conditioned", x: 442, y: 150, w: 160, h: 78, kind: "model" },
        { id: "future", label: "Predicted Videos", note: "future frames / flow", x: 710, y: 100, w: 150, h: 68, kind: "future" },
        { id: "cost", label: "Trajectory Cost", note: "compare to goal", x: 710, y: 238, w: 150, h: 68, kind: "score" },
        { id: "rank", label: "Rank Candidates", note: "lowest cost", x: 902, y: 168, w: 140, h: 58, kind: "score" },
        { id: "act", label: "Execute a_t", note: "first action only", x: 998, y: 290, w: 125, h: 58, kind: "action" },
        { id: "feedback", label: "New Observation", note: "replan", x: 902, y: 60, w: 140, h: 58, kind: "world" }
      ],
      edges: [
        { from: "hist", to: "video", label: "condition" },
        { from: "cands", to: "video", label: "actions" },
        { from: "video", to: "future", label: "predict" },
        { from: "goal", to: "cost", label: "target" },
        { from: "future", to: "cost", label: "score frames" },
        { from: "cost", to: "rank", label: "rank" },
        { from: "rank", to: "act", label: "choose first" },
        { from: "act", to: "feedback", label: "real step" },
        { from: "feedback", to: "hist", label: "new frame" },
        { from: "rank", to: "cands", label: "resample" }
      ],
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
        src: "assets/paper-figures/td-mpc-architecture.png",
        alt: "TD-MPC planning architecture with latent dynamics and value estimates",
        caption: "TD-MPC 官方图：TOLD latent dynamics 负责短程 rollout，reward/Q/value 给 MPC 打分，最后只执行第一步动作。",
        sourceUrl: "https://www.nicklashansen.com/td-mpc/",
        sourceLabel: "TD-MPC project page"
      },
      viewBox: "0 0 1160 410",
      cardClass: "wide",
      diagramClass: "pipeline",
      thesis: "不追求像素重建，学习直接服务 reward/Q/value 的 latent dynamics；规划时只做短 horizon latent rollout，用 reward 累加加 terminal value/Q 打分，最后只执行第一步动作并重规划。",
      detail: "decoder-free 的意思是模型不必还原未来图像，而是学习控制要用的量：encoder 得到任务 latent，d(z,a) 预测下一 latent，reward head 估计短期收益，Q/value head bootstrap 更远的回报。CEM/MPPI 采样多条动作序列，policy prior 提供更靠谱的候选或初始化；每条序列在 latent 里短滚动，按短期 reward + terminal value 排序，选出序列后只执行 a_t，下一帧重新观测再规划。这样把模型误差限制在短 horizon 内，长期目标交给从真实 replay 学到的 value。",
      deepDive: {
        summary: "读懂 decoder-free、短 rollout、terminal value 和 policy prior 的配合。",
        sections: [
          {
            title: "先看什么",
            body: "先找有没有 pixel decoder。如果没有，不是缺了一块，而是路线选择：TD-MPC 学的是任务相关 latent，不追求还原背景纹理。图里最关键的是 latent dynamics、reward head、Q/value head 和 planner。"
          },
          {
            title: "机制怎么跑",
            body: "当前观测先被编码成 latent z_t。planner 采样多条未来动作序列，policy prior 提供更靠谱的动作提案；TOLD dynamics 在 latent 中短 horizon rollout，reward head 给每一步打短期分，Q/value head 对末端状态做长期估值。"
          },
          {
            title: "为什么重要",
            body: "机器人控制关心的是哪个动作能拿高回报，而不是未来图像是否漂亮。短 rollout 降低模型误差累积，terminal value 用 TD 学到的长期回报补上远期目标，二者组合比盲目拉长模型预测更稳。"
          },
          {
            title: "容易误解",
            body: "policy prior 不是最终控制器，它只是帮助 CEM/MPPI 更快采到好候选。最终动作来自 reward rollout 和 terminal Q/value 的排序。也不要说它完全消除 compounding error，它只是把误差控制在短 horizon 内。"
          }
        ]
      },
      stages: [
        { label: "Replay + Encoding", x: 24, y: 34, w: 300, h: 340 },
        { label: "Task Latent Model", x: 350, y: 34, w: 370, h: 340 },
        { label: "MPC Scoring", x: 746, y: 34, w: 390, h: 340 }
      ],
      nodes: [
        { id: "buffer", label: "Replay Buffer", note: "train heads", x: 35, y: 40, w: 135, h: 58, kind: "input" },
        { id: "obs", label: "Observation", note: "pixels / state", x: 35, y: 165, w: 135, h: 58, kind: "input" },
        { id: "enc", label: "Encoder h", note: "compress obs", x: 210, y: 165, w: 120, h: 58, kind: "model" },
        { id: "latent", label: "Latent z_t", note: "decoder-free", x: 370, y: 165, w: 125, h: 58, kind: "state" },
        { id: "prior", label: "Policy Prior π", note: "proposal", x: 370, y: 290, w: 125, h: 58, kind: "policy" },
        { id: "planner", label: "CEM / MPPI Planner", note: "sample + update", x: 535, y: 290, w: 165, h: 58, kind: "policy" },
        { id: "seq", label: "Action Sequences", note: "a_t:t+H", x: 535, y: 165, w: 165, h: 58, kind: "action" },
        { id: "dyn", label: "TOLD Dynamics d", note: "z, a -> z'", x: 735, y: 155, w: 155, h: 78, kind: "model" },
        { id: "reward", label: "Reward r", note: "sum short rollout", x: 930, y: 96, w: 140, h: 58, kind: "score" },
        { id: "value", label: "Q / Terminal Value", note: "bootstrap horizon", x: 930, y: 214, w: 150, h: 58, kind: "score" },
        { id: "return", label: "Trajectory Return", note: "rank candidates", x: 995, y: 155, w: 140, h: 68, kind: "score" },
        { id: "act", label: "Execute a_t only", note: "then replan", x: 995, y: 310, w: 140, h: 58, kind: "action" }
      ],
      edges: [
        { from: "buffer", to: "enc", label: "train" },
        { from: "obs", to: "enc", label: "encode" },
        { from: "enc", to: "latent", label: "task state" },
        { from: "latent", to: "dyn", label: "start rollout" },
        { from: "latent", to: "prior", label: "condition" },
        { from: "prior", to: "planner", label: "proposal" },
        { from: "planner", to: "seq", label: "sample/update" },
        { from: "seq", to: "dyn", label: "H-step actions" },
        { from: "dyn", to: "reward", label: "predict r" },
        { from: "dyn", to: "value", label: "terminal" },
        { from: "reward", to: "return", label: "sum" },
        { from: "value", to: "return", label: "bootstrap" },
        { from: "return", to: "act", label: "best first action" }
      ],
      readingFocus: [
        "decoder-free：不要找 pixel decoder，重点看 latent consistency、reward、Q/value 和 policy prior 是否服务控制。",
        "短 horizon rollout + terminal value：模型只负责近几步后果，远期回报用 TD 学到的 value bootstrap，下一步重新观测纠偏。",
        "CEM/MPPI：policy prior 给动作序列提案，latent rollout 预测短期 reward，Q/value 给末端估值，planner 只执行第一步。"
      ]
    },
    {
      title: "Genie / UniSim / IRASim：Interactive Simulator",
      source: "UniSim 2023, Genie 2024, IRASim 2024, Cosmos 2025",
      originalMedia: {
        type: "image",
        src: "assets/paper-figures/irasim-overview.png",
        alt: "IRASim overview figure for robot manipulation world model",
        caption: "IRASim 官方总览图：把机器人轨迹、动作和视频生成对齐，用 action-aligned simulator 产生可用于训练与评估的机器人未来。",
        sourceUrl: "https://gen-irasim.github.io/",
        sourceLabel: "IRASim project page"
      },
      viewBox: "0 0 1160 420",
      cardClass: "wide",
      diagramClass: "pipeline",
      thesis: "把生成模型变成可交互环境：给历史、prompt 或动作，生成下一帧/下一状态，让 agent 能继续闭环。",
      detail: "Interactive simulator 和普通 text-to-video 的区别在交互接口：它接收历史上下文和动作，生成下一步观测或状态，再把这个结果交回 agent 继续选择动作。机器人场景里关键不是画面多漂亮，而是 action alignment、step-by-step controllability，以及生成 rollout 是否能用于训练、评估或规划。",
      deepDive: {
        summary: "区分普通视频生成和可交互 world simulator。",
        sections: [
          {
            title: "先看什么",
            body: "先看模型有没有动作输入，以及输出是否能作为下一步观测继续喂回 agent。如果只是 prompt 生成一段视频，那更像 video generation；如果每一步都能接收动作并更新世界，才接近 interactive simulator。"
          },
          {
            title: "机制怎么跑",
            body: "训练时用视频、机器人轨迹、动作或 latent action 对齐模型。推理时给定 prompt/history 和当前动作，simulator 生成下一帧、状态或接触结果；agent 读取这个新观测再选下一步动作，于是形成 step-by-step 闭环。"
          },
          {
            title: "为什么重要",
            body: "机器人数据贵且危险，interactive simulator 可以生成更多长尾场景、失败案例和候选 rollout，用来做训练、评估或规划。它把 world model 从一次性视频生成推进到可被 agent 使用的环境接口。"
          },
          {
            title: "容易误解",
            body: "画质好不代表可交互。核心指标是 action controllability、闭环稳定、物理接触是否合理，以及生成数据是否真的提升下游机器人表现。IRASim 这类机器人路线尤其强调 action-aligned。"
          }
        ]
      },
      stages: [
        { label: "World Data", x: 24, y: 34, w: 280, h: 340 },
        { label: "Action-Aligned Simulator", x: 330, y: 34, w: 390, h: 340 },
        { label: "Agent Loop", x: 746, y: 34, w: 390, h: 340 }
      ],
      nodes: [
        { id: "data", label: "Video / Robot Data", note: "trajectories", x: 52, y: 90, w: 150, h: 58, kind: "input" },
        { id: "labels", label: "Actions", note: "real or latent", x: 52, y: 240, w: 150, h: 58, kind: "action" },
        { id: "context", label: "Prompt + History", note: "context window", x: 365, y: 90, w: 150, h: 58, kind: "input" },
        { id: "action", label: "Step Action", note: "a_t token / control", x: 365, y: 240, w: 150, h: 58, kind: "action" },
        { id: "sim", label: "World Simulator", note: "generate next step", x: 555, y: 155, w: 145, h: 78, kind: "model" },
        { id: "next", label: "Next Obs / State", note: "frame, pose, contact", x: 770, y: 155, w: 150, h: 78, kind: "future" },
        { id: "agent", label: "Agent / Policy", note: "choose next action", x: 966, y: 88, w: 130, h: 58, kind: "policy" },
        { id: "rollout", label: "Synthetic Rollout", note: "train / eval / plan", x: 966, y: 240, w: 130, h: 58, kind: "score" }
      ],
      edges: [
        { from: "data", to: "sim", label: "train model" },
        { from: "labels", to: "sim", label: "align actions" },
        { from: "context", to: "sim", label: "condition" },
        { from: "action", to: "sim", label: "apply" },
        { from: "sim", to: "next", label: "generate" },
        { from: "next", to: "agent", label: "observe" },
        { from: "agent", to: "action", label: "act again" },
        { from: "next", to: "rollout", label: "record" },
        { from: "rollout", to: "agent", label: "improve" }
      ],
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
        src: "assets/paper-figures/flare-architecture.svg",
        alt: "FLARE architecture diagram for VLA policy with latent world modeling tokens",
        caption: "FLARE 官方架构图：在 VLA 策略里加入 future tokens，让策略不必生成整张未来图像，也能对齐未来 latent state。",
        sourceUrl: "https://research.nvidia.com/labs/gear/flare/",
        sourceLabel: "NVIDIA FLARE project page"
      },
      viewBox: "0 0 1160 420",
      cardClass: "wide",
      diagramClass: "pipeline",
      thesis: "现实机器人系统最可能是混合架构：VLA 给动作候选，WM 做短程想象，critic/safety/controller 决定是否执行。",
      detail: "这张图把 VLA 放在 proposal policy，而不是 world model 内部。VLA 根据视觉、语言、本体和历史提出多个 action chunk、轨迹或技能；WM 对每个候选做反事实 rollout；critic/safety 根据成功率、接触、碰撞、进度和约束重排或拒绝；最后 controller 执行可落地动作，真实日志再回流改进 VLA、WM 和 critic。",
      deepDive: {
        summary: "机器人系统里 VLA 负责提案，WM 负责想象和校验。",
        sections: [
          {
            title: "先看什么",
            body: "先看 VLA 的位置：它读取视觉、语言、本体和历史，不是直接替代 world model，而是提出候选 action chunk、轨迹或技能。后面的 WM、critic 和 safety 才负责比较这些候选的后果。"
          },
          {
            title: "机制怎么跑",
            body: "VLA 先生成 K 个候选动作；world model 对每个候选做短程反事实 rollout，预测成功率、接触、碰撞、进度或风险；critic/reranker 给候选排序，safety filter 拒绝危险选项，controller 执行最终动作。"
          },
          {
            title: "为什么重要",
            body: "VLA 擅长语义泛化，但它不一定知道某个动作在当前物理状态下会不会撞、滑、卡住。WM 像慢速 System 2，能在执行前做后果检查，让机器人少用真机试错。"
          },
          {
            title: "容易误解",
            body: "不要把 WM 画成 VLA 后面的万能大脑，也不要把 VLA 画成只输出单步动作。真实系统通常是混合栈：VLA 提议，WM 想象，critic/safety 重排，低层控制器负责可执行性和全身稳定。"
          }
        ]
      },
      stages: [
        { label: "Multimodal Context", x: 24, y: 34, w: 270, h: 340 },
        { label: "Proposal + Rollout", x: 320, y: 34, w: 390, h: 340 },
        { label: "Rerank + Execute", x: 736, y: 34, w: 400, h: 340 }
      ],
      nodes: [
        { id: "obs", label: "Vision + State", note: "RGB-D, proprio", x: 52, y: 88, w: 135, h: 58, kind: "input" },
        { id: "goal", label: "Language Goal", note: "task intent", x: 52, y: 196, w: 135, h: 58, kind: "input" },
        { id: "hist", label: "History", note: "past obs/actions", x: 52, y: 300, w: 135, h: 58, kind: "state" },
        { id: "vla", label: "VLA Proposal", note: "semantic policy", x: 340, y: 150, w: 130, h: 68, kind: "policy" },
        { id: "cands", label: "K Candidates", note: "chunks / skills", x: 512, y: 150, w: 130, h: 68, kind: "action" },
        { id: "wm", label: "WM Rollout", note: "counterfactual", x: 512, y: 270, w: 130, h: 68, kind: "model" },
        { id: "future", label: "Imagined Outcomes", note: "success, contact, risk", x: 755, y: 270, w: 155, h: 68, kind: "future" },
        { id: "critic", label: "Critic / Reranker", note: "progress + value", x: 755, y: 82, w: 155, h: 62, kind: "score" },
        { id: "safety", label: "Safety Filter", note: "constraints", x: 755, y: 174, w: 155, h: 62, kind: "score" },
        { id: "selected", label: "Selected Action", note: "best safe option", x: 960, y: 150, w: 140, h: 68, kind: "action" },
        { id: "ctrl", label: "Controller", note: "tracking / whole-body", x: 960, y: 270, w: 140, h: 68, kind: "action" },
        { id: "logs", label: "Real Robot Logs", note: "success/failure", x: 340, y: 300, w: 130, h: 58, kind: "world" }
      ],
      edges: [
        { from: "obs", to: "vla", label: "perceive" },
        { from: "goal", to: "vla", label: "condition" },
        { from: "hist", to: "vla", label: "memory" },
        { from: "vla", to: "cands", label: "propose K" },
        { from: "cands", to: "wm", label: "simulate" },
        { from: "wm", to: "future", label: "predict" },
        { from: "future", to: "critic", label: "score" },
        { from: "future", to: "safety", label: "check risk" },
        { from: "critic", to: "selected", label: "rerank" },
        { from: "safety", to: "selected", label: "filter" },
        { from: "selected", to: "ctrl", label: "execute command" },
        { from: "ctrl", to: "logs", label: "real outcome" },
        { from: "logs", to: "vla", label: "fine-tune" },
        { from: "logs", to: "wm", label: "update WM" }
      ],
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
