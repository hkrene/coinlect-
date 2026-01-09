'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const Features: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [communityImageIndex, setCommunityImageIndex] = useState(0);

  // Images for the scam prevention section
  const rotatingImages = [
    'https://imgs.search.brave.com/u85qbulP9AtJIk6OFfyh6vQ7BYMRACL6B08iGqTZu4I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuYmVpbmNyeXB0/by5jb20vaW1nLzRh/VjZLMW9ZRXMzV2Fl/X1VsZjRLM3I3ajFO/RT0vc21hcnQvNTZh/YmNiZTFiNTA1NDE3/NjkwYmY0YzczNDEw/MjdkNjc',
    'https://imgs.search.brave.com/GAmLdlt6GY0SAqlAQYLOIaRRuRYJIcY4NjqJJklvuM8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9maW5hbmNlLWNv/bmNlcHQtd2l0aC1j/b2luLXN5bWJvbF8y/My0yMTQ5NDQ4NDkw/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA'
  ];

  // Images for the community section
  const communityImages = [
    'https://imgs.search.brave.com/u85qbulP9AtJIk6OFfyh6vQ7BYMRACL6B08iGqTZu4I/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuYmVpbmNyeXB0/by5jb20vaW1nLzRh/VjZLMW9ZRXMzV2Fl/X1VsZjRLM3I3ajFO/RT0vc21hcnQvNTZh/YmNiZTFiNTA1NDE3/NjkwYmY0YzczNDEw/MjdkNjc',
    'https://imgs.search.brave.com/GAmLdlt6GY0SAqlAQYLOIaRRuRYJIcY4NjqJJklvuM8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9maW5hbmNlLWNv/bmNlcHQtd2l0aC1j/b2luLXN5bWJvbF8y/My0yMTQ5NDQ4NDkw/LmpwZz9zZW10PWFp/c19oeWJyaWQmdz03/NDAmcT04MA'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % rotatingImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCommunityImageIndex((prevIndex) => (prevIndex + 1) % communityImages.length);
    }, 5000); // Slightly different timing for variety
    return () => clearInterval(interval);
  }, [communityImages.length]);

  return (
    <div className="container flex flex-col gap-32 px-6 py-24 mx-auto bg-black">
        
        {/* Feature 1: Clean Image Preview */}
        <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="md:p-8">
                <h2 className="mb-6 text-2xl font-bold leading-tight text-white md:text-4xl">
                    {t.features.buyTitle} <span className="text-coinlect-accent">{t.features.buyTitleSuffix}</span>
                </h2>
                <div className="mb-10 space-y-6 text-xs leading-relaxed text-gray-400">
                    <span>{t.features.buyDesc1}</span>
                    <span>{t.features.buyDesc2}</span>
                </div>
                <Link href={isAuthenticated ? "/academy" : "/register"}>
                    <div className="inline-flex items-center justify-between w-full md:w-auto min-w-[220px] border border-white/10 rounded-full px-8 py-4 hover:bg-white hover:text-black transition-all group cursor-pointer">
                        <span className="font-bold">{t.features.buyCta}</span>
                        <ArrowUpRight className="ml-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
                    </div>
                </Link>
            </div>
            
            {/* Image Section - Removed Phone UI and Numbers */}
            <div className="relative h-[450px] w-full bg-[#0F0F0F] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <img
                  src={rotatingImages[currentImageIndex]}
                  className="object-cover w-full h-full transition-opacity duration-1000"
                  alt="Security Preview"
                  key={currentImageIndex}
                />
                
                {/* Subtle Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent"></div>

                {/* Simple Indicators */}
                <div className="absolute flex gap-2 bottom-6 right-8">
                  {rotatingImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 transition-all duration-300 rounded-full ${
                        index === currentImageIndex ? 'w-8 bg-coinlect-accent' : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
            </div>
        </div>

        {/* Feature 2: Clean Image Preview */}
        <div className="grid items-center gap-16 md:grid-cols-2">
             <div className="md:order-2 md:p-8">
                <h2 className="mb-6 text-2xl font-bold leading-tight text-white md:text-4xl">
                    <span className="md:inline">{t.features.communityTitle} </span>
                    <span className="text-coinlect-accent">{t.features.communityTitleSuffix}</span>
                </h2>
                <div className="mb-10 space-y-6 text-xs leading-relaxed text-gray-400">
                    <span>{t.features.communityDesc1}</span>
                    <span>{t.features.communityDesc2}</span>
                </div>
                <Link href="/community">
                    <div className="inline-flex items-center justify-between w-full md:w-auto min-w-[220px] border border-white/10 rounded-full px-8 py-4 hover:bg-white hover:text-black transition-all group cursor-pointer">
                        <span className="font-bold">{t.features.communityCta}</span>
                        <ArrowUpRight className="ml-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
                    </div>
                </Link>
            </div>

             <div className="md:order-1 relative h-[450px] w-full rounded-3xl overflow-hidden bg-[#0F0F0F] shadow-2xl">
                <img
                    src={communityImages[communityImageIndex]}
                    alt="Community Assets"
                    className="object-cover w-full h-full transition-opacity duration-1000"
                    key={communityImageIndex}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Community Image Indicators */}
                <div className="absolute flex gap-2 bottom-6 right-8">
                  {communityImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 transition-all duration-300 rounded-full ${
                        index === communityImageIndex ? 'w-8 bg-coinlect-accent' : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
            </div>
        </div>

    </div>
  );
};