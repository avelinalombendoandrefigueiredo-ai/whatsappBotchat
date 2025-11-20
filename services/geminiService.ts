import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Serviço de Inteligência Artificial
 * 
 * NOTA SOBRE DEEPSEEK:
 * Este simulador frontend usa a biblioteca oficial do Google GenAI (@google/genai) porque ela é compatível
 * com o ambiente de execução WebContainer.
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
  // Chave de API vinda das variáveis de ambiente (Configurada no .env)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("API Key não encontrada. O bot funcionará em modo de demonstração limitado.");
    return "⚠️ [MODO DEMONSTRAÇÃO] Configure a API_KEY no arquivo .env para ativar a inteligência real. Por enquanto, só consigo responder aos menus numéricos.";
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
      },
      history: recentHistory
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
    
    return response.text || "Desculpe, não entendi. Poderia reformular?";
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Desculpe, estou com uma breve instabilidade na minha conexão inteligente. Por favor, use o menu numérico por enquanto.";
  }
};