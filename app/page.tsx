import { Metadata } from 'next';
import LandingClient from './LandingClient';

export const metadata: Metadata = {
  title: 'Decido | Pare de decidir, comece a agir',
  description: 'O Decido usa inteligência artificial para analisar suas tarefas e dizer exatamente o que você deve fazer agora. Elimine a paralisia da escolha.',
  openGraph: {
    title: 'Decido | Inteligência para sua produtividade',
    description: 'Transforme caos em clareza. O assistente que decide suas prioridades por você.',
    type: 'website',
    locale: 'pt_BR',
    url: 'https://decido.com.br',
  },
};

export default function LandingPage() {
  return <LandingClient />;
}
