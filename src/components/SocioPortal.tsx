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
  Inbox
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

export default function SocioPortal({
  classes,
  user,
  onClose,
  onUpdateUser,
  onBookToggle,
  onTriggerNotification
}: SocioPortalProps) {
  // Navigation: "Checa bien su respectiva barra de navegacion..."
  const [activeTab, setActiveTab] = useState<'check_in' | 'membresia' | 'reservas'>('check_in');

  // =========================================================================
  // --- MODULE 1: CHECK-IN DIGITAL POR QR & GPS GEOFENCING ---
  // =========================================================================
  const [userDistance, setUserDistance] = useState<number>(120); // starts at 120 meters (out of range)
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<'success' | 'failed' | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Auto-scanned simulator helper
  const handleSimulateGPSMove = () => {
    if (userDistance > 50) {
      setUserDistance(15); // moves close to 15 meters (within 50m radius)
      onTriggerNotification("GPS Actualizado: Te has acercado al gimnasio (15m). En rango para Check-In.");
    } else {
      setUserDistance(120); // moves away
      onTriggerNotification("GPS Actualizado: Te has alejado del gimnasio (120m). Fuera de rango.");
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
      // Validate GPS Geofencing: Must be less than 50 meters
      if (userDistance > 50) {
        setScanResult('failed');
        setScanError('Fuera de Rango: Estás a más de 50 metros del gimnasio. Por favor, acércate a recepción.');
        onTriggerNotification("Fallo de Registro: Geofencing no validado.");
      } else if (user.membershipLevel.includes('Vencida') || user.checkInCount >= user.checkInGoal && false) {
        // Just checking active membership
        setScanResult('failed');
        setScanError('Membresía No Activa: Por favor, renueva tu plan en el módulo de pagos.');
        onTriggerNotification("Fallo de Registro: Membresía inactiva.");
      } else {
        setScanResult('success');
        onTriggerNotification("¡Check-In Exitoso! Acceso concedido al club.");
        // Increment weekly checkin count
        const nextCount = user.checkInCount + 1;
        onUpdateUser({
          ...user,
          checkInCount: nextCount > user.checkInGoal ? user.checkInGoal : nextCount
        });
      }
    }, 2500);
  };

  // =========================================================================
  // --- MODULE 2: MI MEMBRESÍA Y PAGOS (E-COMMERCE) ---
  // =========================================================================
  const [daysRemaining, setDaysRemaining] = useState<number>(() => {
    return user.membershipLevel.toLowerCase().includes('vip') ? 28 : 14;
  });
  
  const [creditCard, setCreditCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([
    { id: 'TX-9021', date: '12 Jun 2026', plan: 'VIP Dragon Pass', amount: 120, method: 'Stripe', status: 'Completado' },
    { id: 'TX-8812', date: '12 May 2026', plan: 'VIP Dragon Pass', amount: 120, method: 'Stripe', status: 'Completado' },
    { id: 'TX-7554', date: '12 Abr 2026', plan: 'Plan Mensual Estándar', amount: 59, method: 'Openpay', status: 'Completado' }
  ]);

  const [selectedPlanToBuy, setSelectedPlanToBuy] = useState<'Mensual' | 'Anual' | 'VIP'>('VIP');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  // Helper to force-expire membership to test renewal flow!
  const handleSimulateExpiration = () => {
    onUpdateUser({
      ...user,
      membershipLevel: 'Plan Vencido (Sin Acceso)'
    });
    setDaysRemaining(0);
    onTriggerNotification("Simulación: Tu membresía ha vencido. Intenta renovarla.");
  };

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditCard.number || !creditCard.name || !creditCard.expiry || !creditCard.cvc) {
      onTriggerNotification("Por favor completa todos los campos de la tarjeta.");
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

      // Update global user details
      onUpdateUser({
        ...user,
        membershipLevel: chosenPlanName
      });

      setDaysRemaining(selectedPlanToBuy === 'Anual' ? 365 : 30);
      
      // Add transaction history record
      const newTx: PaymentHistoryItem = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        date: 'Hoy',
        plan: chosenPlanName,
        amount: chosenPrice,
        method: 'Stripe (Seguro)',
        status: 'Completado'
      };

      setPaymentHistory(prev => [newTx, ...prev]);
      
      // Clear payment form
      setCreditCard({ number: '', name: '', expiry: '', cvc: '' });
      onTriggerNotification(`¡Felicidades! Membresía "${chosenPlanName}" activada mediante Stripe.`);
    }, 2000);
  };

  const handleDownloadReceipt = (tx: PaymentHistoryItem) => {
    // Generate text/plain downloadable file matching invoice
    const content = `
========================================
          DRAGON GYM INVOICE
========================================
ID Transacción: ${tx.id}
Fecha de Pago:  ${tx.date}
Servicio:       ${tx.plan}
Monto Total:    $${tx.amount} USD
Método de Pago: ${tx.method}
Estado:         ${tx.status}

¡Gracias por ser parte del club del dragón!
Mantente entrenando, mantente fuerte.
========================================
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante-${tx.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onTriggerNotification(`Comprobante ${tx.id} descargado con éxito.`);
  };

  // =========================================================================
  // --- MODULE 3: RESERVAS DE CLASES GRUPALES ---
  // =========================================================================
  const [classFilterCategory, setClassFilterCategory] = useState<string>('All');

  // Filter classes available
  const availableCategories = ['All', 'HIIT', 'Yoga', 'Pilates', 'Cycling', 'Strength'];
  const filteredClasses = classes.filter(c => {
    if (classFilterCategory === 'All') return true;
    return c.category.toLowerCase() === classFilterCategory.toLowerCase();
  });

  const handleBookClass = (gymClass: GymClass) => {
    // Check if membership is expired
    if (user.membershipLevel.includes('Vencido')) {
      onTriggerNotification("No puedes reservar. Tu membresía está vencida.");
      return;
    }

    // Call book toggle logic
    onBookToggle(gymClass.id);

    if (!gymClass.booked) {
      onTriggerNotification(`¡Lugar reservado con éxito en ${gymClass.title}!`);
    } else {
      onTriggerNotification(`Reservación cancelada para ${gymClass.title}.`);
    }
  };

  const isMembershipActive = !user.membershipLevel.includes('Vencido');

  return (
    <div id="socio-portal" className="fixed inset-0 bg-neutral-950 z-50 flex flex-col font-sans select-none overflow-hidden">
      
      {/* HEADER SECTION */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center border border-brand-gold/30">
            <Smartphone className="w-4 h-4 text-brand-gold animate-bounce" />
          </div>
          <div>
            <h1 className="text-sm font-display font-black tracking-[0.2em] text-white">PORTAL SOCIO</h1>
            <p className="text-[9px] font-mono tracking-widest text-brand-gold uppercase">PASE DIGITAL • RESERVAS • PAGOS</p>
          </div>
        </div>

        {/* HEADER NAVIGATION FOR DESKTOP (FULLSCREEN) */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-900/50 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('check_in')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'check_in' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Acceso QR
          </button>
          <button
            onClick={() => setActiveTab('membresia')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'membresia' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Plan y Pagos
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'reservas' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Mis Reservas
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* CORE SOCIO WORKSTATION WRAPPER */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24 md:pb-6">
        
        {/* =========================================================================
            TAB 1: CHECK-IN DIGITAL POR QR & GPS GEOFENCING
            ========================================================================= */}
        {activeTab === 'check_in' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Geofencing Status Panel */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-neutral-900/35 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Validación GPS (Geofencing)</span>
                  <Navigation className="w-4 h-4 text-brand-gold animate-pulse" />
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Distancia al Club:</span>
                    <span className="text-sm font-mono font-bold text-white">{userDistance} metros</span>
                  </div>

                  {/* Range indicators */}
                  {userDistance <= 50 ? (
                    <div className="bg-emerald-950/25 border border-emerald-500/35 rounded-xl p-3 flex items-center gap-3 text-emerald-400">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold">DENTRO DEL RANGO (&lt; 50m)</p>
                        <p className="text-[10px] text-emerald-400/80 mt-0.5">Tu GPS confirma que estás en las instalaciones.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 text-amber-400">
                      <ShieldAlert className="w-5 h-5 shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold">FUERA DE RANGO (&gt; 50m)</p>
                        <p className="text-[10px] text-amber-400/80 mt-0.5">Debes estar a menos de 50 metros para ingresar.</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSimulateGPSMove}
                    className="w-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 py-2.5 rounded-xl text-xs font-mono font-bold text-neutral-300 hover:text-white transition"
                  >
                    📍 Simular GPS: {userDistance > 50 ? "Acercarse (15m)" : "Alejarse (120m)"}
                  </button>
                </div>
              </div>

              {/* Scan Results Feedback Block */}
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`border rounded-2xl p-5 space-y-3 ${
                    scanResult === 'success' 
                      ? 'bg-emerald-950/35 border-emerald-500/40 text-emerald-400' 
                      : 'bg-red-950/35 border-red-500/40 text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {scanResult === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-xs font-mono font-bold tracking-wider uppercase">
                      {scanResult === 'success' ? 'ACCESO AUTORIZADO ✔' : 'ACCESO DENEGADO 🗙'}
                    </span>
                  </div>

                  <p className="text-xs text-white/90">
                    {scanResult === 'success' 
                      ? `Pase digital validado. ¡Bienvenido de vuelta, ${user.name}! Tu registro se envió a recepción.`
                      : scanError
                    }
                  </p>

                  {scanResult === 'success' && (
                    <div className="text-[9px] font-mono text-emerald-400/80">
                      Check-Ins Semanales: {user.checkInCount} / {user.checkInGoal}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* QR Scanner simulation camera viewfinder */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-5">
                <div className="space-y-1 text-center">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Escáner de Pase Digital QR</h3>
                  <p className="text-[10px] text-neutral-500 max-w-sm">
                    Apunta la cámara de tu celular al código QR acrílico ubicado en el mostrador de recepción.
                  </p>
                </div>

                {/* Simulated camera view */}
                <div className="relative w-full max-w-[320px] aspect-square rounded-2xl bg-black border border-neutral-850 overflow-hidden shadow-2xl flex items-center justify-center">
                  
                  {isScanning ? (
                    <>
                      {/* Scanning animated lens overlay */}
                      <div className="absolute inset-0 bg-neutral-900 opacity-20" />
                      <div className="absolute top-0 inset-x-0 h-1 bg-brand-gold shadow-[0_0_15px_#C8A2C8] animate-[bounce_2.5s_infinite]" />
                      
                      {/* Camera viewfinder grids */}
                      <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-brand-gold" />
                      <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-brand-gold" />
                      <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-brand-gold" />
                      <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-brand-gold" />
                      
                      {/* Scanning feedback */}
                      <div className="flex flex-col items-center gap-3 z-10">
                        <Camera className="w-10 h-10 text-brand-gold animate-pulse" />
                        <span className="text-[10px] font-mono text-brand-gold tracking-widest uppercase animate-pulse">
                          ACCEDIENDO A CÁMARA NATIVA...
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4 p-8 text-center">
                      <div className="p-4 bg-neutral-900/60 rounded-full border border-neutral-800">
                        <QrCode className="w-12 h-12 text-neutral-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-white">Escáner Cerrado</p>
                        <p className="text-[10px] text-neutral-500">Haz clic abajo para iniciar la lectura del código QR</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartQRScan}
                  disabled={isScanning}
                  className="w-full max-w-[320px] bg-brand-gold hover:bg-brand-muted-gold text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <QrCode className="w-4 h-4" />
                  {isScanning ? "Escaneando código..." : "Abrir Escáner QR"}
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 2: MI MEMBRESÍA Y PAGOS (E-COMMERCE)
            ========================================================================= */}
        {activeTab === 'membresia' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Plan status and purchase history */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Plan Status Card */}
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
                    <p className="text-xs text-neutral-400 mt-1">Ubicación principal: {user.favoriteClub}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-white">{daysRemaining}</p>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest">Días Restantes</p>
                  </div>
                </div>

                {/* Progress bar of days */}
                <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      daysRemaining > 5 ? 'bg-brand-gold' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (daysRemaining / 30) * 100)}%` }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSimulateExpiration}
                    className="flex-1 bg-neutral-950 hover:bg-neutral-900 text-[10px] font-mono text-neutral-500 hover:text-neutral-300 py-1.5 rounded border border-neutral-850 transition"
                  >
                    ⚠️ Simular Vencimiento
                  </button>
                </div>
              </div>

              {/* Transactions History Table */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold block pb-2 border-b border-neutral-900">
                  Historial de Pagos y Comprobantes
                </span>

                <div className="divide-y divide-neutral-900/60 max-h-[220px] overflow-y-auto no-scrollbar">
                  {paymentHistory.map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between text-xs gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{tx.plan}</p>
                          <span className="text-[9px] font-mono text-neutral-500">{tx.id}</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{tx.date} • {tx.method}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono font-bold text-white">${tx.amount} USD</span>
                        <button
                          onClick={() => handleDownloadReceipt(tx)}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-850 rounded text-neutral-400 hover:text-white transition"
                          title="Descargar Comprobante TXT"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: E-Commerce Stripe Checkout */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-bold">Checkout Seguro (Stripe / Openpay)</span>
                  <p className="text-[10px] text-neutral-500">Renueva tu pase o cámbiate a un nivel superior al instante sin filas</p>
                </div>

                <form onSubmit={handleProcessCheckout} className="space-y-4.5">
                  
                  {/* Select Plan Widget */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">Selecciona un Plan para comprar</label>
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
                    <label className="text-[9px] font-mono text-neutral-400 uppercase block">Titular de Tarjeta</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SARAH CONNOR"
                      value={creditCard.name}
                      onChange={(e) => setCreditCard(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                      className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-gold transition font-sans"
                    />
                  </div>

                  {/* Expiry & CVC inline */}
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
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block">CVC / CVV</label>
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

                  {/* Payment Button */}
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full bg-brand-gold hover:bg-brand-muted-gold text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Procesando pago con Stripe...
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        Pagar ${selectedPlanToBuy === 'Mensual' ? '59' : selectedPlanToBuy === 'Anual' ? '499' : '120'} USD
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[8px] font-mono text-neutral-500 uppercase text-center mt-2">
                    <span>💳 CONEXIÓN ENCRIPTADA SSL</span>
                    <span>•</span>
                    <span>PCI COMPLIANT BY STRIPE / OPENPAY</span>
                  </div>
                </form>
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 3: RESERVACIÓN DE CLASES GRUPALES
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
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setClassFilterCategory(cat)}
                    className={`py-1.5 px-3.5 text-[10px] font-mono font-bold uppercase rounded-lg transition shrink-0 border ${
                      classFilterCategory === cat 
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
                // mock details
                const capacityMax = 25;
                const capacityBooked = isBooked ? 18 : 17;
                const capacityLeft = capacityMax - capacityBooked;

                return (
                  <div 
                    key={cls.id}
                    className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    {/* Visual card header */}
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
                          Lugares disponibles: <span className="font-bold text-white">{capacityLeft}</span> / {capacityMax}
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

                      {/* Action trigger button */}
                      <button
                        onClick={() => handleBookClass(cls)}
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
                  <p className="text-xs text-neutral-500 font-mono">No hay clases de esta categoría programadas para hoy</p>
                </div>
              )}
            </div>

          </motion.div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="shrink-0 bg-neutral-950 border-t border-neutral-900 px-6 py-4 flex justify-between items-center text-[9px] font-mono text-neutral-500 pb-20 md:pb-4">
        <span>● DRAGON ATHLETE SECURE SYSTEM</span>
        <span>ID: {user.name.toLowerCase().substring(0, 3)}-{user.checkInCount}82</span>
      </footer>

      {/* PERSISTENT BOTTOM NAVIGATION BAR (Visible on mobile/tablet only) */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900/80 px-6 py-3 z-40 flex items-center justify-between md:hidden">
        <button
          onClick={() => setActiveTab('check_in')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'check_in' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">QR Check-In</span>
        </button>

        <button
          onClick={() => setActiveTab('membresia')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'membresia' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Membresía</span>
        </button>

        <button
          onClick={() => setActiveTab('reservas')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'reservas' ? 'text-brand-gold' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Reservas</span>
        </button>
      </div>

    </div>
  );
}
