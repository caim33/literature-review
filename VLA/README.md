# VLA Learning Map

一个本地静态学习网页，用来系统学习 Vision-Language-Action、WM/WAM、全身人形机器人 foundation model、Physical Intelligence、GR00T、Figure Helix、Gemini Robotics、StarVLA/SpatialVLA 等路线。

## 打开方式

直接打开 `index.html` 即可。也可以在本目录上一级运行：

```bash
python3 -m http.server 8123
```

然后访问 `http://localhost:8123/VLA/`。

## 内容结构

- `index.html`: 页面结构。
- `styles.css`: 视觉样式和响应式布局。
- `data.js`: 路线、文献、术语、时间线和学习路径。
- `app.js`: 搜索、筛选、路线切换和渲染逻辑。
- `test-content.mjs`: 内容完整性检查。

## 证据等级

页面混合了论文、官方项目页、官方公司 blog、model card 和 benchmark。公司 demo 或 blog 中的能力描述只作为学习线索，不等同于 peer-reviewed benchmark 结论。特别注意：

- Figure Helix 目前主要是官方 blog 和演示。
- GR00T N1/N1.5/N1.6/N1.7 有 NVIDIA 官方论文、blog、GitHub 或 Hugging Face 资料，但 N1.7 标注为 early access。
- π0.7 目前主要是 Physical Intelligence 官方 blog。
- StarVLA 和 SpatialVLA 不是同一个项目；StarVLA 是 2026 年模块化 VLA 框架/强基线，SpatialVLA 是空间增强 VLA 路线。
