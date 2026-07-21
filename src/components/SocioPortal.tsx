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
  Volume2,
  Trash2,
  TrendingUp,
  ShoppingBag,
  Info
} from 'lucide-react';
import { GymClass, UserProfile, ExerciseSet, WorkoutExercise, WorkoutRoutine, GymAnnouncement } from '../types';

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

export default function SocioPortal({
  classes,
  user,
  onClose,
  onUpdateUser,
  onBookToggle,
  onTriggerNotification
}: SocioPortalProps) {
  // Navigation State supporting 5 core Equinox-style mobile modules
  const [activeTab, setActiveTab] = useState<'inicio' | 'rutinas_inteligentes' | 'progreso_ia' | 'pagos_tienda' | 'notificaciones'>('inicio');

  // =========================================================================
  // --- MÓDULO 1: INICIO / CREDENCIAL DIGITAL & GEOFENCING ---
  // =========================================================================
  const [userDistance, setUserDistance] = useState<number>(15); // Metros de distancia al club
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<'success' | 'failed' | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<string>(() => Math.random().toString(36).substring(2, 10).toUpperCase());
  const [qrTimeLeft, setQrTimeLeft] = useState<number>(15);
  const [daysRemaining, setDaysRemaining] = useState<number>(14);

  // Timer para regenerar token dinámico del QR (seguridad PWA)
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
      onTriggerNotification("📍 GPS Localizado: Estás a 15m de Dragon Gym Polanco. ¡En rango de entrada!");
    } else {
      setUserDistance(120);
      onTriggerNotification("📍 GPS Localizado: Te has alejado a 120m del club. Fuera de rango.");
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
        setScanError('Fuera de Rango GPS: Debes estar a menos de 50 metros del club para validar tu acceso.');
        onTriggerNotification("❌ Error de Acceso: Geofencing no validado.");
      } else if (user.membershipLevel.toLowerCase().includes('vencid') || daysRemaining <= 0) {
        setScanResult('failed');
        setScanError('Membresía Vencida: Por favor realiza el pago de renovación en la pestaña "Pagos & Tienda".');
        onTriggerNotification("❌ Acceso Denegado: Membresía inactiva.");
      } else {
        setScanResult('success');
        onTriggerNotification("✅ ¡Acceso Autorizado! Bienvenido a Dragon Gym Polanco.");
        const nextCount = user.checkInCount + 1;
        onUpdateUser({
          ...user,
          checkInCount: nextCount > user.checkInGoal ? user.checkInGoal : nextCount
        });
      }
    }, 1800);
  };

  // =========================================================================
  // --- MÓDULO 2: RUTINAS INTELIGENTES & ESCÁNER DE MÁQUINAS ---
  // =========================================================================
  const [machineScannerOpen, setMachineScannerOpen] = useState<boolean>(false);
  const [isScanningMachine, setIsScanningMachine] = useState<boolean>(false);
  const [selectedMachine, setSelectedMachine] = useState<MachineExerciseInfo | null>(null);
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);

  // Catálogo dinámico de máquinas escaneables sincronizado con el Portal Coach
  const [machinesList, setMachinesList] = useState<MachineExerciseInfo[]>(() => {
    const saved = localStorage.getItem('eqx_machines');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'mac-1',
        code: 'PRENSA-45',
        name: 'Prensa de Piernas 45° de Poder',
        targetMuscles: 'Cuádriceps, Glúteo Mayor, Femorales',
        youtubeId: 'rT7DgCr-3ps',
        commonErrors: [
          'Bloquear las rodillas por completo en el punto de extensión máxima (alto riesgo de lesión).',
          'Despegar la cadera o la pelvis del respaldo durante la fase de descenso.',
          'Hacer un rango de movimiento excesivamente corto o rebotar la carga.'
        ],
        recommendations: [
          'Controla el descenso durante al menos 3 segundos de forma constante.',
          'Mantén la planta completa de tus pies apoyada firmemente en la plataforma.',
          'Empuja con la fuerza de los talones y mantén la cadera totalmente firme contra el asiento.'
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
          'Perder la curvatura neutra de la columna lumbar al descender (retroversión pélvica).'
        ],
        recommendations: [
          'Empuja activamente las rodillas hacia afuera alineándolas con la punta de tus pies.',
          'Inicia el movimiento empujando la cadera ligeramente hacia atrás como si te sentaras.',
          'Mantén el abdomen ultra compacto y empuja firmemente con toda la planta del pie.'
        ]
      }
    ];
  });

  const [coachRoutine, setCoachRoutine] = useState<any>(null);

  // Carga en tiempo real la rutina complementaria asignada por el Coach/Entrenador
  useEffect(() => {
    const saved = localStorage.getItem('eqx_coach_routines');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const currentId = user.id || 'SOC-MOLLY';
        const userRoutine = parsed[currentId] || parsed['SOC-MOLLY'];
        if (userRoutine) {
          setCoachRoutine(userRoutine);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [user.id, activeTab]);

  const handleScanMachine = (machineCode: string) => {
    setIsScanningMachine(true);
    setTimeout(() => {
      setIsScanningMachine(false);
      const found = machinesList.find(m => m.code === machineCode);
      if (found) {
        setSelectedMachine(found);
        setMachineScannerOpen(false);
        onTriggerNotification(`🔍 Escaneo Exitoso: Ficha técnica cargada para ${found.name}.`);
      } else {
        onTriggerNotification("❌ Código QR no reconocido en la sala de máquinas.");
      }
    }, 1500);
  };

  // =========================================================================
  // --- MÓDULO 3: PROGRESO & IA ---
  // =========================================================================
  const [progressHistory, setProgressHistory] = useState<ProgressLog[]>(() => {
    const saved = localStorage.getItem('eqx_progress_history');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) { console.error(e); }
    }
    return [
      { date: '01 Jul 2026', weight: 78.5, fatPercent: 14.8, chest: 104, waist: 82, arm: 38 },
      { date: '08 Jul 2026', weight: 78.1, fatPercent: 14.5, chest: 104, waist: 81.5, arm: 38.2 },
      { date: '15 Jul 2026', weight: 77.8, fatPercent: 14.2, chest: 104.5, waist: 81, arm: 38.5 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('eqx_progress_history', JSON.stringify(progressHistory));
  }, [progressHistory]);

  const [newWeight, setNewWeight] = useState<string>('');
  const [newFat, setNewFat] = useState<string>('');
  const [newChest, setNewChest] = useState<string>('');
  const [newWaist, setNewWaist] = useState<string>('');
  const [newArm, setNewArm] = useState<string>('');
  const [progressPhotos, setProgressPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop"
  ]);

  const handleAddProgressLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || !newFat) {
      onTriggerNotification("Por favor completa al menos el Peso y el % de Grasa.");
      return;
    }
    const log: ProgressLog = {
      date: 'Hoy',
      weight: parseFloat(newWeight),
      fatPercent: parseFloat(newFat),
      chest: newChest ? parseFloat(newChest) : 104.5,
      waist: newWaist ? parseFloat(newWaist) : 81,
      arm: newArm ? parseFloat(newArm) : 38.5
    };
    setProgressHistory(prev => [log, ...prev]);
    setNewWeight('');
    setNewFat('');
    setNewChest('');
    setNewWaist('');
    setNewArm('');
    onTriggerNotification("📈 Registro de medidas guardado. Tu IA generará nuevos reportes.");
  };

  const handleSimulatePhotoUpload = () => {
    onTriggerNotification("📸 Simulando captura de foto de avance con cámara móvil...");
    setTimeout(() => {
      setProgressPhotos(prev => [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200&auto=format&fit=crop",
        ...prev
      ]);
      onTriggerNotification("✅ Foto de avance agregada exitosamente a tu expediente seguro.");
    }, 1500);
  };

  // =========================================================================
  // --- MÓDULO 4: PAGOS & TIENDA (CHECKOUT MULTI-MÉTODO & E-COMMERCE) ---
  // =========================================================================
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'tarjeta' | 'spei' | 'domiciliacion'>('tarjeta');
  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<'Mensual' | 'Anual' | 'VIP'>('Mensual');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [creditCard, setCreditCard] = useState({ number: '', name: '', expiry: '', cvc: '' });
  
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([
    { id: 'TX-9021', date: '12 Jun 2026', plan: 'Plan Mensual Estándar', amount: 59, method: 'Stripe Seguro', status: 'Completado' },
    { id: 'TX-8812', date: '12 May 2026', plan: 'Plan Mensual Estándar', amount: 59, method: 'Stripe Seguro', status: 'Completado' },
    { id: 'TX-7554', date: '12 Abr 2026', plan: 'Inscripción Premium', amount: 89, method: 'Openpay', status: 'Completado' }
  ]);

  const [shopCart, setShopCart] = useState<number>(0);
  const shopProducts = [
    { id: 'p1', name: 'Suplemento Proteína de Suero Aislada (1kg)', price: 39, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150&auto=format&fit=crop' },
    { id: 'p2', name: 'Bebida de Electrólitos Hidratantes Oficial', price: 3, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=150&auto=format&fit=crop' },
    { id: 'p3', name: 'Barra Energética Pro-Nutritiva Dragon', price: 4, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=150&auto=format&fit=crop' }
  ];

  const handle1ClickBuy = (prodName: string, price: number) => {
    onTriggerNotification(`🛍️ Procesando compra 1-Clic para ${prodName}...`);
    setTimeout(() => {
      onTriggerNotification(`✅ ¡Compra Autorizada! Cargo de $${price} USD realizado a tu tarjeta registrada.`);
      setShopCart(prev => prev + 1);

      // Save order to shared localStorage for Staff
      try {
        const savedOrders = localStorage.getItem('eqx_pending_orders');
        const orders = savedOrders ? JSON.parse(savedOrders) : [];
        const newOrder = {
          id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
          clientName: user.name || 'Molly Athlete',
          clientId: user.id || 'SOC-MOLLY',
          productName: prodName,
          price: price,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Pendiente'
        };
        orders.unshift(newOrder);
        localStorage.setItem('eqx_pending_orders', JSON.stringify(orders));
      } catch (e) {
        console.error('Error saving pending order:', e);
      }
    }, 1200);
  };

  const handleTriggerExpirationSim = () => {
    onUpdateUser({
      ...user,
      membershipLevel: 'Membresía Vencida (Inactivo)'
    });
    setDaysRemaining(0);
    onTriggerNotification("⚠️ Simulación: Tu membresía ha vencido. Realiza un pago para activarla.");
  };

  const handleCheckoutProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPaymentMethod === 'tarjeta' && (!creditCard.number || !creditCard.name || !creditCard.expiry || !creditCard.cvc)) {
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
        method: selectedPaymentMethod === 'tarjeta' ? 'Stripe Seguro' : selectedPaymentMethod === 'spei' ? 'Transferencia SPEI' : 'Domiciliación Clabe',
        status: 'Completado'
      };

      setPaymentHistory(prev => [newInvoice, ...prev]);
      setCreditCard({ number: '', name: '', expiry: '', cvc: '' });
      onTriggerNotification(`✅ ¡Felicidades! Membresía "${chosenPlanName}" activada y pagada con éxito.`);
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
  // --- MÓDULO 5: NOTIFICACIONES (ALERTAS PUSH) ---
  // =========================================================================
  const [pushAlerts, setPushAlerts] = useState([
    { id: '1', type: 'motivacional', text: '🔥 ¡Hoy es un excelente día para entrenar! El área de inmersión en frío y sauna te esperan para recuperar tus músculos.', date: 'Hoy • 08:30 AM', read: false },
    { id: '2', type: 'cobro', text: '💳 Recordatorio de Cobro: Tu membresía de acceso se renovará automáticamente en 14 días.', date: 'Hoy • 07:00 AM', read: false },
    { id: '3', type: 'rutina', text: '🏋️ Alerta de Rutina: Se ha asignado una nueva sesión de "Fuerza Dragon Imperial" en tu perfil. ¡Consúltala ahora!', date: 'Ayer • 06:15 PM', read: true },
    { id: '4', type: 'motivacional', text: '✨ Tip de Nutrición: Consumir 20g de proteína en tu ventana de recuperación optimiza tus ganancias.', date: 'Hace 2 días • 05:30 PM', read: true }
  ]);

  const handleMarkAllRead = () => {
    setPushAlerts(prev => prev.map(a => ({ ...a, read: true })));
    onTriggerNotification("🔔 Alertas marcadas como leídas.");
  };

  const isMembershipActive = !user.membershipLevel.toLowerCase().includes('vencid');

  return (
    <div id="socio-portal" className="fixed inset-0 bg-[#070707] z-50 flex flex-col font-sans select-none overflow-hidden text-neutral-200">
      
      {/* HEADER DE PORTAL SOCIO */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
            <Smartphone className="w-4.5 h-4.5 text-brand-gold animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-display font-black tracking-[0.2em] text-white">MIEMBRO DRAGON</h1>
            <p className="text-[9px] font-mono tracking-widest text-brand-gold uppercase">PORTAL SOCIO • EQUINOX STYLE</p>
          </div>
        </div>

        {/* HEADER NAVIGATION PARA PANTALLAS DESKTOP */}
        <div className="hidden md:flex items-center gap-1.5 bg-neutral-900/40 p-1 rounded-xl border border-neutral-850">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'inicio' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Inicio / Credencial
          </button>
          <button
            onClick={() => setActiveTab('rutinas_inteligentes')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'rutinas_inteligentes' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Rutinas Inteligentes
          </button>
          <button
            onClick={() => setActiveTab('progreso_ia')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'progreso_ia' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Progreso & IA
          </button>
          <button
            onClick={() => setActiveTab('pagos_tienda')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'pagos_tienda' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Pagos & Tienda
          </button>
          <button
            onClick={() => setActiveTab('notificaciones')}
            className={`py-1.5 px-3 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 relative ${
              activeTab === 'notificaciones' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/30'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Notificaciones
            {pushAlerts.some(a => !a.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
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
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-28 md:pb-6">
        
        {/* =========================================================================
            TAB 1: INICIO / CREDENCIAL DIGITAL
            ========================================================================= */}
        {activeTab === 'inicio' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Lado Izquierdo: Credencial QR + Distancia GPS */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="bg-gradient-to-b from-neutral-900/50 to-neutral-950 border border-neutral-900 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                <div className="w-full flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">CREDENCIAL ACCESO PUERTA</span>
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    isMembershipActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {isMembershipActive ? 'Activo' : 'Inactivo / Vencido'}
                  </span>
                </div>

                {/* Tarjeta Digital del Socio estilo Equinox */}
                <div className="w-full bg-neutral-900 rounded-xl p-4 border border-neutral-800 text-left space-y-3.5 relative overflow-hidden">
                  <div className="absolute right-[-10px] top-[-10px] w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700/65 flex items-center justify-center font-display font-semibold text-sm text-brand-gold text-center shrink-0">
                      {user.avatarLetter}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">{user.name}</h4>
                      <p className="text-[9px] text-neutral-500 font-mono tracking-widest">{user.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end pt-2 border-t border-neutral-850 text-xs">
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase font-mono">Tipo Membresía</span>
                      <span className="font-bold text-white uppercase">{user.membershipLevel}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-neutral-500 block uppercase font-mono">Vencimiento / Próximo Cobro</span>
                      <span className="font-mono font-bold text-brand-gold">{daysRemaining} Días Restantes</span>
                    </div>
                  </div>
                </div>

                {/* Frame de Código QR Inteligente */}
                <div className="relative p-3 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center max-w-[170px] aspect-square border border-neutral-200">
                  <svg className="w-32 h-32 text-neutral-900" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="5" width="15" height="15" fill="white" />
                    <rect x="9" y="9" width="7" height="7" fill="currentColor" />
                    
                    <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                    <rect x="80" y="5" width="15" height="15" fill="white" />
                    <rect x="84" y="9" width="7" height="7" fill="currentColor" />
                    
                    <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                    <rect x="5" y="80" width="15" height="15" fill="white" />
                    <rect x="9" y="84" width="7" height="7" fill="currentColor" />

                    <rect x="35" y="35" width="30" height="30" fill="currentColor" opacity="0.8" />
                    <rect x="40" y="40" width="20" height="20" fill="white" />
                    <rect x="45" y="45" width="10" height="10" fill="currentColor" />

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
                  <div className="absolute inset-0 border-2 border-brand-gold rounded-xl animate-pulse pointer-events-none opacity-40" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold tracking-widest text-neutral-200">ACCESO QR: {qrToken}</span>
                  <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-neutral-400">
                    <RefreshCw className="w-3 h-3 text-brand-gold animate-spin" style={{ animationDuration: '3s' }} />
                    <span>Se regenera dinámicamente en {qrTimeLeft}s</span>
                  </div>
                </div>
              </div>

              {/* Slider de Validación GPS */}
              <div className="bg-neutral-900/35 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">GEOFENCING DE ENTRADA</span>
                  <MapPin className="w-4 h-4 text-brand-gold animate-bounce" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Distancia a puerta:</span>
                    <span className="font-mono font-bold text-white">{userDistance} metros</span>
                  </div>

                  {userDistance < 50 ? (
                    <div className="bg-emerald-950/20 border border-emerald-500/35 rounded-xl p-3 flex items-center gap-2.5 text-emerald-400 text-xs">
                      <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                      <div>
                        <p className="font-bold">EN RANGO DE ACCESO (&lt; 50m)</p>
                        <p className="text-[9px] text-emerald-400/80 mt-0.5">Puedes registrar tu entrada mediante QR en recepción.</p>
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

                  <div className="space-y-1">
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
                    className="w-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 py-2 rounded-xl text-xs font-mono font-bold text-neutral-300 hover:text-white transition"
                  >
                    📍 Simular GPS: {userDistance > 50 ? "Acercarse a 15m" : "Alejarse a 120m"}
                  </button>
                </div>
              </div>

            </div>

            {/* Lado Derecho: Escáner de Pase + Avisos Generales */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Simulador de Cámara Escáner en Recepción */}
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 flex flex-col items-center justify-center text-center space-y-4 shadow-md">
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Escáner de Recepción</h3>
                  <p className="text-[10px] text-neutral-500 max-w-sm">
                    Simula la lectura del código QR dinámico de tu móvil en la tableta del acceso oficial de puerta.
                  </p>
                </div>

                <div className="relative w-full max-w-[200px] aspect-square rounded-2xl bg-black border border-neutral-900 overflow-hidden shadow-2xl flex items-center justify-center">
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
                        <span>VERIFICANDO CREDENCIAL...</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="p-3 bg-neutral-900 rounded-full border border-neutral-850">
                        <QrCode className="w-10 h-10 text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Lector de Puerta</p>
                        <p className="text-[9px] text-neutral-500">Listo para validar código</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartQRScan}
                  disabled={isScanning}
                  className="w-full max-w-[200px] bg-brand-gold hover:bg-brand-muted-gold text-black py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <QrCode className="w-4 h-4" />
                  {isScanning ? "Validando..." : "Escanear en Puerta"}
                </button>

                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-full max-w-[400px] text-xs p-3 rounded-xl border text-left flex items-start gap-3 ${
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
                          ? `¡Bienvenido, ${user.name}! Tu acceso ha sido validado correctamente en la terminal.`
                          : scanError
                        }
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* RECUADRO DE COMUNICADOS */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">AVISOS Y COMUNICADOS DEL CLUB</span>
                  <Bell className="w-4 h-4 text-brand-gold animate-bounce" />
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl border bg-neutral-900/40 border-neutral-900 flex flex-col gap-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-white font-display uppercase tracking-wide">Mantenimiento Preventivo Zona Húmeda</h4>
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 bg-red-500 text-white">Alta</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      La zona de vapor e hidromasaje Polanco estará en mantenimiento los días 16 y 17 de Julio. Reabriremos el sábado 18 con nuevos sistemas automatizados. El resto de las áreas opera con total normalidad.
                    </p>
                    <span className="text-[9px] font-mono text-neutral-500">Publicado hoy • 15 Julio 2026</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* =========================================================================
            TAB 2: RUTINAS INTELIGENTES & ESCÁNER DE MÁQUINAS
            ========================================================================= */}
        {activeTab === 'rutinas_inteligentes' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto"
          >
            {/* Cabecera del Escáner */}
            <div className="bg-neutral-900/35 border border-neutral-900 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-md">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">RUTINAS INTELIGENTES</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lector de Máquinas en Sala</h3>
                <p className="text-xs text-neutral-400 max-w-md">
                  Apunta la cámara a los códigos QR colocados en las máquinas de fuerza para cargar automáticamente sus videos instructivos, músculos y errores comunes.
                </p>
              </div>

              <button
                onClick={() => setMachineScannerOpen(true)}
                className="bg-brand-gold hover:bg-brand-muted-gold text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shrink-0"
              >
                <Camera className="w-4.5 h-4.5" />
                Escanear Código de Máquina
              </button>
            </div>

            {/* Modal/Cajón de Escáner de Máquina */}
            <AnimatePresence>
              {machineScannerOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                >
                  <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden w-full max-w-md shadow-2xl relative">
                    <header className="p-4 border-b border-neutral-900 flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">CÁMARA: ESCÁNER DE SALA</span>
                      <button 
                        onClick={() => setMachineScannerOpen(false)}
                        className="w-8 h-8 rounded-full bg-neutral-900 text-neutral-400 flex items-center justify-center hover:text-white"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </header>

                    <div className="p-6 flex flex-col items-center justify-center space-y-6 text-center">
                      <div className="relative w-full max-w-[220px] aspect-square rounded-xl bg-black border border-neutral-900 overflow-hidden flex items-center justify-center">
                        {isScanningMachine ? (
                          <>
                            <div className="absolute inset-0 bg-neutral-900/40" />
                            <div className="absolute top-0 inset-x-0 h-1 bg-brand-gold shadow-[0_0_12px_#D4AF37] animate-[bounce_1.5s_infinite]" />
                            <span className="text-[10px] font-mono text-brand-gold animate-pulse">LLEYENDO CÓDIGO BARRAS...</span>
                          </>
                        ) : (
                          <div className="p-4 flex flex-col items-center gap-2">
                            <QrCode className="w-12 h-12 text-neutral-600 animate-pulse" />
                            <span className="text-[10px] text-neutral-500 font-mono">Enfoca el código QR de la máquina</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 w-full">
                        <p className="text-xs text-neutral-400 font-medium uppercase">O selecciona una máquina para simular el escaneo:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {machinesList.map(m => (
                            <button
                              key={m.id}
                              onClick={() => handleScanMachine(m.code)}
                              disabled={isScanningMachine}
                              className="p-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-xl text-[10px] font-mono text-neutral-300 hover:text-white transition uppercase truncate"
                            >
                              📷 {m.name.split(' ')[0]} ({m.code})
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ficha Técnica de Ejercicio / Máquina Escaneada */}
            {selectedMachine ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="bg-gradient-to-r from-brand-gold/10 to-transparent p-5 border-b border-neutral-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-brand-gold uppercase tracking-widest font-bold">MÁQUINA ESCANEADA</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-wider">{selectedMachine.name}</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      <span className="font-semibold text-neutral-300">Músculos Trabajados:</span> {selectedMachine.targetMuscles}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveYoutubeId(selectedMachine.youtubeId)}
                    className="bg-neutral-900 hover:bg-neutral-850 border border-brand-gold/30 text-white py-2 px-4 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current text-brand-gold" />
                    Ver Video de Técnica
                  </button>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Columna 1: Errores Comunes */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                      <ShieldAlert className="w-4.5 h-4.5" />
                      <h5>Errores Comunes a Evitar</h5>
                    </div>
                    <ul className="space-y-2">
                      {selectedMachine.commonErrors.map((err, idx) => (
                        <li key={idx} className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl text-xs text-neutral-300 leading-relaxed flex items-start gap-2.5">
                          <span className="text-red-500 font-bold font-mono">🗙</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Columna 2: Recomendaciones */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <h5>Recomendaciones de Ejecución</h5>
                    </div>
                    <ul className="space-y-2">
                      {selectedMachine.recommendations.map((rec, idx) => (
                        <li key={idx} className="bg-neutral-900/40 border border-neutral-900 p-3 rounded-xl text-xs text-neutral-300 leading-relaxed flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold font-mono">✔</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-neutral-900/30 border-t border-neutral-900 flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>ID SENSOR: {selectedMachine.id}</span>
                  <button 
                    onClick={() => setSelectedMachine(null)} 
                    className="text-brand-gold hover:underline uppercase font-bold"
                  >
                    Limpiar Ficha Técnica
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="py-12 border border-neutral-900/70 rounded-2xl bg-neutral-950/40 text-center space-y-3 shadow-md">
                <Info className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs text-neutral-400 font-mono">No hay ninguna máquina escaneada en este momento.</p>
                <p className="text-[10px] text-neutral-500 max-w-sm mx-auto">
                  Haz clic en el botón superior "Escanear Código de Máquina" o simula el escaneo con los botones rápidos para ver las guías.
                </p>
              </div>
            )}

            {/* Rutina Prescrita por tu Entrenador / Coach */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">RUTINA COMPLEMENTARIA ASIGNADA POR TU COACH</span>
                </div>
                <span className="text-[9px] font-mono text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded uppercase font-bold">Prescripción Técnica</span>
              </div>

              {coachRoutine ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">{coachRoutine.title}</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">Frecuencia recomendada: {coachRoutine.daysPerWeek} días por semana</p>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">Estado: Activo</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    {coachRoutine.exercises.map((ex: any, idx: number) => (
                      <div key={idx} className="bg-neutral-900/40 border border-neutral-900 p-4 rounded-xl space-y-2 hover:border-brand-gold/25 transition">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">{ex.name}</span>
                          <span className="text-[9px] font-mono bg-neutral-950 px-2 py-0.5 rounded text-neutral-400">{ex.sets} Sets</span>
                        </div>
                        <div className="flex justify-between text-xs font-mono text-neutral-400">
                          <span>Reps: <span className="text-brand-gold font-bold">{ex.reps}</span></span>
                          {ex.notes && <span className="text-[10px] text-neutral-500 font-sans italic max-w-[180px] text-right truncate" title={ex.notes}>Nota: {ex.notes}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 border border-dashed border-neutral-850 rounded-xl text-center space-y-2">
                  <p className="text-xs text-neutral-400 font-mono">No tienes ninguna rutina complementaria asignada por el coach aún.</p>
                  <p className="text-[9px] text-neutral-500">Solicítale un ajuste o rutina personalizada a tu entrenador en sala para verla aquí.</p>
                </div>
              )}
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
                        className="w-8 h-8 rounded-full bg-neutral-900 text-neutral-400 flex items-center justify-center hover:text-white"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </header>

                    <div className="aspect-video bg-black relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&mute=0`}
                        title="YouTube tutorial"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>

                    <footer className="p-3 bg-neutral-950 border-t border-neutral-900 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
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
            TAB 3: PROGRESO & IA (REGISTRO Y REPORTE DE INSIGHTS)
            ========================================================================= */}
        {activeTab === 'progreso_ia' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Formulario de registro + Fotos de avance */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">REGISTRO DE BITÁCORA FISICA</span>
                  <TrendingUp className="w-4 h-4 text-brand-gold" />
                </div>

                <form onSubmit={handleAddProgressLog} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase">Peso Corporal (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="e.g. 77.5"
                        value={newWeight}
                        onChange={(e) => setNewWeight(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase">% de Grasa Corporal</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="e.g. 14.0"
                        value={newFat}
                        onChange={(e) => setNewFat(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-neutral-400 uppercase">Pecho (cm)</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="104"
                        value={newChest}
                        onChange={(e) => setNewChest(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-2.5 text-white outline-none focus:border-brand-gold font-mono text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-neutral-400 uppercase">Cintura (cm)</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="81"
                        value={newWaist}
                        onChange={(e) => setNewWaist(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-2.5 text-white outline-none focus:border-brand-gold font-mono text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-neutral-400 uppercase">Brazo (cm)</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="38"
                        value={newArm}
                        onChange={(e) => setNewArm(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl p-2.5 text-white outline-none focus:border-brand-gold font-mono text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-gold hover:bg-brand-muted-gold text-black py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg"
                  >
                    Guardar Datos de Avance
                  </button>
                </form>
              </div>

              {/* Registro de Fotos de Avance */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold block pb-2 border-b border-neutral-900">
                  FOTOGRAFÍAS DE AVANCE SECURE-CLOUD
                </span>

                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={handleSimulatePhotoUpload}
                    className="aspect-square border-2 border-dashed border-neutral-800 hover:border-brand-gold hover:bg-neutral-900/40 rounded-xl flex flex-col items-center justify-center text-center p-2 text-neutral-500 hover:text-brand-gold transition"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span className="text-[8px] font-mono uppercase font-bold">Subir</span>
                  </button>

                  {progressPhotos.map((img, index) => (
                    <div key={index} className="aspect-square rounded-xl overflow-hidden border border-neutral-900 relative group">
                      <img src={img} alt="Avance" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="text-[8px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-white font-bold uppercase">Foto #{progressPhotos.length - index}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Lado Derecho: Insights Generados por la IA */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">DRAGON IA INSIGHT PANEL</span>
                  <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                </div>

                <div className="space-y-3.5">
                  <div className="p-4 rounded-xl border bg-brand-gold/5 border-brand-gold/20 space-y-2">
                    <p className="text-xs font-bold text-white uppercase flex items-center gap-1.5 font-display">
                      <Sparkles className="w-4 h-4 text-brand-gold" />
                      Resumen Semanal de Progreso
                    </p>
                    <p className="text-xs text-neutral-300 leading-relaxed font-light">
                      "Hola Molly. Hemos analizado tus bitácoras de las últimas 3 semanas. Estás registrando una reducción consistente del <span className="text-brand-gold font-bold">0.3% de grasa corporal</span> por semana. Sin embargo, hemos detectado que llevas 3 semanas sin aumentar la carga de tu Prensa a 45°. Tu sobrecarga progresiva se ha estancado ligeramente. Recomendamos incrementar la carga en 2.5 kg adicionales en tu próxima sesión de tren inferior."
                    </p>
                  </div>

                  {/* Tabla de Historial */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-neutral-500 uppercase">Historial de Registros</span>
                    <div className="divide-y divide-neutral-900 max-h-[180px] overflow-y-auto no-scrollbar">
                      {progressHistory.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-neutral-400">{item.date}</span>
                          <span className="text-white">Peso: {item.weight} kg</span>
                          <span className="text-brand-gold">Grasa: {item.fatPercent}%</span>
                          <span className="text-neutral-500">Cintura: {item.waist} cm</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* =========================================================================
            TAB 4: PAGOS & TIENDA
            ========================================================================= */}
        {activeTab === 'pagos_tienda' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Izquierda: Renovación de Membresía (Checkout multi-método) */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">Pasarela de Pagos Segura (Stripe / SPEI)</span>
                  <p className="text-[10px] text-neutral-500">Adquiere o renueva tu nivel de membresía oficial</p>
                </div>

                {/* Selección de Método de Pago */}
                <div className="grid grid-cols-3 gap-2 pb-2">
                  <button
                    onClick={() => setSelectedPaymentMethod('tarjeta')}
                    className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase border transition ${
                      selectedPaymentMethod === 'tarjeta'
                        ? 'bg-brand-gold text-black border-brand-gold'
                        : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    💳 Tarjeta
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('spei')}
                    className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase border transition ${
                      selectedPaymentMethod === 'spei'
                        ? 'bg-brand-gold text-black border-brand-gold'
                        : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    🏦 SPEI
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('domiciliacion')}
                    className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase border transition ${
                      selectedPaymentMethod === 'domiciliacion'
                        ? 'bg-brand-gold text-black border-brand-gold'
                        : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    📝 Domiciliar
                  </button>
                </div>

                <form onSubmit={handleCheckoutProcess} className="space-y-4">
                  
                  {/* Selector de Plan */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Oferta de Suscripciones Comerciales</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Mensual', 'Anual', 'VIP'].map((p) => {
                        const prices = { Mensual: 59, Anual: 499, VIP: 120 };
                        const names = { Mensual: 'Plan Mensual', Anual: 'Plan Anual', VIP: 'VIP Pass' };
                        return (
                          <div 
                            key={p}
                            onClick={() => setSelectedPlanToBuy(p as any)}
                            className={`p-3 rounded-xl border cursor-pointer transition text-center space-y-1 ${
                              selectedPlanToBuy === p 
                                ? 'bg-brand-gold/10 border-brand-gold text-white' 
                                : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'
                            }`}
                          >
                            <p className="text-[10px] font-bold">{names[p as keyof typeof names]}</p>
                            <p className="text-xs font-mono font-bold">${prices[p as keyof typeof prices]} USD</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detalle por Método de Pago */}
                  {selectedPaymentMethod === 'tarjeta' && (
                    <div className="space-y-3">
                      <div className="space-y-1">
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

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
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
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-neutral-400 uppercase block">CVC</label>
                          <input
                            type="password"
                            required
                            placeholder="•••"
                            value={creditCard.cvc}
                            onChange={(e) => setCreditCard(prev => ({ ...prev, cvc: e.target.value.substring(0, 3) }))}
                            className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold transition font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'spei' && (
                    <div className="p-3.5 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2 text-xs">
                      <p className="font-bold text-white font-mono uppercase text-[10px]">INSTRUCCIONES DE TRANSFERENCIA CLABE</p>
                      <p className="text-neutral-400 leading-relaxed text-[11px]">
                        Transfiere el monto correspondiente utilizando tu aplicación bancaria móvil:
                      </p>
                      <div className="p-2 bg-neutral-900 rounded border border-neutral-850 font-mono text-[11px] space-y-1 text-neutral-300">
                        <p>Banco: <span className="font-bold text-white">SANTANDER</span></p>
                        <p>CLABE: <span className="font-bold text-white">0141 8056 7102 9918 21</span></p>
                        <p>Beneficiario: <span className="font-bold text-white">DRAGON GYM S.A.</span></p>
                      </div>
                      <p className="text-[9px] text-neutral-500 font-mono">
                        La validación es automática al detectar la clave de rastreo bancaria SPEI.
                      </p>
                    </div>
                  )}

                  {selectedPaymentMethod === 'domiciliacion' && (
                    <div className="space-y-3">
                      <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-xl text-xs text-neutral-400 leading-relaxed text-[11px]">
                        Configura el cargo recurrente automático a tu Clave Interbancaria de 18 dígitos para renovación automática sin interrupciones.
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-neutral-400 uppercase block">CLABE Interbancaria de 18 Dígitos</label>
                        <input
                          type="text"
                          required
                          placeholder="0121 8000 1234 5678 90"
                          className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold transition font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full bg-brand-gold hover:bg-brand-muted-gold text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Procesando Transacción Segura...
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Pagar ${selectedPlanToBuy === 'Mensual' ? '59' : selectedPlanToBuy === 'Anual' ? '499' : '120'} USD
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Botón de Vencimiento de Pruebas */}
              <div className="p-4 bg-neutral-900/30 border border-neutral-900 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Simulador de Pruebas</p>
                  <p className="text-[9px] text-neutral-500 font-mono">Simula la pérdida de vigencia</p>
                </div>
                <button
                  onClick={handleTriggerExpirationSim}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 py-1.5 px-3 text-[10px] font-mono text-red-400 hover:text-red-300 transition rounded"
                >
                  ⚠️ Forzar Membresía Vencida
                </button>
              </div>

            </div>

            {/* Derecha: Tienda e-commerce de Suplementos / Bebidas con Compra en 1-Clic */}
            <div className="lg:col-span-6 space-y-5">
              
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4 shadow-md">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">DRAGON SHOP: COMPRA RÁPIDA 1-CLIC</span>
                  <ShoppingBag className="w-4 h-4 text-brand-gold" />
                </div>

                <div className="grid grid-cols-1 gap-3.5 max-h-[420px] overflow-y-auto no-scrollbar">
                  {shopProducts.map((prod) => (
                    <div 
                      key={prod.id}
                      className="bg-neutral-900/40 border border-neutral-900 rounded-xl p-3 flex items-center gap-3.5 hover:border-neutral-800 transition"
                    >
                      <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wide truncate">{prod.name}</h5>
                        <p className="text-xs font-mono font-bold text-brand-gold mt-1">${prod.price} USD</p>
                      </div>

                      <button
                        onClick={() => handle1ClickBuy(prod.name, prod.price)}
                        className="bg-neutral-900 hover:bg-neutral-800 border border-brand-gold/20 text-brand-gold hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition shrink-0"
                      >
                        1-Clic Buy
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* =========================================================================
            TAB 5: NOTIFICACIONES (ALERTAS PUSH PERSONALIZADAS)
            ========================================================================= */}
        {activeTab === 'notificaciones' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-900">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Centro de Notificaciones</h3>
                  <p className="text-[10px] text-neutral-500 font-mono">Alertas motivacionales, avisos de pago y rutinas</p>
                </div>

                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-mono text-brand-gold hover:underline uppercase font-bold"
                >
                  Marcar Todo como Leído
                </button>
              </div>

              <div className="space-y-3.5 divide-y divide-neutral-900/60">
                {pushAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`pt-3.5 first:pt-0 flex items-start gap-3.5 transition ${
                      alert.read ? 'opacity-60' : 'opacity-100'
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      alert.read ? 'bg-neutral-800' : 'bg-brand-gold animate-pulse'
                    }`} />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                        <span>{alert.type}</span>
                        <span>{alert.date}</span>
                      </div>
                      <p className="text-xs text-neutral-200 leading-relaxed font-light">{alert.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* FOOTER METADATA BAR */}
      <footer className="shrink-0 bg-neutral-950 border-t border-neutral-900 px-6 py-4 flex justify-between items-center text-[9px] font-mono text-neutral-500 pb-20 md:pb-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> ACCESO ATHLETE SEGURO • ENCRIPTACIÓN SSL
        </span>
        <span className="hidden sm:inline">CLIENT ID: {user.id}</span>
      </footer>

      {/* PERSISTENT BOTTOM NAVIGATION BAR PARA MÓVILES (ROBUSTA, ALTURA ADECUADA PARA TOUCH >44px) */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900 px-2 py-2.5 z-40 flex items-center justify-around md:hidden h-[68px]">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition h-12 ${
            activeTab === 'inicio' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[8px] font-semibold uppercase tracking-wider">Inicio</span>
        </button>

        <button
          onClick={() => setActiveTab('rutinas_inteligentes')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition h-12 ${
            activeTab === 'rutinas_inteligentes' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <Activity className="w-5 h-5" />
          <span className="text-[8px] font-semibold uppercase tracking-wider">Rutinas</span>
        </button>

        <button
          onClick={() => setActiveTab('progreso_ia')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition h-12 ${
            activeTab === 'progreso_ia' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[8px] font-semibold uppercase tracking-wider">Progreso IA</span>
        </button>

        <button
          onClick={() => setActiveTab('pagos_tienda')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition h-12 ${
            activeTab === 'pagos_tienda' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[8px] font-semibold uppercase tracking-wider">Pagos</span>
        </button>

        <button
          onClick={() => setActiveTab('notificaciones')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition h-12 relative ${
            activeTab === 'notificaciones' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
          style={{ minHeight: '44px' }}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[8px] font-semibold uppercase tracking-wider">Alertas</span>
          {pushAlerts.some(a => !a.read) && (
            <span className="absolute top-2.5 right-6 w-1.5 h-1.5 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

    </div>
  );
}
