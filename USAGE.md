# Obsidian 代码片段插件使用指南

## 快速开始

### 1. 安装插件

有两种方式安装插件：

#### 方式一：!动安装（推荐）
1. 将整个插件文件夹复制到您的 Obsidian vault 的 `.obsidian/plugins/` 目录
2. 文件夹结构应该是：`YourVault/.obsidian/plugins/code-snippets/`
3. 在 Obsidian 中，打开 `设置 > 第三方插件`
4. 找到 "Code Snippets" 插件并启用它

#### 方式二：开发模式
1. 在您的 vault 的 `.obsidian/plugins/` 目录中创建 `code-snippets` 文件夹
2. 将所有插件文件复制到该文件夹
3. 重启 Obsidian 并启用插件

### 2. 基本使用

#### 触发代码片段
Obsidian的Tab键有特殊用途（创建引用、缩进等），所以我们提供了多种触发方式：

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

**手动触发模式：**
```
1. 输入：func
2. 按 Ctrl+Space（Windows）或 Cmd+Space（Mac）
3. 选择片段并确认
4. 展开为完整代码，光标定位在第一个占位符
```

## 内置代码片段

### JavaScript/TypeScript
- `func` → 函数模板
- `arrow` → 箭头函数
- `class` → 类模板
- `try` → try-catch 语句
- `for` → for 循环

### Python
- `class` → 类模板
- `def` → 函数模板
- `if` → if 条件语句
- `while` → while 循环
- `try` → try-except 语句

### Markdown
- `code` → 代码块
- `table` → 表格模板
- `note` → Obsidian 笔记模板
- `link` → 链接模板

## 管理代码片段

### 打开片段管理器
1. 使用命令面板（`Ctrl/Cmd + P`）
2. 搜索并运行 "打开代码片段管理器"
3. 或者在设置页面点击 "打开管理器" 按钮

### 创建新片段
1. 在管理器中点击 "新建片段"
2. 填写以下信息：
   - **片段名称**：显示名称
   - **触发前缀**：触发词（可多个，用逗号分隔）
   - **描述**：片段说明
   - **作用域**：适用语言（可选）
   - **片段内容**：实际代码/文本

### 片段语法

#### 占位符
- `${1}` - 第一个占位符
- `${2:默认值}` - 带默认值的占位符
- `${1:函数名}` - 带提示的占位符

#### 特殊变量
- `{{date}}` - 当前日期 (2024-01-15)
- `{{time}}` - 当前时间 (14:30:25)
- `{{datetime}}` - 完整日期时间
- `{{year}}` - 当前年份
- `{{month}}` - 当前月份
- `{{day}}` - 当前日期

### 片段示例

#### 简单片段
```json
{
  "name": "控制台输出",
  "prefix": "log",
  "body": "console.log(${1:message});",
  "description": "JavaScript 控制台输出"
}
```

#### 多行片段
```json
{
  "name": "Vue 组件",
  "prefix": "vue",
  "body": [
    "<template>",
    "  <div class=\"${1:component-name}\">",
    "    ${2:<!-- 内容 -->}",
    "  </div>",
    "</template>",
    "",
    "<script>",
    "export default {",
    "  name: '${3:ComponentName}',",
    "  data() {",
    "    return {",
    "      ${4:// 数据}",
    "    }",
    "  }",
    "}",
    "</script>"
  ],
  "description": "Vue 单文件组件模板"
}
```

#### 带作用域的片段
```json
{
  "name": "Python 类",
  "prefix": "class",
  "body": [
    "class ${1:ClassName}:",
    "    \"\"\"${2:类描述}\"\"\"",
    "    ",
    "    def __init__(self${3:, args}):",
    "        \"\"\"${4:构造函数}\"\"\"",
    "        ${5:pass}"
  ],
  "scope": ["python"],
  "description": "Python 类模板"
}
```

## 设置选项

### 基本设置
- **启用代码片段**：开启/关闭插件功能
- **触发模式**：
  - `自动触发`：输入时自动显示建议（推荐）
  - `手动触发`：按 Ctrl/Cmd+Space 触发
  - `Tab键触发`：按 Tab 键触发（可能与Obsidian功能冲突）
- **显示片段预览**：在建议中显示代码预览
- **启用模糊匹配**：允许不连续字符匹配
- **最大建议数量**：同时显示的建议数量

### 高级设置
- **自定义片段路径**：设置片段文件存储位置
- **启用使用统计**：记录使用次数用于智能排序

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + Space` | 手动触发代码片段（推荐） |
| `Ctrl/Cmd + Shift + Space` | 强制显示片段建议列表 |
| `Tab` | 跳转到下一个占位符 |
| `Shift + Tab` | 跳转到上一个占位符 |
| `Tab` | 触发片段展开（仅在Tab模式下，谨慎使用） |
| `Ctrl/Cmd + P` | 打开命令面板 |

## 导入导出

### 导出片段
1. 在设置页面点击 "导出片段"
2. 片段将保存为 JSON 文件到 vault 根目录
3. 文件名格式：`snippets-export-YYYY-MM-DD.json`

### 导入片段
1. 在设置页面点击 "导入片段"
2. 选择之前导出的 JSON 文件
3. 片段将添加到当前片段库

### 片段文件格式
```json
[
  {
    "id": "unique-id",
    "name": "片段名称",
    "prefix": ["trigger1", "trigger2"],
    "body": ["行1", "行2", "行3"],
    "description": "片段描述",
    "scope": ["javascript", "typescript"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "usageCount": 5
  }
]
```

## 常见问题

### Q: 片段不触发怎么办？
**A:** 检查以下项目：
1. 插件是否已启用
2. 触发模式设置是否正确
3. 前缀拼写是否正确
4. 是否在正确的作用域内

### Q: 如何自定义触发键？
**A:** 在设置中更改 "触发模式"：
- **自动触发**：最方便，输入时自动显示建议
- **手动触发**：按 Ctrl/Cmd+Space，不干扰其他功能
- **Tab键触发**：传统方式，但可能与Obsidian的Tab功能冲突

### Q: Tab键与Obsidian功能冲突怎么办？
**A:** 推荐使用以下方案：
1. 切换到"自动触发"模式（最推荐）
2. 或使用"手动触发"模式，按 Ctrl/Cmd+Space
3. 插件已智能避开列表和引用环境中的Tab键冲突

### Q: 占位符跳转不工作？
**A:** 确保：
1. 在片段展开后立即按 Tab
2. 没有移动光标到其他位置
3. 片段语法正确（${1}, ${2} 等）

### Q: 如何备份我的片段？
**A:** 两种方法：
1. 使用 "导出片段" 功能
2. 直接备份 `.obsidian/snippets.json` 文件

### Q: 支持从 VSCode 导入片段吗？
**A:** 目前需要手动转换格式。VSCode 片段格式稍有不同，需要调整 JSON 结构。

## 高级技巧

### 1. 创建动态片段
```json
{
  "name": "日期标题",
  "prefix": "date-title",
  "body": "# ${1:标题} - {{date}}\n\n${2:内容}",
  "description": "带日期的标题"
}
```

### 2. 多语言片段
```json
{
  "name": "注释块",
  "prefix": "comment",
  "body": [
    "/**",
    " * ${1:描述}",
    " * @author ${2:作者}",
    " * @date {{date}}",
    " */"
  ],
  "scope": ["javascript", "typescript", "java"],
  "description": "多行注释块"
}
```

### 3. 条件片段
```json
{
  "name": "React 组件",
  "prefix": "rc",
  "body": [
    "import React from 'react';",
    "",
    "interface ${1:ComponentName}Props {",
    "  ${2:// props}",
    "}",
    "",
    "const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = (${3:props}) => {",
    "  return (",
    "    <div>",
    "      ${4:// JSX content}",
    "    </div>",
    "  );",
    "};",
    "",
    "export default ${1:ComponentName};"
  ],
  "scope": ["typescript", "typescriptreact"],
  "description": "React TypeScript 组件"
}
```

## 开发者信息

如果您在使用过程中遇到问题或有功能建议，欢迎：
- 查看插件设置中的帮助信息
- 检查 Obsidian 开发者控制台的错误信息
- 备份重要数据后尝试重启插件

祝您使用愉快！🎉
