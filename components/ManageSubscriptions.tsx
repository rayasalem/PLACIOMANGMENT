
import React, { useState, useEffect } from 'react';
import { Subscription, PlanType, SubscriptionStatus } from '../types';
import { apiService } from '../services/apiService';
import { CreditCard, Calendar, RefreshCcw, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const ManageSubscriptions: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSub();
  }, []);

  const fetchSub = async () => {
    const data = await apiService.get('/subscription');
    setSubscription(data);
    setLoading(false);
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900">إدارة الاشتراك</h2>
        <p className="text-slate-500 font-medium">تحكم في خطتك، الفواتير، وطرق الدفع.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Plan Card */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
                <span className="px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> نشط
                </span>
             </div>

             <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 bg-indigo-50 rounded-[40px] flex items-center justify-center">
                   <ShieldCheck className="w-16 h-16 text-indigo-600" />
                </div>
                <div className="flex-1 text-center md:text-right">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">خطتك الحالية</p>
                   <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
                     {subscription?.planType === PlanType.YEARLY ? 'الخطة السنوية الاحترافية' : 'الخطة الشهرية الاحترافية'}
                   </h3>
                   <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                      <div className="flex items-center gap-2 text-slate-500 font-bold">
                         <Calendar className="w-4 h-4 text-indigo-600" /> تنتهي في {subscription?.endDate}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 font-bold">
                         <CreditCard className="w-4 h-4 text-indigo-600" /> قيمة الاشتراك: ${subscription?.price}
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-12 pt-10 border-t border-slate-100 flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3">
                   <RefreshCcw className="w-4 h-4" /> ترقية الخطة
                </button>
                <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all">
                   إلغاء التجديد التلقائي
                </button>
             </div>
          </div>

          {/* Billing History */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
             <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" /> سجل الفواتير
             </h3>
             <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-indigo-100 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                           <FileText className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="font-bold text-slate-800">فاتورة رقم #PLC-2024-00{i}</p>
                           <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">بتاريخ 1 مايو 2024</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <span className="font-black text-slate-900">$29.00</span>
                        <button className="text-indigo-600 font-black text-xs uppercase tracking-widest border-b-2 border-transparent hover:border-indigo-600 transition-all pb-0.5">تحميل PDF</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Payment Methods Sidebar */}
        <div className="space-y-6">
           <div className="bg-slate-900 text-white p-8 rounded-[48px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
              <h3 className="relative z-10 text-lg font-black mb-8 flex items-center gap-2">
                 <CreditCard className="w-5 h-5 text-indigo-400" /> طريقة الدفع
              </h3>
              <div className="relative z-10 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] mb-8">
                 <div className="flex justify-between items-start mb-10">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg"></div>
                    <span className="text-xs font-black tracking-widest opacity-50">VISA</span>
                 </div>
                 <div className="text-xl font-mono tracking-[0.2em] mb-4">•••• •••• •••• 4242</div>
                 <div className="flex justify-between text-[10px] font-black uppercase opacity-50 tracking-widest">
                    <span>صاحب البطاقة</span>
                    <span>تنتهي في</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold mt-1 uppercase">
                    <span>أحمد الدوسري</span>
                    <span>12/26</span>
                 </div>
              </div>
              <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">تحديث البطاقة</button>
           </div>

           <div className="bg-amber-50 border border-amber-100 p-8 rounded-[40px] flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div>
                 <h4 className="font-black text-amber-800 text-sm mb-1">ملاحظة أمنية</h4>
                 <p className="text-amber-700 text-xs font-medium leading-relaxed">يتم معالجة جميع عمليات الدفع عبر بوابات مشفرة وآمنة وفق معايير PCI-DSS.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
