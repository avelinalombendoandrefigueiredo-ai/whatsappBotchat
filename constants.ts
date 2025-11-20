import { MenuItem, MediaType, BotSettings } from './types';

export const INITIAL_SETTINGS: BotSettings = {
  companyName: "Minha Loja Tech",
  systemInstruction: "Você é o assistente virtual da 'Minha Loja Tech'. Seu nome é 'ZapBot'. Você deve ser extremamente educado, humanizado e usar emojis. Seu objetivo é ajudar o cliente a navegar pelos menus ou tirar dúvidas sobre produtos. Se o cliente estiver frustrado, peça desculpas e ofereça o menu principal. Responda de forma curta, ideal para WhatsApp.",
  apiKey: "", 
  isActive: true,
};

export const INITIAL_MENU: MenuItem[] = [
  {
    id: '1',
    trigger: '1',
    title: 'Ver Catálogo',
    responseType: MediaType.TEXT,
    content: 'Ótima escolha! Temos estas categorias disponíveis hoje:',
    children: [
      {
        id: '1-1',
        trigger: '1',
        title: 'Promoção do Dia (Imagem)',
        responseType: MediaType.IMAGE,
        content: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
        caption: 'Smartwatch Pro X - De R$ 500 por R$ 299! 🕒',
        children: []
      },
      {
        id: '1-2',
        trigger: '2',
        title: 'Vídeo de Lançamento',
        responseType: MediaType.VIDEO,
        content: 'https://www.w3schools.com/html/mov_bbb.mp4',
        caption: 'Veja o review do nosso novo fone!',
        children: []
      }
    ]
  },
  {
    id: '2',
    trigger: '2',
    title: 'Música Ambiente (Demo)',
    responseType: MediaType.AUDIO,
    content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    caption: 'Ouça nossa jingle oficial enquanto aguarda!',
    children: []
  },
  {
    id: '3',
    trigger: '3',
    title: 'Falar com Humano',
    responseType: MediaType.TEXT,
    content: 'Entendido. Estou transferindo você para um de nossos atendentes. O tempo médio de espera é de 5 minutos.',
    children: []
  }
];