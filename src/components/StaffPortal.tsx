import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UserCheck, 
  Activity, 
  CheckSquare, 
  Square, 
  Play, 
  Compass, 
  Clock, 
  Sparkles, 
  Search, 
  Plus,
  Trash2,
  Bell,
  Heart,
  Shuffle
} from 'lucide-react';
import { GymClass, UserProfile } from '../types';

interface StaffPortalProps {
  classes: GymClass[];
  user: UserProfile;
  onClose: () => void;
  onIncrementCheckIn: () => void;
  onTriggerNotification: (message: string) => void;
}

interface AttendanceRoster {
  name: string;
  avatarLetter: string;
  level: string;
  status: 'Checked-in' | 'Pending' | 'No-show';
}

export default function StaffPortal({
  classes,
  user,
  onClose,
  onIncrementCheckIn,
  onTriggerNotification
}: StaffPortalProps) {
  const [activeTab, setActiveTab] = useState<'scanner' | 'attendance' | 'tasks'>('scanner');
  
  // --- Check-in Scanner State ---
  const [scannerInput, setScannerInput] = useState('');
  const [recentScans, setRecentScans] = useState<Array<{ name: string; time: string; status: string }>>([
    { name: 'Sarah Connor', time: '10:48 AM', status: 'Approved' },
    { name: 'Alex Mercer', time: '10:15 AM', status: 'Approved' },
    { name: 'John Doe', time: '09:30 AM', status: 'Approved' }
  ]);

  // --- Attendance State ---
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [rosterMap, setRosterMap] = useState<Record<string, AttendanceRoster[]>>({
    'all': [
      { name: user.name, avatarLetter: user.avatarLetter, level: user.membershipLevel, status: 'Pending' },
      { name: 'Sarah Connor', avatarLetter: 'S', level: 'All Access', status: 'Checked-in' },
      { name: 'Alex Mercer', avatarLetter: 'A', level: 'Destination Access', status: 'Checked-in' },
      { name: 'John Doe', avatarLetter: 'J', level: 'Socio Básico', status: 'No-show' }
    ]
  });

  // --- Staff Shift Checklist ---
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Calibrate water chemistry in indoor recovery pool', completed: true },
    { id: 2, text: 'Check and refill premium eucalyptus towel stations', completed: false },
    { id: 3, text: 'Inspect rowers and spin bikes in Studio 3', completed: false },
    { id: 4, text: 'Review evening class capacities and instructor check-ins', completed: true },
    { id: 5, text: 'Sanitize heavy lifting dumbbells and kettlebell racks', completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // --- Handlers ---
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerInput.trim()) return;

    const nameToScan = scannerInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Simulate approval checks
    const isCurrentUser = nameToScan.toLowerCase() === user.name.toLowerCase();
    
    setRecentScans(prev => [
      { name: nameToScan, time: timeNow, status: 'Approved' },
      ...prev
    ]);

    if (isCurrentUser) {
      onIncrementCheckIn();
      onTriggerNotification(`Welcome back, ${user.name}! Access approved.`);
    } else {
      onTriggerNotification(`Check-in registered for ${nameToScan}.`);
    }

    setScannerInput('');
  };

  const handleQuickScan = (name: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRecentScans(prev => [
      { name, time: timeNow, status: 'Approved' },
      ...prev
    ]);

    if (name === user.name) {
      onIncrementCheckIn();
      onTriggerNotification(`Welcome back, ${user.name}! Checked in.`);
    } else {
      onTriggerNotification(`Guest entry approved: ${name}`);
    }
  };

  const handleToggleAttendance = (classId: string, memberName: string) => {
    const key = rosterMap[classId] ? classId : 'all';
    setRosterMap(prev => {
      const currentRoster = prev[key] || prev.all;
      const updatedRoster = currentRoster.map(member => {
        if (member.name === memberName) {
          const nextStatusMap: Record<string, 'Checked-in' | 'Pending' | 'No-show'> = {
            'Pending': 'Checked-in',
            'Checked-in': 'No-show',
            'No-show': 'Pending'
          };
          const nextStatus = nextStatusMap[member.status];
          
          // Sync with general check-in counts if they check in for class!
          if (memberName === user.name && nextStatus === 'Checked-in') {
            onIncrementCheckIn();
          }

          return { ...member, status: nextStatus };
        }
        return member;
      });
      return {
        ...prev,
        [key]: updatedRoster
      };
    });
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    setTasks(prev => [
      ...prev,
      { id: Date.now(), text: newTaskText.trim(), completed: false }
    ]);
    setNewTaskText('');
  };

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const currentRoster = rosterMap[selectedClassId] || rosterMap.all;

  return (
    <div id="staff-portal" className="fixed inset-0 bg-neutral-950 z-50 flex flex-col font-sans">
      
      {/* HEADER BAR */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-gold animate-pulse" />
          <div>
            <h1 className="text-sm font-display font-bold tracking-[0.2em] text-white">DRAGON GYM</h1>
            <p className="text-[10px] font-mono tracking-widest text-brand-gold uppercase">STAFF OPERATIONS PORTAL</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* TABS */}
      <div className="shrink-0 bg-neutral-950 border-b border-neutral-900/50 flex overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex-1 py-4 text-center text-xs font-mono tracking-wider uppercase font-semibold border-b-2 transition ${
            activeTab === 'scanner' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          Club Member Scan
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 py-4 text-center text-xs font-mono tracking-wider uppercase font-semibold border-b-2 transition ${
            activeTab === 'attendance' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          Class Attendance
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-4 text-center text-xs font-mono tracking-wider uppercase font-semibold border-b-2 transition ${
            activeTab === 'tasks' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          Shift Checklist
        </button>
      </div>

      {/* CORE WRAPPER */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* TAB 1: FRONT DESK SCANNER */}
        {activeTab === 'scanner' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            {/* INSTRUCTIONS */}
            <div className="text-center space-y-1.5 py-2">
              <h3 className="text-base font-semibold text-white">Barcode Scanner Terminal</h3>
              <p className="text-xs text-neutral-400 font-light">Scan physical key-cards, custom member IDs, or type user profiles manually below.</p>
            </div>

            {/* SCANNER SIMULATOR BOX */}
            <div className="bg-neutral-900/30 border border-neutral-900 rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-brand-gold/40 animate-pulse" />
              
              <form onSubmit={handleScanSubmit} className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-bold">
                  Enter Athlete Name or Pass ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scannerInput}
                    onChange={(e) => setScannerInput(e.target.value)}
                    placeholder="e.g. Molly, Sarah Connor..."
                    className="flex-1 text-sm bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold font-medium transition"
                  />
                  <button
                    type="submit"
                    className="bg-brand-gold hover:bg-brand-gold/90 text-black px-5 rounded-xl font-bold text-xs uppercase tracking-wider transition shrink-0"
                  >
                    Simulate Scan
                  </button>
                </div>
              </form>

              {/* Quick Select shortcuts for checking in members */}
              <div className="space-y-2 pt-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Quick Test Sign-Ins</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleQuickScan(user.name)}
                    className="px-3 py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-xs text-brand-gold rounded-lg transition"
                  >
                    Scan logged user: {user.name} 
                  </button>
                  <button
                    onClick={() => handleQuickScan('Sarah Connor')}
                    className="px-3 py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-lg transition"
                  >
                    Scan Guest: Sarah Connor
                  </button>
                  <button
                    onClick={() => handleQuickScan('Bruce Wayne')}
                    className="px-3 py-2 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 rounded-lg transition"
                  >
                    Scan Guest: Bruce Wayne
                  </button>
                </div>
              </div>
            </div>

            {/* RECENT SCAN HISTORY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Shift Scan History</h4>
                <span className="text-[9px] font-mono text-emerald-400">Live logs synced</span>
              </div>

              <div className="space-y-2">
                {recentScans.map((scan, index) => (
                  <div
                    key={index}
                    className="bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <div>
                        <p className="font-semibold text-white">{scan.name}</p>
                        <p className="text-[9px] text-neutral-500 font-mono">{scan.time}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded uppercase font-semibold">
                      {scan.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: CLASS ATTENDANCE ROSTER */}
        {activeTab === 'attendance' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            {/* Class Selector dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-bold">
                Select Active Daily Session
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full text-xs bg-neutral-900 border border-neutral-850 rounded-xl p-3.5 text-white outline-none focus:border-brand-gold"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.time} with {c.instructor})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected class brief card */}
            {selectedClass && (
              <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white uppercase font-display tracking-wide">{selectedClass.title}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{selectedClass.instructor} • {selectedClass.time} • {selectedClass.location}</p>
                </div>
                <span className="text-[9px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded">
                  {selectedClass.category}
                </span>
              </div>
            )}

            {/* ATHLETE ATTENDANCE LIST */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Athlete Booking Status (Cycle States)</h4>
              
              <div className="space-y-2">
                {currentRoster.map((athlete, i) => {
                  const statusColors = {
                    'Checked-in': 'bg-emerald-950/20 text-emerald-400 border-emerald-950/50',
                    'Pending': 'bg-neutral-900/60 text-neutral-400 border-neutral-850',
                    'No-show': 'bg-red-950/10 text-red-400 border-red-950/25'
                  };

                  return (
                    <div
                      key={i}
                      className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-semibold font-display text-white shrink-0">
                          {athlete.avatarLetter}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">{athlete.name}</p>
                          <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider">{athlete.level}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleAttendance(selectedClassId, athlete.name)}
                        className={`px-3.5 py-1.5 border rounded-xl text-[10px] font-semibold tracking-wider transition ${statusColors[athlete.status]}`}
                      >
                        {athlete.status}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SHIFT TASKS */}
        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            {/* ADD TASK FORM */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Assign new operational duty..."
                className="flex-1 text-xs bg-neutral-900 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
              />
              <button
                type="submit"
                className="bg-white hover:bg-neutral-200 text-black px-4 rounded-xl text-xs font-bold transition shrink-0"
              >
                Add Duty
              </button>
            </form>

            {/* CHECKLIST */}
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex items-start gap-3 cursor-pointer select-none hover:border-neutral-800 transition"
                >
                  <button className="pt-0.5 shrink-0 text-brand-gold">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 fill-brand-gold text-black" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <p className={`text-xs leading-relaxed ${task.completed ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
                    {task.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="shrink-0 bg-neutral-950/80 border-t border-neutral-900 px-6 py-4 flex justify-between items-center text-[9px] font-mono text-neutral-500">
        <span>● LIVE WORKSTATION SYNCED</span>
        <span>ID: dg-staff-2490</span>
      </footer>
    </div>
  );
}
