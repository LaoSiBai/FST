# DCDE·time 白屏问题检查报告

**日期**: 2026-06-17  
**分支**: `4班` (与 `origin/4班` 同步)  
**项目**: React 19 + Vite 8 + TypeScript 6 + Tailwind CSS 3

---

## 一、根因总结

白屏由 **TypeScript 编译失败导致构建产物未更新** 引起。页面实际加载的是旧 dist 产物，与源码不一致。

`tsc -b` 实测结果（2 个错误）：

```
src/components/BackgroundGradient.tsx(3,10): error TS1484: 'CityConfig' is a type
  and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.

src/components/BottomControls.tsx(9,18): error TS1484: 'CityConfig' is a type
  and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
```

因为 `package.json` 的 build 脚本是 `tsc -b && vite build`，tsc 失败后 vite build 不会执行，`dist/` 目录停留在旧提交（`b5ca922`）的状态。

---

## 二、故障链路

```
源码修改 (新增 cities.ts, skyPhysics.ts)
    │
    ├─ BackgroundGradient.tsx (修改)
    │     └─ import { CityConfig } from '../data/cities'   ← ❌ 未用 import type
    │
    ├─ BottomControls.tsx (修改)
    │     └─ import { CITIES, CityConfig } from '../data/cities'   ← ❌ CityConfig 未用 import type
    │
    ▼
npm run build → tsc -b → 编译失败
    │
    ▼
dist/ 未更新，仍是旧代码产物 (index-DNYtSOix.js, index-n00WtJsi.css)
    │
    ▼
浏览器加载旧 JS →
    旧代码中 BackgroundGradient 没有 city prop
    旧代码中没有 CITIES/cities.ts/skyPhysics.ts
    App.tsx 传入了新 props，与旧组件签名不匹配
    │
    ▼
运行时异常 → 白屏
```

---

## 三、涉及文件清单

### 3.1 有语法错误的文件（必须修复）

| 文件 | 行号 | 问题 |
|------|------|------|
| `src/components/BackgroundGradient.tsx` | 3 | `import { CityConfig }` → 应为 `import type { CityConfig }` |
| `src/components/BottomControls.tsx` | 9 | `import { CITIES, CityConfig }` → 应拆分为 `import { CITIES }` + `import type { CityConfig }` |

### 3.2 修改但无语法错误的文件

| 文件 | 状态 | 说明 |
|------|------|------|
| `src/App.tsx` | M (已修改) | 新增 `city` state 与城市选择逻辑，使用 `CITIES` |
| `src/index.css` | M (已修改) | 新增城市选择器相关样式 |

### 3.3 新增但未暂存的文件

| 文件 | 说明 |
|------|------|
| `src/data/cities.ts` | 城市经纬度数据，导出 `CityConfig` interface 与 `CITIES` 数组 |
| `src/utils/skyPhysics.ts` | 基于太阳高度角的 Oklch 天空渐变物理模型，替代旧的 `gradients.ts` |
| `build_check.js` | 构建检查工具脚本 |

### 3.4 已废弃但未删除的旧文件

| 文件 | 原因 |
|------|------|
| `src/data/gradients.ts` | 旧的时间-颜色映射表，已被 `skyPhysics.ts` 替代，无任何导入引用 |
| `src/utils/color.ts` | 旧的 RGB 颜色插值工具，已被 `skyPhysics.ts` 的 Oklch 工具替代 |
| `src/utils/easing.ts` | 旧的缓动函数，已被 `skyPhysics.ts` 内联缓动替代 |

---

## 四、tsconfig 严格配置说明

`tsconfig.app.json` 中导致编译失败的关键配置项：

```jsonc
{
  "compilerOptions": {
    "verbatimModuleSyntax": true,   // ← 强制 import type 语法
    "noUnusedLocals": true,         // 未使用的局部变量报错
    "noUnusedParameters": true,     // 未使用的参数报错
    "erasableSyntaxOnly": true      // 禁止 enum/namespace 等运行时语法
  }
}
```

`verbatimModuleSyntax: true` 要求：**任何仅用于类型标注的导入，必须使用 `import type` 语法**，否则编译失败。

---

## 五、dist 产物分析

当前 `dist/` 目录内容：

```
dist/
├── index.html          # 引用 ./assets/index-DNYtSOix.js
├── assets/
│   ├── index-DNYtSOix.js    ← 旧构建产物，不含 cities/skyPhysics 模块
│   └── index-n00WtJsi.css   ← 旧构建产物
├── favicon.svg
└── icons.svg
```

该 dist 来自提交 `b5ca922`（替换 IconPark 为 RemixIcon），不包含：
- `CITIES` 数组与 `CityConfig` 类型
- `skyPhysics.ts` 的物理天空模型
- `App.tsx` 中的城市选择逻辑
- `BottomControls.tsx` 中的城市选择器 UI

---

## 六、修复步骤（如需修复）

1. `src/components/BackgroundGradient.tsx:3` — 将 `import { CityConfig }` 改为 `import type { CityConfig }`
2. `src/components/BottomControls.tsx:9` — 拆分为两行：`import { CITIES } from '../data/cities';` + `import type { CityConfig } from '../data/cities';`
3. 运行 `npm run build` 验证编译通过并生成新 dist
4. （可选）清理废弃文件：`gradients.ts`、`color.ts`、`easing.ts`

---

## 七、附录：git 状态

```
On branch 4班 (up to date with origin/4班)

Changes not staged for commit:
  modified:   src/App.tsx
  modified:   src/components/BackgroundGradient.tsx
  modified:   src/components/BottomControls.tsx
  modified:   src/index.css

Untracked files:
  build_check.js
  src/data/cities.ts
  src/utils/skyPhysics.ts
```

最近 5 次提交：

```
b5ca922 style: replace IconPark with RemixIcon for better design consistency
6504711 style: replace material icons with domestic open source IconPark
a4bdb9e fix: enable debug mode in production and prevent text selection on double tap
4ce35e3 feat: add double tap to toggle debug mode for mobile
49db7c5 chore: format and lint fixes
```
