'use client';

import React from 'react';

export const dynamic = 'force-dynamic';
export const generateStaticParams = () => [];
import { useLanguage } from '../contexts/LanguageContext';

export const Privacy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen px-6 py-20 text-white bg-black md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-8 text-xl font-medium tracking-tight md:text-4xl">{t.privacy.title}</h1>
        
        <div className="w-full h-px mb-12 bg-gray-800"></div>
        
        <div className="space-y-12">
            <div>
                 <h2 className="mb-4 text-sm font-medium md:text-xl">Coinlect Privacy Policy</h2>
                 <p className="text-base leading-relaxed text-gray-300 whitespace-pre-line">
                     {t.privacy.intro}
                 </p>
            </div>

            {t.privacy.sections.map((section, idx) => (
                <div key={idx}>
                    <h3 className="mb-3 text-sm font-medium text-white md:text-xl">{section.title}</h3>
                    <div className="text-xs leading-relaxed text-gray-300 whitespace-pre-line md:text-sm">
                        {section.content}
                    </div>
                </div>
            ))}
        </div>
        
        <div className="flex flex-col items-end justify-between gap-4 pt-8 mt-20 text-sm text-gray-500 border-t border-gray-800 md:flex-row">
             <div className="whitespace-pre-line">{t.privacy.closing}</div>
             <div className="text-right">
                 Last updated<br/>
                 Mon Jan 10 2026
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

export default Privacy;
