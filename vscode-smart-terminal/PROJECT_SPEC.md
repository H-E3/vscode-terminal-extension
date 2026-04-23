# VS Code Smart Terminal - 项目开发规格说明书

## 1. 项目概述

### 1.1 项目目的
VS Code Smart Terminal 是一个现代化的终端扩展，旨在为 VS Code 提供更智能、更强大的终端体验。该扩展采用块级架构设计，支持命令历史记录管理和目录同步等高级功能。

### 1.2 功能特点
- 基于 Webview 的现代化终端界面
- 使用 Xterm.js 提供强大的终端功能
- 块级命令管理架构
- 命令历史记录持久化
- 目录同步功能
- 多 Shell 集成支持
- 支持快捷键 (Ctrl+Shift+O / Cmd+Shift+O)

---

## 2. 技术架构

### 2.1 整体架构
项目采用前端（Webview）+ 后端（VS Code Extension）的双层架构：
- **后端**：使用 TypeScript 开发，负责 VS Code API 交互、资源管理和业务逻辑
- **前端**：使用 TypeScript + Xterm.js 开发，通过 Webview 提供终端用户界面
- **通信**：通过 VS Code Webview 的消息传递机制进行前后端通信

### 2.2 技术栈选择

| 技术类别 | 技术选型 | 版本 | 用途 |
|---------|---------|------|------|
| 核心语言 | TypeScript | ^5.0.0 | 主要开发语言 |
| 运行环境 | Node.js | ^18.0.0 | 运行时环境 |
| VS Code API | @types/vscode | ^1.74.0 | VS Code 扩展开发 |
| 终端库 | xterm | ^5.3.0 | 终端渲染核心 |
| 终端插件 | xterm-addon-fit | ^0.8.0 | 终端自适应布局 |
| 终端插件 | xterm-addon-webgl | ^0.16.0 | 硬件加速渲染 |
| 构建工具 | webpack | ^5.88.0 | Webview 代码打包 |
| 加载器 | ts-loader | ^9.4.4 | TypeScript 加载器 |
| 测试框架 | mocha | ^10.0.0 | 单元测试 |
| 依赖管理 | npm | - | 包管理 |

---

## 3. 模块设计

### 3.1 模块概览

```
src/
├── extension.ts              # 扩展主入口
├── terminalManager.ts        # 终端管理器
├── blockManager.ts           # 命令块管理器
├── historyManager.ts         # 历史记录管理器
├── directorySync.ts          # 目录同步
├── shellIntegration.ts       # Shell 集成
├── webview/
│   └── webview.ts            # Webview 前端代码
└── test/
    ├── blockManager.test.ts  # 块管理器测试
    ├── shellIntegration.test.ts # Shell 集成测试
    └── runTest.ts            # 测试运行器
```

### 3.2 核心模块详解

#### 3.2.1 Extension 模块 (`extension.ts`)
- **职责**：扩展的主入口点，负责初始化和注册命令
- **主要功能**：
  - 激活扩展 (`activate`)
  - 注册 `smart-terminal.open` 命令
  - 初始化 `TerminalManager` 和 `DirectorySync`
  - 清理资源 (`deactivate`)
- **依赖**：`vscode`, `TerminalManager`, `DirectorySync`

#### 3.2.2 Terminal Manager 模块 (`terminalManager.ts`)
- **职责**：管理 Webview 面板和终端生命周期
- **主要功能**：
  - 创建和显示 Webview 面板
  - 生成 Webview HTML 内容
  - 处理 Webview 消息通信
  - 管理资源 URI 转换
- **依赖**：`vscode`, `path`, `HistoryManager`
- **关键接口**：
  - `openSmartTerminal()`: 打开/显示终端面板
  - `getWebviewContent()`: 生成 HTML 内容
  - `getWebviewUri()`: 转换本地资源 URI

#### 3.2.3 Block Manager 模块 (`blockManager.ts`)
- **职责**：管理终端命令块
- **主要功能**：
  - 开始/结束命令块
  - 添加命令和输出到块
  - 管理块的展开/折叠状态
  - 获取所有块或当前块
- **依赖**：`xterm`
- **数据结构**：
  ```typescript
  interface CommandBlock {
    id: string;
    command: string;
    output: string[];
    startTime: number;
    endTime?: number;
    exitCode?: number;
    isExpanded: boolean;
    startLine: number;
    endLine: number;
  }
  ```

#### 3.2.4 History Manager 模块 (`historyManager.ts`)
- **职责**：持久化和管理命令历史记录
- **主要功能**：
  - 加载历史记录从文件
  - 保存历史记录到文件
  - 添加新的命令历史
  - 查询和搜索历史记录
- **依赖**：`fs`, `path`
- **数据结构**：
  ```typescript
  interface CommandHistory {
    id: number;
    command: string;
    cwd: string;
    exitCode: number;
    duration: number;
    timestamp: number;
  }
  ```

#### 3.2.5 Directory Sync 模块 (`directorySync.ts`)
- **职责**：同步编辑器和终端的工作目录
- **主要功能**：
  - 监听活动编辑器变化
  - 同步终端到指定目录
  - 监听活动终端变化
- **依赖**：`vscode`, `path`

#### 3.2.6 Shell Integration 模块 (`shellIntegration.ts`)
- **职责**：提供 Shell 集成支持
- **主要功能**：
  - 为不同 Shell 生成集成脚本
  - 解析 Shell 转义序列
  - 支持 Bash、Zsh、PowerShell
- **Shell 类型**：Bash, Zsh, PowerShell, Generic

#### 3.2.7 Webview 模块 (`webview/webview.ts`)
- **职责**：提供终端前端界面
- **主要功能**：
  - 初始化 Xterm.js 终端
  - 处理用户输入和命令执行
  - 管理块管理器实例
  - 与后端扩展通信
- **依赖**：`xterm`, `xterm-addon-fit`, `xterm-addon-webgl`, `BlockManager`, `ShellIntegration`

---

## 4. 功能规格

### 4.1 核心功能

#### 4.1.1 打开智能终端
- **命令**：`smart-terminal.open`
- **快捷键**：`Ctrl+Shift+O` (Windows/Linux), `Cmd+Shift+O` (Mac)
- **功能**：
  - 创建新的 Webview 面板
  - 在 VS Code 侧边栏显示终端
  - 如果已存在则重新显示
- **UI**：深色主题终端界面

#### 4.1.2 终端交互
- **输入**：支持键盘输入命令
- **显示**：使用 Xterm.js 渲染终端
- **主题**：深色主题，与 VS Code 一致
- **字体**：等宽字体 (Consolas, Menlo, Monaco, "Courier New")
- **适配**：Fit Addon 自动适应容器大小
- **加速**：WebGL Addon 硬件加速渲染

#### 4.1.3 命令块管理
- **块开始**：按 Enter 键时开始新块
- **命令添加**：将当前输入命令添加到块
- **输出添加**：将命令执行输出添加到块
- **块结束**：命令执行完成后结束块
- **展开/折叠**：支持块的展开和折叠状态管理

#### 4.1.4 历史记录管理
- **持久化**：将历史记录保存到 JSON 文件
- **查询**：支持获取历史记录（带分页）
- **搜索**：支持按关键词搜索历史命令
- **限制**：最多保存 1000 条历史记录
- **存储位置**：`context.globalStoragePath`

#### 4.1.5 目录同步
- **编辑器到终端**：切换活动编辑器时同步终端工作目录
- **终端管理**：跟踪活动终端

### 4.2 Shell 集成
- **Bash**：提供 Bash 专用集成脚本
- **Zsh**：提供 Zsh 专用集成脚本
- **PowerShell**：提供 PowerShell 专用集成脚本
- **转义序列**：支持解析 OSC 633 序列

---

## 5. 开发环境配置

### 5.1 开发工具
- **编辑器**：VS Code (推荐)
- **Node.js**：^18.0.0
- **npm**：最新版本
- **TypeScript**：^5.0.0

### 5.2 依赖管理
- **安装依赖**：`npm install`
- **更新依赖**：`npm update`
- **审计安全**：`npm audit`
- **修复漏洞**：`npm audit fix` 或 `npm audit fix --force`

### 5.3 VS Code 开发配置
- **扩展开发**：安装 VS Code 扩展开发工具
- **调试配置**：使用 `.vscode/launch.json` 进行调试
- **任务配置**：使用 `.vscode/tasks.json` 配置构建任务

---

## 6. 构建和部署

### 6.1 构建流程

#### 6.1.1 编译 TypeScript
```bash
npm run compile
```
- 使用 `tsc` 编译 TypeScript 到 JavaScript
- 输出到 `out/` 目录
- 生成 Source Map 文件

#### 6.1.2 构建 Webview
```bash
npm run build:webview
```
- 使用 Webpack 打包 Webview 代码
- 输出到 `out/webview/` 目录
- 打包依赖的 Xterm.js 库
- 压缩优化输出

#### 6.1.3 完整构建
```bash
npm run vscode:prepublish
```
- 按顺序执行编译和 Webview 构建
- 用于发布前的完整构建

### 6.2 开发模式
```bash
npm run watch
```
- 监听文件变化自动重新编译
- 适合开发时使用

### 6.3 打包发布
- 使用 VS Code 扩展打包工具 (`vsce`)
- 发布到 VS Code Marketplace
- 参考：[VS Code 扩展发布文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

---

## 7. 测试策略

### 7.1 测试框架
- **框架**：Mocha
- **类型支持**：`@types/mocha`
- **运行器**：Node.js 测试运行器

### 7.2 测试覆盖
- **单元测试**：
  - `blockManager.test.ts` - 块管理器测试
  - `shellIntegration.test.ts` - Shell 集成测试
- **集成测试**：待补充
- **端到端测试**：待补充

### 7.3 测试命令
```bash
npm run pretest  # 编译测试代码
npm test         # 运行所有测试
```

### 7.4 测试最佳实践
- 每个模块都应有对应的测试文件
- 使用 AAA 模式（Arrange-Act-Assert）
- 测试应独立且可重复
- 覆盖正常和边界情况

---

## 8. 已知问题和改进建议

### 8.1 已修复问题
- ✅ 黑窗口问题 - 修复了 Webview URI 生成逻辑
- ✅ npm 安全漏洞 - 使用 overrides 升级 serialize-javascript 到安全版本
- ✅ 内容安全策略 - 添加了 CSP 头部增强安全性

### 8.2 待改进问题（详见代码复审报告）
- 资源清理需要完善
- 命令注入漏洞需要修复
- ID 生成存在竞争条件
- 错误处理需要统一
- 性能优化空间
- 缺少更完善的测试覆盖

---

## 附录

### A. 项目配置文件
- `package.json` - 项目配置和依赖
- `tsconfig.json` - TypeScript 编译配置
- `webpack.config.js` - Webpack 构建配置
- `.vscode/launch.json` - 调试配置
- `.vscode/tasks.json` - 任务配置

### B. 参考文档
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Xterm.js Documentation](https://xtermjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Webpack Documentation](https://webpack.js.org/)

---

**文档版本**：1.0  
**最后更新**：2026-04-23  
**维护者**：项目开发团队
