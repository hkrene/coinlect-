
import React from 'react';
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

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Ticker />
      <Partners />
      <FeaturedCourses />
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <Statistics />
      <ScrollReveal>
        <Features />
      </ScrollReveal>
      <ScrollReveal>
        <AdBanner />
      </ScrollReveal>
      <Testimonials />
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
