import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Share2, Star, Clock, MapPin, Sparkles, Check, X } from 'lucide-react';
import { GymClass } from '../types';

interface ClassDetailProps {
  gymClass: GymClass;
  onClose: () => void;
  onBookToggle: (id: string) => void;
}

export default function ClassDetail({ gymClass, onClose, onBookToggle }: ClassDetailProps) {
  // Renders segmented bar markers for Strength, Cardio, etc.
  const renderBars = (value: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 w-8 rounded-sm transition-all duration-300 ${
              i <= value ? 'bg-white' : 'bg-neutral-800'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed top-0 bottom-0 right-0 left-auto w-full md:max-w-[480px] bg-neutral-950 z-50 flex flex-col overflow-y-auto no-scrollbar font-sans border-l border-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
      {/* Top Banner Image */}
      <div className="relative h-[280px] w-full shrink-0">
        <img
          src={gymClass.image}
          alt={gymClass.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-90"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/60" />

        {/* Top Header Row within Detail */}
        <div className="absolute top-4 inset-x-0 flex items-center justify-between px-5">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition">
              <Share2 className="w-4.5 h-4.5 text-white" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition">
              <Star className="w-4.5 h-4.5 text-white" />
            </button>
          </div>
        </div>

        {/* Absolute Title overlays */}
        <div className="absolute bottom-6 left-6 right-6">
          {gymClass.isEquinoxExclusive && (
            <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-brand-gold bg-neutral-900/85 px-2 py-0.5 rounded mb-2 border border-brand-gold/20">
              <Sparkles className="w-2.5 h-2.5 fill-brand-gold text-transparent" /> Dragon Gym Exclusive
            </span>
          )}
          <h1 className="text-3xl font-display font-semibold tracking-tight text-white mb-1 leading-tight">
            {gymClass.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="text-[#FF5A5F] font-bold tracking-wider text-[11px] uppercase">{gymClass.category}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            <span>{gymClass.level}</span>
          </div>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Logistics row */}
        <div className="grid grid-cols-2 gap-4 border-y border-neutral-900 py-4 text-xs">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Clock className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Duration</p>
              <p className="font-semibold">{gymClass.duration} minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-neutral-300">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Location</p>
              <p className="font-semibold truncate max-w-[120px]">{gymClass.location}</p>
            </div>
          </div>
        </div>

        {/* Coach / Instructor Info */}
        <div className="flex items-center justify-between bg-neutral-900/45 border border-neutral-900 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-muted-gold/20 flex items-center justify-center text-brand-gold font-display font-bold">
              {gymClass.instructor.split(' ')[0][0]}
            </div>
            <div>
              <p className="text-xs text-neutral-500">Class Instructor</p>
              <p className="text-sm font-semibold text-white">{gymClass.instructor}</p>
            </div>
          </div>
          <span className="text-xs text-neutral-400 border border-neutral-800 px-2.5 py-1 rounded-full">Elite Coach</span>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Class description</h3>
          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {gymClass.description}
          </p>
        </div>

        {/* Class Breakdown metrics */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Class breakdown</h3>
          
          <div className="space-y-3 bg-neutral-900/20 border border-neutral-900/50 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400 tracking-wider">STRENGTH</span>
              {renderBars(gymClass.breakdown.strength)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400 tracking-wider">CARDIO</span>
              {renderBars(gymClass.breakdown.cardio)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400 tracking-wider">ATHLETICISM</span>
              {renderBars(gymClass.breakdown.athleticism)}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Booking Action Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/95 to-transparent px-6 pb-6 pt-4 border-t border-neutral-900/80 z-30 flex gap-3">
        <button
          onClick={() => onBookToggle(gymClass.id)}
          className={`flex-1 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            gymClass.booked
              ? 'bg-neutral-800 hover:bg-neutral-700 text-red-400 border border-red-950'
              : 'bg-white hover:bg-neutral-200 text-black'
          }`}
        >
          {gymClass.booked ? (
            <>
              <X className="w-4 h-4" /> Cancel Booking
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Book Class ({gymClass.time})
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
