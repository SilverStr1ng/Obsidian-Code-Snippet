# Obsidian 代码片段插件

一个为 Obsidian 提供类似 VSCode 代码片段功能的插件，让您能够快速插入预定义的代码模板和文本片段。

中文文档 | [English](README.md)

## 功能特性

### 🚀 核心功能
- **智能代码片段**: 支持占位符、变量和多光标位置
- **多种触发方式**: 自动触发、手动触发(Ctrl/Cmd+Space)或Tab键触发
- **模糊匹配**: 支持不连续字符匹配片段前缀
- **作用域限制**: 可为不同语言设置专用片段
- **使用统计**: 根据使用频率智能排序建议
- **大窗口管理**: 优化的管理界面，支持快捷键操作
- **响应式设计**: 适配不同屏幕尺寸

### 📝 片段语法
- `${1:defaultValue}` - 带默认值的占位符
- `${1}` - 简单占位符
- `{{date}}` - 当前日期 (YYYY-MM-DD)
- `{{time}}` - 当前时间 (HH:MM:SS)
- `{{datetime}}` - 完整日期时间
- `{{year}}` - 当前年份
- `{{month}}` - 当前月份
- `{{day}}` - 当前日期

### 🎯 内置片段
插件预装了常用的代码片段：

**JavaScript/TypeScript**
- `func` - 函数模板
- `class` - 类模板
- `arrow` - 箭头函数

**Python**
- `class` - 类模板
- `def` - 函数模板
- `if` - 条件语句

**Markdown**
- `code` - 代码块
- `table` - 表格模板
- `note` - Obsidian 笔记模板

## 安装方法

### 手动安装
1. 下载最新版本的插件文件
2. 将文件解压到 `{VaultFolder}/.obsidian/plugins/code-snippets/`
3. 在 Obsidian 设置中启用"代码片段"插件

### 从社区插件安装
1. 打开 Obsidian 设置
2. 进入"第三方插件"
3. 搜索"Code Snippets"
4. 点击安装并启用

## 使用指南

### 基本使用

#### 触发代码片段
由于Obsidian的Tab键有特殊用途（创建引用、缩进等），我们提供了多种触发方式：

**方式一：自动触发（推荐）**
1. 在编辑器中输入片段前缀，如 `func`
2. 自动显示代码片段建议列表
3. 使用方向键选择，按Enter确认

**方式二：手动触发**
1. 输入片段前缀，如 `func`
2. 按 `Ctrl+Space`（Windows）或 `Cmd+Space`（Mac）触发
3. 选择要插入的片段

**方式三：Tab键触发（谨慎使用）**
1. 在设置中启用"Tab键触发"模式
2. 输入片段前缀，如 `func`
3. 按 `Tab` 键触发（注意：可能与Obsidian的Tab功能冲突）

#### 示例：创建 JavaScript 函数

**自动触发模式（推荐）：**
```
1. 输入：func
2. 自动显示建议列表
3. 按Enter或点击选择
4. 展开为：
   function functionName(parameters) {
       // TODO: implement
       return undefined;
   }
5. 光标会定位在 "functionName"，您可以直接输入函数名
6. 按 Tab 跳转到下一个占位符 "parameters"
```

### 管理片段
1. 使用命令面板（Ctrl/Cmd + P）
2. 运行"打开代码片段管理器"命令
3. 在管理器中添加、编辑或删除片段

### 自定义片段示例

**基础片段**
```json
{
  "name": "HTML5 模板",
  "prefix": "html5",
  "body": [
    "<!DOCTYPE html>",
    "<html lang=\"zh-CN\">",
    "<head>",
    "    <meta charset=\"UTF-8\">",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
    "    <title>${1:Document}</title>",
    "</head>",
    "<body>",
    "    ${2:<!-- 内容 -->}",
    "</body>",
    "</html>"
  ],
  "description": "HTML5 文档模板"
}
```

**带变量的片段**
```json
{
  "name": "日记模板",
  "prefix": "diary",
  "body": [
    "# ${1:标题} - {{date}}",
    "",
    "## 今日计划",
    "- ${2:计划项目}",
    "",
    "## 今日总结",
    "${3:总结内容}",
    "",
    "**创建时间**: {{datetime}}"
  ],
  "description": "日记模板"
}
```

## 设置选项

| 设置项 | 说明 | 默认值 |
|--------|------|---------|
| 启用代码片段 | 开启/关闭插件功能 | 开启 |
| 触发模式 | 自动触发/手动触发/Tab键触发 | 自动触发 |
| 显示片段预览 | 在建议中显示代码预览 | 开启 |
| 启用模糊匹配 | 允许不连续字符匹配 | 开启 |
| 最大建议数量 | 同时显示的建议数量 | 10 |
| 启用使用统计 | 记录使用次数用于排序 | 开启 |

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + Space` | 手动触发代码片段（推荐） |
| `Ctrl/Cmd + Shift + Space` | 强制显示片段建议列表 |
| `Tab` | 跳转到下一个占位符 |
| `Shift + Tab` | 跳转到上一个占位符 |
| `Tab` | 触发片段展开（仅在Tab模式下，谨慎使用） |
| `Ctrl/Cmd + P` → "打开代码片段管理器" | 打开管理界面 |
| `Ctrl + N` | 新建片段（管理器内） |
| `Ctrl + S` | 保存片段（管理器内） |

## 开发信息

### 项目结构
```
obsidian-code-snippets/
├── main.ts                    # 主插件文件
├── manifest.json              # 插件清单
├── src/
│   ├── types.ts              # 类型定义
│   ├── snippet-manager.ts    # 片段管理器
│   ├── snippet-expander.ts   # 片段展开器
│   ├── settings-tab.ts       # 设置面板
│   └── snippet-manager-modal.ts # 管理界面
├── package.json
├── tsconfig.json
└── esbuild.config.mjs
```

### 构建命令
```bash
# 开发模式（监视文件变化）
npm run dev

# 生产构建
npm run build

# 版本更新
npm run version
```

### 技术栈
- **TypeScript** - 主要开发语言
- **Obsidian API** - 插件框架
- **ESBuild** - 构建工具

## 贡献指南

欢迎贡献代码！请按照以下步骤：

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -am '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建 Pull Request

### 开发环境设置
```bash
# 克隆仓库
git clone https://github.com/your-username/obsidian-code-snippets.git

# 安装依赖
npm install

# 启动开发模式
npm run dev

# 在 Obsidian 中测试
# 将项目文件夹软链接到测试 vault 的 .obsidian/plugins/ 目录
```

## 常见问题

**Q: 片段不触发怎么办？**
A: 检查插件是否启用，确认触发模式设置，验证前缀拼写是否正确。

**Q: 如何备份我的片段？**
A: 使用"导出片段"功能，或直接复制 `.obsidian/snippets.json` 文件。

**Q: 能否导入 VSCode 片段？**
A: 目前需要手动转换格式，未来版本将支持直接导入。

**Q: 占位符跳转不工作？**
A: 确保在片段展开后立即使用 Tab 键，某些情况下可能需要重新触发。

**Q: Tab键与Obsidian功能冲突怎么办？**
A: 推荐使用以下方案：
1. 切换到"自动触发"模式（最推荐）
2. 或使用"手动触发"模式，按 Ctrl/Cmd+Space
3. 插件已智能避开列表和引用环境中的Tab键冲突

**Q: 管理窗口太小不好用？**
A: 最新版本已优化管理界面，支持大窗口显示和键盘快捷键操作。

## 更新日志

### v1.0.1 (2025-08-06)
- 🔧 **修复数据持久化问题**: 用户自定义代码片段现在正确保存在插件数据目录中
- 📁 **改进数据存储**: 使用Obsidian插件标准数据存储API，确保数据安全性
- 🐛 **修复关闭按钮遮挡**: 优化管理界面布局，确保关闭按钮始终可见
- 📝 **增强日志记录**: 添加详细的保存/加载状态日志，便于问题诊断

### v1.0.0 (2025-06-29)
- 🎉 首次发布
- ✨ 基础代码片段功能
- ✨ 片段管理界面
- ✨ 多种触发模式
- ✨ 变量和占位符支持
- ✨ 导入导出功能
- ✨ 键盘快捷键支持
- ✨ 响应式设计

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 支持与反馈

- **问题报告**: [GitHub Issues](https://github.com/SilverStr1ng/Obsidian-Code-Snippet/issues)
- **功能建议**: [GitHub Discussions](https://github.com/SilverStr1ng/Obsidian-Code-Snippet/discussions)
- **邮件联系**: rakuyou63@gmail.com

---

如果这个插件对您有帮助，请考虑给项目点个 ⭐ 星标！
