'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { COURSES_DATA } from '../mockData';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowLeft, Clock, Layers, Award, PlayCircle, CheckCircle, Lock, BookOpen, Circle, RefreshCw, X, FileText, HelpCircle, ArrowRight } from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const params = useParams();
  const courseId = params?.courseId as string;
  const course = COURSES_DATA.find(c => c.id === Number(courseId));
  
  // State for tracking completed modules (array of indices)
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modal State
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [learningStep, setLearningStep] = useState<'content' | 'quiz'>('content');
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizSuccess, setQuizSuccess] = useState(false);

  // Total modules count
  const totalModules = course?.syllabus ? course.syllabus.length : (course?.modules || 0);

  // Load progress from localStorage
  useEffect(() => {
    if (courseId) {
      const savedProgress = localStorage.getItem(`course_${courseId}_progress`);
      if (savedProgress) {
        setCompletedModules(JSON.parse(savedProgress));
      }
      setIsLoaded(true);
    }
  }, [courseId]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && courseId) {
      localStorage.setItem(`course_${courseId}_progress`, JSON.stringify(completedModules));
    }
  }, [completedModules, courseId, isLoaded]);

  const openModule = (index: number) => {
    // Reset module state
    setLearningStep('content');
    setSelectedQuizOption(null);
    setQuizError(null);
    setQuizSuccess(false);
    setActiveModuleIndex(index);
  };

  const closeModule = () => {
    setActiveModuleIndex(null);
  };

  const markModuleComplete = (index: number) => {
    if (!completedModules.includes(index)) {
      setCompletedModules(prev => [...prev, index]);
    }
  };

  const handleQuizSubmit = () => {
    if (activeModuleIndex === null || !course?.syllabus) return;
    
    const module = course.syllabus[activeModuleIndex];
    if (!module.quiz) {
       // If no quiz, auto complete
       markModuleComplete(activeModuleIndex);
       setQuizSuccess(true);
       return;
    }

    if (selectedQuizOption === null) {
      setQuizError("Veuillez sélectionner une réponse.");
      return;
    }

    if (selectedQuizOption === module.quiz.correctAnswer) {
      setQuizSuccess(true);
      setQuizError(null);
      markModuleComplete(activeModuleIndex);
    } else {
      setQuizError("Mauvaise réponse. Réessayez !");
      setQuizSuccess(false);
    }
  };

  const resetProgress = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser votre progression pour ce cours ?")) {
      setCompletedModules([]);
    }
  };

  const progressPercentage = Math.round((completedModules.length / totalModules) * 100) || 0;
  const isCourseComplete = progressPercentage === 100;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center px-6">
        <h1 className="text-2xl font-bold text-white">Course Not Found</h1>
        <Link href="/academy">
          <Button variant="secondary" withArrow>Back to Academy</Button>
        </Link>
      </div>
    );
  }

  const activeModule = activeModuleIndex !== null && course.syllabus ? course.syllabus[activeModuleIndex] : null;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0a0a0a]">
      
      {/* LEARNING MODAL */}
      {activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#161616]">
               <div className="flex flex-col">
                  <span className="text-xs text-coinlect-accent uppercase font-bold tracking-wider mb-1">Module {activeModuleIndex! + 1}</span>
                  <h3 className="text-xl font-bold text-white">{activeModule.title}</h3>
               </div>
               <button onClick={closeModule} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                 <X size={24} className="text-gray-400 hover:text-white" />
               </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
               {/* STEP 1: READING / VIDEO */}
               {learningStep === 'content' && (
                 <div className="animate-in slide-in-from-right-10 duration-300">
                    <div className="aspect-video bg-black rounded-xl border border-white/10 flex items-center justify-center mb-8 relative group cursor-pointer overflow-hidden">
                        <img src={course.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Video thumbnail" />
                        <div className="w-16 h-16 rounded-full bg-coinlect-accent flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform">
                             <PlayCircle size={32} className="text-black ml-1" />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded text-xs text-white">Simulation: {activeModule.duration}</div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <h4 className="flex items-center gap-2 text-white text-lg font-bold mb-4">
                           <FileText size={20} className="text-coinlect-accent" /> Transcript / Lecture
                        </h4>
                        <div className="text-gray-300 leading-relaxed space-y-4">
                           {activeModule.content ? (
                             <p>{activeModule.content}</p>
                           ) : (
                             <p>
                               Contenu de démonstration. Dans une application réelle, ce texte expliquerait en détail le concept de "{activeModule.title}". 
                               Il est nécessaire de lire ce contenu ou de regarder la vidéo ci-dessus avant de pouvoir passer le quiz et valider ce module.
                             </p>
                           )}
                        </div>
                    </div>

                    <div className="mt-12 flex justify-end">
                       <Button onClick={() => setLearningStep('quiz')} withArrow>
                          Passer au Quiz
                       </Button>
                    </div>
                 </div>
               )}

               {/* STEP 2: QUIZ */}
               {learningStep === 'quiz' && (
                 <div className="animate-in slide-in-from-right-10 duration-300 max-w-2xl mx-auto">
                    {!quizSuccess ? (
                        <>
                            <div className="text-center mb-10">
                                <div className="w-16 h-16 rounded-full bg-coinlect-accent/10 flex items-center justify-center mx-auto mb-4 text-coinlect-accent">
                                    <HelpCircle size={32} />
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-2">Testez vos connaissances</h4>
                                <p className="text-gray-400">Répondez correctement pour valider ce module.</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 mb-8">
                                <h5 className="text-lg font-semibold text-white mb-6">
                                    {activeModule.quiz?.question || "Question de démonstration pour ce module ?"}
                                </h5>
                                
                                <div className="space-y-3">
                                    {(activeModule.quiz?.options || ["Option A", "Option B", "Correct Option", "Option D"]).map((option, idx) => (
                                        <label 
                                            key={idx}
                                            className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                                selectedQuizOption === idx 
                                                    ? 'bg-coinlect-accent/10 border-coinlect-accent text-white' 
                                                    : 'bg-black/20 border-white/5 hover:bg-white/5 text-gray-300'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="quiz" 
                                                value={idx} 
                                                checked={selectedQuizOption === idx}
                                                onChange={() => setSelectedQuizOption(idx)}
                                                className="hidden" 
                                            />
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                selectedQuizOption === idx ? 'border-coinlect-accent' : 'border-gray-500'
                                            }`}>
                                                {selectedQuizOption === idx && <div className="w-2.5 h-2.5 rounded-full bg-coinlect-accent"></div>}
                                            </div>
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {quizError && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center mb-6 animate-pulse">
                                    {quizError}
                                </div>
                            )}

                            <div className="flex gap-4 justify-center">
                                <button 
                                    onClick={() => setLearningStep('content')}
                                    className="px-6 py-3 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    Relire le cours
                                </button>
                                <Button onClick={handleQuizSubmit} className="px-8">
                                    Valider
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in duration-300">
                             <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 text-green-500">
                                    <CheckCircle size={40} />
                             </div>
                             <h4 className="text-3xl font-bold text-white mb-4">Bravo !</h4>
                             <p className="text-gray-400 mb-8">Vous avez validé le module <span className="text-white font-bold">"{activeModule.title}"</span>.</p>
                             
                             <div className="flex justify-center gap-4">
                                <Button onClick={closeModule} variant="outline">Fermer</Button>
                                {activeModuleIndex! < (course.syllabus?.length || 0) - 1 && (
                                    <Button onClick={() => openModule(activeModuleIndex! + 1)} withArrow>Module Suivant</Button>
                                )}
                             </div>
                        </div>
                    )}
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Course Header */}
      <div className="bg-[#111] border-b border-white/5 pb-16 pt-8 relative overflow-hidden">
        {/* Confetti/Success Effect Background if complete */}
        {isCourseComplete && (
           <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-500 rounded-full animate-bounce delay-100"></div>
              <div className="absolute top-10 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-300"></div>
              <div className="absolute bottom-1/2 left-1/2 w-2 h-2 bg-green-500 rounded-full animate-bounce delay-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
           </div>
        )}

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-between items-start">
            <Link href="/academy" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm">
                <ArrowLeft size={16} /> Retour à l'Académie
            </Link>
            {completedModules.length > 0 && (
                <button 
                    onClick={resetProgress}
                    className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                    <RefreshCw size={12} /> Réinitialiser
                </button>
            )}
          </div>
          
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-coinlect-accent/10 text-coinlect-accent border border-coinlect-accent/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
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
                
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {course.title}
                </h1>
                
                {/* Progress Bar Section */}
                <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-white">Votre Progression</span>
                        <span className={`text-xl font-bold ${isCourseComplete ? 'text-green-400' : 'text-coinlect-accent'}`}>
                            {progressPercentage}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-black rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ease-out ${isCourseComplete ? 'bg-green-500' : 'bg-gradient-to-r from-coinlect-accent to-yellow-600'}`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    {isCourseComplete && (
                        <div className="mt-3 flex items-center gap-2 text-green-400 text-sm font-medium animate-pulse">
                            <CheckCircle size={16} /> Cours terminé ! Félicitations.
                        </div>
                    )}
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-coinlect-accent" />
                    <span>{course.duration} de contenu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-coinlect-accent" />
                    <span>{course.modules} Modules</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="px-8 py-3 text-base" onClick={() => openModule(0)}>
                      {progressPercentage > 0 ? 'Reprendre' : 'Commencer le cours'}
                  </Button>
                </div>
              </div>

              {/* Video Preview / Hero Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer" onClick={() => openModule(0)}>
                <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
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

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <ScrollReveal>
              <section>
                <h3 className="text-2xl font-bold text-white mb-6">À propos de ce cours</h3>
                <div className="text-gray-400 space-y-4 leading-relaxed">
                  <p>
                    Ce cours a été conçu pour vous fournir une compréhension approfondie du sujet. 
                    Que vous soyez débutant ou que vous cherchiez à affiner vos compétences, 
                    notre approche structurée vous guidera à travers les concepts clés avec des exemples pratiques.
                  </p>
                  <p>
                    {course.description} À la fin de ce parcours, vous serez capable de comprendre les mécanismes sous-jacents, 
                    d'analyser les tendances du marché et de prendre des décisions éclairées basées sur des données réelles.
                  </p>
                </div>
              </section>
            </ScrollReveal>

            {/* Syllabus */}
            <ScrollReveal delay={100}>
              <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-coinlect-accent" /> Programme du cours
                    </h3>
                    <span className="text-sm text-gray-500">{completedModules.length}/{totalModules} terminés</span>
                </div>
                
                <div className="space-y-4">
                  {course.syllabus ? (
                    course.syllabus.map((item, index) => {
                      const isCompleted = completedModules.includes(index);
                      
                      return (
                        <div 
                            key={index} 
                            onClick={() => openModule(index)}
                            className={`border rounded-xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer group ${
                                isCompleted 
                                    ? 'bg-green-500/5 border-green-500/20' 
                                    : 'bg-[#161616] border-white/5 hover:border-coinlect-accent/30 hover:bg-[#1a1a1a]'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                    isCompleted 
                                        ? 'bg-green-500 text-black' 
                                        : 'bg-white/5 text-gray-500 group-hover:bg-coinlect-accent group-hover:text-black'
                                }`}>
                                    {isCompleted ? <CheckCircle size={16} /> : index + 1}
                                </div>
                                <div>
                                    <h4 className={`font-bold transition-colors ${isCompleted ? 'text-green-400' : 'text-gray-200 group-hover:text-white'}`}>
                                        {item.title}
                                    </h4>
                                    <span className="text-xs text-gray-500">Vidéo + Quiz • {item.duration}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-medium px-2 py-1 rounded border ${
                                    isCompleted 
                                        ? 'border-green-500/30 text-green-500' 
                                        : 'border-white/10 text-gray-500 group-hover:text-white group-hover:border-white/30'
                                }`}>
                                    {isCompleted ? 'Terminé' : 'Commencer'}
                                </span>
                                {isCompleted ? (
                                    <CheckCircle size={20} className="text-green-500" />
                                ) : (
                                    <PlayCircle size={20} className="text-gray-600 group-hover:text-coinlect-accent" />
                                )}
                            </div>
                        </div>
                      );
                    })
                  ) : (
                    // Fallback structure
                    Array.from({ length: course.modules }).map((_, i) => {
                        const isCompleted = completedModules.includes(i);
                        return (
                            <div 
                                key={i} 
                                onClick={() => openModule(i)}
                                className={`border rounded-xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer group ${
                                    isCompleted ? 'bg-green-500/5 border-green-500/20' : 'bg-[#161616] border-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isCompleted ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-500'
                                }`}>
                                    {isCompleted ? <CheckCircle size={16} /> : i + 1}
                                </div>
                                <div>
                                    <h4 className={`font-bold ${isCompleted ? 'text-green-400' : 'text-gray-200'}`}>
                                        Module {i + 1} : Concepts Fondamentaux
                                    </h4>
                                    <span className="text-xs text-gray-500">Vidéo • 15m</span>
                                </div>
                                </div>
                                {isCompleted ? <CheckCircle size={20} className="text-green-500" /> : <Lock size={20} className="text-gray-600" />}
                            </div>
                        )
                    })
                  )}
                </div>
              </section>
            </ScrollReveal>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              <div className="glass-card p-6 rounded-2xl border border-white/10">
                 <h4 className="font-bold text-white mb-4">Ce que vous apprendrez</h4>
                 <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle size={16} className={`mt-0.5 flex-shrink-0 ${isCourseComplete ? 'text-green-500' : 'text-coinlect-accent'}`} />
                      Compréhension complète des bases
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle size={16} className={`mt-0.5 flex-shrink-0 ${isCourseComplete ? 'text-green-500' : 'text-coinlect-accent'}`} />
                      Analyses techniques et fondamentales
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle size={16} className={`mt-0.5 flex-shrink-0 ${isCourseComplete ? 'text-green-500' : 'text-coinlect-accent'}`} />
                      Gestion des risques et sécurité
                    </li>
                    <li className="flex items-start gap-3 text-sm text-gray-400">
                      <CheckCircle size={16} className={`mt-0.5 flex-shrink-0 ${isCourseComplete ? 'text-green-500' : 'text-coinlect-accent'}`} />
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
