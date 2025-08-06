import { Snippet, SnippetExpansion, SnippetVariable } from './types';

export class SnippetExpander {
  
  /**
   * 将片段展开为可插入的文本
   */
  static expandSnippet(snippet: Snippet): SnippetExpansion {
    const body = Array.isArray(snippet.body) ? snippet.body.join('\n') : snippet.body;
    const trigger = Array.isArray(snippet.prefix) ? snippet.prefix[0] : snippet.prefix;
    
    // 解析变量和占位符
    const { expandedText, cursorPositions, variables } = this.parseSnippetBody(body);
    
    return {
      trigger,
      expandedText,
      cursorPositions,
      variables
    };
  }

  /**
   * 解析片段内容，提取变量和光标位置
   */
  private static parseSnippetBody(body: string): {
    expandedText: string;
    cursorPositions: number[];
    variables: SnippetVariable[];
  } {
    const variables: Map<string, SnippetVariable> = new Map();
    const cursorPositions: number[] = [];
    let expandedText = body;
    let offset = 0;

    // 匹配 ${数字:默认值} 或 ${数字} 格式的占位符
    const placeholderRegex = /\$\{(\d+)(?::([^}]*))?\}/g;
    let match;

    const replacements: Array<{ start: number; end: number; replacement: string; tabIndex: number }> = [];

    while ((match = placeholderRegex.exec(body)) !== null) {
      const fullMatch = match[0];
      const tabIndex = parseInt(match[1]);
      const defaultValue = match[2] || '';
      
      replacements.push({
        start: match.index,
        end: match.index + fullMatch.length,
        replacement: defaultValue,
        tabIndex
      });

      // 创建变量定义
      if (!variables.has(tabIndex.toString())) {
        variables.set(tabIndex.toString(), {
          name: `var${tabIndex}`,
          defaultValue: defaultValue,
          description: `Variable ${tabIndex}`
        });
      }
    }

    // 按位置倒序替换，避免位置偏移问题
    replacements.sort((a, b) => b.start - a.start);

    for (const replacement of replacements) {
      const before = expandedText.substring(0, replacement.start);
      const after = expandedText.substring(replacement.end);
      
      // 记录光标位置（相对于最终文本）
      const cursorPos = before.length;
      cursorPositions.push(cursorPos);
      
      expandedText = before + replacement.replacement + after;
    }

    // 处理特殊变量
    expandedText = this.processSpecialVariables(expandedText);

    // 按tab顺序排序光标位置
    cursorPositions.sort((a, b) => a - b);

    return {
      expandedText,
      cursorPositions,
      variables: Array.from(variables.values())
    };
  }

  /**
   * 处理特殊变量（如日期、时间等）
   */
  private static processSpecialVariables(text: string): string {
    const now = new Date();
    
    const specialVars = {
      '{{date}}': now.toISOString().split('T')[0],
      '{{time}}': now.toTimeString().split(' ')[0],
      '{{datetime}}': now.toISOString(),
      '{{year}}': now.getFullYear().toString(),
      '{{month}}': (now.getMonth() + 1).toString().padStart(2, '0'),
      '{{day}}': now.getDate().toString().padStart(2, '0'),
      '{{timestamp}}': now.getTime().toString()
    };

    let result = text;
    for (const [variable, value] of Object.entries(specialVars)) {
      result = result.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'), value);
    }

    return result;
  }

  /**
   * 应用变量值到展开的文本
   */
  static applyVariables(expansion: SnippetExpansion, variableValues: Map<string, string>): string {
    let result = expansion.expandedText;
    
    // 替换用户输入的变量值
    for (const [varName, value] of variableValues.entries()) {
      const regex = new RegExp(`\\$\\{${varName}(?::[^}]*)?\\}`, 'g');
      result = result.replace(regex, value);
    }

    return result;
  }

  /**
   * 获取下一个光标位置
   */
  static getNextCursorPosition(expansion: SnippetExpansion, currentPosition: number): number | null {
    const nextPositions = expansion.cursorPositions.filter(pos => pos > currentPosition);
    return nextPositions.length > 0 ? nextPositions[0] : null;
  }

  /**
   * 获取上一个光标位置
   */
  static getPreviousCursorPosition(expansion: SnippetExpansion, currentPosition: number): number | null {
    const prevPositions = expansion.cursorPositions.filter(pos => pos < currentPosition);
    return prevPositions.length > 0 ? prevPositions[prevPositions.length - 1] : null;
  }
}
