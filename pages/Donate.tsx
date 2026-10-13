'use client';

import React, { useState } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { AdBanner } from '../components/AdBanner';
import {
  Copy,
  Check,
  Wallet,
  ExternalLink,
  Globe2,
  Smartphone,
  BookOpen,
  Users,
  Code2,
  QrCode,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const MBIYOPAY_URL =
  'https://dashboard.mbiyo.africa/pay/create-session/2bb14d4a-664d-4c51-86a6-620cca13578c';

const X_URL = 'https://twitter.com/coinlect';
const YOUTUBE_URL = 'https://youtube.com/@coinlect';

export const Donate: React.FC = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);
  const [activeQr, setActiveQr] = useState<string | null>(null);

  const wallets = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      address: 'bc1qfrd783asqv8jkqm65ynju565v3vc5ygdvtt7qy',
      network: 'Bitcoin Network',
      dot: 'bg-amber-400',
    },
    {
      name: 'Ethereum',
      ticker: 'ETH',
      address: '0x072c88972753655208bf481122bA962F549Ae1E1',
      network: 'Ethereum · ERC20',
      dot: 'bg-indigo-400',
    },
    {
      name: 'USDT',
      ticker: 'TRC20',
      address: 'TBFfsCJ689cyZ3eUTgEpGLiqEyuqJen6iF',
      network: 'Tron · TRC20',
      dot: 'bg-emerald-400',
    },
  ];

  const mobileMoney = [
    { name: 'Airtel Money', provider: 'Airtel DRC', number: '+243971379450' },
  ];

  const impactIcons = [BookOpen, Users, Code2];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const scrollToDonation = () => {
    document.getElementById('donation-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const copyButtonClass =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:border-coinlect-accent/40 hover:text-coinlect-accent';

  return (
    <div className="min-h-screen bg-[#020202] pt-24 text-white selection:bg-coinlect-accent/30 selection:text-white md:pt-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-12%] h-[520px] w-[900px] -translate-x-1/2 rounded-[100%] bg-amber-600/20 blur-[130px]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="container relative z-10 max-w-5xl px-6 pt-16 pb-20 mx-auto text-center md:pt-24 md:pb-28">
          <ScrollReveal>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-7xl">
              {t.donatePage.title}
              <span className="italic text-coinlect-accent">{t.donatePage.titleSuffix}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
              {t.donatePage.subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={scrollToDonation}
                className="inline-flex items-center gap-2 rounded-full bg-coinlect-accent px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_24px_rgba(245,158,11,0.2)] transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(245,158,11,0.35)]"
              >
                {t.donatePage.explore}
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={MBIYOPAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                {t.donatePage.instantPay}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* IMPACT */}
      <section className="border-y border-white/10 bg-[#0a0a0a]">
        <div className="container max-w-6xl px-6 py-20 mx-auto md:py-28">
          <ScrollReveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-xl text-2xl font-bold tracking-tight text-white md:text-4xl">
                {t.donatePage.impactTitle}
              </h2>
              <p className="max-w-sm text-sm text-zinc-500">{t.donatePage.impactSubtitle}</p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
            {t.donatePage.impactItems.map((item, idx) => {
              const Icon = impactIcons[idx] ?? BookOpen;
              return (
                <ScrollReveal key={item.title} delay={80 * idx} className="h-full">
                  <div className="group h-full bg-[#0a0a0a] p-8 transition-colors duration-300 hover:bg-[#111]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-[0.25em] text-zinc-600">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <Icon className="h-5 w-5 text-coinlect-accent" />
                    </div>
                    <h3 className="mt-10 text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* WAYS TO GIVE */}
      <section id="donation-grid" className="relative scroll-mt-28">
        <div className="container max-w-6xl px-6 py-20 mx-auto md:py-28">
          <ScrollReveal>
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-4xl">
                {t.donatePage.givingTitle}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 md:text-base">
                {t.donatePage.givingSubtitle}
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            {/* CRYPTO WALLETS */}
            <div className="lg:col-span-7">
              <ScrollReveal className="h-full">
                <div className="h-full rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8">
                  <header className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-coinlect-accent/20 bg-coinlect-accent/10 text-coinlect-accent">
                      <Wallet className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{t.donatePage.cryptoTitle}</h3>
                      <p className="text-xs text-zinc-500">{t.donatePage.cryptoSubtitle}</p>
                    </div>
                  </header>

                  <div className="mt-6 border-y border-white/5">
                    {wallets.map((wallet) => (
                      <div key={wallet.address} className="border-b border-white/5 py-5 last:border-b-0">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span className={`h-2 w-2 shrink-0 rounded-full ${wallet.dot}`} />
                            <span className="text-sm font-semibold text-white">{wallet.name}</span>
                            <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-zinc-400">
                              {wallet.ticker}
                            </span>
                            <span className="hidden truncate text-xs text-zinc-600 sm:inline">
                              {wallet.network}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveQr(activeQr === wallet.address ? null : wallet.address)
                            }
                            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-coinlect-accent"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            {activeQr === wallet.address
                              ? t.donatePage.hideQr
                              : t.donatePage.showQr}
                          </button>
                        </div>

                        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 p-2 pl-3.5">
                          <span className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-300 select-all">
                            {wallet.address}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(wallet.address)}
                            className={copyButtonClass}
                            aria-label={t.donatePage.copyAddress}
                          >
                            {copied === wallet.address ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        {activeQr === wallet.address && (
                          <div className="mt-5 flex flex-col items-center">
                            <div className="rounded-xl bg-white p-3 shadow-lg">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&bgcolor=ffffff&color=0a0a0a&data=${wallet.address}`}
                                alt={`${wallet.name} QR Code`}
                                className="h-32 w-32"
                              />
                            </div>
                            <p className="mt-2 text-[11px] text-zinc-500">{t.donatePage.scanQr}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* INTERNATIONAL · LOCAL · SHARE */}
            <div className="space-y-6 lg:col-span-5">
              <ScrollReveal delay={100}>
                <div className="relative overflow-hidden rounded-2xl border border-coinlect-accent/25 bg-gradient-to-br from-coinlect-accent/[0.12] to-transparent p-6 md:p-8">
                  <div
                    aria-hidden
                    className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-coinlect-accent/20 blur-3xl"
                  />
                  <div className="relative">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-coinlect-accent/25 bg-coinlect-accent/10 text-coinlect-accent">
                      <Globe2 className="h-5 w-5" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-white">
                      {t.donatePage.internationalTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {t.donatePage.internationalDesc}
                    </p>
                    <a
                      href={MBIYOPAY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-coinlect-accent px-6 py-3.5 text-sm font-semibold text-black transition-colors duration-300 hover:bg-amber-400"
                    >
                      {t.donatePage.donateMbiyoPay}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8">
                  <header className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300">
                      <Smartphone className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-white">{t.donatePage.localTitle}</h3>
                      <p className="text-xs text-zinc-500">{t.donatePage.localSubtitle}</p>
                    </div>
                  </header>

                  <div className="mt-6 space-y-4">
                    {mobileMoney.map((item) => (
                      <div key={item.number}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">{item.name}</span>
                          <span className="text-xs text-zinc-500">{item.provider}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/60 p-2 pl-3.5">
                          <span className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-300 select-all">
                            {item.number}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.number)}
                            className={copyButtonClass}
                            aria-label={t.donatePage.copyAddress}
                          >
                            {copied === item.number ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8">
                  <header className="flex items-center gap-2.5">
                    <Share2 className="h-4 w-4 text-coinlect-accent" />
                    <h3 className="text-sm font-semibold text-white">
                      {t.donatePage.otherWaysTitle}
                    </h3>
                  </header>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                    {t.donatePage.supportNote}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <a
                      href={X_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-colors duration-300 hover:border-white/25 hover:bg-white/10"
                    >
                      {t.donatePage.followX}
                    </a>
                    <a
                      href={YOUTUBE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-colors duration-300 hover:border-white/25 hover:bg-white/10"
                    >
                      {t.donatePage.subscribeYoutube}
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENCY */}
      <section className="border-t border-white/10 bg-[#0a0a0a]">
        <div className="container max-w-3xl px-6 py-20 mx-auto text-center md:py-24">
          <ScrollReveal>
            <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
              {t.donatePage.transparencyTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              {t.donatePage.transparencyDesc}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* SPONSORED */}
      <AdBanner />
    </div>
  );
};

export default Donate;
