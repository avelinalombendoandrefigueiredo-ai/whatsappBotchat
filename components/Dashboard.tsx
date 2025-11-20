import React from 'react';
import { Users, MessageCircle, Activity, Smartphone } from 'lucide-react';
import { MenuItem } from '../types';

interface DashboardProps {
    menuCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ menuCount }) => {
  const stats = [
    { label: 'Conversas Ativas', value: '12', icon: MessageCircle, color: 'bg-blue-100 text-blue-600' },
    { label: 'Clientes Totais', value: '1,240', icon: Users, color: 'bg-purple-100 text-purple-600' },
    { label: 'Opções de Menu', value: menuCount.toString(), icon: Activity, color: 'bg-orange-100 text-orange-600' },
    { label: 'Sessões (24h)', value: '85', icon: Smartphone, color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
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
            <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium">Novo cliente iniciou conversa</p>
                            <p className="text-xs text-gray-400">Há {i * 15} minutos</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Performance da IA</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Respostas Automáticas</span>
                    <span className="text-sm font-bold text-green-600">85%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Transbordo Humano</span>
                    <span className="text-sm font-bold text-yellow-600">15%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};