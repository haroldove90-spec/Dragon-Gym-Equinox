import React, { useState } from 'react';
import { FileText, Search, Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'Caja' | 'Socios' | 'Accesos' | 'Clases' | 'Inventario' | 'Suscripciones' | 'Comunicaciones' | 'Rutinas';
  severity: 'info' | 'success' | 'warning' | 'error';
}

interface AdminAuditoriaProps {
  auditLogs: AuditEntry[];
  onClearLogs: () => void;
}

export default function AdminAuditoria({ auditLogs, onClearLogs }: AdminAuditoriaProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Caja', 'Socios', 'Accesos', 'Clases', 'Inventario', 'Suscripciones', 'Comunicaciones', 'Rutinas'];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(search.toLowerCase()) || 
                          log.user.toLowerCase().includes(search.toLowerCase()) || 
                          log.timestamp.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex justify-between items-center border-b border-neutral-900 pb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-display font-bold text-white tracking-wider uppercase">Auditoría del Sistema</h2>
          <p className="text-[10px] font-mono text-neutral-400">LIBRO DE REGISTRO CRONOLÓGICO DE LOGS TÉCNICOS E INMUTABLES</p>
        </div>

        <button
          onClick={() => {
            if (confirm('¿Estás seguro de purgar todos los registros de auditoría? Esta acción es irreversible.')) {
              onClearLogs();
            }
          }}
          className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-red-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Purgar Historial</span>
        </button>
      </div>

      {/* Category Pills Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border transition shrink-0 ${
              selectedCategory === cat 
                ? 'bg-white text-black border-white' 
                : 'bg-neutral-950 border-neutral-900 text-neutral-500 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Buscar logs por acción, operador, fecha o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-neutral-900/10 border border-neutral-900 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-brand-gold font-sans"
        />
      </div>

      {/* Audit Logs Ledger */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-900 font-mono text-[10px] text-neutral-500 uppercase">
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Operador</th>
                <th className="py-3 px-4">Módulo / Misión</th>
                <th className="py-3 px-4">Acción Registrada</th>
                <th className="py-3 px-4 text-right">Estatus Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60 font-mono text-[11px]">
              {filteredLogs.map((log) => {
                let severityColor = 'text-blue-400 bg-blue-400/5 border-blue-400/10';
                let Icon = Info;

                if (log.severity === 'success') {
                  severityColor = 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10';
                  Icon = CheckCircle;
                } else if (log.severity === 'warning') {
                  severityColor = 'text-amber-500 bg-amber-500/5 border-amber-500/10';
                  Icon = AlertTriangle;
                } else if (log.severity === 'error') {
                  severityColor = 'text-red-500 bg-red-500/5 border-red-500/10';
                  Icon = AlertTriangle;
                }

                return (
                  <tr key={log.id} className="hover:bg-neutral-900/20 transition">
                    <td className="py-3 px-4 text-neutral-400 font-semibold">{log.timestamp}</td>
                    <td className="py-3 px-4 text-white font-medium">{log.user}</td>
                    <td className="py-3 px-4">
                      <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-850 text-neutral-300 font-bold uppercase tracking-wider">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-200">{log.action}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-[8px] font-bold px-2 py-0.5 rounded border uppercase ${severityColor}`}>
                        <Icon className="w-2.5 h-2.5" />
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-neutral-500 font-mono text-xs">
                    Ningún registro de auditoría coincide con los filtros establecidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
