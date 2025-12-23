import React from 'react';

interface FrameworkColumnProps {
  title: string;
  items: { icon: React.ReactNode; text: string; link: string; }[];
}

const FrameworkColumn: React.FC<FrameworkColumnProps> = ({ title, items }) => {
  return (
    <div className="flex flex-col gap-4 px-6 py-8">
      <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
        {title}
      </h3>

      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item.text}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-colors text-slate-400 hover:text-white"
            >
              {item.icon}
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default FrameworkColumn;
