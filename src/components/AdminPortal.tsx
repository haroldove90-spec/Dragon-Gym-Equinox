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
  Sparkles, 
  ShieldCheck, 
  Briefcase, 
  Layers,
  CreditCard,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  ShoppingBag,
  UserPlus,
  PlusCircle,
  Calendar,
  Award
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

// Interfaces for custom state
interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  period: 'Mensual' | 'Anual' | 'Semestral' | 'VIP';
  vigencia: string;
  benefits: string[];
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'Bebidas' | 'Suplementos' | 'Ropa' | 'Accesorios';
  price: number;
  stock: number;
}

interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: 'Encargado de Turno' | 'Coordinador POS' | 'Supervisor General';
  permissions: string[];
}

export default function AdminPortal({
  classes,
  user,
  onClose,
  onAddClass,
  onDeleteClass,
  onUpdateUser
}: AdminPortalProps) {
  // Navigation tabs of the Admin role as requested: "Checa bien su respectiva barra de navegacion..."
  const [activeTab, setActiveTab] = useState<'finanzas' | 'pos_planes' | 'personal_clases'>('finanzas');
  const [financeTimeframe, setFinanceTimeframe] = useState<'diario' | 'semanal' | 'mensual'>('mensual');

  // --- 1. Finance & Analytics State ---
  const revenueDetails = {
    diario: { card: 1250, cash: 450, total: 1700, renewals: 12, churns: 1 },
    semanal: { card: 9800, cash: 3200, total: 13000, renewals: 84, churns: 4 },
    mensual: { card: 38500, cash: 10400, total: 48900, renewals: 342, churns: 18 }
  };

  // Simulated peak hours access logs
  const accessLogs = [
    { name: 'Sarah Connor', time: '18:15 PM', status: 'Approved', type: 'Socio VIP' },
    { name: 'Alex Mercer', time: '18:04 PM', status: 'Approved', type: 'Socio Premium' },
    { name: 'Molly', time: '17:45 PM', status: 'Approved', type: 'Socio Estándar' },
    { name: 'John Doe', time: '17:30 PM', status: 'Approved', type: 'Socio Estándar' },
    { name: 'Bruce Wayne', time: '12:15 PM', status: 'Approved', type: 'Socio VIP' },
    { name: 'Clark Kent', time: '08:30 AM', status: 'Approved', type: 'Socio Estándar' }
  ];

  // --- 2. Membership Plans State ---
  const [plans, setPlans] = useState<MembershipPlan[]>([
    { id: 'plan-1', name: 'Plan Mensual Estándar', price: 59, period: 'Mensual', vigencia: '30 días', benefits: ['Acceso ilimitado a máquinas', 'Locker gratuito', '1 clase grupal por semana'] },
    { id: 'plan-2', name: 'Plan Anual Elite', price: 499, period: 'Anual', vigencia: '365 días', benefits: ['Acceso multi-sucursal', 'Eucalyptus towels', 'Clases grupales ilimitadas', '1 sesión con coach'] },
    { id: 'plan-3', name: 'VIP Dragon Pass', price: 120, period: 'VIP', vigencia: 'Mensual recurrente', benefits: ['Acceso total prioritario', 'Zona de spa & sauna', 'Clases premium exclusivas', 'Bebidas de cortesía ilimitadas'] }
  ]);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState(60);
  const [newPlanPeriod, setNewPlanPeriod] = useState<'Mensual' | 'Anual' | 'Semestral' | 'VIP'>('Mensual');
  const [newPlanVigencia, setNewPlanVigencia] = useState('30 días');
  const [newPlanBenefits, setNewPlanBenefits] = useState('');

  // --- 3. Inventory State ---
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'inv-1', name: 'Proteína Iso Dragon (1kg)', category: 'Suplementos', price: 45, stock: 32 },
    { id: 'inv-2', name: 'Bebida de Electrolitos Gold', category: 'Bebidas', price: 3.5, stock: 150 },
    { id: 'inv-3', name: 'Playera Entrenamiento Dragon Gym', category: 'Ropa', price: 25, stock: 18 },
    { id: 'inv-4', name: 'Shaker Mezclador Negro Matte', category: 'Accesorios', price: 12, stock: 45 }
  ]);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [newInvName, setNewInvName] = useState('');
  const [newInvCategory, setNewInvCategory] = useState<'Bebidas' | 'Suplementos' | 'Ropa' | 'Accesorios'>('Bebidas');
  const [newInvPrice, setNewInvPrice] = useState(5);
  const [newInvStock, setNewInvStock] = useState(20);

  // --- 4. Staff Control State ---
  const [staffList, setStaffList] = useState<StaffAccount[]>([
    { id: 'st-1', name: 'Carlos Mendoza', email: 'carlos@dragongym.com', role: 'Supervisor General', permissions: ['Control Total', 'Acceso POS', 'Modificar Clases'] },
    { id: 'st-2', name: 'Jimena Ruíz', email: 'jimena@dragongym.com', role: 'Encargado de Turno', permissions: ['Check-in de Socios', 'Acceso POS'] },
    { id: 'st-3', name: 'Andrés López', email: 'andres@dragongym.com', role: 'Coordinador POS', permissions: ['Acceso POS', 'Manejo de Inventario'] }
  ]);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Encargado de Turno' | 'Coordinador POS' | 'Supervisor General'>('Encargado de Turno');
  const [newStaffPerms, setNewStaffPerms] = useState<string[]>(['Check-in de Socios']);

  // --- 5. Class Scheduler State ---
  const [showAddClass, setShowAddClass] = useState(false);
  const [classTitle, setClassTitle] = useState('');
  const [classCategory, setClassCategory] = useState<'HIIT' | 'Yoga' | 'Pilates' | 'Running' | 'Cycling' | 'Strength'>('HIIT');
  const [classInstructor, setClassInstructor] = useState('');
  const [classLocation, setClassLocation] = useState('Dragon Gym Hudson Yards');
  const [classDuration, setClassDuration] = useState(45);
  const [classTime, setClassTime] = useState('09:00 AM');
  const [classCapacity, setClassCapacity] = useState(25);
  const [classDescription, setClassDescription] = useState('');

  // Form submission helpers
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName) return;
    const plan: MembershipPlan = {
      id: `plan-${Date.now()}`,
      name: newPlanName,
      price: Number(newPlanPrice),
      period: newPlanPeriod,
      vigencia: newPlanVigencia,
      benefits: newPlanBenefits ? newPlanBenefits.split(',').map(b => b.trim()) : ['Acceso general', 'Uso de regaderas']
    };
    setPlans(prev => [...prev, plan]);
    setNewPlanName('');
    setNewPlanPrice(60);
    setNewPlanBenefits('');
    setShowAddPlan(false);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvName) return;
    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newInvName,
      category: newInvCategory,
      price: Number(newInvPrice),
      stock: Number(newInvStock)
    };
    setInventory(prev => [...prev, item]);
    setNewInvName('');
    setNewInvPrice(5);
    setNewInvStock(20);
    setShowAddInventory(false);
  };

  const handleDeleteInventory = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    const staff: StaffAccount = {
      id: `st-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      permissions: newStaffPerms
    };
    setStaffList(prev => [...prev, staff]);
    setNewStaffName('');
    setNewStaffEmail('');
    setShowAddStaff(false);
  };

  const handleTogglePerm = (perm: string) => {
    setNewStaffPerms(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classTitle || !classInstructor) return;

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
      title: classTitle,
      category: classCategory,
      instructor: classInstructor,
      location: classLocation,
      duration: classDuration,
      time: classTime,
      date: 'Today',
      level: 'All Levels',
      image: imagesByCategory[classCategory] || imagesByCategory.HIIT,
      description: classDescription || 'Entrenamiento optimizado de alto rendimiento para liberar tu verdadero potencial deportivo.',
      breakdown: { strength: 4, cardio: 4, athleticism: 4 },
      booked: false,
      isEquinoxExclusive: true
    };

    onAddClass(newClass);
    setClassTitle('');
    setClassInstructor('');
    setClassDescription('');
    setShowAddClass(false);
  };

  const currentRevenue = revenueDetails[financeTimeframe];
  const totalChurnRate = ((currentRevenue.churns / (currentRevenue.renewals + currentRevenue.churns)) * 100).toFixed(1);
  const totalRetentionRate = (100 - parseFloat(totalChurnRate)).toFixed(1);

  return (
    <div id="admin-portal" className="fixed inset-0 bg-neutral-950 z-50 flex flex-col font-sans select-none overflow-hidden">
      
      {/* HEADER SECTION */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
          </div>
          <div>
            <h1 className="text-sm font-display font-black tracking-[0.2em] text-white">DRAGON GYM</h1>
            <p className="text-[9px] font-mono tracking-widest text-brand-gold uppercase">PANEL ADMINISTRADOR: DUEÑO / GERENTE</p>
          </div>
        </div>

        {/* HEADER NAVIGATION FOR DESKTOP (FULLSCREEN) */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-900/50 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('finanzas')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'finanzas' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Finanzas
          </button>
          <button
            onClick={() => setActiveTab('pos_planes')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'pos_planes' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            POS / Planes
          </button>
          <button
            onClick={() => setActiveTab('personal_clases')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'personal_clases' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Personal / Clases
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* PORTAL SUITE TABS (ADMIN NAVIGATION SUITE - HIDDEN ON MOBILE/TABLET because we use bottom navigation bar) */}
      <div className="hidden shrink-0 bg-neutral-950 border-b border-neutral-900/50 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('finanzas')}
          className={`flex-1 py-4 px-3 text-center text-xs font-mono tracking-wider uppercase font-bold border-b-2 transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'finanzas' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Activity className="w-4 h-4 shrink-0" />
          📊 Analíticas y Finanzas
        </button>
        <button
          onClick={() => setActiveTab('pos_planes')}
          className={`flex-1 py-4 px-3 text-center text-xs font-mono tracking-wider uppercase font-bold border-b-2 transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'pos_planes' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          💳 POS y Membresías
        </button>
        <button
          onClick={() => setActiveTab('personal_clases')}
          className={`flex-1 py-4 px-3 text-center text-xs font-mono tracking-wider uppercase font-bold border-b-2 transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'personal_clases' ? 'border-brand-gold text-brand-gold bg-brand-gold/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          👥 Personal y Clases
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24 md:pb-6">
        
        {/* =========================================================================
            TAB 1: DASHBOARD DE ANALÍTICAS Y FINANZAS
            ========================================================================= */}
        {activeTab === 'finanzas' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto"
          >
            {/* Realtime Metrics timeframe selector */}
            <div className="flex justify-between items-center bg-neutral-900/40 p-1.5 rounded-xl border border-neutral-900/80 max-w-sm ml-auto">
              {['diario', 'semanal', 'mensual'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFinanceTimeframe(t as any)}
                  className={`flex-1 py-1.5 px-3.5 text-[10px] font-mono uppercase tracking-wider rounded-lg font-bold transition ${
                    financeTimeframe === t 
                      ? 'bg-white text-black' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Financial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Total Revenue card */}
              <div className="bg-neutral-900/35 border border-neutral-900 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Ingreso Total</span>
                  <DollarSign className="w-4 h-4 text-brand-gold" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-mono font-black text-white">${currentRevenue.total.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+12.8% vs período anterior</span>
                  </div>
                </div>
                {/* Visual mini-bar split card/cash */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                    <span>Tarjeta: ${(currentRevenue.card).toLocaleString()}</span>
                    <span>Efectivo: ${(currentRevenue.cash).toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-brand-gold h-full" 
                      style={{ width: `${(currentRevenue.card / currentRevenue.total) * 100}%` }}
                    />
                    <div 
                      className="bg-zinc-500 h-full" 
                      style={{ width: `${(currentRevenue.cash / currentRevenue.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Retention Card */}
              <div className="bg-neutral-900/35 border border-neutral-900 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Tasa de Retención</span>
                  <Percent className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-mono font-black text-emerald-400">{totalRetentionRate}%</p>
                  <p className="text-[10px] text-neutral-500 font-mono">Total Renovaciones: {currentRevenue.renewals}</p>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full" 
                    style={{ width: `${totalRetentionRate}%` }}
                  />
                </div>
              </div>

              {/* Churn Card */}
              <div className="bg-neutral-900/35 border border-neutral-900 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Churn / Cancelaciones</span>
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-mono font-black text-red-400">{totalChurnRate}%</p>
                  <p className="text-[10px] text-neutral-500 font-mono">Total Cancelaciones: {currentRevenue.churns}</p>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full" 
                    style={{ width: `${totalChurnRate}%` }}
                  />
                </div>
              </div>

            </div>

            {/* REAL-TIME GRAPH (CARD VS CASH) */}
            <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Distribución de Pagos (Tarjeta vs. Efectivo)</h3>
                  <p className="text-[11px] text-neutral-400 font-light">Monitoreo de métodos de pago recibidos durante el plazo</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-brand-gold" />
                    <span className="text-white">Tarjeta ({((currentRevenue.card / currentRevenue.total) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded bg-zinc-600" />
                    <span className="text-neutral-400">Efectivo ({((currentRevenue.cash / currentRevenue.total) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              </div>

              {/* Visualized SVG Bar Chart of Payment split comparison */}
              <div className="h-44 w-full relative pt-2">
                <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="32.5" x2="500" y2="32.5" stroke="#1c1c1e" strokeDasharray="3" />
                  <line x1="0" y1="65" x2="500" y2="65" stroke="#1c1c1e" strokeDasharray="3" />
                  <line x1="0" y1="97.5" x2="500" y2="97.5" stroke="#1c1c1e" strokeDasharray="3" />

                  {/* Payment split bars */}
                  {/* We map a few columns simulating weekly/monthly breakdowns depending on frame */}
                  {[35, 55, 75, 95, 60, 85, 90].map((totalHeightPercent, idx) => {
                    const barWidth = 24;
                    const spacing = 65;
                    const x = 30 + idx * spacing;
                    
                    const cardRatio = currentRevenue.card / currentRevenue.total;
                    const totalHeight = (totalHeightPercent / 100) * 110;
                    const cardHeight = totalHeight * cardRatio;
                    const cashHeight = totalHeight - cardHeight;
                    
                    const yCard = 120 - cardHeight;
                    const yCash = yCard - cashHeight;

                    return (
                      <g key={idx}>
                        {/* Cash segment (Top part) */}
                        <rect
                          x={x}
                          y={yCash}
                          width={barWidth}
                          height={cashHeight}
                          rx="2"
                          fill="#52525b"
                          className="opacity-75 hover:opacity-100 transition cursor-pointer"
                        />
                        {/* Card segment (Bottom part) */}
                        <rect
                          x={x}
                          y={yCard}
                          width={barWidth}
                          height={cardHeight}
                          rx="2"
                          fill="#c8a261"
                          className="opacity-90 hover:opacity-100 transition cursor-pointer"
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-[-18px] inset-x-0 flex justify-between px-6 text-[9px] font-mono text-neutral-500">
                  {financeTimeframe === 'mensual' 
                    ? ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5', 'Proyectado', 'Cierre'].map((s, idx) => <span key={idx}>{s}</span>)
                    : ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((s, idx) => <span key={idx}>{s}</span>)
                  }
                </div>
              </div>
            </div>

            {/* LOG DE ACCESOS GLOBAL */}
            <div className="bg-neutral-900/25 border border-neutral-900 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-brand-gold" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">LOG DE ACCESOS GLOBAL</h3>
                </div>
                {/* Peak hour indicator */}
                <span className="text-[9px] font-mono text-brand-gold bg-brand-gold/10 border border-brand-gold/15 px-2.5 py-1 rounded-full font-bold">
                  HORA PICO DETECTADA: 18:00 PM - 20:00 PM
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
                {accessLogs.map((log, i) => (
                  <div
                    key={i}
                    className="bg-neutral-950 border border-neutral-900 rounded-xl px-4 py-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <div>
                        <p className="font-semibold text-white">{log.name}</p>
                        <p className="text-[9px] text-neutral-500 font-mono">{log.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-neutral-400">
                        {log.time}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded uppercase">
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 2: PUNTO DE VENTA (POS) Y CONFIGURACIÓN DE PLANES
            ========================================================================= */}
        {activeTab === 'pos_planes' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            {/* MEMBESHIP CATALOG */}
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white font-display">Catálogo de Membresías y Planes</h3>
                  <p className="text-xs text-neutral-400">Alta, baja y edición de planes vigentes de la sucursal</p>
                </div>
                <button
                  onClick={() => setShowAddPlan(!showAddPlan)}
                  className="bg-brand-gold hover:bg-brand-gold/90 text-black px-4.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Plan</span>
                </button>
              </div>

              {/* Add plan dialog form */}
              <AnimatePresence>
                {showAddPlan && (
                  <motion.form
                    onSubmit={handleCreatePlan}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-neutral-900/40 border border-brand-gold/20 rounded-2xl p-5 space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold pb-2 border-b border-neutral-900/80">
                      <Sparkles className="w-4 h-4" />
                      <span>CONFIGURADOR DE PLAN DE ACCESO</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Nombre del Plan</label>
                        <input
                          type="text"
                          required
                          value={newPlanName}
                          onChange={(e) => setNewPlanName(e.target.value)}
                          placeholder="Ej. VIP Dragon Pass"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Precio Mensual ($ USD)</label>
                        <input
                          type="number"
                          required
                          value={newPlanPrice}
                          onChange={(e) => setNewPlanPrice(Number(e.target.value))}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Período de Facturación</label>
                        <select
                          value={newPlanPeriod}
                          onChange={(e) => setNewPlanPeriod(e.target.value as any)}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        >
                          <option value="Mensual">Mensual</option>
                          <option value="Semestral">Semestral</option>
                          <option value="Anual">Anual</option>
                          <option value="VIP">VIP</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Vigencia del Pase</label>
                        <input
                          type="text"
                          required
                          value={newPlanVigencia}
                          onChange={(e) => setNewPlanVigencia(e.target.value)}
                          placeholder="Ej. 30 días, Recurrente"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Beneficios (Separados por coma)</label>
                      <input
                        type="text"
                        value={newPlanBenefits}
                        onChange={(e) => setNewPlanBenefits(e.target.value)}
                        placeholder="Ej. Toallas eucalyptus, Acceso spa, Clases premium ilimitadas"
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPlan(false)}
                        className="px-4.5 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold hover:bg-neutral-900 text-white transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
                      >
                        Publicar Membresía
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Plans list representation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded uppercase font-bold">
                          {p.period}
                        </span>
                        <button
                          onClick={() => handleDeletePlan(p.id)}
                          className="text-neutral-500 hover:text-red-400 transition"
                          title="Eliminar plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-sm font-semibold text-white font-display">{p.name}</h4>
                      <p className="text-2xl font-mono font-black text-white">${p.price}<span className="text-xs text-neutral-500 font-light"> USD</span></p>
                      <p className="text-[10px] text-neutral-500 font-mono">Vigencia: {p.vigencia}</p>
                    </div>

                    <div className="border-t border-neutral-900/60 pt-3.5 space-y-2">
                      {p.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                          <Check className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INVENTORY MANAGEMENT */}
            <div className="space-y-4 border-t border-neutral-900/50 pt-8">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white font-display">Gestión de Inventario (Productos Físicos)</h3>
                  <p className="text-xs text-neutral-400">Control de stock de suplementos, bebidas y accesorios deportivos en sucursal</p>
                </div>
                <button
                  onClick={() => setShowAddInventory(!showAddInventory)}
                  className="bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 px-4.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <PlusCircle className="w-4 h-4 text-brand-gold" />
                  <span>Registrar Producto</span>
                </button>
              </div>

              {/* Add Inventory form */}
              <AnimatePresence>
                {showAddInventory && (
                  <motion.form
                    onSubmit={handleCreateInventory}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-neutral-900/40 border border-neutral-850 rounded-2xl p-5 space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 pb-2 border-b border-neutral-900/80">
                      <Package className="w-4 h-4 text-brand-gold" />
                      <span>ALTA EN INVENTARIO FÍSICO</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Nombre del Producto</label>
                        <input
                          type="text"
                          required
                          value={newInvName}
                          onChange={(e) => setNewInvName(e.target.value)}
                          placeholder="Ej. Toalla de Microfibra Negra"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Categoría</label>
                        <select
                          value={newInvCategory}
                          onChange={(e) => setNewInvCategory(e.target.value as any)}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        >
                          <option value="Bebidas">Bebidas</option>
                          <option value="Suplementos">Suplementos</option>
                          <option value="Ropa">Ropa</option>
                          <option value="Accesorios">Accesorios</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Precio de Venta ($ USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newInvPrice}
                          onChange={(e) => setNewInvPrice(Number(e.target.value))}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Cantidad Inicial en Stock</label>
                        <input
                          type="number"
                          required
                          value={newInvStock}
                          onChange={(e) => setNewInvStock(Number(e.target.value))}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddInventory(false)}
                        className="px-4.5 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold hover:bg-neutral-900 text-white transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
                      >
                        Añadir a Inventario
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Inventory visual registry */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-900 font-mono text-[10px] text-neutral-500 uppercase">
                        <th className="py-3 px-4">Producto</th>
                        <th className="py-3 px-4">Categoría</th>
                        <th className="py-3 px-4 text-right">Precio</th>
                        <th className="py-3 px-4 text-center">Stock</th>
                        <th className="py-3 px-4 text-center">Estado</th>
                        <th className="py-3 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900/60 font-sans">
                      {inventory.map((item) => {
                        const lowStock = item.stock <= 20;
                        return (
                          <tr key={item.id} className="hover:bg-neutral-900/20 transition">
                            <td className="py-3.5 px-4 font-semibold text-white">{item.name}</td>
                            <td className="py-3.5 px-4">
                              <span className="text-[9px] font-mono text-zinc-400 bg-neutral-900 px-2 py-0.5 rounded uppercase">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-white">${item.price.toFixed(2)}</td>
                            <td className="py-3.5 px-4 text-center font-mono font-semibold text-white">{item.stock} pz</td>
                            <td className="py-3.5 px-4 text-center">
                              {lowStock ? (
                                <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/15 px-1.5 py-0.2 rounded font-bold uppercase">
                                  Reabastecer
                                </span>
                              ) : (
                                <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/15 px-1.5 py-0.2 rounded font-bold uppercase">
                                  Disponible
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleDeleteInventory(item.id)}
                                className="text-neutral-500 hover:text-red-400 transition"
                              >
                                <Trash2 className="w-4 h-4 mx-auto" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 3: GESTIÓN DE PERSONAL Y SUCURSALES
            ========================================================================= */}
        {activeTab === 'personal_clases' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            {/* CONTROL DE STAFF */}
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white font-display">Control de Staff / Encargados</h3>
                  <p className="text-xs text-neutral-400">Configuración de cuentas de encargados y asignación de permisos</p>
                </div>
                <button
                  onClick={() => setShowAddStaff(!showAddStaff)}
                  className="bg-brand-gold hover:bg-brand-gold/90 text-black px-4.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Alta de Encargado</span>
                </button>
              </div>

              {/* Add Staff form */}
              <AnimatePresence>
                {showAddStaff && (
                  <motion.form
                    onSubmit={handleCreateStaff}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-neutral-900/40 border border-neutral-850 rounded-2xl p-5 space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold pb-2 border-b border-neutral-900/80">
                      <UserPlus className="w-4 h-4" />
                      <span>NUEVA CREDENCIAL DE STAFF</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Nombre Completo</label>
                        <input
                          type="text"
                          required
                          value={newStaffName}
                          onChange={(e) => setNewStaffName(e.target.value)}
                          placeholder="Ej. Coach David"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Email de Acceso</label>
                        <input
                          type="email"
                          required
                          value={newStaffEmail}
                          onChange={(e) => setNewStaffEmail(e.target.value)}
                          placeholder="david@dragongym.com"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Rol Organizacional</label>
                        <select
                          value={newStaffRole}
                          onChange={(e) => setNewStaffRole(e.target.value as any)}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        >
                          <option value="Encargado de Turno">Encargado de Turno</option>
                          <option value="Coordinador POS">Coordinador POS</option>
                          <option value="Supervisor General">Supervisor General</option>
                        </select>
                      </div>
                    </div>

                    {/* Permissions assignment section */}
                    <div className="space-y-2 pt-2">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Permisos Habilitados</label>
                      <div className="flex flex-wrap gap-2">
                        {['Check-in de Socios', 'Acceso POS', 'Modificar Clases', 'Manejo de Inventario', 'Control Total'].map((perm) => {
                          const active = newStaffPerms.includes(perm);
                          return (
                            <button
                              key={perm}
                              type="button"
                              onClick={() => handleTogglePerm(perm)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition border ${
                                active 
                                  ? 'bg-brand-gold text-black border-brand-gold font-bold' 
                                  : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {perm}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddStaff(false)}
                        className="px-4.5 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold hover:bg-neutral-900 text-white transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
                      >
                        Confirmar Cuenta
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Staff grid display with custom permissions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {staffList.map((st) => (
                  <div
                    key={st.id}
                    className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{st.name}</h4>
                        <p className="text-[10px] text-neutral-500 font-mono">{st.email}</p>
                      </div>
                      <span className="text-[8px] font-mono text-brand-gold bg-brand-gold/10 border border-brand-gold/15 px-2 py-0.5 rounded uppercase font-bold">
                        {st.role}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-900/60">
                      <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">Permisos de Cuenta</p>
                      <div className="flex flex-wrap gap-1">
                        {st.permissions.map((p, i) => (
                          <span
                            key={i}
                            className="text-[8px] font-mono text-zinc-300 bg-neutral-900 px-2 py-0.5 rounded"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CLASS AND COACHES CATALOG */}
            <div className="space-y-4 border-t border-neutral-900/50 pt-8">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white font-display">Clases Grupales y Coaches</h3>
                  <p className="text-xs text-neutral-400">Configuración de las sesiones deportivas grupales, coach asignado y cupos de capacidad</p>
                </div>
                <button
                  onClick={() => setShowAddClass(!showAddClass)}
                  className="bg-white hover:bg-neutral-200 text-black px-4.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Programar Clase</span>
                </button>
              </div>

              {/* Add Class Scheduler UI Form */}
              <AnimatePresence>
                {showAddClass && (
                  <motion.form
                    onSubmit={handleCreateClass}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-neutral-900/40 border border-brand-gold/20 rounded-2xl p-5 space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold pb-2 border-b border-neutral-900/80">
                      <Sparkles className="w-4 h-4" />
                      <span>NUEVO MODULO DE ENTRENAMIENTO GRUPAL</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Nombre de la Clase</label>
                        <input
                          type="text"
                          required
                          value={classTitle}
                          onChange={(e) => setClassTitle(e.target.value)}
                          placeholder="Ej. Burnout Aeróbico"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Coach / Instructor Asignado</label>
                        <input
                          type="text"
                          required
                          value={classInstructor}
                          onChange={(e) => setClassInstructor(e.target.value)}
                          placeholder="Ej. Coach Marcus"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Categoría de Clase</label>
                        <select
                          value={classCategory}
                          onChange={(e) => setClassCategory(e.target.value as any)}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
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
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Horario de Inicio</label>
                        <input
                          type="text"
                          required
                          value={classTime}
                          onChange={(e) => setClassTime(e.target.value)}
                          placeholder="Ej. 07:30 PM"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Duración (Minutos)</label>
                        <input
                          type="number"
                          required
                          value={classDuration}
                          onChange={(e) => setClassDuration(Number(e.target.value))}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Capacidad Máxima de Alumnos</label>
                        <input
                          type="number"
                          required
                          value={classCapacity}
                          onChange={(e) => setClassCapacity(Number(e.target.value))}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Descripción Breve</label>
                      <textarea
                        value={classDescription}
                        onChange={(e) => setClassDescription(e.target.value)}
                        placeholder="Describe el objetivo deportivo de esta clase..."
                        rows={2}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddClass(false)}
                        className="px-4.5 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold hover:bg-neutral-900 text-white transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
                      >
                        Programar y Publicar
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Class scheduled list representation */}
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
                          <span className="text-[11px] font-semibold text-white">{cls.title}</span>
                          <span className="text-[8px] font-mono tracking-wide text-brand-gold bg-brand-gold/10 px-1.5 py-0.2 rounded font-bold">
                            {cls.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          Coach: <span className="font-semibold text-white">{cls.instructor}</span> • {cls.time} • {cls.duration} mins
                        </p>
                        <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider mt-0.5">
                          Capacidad Máxima: {classCapacity} alumnos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (confirm(`¿Estás seguro de que deseas cancelar la clase "${cls.title}"?`)) {
                            onDeleteClass(cls.id);
                          }
                        }}
                        className="p-2.5 bg-neutral-900 hover:bg-neutral-850 rounded-xl text-neutral-500 hover:text-red-400 transition"
                        title="Cancelar Clase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </div>

      {/* FOOTER SYNC STATUS */}
      <footer className="shrink-0 bg-neutral-950/80 border-t border-neutral-900 px-6 py-4 flex justify-between items-center text-[9px] font-mono text-neutral-500 pb-20 md:pb-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> ACCESO SEGURO • GERENCIA GLOBAL
        </span>
        <span>MODULOS DE ADMINISTRADOR SEGUROS</span>
      </footer>

      {/* PERSISTENT BOTTOM NAVIGATION BAR (Visible on mobile/tablet only) */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900/80 px-6 py-3 z-40 flex items-center justify-between md:hidden">
        <button
          onClick={() => setActiveTab('finanzas')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'finanzas' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Finanzas</span>
        </button>

        <button
          onClick={() => setActiveTab('pos_planes')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'pos_planes' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">POS</span>
        </button>

        <button
          onClick={() => setActiveTab('personal_clases')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'personal_clases' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Personal</span>
        </button>
      </div>
    </div>
  );
}
