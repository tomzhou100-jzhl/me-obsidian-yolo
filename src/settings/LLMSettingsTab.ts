// LLMSettingsTab.ts

import { PluginSettingTab, Setting } from 'obsidian';

// Define provider options for the settings UI panel
const LLM_PROVIDERS = ['OpenAI', 'Cohere', 'Anthropic', 'Google'];

class LLMSettingsTab extends PluginSettingTab {
    constructor(app) {
        super(app);
        this.app = app;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'LLM Provider Settings' });

        LLM_PROVIDERS.forEach(provider => {
            new Setting(containerEl)
                .setName(provider)
                .setDesc(`Configure settings for ${provider}.`)
                .addText(text => text
                    .setPlaceholder(`Enter ${provider} API Key`
                    .onChange(async (value) => {
                        console.log(`API Key for ${provider} updated: ${value}`);
                    }));
        });
    }
}