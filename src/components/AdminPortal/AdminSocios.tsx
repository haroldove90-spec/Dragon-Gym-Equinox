import React, { useState, useEffect } from 'react';
import { Search, Ban, CheckCircle2, Sliders, RefreshCw, AlertTriangle, ShieldAlert, CreditCard } from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminSociosProps {
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onAddAuditLog: (action: string, category: any, user: string, severity: any) => void;
}

export default function AdminSocios({ currentUser, onUpdateUser, onAddAuditLog }: AdminSociosProps) {
  // Master client database in localStorage
  const [socios, setSocios] = useState<any[]>(() => {
    const saved = localStorage.getItem('eqx_all_socios');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaults: any[] = [
      { id: 'DG-ATHLETE-7102', name: 'Molly Jones', email: 'molly.jones@dragongym.com', phone: '+1 (555) 381-9921', bloodType: 'O+', emergencyContact: 'David Jones (Esposo) - +1 (555) 381-0022', avatarLetter: 'M', checkInCount: 14, checkInGoal: 20, membershipLevel: 'Plan Anual Elite', favoriteClub: 'Dragon Gym Hudson Yards', status: 'Activo' },
      { id: 'DG-ATHLETE-1082', name: 'Alex Mercer', email: 'alex.mercer@dragongym.com', phone: '+1 (555) 123-4567', bloodType: 'A+', emergencyContact: 'Dana Mercer (Hermana) - +1 (555) 123-0099', avatarLetter: 'A', checkInCount: 32, checkInGoal: 30, membershipLevel: 'VIP Dragon Pass', favoriteClub: 'Dragon Gym Tribeca', status: 'Activo' },
      { id: 'DG-ATHLETE-4099', name: 'Sarah Connor', email: 'sarah.connor@cyberdyne.com', phone: '+1 (555) 987-6543', bloodType: 'O-', emergencyContact: 'John Connor (Hijo) - +1 (555) 987-0022', avatarLetter: 'S', checkInCount: 41, checkInGoal: 45, membershipLevel: 'VIP Dragon Pass', favoriteClub: 'Dragon Gym Hudson Yards', status: 'Suspendido' },
      { id: 'DG-ATHLETE-2210', name: 'John Doe', email: 'john.doe@gmail.com', phone: '+1 (555) 555-5555', bloodType: 'B+', emergencyContact: 'Jane Doe (Esposa) - +1 (555) 555-1111', avatarLetter: 'J', checkInCount: 5, checkInGoal: 10, membershipLevel: 'Plan Mensual Estándar', favoriteClub: 'Dragon Gym Flatiron', status: 'Vencido' }
    ];
    localStorage.setItem('eqx_all_socios', JSON.stringify(defaults));
    return defaults;
  });

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Activo' | 'Suspendido' | 'Vencido'>('Todos');

  // Synchronize on change
  const saveSocios = (updated: any[]) => {
    setSocios(updated);
    localStorage.setItem('eqx_all_socios', JSON.stringify(updated));

    // If Molly is updated, sync back to App state via onUpdateUser
    const molly = updated.find(s => s.email === 'molly.jones@dragongym.com');
    if (molly) {
      const parentUserFormat: UserProfile = {
        id: molly.id,
        name: molly.name,
        email: molly.email,
        phone: molly.phone,
        bloodType: molly.bloodType,
        emergencyContact: molly.emergencyContact,
        avatarLetter: molly.avatarLetter,
        checkInCount: molly.checkInCount,
        checkInGoal: molly.checkInGoal,
        membershipLevel: molly.status === 'Suspendido' 
          ? 'Plan Suspendido (Inactivo)' 
          : molly.status === 'Vencido' 
            ? 'Plan Vencido (Inactivo)' 
            : molly.membershipLevel,
        favoriteClub: molly.favoriteClub
      };
      
      // Only invoke onUpdateUser if the membership values actually changed
      if (currentUser.membershipLevel !== parentUserFormat.membershipLevel || currentUser.name !== parentUserFormat.name) {
        onUpdateUser(parentUserFormat);
      }
    }
  };

  // Sync Molly from prop if it changed elsewhere
  useEffect(() => {
    const isMollyChanged = socios.some(s => s.email === currentUser.email && (
      s.name !== currentUser.name || 
      (currentUser.membershipLevel.toLowerCase().includes('vencid') && s.status !== 'Vencido') ||
      (currentUser.membershipLevel.toLowerCase().includes('suspendid') && s.status !== 'Suspendido')
    ));

    if (isMollyChanged) {
      const updated = socios.map(s => {
        if (s.email === currentUser.email) {
          let computedStatus = 'Activo';
          if (currentUser.membershipLevel.toLowerCase().includes('vencid')) computedStatus = 'Vencido';
          if (currentUser.membershipLevel.toLowerCase().includes('suspendid')) computedStatus = 'Suspendido';
          return {
            ...s,
            name: currentUser.name,
            avatarLetter: currentUser.avatarLetter,
            membershipLevel: currentUser.membershipLevel,
            status: computedStatus
          };
        }
        return s;
      });
      setSocios(updated);
      localStorage.setItem('eqx_all_socios', JSON.stringify(updated));
    }
  }, [currentUser]);

  // Handle Suspension Toggle
  const handleToggleSuspend = (id: string, name: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Suspendido' ? 'Activo' : 'Suspendido';
    const updated = socios.map(s => s.id === id ? { ...s, status: newStatus } : s);
    saveSocios(updated);
    
    const severity = newStatus === 'Suspendido' ? 'warning' : 'success';
    onAddAuditLog(
      `Socio ${name} ${newStatus === 'Suspendido' ? 'Suspendido' : 'Reactivado'}`,
      'Socios',
      'Administrador',
      severity
    );
  };

  // Express Renewal (+30 days of standard plan)
  const handleExpressRenewal = (id: string, name: string) => {
    const updated = socios.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'Activo',
          membershipLevel: s.membershipLevel.includes('Inactivo') || s.membershipLevel.includes('Vencido') 
            ? 'Plan Mensual Estándar' 
            : s.membershipLevel
        };
      }
      return s;
    });
    saveSocios(updated);
    onAddAuditLog(`Renovación express aplicada a ${name} (+30 días)`, 'Socios', 'Administrador', 'success');
    onAddAuditLog(`Cobro de mensualidad en mostrador: $59 USD de ${name}`, 'Caja', 'Administrador', 'success');
  };

  // Change Plan level
  const handlePlanChange = (id: string, name: string, level: string) => {
    const updated = socios.map(s => s.id === id ? { ...s, membershipLevel: level, status: 'Activo' } : s);
    saveSocios(updated);
    onAddAuditLog(`Membresía de ${name} actualizada a ${level}`, 'Socios', 'Administrador', 'success');
  };

  // Filtering list
  const filtered = socios.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.email.toLowerCase().includes(search.toLowerCase()) ||
                          s.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-display font-bold text-white tracking-wider uppercase">Maestro de Clientes</h2>
          <p className="text-[10px] font-mono text-neutral-400">BASE DE DATOS CENTRALIZADA DE ATLETAS DRAGON</p>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-900">
          {(['Todos', 'Activo', 'Suspendido', 'Vencido'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded-lg transition ${
                filterStatus === st 
                  ? 'bg-brand-gold text-black font-bold' 
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Buscar por Nombre, Email o ID de Socio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-neutral-900/10 border border-neutral-900 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold font-sans"
        />
      </div>

      {/* Customer Registry List */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-900 font-mono text-[10px] text-neutral-500 uppercase">
                <th className="py-3 px-4">Atleta</th>
                <th className="py-3 px-4">ID de Socio</th>
                <th className="py-3 px-4">Plan Actual</th>
                <th className="py-3 px-4 text-center">Check-Ins</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones Directas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60 font-sans">
              {filtered.map((s) => {
                const isSuspended = s.status === 'Suspendido';
                const isVencido = s.status === 'Vencido';
                
                return (
                  <tr key={s.id} className="hover:bg-neutral-900/20 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-display font-bold text-white text-xs text-brand-gold">
                          {s.avatarLetter || s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{s.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-400">{s.id}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={s.membershipLevel}
                        onChange={(e) => handlePlanChange(s.id, s.name, e.target.value)}
                        className="bg-neutral-900 border border-neutral-850 rounded-lg p-1.5 text-[10px] text-white outline-none"
                      >
                        <option value="Plan Mensual Estándar">Plan Mensual Estándar</option>
                        <option value="Plan Anual Elite">Plan Anual Elite</option>
                        <option value="VIP Dragon Pass">VIP Dragon Pass</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">{s.checkInCount} check-ins</td>
                    <td className="py-3.5 px-4 text-center">
                      {isSuspended ? (
                        <span className="text-[8px] font-mono text-red-500 bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded font-bold uppercase">
                          Suspendido
                        </span>
                      ) : isVencido ? (
                        <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded font-bold uppercase">
                          Vencido
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/15 px-2 py-0.5 rounded font-bold uppercase">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Suspend */}
                        <button
                          onClick={() => handleToggleSuspend(s.id, s.name, s.status)}
                          className={`p-1.5 rounded-lg border transition ${
                            isSuspended 
                              ? 'bg-emerald-950/20 border-emerald-500/35 text-emerald-400 hover:bg-emerald-950/40' 
                              : 'bg-red-950/20 border-red-500/35 text-red-400 hover:bg-red-950/40'
                          }`}
                          title={isSuspended ? 'Reactivar Cuenta' : 'Suspender Cuenta'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        {/* Express Renewal */}
                        <button
                          onClick={() => handleExpressRenewal(s.id, s.name)}
                          className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-brand-gold hover:text-white px-2.5 py-1.5 rounded-lg text-[9px] font-mono uppercase font-bold flex items-center gap-1 transition"
                          title="Renovación Express +30 Días"
                        >
                          <RefreshCw className="w-3 h-3" /> Renovación
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-500 text-xs font-mono">
                    No se encontraron socios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
