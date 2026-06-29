const vlmMapData = {
  meta: {
    title: "VLM Learning Map",
    subtitle: "Vision-Language Models, Multimodal LLMs, Unified Understanding and Generation",
    updated: "2026-06-29",
    note: "This page mixes papers, project pages, official reports, model cards, and benchmarks. Treat closed-product descriptions as capability signals, not peer-reviewed benchmark conclusions."
  },
  principles: [
    {
      number: "01",
      title: "先区分 VLP、VLM、MLLM",
      text: "VLP 更关注图文表征预训练，VLM 覆盖图文理解与生成，MLLM 则把视觉 token 接入大语言模型，形成可对话、可推理、可工具化的系统。"
    },
    {
      number: "02",
      title: "视觉编码器不是配角",
      text: "CLIP、SigLIP、EVA-CLIP、InternViT、MoonViT 等决定高分辨率、OCR、grounding 和小目标细节能否进入语言模型。"
    },
    {
      number: "03",
      title: "数据配方常比连接器更关键",
      text: "网页图文、详细 caption、OCR/文档、图表、视频、指令数据和人工偏好共同决定模型真正会什么。只看 projector 结构会漏掉大部分能力来源。"
    },
    {
      number: "04",
      title: "统一生成理解是下一条主线",
      text: "BAGEL、Chameleon、Janus、Show-o、Transfusion 等工作不满足于看图问答，而是把理解、文生图、图像编辑和交错多模态上下文放入同一个训练框架。"
    }
  ],
  tocGroups: [
    {
      title: "先建立框架",
      items: [
        { target: "principles", title: "四个心智模型", note: "先把 VLP、VLM、MLLM 和统一生成理解分清。" },
        { target: "learning-path", title: "学习路线", note: "从 CLIP 到 BAGEL 的阅读顺序。" },
        { target: "families", title: "模型家族", note: "按架构路线拆开双塔、融合、桥接、开放数据和统一生成。" }
      ]
    },
    {
      title: "看模型谱系",
      items: [
        { target: "model-atlas", title: "关键模型图谱", note: "检索 CLIP、LLaVA、Qwen-VL、InternVL、Molmo、BAGEL 等。" },
        { target: "unified-models", title: "统一模型", note: "BAGEL、Chameleon、Emu3、Show-o、Janus-Pro、Transfusion 等。" },
        { target: "references", title: "GitHub / 项目入口", note: "BAGEL GitHub、模型卡、项目页和其他论文资料集中索引。" }
      ]
    },
    {
      title: "查资料和评测",
      items: [
        { target: "benchmark-map", title: "数据与评测", note: "预训练数据、VQA、综合评测、幻觉、安全、OCR、视频。" },
        { target: "references", title: "参考文献", note: "论文、项目页、模型卡、官方报告集中索引。" },
        { target: "glossary", title: "术语表", note: "connector、Q-Former、dynamic resolution、hallucination 等。" }
      ]
    }
  ],
  learningStages: [
    {
      title: "阶段 1：图文对齐和 VLP 基础",
      goal: "先看模型如何把图像和文本放到同一个语义空间。",
      read: ["ViLBERT / UNITER", "ViLT", "CLIP / ALIGN", "ALBEF"],
      output: "能解释 single-stream、two-stream、ITM/MLM/MRM、contrastive alignment 的差别。"
    },
    {
      title: "阶段 2：生成式 VLM 和桥接模块",
      goal: "理解图文检索/VQA/captioning 如何走向统一生成。",
      read: ["SimVLM", "BLIP", "CoCa", "BLIP-2"],
      output: "能画出 image encoder、Q-Former/projector、LLM 或 decoder 之间的数据流。"
    },
    {
      title: "阶段 3：LLM 时代的视觉指令微调",
      goal: "掌握开源 MLLM 的最小可行架构和指令数据来源。",
      read: ["MiniGPT-4", "InstructBLIP", "LLaVA / LLaVA-1.5", "LLaVA-OneVision"],
      output: "能复述 CLIP/SigLIP + projector + LLM + visual instruction tuning 为什么有效。"
    },
    {
      title: "阶段 4：高分辨率、文档、视频和开放数据",
      goal: "把 VLM 从看图聊天扩展到真实工作流。",
      read: ["Qwen2-VL / Qwen2.5-VL", "InternVL", "DeepSeek-VL2", "Molmo / PixMo", "Kimi-VL"],
      output: "能按视觉侧 scaling、动态分辨率、OCR/文档数据、开放配方和长上下文比较模型。"
    },
    {
      title: "阶段 5：统一理解与生成",
      goal: "理解为什么 BAGEL 这类模型不只是 VLM 加扩散模型。",
      read: ["Chameleon", "Show-o", "Janus / Janus-Pro", "Transfusion", "BAGEL"],
      output: "能解释图像离散 token、VAE latent、AR loss、diffusion/flow loss 和共享 attention 的取舍。"
    }
  ],
  families: [
    {
      id: "classic-vlp",
      title: "Classic VLP：融合 Transformer",
      question: "图文 token 是早融合、晚融合，还是区域特征和文本 token 跨注意力？",
      takeaway: "ViLBERT、UNITER、ViLT 让你理解 VLM 的前史：检测器区域特征、单流/双流融合和多任务预训练。",
      patterns: [
        "ViLBERT 用视觉流和语言流加 co-attention。",
        "UNITER 代表单流融合和多任务图文对齐。",
        "ViLT 去掉检测器，直接把图像 patch 当 token。"
      ],
      mustRead: ["ViLBERT", "UNITER", "ViLT"]
    },
    {
      id: "contrastive-foundation",
      title: "Contrastive Foundation：CLIP 系列",
      question: "为什么图文对比学习成了现代 VLM 的底座？",
      takeaway: "CLIP/ALIGN 证明网页图文对可以训练开放词表视觉模型，SigLIP/EVA-CLIP 则补上更强视觉编码器和训练 recipe。",
      patterns: [
        "双塔结构便于大规模图文检索和 zero-shot 分类。",
        "噪声网页数据靠规模、过滤和 loss 设计抵消。",
        "后续 LLaVA、PaliGemma、Qwen-VL 常直接继承 CLIP/SigLIP 风格视觉编码器。"
      ],
      mustRead: ["CLIP", "ALIGN", "SigLIP", "EVA-CLIP"]
    },
    {
      id: "generative-vlm",
      title: "Generative VLM：从 caption 到统一任务",
      question: "怎样把检索、VQA、captioning 和文本生成放在同一模型里？",
      takeaway: "BLIP、CoCa、PaLI、BLIP-2 是从表征学习走向生成式 VLM 的关键桥梁。",
      patterns: [
        "BLIP 用 captioner/filter bootstrap 清洗网页图文数据。",
        "CoCa 合并 contrastive loss 和 captioning loss。",
        "BLIP-2 用 Q-Former 桥接冻结视觉编码器和冻结 LLM。"
      ],
      mustRead: ["BLIP", "CoCa", "PaLI", "BLIP-2"]
    },
    {
      id: "connector-mllm",
      title: "Connector MLLM：视觉编码器接 LLM",
      question: "一个 projector 为什么能把视觉能力接进大语言模型？",
      takeaway: "MiniGPT-4、InstructBLIP、LLaVA 和 Flamingo 是理解视觉指令微调、Q-Former、Perceiver Resampler 和 interleaved input 的主线。",
      patterns: [
        "最小结构是视觉编码器 + projector + LLM。",
        "Flamingo 用 Perceiver Resampler 和 gated cross-attention 支持少样本图文交错。",
        "LLaVA 用 GPT-4 合成视觉指令数据，成为开源教学基线。"
      ],
      mustRead: ["Flamingo", "MiniGPT-4", "InstructBLIP", "LLaVA"]
    },
    {
      id: "open-scaled-mllm",
      title: "Open Scaled MLLM：开源工程化路线",
      question: "中文、OCR、文档、视频、长上下文和开放数据怎么进入 VLM？",
      takeaway: "Qwen-VL、InternVL、DeepSeek-VL、Molmo、Kimi-VL 等把 VLM 从 demo 推向可复现、可评测、可落地的工程系统。",
      patterns: [
        "Qwen2-VL/Qwen2.5-VL 重点在动态分辨率、M-RoPE、文档和视频。",
        "InternVL 强调扩展视觉基础模型本身。",
        "Molmo/PixMo 强调开放权重、开放数据和高质量人工数据，而不是闭源模型蒸馏。"
      ],
      mustRead: ["Qwen2.5-VL", "InternVL", "Molmo", "Kimi-VL"]
    },
    {
      id: "unified-generation",
      title: "Unified Understanding + Generation",
      question: "模型能不能既看懂、能回答，又能生成、编辑和预测图像？",
      takeaway: "BAGEL、Chameleon、Emu3、Show-o、Janus-Pro、Transfusion 代表从 VLM 走向统一多模态生成大模型。",
      patterns: [
        "图像可以作为离散 token、连续 VAE latent 或 diffusion/flow 目标。",
        "理解和生成目标会冲突，因此出现视觉路径解耦、专家 Transformer、混合 loss 等设计。",
        "BAGEL 用 MoT 和共享 multimodal self-attention 把理解 token 与生成 latent 放进同一框架。"
      ],
      mustRead: ["BAGEL", "Chameleon", "Show-o", "Janus-Pro", "Transfusion"]
    }
  ],
  keyModels: [
    { name: "ViLBERT", year: "2019", family: "Classic VLP", position: "双流 Transformer 早期范式", idea: "视觉流和语言流通过 co-attention 跨模态交互。", value: "理解 region feature + text token + VLP 多任务预训练。", url: "https://arxiv.org/abs/1908.02265", highlight: false },
    { name: "UNITER", year: "2019", family: "Classic VLP", position: "单流融合和细粒度对齐代表", idea: "统一图文表征学习，并用 Optimal Transport 做词-区域对齐。", value: "理解 ITM、MLM、MRM 和跨数据集 VLP。", url: "https://arxiv.org/abs/1909.11740", highlight: false },
    { name: "ViLT", year: "2021", family: "Classic VLP", position: "去掉检测器的轻量 VLP", idea: "直接把图像 patch 当作 token 输入 Transformer。", value: "理解从区域特征转向端到端 patch/token 建模。", url: "https://arxiv.org/abs/2102.03334", highlight: false },
    { name: "CLIP", year: "2021", family: "Contrastive Foundation", position: "大规模图文对比学习基础范式", idea: "用 4 亿图文对训练图像和文本双塔。", value: "现代开放词表识别、检索、VLM 视觉编码器的共同起点。", url: "https://arxiv.org/abs/2103.00020", highlight: true },
    { name: "ALIGN", year: "2021", family: "Contrastive Foundation", position: "噪声网页图文对规模化训练", idea: "用超过十亿 noisy alt-text 图文对训练双塔模型。", value: "理解 scale 如何抵消网页数据噪声。", url: "https://arxiv.org/abs/2102.05918", highlight: false },
    { name: "ALBEF", year: "2021", family: "Generative VLM", position: "先对齐再融合", idea: "进入跨模态融合前先做图文对比对齐，并用 momentum distillation。", value: "理解 contrastive alignment + cross-attention fusion 的混合路线。", url: "https://arxiv.org/abs/2107.07651", highlight: false },
    { name: "BLIP", year: "2022", family: "Generative VLM", position: "理解和生成统一的图文预训练", idea: "用 captioner/filter bootstrap 清洗数据并支持多任务。", value: "BLIP-2、InstructBLIP 和后续开源 VLM 的直接前置。", url: "https://arxiv.org/abs/2201.12086", highlight: true },
    { name: "Flamingo", year: "2022", family: "Connector MLLM", position: "少样本多模态 in-context learning", idea: "Perceiver Resampler + gated cross-attention 接入冻结 LLM。", value: "理解图文交错输入和 few-shot VLM。", url: "https://arxiv.org/abs/2204.14198", highlight: true },
    { name: "CoCa", year: "2022", family: "Generative VLM", position: "Contrastive captioner", idea: "同一 encoder-decoder 同时优化 contrastive loss 和 captioning loss。", value: "说明 CLIP 式表征学习可以和生成式 captioning 合并。", url: "https://arxiv.org/abs/2205.01917", highlight: false },
    { name: "PaLI / PaLI-X", year: "2022-2023", family: "Generative VLM", position: "多语言多任务生成式 VLM", idea: "大规模 encoder-decoder 语言模型与 ViT 共同扩展到 100+ 语言和 25+ benchmark。", value: "理解 Google 多语言、多任务、大一统 VLM 路线。", url: "https://arxiv.org/abs/2305.18565", highlight: false },
    { name: "BLIP-2", year: "2023", family: "Connector MLLM", position: "Q-Former 桥接冻结视觉编码器和 LLM", idea: "轻量 Q-Former 在 frozen image encoder 和 frozen LLM 间学习查询表示。", value: "大量开源 VLM 架构的核心参考。", url: "https://arxiv.org/abs/2301.12597", highlight: true },
    { name: "MiniGPT-4", year: "2023", family: "Connector MLLM", position: "最小可行 VLM 架构示范", idea: "冻结视觉编码器和 Vicuna，只训练投影层。", value: "解释小连接层 + 强 LLM 为什么能涌现视觉对话能力。", url: "https://arxiv.org/abs/2304.10592", highlight: false },
    { name: "InstructBLIP", year: "2023", family: "Connector MLLM", position: "视觉指令微调强基线", idea: "让 Q-Former instruction-aware，并整合 26 个数据集为指令格式。", value: "讲清 VLP 如何过渡到视觉指令微调。", url: "https://arxiv.org/abs/2305.06500", highlight: false },
    { name: "LLaVA / LLaVA-OneVision", year: "2023-2024", family: "Connector MLLM", position: "开源 VLM 教学主线", idea: "CLIP/SigLIP 视觉编码器 + MLP projector + LLM + GPT-4 合成指令数据。", value: "理解开源 VLM 生态的 Hello World。", url: "https://arxiv.org/abs/2408.03326", highlight: true },
    { name: "SigLIP", year: "2023", family: "Contrastive Foundation", position: "改进 CLIP loss", idea: "用 pairwise sigmoid loss 替代 softmax contrastive loss。", value: "理解后续很多视觉编码器为什么选择 SigLIP。", url: "https://arxiv.org/abs/2303.15343", highlight: false },
    { name: "EVA-CLIP", year: "2023", family: "Contrastive Foundation", position: "强 CLIP 视觉编码器训练 recipe", idea: "改进初始化、优化和数据效率，发布强视觉 backbone。", value: "理解 VLM 视觉侧工程化 scaling。", url: "https://arxiv.org/abs/2303.15389", highlight: false },
    { name: "Qwen-VL / Qwen2.5-VL", year: "2023-2025", family: "Open Scaled MLLM", position: "中文、OCR、文档和视频强路线", idea: "Qwen LLM 扩展视觉能力，并逐步加入 grounding、动态分辨率、M-RoPE 和长视频。", value: "代表中文开源 VLM 工程化与高分辨率路线。", url: "https://arxiv.org/abs/2502.13923", highlight: true },
    { name: "InternVL / InternVL2.x", year: "2023-2025", family: "Open Scaled MLLM", position: "视觉侧 scaling 路线", idea: "扩大视觉基础模型并对齐到 LLM。", value: "对照 LLaVA/Qwen，理解为什么视觉 backbone 也要 scaling。", url: "https://arxiv.org/abs/2312.14238", highlight: true },
    { name: "CogVLM", year: "2023", family: "Open Scaled MLLM", position: "深层视觉专家融合", idea: "在 attention/FFN 层加入可训练 visual expert。", value: "区分 shallow projector 和 deep fusion。", url: "https://arxiv.org/abs/2311.03079", highlight: false },
    { name: "DeepSeek-VL / DeepSeek-VL2", year: "2024", family: "Open Scaled MLLM", position: "真实场景和高分辨率实用派", idea: "围绕网页、PDF、OCR、图表、截图等真实用户场景构建数据和模型。", value: "理解 OCR/文档/图表数据 taxonomy 的重要性。", url: "https://arxiv.org/abs/2412.10302", highlight: false },
    { name: "PaliGemma / PaliGemma 2", year: "2024-2025", family: "Open Scaled MLLM", position: "轻量可迁移 VLM 基线", idea: "SigLIP 视觉编码器 + Gemma LLM，强调 transfer 和 fine-tune。", value: "学习小模型迁移和端侧部署。", url: "https://arxiv.org/abs/2412.03555", highlight: false },
    { name: "Molmo / PixMo / Molmo2", year: "2024-2026", family: "Open Scaled MLLM", position: "真正开放数据和配方的 VLM", idea: "采集高质量图像描述、问答和 pointing 数据，减少闭源模型蒸馏依赖。", value: "讨论开放模型到底开放什么：权重、数据、训练 recipe 和评测。", url: "https://arxiv.org/abs/2409.17146", highlight: true },
    { name: "Kimi-VL", year: "2025", family: "Open Scaled MLLM", position: "长上下文和 MoE VLM", idea: "MoonViT + MoE decoder，支持 128K 上下文、文档、视频和 thinking 版本。", value: "观察 VLM + 长上下文 + 推理/agent 趋势。", url: "https://arxiv.org/abs/2504.07491", highlight: false },
    { name: "GPT-4V / GPT-4o", year: "2023-2024", family: "Closed Frontier", position: "闭源能力标杆", idea: "从图文理解扩展到实时文本、图像、音频统一交互。", value: "作为产品形态和能力上限参照。", url: "https://openai.com/index/hello-gpt-4o/", highlight: true },
    { name: "Gemini", year: "2023-2025", family: "Closed Frontier", position: "原生多模态闭源路线", idea: "统一处理文本、图像、音频、视频和代码，并强化长上下文。", value: "对照原生多模态和后接视觉编码器路线。", url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_v1_5_report.pdf", highlight: true },
    { name: "BAGEL", year: "2025", family: "Unified Understanding + Generation", position: "统一多模态理解与生成 MoT 模型", idea: "用理解 expert、生成 expert 和共享 multimodal self-attention 同时处理文本、ViT token 与 VAE latent。", value: "重点理解从 VLM 到多模态生成大模型的架构跃迁。", url: "https://arxiv.org/abs/2505.14683", highlight: true },
    { name: "Chameleon", year: "2024", family: "Unified Understanding + Generation", position: "mixed-modal early-fusion", idea: "图像和文本都 token 化，用单一 Transformer 处理任意图文交错输入/输出。", value: "理解统一 token 序列路线的代表起点。", url: "https://arxiv.org/abs/2405.09818", highlight: false },
    { name: "Janus-Pro", year: "2025", family: "Unified Understanding + Generation", position: "解耦视觉编码的理解生成统一模型", idea: "用分离视觉编码路径缓解理解与生成目标冲突，并通过数据和规模增强。", value: "和 BAGEL、Show-o、Transfusion 对照理解统一模型设计取舍。", url: "https://arxiv.org/abs/2501.17811", highlight: false }
  ],
  bagelResources: {
    name: "BAGEL",
    year: "2025",
    url: "https://arxiv.org/abs/2505.14683",
    projectUrl: "https://bagel-ai.org/",
    codeUrl: "https://github.com/ByteDance-Seed/Bagel",
    modelUrl: "https://huggingface.co/ByteDance-Seed/BAGEL-7B-MoT"
  },
  unifiedModels: [
    {
      name: "BAGEL",
      year: "2025",
      position: "Mixture-of-Transformer-Experts 统一理解与生成",
      contribution: "ByteDance Seed 开源模型；理解 expert 处理文本和 ViT token，生成 expert 处理 VAE latent，并通过共享 multimodal self-attention 连接视觉问答、图像生成、编辑、多图长上下文和 rectified flow 生成。",
      url: "https://arxiv.org/abs/2505.14683",
      links: [
        { label: "论文", url: "https://arxiv.org/abs/2505.14683" },
        { label: "项目页", url: "https://bagel-ai.org/" },
        { label: "GitHub", url: "https://github.com/ByteDance-Seed/Bagel" },
        { label: "模型卡", url: "https://huggingface.co/ByteDance-Seed/BAGEL-7B-MoT" }
      ]
    },
    { name: "Chameleon", year: "2024", position: "mixed-modal early-fusion", contribution: "把图像和文本都转成 token，用单一 early-fusion 模型处理任意图文交错输入/输出。", url: "https://arxiv.org/abs/2405.09818" },
    { name: "Emu", year: "2023", position: "交错图文视频生成", contribution: "以自回归方式统一 interleaved image-text-video sequence。", url: "https://arxiv.org/abs/2307.05222" },
    { name: "Emu2", year: "2023", position: "生成式多模态 in-context learning", contribution: "37B 参数统一自回归模型，强化 few-shot 多模态能力。", url: "https://arxiv.org/abs/2312.13286" },
    { name: "Emu3", year: "2024", position: "next-token prediction is all you need", contribution: "图像、文本、视频都离散化，不用 diffusion 也做感知和生成。", url: "https://arxiv.org/abs/2409.18869" },
    { name: "Show-o", year: "2024", position: "AR + discrete diffusion", contribution: "一个 Transformer 同时做自回归理解和离散 diffusion 图像生成。", url: "https://arxiv.org/abs/2408.12528" },
    { name: "Janus", year: "2024", position: "解耦视觉编码路径", contribution: "分离理解和生成视觉编码，缓解两种目标的冲突。", url: "https://arxiv.org/abs/2410.13848" },
    { name: "Janus-Pro", year: "2025", position: "Janus 增强版", contribution: "通过数据、训练策略和模型规模提升理解与文生图指令跟随。", url: "https://arxiv.org/abs/2501.17811" },
    { name: "Transfusion", year: "2024", position: "language next-token + image diffusion", contribution: "把离散文本 loss 和连续图像 diffusion loss 放进同一个 Transformer 配方。", url: "https://arxiv.org/abs/2408.11039" },
    { name: "SEED / SEED-LLaMA", year: "2023", position: "语义化图像 token", contribution: "通过 SEED tokenizer 让 LLaMA 原生自回归处理图文。", url: "https://arxiv.org/abs/2310.01218" },
    { name: "SEED-X", year: "2024", position: "多粒度理解与生成", contribution: "支持任意尺寸比例图像理解和多粒度图像生成。", url: "https://arxiv.org/abs/2404.14396" },
    { name: "Unified-IO 2", year: "2023", position: "任意模态到任意模态", contribution: "把图像、文本、音频、动作、bbox 等 token 化到统一空间。", url: "https://arxiv.org/abs/2312.17172" },
    { name: "AnyGPT", year: "2024", position: "离散化全模态对话", contribution: "speech/text/image/music 全部离散化，尽量不改 LLM 架构。", url: "https://arxiv.org/abs/2402.12226" },
    { name: "Kosmos-G", year: "2023", position: "连接式图像生成", contribution: "用 MLLM 感知能力做 in-context image generation，支持交错多图和文本输入。", url: "https://arxiv.org/abs/2310.02992" }
  ],
  benchmarks: [
    { name: "COCO", year: "2014", group: "预训练数据", skill: "caption / detection / VQA", note: "经典通用场景图像数据集，常用于 caption 和基础视觉语义对齐。", url: "https://arxiv.org/abs/1405.0312" },
    { name: "Flickr30K Entities", year: "2015", group: "预训练数据", skill: "图文检索 / phrase grounding", note: "适合讲图像-句子对齐和区域短语 grounding。", url: "https://arxiv.org/abs/1505.04870" },
    { name: "Conceptual Captions / CC3M", year: "2018", group: "预训练数据", skill: "网页图文预训练", note: "早期 VLP/CLIP 类训练常用的网页 alt-text 清洗数据。", url: "https://aclanthology.org/P18-1238/" },
    { name: "CC12M", year: "2021", group: "预训练数据", skill: "长尾图文预训练", note: "放宽过滤得到约 1200 万图文对，提升长尾概念覆盖。", url: "https://arxiv.org/abs/2102.08981" },
    { name: "LAION-5B", year: "2022", group: "预训练数据", skill: "开放大规模图文预训练", note: "约 58.5 亿 CLIP 过滤图文对；学习时也要注意版权、隐私和安全争议。", url: "https://arxiv.org/abs/2210.08402" },
    { name: "DataComp", year: "2023", group: "预训练数据", skill: "数据筛选基准", note: "围绕 128 亿 Common Crawl 图文候选池的数据筛选与评测平台。", url: "https://arxiv.org/abs/2304.14108" },
    { name: "LLaVA-Instruct", year: "2023", group: "预训练数据", skill: "视觉指令微调", note: "用 GPT-4 基于图像描述生成多模态指令问答。", url: "https://arxiv.org/abs/2304.08485" },
    { name: "ShareGPT4V", year: "2023", group: "预训练数据", skill: "详细 caption / SFT", note: "通过 GPT-4V 生成高质量图像描述并扩展到百万级。", url: "https://arxiv.org/abs/2311.12793" },
    { name: "VQAv2", year: "2017", group: "经典任务基准", skill: "开放域视觉问答", note: "通过相似图像配不同答案降低语言偏置，是 VQA 标准入口。", url: "https://arxiv.org/abs/1612.00837" },
    { name: "GQA", year: "2019", group: "经典任务基准", skill: "组合推理 / 场景图一致性", note: "基于 scene graph 生成问题，考察关系、属性、空间和组合推理。", url: "https://arxiv.org/abs/1902.09506" },
    { name: "OK-VQA", year: "2019", group: "经典任务基准", skill: "外部知识视觉问答", note: "图像本身不足以作答，需要常识或世界知识。", url: "https://arxiv.org/abs/1906.00067" },
    { name: "TextVQA", year: "2019", group: "经典任务基准", skill: "场景文字读取", note: "要求模型读懂图中文字并结合视觉上下文回答。", url: "https://arxiv.org/abs/1904.08920" },
    { name: "VizWiz", year: "2018", group: "经典任务基准", skill: "真实辅助场景", note: "来自盲人用户真实拍摄和提问，噪声和不可回答判断很重要。", url: "https://arxiv.org/abs/1802.08218" },
    { name: "ScienceQA", year: "2022", group: "经典任务基准", skill: "多模态科学题", note: "含图像、文本和解释链，适合学习多模态 CoT。", url: "https://arxiv.org/abs/2209.09513" },
    { name: "MME", year: "2023", group: "综合能力评测", skill: "感知 + 认知", note: "覆盖 14 个子任务，是早期 MLLM 综合评测代表。", url: "https://arxiv.org/abs/2306.13394" },
    { name: "LVLM-eHub", year: "2023", group: "综合能力评测", skill: "多基准集合", note: "统一评测多个 LVLM 和在线 arena，适合作为评测生态入口。", url: "https://arxiv.org/abs/2306.09265" },
    { name: "MMBench", year: "2023", group: "综合能力评测", skill: "中英双语综合能力", note: "采用选择题和 CircularEval，评估感知、推理、知识等维度。", url: "https://arxiv.org/abs/2307.06281" },
    { name: "SEED-Bench", year: "2023", group: "综合能力评测", skill: "图像/视频生成式理解", note: "多选题形式覆盖图像和视频理解维度。", url: "https://arxiv.org/abs/2307.16125" },
    { name: "MM-Vet", year: "2023", group: "综合能力评测", skill: "能力组合", note: "用 6 类核心能力及其组合衡量开放问题解决能力。", url: "https://arxiv.org/abs/2308.02490" },
    { name: "MMMU", year: "2023", group: "综合能力评测", skill: "大学级多学科推理", note: "覆盖 6 大学科、30 个科目和多种图像类型，是高难专业推理代表。", url: "https://arxiv.org/abs/2311.16502" },
    { name: "MathVista", year: "2023", group: "综合能力评测", skill: "视觉数学推理", note: "考察图表、几何、函数和纸面题中的数学能力。", url: "https://arxiv.org/abs/2310.02255" },
    { name: "POPE", year: "2023", group: "幻觉 / 安全 / 鲁棒", skill: "物体幻觉", note: "用轮询式二分类问题检测模型是否编造不存在物体。", url: "https://arxiv.org/abs/2305.10355" },
    { name: "HallusionBench", year: "2023", group: "幻觉 / 安全 / 鲁棒", skill: "语言幻觉 + 视觉错觉", note: "通过人工构造对照问题诊断错觉、逻辑一致性和幻觉。", url: "https://arxiv.org/abs/2310.14566" },
    { name: "MM-SafetyBench", year: "2023", group: "幻觉 / 安全 / 鲁棒", skill: "多模态安全攻击", note: "评估图像相关提示如何绕过文本安全对齐。", url: "https://arxiv.org/abs/2311.17600" },
    { name: "DocVQA", year: "2020", group: "文档 / OCR / 图表", skill: "文档图像问答", note: "读取扫描文档、理解版面结构并回答问题。", url: "https://arxiv.org/abs/2007.00398" },
    { name: "ChartQA", year: "2022", group: "文档 / OCR / 图表", skill: "图表视觉 + 算术推理", note: "柱状图、折线图等问题常需要读数、比较和计算。", url: "https://arxiv.org/abs/2203.10244" },
    { name: "OCRBench", year: "2023", group: "文档 / OCR / 图表", skill: "OCR / 场景文字 / KIE / 公式", note: "汇总 29 个文字相关数据集评测读字能力。", url: "https://arxiv.org/abs/2305.07895" },
    { name: "OCRBench v2", year: "2025", group: "文档 / OCR / 图表", skill: "OCR 鲁棒性升级", note: "强调双语、定位、手写、布局和复杂推理。", url: "https://arxiv.org/abs/2501.00321" },
    { name: "Video-MME", year: "2024", group: "视频多模态", skill: "长短视频 / 字幕 / 音频理解", note: "覆盖 900 个视频、2700 个问答，长度从 11 秒到 1 小时。", url: "https://arxiv.org/abs/2405.21075" }
  ],
  references: [],
  glossary: [
    { term: "VLP", meaning: "Vision-Language Pretraining，通常指图文表征预训练和跨模态任务预训练。" },
    { term: "VLM", meaning: "Vision-Language Model，能处理图像和语言的模型，可用于检索、caption、VQA、grounding、OCR 等。" },
    { term: "MLLM", meaning: "Multimodal Large Language Model，把视觉、音频、视频等模态接入 LLM，形成可对话和推理的系统。" },
    { term: "Connector / Projector", meaning: "把视觉编码器输出映射到 LLM token 空间的模块，可能是 MLP、Q-Former、Perceiver Resampler 或更深层 adapter。" },
    { term: "Q-Former", meaning: "BLIP-2 提出的查询 Transformer，用少量 learnable queries 从冻结视觉编码器中提取可供 LLM 使用的视觉表示。" },
    { term: "Interleaved Data", meaning: "图文交错数据，例如网页、教程、对话、多图上下文，是 Flamingo、Emu、BAGEL 等模型的重要训练材料。" },
    { term: "Dynamic Resolution", meaning: "按图像尺寸和内容动态切分/编码，而不是固定缩放到单一分辨率，常用于文档、OCR 和高分辨率场景。" },
    { term: "Grounding", meaning: "把语言中的对象、区域、关系落到图像位置、框、点或 mask 上。" },
    { term: "Hallucination", meaning: "模型描述图中不存在的对象、关系或事实，是 VLM 评测和部署的核心风险。" },
    { term: "Unified Understanding and Generation", meaning: "同一模型同时支持图像理解、文本生成、图像生成、编辑和交错多模态上下文。" },
    { term: "MoT", meaning: "Mixture-of-Transformer-Experts。BAGEL 中理解 expert 和生成 expert 处理不同 token，但共享多模态 self-attention。" },
    { term: "Rectified Flow", meaning: "一种生成建模目标，学习从噪声到数据的连续变换方向；BAGEL 用它预测图像 latent。" }
  ]
};

const referenceSeeds = [
  ...vlmMapData.keyModels.map((model) => ({
    title: model.name,
    year: model.year,
    type: model.family === "Closed Frontier" ? "official" : "paper",
    group: model.family,
    url: model.url,
    value: model.value
  })),
  ...vlmMapData.unifiedModels.map((model) => ({
    title: model.name,
    year: model.year,
    type: "paper",
    group: "Unified Understanding + Generation",
    url: model.url,
    value: model.contribution
  })),
  ...vlmMapData.benchmarks.map((benchmark) => ({
    title: benchmark.name,
    year: benchmark.year,
    type: benchmark.group === "预训练数据" ? "dataset" : "benchmark",
    group: benchmark.group,
    url: benchmark.url,
    value: benchmark.note
  })),
  {
    title: "BAGEL project",
    year: "2025",
    type: "project",
    group: "Unified Understanding + Generation",
    url: vlmMapData.bagelResources.projectUrl,
    value: "BAGEL 官方项目页，适合看 demo、模型定位和能力展示。"
  },
  {
    title: "BAGEL GitHub",
    year: "2025",
    type: "project",
    group: "Unified Understanding + Generation",
    url: vlmMapData.bagelResources.codeUrl,
    value: "ByteDance Seed 官方代码仓库。"
  },
  {
    title: "BAGEL-7B-MoT model card",
    year: "2025",
    type: "model-card",
    group: "Unified Understanding + Generation",
    url: vlmMapData.bagelResources.modelUrl,
    value: "BAGEL 开源模型卡，可查看权重和使用说明。"
  },
  {
    title: "GPT-4V System Card",
    year: "2023",
    type: "report",
    group: "Closed Frontier",
    url: "https://openai.com/research/gpt-4v-system-card",
    value: "闭源 VLM 安全、限制和能力边界的重要参考。"
  },
  {
    title: "Gemini 1.0 Technical Report",
    year: "2023",
    type: "report",
    group: "Closed Frontier",
    url: "https://storage.googleapis.com/deepmind-media/gemini/gemini_1_report.pdf",
    value: "原生多模态闭源模型报告。"
  }
];

const evidenceLabels = {
  paper: "论文/技术报告",
  project: "项目/代码",
  official: "官方资料",
  report: "报告/系统卡",
  dataset: "数据集",
  benchmark: "基准/评测",
  "model-card": "模型卡"
};

vlmMapData.references = [...new Map(referenceSeeds.map((reference) => [
  `${reference.title}::${reference.url}`,
  {
    ...reference,
    evidence: evidenceLabels[reference.type] || "资料"
  }
])).values()];

if (typeof module !== "undefined") {
  module.exports = vlmMapData;
}

if (typeof window !== "undefined") {
  window.vlmMapData = vlmMapData;
}
