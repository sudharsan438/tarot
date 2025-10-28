import React, { useState, useEffect, useCallback } from 'react';
import { TarotCardType, GameState } from './types';
import { TAROT_DECK } from './constants';
import { getFortune } from './services/geminiService';
import TarotCard from './components/TarotCard';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-yellow-400"></div>
    <p className="text-yellow-200 text-lg" style={{ fontFamily: 'serif' }}>ஆவிகள் கிசுகிசுக்கின்றன...</p>
  </div>
);

const App: React.FC = () => {
  const [cards, setCards] = useState<TarotCardType[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.PICKING);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [fortune, setFortune] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [shuffleKey, setShuffleKey] = useState<number>(0);

  const shuffleCards = useCallback(<T,>(array: T[]): T[] => {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array];
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
  }, []);

  useEffect(() => {
    setCards(shuffleCards(TAROT_DECK));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = async (index: number) => {
    if (gameState !== GameState.PICKING || isShuffling) return;

    setSelectedCardIndex(index);
    setGameState(GameState.REVEALING);
    setIsLoading(true);

    // Allow flip animation to be seen before fetching
    setTimeout(async () => {
      const card = cards[index];
      const result = await getFortune(card.name);
      setFortune(result);
      setIsLoading(false);
      setGameState(GameState.FORTUNE_SHOWN);
    }, 1200);
  };

  const handleReset = () => {
    setGameState(GameState.PICKING);
    setSelectedCardIndex(null);
    setFortune('');
    // A little delay to let cards fade back in
    setTimeout(() => {
        setCards(shuffleCards(TAROT_DECK));
        setShuffleKey(prev => prev + 1);
    }, 500);
  };

  const handleReshuffle = () => {
    if (isShuffling) return;
    setIsShuffling(true);
    setTimeout(() => {
        setCards(shuffleCards(TAROT_DECK));
        setShuffleKey(prev => prev + 1);
        setIsShuffling(false);
    }, 500); // Corresponds to the transition duration
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden"
         style={{backgroundImage: 'radial-gradient(circle at top left, rgba(128,0,128,0.3), transparent 40%), radial-gradient(circle at bottom right, rgba(255,215,0,0.2), transparent 40%)'}}>
      <header className="text-center mb-2 transition-all duration-500">
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-300" style={{ fontFamily: 'serif', textShadow: '0 0 10px #fef08a' }}>
          Tarot தெய்வங்கள் காத்திருக்கின்றன
        </h1>
        <p className={`text-yellow-100 text-lg mt-2 transition-opacity duration-500 ${gameState !== GameState.PICKING ? 'opacity-0' : 'opacity-100'}`}>
          இன்றைய உங்கள் விதியை வெளிப்படுத்த ஒரு அட்டையைத் தேர்ந்தெடுக்கவும்.
        </p>
      </header>

      {gameState === GameState.PICKING && (
          <div className="h-16 flex items-center justify-center">
              {!isShuffling && (
                  <button
                      onClick={handleReshuffle}
                      className="bg-transparent border border-yellow-400/50 text-yellow-300 font-serif py-2 px-6 rounded-full hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105"
                  >
                      கட்டுகளைக் கலைக்கவும்
                  </button>
              )}
          </div>
      )}

      <main className="w-full flex-grow flex items-center justify-center">
        {gameState === GameState.PICKING && (
          <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 md:gap-4 max-w-7xl w-full px-2 transition-opacity duration-500 ${isShuffling ? 'opacity-0' : 'opacity-100'}`}>
            {cards.map((card, index) => (
              <div 
                key={`${shuffleKey}-${card.id}`}
                className="aspect-[2/3] animate-grid-item-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TarotCard
                  card={card}
                  isFlipped={false}
                  isFaded={false}
                  onClick={() => handleCardClick(index)}
                />
              </div>
            ))}
          </div>
        )}

        {gameState !== GameState.PICKING && selectedCardIndex !== null && (
          <div className="flex flex-col items-center justify-center w-full max-w-md">
            <div className="w-64 h-auto aspect-[2/3] mb-8">
              <TarotCard
                card={cards[selectedCardIndex]}
                isFlipped={true}
                isFaded={false}
                onClick={() => {}}
              />
            </div>

            <div className="w-full text-center p-6 bg-black bg-opacity-30 rounded-lg border border-yellow-400/50 shadow-lg min-h-[150px] flex items-center justify-center">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="flex flex-col items-center animate-fade-in">
                    <p 
                        className="text-amber-300 italic text-lg leading-relaxed whitespace-pre-wrap" 
                        style={{fontFamily: 'serif', textShadow: '0 0 8px rgba(252, 211, 77, 0.5)'}}
                    >
                        {fortune}
                    </p>
                    <button 
                        onClick={handleReset}
                        className="mt-6 bg-transparent border-2 border-yellow-400/80 text-yellow-300 font-bold font-serif py-2 px-6 rounded-full hover:bg-yellow-400/10 hover:border-yellow-300 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-yellow-400/20 transform hover:scale-105"
                        style={{animationDelay: '200ms'}}
                    >
                        மீண்டும் விதியைக் கேளுங்கள்
                    </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        @keyframes grid-item-fade-in {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-grid-item-fade-in {
          animation: grid-item-fade-in 0.5s ease-out forwards;
          opacity: 0; /* Start hidden for animation */
        }
        @keyframes card-content-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-content-fade-in {
          animation: card-content-fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
