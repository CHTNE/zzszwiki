# 枣庄三中校园指南 Wiki

基于 Vite、React 和 TypeScript 的响应式校园 Wiki，支持明暗主题、Markdown 自动路由、全文搜索与页内目录。

## 开始使用

```bash
corepack enable
pnpm install
pnpm dev
```

生产构建：

```bash
pnpm build
pnpm preview
```

## 新增文档

先在 `docs/categories.json` 中配置分类目录、中文名称和侧边栏顺序：

```json
{
  "campus-life": {
    "name": "校园生活",
    "order": 2
  }
}
```

然后在对应的分类目录中新建 Markdown 文件，例如
`docs/campus-life/club-guide.md`：

```md
---
title: 文档标题
description: 一句话摘要
order: 10
updated: 2026-07-17
---

正文内容……
```

目录结构会成为分类和访问路径。例如上面的文件属于“校园生活”，对应
`/docs/campus-life/club-guide`。`categories.json` 中的 `order` 决定分类在侧边栏中的顺序，
Markdown frontmatter 中的 `order` 决定文章在分类内部的顺序。保存后，文档会自动进入侧栏、
路由和搜索结果，无需在代码中注册。

## 项目命令

- `pnpm dev`：启动本地开发服务器
- `pnpm build`：运行 TypeScript 检查并构建生产版本
- `pnpm lint`：运行 ESLint
- `pnpm preview`：预览生产构建

`public/_redirects` 为支持该规则的静态托管平台配置了 SPA 路由回退。使用其他服务器时，请将未知路径重写到 `index.html`。
