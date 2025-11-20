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
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [settings, setSettings] = useState<BotSettings>({
      ...INITIAL_SETTINGS,
      apiKey: process.env.API_KEY || ''
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado Global de Conexão e Métricas
  const [isConnected, setIsConnected] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    activeChats: 0,
    totalClients: 0, // Em um app real, viria do banco de dados
    totalSessions24h: 0
  });

  // Persistência Local (Simulando Banco de Dados)
  useEffect(() => {
      const savedMenu = localStorage.getItem('zapbot_menu');
      const savedStats = localStorage.getItem('zapbot_stats');
      const savedConnection = localStorage.getItem('zapbot_connected');

      if (savedMenu) setMenu(JSON.parse(savedMenu));
      if (savedStats) setSessionStats(JSON.parse(savedStats));
      if (savedConnection === 'true') setIsConnected(true);
  }, []);

  useEffect(() => {
      localStorage.setItem('zapbot_menu', JSON.stringify(menu));
      localStorage.setItem('zapbot_stats', JSON.stringify(sessionStats));
      localStorage.setItem('zapbot_connected', isConnected.toString());
  }, [menu, sessionStats, isConnected]);

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
        return <SettingsPanel settings={settings} onSave={(s) => { setSettings(s); alert('Configurações salvas!'); }} />;
      default:
        return <Dashboard stats={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={(v) => { setCurrentView(v); setIsMobileMenuOpen(false); }} />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="font-bold text-green-600">ZapBot Master</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden">
            <div className="bg-white h-full w-64 p-4">
                <div className="flex flex-col gap-4 mt-10">
                   <button onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-2">Dashboard</button>
                   <button onClick={() => { setCurrentView('menus'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-2">Menus</button>
                   <button onClick={() => { setCurrentView('simulator'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-2">Simulador</button>
                   <button onClick={() => { setCurrentView('qrcode'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-2">QR Code</button>
                   <button onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-2">Configurações</button>
                </div>
            </div>
        </div>
      )}

      <main className="md:ml-64 p-4 md:p-8 min-h-screen transition-all">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;