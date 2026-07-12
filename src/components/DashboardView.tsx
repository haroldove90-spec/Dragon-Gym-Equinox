import React from 'react';
import { motion } from 'motion/react';
import { Search, Bell, Calendar, Sparkles, RefreshCw, ShoppingBag, Landmark } from 'lucide-react';
import { UserProfile, Article } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  articles: Article[];
  onOpenCheckIn: () => void;
  onNavigateToExplore: () => void;
  onOpenArticle: (article: Article) => void;
}

export default function DashboardView({
  user,
  articles,
  onOpenCheckIn,
  onNavigateToExplore,
  onOpenArticle
}: DashboardViewProps) {
  
  const shopArticle = articles.find(a => a.category === 'SHOP');
  const benefitArticle = articles.find(a => a.category === 'BENEFIT');

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar font-sans px-5 pb-24">
      {/* Top Header Row */}
      <div className="flex items-center justify-between py-4 shrink-0">
        <div className="flex items-center gap-3">
          {/* Avatar circle */}
          <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700/65 flex items-center justify-center font-display font-semibold text-sm text-brand-gold">
            {user.avatarLetter}
          </div>
          
          <div className="flex items-center gap-3.5 text-neutral-400">
            <button onClick={onNavigateToExplore} className="hover:text-white transition">
              <Search className="w-4.5 h-4.5" />
            </button>
            <button className="hover:text-white transition relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FF5A5F] rounded-full" />
            </button>
            <button className="hover:text-white transition">
              <Calendar className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <button
          onClick={onNavigateToExplore}
          className="px-3.5 py-1.5 rounded-full border border-neutral-800 text-xs font-semibold hover:bg-neutral-900 transition"
        >
          Book Class
        </button>
      </div>

      {/* Slideable cards container (Goals) */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 shrink-0">
        
        {/* CHECK-IN GOAL Card */}
        <div className="min-w-[280px] flex-1 bg-gradient-to-r from-neutral-900/80 to-neutral-950 border border-neutral-800/60 rounded-2xl p-4.5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-neutral-400">
            <span>CHECK-IN GOAL</span>
            <span className="text-brand-gold font-bold">WEEKLY</span>
          </div>
          
          <div className="space-y-2">
            {/* Custom linear progress bar matching screen */}
            <div className="h-1.5 w-full bg-neutral-800/80 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-brand-muted-gold via-white to-white rounded-full transition-all duration-700"
                style={{ width: `${(user.checkInCount / user.checkInGoal) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-white/95">{user.checkInCount} / {user.checkInGoal} Check-ins</span>
              {user.checkInCount >= user.checkInGoal && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">Goal Completed!</span>
              )}
            </div>
          </div>
        </div>

        {/* CLUBS VISITED Card (Second card swiper) */}
        <div className="min-w-[230px] bg-neutral-950/60 border border-neutral-900 rounded-2xl p-4.5 flex flex-col justify-between">
          <div className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Your Week</div>
          <div className="space-y-1 mt-3">
            <p className="text-sm font-semibold text-neutral-200">1 / 4 Sessions</p>
            <p className="text-[10px] text-neutral-500 font-light">Regenerate program active</p>
          </div>
        </div>
      </div>

      {/* Main Bold Welcome Header */}
      <div className="py-6 shrink-0">
        <h2 className="text-[32px] font-display font-light text-white leading-tight tracking-tight">
          Progress is power,<br />
          <span className="font-semibold">{user.name}. Let’s lock in.</span>
        </h2>
      </div>

      {/* Promotional / Shop & Benefit Grid */}
      <div className="space-y-5">
        
        {/* SHOP CARD */}
        {shopArticle && (
          <div
            onClick={() => onOpenArticle(shopArticle)}
            className="group cursor-pointer flex flex-col bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden hover:border-neutral-800 transition"
          >
            <div className="relative h-[180px] overflow-hidden">
              <img
                src={shopArticle.image}
                alt={shopArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 text-[9px] font-mono tracking-widest bg-neutral-950/90 text-white font-bold py-1 px-2.5 rounded border border-neutral-800/80 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3 text-brand-gold" /> SHOP
              </span>
            </div>
            <div className="p-4 space-y-1 bg-gradient-to-b from-neutral-950 to-neutral-950">
              <h3 className="text-base font-semibold font-display tracking-tight text-white group-hover:text-brand-gold transition">
                {shopArticle.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {shopArticle.subtitle}
              </p>
            </div>
          </div>
        )}

        {/* BENEFIT CARD */}
        {benefitArticle && (
          <div
            onClick={() => onOpenArticle(benefitArticle)}
            className="group cursor-pointer flex flex-col bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden hover:border-neutral-800 transition"
          >
            <div className="relative h-[180px] overflow-hidden">
              <img
                src={benefitArticle.image}
                alt={benefitArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-4 left-4 text-[9px] font-mono tracking-widest bg-neutral-950/90 text-white font-bold py-1 px-2.5 rounded border border-neutral-800/80 flex items-center gap-1">
                <Landmark className="w-3 h-3 text-brand-gold" /> BENEFIT
              </span>
            </div>
            <div className="p-4 space-y-1 bg-gradient-to-b from-neutral-950 to-neutral-950">
              <h3 className="text-base font-semibold font-display tracking-tight text-white group-hover:text-brand-gold transition">
                {benefitArticle.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {benefitArticle.subtitle}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Floating sticky Check in button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <motion.button
          onClick={onOpenCheckIn}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black px-6 py-3 rounded-full font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:bg-neutral-100 transition duration-300"
        >
          <RefreshCw className="w-4 h-4 stroke-[2.5] text-black animate-spin no-scrollbar" style={{ animationDuration: '8s' }} />
          Check in
        </motion.button>
      </div>
    </div>
  );
}
