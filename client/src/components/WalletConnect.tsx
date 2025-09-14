import { useState, useEffect } from 'react';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import { SuiClient } from '@mysten/sui.js/client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const suiClient = new SuiClient({
  url: 'https://fullnode.mainnet.sui.io:443',
});

const MNM_TOKEN_TYPE = "0xefde5ddb743bd93e68a75e410e985980457b5e8837c7f4afa36ecc12bb91022b::mnm::MNM";

interface WalletConnectProps {
  onTokenVerified: (hasTokens: boolean) => void;
}

export default function WalletConnect({ onTokenVerified }: WalletConnectProps) {
  const wallet = useWallet();
  const [isVerifying, setIsVerifying] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    if (wallet.connected && wallet.account) {
      // Reset verification state when account changes and re-verify
      setVerificationComplete(false);
      setTokenBalance(0);
      onTokenVerified(false);
      verifyTokenBalance();
    } else if (!wallet.connected) {
      setTokenBalance(0);
      setVerificationComplete(false);
      onTokenVerified(false);
    }
  }, [wallet.connected, wallet.account?.address]); // Watch address specifically for account changes

  const verifyTokenBalance = async () => {
    if (!wallet.account?.address) return;
    
    setIsVerifying(true);
    try {
      const objects = await suiClient.getAllCoins({
        owner: wallet.account.address
      });
      
      // Filter coins by the MNM token type
      const mnmCoins = objects.data.filter(coin => coin.coinType === MNM_TOKEN_TYPE);
      
      const totalBalance = mnmCoins.reduce((sum, coin) => {
        return sum + parseInt(coin.balance);
      }, 0);
      
      // Try to get proper decimals, fallback to 6 if not available
      let decimals = 6;
      try {
        const metadata = await suiClient.getCoinMetadata({ coinType: MNM_TOKEN_TYPE });
        if (metadata && metadata.decimals) {
          decimals = metadata.decimals;
        }
      } catch (error) {
        console.log('Could not fetch coin metadata, using 6 decimals');
      }
      
      const balanceInTokens = totalBalance / Math.pow(10, decimals);
      setTokenBalance(balanceInTokens);
      setVerificationComplete(true);
      onTokenVerified(balanceInTokens > 0);
    } catch (error) {
      console.error('Error verifying token balance:', error);
      setTokenBalance(0);
      setVerificationComplete(true);
      onTokenVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisconnect = () => {
    wallet.disconnect();
    setTokenBalance(0);
    setVerificationComplete(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat().format(Math.floor(balance));
  };

  if (!wallet.connected) {
    return (
      <Card className="vintage-border cartoon-shadow bg-card p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="text-2xl font-black text-primary mb-4" data-testid="wallet-connect-title">
            CONNECT WALLET
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Connect your SUI wallet to verify $MNM token ownership and access the exclusive comic series.
          </p>
          <div className="w-full" data-testid="connect-wallet-button">
            <ConnectButton 
              className="vintage-button w-full py-3 font-bold text-primary hover:bg-accent bg-background border-2 border-primary"
              style={{
                border: '2px solid var(--primary)',
                borderRadius: '0.5rem',
                background: 'var(--background)',
                color: 'var(--primary)',
                fontWeight: 'bold',
                padding: '0.75rem',
                width: '100%'
              }}
            >
              <i className="fas fa-wallet mr-2"></i>
              Connect SUI Wallet
            </ConnectButton>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="vintage-border cartoon-shadow bg-card p-8">
      <div className="text-center">
        <div className="text-4xl mb-4">
          {isVerifying ? '⏳' : tokenBalance > 0 ? '✅' : '❌'}
        </div>
        <h3 className="text-2xl font-black text-primary mb-4" data-testid="wallet-status-title">
          {isVerifying ? 'VERIFYING...' : 'WALLET CONNECTED'}
        </h3>
        
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg border-2 border-primary">
            <div className="text-sm font-bold text-muted-foreground mb-1">Wallet Address</div>
            <div className="font-mono text-foreground" data-testid="wallet-address">
              {wallet.account?.address ? formatAddress(wallet.account.address) : 'Unknown'}
            </div>
          </div>

          {isVerifying ? (
            <div className="text-sm text-muted-foreground">
              Checking $MNM token balance...
            </div>
          ) : verificationComplete ? (
            <div className="space-y-3">
              <div className="bg-muted p-4 rounded-lg border-2 border-primary">
                <div className="text-sm font-bold text-muted-foreground mb-1">$MNM Balance</div>
                <div className="font-black text-2xl text-primary" data-testid="token-balance">
                  {formatBalance(tokenBalance)} $MNM
                </div>
              </div>
              
              {tokenBalance > 0 ? (
                <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg">
                  <div className="font-black text-green-800 text-lg">
                    🎉 ACCESS GRANTED!
                  </div>
                  <div className="text-sm text-green-700">
                    You hold $MNM tokens and can read the exclusive comic series.
                  </div>
                </div>
              ) : (
                <div className="bg-red-100 border-2 border-red-500 p-4 rounded-lg">
                  <div className="font-black text-red-800 text-lg">
                    🚫 ACCESS DENIED
                  </div>
                  <div className="text-sm text-red-700 mb-3">
                    You need to hold $MNM tokens to access this exclusive comic series.
                  </div>
                  <Button 
                    asChild
                    className="vintage-button w-full py-2 font-bold text-primary hover:bg-accent bg-background"
                    data-testid="get-tokens-button"
                  >
                    <a href="/#tokenomics">Get $MNM Tokens</a>
                  </Button>
                </div>
              )}
            </div>
          ) : null}

          <Button 
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
            data-testid="disconnect-wallet-button"
          >
            Disconnect Wallet
          </Button>
        </div>
      </div>
    </Card>
  );
}