import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Home as HomeIcon,
  Compass,
  Dumbbell,
  User as UserIcon,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

import DashboardView from './components/DashboardView';
import ExploreView from './components/ExploreView';
import ProgramView from './components/ProgramView';
import ClassDetail from './components/ClassDetail';
import ActiveWorkout from './components/ActiveWorkout';
import CheckInCard from './components/CheckInCard';
import AdminPortal from './components/AdminPortal';
import StaffPortal from './components/StaffPortal';
import SocioPortal from './components/SocioPortal';
import CoachPortal from './components/CoachPortal';

import { GymClass, Program, ProgramSession, Article, UserProfile } from './types';
import { mockUserProfile, mockClasses, mockPrograms, mockArticles } from './data';

export default function App() {
  // --- Persistent Storage State Manager ---
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('eqx_user_profile');
    return saved ? JSON.parse(saved) : mockUserProfile;
  });

  const [classes, setClasses] = useState<GymClass[]>(() => {
    const saved = localStorage.getItem('eqx_gym_classes');
    return saved ? JSON.parse(saved) : mockClasses;
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    const saved = localStorage.getItem('eqx_programs');
    return saved ? JSON.parse(saved) : mockPrograms;
  });

  // --- UI Routing State ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'explore' | 'programs' | 'profile'>('dashboard');
  const [activeClass, setActiveClass] = useState<GymClass | null>(null);
  const [activeSession, setActiveSession] = useState<ProgramSession | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showStaffPortal, setShowStaffPortal] = useState(false);
  const [showSocioPortal, setShowSocioPortal] = useState(false);
  const [showCoachPortal, setShowCoachPortal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerNotification = (message: string) => {
    setToastMessage(message);
    const timeoutId = setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3500);
    return () => clearTimeout(timeoutId);
  };

  // --- Synchronize changes with localStorage ---
  useEffect(() => {
    localStorage.setItem('eqx_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('eqx_gym_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('eqx_programs', JSON.stringify(programs));
  }, [programs]);

  // --- State Action Callbacks ---
  const handleBookToggle = (classId: string) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => (c.id === classId ? { ...c, booked: !c.booked } : c))
    );
    // If viewing the detailed card, update its active state too
    setActiveClass((prev) => (prev && prev.id === classId ? { ...prev, booked: !prev.booked } : prev));
  };

  const handleCompleteSession = (sessionId: string) => {
    setPrograms((prevProgs) =>
      prevProgs.map((prog) => ({
        ...prog,
        sessions: prog.sessions.map((sess) =>
          sess.id === sessionId ? { ...sess, completed: true } : sess
        ),
      }))
    );
    setActiveSession(null);
  };

  const handleConfirmCheckIn = () => {
    setUser((prev) => {
      const nextCount = prev.checkInCount + 1;
      return {
        ...prev,
        checkInCount: nextCount > prev.checkInGoal ? prev.checkInGoal : nextCount,
      };
    });
    setShowCheckInModal(false);
  };

  const handleResetState = () => {
    if (confirm('Clear simulated history and reset back to Dragon GYM defaults?')) {
      localStorage.removeItem('eqx_user_profile');
      localStorage.removeItem('eqx_gym_classes');
      localStorage.removeItem('eqx_programs');
      setUser(mockUserProfile);
      setClasses(mockClasses);
      setPrograms(mockPrograms);
      setActiveTab('dashboard');
      setActiveClass(null);
      setActiveSession(null);
      setActiveArticle(null);
      setShowCheckInModal(false);
    }
  };

  const handleNameChange = (newName: string) => {
    if (newName.trim()) {
      setUser((prev) => ({
        ...prev,
        name: newName,
        avatarLetter: newName.charAt(0).toUpperCase(),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-neutral-100 flex flex-col font-sans relative antialiased overflow-x-hidden select-none">
      
      {/* Decorative ambient background rings */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-200px] w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[150px] pointer-events-none" />

      {/* --- STICKY TOP NAV HEADER --- */}
      <header className="sticky top-0 inset-x-0 bg-[#070707]/90 backdrop-blur-md border-b border-neutral-900/85 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <h1 className="text-lg md:text-xl font-display font-bold tracking-[0.3em] text-white">
              DRAGON GYM
            </h1>
          </div>

          {/* Desktop/Tablet Horizontal Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-white transition py-1.5 relative ${
                activeTab === 'dashboard' ? 'text-white' : ''
              }`}
            >
              Inicio
              {activeTab === 'dashboard' && (
                <motion.span layoutId="activeHeaderTab" className="absolute bottom-[-2px] inset-x-0 h-[1.5px] bg-brand-gold rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className={`hover:text-white transition py-1.5 relative ${
                activeTab === 'explore' ? 'text-white' : ''
              }`}
            >
              Explorar
              {activeTab === 'explore' && (
                <motion.span layoutId="activeHeaderTab" className="absolute bottom-[-2px] inset-x-0 h-[1.5px] bg-brand-gold rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`hover:text-white transition py-1.5 relative ${
                activeTab === 'programs' ? 'text-white' : ''
              }`}
            >
              Programas
              {activeTab === 'programs' && (
                <motion.span layoutId="activeHeaderTab" className="absolute bottom-[-2px] inset-x-0 h-[1.5px] bg-brand-gold rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`hover:text-white transition py-1.5 relative ${
                activeTab === 'profile' ? 'text-white' : ''
              }`}
            >
              Mi Cuenta
              {activeTab === 'profile' && (
                <motion.span layoutId="activeHeaderTab" className="absolute bottom-[-2px] inset-x-0 h-[1.5px] bg-brand-gold rounded-full" />
              )}
            </button>
          </nav>

          {/* Header Action Elements */}
          <div className="flex items-center gap-4">
            {/* Quick Digital Pass Check-In */}
            <button
              onClick={() => setShowCheckInModal(true)}
              className="bg-white hover:bg-neutral-200 text-black px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition duration-300 shadow-md"
            >
              <RefreshCw className="w-3 h-3 stroke-[2.5]" />
              <span>Pass</span>
            </button>

            {/* Profile letter/avatar */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-8 h-8 rounded-full border flex items-center justify-center font-display font-semibold text-xs text-brand-gold transition duration-300 ${
                activeTab === 'profile' ? 'border-brand-gold bg-brand-gold/10' : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
              }`}
            >
              {user.avatarLetter}
            </button>
          </div>

        </div>
      </header>

      {/* --- MAIN PAGE CONTENT WRAPPER --- */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-8 flex flex-col min-h-0 relative z-10 pb-24 md:pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <DashboardView
                user={user}
                articles={mockArticles}
                onOpenCheckIn={() => setShowCheckInModal(true)}
                onNavigateToExplore={() => setActiveTab('explore')}
                onOpenArticle={(art) => setActiveArticle(art)}
                onOpenAdminPortal={() => setShowAdminPortal(true)}
                onOpenStaffPortal={() => setShowStaffPortal(true)}
                onOpenSocioPortal={() => {
                  setShowSocioPortal(true);
                  triggerNotification("Portal Socio: Bienvenido de vuelta al club.");
                }}
                onOpenCoachPortal={() => {
                  setShowCoachPortal(true);
                  triggerNotification("Portal Coach: Bienvenido, Coach.");
                }}
              />
            </motion.div>
          )}

          {activeTab === 'explore' && (
            <motion.div
              key="explore-tab"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <ExploreView
                classes={classes}
                articles={mockArticles}
                onOpenClass={(cls) => setActiveClass(cls)}
                onOpenArticle={(art) => setActiveArticle(art)}
              />
            </motion.div>
          )}

          {activeTab === 'programs' && (
            <motion.div
              key="programs-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <ProgramView
                program={programs[0]}
                onBack={() => setActiveTab('dashboard')}
                onStartSession={(sess) => setActiveSession(sess)}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex flex-col overflow-y-auto no-scrollbar font-sans px-1 space-y-6 pb-12"
            >
              {/* Profile Header */}
              <div className="py-4 border-b border-neutral-900 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold tracking-tight text-white">Tu Cuenta</h2>
                <span className="text-[9px] uppercase font-mono tracking-widest text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                  ACTIVO
                </span>
              </div>

              {/* Profile Details Card */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-brand-muted-gold/20 border border-brand-gold/25 flex items-center justify-center font-display font-semibold text-xl text-brand-gold shrink-0">
                  {user.avatarLetter}
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white">{user.name}</h3>
                  <p className="text-xs text-neutral-400 font-light">{user.membershipLevel}</p>
                  <p className="text-[10px] font-mono text-neutral-500 mt-0.5">{user.favoriteClub}</p>
                </div>
              </div>

              {/* Stats Checklist */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-900/40 border border-neutral-900/80 p-5 rounded-xl text-center space-y-1">
                  <p className="text-2xl font-mono font-bold text-white">{user.checkInCount}</p>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Check-Ins de la Semana</p>
                </div>
                <div className="bg-neutral-900/40 border border-neutral-900/80 p-5 rounded-xl text-center space-y-1">
                  <p className="text-2xl font-mono font-bold text-brand-gold">
                    {classes.filter((c) => c.booked).length}
                  </p>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Sesiones Reservadas</p>
                </div>
              </div>

              {/* Active Program details */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-3">
                <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase block">Programa de Entrenamiento Activo</span>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">Regeneración Dragon Gym</h4>
                    <p className="text-xs text-neutral-400 font-light">08 Ago - 07 Sep</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('programs')}
                    className="p-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-white transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            {/* SIMULATOR CONTROLLER SUITE */}
            <div className="bg-neutral-900/20 border border-neutral-900/60 rounded-2xl p-5 space-y-5">
              <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold">
                <Sparkles className="w-4 h-4" />
                <span>PREFERENCIAS DE SIMULACIÓN</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                  Nombre de Atleta Simulado
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-3.5 py-2.5 focus:border-brand-gold outline-none text-white transition font-medium"
                  placeholder="Ej. Molly"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">
                  Atajos Rápidos de Simulación
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                  <button
                    onClick={() => {
                      setActiveTab('explore');
                      const cc = classes.find((c) => c.title.includes('Circuit'));
                      if (cc) setActiveClass(cc);
                    }}
                    className="p-2.5 bg-neutral-950 border border-neutral-850 hover:border-neutral-700 rounded-lg text-left text-neutral-300 hover:text-white transition"
                  >
                    1. Detalle de Sesión Circuit
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('programs');
                    }}
                    className="p-2.5 bg-neutral-950 border border-neutral-850 hover:border-neutral-700 rounded-lg text-left text-neutral-300 hover:text-white transition"
                  >
                    2. Ver Programa
                  </button>
                  <button
                    onClick={() => setShowCheckInModal(true)}
                    className="p-2.5 bg-neutral-950 border border-neutral-850 hover:border-neutral-700 rounded-lg text-left text-neutral-300 hover:text-white transition"
                  >
                    3. Check-In de Club
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('explore');
                      setActiveClass(null);
                    }}
                    className="p-2.5 bg-neutral-950 border border-neutral-850 hover:border-neutral-700 rounded-lg text-left text-neutral-300 hover:text-white transition"
                  >
                    4. Directorio de Sesiones
                  </button>
                </div>
              </div>

              <button
                onClick={handleResetState}
                className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-red-950/40 hover:border-red-950/80 text-red-400 hover:text-red-300 text-xs font-mono font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpiar Caché de Simulación
              </button>
            </div>

              {/* Subtle design guidelines reference */}
              <div className="bg-neutral-950/40 border border-neutral-900/60 rounded-xl p-4 space-y-2 text-[10px] text-neutral-500 font-light">
                <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold/60" /> Dragon Gym Standards Sync
                </p>
                <p>Designed for full screen high-performance responsiveness. Synchronized dynamically with local memory cache state. Version v4.12.0.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- RESPONSIVE MOBILE NAVIGATION TAB BAR (Hides on desktop screens) --- */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900/80 px-6 py-3 z-40 flex items-center justify-between md:hidden">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'dashboard' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Inicio</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'explore' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Explorar</span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'programs' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Programas</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'profile' ? 'text-white' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Cuenta</span>
        </button>
      </div>

      {/* --- ACTIVE CLASS DRAWER --- */}
      <AnimatePresence>
        {activeClass && (
          <ClassDetail
            gymClass={activeClass}
            onClose={() => setActiveClass(null)}
            onBookToggle={handleBookToggle}
          />
        )}
      </AnimatePresence>

      {/* --- ACTIVE SESSION WRAPPER --- */}
      <AnimatePresence>
        {activeSession && (
          <ActiveWorkout
            session={activeSession}
            onClose={() => setActiveSession(null)}
            onComplete={handleCompleteSession}
          />
        )}
      </AnimatePresence>

      {/* --- ARTICLE READER WRAPPER --- */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-neutral-950 z-50 flex flex-col md:flex-row font-sans"
          >
            {/* Split layout for desktop article viewing! Extremely premium! */}
            <div className="relative h-[240px] md:h-full md:w-1/2 shrink-0">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-transparent to-transparent" />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 space-y-6 flex flex-col justify-center">
              <div className="max-w-xl space-y-5">
                <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase bg-neutral-900 border border-brand-gold/15 px-2.5 py-1 rounded inline-block">
                  {activeArticle.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white leading-tight">
                  {activeArticle.title}
                </h2>
                <p className="text-xs text-neutral-400 font-mono italic">{activeArticle.readTime}</p>
                <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed pt-2">
                  {activeArticle.content}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CLUB PASS OVERLAY --- */}
      <AnimatePresence>
        {showCheckInModal && (
          <CheckInCard
            user={user}
            onClose={() => setShowCheckInModal(false)}
            onConfirmCheckIn={handleConfirmCheckIn}
          />
        )}
      </AnimatePresence>

      {/* --- ADMIN PORTAL OVERLAY --- */}
      <AnimatePresence>
        {showAdminPortal && (
          <AdminPortal
            classes={classes}
            user={user}
            onClose={() => setShowAdminPortal(false)}
            onAddClass={(newClass) => {
              setClasses(prev => [newClass, ...prev]);
              triggerNotification(`Clase "${newClass.title}" publicada en horarios!`);
            }}
            onDeleteClass={(classId) => {
              setClasses(prev => prev.filter(c => c.id !== classId));
              triggerNotification('Clase eliminada del horario del club.');
            }}
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
              triggerNotification('Nivel de membresía de usuario actualizado!');
            }}
          />
        )}
      </AnimatePresence>

      {/* --- STAFF PORTAL OVERLAY --- */}
      <AnimatePresence>
        {showStaffPortal && (
          <StaffPortal
            classes={classes}
            user={user}
            onClose={() => setShowStaffPortal(false)}
            onIncrementCheckIn={() => {
              setUser(prev => {
                const nextCount = prev.checkInCount + 1;
                return {
                  ...prev,
                  checkInCount: nextCount > prev.checkInGoal ? prev.checkInGoal : nextCount
                };
              });
            }}
            onTriggerNotification={(msg) => triggerNotification(msg)}
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
            }}
          />
        )}
      </AnimatePresence>

      {/* --- SOCIO PORTAL OVERLAY --- */}
      <AnimatePresence>
        {showSocioPortal && (
          <SocioPortal
            classes={classes}
            user={user}
            onClose={() => setShowSocioPortal(false)}
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
            }}
            onBookToggle={handleBookToggle}
            onTriggerNotification={(msg) => triggerNotification(msg)}
          />
        )}
      </AnimatePresence>

      {/* --- COACH PORTAL OVERLAY --- */}
      <AnimatePresence>
        {showCoachPortal && (
          <CoachPortal
            classes={classes}
            user={user}
            onClose={() => setShowCoachPortal(false)}
            onUpdateUser={(updatedUser) => {
              setUser(updatedUser);
            }}
            onTriggerNotification={(msg) => triggerNotification(msg)}
          />
        )}
      </AnimatePresence>

      {/* --- TOAST NOTIFICATION OVERLAY --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-6 right-6 bg-neutral-900 border border-brand-gold/30 px-5 py-3.5 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5 max-w-sm backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
            <p className="text-xs font-mono font-medium text-white">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
