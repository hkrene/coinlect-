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
        <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-[#0a0a0a]">
            <div className="container max-w-3xl px-6 mx-auto text-center">
                <ScrollReveal>
                    <h1 className="mb-6 text-3xl font-bold text-white md:text-5xl">
                        Help Us Grow the <span className="text-coinlect-accent">Ecosystem</span>
                    </h1>
                    
                    <p className="mb-12 text-base leading-relaxed text-gray-400 md:text-lg">
                        Coinlect is committed to providing free education and tools for the African crypto community. 
                        Your donations help us maintain servers, create high-quality content, and develop new features.
                    </p>
                </ScrollReveal>

                <div className="grid gap-6 mb-16">
                    {wallets.map((wallet, idx) => (
                        <ScrollReveal key={idx} delay={idx * 100}>
                            <div className="flex flex-col items-center justify-between gap-4 p-6 transition-all duration-300 border glass-card rounded-xl border-white/10 md:flex-row group hover:border-coinlect-accent/30">
                                <div className="flex items-center w-full gap-4 md:w-auto">
                                    <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 ${wallet.color}`}>
                                        <Wallet size={24} />
                                    </div>
                                    <div className="flex-grow text-left">
                                        <h3 className="font-bold text-white">{wallet.name}</h3>
                                        <p className="block font-mono text-xs text-gray-500">Network: {wallet.network}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center w-full gap-2 md:w-auto">
                                    <div className="flex-grow px-4 py-3 font-mono text-xs text-gray-300 truncate border rounded-lg select-all bg-black/50 border-white/5 md:flex-grow-0 md:w-80">
                                        {wallet.address}
                                    </div>
                                    <button 
                                        onClick={() => handleCopy(wallet.address)}
                                        className="flex-shrink-0 p-3 text-white transition-colors rounded-lg bg-white/10 hover:bg-white/20"
                                        title="Copy Address"
                                    >
                                        {copied === wallet.address ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={300}>
                     <div className="p-8 border bg-gradient-to-r from-coinlect-accent/10 to-transparent rounded-2xl border-coinlect-accent/10">
                        <h3 className="mb-4 text-xl font-bold text-white">Other Ways to Support</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="outline" onClick={() => window.open('https://twitter.com/coinlect', '_blank')}>Follow us on X</Button>
                            <Button variant="outline" onClick={() => window.open('https://youtube.com/@coinlect', '_blank')}>Subscribe on YouTube</Button>
                        </div>
                     </div>
                </ScrollReveal>
            </div>
            
            <div className="container px-6 mx-auto mt-16">
                <AdBanner />
            </div>
        </div>
    );
};

export default Donate;
