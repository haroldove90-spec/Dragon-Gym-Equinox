import React, { useState } from 'react';
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
  TrendingUp,
  Inbox,
  ShoppingBag,
  Briefcase
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
  membershipLevel: string;
  status: 'Activo' | 'Vencido' | 'Pendiente';
  lastCheckIn: string;
}

interface ScanLog {
  id: string;
  name: string;
  email: string;
  time: string;
  status: 'Concedido' | 'Denegado';
  reason?: string;
  avatarLetter: string;
}

interface RosterMember {
  name: string;
  avatarLetter: string;
  level: string;
  attended: boolean;
}

export default function StaffPortal({
  classes,
  user,
  onClose,
  onIncrementCheckIn,
  onTriggerNotification
}: StaffPortalProps) {
  // Navigation matching the requested modules: "Checa bien su respectiva barra de navegacion..."
  const [activeTab, setActiveTab] = useState<'monitor' | 'pos_caja' | 'clases'>('monitor');

  // ==========================================
  // --- MODULE 1: MONITOR DE ACCESOS IN TIME ---
  // ==========================================
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([
    { id: '1', name: 'Sarah Connor', email: 'sarah.c@sky.net', time: '11:15 AM', status: 'Concedido', avatarLetter: 'S' },
    { id: '2', name: 'John Connor', email: 'john.c@sky.net', time: '11:10 AM', status: 'Denegado', reason: 'Membresía Vencida', avatarLetter: 'J' },
    { id: '3', name: 'Marcus Wright', email: 'marcus@projectangel.org', time: '10:55 AM', status: 'Concedido', avatarLetter: 'M' },
    { id: '4', name: 'Kyle Reese', email: 'kyle.reese@resistance.org', time: '10:42 AM', status: 'Denegado', reason: 'Pago Pendiente', avatarLetter: 'K' },
    { id: '5', name: 'T-800 Cyberdyne', email: 'terminator@skynet.com', time: '09:12 AM', status: 'Concedido', avatarLetter: 'T' }
  ]);

  // Flash highlight for the latest incoming scan
  const [highlightedScan, setHighlightedScan] = useState<ScanLog | null>(null);

  // Quick simulation function for static QR scanning feed
  const triggerSimulationScan = () => {
    const candidates: Array<{ name: string; email: string; status: 'Concedido' | 'Denegado'; reason?: string; avatarLetter: string }> = [
      { name: 'Diana Prince', email: 'diana@themyscira.gov', status: 'Concedido', avatarLetter: 'D' },
      { name: 'Tony Stark', email: 'tony@starkindustries.com', status: 'Concedido', avatarLetter: 'T' },
      { name: 'Wanda Maximoff', email: 'wanda@westview.net', status: 'Denegado', reason: 'Membresía Vencida', avatarLetter: 'W' },
      { name: 'Steve Rogers', email: 'cap@brooklyn1918.org', status: 'Concedido', avatarLetter: 'S' },
      { name: 'Bruce Banner', email: 'hulk@avengers.org', status: 'Denegado', reason: 'Acceso Denegado: Horario No Autorizado', avatarLetter: 'B' },
      { name: 'Peter Parker', email: 'spidey@dailybugle.com', status: 'Denegado', reason: 'Membresía Vencida', avatarLetter: 'P' },
      { name: user.name, email: 'socio.activo@dragongym.com', status: 'Concedido', avatarLetter: user.avatarLetter }
    ];

    const randomPick = candidates[Math.floor(Math.random() * candidates.length)];
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newLog: ScanLog = {
      id: String(Date.now()),
      ...randomPick,
      time: timeString
    };

    setScanLogs(prev => [newLog, ...prev]);
    setHighlightedScan(newLog);

    if (newLog.status === 'Concedido') {
      onTriggerNotification(`Acceso Concedido: ${newLog.name}`);
      if (newLog.name === user.name) {
        onIncrementCheckIn();
      }
    } else {
      onTriggerNotification(`Acceso Denegado: ${newLog.name} (${newLog.reason})`);
    }

    setTimeout(() => {
      setHighlightedScan(prev => prev?.id === newLog.id ? null : prev);
    }, 4000);
  };

  // ==========================================
  // --- MODULE 2: CAJA Y POS FÍSICO ---
  // ==========================================
  const [clients, setClients] = useState<ClientProfile[]>([
    { id: 'DG-1090', name: 'Sarah Connor', email: 'sarah.c@sky.net', membershipLevel: 'VIP Dragon Pass', status: 'Activo', lastCheckIn: 'Hoy, 11:15 AM' },
    { id: 'DG-2281', name: 'John Connor', email: 'john.c@sky.net', membershipLevel: 'Plan Mensual Estándar', status: 'Vencido', lastCheckIn: 'Hace 5 días' },
    { id: 'DG-3382', name: 'Marcus Wright', email: 'marcus@projectangel.org', membershipLevel: 'Plan Anual Elite', status: 'Activo', lastCheckIn: 'Hoy, 10:55 AM' },
    { id: 'DG-4512', name: 'Kyle Reese', email: 'kyle.reese@resistance.org', membershipLevel: 'Plan Mensual Estándar', status: 'Pendiente', lastCheckIn: 'Hace 12 días' },
    { id: 'DG-5555', name: 'T-800 Cyberdyne', email: 'terminator@skynet.com', membershipLevel: 'VIP Dragon Pass', status: 'Activo', lastCheckIn: 'Hoy, 09:12 AM' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);
  
  // Custom payment configs for checkout
  const [selectedMembershipToBuy, setSelectedMembershipToBuy] = useState<'Mensual' | 'Anual' | 'VIP'>('Mensual');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Terminal'>('Terminal');
  const [shiftSalesCash, setShiftSalesCash] = useState(180);
  const [shiftSalesTerminal, setShiftSalesTerminal] = useState(420);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProcessPayment = () => {
    if (!selectedClient) return;

    const prices = { Mensual: 59, Anual: 499, VIP: 120 };
    const amount = prices[selectedMembershipToBuy];

    // Update client status immediately as requested: "actualizar el estatus del socio al instante"
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

    // Add to shift drawer totals
    if (paymentMethod === 'Efectivo') {
      setShiftSalesCash(prev => prev + amount);
    } else {
      setShiftSalesTerminal(prev => prev + amount);
    }

    onTriggerNotification(`Pago de $${amount} USD cobrado con éxito. Membresía de ${selectedClient.name} reactivada.`);
    
    // Refresh local selection view
    setSelectedClient(prev => prev ? { ...prev, status: 'Activo', membershipLevel: `${selectedMembershipToBuy === 'VIP' ? 'VIP Dragon Pass' : selectedMembershipToBuy === 'Anual' ? 'Plan Anual Elite' : 'Plan Mensual Estándar'}` } : null);
  };

  // ==========================================
  // --- MODULE 3: CONTROL DE CLASES PRESENCIALES ---
  // ==========================================
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
          if (nextState) {
            onTriggerNotification(`Asistencia confirmada para ${m.name}.`);
            // Increment overall checkins if the main test user gets checked in!
            if (m.name === user.name) {
              onIncrementCheckIn();
            }
          }
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
    <div id="staff-portal" className="fixed inset-0 bg-neutral-950 z-50 flex flex-col font-sans select-none overflow-hidden">
      
      {/* HEADER SECTION */}
      <header className="shrink-0 bg-black border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-display font-black tracking-[0.2em] text-white">DRAGON RECEPCIÓN</h1>
            <p className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase">OPERADOR EN SITIO • TURNO MATUTINO</p>
          </div>
        </div>

        {/* HEADER NAVIGATION FOR DESKTOP (FULLSCREEN) */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-900/50 p-1 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'monitor' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Monitor
          </button>
          <button
            onClick={() => setActiveTab('pos_caja')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'pos_caja' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Caja / POS
          </button>
          <button
            onClick={() => setActiveTab('clases')}
            className={`py-1.5 px-3.5 text-xs font-mono uppercase font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'clases' ? 'bg-emerald-400 text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Lista Asistencia
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 transition flex items-center justify-center text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* STAFF PORTAL NAVIGATION SUITE (HIDDEN ON MOBILE/TABLET because we use bottom navigation bar) */}
      <div className="hidden shrink-0 bg-neutral-950 border-b border-neutral-900/50 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('monitor')}
          className={`flex-1 py-4 px-3 text-center text-xs font-mono tracking-wider uppercase font-bold border-b-2 transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'monitor' ? 'border-emerald-400 text-emerald-400 bg-emerald-400/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <QrCode className="w-4 h-4 shrink-0" />
          🖥️ Monitor de Accesos
        </button>
        <button
          onClick={() => setActiveTab('pos_caja')}
          className={`flex-1 py-4 px-3 text-center text-xs font-mono tracking-wider uppercase font-bold border-b-2 transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'pos_caja' ? 'border-emerald-400 text-emerald-400 bg-emerald-400/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          💵 Caja y Punto de Venta
        </button>
        <button
          onClick={() => setActiveTab('clases')}
          className={`flex-1 py-4 px-3 text-center text-xs font-mono tracking-wider uppercase font-bold border-b-2 transition flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'clases' ? 'border-emerald-400 text-emerald-400 bg-emerald-400/5' : 'border-transparent text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Users className="w-4 h-4 shrink-0" />
          🗓️ Lista de Asistencia
        </button>
      </div>

      {/* CORE WORKSTATION WRAPPER */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24 md:pb-6">
        
        {/* =========================================================================
            TAB 1: MONITOR DE ACCESOS EN TIEMPO REAL
            ========================================================================= */}
        {activeTab === 'monitor' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left side column: Static QR Scanner Simulator and instant visual warnings */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-neutral-900/30 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Simulador QR Estático</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="bg-neutral-950 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4 border border-neutral-900">
                  <div className="relative p-3 bg-white/5 rounded-2xl border border-white/10">
                    <QrCode className="w-24 h-24 text-white" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-white">Escanear Pase Digital</h4>
                    <p className="text-[10px] text-neutral-500">Un socio ha escaneado el código QR físico de la entrada del club</p>
                  </div>
                </div>

                <button
                  onClick={triggerSimulationScan}
                  className="w-full bg-emerald-400 hover:bg-emerald-350 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Simular Escaneo QR
                </button>
              </div>

              {/* Instant Alert State Card */}
              {highlightedScan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`border rounded-2xl p-5 space-y-2.5 ${
                    highlightedScan.status === 'Concedido' 
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400' 
                      : 'bg-red-950/20 border-red-500/40 text-red-400 animate-pulse'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {highlightedScan.status === 'Concedido' ? (
                      <UserCheck className="w-5 h-5" />
                    ) : (
                      <UserX className="w-5 h-5" />
                    )}
                    <span className="text-xs font-mono font-bold tracking-wider uppercase">
                      {highlightedScan.status === 'Concedido' ? 'ACCESO AUTORIZADO' : 'ACCESO DENEGADO'}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <p className="text-sm font-bold text-white">{highlightedScan.name}</p>
                    <p className="text-[10px] text-neutral-400">{highlightedScan.email}</p>
                    {highlightedScan.reason && (
                      <p className="text-xs font-semibold font-mono text-red-400 bg-red-950/40 border border-red-900/40 px-2 py-1.5 rounded-lg mt-2">
                        Razón: {highlightedScan.reason}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right side column: Live Check-in Feed */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Feed de Accesos en Tiempo Real</h3>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase animate-pulse">
                  CONEXIÓN ACTIVA
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
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-display ${
                          isConcedido ? 'bg-neutral-900 text-white border border-neutral-800' : 'bg-red-950/30 text-red-400 border border-red-900/30'
                        }`}>
                          {log.avatarLetter}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs">{log.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{log.time} • {log.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {isConcedido ? (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded font-bold uppercase">
                            Acceso Concedido
                          </span>
                        ) : (
                          <div className="text-right space-y-0.5">
                            <span className="text-[9px] font-mono text-red-400 bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded font-bold uppercase">
                              Acceso Denegado
                            </span>
                            <p className="text-[8px] text-red-400/80 font-mono italic max-w-[140px] truncate">
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
            TAB 2: CAJA Y PUNTO DE VENTA FÍSICO
            ========================================================================= */}
        {activeTab === 'pos_caja' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left side: Search registry & search box */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-neutral-900/15 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">Buscador de Socios y Clientes</h3>
                  <p className="text-[10px] text-neutral-500">Localiza rápidamente un socio para revisar su estatus de pago o realizar renovaciones</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nombre, correo, ID..."
                    className="w-full text-xs bg-neutral-950 border border-neutral-850 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              {/* Client List */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-neutral-900 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Registros Encontrados ({filteredClients.length})</span>
                </div>

                <div className="divide-y divide-neutral-900/60 max-h-[300px] overflow-y-auto no-scrollbar">
                  {filteredClients.map((c) => {
                    const isSelected = selectedClient?.id === c.id;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedClient(c)}
                        className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition ${
                          isSelected ? 'bg-emerald-500/5' : 'hover:bg-neutral-900/10'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-white">{c.name}</h4>
                            <span className="text-[9px] font-mono text-neutral-500">{c.id}</span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{c.email} • {c.membershipLevel}</p>
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
                    <div className="p-8 text-center space-y-2">
                      <Inbox className="w-8 h-8 text-neutral-600 mx-auto" />
                      <p className="text-xs text-neutral-500">Ningún socio coincide con los criterios de búsqueda</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Manual Cobro & Drawer Status */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Cobro Manual */}
              <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold block pb-2 border-b border-neutral-900">
                  Cobro Manual en Mostrador
                </span>

                {selectedClient ? (
                  <div className="space-y-4">
                    <div className="bg-neutral-950 border border-neutral-900 p-3.5 rounded-xl space-y-1">
                      <p className="text-[9px] font-mono text-neutral-500 uppercase">Socio Seleccionado</p>
                      <p className="text-xs font-semibold text-white">{selectedClient.name}</p>
                      <p className="text-[10px] text-neutral-400">{selectedClient.email} • ID: {selectedClient.id}</p>
                    </div>

                    {/* Choose membership plan */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block">Seleccionar Plan / Upgrade</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Mensual', 'Anual', 'VIP'].map((plan) => (
                          <button
                            key={plan}
                            onClick={() => setSelectedMembershipToBuy(plan as any)}
                            className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition ${
                              selectedMembershipToBuy === plan 
                                ? 'bg-emerald-400 text-black border-emerald-400' 
                                : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {plan}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Choose Payment type */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase block">Método de Cobro</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setPaymentMethod('Efectivo')}
                          className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition ${
                            paymentMethod === 'Efectivo' 
                              ? 'bg-white text-black border-white' 
                              : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                          }`}
                        >
                          Efectivo
                        </button>
                        <button
                          onClick={() => setPaymentMethod('Terminal')}
                          className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition ${
                            paymentMethod === 'Terminal' 
                              ? 'bg-white text-black border-white' 
                              : 'bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white'
                          }`}
                        >
                          Terminal Física
                        </button>
                      </div>
                    </div>

                    {/* Process checkout CTA */}
                    <button
                      onClick={handleProcessPayment}
                      className="w-full bg-emerald-400 hover:bg-emerald-350 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition"
                    >
                      Registrar y Activar Socio
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 text-xs">
                    Selecciona un socio de la lista para proceder con el cobro manual o renovación de pase.
                  </div>
                )}
              </div>

              {/* CORTE DE CAJA PARCIAL */}
              <div className="bg-neutral-900/20 border border-neutral-900 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Corte de Caja Parcial</span>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase">Cerrar Turno</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-1">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase">Efectivo Turno</p>
                    <p className="text-xl font-mono font-bold text-white">${shiftSalesCash.toLocaleString()} <span className="text-[10px] text-neutral-500">USD</span></p>
                  </div>
                  <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl space-y-1">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase">Terminal Turno</p>
                    <p className="text-xl font-mono font-bold text-white">${shiftSalesTerminal.toLocaleString()} <span className="text-[10px] text-neutral-500">USD</span></p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const total = shiftSalesCash + shiftSalesTerminal;
                    onTriggerNotification(`Cierre de caja registrado. Total declarado de $${total} USD. Turno cerrado con éxito.`);
                    setShiftSalesCash(0);
                    setShiftSalesTerminal(0);
                  }}
                  className="w-full bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-neutral-850 py-2.5 rounded-xl font-semibold text-xs transition"
                >
                  Confirmar Corte de Turno
                </button>
              </div>

            </div>

          </motion.div>
        )}

        {/* =========================================================================
            TAB 3: CONTROL DE CLASES PRESENCIALES & LISTA DE ASISTENCIA
            ========================================================================= */}
        {activeTab === 'clases' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            {/* Active Class Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-bold">
                Sesión Grupal del Día
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

            {/* Selected class recap card */}
            {activeSelectedClass && (
              <div className="bg-neutral-950 border border-neutral-900 p-4.5 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white uppercase font-display tracking-wide">{activeSelectedClass.title}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Coach: {activeSelectedClass.instructor} • Horario: {activeSelectedClass.time} • Ubicación: {activeSelectedClass.location}
                  </p>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2.5 py-0.5 rounded">
                  {activeSelectedClass.category}
                </span>
              </div>
            )}

            {/* ATHLETE ATTENDANCE LIST */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                  Lista de Reservaciones y Asistencia
                </h4>
                <span className="text-[9px] text-neutral-500 font-mono">
                  Presiona el estado para alternar asistencia
                </span>
              </div>

              <div className="space-y-2">
                {activeRoster.map((athlete, idx) => (
                  <div
                    key={idx}
                    className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center text-xs font-semibold text-white shrink-0 font-display">
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
      <footer className="shrink-0 bg-neutral-950 border-t border-neutral-900 px-6 py-4 flex justify-between items-center text-[9px] font-mono text-neutral-500 pb-20 md:pb-4">
        <span>● LIVE WORKSTATION SYNCED</span>
        <span>ID: dg-staff-8812</span>
      </footer>

      {/* PERSISTENT BOTTOM NAVIGATION BAR (Visible on mobile/tablet only) */}
      <div className="fixed bottom-0 inset-x-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-900/80 px-6 py-3 z-40 flex items-center justify-between md:hidden">
        <button
          onClick={() => setActiveTab('monitor')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'monitor' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <QrCode className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Monitor</span>
        </button>

        <button
          onClick={() => setActiveTab('pos_caja')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'pos_caja' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">POS</span>
        </button>

        <button
          onClick={() => setActiveTab('clases')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'clases' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-medium uppercase tracking-widest">Clases</span>
        </button>
      </div>
    </div>
  );
}
