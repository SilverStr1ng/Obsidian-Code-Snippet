import { TFile, Vault, App, Plugin } from 'obsidian';
import { Snippet, SnippetSettings } from './types';

export class SnippetManager {
  private app: App;
  private vault: Vault;
  private snippets: Map<string, Snippet> = new Map();
  private settings: SnippetSettings;
  private dataFilePath: string;
  private plugin: Plugin;

  constructor(app: App, settings: SnippetSettings) {
    this.app = app;
    this.vault = app.vault;
    this.settings = settings;
    // 使用插件的数据目录
    this.dataFilePath = 'data.json';
  }

  /**
   * 初始化片段管理器，加载默认片段
   */
  async initialize(): Promise<void> {
    await this.loadDefaultSnippets();
    await this.loadCustomSnippets();
  }

  /**
   * 设置插件实例，用于数据保存
   */
  setPlugin(plugin: Plugin): void {
    this.plugin = plugin;
  }

  /**
   * 加载默认代码片段
   */
  private async loadDefaultSnippets(): Promise<void> {
    const defaultSnippets: Snippet[] = [
      {
        id: 'js-function',
        name: 'JavaScript Function',
        prefix: 'func',
        body: [
          'function ${1:functionName}(${2:parameters}) {',
          '\t${3:// TODO: implement}',
          '\treturn ${4:undefined};',
          '}'
        ],
        description: 'Create a JavaScript function',
        scope: ['javascript', 'typescript'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: 'py-class',
        name: 'Python Class',
        prefix: 'class',
        body: [
          'class ${1:ClassName}:',
          '\t"""${2:Class description}"""',
          '\t',
          '\tdef __init__(self${3:, parameters}):',
          '\t\t"""${4:Constructor description}"""',
          '\t\t${5:pass}'
        ],
        description: 'Create a Python class',
        scope: ['python'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: 'md-codeblock',
        name: 'Markdown Code Block',
        prefix: 'code',
        body: [
          '```${1:language}',
          '${2:// your code here}',
          '```'
        ],
        description: 'Create a markdown code block',
        scope: ['markdown'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: 'md-table',
        name: 'Markdown Table',
        prefix: 'table',
        body: [
          '| ${1:Header 1} | ${2:Header 2} | ${3:Header 3} |',
          '|--------------|--------------|--------------|',
          '| ${4:Cell 1}   | ${5:Cell 2}   | ${6:Cell 3}   |',
          '| ${7:Cell 4}   | ${8:Cell 5}   | ${9:Cell 6}   |'
        ],
        description: 'Create a markdown table',
        scope: ['markdown'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      },
      {
        id: 'obsidian-note-template',
        name: 'Obsidian Note Template',
        prefix: 'note',
        body: [
          '# ${1:Note Title}',
          '',
          '**Created:** {{date}}',
          '**Tags:** #${2:tag}',
          '',
          '## Summary',
          '${3:Brief summary of the note}',
          '',
          '## Content',
          '${4:Main content goes here}',
          '',
          '## References',
          '- ${5:Reference links or notes}'
        ],
        description: 'Create an Obsidian note template',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0
      }
    ];

    defaultSnippets.forEach(snippet => {
      this.snippets.set(snippet.id, snippet);
    });
  }

  /**
   * 从插件数据文件加载片段
   */
  private async loadCustomSnippets(): Promise<void> {
    try {
      if (this.plugin) {
        const data = await this.plugin.loadData();
        if (data && data.customSnippets) {
          const customSnippets: Snippet[] = data.customSnippets;
          customSnippets.forEach(snippet => {
            this.snippets.set(snippet.id, snippet);
          });
          console.log(`✅ 已从插件数据加载 ${customSnippets.length} 个自定义片段`);
        } else {
          console.log('📝 未找到自定义片段数据，将只使用默认片段');
        }
      } else {
        console.warn('⚠️ 插件实例未设置，无法加载自定义片段');
      }
    } catch (error) {
      console.log('❌ 加载自定义片段失败，将使用默认片段:', error);
    }
  }

  /**
   * 保存自定义片段到插件数据文件
   */
  async saveCustomSnippets(): Promise<void> {
    try {
      if (this.plugin) {
        // 只保存非默认的片段（有自定义标记或非内置ID的片段）
        const customSnippets = Array.from(this.snippets.values()).filter(snippet => 
          !this.isDefaultSnippet(snippet.id)
        );
        
        const data = await this.plugin.loadData() || {};
        data.customSnippets = customSnippets;
        await this.plugin.saveData(data);
        console.log(`✅ 已保存 ${customSnippets.length} 个自定义片段到插件数据文件`);
      } else {
        console.warn('⚠️ 插件实例未设置，无法保存自定义片段');
      }
    } catch (error) {
      console.error('❌ 保存自定义片段失败:', error);
    }
  }

  /**
   * 检查是否为默认片段
   */
  private isDefaultSnippet(id: string): boolean {
    const defaultIds = [
      'js-function', 'js-class', 'js-arrow', 'js-async',
      'py-class', 'py-function', 'py-if', 'py-for',
      'md-code', 'md-table', 'md-link', 'md-note'
    ];
    return defaultIds.includes(id);
  }

  /**
   * 添加新片段
   */
  addSnippet(snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): string {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const newSnippet: Snippet = {
      ...snippet,
      id,
      createdAt: now,
      updatedAt: now,
      usageCount: 0
    };

    this.snippets.set(id, newSnippet);
    this.saveCustomSnippets();
    return id;
  }

  /**
   * 更新片段
   */
  updateSnippet(id: string, updates: Partial<Snippet>): boolean {
    const snippet = this.snippets.get(id);
    if (!snippet) return false;

    const updatedSnippet: Snippet = {
      ...snippet,
      ...updates,
      id: snippet.id, // 保持原有ID
      createdAt: snippet.createdAt, // 保持创建时间
      updatedAt: new Date().toISOString()
    };

    this.snippets.set(id, updatedSnippet);
    this.saveCustomSnippets();
    return true;
  }

  /**
   * 删除片段
   */
  deleteSnippet(id: string): boolean {
    const deleted = this.snippets.delete(id);
    if (deleted) {
      this.saveCustomSnippets();
    }
    return deleted;
  }

  /**
   * 获取片段
   */
  getSnippet(id: string): Snippet | undefined {
    return this.snippets.get(id);
  }

  /**
   * 获取所有片段
   */
  getAllSnippets(): Snippet[] {
    return Array.from(this.snippets.values());
  }

  /**
   * 根据前缀搜索片段
   */
  searchSnippets(prefix: string, scope?: string): Snippet[] {
    const results: Snippet[] = [];
    
    for (const snippet of this.snippets.values()) {
      // 检查作用域
      if (scope && snippet.scope) {
        const scopes = Array.isArray(snippet.scope) ? snippet.scope : [snippet.scope];
        if (!scopes.includes(scope)) continue;
      }

      // 检查前缀匹配
      const prefixes = Array.isArray(snippet.prefix) ? snippet.prefix : [snippet.prefix];
      const matches = prefixes.some(p => {
        if (this.settings.fuzzyMatch) {
          return this.fuzzyMatch(prefix.toLowerCase(), p.toLowerCase());
        } else {
          return p.toLowerCase().startsWith(prefix.toLowerCase());
        }
      });

      if (matches) {
        results.push(snippet);
      }
    }

    // 按使用次数和匹配度排序
    return results.sort((a, b) => {
      const aUsage = a.usageCount || 0;
      const bUsage = b.usageCount || 0;
      return bUsage - aUsage;
    }).slice(0, this.settings.maxSuggestions);
  }

  /**
   * 增加片段使用次数
   */
  incrementUsage(id: string): void {
    const snippet = this.snippets.get(id);
    if (snippet) {
      snippet.usageCount = (snippet.usageCount || 0) + 1;
      snippet.updatedAt = new Date().toISOString();
      this.saveCustomSnippets();
    }
  }

  /**
   * 模糊匹配算法
   */
  private fuzzyMatch(pattern: string, text: string): boolean {
    let patternIdx = 0;
    let textIdx = 0;

    while (patternIdx < pattern.length && textIdx < text.length) {
      if (pattern[patternIdx] === text[textIdx]) {
        patternIdx++;
      }
      textIdx++;
    }

    return patternIdx === pattern.length;
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
