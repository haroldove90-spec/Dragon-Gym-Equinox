import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, SlidersHorizontal, BookOpen, Clock, Flame, ChevronRight } from 'lucide-react';
import { GymClass, Article } from '../types';
import { exploreCategories } from '../data';

interface ExploreViewProps {
  classes: GymClass[];
  articles: Article[];
  onOpenClass: (gymClass: GymClass) => void;
  onOpenArticle: (article: Article) => void;
}

export default function ExploreView({ classes, articles, onOpenClass, onOpenArticle }: ExploreViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter logic based on category grid selection or search term
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory) {
      // Simple tag checks
      if (activeCategory === 'Clases en el Club' && cls.isEquinoxExclusive) return matchesSearch;
      if (activeCategory === 'Clases On-Demand' && !cls.isEquinoxExclusive) return matchesSearch;
      if (activeCategory === 'Estudio de Pilates' && cls.category === 'Pilates') return matchesSearch;
      if (activeCategory === 'Biblioteca de Movimientos' && (cls.category === 'Strength' || cls.category === 'Funcional')) return matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar font-sans px-5 pb-24">
      {/* Title Header */}
      <div className="flex items-center justify-between py-4 shrink-0">
        <h2 className="text-3xl font-display font-semibold tracking-tight text-white">Explorar</h2>
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400" />
        </div>
      </div>

      {/* Interactive Search Bar wrapper */}
      <div className="mb-5 shrink-0">
        <div className="relative flex items-center bg-neutral-900/60 border border-neutral-800/80 rounded-xl px-3.5 py-2.5">
          <Search className="w-4 h-4 text-neutral-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar entrenamientos, entrenadores, programas..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder-neutral-500 w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[10px] uppercase font-mono text-neutral-500 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filter Category Header (if active) */}
      {activeCategory && (
        <div className="flex items-center justify-between bg-neutral-900/30 border border-neutral-900 p-3 rounded-xl mb-4 shrink-0">
          <span className="text-xs text-brand-gold font-medium">Viendo {activeCategory}</span>
          <button
            onClick={() => setActiveCategory(null)}
            className="text-[10px] font-mono text-neutral-400 hover:text-white uppercase tracking-wider underline decoration-brand-gold decoration-2"
          >
            Mostrar Todo
          </button>
        </div>
      )}

      {/* GRID CATEGORIES (Screenshot 2 style grid) */}
      {!activeCategory && !searchQuery ? (
        <div className="grid grid-cols-2 gap-2.5 shrink-0 mb-6">
          {exploreCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className="relative h-[86px] rounded-xl overflow-hidden group text-left border border-neutral-900 hover:border-neutral-800 transition duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-[0.48] transition duration-500"
              />
              {/* Central text overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
                <span className="text-[11px] font-display font-medium text-white tracking-wide uppercase leading-snug">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Filtered List of Classes */
        <div className="space-y-3 shrink-0 mb-6">
          <h3 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            Se encontraron {filteredClasses.length} coincidencia{filteredClasses.length !== 1 ? 's' : ''}
          </h3>
          
          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5">
              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => onOpenClass(cls)}
                  className="flex bg-neutral-900/40 border border-neutral-900 hover:border-neutral-800 rounded-xl p-3 items-center gap-3 cursor-pointer transition"
                >
                  <img
                    src={cls.image}
                    alt={cls.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-mono text-brand-gold uppercase tracking-wider">{cls.category}</p>
                    <h4 className="text-sm font-semibold text-white truncate leading-tight">{cls.title}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{cls.instructor} • {cls.duration}m</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 text-right">
                    <span className="text-xs font-mono font-bold text-white bg-neutral-950 px-2 py-0.5 rounded">{cls.time}</span>
                    {cls.booked && <span className="text-[8px] uppercase tracking-wider text-emerald-400 mt-1">Reservado</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-neutral-500 bg-neutral-900/20 border border-neutral-900 rounded-xl">
              No se encontraron entrenamientos de club correspondientes. Intenta otra búsqueda.
            </div>
          )}
        </div>
      )}

      {/* FEATURED CONTENT SHELF (Screenshot 2 style bottom section) */}
      <div className="space-y-4 shrink-0">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Contenido destacado</h3>
        
        {/* Horizontal scroll shelf of classes */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => onOpenClass(cls)}
              className="min-w-[190px] w-[190px] group cursor-pointer flex flex-col bg-neutral-900/30 border border-neutral-900 rounded-xl overflow-hidden hover:border-neutral-800 transition"
            >
              <div className="h-[105px] relative">
                <img
                  src={cls.image}
                  alt={cls.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-[0.85] group-hover:scale-105 transition duration-500"
                />
                {cls.booked && (
                  <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-mono font-bold bg-emerald-500/90 text-white px-2 py-0.5 rounded-full">
                    Reservado
                  </span>
                )}
                {cls.isEquinoxExclusive && (
                  <span className="absolute top-2 left-2 text-[8px] uppercase tracking-wider font-mono font-bold bg-neutral-950/90 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/10">
                    EXCL
                  </span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <h4 className="text-xs font-semibold text-white group-hover:text-brand-gold transition truncate">
                  {cls.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>{cls.category}</span>
                  <span className="font-mono text-neutral-500">{cls.duration} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
