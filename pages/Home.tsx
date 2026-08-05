'use client';

import React from 'react';
import Link from 'next/link';
import { Hero } from '../components/Hero';
import { Ticker } from '../components/Ticker';
import { Partners } from '../components/Partners';
import { FeaturedCourses } from '../components/FeaturedCourses';
import { About } from '../components/About';
import { Features } from '../components/Features';
import { Statistics } from '../components/Statistics';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { ScrollReveal } from '../components/ScrollReveal';
import { AdBanner } from '../components/AdBanner';
import { useLanguage } from '../contexts/LanguageContext';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      {/* Cards section removed per request (SEO content moved to FAQ/About) */}
      <Ticker />
      <Partners />
      <FeaturedCourses />
      <div className="container max-w-6xl px-6 mx-auto mt-10 mb-8 text-gray-300">
        <p>{t.home.seoSection1}</p>
      </div>
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <div className="container max-w-6xl px-6 mx-auto mt-10 mb-8 text-gray-300">
        <p>{t.home.seoSection2}</p>
      </div>
      <Statistics />
      <div className="container max-w-6xl px-6 mx-auto mt-10 mb-8 text-gray-300">
        <p>{t.home.statsLine}</p>
      </div>
      <ScrollReveal>
        <Features />
      </ScrollReveal>
      <ScrollReveal>
        <AdBanner />
      </ScrollReveal>
      <Testimonials />
      <div className="container max-w-6xl px-6 mx-auto mt-10 mb-8 text-gray-300">
        <p>{t.home.seoSection3}</p>
      </div>
      <ScrollReveal>
        <FAQ />
      </ScrollReveal>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
