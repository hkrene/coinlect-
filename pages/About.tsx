'use client';

import React from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { Linkedin, Twitter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TeamMember {
  name: string;
  title: string;
  image: string;
  socials: {
    twitter?: string;
    linkedin?: string;
  };
}

interface Volunteer {
  name: string;
  title: string;
  image: string;
  socials: {
    twitter?: string;
    linkedin?: string;
  };
}



const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Hirwa Rene",
    title: "Founder & CEO",
    image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1756494553/hkrene-min_ykpodo.jpg",
    socials: {
      twitter: "https://x.com/0Xhrene",
      linkedin: "https://www.linkedin.com/hkrene",
    },
  },
  {
    name: "Tresor Graphiste",
    title: "Design & Brand Lead",
    image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1766394673/tresor-graph_gmcz1r.jpg",
    socials: {
      twitter: "https://x.com/Tresor_Graphist",
      linkedin: "https://www.linkedin.com/in/tresor-graphiste-88831538a ",
    },
  },
  // {
  //   name: "Dev Minga",
  //   title: "Design & Brand Director",
  //   image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1766397326/dev-minga_bjxnx7.jpg",
  //   socials: {
  //     twitter: "#",
  //     linkedin: "https://www.linkedin.com/in/dev-minga-930806300/",
  //   },
  // },
  {
    name: "Sylvain Kaman'da",
    title: "Community Manager Lead",
    image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1766394673/sylvain-kamanda_bnswmr.jpg",
    socials: {
      twitter: "https://x.com/ShekinahKamanda",
      linkedin: "https://www.linkedin.com/in/sylvain-kaman-da-212370279/",
    },
  },
  {
    name: "Ben Tshimanga",
    title: "Active Member",
    image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1766396457/bentshims_bv8gyi.jpg",
    socials: {
      twitter: "https://x.com/tshims_ben15226",
      linkedin: "https://www.linkedin.com/in/ben-shimanga/",
    },
  },
];

const VOLUNTEERS: Volunteer[] = [
  
  {
    name: "Josue Kitumaini",
    title: "Volunteer at UNILU",
    image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1766489997/josuecrypto_nulqyu.jpg",
    socials: {
      twitter: "https://x.com/josue_mus2?s=21",
      linkedin: "https://www.linkedin.com/in/josu%C3%A9-kitumaini-836215221/",
    },
  },
  {
    name: "David Kalunga",
    title: "Volunteer at UCB",
    image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1766491935/davidkalunga_jfr0st.jpg",
    socials: {
      twitter: "https://x.com/DavidKalun71250",
      linkedin: "https://www.linkedin.com/in/david-kalunga-24788a382",
    },
  },
  {
    name: "Odilon Nfan",
    title: "Active Member",
    image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1766491935/odilon_xsbjqr.jpg",
    socials: {
      twitter: "#",
      linkedin: "https://www.linkedin.com/in/odilon-nfan-467550252?",
    },
  },
  {
    name: "Emmanuel Kayombo",
    title: "Active Member at UNH",
    image: "https://res.cloudinary.com/drsd8adkq/image/upload/v1766406311/emmailka_jgzlqy.jpg",
    socials: {
      twitter: "https://x.com/",
      linkedin: "https://www.linkedin.com/in/emmanuel-kayombo-0b4b8b2b2/",
    },
  },
];

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="container px-6 mx-auto max-w-7xl">

        {/* About Section */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-12 mb-20 md:flex-row md:justify-between">
            <div className="md:w-1/2">
              <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
                {t.aboutAcademy.title.split(' ')[0]} <span className="text-coinlect-accent">{t.aboutAcademy.title.split(' ')[1]}</span>
              </h1>

              <p className="mb-4 text-sm text-gray-400 eading-relaxed md:text-xl">
                {t.aboutAcademy.description.para1}
              </p>

              <p className="mb-4 text-sm leading-relaxed text-gray-400 md:text-xl">
                {t.aboutAcademy.description.para2}
              </p>

              <p className="text-sm leading-relaxed text-gray-400 md:text-xl">
                {t.aboutAcademy.description.para3}
              </p>
            </div>

            <div className="flex items-center justify-center md:w-1/2">
              <img
                src="https://res.cloudinary.com/drsd8adkq/image/upload/v1766400615/coinlect-fest_hreelt.jpg"
                alt="CoinLect Academy"
                className="w-2/3 h-auto"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300/333/666?text=CoinLect+Academy';
                }}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Mission Section */}
        <ScrollReveal delay={200}>
          <div className="flex flex-col-reverse items-center gap-12 mb-20 md:flex-row md:justify-between">
            <div className="flex items-center justify-center md:w-1/2">
              <img
                src="https://res.cloudinary.com/drsd8adkq/image/upload/v1766395262/aboutcb_mmdavv.svg"
                alt="Notre mission"
                className="w-2/3 h-auto"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300/333/666?text=Mission';
                }}
              />
            </div>

            <div className="md:w-1/2">
              <h2 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
                {t.aboutAcademy.missionTitle.split(' ')[0]} <span className="text-coinlect-accent">{t.aboutAcademy.missionTitle.split(' ')[1]}</span>
              </h2>

              <p className="mb-4 text-sm leading-relaxed text-gray-400 md:text-xl">
                {t.aboutAcademy.mission.para1}
              </p>

              <p className="mb-4 text-sm leading-relaxed text-gray-400 md:text-xl">
                {t.aboutAcademy.mission.para2}
              </p>

                <p className="text-sm leading-relaxed text-gray-400 md:text-xl">
                {t.aboutAcademy.mission.para3}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Team Section — untouched */}
        <ScrollReveal delay={400}>
          <div className="mb-16 text-center">
            <h2 className="mb-12 text-4xl font-extrabold text-white md:text-5xl">
              {t.aboutAcademy.teamTitle.split(' ')[0]} {t.aboutAcademy.teamTitle.split(' ')[1]} <span className="text-coinlect-accent">{t.aboutAcademy.teamTitle.split(' ')[2]}<span className='hidden md:inline'> {t.aboutAcademy.teamTitle.split(' ')[3]}</span></span>
            </h2>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {TEAM_MEMBERS.map((member, index) => (
                <div key={index} className="flex flex-col items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-32 h-32 mb-4 rounded-full shadow-lg"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/128x128/333/666?text=' + member.name.split(' ').map(n => n[0]).join('');
                    }}
                  />
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="mb-3 text-sm text-gray-400">{member.title}</p>
                  <div className="flex gap-3">
                    {member.socials.twitter && (
                      <a
                        href={member.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-coinlect-accent"
                      >
                        <Twitter size={20} />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-coinlect-accent"
                      >
                        <Linkedin size={20} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
        {/* Volunteers Section */}
<ScrollReveal delay={500}>
  <div className="mb-16 text-center">
    <h2 className="mb-12 text-4xl font-extrabold text-white md:text-5xl">
      {t.aboutAcademy.volunteersTitle.split(' ')[0]} <span className="text-coinlect-accent">{t.aboutAcademy.volunteersTitle.split(' ')[1]}</span>
    </h2>

    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {VOLUNTEERS.map((volunteer, index) => (
        <div key={index} className="flex flex-col items-center">
          <img
            src={volunteer.image}
            alt={volunteer.name}
            className="object-cover w-32 h-32 mb-4 rounded-full shadow-lg"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/128x128/333/666?text=' + volunteer.name.split(' ').map(n => n[0]).join('');
            }}
          />
          <h3 className="text-lg font-bold text-white">{volunteer.name}</h3>
          <p className="mb-3 text-sm text-gray-400">{volunteer.title}</p>
          <div className="flex gap-3">
            {volunteer.socials.twitter && (
              <a
                href={volunteer.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-coinlect-accent"
              >
                <Twitter size={20} />
              </a>
            )}
            {volunteer.socials.linkedin && (
              <a
                href={volunteer.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-coinlect-accent"
              >
                <Linkedin size={20} />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</ScrollReveal>


      </div>
    </div>
  );
};

export default About;
