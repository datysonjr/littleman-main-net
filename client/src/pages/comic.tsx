import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import WalletConnect from "@/components/WalletConnect";

export default function Comic() {
  const [currentPage, setCurrentPage] = useState(0);
  const [hasTokenAccess, setHasTokenAccess] = useState(false);

  const comicPages = [
    {
      src: "/comic-cover.png",
      alt: "Little Man Comic #1 Cover - The Adventures of Little Man AKA Mini Man",
      title: "Issue #1 Cover"
    },
    {
      src: "/comic-page-1.png", 
      alt: "Little Man Comic Page 1 - Cryptoland Circus Adventure",
      title: "Page 1"
    },
    {
      src: "/comic-page-2.png",
      alt: "Little Man Comic Page 2 - Meeting The Oracle", 
      title: "Page 2"
    },
    {
      src: "/comic-page-3.png",
      alt: "Little Man Comic Page 3 - To Be Continued",
      title: "Page 3"
    },
    {
      src: "/comic-back-cover.png",
      alt: "Little Man Comic Back Cover",
      title: "Back Cover"
    }
  ];

  const nextPage = () => {
    if (currentPage < comicPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

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
              <span className="font-black text-2xl text-primary" data-testid="brand-name">LITTLE MAN COMICS</span>
            </div>
            <Button 
              asChild
              className="vintage-button px-6 py-2 font-bold text-primary hover:bg-accent bg-background"
              data-testid="back-to-home"
            >
              <a href="/">← Back to Home</a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Comic Viewer Section */}
      <section className="py-12 vintage-pattern">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-4" data-testid="comic-title">
              THE ADVENTURES OF LITTLE MAN
            </h1>
            <p className="text-xl text-muted-foreground font-medium" data-testid="comic-subtitle">
              Episode #1 - A vintage superhero's crypto adventure
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Main Comic Display */}
            {hasTokenAccess ? (
              <Card className="vintage-border cartoon-shadow bg-card p-6 mb-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-primary mb-2" data-testid="current-page-title">
                    {comicPages[currentPage].title}
                  </h3>
                  <div className="text-sm text-muted-foreground font-medium">
                    {currentPage === 0 ? 'Cover' : 
                     currentPage === comicPages.length - 1 ? 'Back Cover' : 
                     `Content Page ${currentPage} of ${comicPages.length - 2}`}
                  </div>
                </div>

                {/* Comic Image */}
                <div className="flex justify-center mb-6">
                  <div className="vintage-border cartoon-shadow bg-background p-4 max-w-full">
                    <img 
                      src={comicPages[currentPage].src}
                      alt={comicPages[currentPage].alt}
                      className="w-full h-auto max-w-2xl mx-auto"
                      data-testid="comic-page-image"
                    />
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button 
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="vintage-button px-6 py-3 font-bold text-primary hover:bg-accent bg-background disabled:opacity-50"
                    data-testid="prev-page-button"
                  >
                    <i className="fas fa-chevron-left mr-2"></i>
                    Previous
                  </Button>

                  {/* Page Thumbnails */}
                  <div className="flex space-x-2 overflow-x-auto">
                    {comicPages.map((page, index) => (
                      <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={`w-12 h-16 border-2 rounded transition-all ${
                          currentPage === index 
                            ? 'border-primary bg-accent' 
                            : 'border-border bg-muted hover:border-primary'
                        }`}
                        data-testid={`page-thumbnail-${index}`}
                      >
                        <img 
                          src={page.src}
                          alt={`Page ${index + 1} thumbnail`}
                          className="w-full h-full object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>

                  <Button 
                    onClick={nextPage}
                    disabled={currentPage === comicPages.length - 1}
                    className="vintage-button px-6 py-3 font-bold text-primary hover:bg-accent bg-background disabled:opacity-50"
                    data-testid="next-page-button"
                  >
                    Next
                    <i className="fas fa-chevron-right ml-2"></i>
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="vintage-border cartoon-shadow bg-card p-12 mb-8 text-center">
                <div className="text-6xl mb-6">🔒</div>
                <h3 className="text-3xl font-black text-primary mb-4">EXCLUSIVE CONTENT</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  This comic series is exclusively available to holders of at least 10,000 $MNM tokens. Connect your wallet and verify your token ownership to unlock the adventure!
                </p>
                <div className="bg-muted p-6 rounded-lg border-2 border-primary mb-6">
                  <div className="text-2xl font-black text-primary mb-2">THE ADVENTURES OF LITTLE MAN</div>
                  <div className="text-sm text-muted-foreground">Episode #1 • 5 Pages • Token Gated</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Connect your SUI wallet above to check if you hold the required 10,000+ $MNM tokens for access.
                </p>
              </Card>
            )}

            {/* Comic Access & Info */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Wallet Connection / Token Gating */}
              <WalletConnect onTokenVerified={setHasTokenAccess} />

              <Card className="vintage-border cartoon-shadow bg-card p-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 className="text-2xl font-black text-primary mb-4" data-testid="story-info-title">STORY INFO</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between">
                      <span className="font-bold text-muted-foreground">Issue:</span>
                      <span className="font-black text-primary">#1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-muted-foreground">Released:</span>
                      <span className="font-black text-primary">September 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-muted-foreground">Pages:</span>
                      <span className="font-black text-primary">3 + Covers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-muted-foreground">Status:</span>
                      <span className="font-black text-primary">Complete</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-muted-foreground">Access:</span>
                      <span className={`font-black ${hasTokenAccess ? 'text-green-600' : 'text-red-600'}`}>
                        {hasTokenAccess ? 'Granted' : '10,000+ $MNM Required'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Coming Soon */}
            <Card className="vintage-border cartoon-shadow bg-card p-8 mt-8 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-black text-primary mb-4" data-testid="coming-soon-title">COMING SOON</h3>
              <p className="text-lg text-foreground mb-6">
                Episode #2 is in development! Follow our community for updates on the next chapter of Little Man's adventures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  className="vintage-button px-6 py-3 font-bold text-primary hover:bg-accent bg-background"
                  data-testid="join-telegram-comic"
                >
                  <a href="https://t.me/mmmmmnmmms" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-telegram mr-2"></i>
                    Join Telegram
                  </a>
                </Button>
                <Button 
                  asChild
                  className="vintage-button px-6 py-3 font-bold text-primary hover:bg-accent bg-background"
                  data-testid="follow-twitter-comic"
                >
                  <a href="https://x.com/LittleManSUI" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter mr-2"></i>
                    Follow Updates
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}