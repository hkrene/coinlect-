
import React from 'react';
import { Hero } from '../components/Hero';
import { Ticker } from '../components/Ticker';
import { About } from '../components/About';
import { Partners } from '../components/Partners';
import { Features } from '../components/Features';
import { FAQ } from '../components/FAQ';
import { ScrollReveal } from '../components/ScrollReveal';
import { AdBanner } from '../components/AdBanner';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <ScrollReveal className="w-full">
        <Ticker />
      </ScrollReveal>
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <Partners />
      <ScrollReveal>
        <Features />
      </ScrollReveal>
      <ScrollReveal>
        <AdBanner />
      </ScrollReveal>
      <ScrollReveal>
        <FAQ />
      </ScrollReveal>
    </>
  );
};

export default Home;
