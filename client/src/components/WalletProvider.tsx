import { WalletProvider, AllDefaultWallets } from '@suiet/wallet-kit';

interface WalletProviderWrapperProps {
  children: React.ReactNode;
}

export default function WalletProviderWrapper({ children }: WalletProviderWrapperProps) {
  return (
    <WalletProvider defaultWallets={AllDefaultWallets}>
      {children}
    </WalletProvider>
  );
}