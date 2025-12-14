'use client';

import React from 'react';
import { Button } from './Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isDonatePage = pathname === '/donate';

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden bg-black border-t border-white/5">
        {/* Background Mesh */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-[0.03]"></div>

        <div className="container relative z-10 px-6 mx-auto">
            {/* CTA Box - Toggles based on page */}
            <div className="relative p-10 mb-20 overflow-hidden border bg-white/5 border-white/10 rounded-2xl">
                <div className="relative z-10 max-w-xl">
                    {isDonatePage ? (
                        <>
                            <p className="mb-2 text-gray-400">{t.footer.ready}</p>
                            <p className="mb-8 text-sm text-gray-500">{t.footer.join}</p>
                            <Link href="/register">
                                <Button variant="secondary" withArrow className="text-xs">{t.footer.createAccount}</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="mb-2 text-gray-400">{t.footer.donateTitle}</p>
                            <p className="mb-8 text-sm text-gray-500">{t.footer.donateDesc}</p>
                            <Link href="/donate">
                                <Button variant="primary" withArrow className="text-xs font-bold">{t.footer.donateBtn}</Button>
                            </Link>
                        </>
                    )}
                </div>
                {/* Decorative image in footer card */}
                <div className="absolute top-0 bottom-0 right-0 w-1/3 opacity-20 mask-image-gradient">
                     <div className="w-full h-full transform translate-x-12 skew-x-12 bg-gradient-to-l from-coinlect-accent to-transparent"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-16 text-xs text-gray-500 md:grid-cols-4">
                <div>
                    <h4 className="mb-4 font-semibold text-white">{t.footer.platform}</h4>
                    <ul className="space-y-2">
                        <li><Link href="/trends" className="hover:text-coinlect-accent">{t.nav.trends}</Link></li>
                        <li><Link href="/academy" className="hover:text-coinlect-accent">{t.nav.academy}</Link></li>
                        <li><Link href="/deals" className="hover:text-coinlect-accent">{t.nav.deals}</Link></li>
                        <li><Link href="/events" className="hover:text-coinlect-accent">{t.nav.events}</Link></li>
                        <li><Link href="/register" className="hover:text-coinlect-accent">{t.nav.register}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 font-semibold text-white">{t.footer.support}</h4>
                    <ul className="space-y-2">
                        <li><a href="https://chat.whatsapp.com/LkCbdPcPL6i4yBnWMtJzpN?mode=hqrc" target="_blank" rel="noopener noreferrer" className="hover:text-coinlect-accent">{t.footer.helpCenter}</a></li>
                        {/* Removed Fees, Security, API */}
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 font-semibold text-white">{t.footer.company}</h4>
                    <ul className="space-y-2">
                        <li><Link href="/about" className="hover:text-coinlect-accent">{t.footer.about}</Link></li>
                        {/* Blog and Articles linking to academy articles tab */}
                        <li><Link href="/academy?tab=articles" className="hover:text-coinlect-accent">{t.footer.blog}</Link></li>
                        <li><Link href="/academy?tab=articles" className="hover:text-coinlect-accent">{t.footer.articles}</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 font-semibold text-white">{t.footer.legal}</h4>
                    <ul className="space-y-2">
                        <li><Link href="/privacy" className="hover:text-coinlect-accent">{t.footer.privacy}</Link></li>
                        <li><Link href="/terms" className="hover:text-coinlect-accent">{t.footer.terms}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col items-center justify-between pt-8 border-t md:flex-row border-white/5">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <img 
                        src="https://res.cloudinary.com/drsd8adkq/image/upload/v1765187097/coinlect-0_denz8g.jpg" 
                        alt="Coinlect" 
                        className="hidden w-auto h-6 rounded-full opacity-70 md:block"
                    />
                    <span className="text-gray-500">© 2025 Coinlect. {t.footer.rights}</span>
                </div>
                <div className="flex gap-4">
                    {/* Twitter/X */}
                    <a href="https://x.com/coinlect" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-colors hover:text-white">
                         <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                        </svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="https://www.linkedin.com/company/coinlect-academie" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-colors hover:text-white">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                    {/* YouTube */}
                    <a href="https://www.youtube.com/@Coinlect" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-colors hover:text-white">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                    </a>
                    {/* Telegram */}
                    <a href="https://t.me/coinlect_academy" target="_blank" rel="noopener noreferrer" className="text-gray-500 transition-colors hover:text-white">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </footer>
  );
};
