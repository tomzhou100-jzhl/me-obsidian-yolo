import { BaseProvider, ProviderConfig, ProviderResponse } from './BaseProvider';

export class GeminiProvider extends BaseProvider {
    private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

    constructor(config: ProviderConfig) {
        super(config);
    }

    async testConnection(): Promise<boolean> {
        try {
            const response = await fetch(
                `${this.baseUrl}:list?key=${this.config.apiKey}`
            );
            return response.ok;
        } catch (error) {
            console.error('Gemini connection test failed:', error);
            return false;
        }
    }

    async complete(prompt: string, options?: any): Promise<ProviderResponse> {
        try {
            const response = await fetch(
                `${this.baseUrl}/${this.config.model || 'gemini-pro'}:generateContent?key=${this.config.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: options?.temperature || 0.7,
                            topP: options?.topP || 0.9,
                            maxOutputTokens: options?.maxTokens || 2048,
                        }
                    })
                }
            );

            if (!response.ok) {
                return { text: '', error: `HTTP ${response.status}` };
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            return {
                text: text,
                usage: {
                    promptTokens: data.usageMetadata?.promptTokenCount || 0,
                    completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
                    totalTokens: data.usageMetadata?.totalTokenCount || 0,
                }
            };
        } catch (error) {
            return { text: '', error: String(error) };
        }
    }

    async chat(messages: Array<{role: string; content: string}>, options?: any): Promise<ProviderResponse> {
        try {
            const formattedMessages = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            const response = await fetch(
                `${this.baseUrl}/${this.config.model || 'gemini-pro'}:generateContent?key=${this.config.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: formattedMessages,
                        generationConfig: {
                            temperature: options?.temperature || 0.7,
                            topP: options?.topP || 0.9,
                            maxOutputTokens: options?.maxTokens || 2048,
                        }
                    })
                }
            );

            if (!response.ok) {
                return { text: '', error: `HTTP ${response.status}` };
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            return {
                text: text,
                usage: {
                    promptTokens: data.usageMetadata?.promptTokenCount || 0,
                    completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
                    totalTokens: data.usageMetadata?.totalTokenCount || 0,
                }
            };
        } catch (error) {
            return { text: '', error: String(error) };
        }
    }

    async getModels(): Promise<string[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}:list?key=${this.config.apiKey}`
            );
            if (!response.ok) return [];
            const data = await response.json();
            return data.models?.map((m: any) => m.name?.split('/')?.pop()) || [];
        } catch (error) {
            console.error('Failed to fetch Gemini models:', error);
            return [];
        }
    }

    async validateConfig(): Promise<boolean> {
        if (!this.config.apiKey || !this.config.model) {
            return false;
        }
        return await this.testConnection();
    }
}