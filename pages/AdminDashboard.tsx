'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { userService, courseService, articleService, eventService } from '../services/db';
import { User, Course, Article, Event } from '../types';
import { Button } from '../components/Button';
import { Trash2, Plus, Users, BookOpen, FileText, LayoutDashboard, X, Check, Calendar, Star } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'articles' | 'events'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'course' | 'article' | 'event' | null>(null);

  // Complex Form State
  // Added courseType: 'academy' to satisfy missing property requirement in Omit<Course, 'id'>
  const [courseForm, setCourseForm] = useState<Omit<Course, 'id'>>({
    title: '',
    description: '',
    about: '',
    level: 'Débutant',
    duration: '35m',
    modules: 0,
    category: 'Blockchain',
    image: '',
    syllabus: [],
    learningObjectives: [],
    courseType: 'academy',
    videoLink: ''
  });

  const [articleForm, setArticleForm] = useState<Omit<Article, 'id' | 'content'> & { content: string }>({
    title: '',
    excerpt: '',
    content: '', // Stored as string in form, converted to array on save
    readTime: '5 min',
    date: new Date().toLocaleDateString('fr-FR'),
    image: '',
    category: 'News',
    author: user?.name || 'Admin',
    authorImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
    featured: false
  });

  const [eventForm, setEventForm] = useState<Omit<Event, 'id'>>({
    title: '',
    date: '',
    location: '',
    type: [],
    banner: 'custom',
    bannerImage: '',
    bannerText: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdmin) router.push('/');
    setUsers(userService.getAll());
    setCourses(courseService.getAll());
    setArticles(articleService.getAll());
    setEvents(eventService.getAll());
  }, [isAdmin, router, refreshTrigger]);

  const toggleUserRole = (id: string) => {
    userService.toggleRole(id);
    setRefreshTrigger(p => p + 1);
  };


  const handleAddObjective = () => {
    setCourseForm(prev => ({ ...prev, learningObjectives: [...prev.learningObjectives, ''] }));
  };

  const updateObjective = (index: number, value: string) => {
    const newObj = [...courseForm.learningObjectives];
    newObj[index] = value;
    setCourseForm(prev => ({ ...prev, learningObjectives: newObj }));
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    courseService.add({ ...courseForm, modules: courseForm.modules || 0 });
    setIsModalOpen(false);
    setRefreshTrigger(p => p + 1);
    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    }
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    // Split content by newlines to create array of paragraphs
    const contentArray = typeof articleForm.content === 'string' 
      ? articleForm.content.split('\n').filter(p => p.trim().length > 0)
      : articleForm.content;
    articleService.add({ ...articleForm, content: contentArray });
    setIsModalOpen(false);
    setRefreshTrigger(p => p + 1);
    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    }
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    eventService.add(eventForm);
    setIsModalOpen(false);
    setRefreshTrigger(p => p + 1);
    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    }
    setEventForm({
      title: '',
      date: '',
      location: '',
      type: [],
      banner: 'custom',
      bannerImage: '',
      bannerText: '',
      description: ''
    });
  };

  const toggleEventType = (type: string) => {
    const types = eventForm.type;
    if (types.includes(type)) {
      setEventForm({ ...eventForm, type: types.filter(t => t !== type) });
    } else {
      setEventForm({ ...eventForm, type: [...types, type] });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen pt-24 pb-20 text-white bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#111] hidden md:block fixed h-full top-20 pt-8 px-4 z-20">
        <div className="space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'overview' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Vue d&apos;ensemble
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'users' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <Users size={18} /> Utilisateurs
          </button>
          <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'courses' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <BookOpen size={18} /> Cours
          </button>
          <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'articles' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <FileText size={18} /> Articles
          </button>
          <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'events' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <Calendar size={18} /> Événements
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto md:ml-64">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[
                { label: 'Utilisateurs', val: users.length, icon: <Users />, color: 'text-blue-500' },
                { label: 'Cours', val: courses.length, icon: <BookOpen />, color: 'text-coinlect-accent' },
                { label: 'Articles', val: articles.length, icon: <FileText />, color: 'text-purple-500' },
                { label: 'Événements', val: events.length, icon: <Calendar />, color: 'text-green-500' }
              ].map((card, i) => (
                <div key={i} className="bg-[#111] p-6 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-sm text-gray-400">{card.label}</h3>
                    <p className="text-3xl font-bold">{card.val}</p>
                  </div>
                  <div className={`${card.color}`}>{card.icon}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in">
            <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            <div className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-400 uppercase bg-white/5">
                  <tr>
                    <th className="p-4">Nom</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="p-4 font-medium text-white">{u.firstName} {u.lastName}</td>
                      <td className="p-4 text-gray-400">{u.email}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleUserRole(u.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}
                        >
                          {u.role}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => {userService.delete(u.id); setRefreshTrigger(t => t+1)}} className="text-red-500 transition-colors hover:text-red-400" aria-label="Delete user"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Catalogue des Cours</h1>
              <Button onClick={() => { setModalType('course'); setIsModalOpen(true); }}><Plus size={16} /> Créer un Cours</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {courses.map(c => (
                <div key={c.id} className="bg-[#111] p-4 rounded-xl border border-white/10 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <img src={c.image} className="object-cover w-20 h-12 rounded shadow" alt="" />
                    <div>
                      <h4 className="font-bold text-white transition-colors group-hover:text-coinlect-accent">{c.title}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{c.category} • {c.level} • {c.modules} Mod.</p>
                    </div>
                  </div>
                  <button onClick={() => { courseService.delete(c.id); setRefreshTrigger(t => t+1); }} className="p-2 text-red-500 hover:text-red-400" aria-label="Delete course"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Articles du Blog</h1>
                <p className="mt-2 text-sm text-gray-400">Minimum 3 articles doivent être en vedette pour la page d'accueil</p>
              </div>
              <Button onClick={() => { setModalType('article'); setIsModalOpen(true); }}><Plus size={16} /> Publier un Article</Button>
            </div>
            <div className="grid gap-4">
              {articles.map(a => (
                <div key={a.id} className="bg-[#111] p-4 rounded-xl border border-white/10 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={a.image} className="object-cover w-20 h-12 rounded shadow" alt="" />
                      {a.featured && <Star className="absolute -top-2 -left-2 text-coinlect-accent" size={16} fill="currentColor" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{a.title}</h4>
                      <p className="text-[10px] text-gray-500 uppercase">{a.category} • {a.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const updatedArticles = articleService.getAll();
                        const article = updatedArticles.find(art => art.id === a.id);
                        if (article) {
                          const newFeaturedStatus = !article.featured;
                          // Ensure at least 3 featured articles
                          const currentFeaturedCount = updatedArticles.filter(art => art.featured).length;
                          if (currentFeaturedCount < 3 && !newFeaturedStatus) {
                            alert('Vous devez avoir au moins 3 articles en vedette sur la page d\'accueil');
                            return;
                          }
                          articleService.update(a.id, { featured: newFeaturedStatus });
                          setRefreshTrigger(t => t+1);
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('contentUpdated'));
                          }
                        }
                      }} 
                      className={`p-2 transition-colors ${a.featured ? 'text-coinlect-accent hover:text-yellow-500' : 'text-gray-500 hover:text-coinlect-accent'}`}
                      aria-label={a.featured ? "Retirer de la page d'accueil" : "Mettre en vedette"}
                      title={a.featured ? "Retirer de la page d'accueil" : "Mettre en vedette"}
                    >
                      <Star size={18} fill={a.featured ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => { articleService.delete(a.id); setRefreshTrigger(t => t+1); }} className="p-2 text-red-500 transition-colors hover:text-red-400" aria-label="Delete article"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Gestion des Événements</h1>
              <Button onClick={() => { setModalType('event'); setIsModalOpen(true); }}><Plus size={16} /> Créer un Événement</Button>
            </div>
            <div className="grid gap-4">
              {events.map(e => (
                <div key={e.id} className="bg-[#111] p-4 rounded-xl border border-white/10 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-wrap gap-1">
                      {e.type.map((t, idx) => (
                        <span key={idx} className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase bg-white/5 rounded">{t}</span>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{e.title}</h4>
                      <p className="text-[10px] text-gray-500">{e.date} • {e.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { eventService.delete(e.id); setRefreshTrigger(t => t+1); }} className="p-2 text-red-500 transition-colors hover:text-red-400" aria-label="Delete event"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL SYSTEM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#161616]">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                {modalType === 'course' ? <><BookOpen className="text-coinlect-accent" /> Nouveau Cours Expert</> : 
                 modalType === 'article' ? <><FileText className="text-purple-500" /> Nouvel Article</> :
                 <><Calendar className="text-green-500" /> Nouvel Événement</>}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close modal"><X size={24} /></button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
              {modalType === 'course' ? (
                <form onSubmit={handleSaveCourse} className="space-y-10">
                  {/* Basic Meta */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-coinlect-accent">1. Informations Générales</h3>
                    <input 
                      required placeholder="Titre du cours" className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent"
                      onChange={e => setCourseForm({...courseForm, title: e.target.value})} 
                    />
                    <textarea 
                      required placeholder="Brève description pour la carte" className="w-full h-24 p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent"
                      onChange={e => setCourseForm({...courseForm, description: e.target.value})} 
                    />
                    <textarea 
                      placeholder="À propos de ce cours (contenu détaillé affiché sur la page du cours)" className="w-full h-32 p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent"
                      onChange={e => setCourseForm({...courseForm, about: e.target.value})} 
                    />
                    <div className="grid gap-4 md:grid-cols-3">
                       <select className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, level: e.target.value as any})} aria-label="Course level">
                         <option>Débutant</option><option>Intermédiaire</option><option>Avancé</option>
                       </select>
                       <input placeholder="Durée (ex: 35m)" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, duration: e.target.value})} />
                       <input type="number" placeholder="Nombre de modules" min="0" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, modules: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                       <input placeholder="Catégorie (DeFi, NFT...)" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, category: e.target.value})} />
                       <select className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, courseType: e.target.value as any})} aria-label="Course type">
                         <option value="academy">Academy</option>
                         <option value="specialization">Specialization</option>
                         <option value="university">University</option>
                       </select>
                    </div>
                    <input placeholder="URL de l'image de couverture" className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, image: e.target.value})} />
                    <input placeholder="Lien vidéo (YouTube/Vimeo/URL directe)" className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, videoLink: e.target.value || undefined})} />
                    <div className="grid gap-4 md:grid-cols-2">
                       <input placeholder="Nom du partenaire (optionnel)" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, partnerName: e.target.value || undefined})} />
                       <input placeholder="URL du logo partenaire (optionnel)" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setCourseForm({...courseForm, partnerLogo: e.target.value || undefined})} />
                    </div>
                    <label className="flex items-center gap-3 px-4 py-2 border cursor-pointer bg-white/5 rounded-xl border-white/10">
                      <input type="checkbox" checked={courseForm.isPaid || false} onChange={e => setCourseForm({...courseForm, isPaid: e.target.checked})} className="border-gray-600 rounded" />
                      <span className="text-xs font-bold">Cours payant</span>
                    </label>
                  </div>

                  {/* Learning Objectives */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold tracking-widest uppercase text-coinlect-accent">2. Objectifs d&apos;Apprentissage</h3>
                      <button type="button" onClick={handleAddObjective} className="flex items-center gap-1 text-xs font-bold text-coinlect-accent hover:underline"><Plus size={14}/> Ajouter un point</button>
                    </div>
                    <div className="space-y-2">
                       {courseForm.learningObjectives.map((obj, i) => (
                         <div key={i} className="flex gap-2">
                           <Check className="mt-3 text-green-500" size={16} />
                           <input placeholder="Ex: Comprendre le consensus PoW" className="flex-1 p-3 text-sm bg-black border rounded-lg outline-none border-white/5" value={obj} onChange={e => updateObjective(i, e.target.value)} />
                         </div>
                       ))}
                    </div>
                  </div>


                  <div className="flex gap-4 pt-10">
                    <Button type="button" variant="outline" className="w-1/2" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                    <Button type="submit" className="w-1/2 shadow-xl shadow-coinlect-accent/20">Publier le Cours</Button>
                  </div>
                </form>
              ) : modalType === 'article' ? (
                <form onSubmit={handleSaveArticle} className="space-y-6">
                   <div className="flex items-center justify-between mb-6">
                      <label className="flex items-center gap-3 px-4 py-2 border cursor-pointer bg-white/5 rounded-xl border-white/10">
                        <input type="checkbox" checked={articleForm.featured} onChange={e => setArticleForm({...articleForm, featured: e.target.checked})} className="border-gray-600 rounded" />
                        <span className="text-xs font-bold">Mettre en avant sur l&apos;accueil</span>
                      </label>
                   </div>
                   <input required placeholder="Titre de l'article" className="w-full p-4 text-xl font-bold text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent" onChange={e => setArticleForm({...articleForm, title: e.target.value})} />
                   <textarea placeholder="Extrait accrocheur" className="w-full h-20 p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setArticleForm({...articleForm, excerpt: e.target.value})} />
                   <div className="grid grid-cols-2 gap-4">
                     <input placeholder="Catégorie" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setArticleForm({...articleForm, category: e.target.value})} />
                     <input placeholder="Temps de lecture (ex: 5 min)" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setArticleForm({...articleForm, readTime: e.target.value})} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <input placeholder="URL Image" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => setArticleForm({...articleForm, image: e.target.value})} />
                     <input type="date" placeholder="Date" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" onChange={e => {
                       const date = new Date(e.target.value);
                       setArticleForm({...articleForm, date: date.toLocaleDateString('fr-FR')});
                     }} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <input placeholder="Auteur" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" value={articleForm.author} onChange={e => setArticleForm({...articleForm, author: e.target.value})} />
                     <input placeholder="URL Image auteur" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" value={articleForm.authorImage} onChange={e => setArticleForm({...articleForm, authorImage: e.target.value})} />
                   </div>
                   <textarea placeholder="Contenu complet (Séparez les paragraphes par une nouvelle ligne)" className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl h-60" onChange={e => setArticleForm({...articleForm, content: e.target.value})} />
                   <div className="flex gap-4 pt-4">
                     <Button type="button" variant="outline" className="w-1/2" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                     <Button type="submit" className="w-1/2">Publier l&apos;Article</Button>
                   </div>
                </form>
              ) : (
                <form onSubmit={handleSaveEvent} className="space-y-6">
                  <input 
                    required 
                    placeholder="Titre de l'événement" 
                    className="w-full p-4 text-xl font-bold text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent" 
                    value={eventForm.title}
                    onChange={e => setEventForm({...eventForm, title: e.target.value})} 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      required 
                      placeholder="Date (ex: Friday, November 7, 2025)" 
                      className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent" 
                      value={eventForm.date}
                      onChange={e => setEventForm({...eventForm, date: e.target.value})} 
                    />
                    <input 
                      required 
                      placeholder="Lieu" 
                      className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent" 
                      value={eventForm.location}
                      onChange={e => setEventForm({...eventForm, location: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-400">Type d'événement</label>
                    <div className="flex flex-wrap gap-2">
                      {['CONFERENCE', 'MEETUP', 'WEB3', 'WORKSHOP', 'HACKATHON', 'MIXER'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleEventType(type)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            eventForm.type.includes(type)
                              ? 'bg-coinlect-accent text-black'
                              : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-400">Image de bannière</label>
                    <input 
                      type="url"
                      placeholder="URL de l'image de bannière (ex: https://example.com/banner.jpg)" 
                      className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent" 
                      value={eventForm.bannerImage || ''}
                      onChange={e => setEventForm({...eventForm, bannerImage: e.target.value, banner: 'custom'})} 
                      required
                    />
                    {eventForm.bannerImage && (
                      <div className="relative w-full h-48 overflow-hidden border rounded-lg border-white/10">
                        <img 
                          src={eventForm.bannerImage} 
                          alt="Banner preview" 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <textarea 
                    placeholder="Texte de la bannière (optionnel, utilisez \\n pour les sauts de ligne)" 
                    className="w-full h-24 p-4 text-white bg-black border outline-none border-white/10 rounded-xl" 
                    value={eventForm.bannerText}
                    onChange={e => setEventForm({...eventForm, bannerText: e.target.value})} 
                    aria-label="Banner text"
                  />
                  <textarea 
                    placeholder="Description (optionnel)" 
                    className="w-full h-32 p-4 text-white bg-black border outline-none border-white/10 rounded-xl" 
                    value={eventForm.description}
                    onChange={e => setEventForm({...eventForm, description: e.target.value})} 
                    aria-label="Event description"
                  />
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                    <Button type="submit" className="w-1/2">Créer l&apos;Événement</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
