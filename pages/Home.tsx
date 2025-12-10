
import React from 'react';
import { Hero } from '../components/Hero';
import { Ticker } from '../components/Ticker';
import { About } from '../components/About';
import { Partners } from '../components/Partners';
import { Features } from '../components/Features';
import { FAQ } from '../components/FAQ';
import { ScrollReveal } from '../components/ScrollReveal';
import { AdBanner } from '../components/AdBanner';
import { NewsletterSubscribe } from '../components/NewsletterSubscribe';

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
        <div className="container px-6 py-16 mx-auto">
          <NewsletterSubscribe source="WEBSITE" />
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <FAQ />
      </ScrollReveal>
    </>
  );
};
