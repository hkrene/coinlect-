'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { COURSES_DATA } from '../mockData';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowLeft, Clock, Layers, PlayCircle, CheckCircle } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const params = useParams();
  const courseId = params?.courseId as string;
  const course = COURSES_DATA.find(c => c.id === Number(courseId));

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold text-white">Course Not Found</h1>
        <Link href="/academy">
          <Button variant="secondary" withArrow>Back to Academy</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a]">

      {/* Course Header */}
      <div className="bg-[#111] border-b border-white/5 pb-16 pt-8 relative overflow-hidden">
        <div className="container relative z-10 px-6 mx-auto">
          <div className="flex items-start justify-between">
            <Link href="/academy" className="inline-flex items-center gap-2 mb-8 text-sm text-gray-500 transition-colors hover:text-white">
                <ArrowLeft size={16} /> Retour à l&apos;Académie
            </Link>
          </div>
          
          <ScrollReveal>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase border rounded bg-coinlect-accent/10 text-coinlect-accent border-coinlect-accent/20">
                    {course.category}
                  </span>
                  <span className={`px-3 py-1 rounded text-xs font-bold border ${
                      course.level === 'Débutant' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      course.level === 'Intermédiaire' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                      'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {course.level}
                  </span>
                </div>
                
                <h1 className="mb-6 text-3xl font-bold leading-tight text-white md:text-5xl">
                  {course.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-coinlect-accent" />
                    <span>{course.duration} de contenu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-coinlect-accent" />
                    <span>{course.modules} Modules</span>
                  </div>
                </div>

              </div>

              {/* Video Preview / Hero Image */}
              <div className="relative overflow-hidden border shadow-2xl aspect-video rounded-2xl border-white/10 group">
                <img src={course.image} alt={course.title} className="object-cover w-full h-full transition-transform duration-700 opacity-80 group-hover:scale-105" />
                <div className="absolute inset-0 transition-colors bg-black/40 group-hover:bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-coinlect-accent text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] transform group-hover:scale-110 transition-transform duration-300">
                    <PlayCircle size={40} fill="currentColor" className="text-black" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur px-3 py-1.5 rounded text-xs font-bold text-white">
                  Aperçu Gratuit
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="container px-6 py-16 mx-auto">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Main Content Area */}
          <div className="space-y-12 lg:col-span-2">
            
            {/* About Section */}
            <ScrollReveal>
              <section>
                <h3 className="mb-6 text-2xl font-bold text-white">À propos de ce cours</h3>
                <div className="space-y-4 leading-relaxed text-gray-400">
                  <p>
                    Ce cours a été conçu pour vous fournir une compréhension approfondie du sujet. 
                    Que vous soyez débutant ou que vous cherchiez à affiner vos compétences, 
                    notre approche structurée vous guidera à travers les concepts clés avec des exemples pratiques.
                  </p>
                  <p>
                    {course.description} À la fin de ce parcours, vous serez capable de comprendre les mécanismes sous-jacents, 
                    d&apos;analyser les tendances du marché et de prendre des décisions éclairées basées sur des données réelles.
                  </p>
                </div>
              </section>
            </ScrollReveal>


          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky space-y-6 top-28">
              
              <div className="p-6 border bg-[#0F0F0F] rounded-2xl border-white/10">
                 <h4 className="mb-4 font-bold text-white">Ce que vous apprendrez</h4>
                 <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-coinlect-accent" />
                      Compréhension complète des bases
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-coinlect-accent" />
                      Analyses techniques et fondamentales
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-coinlect-accent" />
                      Gestion des risques et sécurité
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-coinlect-accent" />
                      Utilisation des outils Web3
                    </li>
                 </ul>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
