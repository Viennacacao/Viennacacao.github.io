# 摄影作品集网站 · 开发说明

本项目的 React 应用代码位于仓库的 `app/` 目录内，使用 **React + TypeScript + Vite** 与 **Tailwind CSS / shadcn/ui / GSAP** 搭建，配合根目录的 `tech-spec.md` 作为整体技术规范文档。

## 项目结构（简要）

```text
Viennacacao.github.io/
├── app/                 # 前端代码（Vite 项目根目录）
│   ├── src/             # 业务代码
│   ├── public/          # 静态资源
│   ├── index.html
│   └── package.json
└── tech-spec.md         # 技术规范与动效设计文档
```

更多详细结构与动效规划见根目录的 `tech-spec.md`。

## 环境要求

- Node.js 18+
- npm 9+（或兼容的 pnpm / yarn）

## 安装依赖

在仓库根目录下进入 `app` 后安装：

```bash
cd app
npm install
```

## 开发环境启动

```bash
cd app
npm run dev
```

默认通过 Vite 启动开发服务器（一般为 http://localhost:5173）。

## 图片优化（本地生成）

为了提升加载速度，本项目会在启动开发环境与构建前自动生成优化图片：

- 原图目录：`app/public/images/`
- 生成目录：`app/public/images/optimized/`（不提交到 Git）
- 生成内容：WebP + 多尺寸（供 `<picture>` + `srcset/sizes` 使用）

### 更换图片后如何生效

页面实际使用的是 `app/public/images/optimized/` 下生成的文件，因此只修改 `app/dist/` 里的图片不会生效。

当你替换了 `app/public/images/*.jpg/png`（文件名不变）后，执行：

```bash
cd app
touch public/images/avatar.jpg
rm -f public/images/optimized/avatar-*.webp public/images/optimized/avatar-*.jpg public/images/optimized/avatar-*.png
npm run images:optimize
```

如需同步到生产构建再执行：

```bash
cd app
npm run build
```

如果浏览器仍显示旧图，做一次硬刷新（Cmd+Shift+R / Ctrl+Shift+R）。

当你批量替换/删除了很多图片时，推荐直接全量重建 optimized：

```bash
cd app
npm run images:rebuild
```

如果只是删除了图片文件，希望把已生成但不再需要的 optimized 一并清理，可执行：

```bash
cd app
npm run images:optimize
```

如需手动生成（新增/替换图片后可执行一次）：

```bash
cd app
npm run images:optimize
```

## 生产构建与预览

```bash
cd app

# 生产构建
npm run build

# 本地预览构建结果
npm run preview
```

## 常见问题

### npm run preview 报 esbuild 版本不匹配

如果出现类似错误：

```text
Cannot start service: Host version "x.y.z" does not match binary version "x.y.z"
```

按以下方式修复：

```bash
cd app
npm ci
```

如仍未解决，可尝试：

```bash
cd app
npm rebuild esbuild
```

## 相关文档

- 技术规范与动画规划：根目录 [tech-spec.md](../tech-spec.md)
- Vite 官方文档：https://vite.dev/
- React 文档：https://react.dev/
