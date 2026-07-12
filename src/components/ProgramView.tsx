import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Edit2, Calendar, Dumbbell, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import { Program, ProgramSession } from '../types';

interface ProgramViewProps {
  program: Program;
  onBack: () => void;
  onStartSession: (session: ProgramSession) => void;
}

export default function ProgramView({ program, onBack, onStartSession }: ProgramViewProps) {
  
  // Calculate completed sessions percentage
  const totalSessions = program.sessions.length;
  const completedCount = program.sessions.filter(s => s.completed).length;
  const progressPercent = totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar font-sans bg-black">
      
      {/* Top Navigation Row */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-900 shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-neutral-900/80 border border-neutral-800/50 flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Custom Program</span>
        <div className="w-8 h-8" /> {/* spacer */}
      </div>

      {/* Hero Banner with Silhouette Backlight */}
      <div className="relative h-[200px] shrink-0">
        <img
          src={program.image}
          alt={program.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.05]"
        />
        {/* Deep bottom gradient fading to black */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-5 inset-x-6">
          <span className="text-[9px] uppercase font-mono tracking-wider text-brand-gold bg-neutral-900/90 border border-brand-gold/15 px-2.5 py-0.5 rounded">
            YOUR PROGRAM
          </span>
          <h1 className="text-2xl font-display font-bold tracking-tight text-white mt-1.5 leading-none">
            {program.title}
          </h1>
        </div>
      </div>

      {/* Main Core Body */}
      <div className="flex-1 px-5 py-4 space-y-6">
        
        {/* Date start/end cards (Screenshot 3 style) */}
        <div className="grid grid-cols-2 gap-2 bg-neutral-900/35 border border-neutral-900/80 p-4 rounded-xl">
          <div className="border-r border-neutral-800/80 pr-2">
            <span className="text-[10px] font-mono tracking-wider text-neutral-500 block uppercase">Start</span>
            <span className="text-sm font-semibold text-neutral-200 mt-1 block">{program.startDate}</span>
          </div>
          <div className="pl-4">
            <span className="text-[10px] font-mono tracking-wider text-neutral-500 block uppercase">End</span>
            <span className="text-sm font-semibold text-neutral-200 mt-1 block">{program.endDate}</span>
          </div>
        </div>

        {/* Custom Progress bar */}
        <div className="space-y-1.5 bg-neutral-950/40 border border-neutral-900 p-4 rounded-xl">
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-neutral-400">Program Completion</span>
            <span className="font-mono text-brand-gold font-bold">{completedCount}/{totalSessions} Sessions done</span>
          </div>
          <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-gold rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Required Sessions Header */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Required Sessions</h3>
            <button className="text-[11px] font-mono text-neutral-500 hover:text-white flex items-center gap-1">
              Edit <Edit2 className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* List of Sessions */}
          <div className="space-y-2.5">
            {program.sessions.map((sess) => (
              <div
                key={sess.id}
                className={`relative overflow-hidden bg-neutral-900/25 border rounded-xl p-3.5 flex items-center justify-between transition-all duration-300 ${
                  sess.completed ? 'border-neutral-800/40 opacity-70' : 'border-neutral-900/90 hover:border-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-950 relative border border-neutral-850">
                    <img
                      src={sess.thumbnail}
                      alt={sess.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {sess.completed && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                  </div>

                  {/* Info details */}
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate leading-tight">{sess.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{sess.type}</p>
                    <p className="text-[10px] font-mono text-neutral-500 mt-0.5">{sess.movesCount} Moves • {sess.duration}m</p>
                  </div>
                </div>

                {/* Right side check/start */}
                <div>
                  {sess.completed ? (
                    <span className="text-[9px] uppercase font-mono bg-neutral-900/60 text-emerald-400 border border-emerald-950 px-2.5 py-1 rounded-full">
                      Done
                    </span>
                  ) : (
                    <button
                      onClick={() => onStartSession(sess)}
                      className="px-4 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold rounded-full transition shadow-md"
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended for Today Banner */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <Calendar className="w-4 h-4 text-brand-gold" />
            <span>Recommended for Today</span>
          </div>
          <button className="text-[10px] font-mono tracking-wider text-neutral-400 hover:text-white uppercase border border-neutral-800 px-2.5 py-1 rounded-md transition">
            Add to Cal
          </button>
        </div>

      </div>
    </div>
  );
}
