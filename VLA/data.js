const vlaMapData = {
  meta: {
    title: "VLA Learning Map",
    subtitle: "Vision-Language-Action, World Models, WAM, and Whole-Body Robot Foundation Models",
    updated: "2026-05-28",
    note: "Public papers, official project pages, and official company blogs are mixed here. Items marked as blog/model-card should be treated as engineering signals, not peer-reviewed claims."
  },
  glossary: [
    {
      term: "VLA",
      meaning: "Vision-Language-Action model: maps observations and language goals to robot actions, often by adapting a VLM/LLM with action tokens, continuous action heads, diffusion, or flow matching."
    },
    {
      term: "WM",
      meaning: "World model: predicts future state, video, reward, value, or latent dynamics under candidate actions. It answers: if the robot does this, what happens?"
    },
    {
      term: "WAM",
      meaning: "World Action Model: jointly models world futures and actions, so the same generative model can imagine consequences and directly propose executable actions."
    },
    {
      term: "Action chunking",
      meaning: "Predicting a short horizon sequence of actions at once, usually to reduce compounding error, smooth execution, and support high-frequency control."
    },
    {
      term: "Embodiment",
      meaning: "The robot body and action interface: arms, hands, mobile base, humanoid torso, cameras, grippers, joint spaces, and control rate."
    }
  ],
  milestones: [
    { year: "2021", label: "CLIPort", lane: "affordance", note: "Language-conditioned spatial affordance becomes a strong manipulation recipe." },
    { year: "2022", label: "SayCan / RT-1 / ACT", lane: "foundation", note: "Language planning, large-scale robot transformers, and action chunking become central." },
    { year: "2023", label: "RT-2 / PaLM-E / Open X-Embodiment / Diffusion Policy", lane: "foundation", note: "Web-scale VLM knowledge meets robot actions; large robot mixtures become credible." },
    { year: "2024", label: "OpenVLA / Octo / DROID / RoboCasa / π0", lane: "open", note: "Open generalist policies and in-the-wild datasets make VLA reproducible." },
    { year: "2025", label: "π0.5 / FAST / Gemini Robotics / Figure Helix / GR00T N1", lane: "systems", note: "Long-horizon, whole-body, and company VLA systems become the frontier." },
    { year: "2026", label: "π0.7 / GR00T N1.7 / DreamZero", lane: "systems", note: "Steerable generalists, open humanoid checkpoints, and WAM-style policies reshape the map." }
  ],
  equations: [
    {
      title: "端到端 VLA",
      mathml: "<math display=\"block\"><mi>a</mi><mo>=</mo><msub><mi>f</mi><mi>θ</mi></msub><mo>(</mo><msub><mi>o</mi><mi>t</mi></msub><mo>,</mo><mi>l</mi><mo>,</mo><msub><mi>s</mi><mi>t</mi></msub><mo>)</mo></math>",
      explain: "最基础的 VLA 把当前观测、语言目标和机器人状态映射到动作。RT-2/OpenVLA 更偏 token 化，π0/GR00T 更偏连续动作生成。"
    },
    {
      title: "动作分块",
      mathml: "<math display=\"block\"><msub><mi>A</mi><mrow><mi>t</mi><mo>:</mo><mi>t</mi><mo>+</mo><mi>H</mi></mrow></msub><mo>=</mo><mo>{</mo><msub><mi>a</mi><mi>t</mi></msub><mo>,</mo><mo>…</mo><mo>,</mo><msub><mi>a</mi><mrow><mi>t</mi><mo>+</mo><mi>H</mi></mrow></msub><mo>}</mo></math>",
      explain: "ACT、Diffusion Policy、π0 等常一次预测未来 H 步动作。它能提高平滑性和吞吐，但需要处理 chunk 切换与实时纠错。"
    },
    {
      title: "世界模型",
      mathml: "<math display=\"block\"><msub><mi>z</mi><mrow><mi>t</mi><mo>+</mo><mn>1</mn></mrow></msub><mo>∼</mo><msub><mi>p</mi><mi>φ</mi></msub><mo>(</mo><msub><mi>z</mi><mi>t</mi></msub><mo>,</mo><msub><mi>a</mi><mi>t</mi></msub><mo>)</mo></math>",
      explain: "WM 学的是动作条件动态：如果在当前 latent/world state 下执行动作，未来会怎样。Dreamer、TD-MPC、Visual Foresight 都在这个家族。"
    },
    {
      title: "VLA + WM 重排",
      mathml: "<math display=\"block\"><msup><mi>a</mi><mo>*</mo></msup><mo>=</mo><munder><mi>argmax</mi><mi>a</mi></munder><mrow><mo>[</mo><mi>V</mi><mo>(</mo><mtext>rollout</mtext><mo>(</mo><mi>a</mi><mo>)</mo><mo>)</mo><mo>−</mo><mi>λ</mi><mi>R</mi><mo>(</mo><mi>a</mi><mo>)</mo><mo>]</mo></mrow></math>",
      explain: "实际系统可能让 VLA 生成候选动作，再用世界模型 rollout 和 critic/safety cost 重排，兼顾成功率和风险。"
    },
    {
      title: "WAM 联合建模",
      mathml: "<math display=\"block\"><mi>p</mi><mo>(</mo><msub><mi>A</mi><mrow><mi>t</mi><mo>:</mo><mi>T</mi></mrow></msub><mo>,</mo><msub><mi>O</mi><mrow><mi>t</mi><mo>:</mo><mi>T</mi></mrow></msub><mo>|</mo><msub><mi>O</mi><mrow><mn>0</mn><mo>:</mo><mi>t</mi></mrow></msub><mo>,</mo><mi>l</mi><mo>)</mo></math>",
      explain: "WAM 不只预测未来，也联合生成动作与未来观测。DreamZero 这类工作把世界模型直接推向 zero-shot policy。"
    },
    {
      title: "数据混合目标",
      mathml: "<math display=\"block\"><mi>L</mi><mo>=</mo><munder><mo>∑</mo><mi>e</mi></munder><msub><mi>w</mi><mi>e</mi></msub><msub><mi>L</mi><mi>e</mi></msub><mo>+</mo><mi>β</mi><msub><mi>L</mi><mtext>web</mtext></msub><mo>+</mo><mi>γ</mi><msub><mi>L</mi><mtext>aux</mtext></msub></math>",
      explain: "Open X、π0.5、GR00T 等都在做数据配方：不同 embodiment 的机器人 loss、web 多模态 loss 和辅助任务 loss 要平衡。"
    }
  ],
  paradigms: [
    {
      name: "Action-as-token",
      examples: "RT-2, OpenVLA, FAST, NORA",
      strength: "容易接入 LLM/VLM 训练范式，扩展和微调简单。",
      caution: "离散化会损失精度，自回归推理可能慢，高频灵巧控制要小心。"
    },
    {
      name: "Diffusion / Flow action",
      examples: "Diffusion Policy, π0, RDT, GR00T",
      strength: "连续、多峰、chunked 动作建模强，适合精细操作。",
      caution: "训练和推理成本高，实时部署需要 action expert、少步采样或蒸馏。"
    },
    {
      name: "Generalist open policy",
      examples: "OpenVLA, Octo, SmolVLA, StarVLA",
      strength: "适合复现、fine-tune、基准比较和理解设计 trade-off。",
      caution: "通常缺少公司级私有数据和真实部署闭环。"
    },
    {
      name: "Whole-body humanoid VLA",
      examples: "Figure Helix, GR00T, Gemini Robotics, Agility stack",
      strength: "直接面对未来通用机器人系统问题：全身、双手、导航、协作。",
      caution: "证据多来自官方 demo/blog，必须区分论文、model card、closed demo。"
    },
    {
      name: "WM / WAM hybrid",
      examples: "Dreamer, UniSim, Genie 2, DreamZero",
      strength: "提供反事实想象、规划、重排和安全评估能力。",
      caution: "生成质量不等于控制可用性，关键是 action-controllable 和实时闭环。"
    },
    {
      name: "Agentic planner + VLA",
      examples: "SayCan, PaLM-E, VoxPoser, Gemini Robotics 1.5",
      strength: "适合长程任务，把高层推理、工具调用、空间约束和低层执行分层。",
      caution: "接口和安全边界复杂，需要明确技能可供性、状态反馈和失败恢复。"
    }
  ],
  architectureDiagrams: [
    {
      title: "End-to-End VLA 基础架构",
      kicker: "从像素到动作",
      nodes: [
        {
          id: "observations",
          label: "观测与状态",
          detail: "RGB / wrist camera / depth / tactile / proprioception 进入同一 episode schema。"
        },
        {
          id: "instruction",
          label: "语言与任务上下文",
          detail: "自然语言、子任务、metadata、visual goal 或历史记忆提供意图。"
        },
        {
          id: "backbone",
          label: "VLM / Robot Backbone",
          detail: "视觉编码器、LLM/VLM、robot state projector 融合语义和场景。"
        },
        {
          id: "action-head",
          label: "动作头",
          detail: "token action、continuous regression、diffusion 或 flow action expert。"
        },
        {
          id: "robot-loop",
          label: "控制闭环",
          detail: "动作 chunk 进入低层控制器，执行后把新观测写回下一步。"
        }
      ],
      edges: [
        { from: "observations", to: "backbone", label: "视觉/状态 token" },
        { from: "instruction", to: "backbone", label: "任务条件" },
        { from: "backbone", to: "action-head", label: "语义到控制" },
        { from: "action-head", to: "robot-loop", label: "动作 chunk" },
        { from: "robot-loop", to: "observations", label: "反馈" }
      ],
      takeaway: "先抓住这条主线：VLA 不是一个聊天模型加机械臂，而是把观测、语言、状态和动作接口共同训练成闭环策略。"
    },
    {
      title: "动作表示：Token、Diffusion、Flow 的分叉",
      kicker: "动作接口",
      nodes: [
        {
          id: "trajectory",
          label: "连续轨迹",
          detail: "原始动作通常是 delta pose、joint、gripper、base velocity 或 finger command。"
        },
        {
          id: "tokenizer",
          label: "离散化 / 压缩",
          detail: "RT-2/OpenVLA 把动作写成 token；FAST 把动作序列看成时序压缩问题。"
        },
        {
          id: "generative-head",
          label: "生成式动作头",
          detail: "Diffusion/flow 直接生成连续多步动作，适合多峰和高频精细控制。"
        },
        {
          id: "chunk-buffer",
          label: "Action Chunk Buffer",
          detail: "一次预测 H 步动作，用 receding horizon 或 smoothing 降低抖动。"
        },
        {
          id: "controller",
          label: "低层控制器",
          detail: "把模型动作转成机器人可执行的 joint/EEF/hand/base command。"
        }
      ],
      edges: [
        { from: "trajectory", to: "tokenizer", label: "action-as-language" },
        { from: "trajectory", to: "generative-head", label: "continuous action" },
        { from: "tokenizer", to: "chunk-buffer", label: "decode" },
        { from: "generative-head", to: "chunk-buffer", label: "sample" },
        { from: "chunk-buffer", to: "controller", label: "execute" }
      ],
      takeaway: "动作表示决定可学习性和部署延迟：token 友好但可能粗，diffusion/flow 精细但要优化实时推理。"
    },
    {
      title: "VLA + WM / WAM 混合架构",
      kicker: "想象与重排",
      nodes: [
        {
          id: "history",
          label: "当前历史",
          detail: "观测、语言、状态、近期动作和记忆组成可供预测的上下文。"
        },
        {
          id: "vla-proposals",
          label: "VLA 候选动作",
          detail: "反应式策略给出若干 action chunk 或高层子目标。"
        },
        {
          id: "wm-rollout",
          label: "World Model Rollout",
          detail: "在 latent 或 video 空间预测执行这些动作之后会发生什么。"
        },
        {
          id: "critic",
          label: "Critic / Safety Rerank",
          detail: "用成功概率、碰撞风险、约束满足度对候选进行重排。"
        },
        {
          id: "wam-policy",
          label: "WAM 联合生成",
          detail: "DreamZero 类模型同时生成未来视频和动作，把世界模型推向可执行策略。"
        },
        {
          id: "execute",
          label: "执行与数据回流",
          detail: "执行最优候选，并把失败、纠错和 rollout 误差回流到数据飞轮。"
        }
      ],
      edges: [
        { from: "history", to: "vla-proposals", label: "propose" },
        { from: "vla-proposals", to: "wm-rollout", label: "imagine" },
        { from: "wm-rollout", to: "critic", label: "score" },
        { from: "history", to: "wam-policy", label: "joint model" },
        { from: "critic", to: "execute", label: "select" },
        { from: "wam-policy", to: "execute", label: "direct act" }
      ],
      takeaway: "WM/WAM 的价值不是替代 VLA，而是让机器人先想象后果，再把候选动作变得更可验证、更安全。"
    },
    {
      title: "Whole-Body Humanoid VLA Stack",
      kicker: "人形全身",
      nodes: [
        {
          id: "er-planner",
          label: "Embodied Reasoner",
          detail: "长程任务分解、空间记忆、工具调用、失败恢复和多机器人协作。"
        },
        {
          id: "vla-policy",
          label: "VLA Policy",
          detail: "把视觉、语言和 proprioception 映射到上身/手/移动底盘动作。"
        },
        {
          id: "whole-body-control",
          label: "Whole-Body Controller",
          detail: "平衡、碰撞、关节限制、接触稳定和时延补偿。"
        },
        {
          id: "hands-base",
          label: "Hands / Base / Head",
          detail: "灵巧手、腕、躯干、头部 gaze 和移动底盘协同执行。"
        },
        {
          id: "safety",
          label: "Safety Monitor",
          detail: "力控边界、急停、任务终止、自检和人机共处约束。"
        }
      ],
      edges: [
        { from: "er-planner", to: "vla-policy", label: "subgoal" },
        { from: "vla-policy", to: "whole-body-control", label: "continuous command" },
        { from: "whole-body-control", to: "hands-base", label: "stabilize" },
        { from: "hands-base", to: "vla-policy", label: "sensor feedback" },
        { from: "safety", to: "whole-body-control", label: "guardrail" }
      ],
      takeaway: "人形 VLA 的难点在系统耦合：语言泛化只是入口，真正要同时处理全身平衡、双手接触、空间导航和安全闭环。"
    },
    {
      title: "机器人数据飞轮",
      kicker: "数据层",
      nodes: [
        {
          id: "sources",
          label: "数据来源",
          detail: "遥操、仿真、MimicGen、human video、部署日志和自动探索数据。"
        },
        {
          id: "alignment",
          label: "Schema / Retarget",
          detail: "统一 observation、state、action、language、metadata 与 embodiment 描述。"
        },
        {
          id: "train",
          label: "Pretrain / SFT / RL",
          detail: "跨 embodiment 预训练，任务后训练，失败纠错和 RL/偏好优化。"
        },
        {
          id: "eval",
          label: "评测与部署",
          detail: "LIBERO、DROID、SimplerEnv、真机任务和长程成功率一起看。"
        },
        {
          id: "mine",
          label: "失败挖掘",
          detail: "把 OOD 场景、接触失败、语言误解、恢复轨迹重新标注入库。"
        }
      ],
      edges: [
        { from: "sources", to: "alignment", label: "curate" },
        { from: "alignment", to: "train", label: "mix" },
        { from: "train", to: "eval", label: "deploy" },
        { from: "eval", to: "mine", label: "inspect" },
        { from: "mine", to: "sources", label: "collect again" }
      ],
      takeaway: "公司级 VLA 的护城河往往是数据飞轮：真实部署越多，失败越可挖，下一版模型越能覆盖长尾。"
    }
  ],
  paperFigureGuides: [
    {
      title: "RT-2：把动作当作另一种语言",
      sourceTitle: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
      sourceUrl: "https://robotics-transformer2.github.io/",
      imageUrl: "https://robotics-transformer2.github.io/img/fig2.png",
      originalFigure: "项目页 Approach Overview / 论文核心图：看 image + prompt 如何进入 VLM，并把 action token de-tokenize 成机器人动作。",
      simplified: [
        "输入当前图像和问题模板：What should the robot do to <task>?",
        "把机器人动作离散成类似文本的 token 序列。",
        "VLM 在 web VQA 数据和 robot action 数据上 co-fine-tune。",
        "推理时把输出 token 反解成 delta translation、rotation 和 gripper command。"
      ],
      watchFor: "关键不是图里的大模型名字，而是 action-as-language 让 web-scale VLM 训练范式直接接上机器人控制。"
    },
    {
      title: "OpenVLA：开源 VLM 到动作 token 的基线",
      sourceTitle: "OpenVLA: An Open-Source Vision-Language-Action Model",
      sourceUrl: "https://openvla.github.io/",
      imageUrl: "https://openvla.github.io/static/images/openvla_model.jpg",
      originalFigure: "项目页 The OpenVLA Model / 论文模型架构图：DINOv2 + SigLIP、MLP projector、Llama 2 7B 和 Action De-Tokenizer。",
      simplified: [
        "多视角/单视角图像进入 DINOv2 与 SigLIP 融合视觉编码器。",
        "MLP projector 把视觉 embedding 对齐到 LLM token 空间。",
        "Llama 2 7B 自回归预测离散动作 token。",
        "Action de-tokenizer 还原 7D robot action 并直接执行。"
      ],
      watchFor: "OpenVLA 的学习价值在开源复现：它牺牲一些精细动作能力，换来清晰、可 fine-tune 的 VLA baseline。"
    },
    {
      title: "Octo：通用策略 + Diffusion Action Head",
      sourceTitle: "Octo: An Open-Source Generalist Robot Policy",
      sourceUrl: "https://octo-models.github.io/",
      imageUrl: "https://octo-models.github.io/architecture.jpg",
      originalFigure: "项目页 The Model / 论文 model architecture 图：task tokens、observation tokens、Octo Transformer、readout token 和 action head。",
      simplified: [
        "语言或 goal image 变成 task tokens，历史图像和 state 变成 observation tokens。",
        "Octo Transformer 在多数据集 robot episodes 上预训练共享表征。",
        "Readout token 连接 diffusion action head，输出多模态连续动作分布。",
        "Fine-tuning 时可替换 observation 或 action space，保留通用 backbone。"
      ],
      watchFor: "Octo 是理解 observation/task/action 接口可插拔性的好图：它比单一动作 token 路线更像通用 robot policy 框架。"
    },
    {
      title: "π0 / OpenPI：VLM Backbone + Flow Action Expert",
      sourceTitle: "π0: A Vision-Language-Action Flow Model for General Robot Control",
      sourceUrl: "https://www.pi.website/blog/pi0",
      originalFigure: "官方 blog 的 cross-embodiment training 图和 π0 论文 overview/framework 图：重点看 pre-trained VLM、cross-embodiment data 与 Action Expert。",
      simplified: [
        "从预训练 VLM 继承视觉语义和语言理解。",
        "把多机器人、多任务、灵巧操作数据混合进同一个策略。",
        "新增 continuous Action Expert，用 flow matching 生成高频动作 chunk。",
        "再用高质量任务数据 post-train，覆盖洗衣、收桌、装盒等长程任务。"
      ],
      watchFor: "π0 系列的范式转折是把语义 backbone 和连续动作专家分工，而不是把所有动作都塞进离散 token。"
    },
    {
      title: "FAST：把连续动作序列压缩成高效 token",
      sourceTitle: "FAST: Efficient Action Tokenization for Vision-Language-Action Models",
      sourceUrl: "https://arxiv.org/abs/2501.09747",
      originalFigure: "论文的 FAST tokenizer 图：重点看动作 chunk 如何经过频域/量化/BPE 式压缩，再接入 next-token prediction。",
      simplified: [
        "先把一段连续动作 chunk 当作多维时间序列。",
        "用频域变换压缩主要运动模式，减少高频冗余。",
        "量化并合并成更短的离散 action tokens。",
        "让自回归 VLA 以更少 token 预测长动作序列，兼顾效率和精度。"
      ],
      watchFor: "FAST 是 token 路线和连续控制之间的桥：它承认动作是连续时序，但仍想吃到 LLM next-token training 的规模化红利。"
    },
    {
      title: "GR00T N1/N1.7：System 2 语义 + System 1 动作生成",
      sourceTitle: "NVIDIA Isaac GR00T N1 Technical Blog / GR00T N1.7 Model Card",
      sourceUrl: "https://developer.nvidia.com/blog/accelerate-generalist-humanoid-robot-development-with-nvidia-isaac-gr00t-n1/",
      imageUrl: "https://developer-blogs.nvidia.com/wp-content/uploads/2025/03/gr00t-n1-model-architecture-1024x576.png",
      originalFigure: "NVIDIA 技术博客 Figure 2：传感器/文本 token 进入 VLM System 2，再由 Diffusion Transformer System 1 生成 humanoid action。",
      simplified: [
        "传感器图像、文本指令和 proprioception 编码成多模态 tokens。",
        "VLM/System 2 负责语义理解、场景 grounding 和动作计划表征。",
        "Diffusion/flow action transformer/System 1 条件在这些表征上生成动作 chunk。",
        "N1.7 进一步以 Cosmos-Reason2 等 backbone 和开源 post-training 入口面向 humanoid。"
      ],
      watchFor: "GR00T 图要和 Figure Helix 一起看：两者都在做快慢系统，但公开程度、数据来源和 action 模块细节不同。"
    },
    {
      title: "DreamZero：WAM 同时预测未来视频和动作",
      sourceTitle: "DreamZero: World Action Models are Zero-shot Policies",
      sourceUrl: "https://dreamzero0.github.io/",
      imageUrl: "https://dreamzero0.github.io/images/project_overview.png",
      originalFigure: "项目页 DreamZero Method Overview / 论文总览图：看 World Action Model 如何用 video、language、proprio 联合生成 future videos 与 continuous actions。",
      simplified: [
        "输入历史视频、语言指令和 proprioception，而不是只输入当前帧。",
        "视频 diffusion backbone 学习物理世界如何随动作演化。",
        "模型联合预测未来观测和连续动作，把 world modeling 变成 policy。",
        "通过系统优化把大视频模型压到实时闭环控制。"
      ],
      watchFor: "WAM 的核心判断题是：未来视频是否足够 action-controllable。只有能闭环执行，才不只是漂亮的生成模型。"
    },
    {
      title: "Figure Helix：高频上身控制的快慢系统",
      sourceTitle: "Helix: A Vision-Language-Action Model for Generalist Humanoid Control",
      sourceUrl: "https://www.figure.ai/news/helix",
      originalFigure: "官方 blog 的 System 1 / System 2 架构段落与多机器人协作视频：重点看 S2 低频语义 latent 如何喂给 S1 高频 visuomotor policy。",
      simplified: [
        "S2 是 onboard VLM，以较低频率理解场景、语言和任务语义。",
        "S1 是快速 visuomotor transformer，以高频率输出上身、手和头/躯干控制。",
        "S2 通过 latent vector 给 S1 条件，二者端到端训练但部署时异步运行。",
        "同一组权重可驱动两个机器人协作完成长程家务任务。"
      ],
      watchFor: "Helix 的学习点不是论文 benchmark，而是工业系统如何为高维 humanoid action space 处理实时性和协作。"
    }
  ],
  readingPath: [
    {
      phase: "Phase 1",
      title: "建立共同语言",
      goal: "知道 VLA 到底在学什么：数据、动作、模型、评测不是四个 appendix，而是同一个系统。",
      read: ["RT-1", "RT-2", "Open X-Embodiment", "Diffusion Policy", "ACT"],
      output: "能画出 image/language/state -> action chunk 的基本 pipeline。"
    },
    {
      phase: "Phase 2",
      title: "看开源通用策略",
      goal: "理解 OpenVLA、Octo、SmolVLA、LeRobot 这些为什么能复现，也理解它们离公司级系统差在哪里。",
      read: ["OpenVLA", "Octo", "SmolVLA", "DROID", "LIBERO", "SimplerEnv"],
      output: "能比较 token action、continuous action、diffusion/flow、action chunk 的 trade-off。"
    },
    {
      phase: "Phase 3",
      title: "研究 PI 范式",
      goal: "把 π0 -> FAST -> π0.5 -> π0.6 -> π*0.6 -> π0.7 当成一条主线学。",
      read: ["π0", "FAST", "π0.5", "Knowledge Insulation", "π*0.6", "π0.7"],
      output: "能解释为什么数据异构共训练、动作专家、记忆、RL 后训练会一起出现。"
    },
    {
      phase: "Phase 4",
      title: "进入全身人形",
      goal: "理解 Figure Helix、GR00T、Gemini Robotics 为什么不只是机械臂 VLA 的放大版。",
      read: ["Figure Helix", "GR00T N1", "GR00T N1.7", "Gemini Robotics", "Gemini Robotics 1.5"],
      output: "能拆出上身/手/导航/全身平衡/多机器人协作各自需要的模型层。"
    },
    {
      phase: "Phase 5",
      title: "补上 WM/WAM",
      goal: "从端到端反应式策略转向可想象、可验证、可规划的策略。",
      read: ["World Models", "DreamerV3", "UniSim", "Genie 2", "DreamZero"],
      output: "能设计一个 VLA + WM critic + WAM policy 的混合系统。"
    }
  ],
  routes: [
    {
      id: "data-engine",
      title: "数据层与数据引擎",
      question: "VLA 的上限首先由数据决定：机器人数据从哪里来、怎样跨 embodiment 对齐、怎样从人类/仿真/遥操扩展？",
      takeaway: "数据层不是后台工程，而是 VLA 的第一性问题。Open X-Embodiment 证明混合机器人数据可行，DROID/BridgeData 证明 in-the-wild 重要，LeRobot/RoboCasa/MimicGen 则让数据飞轮更可复现。",
      priority: "先读",
      branches: [
        "多机器人数据混合：把不同机器人、相机、控制频率、任务语义合到一个训练配方里。",
        "遥操与人类演示：ALOHA、DROID、BridgeData、RoboSet 代表真实世界动作数据来源。",
        "仿真与合成数据：RoboCasa、MimicGen、ManiSkill、RoboTwin 用程序化场景和 demo 扩展覆盖。",
        "动作归一化与 retarget：把不同 embodiment 的状态/action 对齐成可学习接口。",
        "数据飞轮：部署、失败收集、人工纠正、再训练，正在成为公司 VLA 的核心壁垒。"
      ],
      patterns: [
        "先统一 episode schema：observations, states, actions, language, metadata。",
        "动作空间必须保留 embodiment 信息，不能假装所有机器人共用同一关节语义。",
        "长程任务需要 subtask labels、成功/失败标签和环境 metadata，不只是更多轨迹。"
      ],
      references: [
        {
          title: "Open X-Embodiment: Robotic Learning Datasets and RT-X Models",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2310.08864",
          value: "把跨实验室、跨机器人的数据混合推到通用策略训练中心。"
        },
        {
          title: "DROID: A Large-Scale In-The-Wild Robot Manipulation Dataset",
          year: "2024",
          type: "paper",
          url: "https://arxiv.org/abs/2403.12945",
          value: "强调真实家庭/办公环境、多样操作者和真实分布的机器人数据。"
        },
        {
          title: "BridgeData V2",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2308.12952",
          value: "早期大规模真实机器人数据集，支撑多任务语言条件 manipulation。"
        },
        {
          title: "RoboSet",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2304.07709",
          value: "Dexterous manipulation 数据集，提醒 VLA 不能只看夹爪抓放。"
        },
        {
          title: "ALOHA: Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2304.13705",
          value: "低成本双臂遥操和 action chunking 的关键来源之一。"
        },
        {
          title: "MimicGen",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2310.17596",
          value: "从少量人类 demo 自动生成大量仿真 demonstration。"
        },
        {
          title: "RoboCasa",
          year: "2024",
          type: "paper",
          url: "https://arxiv.org/abs/2406.02523",
          value: "面向日常家庭任务的大规模仿真 benchmark 和数据生成平台。"
        },
        {
          title: "LeRobot",
          year: "2024",
          type: "project",
          url: "https://github.com/huggingface/lerobot",
          value: "开源机器人学习栈，统一数据、策略、训练和真实机器人部署入口。"
        }
      ]
    },
    {
      id: "action-representation",
      title: "动作表示与低层策略",
      question: "动作到底是 token、连续向量、trajectory chunk、diffusion sample，还是 flow 生成？这个选择决定了模型能不能精细、实时、稳定。",
      takeaway: "动作表示是 VLA 的地基。RT-2/OpenVLA 的 action token 容易接 LLM，Diffusion Policy/ACT/pi0 的连续 chunk 更适合高频灵巧控制，FAST 试图把两边接起来。",
      priority: "先读",
      branches: [
        "离散 token action：把机器人动作离散化成语言模型可预测的 token。",
        "连续 action head：直接回归或生成 delta pose/joint/gripper。",
        "Action chunking：一次生成多个未来控制步，降低闭环延迟和抖动。",
        "Diffusion policy：把多模态动作分布当作去噪过程生成。",
        "Flow matching/action expert：连续动作专家与 VLM backbone 分工，代表是 PI π0 系列。"
      ],
      patterns: [
        "高层语义动作可以 token 化，低层精细控制通常需要连续高频建模。",
        "chunk 越长，推理延迟越可控，但纠错响应越慢，需要 real-time chunking 或 receding horizon。",
        "动作归一化和相机/state 对齐常常比模型结构更影响结果。"
      ],
      references: [
        {
          title: "RT-1: Robotics Transformer for Real-World Control at Scale",
          year: "2022",
          type: "paper",
          url: "https://arxiv.org/abs/2212.06817",
          value: "把大规模真实机器人 imitation 和 transformer policy 系统化。"
        },
        {
          title: "ACT: Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2304.13705",
          value: "Action Chunking Transformer 成为双臂精细操作的基础配方。"
        },
        {
          title: "Diffusion Policy",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2303.04137",
          value: "用 diffusion 建模复杂、多峰、连续 visuomotor actions。"
        },
        {
          title: "Behavior Transformers",
          year: "2022",
          type: "paper",
          url: "https://arxiv.org/abs/2206.11251",
          value: "将离散 mode selection 与连续控制结合，处理多模态行为克隆。"
        },
        {
          title: "FAST: Efficient Action Tokenization for VLA Models",
          year: "2025",
          type: "paper",
          url: "https://arxiv.org/abs/2501.09747",
          value: "用 DCT、量化和 BPE 把连续动作 chunk 压成适合自回归训练的 token。"
        },
        {
          title: "Real-Time Action Chunking",
          year: "2025",
          type: "blog",
          url: "https://www.pi.website/research/real_time_chunking?curius=2011",
          value: "PI 对 chunk 延迟、实时切换和闭环执行问题的工程解法。"
        }
      ]
    },
    {
      id: "generalist-vla",
      title: "通用 VLA 主干",
      question: "怎样把 VLM/LLM 的视觉语言知识变成可执行机器人策略？",
      takeaway: "这条线从 RT-2 到 OpenVLA、Octo、SmolVLA、RDT、GR-2。核心差异不只是模型大小，而是 action interface、数据混合、开源程度和是否面向真实机器人部署。",
      priority: "先读",
      branches: [
        "VLM-to-action token：RT-2/OpenVLA 把动作当成文本 token 或离散输出。",
        "Open-source generalist policy：Octo/OpenVLA/SmolVLA 把复现、fine-tune、部署变成主问题。",
        "Diffusion transformer VLA：RDT/GR00T 类用 DiT 或 flow 生成连续动作。",
        "Video-language-action：GR-1/GR-2/RoboFlamingo 借助视频生成或多模态预训练。",
        "小模型与边缘部署：SmolVLA、On-device VLA 代表低延迟方向。"
      ],
      patterns: [
        "VLM backbone 提供语义泛化，但动作头决定能不能真的动。",
        "开源模型常强在研究复现，公司模型常强在数据闭环和系统集成。",
        "评估必须拆成语言泛化、物体泛化、环境泛化、动作精度和长程成功率。"
      ],
      references: [
        {
          title: "RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2307.15818",
          value: "把 web-scale VLM 知识迁移到机器人控制，是现代 VLA 的标志性论文。"
        },
        {
          title: "OpenVLA: An Open-Source Vision-Language-Action Model",
          year: "2024",
          type: "paper",
          url: "https://arxiv.org/abs/2406.09246",
          value: "开源 7B VLA，成为很多后续 fine-tune、OFT 和机器人策略研究基线。"
        },
        {
          title: "Octo: An Open-Source Generalist Robot Policy",
          year: "2024",
          type: "paper",
          url: "https://arxiv.org/abs/2405.12213",
          value: "强调开放通用策略、跨任务/机器人数据和可复现训练。"
        },
        {
          title: "SmolVLA",
          year: "2025",
          type: "project",
          url: "https://huggingface.co/blog/smolvla",
          value: "面向 LeRobot 社区数据和高效部署的小型 VLA 路线。"
        },
        {
          title: "RDT-1B: Robotics Diffusion Transformer",
          year: "2024",
          type: "paper",
          url: "https://arxiv.org/abs/2410.07864",
          value: "用 diffusion transformer 做大型机器人动作生成，连接 VLA 与 DiT。"
        },
        {
          title: "GR-2: A Generative Video-Language-Action Model",
          year: "2024",
          type: "paper",
          url: "https://arxiv.org/abs/2410.06158",
          value: "把视频生成、语言和动作联合起来，体现 VLA 与生成式世界建模的合流。"
        },
        {
          title: "RoboFlamingo",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2311.01378",
          value: "把 Flamingo 式视觉语言模型迁移到长程机器人操作。"
        },
        {
          title: "OpenVLA-OFT",
          year: "2025",
          type: "project",
          url: "https://github.com/moojink/openvla-oft",
          value: "围绕 OpenVLA 的 fine-tuning 和动作表示改造，是学习开源 VLA 的实用入口。"
        }
      ]
    },
    {
      id: "physical-intelligence",
      title: "Physical Intelligence π 系列",
      question: "PI 为什么被很多人当成 VLA 的新主线？因为它把通用策略、动作专家、异构数据、RL 后训练、记忆和 steerability 放成一条工程路线。",
      takeaway: "π0 是 VLM + flow action expert；FAST 让动作 token 化更高效；π0.5 引入异构共训练和长程 open-world；π0.6/π*0.6 加入 KI 与 RL；π0.7 强调可控 generalist。",
      priority: "重点",
      branches: [
        "π0：PaliGemma-like VLM backbone + continuous action expert + flow matching。",
        "FAST：频域压缩动作 chunk，让 VLA 可用 next-token prediction 学动作。",
        "π0.5：高层 subtask + 低层 action expert，共训练 robot/web/object/subtask 数据。",
        "π0.6 / Knowledge Insulation：分离 backbone 语义学习与 action expert 连续控制梯度。",
        "π*0.6 / RECAP：用真实 rollout、纠正和 advantage-conditioned policy 做后训练。",
        "π0.7 / pi0.7：语言、metadata、control modality、visual subgoal 共同 steer generalist policy。"
      ],
      patterns: [
        "PI 的重点不是某个模型名，而是从 pretrain 到 post-train 到 deployment 的闭环。",
        "低层动作专家与高层语义 backbone 的分工，是比纯 token action 更适合灵巧任务的假设。",
        "版本越新，越强调可控性、长记忆、人类视频、跨 embodiment 和任务质量 metadata。"
      ],
      references: [
        {
          title: "π0: Our First Generalist Policy",
          year: "2024",
          type: "blog",
          url: "https://www.pi.website/blog/pi0",
          value: "PI 公开的第一代 generalist robot policy，建立 flow action expert 方向。"
        },
        {
          title: "π0 Technical Report",
          year: "2024",
          type: "paper",
          url: "https://www.pi.website/download/pi0.pdf",
          value: "包含 π0 数据、动作 chunk、模型结构和多机器人训练细节。"
        },
        {
          title: "Open Sourcing π0",
          year: "2025",
          type: "project",
          url: "https://www.pi.website/blog/openpi",
          value: "openpi 让 π0/π0-FAST fine-tuning 成为可操作学习路线。"
        },
        {
          title: "π0.5: a VLA with Open-World Generalization",
          year: "2025",
          type: "paper",
          url: "https://arxiv.org/abs/2504.16054",
          value: "展示异构共训练、高层 subtask 与长程家庭任务泛化。"
        },
        {
          title: "Knowledge Insulation",
          year: "2025",
          type: "blog",
          url: "https://www.pi.website/research/knowledge_insulation",
          value: "解释如何让 VLA train fast、run fast 且减少动作学习污染语义 backbone。"
        },
        {
          title: "π0.6 Model Card",
          year: "2026",
          type: "model-card",
          url: "https://website.pi-asset.com/pi06star/PI06_model_card.pdf",
          value: "公开 π0.6 的 Gemma3 backbone、action expert、metadata conditioning 等线索。"
        },
        {
          title: "π*0.6 / RECAP",
          year: "2026",
          type: "paper",
          url: "https://www.pi.website/download/pistar06.pdf",
          value: "展示用 autonomous rollout、teleop intervention 和 advantage conditioning 做 VLA RL 后训练。"
        },
        {
          title: "π0.7 / pi0.7: A Steerable Generalist Model",
          year: "2026",
          type: "blog",
          url: "https://www.pi.website/blog/pi07",
          value: "最新 PI blog，强调可通过多模态 prompt 控制动作风格、质量、速度和目标。"
        },
        {
          title: "VLAs with Long and Short-Term Memory",
          year: "2026",
          type: "blog",
          url: "https://www.pi.website/research/memory",
          value: "把短期视频记忆和长期文本记忆引入 VLA 长程任务。"
        }
      ]
    },
    {
      id: "humanoid-wholebody",
      title: "全身/人形 VLA 系统",
      question: "机械臂 VLA 放到人形机器人上，为什么会变成一个新问题？因为全身平衡、双手、躯干、导航、实时安全和多机器人协作必须一起解决。",
      takeaway: "Figure Helix、GR00T、Gemini Robotics、Agility/Digit、Optimus 是学习人形 VLA 的系统样本。重点看公开证据：谁有论文/权重，谁只有 blog/demo，谁其实是 low-level whole-body control 而非 VLA。",
      priority: "重点",
      branches: [
        "全上身 VLA：Figure Helix 直接控制手腕、躯干、头部和手指，并展示多机器人协作。",
        "开放人形 foundation model：GR00T N1/N1.5/N1.6/N1.7 逐步加入 FLARE、world model、sim-to-real 和开放权重。",
        "Agentic stack：Gemini Robotics-ER 做高层 embodied reasoning，Gemini Robotics VLA 做动作。",
        "底层 whole-body motor cortex：Agility/Digit 更接近 RL 训练的低层全身控制，可接 VLA/LLM 上层。",
        "产业 demo 与证据等级：Tesla/Optimus 值得观察，但公开 VLA 技术材料少，需要谨慎标注。"
      ],
      patterns: [
        "人形不是多一个腿的问题，而是动作空间、失稳风险、接触丰富度和任务时间尺度同时增加。",
        "公司路线常把 VLA、whole-body RL、SLAM/3D perception、安全监控、遥操数据飞轮绑在一起。",
        "看 demo 时要问：是否单一模型、是否 onboard、是否 teleop、是否 task-specific data、是否公开 benchmark。"
      ],
      references: [
        {
          title: "Figure Helix",
          year: "2025",
          type: "blog",
          url: "https://www.figure.ai/news/helix?_bhlid=b8b2b559cbd15863672a12df457ee8a00d3dd03c",
          value: "Figure 官方发布的 humanoid VLA，展示上半身控制、双机器人协作和长程家庭任务。"
        },
        {
          title: "Figure Helix Logistics",
          year: "2025",
          type: "blog",
          url: "https://www.figure.ai/news/helix-logistics",
          value: "展示物流任务中少量 demonstration、双目视觉和系统迭代线索。"
        },
        {
          title: "GR00T N1: Open Foundation Model for Humanoid Robots",
          year: "2025",
          type: "paper",
          url: "https://arxiv.org/abs/2503.14734",
          value: "NVIDIA 的开放人形机器人 foundation model 起点。"
        },
        {
          title: "GR00T N1.5",
          year: "2025",
          type: "project",
          url: "https://research.nvidia.com/labs/gear/gr00t-n1_5/",
          value: "引入 FLARE、human video 学习和更强跨任务泛化。"
        },
        {
          title: "GR00T N1.6 Sim-to-Real Workflow",
          year: "2026",
          type: "blog",
          url: "https://developer.nvidia.com/blog/building-generalist-humanoid-capabilities-with-nvidia-isaac-gr00t-n1-6-using-a-sim-to-real-workflow/",
          value: "NVIDIA 官方工程 blog 展示的 sim-to-real 系统信号，涉及 VLA、world model、whole-body RL、SLAM 和仿真数据工程。"
        },
        {
          title: "GR00T N1.7 Model Card",
          year: "2026",
          type: "model-card",
          url: "https://huggingface.co/nvidia/GR00T-N1.7-3B",
          value: "NVIDIA 开放的 N1.7 early access 权重/模型卡，值得跟踪实测。"
        },
        {
          title: "Gemini Robotics",
          year: "2025",
          type: "paper",
          url: "https://arxiv.org/abs/2503.20020",
          value: "Google Gemini 2.0-based VLA，将 physical actions 加为输出模态。"
        },
        {
          title: "Gemini Robotics 1.5",
          year: "2025",
          type: "blog",
          url: "https://deepmind.google/blog/gemini-robotics-15-brings-ai-agents-into-the-physical-world/",
          value: "展示 ER planning + VLA execution 的 agentic robot stack。"
        },
        {
          title: "Agility Whole-Body Control Foundation Model",
          year: "2025",
          type: "blog",
          url: "https://www.agilityrobotics.com/content/training-a-whole-body-control-foundation-model",
          value: "提醒人形 VLA 必须和底层 whole-body RL 控制栈结合。"
        },
        {
          title: "Tesla AI & Robotics",
          year: "2026",
          type: "official",
          url: "https://www.tesla.com/AI?s=09",
          value: "Optimus 产业观察入口，技术细节较少；不应作为已公开 VLA 架构证据。"
        }
      ]
    },
    {
      id: "world-models-wam",
      title: "WM / WAM / 规划想象",
      question: "端到端 VLA 会做反应，但它会不会想象后果？WM/WAM 试图补上预测、规划、反事实评估和安全筛选。",
      takeaway: "WM 是 action -> future 的想象器，WAM 是 future/action 联合生成的策略化世界模型。短期最实用是 VLA 生成候选，WM/WAM 做 rollout、critic 或重排；长期可能出现预测-行动统一模型。",
      priority: "深入",
      branches: [
        "Latent world model RL：PlaNet、Dreamer、TD-MPC 在 latent dynamics 中学习/规划。",
        "Action-conditioned video prediction：Visual Foresight 是机器人视频世界模型的祖先。",
        "Foundation world model：UniSim、Genie、Genie 2、RoboDreamer 从生成视频走向交互模拟。",
        "WAM：DreamZero 类联合建模视频和动作，把世界模型直接用作 zero-shot policy。",
        "VLM planner + affordance：SayCan/PaLM-E/Code as Policies/VoxPoser 是语义规划和低层技能的桥。"
      ],
      patterns: [
        "WM 的难点不是生成漂亮视频，而是 action-controllable、物理一致、长时稳定、可用于闭环。",
        "WAM 和 VLA 的边界会变模糊：一个模型既预测未来也输出动作。",
        "真实机器人系统很可能采用 hybrid：VLA proposal + WM evaluation + MPC/reranking + safety filter。"
      ],
      references: [
        {
          title: "World Models",
          year: "2018",
          type: "paper",
          url: "https://arxiv.org/abs/1803.10122",
          value: "世界模型思想的经典起点：压缩视觉、学习动态、在想象中控制。"
        },
        {
          title: "PlaNet",
          year: "2019",
          type: "paper",
          url: "https://planetrl.github.io/",
          value: "从像素学习 latent dynamics 并用于规划，是 Dreamer 系前身。"
        },
        {
          title: "DreamerV3",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2301.04104",
          value: "展示 world-model RL 在大量任务上的统一性和可扩展性。"
        },
        {
          title: "TD-MPC2",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2310.16828",
          value: "连续控制中强力的 latent model predictive control 路线。"
        },
        {
          title: "Visual Foresight",
          year: "2018",
          type: "paper",
          url: "https://arxiv.org/abs/1812.00568",
          value: "动作条件视频预测 + MPC，是机器人视觉规划的关键祖先。"
        },
        {
          title: "UniSim",
          year: "2023",
          type: "project",
          url: "https://universal-simulator.github.io/unisim/",
          value: "学习交互式真实世界模拟器，用生成模型训练/评估 embodied agents。"
        },
        {
          title: "Genie 2",
          year: "2024",
          type: "blog",
          url: "https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/",
          value: "DeepMind 的大规模 foundation world model，推动可交互生成环境方向。"
        },
        {
          title: "RoboDreamer",
          year: "2024",
          type: "paper",
          url: "https://proceedings.mlr.press/v235/zhou24f.html",
          value: "用组合式视频世界模型帮助机器人想象未见物体-动作组合。"
        },
        {
          title: "DreamZero: World Action Models are Zero-shot Policies",
          year: "2026",
          type: "paper",
          url: "https://arxiv.org/abs/2602.15922",
          value: "明确提出 WAM，把视频世界模型和动作生成合并成可零样本控制的策略。"
        },
        {
          title: "SayCan",
          year: "2022",
          type: "paper",
          url: "https://arxiv.org/abs/2204.01691",
          value: "把 LLM 任务分解与机器人 affordance/value 结合，解决会说但不能做。"
        },
        {
          title: "VoxPoser",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2307.05973",
          value: "用 LLM/VLM 生成 3D value maps 和 constraints，再做 motion planning。"
        }
      ]
    },
    {
      id: "spatial-perception",
      title: "空间感知与 3D VLA",
      question: "VLA 看图像够不够？机器人要接触、避障、抓取和导航，必须把语义落到 3D 空间、物体、可供性和约束。",
      takeaway: "CLIPort、VoxPoser、PerAct、RVT、SpatialVLA、StarVLA 等在回答同一个问题：如何让 VLA 不只是识别物体，而是知道在哪里做、从哪个方向做、做完会怎样。",
      priority: "深入",
      branches: [
        "2D affordance：CLIPort/Transporter 把 what 和 where 解耦。",
        "3D voxel/point cloud：PerAct/RVT 用多视角和 3D 表示改善 manipulation。",
        "Open-vocabulary 3D grounding：把 CLIP/VLM 语义投到点云、语义地图或 value map。",
        "Spatial VLA：显式引入空间推理、3D tokens、位姿、深度或几何约束。",
        "StarVLA/SpatialVLA 类新工作：重点关注是否有真实开源、动作表示和评测任务。"
      ],
      patterns: [
        "空间表征不是为了好看，而是为了把语言目标转成可执行坐标、姿态和接触约束。",
        "对于人形和移动操作，SLAM、语义地图、占据和可供性是 VLA 的外部记忆。",
        "读 3D VLA 时要看它是否真的提升真实机器人成功率，而不是只提升静态问答。"
      ],
      references: [
        {
          title: "CLIPort",
          year: "2021",
          type: "paper",
          url: "https://arxiv.org/abs/2109.12098",
          value: "what/where 双通路的语言条件 manipulation 经典方法。"
        },
        {
          title: "PerAct",
          year: "2022",
          type: "paper",
          url: "https://arxiv.org/abs/2209.05451",
          value: "用 voxelized 3D scene 和 Perceiver Transformer 做语言条件操作。"
        },
        {
          title: "RVT: Robotic View Transformer",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2306.14896",
          value: "多视角渲染式表征，让 3D manipulation 更高效。"
        },
        {
          title: "VoxPoser",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2307.05973",
          value: "把 VLM/LLM 转成 3D value maps，是空间推理到 motion planning 的桥。"
        },
        {
          title: "SpatialVLA",
          year: "2025",
          type: "paper",
          url: "https://arxiv.org/abs/2501.15830",
          value: "代表显式空间表示增强 VLA 的新路线，适合与 OpenVLA/RT-2 对比。"
        },
        {
          title: "StarVLA",
          year: "2026",
          type: "paper",
          url: "https://arxiv.org/abs/2604.05014",
          value: "模块化 VLA 开源框架和强基线，不是 SpatialVLA 的别名，适合复现和公平比较。"
        }
      ]
    },
    {
      id: "dexterous-longhorizon",
      title: "精细交互与长程任务",
      question: "VLA 从桌面抓放走向叠衣服、整理厨房、开抽屉、做咖啡、协作搬运，会遇到接触、遮挡、失败恢复和长时记忆。",
      takeaway: "精细交互要同时学手、物体状态、接触和纠错。长程任务要把语言分解、记忆、子目标、失败检测和动作 chunk 接起来，Figure Helix 叠被子/协作、π0.5 家庭清洁、Gemini Robotics origami 都是典型样本。",
      priority: "重点",
      branches: [
        "双臂与灵巧手：ALOHA/ACT、RoboSet、DexMG、GR00T、Gemini Robotics 都在强化精细双手。",
        "布料/柔性物体：叠衣服、叠被子是 VLA 长程接触推理的高价值任务。",
        "长程协作：多机器人或人机协作需要共享目标、互相避让和角色分配。",
        "记忆与子任务：从 single instruction 到 multi-step household mission，必须显式或隐式维护进度。",
        "失败恢复：靠单次 BC 不够，需要 intervention、preference、RL 或 WAM rollout。"
      ],
      patterns: [
        "长程任务不是把短动作串长一点，而是状态估计、进度判断和错误恢复的问题。",
        "灵巧手任务的关键往往是接触状态和力/触觉缺失补偿，不只是视觉识别。",
        "Figure、PI、Google 的 demo 值得看，但要分清单模型泛化和 task-specific tuning。"
      ],
      references: [
        {
          title: "ALOHA Unleashed",
          year: "2024",
          type: "project",
          url: "https://aloha-unleashed.github.io/",
          value: "展示更强低成本双臂系统和复杂 manipulation 数据。"
        },
        {
          title: "π0.5 Open-World Generalization",
          year: "2025",
          type: "paper",
          url: "https://arxiv.org/abs/2504.16054",
          value: "家庭清洁、整理和长程 open-world 泛化的代表。"
        },
        {
          title: "Figure Helix",
          year: "2025",
          type: "blog",
          url: "https://www.figure.ai/news/helix?_bhlid=b8b2b559cbd15863672a12df457ee8a00d3dd03c",
          value: "双机器人协作和长程家庭任务，适合作为人形 VLA 系统学习案例。"
        },
        {
          title: "Gemini Robotics Technical Report",
          year: "2025",
          type: "paper",
          url: "https://arxiv.org/abs/2503.20020",
          value: "展示 origami、打包等灵巧操作，并区分 VLA 与 ER reasoning 模型。"
        },
        {
          title: "π0.7 / pi0.7",
          year: "2026",
          type: "blog",
          url: "https://www.pi.website/blog/pi07",
          value: "强调通过 visual subgoal、metadata 和 control modality steer 长程/精细行为。"
        },
        {
          title: "RoboTwin 2.0",
          year: "2025",
          type: "benchmark",
          url: "https://arxiv.org/abs/2506.18088",
          value: "面向双臂操作和 VLA 评测的新基准之一。"
        }
      ]
    },
    {
      id: "evaluation-posttraining",
      title: "评测、后训练与安全",
      question: "VLA demo 很容易好看，怎样知道它真的泛化、可控、安全，并能随着部署变强？",
      takeaway: "评测要从离线 loss 转向真实成功率、泛化轴、长程恢复和安全边界。后训练会越来越像 LLM：SFT/BC、intervention、RL、preference、memory、metadata conditioning 一起上。",
      priority: "先读",
      branches: [
        "仿真 benchmark：LIBERO、RLBench、ManiSkill、RoboCasa、RoboSuite 负责可重复比较。",
        "Sim-to-real 评估：SimplerEnv、GR00T workflow 关注仿真指标能否预测真机。",
        "离线/在线闭环：deployment logs、teleop correction、failure replay 是真实提升来源。",
        "RL / preference / advantage：π*0.6 RECAP 展示 VLA 后训练正在成体系。",
        "安全与可控：metadata、速度/质量控制、human override、workspace constraints、VLM safety filter。"
      ],
      patterns: [
        "只看平均成功率不够，要分 object, scene, instruction, embodiment, horizon, recovery。",
        "真实机器人后训练数据昂贵，intervention 和 advantage conditioning 会很重要。",
        "安全评估需要把语言误解、物理碰撞、失稳、夹伤、隐私和越权动作分开。"
      ],
      references: [
        {
          title: "LIBERO",
          year: "2023",
          type: "benchmark",
          url: "https://arxiv.org/abs/2306.03310",
          value: "面向 lifelong robot learning 和知识迁移的 manipulation benchmark。"
        },
        {
          title: "RLBench",
          year: "2020",
          type: "benchmark",
          url: "https://arxiv.org/abs/1909.12271",
          value: "语言条件机器人操作评测的重要早期平台。"
        },
        {
          title: "ManiSkill3",
          year: "2024",
          type: "benchmark",
          url: "https://arxiv.org/abs/2410.00425",
          value: "GPU 并行机器人仿真和渲染，有利于大规模策略训练/评测。"
        },
        {
          title: "SimplerEnv",
          year: "2024",
          type: "benchmark",
          url: "https://arxiv.org/abs/2405.05941",
          value: "研究仿真评估是否能预测真实机器人策略表现。"
        },
        {
          title: "RoboCasa",
          year: "2024",
          type: "benchmark",
          url: "https://arxiv.org/abs/2406.02523",
          value: "日常家务任务仿真环境，适合长程 household VLA 评估。"
        },
        {
          title: "RoboMimic",
          year: "2021",
          type: "benchmark",
          url: "https://arxiv.org/abs/2108.03298",
          value: "机器人模仿学习算法和数据集评估工具箱。"
        },
        {
          title: "π*0.6 / RECAP",
          year: "2026",
          type: "paper",
          url: "https://www.pi.website/download/pistar06.pdf",
          value: "把真实 rollout、人工纠正和 advantage-conditioned policy 作为后训练闭环。"
        },
        {
          title: "Gemini Robotics Safety Report",
          year: "2025",
          type: "report",
          url: "https://deepmind.google/discover/blog/gemini-robotics-brings-ai-into-the-physical-world/",
          value: "Google 在 Gemini Robotics 发布中强调 embodied safety 和 trusted tester 机制。"
        }
      ]
    },
    {
      id: "planner-agent-stack",
      title: "高层规划、工具调用与 Agent Stack",
      question: "VLA 应该直接端到端做所有事，还是让 LLM/VLM 做规划、检索、工具调用，再交给低层策略？",
      takeaway: "现实系统会走混合架构。Gemini Robotics 1.5 明确把 ER reasoning 和 VLA execution 拆成两层；SayCan/Code as Policies/VoxPoser 则是早期高层推理到低层执行的经典路线。",
      priority: "深入",
      branches: [
        "LLM planner + skill library：高层分解成可执行技能，低层控制器负责动作。",
        "Embodied reasoning VLM：估计状态、空间关系、约束、工具调用和任务计划。",
        "Code-as-policy：让 LLM 写程序调用 perception/control API。",
        "VLA execution：把 planner 的子目标、visual goal 或 constraints 转成动作。",
        "Agentic robot stack：search/tools/memory/planner/safety/policy 组合。"
      ],
      patterns: [
        "高层推理擅长任务结构，低层 VLA 擅长视觉闭环动作，不必硬二选一。",
        "工具调用能扩展知识和规划，但必须受机器人 affordance 和安全约束约束。",
        "对人形长程任务，agent stack 往往比单个反应式策略更现实。"
      ],
      references: [
        {
          title: "SayCan",
          year: "2022",
          type: "paper",
          url: "https://arxiv.org/abs/2204.01691",
          value: "高层语言规划和低层 affordance scoring 的经典混合系统。"
        },
        {
          title: "Code as Policies",
          year: "2022",
          type: "paper",
          url: "https://arxiv.org/abs/2209.07753",
          value: "让 LLM 生成机器人策略代码，连接语言推理与 API 控制。"
        },
        {
          title: "PaLM-E",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2303.03378",
          value: "具身多模态语言模型，推动 VLM/LLM 进入机器人状态和规划。"
        },
        {
          title: "VoxPoser",
          year: "2023",
          type: "paper",
          url: "https://arxiv.org/abs/2307.05973",
          value: "把语言和视觉模型输出为 3D value maps，适合 motion planner 消化。"
        },
        {
          title: "Gemini Robotics 1.5 Technical Report",
          year: "2025",
          type: "paper",
          url: "https://arxiv.org/abs/2510.03342",
          value: "展示 ER 1.5 planning + Gemini Robotics 1.5 action 的分层具身 agent。"
        }
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
  report: "报告/安全说明"
};

for (const route of vlaMapData.routes) {
  for (const reference of route.references) {
    reference.evidence = evidenceLabels[reference.type] || "资料";
  }
}

if (typeof module !== "undefined") {
  module.exports = vlaMapData;
}

if (typeof window !== "undefined") {
  window.vlaMapData = vlaMapData;
}
