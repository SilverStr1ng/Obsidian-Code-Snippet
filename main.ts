import { Plugin, Editor, MarkdownView, EditorSuggest, EditorPosition, TFile, EditorSuggestTriggerInfo, EditorSuggestContext } from 'obsidian';
import { SnippetSettings } from './src/types';
import { SnippetManager } from './src/snippet-manager';
import { SnippetExpander } from './src/snippet-expander';
import { SettingsTab } from './src/settings-tab';
import { SnippetManagerModal } from './src/snippet-manager-modal';

const DEFAULT_SETTINGS: SnippetSettings = {
  enabled: true,
  triggerMode: 'auto',
  showPreview: true,
  fuzzyMatch: true,
  maxSuggestions: 10,
  customSnippetsPath: '',
  enableStats: true
};

interface SnippetSuggestion {
  id: string;
  name: string;
  prefix: string;
  description?: string;
  body: string;
}

export default class CodeSnippetsPlugin extends Plugin {
  settings: SnippetSettings;
  snippetManager: SnippetManager;
  snippetSuggest: SnippetSuggest;

  async onload() {
    await this.loadSettings();

    // 初始化片段管理器
    this.snippetManager = new SnippetManager(this.app, this.settings);
    this.snippetManager.setPlugin(this);
    await this.snippetManager.initialize();

    // 初始化建议提供器
    this.snippetSuggest = new SnippetSuggest(this, this.snippetManager);
    this.registerEditorSuggest(this.snippetSuggest);

    // 添加设置标签页
    this.addSettingTab(new SettingsTab(this.app, this));

    // 注册命令
    this.addCommand({
      id: 'open-snippet-manager',
      name: '打开代码片段管理器',
      callback: () => {
        this.openSnippetManager();
      }
    });

    this.addCommand({
      id: 'insert-snippet',
      name: '插入代码片段',
      editorCallback: (editor: Editor) => {
        this.showSnippetSuggestions(editor);
      }
    });

    // 注册快捷键处理
    this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
      const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!activeView) return;
      
      const editor = activeView.editor;
      
      // Ctrl/Cmd + Space 触发代码片段
      if ((evt.ctrlKey || evt.metaKey) && evt.code === 'Space') {
        if (this.handleManualTrigger(editor, evt)) {
          evt.preventDefault();
        }
      }
      
      // Ctrl/Cmd + Shift + Space 强制触发代码片段
      if ((evt.ctrlKey || evt.metaKey) && evt.shiftKey && evt.code === 'Space') {
        this.showSnippetSuggestions(editor);
        evt.preventDefault();
      }
      
      // 仅在特定触发模式下使用Tab键
      if (this.settings.triggerMode === 'tab' && evt.key === 'Tab') {
        // 检查是否在列表或引用环境中，如果是则不拦截Tab
        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);
        const beforeCursor = line.substring(0, cursor.ch);
        
        // 如果当前行是列表项或在缩进环境中，不拦截Tab键
        if (beforeCursor.match(/^\s*[-*+]\s/) || beforeCursor.match(/^\s*\d+\.\s/) || beforeCursor.match(/^\s+/)) {
          return; // 让Obsidian处理Tab键
        }
        
        if (this.handleTabTrigger(editor, evt)) {
          evt.preventDefault();
        }
      }
    });
  }

  onunload() {
    // 确保在插件卸载前保存自定义片段
    if (this.snippetManager) {
      this.snippetManager.saveCustomSnippets().catch(console.error);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    // 更新片段管理器设置
    if (this.snippetManager) {
      // 这里可以添加设置更新的逻辑
    }
  }

  async resetSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS);
    await this.saveSettings();
  }

  openSnippetManager() {
    new SnippetManagerModal(this.app, this.snippetManager).open();
  }

  async exportSnippets() {
    const snippets = this.snippetManager.getAllSnippets();
    const content = JSON.stringify(snippets, null, 2);
    
    try {
      const filename = `snippets-export-${new Date().toISOString().split('T')[0]}.json`;
      await this.app.vault.adapter.write(filename, content);
      // 显示成功消息
      // 这里可以使用 Notice 来显示通知
      console.log(`片段已导出到 ${filename}`);
    } catch (error) {
      console.error('导出失败:', error);
    }
  }

  importSnippets() {
    // 创建一个文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const content = await file.text();
        const snippets = JSON.parse(content);
        
        // 验证数据格式
        if (Array.isArray(snippets)) {
          for (const snippet of snippets) {
            this.snippetManager.addSnippet(snippet);
          }
          console.log(`成功导入 ${snippets.length} 个片段`);
        } else {
          console.error('无效的片段文件格式');
        }
      } catch (error) {
        console.error('导入失败:', error);
      }
    };
    
    input.click();
  }

  private handleTabTrigger(editor: Editor, evt: KeyboardEvent): boolean {
    if (!this.settings.enabled) return false;

    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    const beforeCursor = line.substring(0, cursor.ch);
    
    // 查找最后一个单词
    const wordMatch = beforeCursor.match(/\S+$/);
    if (!wordMatch) return false;
    
    const word = wordMatch[0];
    const snippets = this.snippetManager.searchSnippets(word);
    
    if (snippets.length === 0) return false;
    
    // 如果只有一个匹配的片段，直接展开
    if (snippets.length === 1) {
      this.expandSnippet(editor, snippets[0], word);
      return true;
    }
    
    // 如果有多个匹配，显示建议列表
    this.showSnippetSuggestions(editor);
    return false;
  }

  private handleManualTrigger(editor: Editor, evt: KeyboardEvent): boolean {
    if (!this.settings.enabled) return false;

    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    const beforeCursor = line.substring(0, cursor.ch);
    
    // 查找最后一个单词
    const wordMatch = beforeCursor.match(/\S+$/);
    if (!wordMatch) return false;
    
    const word = wordMatch[0];
    const snippets = this.snippetManager.searchSnippets(word);
    
    if (snippets.length === 0) return false;
    
    // 直接展开第一个匹配的片段
    this.expandSnippet(editor, snippets[0], word);
    return true;
  }

  private expandSnippet(editor: Editor, snippet: any, trigger: string) {
    const expansion = SnippetExpander.expandSnippet(snippet);
    
    // 替换触发词
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    const beforeCursor = line.substring(0, cursor.ch);
    const startPos = beforeCursor.lastIndexOf(trigger);
    
    if (startPos !== -1) {
      const from = { line: cursor.line, ch: startPos };
      const to = { line: cursor.line, ch: cursor.ch };
      
      editor.replaceRange(expansion.expandedText, from, to);
      
      // 设置光标位置
      if (expansion.cursorPositions.length > 0) {
        const newCursor = {
          line: cursor.line,
          ch: startPos + expansion.cursorPositions[0]
        };
        editor.setCursor(newCursor);
      }
      
      // 更新使用统计
      if (this.settings.enableStats) {
        this.snippetManager.incrementUsage(snippet.id);
      }
    }
  }

  private showSnippetSuggestions(editor: Editor) {
    // 这里可以实现一个自定义的建议弹窗
    // 暂时使用简单的实现
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);
    const beforeCursor = line.substring(0, cursor.ch);
    const wordMatch = beforeCursor.match(/\S+$/);
    
    if (wordMatch) {
      const word = wordMatch[0];
      const snippets = this.snippetManager.searchSnippets(word);
      
      if (snippets.length > 0) {
        // 这里应该显示建议列表，暂时用第一个片段
        this.expandSnippet(editor, snippets[0], word);
      }
    }
  }
}

class SnippetSuggest extends EditorSuggest<SnippetSuggestion> {
  plugin: CodeSnippetsPlugin;
  snippetManager: SnippetManager;

  constructor(plugin: CodeSnippetsPlugin, snippetManager: SnippetManager) {
    super(plugin.app);
    this.plugin = plugin;
    this.snippetManager = snippetManager;
  }

  onTrigger(cursor: EditorPosition, editor: Editor, file: TFile): EditorSuggestTriggerInfo | null {
    if (!this.plugin.settings.enabled) return null;
    
    const line = editor.getLine(cursor.line);
    const beforeCursor = line.substring(0, cursor.ch);
    
    // 查找最后一个单词
    const wordMatch = beforeCursor.match(/(\S+)$/);
    if (!wordMatch) return null;
    
    const word = wordMatch[1];
    if (word.length < 2) return null; // 至少2个字符才触发
    
    return {
      start: { line: cursor.line, ch: cursor.ch - word.length },
      end: cursor,
      query: word
    };
  }

  getSuggestions(context: EditorSuggestContext): SnippetSuggestion[] {
    const snippets = this.snippetManager.searchSnippets(context.query);
    
    return snippets.map(snippet => ({
      id: snippet.id,
      name: snippet.name,
      prefix: Array.isArray(snippet.prefix) ? snippet.prefix[0] : snippet.prefix,
      description: snippet.description,
      body: Array.isArray(snippet.body) ? snippet.body.join('\n') : snippet.body
    }));
  }

  renderSuggestion(suggestion: SnippetSuggestion, el: HTMLElement): void {
    const container = el.createDiv({ cls: 'snippet-suggestion' });
    
    const header = container.createDiv({ cls: 'snippet-suggestion-header' });
    header.createSpan({ text: suggestion.name, cls: 'snippet-suggestion-name' });
    header.createSpan({ text: suggestion.prefix, cls: 'snippet-suggestion-prefix' });
    
    if (suggestion.description) {
      container.createDiv({ text: suggestion.description, cls: 'snippet-suggestion-description' });
    }
    
    if (this.plugin.settings.showPreview) {
      const preview = container.createDiv({ cls: 'snippet-suggestion-preview' });
      const codeEl = preview.createEl('code', { text: suggestion.body.substring(0, 100) });
      if (suggestion.body.length > 100) {
        codeEl.textContent += '...';
      }
    }
  }

  selectSuggestion(suggestion: SnippetSuggestion, evt: MouseEvent | KeyboardEvent): void {
    const snippet = this.snippetManager.getSnippet(suggestion.id);
    if (!snippet) return;
    
    const editor = this.context?.editor;
    if (!editor) return;
    
    // 替换选中的文本
    const expansion = SnippetExpander.expandSnippet(snippet);
    editor.replaceRange(expansion.expandedText, this.context.start, this.context.end);
    
    // 设置光标位置
    if (expansion.cursorPositions.length > 0) {
      const newCursor = {
        line: this.context.start.line,
        ch: this.context.start.ch + expansion.cursorPositions[0]
      };
      editor.setCursor(newCursor);
    }
    
    // 更新使用统计
    if (this.plugin.settings.enableStats) {
      this.snippetManager.incrementUsage(snippet.id);
    }
  }
}
