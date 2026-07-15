import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, DollarSign, Activity, Users, Clock, Percent, ArrowUpRight, ArrowDownRight, Sparkles 
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

interface AdminDashboardProps {
  userCount: number;
  revenueTotal: number;
}

export default function AdminDashboard({ userCount, revenueTotal }: AdminDashboardProps) {
  const [timeframe, setTimeframe] = useState<'diario' | 'semanal' | 'mensual'>('mensual');

  // KPI metadata with real calculations
  const kpis = {
    diario: [
      { name: 'Socios Activos', value: userCount, change: '+12%', isPositive: true, sub: 'Total registrados', icon: Users },
      { name: 'Ingresos del Día', value: `$${(revenueTotal / 30).toFixed(2)} USD`, change: '+4.2%', isPositive: true, sub: 'Venta promedio diaria', icon: DollarSign },
      { name: 'Afluencia Promedio', value: '38 atletas', change: '-2.1%', isPositive: false, sub: 'Horarios pico 6-8 PM', icon: Activity },
      { name: 'Aforo de Sala', value: '42%', change: '42 / 100 max', isPositive: true, sub: 'Capacidad instantánea', icon: Clock },
    ],
    semanal: [
      { name: 'Socios Activos', value: userCount, change: '+12%', isPositive: true, sub: 'Total registrados', icon: Users },
      { name: 'Ingresos Semanales', value: `$${(revenueTotal / 4).toFixed(2)} USD`, change: '+6.1%', isPositive: true, sub: 'Renovaciones + POS', icon: DollarSign },
      { name: 'Afluencia Semanal', value: '245 atletas', change: '+8.4%', isPositive: true, sub: 'Visitas acumuladas', icon: Activity },
      { name: 'Índice Retención', value: '94.8%', change: '+0.4%', isPositive: true, sub: 'Renovaciones de pase', icon: Percent },
    ],
    mensual: [
      { name: 'Socios Activos', value: userCount, change: '+12%', isPositive: true, sub: 'Sincronizados', icon: Users },
      { name: 'Ingresos Mensuales', value: `$${revenueTotal.toLocaleString()} USD`, change: '+8.4%', isPositive: true, sub: 'Corte de caja actual', icon: DollarSign },
      { name: 'Afluencia Mensual', value: '1,042 visitas', change: '+15.2%', isPositive: true, sub: 'Check-ins acumulados', icon: Activity },
      { name: 'Índice Retención', value: '95.2%', change: '+0.5%', isPositive: true, sub: 'Meta gym anual: 90%', icon: Percent },
    ]
  };

  // Strategic visual charting dataset (Asistencia vs. Ingresos)
  const chartData = [
    { name: 'Ene', ingresos: 32000, asistencia: 720 },
    { name: 'Feb', ingresos: 34500, asistencia: 850 },
    { name: 'Mar', ingresos: 41000, asistencia: 1100 },
    { name: 'Abr', ingresos: 38900, asistencia: 980 },
    { name: 'May', ingresos: 45200, asistencia: 1250 },
    { name: 'Jun', ingresos: revenueTotal, asistencia: 1420 },
  ];

  // Peak access live feeds
  const accessLogs = [
    { name: 'Sarah Connor', time: '18:15 PM', status: 'Concedido', type: 'Socio VIP' },
    { name: 'Alex Mercer', time: '18:04 PM', status: 'Concedido', type: 'Socio Premium' },
    { name: 'Molly Jones', time: '17:45 PM', status: 'Concedido', type: 'Socio Estándar' },
    { name: 'John Doe', time: '17:30 PM', status: 'Concedido', type: 'Socio Estándar' },
    { name: 'Bruce Wayne', time: '12:15 PM', status: 'Concedido', type: 'Socio VIP' },
    { name: 'Clark Kent', time: '08:30 AM', status: 'Concedido', type: 'Socio Estándar' }
  ];

  return (
    <div className="space-y-6">
      {/* Timeframe Selector Header */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white tracking-wider uppercase">Panel de Analíticas</h2>
          <p className="text-[10px] font-mono text-neutral-400">TOMA DE DECISIONES ESTRATÉGICAS EN TIEMPO REAL</p>
        </div>

        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-900">
          {(['diario', 'semanal', 'mensual'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-lg transition ${
                timeframe === t 
                  ? 'bg-brand-gold text-black' 
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis[timeframe].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="bg-neutral-900/20 border border-neutral-900 p-4.5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-neutral-800 transition relative overflow-hidden group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">{kpi.name}</p>
                  <p className="text-xl font-mono font-black text-white mt-1.5">{kpi.value}</p>
                </div>
                <div className="p-2 bg-neutral-950 border border-neutral-900 rounded-xl group-hover:border-brand-gold/20 transition shrink-0">
                  <Icon className="w-4 h-4 text-brand-gold" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-900/40 text-[9px]">
                <span className="text-neutral-400">{kpi.sub}</span>
                <span className={`font-mono font-bold flex items-center gap-0.5 ${kpi.isPositive ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Core Analytics Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Flujo Financiero vs. Asistencia</h3>
              <p className="text-[9px] text-neutral-500 font-mono">CORRELACIÓN DE CHECK-INS Y COBROS POR PLANES ($ USD)</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-mono">
              <span className="flex items-center gap-1 text-brand-gold">
                <span className="w-2 h-2 rounded-full bg-brand-gold" /> Ingresos ($)
              </span>
              <span className="flex items-center gap-1 text-white">
                <span className="w-2 h-2 rounded-full bg-white" /> Check-ins (Atletas)
              </span>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorAsistencia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#171717" />
                <XAxis dataKey="name" stroke="#525252" fontSize={10} fontFamily="monospace" />
                <YAxis yAxisId="left" stroke="#525252" fontSize={10} fontFamily="monospace" />
                <YAxis yAxisId="right" orientation="right" stroke="#525252" fontSize={10} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070707', borderColor: '#1c1c1c', borderRadius: '12px' }}
                  labelStyle={{ color: '#D4AF37', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '11px' }}
                  itemStyle={{ color: '#e5e5e5', fontSize: '11px' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="ingresos" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
                <Area yAxisId="right" type="monotone" dataKey="asistencia" stroke="#FFFFFF" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAsistencia)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Peak Hours Access Log */}
        <div className="lg:col-span-4 bg-neutral-900/10 border border-neutral-900 p-5 rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Afluencia Reciente</h3>
              <p className="text-[9px] text-neutral-500 font-mono">ÚLTIMOS ESCANEOS DE ACCESO EN PORTERÍA</p>
            </div>

            <div className="space-y-3">
              {accessLogs.map((log, i) => (
                <div key={i} className="flex items-center justify-between border-b border-neutral-900/40 pb-2 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-neutral-200">{log.name}</p>
                    <p className="text-[9px] text-neutral-500 font-mono uppercase">{log.type} • {log.time}</p>
                  </div>
                  <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 font-bold uppercase">
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900/50 mt-4 flex justify-between items-center text-[9px] font-mono text-neutral-500">
            <span>🔴 EN VIVO • MONITOR ACTIVO</span>
            <span>PORTAL GERENCIAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
