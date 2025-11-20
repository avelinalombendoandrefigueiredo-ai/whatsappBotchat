export enum MediaType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export interface MenuItem {
  id: string;
  trigger: string; // O número ou palavra-chave
  title: string; // Descrição curta para o botão/lista
  responseType: MediaType;
  content: string; // Texto da mensagem ou URL da mídia
  caption?: string; // Legenda para mídias
  children: MenuItem[]; // Submenus
  parentId?: string | null;
}

export interface BotSettings {
  companyName: string;
  systemInstruction: string;
  apiKey: string;
  isActive: boolean;
  blockedNumbers: string[]; // Lista de números ignorados pelo bot
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  timestamp: Date;
}

export interface DashboardStats {
  activeChats: number;
  totalClients: number;
  totalSessions24h: number;
  totalMenuOptions: number;
  isConnected: boolean;
}

export type ViewState = 'dashboard' | 'menus' | 'settings' | 'qrcode' | 'simulator';