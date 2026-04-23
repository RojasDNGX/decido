import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import BackToTop from './components/BackToTop';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Decido - Assistente Inteligente de Decisões',
  description: 'Priorização de tarefas baseada em urgência, impacto e contexto prático.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={outfit.className} suppressHydrationWarning>
        {children}
        <BackToTop />
        {/* Analytics desativado para ambiente LAN local */}
      </body>
    </html>
  );
}
