import React from 'react';
import { Users, MessageCircle, Activity, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { DashboardStats } from '../types';

interface DashboardProps {
    stats: DashboardStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const items = [
    { 
        label: 'Conversas Ativas', 
        value: stats.isConnected ? stats.activeChats.toString() : '-', 
        icon: MessageCircle, 
        color: 'bg-blue-100 text-blue-600' 
    },
    { 
        label: 'Clientes Totais', 
        value: stats.isConnected ? stats.totalClients.toString() : '-', 
        icon: Users, 
        color: 'bg-purple-100 text-purple-600' 
    },
    { 
        label: 'Opções de Menu', 
        value: stats.totalMenuOptions.toString(), 
        icon: Activity, 
        color: 'bg-orange-100 text-orange-600' 
    },
    { 
        label: 'Sessões (24h)', 
        value: stats.isConnected ? stats.totalSessions24h.toString() : '-', 
        icon: Smartphone, 
        color: 'bg-green-100 text-green-600' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
          
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border ${stats.isConnected ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {stats.isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
              {stats.isConnected ? 'Servidor Conectado' : 'Aguardando QR Code'}
          </div>
      </div>
      
      {!stats.isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm flex items-center gap-3">
              <Smartphone className="shrink-0" />
              <span>
                  <strong>Atenção:</strong> Os dados de clientes e conversas só serão sincronizados após você escanear o QR Code na aba "Conexão QR".
                  As opções de menu são atualizadas localmente.
              </span>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Atividade em Tempo Real</h3>
            {stats.totalSessions24h > 0 ? (
                 <div className="space-y-4">
                    <div className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 animate-in slide-in-from-left-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">
                            ZB
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">Interação no Simulador</p>
                            <p className="text-xs text-gray-400">Agora mesmo</p>
                        </div>
                    </div>
                    {stats.totalSessions24h > 1 && (
                        <div className="flex items-start gap-3 pb-3 opacity-60">
                             <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                             <div>
                                 <p className="text-sm font-medium">Sessão anterior</p>
                                 <p className="text-xs text-gray-400">Há alguns minutos</p>
                             </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic py-4">Nenhuma atividade registrada ainda. Use o simulador para testar.</p>
            )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Saúde do Sistema</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Servidor Node.js</span>
                    <span className={`text-sm font-bold ${stats.isConnected ? 'text-green-600' : 'text-red-500'}`}>
                        {stats.isConnected ? 'Online (14ms)' : 'Desconectado'}
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-1000 ${stats.isConnected ? 'bg-green-500 w-full' : 'bg-red-300 w-[5%]'}`}></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Uso de Memória</span>
                    <span className="text-sm font-bold text-blue-600">{stats.totalMenuOptions * 2} MB</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                     <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(stats.totalMenuOptions * 5, 100)}%` }}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};