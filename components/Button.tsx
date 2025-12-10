import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  withArrow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  withArrow = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };
  
  const baseStyles = `rounded-md font-medium transition-all duration-300 flex items-center justify-center gap-2 ${sizeStyles[size]}`;
  
  const variants = {
    primary: "bg-coinlect-accent text-black hover:bg-yellow-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    secondary: "bg-coinlect-card border border-white/10 text-white hover:bg-white/5 hover:border-white/20",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
    ghost: "bg-transparent text-gray-400 hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {withArrow && <ArrowUpRight className="w-4 h-4" />}
    </button>
  );
};