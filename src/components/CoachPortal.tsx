import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Dumbbell, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Users, 
  LineChart, 
  Video, 
  Save, 
  PlusCircle, 
  Check, 
  CheckCircle, 
  TrendingUp,
  Flame,
  User,
  Activity,
  ChevronRight,
  Info,
  Sliders,
  Sparkles,
  Play,
  RotateCcw,
  BookOpen,
  ShieldAlert,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { UserProfile, GymClass } from '../types';

interface CoachPortalProps {
  user: UserProfile;
  classes: GymClass[];
  onClose: () => void;
  onTriggerNotification: (message: string) => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

interface MachineExerciseInfo {
  id: string;
  code: string;
  name: string;
  targetMuscles: string;
  youtubeId: string;
  commonErrors: string[];
  recommendations: string[];
}

interface ProgressLog {
  date: string;
  weight: number;
  fatPercent: number;
  chest: number;
  waist: number;
  arm: number;
}

interface AssignedSocio {
  id: string;
  name: string;
  email: string;
  membership: string;
  streak: number;
  avatarLetter: string;
  isCurrentUser?: boolean;
}

interface AssignedRoutine {
  id: string;
  title: string;
  daysPerWeek: number;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    notes?: string;
  }[];
}

export default function CoachPortal({
  user,
  classes,
  onClose,
  onTriggerNotification,
  onUpdateUser
}: CoachPortalProps) {
  const [activeTab, setActiveTab] = useState<'ejercicios' | 'socios'>('ejercicios');

  // =========================================================================
  // --- STATE FOR MACHINES & EXERCISES (CRUD) ---
  // =========================================================================
  const [machinesList, setMachinesList] = useState<MachineExerciseInfo[]>(() => {
    const saved = localStorage.getItem('eqx_machines');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default fallback
    return [
      {
        id: 'mac-1',
        code: 'PRENSA-45',
        name: 'Prensa de Piernas 45° de Poder',
        targetMuscles: 'Cuádriceps, Glúteo Mayor, Femorales',
        youtubeId: 'rT7DgCr-3ps',
        commonErrors: [
          'Bloquear las rodillas por completo en el punto de extensión máxima.',
          'Despegar la cadera o la pelvis del respaldo durante la fase de descenso.',
          'Hacer un rango de movimiento excesivamente corto o rebotar la carga.'
        ],
        recommendations: [
          'Controla el descenso durante al menos 3 segundos de forma constante.',
          'Mantén la planta completa de tus pies apoyada firmemente en la plataforma.',
          'Empuja con la fuerza de los talones y mantén la cadera firme contra el asiento.'
        ]
      },
      {
        id: 'mac-2',
        code: 'POLEA-ALTA',
        name: 'Polea Alta de Jalón Dorsal',
        targetMuscles: 'Dorsal Ancho, Redondo Mayor, Bíceps Braquial',
        youtubeId: 'op9kVnSMy6Q',
        commonErrors: [
          'Balancear exageradamente el torso hacia atrás para ayudarse con el peso corporal.',
          'Iniciar el movimiento jalando con las manos y antebrazos en lugar de empujar con los codos.',
          'Llevar la barra demasiado abajo (por debajo del pecho o abdomen).'
        ],
        recommendations: [
          'Mantén el pecho elevado y lleva la barra hacia la parte superior de tu esternón.',
          'Imagina que intentas tocar tus bolsillos traseros con los codos al descender.',
          'Sostén la contracción 1 segundo abajo y controla el retorno lentamente.'
        ]
      },
      {
        id: 'mac-3',
        code: 'PEC-DEC',
        name: 'Aperturas en Pec Dec / Crossover',
        targetMuscles: 'Pectoral Mayor, Deltoides Anterior',
        youtubeId: 'roCP6nM_tGo',
        commonErrors: [
          'Flexionar excesivamente los codos, convirtiendo el ejercicio en un press.',
          'Encorvar los hombros hacia adelante, quitándole trabajo al pectoral.',
          'Hacer movimientos rápidos sin controlar la contracción isométrica.'
        ],
        recommendations: [
          'Mantén una retracción escapular activa contra el respaldo del asiento.',
          'Imagina que abrazas un cilindro gigante para mantener los brazos en un arco constante.',
          'Exprime fuertemente los pectorales durante 1.5 segundos en la fase de máximo cierre.'
        ]
      },
      {
        id: 'mac-4',
        code: 'BARRA-LIBRE',
        name: 'Jaula de Sentadilla Libre',
        targetMuscles: 'Cuádriceps, Glúteo Mayor, Core Lumbar, Femorales',
        youtubeId: '2yjwXTZQDDI',
        commonErrors: [
          'Permitir que las rodillas colapsen hacia adentro al subir (valgo de rodilla).',
          'Despegar los talones del suelo, sobrecargando las articulaciones rotulianas.',
          'Perder la curvatura neutra de la columna lumbar al descender.'
        ],
        recommendations: [
          'Empuja activamente las rodillas hacia afuera alineándolas con la punta de tus pies.',
          'Inicia el movimiento empujando la cadera ligeramente hacia atrás como si te sentaras.',
          'Mantén el abdomen ultra compacto y empuja firmemente con toda la planta del pie.'
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('eqx_machines', JSON.stringify(machinesList));
  }, [machinesList]);

  const [searchQuery, setSearchQuery] = useState('');
  const [editingMachine, setEditingMachine] = useState<MachineExerciseInfo | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [targetMuscles, setTargetMuscles] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [errorInput, setErrorInput] = useState('');
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const [recInput, setRecInput] = useState('');
  const [recsList, setRecsList] = useState<string[]>([]);

  const handleAddError = () => {
    if (errorInput.trim()) {
      setErrorsList(prev => [...prev, errorInput.trim()]);
      setErrorInput('');
    }
  };

  const handleAddRec = () => {
    if (recInput.trim()) {
      setRecsList(prev => [...prev, recInput.trim()]);
      setRecInput('');
    }
  };

  const handleSaveMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !targetMuscles) {
      onTriggerNotification("⚠️ Por favor completa los campos requeridos (Código, Nombre, Músculos).");
      return;
    }

    if (editingMachine) {
      // Edit mode
      const updated = machinesList.map(m => m.id === editingMachine.id ? {
        ...m,
        code: code.toUpperCase().trim(),
        name: name.trim(),
        targetMuscles: targetMuscles.trim(),
        youtubeId: youtubeId.trim(),
        commonErrors: errorsList,
        recommendations: recsList
      } : m);
      setMachinesList(updated);
      onTriggerNotification(`✅ Máquina "${name}" actualizada con éxito.`);
      setEditingMachine(null);
    } else {
      // Create mode
      const newMac: MachineExerciseInfo = {
        id: `mac-${Date.now()}`,
        code: code.toUpperCase().trim(),
        name: name.trim(),
        targetMuscles: targetMuscles.trim(),
        youtubeId: youtubeId.trim(),
        commonErrors: errorsList.length > 0 ? errorsList : ['Sin errores comunes registrados aún.'],
        recommendations: recsList.length > 0 ? recsList : ['Mantén siempre buena postura y control de la carga.']
      };
      setMachinesList(prev => [newMac, ...prev]);
      onTriggerNotification(`✅ Nueva máquina "${name}" dada de alta.`);
      setShowAddForm(false);
    }

    // Reset fields
    setCode('');
    setName('');
    setTargetMuscles('');
    setYoutubeId('');
    setErrorsList([]);
    setRecsList([]);
  };

  const handleEditClick = (mac: MachineExerciseInfo) => {
    setEditingMachine(mac);
    setShowAddForm(true);
    setCode(mac.code);
    setName(mac.name);
    setTargetMuscles(mac.targetMuscles);
    setYoutubeId(mac.youtubeId);
    setErrorsList(mac.commonErrors);
    setRecsList(mac.recommendations);
  };

  const handleDeleteMachine = (id: string, macName: string) => {
    if (confirm(`¿Deseas dar de baja la máquina "${macName}" de forma permanente del catálogo?`)) {
      setMachinesList(prev => prev.filter(m => m.id !== id));
      onTriggerNotification(`🗑️ Máquina "${macName}" eliminada del catálogo.`);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingMachine(null);
    setCode('');
    setName('');
    setTargetMuscles('');
    setYoutubeId('');
    setErrorsList([]);
    setRecsList([]);
  };

  const filteredMachines = machinesList.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.targetMuscles.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =========================================================================
  // --- STATE FOR ATHLETE PROGRESS TRACKING (SOCIOS MONITOR) ---
  // =========================================================================
  const [currentUserProgress, setCurrentUserProgress] = useState<ProgressLog[]>(() => {
    const saved = localStorage.getItem('eqx_progress_history');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { console.error(e); }
    }
    return [
      { date: '15 Jul 2026', weight: 77.8, fatPercent: 14.2, chest: 104.5, waist: 81, arm: 38.5 },
      { date: '08 Jul 2026', weight: 78.1, fatPercent: 14.5, chest: 104, waist: 81.5, arm: 38.2 },
      { date: '01 Jul 2026', weight: 78.5, fatPercent: 14.8, chest: 104, waist: 82, arm: 38 }
    ];
  });

  const athletesList: AssignedSocio[] = [
    { id: user.id || 'SOC-MOLLY', name: `${user.name} (Atleta Actual)`, email: user.email || 'atleta@dragongym.com', membership: user.membershipLevel, streak: user.checkInCount, avatarLetter: user.avatarLetter || 'M', isCurrentUser: true },
    { id: 'SOC-JUAN', name: 'Juan Carlos Gómez', email: 'juan.gomez@gmail.com', membership: 'Plan Anual Elite', streak: 4, avatarLetter: 'J' },
    { id: 'SOC-SOFIA', name: 'Sofía Montserrat', email: 'sofia.mont@outlook.com', membership: 'VIP Dragon Pass', streak: 5, avatarLetter: 'S' },
    { id: 'SOC-LUCAS', name: 'Lucas Peralta', email: 'l.peralta@yahoo.com', membership: 'Plan Mensual Estándar', streak: 1, avatarLetter: 'L' }
  ];

  const [selectedSocioId, setSelectedSocioId] = useState<string>(athletesList[0].id);
  const selectedSocio = athletesList.find(a => a.id === selectedSocioId) || athletesList[0];

  // Assigned complementary routines stored by socio id
  const [assignedRoutines, setAssignedRoutines] = useState<Record<string, AssignedRoutine>>(() => {
    const saved = localStorage.getItem('eqx_coach_routines');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { console.error(e); }
    }
    return {
      'SOC-MOLLY': {
        id: 'rout-molly',
        title: 'Fuerza Dragon Imperial (Core y Empuje)',
        daysPerWeek: 3,
        exercises: [
          { name: 'Prensa de Piernas 45°', sets: 4, reps: '10, 10, 8, 8', notes: 'Incrementar peso progresivamente en cada serie.' },
          { name: 'Fondos de Pecho con Lastre', sets: 3, reps: 'Al fallo controlado', notes: 'Asegurar buena extensión de hombros.' },
          { name: 'Sentadilla Hack Enfocada', sets: 4, reps: '12, 10, 10, 8', notes: 'Mantener tensión constante abajo.' }
        ]
      },
      'SOC-JUAN': {
        id: 'rout-juan',
        title: 'Hipertrofia de Tracción y Espalda',
        daysPerWeek: 4,
        exercises: [
          { name: 'Polea Alta de Jalón Dorsal', sets: 4, reps: '12, 10, 10, 8', notes: 'Maximizar contracción isométrica.' },
          { name: 'Remo con Barra T agarre prono', sets: 3, reps: '10', notes: 'Espalda totalmente recta.' }
        ]
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('eqx_coach_routines', JSON.stringify(assignedRoutines));
  }, [assignedRoutines]);

  // Routines adjustment form state
  const [routineTitle, setRoutineTitle] = useState('');
  const [routineDays, setRoutineDays] = useState(3);
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState(4);
  const [exReps, setExReps] = useState('12, 10, 8, 8');
  const [exNotes, setExNotes] = useState('');
  const [tempExercises, setTempExercises] = useState<{ name: string; sets: number; reps: string; notes?: string }[]>([]);

  // --- COACH IA INTEGRATION STATES ---
  const [aiRoutineObjective, setAiRoutineObjective] = useState<string>('Hipertrofia muscular general');
  const [aiRoutineInjuries, setAiRoutineInjuries] = useState<string>('Ninguna');
  const [aiRoutineLoading, setAiRoutineLoading] = useState<boolean>(false);

  const [aiRiskAlert, setAiRiskAlert] = useState<string>('');
  const [aiRiskLoading, setAiRiskLoading] = useState<boolean>(false);

  // Simulated volume report per muscle group
  const getSocioVolumeReport = (id: string) => {
    if (id === 'SOC-JUAN') {
      return [
        { group: 'Espalda / Tracción', lastWeek: 2100, thisWeek: 2250, change: '+7%' },
        { group: 'Hombro / Empuje', lastWeek: 800, thisWeek: 1150, change: '+43.8%' },
        { group: 'Bíceps', lastWeek: 600, thisWeek: 650, change: '+8.3%' }
      ];
    }
    if (id === 'SOC-SOFIA') {
      return [
        { group: 'Piernas / Glúteo', lastWeek: 1500, thisWeek: 2150, change: '+43.3%' },
        { group: 'Core / Abdomen', lastWeek: 400, thisWeek: 420, change: '+5%' }
      ];
    }
    // Default (Molly)
    return [
      { group: 'Pecho / Pectoral', lastWeek: 1200, thisWeek: 1300, change: '+8.3%' },
      { group: 'Hombro / Deltoides', lastWeek: 400, thisWeek: 580, change: '+45%' },
      { group: 'Cuádriceps', lastWeek: 2500, thisWeek: 2650, change: '+6%' }
    ];
  };

  const currentVolumeReport = getSocioVolumeReport(selectedSocioId);

  // 1. handleGenerateAiRoutine: Calls /api/gemini/generar-rutina and populates the form list
  const handleGenerateAiRoutine = async () => {
    setAiRoutineLoading(true);
    try {
      const response = await fetch("/api/gemini/generar-rutina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            objetivo: aiRoutineObjective,
            lesiones: aiRoutineInjuries,
            dias: routineDays
          },
          machines: machinesList
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.title) setRoutineTitle(data.title);
      if (data.daysPerWeek) setRoutineDays(data.daysPerWeek);
      if (data.exercises && Array.isArray(data.exercises)) {
        setTempExercises(data.exercises);
        onTriggerNotification("✨ Gemini ha propuesto una rutina adaptada al equipamiento real. ¡Lista para tu revisión!");
      } else {
        onTriggerNotification("⚠️ Formato de respuesta de Gemini inesperado.");
      }
    } catch (err: any) {
      console.error(err);
      onTriggerNotification("❌ Error al generar rutina: " + err.message);
    } finally {
      setAiRoutineLoading(false);
    }
  };

  // 2. handleDetectInjuryRisk: Calls /api/gemini/detectar-riesgo
  const handleDetectInjuryRisk = async () => {
    setAiRiskLoading(true);
    setAiRiskAlert('');
    try {
      const response = await fetch("/api/gemini/detectar-riesgo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socioName: selectedSocio.name,
          volumeReport: currentVolumeReport
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setAiRiskAlert(data.alert || "Análisis completado sin alertas críticas detectadas.");
      onTriggerNotification("✨ Análisis de riesgo de lesión completado.");
    } catch (err: any) {
      console.error(err);
      onTriggerNotification("❌ Error de análisis de lesión: " + err.message);
    } finally {
      setAiRiskLoading(false);
    }
  };

  // Load routine details when switching selected athlete
  useEffect(() => {
    setAiRiskAlert(''); // Clear alert when switching socio
    const existing = assignedRoutines[selectedSocioId];
    if (existing) {
      setRoutineTitle(existing.title);
      setRoutineDays(existing.daysPerWeek);
      setTempExercises(existing.exercises);
    } else {
      setRoutineTitle('Rutina de Acondicionamiento Complementaria');
      setRoutineDays(3);
      setTempExercises([
        { name: 'Sentadilla Goblet con Mancuerna', sets: 4, reps: '12 reps', notes: 'Controlar bajada de 2 segundos.' },
        { name: 'Lagartijas o Flexiones Planas', sets: 3, reps: '15 reps', notes: 'Core ultra compacto.' }
      ]);
    }
  }, [selectedSocioId, assignedRoutines]);

  const handleAddExToTemp = () => {
    if (!exName.trim()) {
      onTriggerNotification("⚠️ Escribe el nombre del ejercicio.");
      return;
    }
    setTempExercises(prev => [...prev, {
      name: exName.trim(),
      sets: exSets,
      reps: exReps.trim(),
      notes: exNotes.trim()
    }]);
    setExName('');
    setExSets(4);
    setExReps('12, 10, 8, 8');
    setExNotes('');
    onTriggerNotification("💪 Ejercicio agregado a la rutina temporal.");
  };

  const handleRemoveExFromTemp = (index: number) => {
    setTempExercises(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveRoutineForSocio = () => {
    if (!routineTitle.trim()) {
      onTriggerNotification("⚠️ Por favor escribe el título de la rutina.");
      return;
    }
    if (tempExercises.length === 0) {
      onTriggerNotification("⚠️ La rutina debe contener al menos un ejercicio.");
      return;
    }

    const updated = {
      ...assignedRoutines,
      [selectedSocioId]: {
        id: `rout-${selectedSocioId}-${Date.now()}`,
        title: routineTitle.trim(),
        daysPerWeek: routineDays,
        exercises: tempExercises
      }
    };

    setAssignedRoutines(updated);
    onTriggerNotification(`🔥 Rutina complementaria asignada exitosamente a ${selectedSocio.name}.`);
  };

  // Get metrics lists depending on selected athlete
  const getSocioLogs = (id: string): ProgressLog[] => {
    if (id === user.id || id === 'SOC-MOLLY') {
      return currentUserProgress;
    }
    // Mocked logs for others
    if (id === 'SOC-JUAN') {
      return [
        { date: '12 Jul 2026', weight: 84.2, fatPercent: 18.2, chest: 110, waist: 90, arm: 41 },
        { date: '01 Jul 2026', weight: 85.5, fatPercent: 18.9, chest: 109, waist: 91, arm: 40.5 }
      ];
    }
    if (id === 'SOC-SOFIA') {
      return [
        { date: '14 Jul 2026', weight: 58.1, fatPercent: 19.5, chest: 92, waist: 66, arm: 28 },
        { date: '01 Jul 2026', weight: 59.4, fatPercent: 20.3, chest: 92, waist: 67, arm: 27.5 }
      ];
    }
    // Lucas Peralta
    return [
      { date: '05 Jul 2026', weight: 92.5, fatPercent: 25.1, chest: 115, waist: 102, arm: 42 }
    ];
  };

  const currentLogs = getSocioLogs(selectedSocioId);

  // Video tutorial player state in Coach view
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);

  return (
    <div id="coach-portal" className="fixed inset-0 bg-[#070707] z-50 flex flex-col font-sans select-none overflow-hidden text-neutral-200">
      
      {/* HEADER PRINCIPAL PORTAL COACH */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
            <Sliders className="w-4.5 h-4.5 text-brand-gold animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-display font-black tracking-[0.2em] text-white">PORTAL ENTRENADOR / COACH</h1>
            <p className="text-[9px] font-mono tracking-widest text-brand-gold uppercase">Seguimiento Técnico, Rutinas e Instructivos</p>
          </div>
        </div>

        {/* Tab Selector desktop */}
        <div className="hidden md:flex items-center gap-1.5 bg-neutral-900/40 p-1 rounded-xl border border-neutral-850">
          <button
            onClick={() => setActiveTab('ejercicios')}
            className={`py-1.5 px-4 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-2 ${
              activeTab === 'ejercicios' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            Catálogo de Ejercicios & Máquinas
          </button>
          <button
            onClick={() => setActiveTab('socios')}
            className={`py-1.5 px-4 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-2 ${
              activeTab === 'socios' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <Users className="w-4 h-4" />
            Monitoreo & Ajuste de Rutinas
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* VIEWPORT CONTENIDO COACH */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-28 md:pb-6">
        
        {/* =========================================================================
            TAB 1: GESTIÓN DE EJERCICIOS Y MÁQUINAS (CRUD)
            ========================================================================= */}
        {activeTab === 'ejercicios' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-6xl mx-auto"
          >
            {/* Header del módulo */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-gold" />
                  Ejercicios y Equipamiento Oficial del Club
                </h2>
                <p className="text-xs text-neutral-400">
                  Agrega, edita y gestiona las especificaciones técnicas de las máquinas que los socios escanean en sala.
                </p>
              </div>

              {!showAddForm && (
                <button
                  onClick={() => {
                    setEditingMachine(null);
                    setShowAddForm(true);
                  }}
                  className="bg-brand-gold hover:bg-brand-muted-gold text-black px-4.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                  Nueva Máquina / Ejercicio
                </button>
              )}
            </div>

            {/* Formulario de Alta y Edición */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 overflow-hidden shadow-xl"
                >
                  <form onSubmit={handleSaveMachine} className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                      <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {editingMachine ? 'EDITAR MÁQUINA EN CATÁLOGO' : 'DAR DE ALTA NUEVO EQUIPAMIENTO / EJERCICIO'}
                      </span>
                      <button 
                        type="button" 
                        onClick={handleCancelForm}
                        className="text-neutral-500 hover:text-neutral-300 text-xs font-mono"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Código Único del QR */}
                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">
                          Código Identificador (QR) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Ej. PRENSA-45"
                          className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 focus:border-brand-gold outline-none text-white transition"
                        />
                      </div>

                      {/* Nombre descriptivo */}
                      <div className="md:col-span-5 space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">
                          Nombre Comercial del Equipo / Ejercicio <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ej. Prensa de Piernas de Poder 45°"
                          className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 focus:border-brand-gold outline-none text-white transition"
                        />
                      </div>

                      {/* Músculos objetivo */}
                      <div className="md:col-span-4 space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">
                          Grupos Musculares Objetivo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={targetMuscles}
                          onChange={(e) => setTargetMuscles(e.target.value)}
                          placeholder="Ej. Cuádriceps, Glúteo, Femorales"
                          className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 focus:border-brand-gold outline-none text-white transition"
                        />
                      </div>
                    </div>

                    {/* YouTube Video URL / ID */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">
                        YouTube Video ID / URL Instructivo (Para Video Guía)
                      </label>
                      <div className="flex gap-2">
                        <span className="bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs rounded-xl text-neutral-500 font-mono flex items-center shrink-0">
                          https://youtu.be/
                        </span>
                        <input
                          type="text"
                          value={youtubeId}
                          onChange={(e) => setYoutubeId(e.target.value)}
                          placeholder="Ej. rT7DgCr-3ps"
                          className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 focus:border-brand-gold outline-none text-white transition font-mono"
                        />
                      </div>
                      <p className="text-[9px] text-neutral-500">
                        Escribe el identificador final del video de YouTube (ej. op9kVnSMy6Q) para habilitar el reproductor inmersivo.
                      </p>
                    </div>

                    {/* Sección Interactiva para añadir Errores Comunes y Consejos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Errores Comunes */}
                      <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-4 space-y-3">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-red-400 block font-bold">
                          Lista de Errores Comunes
                        </label>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={errorInput}
                            onChange={(e) => setErrorInput(e.target.value)}
                            placeholder="Ej. Bloquear rodillas al extender..."
                            className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 focus:border-red-500 outline-none text-white transition"
                          />
                          <button
                            type="button"
                            onClick={handleAddError}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-3.5 rounded-xl text-xs transition"
                          >
                            Agregar
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
                          {errorsList.map((err, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-2 bg-neutral-950/40 rounded-lg border border-neutral-900">
                              <span className="text-neutral-300 line-clamp-1">{err}</span>
                              <button
                                type="button"
                                onClick={() => setErrorsList(prev => prev.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-300 font-mono text-xs px-1"
                              >
                                🗙
                              </button>
                            </div>
                          ))}
                          {errorsList.length === 0 && (
                            <p className="text-[10px] text-neutral-500 font-mono py-1">No hay errores comunes registrados.</p>
                          )}
                        </div>
                      </div>

                      {/* Recomendaciones Técnicas */}
                      <div className="bg-neutral-900/30 border border-neutral-900 rounded-xl p-4 space-y-3">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block font-bold">
                          Lista de Recomendaciones Técnicas
                        </label>
                        
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={recInput}
                            onChange={(e) => setRecInput(e.target.value)}
                            placeholder="Ej. Controla el descenso en 3 segundos..."
                            className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 focus:border-emerald-500 outline-none text-white transition"
                          />
                          <button
                            type="button"
                            onClick={handleAddRec}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white px-3.5 rounded-xl text-xs transition"
                          >
                            Agregar
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
                          {recsList.map((rec, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-2 bg-neutral-950/40 rounded-lg border border-neutral-900">
                              <span className="text-neutral-300 line-clamp-1">{rec}</span>
                              <button
                                type="button"
                                onClick={() => setRecsList(prev => prev.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-300 font-mono text-xs px-1"
                              >
                                🗙
                              </button>
                            </div>
                          ))}
                          {recsList.length === 0 && (
                            <p className="text-[10px] text-neutral-500 font-mono py-1">No hay recomendaciones registradas.</p>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancelForm}
                        className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-900 text-xs font-bold text-neutral-400 transition"
                      >
                        Descartar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {editingMachine ? 'Guardar Cambios' : 'Registrar Equipo'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Listado y Búsqueda */}
            <div className="space-y-4">
              <div className="flex gap-3 bg-neutral-950 border border-neutral-900 p-3 rounded-2xl">
                <Search className="w-5 h-5 text-neutral-500 shrink-0 self-center ml-1" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar máquina por nombre, código QR o grupo muscular..."
                  className="w-full bg-transparent text-xs text-white outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-brand-gold hover:underline font-mono px-2 shrink-0"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Grid de Máquinas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMachines.map(m => (
                  <div 
                    key={m.id} 
                    className="bg-neutral-950 border border-neutral-900 rounded-2xl p-4 flex flex-col justify-between hover:border-brand-gold/30 transition duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-mono tracking-widest text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded uppercase font-bold">
                            QR: {m.code}
                          </span>
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display mt-1.5">{m.name}</h4>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleEditClick(m)}
                            className="p-1.5 rounded bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-850 transition"
                            title="Editar ficha"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMachine(m.id, m.name)}
                            className="p-1.5 rounded bg-neutral-900 text-red-400 hover:text-red-300 hover:bg-neutral-850 transition"
                            title="Dar de baja"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="text-neutral-400 font-medium">
                          <span className="font-semibold text-neutral-300">Enfoque:</span> {m.targetMuscles}
                        </p>
                        {m.youtubeId && (
                          <button
                            onClick={() => setActiveYoutubeId(m.youtubeId)}
                            className="text-[10px] text-brand-gold font-mono hover:underline flex items-center gap-1.5 py-1"
                          >
                            <Video className="w-3 h-3 text-brand-gold" />
                            Ver Video ID: {m.youtubeId}
                          </button>
                        )}
                      </div>

                      {/* Resumen técnico */}
                      <div className="border-t border-neutral-900/60 pt-2.5 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                        <span>{m.commonErrors.length} errores registrados</span>
                        <span>•</span>
                        <span>{m.recommendations.length} consejos técnicos</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredMachines.length === 0 && (
                  <div className="md:col-span-2 text-center py-12 border border-neutral-900 rounded-2xl bg-neutral-950/40">
                    <Info className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-xs text-neutral-400 font-mono">No se encontraron máquinas en el catálogo.</p>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 2: MONITOREO DE SOCIOS Y AJUSTE DE RUTINAS
            ========================================================================= */}
        {activeTab === 'socios' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* LADO IZQUIERDO: SELECCIÓN DE DEPORTISTA */}
            <div className="lg:col-span-4 space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">ATLETAS ASIGNADOS</span>
                <h3 className="text-xs text-neutral-500 uppercase">Lista de Seguimiento Directo</h3>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto no-scrollbar">
                {athletesList.map(a => {
                  const isSelected = selectedSocioId === a.id;
                  return (
                    <div
                      key={a.id}
                      onClick={() => setSelectedSocioId(a.id)}
                      className={`p-4 rounded-2xl border transition duration-300 cursor-pointer flex items-center gap-3 justify-between ${
                        isSelected 
                          ? 'bg-neutral-900/60 border-brand-gold/40 shadow-lg' 
                          : 'bg-neutral-950 border-neutral-900/70 hover:border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                          isSelected ? 'bg-brand-gold text-black' : 'bg-neutral-850 text-neutral-400'
                        }`}>
                          {a.avatarLetter}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{a.name}</h4>
                          <p className="text-[9px] text-neutral-500 font-mono">{a.email}</p>
                          <p className="text-[9px] text-neutral-400 mt-0.5">{a.membership}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-[10px] font-mono text-white">
                          <Flame className="w-3.5 h-3.5 text-brand-gold animate-pulse shrink-0" />
                          <span>{a.streak} Check-Ins</span>
                        </div>
                        <span className="text-[8px] font-mono tracking-wide text-neutral-500 block mt-0.5">Activo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LADO DERECHO: CONSOLA DE MONITOREO Y AJUSTE */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Sección A: Historial de Avance & Métricas Registradas */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <LineChart className="w-4 h-4 text-brand-gold" />
                    HISTORIAL DE AVANCES Y MÉTRICAS
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">Bitácora Oficial</span>
                </div>

                {currentLogs.length > 0 ? (
                  <div className="space-y-4">
                    {/* Tarjeta con métrica más reciente destacada */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl text-center space-y-1">
                        <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Peso Corporal</p>
                        <p className="text-lg font-mono font-bold text-white">{currentLogs[0].weight} kg</p>
                      </div>
                      <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl text-center space-y-1">
                        <p className="text-[9px] text-neutral-500 uppercase tracking-wider">% Grasa Corporal</p>
                        <p className="text-lg font-mono font-bold text-brand-gold">{currentLogs[0].fatPercent}%</p>
                      </div>
                      <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl text-center space-y-1">
                        <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Cintura</p>
                        <p className="text-lg font-mono font-bold text-white">{currentLogs[0].waist} cm</p>
                      </div>
                      <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl text-center space-y-1">
                        <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Brazo (Bíceps)</p>
                        <p className="text-lg font-mono font-bold text-white">{currentLogs[0].arm} cm</p>
                      </div>
                    </div>

                    {/* Tabla de registros históricos */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-900 text-neutral-500 text-[10px] uppercase font-mono">
                            <th className="py-2 px-3">Fecha</th>
                            <th className="py-2 px-3">Peso</th>
                            <th className="py-2 px-3">Grasa %</th>
                            <th className="py-2 px-3">Pecho (cm)</th>
                            <th className="py-2 px-3">Cintura (cm)</th>
                            <th className="py-2 px-3">Brazo (cm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentLogs.map((log, idx) => (
                            <tr key={idx} className="border-b border-neutral-900/40 hover:bg-neutral-900/10 text-neutral-300">
                              <td className="py-2 px-3 font-mono font-semibold text-white">{log.date}</td>
                              <td className="py-2 px-3 font-mono">{log.weight} kg</td>
                              <td className="py-2 px-3 font-mono text-brand-gold">{log.fatPercent}%</td>
                              <td className="py-2 px-3 font-mono">{log.chest} cm</td>
                              <td className="py-2 px-3 font-mono">{log.waist} cm</td>
                              <td className="py-2 px-3 font-mono">{log.arm} cm</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-neutral-500 font-mono">
                    Este socio aún no ha registrado métricas en su bitácora de progreso.
                  </div>
                )}
              </div>

              {/* Sección A-2: Reporte de Volumen Semanal & Detector de Fatiga / Lesiones con IA */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-brand-red" />
                    REPORTE DE VOLUMEN SEMANAL & PREVENCIÓN DE LESIONES
                  </span>
                  <span className="text-[9px] font-mono text-brand-red uppercase font-bold">Monitoreo de Fatiga IA</span>
                </div>

                <p className="text-xs text-neutral-400">
                  Volumen total semanal levantado por grupo muscular (Series × Repeticiones × Carga). Útil para detectar picos drásticos de fatiga acumulada.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tabla de Volúmenes */}
                  <div className="border border-neutral-900 rounded-xl overflow-hidden bg-neutral-900/10">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-neutral-900/50 text-[9px] font-mono uppercase text-neutral-400 border-b border-neutral-900">
                          <th className="py-2 px-3">Grupo Muscular</th>
                          <th className="py-2 px-3 text-right">S. Anterior</th>
                          <th className="py-2 px-3 text-right">S. Actual</th>
                          <th className="py-2 px-3 text-right text-brand-gold">Var %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentVolumeReport.map((vol, idx) => {
                          const isHigh = parseFloat(vol.change) > 30;
                          return (
                            <tr key={idx} className="border-b border-neutral-900/50 hover:bg-neutral-900/20 text-neutral-300">
                              <td className="py-2 px-3 font-medium text-white text-[11px]">{vol.group}</td>
                              <td className="py-2 px-3 text-right font-mono text-neutral-400">{vol.lastWeek.toLocaleString()} kg</td>
                              <td className="py-2 px-3 text-right font-mono text-white">{vol.thisWeek.toLocaleString()} kg</td>
                              <td className={`py-2 px-3 text-right font-mono font-bold ${isHigh ? 'text-brand-red animate-pulse' : 'text-emerald-400'}`}>
                                {vol.change}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Consola de Análisis IA */}
                  <div className="flex flex-col justify-between p-4 rounded-xl border border-neutral-850 bg-neutral-900/20">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-brand-red uppercase tracking-widest font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                        Prevención con Gemini
                      </span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Analiza las cargas del atleta de las últimas semanas para detectar incrementos peligrosos de volumen que puedan causar lesiones por sobrecarga.
                      </p>
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={handleDetectInjuryRisk}
                        disabled={aiRiskLoading}
                        className="w-full bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red/30 text-brand-red py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {aiRiskLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Analizando volumen de carga...
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5 text-brand-red" />
                            Detectar Riesgo de Lesión / Fatiga
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Caja de alerta generada */}
                <AnimatePresence>
                  {aiRiskAlert && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 rounded-xl border flex gap-3 items-start ${
                        aiRiskAlert.toLowerCase().includes("crítica") || aiRiskAlert.toLowerCase().includes("alerta") || aiRiskAlert.toLowerCase().includes("riesgo")
                          ? 'bg-brand-red/5 border-brand-red/30 text-red-200'
                          : 'bg-emerald-950/10 border-emerald-900/30 text-emerald-200'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-brand-red" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400">DIAGNÓSTICO PREVENTIVO IA:</p>
                        <p className="text-xs leading-relaxed font-sans">{aiRiskAlert}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sección B: Ajuste o Asignación Manual de Rutinas */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-5 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-brand-gold" />
                    ASIGNACIÓN / CONFIGURACIÓN DE RUTINA COMPLEMENTARIA
                  </span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">Prescripción Directa</span>
                </div>

                <div className="space-y-4">
                  {/* CONSOLA INTELIGENTE: GENERADOR DE RUTINAS CON IA (DRAGON PRESCRIPCIÓN) */}
                  <div className="p-4 rounded-xl border bg-brand-gold/5 border-brand-gold/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5 font-display">
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                        Generador de Rutinas Basado en Equipamiento Real
                      </span>
                      <span className="text-[8px] font-mono bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded font-bold uppercase">Dragon Prescripción IA</span>
                    </div>
                    
                    <p className="text-[11px] text-neutral-400">
                      Genera automáticamente una propuesta de rutina complementaria basada en el inventario real de máquinas del club ({machinesList.length} máquinas cargadas) y el perfil deportivo del socio.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Objetivo Deportivo</label>
                        <select
                          value={aiRoutineObjective}
                          onChange={(e) => setAiRoutineObjective(e.target.value)}
                          className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-gold font-mono"
                        >
                          <option value="Hipertrofia muscular general">Hipertrofia Muscular General</option>
                          <option value="Aumento de Fuerza y Potencia">Aumento de Fuerza y Potencia</option>
                          <option value="Recondicionamiento físico general">Recondicionamiento Físico General</option>
                          <option value="Quema de grasa y definición muscular">Quema de Grasa y Definición</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-neutral-400 uppercase">Lesiones o Restricciones</label>
                        <select
                          value={aiRoutineInjuries}
                          onChange={(e) => setAiRoutineInjuries(e.target.value)}
                          className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-gold font-mono text-red-300"
                        >
                          <option value="Ninguna">Ninguna lesión o dolor activo</option>
                          <option value="Dolor de rodilla (evitar sentadillas pesadas)">Dolor de Rodilla (Evitar Prensa/Squat pesado)</option>
                          <option value="Molestia en hombro o manguito rotador">Molestia en Hombro (Evitar presses pesados)</option>
                          <option value="Lumbalgia leve o dolor de espalda baja">Lumbalgia Leve (Evitar peso muerto libre)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateAiRoutine}
                      disabled={aiRoutineLoading}
                      className="w-full bg-neutral-900 hover:bg-neutral-850 border border-brand-gold/30 text-brand-gold hover:text-white py-2.5 px-4 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {aiRoutineLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-gold" />
                          Generando propuesta con Gemini...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                          Diseñar Rutina con IA (Equipamiento Real)
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">
                        Título del Plan de Rutina
                      </label>
                      <input
                        type="text"
                        value={routineTitle}
                        onChange={(e) => setRoutineTitle(e.target.value)}
                        placeholder="Ej. Plan Fuerza Dragon Imperial"
                        className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 focus:border-brand-gold outline-none text-white transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 block font-bold">
                        Frecuencia Semanal (Días)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={routineDays}
                        onChange={(e) => setRoutineDays(Number(e.target.value))}
                        className="w-full text-xs bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 focus:border-brand-gold outline-none text-white transition font-mono"
                      />
                    </div>
                  </div>

                  {/* Ejercicios en la rutina actual */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                      Ejercicios Planificados ({tempExercises.length})
                    </h4>

                    <div className="space-y-2">
                      {tempExercises.map((ex, idx) => (
                        <div 
                          key={idx} 
                          className="flex justify-between items-start p-3 bg-neutral-900/50 rounded-xl border border-neutral-900 text-xs text-neutral-300"
                        >
                          <div className="space-y-1">
                            <p className="font-bold text-white uppercase">{ex.name}</p>
                            <p className="font-mono text-[10px] text-brand-gold">
                              {ex.sets} Series × {ex.reps}
                            </p>
                            {ex.notes && <p className="text-[10px] text-neutral-400 italic">Nota: {ex.notes}</p>}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveExFromTemp(idx)}
                            className="text-red-400 hover:text-red-300 font-bold font-mono text-xs p-1"
                            title="Eliminar de rutina"
                          >
                            🗙
                          </button>
                        </div>
                      ))}

                      {tempExercises.length === 0 && (
                        <div className="p-4 border border-dashed border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
                          No hay ejercicios asignados en esta rutina complementaria aún.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Añadir nuevo ejercicio al borrador */}
                  <div className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-xl space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold block">
                      Añadir Ejercicio al Plan
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-500 block">Nombre del Ejercicio</label>
                        <input
                          type="text"
                          value={exName}
                          onChange={(e) => setExName(e.target.value)}
                          placeholder="Ej. Prensa de Piernas 45°"
                          className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 focus:border-brand-gold outline-none text-white transition"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-500 block">Series (Sets)</label>
                        <input
                          type="number"
                          value={exSets}
                          onChange={(e) => setExSets(Number(e.target.value))}
                          className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 focus:border-brand-gold outline-none text-white transition font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-500 block">Repeticiones (Reps)</label>
                        <input
                          type="text"
                          value={exReps}
                          onChange={(e) => setExReps(e.target.value)}
                          placeholder="Ej. 12, 10, 8, 8"
                          className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 focus:border-brand-gold outline-none text-white transition font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-mono tracking-wider text-neutral-500 block">Recomendaciones o Indicaciones de Carga</label>
                      <input
                        type="text"
                        value={exNotes}
                        onChange={(e) => setExNotes(e.target.value)}
                        placeholder="Ej. Mantener tempo excéntrico controlado..."
                        className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 focus:border-brand-gold outline-none text-white transition"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddExToTemp}
                      className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-white font-mono font-bold text-xs py-2 px-4 rounded-lg transition uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4 text-brand-gold" />
                      Agregar Ejercicio a Lista
                    </button>
                  </div>

                  {/* Botón final para guardar y asignar */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveRoutineForSocio}
                      className="bg-brand-gold hover:bg-brand-muted-gold text-black py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg"
                    >
                      <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                      Asignar y Notificar a Atleta
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>

      {/* FOOTER NAVIGATION PARA MÓVILES */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950 border-t border-neutral-900 px-6 py-3 z-40 flex items-center justify-around md:hidden shrink-0">
        <button
          onClick={() => setActiveTab('ejercicios')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'ejercicios' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Ejercicios</span>
        </button>

        <button
          onClick={() => setActiveTab('socios')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'socios' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Atletas</span>
        </button>
      </div>

      {/* REPRODUCTOR DE VIDEO INMERSIVO DE YOUTUBE */}
      <AnimatePresence>
        {activeYoutubeId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <div className="bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden w-full max-w-3xl shadow-2xl relative">
              <header className="p-4 border-b border-neutral-900 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">REPRODUCCTOR DE TÉCNICA</span>
                <button 
                  onClick={() => setActiveYoutubeId(null)}
                  className="w-8 h-8 rounded-full bg-neutral-900 text-neutral-400 flex items-center justify-center hover:text-white"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </header>

              <div className="aspect-video bg-black relative">
                <iframe
                  src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1`}
                  title="Video instructivo"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
