'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { articleService } from '../services/db';
import { Article } from '../types';
import { Button } from '../components/Button';
import { ScrollReveal } from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Clock, Calendar, Twitter, Facebook, Link as LinkIcon, Check, Share2, Tag, ChevronRight } from 'lucide-react';

export const ArticleDetail: React.FC = () => {
  const params = useParams();
  const articleSlug = params?.articleSlug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch article directly by slug from API
        const response = await fetch(`/api/articles/${articleSlug}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data.article);

          // Get related articles
          const articles = await articleService.getAll();
          const related = articles.filter(a => a.id !== data.article.id).slice(0, 2);
          setRelatedArticles(related);
        } else {
          setError('Article not found');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    if (articleSlug) {
      fetchData();
    }
  }, [articleSlug]);

  if (loading) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 pt-32 mx-auto text-center">
        <div className="w-8 h-8 border-4 rounded-full border-coinlect-accent border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-400">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-screen px-6 pt-32 mx-auto text-center">
        <h2 className="mb-4 text-2xl font-bold">{error || 'Article Not Found'}</h2>
        <Link href="/academy">
          <Button variant="secondary" withArrow>{t.academy.article.backToAcademy}</Button>
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareText = encodeURIComponent(article.title);

  return (
    <div className="min-h-screen pb-24 bg-black">
      {/* Progress Bar (Simulated) */}
      <div className="fixed top-0 left-0 z-50 w-full h-1 bg-white/5">
         <div className="w-1/3 h-full bg-coinlect-accent"></div>
      </div>

      {/* Header / Nav Area */}
      <div className="container max-w-4xl px-6 pb-10 mx-auto pt-28">
         <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
             <Link href="/" className="transition-colors hover:text-white">Home</Link>
             <ChevronRight size={14} />
             <Link href="/academy" className="transition-colors hover:text-white">Academy</Link>
             <ChevronRight size={14} />
             <span className="text-coinlect-accent">{article.category}</span>
         </div>

         <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase border rounded-full bg-coinlect-accent/10 text-coinlect-accent border-coinlect-accent/20">
               {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <Calendar size={14} /> {article.date}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <Clock size={14} /> {article.readTime}
            </span>
         </div>

         <h1 className="mb-8 text-3xl font-extrabold leading-tight text-white md:text-5xl">
            {article.title}
         </h1>

         <div className="flex items-center justify-between py-6 border-y border-white/10">
             <div className="flex items-center gap-4">
                <img
                  src={article.authorImage}
                  alt={article.author?.name ?? 'Author'}
                  className="w-12 h-12 rounded-full border-2 border-[#0a0a0a] ring-2 ring-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/48x48/333/666?text=Author';
                  }}
                />
                <div>
                    <p className="text-sm font-bold text-white">{article.author?.name ?? 'Author'}</p>
                    <p className="text-xs text-gray-500">{t.academy.article.writtenBy}</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
                 <a 
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300"
                    title="Share on Twitter"
                 >
                     <Twitter size={18} />
                 </a>
                 <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-[#4267B2] hover:text-white transition-all duration-300"
                    title="Share on Facebook"
                 >
                     <Facebook size={18} />
                 </a>
                 <button 
                    onClick={handleCopyLink}
                    className="p-2 text-gray-400 transition-all duration-300 rounded-full bg-white/5 hover:bg-green-500 hover:text-white"
                    title="Copy Link"
                 >
                     {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                 </button>
             </div>
         </div>
      </div>

      {/* Featured Image */}
      <div className="container max-w-5xl px-6 mx-auto mb-12">
          <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={article.image}
                alt={article.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x400/333/666?text=No+Image';
                }}
              />
          </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl px-6 mx-auto">
         <ScrollReveal>
             <div className="prose prose-lg prose-invert max-w-none">
                 <p className="mb-10 text-xl font-medium leading-relaxed text-white lead md:text-2xl">
                     {article.excerpt}
                 </p>
                 
                 {(article.content as string).split('\n').map((paragraph, idx) => (
                     paragraph.trim() && (
                         <p key={idx} className="mb-6 leading-relaxed text-gray-300">
                             {paragraph.trim()}
                         </p>
                     )
                 ))}

                 <h3 className="mt-12 mb-6 text-2xl font-bold text-white">Key Takeaways</h3>
                 <ul className="space-y-2 text-gray-300">
                    <li>• Understanding market cycles is crucial for long-term success.</li>
                    <li>• Risk management should always be the priority.</li>
                    <li>• Fundamental analysis helps identify undervalued assets.</li>
                 </ul>
             </div>
         </ScrollReveal>

         {/* Tags */}
         <div className="flex flex-wrap gap-2 pt-8 mt-12 border-t border-white/10">
             {['Crypto', 'Blockchain', 'Analysis', 'Market'].map(tag => (
                 <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5 hover:border-white/20 transition-colors cursor-default">
                     <Tag size={12} /> {tag}
                 </span>
             ))}
         </div>

      </div>

      {/* Related Articles */}
      <div className="container max-w-5xl px-6 mx-auto mt-24">
         <h3 className="pl-4 mb-8 text-2xl font-bold text-white border-l-4 border-coinlect-accent">Read Next</h3>
         <div className="grid gap-8 md:grid-cols-2">
            {relatedArticles.map(related => (
                <Link key={related.id} href={`/academy/article/${related.slug}`} className="flex flex-col gap-4 p-4 transition-colors bg-transparent group md:flex-row hover:bg-white/5 rounded-xl">
                    <div className="flex-shrink-0 w-full h-32 overflow-hidden rounded-lg md:w-48">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x200/333/666?text=No+Image';
                          }}
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="mb-2 text-xs font-bold uppercase text-coinlect-accent">{related.category}</span>
                        <h4 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-coinlect-accent">{related.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{related.excerpt}</p>
                    </div>
                </Link>
            ))}
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

export default ArticleDetail;
