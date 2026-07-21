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
  onOpenAdminPortal: () => void;
  onOpenStaffPortal: () => void;
  onOpenSocioPortal: () => void;
  onOpenCoachPortal: () => void;
}

export default function DashboardView({
  user,
  articles,
  onOpenCheckIn,
  onNavigateToExplore,
  onOpenArticle,
  onOpenAdminPortal,
  onOpenStaffPortal,
  onOpenSocioPortal,
  onOpenCoachPortal
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
          Explorar
        </button>
      </div>

      {/* THREE ROLE ACCESS CHANNELS - INSPIRED BY USER IMAGE */}
      <div className="pb-8 space-y-4 shrink-0 mt-6">
        <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
          <h3 className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold">PORTALES DE ACCESO POR ROL</h3>
          <span className="text-[9px] font-mono text-neutral-500 uppercase">Suite Interactiva</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3.5">
          {/* Admin Card */}
          <div
            onClick={onOpenAdminPortal}
            id="role-btn-admin"
            className="group cursor-pointer relative h-[105px] rounded-2xl overflow-hidden border border-neutral-900/80 hover:border-brand-gold/30 transition duration-300 shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop"
              alt="Portal Administrador"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-[0.4] group-hover:scale-[1.01] transition duration-500"
            />
            <div className="absolute inset-0 bg-neutral-950/25 group-hover:bg-neutral-950/15 transition" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-sm md:text-base font-display font-black tracking-[0.3em] text-white uppercase group-hover:text-brand-gold transition duration-300">
                PORTAL ADMINISTRADOR
              </span>
              <span className="text-[9px] font-mono tracking-wider text-neutral-400 mt-1 uppercase opacity-80 group-hover:opacity-100 transition">
                Métricas y Gestión de Horarios
              </span>
            </div>
          </div>

          {/* Staff Card */}
          <div
            onClick={onOpenStaffPortal}
            id="role-btn-staff"
            className="group cursor-pointer relative h-[105px] rounded-2xl overflow-hidden border border-neutral-900/80 hover:border-brand-gold/30 transition duration-300 shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop"
              alt="Portal Staff"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-[0.4] group-hover:scale-[1.01] transition duration-500"
            />
            <div className="absolute inset-0 bg-neutral-950/25 group-hover:bg-neutral-950/15 transition" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-sm md:text-base font-display font-black tracking-[0.3em] text-white uppercase group-hover:text-brand-gold transition duration-300">
                PORTAL STAFF
              </span>
              <span className="text-[9px] font-mono tracking-wider text-neutral-400 mt-1 uppercase opacity-80 group-hover:opacity-100 transition">
                Registro de Entrada y Asistencia
              </span>
            </div>
          </div>

          {/* Socio Card */}
          <div
            onClick={onOpenSocioPortal}
            id="role-btn-socio"
            className="group cursor-pointer relative h-[105px] rounded-2xl overflow-hidden border border-neutral-900/80 hover:border-brand-gold/30 transition duration-300 shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"
              alt="Portal Socio"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-[0.4] group-hover:scale-[1.01] transition duration-500"
            />
            <div className="absolute inset-0 bg-neutral-950/25 group-hover:bg-neutral-950/15 transition" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-sm md:text-base font-display font-black tracking-[0.3em] text-white uppercase group-hover:text-brand-gold transition duration-300">
                PORTAL SOCIO
              </span>
              <span className="text-[9px] font-mono tracking-wider text-neutral-400 mt-1 uppercase opacity-80 group-hover:opacity-100 transition">
                Perfil de Atleta, Pagos y Objetivos
              </span>
            </div>
          </div>

          {/* Coach / Entrenador Card */}
          <div
            onClick={onOpenCoachPortal}
            id="role-btn-coach"
            className="group cursor-pointer relative h-[105px] rounded-2xl overflow-hidden border border-neutral-900/80 hover:border-brand-gold/30 transition duration-300 shadow-md"
          >
            <img
              src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600&auto=format&fit=crop"
              alt="Portal Entrenador / Coach"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-[0.4] group-hover:scale-[1.01] transition duration-500"
            />
            <div className="absolute inset-0 bg-neutral-950/25 group-hover:bg-neutral-950/15 transition" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-sm md:text-base font-display font-black tracking-[0.3em] text-white uppercase group-hover:text-brand-gold transition duration-300">
                PORTAL ENTRENADOR / COACH
              </span>
              <span className="text-[9px] font-mono tracking-wider text-neutral-400 mt-1 uppercase opacity-80 group-hover:opacity-100 transition">
                Seguimiento Técnico y Ajuste de Rutinas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-only focused layout - No promotional grids */}

    </div>
  );
}
