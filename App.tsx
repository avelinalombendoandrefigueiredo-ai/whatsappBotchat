import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MenuEditor } from './components/MenuEditor';
import { ChatSimulator } from './components/ChatSimulator';
import { SettingsPanel } from './components/SettingsPanel';
import { QRCodeScreen } from './components/QRCodeScreen';
import { INITIAL_MENU, INITIAL_SETTINGS } from './constants';
import { ViewState, MenuItem, BotSettings } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [settings, setSettings] = useState<BotSettings>({
      ...INITIAL_SETTINGS,
      apiKey: process.env.API_KEY || ''
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persist to local storage for demo feel
  useEffect(() => {
      const savedMenu = localStorage.getItem('zapbot_menu');
      if (savedMenu) setMenu(JSON.parse(savedMenu));
  }, []);

  useEffect(() => {
      localStorage.setItem('zapbot_menu', JSON.stringify(menu));
  }, [menu]);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard menuCount={menu.reduce((acc, item) => acc + 1 + item.children.length, 0)} />;
      case 'menus':
        return <MenuEditor menu={menu} setMenu={setMenu} />;
      case 'simulator':
        return <ChatSimulator menu={menu} settings={settings} />;
      case 'qrcode':
        return <QRCodeScreen />;
      case 'settings':
        return <SettingsPanel settings={settings} onSave={(s) => { setSettings(s); alert('Configurações salvas!'); }} />;
      default:
        return <Dashboard menuCount={0} />;
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
                {/* Reusing sidebar logic simplified for mobile would go here, but for this code block we stick to desktop-first responsive */}
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