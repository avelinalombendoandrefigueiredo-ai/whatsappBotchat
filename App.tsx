import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MenuEditor } from './components/MenuEditor';
import { ChatSimulator } from './components/ChatSimulator';
import { SettingsPanel } from './components/SettingsPanel';
import { QRCodeScreen } from './components/QRCodeScreen';
import { INITIAL_MENU, INITIAL_SETTINGS } from './constants';
import { ViewState, MenuItem, BotSettings, DashboardStats } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Inicialização Segura do Estado (Safe Initialization)
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('zapbot_menu');
      return saved ? JSON.parse(saved) : INITIAL_MENU;
    } catch (e) {
      console.error("Erro ao carregar menu:", e);
      return INITIAL_MENU;
    }
  });

  const [settings, setSettings] = useState<BotSettings>(() => {
    try {
      const saved = localStorage.getItem('zapbot_settings'); // Corrigido key para ser específica
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : { ...INITIAL_SETTINGS, apiKey: process.env.API_KEY || '' };
    } catch (e) {
      console.error("Erro ao carregar configurações:", e);
      return { ...INITIAL_SETTINGS, apiKey: process.env.API_KEY || '' };
    }
  });

  // Estado Global de Conexão e Métricas
  const [isConnected, setIsConnected] = useState(() => {
    try {
       return localStorage.getItem('zapbot_connected') === 'true';
    } catch { return false; }
  });

  const [sessionStats, setSessionStats] = useState(() => {
    try {
      const saved = localStorage.getItem('zapbot_stats');
      return saved ? JSON.parse(saved) : { activeChats: 0, totalClients: 0, totalSessions24h: 0 };
    } catch {
      return { activeChats: 0, totalClients: 0, totalSessions24h: 0 };
    }
  });

  // Persistência Local com Debounce leve
  useEffect(() => {
      try {
        localStorage.setItem('zapbot_menu', JSON.stringify(menu));
      } catch (e) { console.error("Erro ao salvar menu", e); }
  }, [menu]);

  useEffect(() => {
      try {
        localStorage.setItem('zapbot_settings', JSON.stringify(settings));
      } catch (e) { console.error("Erro ao salvar settings", e); }
  }, [settings]);

  useEffect(() => {
      try {
        localStorage.setItem('zapbot_stats', JSON.stringify(sessionStats));
        localStorage.setItem('zapbot_connected', isConnected.toString());
      } catch (e) { console.error("Erro ao salvar stats", e); }
  }, [sessionStats, isConnected]);

  // Cálculo em Tempo Real de Opções de Menu (Recursivo)
  const totalMenuOptions = useMemo(() => {
      const countItems = (items: MenuItem[]): number => {
          return items.reduce((acc, item) => acc + 1 + countItems(item.children), 0);
      };
      return countItems(menu);
  }, [menu]);

  // Função chamada quando o Chat Simulator é usado (Simulando tráfego real)
  const handleChatActivity = (isNewConversation: boolean) => {
      if (!isConnected) return; // Só conta se estiver "conectado"

      setSessionStats(prev => ({
          ...prev,
          totalSessions24h: prev.totalSessions24h + 1,
          activeChats: isNewConversation ? prev.activeChats + 1 : prev.activeChats,
          totalClients: isNewConversation ? prev.totalClients + 1 : prev.totalClients
      }));
  };

  // Função chamada quando o QR Code é conectado com sucesso
  const handleConnectionSuccess = () => {
      setIsConnected(true);
      // Simula carregamento de dados prévios do servidor ao conectar
      if (sessionStats.totalClients === 0) {
          setSessionStats(prev => ({
              ...prev,
              activeChats: 1,
              totalClients: 14, // Exemplo de dados puxados do "backup" do WhatsApp
              totalSessions24h: 5
          }));
      }
  };

  // Agrupando dados para o Dashboard
  const dashboardData: DashboardStats = {
      activeChats: sessionStats.activeChats,
      totalClients: sessionStats.totalClients,
      totalSessions24h: sessionStats.totalSessions24h,
      totalMenuOptions: totalMenuOptions,
      isConnected: isConnected
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard stats={dashboardData} />;
      case 'menus':
        return <MenuEditor menu={menu} setMenu={setMenu} />;
      case 'simulator':
        return (
            <ChatSimulator 
                menu={menu} 
                settings={settings} 
                onActivity={handleChatActivity} 
                isConnected={isConnected}
            />
        );
      case 'qrcode':
        return <QRCodeScreen onConnect={handleConnectionSuccess} isConnected={isConnected} />;
      case 'settings':
        return <SettingsPanel settings={settings} onSave={(s) => { setSettings(s); alert('Configurações salvas com sucesso!'); }} />;
      default:
        return <Dashboard stats={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar currentView={currentView} onViewChange={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <h1 className="font-bold text-green-600 text-lg">ZapBot Master</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-md">
            <Menu className="text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-white h-full w-64 p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-green-600 mb-6 px-2">Menu</h2>
                <div className="flex flex-col gap-2">
                   <button onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-3 hover:bg-gray-50 rounded-lg text-gray-700">Dashboard</button>
                   <button onClick={() => { setCurrentView('menus'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-3 hover:bg-gray-50 rounded-lg text-gray-700">Menus & Fluxo</button>
                   <button onClick={() => { setCurrentView('simulator'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-3 hover:bg-gray-50 rounded-lg text-gray-700">Simulador Chat</button>
                   <button onClick={() => { setCurrentView('qrcode'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-3 hover:bg-gray-50 rounded-lg text-gray-700">Conexão QR</button>
                   <button onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-3 hover:bg-gray-50 rounded-lg text-gray-700">Configurações</button>
                </div>
            </div>
        </div>
      )}

      <main className="md:ml-64 p-4 md:p-8 min-h-screen transition-all">
        <div className="max-w-6xl mx-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;