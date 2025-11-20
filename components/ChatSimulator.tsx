import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, Phone, Search, Smile, ArrowLeft, Lock } from 'lucide-react';
import { MenuItem, ChatMessage, MediaType, BotSettings } from '../types';
import { generateBotResponse } from '../services/geminiService';

interface ChatSimulatorProps {
  menu: MenuItem[];
  settings: BotSettings;
  onActivity: (isNewConversation: boolean) => void;
  isConnected: boolean;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({ menu, settings, onActivity, isConnected }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Start conversation if empty and connected
  useEffect(() => {
    if (messages.length === 0 && settings.isActive && isConnected) {
        setTimeout(() => {
            sendBotMessage(`Olá! Bem-vindo à *${settings.companyName}*! 👋\nComo posso ajudar você hoje?`, menu);
        }, 1000);
    }
  }, [settings.isActive, settings.companyName, isConnected]);

  // Helper to find parent of a node (Strict Type Version)
  const findParentId = (items: MenuItem[], targetId: string, currentParentId: string | null = null): string | null | undefined => {
    for (const item of items) {
      if (item.id === targetId) return currentParentId;
      if (item.children.length > 0) {
        const found = findParentId(item.children, targetId, item.id);
        if (found !== undefined) return found;
      }
    }
    return undefined;
  };

  // Helper to get current active level options
  const getCurrentOptions = (): MenuItem[] => {
    if (!activeMenuId) return menu;
    
    const findNode = (items: MenuItem[]): MenuItem | null => {
        for (const item of items) {
            if (item.id === activeMenuId) return item;
            const found = findNode(item.children);
            if (found) return found;
        }
        return null;
    };

    const node = findNode(menu);
    return node ? node.children : menu;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    // Notify App about activity
    if (!hasStarted) {
        setHasStarted(true);
        onActivity(true); // New Conversation
    } else {
        onActivity(false); // Just a new message
    }

    // --- BOT LOGIC ---

    // 1. Check commands (Navigation)
    if (['menu', 'sair', 'inicio', 'início'].includes(userText.toLowerCase())) {
        setTimeout(() => {
            setActiveMenuId(null);
            sendBotMessage("Reiniciando atendimento! Veja nossas opções:", menu);
        }, 1000);
        return;
    }

    if (userText.toLowerCase() === 'voltar') {
        setTimeout(() => {
            if (!activeMenuId) {
                sendBotMessage("Você já está no menu principal.", menu);
            } else {
                const parentId = findParentId(menu, activeMenuId);
                const nextId = parentId === undefined ? null : parentId;
                
                setActiveMenuId(nextId);
                
                let parentOptions = menu;
                if (nextId) {
                    const findNode = (items: MenuItem[]): MenuItem | null => {
                        for (const item of items) {
                            if (item.id === nextId) return item;
                            const found = findNode(item.children);
                            if (found) return found;
                        }
                        return null;
                    };
                    const node = findNode(menu);
                    if (node) parentOptions = node.children;
                }
                
                sendBotMessage("Voltando...", parentOptions);
            }
        }, 1000);
        return;
    }

    // 2. Check Menu Match
    const currentOptions = getCurrentOptions();
    const matchedOption = currentOptions.find(opt => opt.trigger.toLowerCase() === userText.toLowerCase());

    if (matchedOption) {
        await new Promise(r => setTimeout(r, 1000));

        const responseMsg: ChatMessage = {
            id: Date.now().toString() + 'bot',
            role: 'model',
            text: matchedOption.caption || matchedOption.title,
            mediaUrl: matchedOption.responseType !== MediaType.TEXT ? matchedOption.content : undefined,
            mediaType: matchedOption.responseType,
            timestamp: new Date()
        };

        if (matchedOption.responseType === MediaType.TEXT) {
            responseMsg.text = matchedOption.content;
        }

        setMessages(prev => [...prev, responseMsg]);
        setIsTyping(false);

        if (matchedOption.children.length > 0) {
            setActiveMenuId(matchedOption.id);
            setTimeout(() => {
                sendMenuOptions(matchedOption.children);
            }, 800);
        } 
    } else {
        // 3. AI Fallback
        try {
            const history = messages.map(m => ({ role: m.role, text: m.text }));
            
            let contextInstruction = settings.systemInstruction;
            const availableOptions = currentOptions.map(o => `${o.trigger} - ${o.title}`).join('\n');
            
            contextInstruction += `\n\n[ESTADO ATUAL]:\nOpções numéricas:\n${availableOptions}\n\nINSTRUÇÕES:\n1. Guie o usuário se ele tentar escolher algo.\n2. Responda dúvidas gerais.\n3. Ofereça 'Voltar' ou 'Menu' se necessário.`;

            const aiResponse = await generateBotResponse(history, userText, contextInstruction, settings.apiKey);
            
            sendBotMessage(aiResponse);
        } catch (e) {
            sendBotMessage("Desculpe, não consegui processar agora. Digite o número da opção desejada.");
        }
    }
  };

  const sendBotMessage = (text: string, optionsToDisplay?: MenuItem[]) => {
    const msg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: text,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, msg]);
    setIsTyping(false);

    if (optionsToDisplay && optionsToDisplay.length > 0) {
        setTimeout(() => sendMenuOptions(optionsToDisplay), 600);
    }
  };

  const sendMenuOptions = (items: MenuItem[]) => {
      setIsTyping(true);
      setTimeout(() => {
        const optionsText = items.map(i => `*${i.trigger}* - ${i.title}`).join('\n');
        const msg: ChatMessage = {
            id: Date.now().toString() + 'opts',
            role: 'model',
            text: `Escolha uma opção:\n\n${optionsText}\n\n_(Digite 'Voltar' para retornar)_`,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, msg]);
        setIsTyping(false);
      }, 800);
  };

  if (!isConnected) {
      return (
          <div className="flex items-center justify-center h-full bg-gray-100 p-6">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                  <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Simulador Bloqueado</h3>
                  <p className="text-gray-500 mb-6">Você precisa conectar o WhatsApp (escanear o QR Code) para iniciar a simulação e coletar métricas reais.</p>
                  <p className="text-xs text-gray-400">Vá até a aba <strong>Conexão QR</strong>.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-[#efe7dd] relative rounded-2xl overflow-hidden shadow-2xl border border-gray-300 max-w-md mx-auto md:max-w-2xl font-sans">
        {/* WhatsApp Header */}
        <div className="bg-[#008069] px-3 py-2 flex items-center justify-between text-white shadow-md z-10">
            <div className="flex items-center gap-3">
                 <ArrowLeft className="md:hidden cursor-pointer" size={24} onClick={() => {}} />
                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                   <img src={`https://ui-avatars.com/api/?name=${settings.companyName.replace(/ /g, '+')}&background=25D366&color=fff&bold=true`} alt="Bot" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                    <h3 className="font-semibold text-base leading-tight truncate max-w-[150px] sm:max-w-[300px]">{settings.companyName}</h3>
                    <p className="text-xs text-green-100 opacity-90 truncate">
                        {isTyping ? 'digitando...' : 'online agora'}
                    </p>
                </div>
            </div>
            <div className="flex gap-4 text-white">
                <Phone size={20} />
                <Search size={20} />
                <MoreVertical size={20} />
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] relative">
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>
             
             <div className="flex justify-center mb-6 relative z-10">
                <div className="bg-[#FFF5C4] text-gray-600 text-[11px] shadow-sm px-3 py-1 rounded-lg text-center max-w-[80%] leading-4">
                    🔒 As mensagens são protegidas com criptografia de ponta-a-ponta.
                </div>
             </div>

            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10 group`}>
                    <div className={`
                        max-w-[85%] rounded-lg p-1 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-sm relative
                        ${msg.role === 'user' ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}
                    `}>
                        {msg.mediaType && msg.mediaType !== MediaType.TEXT && msg.mediaUrl && (
                            <div className="rounded-lg overflow-hidden mb-1 m-0.5 bg-black/5">
                                {msg.mediaType === MediaType.IMAGE && (
                                    <img src={msg.mediaUrl} alt="Mídia" className="w-full h-auto object-cover max-h-64 min-w-[150px]" 
                                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300?text=Erro+na+Imagem')} />
                                )}
                                {msg.mediaType === MediaType.VIDEO && (
                                     <video controls className="w-full max-h-64 bg-black min-w-[200px]">
                                        <source src={msg.mediaUrl} />
                                        Vídeo indisponível
                                     </video>
                                )}
                                {msg.mediaType === MediaType.AUDIO && (
                                    <div className="px-1 py-2 min-w-[220px] flex items-center justify-center bg-gray-50 rounded border border-gray-100">
                                        <audio controls className="h-8 w-full max-w-[240px]">
                                            <source src={msg.mediaUrl} />
                                        </audio>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={`px-2 pb-4 pt-1.5 whitespace-pre-wrap text-[#111b21] leading-relaxed text-[14.2px] ${msg.role === 'user' ? '' : 'mr-2'}`}>
                            {msg.text}
                        </div>
                        
                        <div className="absolute bottom-1 right-2 text-[10px] text-gray-500 flex items-center gap-0.5">
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {msg.role === 'user' && <span className="text-[#53bdeb] ml-0.5">✓✓</span>}
                        </div>
                    </div>
                </div>
            ))}
            
            {isTyping && (
                 <div className="flex justify-start relative z-10">
                    <div className="bg-white rounded-xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100">
                        <div className="flex gap-1.5">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f2f5] px-2 py-2 flex items-end gap-2 z-20 select-none">
            <div className="bg-white rounded-2xl flex-1 flex items-end p-2 shadow-sm border border-gray-100">
                <button className="text-gray-400 p-1.5 hover:text-gray-600">
                    <Smile size={24} />
                </button>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder="Mensagem"
                    rows={1}
                    className="w-full outline-none text-[15px] bg-transparent px-2 py-1.5 resize-none max-h-32 text-gray-800 placeholder:text-gray-500 scrollbar-hide"
                />
                <button className="text-gray-400 p-1.5 hover:text-gray-600 -rotate-45">
                    <Paperclip size={22} />
                </button>
            </div>
            <button 
                onClick={handleSendMessage}
                className={`p-3 rounded-full transition-all active:scale-95 shadow-sm flex items-center justify-center ${inputValue.trim() ? 'bg-[#008069] text-white hover:bg-[#006d59]' : 'bg-[#008069] text-white'}`}
            >
                {inputValue.trim() ? <Send size={20} className="ml-0.5" /> : <div className="w-5 h-5 text-center leading-5">🎤</div>}
            </button>
        </div>
    </div>
  );
};