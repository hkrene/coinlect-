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
  Cpu,
  Terminal
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
      
      {/* Hero Section */}
      <div className="relative py-20 mb-12 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-coinlect-accent/10 to-transparent pointer-events-none"></div>
        <div className="container relative z-10 px-6 mx-auto">
            <ScrollReveal>
                <div className="max-w-3xl">
                    <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">
                        {t.academy.title} <span className="text-coinlect-accent">{t.academy.titleSuffix}</span>
                    </h1>
                    <p className="max-w-2xl mb-10 text-lg leading-relaxed text-gray-400 md:text-xl">
                        {t.academy.subtitle}
                    </p>
                    
                    {/* Search bar */}
                    <div className="relative max-w-xl group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-coinlect-accent to-yellow-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center p-2 bg-black border rounded-lg border-white/10">
                            <Search className="ml-3 text-gray-500" size={20} />
                            <input 
                                type="text" 
                                placeholder={t.academy.searchPlaceholder} 
                                className="w-full py-2 pl-3 pr-4 text-white placeholder-gray-600 bg-transparent focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
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

          <ScrollReveal className="px-6 mx-auto mt-20 max-w-7xl">
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

         {/* Developer Space Section – Page Level */}
<ScrollReveal className="mt-32">
  <section className="px-6 md:px-12">
    
    {/* Header */}
    <header className="flex flex-col gap-6 mb-12 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold tracking-widest text-blue-400 uppercase">
          <Code size={14} />
          {t.academy.devSpace}
        </div>

        <h2 className="max-w-2xl text-2xl font-semibold text-slate-100 md:text-4xl">
          {t.academy.buildFuture} <span className="text-blue-400">Web3</span>
        </h2>

        <p className="max-w-xl mt-3 text-sm text-slate-400">
          Documentation, tooling and references for developers building on-chain applications.
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href="https://ethereum.org/en/developers/docs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="h-10 px-5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500">
            Ethereum Docs
          </Button>
        </a>

        <a
          href="https://docs.bnbchain.org/docs/learn/intro"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            className="h-10 px-5 text-sm rounded-md border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            BNB Chain
          </Button>
        </a>
      </div>
    </header>

    {/* Resources Grid */}
    <div className="grid gap-6 md:grid-cols-3">
      {[
        {
          icon: <Cpu size={18} />,
          title: "Ethereum Documentation",
          desc: "Core concepts, EVM internals, smart contracts and tooling for Ethereum developers.",
          link: "https://ethereum.org/en/developers/docs/",
        },
        {
          icon: <Terminal size={18} />,
          title: "Solidity by Example",
          desc: "Minimal, practical Solidity snippets covering real-world contract patterns.",
          link: "https://solidity-by-example.org/",
        },
        {
          icon: <Layers size={18} />,
          title: "BNB Chain Learn",
          desc: "Deploy, test and scale dApps on BSC with official chain documentation.",
          link: "https://docs.bnbchain.org/docs/learn/intro",
        },
      ].map((item, idx) => (
        <a
          key={idx}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-lg border border-slate-800 bg-[#0f131b] p-6 transition hover:border-blue-500/40"
        >
          <div className="flex items-center justify-center mb-4 text-blue-400 rounded-md h-9 w-9 bg-slate-800">
            {item.icon}
          </div>

          <h4 className="flex items-center justify-between mb-2 text-sm font-semibold text-slate-100">
            {item.title}
            <ExternalLink
              size={14}
              className="transition-opacity opacity-0 group-hover:opacity-100"
            />
          </h4>

          <p className="text-xs leading-relaxed text-slate-400">
            {item.desc}
          </p>

          <div className="mt-4 text-xs font-medium text-blue-400">
            Open documentation →
          </div>
        </a>
      ))}
    </div>

  </section>
</ScrollReveal>


          <AdBanner className="mt-20" />
      </div>
    </div>
  );
};

export default Academy;
