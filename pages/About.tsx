
'use client';

import React from 'react';
import { ScrollReveal } from '../components/ScrollReveal';
import { ArrowUpRight, Linkedin, Twitter } from 'lucide-react';

interface TeamMember {
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
    name: "Nic Puckrin",
    title: "Chief Executive Officer",
    image: "https://via.placeholder.com/150/CCCCCC/000000?text=NP", // Placeholder image
    socials: {
      twitter: "https://x.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Guy Turner",
    title: "Chief Content Officer",
    image: "https://via.placeholder.com/150/AAAAAA/000000?text=GT", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Raheem Ali",
    title: "COO & Head of BD",
    image: "https://via.placeholder.com/150/BBBBBB/000000?text=RA", // Placeholder image
    socials: {
      twitter: "https://x.com/",
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Daniel Krupka",
    title: "Head of Research",
    image: "https://via.placeholder.com/150/DDDDDD/000000?text=DK", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Jasir Jawaid",
    title: "Editor In Chief",
    image: "https://via.placeholder.com/150/EEEEEE/000000?text=JJ", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Semir Mutapcic",
    title: "Head Video Editor",
    image: "https://via.placeholder.com/150/FFFFFF/000000?text=SM", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Sathvik Nayak",
    title: "Head of Product",
    image: "https://via.placeholder.com/150/CCCCCC/000000?text=SN", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Zara Fe Benito",
    title: "Videographer",
    image: "https://via.placeholder.com/150/AAAAAA/000000?text=ZFB", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Jessica dela Flor",
    title: "HR and Operations Manager",
    image: "https://via.placeholder.com/150/BBBBBB/000000?text=JDF", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Adriaan Naude",
    title: "Marketing & Operations Manager",
    image: "https://via.placeholder.com/150/DDDDDD/000000?text=AN", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Marbe Saez",
    title: "Co-Host CB Esp.",
    image: "https://via.placeholder.com/150/EEEEEE/000000?text=MS", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Wijdan Khaliq",
    title: "Content Writer",
    image: "https://via.placeholder.com/150/FFFFFF/000000?text=WK", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Matthew Wheway",
    title: "Researcher",
    image: "https://via.placeholder.com/150/CCCCCC/000000?text=MW", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Daniel McGinn",
    title: "Researcher",
    image: "https://via.placeholder.com/150/AAAAAA/000000?text=DM", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Elina Klushnikova",
    title: "Graphic Designer",
    image: "https://via.placeholder.com/150/BBBBBB/000000?text=EK", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
  {
    name: "Jonas Vincent Narciso",
    title: "Video Editor",
    image: "https://via.placeholder.com/150/DDDDDD/000000?text=JVN", // Placeholder image
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
  },
];

export const About: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="container px-6 mx-auto max-w-7xl">
        {/* About Coin Bureau Section */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-12 mb-20 md:flex-row md:justify-between">
            <div className="md:w-1/2">
              <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
                About <span className="text-coinlect-accent">Coin Bureau</span>
              </h1>
              <p className="mb-4 text-lg leading-relaxed text-gray-400">
                Coin Bureau was created with the intent to deliver the best educational and informational blockchain
                information to users all around the galaxy. And we think we've been doing that pretty well.
              </p>
              <p className="mb-4 text-lg leading-relaxed text-gray-400">
                Between this blog, our <a href="#" className="underline text-coinlect-accent hover:text-coinlect-accent/80">YouTube channel</a>, and the super secret <a href="#" className="underline text-coinlect-accent hover:text-coinlect-accent/80">CB Insider group</a> we're reaching well
                over 3 million people a month – and that feels great. We plan on continuing to provide the same
                awesome information and videos, and to grow our community – that's you lovely reader – into a
                source of huge support and a place where you can really bootstrap your education on blockchain and
                the cryptoverse.
              </p>
              <p className="text-lg leading-relaxed text-gray-400">
                So strap in and join us on a journey to the crypto-galaxy!
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center items-center">
              <img src="https://assets.website-files.com/604e76a6d093530e1577908b/6059d0426d83e33b092df4ff_CoinBureauLogo.png" alt="Coin Bureau Logo" className="w-2/3 h-auto" />
            </div>
          </div>
        </ScrollReveal>

        {/* Our Mission Section */}
        <ScrollReveal delay={200}>
          <div className="flex flex-col-reverse items-center gap-12 mb-20 md:flex-row md:justify-between">
            <div className="md:w-1/2 flex justify-center items-center">
              <img src="https://assets.website-files.com/604e76a6d093530e1577908b/6059d0426d83e33b092df4ff_CoinBureauLogo.png" alt="Our Mission" className="w-2/3 h-auto" />
            </div>
            <div className="md:w-1/2">
              <h2 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
                Our <span className="text-coinlect-accent">Mission</span>
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-gray-400">
                Our mission is to help pave the road towards cryptocurrency mass adoption through education:
                one person at a time.
              </p>
              <p className="mb-4 text-lg leading-relaxed text-gray-400">
                We pride ourselves on providing high-quality and unbiased content.
              </p>
              <p className="text-lg leading-relaxed text-gray-400">
                Our community has come to expect only the most genuine and honest crypto coverage from us,
                and we never let them down. From day one, the Coin Bureau has been a source of trustworthy
                news, reviews, updates, and everything else crypto-related. That will continue to be what drives
                us as we welcome to the fold anyone who seeks to learn more about navigating the complex and
                wonderful world of crypto.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Meet Our Team Members Section */}
        <ScrollReveal delay={400}>
          <div className="text-center mb-16">
            <h2 className="mb-12 text-4xl font-extrabold text-white md:text-5xl">
              Meet Our <span className="text-coinlect-accent">Team Members</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {TEAM_MEMBERS.map((member, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-32 h-32 mb-4 rounded-full shadow-lg"
                  />
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="mb-3 text-sm text-gray-400">{member.title}</p>
                  <div className="flex gap-3">
                    {member.socials.twitter && (
                      <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-coinlect-accent">
                        <Twitter size={20} />
                      </a>
                    )}
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-coinlect-accent">
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



