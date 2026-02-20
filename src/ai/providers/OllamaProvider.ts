import { BaseProvider, ProviderConfig, ProviderResponse } from './BaseProvider';

export class OllamaProvider extends BaseProvider {
    constructor(config: ProviderConfig) {
        super(config);
        if (!config.baseUrl) {
            config.baseUrl = 'http://localhost:11434';
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/tags`);
            return response.ok;
        } catch (error) {
            console.error('Ollama connection test failed:', error);
            return false;
        }
    }

    async complete(prompt: string, options?: any): Promise<ProviderResponse> {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.config.model || 'mistral',
                    prompt: prompt,
                    temperature: options?.temperature || 0.7,
                    top_p: options?.topP || 0.9,
                    stream: false,
                })
            });

            if (!response.ok) {
                return { text: '', error: `HTTP ${response.status}` };
            }

            const data = await response.json();
            return {
                text: data.response,
                usage: {
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                }
            };
        } catch (error) {
            return { text: '', error: String(error) };
        }
    }

    async chat(messages: Array<{role: string; content: string}>, options?: any): Promise<ProviderResponse> {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.config.model || 'mistral',
                    messages: messages,
                    stream: false,
                })
            });

            if (!response.ok) {
                return { text: '', error: `HTTP ${response.status}` };
            }

            const data = await response.json();
            return {
                text: data.message?.content || '',
                usage: {
                    promptTokens: 0,
                    completionTokens: 0,
                    totalTokens: 0,
                }
            };
        } catch (error) {
            return { text: '', error: String(error) };
        }
    }

    async getModels(): Promise<string[]> {
        try {
            const response = await fetch(`${this.config.baseUrl}/api/tags`);
            if (!response.ok) return [];
            const data = await response.json();
            return data.models?.map((m: any) => m.name) || [];
        } catch (error) {
            console.error('Failed to fetch Ollama models:', error);
            return [];
        }
    }

    async validateConfig(): Promise<boolean> {
        if (!this.config.baseUrl || !this.config.model) {
            return false;
        }
        return await this.testConnection();
    }
}