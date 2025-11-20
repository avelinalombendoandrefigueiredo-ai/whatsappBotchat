import React from 'react';
import { BotSettings } from '../types';
import { Save, Terminal, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsPanelProps {
  settings: BotSettings;
  onSave: (settings: BotSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  const handleChange = (field: keyof BotSettings, value: any) => {
    setLocalSettings({ ...localSettings, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto">
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
              />
            </div>
            <div className="flex items-center justify-between">
               <div className="text-sm text-gray-600">Status do Bot</div>
               <button 
                 onClick={() => handleChange('isActive', !localSettings.isActive)}
                 className="flex items-center gap-2 text-green-600 font-medium"
               >
                 {localSettings.isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-400" />}
                 {localSettings.isActive ? 'Ativo' : 'Inativo'}
               </button>
            </div>
          </div>
        </div>

        {/* AI Personality Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
            <Terminal size={20} />
            Inteligência Artificial (Persona)
          </h3>
          
          <div className="mb-4 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
            Define como o bot deve se comportar quando o usuário não seleciona uma opção do menu numérico.
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instrução do Sistema (Prompt)</label>
            <textarea
              value={localSettings.systemInstruction}
              onChange={(e) => handleChange('systemInstruction', e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm font-mono"
            />
          </div>
        </div>

        {/* Tech Stack Info (Answering User Question indirectly) */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
           <h3 className="text-md font-semibold text-gray-800 mb-2">Nota sobre Tecnologia</h3>
           <p className="text-sm text-gray-600 mb-2">
             Para conectar este painel ao WhatsApp real, recomenda-se o uso de <strong>Node.js</strong> (com bibliotecas como Baileys ou whatsapp-web.js) ou <strong>Python</strong> (com bibliotecas como selenium/playwright).
           </p>
           <p className="text-sm text-gray-600">
             Esta interface em React gera o JSON necessário para alimentar esses backends.
           </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => onSave(localSettings)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-lg transition-all"
          >
            <Save size={20} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};