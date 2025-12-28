'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { courseService } from '../services/db';
import { Course } from '../types';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowLeft, PlayCircle } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const params = useParams();
  const courseSlug = params?.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courses = await courseService.getAll();
        const foundCourse = courses.find(c => c.slug === courseSlug);
        setCourse(foundCourse || null);
      } catch (error) {
        console.error('Error fetching course:', error);
        setCourse(null);
      }
    };

    if (courseSlug) {
      fetchCourse();
    }
  }, [courseSlug]);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold tracking-tighter text-white uppercase">Cours non trouvé</h1>
        <Link href="/academy">
          <Button variant="secondary" className="rounded-none" withArrow>Retour à l&apos;Académie</Button>
        </Link>
      </div>
    );
  }

  // Helper function to extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/').split('&')[0];
    }
    if (url.includes('youtu.be/')) {
      return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
    }
    return url;
  };

  // Helper function to extract video ID from Vimeo URL
  const getVimeoEmbedUrl = (url: string): string => {
    const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : url;
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">

      {/* Course Header */}
      <div className="bg-[#111] border-b border-white/5 pb-16 pt-8 relative overflow-hidden">
        <div className="container relative z-10 px-6 mx-auto">
          <div className="flex items-start justify-between">
            <Link href="/academy" className="inline-flex items-center gap-2 mb-8 text-[11px] font-black uppercase tracking-widest text-gray-500 transition-colors hover:text-white">
                <ArrowLeft size={14} /> Retour à l&apos;Académie
            </Link>
          </div>
          
          <ScrollReveal>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase border rounded-none bg-coinlect-accent/10 text-coinlect-accent border-coinlect-accent/20">
                    {course.category}
                  </span>
                  <span className={`px-3 py-1 rounded-none text-[10px] font-black tracking-widest uppercase border ${
                      course.level === 'Débutant' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      course.level === 'Intermédiaire' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                      'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {course.level}
                  </span>
                </div>
                
                <h1 className="mb-6 text-3xl font-black leading-tight tracking-tighter text-left text-white md:text-6xl">
                  {course.title}
                </h1>
              </div>

              {/* Video Preview - Style Squared */}
              <div className="relative overflow-hidden bg-black border rounded-none shadow-2xl aspect-video border-white/10">
                {course.videoLink ? (
                  <div className="relative w-full h-full">
                    {course.videoLink.includes('youtube.com') || course.videoLink.includes('youtu.be') ? (
                      <iframe
                        src={getYouTubeEmbedUrl(course.videoLink)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={course.title}
                      />
                    ) : course.videoLink.includes('vimeo.com') ? (
                      <iframe
                        src={getVimeoEmbedUrl(course.videoLink)}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={course.title}
                      />
                    ) : (
                      <video
                        src={course.videoLink}
                        controls
                        className="w-full h-full"
                        poster={course.image}
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <img src={course.image} alt={course.title} className="object-cover w-full h-full transition-transform duration-700 opacity-60 group-hover:scale-105" />
                    <div className="absolute inset-0 transition-colors bg-black/20 group-hover:bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-none bg-coinlect-accent text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] transform group-hover:scale-110 transition-transform duration-300">
                        <PlayCircle size={40} fill="currentColor" className="text-black" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Content Area - Aligné à gauche avec le reste du layout */}
      <div className="container px-6 py-16 mx-auto">
        <div className="max-w-3xl"> {/* Limite la largeur du texte pour la lisibilité mais reste à gauche */}
          <ScrollReveal>
            <section>
              <h3 className="pl-4 mb-8 text-xl font-black tracking-widest text-left text-white uppercase border-l-2 border-coinlect-accent">
                À propos de ce cours
              </h3>
              <div className="space-y-6 text-lg font-light leading-relaxed text-left text-gray-400">
                {course.about ? (
                  <div className="whitespace-pre-line">{course.about}</div>
                ) : (
                  <>
                    <p>
                      Ce cours a été conçu pour vous fournir une compréhension approfondie du sujet. 
                      Que vous soyez débutant ou que vous cherchiez à affiner vos compétences, 
                      notre approche structurée vous guidera à travers les concepts clés avec des exemples pratiques.
                    </p>
                    <p>
                      {course.description}
                    </p>
                  </>
                )}
              </div>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default CourseDetail;