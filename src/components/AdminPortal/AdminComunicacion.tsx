import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Plus, Trash2, Sparkles, X, AlertTriangle } from 'lucide-react';

interface GymAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'Alta' | 'Normal';
  date: string;
}

interface AdminComunicacionProps {
  onAddAuditLog: (action: string, category: any, user: string, severity: any) => void;
}

export default function AdminComunicacion({ onAddAuditLog }: AdminComunicacionProps) {
  // Load announcements from localStorage to coordinate directly with SocioPortal!
  const [announcements, setAnnouncements] = useState<GymAnnouncement[]>(() => {
    const saved = localStorage.getItem('eqx_announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Alta' | 'Normal'>('Normal');

  const saveAnnouncements = (updated: GymAnnouncement[]) => {
    setAnnouncements(updated);
    localStorage.setItem('eqx_announcements', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    const formattedDate = new Date().toLocaleDateString('es-MX', options);

    const newAnnouncement: GymAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      priority,
      date: `Publicado hoy • ${formattedDate}`
    };

    const updated = [newAnnouncement, ...announcements];
    saveAnnouncements(updated);
    onAddAuditLog(`Publicado comunicado oficial: "${title}"`, 'Comunicaciones', 'Administrador', 'success');

    // Reset Form
    setTitle('');
    setContent('');
    setPriority('Normal');
    setShowAddForm(false);
  };

  const handleDelete = (id: string, annTitle: string) => {
    if (confirm(`¿Deseas retirar el comunicado "${annTitle}"?`)) {
      const updated = announcements.filter(a => a.id !== id);
      saveAnnouncements(updated);
      onAddAuditLog(`Retirado comunicado oficial: "${annTitle}"`, 'Comunicaciones', 'Administrador', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-display font-bold text-white tracking-wider uppercase">Central de Comunicación</h2>
          <p className="text-[10px] font-mono text-neutral-400">PUBLICA COMUNICADOS OFICIALES EN LOS PORTALES DE SOCIOS</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-brand-gold hover:bg-brand-gold/90 text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <Megaphone className="w-4 h-4" />
          <span>{showAddForm ? 'Cerrar Publicador' : 'Redactar Aviso'}</span>
        </button>
      </div>

      {/* Add Notice Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-950">
              <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold">
                <Sparkles className="w-4 h-4" />
                <span>REDACTAR AVISO OFICIAL</span>
              </div>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Título del Comunicado</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mantenimiento del Sistema de Calefacción en Albercas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Prioridad de Aviso</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                >
                  <option value="Normal">Normal</option>
                  <option value="Alta">Alta (Coloración Alerta)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Mensaje / Contenido Completo</label>
              <textarea
                required
                rows={4}
                placeholder="Estimados atletas, les informamos que el próximo fin de semana..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4.5 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition"
              >
                Publicar Comunicado
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Published Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => {
          const isHigh = ann.priority === 'Alta';
          return (
            <div
              key={ann.id}
              className={`border rounded-2xl p-5 space-y-3 flex justify-between items-start gap-4 transition ${
                isHigh 
                  ? 'bg-red-500/5 border-red-950/60' 
                  : 'bg-neutral-950 border-neutral-900'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-white tracking-wide">{ann.title}</h4>
                  {isHigh && (
                    <span className="text-[8px] font-mono bg-red-500/15 border border-red-500/20 text-red-500 font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                      <AlertTriangle className="w-2.5 h-2.5" /> Urgente
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">{ann.content}</p>
                <p className="text-[9px] text-neutral-500 font-mono uppercase">{ann.date}</p>
              </div>

              <button
                onClick={() => handleDelete(ann.id, ann.title)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-850 rounded-lg text-neutral-500 hover:text-red-400 transition"
                title="Retirar Comunicado"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {announcements.length === 0 && (
          <div className="text-center py-10 bg-neutral-900/10 border border-dashed border-neutral-900 rounded-2xl text-neutral-500 font-mono text-xs">
            No hay comunicados activos en el sistema. Presiona 'Redactar Aviso' para publicar uno nuevo.
          </div>
        )}
      </div>
    </div>
  );
}
