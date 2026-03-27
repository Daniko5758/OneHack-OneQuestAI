'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@onelabs/dapp-kit';
import { getFullnodeUrl } from '@onelabs/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@onelabs/dapp-kit/dist/index.css';
import Navbar from './components/ui/Navbar';
import ParticleBackground from './components/ui/ParticleBackground';
import { ToastProvider } from './components/ui/Toast';

const inter = Inter({ subsets: ["latin"] });

const { networkConfig } = createNetworkConfig({
  testnet: { url: 'https://rpc-testnet.onelabs.cc:443' },
});
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>OneQuest AI — Learn, Quest, Earn on OneChain</title>
        <meta name="description" content="OneQuest AI is an educational on-chain engagement platform on OneChain. Complete AI-generated quests, earn NFT badges, and explore the ecosystem." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
            <WalletProvider autoConnect>
              <ToastProvider>
                <ParticleBackground />
                <Navbar />
                <main style={{ position: 'relative', zIndex: 1, paddingTop: '72px', minHeight: '100vh' }}>
                  {children}
                </main>
              </ToastProvider>
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}