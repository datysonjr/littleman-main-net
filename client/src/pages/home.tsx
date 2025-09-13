import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PriceChart from "@/components/PriceChart";
import vintageCharacterImage from "@assets/Superhéroe de dibujo animado vintage_1757378062974.png";

interface PriceData {
  price: number | null;
  change24h: number | null;
  volume24h: number | null;
  marketCap: number | null;
  lastUpdated: string;
  error?: string;
  message?: string;
  contractAddress?: string;
}

export default function Home() {
  const { toast } = useToast();
  const [isScrolling, setIsScrolling] = useState(false);

  const contractAddress = "0xefde5ddb743bd93e68a75e410e985980457b5e8837c7f4afa36ecc12bb91022b";
  const telegramUrl = "https://t.me/mmmmmnmmms";
  const blastUrl = "https://blast.fun/token/0xefde5ddb743bd93e68a75e410e985980457b5e8837c7f4afa36ecc12bb91022b::mnm::MNM";

  // Check if price data is available to determine if chart should be shown
  const { data: priceData } = useQuery<PriceData>({
    queryKey: ["/api/price/current"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  const hasPriceData = priceData && priceData.price !== null;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Contract address copied to clipboard",
      });
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast({
        title: "Copied!",
        description: "Contract address copied to clipboard",
      });
    }
  };

  const smoothScroll = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
        setTimeout(() => {
          setIsScrolling(false);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolling]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="relative bg-background border-b-4 border-primary">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center vintage-border">
                <span className="text-primary-foreground font-black text-xl" data-testid="logo-text">M</span>
              </div>
              <span className="font-black text-2xl text-primary" data-testid="brand-name">LITTLE MAN</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => smoothScroll('about')}
                className="font-semibold text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-about"
              >
                About
              </button>
              <button 
                onClick={() => smoothScroll('tokenomics')}
                className="font-semibold text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-tokenomics"
              >
                Tokenomics
              </button>
              <a
                href="http://Comic.little-man.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-comics"
              >
                Comics
              </a>
              <button 
                onClick={() => smoothScroll('community')}
                className="font-semibold text-muted-foreground hover:text-primary transition-colors"
                data-testid="nav-community"
              >
                Community
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 vintage-pattern">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-primary leading-tight" data-testid="hero-title">
                  MEET THE<br />
                  <span className="inline-block transform -rotate-2">LITTLE MAN</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg" data-testid="hero-subtitle">
                  The vintage superhero bringing classic cartoon charm to the SUI blockchain
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
                <Button 
                  asChild
                  className="vintage-button px-8 py-4 font-bold text-lg text-primary hover:bg-accent bg-background"
                  data-testid="button-get-mnm"
                >
                  <a href={blastUrl} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-rocket mr-2"></i>
                    Get $MNM
                  </a>
                </Button>
                <Button 
                  asChild
                  className="vintage-button px-8 py-4 font-bold text-lg text-primary hover:bg-accent bg-background"
                  data-testid="button-comic-series"
                >
                  <a href="http://Comic.little-man.org" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-book mr-2"></i>
                    Comic Series
                  </a>
                </Button>
                <Button 
                  asChild
                  className="vintage-button px-8 py-4 font-bold text-lg text-primary hover:bg-accent bg-background"
                  data-testid="button-join-community"
                >
                  <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-telegram mr-2"></i>
                    Join Community
                  </a>
                </Button>
                <Button 
                  asChild
                  className="vintage-button px-8 py-4 font-bold text-lg text-primary hover:bg-accent bg-background"
                  data-testid="button-follow-twitter"
                >
                  <a href="https://x.com/LittleManSUI" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter mr-2"></i>
                    Follow Us
                  </a>
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-primary" data-testid="ticker-display">$MNM</div>
                  <div className="text-sm text-muted-foreground font-medium">TICKER</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-black text-primary" data-testid="blockchain-display">SUI</div>
                  <div className="text-sm text-muted-foreground font-medium">BLOCKCHAIN</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div 
                  className={`w-80 h-80 md:w-96 md:h-96 vintage-border cartoon-shadow bg-card flex items-center justify-center animate-bounce-slow ${isScrolling ? 'transform transition-transform duration-300' : ''}`}
                  style={isScrolling ? { transform: 'translateY(-10px) rotate(2deg)' } : {}}
                  data-testid="character-container"
                >
                  <img 
                    src={vintageCharacterImage}
                    alt="Little Man - Vintage Cartoon Superhero" 
                    className="w-full h-full object-contain rounded-lg"
                    data-testid="character-image"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full vintage-border animate-pulse-slow"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary rounded-full vintage-border"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Info Section */}
      <section id="about" className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4" data-testid="token-info-title">TOKEN INFORMATION</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto" data-testid="token-info-subtitle">
              Everything you need to know about the Little Man token on SUI blockchain
            </p>
          </div>

          {/* Price Chart - Full Width (only show if price data is available) */}
          {hasPriceData && (
            <div className="mb-12">
              <PriceChart />
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contract Address Card */}
            <Card className="vintage-border cartoon-shadow bg-background p-8 space-y-4">
              <div className="text-center">
                <i className="fas fa-address-card text-4xl text-primary mb-4"></i>
                <h3 className="text-2xl font-black text-primary mb-2" data-testid="contract-title">CONTRACT ADDRESS</h3>
                <p className="text-sm text-muted-foreground font-medium mb-4">SUI Blockchain</p>
                <div className="bg-muted p-4 rounded-lg border-2 border-border">
                  <p className="text-xs font-mono break-all text-foreground" data-testid="contract-address">
                    {contractAddress}
                  </p>
                </div>
                <Button 
                  onClick={() => copyToClipboard(contractAddress)}
                  className="vintage-button w-full mt-4 py-3 font-bold text-primary hover:bg-accent bg-background"
                  data-testid="button-copy-address"
                >
                  <i className="fas fa-copy mr-2"></i>
                  Copy Address
                </Button>
              </div>
            </Card>

            {/* Ticker Info Card */}
            <Card className="vintage-border cartoon-shadow bg-background p-8 space-y-4">
              <div className="text-center">
                <i className="fas fa-dollar-sign text-4xl text-primary mb-4"></i>
                <h3 className="text-2xl font-black text-primary mb-2" data-testid="ticker-title">TICKER SYMBOL</h3>
                <p className="text-sm text-muted-foreground font-medium mb-4">Official Token Symbol</p>
                <div className="bg-primary text-primary-foreground rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4">
                  <span className="text-4xl font-black" data-testid="ticker-symbol">$MNM</span>
                </div>
                <p className="text-lg font-bold text-primary" data-testid="token-name">Little Man Token</p>
              </div>
            </Card>

            {/* Blast.fun Link Card */}
            <Card className="vintage-border cartoon-shadow bg-background p-8 space-y-4 md:col-span-2 lg:col-span-1">
              <div className="text-center">
                <i className="fas fa-external-link-alt text-4xl text-primary mb-4"></i>
                <h3 className="text-2xl font-black text-primary mb-2" data-testid="trade-title">TRADE ON BLAST</h3>
                <p className="text-sm text-muted-foreground font-medium mb-4">Buy & Sell $MNM</p>
                <Button 
                  asChild
                  className="vintage-button w-full py-4 font-bold text-primary hover:bg-accent bg-background"
                  data-testid="button-trade-now"
                >
                  <a href={blastUrl} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-rocket mr-2"></i>
                    Trade Now
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4" data-testid="tokenomics-title">$MNM TOKENOMICS</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto" data-testid="tokenomics-subtitle">
              Detailed breakdown of Little Man token distribution and allocation
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Total Supply Card */}
              <Card className="vintage-border cartoon-shadow bg-card p-8 space-y-6">
                <div className="text-center">
                  <div className="text-4xl mb-4" data-testid="supply-emoji">💰</div>
                  <h3 className="text-2xl font-black text-primary mb-4" data-testid="supply-title">TOTAL SUPPLY</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Total Supply:</span>
                    <span className="font-black text-primary text-lg" data-testid="total-supply">1,000,000,000 (1B) $MNM</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Burned:</span>
                    <span className="font-black text-primary text-lg" data-testid="burned-amount">60M+ burned (≈6.4%)</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Wallet Cap:</span>
                    <span className="font-black text-primary text-lg" data-testid="wallet-cap">Max 5% per address</span>
                  </div>
                </div>
              </Card>

              {/* Community Card */}
              <Card className="vintage-border cartoon-shadow bg-card p-8 space-y-6">
                <div className="text-center">
                  <div className="text-4xl mb-4" data-testid="community-emoji">👥</div>
                  <h3 className="text-2xl font-black text-primary mb-4" data-testid="community-tokenomics-title">COMMUNITY</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Allocation:</span>
                    <span className="font-black text-primary text-lg" data-testid="community-allocation">1%+ supply (10M+)</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Purpose:</span>
                    <span className="font-medium text-foreground" data-testid="community-purpose">Giveaways, contests, and holder rewards</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Focus:</span>
                    <span className="font-medium text-foreground" data-testid="community-focus">Fun, engagement, and loyalty rewards</span>
                  </div>
                </div>
              </Card>

              {/* Development Card */}
              <Card className="vintage-border cartoon-shadow bg-card p-8 space-y-6">
                <div className="text-center">
                  <div className="text-4xl mb-4" data-testid="dev-emoji">🛠</div>
                  <h3 className="text-2xl font-black text-primary mb-4" data-testid="dev-title">DEVELOPMENT</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Allocation:</span>
                    <span className="font-black text-primary text-lg" data-testid="dev-allocation">80M $MNM (≈9%)</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Vesting:</span>
                    <span className="font-medium text-foreground" data-testid="dev-vesting">90-day linear vesting</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Unlock Date:</span>
                    <span className="font-black text-primary" data-testid="dev-unlock">December 12</span>
                  </div>
                </div>
              </Card>

              {/* Marketing Card */}
              <Card className="vintage-border cartoon-shadow bg-card p-8 space-y-6">
                <div className="text-center">
                  <div className="text-4xl mb-4" data-testid="marketing-emoji">📢</div>
                  <h3 className="text-2xl font-black text-primary mb-4" data-testid="marketing-title">MARKETING & COLLABS</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Allocation:</span>
                    <span className="font-black text-primary text-lg" data-testid="marketing-allocation">2% supply (20M $MNM)</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Purpose:</span>
                    <span className="font-medium text-foreground" data-testid="marketing-purpose">Marketing, partnerships, and brand collaborations</span>
                  </div>
                </div>
              </Card>

              {/* Growth Card */}
              <Card className="vintage-border cartoon-shadow bg-card p-8 space-y-6 md:col-span-2 lg:col-span-2">
                <div className="text-center">
                  <div className="text-4xl mb-4" data-testid="growth-emoji">🚀</div>
                  <h3 className="text-2xl font-black text-primary mb-4" data-testid="growth-title">GROWTH</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Expansion:</span>
                    <span className="font-medium text-foreground" data-testid="growth-expansion">Creative campaigns and activations on blast.fun</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-muted-foreground">Priority:</span>
                    <span className="font-black text-primary" data-testid="growth-priority">Community incentives &gt; treasuries</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 vintage-pattern">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4" data-testid="community-title">JOIN THE COMMUNITY</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto" data-testid="community-subtitle">
              Connect with fellow Little Man enthusiasts and stay updated on the latest news
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Telegram Card */}
              <Card className="vintage-border cartoon-shadow bg-card p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center">
                  <i className="fab fa-telegram text-4xl text-primary-foreground"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-primary mb-2" data-testid="telegram-title">TELEGRAM</h3>
                  <p className="text-lg text-muted-foreground font-medium mb-6" data-testid="telegram-description">
                    Join our active community for real-time updates and discussions
                  </p>
                  <Button 
                    asChild
                    className="vintage-button px-8 py-4 font-bold text-lg text-primary hover:bg-accent bg-background"
                    data-testid="button-join-telegram"
                  >
                    <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-telegram mr-2"></i>
                      Join Channel
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Community Stats Card */}
              <Card className="vintage-border cartoon-shadow bg-card p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-accent rounded-full mx-auto flex items-center justify-center">
                  <i className="fas fa-users text-4xl text-accent-foreground"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-primary mb-2" data-testid="community-stats-title">COMMUNITY</h3>
                  <p className="text-lg text-muted-foreground font-medium mb-6" data-testid="community-stats-description">
                    Growing strong with vintage cartoon enthusiasts worldwide
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-muted-foreground">Network:</span>
                      <span className="font-black text-primary" data-testid="stat-network">SUI Blockchain</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-muted-foreground">Style:</span>
                      <span className="font-black text-primary" data-testid="stat-style">1930s Cartoon</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-muted-foreground">Character:</span>
                      <span className="font-black text-primary" data-testid="stat-character">Little Man</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-16 h-16 bg-primary-foreground rounded-full flex items-center justify-center">
                <span className="text-primary font-black text-2xl" data-testid="footer-logo">M</span>
              </div>
              <span className="font-black text-3xl" data-testid="footer-brand">LITTLE MAN</span>
            </div>
            
            <p className="text-lg font-medium max-w-2xl mx-auto opacity-90" data-testid="footer-description">
              Bringing vintage cartoon charm to the modern cryptocurrency world on SUI blockchain
            </p>

            <div className="flex justify-center space-x-6">
              <a 
                href={telegramUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                data-testid="footer-telegram-link"
              >
                <i className="fab fa-telegram text-primary text-xl"></i>
              </a>
              <a 
                href="https://x.com/LittleManSUI"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                data-testid="footer-twitter-link"
              >
                <i className="fab fa-twitter text-primary text-xl"></i>
              </a>
              <a 
                href={blastUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                data-testid="footer-blast-link"
              >
                <i className="fas fa-external-link-alt text-primary text-xl"></i>
              </a>
            </div>

            <div className="border-t border-primary-foreground/20 pt-6 mt-8">
              <p className="text-sm opacity-70 font-medium" data-testid="footer-copyright">
                © 2024 Little Man Token. All rights reserved. | 
                <span className="font-bold"> $MNM</span> on SUI Blockchain
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
