'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, ArrowRight, Calendar, MapPin, ArrowLeft, ExternalLink } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { eventService } from '../services/db';
import { Event } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const FILTERS = ['All', 'Conference', 'Meetup', 'Web3', 'Workshop', 'Hackathon', 'Mixer'];
export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { t } = useLanguage();

  const canonicalFilters = ['All', 'Conference', 'Meetup', 'Web3', 'Workshop', 'Hackathon', 'Mixer'];
  const displayFilters = t.events.filters;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventService.getAll();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter !== 'All') {
      filtered = filtered.filter(event =>
        event.eventTypes.some(t => t.toLowerCase() === activeFilter.toLowerCase())
      );
    }

    return filtered;
  }, [events, searchQuery, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const renderBanner = (event: Event) => {
    // If custom banner image is provided, use it (check both banner === 'custom' and direct bannerImage)
    if (event.bannerImage || (event.banner === 'custom' && event.bannerImage)) {
      return (
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/800x400/333/666?text=No+Image';
            }}
          />
        </div>
      );
    }
    return (
      <div className="relative h-48 overflow-hidden bg-gray-800 rounded-t-xl">
        <div className="absolute inset-0 flex items-center justify-center p-6 text-white">
          <div className="text-sm">{event.title}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container px-6 mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col gap-6 mb-6 md:flex-row md:items-center md:justify-between">
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">UPCOMING EVENTS</h1>
            <div className="relative w-full max-w-md">
              <Search className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-white placeholder-gray-500 transition-colors border rounded-lg bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
              />
            </div>
          </div>

          <div className="flex w-full gap-2 pb-2 mb-12 overflow-x-auto md:pb-0 scrollbar-hide">
            {canonicalFilters.map((filterKey, index) => (
              <button
                key={filterKey}
                onClick={() => { setActiveFilter(filterKey); setCurrentPage(1); }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  activeFilter === filterKey
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {displayFilters[index] || filterKey}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {paginatedEvents.map((event) => (
            <ScrollReveal key={event.id}>
              <div className="overflow-hidden transition-all border cursor-pointer group bg-black/50 border-white/10 rounded-xl hover:border-coinlect-accent/50">
                {renderBanner(event)}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.eventTypes.map((type, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs font-bold tracking-wider text-gray-400 uppercase border rounded-full bg-white/5 border-white/10">
                        {type}
                      </span>
                    ))}
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-white transition-colors line-clamp-2 group-hover:text-coinlect-accent">
                    {event.title}
                  </h3>
                  <div className="mb-6 space-y-3">
                    <div className="flex items-start gap-3 text-sm text-gray-400">
                      <Calendar className="mt-0.5 flex-shrink-0" size={16} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-400">
                      <MapPin className="mt-0.5 flex-shrink-0" size={16} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {event.url ? (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 transition-all border rounded-full bg-white/5 border-white/10 group-hover:bg-coinlect-accent group-hover:border-coinlect-accent"
                        aria-label="View Event Details"
                      >
                        <ExternalLink className="text-gray-400 transition-colors group-hover:text-black" size={20} />
                      </a>
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 transition-all border rounded-full bg-white/5 border-white/10 group-hover:bg-coinlect-accent group-hover:border-coinlect-accent">
                        <ArrowRight className="text-gray-400 transition-colors group-hover:text-black" size={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Clean Pagination without Page Picker */}
        {filteredEvents.length > 0 && (
          <div className="flex items-center justify-between pt-8 border-t border-white/10">
            <div className="text-sm font-medium text-gray-400">
              Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all border rounded-lg border-white/10 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} /> Previous
              </button>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-black transition-all rounded-lg bg-coinlect-accent hover:bg-yellow-500 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="py-20 text-center text-gray-500">Aucun événement ne correspond à vos critères.</div>
        )}
      </div>
    </div>
  );
};

export default Events;