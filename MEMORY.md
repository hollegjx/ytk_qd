# 项目记忆

本文件记录当前项目的长期上下文，供后续 agent 或协作者快速接手。具体执行规范仍以 `AGENTS.md` 为准；本文件只做项目状态和实践要点的补充。

## 项目概况

- 项目名称：`qd_tuku`
- 项目类型：Vue 3 + Vite + TypeScript 前端项目
- 主要 UI：Ant Design Vue
- 路由：Vue Router
- 全局状态：Pinia，当前登录用户状态在 `src/stores/useLoginUserStore.ts`
- 请求封装：`src/request.ts`
- API 服务：`src/service/api/`，多数文件由 OpenAPI 生成
- 对应后端：通常位于 `E:/JSProjects/tuku1`；当前机器上也存在相邻目录 `../tuku1`

## 核心约定

- 后端登录态基于服务端 Session，不是 token。
- 前端 axios 实例必须保留 `withCredentials: true`，避免登录态 Cookie 丢失。
- 开发环境浏览器请求 `/api/**`，由 `vite.config.ts` 代理到 `http://localhost:8123`。
- 不要在业务代码中混用 `localhost` 和 `127.0.0.1` 作为接口主机。
- 修改后端业务语义相关的前端逻辑时，先查后端 enum、constant、DTO、VO、Controller 或 OpenAPI 文档，不凭猜测写枚举和状态码。
- `src/service/api/` 下生成代码除非必要，不做大面积手改；优先通过 `npm run openapi` 重新生成。

## 目录速览

- `src/main.ts`：应用入口，注册 Pinia、Router、Ant Design Vue，并加载权限守卫。
- `src/App.vue`：应用根组件，加载当前登录用户并渲染基础布局。
- `src/access.ts`：全局路由权限守卫，目前主要限制 `/admin` 页面仅管理员访问。
- `src/router/index.ts`：页面路由配置。
- `src/layouts/BasicLayout.vue`：基础布局，包含顶部导航、内容区和底部链接。
- `src/components/GlobalHeader.vue`：顶部菜单、登录状态、退出登录入口。
- `src/components/PictureUpload.vue`：图片文件上传和 URL 导入组件。
- `src/pages/HomePage.vue`：公开图片列表、搜索、分类和标签筛选。
- `src/pages/AddPicturePage.vue`：创建/编辑图片页面。
- `src/pages/PictureDetailPage.vue`：图片详情、编辑和删除入口。
- `src/pages/admin/UserManagePage.vue`：后台用户管理。
- `src/pages/admin/PictureManagePage.vue`：后台图片审核、删除和批量导入。

## 常用命令

- 安装依赖：`npm install`
- 启动开发服务：`npm run dev`
- 类型检查：`npm run type-check`
- 生产构建：`npm run build`
- 仅 Vite 构建：`npm run build-only`
- 单元测试：`npm run test:unit`
- E2E 测试：`npm run test:e2e`
- 只读 ESLint 检查：`npx eslint .`
- OpenAPI 生成：`npm run openapi`

注意：`npm run lint` 会带 `--fix` 自动修改文件；只检查时优先用 `npx eslint .`。

## 当前状态记录

- 2026-06-09 的检查记录显示：类型检查、生产构建和单元测试通过。
- 2026-06-09 的检查记录显示：ESLint 仍有未使用变量、显式 `any`、生成文件 `@ts-ignore` 相关问题。
- 2026-06-09 的检查记录显示：依赖审计报告存在漏洞，需要后续评估修复。
- E2E 测试仍偏模板用例，不能直接代表当前业务流程质量。
- 当前源码目录像是归档后的源码目录，执行 `git status` 曾返回不是 Git 仓库。
- `dist/`、`node_modules/` 当前存在；前者视为构建产物，后者可重新安装生成。

## 后续开发注意

- 登录页当前登录成功后默认跳转首页，未完全消费 `redirect` 参数；如果优化登录拦截体验，可优先处理这里。
- 管理员权限目前在前端按 `userRole === 1` 判断；涉及角色定义时应以后端为准。
- 后台图片审核状态当前按 `0=待审核`、`1=通过`、`2=拒绝` 使用；修改前应核对后端枚举。
- 上传、URL 导入、批量导入、审核等功能已在前端接入接口，但涉及后端服务时仍需本地联调确认。
- 模板残留文件包括 `README.md`、`src/views/*`、`HelloWorld` 测试和部分欢迎组件；清理前确认是否仍被引用。

## 日志要求

- 实质修改仓库文件后，必须更新 `logs/<月份>/YYYY-MM-DD_to_YYYY-MM-DD.md`。
- 纯提问、解释、只读检查且不改业务文件时，更新 `logs/questions/<月份>/YYYY-MM-DD_to_YYYY-MM-DD.md`。
- 本文件属于仓库文档；修改本文件时按修改日志规则记录。
