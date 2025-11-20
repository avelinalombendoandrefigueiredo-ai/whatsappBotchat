import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Serviço de Inteligência Artificial
 * 
 * NOTA SOBRE DEEPSEEK:
 * Este simulador frontend usa a biblioteca oficial do Google GenAI (@google/genai).
 * 
 * Para usar DeepSeek no seu projeto final (Node.js):
 * 1. Instale a biblioteca 'openai' (DeepSeek é compatível com OpenAI SDK): npm install openai
 * 2. Configure:
 *    const OpenAI = require("openai");
 *    const openai = new OpenAI({
 *        baseURL: 'https://api.deepseek.com',
 *        apiKey: 'sk-sua-chave-aqui'
 *    });
 * 3. Substitua a chamada generateContent por openai.chat.completions.create(...)
 */

export const generateBotResponse = async (
  history: { role: string; text: string }[],
  userMessage: string,
  systemInstruction: string
): Promise<string> => {
  // Guideline: The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  // Assume this variable is pre-configured, valid, and accessible.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("API Key não encontrada em process.env.API_KEY.");
    return "⚠️ [CONFIGURAÇÃO NECESSÁRIA] Por favor, configure a variável de ambiente API_KEY para ativar a IA.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Modelo rápido e eficiente para chat
    const modelName = 'gemini-2.5-flash';

    // Preparar histórico compatível com Gemini API
    const recentHistory = history.slice(-8).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6, // Mais criativo que 0, mas ainda focado
        maxOutputTokens: 200, // Respostas concisas para WhatsApp
        // Guideline: When maxOutputTokens is set, thinkingBudget must be set. 
        // Disabling thinking (0) to ensure fast and concise responses within the token limit.
        thinkingConfig: { thinkingBudget: 0 },
      },
      history: recentHistory
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
    
    return response.text || "Desculpe, não entendi. Poderia reformular?";
  } catch (error: any) {
    console.error("Erro na IA:", error);
    
    // Mensagem de erro amigável
    if (error.message && (error.message.includes('key') || error.message.includes('auth') || error.status === 400)) {
       return "⚠️ Erro de Autenticação: Verifique se a API_KEY está configurada corretamente.";
    }
    
    return "Desculpe, estou com uma breve instabilidade na minha conexão inteligente. Por favor, use o menu numérico por enquanto.";
  }
};
