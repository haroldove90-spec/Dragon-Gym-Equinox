import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Trash2, Check, Lock, Unlock, Edit3, CreditCard, Sparkles, X } from 'lucide-react';

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  period: 'Mensual' | 'Anual' | 'Semestral' | 'VIP';
  vigencia: string;
  benefits: string[];
  isPaused?: boolean;
}

interface AdminPlanesProps {
  onAddAuditLog: (action: string, category: any, user: string, severity: any) => void;
}

export default function AdminPlanes({ onAddAuditLog }: AdminPlanesProps) {
  // Load initial plans from localStorage
  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    const saved = localStorage.getItem('eqx_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaults: MembershipPlan[] = [
      { id: 'plan-1', name: 'Plan Mensual Estándar', price: 59, period: 'Mensual', vigencia: '30 días', benefits: ['Acceso ilimitado a máquinas', 'Locker gratuito', '1 clase grupal por semana'] },
      { id: 'plan-2', name: 'Plan Anual Elite', price: 499, period: 'Anual', vigencia: '365 días', benefits: ['Acceso multi-sucursal', 'Eucalyptus towels', 'Clases grupales ilimitadas', '1 sesión con coach'] },
      { id: 'plan-3', name: 'VIP Dragon Pass', price: 120, period: 'VIP', vigencia: 'Mensual recurrente', benefits: ['Acceso total prioritario', 'Zona de spa & sauna', 'Clases premium exclusivas', 'Bebidas de cortesía ilimitadas'] }
    ];
    localStorage.setItem('eqx_plans', JSON.stringify(defaults));
    return defaults;
  });

  const [showForm, setShowForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(59);
  const [period, setPeriod] = useState<'Mensual' | 'Anual' | 'Semestral' | 'VIP'>('Mensual');
  const [vigencia, setVigencia] = useState('30 días');
  const [benefitsInput, setBenefitsInput] = useState('');

  const saveToStorage = (updated: MembershipPlan[]) => {
    setPlans(updated);
    localStorage.setItem('eqx_plans', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const benefits = benefitsInput 
      ? benefitsInput.split(',').map(b => b.trim()).filter(Boolean) 
      : ['Acceso general al club', 'Locker inteligente de cortesía'];

    if (editingPlanId) {
      // Edit
      const updated = plans.map(p => p.id === editingPlanId ? { ...p, name, price, period, vigencia, benefits } : p);
      saveToStorage(updated);
      onAddAuditLog(`Membresía "${name}" modificada`, 'Suscripciones', 'Administrador', 'success');
      setEditingPlanId(null);
    } else {
      // Create
      const newPlan: MembershipPlan = {
        id: `plan-${Date.now()}`,
        name,
        price,
        period,
        vigencia,
        benefits
      };
      const updated = [...plans, newPlan];
      saveToStorage(updated);
      onAddAuditLog(`Creada membresía comercial "${name}"`, 'Suscripciones', 'Administrador', 'success');
    }

    // Reset Form
    setName('');
    setPrice(59);
    setPeriod('Mensual');
    setVigencia('30 días');
    setBenefitsInput('');
    setShowForm(false);
  };

  const handleEditClick = (plan: MembershipPlan) => {
    setEditingPlanId(plan.id);
    setName(plan.name);
    setPrice(plan.price);
    setPeriod(plan.period);
    setVigencia(plan.vigencia);
    setBenefitsInput(plan.benefits.join(', '));
    setShowForm(true);
  };

  const handleDelete = (id: string, planName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar la membresía "${planName}"?`)) {
      const updated = plans.filter(p => p.id !== id);
      saveToStorage(updated);
      onAddAuditLog(`Eliminada membresía comercial "${planName}"`, 'Suscripciones', 'Administrador', 'warning');
    }
  };

  const handleTogglePause = (id: string, planName: string, currentlyPaused?: boolean) => {
    const updated = plans.map(p => p.id === id ? { ...p, isPaused: !currentlyPaused } : p);
    saveToStorage(updated);
    const actionWord = currentlyPaused ? 'reactivada' : 'pausada temporalmente';
    onAddAuditLog(`Membresía "${planName}" ${actionWord}`, 'Suscripciones', 'Administrador', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-display font-bold text-white tracking-wider uppercase">Planes de Suscripción</h2>
          <p className="text-[10px] font-mono text-neutral-400">ADMINISTRACIÓN DE LA OFERTA COMERCIAL Y MEMBRESÍAS</p>
        </div>

        <button
          onClick={() => {
            setEditingPlanId(null);
            setName('');
            setPrice(59);
            setPeriod('Mensual');
            setVigencia('30 días');
            setBenefitsInput('');
            setShowForm(!showForm);
          }}
          className="bg-brand-gold hover:bg-brand-gold/90 text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showForm && !editingPlanId ? 'Cerrar Formulario' : 'Crear Plan Comercial'}</span>
        </button>
      </div>

      {/* CRUD Form overlay or collapsible panel */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-neutral-900/30 border border-neutral-900 p-5 rounded-2xl space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-950">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-gold">
                <Sparkles className="w-4 h-4" />
                <span>{editingPlanId ? 'EDITAR PLAN COMERCIAL' : 'NUEVO PLAN COMERCIAL'}</span>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Nombre del Plan</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. VIP Dragon Pass"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Precio de Lista ($ USD)</label>
                <input
                  type="number"
                  required
                  min="5"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Periodo de Cobro</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as any)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold font-sans"
                >
                  <option value="Mensual">Mensual</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                  <option value="VIP">VIP recurrente</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Vigencia del pase</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 30 días, 365 días"
                  value={vigencia}
                  onChange={(e) => setVigencia(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Beneficios (Separados por coma)</label>
              <textarea
                rows={2}
                placeholder="Acceso 24/7, Toallas de eucalipto, Sauna ilimitado, Clases premium"
                value={benefitsInput}
                onChange={(e) => setBenefitsInput(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4.5 py-2 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
              >
                {editingPlanId ? 'Guardar Cambios' : 'Registrar Plan'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`bg-neutral-950 border rounded-2xl p-5 space-y-4 flex flex-col justify-between relative overflow-hidden transition ${
              p.isPaused 
                ? 'opacity-65 border-red-950/40 bg-neutral-950/80' 
                : 'border-neutral-900 hover:border-neutral-800'
            }`}
          >
            {p.isPaused && (
              <div className="absolute top-2 right-2 bg-red-500/15 border border-red-500/20 text-red-500 font-mono text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                <Lock className="w-2.5 h-2.5" /> Pausado
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-white font-display tracking-wide">{p.name}</h3>
                <span className="text-[9px] font-mono font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded uppercase">
                  {p.period}
                </span>
              </div>
              <p className="text-2xl font-mono font-black text-white">
                ${p.price}<span className="text-[10px] text-neutral-500 font-normal"> USD</span>
              </p>
              <p className="text-[10px] text-neutral-500 font-mono">Vigencia Oficial: {p.vigencia}</p>
            </div>

            <div className="border-t border-neutral-900/60 pt-3.5 space-y-2 flex-1">
              {p.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-neutral-400">
                  <Check className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span className="truncate">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-900/60 pt-3 flex items-center justify-between gap-2 shrink-0">
              <button
                onClick={() => handleTogglePause(p.id, p.name, p.isPaused)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold flex items-center justify-center gap-1 transition ${
                  p.isPaused 
                    ? 'bg-neutral-900 hover:bg-neutral-850 text-emerald-400' 
                    : 'bg-neutral-900 hover:bg-neutral-850 text-amber-500'
                }`}
                title={p.isPaused ? 'Reactivar membresía' : 'Pausar temporalmente'}
              >
                {p.isPaused ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" /> Reactivar
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" /> Pausar
                  </>
                )}
              </button>

              <button
                onClick={() => handleEditClick(p)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 hover:text-white rounded-lg transition"
                title="Editar Plan"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(p.id, p.name)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-500 hover:text-red-400 rounded-lg transition"
                title="Eliminar Plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
