// llm.types.ts

/**
 * Type definitions for various LLM providers
 */

// Base interface for all LLMs
interface LLMPrompt {
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
}

// OpenAI type definitions
interface OpenAICompletion extends LLMPrompt {
    model: 'gpt-3.5-turbo' | 'gpt-4';
}

interface OpenAIChat extends LLMPrompt {
    messages: Array<{ role: 'user' | 'assistant'; content: string; }>
    model: 'gpt-3.5-turbo' | 'gpt-4';
}

// Anthropic type definitions
interface AnthropicCompletion extends LLMPrompt {
    model: 'claude-v1' | 'claude-v2';
}

// Cohere type definitions
interface CohereCompletion extends LLMPrompt {
    model: 'xlarge';
    stopSequences?: string[];
}

// Hugging Face type definitions
interface HuggingFaceCompletion extends LLMPrompt {
    model: string; // e.g., 'gpt2'
}

// Exporting all types for external use
export {
    OpenAICompletion,
    OpenAIChat,
    AnthropicCompletion,
    CohereCompletion,
    HuggingFaceCompletion
};