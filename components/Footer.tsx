'use client';

import React from 'react';
import { Button } from './Button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const Footer: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isAuthenticated } = useAuth();
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
                            {isAuthenticated ? (
                                <>
                                    <p className="mb-2 text-gray-400">Sponsor Us</p>
                                    <p className="mb-8 text-sm text-gray-500">Support our mission to provide free Web3 education in Africa.</p>
                                    <a href="mailto:coinlectacademy@gmail.com?subject=Sponsorship Inquiry" target="_blank" rel="noopener noreferrer">
                                        <Button variant="primary" withArrow className="text-xs font-bold">Sponsor Us</Button>
                                    </a>
                                </>
                            ) : (
                                <>
                                    <p className="mb-2 text-gray-400">{t.footer.ready}</p>
                                    <p className="mb-8 text-sm text-gray-500">{t.footer.join}</p>
                                    <Link href="/register">
                                        <Button variant="secondary" withArrow className="text-xs">{t.footer.createAccount}</Button>
                                    </Link>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {isAuthenticated ? (
                                <>
                                    <p className="mb-2 text-gray-400">Sponsor Us</p>
                                    <p className="mb-8 text-sm text-gray-500">Support our mission to provide free Web3 education in Africa.</p>
                                    <a href="mailto:coinlectacademy@gmail.com?subject=Sponsorship Inquiry" target="_blank" rel="noopener noreferrer">
                                        <Button variant="primary" withArrow className="text-xs font-bold">Sponsor Us</Button>
                                    </a>
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
                        </>
                    )}
                </div>
                {/* Decorative image in footer card */}
                <div className="absolute top-0 bottom-0 right-0 w-1/3 opacity-20 mask-image-gradient">
                     <div className="w-full h-full transform translate-x-12 skew-x-12 bg-gradient-to-l from-coinlect-accent to-transparent"></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-16 text-xs text-gray-500 md:grid-cols-3 lg:grid-cols-5">
                <div>
                    <h4 className="mb-4 font-semibold text-white">{t.footer.platform}</h4>
                    <ul className="space-y-2">
                        <li><Link href="/trends" className="hover:text-coinlect-accent">{t.nav.trends}</Link></li>
                        <li><Link href="/academy" className="hover:text-coinlect-accent">{t.nav.academy}</Link></li>
                        <li><Link href="/deals" className="hover:text-coinlect-accent">{t.nav.deals}</Link></li>
                        <li><Link href="/events" className="hover:text-coinlect-accent">{t.nav.events}</Link></li>
                        {!isAuthenticated && <li><Link href="/register" className="hover:text-coinlect-accent">{t.nav.register}</Link></li>}
                    </ul>
                </div>
                <div>
                    <h4 className="mb-4 font-semibold text-white">{t.footer.support}</h4>
                    <ul className="space-y-2">
                        <li><a href="https://chat.whatsapp.com/LkCbdPcPL6i4yBnWMtJzpN?mode=hqrc" target="_blank" rel="noopener noreferrer" className="hover:text-coinlect-accent">{t.footer.helpCenter}</a></li>
                        <li><button onClick={() => {
                            const chatButton = document.querySelector('[data-chat-trigger]') as HTMLElement;
                            if (chatButton) chatButton.click();
                        }} className="text-left hover:text-coinlect-accent">{t.footer.chatbot}</button></li>
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
                <div>
                    <h4 className="mb-4 font-semibold text-white">{t.footer.contact}</h4>
                    <ul className="space-y-2">
                        <li><a href="mailto:info@coinlect.org" className="hover:text-coinlect-accent">info@coinlect.org</a></li>
                        <li><a href="mailto:contact@coinlect.org" className="hover:text-coinlect-accent">contact@coinlect.org</a></li>
                        <li>
                            <a href="https://wa.me/243971379450" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-coinlect-accent">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
                                </svg>
                                +243 971 379 450
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col items-center justify-between border-t md:flex-row border-white/5">
                <div className="flex flex-col items-center gap-4 md:flex-row">
                    <div className="flex items-center gap-4">
                        {/* Language Toggle beside Social Icons */}
                        <div className="relative flex items-center">
                            <button 
                                onClick={() => setLanguage('fr')}
                                className={`relative z-10 w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                                    language === 'fr' 
                                        ? 'border-coinlect-accent bg-black text-gray-200 shadow-[0_0_0_2px_rgba(245,158,11,0.3)]' 
                                        : 'border-white/10 bg-black text-gray-500'
                                }`}
                            >
                                <span className="text-[10px] font-semibold">FR</span>
                            </button>
                            <button 
                                onClick={() => setLanguage('en')}
                                className={`relative -ml-3 z-0 w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                                    language === 'en' 
                                        ? 'border-coinlect-accent bg-black text-gray-200 shadow-[0_0_0_2px_rgba(245,158,11,0.3)]' 
                                        : 'border-white/10 bg-black text-gray-500'
                                }`}
                            >
                                <span className="text-[10px] font-semibold">EN</span>
                            </button>
                        </div>
                        <div className="flex gap-4">
                        {/* Twitter/X */}
                        <a href="https://x.com/coinlect" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)" className="text-gray-500 transition-colors hover:text-white">
                             <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                            </svg>
                        </a>
                        {/* LinkedIn */}
                        <a href="https://www.linkedin.com/company/coinlect-academie" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn" className="text-gray-500 transition-colors hover:text-white">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        {/* YouTube */}
                        <a href="https://www.youtube.com/@Coinlect" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to our YouTube channel" className="text-gray-500 transition-colors hover:text-white">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                        {/* Telegram */}
                        <a href="https://t.me/coinlect_academy" target="_blank" rel="noopener noreferrer" aria-label="Join our Telegram channel" className="text-gray-500 transition-colors hover:text-white">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                        </a>
                        {/* GitHub */}
                        <a href="https://github.com/hkrene/coinlect-" target="_blank" rel="noopener noreferrer" aria-label="View the Coinlect source code on GitHub" className="text-gray-500 transition-colors hover:text-white">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 my-4 md:mb-0">
                    <span className="text-xs text-gray-500">© {new Date().getFullYear()} Coinlect. {t.footer.rights}</span>
                    <a href="https://www.hirwarene.xyz" className="text-xs text-gray-500" target="_blank" rel="noopener noreferrer">
                <span>Designed by <span  className='text-blue-500'>Hkrene</span></span>
                </a>
                </div>
            </div>
        </div>
    </footer>
  );
};
