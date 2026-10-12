'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Course } from '../types';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowLeft, VideoOff } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const params = useParams();
  const courseSlug = params?.courseSlug as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Helper functions for video detection
  const getYouTubeVideoId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
  };

  const getVimeoVideoId = (url: string): string => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setVideoError(false); // Reset video error state
        const response = await fetch(`/api/courses/${courseSlug}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data.course);
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug) {
      fetchCourse();
    } else {
      setLoading(false);
    }
  }, [courseSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center bg-black">
        <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
        <p className="text-white">Chargement du cours...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center bg-black">
        <h1 className="text-2xl font-bold tracking-tighter text-white uppercase">Cours non trouvé</h1>
        <Link href="/academy">
          <Button variant="secondary" className="rounded-none" withArrow>Retour à l&apos;Académie</Button>
        </Link>
      </div>
    );
  }

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
            <div className="flex flex-col gap-8 lg:gap-10">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 mb-6">
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
                  {course.partnerName && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-black tracking-widest uppercase border rounded-none bg-white/5 text-gray-200 border-white/10">
                      {course.partnerLogo && (
                        <img
                          src={course.partnerLogo}
                          alt={course.partnerName}
                          className="object-contain w-5 h-5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      )}
                      {course.partnerName}
                    </span>
                  )}
                </div>
                
                <h1 className="mb-6 text-3xl font-black leading-tight tracking-tighter text-left text-white sm:text-4xl md:text-5xl ">
                  {course.title}
                </h1>
              </div>

              {/* Video Preview - Direct from Database */}
              <div className="relative w-full overflow-hidden bg-black border rounded-none shadow-2xl aspect-video border-white/10">
                {course.videoLink && course.videoLink.trim() !== '' && !videoError ? (
                  <>
                    {/* YouTube Video */}
                    {getYouTubeVideoId(course.videoLink) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(course.videoLink)}`}
                        title={`${course.title} - YouTube Video`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onError={() => setVideoError(true)}
                      />
                    ) : getVimeoVideoId(course.videoLink) ? (
                      /* Vimeo Video */
                      <iframe
                        src={`https://player.vimeo.com/video/${getVimeoVideoId(course.videoLink)}`}
                        title={`${course.title} - Vimeo Video`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        onError={() => setVideoError(true)}
                      />
                    ) : (
                      /* Direct Video File */
                      <video
                        src={course.videoLink}
                        controls
                        playsInline
                        className="object-cover w-full h-full"
                        poster={course.image}
                        onError={() => setVideoError(true)}
                      />
                    )}
                  </>
                ) : (
                  /* Fallback when no video or video failed to load */
                  <div className="flex flex-col items-center justify-center w-full h-full gap-4 bg-neutral-900">
                    <VideoOff size={48} className="text-white/10" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                      {course.videoLink ? 'Vidéo non disponible' : 'Aucun aperçu disponible'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container px-6 py-16 mx-auto">
        <div className="max-w-3xl">
          <ScrollReveal>
            <section>
              <h3 className="pl-4 mb-8 text-xl font-black tracking-widest text-left text-white uppercase border-l-2 border-coinlect-accent">
                À propos de ce cours
              </h3>
              <div className="space-y-6 text-xs font-light leading-relaxed text-left text-gray-400 md:text-xl">
                {course.about ? (
                  <div className="text-sm whitespace-pre-line">{course.about}</div>
                ) : (
                  <>
                    <p>{course.description}</p>
                    <p className="text-sm font-bold tracking-widest text-red-600 uppercase md:text-2xl">Not financial advice</p>
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
export default CourseDetail;