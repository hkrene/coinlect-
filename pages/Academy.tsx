'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ScrollReveal } from '../components/ScrollReveal';
import { Button } from '../components/Button';
import { AdBanner } from '../components/AdBanner';
import { courseService, articleService } from '../services/db';
import { Course, Article } from '../mockData';
import { 
  BookOpen, 
  ArrowRight, 
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Academy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'articles'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'articles') setActiveTab('articles');

    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      const categoryMapping: { [key: string]: string } = {
        'education': 'Tous', 'defi': 'DeFi', 'adoption': 'Tous', 
        'mining': 'Tous', 'guides': 'Tous', 'trading': 'Trading'
      };
      setActiveCategory(categoryMapping[categoryParam] || 'Tous');
    }

    const fetchedCourses = courseService.getAll();
    setCourses(fetchedCourses);
    setArticles(articleService.getAll());

    const newProgressMap: Record<number, number> = {};
    fetchedCourses.forEach(course => {
      const saved = localStorage.getItem(`course_${course.id}_progress`);
      if (saved) {
        const completed: number[] = JSON.parse(saved);
        const total = course.syllabus ? course.syllabus.length : course.modules;
        if (total > 0 && completed.length > 0) {
            newProgressMap[course.id] = Math.round((completed.length / total) * 100);
        }
      }
    });
    setProgressMap(newProgressMap);
  }, [searchParams]);

  const getFilteredCourses = () => courses.filter(c => (activeCategory === "Tous" || c.category === activeCategory) && c.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const getFilteredArticles = () => articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

  // Sub-components: CourseCard and ArticleCard (Logic unchanged)
  const CourseCard: React.FC<{ course: Course, delay: number }> = ({ course, delay }) => (
    <ScrollReveal delay={delay}>
        <Link href={`/academy/${course.id}`} className="block h-full group">
            <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 group-hover:border-coinlect-accent/30 transition-all duration-300 h-full flex flex-col relative">
                <div className="relative aspect-video">
                    <img src={course.image} alt={course.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="flex flex-col flex-grow p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-coinlect-accent text-[10px] font-bold uppercase tracking-widest">{course.category}</span>
                    </div>
                    <h3 className="mb-3 text-lg font-bold leading-tight text-white transition-colors line-clamp-2 group-hover:text-coinlect-accent">{course.title}</h3>
                    <p className="flex-grow mb-6 text-sm text-gray-400 line-clamp-3">{course.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <BookOpen size={14} className="text-coinlect-accent" /> {course.modules} Modules
                        </div>
                        <span className="text-white transition-transform group-hover:translate-x-1"><ArrowRight size={18} /></span>
                    </div>
                </div>
            </div>
        </Link>
    </ScrollReveal>
  );

  const ArticleCard: React.FC<{ article: Article, delay: number }> = ({ article, delay }) => (
    <ScrollReveal delay={delay}>
        <Link href={`/academy/article/${article.id}`} className="block h-full group">
            <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 group-hover:border-coinlect-accent/30 transition-all duration-300 h-full flex flex-col">
                <div className="relative overflow-hidden aspect-video">
                    <img src={article.image} alt={article.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80" />
                </div>
                <div className="flex flex-col flex-grow p-6">
                    <h3 className="mb-3 text-lg font-bold leading-tight text-white transition-colors line-clamp-2 group-hover:text-coinlect-accent">{article.title}</h3>
                    <p className="mb-4 text-sm text-gray-400 line-clamp-2">{article.excerpt}</p>
                </div>
            </div>
        </Link>
    </ScrollReveal>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-0">
    
      {/* SECTION 1: HERO - Académie Web3 (Edge to Edge) */}
      <div className="relative flex flex-col items-center justify-center py-24 overflow-hidden text-center bg-black">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="container relative z-10 px-6 mx-auto">
            <ScrollReveal>
                <div className="max-w-5xl mx-auto">
                    <h1 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tighter text-white md:text-7xl lg:text-8xl">
                        <span className="text-[#a1a1aa]">Apprenez la</span>{' '}Crypto{' '}<span className="text-[#a1a1aa]">et la</span>{' '}<br className="hidden md:block" />
                        <span className="relative inline-block text-white">
                            <span className="absolute inset-x-0 top-1/2 h-[2px] w-[110%] -translate-x-[5%] bg-white -rotate-2 z-10" />
                            Blockchain
                        </span>{' '}<span className="text-[#a1a1aa]">facilement</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-base leading-relaxed text-[#71717a] md:text-xl lg:text-2xl">
                        Maîtrisez les fondamentaux de la Finance Décentralisée (DeFi), des smart contracts et de l'infrastructure Web3.
                    </p>
                </div>
            </ScrollReveal>
        </div>
      </div>

      {/* SECTION 2: MAIN CONTENT (Inside Container) */}
      <div className="container px-6 mx-auto mt-12">
          {/* Main Tabs */}
          <div className="flex flex-col items-center justify-between gap-6 mb-12 md:flex-row">
              <div className="flex p-1 bg-[#111] rounded-xl border border-white/5 w-full md:w-auto">
                  <button onClick={() => setActiveTab('courses')} className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-coinlect-accent text-black' : 'text-gray-400 hover:text-white'}`}>Cours</button>
                  <button onClick={() => setActiveTab('articles')} className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'articles' ? 'bg-coinlect-accent text-black' : 'text-gray-400 hover:text-white'}`}>Articles & Analyse</button>
              </div>
              {activeTab === 'courses' && (
                  <div className="flex w-full gap-2 pb-2 overflow-x-auto md:w-auto md:pb-0 scrollbar-hide">
                      {t.academy.filters.map(f => (
                          <button key={f} onClick={() => setActiveCategory(f)} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeCategory === f ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}>{f}</button>
                      ))}
                  </div>
              )}
          </div>

          {/* Tab Content */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {activeTab === 'courses' ? (
                  getFilteredCourses().length > 0 ? getFilteredCourses().map((c, i) => <CourseCard key={c.id} course={c} delay={i * 100} />) : <div className="py-20 text-center text-gray-500 col-span-full">Aucun cours trouvé.</div>
              ) : (
                  getFilteredArticles().length > 0 ? getFilteredArticles().map((a, i) => <ArticleCard key={a.id} article={a} delay={i * 100} />) : <div className="py-20 text-center text-gray-500 col-span-full">Aucun article trouvé.</div>
              )}
          </div>

          {/* Trading Tools (Horizontal Scroll) */}
<ScrollReveal className="mt-20">
  <header className="mb-8">
      <h2 className="mb-2 text-2xl font-semibold text-slate-100 md:text-4xl">
        {t.academy.tradingTools.title}
      </h2>
      <p className="max-w-xl text-sm text-slate-400">
        Scanners de marché, explorateurs et plateformes d'analyse utilisés par les traders actifs.
      </p>
  </header>
  <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
        {[
          { title: "DexScreener", desc: "Graphiques en temps réel et historique de trading", link: "https://dexscreener.com/" },
          { title: "DexTools", desc: "Le hub central pour les traders DeFi", link: "https://dextools.io/" },
          { title: "BaseScan", desc: "Explorateur de blocs de l'écosystème Base", link: "https://basescan.org/" },
          { title: "EtherScan", desc: "Explorateur de la blockchain Ethereum", link: "https://etherscan.io/" },
          { title: "BscScan", desc: "Explorateur de blocs pour la BNB Smart Chain", link: "https://bscscan.com/" },
          { title: "Solscan", desc: "Analyse et explorateur de l'écosystème Solana", link: "https://solscan.io/" },
          { title: "Tonviewer", desc: "Explorateur de données pour le réseau TON", link: "https://tonviewer.com/" },
          { title: "Tonscan", desc: "Explorateur de blockchain officiel de TON", link: "https://tonscan.org/" },
          { title: "CoinGecko", desc: "Données de marché et classement des cryptos", link: "https://www.coingecko.com/" },
          { title: "CoinMarketCap", desc: "Suivi des prix, capitalisation et volumes", link: "https://coinmarketcap.com/" },
          { title: "SuiScan", desc: "Explorateur de blocs et d'objets pour Sui", link: "https://suiscan.xyz/" },
          { title: "RugCheck", desc: "Vérification de sécurité et détection de scam", link: "https://rugcheck.xyz/" },
          { title: "LunarCrush", desc: "Analyse des réseaux sociaux et sentiments Web3", link: "https://lunarcrush.com/" },
        ].map((item, idx) => (
            <a 
              key={idx} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative flex flex-col justify-between flex-shrink-0 w-64 p-5 overflow-hidden transition-all border rounded-none group md:w-80 border-white/10 bg-white/5 hover:border-coinlect-accent hover:bg-coinlect-accent/10"
            >
                <div className="relative z-10">
                    <h4 className="flex items-center justify-between mb-1 text-base font-semibold text-white">
                      {item.title}
                      <ExternalLink size={16} className="text-gray-400 transition-transform group-hover:translate-x-1" />
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {item.desc}
                    </p>
                </div>
            </a>
        ))}
  </div>
</ScrollReveal>
      </div>

      {/* SECTION 3: DEVELOPER / WEB3 ECOSYSTEM (Edge to Edge) */}
<section className="relative w-full py-24 mt-20 overflow-hidden bg-black">
  {/* Background Grid - Signature Dokploy */}
  <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

  <div className="relative z-10 w-full px-6 mx-auto max-w-7xl">
    <ScrollReveal>
      <div className="mb-24 text-center">
        <h2 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tighter text-white md:text-7xl lg:text-8xl">
          <span className="text-[#a1a1aa]">Explorez les</span>{' '}Protocoles{' '}<span className="text-[#a1a1aa]">et</span>{' '}<br className="hidden md:block" />
          <span className="relative inline-block text-white">
            <span className="absolute inset-x-0 top-1/2 h-[2px] w-[110%] -translate-x-[5%] bg-white -rotate-2 z-10" />
            Écosystèmes
          </span>{' '}<span className="text-[#a1a1aa]">Blockchain</span>
        </h2>
        <p className="max-w-3xl mx-auto text-base leading-relaxed text-[#71717a] md:text-xl lg:text-2xl">
          Maîtrisez le développement sur les réseaux les plus puissants avec nos guides techniques.
        </p>
      </div>

      {/* Grid sans bordure extérieure */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[
          { 
            title: "Ethereum", 
            logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024", 
            desc: "Le standard des smart contracts. Apprenez à utiliser Hardhat et Solidity.", 
            links: [
              { name: "Hardhat Guide", href: "#" },
              { name: "Solidity", href: "#" }
            ] 
          },
          { 
            title: "Bitcoin", 
            logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=024", 
            desc: "Explorez la couche de base et les solutions L2 comme Lightning et Stacks.", 
            links: [{ name: "Lightning", href: "#" }] 
          },
          { 
            title: "Base (L2)", 
            logo: "https://cdn.brandfetch.io/id6XsSOVVS/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1757929784005", 
            desc: "L'écosystème L2 de Coinbase. Compatibilité EVM totale.", 
            links: [{ name: "Base Docs", href: "#" }] 
          },
          { 
            title: "TON Network", 
            logo: "https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=024", 
            desc: "Adoption de masse via Telegram. Développez avec FunC et Tact.", 
            links: [{ name: "TON SDK", href: "#" }] 
          },
          { 
            title: "Sui Blockchain", 
            logo: "https://cryptologos.cc/logos/sui-sui-logo.svg?v=024", 
            desc: "Modèle objet via Move. Performance extrême pour le gaming.", 
            links: [{ name: "Sui Move", href: "#" }] 
          },
          { 
            title: "BNB Smart Chain", 
            logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=024", 
            desc: "La blockchain EVM pour la DeFi. Compatible tools Ethereum.", 
            links: [{ name: "BSC Dev", href: "#" }] 
          }
        ].map((item, index) => (
          <div 
            key={index} 
            className="relative flex flex-col items-start p-10 transition-all duration-300 bg-transparent group rounded-none border-white/10 border-b md:border-r hover:bg-white/[0.02]"
          >
            {/* Ligne d'accentuation verticale au survol */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/0 group-hover:bg-white transition-all duration-300" />
            
            <div className="flex items-center mb-6">
              <img 
                src={item.logo} 
                alt={item.title} 
                className="w-10 h-10 transition-all duration-500 grayscale brightness-[2] group-hover:grayscale-0 group-hover:brightness-100" 
              />
            </div>
            
            <h3 className="mb-4 text-xl font-bold tracking-tight text-white uppercase">
              {item.title}
            </h3>
            
            <p className="text-[#71717a] leading-relaxed mb-8 text-sm group-hover:text-gray-300 transition-colors">
              {item.desc}
            </p>

            <div className="flex flex-wrap gap-4 mt-auto">
              {item.links.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.href}
                  className="text-[10px] font-black tracking-widest uppercase text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-2"
                >
                  {link.name} <span className="text-xs">→</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  </div>
</section>

      {/* FOOTER AREA */}
      <div className="container px-6 mx-auto">
          <AdBanner className="my-20" />
      </div>
    </div>
  );
};

export default Academy;