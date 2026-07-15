import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Activity, 
  QrCode, 
  MapPin, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  ShieldAlert, 
  Download, 
  RefreshCw, 
  Lock, 
  Clock, 
  Check, 
  Navigation, 
  Sparkles, 
  Smartphone,
  ChevronRight,
  Inbox,
  User,
  Flame,
  Tv,
  Bell,
  Save,
  Phone,
  Droplet,
  Heart,
  Mail,
  ShieldCheck,
  Play,
  Volume2
} from 'lucide-react';
import { GymClass, UserProfile } from '../types';

interface SocioPortalProps {
  classes: GymClass[];
  user: UserProfile;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onBookToggle: (classId: string) => void;
  onTriggerNotification: (message: string) => void;
}

interface PaymentHistoryItem {
  id: string;
  date: string;
  plan: string;
  amount: number;
  method: string;
  status: 'Completado' | 'Pendiente';
}

interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

interface WorkoutExercise {
  id: string;
  name: string;
  category: string;
  youtubeId: string;
  sets: ExerciseSet[];
}

interface WorkoutRoutine {
  id: string;
  title: string;
  level: string;
  duration: number;
  exercises: WorkoutExercise[];
}

interface GymAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'Alta' | 'Normal';
  date: string;
}

export default function SocioPortal({
  classes,
  user,
  onClose,
  onUpdateUser,
  onBookToggle,
  onTriggerNotification
}: SocioPortalProps) {
  // Navigation State supporting 6 modules (Check-In QR, Rutinas, Reservas, Pagos, Comunicados, Perfil)
  // We use 5 primary bottom tabs: check_in (includes QR, Geofencing, and Announcements), rutinas, reservas, membresia, perfil
  const [activeTab, setActiveTab] = useState<'check_in' | 'rutinas' | 'reservas' | 'membresia' | 'perfil'>('check_in');

  // =========================================================================
  // --- MODULE 1: DYNAMIC SMART QR CREDENTIAL & GPS GEOFENCING ---
  // =========================================================================
  const [userDistance, setUserDistance] = useState<number>(15); // Default to 15m (within range for easy testing)
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<'success' | 'failed' | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<string>(() => Math.random().toString(36).substring(2, 10).toUpperCase());
  const [qrTimeLeft, setQrTimeLeft] = useState<number>(15);

  // Dynamic token rolling timer (PWA dynamic security token simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setQrTimeLeft((prev) => {
        if (prev <= 1) {
          setQrToken(Math.random().toString(36).substring(2, 10).toUpperCase());
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateGPSMove = () => {
    if (userDistance > 50) {
      setUserDistance(15);
      onTriggerNotification("📍 GPS Localizado: Estás a 15m del club. ¡En rango de check-in!");
    } else {
      setUserDistance(120);
      onTriggerNotification("📍 GPS Localizado: Te has alejado (120m). Fuera de rango.");
    }
    setScanResult(null);
    setScanError(null);
  };

  const handleStartQRScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setScanError(null);

    setTimeout(() => {
      setIsScanning(false);
      if (userDistance > 50) {
        setScanResult('failed');
        setScanError('Fuera de Rango: Estás a más de 50m. Acércate para registrar tu entrada.');
        onTriggerNotification("🗙 Error de Acceso: Geofencing no validado.");
      } else if (user.membershipLevel.toLowerCase().includes('vencid')) {
        setScanResult('failed');
        setScanError('Membresía Vencida: Por favor, realiza el pago de renovación en la pestaña "Mi Plan".');
        onTriggerNotification("🗙 Error de Acceso: Membresía inactiva.");
      } else {
        setScanResult('success');
        onTriggerNotification("✔ ¡Check-In Exitoso! Acceso autorizado.");
        const nextCount = user.checkInCount + 1;
        onUpdateUser({
          ...user,
          checkInCount: nextCount > user.checkInGoal ? user.checkInGoal : nextCount
        });
      }
    }, 2000);
  };

  // =========================================================================
  // --- MODULE 2: RAMPED WORKOUT ROUTINES (Rutinas de Entrenamiento) ---
  // =========================================================================
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([
    {
      id: 'routine-1',
      title: 'Fuerza Dragon Imperial (Push/Pull)',
      level: 'Avanzado',
      duration: 55,
      exercises: [
        {
          id: 'ex-1',
          name: 'Press de Banca Plano con Barra',
          category: 'Pecho',
          youtubeId: 'rT7DgCr-3ps',
          sets: [
            { reps: 10, weight: 60, completed: false },
            { reps: 8, weight: 70, completed: false },
            { reps: 6, weight: 80, completed: false },
          ]
        },
        {
          id: 'ex-2',
          name: 'Peso Muerto Convencional',
          category: 'Espalda/Pierna',
          youtubeId: 'op9kVnSMy6Q',
          sets: [
            { reps: 8, weight: 100, completed: false },
            { reps: 6, weight: 120, completed: false },
            { reps: 4, weight: 140, completed: false },
          ]
        },
        {
          id: 'ex-3',
          name: 'Remo con Mancuerna a un Brazo',
          category: 'Espalda',
          youtubeId: 'roCP6nM_tGo',
          sets: [
            { reps: 10, weight: 26, completed: false },
            { reps: 10, weight: 30, completed: false },
            { reps: 8, weight: 34, completed: false },
          ]
        },
        {
          id: 'ex-4',
          name: 'Press Militar de Hombros con Barra',
          category: 'Hombros',
          youtubeId: '2yjwXTZQDDI',
          sets: [
            { reps: 10, weight: 40, completed: false },
            { reps: 8, weight: 45, completed: false },
            { reps: 6, weight: 50, completed: false },
          ]
        },
      ]
    },
    {
      id: 'routine-2',
      title: 'Acondicionamiento HIIT Quemador',
      level: 'Intermedio',
      duration: 40,
      exercises: [
        {
          id: 'ex-5',
          name: 'Swings de Kettlebell de Poder',
          category: 'Glúteos/Cardio',
          youtubeId: 'mK7C_WbSg_4',
          sets: [
            { reps: 15, weight: 16, completed: false },
            { reps: 15, weight: 20, completed: false },
            { reps: 15, weight: 24, completed: false },
          ]
        },
        {
          id: 'ex-6',
          name: 'Burpees Militares de Alta Intensidad',
          category: 'Cardio',
          youtubeId: 'qLBImHhCX8o',
          sets: [
            { reps: 12, weight: 0, completed: false },
            { reps: 12, weight: 0, completed: false },
            { reps: 12, weight: 0, completed: false },
          ]
        },
        {
          id: 'ex-7',
          name: 'Mountain Climbers Explosivos',
          category: 'Core',
          youtubeId: 'cnyTQDSE884',
          sets: [
            { reps: 30, weight: 0, completed: false },
            { reps: 30, weight: 0, completed: false },
            { reps: 30, weight: 0, completed: false },
          ]
        },
        {
          id: 'ex-8',
          name: 'Plank Shoulder Taps Firmes',
          category: 'Abdomen',
          youtubeId: 'gOhS36mBPlQ',
          sets: [
            { reps: 20, weight: 0, completed: false },
            { reps: 20, weight: 0, completed: false },
            { reps: 20, weight: 0, completed: false },
          ]
        }
      ]
    }
  ]);

  const [selectedRoutineId, setSelectedRoutineId] = useState<string>('routine-1');
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);

  // Active workout structure
  const activeRoutine = routines.find(r => r.id === selectedRoutineId) || routines[0];

  const handleToggleSetCompleted = (exerciseId: string, setIndex: number) => {
    setRoutines(prev => prev.map(routine => {
      return {
        ...routine,
        exercises: routine.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            const updatedSets = [...exercise.sets];
            updatedSets[setIndex] = {
              ...updatedSets[setIndex],
              completed: !updatedSets[setIndex].completed
            };
            return { ...exercise, sets: updatedSets };
          }
          return exercise;
        })
      };
    }));
  };

  const handleUpdateSetValues = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', val: number) => {
    setRoutines(prev => prev.map(routine => {
      return {
        ...routine,
        exercises: routine.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            const updatedSets = [...exercise.sets];
            updatedSets[setIndex] = {
              ...updatedSets[setIndex],
              [field]: val
            };
            return { ...exercise, sets: updatedSets };
          }
          return exercise;
        })
      };
    }));
  };

  // Progress Calculation
  const totalSets = activeRoutine.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = activeRoutine.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
  const workoutProgressPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // =========================================================================
  // --- MODULE 3: CLASES GRUPALES Y RESERVAS ---
  // =========================================================================
  const [classCategoryFilter, setClassCategoryFilter] = useState<string>('All');
  const categoriesList = ['All', 'HIIT', 'Yoga', 'Pilates', 'Cycling', 'Strength'];

  const filteredClasses = classes.filter(cls => {
    if (classCategoryFilter === 'All') return true;
    return cls.category.toLowerCase() === classCategoryFilter.toLowerCase();
  });

  const handleToggleClassBooking = (gymClass: GymClass) => {
    if (user.membershipLevel.toLowerCase().includes('vencid')) {
      onTriggerNotification("⚠️ No puedes reservar cupos. Tu membresía está inactiva o vencida.");
      return;
    }
    onBookToggle(gymClass.id);
    if (gymClass.booked) {
      onTriggerNotification(`✖ Reservación cancelada para ${gymClass.title}. Cupo liberado.`);
    } else {
      onTriggerNotification(`✔ Cupo reservado con éxito en ${gymClass.title}. ¡Te esperamos!`);
    }
  };

  // =========================================================================
  // --- MODULE 4: MI MEMBRESÍA Y PAGOS (E-COMMERCE STRIPE / OPENPAY) ---
  // =========================================================================
  const [daysRemaining, setDaysRemaining] = useState<number>(14);
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<'Mensual' | 'Anual' | 'VIP'>('Mensual');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [creditCard, setCreditCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([
    { id: 'TX-9021', date: '12 Jun 2026', plan: 'Plan Mensual Estándar', amount: 59, method: 'Stripe (Seguro)', status: 'Completado' },
    { id: 'TX-8812', date: '12 May 2026', plan: 'Plan Mensual Estándar', amount: 59, method: 'Stripe (Seguro)', status: 'Completado' },
    { id: 'TX-7554', date: '12 Abr 2026', plan: 'Inscripción Profit', amount: 89, method: 'Openpay', status: 'Completado' }
  ]);

  const handleTriggerExpirationSim = () => {
    onUpdateUser({
      ...user,
      membershipLevel: 'Plan Vencido (Inactivo)'
    });
    setDaysRemaining(0);
    onTriggerNotification("⚠️ Simulación: Tu membresía ha vencido. Realiza un pago para activarla.");
  };

  const handleCheckoutProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditCard.number || !creditCard.name || !creditCard.expiry || !creditCard.cvc) {
      onTriggerNotification("Por favor completa los datos de tu tarjeta para procesar el pago.");
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      const planNames = {
        Mensual: 'Plan Mensual Estándar',
        Anual: 'Plan Anual Elite',
        VIP: 'VIP Dragon Pass'
      };
      const planPrices = { Mensual: 59, Anual: 499, VIP: 120 };

      const chosenPlanName = planNames[selectedPlanToBuy];
      const chosenPrice = planPrices[selectedPlanToBuy];

      onUpdateUser({
        ...user,
        membershipLevel: chosenPlanName
      });

      setDaysRemaining(selectedPlanToBuy === 'Anual' ? 365 : 30);
      
      const newInvoice: PaymentHistoryItem = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        date: 'Hoy',
        plan: chosenPlanName,
        amount: chosenPrice,
        method: 'Stripe (Seguro)',
        status: 'Completado'
      };

      setPaymentHistory(prev => [newInvoice, ...prev]);
      setCreditCard({ number: '', name: '', expiry: '', cvc: '' });
      onTriggerNotification(`✔ ¡Felicidades! Membresía "${chosenPlanName}" activada y pagada.`);
    }, 2000);
  };

  const handleDownloadInvoiceTxt = (invoice: PaymentHistoryItem) => {
    const textContent = `
==================================================
           COMPROBANTE OFICIAL DE PAGO
                    DRAGON GYM
==================================================
ID de Transacción: ${invoice.id}
Fecha de Emisión:  ${invoice.date}
Membresía Adquirida: ${invoice.plan}
Monto Pagado:      $${invoice.amount} USD
Pasarela de Pago:  ${invoice.method}
Estado de Transacción: ${invoice.status}

Este documento sirve como recibo digital oficial.
Garantía de Acceso Concedida.
==================================================
    `;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `DragonGym-Comprobante-${invoice.id}.txt`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
    onTriggerNotification(`✔ Descargado comprobante oficial ${invoice.id}.txt`);
  };

  // =========================================================================
  // --- MODULE 5: ANUNCIOS Y COMUNICADOS (Avisos Oficiales del Gym) ---
  // =========================================================================
  const announcementsList: GymAnnouncement[] = [
    {
      id: 'ann-1',
      title: 'Mantenimiento preventivo en zona de piscinas y vapor',
      content: 'Estimados atletas: la zona húmeda estará en mantenimiento semestral los días 16 y 17 de Julio. Reabriremos con nuevos sistemas de ozono el sábado 18. Las demás áreas operan en su horario habitual.',
      priority: 'Alta',
      date: 'Publicado hoy • 15 Julio 2026'
    },
    {
      id: 'ann-2',
      title: 'Nueva sesión exclusiva de Box & HIIT con Adrianne G.',
      content: 'Por alta demanda, sumamos un nuevo horario de "Circuit Breaker Box" los martes y jueves a las 7:00 PM. Reserva tu lugar desde el portal de reservaciones. ¡Cupos limitados!',
      priority: 'Normal',
      date: 'Publicado hace 1 día • 14 Julio 2026'
    },
    {
      id: 'ann-3',
      title: 'Semana de descuento nutricional en Dragon Shop',
      content: 'Aprovecha un 15% de descuento directo en todas las proteínas aisladas de suero e hidratantes isotónicos oficiales en la recepción del club presentando tu pase digital QR activo.',
      priority: 'Normal',
      date: 'Publicado hace 3 días • 12 Julio 2026'
    }
  ];

  // =========================================================================
  // --- MODULE 6: PERFIL DEL ATLETA ---
  // =========================================================================
  const [profileForm, setProfileForm] = useState({
    id: user.id || 'DG-ATHLETE-7102',
    name: user.name,
    email: user.email || 'molly.jones@dragongym.com',
    phone: user.phone || '+1 (555) 381-9921',
    bloodType: user.bloodType || 'O+',
    emergencyContact: user.emergencyContact || 'David Jones (Esposo) - +1 (555) 381-0022'
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      id: profileForm.id,
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      bloodType: profileForm.bloodType,
      emergencyContact: profileForm.emergencyContact,
      avatarLetter: profileForm.name.charAt(0).toUpperCase()
    });
    onTriggerNotification("✔ Perfil del Atleta actualizado y sincronizado en la nube.");
  };

  const isMembershipActive = !user.membershipLevel.toLowerCase().includes('vencid');

  return (
    <div id="socio-portal" className="fixed inset-0 bg-neutral-950 z-50 flex flex-col font-sans select-none overflow-hidden text-neutral-200">
      
      {/* DESKTOP/MOBILE HEADER */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
            <Smartphone className="w-4.5 h-4.5 text-brand-gold animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-display font-black tracking-[0.2em] text-white">PORTAL SOCIO</h1>
            <p className="text-[9px] font-mono tracking-widest text-brand-gold uppercase">ENTRENAMIENTO • PASE QR • CHECKOUT</p>
          </div>
        </div>

        {/* ELEGANT HEADER NAVIGATION FOR DESKTOP */}
        <div className="hidden md:flex items-center gap-1.5 bg-neutral-900/40 p-1 rounded-xl border border-neutral-850">
          <button
            onClick={() => setActiveTab('check_in')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'check_in' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Acceso Digital
          </button>
          <button
            onClick={() => setActiveTab('rutinas')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'rutinas' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Rutinas
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'reservas' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Clases y Reservas
          </button>
          <button
            onClick={() => setActiveTab('membresia')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'membresia' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Mi Plan & Pagos
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'perfil' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Perfil Atleta
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* CORE SOCIO WORKSTATION VIEWPORT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 md:pb-6">
        
        {/* =========================================================================
            TAB 1: ACCESO DIGITAL & ANUNCIOS
            ========================================================================= */}
        {activeTab === 'check_in' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Hand: Credential QR + Distance GPS simulation */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Dynamic QR Code Access Box */}
              <div className="bg-gradient-to-b from-neutral-900/50 to-neutral-950 border border-neutral-900 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-full flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">CREDENCIAL DE ACCESO DIGITAL</span>
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    isMembershipActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {isMembershipActive ? 'Socio Activo' : 'Inactivo / Vencido'}
                  </span>
                </div>

                {/* Animated Smart QR Code frame */}
                <div className="relative p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center max-w-[200px] aspect-square border border-neutral-100">
                  
                  {/* Fake Dynamic QR code SVG illustration */}
                  <svg className="w-36 h-36 text-neutral-900" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="5" width="15" height="15" fill="white" />
                    <rect x="9" y="9" width="7" height="7" fill="currentColor" />
                    
                    <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="80" y="5" width="15" height="15" fill="white" />
                    <rect x="84" y="9" width="7" height="7" fill="currentColor" />
                    
                    <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="80" width="15" height="15" fill="white" />
                    <rect x="9" y="84" width="7" height="7" fill="currentColor" />

                    {/* Randomized central pattern that matches qrToken */}
                    <rect x="35" y="35" width="30" height="30" fill="currentColor" opacity="0.8" />
                    <rect x="40" y="40" width="20" height="20" fill="white" />
                    <rect x="45" y="45" width="10" height="10" fill="currentColor" />

                    {/* Randomized decorative bits */}
                    <rect x="30" y="5" width="8" height="8" fill="currentColor" />
                    <rect x="45" y="10" width="12" height="6" fill="currentColor" />
                    <rect x="65" y="15" width="5" height="10" fill="currentColor" />
                    <rect x="10" y="35" width="15" height="8" fill="currentColor" />
                    <rect x="5" y="55" width="10" height="12" fill="currentColor" />
                    <rect x="75" y="40" width="15" height="10" fill="currentColor" />
                    <rect x="85" y="60" width="10" height="10" fill="currentColor" />
                    <rect x="40" y="75" width="18" height="18" fill="currentColor" />
                    <rect x="65" y="85" width="8" height="8" fill="currentColor" />
                  </svg>

                  {/* Circular dynamic scanning visual ring around */}
                  <div className="absolute inset-0 border-2 border-brand-gold rounded-2xl animate-pulse pointer-events-none opacity-40" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold tracking-widest text-neutral-200">TOKEN: {qrToken}</span>
                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-neutral-400">
                    <RefreshCw className="w-3 h-3 text-brand-gold animate-spin" style={{ animationDuration: '3s' }} />
                    <span>Se actualiza en {qrTimeLeft}s</span>
                  </div>
                </div>

                {/* Days remaining count card */}
                <div className="w-full bg-neutral-950 p-3 rounded-xl border border-neutral-900/60 flex items-center justify-between text-xs">
                  <div className="text-left">
                    <span className="text-[10px] text-neutral-500 font-mono block">PLAN ACTUAL</span>
                    <span className="font-bold text-white uppercase">{user.membershipLevel}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 font-mono block">DÍAS RESTANTES</span>
                    <span className="font-mono font-bold text-brand-gold">{daysRemaining} días</span>
                  </div>
                </div>
              </div>

              {/* Geofencing Verification Slider & camera simulation */}
              <div className="bg-neutral-900/35 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">VALIDACIÓN GPS & GEOFENCING</span>
                  <MapPin className="w-4 h-4 text-brand-gold animate-bounce" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Distancia al mostrador:</span>
                    <span className="font-mono font-bold text-white">{userDistance} metros</span>
                  </div>

                  {/* Dynamic indicator badge */}
                  {userDistance < 50 ? (
                    <div className="bg-emerald-950/20 border border-emerald-500/35 rounded-xl p-3 flex items-center gap-2.5 text-emerald-400 text-xs">
                      <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                      <div>
                        <p className="font-bold">EN RANGO DE ACCESO (&lt; 50m)</p>
                        <p className="text-[9px] text-emerald-400/80 mt-0.5">Puedes completar el registro QR con normalidad.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 flex items-center gap-2.5 text-amber-400 text-xs">
                      <ShieldAlert className="w-4.5 h-4.5 shrink-0" />
                      <div>
                        <p className="font-bold">FUERA DE RANGO (&gt; 50m)</p>
                        <p className="text-[9px] text-amber-400/80 mt-0.5">El GPS requiere que estés en las instalaciones del club.</p>
                      </div>
                    </div>
                  )}

                  {/* Distance Simulator Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                      <span>Mostrador (0m)</span>
                      <span>Fuera de Rango (&gt;50m)</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="150"
                      value={userDistance}
                      onChange={(e) => {
                        setUserDistance(Number(e.target.value));
                        setScanResult(null);
                        setScanError(null);
                      }}
                      className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                    />
                  </div>

                  <button
                    onClick={handleSimulateGPSMove}
                    className="w-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 py-2.5 rounded-xl text-xs font-mono font-bold text-neutral-300 hover:text-white transition"
                  >
                    📍 Simular GPS: {userDistance > 50 ? "Acercarse a 15m" : "Alejarse a 120m"}
                  </button>
                </div>
              </div>

            </div>

            {/* Right Hand: Dynamic QR Scanner + Announcements Feed */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Integrated Camera Viewport scanner */}
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Escáner de Pase de Recepción</h3>
                  <p className="text-[10px] text-neutral-500 max-w-sm">
                    Abre tu cámara nativa simulada para escanear el QR acrílico del tótem de bienvenida del club.
                  </p>
                </div>

                <div className="relative w-full max-w-[240px] aspect-square rounded-2xl bg-black border border-neutral-900 overflow-hidden shadow-2xl flex items-center justify-center">
                  {isScanning ? (
                    <>
                      <div className="absolute inset-0 bg-neutral-900/30" />
                      <div className="absolute top-0 inset-x-0 h-1 bg-brand-gold shadow-[0_0_15px_#D4AF37] animate-[bounce_2s_infinite]" />
                      
                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-brand-gold" />
                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-brand-gold" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-brand-gold" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-brand-gold" />
                      
                      <div className="flex flex-col items-center gap-2 z-10 text-brand-gold font-mono text-[9px] tracking-widest animate-pulse">
                        <Camera className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>ESCANEANDO RECEPTÁCULO...</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="p-3 bg-neutral-900 rounded-full border border-neutral-850">
                        <QrCode className="w-10 h-10 text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Escáner Listo</p>
                        <p className="text-[9px] text-neutral-500">Haz clic abajo para iniciar la lectura</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartQRScan}
                  disabled={isScanning}
                  className="w-full max-w-[240px] bg-brand-gold hover:bg-brand-muted-gold text-black py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <QrCode className="w-4 h-4" />
                  {isScanning ? "Procesando código..." : "Registrar Entrada (QR)"}
                </button>

                {/* Scan Outcomes panel */}
                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-full max-w-[340px] text-xs p-3 rounded-xl border text-left flex items-start gap-3 ${
                      scanResult === 'success' 
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400' 
                        : 'bg-red-950/20 border-red-500/40 text-red-400'
                    }`}
                  >
                    {scanResult === 'success' ? (
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-mono font-bold uppercase tracking-wider">
                        {scanResult === 'success' ? '✔ REGISTRO COMPLETADO' : '🗙 ERROR EN REGISTRO'}
                      </p>
                      <p className="text-[10px] text-white/90">
                        {scanResult === 'success' 
                          ? `¡Bienvenido al club, ${user.name}! Pase digital verificado en la terminal local.`
                          : scanError
                        }
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ANUNCIOS Y COMUNICADOS PANEL */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">AVISOS Y COMUNICADOS OFICIALES</span>
                  <Bell className="w-4 h-4 text-brand-gold animate-bounce" />
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                  {announcementsList.map((ann) => (
                    <div 
                      key={ann.id} 
                      className={`p-3.5 rounded-xl border flex flex-col gap-1.5 transition ${
                        ann.priority === 'Alta' 
                          ? 'bg-red-950/10 border-red-900/30' 
                          : 'bg-neutral-900/20 border-neutral-900'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-white font-display leading-snug uppercase tracking-wide">{ann.title}</h4>
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                          ann.priority === 'Alta' ? 'bg-red-500 text-white' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {ann.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-light">{ann.content}</p>
                      <span className="text-[9px] font-mono text-neutral-500 block mt-1">{ann.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 2: RUTINAS DE ENTRENAMIENTO (MÓDULO INTERACTIVO DE SESIONES)
            ========================================================================= */}
        {activeTab === 'rutinas' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto"
          >
            {/* Routine selector header & global progress widget */}
            <div className="bg-neutral-900/35 border border-neutral-900 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">TU ENTRENAMIENTO PERSONALIZADO</span>
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-1">
                  <select
                    value={selectedRoutineId}
                    onChange={(e) => setSelectedRoutineId(e.target.value)}
                    className="bg-neutral-950 border border-neutral-850 text-xs text-white rounded-xl py-2 px-3 outline-none focus:border-brand-gold transition uppercase font-mono tracking-wide"
                  >
                    {routines.map(r => (
                      <option key={r.id} value={r.id}>{r.title}</option>
                    ))}
                  </select>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-neutral-900 text-neutral-400 uppercase tracking-widest font-bold">
                    Nivel: {activeRoutine.level}
                  </span>
                </div>
              </div>

              {/* Progress calculation ring / visual slider */}
              <div className="w-full md:w-auto flex items-center gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-900/60 shrink-0">
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  {/* SVG Circle progress */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="#1f2937" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="24" cy="24" r="20" stroke="#D4AF37" strokeWidth="4" fill="transparent" 
                      strokeDasharray="125.6"
                      strokeDashoffset={125.6 - (125.6 * workoutProgressPercentage) / 100}
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-mono font-bold text-white">{workoutProgressPercentage}%</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">PROGRESO DIARIO</h4>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{completedSets} de {totalSets} series terminadas</p>
                </div>
                {workoutProgressPercentage === 100 && (
                  <div className="p-1.5 rounded bg-brand-gold/10 border border-brand-gold/30 shrink-0 animate-bounce">
                    <Flame className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  </div>
                )}
              </div>
            </div>

            {/* ADAPTATIVE EXERCISE GRID: 2 columns on mobile, 4 columns on desktop/tablet */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activeRoutine.exercises.map((exercise) => {
                const exerciseProgress = Math.round((exercise.sets.filter(s => s.completed).length / exercise.sets.length) * 100);
                
                return (
                  <div 
                    key={exercise.id}
                    className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    {/* Exercise banner & Youtube player trigger */}
                    <div className="relative h-28 bg-neutral-900/60 flex items-center justify-center overflow-hidden shrink-0 border-b border-neutral-900">
                      
                      {/* Stylized background grid pattern representing exercises */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent z-10" />
                      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                      <div className="absolute bottom-2.5 left-3 z-20">
                        <span className="text-[8px] font-mono font-bold uppercase text-brand-gold bg-black/60 border border-brand-gold/15 px-1.5 py-0.5 rounded">
                          {exercise.category}
                        </span>
                      </div>

                      {/* Video Button */}
                      <button
                        onClick={() => setActiveYoutubeId(exercise.youtubeId)}
                        className="absolute inset-0 flex items-center justify-center group z-20 hover:bg-black/35 transition"
                      >
                        <div className="w-9 h-9 rounded-full bg-brand-gold/10 group-hover:bg-brand-gold text-brand-gold group-hover:text-black border border-brand-gold/30 flex items-center justify-center transition">
                          <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                        </div>
                      </button>

                      <div className="absolute top-2.5 right-3 z-20 text-[9px] font-mono font-bold text-neutral-400">
                        {exerciseProgress}% Ok
                      </div>
                    </div>

                    {/* Exercise Core Data & checklist block */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white font-display uppercase tracking-wide leading-tight min-h-[32px] line-clamp-2">
                          {exercise.name}
                        </h4>
                      </div>

                      {/* Interactive Sets Checklist */}
                      <div className="space-y-1.5">
                        {exercise.sets.map((set, sIdx) => (
                          <div 
                            key={sIdx} 
                            className={`p-1.5 rounded-xl border text-[10px] font-mono flex items-center justify-between gap-1.5 transition ${
                              set.completed 
                                ? 'bg-brand-gold/10 border-brand-gold/40 text-white' 
                                : 'bg-neutral-900/30 border-neutral-900 text-neutral-400'
                            }`}
                          >
                            <span className="font-bold">S{sIdx+1}</span>
                            
                            {/* Reps Input */}
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={set.reps}
                                onChange={(e) => handleUpdateSetValues(exercise.id, sIdx, 'reps', Math.max(1, Number(e.target.value)))}
                                className="w-7 bg-neutral-950 border border-neutral-800 rounded text-center py-0.5 text-white outline-none focus:border-brand-gold"
                              />
                              <span className="text-[8px] text-neutral-500 uppercase">Rps</span>
                            </div>

                            {/* Weight Input */}
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={set.weight}
                                onChange={(e) => handleUpdateSetValues(exercise.id, sIdx, 'weight', Math.max(0, Number(e.target.value)))}
                                className="w-8 bg-neutral-950 border border-neutral-800 rounded text-center py-0.5 text-white outline-none focus:border-brand-gold"
                              />
                              <span className="text-[8px] text-neutral-500 uppercase">Kg</span>
                            </div>

                            {/* Set Complete Checkmark Button */}
                            <button
                              onClick={() => handleToggleSetCompleted(exercise.id, sIdx)}
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition border ${
                                set.completed 
                                  ? 'bg-brand-gold border-brand-gold text-black' 
                                  : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-white'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* IMMERSIVE YOUTUBE PLAYBACK MODAL */}
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
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-brand-gold animate-bounce" />
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">MODO INMERSIVO: VIDEO INSTRUCCIONAL</span>
                      </div>
                      <button 
                        onClick={() => setActiveYoutubeId(null)}
                        className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </header>

                    {/* Responsive embed container */}
                    <div className="aspect-video bg-black relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&mute=0`}
                        title="YouTube exercise tutorial"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>

                    <footer className="p-3.5 bg-neutral-950 border-t border-neutral-900 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                      <span>● TRANSMITIENDO VIDEO EN HD</span>
                      <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> Audio Habilitado</span>
                    </footer>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 3: CLASES GRUPALES Y RESERVAS
            ========================================================================= */}
        {activeTab === 'reservas' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Category horizontal filters */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Calendario de Sesiones Grupales</span>
                <span className="text-[9px] font-mono text-brand-gold uppercase">Reserva tu Lugar</span>
              </div>

              {/* Tag filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setClassCategoryFilter(cat)}
                    className={`py-1.5 px-3.5 text-[10px] font-mono font-bold uppercase rounded-lg transition shrink-0 border ${
                      classCategoryFilter === cat 
                        ? 'bg-brand-gold text-black border-brand-gold' 
                        : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* List of classes for booking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClasses.map((cls) => {
                const isBooked = cls.booked;
                const capacityMax = 25;
                const capacityBooked = isBooked ? 18 : 17;
                const capacityLeft = capacityMax - capacityBooked;

                return (
                  <div 
                    key={cls.id}
                    className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-[120px] shrink-0">
                      <img
                        src={cls.image}
                        alt={cls.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter brightness-[0.5]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 text-[8px] font-mono font-bold uppercase tracking-wider text-brand-gold bg-black/60 border border-brand-gold/15 px-2 py-0.5 rounded">
                        {cls.category}
                      </span>
                      {cls.isEquinoxExclusive && (
                        <span className="absolute top-3 right-3 text-[8px] font-mono font-bold uppercase tracking-wider text-black bg-brand-gold px-2 py-0.5 rounded">
                          Dragon Exclusive
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white font-display uppercase tracking-wide leading-tight">{cls.title}</h4>
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                          <span>{cls.time} • {cls.duration} mins • {cls.instructor}</span>
                        </p>
                        <p className="text-[9px] text-neutral-500 font-light italic truncate">
                          {cls.location}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-900/60 text-[10px] text-neutral-500">
                        <span className="font-mono">
                          Cupos Libres: <span className="font-bold text-white">{capacityLeft}</span> / {capacityMax}
                        </span>

                        {isBooked ? (
                          <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                            Reservado ✔
                          </span>
                        ) : capacityLeft <= 0 ? (
                          <span className="text-[9px] font-mono text-red-400 font-bold uppercase bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                            Lleno 🗙
                          </span>
                        ) : null}
                      </div>

                      <button
                        onClick={() => handleToggleClassBooking(cls)}
                        disabled={!isMembershipActive && !isBooked}
                        className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                          isBooked 
                            ? 'bg-neutral-900 hover:bg-neutral-850 border border-red-950/40 text-red-400 hover:text-red-300' 
                            : 'bg-brand-gold hover:bg-brand-muted-gold text-black disabled:opacity-40'
                        }`}
                      >
                        {isBooked ? "Cancelar Reserva" : "Apartar Lugar"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredClasses.length === 0 && (
                <div className="col-span-full py-12 text-center space-y-2.5">
                  <Inbox className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-500 font-mono">No hay clases grupales programadas para hoy</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 4: MI PLAN Y PAGOS (E-COMMERCE INTEGRADO STRIPE/OPENPAY)
            ========================================================================= */}
        {activeTab === 'membresia' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Plan status & receipts history */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="bg-neutral-900/25 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Estado de tu Membresía</span>
                  <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    isMembershipActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {isMembershipActive ? 'Activa' : 'Vencida / Inactiva'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display uppercase tracking-wide">{user.membershipLevel}</h3>
                    <p className="text-xs text-neutral-400 mt-1">Sede Principal: {user.favoriteClub}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-white">{daysRemaining}</p>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Días Restantes</p>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      daysRemaining > 5 ? 'bg-brand-gold' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (daysRemaining / 30) * 100)}%` }}
                  />
                </div>

                <button
                  onClick={handleTriggerExpirationSim}
                  className="w-full bg-neutral-950 hover:bg-neutral-900 text-[10px] font-mono text-neutral-500 hover:text-neutral-300 py-1.5 rounded border border-neutral-850 transition"
                >
                  ⚠️ Simular Vencimiento Inmediato para Pruebas
                </button>
              </div>

              {/* Invoice list */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold block pb-2 border-b border-neutral-900">
                  Historial de Pagos y Comprobantes (.TXT)
                </span>

                <div className="divide-y divide-neutral-900/60 max-h-[220px] overflow-y-auto no-scrollbar">
                  {paymentHistory.map((invoice) => (
                    <div key={invoice.id} className="py-3 flex items-center justify-between text-xs gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{invoice.plan}</p>
                          <span className="text-[9px] font-mono text-neutral-500">{invoice.id}</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{invoice.date} • {invoice.method}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-white">${invoice.amount} USD</span>
                        <button
                          onClick={() => handleDownloadInvoiceTxt(invoice)}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-850 rounded text-neutral-400 hover:text-white transition"
                          title="Descargar Comprobante Oficial"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* E-commerce credit card form checkout (Stripe/Openpay setup) */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">Checkout Seguro (Stripe / Openpay)</span>
                  <p className="text-[10px] text-neutral-500">Adquiere o renueva tu pase al instante con cobro electrónico seguro</p>
                </div>

                <form onSubmit={handleCheckoutProcess} className="space-y-4">
                  
                  {/* Select Plan widget */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Nivel de Membresía</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div 
                        onClick={() => setSelectedPlanToBuy('Mensual')}
                        className={`p-3 rounded-xl border cursor-pointer transition text-center space-y-1 ${
                          selectedPlanToBuy === 'Mensual' 
                            ? 'bg-brand-gold/10 border-brand-gold text-white' 
                            : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <p className="text-[10px] font-bold">Mensual</p>
                        <p className="text-xs font-mono font-bold">$59 USD</p>
                      </div>
                      <div 
                        onClick={() => setSelectedPlanToBuy('Anual')}
                        className={`p-3 rounded-xl border cursor-pointer transition text-center space-y-1 relative overflow-hidden ${
                          selectedPlanToBuy === 'Anual' 
                            ? 'bg-brand-gold/10 border-brand-gold text-white' 
                            : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span className="absolute top-0 right-0 bg-brand-gold text-black text-[7px] font-bold px-1 rounded-bl">PRO</span>
                        <p className="text-[10px] font-bold">Anual</p>
                        <p className="text-xs font-mono font-bold">$499 USD</p>
                      </div>
                      <div 
                        onClick={() => setSelectedPlanToBuy('VIP')}
                        className={`p-3 rounded-xl border cursor-pointer transition text-center space-y-1 ${
                          selectedPlanToBuy === 'VIP' 
                            ? 'bg-brand-gold/10 border-brand-gold text-white' 
                            : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <p className="text-[10px] font-bold">VIP Pass</p>
                        <p className="text-xs font-mono font-bold">$120/m</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Número de Tarjeta</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        placeholder="4152 8271 9912 3345"
                        value={creditCard.number}
                        onChange={(e) => setCreditCard(prev => ({ ...prev, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19) }))}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold transition font-mono"
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Nombre en la Tarjeta</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MOLLY JONES"
                      value={creditCard.name}
                      onChange={(e) => setCreditCard(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                      className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold transition font-sans"
                    />
                  </div>

                  {/* Expiry / CVC */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block">Vencimiento</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/AA"
                        value={creditCard.expiry}
                        onChange={(e) => setCreditCard(prev => ({ ...prev, expiry: e.target.value.substring(0, 5) }))}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold transition font-mono text-center"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block">CVV / CVC</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-neutral-500" />
                        <input
                          type="password"
                          required
                          placeholder="•••"
                          value={creditCard.cvc}
                          onChange={(e) => setCreditCard(prev => ({ ...prev, cvc: e.target.value.substring(0, 3) }))}
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold transition font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full bg-brand-gold hover:bg-brand-muted-gold text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 mt-3"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Seguridad SSL Stripe...
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Pagar ${selectedPlanToBuy === 'Mensual' ? '59' : selectedPlanToBuy === 'Anual' ? '499' : '120'} USD
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[8px] font-mono text-neutral-500 uppercase text-center">
                    <span>💳 ENCRIPTACIÓN SSL REFORZADA</span>
                    <span>•</span>
                    <span>PCI COMPLIANT</span>
                  </div>
                </form>
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 5: PERFIL DEL ATLETA (EDICIÓN DE DATOS)
            ========================================================================= */}
        {activeTab === 'perfil' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="bg-neutral-900/15 border border-neutral-900 rounded-3xl p-6 space-y-6">
              
              <div className="flex items-center gap-4 border-b border-neutral-900 pb-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold text-black font-display font-black text-lg flex items-center justify-center">
                  {profileForm.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">EXPEDIENTE DIGITAL DEL ATLETA</h3>
                  <p className="text-[10px] text-neutral-500 font-mono">Modificación de información médica y de seguridad</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                {/* ID del Atleta (Uneditable or editable with block style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">ID Atleta (No Editable)</label>
                    <input
                      type="text"
                      disabled
                      value={profileForm.id}
                      className="w-full text-xs bg-neutral-950/50 border border-neutral-900 rounded-xl px-4 py-3 text-neutral-500 font-mono cursor-not-allowed outline-none"
                    />
                  </div>

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold transition"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Teléfono de Contacto</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold transition font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Blood Type Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Tipo de Sangre</label>
                    <div className="relative">
                      <Droplet className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <select
                        value={profileForm.bloodType}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, bloodType: e.target.value }))}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold transition font-mono appearance-none"
                      >
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Contacto de Emergencia (Nombre y Celular)</label>
                    <div className="relative">
                      <Heart className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={profileForm.emergencyContact}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <button
                  type="submit"
                  className="w-full bg-brand-gold hover:bg-brand-muted-gold text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg mt-4"
                >
                  <Save className="w-4 h-4" />
                  Guardar Perfil de Atleta
                </button>

              </form>
            </div>
          </motion.div>
        )}

      </div>

      {/* FOOTER METADATA BAR */}
      <footer className="shrink-0 bg-neutral-950 border-t border-neutral-900 px-6 py-4 flex justify-between items-center text-[9px] font-mono text-neutral-500 pb-20 md:pb-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> ACCESO ATHLETE SEGURO • ENCRIPTACIÓN SSL
        </span>
        <span className="hidden sm:inline">CLIENT ID: {profileForm.id}</span>
      </footer>

      {/* PERSISTENT MOBILE BOTTOM NAVIGATION BAR */}
      {/* Ensures target touch layout is at least 44px (using py-3/h-16, large hit zones) */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900 px-2 py-2.5 z-40 flex items-center justify-around md:hidden h-[68px]">
        <button
          onClick={() => setActiveTab('check_in')}
          className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition h-12 ${
            activeTab === 'check_in' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Check-In</span>
        </button>

        <button
          onClick={() => setActiveTab('rutinas')}
          className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition h-12 ${
            activeTab === 'rutinas' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Rutinas</span>
        </button>

        <button
          onClick={() => setActiveTab('reservas')}
          className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition h-12 ${
            activeTab === 'reservas' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Reservas</span>
        </button>

        <button
          onClick={() => setActiveTab('membresia')}
          className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition h-12 ${
            activeTab === 'membresia' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Mi Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition h-12 ${
            activeTab === 'perfil' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Perfil</span>
        </button>
      </div>

    </div>
  );
}
