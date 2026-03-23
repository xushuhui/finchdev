# FinchDev 开发计划

> 域名: finchdev.com | 创建日期: 2026-03-20

## 阶段一：MVP 上线（第1周）

### 1. 项目初始化

- Vue 3 + Vite + Vue Router + Tailwind CSS
- 项目结构参考 `开发者工具站-技术方案.md`
- 配置 SSR/SSG（vite-ssg 或 @unhead/vue），保证每个页面有独立的 title/meta
- 暗色模式切换

### 2. 第一批工具（5个，纯前端）

| 工具                     | 路由            | 目标关键词                                |
| ------------------------ | --------------- | ----------------------------------------- |
| JSON Formatter           | /json-formatter | json formatter online, json beautifier    |
| Regex Tester             | /regex-tester   | regex tester online, regex101 alternative |
| Base64 Encode/Decode     | /base64         | base64 encode online, base64 decoder      |
| Unix Timestamp Converter | /timestamp      | unix timestamp converter, epoch converter |
| URL Encode/Decode        | /url-encoder    | url encode online, url decoder            |

### 3. 每个工具页面结构

- H1 标题（英文，含关键词）
- 工具主体（输入区 + 输出区 + 操作按钮）
- 使用说明（200-300 字英文，覆盖长尾关键词）
- FAQ（2-3 个常见问题）
- 广告位预留（div 占位，后续接 AdSense）

### 4. 全站 SEO

- 每页独立 `<title>`: `{工具名} - Free Online Tool | FinchDev`
- 每页独立 `<meta description>`
- `robots.txt` 允许所有爬虫
- 自动生成 `sitemap.xml`
- 首页列出所有工具卡片，带简要描述

### 5. 部署

- Cloudflare Pages，绑定 `finchdev.com`
- `www.finchdev.com` 301 重定向到 `finchdev.com`

## 阶段二：上线后运营（第2-3周）

- [x] 提交 Google Search Console，提交 sitemap
- [x] 安装 Google Analytics（替代 Umami）
- [ ] 发 Reddit（r/webdev, r/programming）
- [ ] 发 Hacker News Show HN
- [ ] Twitter/X #buildinpublic 开始更新

## 阶段三：扩充工具（第4-8周）✅ 已完成

按搜索量优先级逐步添加（全部 15 个工具已上线）：

1. ~~Markdown Preview~~
2. ~~Hash Generator（MD5, SHA256）~~
3. ~~JWT Decoder~~
4. ~~Color Picker / Converter~~
5. ~~Cron Expression Generator~~
6. ~~UUID Generator~~
7. ~~QR Code Generator~~
8. ~~YAML ↔ JSON Converter~~
9. ~~Diff Checker~~
10. ~~HTML Entity Encoder~~

## 阶段四：判断（第3个月）

| 指标                     | 达标 | 动作                           |
| ------------------------ | ---- | ------------------------------ |
| 日均搜索点击 > 100       | 是   | 接 AdSense，继续扩充           |
| 日均搜索点击在涨但 < 100 | 是   | 继续，SEO 还在爬坡             |
| 流量完全没增长           | 否   | 分析原因，考虑换细分方向或停止 |

## 给 Codex 的技术要求

```
项目名: finchdev
技术栈: Vue 3 + Vite + Vue Router + Tailwind CSS + vite-ssg
部署: Cloudflare Pages（静态站）
语言: 英文界面
要求:
- 每个工具一个独立 .vue 文件
- 所有计算纯前端，不需要后端
- 响应式布局，支持移动端
- 暗色模式
- 每个页面有独立 SEO meta（title, description）
- 自动生成 sitemap.xml
- 首页展示所有工具卡片列表
```

## 成本

| 项目              | 费用    |
| ----------------- | ------- |
| 域名 finchdev.com | ~$10/年 |
| Cloudflare Pages  | 免费    |
| Umami 统计        | 免费    |
| 总计              | ~$10/年 |
