'use client';

import React from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { AdBanner } from '../components/AdBanner';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe2, Users, GraduationCap, ArrowRight, Target, Sparkles, Heart } from 'lucide-react';
import { Button } from '../components/Button';
import Link from 'next/link';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0a0a0a] selection:bg-coinlect-accent selection:text-black font-sans">
      
      {/* HERO SECTION - Split Layout inspired by modern NGO/Edu sites */}
      <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-coinlect-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="container relative z-10 px-6 mx-auto">
            <div className="flex flex-col items-center gap-16 lg:flex-row">
                <div className="lg:w-1/2">
                    <ScrollReveal>
                        <h1 className="mb-8 text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
                            {t.aboutPage.title}
                        </h1>
                        <div className="w-24 h-1.5 bg-coinlect-accent mb-8"></div>
                        <p className="mb-10 text-xl font-light leading-relaxed text-gray-300 md:text-2xl">
                            {t.aboutPage.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/register">
                                <Button className="px-8 py-4 text-base">Rejoindre la communauté</Button>
                            </Link>
                            <Link href="/academy">
                                <Button variant="secondary" className="px-8 py-4 text-base">Explorer nos cours</Button>
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
                <div className="relative lg:w-1/2">
                    <ScrollReveal delay={200}>
                        <div className="relative overflow-hidden border shadow-2xl rounded-2xl border-white/10">
                            <div className="absolute inset-0 z-10 bg-gradient-to-tr from-coinlect-accent/20 to-transparent mix-blend-overlay"></div>
                             {/* Image representing community/education in Africa context */}
                            <img 
                                src="https://images.unsplash.com/photo-1529390003868-6c01d73923f0?q=80&w=2574&auto=format&fit=crop" 
                                alt="Community Learning" 
                                className="object-cover w-full h-auto transition-transform duration-1000 transform hover:scale-105"
                            />
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-[#111] p-6 rounded-xl border border-white/10 shadow-xl z-20 hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 font-bold text-black rounded-full bg-coinlect-accent">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-xs tracking-wider text-gray-500 uppercase">Communauté</p>
                                    <p className="text-xl font-bold text-white">15,000+ Membres</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
      </div>

      {/* MISSION & VISION - Alternating Layout */}
      <section className="relative py-24">
          <div className="container px-6 mx-auto">
              
              {/* Vision Block */}
              <div className="flex flex-col items-center gap-12 mb-24 md:flex-row">
                  <div className="order-2 md:w-1/2 md:order-1">
                      <ScrollReveal>
                         <div className="relative max-w-md mx-auto aspect-square md:mr-auto">
                            <div className="absolute inset-0 border-2 border-white/5 rounded-full animate-[spin_30s_linear_infinite]"></div>
                            <div className="absolute inset-4 border border-coinlect-accent/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe2 size={120} className="text-gray-800" />
                            </div>
                            <img 
                                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2670&auto=format&fit=crop"
                                alt="Vision"
                                className="absolute inset-0 object-cover w-full h-full rounded-full opacity-60 mix-blend-screen"
                            />
                         </div>
                      </ScrollReveal>
                  </div>
                  <div className="order-1 md:w-1/2 md:order-2">
                      <ScrollReveal delay={200}>
                          <div className="flex items-center gap-3 mb-4 text-coinlect-accent">
                              <Target size={24} />
                              <span className="font-bold tracking-widest uppercase">Notre Vision</span>
                          </div>
                          <h2 className="mb-6 text-4xl font-bold leading-tight text-white">
                              {t.aboutPage.vision.title}
                          </h2>
                          <p className="text-lg leading-relaxed text-gray-400">
                              {t.aboutPage.vision.desc}
                          </p>
                      </ScrollReveal>
                  </div>
              </div>

              {/* Training/Education Block */}
              <div className="flex flex-col items-center gap-12 mb-24 md:flex-row">
                  <div className="md:w-1/2">
                      <ScrollReveal>
                          <div className="flex items-center gap-3 mb-4 text-blue-400">
                              <GraduationCap size={24} />
                              <span className="font-bold tracking-widest uppercase">Éducation</span>
                          </div>
                          <h2 className="mb-6 text-4xl font-bold leading-tight text-white">
                              {t.aboutPage.training.title}
                          </h2>
                          <p className="text-lg leading-relaxed text-gray-400">
                              {t.aboutPage.training.desc}
                          </p>
                      </ScrollReveal>
                  </div>
                  <div className="md:w-1/2">
                      <ScrollReveal delay={200}>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-[#161616] p-6 rounded-2xl border border-white/5 mt-8">
                                  <Sparkles className="mb-4 text-coinlect-accent" size={32} />
                                  <h3 className="mb-2 font-bold text-white">Accessible</h3>
                                  <p className="text-sm text-gray-500">Contenu gratuit et adapté à tous les niveaux.</p>
                              </div>
                              <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
                                  <Users className="mb-4 text-blue-400" size={32} />
                                  <h3 className="mb-2 font-bold text-white">Inclusif</h3>
                                  <p className="text-sm text-gray-500">Pour toute l&apos;Afrique francophone.</p>
                              </div>
                          </div>
                      </ScrollReveal>
                  </div>
              </div>

              {/* Community Block */}
              <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] rounded-3xl p-8 md:p-16 border border-white/5 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-coinlect-accent to-transparent opacity-30"></div>
                  <ScrollReveal>
                      <Heart size={48} className="mx-auto mb-6 text-red-500" />
                      <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">{t.aboutPage.community.title}</h2>
                      <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-400">
                          {t.aboutPage.community.desc}
                      </p>
                      <Link href="/community">
                          <Button className="px-8 py-3 text-black bg-white hover:bg-gray-200">Rejoindre le mouvement <ArrowRight size={16} /></Button>
                      </Link>
                  </ScrollReveal>
              </div>

          </div>
      </section>

      {/* VALUES GRID */}
      <section className="pb-24 pt-10 border-t border-white/5 bg-[#080808]">
          <div className="container px-6 mx-auto">
               <div className="mb-16 text-center">
                   <h2 className="mb-4 text-3xl font-bold text-white">Nos Valeurs Fondamentales</h2>
                   <div className="w-16 h-1 mx-auto bg-coinlect-accent"></div>
               </div>

               <div className="grid gap-8 md:grid-cols-4">
                   {[
                       { title: "Transparence", icon: <Globe2 />, desc: "Nous croyons en l'open source et la vérité on-chain." },
                       { title: "Autonomie", icon: <Target />, desc: "Donner à chacun les clés de sa liberté financière." },
                       { title: "Éducation", icon: <GraduationCap />, desc: "Le savoir est la première monnaie d'échange." },
                       { title: "Communauté", icon: <Users />, desc: "On va plus loin ensemble." }
                   ].map((item, idx) => (
                       <ScrollReveal key={idx} delay={idx * 50}>
                           <div className="p-6 text-center transition-colors cursor-default group rounded-xl hover:bg-white/5">
                               <div className="w-16 h-16 rounded-full bg-[#161616] border border-white/10 flex items-center justify-center mx-auto mb-6 text-gray-400 group-hover:text-coinlect-accent group-hover:border-coinlect-accent transition-all duration-300">
                                   {React.cloneElement(item.icon, { size: 28 })}
                               </div>
                               <h3 className="mb-3 text-xl font-bold text-white">{item.title}</h3>
                               <p className="text-sm text-gray-500">{item.desc}</p>
                           </div>
                       </ScrollReveal>
                   ))}
               </div>
          </div>
      </section>

      <div className="container px-6 pb-20 mx-auto">
          <AdBanner />
      </div>
    </div>
  );
};

export { AboutPage };
export default AboutPage;
