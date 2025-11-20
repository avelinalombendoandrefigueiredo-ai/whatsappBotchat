import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, Server, AlertTriangle, MousePointerClick, Globe } from 'lucide-react';

interface QRCodeScreenProps {
    onConnect: () => void;
    isConnected: boolean;
}

export const QRCodeScreen: React.FC<QRCodeScreenProps> = ({ onConnect, isConnected }) => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'connected' | 'error'>(isConnected ? 'connected' : 'loading');
  const [useBackend, setUseBackend] = useState(false);
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
      // Carregar URL do backend das configurações locais
      const savedSettings = localStorage.getItem('zapbot_settings');
      if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.backendUrl) setBackendUrl(parsed.backendUrl);
      }
  }, []);
  
  useEffect(() => {
    if (!isConnected) {
        const timer1 = setTimeout(() => setStatus('ready'), 1500);
        return () => clearTimeout(timer1);
    }
  }, [isConnected]);

  const handleSimulateScan = () => {
      if (status !== 'ready' && status !== 'error') return;
      
      setStatus('loading');
      setTimeout(() => {
          setStatus('connected');
          onConnect();
      }, 2000);
  };

  const handleTryBackend = async () => {
      if(!backendUrl) {
          alert('Configure a URL do backend nas Configurações primeiro.');
          return;
      }
      
      setStatus('loading');
      setUseBackend(true);

      // Simulação de tentativa de fetch real
      // No seu código real, aqui você faria: await fetch(`${backendUrl}/qr-code`)
      try {
          // Timeout proposital para simular rede
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Como não sei o endpoint do seu backend, vou lançar um erro simulado
          // para mostrar a UI de "Servidor não encontrado" e permitir voltar pro modo simulado
          throw new Error("Endpoint não encontrado (Simulação)");
      } catch (e) {
          console.warn("Não foi possível conectar ao backend automaticamente:", e);
          setStatus('error');
      }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-4 md:p-6 animate-in fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-4xl w-full flex flex-col md:flex-row gap-8">
        
        {/* Lado Esquerdo - QR Code Visual */}
        <div className="flex-1 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Conectar WhatsApp</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
                {status === 'connected' 
                    ? 'Sessão ativa e sincronizada.' 
                    : 'Escaneie o código para iniciar a sessão.'}
            </p>

            <div className="relative inline-block group cursor-pointer" onClick={!useBackend ? handleSimulateScan : undefined}>
            <div className={`w-64 h-64 bg-white rounded-lg border-2 ${status === 'ready' ? 'border-gray-800' : status === 'error' ? 'border-red-300' : 'border-gray-200'} flex items-center justify-center mb-4 relative overflow-hidden transition-all shadow-sm`}>
                
                {status === 'loading' && (
                <div className="flex flex-col items-center animate-pulse">
                    <RefreshCw className="w-10 h-10 text-green-600 animate-spin mb-2" />
                    <span className="text-xs font-semibold text-gray-500">
                        {useBackend ? 'Buscando QR do Servidor...' : 'Gerando chaves...'}
                    </span>
                </div>
                )}

                {status === 'ready' && !useBackend && (
                <div className="relative">
                    {/* QR Code Estático para Simulação Visual */}
                    <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Este_QR_Code_Eh_Uma_Simulacao_Frontend_Clique_Para_Entrar" 
                        alt="QR Code" 
                        className="w-56 h-56 object-contain opacity-80 blur-[2px] hover:blur-0 transition-all duration-300"
                    />
                    {/* Overlay de Instrução */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-transparent transition-colors">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded shadow-lg flex items-center gap-2 text-sm font-bold text-gray-800 border border-gray-200 animate-bounce">
                            <MousePointerClick size={16} />
                            Clique para Simular
                        </div>
                    </div>
                </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center p-4 text-red-500">
                        <AlertTriangle size={32} className="mb-2" />
                        <p className="text-xs font-bold">Falha ao conectar no Backend</p>
                        <p className="text-[10px] mt-1 text-gray-400">Verifique a URL ou use o modo simulado.</p>
                        <button 
                            onClick={() => { setUseBackend(false); setStatus('ready'); }}
                            className="mt-3 px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200"
                        >
                            Voltar para Simulação
                        </button>
                    </div>
                )}

                {status === 'connected' && (
                    <div className="absolute inset-0 bg-green-50 flex flex-col items-center justify-center">
                        <CheckCircle className="w-20 h-20 text-green-500 mb-2 drop-shadow-sm" />
                        <span className="text-lg font-bold text-green-700">Conectado!</span>
                    </div>
                )}
            </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-2">
                {useBackend ? `Backend: ${backendUrl}` : `Sessão Simulada: ${Math.random().toString(36).substr(2, 8).toUpperCase()}`}
            </div>
        </div>

        {/* Lado Direito - Informações Técnicas */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
            
            {status !== 'connected' ? (
                <>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-blue-800 text-sm">Ambiente Detectado: Frontend</h4>
                                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                    Seu backend está pronto? Você pode tentar conectar diretamente nele ou usar a simulação local para testar os menus.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={() => { setUseBackend(false); handleSimulateScan(); }}
                            className={`w-full py-3 rounded-lg border transition-colors text-sm font-medium flex items-center justify-center gap-2
                                ${!useBackend ? 'bg-gray-800 text-white border-gray-800 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                        >
                            <MousePointerClick size={16} />
                            Usar Simulação Local
                        </button>
                        
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">ou</span></div>
                        </div>

                        <button 
                            onClick={handleTryBackend}
                            className={`w-full py-3 rounded-lg border transition-colors text-sm font-medium flex items-center justify-center gap-2
                                ${useBackend ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                        >
                            <Globe size={16} />
                            Conectar ao Servidor Real
                        </button>
                    </div>
                </>
            ) : (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                        <h4 className="font-bold text-green-800 text-sm flex items-center gap-2">
                            <Server size={16} />
                            Sistema Online
                        </h4>
                        <p className="text-xs text-green-700 mt-1">
                            Conexão estabelecida com sucesso via {useBackend ? 'Socket Real' : 'Simulador Local'}.
                        </p>
                    </div>
                    
                    <button 
                        className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium shadow-lg shadow-gray-900/20"
                        onClick={() => window.location.reload()}
                    >
                        Desconectar Sessão
                    </button>
                </div>
            )}
            
            <div className="pt-4 border-t border-gray-100">
                 <div className="flex items-center justify-between text-xs text-gray-400">
                     <span>Status da Conexão</span>
                     <span className={status === 'connected' ? 'text-green-500 font-mono' : 'text-orange-400 font-mono'}>
                         {status === 'connected' ? 'ESTABLISHED' : 'HANDSHAKE_PENDING'}
                     </span>
                 </div>
            </div>

        </div>

      </div>
    </div>
  );
};