import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Trash2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Check, 
  Sliders, 
  Sparkles, 
  UserCheck, 
  ShieldCheck,
  Briefcase,
  Layers
} from 'lucide-react';
import { GymClass, UserProfile } from '../types';

interface AdminPortalProps {
  classes: GymClass[];
  user: UserProfile;
  onClose: () => void;
  onAddClass: (newClass: GymClass) => void;
  onDeleteClass: (classId: string) => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export default function AdminPortal({
  classes,
  user,
  onClose,
  onAddClass,
  onDeleteClass,
  onUpdateUser
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'users'>('overview');
  
  // --- Create Class Form State ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'HIIT' | 'Yoga' | 'Pilates' | 'Running' | 'Cycling' | 'Strength'>('HIIT');
  const [instructor, setInstructor] = useState('');
  const [location, setLocation] = useState('Dragon Gym Hudson Yards');
  const [duration, setDuration] = useState(45);
  const [time, setTime] = useState('09:00 AM');
  const [date, setDate] = useState('Today');
  const [level, setLevel] = useState<'All Levels' | 'Intermediate' | 'Advanced'>('All Levels');
  const [description, setDescription] = useState('');
  const [strength, setStrength] = useState(3);
  const [cardio, setCardio] = useState(3);
  const [athleticism, setAthleticism] = useState(3);
  const [isExclusive, setIsExclusive] = useState(true);

  // --- Mock Users List State ---
  const [usersList, setUsersList] = useState<UserProfile[]>([
    user,
    {
      name: 'Sarah Connor',
      avatarLetter: 'S',
      checkInCount: 3,
      checkInGoal: 5,
      membershipLevel: 'All Access',
      favoriteClub: 'Dragon Gym Hudson Yards'
    },
    {
      name: 'Alex Mercer',
      avatarLetter: 'A',
      checkInCount: 1,
      checkInGoal: 3,
      membershipLevel: 'Destination Access',
      favoriteClub: 'Dragon Gym Upper East'
    },
    {
      name: 'John Doe',
      avatarLetter: 'J',
      checkInCount: 2,
      checkInGoal: 4,
      membershipLevel: 'Socio Básico',
      favoriteClub: 'Dragon Gym Soho'
    }
  ]);

  // --- Form submission handler ---
  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !instructor) {
      alert('Please fill out all required fields');
      return;
    }

    const imagesByCategory: Record<string, string> = {
      HIIT: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
      Yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
      Pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
      Running: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop',
      Cycling: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop',
      Strength: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop'
    };

    const newClass: GymClass = {
      id: `class-${Date.now()}`,
      title,
      category,
      instructor,
      location,
      duration,
      time,
      date,
      level,
      image: imagesByCategory[category] || imagesByCategory.HIIT,
      description: description || `Unlock your physical peak with this high-intensity training module. Curated strictly to test borders, build cardiovascular output, and build lasting strength.`,
      breakdown: {
        strength,
        cardio,
        athleticism
      },
      booked: false,
      isEquinoxExclusive: isExclusive
    };

    onAddClass(newClass);
    
    // Reset Form
    setTitle('');
    setInstructor('');
    setDescription('');
    setShowAddForm(false);
  };

  const handleUpdateUserLevel = (userName: string, level: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.name === userName) {
        const updated = { ...u, membershipLevel: level };
        if (u.name === user.name) {
          onUpdateUser(updated);
        }
        return updated;
      }
      return u;
    }));
  };

  // --- SVG Custom Chart Coordinates ---
  // Traffic analytics values
  const trafficData = [20, 35, 65, 80, 50, 45, 95, 75, 40];
  const trafficHours = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'];

  return (
    <div id="admin-portal" className="fixed inset-0 bg-neutral-950 z-50 flex flex-col font-sans">
      
      {/* HEADER SECTION */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-brand-gold" />
          <div>
            <h1 className="text-sm font-display font-bold tracking-[0.2em] text-white">DRAGON GYM</h1>
            <p className="text-[10px] font-mono tracking-widest text-brand-gold uppercase">ADMINISTRADOR PORTAL</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* PORTAL SUITE TABS */}
      <div className="shrink-0 bg-neutral-950 border-b border-neutral-900/50 flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-4 text-center text-xs font-mono tracking-wider uppercase font-semibold border-b-2 transition ${
            activeTab === 'overview' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          Overview & Analytics
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex-1 py-4 text-center text-xs font-mono tracking-wider uppercase font-semibold border-b-2 transition ${
            activeTab === 'classes' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          Manage Classes ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-4 text-center text-xs font-mono tracking-wider uppercase font-semibold border-b-2 transition ${
            activeTab === 'users' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          User Accounts
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* METRICS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Total Members</span>
                  <Users className="w-4 h-4 text-brand-gold/75" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xl font-mono font-bold text-white">1,248</p>
                  <p className="text-[9px] text-emerald-400 font-mono">+12.4% this month</p>
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Active Classes</span>
                  <Activity className="w-4 h-4 text-brand-gold/75" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xl font-mono font-bold text-white">{classes.length}</p>
                  <p className="text-[9px] text-neutral-400 font-mono">14 weekly instructors</p>
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Monthly Rev</span>
                  <DollarSign className="w-4 h-4 text-brand-gold/75" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xl font-mono font-bold text-white">$48,900</p>
                  <p className="text-[9px] text-emerald-400 font-mono">+8.1% vs last month</p>
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Occupancy</span>
                  <TrendingUp className="w-4 h-4 text-brand-gold/75" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xl font-mono font-bold text-white">82%</p>
                  <p className="text-[9px] text-brand-gold font-mono">Peak hour: 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* LIVE GYM TRAFFIC CHART (CUSTOM HIGH-END SVG) */}
            <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Simulated Hourly Gym Capacity</h3>
                  <p className="text-xs text-neutral-400 font-light">Average occupancy levels across scheduled operating slots</p>
                </div>
                <span className="text-[9px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded uppercase">LIVE</span>
              </div>

              {/* Chart Stage */}
              <div className="h-48 w-full relative pt-2">
                <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#1c1c1e" strokeDasharray="3" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#1c1c1e" strokeDasharray="3" />
                  <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#1c1c1e" strokeDasharray="3" />
                  
                  {/* Bars */}
                  {trafficData.map((val, idx) => {
                    const barWidth = 30;
                    const spacing = 55;
                    const x = 20 + idx * spacing;
                    const height = (val / 100) * 120;
                    const y = 130 - height;
                    return (
                      <g key={idx} className="group">
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          rx="4"
                          fill="url(#goldGradient)"
                          className="opacity-80 group-hover:opacity-100 transition duration-300 cursor-pointer"
                        />
                        {/* Tooltip on hover */}
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          fill="#c8a261"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="opacity-0 group-hover:opacity-100 transition duration-300 font-mono"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#c8a261" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#c8a261" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X Axis Labels */}
                <div className="absolute bottom-[-18px] inset-x-0 flex justify-between px-3 text-[9px] font-mono text-neutral-500">
                  {trafficHours.map((h, i) => (
                    <span key={i} className="w-[45px] text-center">{h}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* RECENT NOTIFICATIONS & SYSTEM LOGS */}
            <div className="bg-neutral-900/25 border border-neutral-900/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-400">
                <Layers className="w-4 h-4 text-brand-gold/80" />
                <span>RECENT SECURITY & SYSTEM LOGS</span>
              </div>

              <div className="space-y-2.5 font-mono text-[10px] text-neutral-400">
                <div className="flex justify-between border-b border-neutral-900/60 pb-2">
                  <span className="text-neutral-500">[11:08:42]</span>
                  <span className="text-white">Admin session initiated via safe console</span>
                  <span className="text-brand-gold font-semibold">SUCCESS</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900/60 pb-2">
                  <span className="text-neutral-500">[11:04:15]</span>
                  <span className="text-neutral-300">Club check-in request registered for Molly</span>
                  <span className="text-emerald-400 font-semibold">APPROVED</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900/60 pb-2">
                  <span className="text-neutral-500">[10:55:01]</span>
                  <span className="text-neutral-300">New premium class scheduled: Athletic conditioning</span>
                  <span className="text-brand-gold font-semibold">SYNCHRONIZED</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: MANAGE CLASSES */}
        {activeTab === 'classes' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Header with button */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-semibold text-white">Active Gym Classes</h3>
                <p className="text-xs text-neutral-400">Review schedules, edit listings, and manage attendance details</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-brand-gold hover:bg-brand-gold/90 text-black px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Class</span>
              </button>
            </div>

            {/* CREATE CLASS DIALOG */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  onSubmit={handleSubmitClass}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-neutral-950 border border-brand-gold/25 rounded-2xl p-5 space-y-4 overflow-hidden"
                >
                  <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold pb-2 border-b border-neutral-900">
                    <Sparkles className="w-4 h-4" />
                    <span>NEW CLASS BLUEPRINT</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Class Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Metabolic Burnout"
                        className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Instructor Name *</label>
                      <input
                        type="text"
                        required
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        placeholder="e.g. Coach Marcus"
                        className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                      >
                        <option value="HIIT">HIIT</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Pilates">Pilates</option>
                        <option value="Running">Running</option>
                        <option value="Cycling">Cycling</option>
                        <option value="Strength">Strength</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Level</label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as any)}
                        className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                      >
                        <option value="All Levels">All Levels</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Duration (Minutes)</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Time</label>
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the physical objectives and structure of this workout..."
                      rows={3}
                      className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white outline-none focus:border-brand-gold resize-none"
                    />
                  </div>

                  {/* Muscle details */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 text-center">
                      <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-500">Strength (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={strength}
                        onChange={(e) => setStrength(Number(e.target.value))}
                        className="w-full text-center text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white outline-none"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-500">Cardio (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={cardio}
                        onChange={(e) => setCardio(Number(e.target.value))}
                        className="w-full text-center text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white outline-none"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-500">Athleticism (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={athleticism}
                        onChange={(e) => setAthleticism(Number(e.target.value))}
                        className="w-full text-center text-xs bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="exclusive"
                      checked={isExclusive}
                      onChange={(e) => setIsExclusive(e.target.checked)}
                      className="w-4 h-4 accent-brand-gold"
                    />
                    <label htmlFor="exclusive" className="text-[10px] uppercase font-mono tracking-wider text-neutral-300">
                      Dragon Gym Exclusive Privilege
                    </label>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4.5 py-2.5 rounded-xl border border-neutral-800 hover:bg-neutral-900 transition text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
                    >
                      Publish Class
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* CLASS DIRECTORY GRID */}
            <div className="space-y-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={cls.image}
                      alt={cls.title}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-900 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-white/95">{cls.title}</span>
                        <span className="text-[8px] font-mono tracking-wide text-brand-gold bg-brand-gold/10 px-1.5 py-0.2 rounded">
                          {cls.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-light mt-0.5">
                        {cls.instructor} • {cls.time} • {cls.duration} mins
                      </p>
                      <p className="text-[9px] text-neutral-500 font-mono italic mt-0.5">
                        {cls.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {cls.booked && (
                      <span className="text-[9px] text-emerald-400 border border-emerald-950/40 bg-emerald-950/10 px-2 py-0.5 rounded-full font-semibold">
                        Booked
                      </span>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to cancel and delete the class: "${cls.title}"?`)) {
                          onDeleteClass(cls.id);
                        }
                      }}
                      className="p-2.5 bg-neutral-900 hover:bg-neutral-850 rounded-xl text-neutral-500 hover:text-red-400 transition"
                      title="Delete Class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: USER ACCOUNTS */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <div>
              <h3 className="text-base font-semibold text-white font-display">User Accounts Directory</h3>
              <p className="text-xs text-neutral-400">View member authorization tiers, weekly logs, and tier assignments</p>
            </div>

            <div className="space-y-3">
              {usersList.map((usr, i) => (
                <div
                  key={i}
                  className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-brand-muted-gold/20 border border-brand-gold/20 flex items-center justify-center font-display font-semibold text-brand-gold">
                        {usr.avatarLetter}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{usr.name}</h4>
                        <p className="text-[10px] font-mono text-neutral-500">{usr.favoriteClub}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-mono text-brand-gold bg-brand-gold/15 border border-brand-gold/10 px-2 py-0.5 rounded uppercase">
                        {usr.membershipLevel}
                      </span>
                    </div>
                  </div>

                  {/* Config settings row */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-neutral-900/60 text-xs">
                    <div>
                      <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Active Check-ins</p>
                      <p className="text-white font-mono mt-0.5">{usr.checkInCount} / {usr.checkInGoal} times</p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Modify Access Tier</p>
                      <div className="flex gap-1">
                        {['Socio Básico', 'All Access', 'Destination Access'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => handleUpdateUserLevel(usr.name, lvl)}
                            className={`px-2.5 py-1 rounded text-[9px] font-semibold tracking-wide transition border ${
                              usr.membershipLevel === lvl
                                ? 'bg-white border-white text-black'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* FOOTER Sync Indicators */}
      <footer className="shrink-0 bg-neutral-950/80 border-t border-neutral-900 px-6 py-4 flex justify-between items-center text-[9px] font-mono text-neutral-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> SYSTEM ENCRYPTED
        </span>
        <span>Version v4.12.0</span>
      </footer>
    </div>
  );
}
