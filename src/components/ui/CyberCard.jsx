import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CyberCard = ({ children, className, title }) => {
  return (
    <div className={cn(
      "relative bg-cyber-gray/50 border border-cyber-green/30 p-4 rounded-sm overflow-hidden backdrop-blur-sm",
      "hover:border-cyber-green/60 transition-colors duration-300",
      className
    )}>
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-green"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-green"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-green"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-green"></div>

      {title && (
        <div className="mb-4 border-b border-cyber-green/20 pb-2">
          <h3 className="text-cyber-green font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></span>
            {title}
          </h3>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default CyberCard;
