'use client';

import React, { useState } from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { Button } from '../components/Button';
import { AdBanner } from '../components/AdBanner';
import { Copy, Check, Heart, Wallet } from 'lucide-react';

export const Donate: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const wallets = [
        { 
            name: "Bitcoin (BTC)", 
            address: "bc1qa7mzzd4u8vgycyczjypm5pam0rdjntvlqsnjvc", 
            network: "Bitcoin Network",
            color: "text-orange-500" 
        },
        { 
            name: "Ethereum (ETH)", 
            address: "0xF9D4b07342D1A8edB6290cc938B7d35a1F284C83", 
            network: "Ethereum Network",
            color: "text-blue-500" 
        },
        { 
            name: "USDT (TRC20)", 
            address: "TBFfsCJ689cyZ3eUTgEpGLiqEyuqJen6iF", 
            network: "Tron Network",
            color: "text-green-500" 
        }
    ];

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopied(address);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 bg-[#0a0a0a] sm:pt-24 md:pt-32 md:pb-20">
            <div className="container max-w-3xl px-4 mx-auto text-center sm:px-6">
                <ScrollReveal>
                    <h1 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-5xl sm:mb-6">
                        Help Us Grow the <span className="text-coinlect-accent">Ecosystem</span>
                    </h1>
                    
                    <p className="mb-8 text-sm leading-relaxed text-gray-400 sm:text-base sm:mb-12 md:text-lg">
                        Coinlect is committed to providing free education and tools for the African crypto community. 
                        Your donations help us maintain servers, create high-quality content, and develop new features.
                    </p>
                </ScrollReveal>

                <div className="grid gap-4 mb-12 sm:gap-6 sm:mb-16">
                    {wallets.map((wallet, idx) => (
                        <ScrollReveal key={idx} delay={idx * 100}>
                            <div className="flex flex-col gap-3 p-4 transition-all duration-300 border bg-[#0F0F0F] rounded-xl border-white/10 sm:gap-4 sm:p-6 md:flex-row md:items-center md:justify-between group hover:border-coinlect-accent/30">
                                <div className="flex items-center w-full gap-3 sm:gap-4 md:w-auto">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${wallet.color}`}>
                                        <Wallet size={20} className="sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="flex-grow min-w-0 text-left">
                                        <h3 className="text-sm font-bold text-white sm:text-base">{wallet.name}</h3>
                                        <p className="block font-mono text-[10px] text-gray-500 sm:text-xs">Network: {wallet.network}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center w-full gap-2 sm:gap-3 md:w-auto">
                                    <div className="flex-grow px-3 py-2 font-mono text-[10px] text-gray-300 truncate border rounded-lg select-all bg-black/50 border-white/5 sm:px-4 sm:py-3 sm:text-xs md:flex-grow-0 md:w-80">
                                        {wallet.address}
                                    </div>
                                    <button 
                                        onClick={() => handleCopy(wallet.address)}
                                        className="flex-shrink-0 p-2.5 text-white transition-colors rounded-lg bg-white/10 hover:bg-white/20 sm:p-3"
                                        title="Copy Address"
                                        aria-label="Copy Address"
                                    >
                                        {copied === wallet.address ? <Check size={14} className="text-green-500 sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
                                    </button>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={300}>
                     <div className="p-6 border bg-gradient-to-r from-coinlect-accent/10 to-transparent rounded-2xl border-coinlect-accent/10 sm:p-8">
                        <h3 className="mb-3 text-lg font-bold text-white sm:text-xl sm:mb-4">Other Ways to Support</h3>
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                            <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open('https://twitter.com/coinlect', '_blank')}>Follow us on X</Button>
                            <Button variant="outline" className="w-full sm:w-auto" onClick={() => window.open('https://youtube.com/@coinlect', '_blank')}>Subscribe on YouTube</Button>
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
