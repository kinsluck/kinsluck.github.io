# Passion in Life

Kins 的个人博客。记录动画、游戏，以及生活里的碎碎念。

线上地址：<https://kinsluck.github.io>

## 技术栈

- [Astro v5](https://astro.build) —— 静态站点生成器
- React 19（仅交互组件使用）
- TypeScript + Sass
- 主题基于开源项目 [Revista](https://github.com/chrisnmorrison/revista-astro-blog-magazine) 改造
- 部署：GitHub Actions → GitHub Pages

## 本地开发

```bash
npm install     # 安装依赖
npm run dev     # 本地预览 http://localhost:4321
npm run build   # 构建到 dist/
npm run preview # 预览构建产物
```

## 写文章

在 `src/content/posts/` 下新建 `.md` 文件，文件名即 URL slug（也可用 frontmatter 里的 `slug` 覆盖）：

```yaml
---
title: 文章标题
image: /content/<分类slug>/<文章slug>/images/cover.jpg   # 封面图
date: 2026-10-13
category: 随笔          # 随笔 / 动画 / 游戏
slug: my-post-slug      # 可选，默认用文件名
trending: false         # 首页「热门」
topPick: false          # 首页「精选文章」
popular: false          # 首页「推荐」
---

正文用 Markdown 写即可。
```

图片放在 `public/content/<分类slug>/<文章slug>/images/` 下，正文中用绝对路径引用：

```markdown
![图片说明](/content/essays/my-post-slug/images/pic.jpg)
```

> ⚠️ **中文分类注意**：`slugify` 会把中文字符全部剥离，所以中文分类必须在
> `src/utils/postHelpers.ts` 的 `CATEGORY_SLUGS` 里登记对应的英文 slug，
> 否则分类页 URL 会是空的。新增分类时记得补一条。

## 目录结构

```
src/
├── content/posts/     # 文章（Markdown）
├── components/        # UI 组件
├── layouts/           # 页面布局（BaseLayout.astro 内含站点元信息）
├── pages/             # 路由页面
├── css/               # 全局样式与变量
└── utils/             # 工具函数（分类 slug、日期格式、取文章等）
public/
├── content/           # 文章图片
├── logo.png           # 站点 Logo
└── favicon.ico
```

## 部署

推送到 `master` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布到 GitHub Pages。

## License

MIT。主题部分版权归 [Chris Morrison](https://github.com/chrisnmorrison/revista-astro-blog-magazine) 所有。
