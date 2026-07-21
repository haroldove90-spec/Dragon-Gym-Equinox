import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Activity, 
  Search, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Users, 
  Clock, 
  DollarSign, 
  QrCode, 
  UserCheck, 
  UserX,
  RefreshCw,
  Inbox,
  UserPlus,
  ShieldAlert,
  Camera,
  Play,
  Trash2,
  Ban,
  TrendingUp,
  FileText
} from 'lucide-react';
import { GymClass, UserProfile } from '../types';

interface StaffPortalProps {
  classes: GymClass[];
  user: UserProfile;
  onClose: () => void;
  onIncrementCheckIn: () => void;
  onTriggerNotification: (message: string) => void;
}

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  membershipLevel: string;
  status: 'Activo' | 'Vencido' | 'Pendiente';
  lastCheckIn: string;
  avatarColor: string;
}

interface ScanLog {
  id: string;
  name: string;
  email: string;
  time: string;
  status: 'Concedido' | 'Denegado';
  reason?: string;
  avatarLetter: string;
  avatarColor: string;
}

interface RosterMember {
  name: string;
  avatarLetter: string;
  level: string;
  attended: boolean;
}

interface TempPass {
  id: string;
  name: string;
  timeRange: string;
  expiresAt: string;
  suspended: boolean;
}

export default function StaffPortal({
  classes,
  user,
  onClose,
  onIncrementCheckIn,
  onTriggerNotification
}: StaffPortalProps) {
  
  // Navigation tabs (Monitor, Inscripción, POS / Caja, Pases Temporales, Lista Asistencia)
  const [activeTab, setActiveTab] = useState<'monitor' | 'registro' | 'pos_caja' | 'pases' | 'sesiones'>('monitor');

  // =========================================================================
  // --- STATE FOR CLIENTS & MEMBERS ---
  // =========================================================================
  const [clients, setClients] = useState<ClientProfile[]>([
    { id: 'DG-1090', name: 'Sarah Connor', email: 'sarah.c@sky.net', phone: '+1 (555) 109-0221', bloodType: 'A-', membershipLevel: 'VIP Dragon Pass', status: 'Activo', lastCheckIn: 'Hoy, 11:15 AM', avatarColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'DG-2281', name: 'John Connor', email: 'john.c@sky.net', phone: '+1 (555) 228-1110', bloodType: 'O+', membershipLevel: 'Plan Mensual Estándar', status: 'Vencido', lastCheckIn: 'Hace 5 días', avatarColor: 'bg-red-500/20 text-red-300' },
    { id: 'DG-3382', name: 'Marcus Wright', email: 'marcus@projectangel.org', phone: '+1 (555) 338-2026', bloodType: 'B+', membershipLevel: 'Plan Anual Elite', status: 'Activo', lastCheckIn: 'Hoy, 10:55 AM', avatarColor: 'bg-blue-500/20 text-blue-300' },
    { id: 'DG-4512', name: 'Kyle Reese', email: 'kyle.reese@resistance.org', phone: '+1 (555) 451-2291', bloodType: 'O-', membershipLevel: 'Plan Mensual Estándar', status: 'Pendiente', lastCheckIn: 'Hace 12 días', avatarColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'DG-5555', name: 'T-800 Cyberdyne', email: 'terminator@skynet.com', phone: '+1 (555) 800-1984', bloodType: 'Metálico', membershipLevel: 'VIP Dragon Pass', status: 'Activo', lastCheckIn: 'Hoy, 09:12 AM', avatarColor: 'bg-purple-500/20 text-purple-300' },
    { id: user.id || 'DG-ATHLETE-7102', name: user.name, email: user.email, phone: user.phone || '+1 (555) 381-9921', bloodType: user.bloodType || 'O+', membershipLevel: user.membershipLevel, status: user.membershipLevel.toLowerCase().includes('vencid') ? 'Vencido' : 'Activo', lastCheckIn: 'Hoy, 08:30 AM', avatarColor: 'bg-brand-gold/20 text-brand-gold' }
  ]);

  // Synchronize active user state edits if needed
  useEffect(() => {
    setClients(prev => prev.map(c => {
      if (c.id === user.id) {
        return {
          ...c,
          name: user.name,
          email: user.email,
          phone: user.phone,
          bloodType: user.bloodType,
          membershipLevel: user.membershipLevel,
          status: user.membershipLevel.toLowerCase().includes('vencid') ? 'Vencido' : 'Activo'
        };
      }
      return c;
    }));
  }, [user]);

  // =========================================================================
  // --- TAB 1: MONITOR DE ACCESOS EN TIEMPO REAL ---
  // =========================================================================
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([
    { id: '1', name: 'Sarah Connor', email: 'sarah.c@sky.net', time: '11:15 AM', status: 'Concedido', avatarLetter: 'S', avatarColor: 'bg-purple-500/20 text-purple-300' },
    { id: '2', name: 'John Connor', email: 'john.c@sky.net', time: '11:10 AM', status: 'Denegado', reason: 'Membresía Vencida', avatarLetter: 'J', avatarColor: 'bg-red-500/20 text-red-300' },
    { id: '3', name: 'Marcus Wright', email: 'marcus@projectangel.org', time: '10:55 AM', status: 'Concedido', avatarLetter: 'M', avatarColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: '4', name: 'Kyle Reese', email: 'kyle.reese@resistance.org', time: '10:42 AM', status: 'Denegado', reason: 'Pago Pendiente', avatarLetter: 'K', avatarColor: 'bg-amber-500/20 text-amber-300' }
  ]);

  const [highlightedScan, setHighlightedScan] = useState<ScanLog | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedScanProfile, setSelectedScanProfile] = useState<ClientProfile | null>(null);

  const triggerSimulationScan = () => {
    setIsScanning(true);
    setHighlightedScan(null);

    setTimeout(() => {
      setIsScanning(false);
      // Select a random client from current clients
      const randomClient = clients[Math.floor(Math.random() * clients.length)];
      const isConcedido = randomClient.status === 'Activo';
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newLog: ScanLog = {
        id: String(Date.now()),
        name: randomClient.name,
        email: randomClient.email,
        time: timeString,
        status: isConcedido ? 'Concedido' : 'Denegado',
        reason: isConcedido ? undefined : randomClient.status === 'Vencido' ? 'Membresía Vencida' : 'Pago Pendiente / Requiere Registro',
        avatarLetter: randomClient.name.charAt(0).toUpperCase(),
        avatarColor: randomClient.avatarColor
      };

      setScanLogs(prev => [newLog, ...prev]);
      setHighlightedScan(newLog);
      setSelectedScanProfile(randomClient);

      if (isConcedido) {
        onTriggerNotification(`🟢 Acceso Concedido: ${randomClient.name}`);
        if (randomClient.id === user.id) {
          onIncrementCheckIn();
        }
      } else {
        onTriggerNotification(`🔴 Acceso Denegado: ${randomClient.name} (${newLog.reason})`);
      }
    }, 1500);
  };

  // =========================================================================
  // --- TAB 2: INSCRIPCIÓN DE SOCIOS ---
  // =========================================================================
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: 'O+',
    membershipLevel: 'Plan Mensual Estándar',
    status: 'Activo' as 'Activo' | 'Pendiente'
  });

  const handleRegisterMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name || !newMemberForm.email) {
      onTriggerNotification("⚠️ Nombre y Correo son requeridos para dar de alta.");
      return;
    }

    const randomColors = [
      'bg-emerald-500/20 text-emerald-300',
      'bg-purple-500/20 text-purple-300',
      'bg-blue-500/20 text-blue-300',
      'bg-amber-500/20 text-amber-300',
      'bg-pink-500/20 text-pink-300',
      'bg-teal-500/20 text-teal-300'
    ];

    const newClient: ClientProfile = {
      id: `DG-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newMemberForm.name,
      email: newMemberForm.email,
      phone: newMemberForm.phone || '+1 (555) 000-0000',
      bloodType: newMemberForm.bloodType,
      membershipLevel: newMemberForm.membershipLevel,
      status: newMemberForm.status,
      lastCheckIn: 'Recién Registrado',
      avatarColor: randomColors[Math.floor(Math.random() * randomColors.length)]
    };

    setClients(prev => [newClient, ...prev]);
    onTriggerNotification(`✔ ¡Socio creado con éxito! ID asignado: ${newClient.id}`);
    
    // Clear form and go to Monitor or POS
    setNewMemberForm({
      name: '',
      email: '',
      phone: '',
      bloodType: 'O+',
      membershipLevel: 'Plan Mensual Estándar',
      status: 'Activo'
    });
    setActiveTab('monitor');
  };

  // =========================================================================
  // --- TAB 3: CAJA RÁPIDA Y POS ---
  // =========================================================================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  const [selectedMembershipToBuy, setSelectedMembershipToBuy] = useState<'Mensual' | 'Anual' | 'VIP'>('Mensual');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Terminal'>('Terminal');
  const [shiftSalesCash, setShiftSalesCash] = useState(240);
  const [shiftSalesTerminal, setShiftSalesTerminal] = useState(580);
  const [salesHistory, setSalesHistory] = useState<Array<{ id: string; name: string; amount: number; method: string; date: string }>>([
    { id: 'TX-POS-101', name: 'Sarah Connor', amount: 120, method: 'Terminal', date: '11:15 AM' },
    { id: 'TX-POS-102', name: 'Marcus Wright', amount: 59, method: 'Efectivo', date: '10:55 AM' }
  ]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProcessPayment = () => {
    if (!selectedClient) return;

    const prices = { Mensual: 59, Anual: 499, VIP: 120 };
    const amount = prices[selectedMembershipToBuy];

    setClients(prev => prev.map(c => {
      if (c.id === selectedClient.id) {
        return {
          ...c,
          status: 'Activo',
          membershipLevel: `${selectedMembershipToBuy === 'VIP' ? 'VIP Dragon Pass' : selectedMembershipToBuy === 'Anual' ? 'Plan Anual Elite' : 'Plan Mensual Estándar'}`
        };
      }
      return c;
    }));

    if (paymentMethod === 'Efectivo') {
      setShiftSalesCash(prev => prev + amount);
    } else {
      setShiftSalesTerminal(prev => prev + amount);
    }

    const txId = `TX-POS-${Math.floor(103 + Math.random() * 900)}`;
    setSalesHistory(prev => [
      { id: txId, name: selectedClient.name, amount, method: paymentMethod, date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev
    ]);

    onTriggerNotification(`✔ Cobro de $${amount} USD realizado. Membresía de "${selectedClient.name}" activada.`);
    setSelectedClient(null);
    setSearchQuery('');
  };

  // =========================================================================
  // --- TAB 4: PASES QR TEMPORALES ---
  // =========================================================================
  const [tempPasses, setTempPasses] = useState<TempPass[]>([
    { id: 'PASS-819', name: 'Esteban Martínez (Visita)', timeRange: '06:00 - 12:00', expiresAt: 'Hoy', suspended: false },
    { id: 'PASS-502', name: 'Valeria Rosas (Pase 1 Día)', timeRange: '08:00 - 22:00', expiresAt: '18 Julio 2026', suspended: false },
    { id: 'PASS-331', name: 'Rodrigo Méndez (Proveedor)', timeRange: '14:00 - 17:00', expiresAt: 'Hoy', suspended: true }
  ]);

  const [newPassName, setNewPassName] = useState('');
  const [newPassStart, setNewPassStart] = useState('06:00');
  const [newPassEnd, setNewPassEnd] = useState('22:00');

  const handleCreateTempPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassName) {
      onTriggerNotification("⚠️ Ingresa el nombre del visitante.");
      return;
    }

    const newPass: TempPass = {
      id: `PASS-${Math.floor(100 + Math.random() * 900)}`,
      name: newPassName,
      timeRange: `${newPassStart} - ${newPassEnd}`,
      expiresAt: 'Hoy',
      suspended: false
    };

    setTempPasses(prev => [newPass, ...prev]);
    setNewPassName('');
    onTriggerNotification(`🎫 Pase temporal ${newPass.id} emitido para ${newPass.name}.`);
  };

  const handleToggleSuspendPass = (passId: string) => {
    setTempPasses(prev => prev.map(p => {
      if (p.id === passId) {
        const nextState = !p.suspended;
        onTriggerNotification(
          nextState 
            ? `🚨 Pase ${p.id} SUSPENDIDO AL INSTANTE.` 
            : `❇ Pase ${p.id} REACTIVADO con éxito.`
        );
        return { ...p, suspended: nextState };
      }
      return p;
    }));
  };

  const handleDeletePass = (passId: string) => {
    setTempPasses(prev => prev.filter(p => p.id !== passId));
    onTriggerNotification(`✖ Pase ${passId} removido del sistema.`);
  };

  // =========================================================================
  // --- TAB 5: CONTROL DE ASISTENCIA A CLASES ---
  // =========================================================================
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [classAttendanceBook, setClassAttendanceBook] = useState<Record<string, RosterMember[]>>({
    'all': [
      { name: 'Sarah Connor', avatarLetter: 'S', level: 'VIP Dragon Pass', attended: true },
      { name: 'Marcus Wright', avatarLetter: 'M', level: 'Plan Anual Elite', attended: false },
      { name: 'Diana Prince', avatarLetter: 'D', level: 'VIP Dragon Pass', attended: true },
      { name: user.name, avatarLetter: user.avatarLetter, level: user.membershipLevel, attended: false }
    ]
  });

  const activeSelectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const activeRoster = classAttendanceBook[selectedClassId] || classAttendanceBook.all;

  const handleToggleAttendance = (memberName: string) => {
    setClassAttendanceBook(prev => {
      const currentList = prev[selectedClassId] || prev.all;
      const updatedList = currentList.map(m => {
        if (m.name === memberName) {
          const nextState = !m.attended;
          onTriggerNotification(nextState ? `✔ Asistencia confirmada para ${m.name}.` : `🗙 Asistencia cancelada para ${m.name}.`);
          return { ...m, attended: nextState };
        }
        return m;
      });

      return {
        ...prev,
        [selectedClassId]: updatedList
      };
    });
  };

  return (
    <div id="staff-portal" className="fixed inset-0 bg-neutral-950 z-50 flex flex-col font-sans select-none overflow-hidden text-neutral-200">
      
      {/* HEADER SECTION */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-display font-black tracking-[0.2em] text-white">RECEPCIÓN DRAGON</h1>
            <p className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase">TURNO OPERATIVO EN SITIO</p>
          </div>
        </div>

        {/* HEADER NAVIGATION FOR DESKTOP */}
        <div className="hidden lg:flex items-center gap-1 bg-neutral-900/50 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`py-1.5 px-3.5 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'monitor' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Monitor
          </button>
          <button
            onClick={() => setActiveTab('registro')}
            className={`py-1.5 px-3.5 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'registro' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Inscripción
          </button>
          <button
            onClick={() => setActiveTab('pos_caja')}
            className={`py-1.5 px-3.5 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'pos_caja' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            POS / Caja
          </button>
          <button
            onClick={() => setActiveTab('pases')}
            className={`py-1.5 px-3.5 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'pases' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pases QR
          </button>
          <button
            onClick={() => setActiveTab('sesiones')}
            className={`py-1.5 px-3.5 text-[11px] font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'sesiones' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Asistencia
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* CORE WORKSTATION VIEWPORT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-24 lg:pb-6">
        
        {/* =========================================================================
            TAB 1: MONITOR DE ACCESOS EN TIEMPO REAL
            ========================================================================= */}
        {activeTab === 'monitor' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Simulated/Real Camera scanning device + quick status banner */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-2xl p-5 space-y-4 text-center">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900 text-left">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Lector QR Integrado</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                {/* Simulated Webcam scanning viewport */}
                <div className="relative w-full max-w-[240px] aspect-square rounded-2xl bg-black border border-neutral-850 overflow-hidden shadow-2xl flex flex-col items-center justify-center mx-auto">
                  {isScanning ? (
                    <>
                      <div className="absolute inset-0 bg-emerald-950/20" />
                      <div className="absolute top-0 inset-x-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-[bounce_2s_infinite]" />
                      
                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                      
                      <div className="flex flex-col items-center gap-2 z-10 text-emerald-400 font-mono text-[9px] tracking-widest animate-pulse">
                        <Camera className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
                        <span>CAPTURA DE QR ACTIVA...</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                      <div className="p-3 bg-neutral-900 rounded-full border border-neutral-850">
                        <QrCode className="w-10 h-10 text-neutral-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Dispositivo de Recepción</p>
                        <p className="text-[9px] text-neutral-500 font-mono">Listo para leer códigos QR físicos</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={triggerSimulationScan}
                  disabled={isScanning}
                  className="w-full bg-emerald-400 hover:bg-emerald-350 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {isScanning ? "Escaneando..." : "Simular Lectura de QR"}
                </button>
              </div>

              {/* Instant Alert State Card */}
              {highlightedScan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`border rounded-2xl p-5 space-y-2.5 text-left ${
                    highlightedScan.status === 'Concedido' 
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400' 
                      : 'bg-red-950/20 border-red-500/40 text-red-400 animate-pulse'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {highlightedScan.status === 'Concedido' ? (
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <UserX className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-xs font-mono font-bold tracking-wider uppercase">
                      {highlightedScan.status === 'Concedido' ? 'ACCESO AUTORIZADO' : 'ACCESO RECHAZADO'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-sm font-bold text-white">{highlightedScan.name}</p>
                    <p className="text-[10px] text-neutral-400 font-mono">{highlightedScan.email}</p>
                    
                    {highlightedScan.reason ? (
                      <p className="text-xs font-semibold font-mono text-red-400 bg-red-950/40 border border-red-900/40 px-2.5 py-1.5 rounded-lg mt-2">
                        Motivo: {highlightedScan.reason}
                      </p>
                    ) : (
                      <p className="text-xs font-semibold font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2.5 py-1.5 rounded-lg mt-2">
                        Estatus: Membresía Al Corriente ✔
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Live Check-in feed history with full client info */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Feed de Accesos en Tiempo Real</h3>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase animate-pulse">
                  CONEXIÓN EN VIVO
                </span>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
                {scanLogs.map((log) => {
                  const isConcedido = log.status === 'Concedido';
                  return (
                    <div
                      key={log.id}
                      className={`bg-neutral-950 border rounded-xl p-3.5 flex items-center justify-between gap-4 transition duration-300 ${
                        highlightedScan?.id === log.id 
                          ? isConcedido 
                            ? 'border-emerald-500 bg-emerald-950/5' 
                            : 'border-red-500 bg-red-950/5' 
                          : 'border-neutral-900 hover:border-neutral-850'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-display ${log.avatarColor}`}>
                          {log.avatarLetter}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">{log.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{log.time} • {log.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0 font-mono">
                        {isConcedido ? (
                          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded font-bold uppercase">
                            Concedido
                          </span>
                        ) : (
                          <div className="text-right space-y-0.5">
                            <span className="text-[9px] text-red-400 bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded font-bold uppercase">
                              Denegado
                            </span>
                            <p className="text-[8px] text-red-400/80 italic max-w-[140px] truncate">
                              {log.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 2: INSCRIPCIÓN DE SOCIOS (REGISTRO RÁPIDO)
            ========================================================================= */}
        {activeTab === 'registro' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-xl mx-auto text-left"
          >
            <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl p-6 space-y-4">
              <div className="pb-3 border-b border-neutral-900">
                <h3 className="text-sm font-display font-black tracking-wider text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  INSCRIPCIÓN DE SOCIOS RÁPIDA
                </h3>
                <p className="text-[11px] text-neutral-500 font-mono mt-1">
                  Da de alta un nuevo cliente e inicia su plan al instante.
                </p>
              </div>

              <form onSubmit={handleRegisterMember} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={newMemberForm.email}
                      onChange={(e) => setNewMemberForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      placeholder="Ej. +52 (555) 012-3456"
                      value={newMemberForm.phone}
                      onChange={(e) => setNewMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Tipo de Sangre</label>
                    <select
                      value={newMemberForm.bloodType}
                      onChange={(e) => setNewMemberForm(prev => ({ ...prev, bloodType: e.target.value }))}
                      className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 transition"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Plan de Entrenamiento Inicial</label>
                    <select
                      value={newMemberForm.membershipLevel}
                      onChange={(e) => setNewMemberForm(prev => ({ ...prev, membershipLevel: e.target.value }))}
                      className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 transition"
                    >
                      <option value="Plan Mensual Estándar">Plan Mensual Estándar ($59 USD)</option>
                      <option value="Plan Anual Elite">Plan Anual Elite ($499 USD)</option>
                      <option value="VIP Dragon Pass">VIP Dragon Pass ($120 USD/mes)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">Estado Inicial de Pago</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewMemberForm(prev => ({ ...prev, status: 'Activo' }))}
                      className={`py-3 rounded-xl text-center text-xs font-bold border transition ${
                        newMemberForm.status === 'Activo' 
                          ? 'bg-emerald-400 text-black border-emerald-400' 
                          : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Cobrado y Activo
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewMemberForm(prev => ({ ...prev, status: 'Pendiente' }))}
                      className={`py-3 rounded-xl text-center text-xs font-bold border transition ${
                        newMemberForm.status === 'Pendiente' 
                          ? 'bg-amber-500 text-black border-amber-500' 
                          : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Pendiente de Pago
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-400 hover:bg-emerald-350 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition mt-2"
                >
                  Registrar Atleta en el Sistema
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            TAB 3: CAJA RÁPIDA Y PUNTO DE VENTA (POS)
            ========================================================================= */}
        {activeTab === 'pos_caja' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Left side: Intelligent predictive search box & client matches */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 space-y-3.5">
                <div className="space-y-1">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Buscador Inteligente de Socios</h3>
                  <p className="text-[10px] text-neutral-500">Busca en tiempo real por Nombre, Correo o ID único.</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Escribe el ID (ej: DG-1090), nombre o correo..."
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              {/* Matches list */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-neutral-900 flex justify-between items-center bg-black/30">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Resultados de Búsqueda ({filteredClients.length})</span>
                </div>

                <div className="divide-y divide-neutral-900 max-h-[300px] overflow-y-auto no-scrollbar">
                  {filteredClients.map((c) => {
                    const isSelected = selectedClient?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedClient(c)}
                        className={`p-3.5 flex items-center justify-between gap-4 cursor-pointer transition ${
                          isSelected ? 'bg-emerald-500/5 border-l-2 border-emerald-400' : 'hover:bg-neutral-900/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-display ${c.avatarColor}`}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-semibold text-white">{c.name}</h4>
                              <span className="text-[9px] font-mono text-neutral-500">{c.id}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-0.5">{c.email} • {c.membershipLevel}</p>
                          </div>
                        </div>

                        <div>
                          {c.status === 'Activo' ? (
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase font-bold">
                              Activo
                            </span>
                          ) : c.status === 'Vencido' ? (
                            <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full uppercase font-bold">
                              Vencido
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase font-bold">
                              Pendiente
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredClients.length === 0 && (
                    <div className="p-8 text-center space-y-2 text-neutral-500">
                      <Inbox className="w-8 h-8 mx-auto text-neutral-700" />
                      <p className="text-xs">Sin coincidencias para la búsqueda.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Register payment + Cut of cash drawer widget */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Cobro / Checkout form */}
              <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold block pb-2 border-b border-neutral-900">
                  Registro de Cobro en Mostrador
                </span>

                {selectedClient ? (
                  <div className="space-y-4">
                    <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl">
                      <p className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest">Socio Destino</p>
                      <h4 className="text-xs font-bold text-white mt-1">{selectedClient.name}</h4>
                      <p className="text-[10px] text-neutral-400 mt-0.5">ID: {selectedClient.id} • {selectedClient.phone}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Seleccionar Renovación / Producto</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Mensual', 'Anual', 'VIP'].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setSelectedMembershipToBuy(p as any)}
                            className={`py-2 rounded-xl text-center text-xs font-bold border transition uppercase ${
                              selectedMembershipToBuy === p 
                                ? 'bg-emerald-400 text-black border-emerald-400' 
                                : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Método de Pago Recibido</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Efectivo')}
                          className={`py-2 rounded-xl text-center text-xs font-bold border transition ${
                            paymentMethod === 'Efectivo' 
                              ? 'bg-white text-black border-white' 
                              : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                          }`}
                        >
                          Efectivo
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('Terminal')}
                          className={`py-2 rounded-xl text-center text-xs font-bold border transition ${
                            paymentMethod === 'Terminal' 
                              ? 'bg-white text-black border-white' 
                              : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                          }`}
                        >
                          Terminal Bancaria
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleProcessPayment}
                      className="w-full bg-emerald-400 hover:bg-emerald-350 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg"
                    >
                      Registrar Cobro Manual
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 text-xs font-mono">
                    Busca y selecciona un socio para habilitar la caja rápida.
                  </div>
                )}
              </div>

              {/* CORTE DE CAJA PARCIAL */}
              <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Corte de Caja Diario</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase animate-pulse">Cajero Operativo</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl space-y-0.5">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase">Efectivo Turno</p>
                    <p className="text-base font-mono font-bold text-white">${shiftSalesCash} USD</p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl space-y-0.5">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase">Terminal Turno</p>
                    <p className="text-base font-mono font-bold text-white">${shiftSalesTerminal} USD</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const total = shiftSalesCash + shiftSalesTerminal;
                    onTriggerNotification(`Corte de caja registrado para el turno. Total declarado de $${total} USD.`);
                    setShiftSalesCash(0);
                    setShiftSalesTerminal(0);
                    setSalesHistory([]);
                  }}
                  className="w-full bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-neutral-850 py-2.5 rounded-xl font-semibold text-xs transition uppercase tracking-wide"
                >
                  Realizar Corte y Cierre de Turno
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* =========================================================================
            TAB 4: PASES QR TEMPORALES & BOTÓN DE PÁNICO
            ========================================================================= */}
        {activeTab === 'pases' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 text-left"
          >
            {/* Left Column: Register New Temporal Access */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold block">Emisión de Pase Temporal</span>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Otorga accesos con rango horario limitado para no-socios.</p>
                </div>

                <form onSubmit={handleCreateTempPass} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Nombre del Visitante / Proveedor</label>
                    <input
                      type="text"
                      placeholder="Ej. Roberto Gómez (Proveedor Alimentos)"
                      value={newPassName}
                      onChange={(e) => setNewPassName(e.target.value)}
                      className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-400 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Hora de Entrada</label>
                      <input
                        type="time"
                        value={newPassStart}
                        onChange={(e) => setNewPassStart(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Hora de Salida</label>
                      <input
                        type="time"
                        value={newPassEnd}
                        onChange={(e) => setNewPassEnd(e.target.value)}
                        className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-400 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-400 hover:bg-emerald-350 text-black py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition"
                  >
                    Emitir Pase Digital QR
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Existing pases list with immediate panic kill-switch */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Administración de Pases Temporales</h3>
                <span className="text-[9px] font-mono text-red-400 bg-red-400/5 px-2.5 py-0.5 rounded border border-red-500/10 uppercase tracking-widest font-bold">
                  CONTROL DE PÁNICO ACTIVO
                </span>
              </div>

              <div className="space-y-2.5">
                {tempPasses.map((pass) => (
                  <div
                    key={pass.id}
                    className={`bg-neutral-950 border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-300 ${
                      pass.suspended ? 'border-red-900 bg-red-950/5' : 'border-neutral-900 hover:border-neutral-850'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{pass.name}</span>
                        <span className="text-[9px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-850">
                          {pass.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-neutral-500" /> {pass.timeRange}</span>
                        <span>• Expiración: {pass.expiresAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* PANIC BUTTON: Instant suspend or reactivate */}
                      <button
                        onClick={() => handleToggleSuspendPass(pass.id)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-[9px] font-bold uppercase tracking-wider transition flex items-center gap-1 border ${
                          pass.suspended 
                            ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10' 
                            : 'bg-red-950/20 text-red-400 border-red-500/30 hover:bg-red-500/10'
                        }`}
                      >
                        <Ban className="w-3 h-3" />
                        {pass.suspended ? "Reactivar Pase" : "Suspender (PÁNICO)"}
                      </button>

                      <button
                        onClick={() => handleDeletePass(pass.id)}
                        className="p-2 bg-neutral-900 hover:bg-red-950/20 text-neutral-500 hover:text-red-400 border border-neutral-850 rounded-xl transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {tempPasses.length === 0 && (
                  <div className="p-8 text-center text-neutral-500 text-xs">
                    No hay pases temporales activos registrados en este turno.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            TAB 5: CONTROL DE ASISTENCIA A SESIONES
            ========================================================================= */}
        {activeTab === 'sesiones' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-xl mx-auto text-left"
          >
            {/* Active daily class selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-bold">
                Sesión del Día
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full text-xs bg-neutral-900 border border-neutral-850 rounded-xl p-3.5 text-white outline-none focus:border-emerald-400 transition"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.time} con Coach {c.instructor})
                  </option>
                ))}
              </select>
            </div>

            {/* Daily instructor status */}
            {activeSelectedClass && (
              <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white uppercase font-display tracking-wide">{activeSelectedClass.title}</p>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Coach Asignado: {activeSelectedClass.instructor} • Horario: {activeSelectedClass.time}
                  </p>
                  <p className="text-[9px] text-neutral-500 font-mono mt-0.5">Ubicación: {activeSelectedClass.location}</p>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-1 rounded">
                  {activeSelectedClass.category}
                </span>
              </div>
            )}

            {/* List for attendance tracking */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-1">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  Lista de Reservaciones y Asistencia
                </h4>
                <span className="text-[9px] text-neutral-500 font-mono">
                  Alterna con un click para marcar asistencia
                </span>
              </div>

              <div className="space-y-2">
                {activeRoster.map((athlete, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-neutral-850 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-300 shrink-0 font-display">
                        {athlete.avatarLetter}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-xs">{athlete.name}</p>
                        <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider">{athlete.level}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleAttendance(athlete.name)}
                      className={`px-3.5 py-1.5 border rounded-xl text-[10px] font-mono font-bold tracking-wider transition ${
                        athlete.attended 
                          ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-neutral-900/60 text-neutral-500 border-neutral-850 hover:text-neutral-300'
                      }`}
                    >
                      {athlete.attended ? 'Asistió ✔' : 'Pendiente 🗙'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="shrink-0 bg-neutral-950 border-t border-neutral-900 px-6 py-4 flex justify-between items-center text-[9px] font-mono text-neutral-500 pb-20 lg:pb-4">
        <span>● RECEPCIÓN CENTRAL DRAGON GYM</span>
        <span>ID TRABAJO: dg-staff-rx</span>
      </footer>

      {/* PERSISTENT BOTTOM NAVIGATION BAR (Visible on mobile/tablet only) */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900/80 px-4 py-3.5 z-40 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setActiveTab('monitor')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'monitor' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider">Monitor</span>
        </button>

        <button
          onClick={() => setActiveTab('registro')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'registro' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <UserPlus className="w-5 h-5" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider">Registro</span>
        </button>

        <button
          onClick={() => setActiveTab('pos_caja')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'pos_caja' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider">POS</span>
        </button>

        <button
          onClick={() => setActiveTab('pases')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'pases' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider">Pases</span>
        </button>

        <button
          onClick={() => setActiveTab('sesiones')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'sesiones' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider">Asistencia</span>
        </button>
      </div>
    </div>
  );
}
