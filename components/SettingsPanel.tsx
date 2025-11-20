import React, { useState } from 'react';
import { BotSettings } from '../types';
import { Save, Terminal, ToggleLeft, ToggleRight, Key, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface SettingsPanelProps {
  settings: BotSettings;
  onSave: (settings: BotSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showKey, setShowKey] = useState(false);

  const handleChange = (field: keyof BotSettings, value: any) => {
    setLocalSettings({ ...localSettings, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configurações do Bot</h2>
      
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
            <div className="flex items-center justify-between">
               <div className="text-sm text-gray-600">Status do Bot</div>
               <button 
                 onClick={() => handleChange('isActive', !localSettings.isActive)}
                 className={`flex items-center gap-2 font-medium transition-colors ${localSettings.isActive ? 'text-green-600' : 'text-gray-400'}`}
               >
                 {localSettings.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                 {localSettings.isActive ? 'Ativo' : 'Inativo'}
               </button>
            </div>
          </div>
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
                    onChange={(e) => handleChange('apiKey', e.target.value)}
                    className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                    placeholder="Cole sua chave sk-... aqui"
                />
                <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                  Se deixar em branco, o sistema tentará usar a chave do arquivo .env
              </p>
           </div>

           <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md flex gap-3 items-start">
               <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
               <div className="text-sm text-yellow-800">
                  <strong>Atenção sobre DeepSeek vs Gemini:</strong><br/>
                  Este painel de demonstração roda no navegador e usa a biblioteca do <strong>Google Gemini</strong>. 
                  Se você colar uma chave da DeepSeek (sk-...), o simulador pode dar erro de autenticação aqui no navegador.<br/>
                  <span className="text-xs opacity-80 mt-1 block">
                    * Para usar DeepSeek no produto final, exporte o código e siga as instruções no arquivo <code>services/geminiService.ts</code> para trocar a URL base.
                  </span>
               </div>
           </div>
        </div>

        {/* AI Personality Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
            <Terminal size={20} />
            Personalidade (Prompt)
          </h3>
          
          <div className="mb-4 bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-100">
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
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-lg shadow-green-600/20 transition-all active:scale-95"
          >
            <Save size={20} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};