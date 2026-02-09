
import React from 'react';
import { FinancialStats, FinancialRecord } from '../../models/FinancialRecord';
import { Language, translations } from '../../translations';
import { 
  Wallet, TrendingUp, TrendingDown, DollarSign, 
  ArrowUpRight, PieChart, Download, 
  FileText, Activity, ShieldCheck, Sparkles, Zap
} from 'lucide-react';

interface FinanceDashboardProps {
  lang: Language;
  financials?: FinancialStats;
  records: FinancialRecord[];
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ lang, financials, records }) => {
  const t = translations[lang];
  
  const stats = financials || {
    revenue: 0,
    expenses: 0,
    profit: 0,
    growth: '0%',
    productivityIndex: 0
  };

  const profitMargin = stats.revenue > 0 ? Math.round((stats.profit / stats.revenue) * 100) : 0;

  return (
    <div className="space-y-10 animate-slide-up">
      {/* Growth Intelligence Banner */}
      <div className="bg-slate-900 rounded-[48px] p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-[28px] flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
               <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
               <h2 className="text-2xl font-black tracking-tight mb-1">Growth Intelligence <span className="text-indigo-400">Active</span></h2>
               <p className="text-sm text-slate-400 font-medium">Automatic reconciliation engine is processing operational data in real-time.</p>
            </div>
         </div>
         <div className="relative z-10 flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-3xl">
            <div className="text-right">
               <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Projected Expansion</p>
               <p className="text-xl font-black">+24.5% Next Quarter</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
         </div>
      </div>

      {/* KPI Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: stats.revenue, icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: `${stats.growth} Trend` },
          { label: 'Operational Overhead', value: stats.expenses, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50', sub: 'Fixed Costs Stable' },
          { label: 'Net Profit Summary', value: stats.profit, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: `${profitMargin}% Margin Efficiency` },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm group hover:shadow-xl transition-all hover:-translate-y-1">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm`}><stat.icon className="w-7 h-7" /></div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">${stat.value.toLocaleString()}</h3>
            <p className="mt-4 text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5">
               <Zap className="w-3.5 h-3.5 text-amber-500" /> {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ledger - Zero Reconciliation Interface */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-600" /> Automated Ledger
            </h3>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Download className="w-4 h-4" /> Export Growth Report
            </button>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="premium-table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Mission Entry</th>
                    <th>Status</th>
                    <th>Audit Marker</th>
                    <th className="text-right">Settlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map(r => (
                    <tr key={r.id} className="group hover:bg-slate-50 transition-all">
                      <td>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{r.description || 'System Provision'}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${r.income > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {r.income > 0 ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified Node</span>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className={`font-black ${r.income > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {r.income > 0 ? `+$${r.income}` : `-$${r.expenses}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center opacity-30">
                        <Activity className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs">Awaiting First Financial Signal</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tactical Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <Activity className="w-6 h-6 text-indigo-600" /> Capital Velocity
          </h3>
          <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-4">
               <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance Density</p>
                  <p className="text-sm font-black text-indigo-600">92.4%</p>
               </div>
               <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full w-[92.4%] shadow-inner shadow-black/10"></div>
               </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Growth Recommendation</p>
               <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                 "Automatic reconciliation shows a 12% increase in high-ticket missions. Recommend allocating more specialist time to 'Strategic Planning' nodes."
               </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm"><TrendingUp className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Expansion</p>
                    <p className="text-base font-black text-slate-900">+ $14,200 this month</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
