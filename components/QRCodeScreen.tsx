import React, { useEffect, useState } from 'react';
import { Smartphone, RefreshCw, CheckCircle } from 'lucide-react';

export const QRCodeScreen: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'connected'>('loading');
  
  useEffect(() => {
    const timer1 = setTimeout(() => setStatus('ready'), 1500);
    return () => clearTimeout(timer1);
  }, []);

  const handleSimulateScan = () => {
      setStatus('loading');
      setTimeout(() => setStatus('connected'), 2000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-2xl w-full text-center">
        
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Conectar WhatsApp</h2>
        <p className="text-gray-500 mb-8">Abra o WhatsApp no seu celular e escaneie o código abaixo</p>

        <div className="relative inline-block group cursor-pointer" onClick={handleSimulateScan}>
          <div className={`w-64 h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 relative overflow-hidden transition-all ${status === 'ready' ? 'hover:border-green-500' : ''}`}>
            
            {status === 'loading' && (
              <div className="flex flex-col items-center animate-pulse">
                <RefreshCw className="w-10 h-10 text-gray-400 animate-spin mb-2" />
                <span className="text-sm text-gray-400">Gerando QR Code...</span>
              </div>
            )}

            {status === 'ready' && (
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SimulacaoZapBot" 
                alt="QR Code" 
                className="w-56 h-56 object-contain"
              />
            )}

            {status === 'connected' && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mb-2" />
                    <span className="text-lg font-bold text-green-600">Conectado!</span>
                </div>
            )}
            
            {status === 'ready' && (
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="bg-white px-3 py-1 rounded shadow text-sm font-bold text-gray-700">Clique para simular scan</span>
                </div>
            )}
          </div>
        </div>

        <div className="space-y-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">1</span>
                <span>Abra o WhatsApp no seu celular</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">2</span>
                <span>Toque em Menu ou Configurações</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">3</span>
                <span>Selecione Aparelhos Conectados</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm">4</span>
                <span>Aponte a câmera para esta tela</span>
            </div>
        </div>

      </div>
    </div>
  );
};