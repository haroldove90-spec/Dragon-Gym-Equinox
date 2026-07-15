import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Activity, CreditCard, Users, Briefcase, Award, FileText, Megaphone, ShieldCheck, LogOut 
} from 'lucide-react';
import { GymClass, UserProfile } from '../types';

// Sub-components Imports
import AdminDashboard from './AdminPortal/AdminDashboard';
import AdminPlanes from './AdminPortal/AdminPlanes';
import AdminSocios from './AdminPortal/AdminSocios';
import AdminPersonal from './AdminPortal/AdminPersonal';
import AdminRutinas from './AdminPortal/AdminRutinas';
import AdminAuditoria from './AdminPortal/AdminAuditoria';
import AdminComunicacion from './AdminPortal/AdminComunicacion';

interface AdminPortalProps {
  classes: GymClass[];
  user: UserProfile;
  onClose: () => void;
  onAddClass: (newClass: GymClass) => void;
  onDeleteClass: (classId: string) => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Caja' | 'Socios' | 'Accesos' | 'Clases' | 'Inventario' | 'Suscripciones' | 'Comunicaciones' | 'Rutinas';
  severity: 'info' | 'success' | 'warning' | 'error';
}

export default function AdminPortal({
  classes,
  user,
  onClose,
  onAddClass,
  onDeleteClass,
  onUpdateUser
}: AdminPortalProps) {
  // Tabs of the Admin role as requested
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planes' | 'socios' | 'personal' | 'rutinas' | 'auditoria' | 'comunicacion'>('dashboard');

  // Unified system audit log state
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(() => {
    const saved = localStorage.getItem('eqx_audit_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaults: AuditEntry[] = [
      { id: 'log-1', timestamp: '15 Jul 2026, 13:10 PM', user: 'Carlos Mendoza', action: 'Apertura de Turno de Caja POS', category: 'Caja', severity: 'info' },
      { id: 'log-2', timestamp: '15 Jul 2026, 12:45 PM', user: 'Carlos Mendoza', action: 'Registro de nuevo socio Alex Mercer', category: 'Socios', severity: 'success' },
      { id: 'log-3', timestamp: '15 Jul 2026, 12:15 PM', user: 'Soporte Automático', action: 'Check-in autorizado: Bruce Wayne via Smart QR', category: 'Accesos', severity: 'info' },
      { id: 'log-4', timestamp: '15 Jul 2026, 11:30 AM', user: 'Jimena Ruíz', action: 'Clase programada: Circuit Breaker', category: 'Clases', severity: 'info' },
      { id: 'log-5', timestamp: '15 Jul 2026, 10:00 AM', user: 'Andrés López', action: 'Corte de Caja Diario completado', category: 'Caja', severity: 'warning' },
    ];
    localStorage.setItem('eqx_audit_logs', JSON.stringify(defaults));
    return defaults;
  });

  const handleAddAuditLog = (
    action: string, 
    category: 'Caja' | 'Socios' | 'Accesos' | 'Clases' | 'Inventario' | 'Suscripciones' | 'Comunicaciones' | 'Rutinas', 
    operator: string = 'Administrador', 
    severity: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    const newLog: AuditEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('es-MX', { hour12: true, day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      user: operator,
      action,
      category,
      severity
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('eqx_audit_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearLogs = () => {
    setAuditLogs([]);
    localStorage.setItem('eqx_audit_logs', JSON.stringify([]));
    handleAddAuditLog('Registro de Logs de Auditoría purgado por Administrador', 'Socios', 'Administrador', 'warning');
  };

  // Helper stats for dashboard summaries
  const [totalRevenue, setTotalRevenue] = useState(48900);
  const [totalSocios, setTotalSocios] = useState(4);

  // Read total members count and calculate total revenue dynamically based on local storage changes!
  useEffect(() => {
    const rawSocios = localStorage.getItem('eqx_all_socios');
    if (rawSocios) {
      try {
        const parsed = JSON.parse(rawSocios);
        setTotalSocios(parsed.length);
      } catch (e) {
        console.error(e);
      }
    }

    const rawPlans = localStorage.getItem('eqx_plans');
    if (rawPlans && rawSocios) {
      try {
        const parsedSocios = JSON.parse(rawSocios);
        const parsedPlans = JSON.parse(rawPlans);
        // Compute rough revenue based on actual plans assigned to members
        let sum = 38500; // base standard revenue
        parsedSocios.forEach((s: any) => {
          if (s.status === 'Activo') {
            const planDetails = parsedPlans.find((p: any) => p.name === s.membershipLevel);
            if (planDetails) {
              sum += planDetails.price;
            } else {
              sum += 59; // fallback standard
            }
          }
        });
        setTotalRevenue(sum);
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeTab]);

  // Tab configurations
  const menuItems = [
    { id: 'dashboard', name: 'Analíticas', icon: Activity },
    { id: 'planes', name: 'Planes de Socios', icon: CreditCard },
    { id: 'socios', name: 'Maestro Socios', icon: Users },
    { id: 'personal', name: 'Personal & Agenda', icon: Briefcase },
    { id: 'rutinas', name: 'Rutinas Socios', icon: Award },
    { id: 'comunicacion', name: 'Comunicados', icon: Megaphone },
    { id: 'auditoria', name: 'Auditoría Logs', icon: FileText },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-hidden flex flex-col md:flex-row">
      
      {/* Mobile Top Header Bar */}
      <header className="flex md:hidden justify-between items-center px-4 py-3.5 border-b border-neutral-900 bg-neutral-950 shrink-0 z-40">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-brand-gold/10 border border-brand-gold/20 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
          </div>
          <div>
            <h1 className="text-xs font-display font-bold text-white tracking-wider">DRAGON CLUB</h1>
            <p className="text-[7px] font-mono text-neutral-500 uppercase">Administración</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white rounded-lg border border-neutral-850 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 1. Sophisticated Navigation Sidebar on Desktop */}
      <div className="hidden md:flex md:w-64 bg-neutral-950 md:border-r border-neutral-900 flex-col justify-between shrink-0">
        <div className="p-5 space-y-6">
          {/* Header Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
              </div>
              <div>
                <h1 className="text-sm font-display font-bold text-white tracking-wider">DRAGON CLUB</h1>
                <p className="text-[8px] font-mono text-neutral-500 uppercase">Módulo de Administración</p>
              </div>
            </div>

            <button onClick={onClose} className="md:hidden text-neutral-500 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 flex md:flex-col overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none gap-1 md:gap-0">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition shrink-0 md:shrink ${
                    isActive 
                      ? 'bg-neutral-900 border border-neutral-850 text-white font-bold' 
                      : 'text-neutral-400 hover:text-white border border-transparent hover:bg-neutral-900/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-neutral-500'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info footer and Exit Action */}
        <div className="p-5 border-t border-neutral-900 hidden md:block space-y-4">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-display font-bold text-brand-gold">
              A
            </div>
            <div>
              <p className="font-semibold text-white">Administrador</p>
              <p className="text-[9px] font-mono text-neutral-500">ADMIN-LEVEL SECURE</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white font-semibold rounded-xl text-[10px] uppercase font-mono flex items-center justify-center gap-1.5 border border-neutral-850 transition"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-500" />
            <span>Salir del Portal</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content Screen Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950">
        {/* Top Header Bar */}
        <header className="px-6 py-4.5 border-b border-neutral-900 hidden md:flex justify-between items-center bg-neutral-950">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
            <span>Terminal Administrativa</span>
            <span>/</span>
            <span className="text-brand-gold font-bold">{activeTab}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white rounded-xl border border-neutral-850 transition"
            title="Cerrar Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Content body with responsive scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <AdminDashboard userCount={totalSocios} revenueTotal={totalRevenue} />
              )}
              {activeTab === 'planes' && (
                <AdminPlanes onAddAuditLog={handleAddAuditLog} />
              )}
              {activeTab === 'socios' && (
                <AdminSocios 
                  currentUser={user} 
                  onUpdateUser={onUpdateUser} 
                  onAddAuditLog={handleAddAuditLog} 
                />
              )}
              {activeTab === 'personal' && (
                <AdminPersonal 
                  classes={classes} 
                  onAddClass={onAddClass} 
                  onDeleteClass={onDeleteClass} 
                  onAddAuditLog={handleAddAuditLog} 
                />
              )}
              {activeTab === 'rutinas' && (
                <AdminRutinas onAddAuditLog={handleAddAuditLog} />
              )}
              {activeTab === 'comunicacion' && (
                <AdminComunicacion onAddAuditLog={handleAddAuditLog} />
              )}
              {activeTab === 'auditoria' && (
                <AdminAuditoria auditLogs={auditLogs} onClearLogs={handleClearLogs} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* PERSISTENT MOBILE BOTTOM NAVIGATION BAR FOR ADMIN */}
      {/* Ensures target touch layout is at least 44px (using py-2, h-[72px], large hit zones) */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900 px-3 py-2 z-40 flex items-center gap-4.5 overflow-x-auto admin-scrollbar md:hidden h-[72px]">
        <style>{`
          .admin-scrollbar::-webkit-scrollbar {
            height: 3px;
          }
          .admin-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 9px;
          }
          .admin-scrollbar::-webkit-scrollbar-thumb {
            background: #D4AF37;
            border-radius: 9px;
          }
        `}</style>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition shrink-0 px-2 h-12 ${
                isActive ? 'text-brand-gold font-bold' : 'text-neutral-500 hover:text-neutral-400'
              }`}
              style={{ minHeight: '44px' }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[8px] font-semibold uppercase tracking-wider whitespace-nowrap">{item.name}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
