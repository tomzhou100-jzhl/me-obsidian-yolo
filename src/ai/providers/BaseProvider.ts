export interface ProviderConfig {
    id: string;
    name: string;
    type: 'ollama' | 'openai-compatible' | 'nvidia' | 'gemini' | 'custom';
    baseUrl?: string;
    apiKey?: string;
    model?: string;
    enabled: boolean;
}

export interface ProviderResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    error?: string;
}

export abstract class BaseProvider {
    protected config: ProviderConfig;
    protected name: string;

    constructor(config: ProviderConfig) {
        this.config = config;
        this.name = config.name;
    }

    abstract testConnection(): Promise<boolean>;
    abstract complete(prompt: string, options?: any): Promise<ProviderResponse>;
    abstract chat(messages: Array<{role: string; content: string}>, options?: any): Promise<ProviderResponse>;
    abstract getModels(): Promise<string[]>;
    abstract validateConfig(): Promise<boolean>;

    getConfig(): ProviderConfig {
        return this.config;
    }

    updateConfig(updates: Partial<ProviderConfig>): void {
        this.config = { ...this.config, ...updates };
    }

    isEnabled(): boolean {
        return this.config.enabled;
    }
}