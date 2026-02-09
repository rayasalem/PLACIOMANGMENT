
import React, { useState } from 'react';
import { Check, Zap, Star, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { PlanType } from '../types';

interface PricingProps {
  onSelectPlan: (plan: PlanType) => void;
  currentPlan?: PlanType;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan, currentPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: PlanType.FREE,
      name: "الخطة المجانية",
      price: "0",
      description: "للأفراد والشركات الناشئة في بدايتها",
      features: [
        "حتى 5 جلسات شهرياً",
        "ملف عميل واحد",
        "موظف مسؤول واحد",
        "دعم فني عبر البريد",
      ],
      buttonText: "ابدأ مجاناً",
      color: "border-slate-200 text-slate-900",
      popular: false
    },
    {
      id: PlanType.MONTHLY,
      name: "الخطة الاحترافية",
      price: billingCycle === 'monthly' ? "29" : "23",
      description: "للشركات المتنامية التي تحتاج ميزات متقدمة",
      features: [
        "جلسات غير محدودة",
        "عدد موظفين غير محدود",
        "تحليلات أداء متقدمة",
        "تخصيص كامل للهوية",
        "دعم فني مميز 24/7",
        "أدوات الذكاء الاصطناعي",
      ],
      buttonText: "اشترك الآن",
      color: "border-indigo-600 ring-2 ring-indigo-500/20 text-slate-900",
      popular: true
    }
  ];

  return (
    <div className="py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">خطط تناسب <span className="text-indigo-600">طموحك</span></h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-10 text-lg">اختر الخطة التي تناسب حجم أعمالك، وابدأ رحلة التحول الرقمي اليوم.</p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>دفع شهري</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-16 h-8 bg-slate-100 rounded-full p-1 relative transition-colors border border-slate-200"
          >
            <div className={`w-6 h-6 bg-indigo-600 rounded-full shadow-lg transition-transform duration-300 transform ${billingCycle === 'yearly' ? '-translate-x-8' : ''}`}></div>
          </button>
          <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>دفع سنوي</span>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">توفير 20%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative bg-white p-10 rounded-[48px] border-4 transition-all hover:shadow-2xl hover:shadow-indigo-50 flex flex-col ${plan.color}`}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-10 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> الأكثر طلباً
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <p className="text-slate-400 font-medium text-sm">{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-6xl font-black tracking-tighter">${plan.price}</span>
              <span className="text-slate-400 font-bold">/شهرياً</span>
            </div>

            <div className="space-y-4 mb-12 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 font-bold text-slate-600">
                  <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <button 
              onClick={() => onSelectPlan(plan.id === PlanType.FREE ? PlanType.FREE : (billingCycle === 'yearly' ? PlanType.YEARLY : PlanType.MONTHLY))}
              disabled={currentPlan === plan.id}
              className={`w-full py-5 rounded-3xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                plan.popular 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
              } ${currentPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {currentPlan === plan.id ? 'خطتك الحالية' : plan.buttonText} <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center max-w-3xl mx-auto px-6">
        <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <ShieldCheck className="text-indigo-600 w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-slate-800">تحتاج لخطة مخصصة؟</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">للشركات الكبيرة والمؤسسات</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-indigo-600 hover:bg-slate-50 transition-all">تواصل مع المبيعات</button>
        </div>
      </div>
    </div>
  );
};
