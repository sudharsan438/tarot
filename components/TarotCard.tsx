import React from 'react';
import { TarotCardType } from '../types';

interface TarotCardProps {
  card: TarotCardType;
  isFlipped: boolean;
  onClick: () => void;
  isFaded: boolean;
}

const TarotCard: React.FC<TarotCardProps> = ({ card, isFlipped, onClick, isFaded }) => {
  return (
    <div
      className={`group relative w-full h-full transition-opacity duration-700 ${isFaded ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-transform duration-300 ease-in-out hover:scale-105`}
      style={{ perspective: '1000px' }}
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-1000 cursor-pointer`}
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Card Back */}
        <div 
          className="absolute w-full h-full rounded-xl shadow-lg shadow-yellow-900/50 bg-indigo-900 p-2 border-2 border-yellow-400 transition-shadow duration-300 ease-in-out group-hover:shadow-xl group-hover:shadow-yellow-400/50"
          style={{ backfaceVisibility: 'hidden', backgroundImage: 'radial-gradient(circle, #fde047 1px, transparent 1px), radial-gradient(circle, #fde047 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}
        >
          <div className="w-full h-full border-2 border-yellow-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2.25a.75.75 0 01.75.75v.516c.36.08.706.186 1.04.316c.333.13.655.282.955.451c1.393.75 2.536 1.94 3.255 3.39c.33.67.514 1.39.549 2.133a.75.75 0 01-1.498.07c-.03-.63-.18-1.23-.44-1.766a3.24 3.24 0 00-4.92-2.31c-.34.34-.61.74-.79 1.18c-.18.44-.29.92-.32 1.42a.75.75 0 01-1.5 0c-.03-.5-.14-1-.32-1.42a4.73 4.73 0 00-.79-1.18a3.24 3.24 0 00-4.92 2.31c-.26.536-.41 1.136-.44 1.766a.75.75 0 01-1.498-.07c.035-.743.22-1.463.549-2.133c.72-1.45 1.862-2.64 3.255-3.39c.3-.17.622-.32.955-.451c.334-.13.68-.236 1.04-.316V3a.75.75 0 01.75-.75zM12 21a8.25 8.25 0 008.25-8.25c0-4.47-3.52-8.11-7.98-8.24a.75.75 0 00-.54.54c-.13 4.46-3.77 7.98-8.24 7.98A8.25 8.25 0 0012 21z" />
            </svg>
          </div>
        </div>
        
        {/* Card Front */}
        <div 
          className="absolute w-full h-full rounded-xl shadow-2xl shadow-yellow-500/60 bg-black p-2 border-2 border-yellow-400 overflow-hidden" 
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <img 
            src={card.image} 
            alt={card.name} 
            className={`w-full h-full object-cover rounded-lg filter saturate-125 contrast-110 ${isFlipped ? 'animate-card-content-fade-in' : 'opacity-0'}`} 
            style={{animationDelay: '400ms'}}
          />
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-center p-2 ${isFlipped ? 'animate-card-content-fade-in' : 'opacity-0'}`}
            style={{animationDelay: '600ms'}}
          >
            <h3 className="text-sm md:text-lg font-semibold text-yellow-300 tracking-wider" style={{fontFamily: 'serif'}}>{card.name}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCard;