import React, { useState } from 'react';
import { MenuItem, MediaType } from '../types';
import { Plus, Trash2, ChevronRight, ChevronDown, Image, FileText, Video, Music, CornerDownRight, HelpCircle } from 'lucide-react';

interface MenuEditorProps {
  menu: MenuItem[];
  setMenu: (menu: MenuItem[]) => void;
}

export const MenuEditor: React.FC<MenuEditorProps> = ({ menu, setMenu }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const handleDelete = (id: string, list: MenuItem[]): MenuItem[] => {
    return list.filter(item => item.id !== id).map(item => ({
      ...item,
      children: handleDelete(id, item.children)
    }));
  };

  const handleAdd = (parentId: string | null) => {
    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      trigger: (Math.floor(Math.random() * 100) + 1).toString(),
      title: 'Nova Opção',
      responseType: MediaType.TEXT,
      content: 'Digite a resposta aqui...',
      children: [],
      parentId
    };

    if (parentId === null) {
      setMenu([...menu, newItem]);
    } else {
      const updateChildren = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.id === parentId) {
            return { ...item, children: [...item.children, newItem] };
          }
          return { ...item, children: updateChildren(item.children) };
        });
      };
      setMenu(updateChildren(menu));
      setExpandedNodes(new Set(expandedNodes).add(parentId));
    }
  };

  const handleUpdate = (id: string, field: keyof MenuItem, value: any) => {
    const updateRecursive = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return { ...item, children: updateRecursive(item.children) };
      });
    };
    setMenu(updateRecursive(menu));
  };

  const renderTree = (items: MenuItem[], level = 0) => {
    return items.map(item => (
      <div key={item.id} className="mb-3 transition-all duration-200 animate-in fade-in slide-in-from-left-2">
        <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group`}>
          
          {/* Header Row */}
          <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-t-lg border-b border-gray-100">
            <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <div className="cursor-pointer p-1 hover:bg-gray-200 rounded transition-colors" onClick={() => toggleNode(item.id)}>
                    {item.children.length > 0 ? (
                        expandedNodes.has(item.id) ? <ChevronDown size={18} className="text-gray-600" /> : <ChevronRight size={18} className="text-gray-400" />
                    ) : <div className="w-[18px]" />}
                </div>
              
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                    <div className="flex items-center bg-white border border-gray-200 rounded px-2 py-1 shadow-sm">
                        <span className="text-[10px] font-bold text-gray-400 mr-1 uppercase">Gatilho</span>
                        <input 
                            type="text" 
                            value={item.trigger}
                            onChange={(e) => handleUpdate(item.id, 'trigger', e.target.value)}
                            className="w-12 font-bold text-green-700 outline-none text-center bg-transparent"
                            placeholder="#"
                        />
                    </div>
                    <input 
                        type="text" 
                        value={item.title}
                        onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                        placeholder="Nome do Menu"
                        className="flex-1 font-semibold text-gray-700 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-green-500 focus:outline-none px-1 py-0.5 transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-1 ml-2 opacity-100 sm:opacity-60 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleAdd(item.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                title="Adicionar Submenu"
              >
                <CornerDownRight size={16} />
                <span className="hidden sm:inline">Submenu</span>
              </button>
              <div className="h-4 w-px bg-gray-300 mx-1"></div>
              <button 
                onClick={() => {
                    if(confirm('Tem certeza que deseja excluir este menu e todos os submenus?')) {
                        setMenu(handleDelete(item.id, menu));
                    }
                }}
                className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Content Editor */}
          <div className="p-4 space-y-4">
            <div>
               <div className="flex items-center justify-between mb-2">
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">O que o bot envia?</label>
               </div>
               <div className="flex flex-wrap gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                  {[MediaType.TEXT, MediaType.IMAGE, MediaType.VIDEO, MediaType.AUDIO].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleUpdate(item.id, 'responseType', type)}
                      className={`
                        flex-1 min-w-[80px] px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-all
                        ${item.responseType === type 
                            ? 'bg-white shadow-sm text-green-700 border border-green-100' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
                      `}
                    >
                      {type === MediaType.TEXT && <FileText size={14} />}
                      {type === MediaType.IMAGE && <Image size={14} />}
                      {type === MediaType.VIDEO && <Video size={14} />}
                      {type === MediaType.AUDIO && <Music size={14} />}
                      <span>{type === MediaType.TEXT ? 'Texto' : type === MediaType.IMAGE ? 'Foto' : type === MediaType.VIDEO ? 'Vídeo' : 'Áudio'}</span>
                    </button>
                  ))}
               </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between">
                    <label className="text-xs font-semibold text-gray-500">
                        {item.responseType === MediaType.TEXT ? 'Mensagem de Resposta:' : 'Link da Mídia (URL):'}
                    </label>
                    {item.responseType !== MediaType.TEXT && (
                         <span className="text-[10px] text-blue-500 cursor-pointer hover:underline">Como pegar o link?</span>
                    )}
                </div>
                <textarea
                    value={item.content}
                    onChange={(e) => handleUpdate(item.id, 'content', e.target.value)}
                    placeholder={item.responseType === MediaType.TEXT ? "Ex: Olá! Nossos planos começam em..." : "https://site.com/imagem.jpg"}
                    className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent focus:outline-none transition-all font-normal"
                    rows={item.responseType === MediaType.TEXT ? 3 : 1}
                />
            </div>

            {item.responseType !== MediaType.TEXT && (
                 <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                    <label className="text-xs font-semibold text-gray-500">Legenda da Mídia (Opcional):</label>
                    <input
                        type="text"
                        value={item.caption || ''}
                        onChange={(e) => handleUpdate(item.id, 'caption', e.target.value)}
                        placeholder="Texto que aparece embaixo da foto/vídeo..."
                        className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                </div>
            )}
          </div>

        </div>
        
        {/* Recursive Children Rendering */}
        {expandedNodes.has(item.id) && (
          <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-200/60 space-y-3">
            {item.children.length === 0 && (
                <div className="p-3 text-xs text-gray-400 italic bg-gray-50 rounded border border-dashed border-gray-200">
                    Nenhum submenu criado ainda.
                </div>
            )}
            {renderTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Editor de Fluxo</h2>
            <p className="text-gray-500 text-sm mt-1">Gerencie os menus numéricos. Se o cliente não digitar um número, a IA assume.</p>
        </div>
        <button 
          onClick={() => handleAdd(null)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-green-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          Adicionar Menu Principal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-1 pr-2 pb-20">
        {menu.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 bg-white border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-center p-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <CornerDownRight size={32} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-600 text-lg">Seu bot está vazio</h3>
            <p className="text-sm max-w-xs mt-2 mb-6">Comece adicionando o primeiro menu para seus clientes.</p>
            <button 
                onClick={() => handleAdd(null)}
                className="text-green-600 font-medium hover:underline"
            >
                + Criar primeira opção
            </button>
          </div>
        ) : (
          renderTree(menu)
        )}
      </div>
    </div>
  );
};