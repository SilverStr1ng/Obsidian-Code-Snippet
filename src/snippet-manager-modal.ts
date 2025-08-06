import { Modal, App, Setting, TextAreaComponent } from 'obsidian';
import { Snippet } from './types';
import { SnippetManager } from './snippet-manager';

export class SnippetManagerModal extends Modal {
  private snippetManager: SnippetManager;
  private snippets: Snippet[] = [];
  private selectedSnippet: Snippet | null = null;

  constructor(app: App, snippetManager: SnippetManager) {
    super(app);
    this.snippetManager = snippetManager;
  }

  onOpen() {
    this.loadSnippets();
    this.display();
    
    // 设置模态窗口大小
    this.modalEl.style.width = '90vw';
    this.modalEl.style.height = '85vh';
    this.modalEl.style.maxWidth = '1400px';
    this.modalEl.style.maxHeight = '900px';
    this.modalEl.style.minWidth = '800px';
    this.modalEl.style.minHeight = '600px';
    this.modalEl.style.paddingTop = '1.5rem';
    this.modalEl.style.overflowX = 'hidden';
    
    // 添加键盘快捷键支持
    this.scope.register(['Ctrl'], 'n', () => {
      this.createNewSnippet();
      return false;
    });
    
    this.scope.register(['Ctrl'], 's', () => {
      if (this.selectedSnippet) {
        this.saveSnippet();
      }
      return false;
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }

  private loadSnippets() {
    this.snippets = this.snippetManager.getAllSnippets();
  }

  private display() {
    const { contentEl } = this;
    contentEl.empty();

    // 创建可滚动的内容区域
    const scrollableContent = contentEl.createDiv({ cls: 'snippet-manager-scrollable' });
    
    // 创建左右分栏布局
    const container = scrollableContent.createDiv({ cls: 'snippet-manager-container' });
    const leftPanel = container.createDiv({ cls: 'snippet-list-panel' });
    const rightPanel = container.createDiv({ cls: 'snippet-edit-panel' });

    this.createSnippetList(leftPanel);
    this.createSnippetEditor(rightPanel);

    // 添加样式
    this.addStyles();
  }

  private createSnippetList(container: HTMLElement) {
    const header = container.createDiv({ cls: 'panel-header' });
    header.createEl('h3', { text: '片段列表' });

    const addButton = header.createEl('button', { text: '新建片段', cls: 'mod-cta' });
    addButton.onclick = () => this.createNewSnippet();

    // 添加统计信息
    const statsContainer = container.createDiv({ cls: 'stats-container' });
    const totalCount = this.snippets.length;
    statsContainer.createEl('span', { 
      text: `共 ${totalCount} 个片段`, 
      cls: 'stats-text' 
    });

    const searchContainer = container.createDiv({ cls: 'search-container' });
    const searchInput = searchContainer.createEl('input', {
      type: 'text',
      placeholder: '搜索片段...',
      cls: 'search-input'
    });

    searchInput.oninput = (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.filterSnippets(query);
    };

    const listContainer = container.createDiv({ cls: 'snippet-list' });
    this.renderSnippetList(listContainer);
  }

  private renderSnippetList(container: HTMLElement) {
    container.empty();

    this.snippets.forEach(snippet => {
      const item = container.createDiv({ cls: 'snippet-item' });
      if (this.selectedSnippet?.id === snippet.id) {
        item.addClass('selected');
      }

      const title = item.createDiv({ cls: 'snippet-title' });
      title.textContent = snippet.name;

      const prefix = item.createDiv({ cls: 'snippet-prefix' });
      prefix.textContent = Array.isArray(snippet.prefix) ? snippet.prefix.join(', ') : snippet.prefix;

      const description = item.createDiv({ cls: 'snippet-description' });
      description.textContent = snippet.description || '';

      item.onclick = () => {
        this.selectedSnippet = snippet;
        this.display();
      };
    });
  }

  private createSnippetEditor(container: HTMLElement) {
    const header = container.createDiv({ cls: 'panel-header' });
    header.createEl('h3', { text: '编辑片段' });
    
    // 添加快捷键提示
    const shortcutsDiv = header.createDiv({ cls: 'shortcuts-hint' });
    shortcutsDiv.createEl('span', { 
      text: 'Ctrl+N: 新建 | Ctrl+S: 保存',
      cls: 'shortcuts-text'
    });

    if (!this.selectedSnippet) {
      container.createDiv({ text: '请选择一个片段进行编辑', cls: 'empty-message' });
      return;
    }

    const form = container.createDiv({ cls: 'snippet-form' });

    // 片段名称
    new Setting(form)
      .setName('片段名称')
      .setDesc('片段的显示名称')
      .addText(text => text
        .setValue(this.selectedSnippet.name)
        .onChange(value => {
          if (this.selectedSnippet) {
            this.selectedSnippet.name = value;
          }
        }));

    // 触发前缀
    new Setting(form)
      .setName('触发前缀')
      .setDesc('用于触发片段的前缀（多个前缀用逗号分隔）')
      .addText(text => text
        .setValue(Array.isArray(this.selectedSnippet.prefix) 
          ? this.selectedSnippet.prefix.join(', ') 
          : this.selectedSnippet.prefix)
        .onChange(value => {
          if (this.selectedSnippet) {
            this.selectedSnippet.prefix = value.split(',').map(p => p.trim());
          }
        }));

    // 片段描述
    new Setting(form)
      .setName('描述')
      .setDesc('片段的描述信息')
      .addText(text => text
        .setValue(this.selectedSnippet.description || '')
        .onChange(value => {
          if (this.selectedSnippet) {
            this.selectedSnippet.description = value;
          }
        }));

    // 作用域
    new Setting(form)
      .setName('作用域')
      .setDesc('片段适用的语言范围（多个语言用逗号分隔，留空表示适用所有语言）')
      .addText(text => text
        .setValue(this.selectedSnippet.scope 
          ? (Array.isArray(this.selectedSnippet.scope) 
            ? this.selectedSnippet.scope.join(', ') 
            : this.selectedSnippet.scope)
          : '')
        .onChange(value => {
          if (this.selectedSnippet) {
            this.selectedSnippet.scope = value ? value.split(',').map(s => s.trim()) : undefined;
          }
        }));

    // 片段内容
    const bodyContainer = form.createDiv();
    bodyContainer.createEl('label', { text: '片段内容', cls: 'setting-item-name' });
    bodyContainer.createEl('div', { text: '支持占位符格式：${1:defaultValue}', cls: 'setting-item-description' });
    
    const bodyTextarea = bodyContainer.createEl('textarea', {
      cls: 'snippet-body-textarea'
    });
    bodyTextarea.value = Array.isArray(this.selectedSnippet.body) 
      ? this.selectedSnippet.body.join('\n') 
      : this.selectedSnippet.body;
    
    bodyTextarea.oninput = () => {
      if (this.selectedSnippet) {
        this.selectedSnippet.body = bodyTextarea.value.split('\n');
      }
    };

    // 按钮区域
    const buttonContainer = form.createDiv({ cls: 'button-container' });
    
    const saveButton = buttonContainer.createEl('button', { text: '保存', cls: 'mod-cta' });
    saveButton.onclick = () => this.saveSnippet();

    const deleteButton = buttonContainer.createEl('button', { text: '删除', cls: 'mod-warning' });
    deleteButton.onclick = () => this.deleteSnippet();

    const testButton = buttonContainer.createEl('button', { text: '测试' });
    testButton.onclick = () => this.testSnippet();
  }

  private createNewSnippet() {
    const newSnippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'> = {
      name: '新片段',
      prefix: 'new',
      body: ['// 在这里输入片段内容'],
      description: '新建的代码片段'
    };

    const id = this.snippetManager.addSnippet(newSnippet);
    this.loadSnippets();
    this.selectedSnippet = this.snippetManager.getSnippet(id) || null;
    this.display();
  }

  private saveSnippet() {
    if (!this.selectedSnippet) return;

    this.snippetManager.updateSnippet(this.selectedSnippet.id, this.selectedSnippet);
    this.loadSnippets();
    this.display();
  }

  private deleteSnippet() {
    if (!this.selectedSnippet) return;

    if (confirm(`确定要删除片段 "${this.selectedSnippet.name}" 吗？`)) {
      this.snippetManager.deleteSnippet(this.selectedSnippet.id);
      this.selectedSnippet = null;
      this.loadSnippets();
      this.display();
    }
  }

  private testSnippet() {
    if (!this.selectedSnippet) return;

    // 这里可以打开一个预览窗口显示片段展开效果
    // 暂时使用alert显示
    const body = Array.isArray(this.selectedSnippet.body) 
      ? this.selectedSnippet.body.join('\n') 
      : this.selectedSnippet.body;
    
    alert(`片段预览：\n\n${body}`);
  }

  private filterSnippets(query: string) {
    if (!query) {
      this.snippets = this.snippetManager.getAllSnippets();
    } else {
      this.snippets = this.snippetManager.getAllSnippets().filter(snippet => 
        snippet.name.toLowerCase().includes(query.toLowerCase()) ||
        (Array.isArray(snippet.prefix) ? snippet.prefix : [snippet.prefix])
          .some(p => p.toLowerCase().includes(query.toLowerCase())) ||
        (snippet.description && snippet.description.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    const listContainer = this.contentEl.querySelector('.snippet-list') as HTMLElement;
    if (listContainer) {
      this.renderSnippetList(listContainer);
    }
  }

  private addStyles() {
    if (document.getElementById('snippet-manager-styles')) return;

    const style = document.createElement('style');
    style.id = 'snippet-manager-styles';
    style.textContent = `
      .snippet-manager-scrollable {
        height: calc(85vh - 105px);
        overflow-y: auto;
        padding: 20px;
        margin: 0 -20px -20px -20px;
      }
      
      .snippet-manager-container {
        display: flex;
        gap: 20px;
        min-height: calc(85vh - 165px);
      }
      
      .snippet-list-panel {
        flex: 0 0 350px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 6px;
        padding: 15px;
        display: flex;
        flex-direction: column;
        max-height: calc(85vh - 185px);
      }
      
      .snippet-edit-panel {
        flex: 1;
        border: 1px solid var(--background-modifier-border);
        border-radius: 6px;
        padding: 15px;
        overflow-y: auto;
        min-width: 400px;
        max-height: calc(85vh - 185px);
      }
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 1px solid var(--background-modifier-border);
        padding-bottom: 10px;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .shortcuts-hint {
        font-size: 0.8em;
        color: var(--text-muted);
        opacity: 0.8;
      }
      
      .shortcuts-text {
        background: var(--background-modifier-border);
        padding: 4px 8px;
        border-radius: 4px;
        font-family: var(--font-monospace);
      }
      
      .search-container {
        margin-bottom: 15px;
      }
      
      .stats-container {
        margin-bottom: 10px;
        padding: 8px 0;
        border-bottom: 1px solid var(--background-modifier-border);
      }
      
      .stats-text {
        font-size: 0.9em;
        color: var(--text-muted);
        font-weight: 500;
      }
      
      .search-input {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
      }
      
      .snippet-list {
        flex: 1;
        overflow-y: auto;
        max-height: none;
      }
      
      .snippet-item {
        padding: 12px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 6px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--background-secondary);
      }
      
      .snippet-item:hover {
        background-color: var(--background-modifier-hover);
        border-color: var(--interactive-accent);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .snippet-item.selected {
        background-color: var(--interactive-accent);
        color: var(--text-on-accent);
        border-color: var(--interactive-accent);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
      }
      
      .snippet-title {
        font-weight: bold;
        margin-bottom: 4px;
      }
      
      .snippet-prefix {
        font-family: var(--font-monospace);
        font-size: 0.9em;
        color: var(--text-muted);
        margin-bottom: 4px;
      }
      
      .snippet-description {
        font-size: 0.85em;
        color: var(--text-muted);
      }
      
      .snippet-form {
        space-y: 15px;
      }
      
      .snippet-body-textarea {
        width: 100%;
        height: 300px;
        min-height: 200px;
        font-family: var(--font-monospace);
        font-size: 13px;
        line-height: 1.4;
        padding: 12px;
        border: 1px solid var(--background-modifier-border);
        border-radius: 4px;
        resize: vertical;
        background: var(--background-primary);
      }
      
      .button-container {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      
      .empty-message {
        text-align: center;
        color: var(--text-muted);
        margin-top: 50px;
      }
      
      /* 响应式设计 */
      @media (max-width: 900px) {
        .snippet-manager-container {
          flex-direction: column;
          min-height: auto;
        }
        
        .snippet-list-panel {
          flex: 0 0 250px;
          max-height: 250px;
        }
        
        .snippet-edit-panel {
          flex: 1;
          min-height: 400px;
          max-height: none;
        }
        
        .snippet-manager-scrollable {
          height: calc(85vh - 85px);
        }
      }
      
      @media (max-height: 700px) {
        .snippet-manager-scrollable {
          height: calc(100vh - 145px);
        }
        
        .snippet-list-panel {
          max-height: calc(100vh - 265px);
        }
        
        .snippet-edit-panel {
          max-height: calc(100vh - 265px);
        }
        
        .snippet-body-textarea {
          height: 200px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
}
