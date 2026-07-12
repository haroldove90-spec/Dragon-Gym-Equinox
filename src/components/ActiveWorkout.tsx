import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronLeft, Check, Trophy, Flame, ChevronRight } from 'lucide-react';
import { ProgramSession } from '../types';

interface ActiveWorkoutProps {
  session: ProgramSession;
  onClose: () => void;
  onComplete: (sessionId: string) => void;
}

export default function ActiveWorkout({ session, onClose, onComplete }: ActiveWorkoutProps) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Initialize completed sets map based on sets count for each move
  useEffect(() => {
    const initialSets: Record<number, boolean[]> = {};
    session.moves.forEach((move, index) => {
      initialSets[index] = Array(move.sets).fill(false);
    });
    setCompletedSets(initialSets);
  }, [session]);

  // Stopwatch timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isFinished]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleSet = (moveIdx: number, setIdx: number) => {
    const setsCopy = { ...completedSets };
    if (setsCopy[moveIdx]) {
      setsCopy[moveIdx][setIdx] = !setsCopy[moveIdx][setIdx];
      setCompletedSets(setsCopy);
    }

    // Auto-check if all sets for the current move are done to offer prompt
    const currentMoveSets = setsCopy[moveIdx];
    if (currentMoveSets && currentMoveSets.every(Boolean)) {
      // Small delay then offer next move
      if (moveIdx < session.moves.length - 1) {
        setTimeout(() => {
          setCurrentMoveIndex(moveIdx + 1);
        }, 600);
      }
    }
  };

  const handleFinishWorkout = () => {
    setIsFinished(true);
    setIsActive(false);
    setTimeout(() => {
      onComplete(session.id);
    }, 3000);
  };

  const currentMove = session.moves[currentMoveIndex];
  const allMovesCompleted = Object.values(completedSets).every((sets: any) => sets.every(Boolean));

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans select-none">
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="active-workout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full max-w-2xl mx-auto w-full border-x border-neutral-900/45"
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-neutral-900 flex items-center justify-between">
              <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition">
                <ChevronLeft className="w-4 h-4" /> Exit
              </button>
              <div className="text-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gold">ACTIVE SESSION</span>
                <p className="text-xs text-white/90 font-semibold truncate max-w-[180px]">{session.title}</p>
              </div>
              <div className="w-12 h-4" /> {/* spacer */}
            </div>

            {/* Timer Banner */}
            <div className="bg-neutral-900/40 border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Elapsed Time</p>
                <p className="text-2xl font-mono font-bold tracking-tight text-white">{formatTime(seconds)}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition"
                >
                  {isActive ? <Pause className="w-4.5 h-4.5 text-white" /> : <Play className="w-4.5 h-4.5 text-brand-gold fill-brand-gold" />}
                </button>
                <button
                  onClick={() => { if(confirm('Reset Timer?')) setSeconds(0); }}
                  className="w-10 h-10 rounded-full bg-neutral-900/50 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition"
                >
                  <RotateCcw className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Exercise Details Slider */}
            {currentMove && (
              <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-[#FF5A5F] font-bold">
                      Movement {currentMoveIndex + 1} of {session.moves.length}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium bg-neutral-900 px-2 py-0.5 rounded">
                      {currentMove.reps}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-semibold text-white leading-tight">
                    {currentMove.name}
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    {currentMove.description}
                  </p>
                </div>

                {/* Sets check-off list */}
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Track Sets</h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {Array.from({ length: currentMove.sets }).map((_, setIdx) => {
                      const isSetDone = completedSets[currentMoveIndex]?.[setIdx] || false;
                      return (
                        <button
                          key={setIdx}
                          onClick={() => toggleSet(currentMoveIndex, setIdx)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left ${
                            isSetDone
                              ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                              : 'bg-neutral-900/30 border-neutral-800/80 hover:border-neutral-700 text-white'
                          }`}
                        >
                          <span className="text-xs font-mono">SET {setIdx + 1}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-neutral-400">{currentMove.reps}</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                              isSetDone
                                ? 'bg-brand-gold border-brand-gold text-black'
                                : 'border-neutral-700 text-transparent'
                            }`}>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Move Switcher Dots */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  {session.moves.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentMoveIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentMoveIndex ? 'w-6 bg-white' : 'w-1.5 bg-neutral-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Panel */}
            <div className="p-6 bg-gradient-to-t from-black via-black to-neutral-950/20 border-t border-neutral-950">
              <div className="flex items-center justify-between gap-3 mb-3">
                <button
                  disabled={currentMoveIndex === 0}
                  onClick={() => setCurrentMoveIndex(currentMoveIndex - 1)}
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:hover:bg-neutral-900 rounded-xl text-xs font-semibold transition"
                >
                  Prev Move
                </button>
                <button
                  disabled={currentMoveIndex === session.moves.length - 1}
                  onClick={() => setCurrentMoveIndex(currentMoveIndex + 1)}
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:hover:bg-neutral-900 rounded-xl text-xs font-semibold transition"
                >
                  Next Move
                </button>
              </div>

              <button
                onClick={handleFinishWorkout}
                className={`w-full py-4 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  allMovesCompleted
                    ? 'bg-brand-gold text-black hover:bg-brand-gold/90 shadow-[0_4px_20px_rgba(212,175,55,0.25)]'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Check className="w-4.5 h-4.5" /> Complete Workout Session
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-celebration"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-neutral-950 text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-20 h-20 rounded-full bg-brand-gold/15 border border-brand-gold flex items-center justify-center mb-6"
            >
              <Trophy className="w-10 h-10 text-brand-gold" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-display font-bold tracking-tight text-white mb-2"
            >
              Session Complete!
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-neutral-400 max-w-[240px] leading-relaxed mb-6"
            >
              Well done, Molly. Your progress is saved and your check-in history has been synchronized.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-full"
            >
              <Flame className="w-4.5 h-4.5 text-[#FF5A5F]" />
              <span className="text-xs font-mono font-medium text-white">REGENERATED +25 PTS</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
