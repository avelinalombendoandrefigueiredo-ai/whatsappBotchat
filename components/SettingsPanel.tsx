import React, { useState } from 'react';
import { BotSettings } from '../types';
import { Save, Terminal, ToggleLeft, ToggleRight, Key, AlertTriangle, Eye, EyeOff, ShieldOff, Plus, Trash2, UserX } from 'lucide-react';

interface SettingsPanelProps {
  settings: BotSettings;
  onSave: (settings: BotSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showKey, setShowKey] = useState(false);
  
  // Estados para a lista de bloqueio
  const [selectedDDI, setSelectedDDI] = useState('+55');
  const [blockNumberInput, setBlockNumberInput] = useState('');

  const handleChange = (field: keyof BotSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleApiKeyChange = (value: string) => {
      // Remove espaços vazios que podem vir de copy-paste
      handleChange('apiKey', value.trim());
  };

  const handleAddBlockedNumber = () => {
      if (!blockNumberInput.trim()) return;
      
      // Remove caracteres não numéricos para salvar limpo
      const cleanNumber = blockNumberInput.replace(/\D/g, '');
      
      // Impede adicionar se não tiver numero
      if(cleanNumber.length < 4) {
          alert('Número muito curto.');
          return;
      }

      const fullNumber = `${selectedDDI}${cleanNumber}`;

      if (localSettings.blockedNumbers.includes(fullNumber)) {
          alert('Este número já está na lista.');
          setBlockNumberInput('');
          return;
      }

      const newBlockedList = [...(localSettings.blockedNumbers || []), fullNumber];
      handleChange('blockedNumbers', newBlockedList);
      setBlockNumberInput('');
  };

  const handleRemoveBlockedNumber = (numberToRemove: string) => {
      const newList = localSettings.blockedNumbers.filter(n => n !== numberToRemove);
      handleChange('blockedNumbers', newList);
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Configurações do Bot</h2>
        <div className="text-xs text-gray-400 font-mono">v1.2.0 Stable</div>
      </div>
      
      <div className="grid gap-6">
        {/* Identity Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Identidade</h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={localSettings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Ex: Minha Loja"
              />
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div className="text-sm text-gray-600">
                   <span className="font-bold block text-gray-800">Status Geral do Bot</span>
                   Quando inativo, o bot não responderá ninguém.
               </div>
               <button 
                 onClick={() => handleChange('isActive', !localSettings.isActive)}
                 className={`flex items-center gap-2 font-medium transition-colors ${localSettings.isActive ? 'text-green-600' : 'text-gray-400'}`}
               >
                 {localSettings.isActive ? <ToggleRight size={36} className="transition-transform" /> : <ToggleLeft size={36} />}
                 {localSettings.isActive ? 'ATIVO' : 'INATIVO'}
               </button>
            </div>
          </div>
        </div>

        {/* Blocked Numbers Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
             <ShieldOff size={20} className="text-red-500" />
             Lista de Exceções (Não Responder)
           </h3>
           <div className="mb-4 text-sm text-gray-600">
             Adicione números de amigos, familiares ou VIPs. O bot <strong>não responderá</strong> automaticamente a estes contatos, permitindo que você responda manualmente.
           </div>

           <div className="flex flex-col md:flex-row gap-2 mb-4">
               <select 
                  value={selectedDDI}
                  onChange={(e) => setSelectedDDI(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md bg-gray-50 font-medium text-gray-700 focus:ring-green-500 focus:border-green-500 outline-none"
               >
                   <option value="+55">🇧🇷 Brasil (+55)</option>
                   <option value="+244">🇦🇴 Angola (+244)</option>
                   <option value="+1">🇺🇸 EUA (+1)</option>
                   <option value="+351">🇵🇹 Portugal (+351)</option>
               </select>
               <input 
                  type="tel"
                  value={blockNumberInput}
                  onChange={(e) => setBlockNumberInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBlockedNumber()}
                  placeholder="Digite o número (ex: 999998888)"
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 outline-none"
               />
               <button 
                  onClick={handleAddBlockedNumber}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-black flex items-center gap-2 transition-colors active:scale-95"
               >
                   <Plus size={18} />
                   Adicionar
               </button>
           </div>

           {localSettings.blockedNumbers && localSettings.blockedNumbers.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-40 overflow-y-auto custom-scrollbar">
                   {localSettings.blockedNumbers.map((num) => (
                       <div key={num} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200 shadow-sm animate-in zoom-in duration-200">
                           <div className="flex items-center gap-2">
                               <UserX size={14} className="text-red-400" />
                               <span className="text-sm font-mono text-gray-600 font-bold">{num}</span>
                           </div>
                           <button 
                                onClick={() => handleRemoveBlockedNumber(num)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                                title="Remover da lista"
                           >
                               <Trash2 size={14} />
                           </button>
                       </div>
                   ))}
               </div>
           ) : (
               <div className="text-center py-4 text-gray-400 text-sm italic border-2 border-dashed border-gray-100 rounded-lg">
                   Nenhum número na lista de exceções.
               </div>
           )}
        </div>

        {/* API Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
             <Key size={20} />
             Chave de API (Inteligência)
           </h3>
           
           <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sua API Key</label>
              <div className="relative">
                <input
                    type={showKey ? "text" : "password"}
                    value={localSettings.apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                    placeholder="Cole sua chave aqui (ex: sk-...)"
                />
                <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                  O simulador utiliza o provedor Google GenAI.
              </p>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-3 rounded-md flex gap-3 items-start">
               <AlertTriangle className="text-blue-600 shrink-0 mt-0.5" size={18} />
               <div className="text-sm text-blue-800">
                  <strong>Sobre o uso de DeepSeek:</strong><br/>
                  Para utilizar a DeepSeek no seu ambiente de produção (Node.js), você não precisa alterar este painel. 
                  Basta configurar o código backend (arquivo <code>services/geminiService.ts</code>) para apontar para <code>https://api.deepseek.com</code>.
               </div>
           </div>
        </div>

        {/* AI Personality Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
            <Terminal size={20} />
            Personalidade (Prompt)
          </h3>
          
          <div className="mb-4 bg-gray-50 p-3 rounded-md text-sm text-gray-600 border border-gray-100">
            Define como o bot deve se comportar quando o usuário <strong>não</strong> seleciona um número do menu.
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instrução do Sistema</label>
            <textarea
              value={localSettings.systemInstruction}
              onChange={(e) => handleChange('systemInstruction', e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm font-mono leading-relaxed"
              placeholder="Ex: Você é um atendente virtual..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => onSave(localSettings)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-lg shadow-green-600/20 transition-all active:scale-95 transform hover:-translate-y-1"
          >
            <Save size={20} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};