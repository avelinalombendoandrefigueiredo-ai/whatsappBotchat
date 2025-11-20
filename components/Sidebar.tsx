import React from 'react';
import { LayoutDashboard, ListTree, MessageSquareText, Settings, QrCode } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menus', label: 'Editor de Menus', icon: ListTree },
    { id: 'simulator', label: 'Simulador Chat', icon: MessageSquareText },
    { id: 'qrcode', label: 'Conexão QR', icon: QrCode },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-10 hidden md:flex">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-green-600 flex items-center gap-2">
          <MessageSquareText className="w-6 h-6" />
          ZapBot Master
        </h1>
        <p className="text-xs text-gray-500 mt-1">Painel Administrativo</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150
                ${isActive 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500">Status do Sistema</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-green-700">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};