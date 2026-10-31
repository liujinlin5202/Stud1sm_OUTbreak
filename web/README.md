# Stud1sm OUTbreak · Welcome

React + Vite 的欢迎页与账号页面。粒子背景使用 React Bits `Particles`，标题使用 `StrokeText`（gsap 描边动画），按钮使用 `SpecularButton`（WebGL2 边缘光）。

## 本地运行

```sh
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

`package-lock.json` 固定安装版本。

## 页面

- `/`：粒子欢迎页。小字「S属性大爆发——STUDY!!」，描边标题 `Stud1sm | OUTbreak`（不换行、居中，竖线与上方破折号运行时对齐），LOG IN 玻璃按钮
- `/login`：邮箱、密码、密码显示切换、注册及找回入口
- `/register`：邮箱、密码、确认密码及表单校验
- `/forgot-password`：密码找回页面及邮箱校验

## 组件（src/components/）

- `Particles`：React Bits WebGL2 粒子背景，白粒子 200 / 视差 / 可暂停
- `StrokeText`：SVG 描边文字，gsap 驱动逐字绘制、填充擦入、悬停重描；`prefers-reduced-motion` 时直接呈现完成态
- `SpecularButton`：玻璃拟态按钮，WebGL2 着色器绘制跟随鼠标的边缘光；每个实例占用一个 WebGL2 上下文，仅用于主行动按钮

## 当前功能边界

页面与前端交互已完成并经生产构建与浏览器检查。**尚未接入认证后端或邮件服务**：提交只执行本地校验，随后明确提示服务尚未开放；不发送、保存账号信息或伪造登录、注册及邮件成功。

## 后续接入

在 `src/main.jsx` 的 `AuthForm.submit` 接入真实认证服务，并移除当前预览提示。身份与权限校验在服务端完成，成功登录后才导航到真正的自习室页面（见根目录 PRD.md）。
