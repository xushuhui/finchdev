# 第二批工具开发文档

> 给 Codex 的实现指南 | 2026-03-23

## 项目概况

- 代码仓库: `/Users/xsh/gp/finchtool`
- 技术栈: Vue 3 + Vite + TDesign + vite-ssg
- 线上地址: https://www.finchdev.com
- 所有工具纯前端实现，不需要后端

## 现有架构

### 关键文件

| 文件 | 作用 |
|------|------|
| `src/data/tools.js` | 工具定义（名称、路径、SEO 元数据），新工具必须在这里注册 |
| `src/router/index.js` | 路由配置，新工具需要添加路由 |
| `src/composables/useSeoHead.js` | SEO 统一处理（OG、canonical、JSON-LD） |
| `src/components/ToolLayout.vue` | 工具页面通用布局（H1 + 工具区 + How to use + FAQ） |
| `public/sitemap.xml` | 新工具需要添加 URL |

### 添加新工具的步骤

1. **`src/data/tools.js`** — 在 `toolDefinitions` 数组末尾添加工具定义
2. **`src/utils/xxxTools.js`** — 创建工具的核心逻辑（纯函数，方便测试）
3. **`src/views/XxxTool.vue`** — 创建工具页面，使用 `ToolLayout` 组件
4. **`src/router/index.js`** — 添加路由
5. **`src/tests/xxxTools.test.js`** — 添加核心逻辑的单元测试
6. **`public/sitemap.xml`** — 添加新 URL

### 现有工具页面模板（参考 JsonFormatter.vue）

```vue
<template>
  <ToolLayout :title="tool.h1">
    <template #lead>
      一句话描述工具用途
    </template>

    <!-- 工具主体区域 -->

    <template #usage>
      <p>200-300 字英文使用说明</p>
    </template>

    <template #faq>
      <t-collapse-panel header="问题1">回答1</t-collapse-panel>
      <t-collapse-panel header="问题2">回答2</t-collapse-panel>
    </template>
  </ToolLayout>
</template>

<script setup>
import { useSeoHead } from '../composables/useSeoHead'
import { ref } from 'vue'
import ToolLayout from '../components/ToolLayout.vue'
import { toolDefinitions, routeMeta } from '../data/tools'

const tool = toolDefinitions.find((item) => item.path === '/xxx')
useSeoHead(routeMeta['/xxx'])
</script>
```

## 第二批工具清单（5个）

### 1. Hash Generator

| 字段 | 值 |
|------|-----|
| path | `/hash-generator` |
| h1 | `Hash Generator Online` |
| title | `Hash Generator - Free Online Tool \| FinchDev` |
| description | `Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from text instantly with this free online hash generator.` |
| 目标关键词 | `md5 hash generator, sha256 online, hash generator` |
| cardDescription | `Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from text.` |

**功能：**
- 输入框：输入文本
- 输出区域：同时显示 MD5、SHA-1、SHA-256、SHA-512 四种 hash
- 输入时实时计算
- 每个 hash 旁边有 Copy 按钮
- 使用 Web Crypto API (`crypto.subtle.digest`)

**FAQ：**
- Is my data sent to a server? — No, hashing is done in your browser using the Web Crypto API.
- What is the difference between MD5 and SHA-256? — MD5 produces a 128-bit hash and is considered insecure for cryptographic use. SHA-256 produces a 256-bit hash and is widely used for security purposes.

---

### 2. UUID Generator

| 字段 | 值 |
|------|-----|
| path | `/uuid-generator` |
| h1 | `UUID Generator Online` |
| title | `UUID Generator - Free Online Tool \| FinchDev` |
| description | `Generate random UUID v4 identifiers instantly with this free online UUID generator.` |
| 目标关键词 | `uuid generator, uuid v4 generator online, guid generator` |
| cardDescription | `Generate random UUID v4 identifiers instantly.` |

**功能：**
- 点击 Generate 生成一个 UUID v4
- Bulk Generate：输入数量（1-100），批量生成
- 输出区域显示生成的 UUID 列表
- Copy All 按钮
- 格式选项：大写/小写、带不带横线
- 使用 `crypto.randomUUID()` 或 fallback

**FAQ：**
- What is a UUID? — A UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across time and space, commonly used as database primary keys and API identifiers.
- Are these UUIDs truly random? — Yes, they are generated using your browser's cryptographic random number generator.

---

### 3. Color Picker / Converter

| 字段 | 值 |
|------|-----|
| path | `/color-converter` |
| h1 | `Color Converter Online` |
| title | `Color Converter - Free Online Tool \| FinchDev` |
| description | `Convert colors between HEX, RGB, HSL and CMYK formats with this free online color converter.` |
| 目标关键词 | `hex to rgb, color converter, rgb to hex, hsl converter` |
| cardDescription | `Convert colors between HEX, RGB, HSL and CMYK.` |

**功能：**
- 输入任一格式（HEX / RGB / HSL），自动转换为其他格式
- 颜色预览色块
- 每个格式旁边有 Copy 按钮
- 可选：HTML `<input type="color">` 选色器
- 纯 JS 转换算法，不需要依赖

**FAQ：**
- What color formats are supported? — HEX (#RRGGBB), RGB (r, g, b), HSL (h, s%, l%) and CMYK.
- Can I use a color picker? — Yes, click the color preview block to open your browser's native color picker.

---

### 4. JWT Decoder

| 字段 | 值 |
|------|-----|
| path | `/jwt-decoder` |
| h1 | `JWT Decoder Online` |
| title | `JWT Decoder - Free Online Tool \| FinchDev` |
| description | `Decode and inspect JWT tokens, view header and payload claims with this free online JWT decoder.` |
| 目标关键词 | `jwt decoder, jwt token decoder online, jwt parser` |
| cardDescription | `Decode and inspect JWT token header and payload.` |

**功能：**
- 输入框：粘贴 JWT token
- 输出三个区域：Header (JSON)、Payload (JSON)、Signature (hex)
- 高亮显示 `exp` 字段，标注是否已过期
- 纯 Base64URL 解码，不做签名验证（前端无法验证）
- 错误提示：无效 JWT 格式

**FAQ：**
- Does this tool verify the JWT signature? — No, this tool only decodes the token. Signature verification requires the secret key or public key, which should never be shared in a browser tool.
- Is it safe to paste my JWT here? — Yes, the token is decoded entirely in your browser and is never sent to any server.

---

### 5. Markdown Preview

| 字段 | 值 |
|------|-----|
| path | `/markdown-preview` |
| h1 | `Markdown Preview Online` |
| title | `Markdown Preview - Free Online Tool \| FinchDev` |
| description | `Write and preview Markdown with live rendering, syntax highlighting and export support.` |
| 目标关键词 | `markdown preview online, markdown editor, markdown to html` |
| cardDescription | `Write and preview Markdown with live rendering.` |

**功能：**
- 左右分栏：左侧 Markdown 输入，右侧实时 HTML 预览
- 使用 `marked` 库解析 Markdown
- 使用 DOMPurify 对 HTML 做 XSS 过滤（安全！）
- Copy HTML 按钮（复制渲染后的 HTML）
- 预填充示例 Markdown 内容

**依赖：**
- `marked` — Markdown 解析
- `dompurify` — XSS 过滤

**FAQ：**
- What Markdown syntax is supported? — Standard Markdown including headings, lists, links, images, code blocks, tables, and blockquotes.
- Can I export the result? — Yes, use the Copy HTML button to get the rendered HTML output.

## 注意事项

1. 每个工具的 utils 函数必须是纯函数，方便写测试
2. 使用 `MessagePlugin.success()` 做操作反馈（参考现有工具）
3. 使用 TDesign 组件：`t-textarea`, `t-button`, `t-row`, `t-col`, `t-card`, `t-space`, `t-alert`, `t-collapse-panel`
4. icon 字段使用 Lucide 风格的 24x24 SVG inline
5. 记得更新 `public/sitemap.xml` 添加新 URL
6. Markdown Preview 需要安装 `marked` 和 `dompurify` 依赖
7. **安全**：Markdown Preview 必须用 DOMPurify 过滤，防止 XSS
