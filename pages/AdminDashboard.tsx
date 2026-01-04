'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { courseService, articleService, eventService, dealService } from '../services/db';
import { Course, Article, Event, User, Deal } from '../types';
import { PublishStatus } from '@prisma/client';
import { Button } from '../components/Button';
import { Trash2, Plus, BookOpen, FileText, LayoutDashboard, X, Check, Calendar, Star } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'articles' | 'events' | 'users' | 'deals'>('overview');
  const [courses, setCourses] = useState<Course[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'course' | 'article' | 'event' | 'deal' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; item: any } | null>(null);

  // Pre-populate forms when editing
  useEffect(() => {
    if (editingItem && modalType) {
      if (modalType === 'course') {
        setCourseForm({
          title: editingItem.title || '',
          slug: editingItem.slug || '',
          description: editingItem.description || '',
          seoTitle: editingItem.seoTitle || '',
          seoDescription: editingItem.seoDescription || '',
          status: editingItem.status || 'DRAFT',
          publishedAt: editingItem.publishedAt || undefined,
          createdAt: editingItem.createdAt || '',
          updatedAt: editingItem.updatedAt || '',
          authorId: editingItem.authorId || undefined,
          author: editingItem.author || undefined,
          about: editingItem.about || '',
          level: editingItem.level || 'Débutant',
          duration: editingItem.duration || '35m',
          modules: editingItem.modules || 0,
          category: editingItem.category || 'Blockchain',
          image: editingItem.image || '',
          syllabus: editingItem.syllabus || [],
          courseType: editingItem.courseType || 'academy',
          videoLink: editingItem.videoLink || ''
        });
      } else if (modalType === 'article') {
        setArticleForm({
          title: editingItem.title || '',
          slug: editingItem.slug || '',
          excerpt: editingItem.excerpt || '',
          content: editingItem.content || '',
          tags: editingItem.tags || [],
          seoTitle: editingItem.seoTitle || '',
          seoDescription: editingItem.seoDescription || '',
          status: editingItem.status || 'DRAFT',
          publishedAt: editingItem.publishedAt || undefined,
          createdAt: editingItem.createdAt || '',
          updatedAt: editingItem.updatedAt || '',
          authorId: editingItem.authorId || undefined,
          author: editingItem.author || undefined,
          authorImage: editingItem.authorImage || '',
          featured: editingItem.featured || false
        });
      } else if (modalType === 'event') {
        setEventForm({
          title: editingItem.title || '',
          slug: editingItem.slug || '',
          date: editingItem.date || '',
          location: editingItem.location || '',
          description: editingItem.description || '',
          banner: editingItem.banner || '',
          bannerImage: editingItem.bannerImage || '',
          bannerText: editingItem.bannerText || '',
          eventTypes: editingItem.eventTypes || [],
          seoTitle: editingItem.seoTitle || '',
          seoDescription: editingItem.seoDescription || '',
          status: editingItem.status || 'DRAFT',
          publishedAt: editingItem.publishedAt || undefined,
          createdAt: editingItem.createdAt || '',
          updatedAt: editingItem.updatedAt || '',
          authorId: editingItem.authorId || undefined,
          author: editingItem.author || undefined
        });
      } else if (modalType === 'deal') {
        // setDealForm({
        //   title: editingItem.title || '',
        //   description: editingItem.description || '',
        //   category: editingItem.category || '',
        //   link: editingItem.link || '',
        //   image: editingItem.image || '',
        //   discount: editingItem.discount || '',
        //   code: editingItem.code || '',
        //   exclusive: editingItem.exclusive || false,
        //   verified: editingItem.verified || false,
        //   featured: editingItem.featured || false
        // });
      }
    }
  }, [editingItem, modalType]);

  // Complex Form State
  const [courseForm, setCourseForm] = useState<Omit<Course, 'id' | 'slug'> & { slug: string }>({
    title: '',
    slug: '',
    description: '',
    seoTitle: '',
    seoDescription: '',
    status: 'DRAFT',
    publishedAt: undefined,
    createdAt: '',
    updatedAt: '',
    authorId: undefined,
    author: undefined,
    // Legacy fields for frontend compatibility
    about: '',
    level: 'Débutant',
    duration: '35m',
    modules: 0,
    category: 'Blockchain',
    image: '',
    syllabus: [],
    courseType: 'academy',
    videoLink: ''
  });

  const [articleForm, setArticleForm] = useState<Omit<Article, 'id' | 'slug'> & { slug: string }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [],
    seoTitle: '',
    seoDescription: '',
    status: 'DRAFT',
    publishedAt: undefined,
    createdAt: '',
    updatedAt: '',
    authorId: undefined,
    author: undefined,
    // Legacy fields for frontend compatibility
    readTime: '5 min',
    date: new Date().toLocaleDateString('fr-FR'),
    image: '',
    category: 'News',
    authorImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
    featured: false
  });

  const [eventForm, setEventForm] = useState<Omit<Event, 'id' | 'slug'> & { slug: string }>({
    title: '',
    slug: '',
    date: '',
    location: '',
    description: '',
    banner: 'custom',
    bannerImage: '',
    bannerText: '',
    eventTypes: [],
    seoTitle: '',
    seoDescription: '',
    status: 'DRAFT',
    publishedAt: undefined,
    createdAt: '',
    updatedAt: '',
    authorId: undefined,
    author: undefined,
    // Legacy field for compatibility
    type: []
  });

  const [dealForm, setDealForm] = useState<Omit<Deal, 'id'> & { status: PublishStatus }>({
    title: '',
    description: '',
    category: '',
    link: '',
    image: '',
    discount: '',
    code: '',
    exclusive: false,
    verified: false,
    featured: false,
    createdAt: '',
    updatedAt: '',
    status: 'DRAFT',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) {
        router.push('/');
        return;
      }

      try {
        const [coursesData, articlesData, eventsData, usersData, dealsData] = await Promise.all([
          courseService.getAll(),
          articleService.getAll(),
          eventService.getAll(),
          fetchUsers(),
          dealService.getAll()
        ]);
        setCourses(coursesData);
        setArticles(articlesData);
        setEvents(eventsData);
        setUsers(usersData);
        setDeals(dealsData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    loadData();
  }, [isAdmin, router, refreshTrigger]);

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const handleRoleChange = async (userId: string, action: 'promote' | 'demote') => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to update user role');
        return;
      }

      // Refresh users list
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role. Please try again.');
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing course
        const response = await fetch(`/api/courses/${editingItem.slug}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(courseForm),
        });
        if (!response.ok) throw new Error('Failed to update course');
      } else {
        // Create new course
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(courseForm),
        });
        if (!response.ok) throw new Error('Failed to create course');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setEditingItem(null);
      setRefreshTrigger(p => p + 1);
      // Reset form
      setCourseForm({
        title: '',
        slug: '',
        description: '',
        seoTitle: '',
        seoDescription: '',
        status: 'DRAFT',
        publishedAt: undefined,
        createdAt: '',
        updatedAt: '',
        authorId: undefined,
        author: undefined,
        about: '',
        level: 'Débutant',
        duration: '35m',
        modules: 0,
        category: 'Blockchain',
        image: '',
        syllabus: [],
        courseType: 'academy',
        videoLink: ''
      });
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('contentUpdated'));
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing article
        const response = await fetch(`/api/articles/${editingItem.slug}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(articleForm),
        });
        if (!response.ok) throw new Error('Failed to update article');
      } else {
        // Create new article
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(articleForm),
        });
        if (!response.ok) throw new Error('Failed to create article');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setEditingItem(null);
      setRefreshTrigger(p => p + 1);
      // Reset form
      setArticleForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tags: [],
        seoTitle: '',
        seoDescription: '',
        status: 'DRAFT',
        publishedAt: undefined,
        createdAt: '',
        updatedAt: '',
        authorId: undefined,
        author: undefined,
        authorImage: '',
        featured: false
      });
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('contentUpdated'));
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please try again.');
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        ...eventForm,
        eventTypes: eventForm.eventTypes || []
      };
      if (editingItem) {
        // Update existing event
        const response = await fetch(`/api/events/${editingItem.slug}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error('Failed to update event');
      } else {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(eventData),
        });
        if (!response.ok) throw new Error('Failed to create event');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setEditingItem(null);
      setRefreshTrigger(p => p + 1);
      // Dispatch custom event to notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('contentUpdated'));
      }
      setEventForm({
        title: '',
        slug: '',
        date: '',
        location: '',
        description: '',
        banner: 'custom',
        bannerImage: '',
        bannerText: '',
        eventTypes: [],
        seoTitle: '',
        seoDescription: '',
        status: 'DRAFT',
        publishedAt: undefined,
        createdAt: '',
        updatedAt: '',
        authorId: undefined,
        author: undefined,
        type: []
      });
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing deal
        const response = await fetch(`/api/deals/${editingItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(dealForm),
        });
        if (!response.ok) throw new Error('Failed to update deal');
      } else {
        // Create new deal
        const response = await fetch('/api/deals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(dealForm),
        });
        if (!response.ok) throw new Error('Failed to create deal');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setEditingItem(null);
      setRefreshTrigger(p => p + 1);
      // Reset form
      // setDealForm({
      //   title: '',
      //   description: '',
      //   category: '',
      //   link: '',
      //   image: '',
      //   discount: '',
      //   code: '',
      //   exclusive: false,
      //   verified: false,
      //   featured: false
      // });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('contentUpdated'));
      }
    } catch (error) {
      console.error('Error saving deal:', error);
      alert('Error saving deal. Please try again.');
    }
  };

  const toggleEventType = (type: string) => {
    const types = eventForm.type || [];
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
          <button onClick={() => setActiveTab('courses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'courses' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <BookOpen size={18} /> Cours
          </button>
          <button onClick={() => setActiveTab('articles')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'articles' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <FileText size={18} /> Articles
          </button>
          <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'events' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <Calendar size={18} /> Événements
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'users' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <Star size={18} /> Utilisateurs
          </button>
          <button onClick={() => setActiveTab('deals')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${activeTab === 'deals' ? 'bg-coinlect-accent text-black font-bold' : 'text-gray-400 hover:bg-white/5'}`}>
            <FileText size={18} /> Deals
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto md:ml-64">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {[
                  { label: 'Cours', val: courses.length, icon: <BookOpen />, color: 'text-coinlect-accent' },
                  { label: 'Articles', val: articles.length, icon: <FileText />, color: 'text-purple-500' },
                  { label: 'Événements', val: events.length, icon: <Calendar />, color: 'text-green-500' },
                  { label: 'Utilisateurs', val: users.length, icon: <Star />, color: 'text-yellow-500' }
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
                  <button onClick={() => {
                    setEditingItem(c);
                    setModalType('course');
                    setIsModalOpen(true);
                  }} className="p-2 text-blue-500 hover:text-blue-400" aria-label="Edit course"><FileText size={18} /></button>
                  <button onClick={() => {
                    setDeleteTarget({ type: 'course', item: c });
                    setDeleteDialogOpen(true);
                  }} className="p-2 text-red-500 hover:text-red-400" aria-label="Delete course"><Trash2 size={18} /></button>
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
                <p className="mt-2 text-sm text-gray-400">Minimum 3 articles doivent être en vedette pour la page d&apos;accueil</p>
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
                      onClick={async () => {
                        try {
                          const updatedArticles = await articleService.getAll();
                          const article = updatedArticles.find(art => art.id === a.id);
                          if (article) {
                            const newFeaturedStatus = !article.featured;
                            // Ensure at least 3 featured articles
                            const currentFeaturedCount = updatedArticles.filter(art => art.featured).length;
                            if (currentFeaturedCount < 3 && !newFeaturedStatus) {
                              alert('Vous devez avoir au moins 3 articles en vedette sur la page d\'accueil');
                              return;
                            }
                            await articleService.update(a.id, { featured: newFeaturedStatus });
                            setRefreshTrigger(t => t+1);
                            if (typeof window !== 'undefined') {
                              window.dispatchEvent(new CustomEvent('contentUpdated'));
                            }
                          }
                        } catch (error) {
                          console.error('Error updating article:', error);
                          alert('Error updating article. Please try again.');
                        }
                      }} 
                      className={`p-2 transition-colors ${a.featured ? 'text-coinlect-accent hover:text-yellow-500' : 'text-gray-500 hover:text-coinlect-accent'}`}
                      aria-label={a.featured ? "Retirer de la page d'accueil" : "Mettre en vedette"}
                      title={a.featured ? "Retirer de la page d'accueil" : "Mettre en vedette"}
                    >
                      <Star size={18} fill={a.featured ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => {
                      setDeleteTarget({ type: 'article', item: a });
                      setDeleteDialogOpen(true);
                    }} className="p-2 text-red-500 transition-colors hover:text-red-400" aria-label="Delete article"><Trash2 size={18} /></button>
                  <button onClick={() => {
                    setEditingItem(a);
                    setModalType('article');
                    setIsModalOpen(true);
                  }} className="p-2 text-blue-500 hover:text-blue-400" aria-label="Edit article"><FileText size={18} /></button>
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
                      {(e.type || []).map((t, idx) => (
                        <span key={idx} className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase bg-white/5 rounded">{t}</span>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{e.title}</h4>
                      <p className="text-[10px] text-gray-500">{e.date} • {e.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingItem(e);
                      setModalType('event');
                      setIsModalOpen(true);
                    }} className="p-2 text-blue-500 hover:text-blue-400" aria-label="Edit event"><FileText size={18} /></button>
                    <button onClick={() => {
                      setDeleteTarget({ type: 'event', item: e });
                      setDeleteDialogOpen(true);
                    }} className="p-2 text-red-500 transition-colors hover:text-red-400" aria-label="Delete event"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            </div>
            <div className="grid gap-4">
              {users.map(u => (
                <div key={u.id} className="bg-[#111] p-4 rounded-xl border border-white/10 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-bold text-white">{u.name || 'No name'}</h4>
                      <p className="text-sm text-gray-400">{u.email}</p>
                      <p className="text-xs text-gray-500">
                        Rôle: <span className={`font-semibold ${u.role === 'ADMIN' ? 'text-coinlect-accent' : 'text-gray-400'}`}>{u.role === 'ADMIN' ? 'Admin' : 'Utilisateur'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {u.role === 'USER' && (
                      <Button
                        onClick={() => handleRoleChange(u.id, 'promote')}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Star size={14} className="mr-1" />
                        Promouvoir Admin
                      </Button>
                    )}
                    {u.role === 'ADMIN' && u.id !== user?.id && (
                      <Button
                        onClick={() => handleRoleChange(u.id, 'demote')}
                        variant="outline"
                        size="sm"
                        className="text-xs text-red-400 border-red-400 hover:bg-red-400 hover:text-black"
                      >
                        <X size={14} className="mr-1" />
                        Rétrograder
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Gestion des Deals</h1>
              <Button onClick={() => { setModalType('deal'); setIsModalOpen(true); }}><Plus size={16} /> Créer un Deal</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {deals.map(d => (
                <div key={d.id} className="bg-[#111] p-4 rounded-xl border border-white/10 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <img src={d.image || 'https://via.placeholder.com/60x40'} className="object-cover w-20 h-12 rounded shadow" alt="Deal image" />
                    <div>
                      <h4 className="font-bold text-white transition-colors group-hover:text-coinlect-accent">{d.title}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{d.category} • {d.discount}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {d.featured && <Star className="text-coinlect-accent" size={18} fill="currentColor" />}
                    {d.verified && <Check className="text-green-500" size={18} />}
                    <button onClick={() => {
                      setEditingItem(d);
                      setModalType('deal');
                      setIsModalOpen(true);
                    }} className="p-2 text-blue-500 hover:text-blue-400" aria-label="Edit deal"><FileText size={18} /></button>
                    <button onClick={() => {
                      setDeleteTarget({ type: 'deal', item: d });
                      setDeleteDialogOpen(true);
                    }} className="p-2 text-red-500 hover:text-red-400" aria-label="Delete deal"><Trash2 size={18} /></button>
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
                {modalType === 'course' ? <><BookOpen className="text-coinlect-accent" /> {editingItem ? 'Modifier le Cours' : 'Nouveau Cours Expert'}</> :
                 modalType === 'article' ? <><FileText className="text-purple-500" /> {editingItem ? 'Modifier l\'Article' : 'Nouvel Article'}</> :
                 modalType === 'event' ? <><Calendar className="text-green-500" /> {editingItem ? 'Modifier l\'Événement' : 'Nouvel Événement'}</> :
                 modalType === 'deal' ? <><FileText className="text-yellow-500" /> {editingItem ? 'Modifier le Deal' : 'Nouveau Deal'}</> :
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
                    <input
                      required placeholder="Slug (ex: introduction-blockchain)" className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent"
                      onChange={e => setCourseForm({...courseForm, slug: e.target.value})}
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

                    <label className="flex items-center gap-3 px-4 py-2 border cursor-pointer bg-white/5 rounded-xl border-white/10">
                      <input
                        type="checkbox"
                        checked={courseForm.status === 'PUBLISHED'}
                        onChange={e => setCourseForm({
                          ...courseForm,
                          status: e.target.checked ? 'PUBLISHED' : 'DRAFT',
                          publishedAt: e.target.checked ? new Date().toISOString() : undefined
                        })}
                        className="border-gray-600 rounded"
                      />
                      <span className="text-xs font-bold">Publier le cours</span>
                    </label>
                  </div>

                  {/* Learning Objectives */}


                  <div className="flex gap-4 pt-10">
                    <Button type="button" variant="outline" className="w-1/2" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                    <Button type="submit" className="w-1/2 shadow-xl shadow-coinlect-accent/20">
                      {courseForm.status === 'PUBLISHED' ? 'Mettre à jour le Cours' : 'Publier le Cours'}
                    </Button>
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

                   <label className="flex items-center gap-3 px-4 py-2 mb-6 border cursor-pointer bg-white/5 rounded-xl border-white/10">
                     <input
                       type="checkbox"
                       checked={articleForm.status === 'PUBLISHED'}
                       onChange={e => setArticleForm({
                         ...articleForm,
                         status: e.target.checked ? 'PUBLISHED' : 'DRAFT',
                         publishedAt: e.target.checked ? new Date().toISOString() : undefined
                       })}
                       className="border-gray-600 rounded"
                     />
                     <span className="text-xs font-bold">Publier l&apos;article</span>
                   </label>
                   <input required placeholder="Titre de l'article" className="w-full p-4 text-xl font-bold text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent" onChange={e => setArticleForm({...articleForm, title: e.target.value})} />
                   <input required placeholder="Slug (ex: blockchain-101)" className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent" onChange={e => setArticleForm({...articleForm, slug: e.target.value})} />
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
                    <input placeholder="URL Image auteur" className="p-4 text-white bg-black border outline-none border-white/10 rounded-xl" value={articleForm.authorImage} onChange={e => setArticleForm({...articleForm, authorImage: e.target.value})} />
                   <textarea placeholder="Contenu complet (Séparez les paragraphes par une nouvelle ligne)" className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl h-60" onChange={e => setArticleForm({...articleForm, content: e.target.value})} />
                   <div className="flex gap-4 pt-4">
                     <Button type="button" variant="outline" className="w-1/2" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                     <Button type="submit" className="w-1/2">
                       {articleForm.status === 'PUBLISHED' ? 'Mettre à jour l\'Article' : 'Publier l\'Article'}
                     </Button>
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
                  <input
                    required
                    placeholder="Slug (ex: blockchain-conference-2025)"
                    className="w-full p-4 text-white bg-black border outline-none border-white/10 rounded-xl focus:border-coinlect-accent"
                    value={eventForm.slug}
                    onChange={e => setEventForm({...eventForm, slug: e.target.value})}
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
                    <label className="block text-sm font-bold text-gray-400">Type d&apos;événement</label>
                    <div className="flex flex-wrap gap-2">
                      {['CONFERENCE', 'MEETUP', 'WEB3', 'WORKSHOP', 'HACKATHON', 'MIXER'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleEventType(type)}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                            (eventForm.type || []).includes(type)
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

                  <label className="flex items-center gap-3 px-4 py-2 border cursor-pointer bg-white/5 rounded-xl border-white/10">
                    <input
                      type="checkbox"
                      checked={eventForm.status === 'PUBLISHED'}
                      onChange={e => setEventForm({
                        ...eventForm,
                        status: e.target.checked ? 'PUBLISHED' : 'DRAFT',
                        publishedAt: e.target.checked ? new Date().toISOString() : undefined
                      })}
                      className="border-gray-600 rounded"
                    />
                    <span className="text-xs font-bold">Publier l&apos;événement</span>
                  </label>
                  <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                    <Button type="submit" className="w-1/2">
                      {eventForm.status === 'PUBLISHED' ? 'Mettre à jour l\'Événement' : 'Créer l\'Événement'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-6 mx-4 bg-gray-900 border border-gray-700 rounded-lg">
            <h3 className="mb-4 text-lg font-bold text-white">Confirmer la suppression</h3>
            <p className="mb-6 text-gray-300">
              Êtes-vous sûr de vouloir supprimer {
                deleteTarget.type === 'course' ? 'ce cours' :
                deleteTarget.type === 'article' ? 'cet article' :
                deleteTarget.type === 'event' ? 'cet événement' :
                'cette offre'
              } ?
              <br />
              <span className="font-semibold text-white">{deleteTarget.item.title}</span>
              <br />
              <span className="text-sm text-red-400">Cette action est irréversible.</span>
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeleteTarget(null);
                }}
              >
                Annuler
              </Button>
              <Button
                className="text-white bg-red-600 hover:bg-red-700"
                onClick={async () => {
                  if (!deleteTarget) return;

                  try {
                    const endpoint =
                      deleteTarget.type === 'course' ? `/api/courses/${deleteTarget.item.slug}` :
                      deleteTarget.type === 'article' ? `/api/articles/${deleteTarget.item.slug}` :
                      deleteTarget.type === 'event' ? `/api/events/${deleteTarget.item.slug}` :
                      `/api/deals/${deleteTarget.item.id}`;

                    const response = await fetch(endpoint, {
                      method: 'DELETE',
                    });

                    if (response.ok) {
                      setRefreshTrigger(t => t + 1);
                      setDeleteDialogOpen(false);
                      setDeleteTarget(null);
                    } else {
                      alert('Erreur lors de la suppression');
                    }
                  } catch (error) {
                    console.error('Error deleting item:', error);
                    alert('Erreur lors de la suppression');
                  }
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default AdminDashboard;
