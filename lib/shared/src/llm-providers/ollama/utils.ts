import ollama from 'ollama/browser'
import { OLLAMA_DEFAULT_CONTEXT_WINDOW } from '.'
import { type Model, ModelUsage, cenv } from '../..'
import { createModel } from '../../models/model'
import { ModelTag } from '../../models/tags'
import { CHAT_OUTPUT_TOKEN_BUDGET } from '../../token/constants'
/**
 * Fetches available Ollama models from the Ollama server.
 */
export async function fetchLocalOllamaModels(): Promise<Model[]> {
    if (cenv.CODY_OVERRIDE_DISABLE_OLLAMA) {
        // We currently never intend to fetch local Ollama models during tests, but it's easy to
        // accidentally invoke this and introduce test nondeterminism or local vs. remote
        // divergence.
        return []
    }
    
    try {
        console.log('DEBUG: Attempting to fetch Ollama models...');
        // TODO(sqs)#observe: make ollama models observable
        const result = await ollama.list();
        console.log('DEBUG: Ollama API response:', result);
        
        if (!result.models) {
            console.log('DEBUG: No models in Ollama response');
            return [];
        }
        
        const models = result.models.map(m =>
            createModel({
                id: `ollama/${m.name}`,
                usage: [ModelUsage.Chat, ModelUsage.Edit],
                contextWindow: {
                    input: OLLAMA_DEFAULT_CONTEXT_WINDOW,
                    output: CHAT_OUTPUT_TOKEN_BUDGET,
                },
                tags: [ModelTag.Local, ModelTag.Ollama, ModelTag.Experimental],
            })
        );
        
        console.log('DEBUG: Created Ollama models:', models);
        return models;
    } catch (error) {
        console.error('DEBUG: Error fetching Ollama models:', error);
        
        // For debugging, let's create a dummy model to see if the UI works
        console.log('DEBUG: Creating dummy Ollama model for testing...');
        return [
            createModel({
                id: 'ollama/gemma3:latest',
                usage: [ModelUsage.Chat, ModelUsage.Edit],
                contextWindow: {
                    input: OLLAMA_DEFAULT_CONTEXT_WINDOW,
                    output: CHAT_OUTPUT_TOKEN_BUDGET,
                },
                tags: [ModelTag.Local, ModelTag.Ollama, ModelTag.Experimental],
            })
        ];
    }
}
