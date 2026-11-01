# Stud1sm_OUTbreak

一间全屏网页自习室：陪你学习、记录时长、看图答疑，并在合适的时机主动带来与学习相关的建议和灵感。

当前处于**设计与前端预览阶段**：欢迎页与账号页面已完成并可运行，真实认证、邮件、自习室核心业务待开发。完整需求见 [PRD.md](PRD.md)，任务清单见 [TODO.md](TODO.md)。

## 仓库结构

| 路径 | 内容 |
| --- | --- |
| [PRD.md](PRD.md) | 产品需求文档 v0.22：已确认需求、功能规则、验收标准、技术方案 |
| [TODO.md](TODO.md) | 开发任务与已确认方向清单 |
| [web/](web/) | React + Vite 前端：欢迎页与账号页面 |
| [references/](references/) | 角色画风参考图（原创角色设计依据） |

## 本地运行

```sh
cd web
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # 产物输出到 web/dist/
```

## 已完成的前端

- **粒子欢迎页**：React Bits `Particles` 组件（WebGL2），支持暂停与减少动态
- **描边标题**：React Bits `StrokeText`（gsap），单行 `Stud1sm | OUTbreak`，挂载描边动画 + 左向填充 + 悬停重描，竖线与小字破折号运行时精确对齐
- **玻璃按钮**：React Bits `SpecularButton`（WebGL2 描边光），LOG IN 与全部表单提交按钮
- **账号页面**：登录 / 注册 / 找回密码，含表单校验与错误焦点处理；仅本地校验，认证服务未接入
- **响应式**：移动端、矮屏、`prefers-reduced-motion` 降级均已适配

## 技术栈

React 19 + Vite 8 · gsap（描边动画）· 原生 WebGL2（粒子与按钮光效，无图形库依赖）· Noto Sans SC / Outfit

## 路线图

M0 素材与设计 → M1 房间与计时 → M2 拍照答疑 → M3 主动学习搭档 → M4 公开发布。详见 PRD 第 11 节。
