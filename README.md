[Uploading code_artifact (1).md…]()
# 「2027Oneshot拜年纪」官方网站项目设计与开发计划书

## 1. 项目概述与核心原则
- **项目名称**：2027Oneshot 拜年纪官方宣传及留言墙网站
- **项目目标**：展示 2027 年拜年纪宣发视频、历年（2023-2027年共5届）直播回放与单品投稿在线观影馆，并提供粉丝匿名留言互动功能。
- **核心原则**：
  * **零隐私收集**：完全不收集用户敏感信息、手机号或真实身份。
  * **轻量高可用**：前端静态托管于 Vercel 全球 CDN，数据存储使用免费云端 Serverless 数据库 (Supabase)。
  * **AI 驱动全流程开发**：此文档作为主 Prompt / Context 文件投喂给 Codex / Cursor，指导代码生成与自动化部署。

---

## 2. 开发者与部署环境配置 (Environment Config)

### 2.1 Git & GitHub 绑定参数
- **GitHub 用户名**：`mytesttool010-alt`
- **开发者邮箱**：`mytesttool010@gmail.com`
- **项目仓库名称**：`2027oneshot-website`
- **远程仓库地址**：
  - **SSH (推荐)**: `git@github.com:mytesttool010-alt/2027oneshot-website.git`
  - **HTTPS**: `https://github.com/mytesttool010-alt/2027oneshot-website.git`
- **默认分支**：`main`

### 2.2 Vercel 部署托管配置
- **Vercel 用户 ID**：`KwCgms42PsZlMi7LcZL9ABbI`
- **关联仓库**：`mytesttool010-alt/2027oneshot-website`
- **自动化构建 (CI/CD)**：`main` 分支接收到 `git push` 后，由 Vercel 自动构建并更新线上 CDN。

### 2.3 Supabase 数据库凭证与 MCP 辅助配置
- **Project URL**：`https://pqshgibkxezqorxeqzmw.supabase.co`
- **Publishable Key**：`sb_publishable_mjBmSToEXhygldGf9bPqhQ_j2yxOiI3`
- **AI 交互协议**：已配置 Supabase MCP (Model Context Protocol)，允许 Codex 直接检查与验证数据库表结构。

---

## 3. 技术栈架构

| 模块 | 选型 | 说明 |
| :--- | :--- | :--- |
| **前端框架/库** | HTML5 / Vue 3 (SFC/CDN) / Tailwind CSS | 响应式布局，适配移动端与 PC 端 |
| **视频嵌入** | Bilibili Iframe Player (`bvid`) | 极速响应，无需自建视频服务器 |
| **数据库 SDK** | `@supabase/supabase-js` | 前端直连 Supabase，无中间件后端 |
| **托管平台** | Vercel | 自动部署与免费 HTTPS 证书 |
| **构建/发布流水线** | `Codex/本地` $\rightarrow$ `GitHub` $\rightarrow$ `Vercel` 自动构建上线 |  |

---

## 4. 页面路由与 UI/UX 细节设计

### 页面 1：首页 (`/index.html` 或 `/`)
- **核心组件**：
  * **顶部导航栏**：LOGO（指向首页）、历年观影馆入口、留言墙链接。
  * **英雄区（Hero Section）**：16:9 响应式视频播放器（嵌入 Bilibili 或本地视频源）。
  * **实时倒计时**：计算并显示距离 2027 年拜年纪首播的剩余天、时、分、秒。
  * **节目单与卡片展区**：展示拜年纪海报与演职员名单。

### 页面 2：留言墙 (`/comments.html` 或 `/comments`)
- **核心组件**：
  * **留言输入框**：
    * 昵称输入（预设占位符：“TheWorldMa”，可选填）
    * 留言内容 textarea（限制 200 字以内）
    * 提交按钮（带 10 秒提交冷却控制，防止刷屏）
  * **留言展示列表**：
    * 按 `created_at` 倒序排列
    * 每一个留言卡片展示：昵称、留言内容、格式化发布时间

### 页面 3：历年拜年纪与单品投稿观影馆 (`/archive.html` 或 `/archive/2023.html` 等 5 个子页面)
- **视觉设计与背景动态效果**：
  * **5 年专属封面**：提供 2023、2024、2025、2026、2027 五个年份按钮。
  * **动态背景过场（Dynamic Transition）**：使用双层固定背景叠加（CSS opacity 渐变淡入淡出或 GSAP 动画），用户点击选择不同年份时，背景封面图产生平滑舒缓的缩放与淡入淡出切换效果。
- **核心功能区**：
  * **直播全片播放器**：嵌入对应年份的 Bilibili 完整直播录像。
    * *2023 年首届*：BV 号 `BV1cy4y1d7YS`（`【[OneShot] OS 2023拜年纪 - 属于我们的第一次拜年纪】`）。
    * *2024~2027 年*：配置对应的 Bilibili BV 号与 iframe 链接。
  * **单品投稿卡片瀑布流/网格**：收录当年所有独立单品节目（如单曲、MMD、手聘动画等），点击卡片直接弹窗或切换播放器观看。

---

## 5. 数据库表结构及 RLS 安全策略 (Supabase SQL)

请在 Supabase 的 **SQL Editor** 中运行以下 SQL 脚本完成建表与权限配置：

```sql
-- 1. 创建评论表
CREATE TABLE public.comments (
    id BIGSERIAL PRIMARY KEY,
    nickname VARCHAR(50) DEFAULT 'TheWorldMa',
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. 开启行级安全策略 (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 3. 允许所有人（包括匿名游客）读取评论
CREATE POLICY "Allow public read comments" 
ON public.comments FOR SELECT 
USING (true);

-- 4. 允许所有人（包括匿名游客）发表评论
CREATE POLICY "Allow public insert comments" 
ON public.comments FOR INSERT 
WITH CHECK (true);
```

---

## 6. 静态资源与目录规范

```text
/2027oneshot-website
├── index.html                 # 首页结构
├── comments.html              # 留言墙页面
├── archive.html               # 历年拜年纪与单品投稿页面 (含 2023-2027 5年份动态切换)
├── css/
│   ├── style.css              # 全局样式与 Tailwind 引入
│   └── transitions.css        # 背景平滑淡入淡出与过场特效样式
├── js/
│   ├── main.js                # 倒计时逻辑与页面交互
│   ├── archive.js             # 历年视频数据加载与背景动态切换逻辑
│   ├── supabaseClient.js      # Supabase 客户端初始化
│   └── api.js                 # 留言的 GET / POST 存取逻辑
└── assets/
        #有很多官方插画，请随意布局使用
        #如用其他素材请自行网上查找
    ├── logo.webp               # 网站顶栏 LOGO
    └── covers/                # 历年拜年纪封面图库 (用于背景平滑切换)
        ├── cover-2023.jpg     # 2023 拜年纪封面
        ├── cover-2024.jpg     # 2024 拜年纪封面
        ├── cover-2025.jpg     # 2025 拜年纪封面
        ├── cover-2026.jpg     # 2026 拜年纪封面
        # 2027 拜年纪封面还没有
```

---

## 7. AI (Codex) 分阶段执行 Prompt 指南

1. **第一步（环境初始化）**：
   > *"请根据计划书第 6 节创建项目目录结构，并在 `js/supabaseClient.js` 中使用计划书 2.3 节的 URL 和 Publishable Key 初始化 Supabase 客户端。"*

2. **第二步（前端页面与样式）**：
   > *"请根据计划书第 4 节编写 `index.html` 与 `comments.html`，使用 Tailwind CSS 实现响应式布局与倒计时组件。"*

3. **第三步（数据读写）**：
   > *"请编写 `js/api.js`，实现提交留言到 Supabase `comments` 表以及拉取留言列表倒序渲染的功能。"*

4. **第四步（历年回顾与动态背景过场）**：
   > *"请根据计划书第 4 节与第 6 节编写 `archive.html` 和 `js/archive.js`。包含 2023-2027 五个年份的拜年纪直播与单品投稿嵌入（2023 年默认嵌入 Bilibili `BV1cy4y1d7YS`），并在用户选择不同年份时，为其背景封面添加 CSS 透明度渐变与平滑缩放的动态过场效果。"*
