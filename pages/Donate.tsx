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
    Users,
    Code2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Donate: React.FC = () => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState<string | null>(null);

    const wallets = [
        { name: "Bitcoin (BTC)", address: "bc1qfrd783asqv8jkqm65ynju565v3vc5ygdvtt7qy", network: "Bitcoin Network", color: "text-orange-500" },
        { name: "Ethereum (ETH)", address: "0x072c88972753655208bf481122bA962F549Ae1E1", network: "Ethereum Network", color: "text-blue-500" },
        { name: "USDT (TRC20)", address: "TBFfsCJ689cyZ3eUTgEpGLiqEyuqJen6iF", network: "Tron Network", color: "text-green-500" }
    ];

    const mobileMoney = [
        { name: "Airtel Money (Airtel)", number: "+243971379450" },
        { name: "M-Pesa (Vodacom)", number: "+243837266193" }
    ];

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#050509] text-white pt-20 sm:pt-24 md:pt-32 pb-16 md:pb-24">
            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1649972904349-6e44c42644a9?auto=format&fit=crop&w=1600&q=80"
                        alt="Community learning about blockchain"
                        className="object-cover w-full h-full opacity-25"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-black/85 to-[#050509]" />
                </div>

                <div className="relative container max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                        <ScrollReveal>
                            <div className="pt-4 pb-10 lg:py-16">
                                <p className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-semibold tracking-wide text-amber-400 uppercase rounded-full bg-amber-500/10 border border-amber-500/40">
                                    Community-powered Web3 education
                                </p>
                                <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                                    {t.donatePage.title}
                                    <span className="text-[#FF6B00]">{t.donatePage.titleSuffix}</span>
                                </h1>
                                <p className="max-w-xl mb-8 text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg">
                                    {t.donatePage.subtitle}
                                </p>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        variant="primary"
                                        className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold bg-[#FF6B00] hover:bg-[#ff8530] shadow-[0_18px_60px_rgba(255,107,0,0.45)]"
                                        onClick={() => {
                                            const el = document.getElementById('donation-grid');
                                            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                    >
                                        Donate Now
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold border-white/20 hover:border-[#FF6B00] hover:text-[#FF6B00]"
                                        onClick={() =>
                                            window.open(
                                                'https://dashboard.mbiyo.africa/pay/create-session/2bb14d4a-664d-4c51-86a6-620cca13578c',
                                                '_blank'
                                            )
                                        }
                                    >
                                        Donate via MbiyoPay
                                    </Button>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={150}>
                            <div className="relative">
                                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#FF6B00] via-amber-500 to-transparent opacity-40 blur-xl" />
                                <div className="relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                                                Impact snapshot
                                            </p>
                                            <p className="mt-1 text-sm text-gray-300">
                                                Every donation powers education, tools & community.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FF6B00]/20 text-[#FF6B00]">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                                        <div className="px-3 py-3 rounded-2xl bg-black/40 border border-white/5">
                                            <p className="text-xs font-medium text-gray-400 uppercase">Learners</p>
                                            <p className="mt-1 text-xl font-semibold">1k+</p>
                                        </div>
                                        <div className="px-3 py-3 rounded-2xl bg-black/40 border border-white/5">
                                            <p className="text-xs font-medium text-gray-400 uppercase">Events</p>
                                            <p className="mt-1 text-xl font-semibold">45+</p>
                                        </div>
                                        <div className="px-3 py-3 rounded-2xl bg-black/40 border border-white/5">
                                            <p className="text-xs font-medium text-gray-400 uppercase">Countries</p>
                                            <p className="mt-1 text-xl font-semibold">10+</p>
                                        </div>
                                    </div>

                                    <div className="relative overflow-hidden rounded-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1522202195461-41a0320e77b0?auto=format&fit=crop&w=1200&q=80"
                                            alt="CoinLect community workshop"
                                            className="object-cover w-full h-40 sm:h-48"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-gray-300 uppercase">Latest initiative</p>
                                                <p className="text-sm font-semibold">Web3 bootcamps across Francophone Africa</p>
                                            </div>
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#FF6B00] text-black">
                                                You fund this
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* IMPACT CARDS */}
            <section className="mt-10 border-t border-white/5 bg-black/40">
                <div className="container max-w-6xl px-4 py-10 mx-auto sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="grid gap-5 md:grid-cols-3">
                            <div className="p-5 rounded-2xl bg-[#090909] border border-white/10 hover:border-[#FF6B00]/60 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300">
                                        Web3 Education
                                    </h3>
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6B00]/15 text-[#FF6B00]">
                                        <Globe2 className="w-4 h-4" />
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Fund high-quality courses and workshops that help the next generation understand
                                    blockchain, DeFi and on-chain finance in French.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-[#090909] border border-white/10 hover:border-[#FF6B00]/60 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300">
                                        Dev Tooling
                                    </h3>
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6B00]/15 text-[#FF6B00]">
                                        <Code2 className="w-4 h-4" />
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Support the creation of open resources, starter kits and API tooling to help African
                                    developers build on Bitcoin, Ethereum and modern L2s.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-[#090909] border border-white/10 hover:border-[#FF6B00]/60 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-300">
                                        Community Events
                                    </h3>
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6B00]/15 text-[#FF6B00]">
                                        <Users className="w-4 h-4" />
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">
                                    Enable meetups, bootcamps and hackathons that connect traders, builders and learners
                                    across the continent.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* DONATION GRID */}
            <section id="donation-grid" className="mt-10">
                <div className="container max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="grid gap-6 lg:grid-cols-3">
                            {/* Crypto wallets */}
                            <div className="p-5 rounded-2xl bg-black/70 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-200">
                                            Crypto wallets
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            Donate directly in BTC, ETH or USDT (TRC20).
                                        </p>
                                    </div>
                                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FF6B00]/15 text-[#FF6B00]">
                                        <Wallet className="w-4 h-4" />
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {wallets.map((wallet, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-xl bg-[#0F0F0F] border border-white/10 hover:border-[#FF6B00]/50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between gap-3 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`flex items-center justify-center w-7 h-7 rounded-full bg-white/5 ${wallet.color}`}
                                                    >
                                                        <Wallet className="w-3 h-3" />
                                                    </span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-white">
                                                            {wallet.name}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500">
                                                            {t.donatePage.network}: {wallet.network}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 px-2 py-2 text-[10px] text-gray-200 truncate rounded-lg bg-black/60 border border-white/10 select-all">
                                                    {wallet.address}
                                                </div>
                                                <button
                                                    onClick={() => handleCopy(wallet.address)}
                                                    className="flex-shrink-0 p-2 text-white rounded-lg bg-white/10 hover:bg-white/20"
                                                    title={t.donatePage.copyAddress}
                                                    aria-label={t.donatePage.copyAddress}
                                                >
                                                    {copied === wallet.address ? (
                                                        <Check className="w-3 h-3 text-emerald-400" />
                                                    ) : (
                                                        <Copy className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Local RDC (Airtel / M-Pesa) */}
                            <div className="p-5 rounded-2xl bg-black/70 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-200">
                                            {t.donatePage.localTitle}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            Use Airtel Money or M-Pesa to donate locally in DRC.
                                        </p>
                                    </div>
                                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FF6B00]/15 text-[#FF6B00]">
                                        <Users className="w-4 h-4" />
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {mobileMoney.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#101010] border border-white/10 hover:border-[#FF6B00]/50 transition-colors"
                                        >
                                            <div>
                                                <p className="text-[10px] font-semibold tracking-wide uppercase text-gray-400">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm font-semibold text-white">{item.number}</p>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(item.number)}
                                                className="p-2 text-gray-200 rounded-lg bg-white/10 hover:bg-white/20"
                                            >
                                                {copied === item.number ? (
                                                    <Check className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* MbiyoPay + Other ways */}
                            <div className="flex flex-col gap-4">
                                <div className="flex-1 p-5 rounded-2xl bg-black/70 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-sm font-semibold tracking-wide uppercase text-gray-200">
                                                {t.donatePage.internationalTitle}
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                {t.donatePage.internationalDesc}
                                            </p>
                                        </div>
                                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FF6B00]/15 text-[#FF6B00]">
                                            <Globe2 className="w-4 h-4" />
                                        </span>
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold bg-[#FF6B00] hover:bg-[#ff8530]"
                                        onClick={() =>
                                            window.open(
                                                'https://dashboard.mbiyo.africa/pay/create-session/2bb14d4a-664d-4c51-86a6-620cca13578c',
                                                '_blank'
                                            )
                                        }
                                    >
                                        {t.donatePage.donateMbiyoPay}
                                        <ExternalLink size={16} />
                                    </Button>
                                </div>

                                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FF6B00]/20 via-black to-transparent border border-[#FF6B00]/40">
                                    <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase text-gray-100">
                                        {t.donatePage.otherWaysTitle}
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-200">
                                        Share CoinLect with your network and help us reach more learners.
                                    </p>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button
                                            variant="outline"
                                            className="w-full text-xs sm:text-sm border-white/40 hover:border-white"
                                            onClick={() => window.open('https://twitter.com/coinlect', '_blank')}
                                        >
                                            {t.donatePage.followX}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full text-xs sm:text-sm border-white/40 hover:border-white"
                                            onClick={() => window.open('https://youtube.com/@coinlect', '_blank')}
                                        >
                                            {t.donatePage.subscribeYoutube}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <div className="container max-w-6xl px-4 mx-auto mt-12 sm:px-6 sm:mt-16 lg:px-8">
                <AdBanner />
            </div>
        </div>
    );
};

export default Donate;