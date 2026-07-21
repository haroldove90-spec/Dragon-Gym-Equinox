import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Calendar, Trash2, Plus, Sparkles, X, ShieldCheck } from 'lucide-react';
import { GymClass } from '../../types';

interface AdminPersonalProps {
  classes: GymClass[];
  onAddClass: (newClass: GymClass) => void;
  onDeleteClass: (classId: string) => void;
  onAddAuditLog: (action: string, category: any, user: string, severity: any) => void;
}

interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export default function AdminPersonal({ classes, onAddClass, onDeleteClass, onAddAuditLog }: AdminPersonalProps) {
  // Staff lists
  const [staffList, setStaffList] = useState<StaffAccount[]>([
    { id: 'st-1', name: 'Carlos Mendoza', email: 'carlos@dragongym.com', role: 'Supervisor General', permissions: ['Control Total', 'Acceso POS', 'Modificar Clases'] },
    { id: 'st-2', name: 'Jimena Ruíz', email: 'jimena@dragongym.com', role: 'Encargado de Turno', permissions: ['Check-in de Socios', 'Acceso POS'] },
    { id: 'st-3', name: 'Andrés López', email: 'andres@dragongym.com', role: 'Coordinador POS', permissions: ['Acceso POS', 'Manejo de Inventario'] }
  ]);

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState('Encargado de Turno');
  const [staffPerms, setStaffPerms] = useState<string[]>(['Check-in de Socios']);

  const [showAddClass, setShowAddClass] = useState(false);
  const [classTitle, setClassTitle] = useState('');
  const [classCategory, setClassCategory] = useState<'HIIT' | 'Funcional' | 'Pilates' | 'Running' | 'Cycling' | 'Strength'>('HIIT');
  const [classInstructor, setClassInstructor] = useState('');
  const [classDuration, setClassDuration] = useState(45);
  const [classTime, setClassTime] = useState('09:00 AM');
  const [classCapacity, setClassCapacity] = useState(25);
  const [classDescription, setClassDescription] = useState('');

  const handleTogglePerm = (perm: string) => {
    setStaffPerms(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;

    const newStaff: StaffAccount = {
      id: `st-${Date.now()}`,
      name: staffName,
      email: staffEmail,
      role: staffRole,
      permissions: staffPerms
    };

    setStaffList(prev => [...prev, newStaff]);
    onAddAuditLog(`Alta de personal: ${staffName} (${staffRole})`, 'Socios', 'Administrador', 'success');

    // Reset Form
    setStaffName('');
    setStaffEmail('');
    setStaffRole('Encargado de Turno');
    setStaffPerms(['Check-in de Socios']);
    setShowAddStaff(false);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classTitle || !classInstructor) return;

    const imagesByCategory: Record<string, string> = {
      HIIT: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
      Funcional: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop',
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
      location: 'Studio Principal, Hudson Yards',
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
    onAddAuditLog(`Sesión programada: ${classTitle} con ${classInstructor}`, 'Clases', 'Administrador', 'success');

    // Reset Form
    setClassTitle('');
    setClassInstructor('');
    setClassDuration(45);
    setClassTime('09:00 AM');
    setClassCapacity(25);
    setClassDescription('');
    setShowAddClass(false);
  };

  return (
    <div className="space-y-8">
      {/* 1. Control de Staff */}
      <div className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wide">Plantilla de Instructores y Staff</h3>
            <p className="text-xs text-neutral-400">Control de entrenadores, coordinadores de sala y accesos autorizados</p>
          </div>
          <button
            onClick={() => setShowAddStaff(!showAddStaff)}
            className="bg-brand-gold hover:bg-brand-gold/90 text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Alta de Personal</span>
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
              className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 space-y-4 overflow-hidden"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold pb-2 border-b border-neutral-950">
                <Sparkles className="w-4 h-4" />
                <span>NUEVA CREDENCIAL DE COLABORADOR</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="Ej. Coach David"
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Email Corporativo</label>
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="david@dragongym.com"
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Rol Organizacional</label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                  >
                    <option value="Supervisor General">Supervisor General</option>
                    <option value="Encargado de Turno">Encargado de Turno</option>
                    <option value="Coordinador POS">Coordinador POS</option>
                  </select>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Permisos Autorizados</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Check-in de Socios', 'Acceso POS', 'Modificar Clases', 'Manejo de Inventario', 'Control Total'].map((perm) => {
                    const active = staffPerms.includes(perm);
                    return (
                      <button
                        key={perm}
                        type="button"
                        onClick={() => handleTogglePerm(perm)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold transition border ${
                          active 
                            ? 'bg-brand-gold text-black border-brand-gold' 
                            : 'bg-neutral-950 border-neutral-900 text-neutral-500 hover:text-white'
                        }`}
                      >
                        {perm}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Confirmar Contratación
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Staff grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {staffList.map((st) => (
            <div key={st.id} className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-white">{st.name}</h4>
                  <p className="text-[10px] text-neutral-500 font-mono">{st.email}</p>
                </div>
                <span className="text-[8px] font-mono text-brand-gold bg-brand-gold/10 border border-brand-gold/15 px-2 py-0.5 rounded uppercase font-bold shrink-0">
                  {st.role}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-neutral-900/60">
                <p className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">Permisos habilitados</p>
                <div className="flex flex-wrap gap-1">
                  {st.permissions.map((p, i) => (
                    <span key={i} className="text-[8px] font-mono text-zinc-300 bg-neutral-900 px-2 py-0.5 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Programador de Sesiones */}
      <div className="space-y-4 border-t border-neutral-900/40 pt-8">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white font-display uppercase tracking-wide">Programador de Sesiones</h3>
            <p className="text-xs text-neutral-400">Publica sesiones en vivo en el calendario, asigna coach y limita aforos máximos</p>
          </div>
          <button
            onClick={() => setShowAddClass(!showAddClass)}
            className="bg-white hover:bg-neutral-200 text-black px-4.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Calendar className="w-4 h-4" />
            <span>Programar Sesión</span>
          </button>
        </div>

        {/* Add Class Form */}
        <AnimatePresence>
          {showAddClass && (
            <motion.form
              onSubmit={handleCreateClass}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 space-y-4 overflow-hidden"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold pb-2 border-b border-neutral-950">
                <Sparkles className="w-4 h-4" />
                <span>NUEVA SESIÓN EN CALENDARIO</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Nombre de la Sesión</label>
                  <input
                    type="text"
                    required
                    value={classTitle}
                    onChange={(e) => setClassTitle(e.target.value)}
                    placeholder="Ej. Boxeo Imperial"
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
                    placeholder="Ej. Coach Elena B."
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Disciplina / Categoría</label>
                  <select
                    value={classCategory}
                    onChange={(e) => setClassCategory(e.target.value as any)}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                  >
                    <option value="HIIT">HIIT</option>
                    <option value="Funcional">Funcional</option>
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
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Aforo Máximo (Cupos)</label>
                  <input
                    type="number"
                    required
                    value={classCapacity}
                    onChange={(e) => setClassCapacity(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Descripción Breve</label>
                <textarea
                  value={classDescription}
                  onChange={(e) => setClassDescription(e.target.value)}
                  placeholder="Describe la clase..."
                  rows={2}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Publicar Sesión
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Classes Scheduled List representation */}
        <div className="space-y-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={cls.image}
                  alt={cls.title}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-900 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">{cls.title}</span>
                    <span className="text-[8px] font-mono tracking-wide text-brand-gold bg-brand-gold/10 px-1.5 py-0.2 rounded font-bold uppercase">
                      {cls.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Coach: <span className="font-semibold text-white">{cls.instructor}</span> • {cls.time} • {cls.duration} mins
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t border-neutral-900/65 pt-2.5 md:pt-0 md:border-0">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">Capacidad: {classCapacity} cupos</span>
                <button
                  onClick={() => {
                    if (confirm(`¿Deseas retirar del calendario la sesión "${cls.title}"?`)) {
                      onDeleteClass(cls.id);
                    }
                  }}
                  className="p-2 bg-neutral-900 hover:bg-neutral-850 rounded-xl text-neutral-500 hover:text-red-400 transition"
                  title="Retirar Sesión"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
