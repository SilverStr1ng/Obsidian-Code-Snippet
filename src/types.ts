export interface Snippet {
  /** 片段的唯一标识符 */
  id: string;
  /** 片段名称 */
  name: string;
  /** 触发词前缀 */
  prefix: string | string[];
  /** 片段内容，支持多行 */
  body: string | string[];
  /** 片段描述 */
  description?: string;
  /** 适用的语言范围，为空表示适用于所有语言 */
  scope?: string | string[];
  /** 创建时间 */
  createdAt: string;
  /** 最后修改时间 */
  updatedAt: string;
  /** 使用次数统计 */
  usageCount?: number;
}

export interface SnippetVariable {
  /** 变量名 */
  name: string;
  /** 默认值 */
  defaultValue?: string;
  /** 可选择的值列表 */
  choices?: string[];
  /** 变量描述 */
  description?: string;
}

export interface SnippetExpansion {
  /** 原始触发文本 */
  trigger: string;
  /** 展开后的文本 */
  expandedText: string;
  /** 光标位置（相对于展开文本的开始位置） */
  cursorPositions: number[];
  /** 需要用户输入的变量 */
  variables: SnippetVariable[];
}

export interface SnippetSettings {
  /** 是否启用代码片段功能 */
  enabled: boolean;
  /** 触发模式：'auto' | 'manual' | 'tab' */
  triggerMode: 'auto' | 'manual' | 'tab';
  /** 是否显示片段预览 */
  showPreview: boolean;
  /** 是否启用模糊匹配 */
  fuzzyMatch: boolean;
  /** 最大显示建议数量 */
  maxSuggestions: number;
  /** 自定义片段存储路径 */
  customSnippetsPath?: string;
  /** 是否启用统计功能 */
  enableStats: boolean;
}
