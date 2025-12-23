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
  Clock, 
  Search, 
  Layers, 
  Shield, 
  ArrowRight, 
  Code,
  Globe,
  Zap,
  ExternalLink,
  Cpu,Database, // Add this
  Boxes,
  Share2,
  Terminal
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import RippleGrid from '../components/RippleGrid';

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
    // Detect deep-linked tab
    const tabParam = searchParams?.get('tab');
    if (tabParam === 'articles') {
        setActiveTab('articles');
    }

    // Detect category parameter for filtering
    const categoryParam = searchParams?.get('category');
    if (categoryParam) {
      // Map new categories to existing filters
      const categoryMapping: { [key: string]: string } = {
        'education': 'Tous', // Default to all for education
        'defi': 'DeFi',
        'adoption': 'Tous', // Default to all for adoption
        'mining': 'Tous', // Default to all for mining
        'guides': 'Tous', // Default to all for guides
        'trading': 'Trading'
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

  const getFilteredCourses = () => {
    return courses.filter(course => {
        const matchesCategory = activeCategory === "Tous" || course.category === activeCategory;
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  };

  const getFilteredArticles = () => {
    return articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });
  };

  const CourseCard: React.FC<{ course: Course, delay: number }> = ({ course, delay }) => {
    const progress = progressMap[course.id] || 0;
    const progressBarRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress}%`;
      }
    }, [progress]);
    
    return (
        <ScrollReveal delay={delay}>
            <Link href={`/academy/${course.id}`} className="block h-full group">
                <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 group-hover:border-coinlect-accent/30 transition-all duration-300 h-full flex flex-col relative">
                    <div className="relative aspect-video">
                        <img src={course.image} alt={course.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-3 left-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                                course.level === 'Débutant' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 
                                course.level === 'Intermédiaire' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                                'bg-red-500/10 text-red-400 border-red-500/30'
                            }`}>
                                {course.level}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col flex-grow p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-coinlect-accent text-[10px] font-bold uppercase tracking-widest">{course.category}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{course.duration}</span>
                        </div>
                        <h3 className="mb-3 text-lg font-bold leading-tight text-white transition-colors line-clamp-2 group-hover:text-coinlect-accent">
                            {course.title}
                        </h3>
                        <p className="flex-grow mb-6 text-sm text-gray-400 line-clamp-3">
                            {course.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <BookOpen size={14} className="text-coinlect-accent" />
                                {course.modules} Modules
                            </div>
                            <span className="text-white transition-transform group-hover:translate-x-1"><ArrowRight size={18} /></span>
                        </div>
                    </div>
                    
                    {progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                            <div ref={progressBarRef} className="h-full bg-coinlect-accent"></div>
                        </div>
                    )}
                </div>
            </Link>
        </ScrollReveal>
    );
  };

  const ArticleCard: React.FC<{ article: Article, delay: number }> = ({ article, delay }) => {
    return (
        <ScrollReveal delay={delay}>
            <Link href={`/academy/article/${article.id}`} className="block h-full group">
                <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 group-hover:border-coinlect-accent/30 transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden aspect-video">
                        <img src={article.image} alt={article.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-80" />
                        <div className="absolute bottom-3 left-3">
                            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase border border-white/10">
                                {article.category}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col flex-grow p-6">
                        <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <span>{article.date}</span>
                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                            <span>{article.readTime} read</span>
                        </div>
                        <h3 className="mb-3 text-lg font-bold leading-tight text-white transition-colors line-clamp-2 group-hover:text-coinlect-accent">
                            {article.title}
                        </h3>
                        <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                            {article.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-auto">
                            <img src={article.authorImage} alt={article.author} className="w-6 h-6 border rounded-full border-white/10" />
                            <span className="text-xs font-medium text-gray-300">{article.author}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </ScrollReveal>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
    
      {/* Section Hero - Académie Web3 */}
      <div className="relative flex flex-col items-center justify-center py-24 mb-12 overflow-hidden text-center bg-black">
        {/* Grille de fond - Signature esthétique Dokploy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"
        />
        
        <div className="container relative z-10 px-6 mx-auto">
            <ScrollReveal>
                <div className="max-w-5xl mx-auto">
                    

                    <h1 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tighter text-white md:text-7xl lg:text-8xl">
                        <span className="text-[#a1a1aa]">Apprenez la</span>{' '}
                        Crypto{' '}
                        <span className="text-[#a1a1aa]">et la</span>{' '}
                        <br className="hidden md:block" />
                        <span className="relative inline-block text-white">
                            {/* La ligne blanche barrée style Dokploy */}
                            <span className="absolute inset-x-0 top-1/2 h-[2px] w-[110%] -translate-x-[5%] bg-white -rotate-2 z-10" />
                            Blockchain
                        </span>{' '}
                        <span className="text-[#a1a1aa]">facilement</span>
                    </h1>
                    
                    <p className="max-w-3xl mx-auto mb-12 text-base leading-relaxed text-[#71717a] md:text-xl lg:text-2xl">
                        Maîtrisez les fondamentaux de la Finance Décentralisée (DeFi), des smart contracts 
                        et de l'infrastructure qui propulse la révolution Web3.
                    </p>
                </div>
            </ScrollReveal>
        </div>
      </div>
      <div className="container px-6 mx-auto">
          
          {/* Main Tabs */}
          <div className="flex flex-col items-center justify-between gap-6 mb-12 md:flex-row">
              <div className="flex p-1 bg-[#111] rounded-xl border border-white/5 w-full md:w-auto">
                  <button 
                    onClick={() => setActiveTab('courses')}
                    className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-coinlect-accent text-black' : 'text-gray-400 hover:text-white'}`}
                  >
                      Cours
                  </button>
                  <button 
                    onClick={() => setActiveTab('articles')}
                    className={`flex-1 md:flex-none px-8 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'articles' ? 'bg-coinlect-accent text-black' : 'text-gray-400 hover:text-white'}`}
                  >
                      Blog & Analyse
                  </button>
              </div>

              {activeTab === 'courses' && (
                  <div className="flex w-full gap-2 pb-2 overflow-x-auto md:w-auto md:pb-0 scrollbar-hide">
                      {t.academy.filters.map(f => (
                          <button 
                            key={f}
                            onClick={() => setActiveCategory(f)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeCategory === f ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'}`}
                          >
                              {f}
                          </button>
                      ))}
                  </div>
              )}
          </div>

          {/* Tab Content */}
          <div>
              {activeTab === 'courses' ? (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {getFilteredCourses().length > 0 ? (
                          getFilteredCourses().map((c, i) => (
                              <CourseCard key={c.id} course={c} delay={i * 100} />
                          ))
                      ) : (
                          <div className="py-20 text-center text-gray-500 col-span-full">Aucun cours trouvé.</div>
                      )}
                  </div>
              ) : (
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {getFilteredArticles().length > 0 ? (
                          getFilteredArticles().map((a, i) => (
                              <ArticleCard key={a.id} article={a} delay={i * 100} />
                          ))
                      ) : (
                          <div className="py-20 text-center text-gray-500 col-span-full">Aucun article trouvé.</div>
                      )}
                  </div>
              )}
          </div>

          <ScrollReveal className="px-6 mx-auto mt-20 ">
            {/* Header */}
            <header className="mb-8">
                <h2 className="mb-2 text-2xl font-semibold text-slate-100 md:text-4xl">
                    {t.academy.tradingTools.title}
                </h2>
                <p className="max-w-xl text-sm text-slate-400">
                    Market scanners, explorers and analytics platforms used by active traders.
                </p>
            </header>

              {/* Tools Grid */}
              <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide">
                  {[
                      {
                          title: t.academy.tradingTools.dexscreener.title,
                          desc: t.academy.tradingTools.dexscreener.desc,
                          link: "https://dexscreener.com/",
                      },
                      {
                          title: t.academy.tradingTools.dextools.title,
                          desc: t.academy.tradingTools.dextools.desc,
                          link: "https://www.dextools.io/",
                      },
                      {
                          title: t.academy.tradingTools.basescan.title,
                          desc: t.academy.tradingTools.basescan.desc,
                          link: "https://basescan.org/",
                      },
                      {
                          title: t.academy.tradingTools.etherscan.title,
                          desc: t.academy.tradingTools.etherscan.desc,
                          link: "https://etherscan.io/",
                      },
                      {
                          title: t.academy.tradingTools.tonscan.title,
                          desc: t.academy.tradingTools.tonscan.desc,
                          link: "https://tonscan.org/",
                      },
                      {
                          title: t.academy.tradingTools.bscscan.title,
                          desc: t.academy.tradingTools.bscscan.desc,
                          link: "https://bscscan.com/",
                      },
                      {
                          title: t.academy.tradingTools.solscan.title,
                          desc: t.academy.tradingTools.solscan.desc,
                          link: "https://solscan.io/",
                      },
                      {
                          title: t.academy.tradingTools.coingecko.title,
                          desc: t.academy.tradingTools.coingecko.desc,
                          link: "https://www.coingecko.com/",
                      },
                      {
                          title: t.academy.tradingTools.coinmarketcap.title,
                          desc: t.academy.tradingTools.coinmarketcap.desc,
                          link: "https://coinmarketcap.com/",
                      },
                      {
                          title: t.academy.tradingTools.more.title,
                          desc: t.academy.tradingTools.more.desc,
                          link: "#",
                      },
                  ].map((item, idx) => (
                      <a
                          key={idx}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative flex flex-col justify-between flex-shrink-0 w-64 p-5 overflow-hidden transition-all border group md:w-80 rounded-xl border-white/10 bg-white/5 hover:border-coinlect-accent hover:bg-coinlect-accent/10"
                      >
                          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-coinlect-accent/10 group-hover:opacity-100"></div>
                          <div className="relative z-10">
                              <h4 className="flex items-center justify-between mb-1 text-base font-semibold text-white">
                                  {item.title}
                                  <ExternalLink
                                      size={16}
                                      className="text-gray-400 transition-transform group-hover:translate-x-1"
                                  />
                              </h4>
                              <p className="text-sm leading-relaxed text-gray-400">
                                  {item.desc}
                              </p>
                          </div>
                          <div className="relative z-10 mt-3 text-sm font-medium transition-colors text-coinlect-accent group-hover:text-white">
                              Open tool →
                          </div>
                      </a>
                  ))}
            </div>
          </ScrollReveal>

{/* Web3 Ecosystem - Style Hero (Full Space, No Borders) */}
<ScrollReveal>
  <section className="relative w-full py-24 overflow-hidden bg-black">
    
    {/* Grille de fond - Signature esthétique Dokploy (Mesh 64px) */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"
    />

    <div className="relative z-10 w-full px-6 mx-auto max-w-7xl">
      {/* En-tête - Même structure que le Hero */}
      <div className="mb-24 text-center">
        <h2 className="mb-8 text-5xl font-bold leading-[1.1] tracking-tighter text-white md:text-7xl lg:text-8xl">
          <span className="text-[#a1a1aa]">Explorez les</span>{' '}
          Protocoles{' '}
          <span className="text-[#a1a1aa]">et</span>{' '}
          <br className="hidden md:block" />
          <span className="relative inline-block text-white">
            {/* La ligne blanche barrée style Dokploy */}
            <span className="absolute inset-x-0 top-1/2 h-[2px] w-[110%] -translate-x-[5%] bg-white -rotate-2 z-10" />
            Écosystèmes
          </span>{' '}
          <span className="text-[#a1a1aa]">Blockchain</span>
        </h2>
        
        <p className="max-w-3xl mx-auto text-base leading-relaxed text-[#71717a] md:text-xl lg:text-2xl">
          Maîtrisez le développement sur les réseaux les plus puissants avec nos guides techniques.
        </p>
      </div>

      {/* Grid de contenu - Bordures supprimées, style "Developer Space" épuré */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Ethereum",
            logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=024",
            desc: "Le standard des smart contracts. Apprenez à utiliser Hardhat et Solidity.",
            links: [{ name: "Hardhat Guide", href: "#" }, { name: "Foundry Pro", href: "#" }]
          },
          {
            title: "Bitcoin",
            logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=024",
            desc: "Explorez la couche de base et les solutions L2 comme Lightning et Stacks.",
            links: [{ name: "Lightning", href: "#" }, { name: "Bitcoin Core", href: "#" }]
          },
          {
            title: "Base (L2)",
            logo: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/symbol/flat/base-logo-symbol-flat.svg",
            desc: "L'écosystème L2 de Coinbase. Compatibilité EVM totale avec frais minimes.",
            links: [{ name: "Base Docs", href: "#" }, { name: "Déployer", href: "#" }]
          },
          {
            title: "TON Network",
            logo: "https://cryptologos.cc/logos/toncoin-ton-logo.svg?v=024",
            desc: "Adoption de masse via Telegram. Développez avec FunC et Tact.",
            links: [{ name: "Blueprint TON", href: "#" }, { name: "TON SDK", href: "#" }]
          },
          {
            title: "Sui Blockchain",
            logo: "https://cryptologos.cc/logos/sui-sui-logo.svg?v=024",
            desc: "Modèle objet via Move. Performance extrême pour le gaming.",
            links: [{ name: "Sui Move", href: "#" }, { name: "Sui SDK", href: "#" }]
          },
          {
            title: "BNB Smart Chain",
            logo: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=024",
            desc: "La blockchain EVM pour la DeFi. Compatible avec tous les outils Ethereum.",
            links: [{ name: "BSC Dev", href: "#" }, { name: "Greenfield", href: "#" }]
          }
        ].map((item, index) => (
          <div key={index} className="relative flex flex-col items-start transition-all duration-300 group">
            {/* Accentuation discrète sur le côté (Developer Space style) */}
            <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-white/0 group-hover:bg-white transition-all duration-300" />
            
            <div className="flex items-center mb-6">
              <img 
                src={item.logo} 
                alt={item.title} 
                className="w-10 h-10 transition-all duration-500 grayscale brightness-200 group-hover:grayscale-0" 
              />
            </div>
            
            <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">
              {item.title}
            </h3>
            
            <p className="text-[#71717a] leading-relaxed mb-8 group-hover:text-gray-300 transition-colors">
              {item.desc}
            </p>

            <div className="flex flex-wrap gap-4 mt-auto">
              {item.links.map((link, lIndex) => (
                <a
                  key={lIndex}
                  href={link.href}
                  className="text-sm font-bold text-[#a1a1aa] hover:text-white transition-colors flex items-center gap-1"
                >
                  {link.name} <span className="text-xs">→</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
</ScrollReveal>


          <AdBanner className="mt-20" />
      </div>
    </div>
  );
};

export default Academy;
