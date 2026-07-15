import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Award, Sparkles, X, Play, BookOpen } from 'lucide-react';
import { WorkoutRoutine } from '../../types';

interface AdminRutinasProps {
  onAddAuditLog: (action: string, category: any, user: string, severity: any) => void;
}

export default function AdminRutinas({ onAddAuditLog }: AdminRutinasProps) {
  // Load routines state from localStorage to interact directly with SocioPortal!
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => {
    const saved = localStorage.getItem('eqx_routines');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<'Principiante' | 'Intermedio' | 'Avanzado'>('Intermedio');
  const [duration, setDuration] = useState(45);
  
  // Exercise creation helper states
  const [exercises, setExercises] = useState<any[]>([]);
  const [exName, setExName] = useState('');
  const [exCategory, setExCategory] = useState('Pecho');
  const [exYoutube, setExYoutube] = useState('');
  const [exSets, setExSets] = useState(3);
  const [exReps, setExReps] = useState(10);
  const [exWeight, setExWeight] = useState(20);

  const saveRoutines = (updated: WorkoutRoutine[]) => {
    setRoutines(updated);
    localStorage.setItem('eqx_routines', JSON.stringify(updated));
  };

  const handleAddExerciseToFormList = () => {
    if (!exName) return;
    const setsArray = Array.from({ length: exSets }).map(() => ({
      reps: exReps,
      weight: exWeight,
      completed: false
    }));

    const newEx = {
      id: `ex-${Date.now()}`,
      name: exName,
      category: exCategory,
      youtubeId: exYoutube || 'rT7DgCr-3ps',
      sets: setsArray
    };

    setExercises(prev => [...prev, newEx]);
    setExName('');
    setExYoutube('');
  };

  const handleRemoveExerciseFromFormList = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleCreateRoutineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || exercises.length === 0) {
      alert('Por favor especifica un título y agrega al menos un ejercicio a la lista.');
      return;
    }

    const newRoutine: WorkoutRoutine = {
      id: `routine-${Date.now()}`,
      title,
      level,
      duration,
      exercises
    };

    const updated = [newRoutine, ...routines];
    saveRoutines(updated);
    onAddAuditLog(`Creada rutina interactiva "${title}" para socios`, 'Rutinas', 'Administrador', 'success');

    // Reset All Fields
    setTitle('');
    setLevel('Intermedio');
    setDuration(45);
    setExercises([]);
    setShowAddRoutine(false);
  };

  const handleDeleteRoutine = (id: string, routineTitle: string) => {
    if (confirm(`¿Estás seguro de eliminar la rutina "${routineTitle}"?`)) {
      const updated = routines.filter(r => r.id !== id);
      saveRoutines(updated);
      onAddAuditLog(`Eliminada rutina de entrenamiento "${routineTitle}"`, 'Rutinas', 'Administrador', 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-display font-bold text-white tracking-wider uppercase">Rutinas de Entrenamiento</h2>
          <p className="text-[10px] font-mono text-neutral-400">CREA Y ASIGNA PROGRAMAS INTERACTIVOS PARA ATLETAS</p>
        </div>

        <button
          onClick={() => {
            setTitle('');
            setExercises([]);
            setShowAddRoutine(!showAddRoutine);
          }}
          className="bg-brand-gold hover:bg-brand-gold/90 text-black px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <Award className="w-4 h-4" />
          <span>{showAddRoutine ? 'Cerrar Constructor' : 'Construir Rutina'}</span>
        </button>
      </div>

      {/* Routine Creator Form */}
      <AnimatePresence>
        {showAddRoutine && (
          <motion.form
            onSubmit={handleCreateRoutineSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-5 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-950">
              <div className="flex items-center gap-1.5 text-xs font-mono text-brand-gold">
                <Sparkles className="w-4 h-4" />
                <span>DISEÑADOR DE RUTINAS INTELIGENTES</span>
              </div>
              <button type="button" onClick={() => setShowAddRoutine(false)} className="text-neutral-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* General Routine Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Título del Entrenamiento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Tracción Dragón"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Nivel de Condición</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block">Duración Estimada (Minutos)</label>
                <input
                  type="number"
                  required
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-white outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Interactive exercise addition sub-panel */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-4.5 space-y-4">
              <p className="text-[10px] font-mono uppercase tracking-widest text-brand-gold">Añadir Ejercicios a la Rutina</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-neutral-500">Nombre del Ejercicio</label>
                  <input
                    type="text"
                    placeholder="Ej. Remo con Barra"
                    value={exName}
                    onChange={(e) => setExName(e.target.value)}
                    className="w-full text-xs bg-neutral-900/60 border border-neutral-850 rounded-xl p-2.5 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-neutral-500">Categoría muscular</label>
                  <input
                    type="text"
                    placeholder="Ej. Espalda, Pecho, Piernas"
                    value={exCategory}
                    onChange={(e) => setExCategory(e.target.value)}
                    className="w-full text-xs bg-neutral-900/60 border border-neutral-850 rounded-xl p-2.5 text-white outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-neutral-500">Video de YouTube (ID)</label>
                  <input
                    type="text"
                    placeholder="ID del Video (ej. rT7DgCr-3ps)"
                    value={exYoutube}
                    onChange={(e) => setExYoutube(e.target.value)}
                    className="w-full text-xs bg-neutral-900/60 border border-neutral-850 rounded-xl p-2.5 text-white outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Reps, Sets, weight */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-neutral-500">Sets (Series)</label>
                  <input
                    type="number"
                    value={exSets}
                    onChange={(e) => setExSets(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-900/60 border border-neutral-850 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-neutral-500">Reps por set</label>
                  <input
                    type="number"
                    value={exReps}
                    onChange={(e) => setExReps(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-900/60 border border-neutral-850 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-neutral-500">Carga (kg)</label>
                  <input
                    type="number"
                    value={exWeight}
                    onChange={(e) => setExWeight(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-900/60 border border-neutral-850 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddExerciseToFormList}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-white font-mono text-[10px] uppercase font-bold rounded-xl border border-neutral-800 flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5 text-brand-gold" /> Registrar Ejercicio en la Lista
              </button>

              {/* Added exercises table */}
              {exercises.length > 0 && (
                <div className="pt-2 space-y-2">
                  <p className="text-[9px] font-mono text-neutral-400 uppercase">Ejercicios en esta Rutina ({exercises.length}):</p>
                  <div className="space-y-1.5">
                    {exercises.map((ex, i) => (
                      <div key={ex.id} className="bg-neutral-900 border border-neutral-850 p-2.5 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-white">{ex.name}</p>
                          <p className="text-[9px] text-neutral-500 font-mono uppercase">
                            {ex.category} • {ex.sets.length} Series x {ex.sets[0].reps} Reps ({ex.sets[0].weight}kg)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExerciseFromFormList(ex.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddRoutine(false)}
                className="px-4.5 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-black font-bold text-xs transition"
              >
                Guardar Rutina Interactiva
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Routines Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routines.map((routine) => (
          <div key={routine.id} className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-semibold text-white font-display tracking-wide">{routine.title}</h4>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  Nivel: <span className="font-bold text-brand-gold uppercase">{routine.level}</span> • {routine.duration} minutos
                </p>
              </div>

              <button
                onClick={() => handleDeleteRoutine(routine.id, routine.title)}
                className="p-1.5 bg-neutral-900 hover:bg-neutral-850 rounded-lg text-neutral-500 hover:text-red-400 transition"
                title="Eliminar Rutina"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="border-t border-neutral-900/60 pt-3 space-y-2">
              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Lista de Ejercicios ({routine.exercises.length})</p>
              
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {routine.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] border-b border-neutral-900/40 pb-1.5">
                    <span className="text-neutral-300 font-medium">{ex.name}</span>
                    <span className="text-[9px] font-mono text-neutral-500">
                      {ex.sets.length}x{ex.sets[0]?.reps || 10} rps ({ex.sets[0]?.weight || 0}kg)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {routines.length === 0 && (
          <div className="col-span-2 text-center py-10 bg-neutral-900/10 border border-dashed border-neutral-900 rounded-2xl text-neutral-500 font-mono text-xs">
            No hay rutinas guardadas en el sistema. Presiona 'Construir Rutina' para registrar la primera.
          </div>
        )}
      </div>
    </div>
  );
}
