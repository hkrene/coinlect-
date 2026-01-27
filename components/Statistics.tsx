'use client';

import React, { useEffect, useState, useRef } from 'react';

const CountUpNumber: React.FC<{ target: number; suffix?: string }> = ({ 
  target, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOutCirc = Math.sqrt(1 - Math.pow(progress - 1, 2));
          
          setCount(Math.floor(easeOutCirc * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, target]);

  return <span ref={elementRef} className="tabular-nums">{count.toLocaleString()}{suffix}</span>;
};

export const Statistics = () => {
  const stats = [
    { value: 1000, suffix: '+', label: 'Apprenants' },
    { value: 45, suffix: '+', label: 'Modules' },
    { value: 98, suffix: '%', label: 'Satisfaction' },
    { value: 10, suffix: 'M+', label: 'Target' },
  ];

  return (
    <section className="px-6 py-20 bg-black lg:py-40 border-y border-white/10">
      <div className="max-w-[1400px] mx-auto">
        
        {/* TOP NARRATIVE: RAW TYPOGRAPHY */}
        <div className="mb-20 lg:mb-32">
          <h2 className="mb-8 text-2xl font-bold text-white uppercase lg:text-7xl">
            L&apos;Éducation <span className="text-amber-500">sans frontières.</span> <br />
            Des chiffres qui parlent d&apos;eux-mêmes.
          </h2>
          <p className="text-sm font-medium text-zinc-500 lg:text-xl">
            Coinlect Academy n&apos;est pas qu&apos;une plateforme. C&apos;est l&apos;épicentre de la croissance financière en Afrique francophone.
          </p>
        </div>

        {/* STATS ROW: ONE LINE ON MOBILE */}
        <div className="relative">
          {/* Mobile: Horizontal scroll container / Desktop: Grid */}
          <div className="flex flex-row items-end gap-12 pb-4 overflow-x-auto no-scrollbar lg:grid lg:grid-cols-4 lg:gap-8 lg:pb-0">
            {stats.map((item, idx) => (
              <div key={idx} className="flex-none min-w-[140px] lg:min-w-0 group">
                <div className="block text-5xl font-black leading-none tracking-tighter text-white lg:text-8xl">
                  <CountUpNumber target={item.value} suffix={item.suffix} />
                </div>
                {/* Thin brutalist line */}
                <div className="h-[2px] w-full bg-zinc-800 mt-4 mb-2 group-hover:bg-amber-500 transition-colors duration-500" />
                <span className="text-zinc-500 uppercase text-[10px] lg:text-xs font-bold tracking-[0.2em]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};