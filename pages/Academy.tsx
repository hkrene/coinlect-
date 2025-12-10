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
    const tabParam = searchParams.get('tab');
    if (tabParam === 'articles') {
        setActiveTab('articles');
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
    return (
        <ScrollReveal delay={delay}>
            <Link href={`/academy/${course.id}`} className="block h-full group">
                <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 group-hover:border-coinlect-accent/30 transition-all duration-300 h-full flex flex-col relative">
                    <div className="relative aspect-video">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
                    
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-coinlect-accent text-[10px] font-bold uppercase tracking-widest">{course.category}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{course.duration}</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 leading-tight group-hover:text-coinlect-accent transition-colors">
                            {course.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                            {course.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                <BookOpen size={14} className="text-coinlect-accent" />
                                {course.modules} Modules
                            </div>
                            <span className="text-white group-hover:translate-x-1 transition-transform"><ArrowRight size={18} /></span>
                        </div>
                    </div>
                    
                    {progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                            <div className="h-full bg-coinlect-accent" style={{ width: `${progress}%` }}></div>
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
                    <div className="relative aspect-video overflow-hidden">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                        <div className="absolute bottom-3 left-3">
                            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase border border-white/10">
                                {article.category}
                            </span>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <span>{article.date}</span>
                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                            <span>{article.readTime} read</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 leading-tight group-hover:text-coinlect-accent transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {article.excerpt}
                        </p>
                        <div className="mt-auto flex items-center gap-3">
                            <img src={article.authorImage} alt={article.author} className="w-6 h-6 rounded-full border border-white/10" />
                            <span className="text-xs text-gray-300 font-medium">{article.author}</span>
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
      <div className="relative py-20 border-b border-white/5 mb-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-coinlect-accent/10 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        {t.academy.title} <span className="text-coinlect-accent">{t.academy.titleSuffix}</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
                        {t.academy.subtitle}
                    </p>
                    
                    {/* Search bar */}
                    <div className="relative max-w-xl group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-coinlect-accent to-yellow-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-black rounded-lg p-2 border border-white/10">
                            <Search className="ml-3 text-gray-500" size={20} />
                            <input 
                                type="text" 
                                placeholder={t.academy.searchPlaceholder} 
                                className="w-full bg-transparent text-white pl-3 pr-4 py-2 focus:outline-none placeholder-gray-600"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </ScrollReveal>
        </div>
      </div>

      <div className="container mx-auto px-6">
          
          {/* Main Tabs */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
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
                  <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {getFilteredCourses().length > 0 ? (
                          getFilteredCourses().map((c, i) => (
                              <CourseCard key={c.id} course={c} delay={i * 100} />
                          ))
                      ) : (
                          <div className="col-span-full py-20 text-center text-gray-500">Aucun cours trouvé.</div>
                      )}
                  </div>
              ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {getFilteredArticles().length > 0 ? (
                          getFilteredArticles().map((a, i) => (
                              <ArticleCard key={a.id} article={a} delay={i * 100} />
                          ))
                      ) : (
                          <div className="col-span-full py-20 text-center text-gray-500">Aucun article trouvé.</div>
                      )}
                  </div>
              )}
          </div>

          {/* Developer Space Section - Restyled to Blue Theme */}
          <ScrollReveal className="mt-32">
              <div className="glass-card bg-[#0a0f1d] p-10 md:p-16 rounded-3xl border border-blue-500/20 relative overflow-hidden group">
                  {/* Glowing Blue Background Elements */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                  <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] bg-blue-400/10 rounded-full blur-[60px] pointer-events-none"></div>
                  
                  <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                          <div>
                              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-widest mb-4">
                                  <Code size={18} /> {t.academy.devSpace}
                              </div>
                              <h2 className="text-3xl md:text-5xl font-bold text-white max-w-xl leading-tight">
                                  {t.academy.buildFuture} <span className="text-blue-400">Web3</span>
                              </h2>
                          </div>
                          <div className="flex gap-4">
                              <a href="https://ethereum.org/en/developers/docs/" target="_blank" rel="noopener noreferrer">
                                <Button className="bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]">Ethereum Docs</Button>
                              </a>
                              <a href="https://docs.bnbchain.org/docs/learn/intro" target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">BSC Docs</Button>
                              </a>
                          </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                          {[
                            { 
                                icon: <Cpu />, 
                                title: "Ethereum Docs", 
                                desc: "La documentation la plus complète pour débuter. Apprenez les bases d'Ethereum, d'EVM et de Web3.js.",
                                link: "https://ethereum.org/en/developers/docs/" 
                            },
                            { 
                                icon: <Terminal />, 
                                title: "Solidity par l'Exemple", 
                                desc: "Apprenez le langage Solidity avec des extraits de code concrets et faciles à comprendre.",
                                link: "https://solidity-by-example.org/" 
                            },
                            { 
                                icon: <Layers />, 
                                title: "BNB Chain Learn", 
                                desc: "Découvrez comment déployer vos premières applications sur BSC, l'une des chaînes les plus populaires.",
                                link: "https://docs.bnbchain.org/docs/learn/intro" 
                            }
                          ].map((item, idx) => (
                              <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                key={idx} 
                                className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300 group/card"
                              >
                                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover/card:scale-110 transition-transform">
                                      {item.icon}
                                  </div>
                                  <h4 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                                      {item.title}
                                      <ExternalLink size={14} className="opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                  </h4>
                                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{item.desc}</p>
                                  <span className="text-blue-400 text-xs font-bold uppercase tracking-wider group-hover/card:underline">Commencer</span>
                              </a>
                          ))}
                      </div>
                  </div>
              </div>
          </ScrollReveal>

          <AdBanner className="mt-20" />
      </div>
    </div>
  );
};
