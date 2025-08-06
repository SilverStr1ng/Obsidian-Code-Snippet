import { App, PluginSettingTab, Setting } from 'obsidian';
import CodeSnippetsPlugin from '../main';
import { SnippetSettings } from './types';

export class SettingsTab extends PluginSettingTab {
  plugin: CodeSnippetsPlugin;

  constructor(app: App, plugin: CodeSnippetsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: '代码片段设置' });

    // 启用/禁用功能
    new Setting(containerEl)
      .setName('启用代码片段')
      .setDesc('开启或关闭代码片段功能')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enabled)
        .onChange(async (value) => {
          this.plugin.settings.enabled = value;
          await this.plugin.saveSettings();
        }));

    // 触发模式
    new Setting(containerEl)
      .setName('触发模式')
      .setDesc('选择代码片段的触发方式')
      .addDropdown(dropdown => dropdown
        .addOption('auto', '自动触发（推荐）- 输入时自动显示建议')
        .addOption('manual', '手动触发 - Ctrl/Cmd+Space 触发')
        .addOption('tab', 'Tab键触发（谨慎使用）- 可能与Obsidian功能冲突')
        .setValue(this.plugin.settings.triggerMode)
        .onChange(async (value: 'auto' | 'manual' | 'tab') => {
          this.plugin.settings.triggerMode = value;
          await this.plugin.saveSettings();
        }));

    // 显示预览
    new Setting(containerEl)
      .setName('显示片段预览')
      .setDesc('在建议列表中显示代码片段预览')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.showPreview)
        .onChange(async (value) => {
          this.plugin.settings.showPreview = value;
          await this.plugin.saveSettings();
        }));

    // 模糊匹配
    new Setting(containerEl)
      .setName('启用模糊匹配')
      .setDesc('允许不连续字符匹配代码片段前缀')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.fuzzyMatch)
        .onChange(async (value) => {
          this.plugin.settings.fuzzyMatch = value;
          await this.plugin.saveSettings();
        }));

    // 最大建议数量
    new Setting(containerEl)
      .setName('最大建议数量')
      .setDesc('设置同时显示的代码片段建议数量')
      .addSlider(slider => slider
        .setLimits(1, 20, 1)
        .setValue(this.plugin.settings.maxSuggestions)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.maxSuggestions = value;
          await this.plugin.saveSettings();
        }));

    // 自定义片段路径
    new Setting(containerEl)
      .setName('自定义片段路径')
      .setDesc('设置自定义代码片段文件的存储路径')
      .addText(text => text
        .setPlaceholder('.obsidian/snippets.json')
        .setValue(this.plugin.settings.customSnippetsPath || '')
        .onChange(async (value) => {
          this.plugin.settings.customSnippetsPath = value;
          await this.plugin.saveSettings();
        }));

    // 启用统计
    new Setting(containerEl)
      .setName('启用使用统计')
      .setDesc('记录代码片段的使用次数，用于排序建议')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.enableStats)
        .onChange(async (value) => {
          this.plugin.settings.enableStats = value;
          await this.plugin.saveSettings();
        }));

    // 管理片段按钮
    containerEl.createEl('h3', { text: '片段管理' });
    
    new Setting(containerEl)
      .setName('管理代码片段')
      .setDesc('打开代码片段管理界面')
      .addButton(button => button
        .setButtonText('打开管理器')
        .setCta()
        .onClick(() => {
          this.plugin.openSnippetManager();
        }));

    new Setting(containerEl)
      .setName('导出片段')
      .setDesc('将当前所有代码片段导出到文件')
      .addButton(button => button
        .setButtonText('导出')
        .onClick(async () => {
          await this.plugin.exportSnippets();
        }));

    new Setting(containerEl)
      .setName('导入片段')
      .setDesc('从文件导入代码片段')
      .addButton(button => button
        .setButtonText('导入')
        .onClick(() => {
          this.plugin.importSnippets();
        }));

    // 重置设置
    containerEl.createEl('h3', { text: '重置' });
    
    new Setting(containerEl)
      .setName('重置所有设置')
      .setDesc('将所有设置恢复为默认值')
      .addButton(button => button
        .setButtonText('重置')
        .setWarning()
        .onClick(async () => {
          await this.plugin.resetSettings();
          this.display(); // 重新显示设置页面
        }));
  }
}
