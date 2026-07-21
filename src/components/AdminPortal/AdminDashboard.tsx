import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Users, 
  Clock, 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  CreditCard, 
  Camera, 
  ShieldCheck, 
  Zap, 
  Settings, 
  Layers, 
  Send, 
  CheckCircle, 
  Calendar, 
  TrendingDown, 
  AlertCircle, 
  Wrench,
  Sliders,
  ShoppingBag,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  userCount: number;
  revenueTotal: number;
}

export default function AdminDashboard({ userCount, revenueTotal }: AdminDashboardProps) {
  // Navigation for strategic tabs
  const [subTab, setSubTab] = useState<'finanzas' | 'operatividad' | 'agente' | 'global'>('finanzas');
  const [timeframe, setTimeframe] = useState<'diario' | 'mensual'>('mensual');

  // --------------------------------------------------
  // 1. FINANZAS STATE
  // --------------------------------------------------
  const [rentCost, setRentCost] = useState<number>(7500);
  const [staffCost, setStaffCost] = useState<number>(4200);
  const [marketingCost, setMarketingCost] = useState<number>(1100);
  const [ticketAverage, setTicketAverage] = useState<number>(84.50);
  
  // Calculate expenses and utility
  const totalExpenses = rentCost + staffCost + marketingCost;
  const netUtility = Math.max(0, revenueTotal - totalExpenses);
  const profitMargin = revenueTotal > 0 ? ((netUtility / revenueTotal) * 100).toFixed(1) : '0';

  // Churn/Attrition metadata
  const churnCount = 3;
  const newMembersCount = 14;
  const churnRate = ((churnCount / (userCount || 10)) * 100).toFixed(1);

  // Shop sales volume (simulated from cash register)
  const [shopSalesVolume, setShopSalesVolume] = useState<number>(4820);

  // Chart data for daily/monthly revenues
  const monthlyRevenueData = [
    { name: 'Ene', ingresos: 32000, costo: 11000, utilidad: 21000 },
    { name: 'Feb', ingresos: 34500, costo: 12000, utilidad: 22500 },
    { name: 'Mar', ingresos: 41000, costo: 12500, utilidad: 28500 },
    { name: 'Abr', ingresos: 38900, costo: 12000, utilidad: 26900 },
    { name: 'May', ingresos: 45200, costo: 12800, utilidad: 32400 },
    { name: 'Jun', ingresos: revenueTotal, costo: totalExpenses, utilidad: netUtility },
  ];

  const dailyRevenueData = [
    { name: 'Lun', ingresos: 1200, costo: 400, utilidad: 800 },
    { name: 'Mar', ingresos: 1450, costo: 400, utilidad: 1050 },
    { name: 'Mie', ingresos: 1800, costo: 400, utilidad: 1400 },
    { name: 'Jue', ingresos: 1650, costo: 400, utilidad: 1250 },
    { name: 'Vie', ingresos: 2100, costo: 400, utilidad: 1700 },
    { name: 'Sab', ingresos: 2450, costo: 400, utilidad: 2050 },
    { name: 'Dom', ingresos: 950, costo: 400, utilidad: 550 },
  ];

  // --------------------------------------------------
  // 2. OPERATIVIDAD & CAMARAS IA STATE
  // --------------------------------------------------
  const [activeCamera, setActiveCamera] = useState<'musculacion' | 'cardio' | 'recepcion'>('musculacion');
  const [selectedZone, setSelectedZone] = useState<string>('Peso Libre');
  const [machineData, setMachineData] = useState([
    { id: 'mach-1', name: 'Caminadoras Pro T-800', category: 'Cardio', wear: 84, status: 'Requiere Lubricación', count: 1450 },
    { id: 'mach-2', name: 'Bicicletas de Spinning S3', category: 'Cardio', wear: 42, status: 'Óptimo', count: 820 },
    { id: 'mach-3', name: 'Polea Dual Multifunción', category: 'Fuerza', wear: 68, status: 'Ajuste de Cable Pendiente', count: 1100 },
    { id: 'mach-4', name: 'Prensa de Piernas inclinada', category: 'Fuerza', wear: 15, status: 'Óptimo', count: 320 },
    { id: 'mach-5', name: 'Racks de Sentadillas Dragon', category: 'Fuerza', wear: 78, status: 'Reemplazo de Topes', count: 1350 },
  ]);

  const handleMaintainMachine = (id: string, name: string) => {
    setMachineData(prev => prev.map(m => m.id === id ? { ...m, wear: 8, status: 'Óptimo (Mantenimiento Realizado)' } : m));
    // Trigger notification
    const evt = new CustomEvent('app-notification', { detail: `⚙️ Mantenimiento realizado con éxito en: ${name}. Desgaste reiniciado a 8%.` });
    window.dispatchEvent(evt);
  };

  // Computer vision zones & heatmap temperatures
  const gymZones = [
    { name: 'Peso Libre', capacity: '28 / 35', saturation: 80, temp: 'Caliente', color: 'bg-red-500/30 border-red-500 text-red-300' },
    { name: 'Área de Cardio', capacity: '14 / 25', saturation: 56, temp: 'Templado', color: 'bg-amber-500/30 border-amber-500 text-amber-300' },
    { name: 'Zona de Spinning', capacity: '2 / 20', saturation: 10, temp: 'Frío', color: 'bg-blue-500/30 border-blue-500 text-blue-300' },
    { name: 'Área Funcional / Estiramiento', capacity: '8 / 15', saturation: 53, temp: 'Templado', color: 'bg-amber-500/30 border-amber-500 text-amber-300' },
  ];

  const peakHoursData = [
    { hour: '06:00', aforo: 45 },
    { hour: '08:00', aforo: 78 },
    { hour: '10:00', aforo: 32 },
    { hour: '12:00', aforo: 25 },
    { hour: '14:00', aforo: 18 },
    { hour: '16:00', aforo: 40 },
    { hour: '18:00', aforo: 92 },
    { hour: '20:00', aforo: 85 },
    { hour: '22:00', aforo: 20 },
  ];

  // --------------------------------------------------
  // 3. AGENTE IA STATE
  // --------------------------------------------------
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [morningReport, setMorningReport] = useState<string>(() => {
    return localStorage.getItem('eqx_morning_report') || 
      `Haz clic en "Generar Reporte de IA" para iniciar el análisis profundo de Dragon Sentinel.`;
  });
  const [churnRiskClients, setChurnRiskClients] = useState([
    { id: 'DG-ATHLETE-2210', name: 'John Doe', email: 'john.doe@gmail.com', lastCheckIn: 'Hace 14 días', risk: '92%', status: 'Pendiente', campaignSent: false },
    { id: 'DG-ATHLETE-4099', name: 'Sarah Connor', email: 'sarah.connor@cyberdyne.com', lastCheckIn: 'Hace 10 días', risk: '78%', status: 'Pendiente', campaignSent: false },
    { id: 'DG-ATHLETE-4512', name: 'Kyle Reese', email: 'kyle.reese@resistance.org', lastCheckIn: 'Hace 12 días', risk: '85%', status: 'Pendiente', campaignSent: false },
  ]);

  const [campaignTemplate, setCampaignTemplate] = useState('Te extrañamos en Dragon Gym. Ven esta semana y recibe un shaker de proteína gratis en mostrador. ¡Mantén tu racha!');

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      const generated = `[DRAGON SENTINEL AUTOMATED MORNING REPORT - SECURE OPERATIONAL INSIGHTS]
Fecha de Auditoría: ${new Date().toLocaleDateString('es-MX')}
Modelo de IA: Dragon Brain v3.5-Intelligence
----------------------------------------------------------------------------------
1. MONITOREO DE ASISTENCIA Y FLUJO
- Asistencia acumulada de ayer: 142 ingresos de socios.
- Hora pico máxima: 18:00 - 20:00 con aforo al 92% de saturación en Peso Libre.
- Tiempo de permanencia promedio por socio registrado: 72 minutos.

2. SUSCRIPCIONES Y FINANZAS
- Renovaciones detectadas hoy: 3 atletas renovados en mostrador.
- Ingresos brutos mensuales consolidados: $${revenueTotal.toLocaleString()} USD.
- Gasto Operativo configurado: $${totalExpenses.toLocaleString()} USD.
- Utilidad neta de gerencia proyectada: $${netUtility.toLocaleString()} USD.
- Margen de utilidad actual: ${profitMargin}% sobre ingresos totales.

3. ALERTA CRÍTICA: RETENCIÓN DE CLIENTES (CHURN)
- Riesgo de abandono (Churn) actual: ${churnRate}% del aforo registrado.
- 3 Socios detectados con inactividad superior a 10 días lectivos:
  * John Doe (DG-ATHLETE-2210) - Riesgo Churn: 92% (Última visita: Hace 14 días)
  * Kyle Reese (DG-ATHLETE-4512) - Riesgo Churn: 85% (Última visita: Hace 12 días)
  * Sarah Connor (DG-ATHLETE-4099) - Riesgo Churn: 78% (Última visita: Hace 10 días)

RECOMENDACIÓN DE ACCIÓN: Lanzar de inmediato campaña automática de fidelización y re-engagement ofreciendo bebida isotónica de cortesía en su próximo ingreso de re-activación.`;
      
      setMorningReport(generated);
      localStorage.setItem('eqx_morning_report', generated);
      setIsGeneratingReport(false);
      
      const evt = new CustomEvent('app-notification', { detail: `✨ Reporte matutino gerencial generado por la IA Administrativa.` });
      window.dispatchEvent(evt);
    }, 2000);
  };

  const handleSendCampaign = (id: string, name: string) => {
    setChurnRiskClients(prev => prev.map(c => c.id === id ? { ...c, campaignSent: true, status: 'Campaña Enviada' } : c));
    const evt = new CustomEvent('app-notification', { detail: `📲 SMS/Email de re-engagement enviado automáticamente a ${name}.` });
    window.dispatchEvent(evt);
  };

  const handleLaunchAllCampaigns = () => {
    setChurnRiskClients(prev => prev.map(c => ({ ...c, campaignSent: true, status: 'Campaña Enviada' })));
    const evt = new CustomEvent('app-notification', { detail: `🚀 Campaña global enviada a los 3 socios en riesgo de deserción.` });
    window.dispatchEvent(evt);
  };

  // --------------------------------------------------
  // 4. GESTION GLOBAL STATE (ROLES, PERMISOS, PLANES)
  // --------------------------------------------------
  const [rolesPermissions, setRolesPermissions] = useState({
    admin: {
      name: 'Dueño / Administrador',
      desc: 'Acceso total estratégico, reportes, finanzas, IA y personal.',
      permissions: [
        { key: 'finances', label: 'Ver Reportes Financieros', enabled: true },
        { key: 'ia', label: 'Consultar Reportes IA y Cámaras', enabled: true },
        { key: 'pos', label: 'Operar Mostrador POS y Caja', enabled: true },
        { key: 'classes', label: 'Crear/Eliminar Clases', enabled: true },
        { key: 'members', label: 'Modificar Estatus de Socios', enabled: true }
      ]
    },
    recepcionista: {
      name: 'Recepcionista / Cajero',
      desc: 'Inscripción, cobro manual y control operativo diario.',
      permissions: [
        { key: 'finances', label: 'Ver Reportes Financieros', enabled: false },
        { key: 'ia', label: 'Consultar Reportes IA y Cámaras', enabled: false },
        { key: 'pos', label: 'Operar Mostrador POS y Caja', enabled: true },
        { key: 'classes', label: 'Crear/Eliminar Clases', enabled: false },
        { key: 'members', label: 'Modificar Estatus de Socios', enabled: true }
      ]
    },
    coach: {
      name: 'Coach / Instructor',
      desc: 'Carga de rutinas de socios y asistencia a clases grupales.',
      permissions: [
        { key: 'finances', label: 'Ver Reportes Financieros', enabled: false },
        { key: 'ia', label: 'Consultar Reportes IA y Cámaras', enabled: true },
        { key: 'pos', label: 'Operar Mostrador POS y Caja', enabled: false },
        { key: 'classes', label: 'Crear/Eliminar Clases', enabled: false },
        { key: 'members', label: 'Modificar Estatus de Socios', enabled: false }
      ]
    }
  });

  const handleTogglePermission = (roleKey: 'admin' | 'recepcionista' | 'coach', permIdx: number) => {
    setRolesPermissions(prev => {
      const copy = { ...prev };
      const roleCopy = { ...copy[roleKey] };
      const permsCopy = [...roleCopy.permissions];
      permsCopy[permIdx] = { ...permsCopy[permIdx], enabled: !permsCopy[permIdx].enabled };
      roleCopy.permissions = permsCopy;
      copy[roleKey] = roleCopy;
      return copy;
    });
    
    const evt = new CustomEvent('app-notification', { detail: `🛡️ Permisos de rol actualizados en caliente.` });
    window.dispatchEvent(evt);
  };

  // Membership Catalog and Prices
  const [catalogPlans, setCatalogPlans] = useState<any[]>(() => {
    const saved = localStorage.getItem('eqx_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'plan-1', name: 'Plan Mensual Estándar', price: 59, period: 'Mensual' },
      { id: 'plan-2', name: 'Plan Anual Elite', price: 499, period: 'Anual' },
      { id: 'plan-3', name: 'VIP Dragon Pass', price: 120, period: 'VIP' }
    ];
  });

  const handleUpdatePlanPrice = (id: string, newPrice: number) => {
    const updated = catalogPlans.map(p => p.id === id ? { ...p, price: Math.max(1, newPrice) } : p);
    setCatalogPlans(updated);
    localStorage.setItem('eqx_plans', JSON.stringify(updated));
    
    const planName = catalogPlans.find(p => p.id === id)?.name || 'Membresía';
    const evt = new CustomEvent('app-notification', { detail: `💰 Catálogo de precios actualizado: ${planName} fijado en $${newPrice} USD.` });
    window.dispatchEvent(evt);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Header with strategic Sub-tab selectors */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-900 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white tracking-wider uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-gold" />
            Panel de Gerencia & Inteligencia IA
          </h2>
          <p className="text-[10px] font-mono text-neutral-400">ACCESO TOTAL ADMINISTRADOR / DUEÑO DEL CLUB</p>
        </div>

        {/* SUB-TABS NAVIGATION */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-900 overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setSubTab('finanzas')}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'finanzas' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Finanzas
          </button>
          <button
            onClick={() => setSubTab('operatividad')}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'operatividad' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Cámaras & IA
          </button>
          <button
            onClick={() => setSubTab('agente')}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'agente' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Agente IA
          </button>
          <button
            onClick={() => setSubTab('global')}
            className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              subTab === 'global' ? 'bg-brand-gold text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Gestión Global
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="space-y-6"
        >
          
          {/* =========================================================================
              A. SUBTAB: FINANZAS (DASHBOARD FINANCIERO)
              ========================================================================= */}
          {subTab === 'finanzas' && (
            <div className="space-y-6">
              
              {/* Financial KPI Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-900/20 border border-neutral-900 p-4.5 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Ingresos Totales</p>
                    <p className="text-xl font-mono font-black text-white mt-1">$ {revenueTotal.toLocaleString()} USD</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900/40 text-[9px]">
                    <span className="text-neutral-400">Renovaciones + Caja</span>
                    <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +8.4%
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-900/20 border border-neutral-900 p-4.5 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Utilidad Operativa</p>
                    <p className="text-xl font-mono font-black text-brand-gold mt-1">$ {netUtility.toLocaleString()} USD</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900/40 text-[9px]">
                    <span className="text-neutral-400">Margen Neto: {profitMargin}%</span>
                    <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +12.3%
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-900/20 border border-neutral-900 p-4.5 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Tasa de Deserción (Churn)</p>
                    <p className="text-xl font-mono font-black text-white mt-1">{churnRate}%</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900/40 text-[9px]">
                    <span className="text-neutral-400">3 bajas / 14 nuevos</span>
                    <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowDownRight className="w-3.5 h-3.5" /> -1.2% Churn
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-900/20 border border-neutral-900 p-4.5 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Ticket Promedio</p>
                    <p className="text-xl font-mono font-black text-white mt-1">$ {ticketAverage.toFixed(2)} USD</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900/40 text-[9px]">
                    <span className="text-neutral-400">Tienda Física & Planes</span>
                    <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                      <ArrowUpRight className="w-3.5 h-3.5" /> +4.5%
                    </span>
                  </div>
                </div>
              </div>

              {/* Central chart area with Daily/Monthly timeframe switch */}
              <div className="bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Flujo Financiero e Ingresos del Club</h3>
                    <p className="text-[9px] text-neutral-500 font-mono">CORRELACIÓN DE INGRESOS BRUTOS, COSTOS FIJOS Y RENDIMIENTO NETO</p>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-lg border border-neutral-900">
                    <button
                      onClick={() => setTimeframe('diario')}
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-md ${timeframe === 'diario' ? 'bg-brand-gold text-black' : 'text-neutral-500'}`}
                    >
                      Diario
                    </button>
                    <button
                      onClick={() => setTimeframe('mensual')}
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-md ${timeframe === 'mensual' ? 'bg-brand-gold text-black' : 'text-neutral-500'}`}
                    >
                      Mensual
                    </button>
                  </div>
                </div>

                <div className="w-full h-64 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeframe === 'mensual' ? monthlyRevenueData : dailyRevenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIngreso" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorUtilidad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                      <XAxis dataKey="name" stroke="#525252" fontSize={10} fontFamily="monospace" />
                      <YAxis stroke="#525252" fontSize={10} fontFamily="monospace" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#070707', borderColor: '#1c1c1c', borderRadius: '12px' }}
                        labelStyle={{ color: '#D4AF37', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '11px' }}
                        itemStyle={{ color: '#e5e5e5', fontSize: '11px' }}
                      />
                      <Area type="monotone" dataKey="ingresos" name="Ingresos" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorIngreso)" />
                      <Area type="monotone" dataKey="utilidad" name="Utilidad Neta" stroke="#10B981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorUtilidad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Side Panels: Live interactive profit calculator & Shop volume */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. Interactive Rent/Staff cost slider tool for live Utility analysis */}
                <div className="lg:col-span-7 bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-gold" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Calculador Inteligente de Utilidad</h3>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono">Modifica los costos fijos y variables para auditar el margen de rendimiento bruto del club en tiempo real.</p>
                  
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Renta & Suministros Eléctricos:</span>
                        <span className="text-white font-bold">$ {rentCost.toLocaleString()} USD</span>
                      </div>
                      <input 
                        type="range" 
                        min="2000" 
                        max="15000" 
                        step="250"
                        value={rentCost} 
                        onChange={(e) => setRentCost(Number(e.target.value))}
                        className="w-full accent-brand-gold bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Nómina del Staff & Coaches:</span>
                        <span className="text-white font-bold">$ {staffCost.toLocaleString()} USD</span>
                      </div>
                      <input 
                        type="range" 
                        min="1000" 
                        max="10000" 
                        step="100"
                        value={staffCost} 
                        onChange={(e) => setStaffCost(Number(e.target.value))}
                        className="w-full accent-brand-gold bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-neutral-400">Marketing & Campañas IA:</span>
                        <span className="text-white font-bold">$ {marketingCost.toLocaleString()} USD</span>
                      </div>
                      <input 
                        type="range" 
                        min="100" 
                        max="5000" 
                        step="50"
                        value={marketingCost} 
                        onChange={(e) => setMarketingCost(Number(e.target.value))}
                        className="w-full accent-brand-gold bg-neutral-950 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="bg-black/30 border border-neutral-900 p-3 rounded-xl grid grid-cols-2 gap-3 text-center">
                    <div>
                      <p className="text-[9px] font-mono text-neutral-500 uppercase">Gastos Totales</p>
                      <p className="text-sm font-mono font-bold text-red-400">$ {totalExpenses.toLocaleString()} USD</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-neutral-500 uppercase">Margen Neto Estimado</p>
                      <p className="text-sm font-mono font-bold text-emerald-400">{profitMargin}%</p>
                    </div>
                  </div>
                </div>

                {/* 2. Shop volume metrics & average ticket analysis */}
                <div className="lg:col-span-5 bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-brand-gold" />
                        Ventas en Tienda Física
                      </h4>
                      <span className="text-[8px] font-mono text-brand-gold bg-brand-gold/10 px-1.5 py-0.5 rounded border border-brand-gold/20 font-bold uppercase">Consolidado</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-neutral-900/80">
                        <span className="text-[11px] text-neutral-400">Volumen Acumulado de Tienda</span>
                        <span className="text-sm font-mono font-bold text-white">$ {shopSalesVolume.toLocaleString()} USD</span>
                      </div>

                      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-neutral-900/80">
                        <span className="text-[11px] text-neutral-400">Transacciones Realizadas</span>
                        <span className="text-sm font-mono font-bold text-white">57 tickets</span>
                      </div>

                      <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-neutral-900/80">
                        <span className="text-[11px] text-neutral-400">Ticket Promedio Tienda</span>
                        <span className="text-sm font-mono font-bold text-white">$ 84.50 USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-900/60 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="number" 
                        value={shopSalesVolume} 
                        onChange={(e) => setShopSalesVolume(Math.max(0, Number(e.target.value)))}
                        className="w-20 text-xs bg-neutral-950 border border-neutral-850 rounded px-2 py-1 text-white font-mono text-center focus:outline-none focus:border-brand-gold/50"
                      />
                      <span className="text-[9px] font-mono text-neutral-500">Ajustar volumen</span>
                    </div>
                    <button 
                      onClick={() => setShopSalesVolume(4820)}
                      className="text-[9px] font-mono text-neutral-400 hover:text-white transition flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Restaurar
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
              B. SUBTAB: OPERATIVIDAD & CAMARAS IA (ANALITICA OPERATIVA)
              ========================================================================= */}
          {subTab === 'operatividad' && (
            <div className="space-y-6">
              
              {/* Top Operational KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-neutral-900/20 border border-neutral-900 p-4.5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase">Hora Pico del Día</p>
                    <p className="text-lg font-mono font-bold text-white">18:00 - 20:00 hrs</p>
                    <p className="text-[9px] text-neutral-400">Saturación máxima (92%)</p>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900">
                    <Clock className="w-5 h-5 text-brand-gold" />
                  </div>
                </div>

                <div className="bg-neutral-900/20 border border-neutral-900 p-4.5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase">Hora Muerta Estimada</p>
                    <p className="text-lg font-mono font-bold text-white">13:00 - 15:00 hrs</p>
                    <p className="text-[9px] text-neutral-400">Afluencia mínima (18%)</p>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900">
                    <Clock className="w-5 h-5 text-neutral-500" />
                  </div>
                </div>

                <div className="bg-neutral-900/20 border border-neutral-900 p-4.5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase">Permanencia Promedio</p>
                    <p className="text-lg font-mono font-bold text-brand-gold">72 Minutos</p>
                    <p className="text-[9px] text-neutral-400">Estadística por check-out</p>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900">
                    <Activity className="w-5 h-5 text-brand-gold animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Computer Vision Real-time Camera Feed Simulation & Heatmaps */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. Smart Camera Feed Box */}
                <div className="lg:col-span-7 bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Cámaras Inteligentes en Vivo</h3>
                    </div>
                    <div className="flex gap-1.5">
                      {['musculacion', 'cardio', 'recepcion'].map((cam) => (
                        <button
                          key={cam}
                          onClick={() => setActiveCamera(cam as any)}
                          className={`px-2 py-1 rounded text-[9px] font-mono font-bold uppercase transition ${
                            activeCamera === cam 
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                              : 'bg-black/40 border border-transparent text-neutral-500 hover:text-white'
                          }`}
                        >
                          {cam}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Camera view screen */}
                  <div className="relative aspect-video w-full rounded-xl bg-black border border-neutral-850 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
                    <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/70 pointer-events-none" />
                    
                    {/* Visual elements */}
                    <div className="flex justify-between items-start z-10 font-mono text-[9px]">
                      <span className="text-emerald-400 bg-black/60 px-2 py-1 rounded border border-emerald-500/20">
                        🔴 LIVE FEED: CAM_{activeCamera.toUpperCase()}
                      </span>
                      <span className="text-neutral-400 bg-black/60 px-2 py-1 rounded">
                        RESOLUCIÓN: 1080P • AI DETECT: ACTIVO
                      </span>
                    </div>

                    {/* Camera Feed Mock Graphic representation */}
                    <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-6">
                      <div className="relative border-2 border-dashed border-emerald-500/20 w-44 h-24 rounded-lg flex items-center justify-center">
                        <div className="absolute top-2 left-2 text-[8px] font-mono text-emerald-400 bg-emerald-950/40 px-1 rounded">HUMAN_09</div>
                        <div className="absolute bottom-2 right-2 text-[8px] font-mono text-emerald-400 font-bold bg-black px-1 rounded border border-emerald-500/30">98.2% CONF</div>
                        <div className="w-10 h-10 rounded-full border border-emerald-400/50 flex items-center justify-center bg-emerald-500/5">
                          <Users className="w-5 h-5 text-emerald-400 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400">Se detectaron <span className="text-emerald-400 font-bold">14 atletas</span> realizando entrenamiento activo.</p>
                    </div>

                    <div className="flex justify-between items-center z-10 text-[9px] font-mono text-neutral-500 bg-black/50 p-2 rounded">
                      <span>ZONA: DRAGON GYM CENTRAL</span>
                      <span>RED NEURONAL: YOLOv8_DRAGON_PRO</span>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Heatmaps Selector Grid */}
                <div className="lg:col-span-5 bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
                  <div className="pb-2 border-b border-neutral-900">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Mapas de Calor IA</h3>
                    <p className="text-[9px] text-neutral-500 font-mono">Saturación y afluencia de zonas físicas en tiempo real.</p>
                  </div>

                  <div className="space-y-2.5">
                    {gymZones.map((zone, idx) => {
                      const isSelected = selectedZone === zone.name;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedZone(zone.name)}
                          className={`p-3 rounded-xl border transition cursor-pointer flex justify-between items-center ${
                            isSelected 
                              ? 'bg-neutral-900/60 border-brand-gold' 
                              : 'bg-black border-neutral-900 hover:border-neutral-800'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{zone.name}</h4>
                              <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                                zone.temp === 'Caliente' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              }`}>
                                {zone.temp}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-neutral-400">Aforo: {zone.capacity} atletas</p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-mono font-bold text-white">{zone.saturation}%</p>
                            <p className="text-[9px] font-mono text-neutral-500">Saturación</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Machine Wear and tear maintenance log */}
              <div className="bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-brand-gold" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Uso & Desgaste Preventivo de Máquinas</h3>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400">ACTUALIZACIÓN CONTINUA POR CHECK-INS</span>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-900 text-neutral-400 font-mono text-[9px] uppercase">
                        <th className="pb-3">Equipamiento</th>
                        <th className="pb-3">Categoría</th>
                        <th className="pb-3">Check-ins Registrados</th>
                        <th className="pb-3">Nivel de Desgaste</th>
                        <th className="pb-3">Estado / Alerta</th>
                        <th className="pb-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900/60">
                      {machineData.map((m) => {
                        const isSevere = m.wear >= 70;
                        return (
                          <tr key={m.id} className="hover:bg-neutral-900/10 transition">
                            <td className="py-3 font-semibold text-white">{m.name}</td>
                            <td className="py-3 font-mono text-neutral-400">{m.category}</td>
                            <td className="py-3 font-mono text-neutral-300">{m.count} usos</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-24 bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-900">
                                  <div 
                                    className={`h-full rounded-full ${isSevere ? 'bg-red-500' : 'bg-brand-gold'}`}
                                    style={{ width: `${m.wear}%` }}
                                  />
                                </div>
                                <span className={`font-mono font-bold ${isSevere ? 'text-red-400' : 'text-neutral-200'}`}>{m.wear}%</span>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                isSevere ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleMaintainMachine(m.id, m.name)}
                                className="px-2.5 py-1 bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 text-[10px] font-mono font-bold text-brand-gold rounded hover:border-brand-gold/30 transition uppercase"
                              >
                                Realizar Ajuste
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              C. SUBTAB: AGENTE IA (IA ADMINISTRATIVA)
              ========================================================================= */}
          {subTab === 'agente' && (
            <div className="space-y-6">
              
              {/* Automated Morning Report generation console */}
              <div className="bg-neutral-900/15 border border-neutral-900 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-start md:items-center pb-2 border-b border-neutral-900 flex-col md:flex-row gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                      Recepción del Reporte Matutino Automatizado
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-mono">Consola de auditoría operacional impulsada por inteligencia Dragon Sentinel.</p>
                  </div>

                  <button
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                    className="px-4 py-2 bg-brand-gold hover:bg-brand-gold/90 text-black font-bold font-mono text-[10px] uppercase rounded-xl transition flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingReport ? 'animate-spin' : ''}`} />
                    {isGeneratingReport ? 'Auditando y Generando...' : 'Generar Reporte de IA'}
                  </button>
                </div>

                {/* Simulated AI Terminal Screen */}
                <div className="bg-black border border-neutral-850 p-4 rounded-xl min-h-[220px] font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre-wrap text-left select-text relative">
                  {isGeneratingReport ? (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-3 rounded-xl">
                      <Sparkles className="w-8 h-8 text-brand-gold animate-spin" />
                      <p className="text-xs text-brand-gold font-bold tracking-widest animate-pulse">DRAGON SENTINEL ANALIZANDO ACCESOS, SUSCRIPCIONES Y FINANZAS...</p>
                    </div>
                  ) : null}
                  {morningReport}
                </div>
              </div>

              {/* Churn preventative campaign manager for high-risk customers */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* 1. High Churn Risk clients roster */}
                <div className="lg:col-span-7 bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-400" />
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Socios en Riesgo de Deserción</h3>
                    </div>
                    <span className="text-[8px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold">ALERTA RETENCIÓN</span>
                  </div>

                  <div className="divide-y divide-neutral-900">
                    {churnRiskClients.map((client) => {
                      return (
                        <div key={client.id} className="py-3 flex justify-between items-center gap-4 text-left">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{client.name}</h4>
                              <span className="text-[8px] font-mono text-neutral-500">{client.id}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-0.5">Ausente: {client.lastCheckIn} • Churn risk: <span className="text-red-400 font-bold font-mono">{client.risk}</span></p>
                          </div>

                          <button
                            onClick={() => handleSendCampaign(client.id, client.name)}
                            disabled={client.campaignSent}
                            className={`px-3 py-1.5 rounded text-[9px] font-mono font-bold uppercase transition border ${
                              client.campaignSent 
                                ? 'bg-neutral-950 border-neutral-850 text-neutral-500 cursor-not-allowed' 
                                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400 hover:border-red-500/60'
                            }`}
                          >
                            {client.campaignSent ? 'Camp. Enviada ✔' : 'Lanzar Campaña'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleLaunchAllCampaigns}
                    className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-[10px] font-mono uppercase rounded-xl transition"
                  >
                    Ejecutar Campaña Masiva de Re-engagement
                  </button>
                </div>

                {/* 2. Interactive Template Campaign editor */}
                <div className="lg:col-span-5 bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-neutral-900">
                      <Send className="w-4 h-4 text-brand-gold" />
                      <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Campaña de Fidelización</h3>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono text-neutral-400 uppercase">Plantilla de Notificación Push & WhatsApp</label>
                      <textarea
                        value={campaignTemplate}
                        onChange={(e) => setCampaignTemplate(e.target.value)}
                        rows={3}
                        className="w-full bg-neutral-950 border border-neutral-850 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-gold/50 font-sans resize-none"
                        placeholder="Escribe el mensaje persuasivo..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900/50 mt-4 text-[9px] font-mono text-neutral-500 text-left">
                    <span>💡 Los mensajes se sincronizan automáticamente con el bot de mensajería Dragon Gym para entrega inmediata.</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =========================================================================
              D. SUBTAB: CONTROL GLOBAL (GESTION GLOBAL)
              ========================================================================= */}
          {subTab === 'global' && (
            <div className="space-y-6">
              
              {/* Role matrix configuration */}
              <div className="bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
                <div className="pb-2 border-b border-neutral-900 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-gold" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Administración de Roles, Permisos & Seguridad</h3>
                  </div>
                  <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold uppercase animate-pulse">SISTEMA SEGURO</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {(Object.keys(rolesPermissions) as Array<'admin' | 'recepcionista' | 'coach'>).map((roleKey) => {
                    const r = rolesPermissions[roleKey];
                    return (
                      <div key={roleKey} className="bg-black/40 border border-neutral-900 p-4 rounded-xl space-y-3.5 text-left">
                        <div>
                          <h4 className="text-xs font-bold text-white capitalize">{r.name}</h4>
                          <p className="text-[9px] text-neutral-500 mt-1 leading-relaxed">{r.desc}</p>
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-neutral-900/60">
                          {r.permissions.map((p, pIdx) => {
                            return (
                              <label key={p.key} className="flex items-center justify-between gap-2 text-[10px] font-mono cursor-pointer select-none">
                                <span className={p.enabled ? 'text-neutral-300' : 'text-neutral-600'}>{p.label}</span>
                                <input
                                  type="checkbox"
                                  checked={p.enabled}
                                  onChange={() => handleTogglePermission(roleKey, pIdx)}
                                  className="w-3.5 h-3.5 accent-brand-gold rounded border-neutral-800 bg-neutral-950 focus:ring-0 cursor-pointer"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Central Catalog and Prices editing synchronized with eqx_plans */}
              <div className="bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
                <div className="pb-2 border-b border-neutral-900 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand-gold" />
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Catálogo de Membresías & Tarifas</h3>
                  </div>
                  <span className="text-[9px] font-mono text-brand-gold">ACTUALIZACIÓN DIRECTA</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {catalogPlans.map((plan) => {
                    return (
                      <div key={plan.id} className="bg-black border border-neutral-850 p-4.5 rounded-xl flex flex-col justify-between space-y-4 text-left hover:border-neutral-800 transition">
                        <div className="space-y-1">
                          <span className="text-[8px] font-mono bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-850 text-neutral-400 font-bold uppercase">{plan.period}</span>
                          <h4 className="text-xs font-bold text-white pt-1">{plan.name}</h4>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-neutral-900/60">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-neutral-400">Precio Comercial:</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-mono font-bold text-brand-gold">$</span>
                              <input
                                type="number"
                                value={plan.price}
                                onChange={(e) => handleUpdatePlanPrice(plan.id, Number(e.target.value))}
                                className="w-16 bg-neutral-950 border border-neutral-850 text-xs font-mono font-bold text-brand-gold rounded p-1 text-center focus:outline-none focus:border-brand-gold/50"
                              />
                              <span className="text-[9px] font-mono text-neutral-500">USD</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                            <span>Sincronizado con Caja:</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> En Línea
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
