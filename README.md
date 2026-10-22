# 🥞 2027 Oneshot 拜年纪官方宣传及留言墙网站

<p align="center">
  <a href="https://osnewyear.fun">
    <img src="https://img.shields.io/badge/Live_Demo-osnewyear.fun-ffdb68?style=for-the-badge&logo=vercel&logoColor=black" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/Tech_Stack-Tailwind_CSS_%7C_Vue3_%7C_Supabase-11152f?style=for-the-badge" alt="Tech Stack">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</p>

> 「不管过了多久，世界机器与太阳的光芒依然闪耀。」  
> 本项目是 **OneShot** 游戏同人社区「2027 Oneshot 拜年纪」的官方宣传入口、历年观影纪念馆以及粉丝匿名留言墙。

---

## 💡 核心特性

- ⏳ **2027 实时倒计时**：首屏极简 Hero 布局，精准计算并展示距离 2027 年拜年纪首播的剩余天、时、分、秒。
- 🎬 **历年观影纪念馆 (2023 - 2027)**：
  - 收录自 2023 年首届至今共 5 届拜年纪直播全片（Bilibili 响应式嵌入）及独立单品投稿。
  - **动态背景过场 (Dynamic Transition)**：切换年份时自动呈现平滑舒缓的背景封面淡入淡出与缩放特效。
- 💬 **轻量级粉丝留言墙**：
  - 基于 Supabase Serverless 架构，支持全平台粉丝免登录匿名留言。
  - 内置防刷屏机制（10s 提交冷却控制）与文本长度限制。
- 🛡️ **隐私与安全**：完全零个人隐私信息收集，配置 Supabase 行级安全策略 (RLS) 保护数据存取。
- ⚡ **全球高速访问**：基于 Vercel & Cloudflare 双重边缘网络部署，绑定独立域名 `osnewyear.fun`，国内网络免梯直连。

---

## 🌐 线上体验

- **官方独立域名**：[https://osnewyear.fun](https://osnewyear.fun)
- **备用镜像节点**：[https://2027oneshot-website.vercel.app](https://2027oneshot-website.vercel.app){需科学上网}

---

## 🛠️ 技术栈选型

| 模块 | 选型 | 说明 |
| :--- | :--- | :--- |
| **前端架构** | HTML5 / Vue 3 (CDN) / Tailwind CSS | 响应式布局，完美适配 Mobile & PC 屏幕 |
| **视频播放** | Bilibili Iframe Embedded Player | 快速加载，无需自建视频流媒体服务器 |
| **数据库/后端** | Supabase (PostgreSQL / Serverless) | 前端直连存取留言，无中间件后端 |
| **部署托管** | Vercel + Cloudflare Pages | CI/CD 自动构建，支持 HTTPS 自动化证书 |

---

## 📂 项目目录结构

```text
2027oneshot-website/
├── index.html                 # 首页 (Hero 区 + 倒计时 + 节目单)
├── comments.html              # 粉丝互动留言墙页面
├── archive.html               # 历年观影馆 (含 2023-2027 5 年份动态切换)
├── css/
│   ├── style.css              # 全局样式与 Tailwind 配置扩展
│   └── transitions.css        # 背景平滑淡入淡出与过场特效样式
├── js/
│   ├── main.js                # 倒计时逻辑与页面交互
│   ├── archive.js             # 历年视频数据加载与背景动态切换逻辑
│   ├── supabaseClient.js      # Supabase 客户端初始化
│   └── api.js                 # 留言板 GET / POST 存取逻辑
└── assets/
    ├── logo.webp               # 网站顶栏 LOGO
    └── covers/                 # 历年拜年纪封面图库 (用于背景平滑切换)
        ├── cover-2023.jpg     # 2023 拜年纪封面
        ├── cover-2024.jpg     # 2024 拜年纪封面
        ├── cover-2025.jpg     # 2025 拜年纪封面
        └── cover-2026.jpg     # 2026 拜年纪封面
```

---

## 🗄️ 数据库建表与安全策略 (Supabase SQL)

若需部署自己的数据库实例，请在 Supabase 的 **SQL Editor** 中运行以下 SQL 初始化逻辑：

```sql
-- 1. 创建留言表
CREATE TABLE public.comments (
    id BIGSERIAL PRIMARY KEY,
    nickname VARCHAR(50) DEFAULT 'TheWorldMa',
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. 开启行级安全策略 (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 3. 配置权限：允许任何人读取与发表留言
CREATE POLICY "Allow public read comments" 
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Allow public insert comments" 
ON public.comments FOR INSERT WITH CHECK (true);
```

---

## 🚀 本地开发与构建部署

### 1. 克隆仓库
```bash
git clone git@github.com:mytesttool010-alt/2027oneshot-website.git
cd 2027oneshot-website
```

### 2. 配置 Supabase 密钥
修改 `js/supabaseClient.js`，填入你的 Supabase 项目 URL 和 API Key：
```javascript
const SUPABASE_URL = 'https://pqshgibkxezqorxeqzmw.supabase.co';
const SUPABASE_KEY = 'YOUR_PUBLISHABLE_KEY';
export const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

### 3. 本地预览
直接使用任意本地 Web 服务器打开目录（例如 VS Code 的 Live Server 扩展，或运行 `python -m http.server 8000`）。

### 4. 自动部署 (Vercel)
本项目支持 Vercel 自动化构建。只需将更改推送到 `main` 分支，Vercel 将会自动触发部署与全球 CDN 刷新：
```bash
git add .
git commit -m "feat: 更新拜年纪页面与节目单数据"
git push origin main
```

---

## 🤝 致谢与同人制作组

致谢所有参与 OneShot 拜年纪创作的同仁、画师、文案、剪辑与音乐人，以及一直陪伴著 Niko 的玩家们！

- **主催/组织**：OneShot 拜年纪同人组
- **游戏原作**：Future Cat / Degica (`OneShot`)

*★ 祝大家在新的一年里过得开心！*
