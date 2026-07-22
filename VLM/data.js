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
        { target: "paper-figures", title: "论文原图导读", note: "先看 9 张论文/项目主图，再按三步拆解回到原文。" },
        { target: "principles", title: "四个心智模型", note: "先把 VLP、VLM、MLLM 和统一生成理解分清。" },
        { target: "learning-path", title: "学习路线", note: "从 CLIP 到 BAGEL 的阅读顺序。" },
        { target: "visual-figures", title: "范式预览", note: "默认精选 CLIP、LLaVA、BAGEL，按需展开全部 9 张 SVG 图。" }
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
  visualFigureGuides: [
    {
      kicker: "Contrastive Foundation",
      title: "CLIP / ALIGN：双塔图文对比学习",
      summary: "图像和文本先分开编码，再用对比学习把匹配样本拉近；现代 VLM 的视觉语义底座从这里开始。",
      sourceUrl: "https://arxiv.org/abs/2103.00020",
      nodes: [
        { label: "Image batch", detail: "网页图像 / LAION / DataComp", x: 32, y: 78, w: 150, h: 68, kind: "vision" },
        { label: "Vision encoder", detail: "ResNet / ViT / SigLIP", x: 230, y: 54, w: 160, h: 68, kind: "vision" },
        { label: "Text encoder", detail: "caption / alt-text", x: 230, y: 160, w: 160, h: 68, kind: "language" },
        { label: "Similarity matrix", detail: "large-batch pair scores", x: 438, y: 106, w: 166, h: 74, kind: "fusion" },
        { label: "Open-vocab features", detail: "retrieval / zero-shot / backbone", x: 652, y: 106, w: 176, h: 74, kind: "output" }
      ],
      edges: [
        { from: 0, to: 1, label: "image views" },
        { from: 1, to: 3, label: "image embedding" },
        { from: 2, to: 3, label: "text embedding" },
        { from: 3, to: 4, label: "contrastive loss" }
      ],
      readAs: ["双塔不提前融合图文 token", "重点看 batch 构造和 loss", "后续 LLaVA/Qwen 常继承视觉侧能力"]
    },
    {
      kicker: "Fusion VLP",
      title: "ViLBERT / UNITER / ViLT：跨模态融合预训练",
      summary: "早期 VLP 把区域或 patch token 与文本 token 放进融合 Transformer，用 MLM、ITM、MRM 等任务学习细粒度对齐。",
      sourceUrl: "https://arxiv.org/abs/1909.11740",
      nodes: [
        { label: "Image regions", detail: "detector regions / patches", x: 34, y: 62, w: 156, h: 70, kind: "vision" },
        { label: "Text tokens", detail: "caption / question", x: 34, y: 168, w: 156, h: 70, kind: "language" },
        { label: "Single / two stream", detail: "co-attention or shared transformer", x: 254, y: 94, w: 220, h: 104, kind: "fusion" },
        { label: "Pretrain heads", detail: "MLM / ITM / MRM", x: 540, y: 82, w: 150, h: 70, kind: "loss" },
        { label: "Downstream heads", detail: "VQA / retrieval / grounding", x: 540, y: 178, w: 170, h: 70, kind: "output" }
      ],
      edges: [
        { from: 0, to: 2, label: "visual tokens" },
        { from: 1, to: 2, label: "word tokens" },
        { from: 2, to: 3, label: "self/cross attention" },
        { from: 2, to: 4, label: "fused representation" }
      ],
      readAs: ["先问视觉输入是 region 还是 patch", "看 single-stream / two-stream 差异", "判别式任务多，和生成式 VLM 对照读"]
    },
    {
      kicker: "Generative VLM",
      title: "BLIP / CoCa / PaLI：对齐与生成合并",
      summary: "把 CLIP 式对齐、caption 生成和 VQA/检索等任务放进同一个训练配方，让模型从表征走向生成。",
      sourceUrl: "https://arxiv.org/abs/2201.12086",
      nodes: [
        { label: "Image encoder", detail: "ViT visual tokens", x: 40, y: 100, w: 160, h: 72, kind: "vision" },
        { label: "Alignment losses", detail: "ITC / ITM / filtering", x: 250, y: 54, w: 170, h: 76, kind: "loss" },
        { label: "Text decoder", detail: "caption / answer generation", x: 250, y: 168, w: 170, h: 76, kind: "language" },
        { label: "Multi-task data", detail: "caption / VQA / OCR / multilingual", x: 470, y: 108, w: 180, h: 76, kind: "data" },
        { label: "Unified outputs", detail: "retrieval + VQA + caption", x: 700, y: 108, w: 158, h: 76, kind: "output" }
      ],
      edges: [
        { from: 0, to: 1, label: "align" },
        { from: 0, to: 2, label: "condition" },
        { from: 3, to: 2, label: "supervise" },
        { from: 2, to: 4, label: "generate" }
      ],
      readAs: ["看 contrastive 和 caption loss 是否同时存在", "BLIP 的 captioner/filter 是数据清洗核心", "PaLI/CoCa 说明生成和检索可以合流"]
    },
    {
      kicker: "Frozen Backbone Bridge",
      title: "BLIP-2 / InstructBLIP：Q-Former 桥接冻结模型",
      summary: "BLIP-2 的关键不是把所有模型端到端训练，而是在冻结视觉编码器和冻结 LLM 之间训练一个轻量 Q-Former，把视觉压成少量查询 token。",
      sourceUrl: "https://arxiv.org/abs/2301.12597",
      nodes: [
        { label: "Frozen Image Encoder", detail: "CLIP/EVA 视觉编码器", x: 38, y: 104, w: 168, h: 76, kind: "vision" },
        { label: "Learned Queries", detail: "少量 query 抽视觉信息", x: 250, y: 48, w: 170, h: 72, kind: "connector" },
        { label: "Q-Former", detail: "查询 Transformer 压缩对齐", x: 250, y: 164, w: 170, h: 72, kind: "connector" },
        { label: "Frozen LLM", detail: "OPT / FlanT5 / Vicuna", x: 500, y: 104, w: 160, h: 76, kind: "language" },
        { label: "Instruction VLM", detail: "caption / VQA / chat", x: 724, y: 104, w: 158, h: 76, kind: "output" }
      ],
      edges: [
        { from: 0, to: 2, label: "visual tokens" },
        { from: 1, to: 2, label: "learned queries" },
        { from: 2, to: 3, label: "projected tokens" },
        { from: 3, to: 4, label: "generate" }
      ],
      readAs: ["哪些模块冻结，哪些模块训练", "query 数量和压缩瓶颈", "InstructBLIP 如何让 Q-Former instruction-aware"]
    },
    {
      kicker: "Visual Instruction Tuning",
      title: "LLaVA：视觉编码器 + Projector + LLM",
      summary: "开源 VLM 的教学主线：用 CLIP/SigLIP 视觉编码器抽图像特征，MLP projector 映射到 LLM token 空间，再用视觉指令数据做 SFT。",
      sourceUrl: "https://arxiv.org/abs/2304.08485",
      nodes: [
        { label: "Image / Video", detail: "图片、多图或视频帧", x: 38, y: 84, w: 150, h: 72, kind: "vision" },
        { label: "CLIP / SigLIP Encoder", detail: "抽取 visual tokens", x: 232, y: 84, w: 176, h: 72, kind: "vision" },
        { label: "MLP Projector", detail: "映射到 LLM embedding", x: 454, y: 84, w: 160, h: 72, kind: "connector" },
        { label: "Instruction Data", detail: "GPT-4 合成问答/对话", x: 454, y: 190, w: 170, h: 72, kind: "data" },
        { label: "LLM Decoder", detail: "Vicuna / LLaMA / Qwen", x: 690, y: 84, w: 170, h: 72, kind: "language" }
      ],
      edges: [
        { from: 0, to: 1, label: "encode" },
        { from: 1, to: 2, label: "project" },
        { from: 2, to: 4, label: "visual prefix" },
        { from: 3, to: 4, label: "SFT" }
      ],
      readAs: ["projector 是 MLP 还是更复杂 adapter", "SFT 数据来自真实人工还是闭源模型合成", "是否支持高分辨率、多图和视频"]
    },
    {
      kicker: "Interleaved Few-shot",
      title: "Flamingo：图文交错上下文和少样本学习",
      summary: "Flamingo 面向图文交错输入：用 Perceiver Resampler 压缩视觉 token，并通过 gated cross-attention 把它们插入冻结 LLM 的推理过程。",
      sourceUrl: "https://arxiv.org/abs/2204.14198",
      nodes: [
        { label: "Interleaved Context", detail: "图片、文本、图片、问题", x: 34, y: 74, w: 164, h: 76, kind: "data" },
        { label: "Frozen Vision Encoder", detail: "编码图像或视频帧", x: 244, y: 74, w: 170, h: 76, kind: "vision" },
        { label: "Perceiver Resampler", detail: "压缩成固定 latent", x: 462, y: 74, w: 174, h: 76, kind: "connector" },
        { label: "Gated Cross-attn", detail: "层间注入视觉信息", x: 462, y: 190, w: 174, h: 76, kind: "fusion" },
        { label: "Few-shot Answer", detail: "从图文示例泛化", x: 716, y: 130, w: 158, h: 76, kind: "output" }
      ],
      edges: [
        { from: 0, to: 1, label: "visual chunks" },
        { from: 1, to: 2, label: "features" },
        { from: 2, to: 3, label: "latents" },
        { from: 3, to: 4, label: "generate" }
      ],
      readAs: ["是否原生支持多图交错", "视觉 token 如何压缩", "cross-attention 是插层还是只做输入前缀"]
    },
    {
      kicker: "High-resolution / OCR",
      title: "Qwen2.5-VL / InternVL：动态分辨率和视觉侧 scaling",
      summary: "真实应用里文档、图表、UI、OCR 和小目标需要高分辨率处理。Qwen/InternVL 类路线重点看动态切图、位置编码、视觉 backbone scaling 和数据配方。",
      sourceUrl: "https://arxiv.org/abs/2502.13923",
      nodes: [
        { label: "High-res Image / Video", detail: "文档、截图、长视频", x: 36, y: 84, w: 170, h: 76, kind: "vision" },
        { label: "Dynamic Resolution", detail: "切图、多尺度 patch", x: 254, y: 84, w: 172, h: 76, kind: "vision" },
        { label: "Position Encoding", detail: "M-RoPE / 2D / 时间", x: 474, y: 84, w: 172, h: 76, kind: "connector" },
        { label: "OCR / Doc Data", detail: "图表、文字、grounding", x: 474, y: 196, w: 172, h: 76, kind: "data" },
        { label: "Detailed VLM", detail: "OCR、定位、长视频", x: 718, y: 84, w: 160, h: 76, kind: "output" }
      ],
      edges: [
        { from: 0, to: 1, label: "tile" },
        { from: 1, to: 2, label: "place" },
        { from: 2, to: 4, label: "reason" },
        { from: 3, to: 4, label: "supervise" }
      ],
      readAs: ["分辨率策略是否会丢文字", "位置编码如何表达二维/视频", "OCR/文档/图表数据是否足够"]
    },
    {
      kicker: "Unified Generation",
      title: "BAGEL / Janus / Transfusion：理解与生成统一",
      summary: "统一模型同时看懂、回答、生成和编辑图像；核心分歧在图像表示、理解/生成路径是否共享，以及 AR、diffusion、flow loss 如何混合。",
      sourceUrl: "https://arxiv.org/abs/2505.14683",
      nodes: [
        { id: "text", label: "Text Tokens", detail: "next-token language", x: 36, y: 64, w: 150, h: 70, kind: "language" },
        { id: "understand", label: "Understanding Tokens", detail: "ViT / SigLIP visual tokens", x: 36, y: 180, w: 178, h: 70, kind: "vision" },
        { id: "generate", label: "Generation Latents", detail: "VAE latent / image tokens / noise", x: 256, y: 180, w: 190, h: 70, kind: "generator" },
        { id: "shared", label: "Shared / Decoupled Transformer", detail: "BAGEL 共享 attention + MoT；Janus 解耦视觉编码；Transfusion 混合 loss。", x: 494, y: 116, w: 214, h: 90, kind: "fusion" },
        { id: "output", label: "Answer + Image + Edit", detail: "回答问题、生成图像、编辑图像、预测未来帧。", x: 754, y: 116, w: 150, h: 90, kind: "output" }
      ],
      edges: [
        { from: 0, to: 3, label: "text context" },
        { from: 1, to: 3, label: "understand" },
        { from: 2, to: 3, label: "generate" },
        { from: 3, to: 4, label: "unify" }
      ],
      readAs: ["理解和生成视觉路径是否共享", "图像是离散 token 还是连续 latent", "loss 是 AR、diffusion 还是 rectified flow"]
    },
    {
      kicker: "Evaluation Stack",
      title: "VLM 评测栈：别用一个榜单判断模型",
      summary: "VLM 能力要分层评测：基础 VQA、OCR/文档、图表数学、综合推理、幻觉安全和视频长上下文回答的是不同问题。",
      sourceUrl: "https://arxiv.org/abs/2311.16502",
      nodes: [
        { label: "VQA / Caption", detail: "VQAv2 / GQA / OK-VQA", x: 38, y: 56, w: 170, h: 76, kind: "benchmark" },
        { label: "OCR / Doc / Chart", detail: "TextVQA / DocVQA / ChartQA", x: 38, y: 188, w: 180, h: 76, kind: "benchmark" },
        { label: "Reasoning", detail: "MMMU / MathVista / MM-Vet", x: 292, y: 122, w: 178, h: 76, kind: "benchmark" },
        { label: "Hallucination / Safety", detail: "POPE / HallusionBench", x: 548, y: 56, w: 184, h: 76, kind: "benchmark" },
        { label: "Video", detail: "SEED-Bench / Video-MME", x: 548, y: 188, w: 170, h: 76, kind: "benchmark" }
      ],
      edges: [
        { from: 0, to: 2, label: "perception" },
        { from: 1, to: 2, label: "documents" },
        { from: 2, to: 3, label: "risk" },
        { from: 4, to: 2, label: "time" }
      ],
      readAs: ["benchmark 测的是哪类能力", "选择题和开放生成评分不可混看", "幻觉/安全要单独评估"]
    }
  ],
  paperFigureGuides: [
    {
      title: "CLIP：双塔对比学习和 zero-shot 分类",
      sourceTitle: "CLIP Figure 1",
      sourceUrl: "https://arxiv.org/abs/2103.00020",
      imageUrl: "./assets/figures/clip_fig1_contrastive_zeroshot.png",
      originalFigure: "Summary of CLIP’s approach and zero-shot classifier.",
      simplified: [
        "图像和文本分别编码，不做早融合。",
        "batch 内做图文配对对比学习。",
        "测试时用文本编码器合成 zero-shot classifier。"
      ],
      watchFor: "双塔结构、batch 内对比和 zero-shot classifier。"
    },
    {
      title: "BLIP-2：Q-Former 桥接冻结模型",
      sourceTitle: "BLIP-2 Figure 1",
      sourceUrl: "https://arxiv.org/abs/2301.12597",
      imageUrl: "./assets/figures/blip2_fig1_qformer_bridge.png",
      originalFigure: "Overview of BLIP-2’s framework.",
      simplified: [
        "冻结 image encoder 和 LLM。",
        "训练 Q-Former 把视觉特征压成 query token。",
        "再把 query token 接到 LLM 上做生成。"
      ],
      watchFor: "信息瓶颈、冻结模块和两阶段训练。"
    },
    {
      title: "Flamingo：图文交错 few-shot",
      sourceTitle: "Flamingo Figure 3",
      sourceUrl: "https://arxiv.org/abs/2204.14198",
      imageUrl: "./assets/figures/flamingo_fig3_architecture.png",
      originalFigure: "Flamingo architecture overview.",
      simplified: [
        "视觉输入可以是图像或视频。",
        "Perceiver Resampler 压缩视觉特征。",
        "gated cross-attn 在 LLM 层间注入视觉信息。"
      ],
      watchFor: "图文交错输入、视觉压缩和层间 cross-attn。"
    },
    {
      title: "LLaVA：视觉编码器 + Projector + LLM",
      sourceTitle: "LLaVA Figure 1",
      sourceUrl: "https://arxiv.org/abs/2304.08485",
      imageUrl: "./assets/figures/llava_fig1_architecture.png",
      originalFigure: "LLaVA network architecture.",
      simplified: [
        "CLIP 视觉编码器抽图像特征。",
        "Projector 把视觉特征接到语言模型。",
        "用 GPT-4 合成的视觉指令数据做微调。"
      ],
      watchFor: "projector 是最小桥接层，真正拉开差距的是指令数据。"
    },
    {
      title: "Qwen2.5-VL：动态分辨率与 OCR",
      sourceTitle: "Qwen2.5-VL Figure 1",
      sourceUrl: "https://arxiv.org/abs/2502.13923",
      imageUrl: "./assets/figures/qwen25vl_fig1_overview.png",
      originalFigure: "Model overview and dynamic resolution pipeline.",
      simplified: [
        "输入先按内容和尺寸动态切分。",
        "位置编码保留空间和时间结构。",
        "专门 OCR / 文档 / 图表数据补齐真实任务能力。"
      ],
      watchFor: "动态分辨率和 OCR 细节，而不是只看模型名字。"
    },
    {
      title: "InternVL：视觉侧 scaling + 对齐",
      sourceTitle: "InternVL Figure 1",
      sourceUrl: "https://arxiv.org/abs/2312.14238",
      imageUrl: "./assets/figures/internvl_fig1_scaling.png",
      originalFigure: "Scale vision foundation model and align to LLM.",
      simplified: [
        "先扩大视觉 backbone 能力。",
        "再把更强的视觉表征对齐到语言模型。",
        "对照 LLaVA / Qwen 看视觉侧投入的价值。"
      ],
      watchFor: "别把 VLM 只理解成 projector + LLM。"
    },
    {
      title: "Janus-Pro：理解与生成路径解耦",
      sourceTitle: "Janus-Pro Figure 2",
      sourceUrl: "https://arxiv.org/abs/2501.17811",
      imageUrl: "./assets/figures/januspro_fig2_unified.png",
      originalFigure: "Unified multimodal understanding and generation.",
      simplified: [
        "理解和生成不共享同一条视觉编码路径。",
        "分离路径缓解目标冲突。",
        "再用数据和规模把统一能力做强。"
      ],
      watchFor: "理解/生成分叉点和路径解耦。"
    },
    {
      title: "Transfusion：文本 next-token + 图像 diffusion",
      sourceTitle: "Transfusion Figure 1",
      sourceUrl: "https://arxiv.org/abs/2408.11039",
      imageUrl: "./assets/figures/transfusion_fig1_transformer.png",
      originalFigure: "One Transformer for text and image generation.",
      simplified: [
        "文本仍然走 next-token prediction。",
        "图像走 diffusion / continuous latent path。",
        "同一个 Transformer 统一训练两类目标。"
      ],
      watchFor: "离散语言和连续图像目标怎么共存。"
    },
    {
      title: "BAGEL：MoT + shared multimodal self-attention",
      sourceTitle: "BAGEL Figure 2",
      sourceUrl: "https://arxiv.org/abs/2505.14683",
      imageUrl: "./assets/figures/bagel_fig2_mot_shared_attention.png",
      originalFigure: "MoT and shared multimodal self-attention.",
      simplified: [
        "理解 expert 处理文本和 ViT token。",
        "生成 expert 处理 VAE latent。",
        "共享多模态 self-attention 连接理解与生成。"
      ],
      watchFor: "MoT 分工和共享 attention 的结合。"
    }
  ],
  paradigmDiagrams: [
    {
      kicker: "Contrastive / Dual Encoder",
      title: "CLIP / ALIGN：图文双塔对比学习",
      reference: "CLIP, ALIGN, SigLIP",
      summary: "这类模型不把图像和文本提前融合，而是分别编码到同一个向量空间，用大 batch 对比学习把匹配图文拉近，把不匹配图文推远。",
      nodes: [
        { id: "image", label: "Image", detail: "网页图片、COCO/LAION/DataComp 等图像。", kind: "vision" },
        { id: "vision", label: "Vision Encoder", detail: "ResNet/ViT/SigLIP/EVA-CLIP，把图像压成向量。", kind: "encoder" },
        { id: "text", label: "Text Encoder", detail: "文本标题、alt-text、caption 编码成向量。", kind: "language" },
        { id: "loss", label: "Contrastive Loss", detail: "InfoNCE 或 sigmoid loss，对齐图文 embedding。", kind: "loss" },
        { id: "output", label: "Open-vocab Features", detail: "zero-shot 分类、检索、作为后续 VLM 视觉底座。", kind: "output" }
      ],
      edges: [
        { from: "image", to: "vision", label: "图像增强与 patch/feature 编码" },
        { from: "text", to: "loss", label: "文本 embedding 参与相似度矩阵" },
        { from: "vision", to: "loss", label: "图像 embedding 参与相似度矩阵" },
        { from: "loss", to: "output", label: "学到开放词表视觉语义空间" }
      ],
      watch: ["是不是双塔而非融合 Transformer", "loss 是 softmax contrastive 还是 sigmoid", "训练数据规模、过滤和噪声处理"]
    },
    {
      kicker: "Fusion VLP",
      title: "ViLBERT / UNITER / ViLT：跨模态融合预训练",
      reference: "ViLBERT, UNITER, ViLT",
      summary: "早期 VLP 关注区域特征、文本 token 和跨模态 Transformer 的融合，通过 MLM/ITM/MRM 等任务学习细粒度图文关系。",
      nodes: [
        { id: "regions", label: "Regions / Patches", detail: "Faster R-CNN 区域特征，或 ViLT 式 patch token。", kind: "vision" },
        { id: "tokens", label: "Text Tokens", detail: "问题、caption、短语或句子 token。", kind: "language" },
        { id: "fusion", label: "Fusion Transformer", detail: "单流或双流 co-attention，让图文 token 互相看见。", kind: "fusion" },
        { id: "tasks", label: "Pretrain Tasks", detail: "MLM、ITM、MRM、word-region alignment。", kind: "loss" },
        { id: "output", label: "Task Heads", detail: "VQA、检索、caption、grounding 等下游任务。", kind: "output" }
      ],
      edges: [
        { from: "regions", to: "fusion", label: "视觉 token 进入融合层" },
        { from: "tokens", to: "fusion", label: "语言 token 进入融合层" },
        { from: "fusion", to: "tasks", label: "跨模态表示做预训练" },
        { from: "tasks", to: "output", label: "迁移到下游 V+L 任务" }
      ],
      watch: ["single-stream 还是 two-stream", "视觉输入是检测区域还是 patch", "预训练目标是否偏判别式"]
    },
    {
      kicker: "Generative VLM",
      title: "BLIP / CoCa / PaLI：对齐、融合、生成合并",
      reference: "BLIP, CoCa, PaLI",
      summary: "这一类把 CLIP 式对比学习和 caption/seq2seq 生成结合起来，让模型同时能检索、看图回答和生成描述。",
      nodes: [
        { id: "image", label: "Image Encoder", detail: "ViT/视觉 backbone 提供图像 token 或 embedding。", kind: "vision" },
        { id: "align", label: "Image-Text Align", detail: "对比学习、ITM、caption filtering/bootstrapping。", kind: "loss" },
        { id: "decoder", label: "Text Decoder", detail: "生成 caption、答案或多任务文本输出。", kind: "language" },
        { id: "mix", label: "Multi-task Mix", detail: "检索、VQA、captioning、OCR/多语言任务混合。", kind: "data" },
        { id: "output", label: "Unified VLM", detail: "理解和生成任务共用一个预训练体系。", kind: "output" }
      ],
      edges: [
        { from: "image", to: "align", label: "图文先对齐" },
        { from: "align", to: "decoder", label: "对齐后的视觉信息给生成器" },
        { from: "mix", to: "decoder", label: "多任务监督强化泛化" },
        { from: "decoder", to: "output", label: "输出文本答案或描述" }
      ],
      watch: ["是否同时有 contrastive 和 caption loss", "captioner/filter 是否用于清洗数据", "任务混合是否覆盖多语言/文档/视频"]
    },
    {
      kicker: "Frozen Backbone Bridge",
      title: "BLIP-2 / InstructBLIP：Q-Former 桥接冻结模型",
      reference: "BLIP-2, InstructBLIP",
      summary: "BLIP-2 的关键不是把所有模型端到端训练，而是在冻结视觉编码器和冻结 LLM 之间训练一个轻量 Q-Former，把视觉压成少量查询 token。",
      nodes: [
        { id: "image", label: "Frozen Image Encoder", detail: "CLIP/EVA 等强视觉编码器，多数参数冻结。", kind: "vision" },
        { id: "queries", label: "Learned Queries", detail: "少量可学习 query 从视觉 token 中抽取信息。", kind: "connector" },
        { id: "qformer", label: "Q-Former", detail: "查询 Transformer，做视觉语言对齐和信息压缩。", kind: "connector" },
        { id: "llm", label: "Frozen LLM", detail: "OPT/FlanT5/Vicuna 等语言模型负责生成。", kind: "language" },
        { id: "output", label: "Instruction VLM", detail: "caption、VQA、视觉对话和指令泛化。", kind: "output" }
      ],
      edges: [
        { from: "image", to: "qformer", label: "视觉 token 被 query 读取" },
        { from: "queries", to: "qformer", label: "学习压缩视觉信息" },
        { from: "qformer", to: "llm", label: "转成 LLM 可消费的 token" },
        { from: "llm", to: "output", label: "语言模型生成回答" }
      ],
      watch: ["哪些模块冻结，哪些模块训练", "query 数量和压缩瓶颈", "InstructBLIP 如何让 Q-Former instruction-aware"]
    },
    {
      kicker: "Visual Instruction Tuning",
      title: "LLaVA：视觉编码器 + Projector + LLM",
      reference: "LLaVA, MiniGPT-4, LLaVA-OneVision",
      summary: "开源 VLM 的教学主线：用 CLIP/SigLIP 视觉编码器抽图像特征，MLP projector 映射到 LLM token 空间，再用视觉指令数据做 SFT。",
      nodes: [
        { id: "image", label: "Image / Multi-image / Video", detail: "图片、多图或视频帧输入。", kind: "vision" },
        { id: "encoder", label: "CLIP / SigLIP Encoder", detail: "冻结或微调视觉编码器抽取 visual tokens。", kind: "vision" },
        { id: "projector", label: "MLP Projector", detail: "把视觉 token 映射到 LLM embedding 空间。", kind: "connector" },
        { id: "sft", label: "Visual Instruction Data", detail: "GPT-4 生成问答、详细 caption、多轮对话数据。", kind: "data" },
        { id: "llm", label: "LLM Decoder", detail: "Vicuna/LLaMA/Qwen 等生成自然语言答案。", kind: "language" }
      ],
      edges: [
        { from: "image", to: "encoder", label: "视觉输入 token 化" },
        { from: "encoder", to: "projector", label: "视觉特征投影" },
        { from: "projector", to: "llm", label: "作为 prefix/visual tokens 接入 LLM" },
        { from: "sft", to: "llm", label: "视觉指令微调教会对话格式" }
      ],
      watch: ["projector 是 MLP 还是更复杂 adapter", "SFT 数据来自真实人工还是闭源模型合成", "是否支持高分辨率、多图和视频"]
    },
    {
      kicker: "Interleaved Few-shot",
      title: "Flamingo：图文交错上下文和少样本学习",
      reference: "Flamingo",
      summary: "Flamingo 面向图文交错输入：用 Perceiver Resampler 压缩视觉 token，并通过 gated cross-attention 把它们插入冻结 LLM 的推理过程。",
      nodes: [
        { id: "interleaved", label: "Interleaved Context", detail: "图片、文本、图片、问题混合出现。", kind: "data" },
        { id: "vision", label: "Frozen Vision Encoder", detail: "视觉 backbone 编码多张图或视频帧。", kind: "vision" },
        { id: "resampler", label: "Perceiver Resampler", detail: "把大量视觉 token 压成固定数量 latent。", kind: "connector" },
        { id: "gated", label: "Gated Cross-attention", detail: "在 LLM 层间有控制地注入视觉信息。", kind: "fusion" },
        { id: "output", label: "Few-shot Answer", detail: "看少量图文示例后回答新问题。", kind: "output" }
      ],
      edges: [
        { from: "interleaved", to: "vision", label: "抽出视觉片段" },
        { from: "vision", to: "resampler", label: "压缩视觉 token" },
        { from: "resampler", to: "gated", label: "送入跨注意力层" },
        { from: "gated", to: "output", label: "LLM 在上下文中生成答案" }
      ],
      watch: ["是否原生支持多图交错", "视觉 token 如何压缩", "cross-attention 是插层还是只做输入前缀"]
    },
    {
      kicker: "High-resolution / OCR",
      title: "Qwen2.5-VL / InternVL：动态分辨率和视觉侧 scaling",
      reference: "Qwen2-VL, Qwen2.5-VL, InternVL",
      summary: "真实应用里文档、图表、UI、OCR 和小目标需要高分辨率处理。Qwen/InternVL 类路线重点看动态切图、位置编码、视觉 backbone scaling 和数据配方。",
      nodes: [
        { id: "input", label: "High-res Image / Video", detail: "文档、截图、图表、长视频、多尺度图片。", kind: "vision" },
        { id: "tiling", label: "Dynamic Resolution", detail: "Naive Dynamic Resolution、dynamic tiling、多尺度 patch。", kind: "vision" },
        { id: "position", label: "Position Encoding", detail: "M-RoPE/二维位置/时间位置，把空间和视频顺序带给 LLM。", kind: "connector" },
        { id: "data", label: "OCR / Doc / Chart Data", detail: "文档解析、场景文字、图表问答、grounding 数据。", kind: "data" },
        { id: "output", label: "Detailed VLM", detail: "OCR、文档、定位、长视频、视觉 agent 任务。", kind: "output" }
      ],
      edges: [
        { from: "input", to: "tiling", label: "按内容和尺寸切分" },
        { from: "tiling", to: "position", label: "保留空间/时间结构" },
        { from: "position", to: "output", label: "送入 LLM 做细节推理" },
        { from: "data", to: "output", label: "专门数据补齐真实工作流能力" }
      ],
      watch: ["分辨率策略是否会丢文字", "位置编码如何表达二维/视频", "OCR/文档/图表数据是否足够"]
    },
    {
      kicker: "Unified Generation",
      title: "BAGEL / Janus / Transfusion：理解和生成统一",
      reference: "BAGEL, Janus-Pro, Show-o, Transfusion",
      summary: "统一模型不只是看图回答，还要生成、编辑和预测图像。关键分歧在图像表示：离散 token、VAE latent、diffusion/flow 目标，以及理解和生成视觉路径是否解耦。",
      nodes: [
        { id: "text", label: "Text Tokens", detail: "语言仍用 next-token prediction。", kind: "language" },
        { id: "understand", label: "Understanding Tokens", detail: "ViT/SigLIP tokens 负责看图、OCR、多图推理。", kind: "vision" },
        { id: "generate", label: "Generation Latents", detail: "VAE latent、离散图像 token 或 diffusion state。", kind: "generator" },
        { id: "shared", label: "Shared / Decoupled Transformer", detail: "BAGEL 共享 attention + MoT；Janus 解耦视觉编码；Transfusion 混合 loss。", kind: "fusion" },
        { id: "output", label: "Answer + Image + Edit", detail: "回答问题、生成图像、编辑图像、预测未来帧。", kind: "output" }
      ],
      edges: [
        { from: "text", to: "shared", label: "语言上下文" },
        { from: "understand", to: "shared", label: "视觉理解 token" },
        { from: "generate", to: "shared", label: "生成 latent / noise state" },
        { from: "shared", to: "output", label: "统一输出理解和生成结果" }
      ],
      watch: ["理解和生成视觉路径是否共享", "图像是离散 token 还是连续 latent", "loss 是 AR、diffusion 还是 rectified flow"]
    },
    {
      kicker: "Evaluation Stack",
      title: "VLM 评测栈：别用一个榜单判断模型",
      reference: "MMMU, MMBench, MathVista, OCRBench, POPE, Video-MME",
      summary: "VLM 能力要分层评测：基础 VQA、OCR/文档、图表数学、综合推理、幻觉安全和视频长上下文回答的是不同问题。",
      nodes: [
        { id: "basic", label: "VQA / Caption", detail: "VQAv2、GQA、OK-VQA、ScienceQA。", kind: "benchmark" },
        { id: "ocr", label: "OCR / Doc / Chart", detail: "TextVQA、DocVQA、ChartQA、OCRBench。", kind: "benchmark" },
        { id: "reason", label: "Reasoning", detail: "MMMU、MathVista、MM-Vet、MMBench。", kind: "benchmark" },
        { id: "safety", label: "Hallucination / Safety", detail: "POPE、HallusionBench、MM-SafetyBench。", kind: "benchmark" },
        { id: "video", label: "Video", detail: "SEED-Bench、Video-MME、长短视频理解。", kind: "benchmark" }
      ],
      edges: [
        { from: "basic", to: "reason", label: "从感知问答到复杂推理" },
        { from: "ocr", to: "reason", label: "文档和图表常需要计算/定位" },
        { from: "reason", to: "safety", label: "高分不等于不幻觉" },
        { from: "video", to: "reason", label: "时间上下文增加难度" }
      ],
      watch: ["benchmark 测的是哪类能力", "选择题和开放生成评分不可混看", "幻觉/安全要单独评估"]
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
