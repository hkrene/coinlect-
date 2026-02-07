'use client';

import React, { useState } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { Button } from '../components/Button';
import { AdBanner } from '../components/AdBanner';
import { Copy, Check, Wallet, ExternalLink } from 'lucide-react';
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
        <div className="min-h-screen pt-20 pb-12 bg-black sm:pt-24 md:pt-32 md:pb-20">
            <div className="container max-w-3xl px-4 mx-auto text-center sm:px-6">
                <ScrollReveal>
                    <h1 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-5xl sm:mb-6">
                        {t.donatePage.title}<span className="text-coinlect-accent">{t.donatePage.titleSuffix}</span>
                    </h1>
                    <p className="mb-8 text-sm leading-relaxed text-gray-400 sm:text-base sm:mb-12 md:text-lg">
                        {t.donatePage.subtitle}
                    </p>
                </ScrollReveal>

                {/* International Donation Section (MbiyoPay) */}
                <ScrollReveal delay={100}>
                    <div className="flex flex-col items-center justify-between gap-6 p-6 mb-8 text-left transition-all border bg-white/5 rounded-2xl border-white/10 md:flex-row hover:border-coinlect-accent/30">
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{t.donatePage.internationalTitle}</h3>
                                <p className="text-sm text-gray-400">{t.donatePage.internationalDesc}</p>
                            </div>
                        </div>
                        <Button 
                            variant="primary" 
                            className="flex items-center w-full gap-2 md:w-auto"
                            onClick={() => window.open('https://dashboard.mbiyo.africa/pay/create-session/2bb14d4a-664d-4c51-86a6-620cca13578c', '_blank')}
                        >
                            {t.donatePage.donateMbiyoPay} <ExternalLink size={16} />
                        </Button>
                    </div>
                </ScrollReveal>

                {/* Crypto Wallets Section */}
                <div className="grid gap-4 mb-8 sm:gap-6">
                    {wallets.map((wallet, idx) => (
                        <ScrollReveal key={idx} delay={idx * 100}>
                            <div className="flex flex-col gap-3 p-4 transition-all duration-300 border bg-[#0F0F0F] rounded-xl border-white/10 sm:gap-4 sm:p-6 md:flex-row md:items-center md:justify-between group hover:border-coinlect-accent/30">
                                <div className="flex items-center w-full gap-3 sm:gap-4 md:w-auto">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${wallet.color}`}>
                                        <Wallet size={20} className="sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="flex-grow min-w-0 text-left">
                                        <h3 className="text-sm font-bold text-white sm:text-base">{wallet.name}</h3>
                                        <p className="block text-[10px] text-gray-500 sm:text-xs">{t.donatePage.network}: {wallet.network}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center w-full gap-2 sm:gap-3 md:w-auto">
                                    <div className="flex-grow px-3 py-2 text-[10px] text-gray-300 truncate border rounded-lg select-all bg-black/50 border-white/5 sm:px-4 sm:py-3 sm:text-xs md:flex-grow-0 md:w-80">
                                        {wallet.address}
                                    </div>
                                    <button 
                                        onClick={() => handleCopy(wallet.address)}
                                        className="flex-shrink-0 p-2.5 text-white transition-colors rounded-lg bg-white/10 hover:bg-white/20 sm:p-3"
                                        title={t.donatePage.copyAddress}
                                        aria-label={t.donatePage.copyAddress}
                                    >
                                        {copied === wallet.address ? <Check size={14} className="text-green-500 sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
                                    </button>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Local DRC Donation Section */}
                <ScrollReveal delay={400}>
                    <div className="mb-12 text-left">
                        <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-white">{t.donatePage.localTitle}
                        </h3>
                        <div className="grid gap-4">
                            {mobileMoney.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 transition-all border bg-white/5 border-white/10 rounded-xl group hover:border-coinlect-accent/30">
                                    <div>
                                        <p className="text-xs tracking-wider text-gray-500 uppercase">{item.name}</p>
                                        <p className="font-bold text-white">{item.number}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleCopy(item.number)}
                                        className="p-2 text-gray-400 transition-colors rounded-lg hover:text-white bg-white/5"
                                    >
                                        {copied === item.number ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={500}>
                     <div className="p-6 border bg-gradient-to-r from-coinlect-accent/10 to-transparent rounded-2xl border-coinlect-accent/10 sm:p-8">
                        <h3 className="mb-3 text-lg font-bold text-white sm:text-xl sm:mb-4">{t.donatePage.otherWaysTitle}</h3>
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                            <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open('https://twitter.com/coinlect', '_blank')}>{t.donatePage.followX}</Button>
                            <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open('https://youtube.com/@coinlect', '_blank')}>{t.donatePage.subscribeYoutube}</Button>
                        </div>
                     </div>
                </ScrollReveal>
            </div>
            
            <div className="container px-4 mx-auto mt-12 sm:px-6 sm:mt-16">
                <AdBanner />
            </div>
        </div>
    );
};

export default Donate;