'use client';

import React from 'react';

export const dynamic = 'force-dynamic';
export const generateStaticParams = () => [];
import { useLanguage } from '../contexts/LanguageContext';

export const Terms: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen px-6 py-20 font-sans text-white bg-black md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-8 text-3xl font-medium tracking-tight md:text-4xl">{t.terms.title}</h1>
        
        <div className="w-full h-px mb-12 bg-gray-800"></div>
        
        <div className="space-y-12 text-gray-300">
             <div>
                 <h2 className="mb-4 text-xl font-medium text-white">Coinlect Terms of Use</h2>
                 <p className="text-base leading-relaxed whitespace-pre-line">
                     {t.terms.intro}
                 </p>
             </div>

             {/* Section 1 */}
             <div>
                 <h3 className="mb-3 text-lg font-medium text-white md:text-xl">{t.terms.section1.title}</h3>
                 <p className="text-base leading-relaxed">{t.terms.section1.content}</p>
             </div>

             {/* Section 2 */}
             <div>
                 <h3 className="mb-3 text-lg font-medium text-white md:text-xl">{t.terms.section2.title}</h3>
                 <p className="mb-4 text-base leading-relaxed">{t.terms.section2.content}</p>
                 <div className="pl-4 space-y-6">
                     <div>
                         <h4 className="mb-2 text-sm font-bold tracking-wide text-white uppercase">{t.terms.section2.allowedTitle}</h4>
                         <ul className="pl-5 space-y-2 text-base list-disc">
                             {t.terms.section2.allowed.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                     </div>
                     <div>
                         <h4 className="mb-2 text-sm font-bold tracking-wide text-white uppercase">{t.terms.section2.disallowedTitle}</h4>
                         <ul className="pl-5 space-y-2 text-base list-disc">
                             {t.terms.section2.disallowed.map((item, i) => <li key={i}>{item}</li>)}
                         </ul>
                     </div>
                 </div>
             </div>

             {/* Section 3 */}
             <div>
                 <h3 className="mb-3 text-lg font-medium text-white md:text-xl">{t.terms.section3.title}</h3>
                 <p className="mb-2 text-base leading-relaxed">{t.terms.section3.content}</p>
                 <ul className="pl-5 space-y-2 text-base list-disc">
                     {t.terms.section3.items.map((item, i) => <li key={i}>{item}</li>)}
                 </ul>
             </div>

             {/* Dynamic Remaining Sections */}
             {[t.terms.section4, t.terms.section5, t.terms.section6, t.terms.section7, t.terms.section8, t.terms.section9].map((section, idx) => (
                <div key={idx}>
                    <h3 className="mb-3 text-lg font-medium text-white md:text-xl">{section.title}</h3>
                    <p className="text-base leading-relaxed whitespace-pre-line">{section.content}</p>
                </div>
             ))}
        </div>

        <div className="flex flex-col items-end justify-between gap-4 pt-8 mt-20 text-sm text-gray-500 border-t border-gray-800 md:flex-row">
             <div className="whitespace-pre-line">{t.terms.closing}</div>
             <div className="text-right">
                 Last updated<br/>
                 Mon Dec 08 2025
             </div>
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

export default Terms;
