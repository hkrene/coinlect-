'use client';

import React, { useState } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { Button } from '../components/Button';
import { AdBanner } from '../components/AdBanner';
import {
  Copy,
  Check,
  Wallet,
  ExternalLink,
  Globe2,
  Smartphone,
  Heart,
  BookOpen,
  Users,
  Code2,
  QrCode,
  Share2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Donate: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);
  const [activeQr, setActiveQr] = useState<string | null>(null);

  const wallets = [
    {
      name: "Bitcoin (BTC)",
      address: "bc1qfrd783asqv8jkqm65ynju565v3vc5ygdvtt7qy",
      network: "Bitcoin Network",
      color: "from-amber-500/20 to-orange-500/10 text-orange-400 border-amber-500/30"
    },
    {
      name: "Ethereum (ETH)",
      address: "0x072c88972753655208bf481122bA962F549Ae1E1",
      network: "Ethereum Network (ERC20)",
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30"
    },
    {
      name: "USDT (TRC20)",
      address: "TBFfsCJ689cyZ3eUTgEpGLiqEyuqJen6iF",
      network: "Tron Network (TRC20)",
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30"
    }
  ];

  const mobileMoney = [
    {
      name: "Airtel Money",
      provider: "Airtel DRC",
      number: "+243971379450"
    }
  ];

  const impactPoints = [
    {
      icon: BookOpen,
      title: "Crypto Education",
      desc: "Free courses and localized content for Web3 beginners."
    },
    {
      icon: Users,
      title: "Community Events",
      desc: "Workshops, bootcamps, and local meetups across the Francophone region."
    },
    {
      icon: Code2,
      title: "Developer Tools",
      desc: "Open-source resources enabling developers to build real-world Web3 apps."
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050509] text-white pt-24 md:pt-32 pb-16 md:pb-24 selection:bg-[#FF6B00]/30 selection:text-white">
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B00]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* HERO SECTION */}
      <section className="relative mb-16 overflow-hidden md:mb-24">
        <div className="container relative max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            {/* <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium tracking-wide uppercase">
                <Heart className="w-3.5 h-3.5 fill-amber-400/20" />
                Community-Powered Web3 Education
              </div>
            </ScrollReveal> */}

            <ScrollReveal delay={100}>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                {t.donatePage.title}{' '}
                <span className="bg-gradient-to-r from-[#FF6B00] via-orange-400 to-amber-400 bg-clip-text text-transparent">
                  {t.donatePage.titleSuffix}
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="max-w-2xl mx-auto text-base leading-relaxed text-gray-400 sm:text-lg">
                {t.donatePage.subtitle}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  variant="primary"
                  className="px-8 py-3.5 text-sm font-semibold bg-[#FF6B00] hover:bg-[#ff8530] transition-all duration-200 shadow-[0_10px_30px_rgba(255,107,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,107,0,0.45)]"
                  onClick={() => {
                    const el = document.getElementById('donation-grid');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  Explore Donation Options
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-3.5 text-sm font-semibold border-white/10 hover:border-[#FF6B00] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200"
                  onClick={() =>
                    window.open(
                      'https://dashboard.mbiyo.africa/pay/create-session/2bb14d4a-664d-4c51-86a6-620cca13578c',
                      '_blank'
                    )
                  }
                >
                  Instant Card / Mobile Pay <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </ScrollReveal>
          </div>

          {/* IMPACT CARDS */}
          <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-3">
            {impactPoints.map((item, idx) => (
              <ScrollReveal key={idx} delay={100 * (idx + 1)}>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-[#FF6B00] mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION OPTIONS SECTION */}
      <section id="donation-grid" className="relative scroll-mt-28">
        <div className="container max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Choose How You Want to Give
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Direct crypto transfers, local mobile payments, or international cards.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* LEFT COLUMN: CRYPTO WALLETS */}
            <div className="space-y-4 lg:col-span-7">
              <ScrollReveal>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Cryptocurrency</h3>
                      <p className="text-xs text-gray-400">Direct wallet-to-wallet transfer</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {wallets.map((wallet, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border bg-gradient-to-r ${wallet.color}`}>
                              {wallet.name}
                            </span>
                            <span className="text-xs text-gray-500">{wallet.network}</span>
                          </div>
                          
                          <button
                            onClick={() => setActiveQr(activeQr === wallet.address ? null : wallet.address)}
                            className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-white"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            {activeQr === wallet.address ? 'Hide QR' : 'QR Code'}
                          </button>
                        </div>

                        {/* Address Bar */}
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-xs">
                          <span className="text-gray-300 truncate select-all">{wallet.address}</span>
                          <button
                            onClick={() => handleCopy(wallet.address)}
                            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors shrink-0 text-gray-200 hover:text-white"
                            aria-label={t.donatePage.copyAddress}
                          >
                            {copied === wallet.address ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Optional QR Code Dropdown */}
                        {activeQr === wallet.address && (
                          <div className="flex flex-col items-center justify-center pt-4 mt-4 border-t border-white/5">
                            <div className="p-3 bg-white shadow-lg rounded-xl">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${wallet.address}`}
                                alt={`${wallet.name} QR Code`}
                                className="w-32 h-32"
                              />
                            </div>
                            <p className="mt-2 text-[11px] text-gray-400">Scan with your wallet app</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* RIGHT COLUMN: LOCAL & INTERNATIONAL */}
            <div className="space-y-6 lg:col-span-5">
              {/* Mobile Money */}
              <ScrollReveal delay={100}>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t.donatePage.localTitle}</h3>
                      <p className="text-xs text-gray-400">Direct mobile transfers in DRC</p>
                    </div>
                  </div>

                  {mobileMoney.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">{item.name}</span>
                        <span className="text-xs text-gray-400">{item.provider}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-xs">
                        <span className="font-semibold text-gray-300">{item.number}</span>
                        <button
                          onClick={() => handleCopy(item.number)}
                          className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors shrink-0 text-gray-200 hover:text-white"
                          aria-label={t.donatePage.copyAddress}
                        >
                          {copied === item.number ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* International & MbiyoPay */}
              <ScrollReveal delay={150}>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Globe2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t.donatePage.internationalTitle}</h3>
                      <p className="text-xs text-gray-400">Credit cards, Debit & online checkout</p>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-gray-400">
                    {t.donatePage.internationalDesc}
                  </p>

                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold bg-[#FF6B00] hover:bg-[#ff8530] transition-colors"
                    onClick={() =>
                      window.open(
                        'https://dashboard.mbiyo.africa/pay/create-session/2bb14d4a-664d-4c51-86a6-620cca13578c',
                        '_blank'
                      )
                    }
                  >
                    {t.donatePage.donateMbiyoPay}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </ScrollReveal>

              {/* Spread the Word */}
              <ScrollReveal delay={200}>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-4">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#FF6B00]" />
                    <h4 className="text-sm font-semibold text-white">
                      {t.donatePage.otherWaysTitle}
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-400">
                    Can&apos;t donate right now? Share CoinLect with your network to support community growth.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full text-xs py-2.5 border-white/10 hover:border-white/30 bg-white/[0.02]"
                      onClick={() => window.open('https://twitter.com/coinlect', '_blank')}
                    >
                      {t.donatePage.followX}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-xs py-2.5 border-white/10 hover:border-white/30 bg-white/[0.02]"
                      onClick={() => window.open('https://youtube.com/@coinlect', '_blank')}
                    >
                      {t.donatePage.subscribeYoutube}
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER SECTION */}
      <div className="container max-w-6xl px-4 mx-auto mt-16 sm:px-6 lg:px-8">
        <AdBanner />
      </div>
    </div>
  );
};

export default Donate;