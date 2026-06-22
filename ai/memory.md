# AI Memory

## Project Structure Map

### App Source

`src/`

```text
main.ts                         # 应用入口：注册 Pinia、Router、Ant Design Vue，并加载 access 守卫
App.vue                         # 根组件：加载基础布局
access.ts                       # 全局路由守卫：首次拉取登录用户，限制 /admin
router/index.ts                 # 页面路由表：首页、登录注册、图片和后台页面
request.ts                      # axios 封装：统一返回 response.data，保留 Cookie
stores/useLoginUserStore.ts     # 当前登录用户 Pinia store
layouts/BasicLayout.vue         # 顶部导航、内容区、底部链接布局
components/GlobalHeader.vue     # 顶部菜单、登录态展示、退出登录和管理员菜单可见性
components/PictureUpload.vue    # 文件上传与 URL 导入组件，创建/编辑图片共用
pages/HomePage.vue              # 公开图片列表、搜索、分类和标签筛选
pages/AddPicturePage.vue        # 图片创建/编辑页：上传后编辑元数据
pages/PictureDetailPage.vue     # 图片详情页：作者/管理员编辑删除入口
pages/admin/UserManagePage.vue  # 后台用户管理
pages/admin/PictureManagePage.vue # 后台图片审核、删除、批量导入
service/api/                    # OpenAPI 生成的接口函数和类型
```

### Root Project Files

`./`

```text
AGENTS.md                       # 仓库 agent 规则，修改前必读
package.json                    # npm 脚本、依赖和 Node engine
vite.config.ts                  # Vite 配置，开发代理 /api -> http://localhost:8123
logs/                           # 实质修改日志；按月和自然周归档
logs/questions/                 # 纯问答/只读检查日志；与修改日志分离
MEMORY.md                       # 旧根目录记忆快照；后续优先维护 ai/memory.md
```

## Project Conventions

- Vue 3 + Vite + TypeScript 前端；UI 用 Ant Design Vue，路由用 Vue Router，登录用户状态用 Pinia。
- 请求统一走 `src/request.ts` 和 `src/service/api/`；生成接口优先用 `npm run openapi` 更新。
- 后端登录态是 Session，不是 token；`withCredentials: true` 必须保留，开发期浏览器请求 `/api/**` 由 Vite 代理到 `http://localhost:8123`。
- 后端业务值先查后端或 OpenAPI；当前前端管理员判断使用 `userRole === 1`。
- 只读 ESLint 用 `npx eslint .`；`npm run lint` 会自动修复文件。

## User Preferences

- 用户说“读取当前项目”或“检查当前项目”时，默认做只读检查并给简洁结论，不主动改业务代码。
- 遵守 `AGENTS.md` 日志规则：纯问答写 `logs/questions/`，实质文件修改写 `logs/`。

## Current Feature State

- 已有流程：图片列表/搜索/筛选、详情、文件上传、URL 导入、创建/编辑/删除、登录/注册/退出、后台用户管理、图片审核和批量导入。
- 2026-06-09 日志记录：类型检查、Vite 构建和单元测试通过；ESLint 与 npm audit 仍有待处理问题；E2E 仍偏模板用例。
- 当前目录像源码归档副本，`git status` 不可用。

## Known Constraints

- `src/service/api/` 多数为生成代码，避免大面积手改。
- 中文源码和文案按 UTF-8 处理，不要因终端编码显示误判损坏。
- `dayjs` 与 `@ant-design/icons-vue` 有直接 import，但未在 `package.json` 直接声明；依赖清理前要核实。

## Known Risks

- 登录成功后尚未完整消费 `redirect` 参数。
- 角色值、审核状态等后端语义改动前必须核对后端定义。
- 依赖审计曾提示 `@umijs/openapi -> mockjs` 链路风险，可能需要手动评估。

## Related Projects

- 后端项目位于 `/Users/gjx/Desktop/git/tuku1`；历史 Windows 路径通常为 `E:/JSProjects/tuku1`。

## Last Updated

2026-06-11 13:17:08 Asia/Shanghai
