
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  ArrowLeft,
  LayoutDashboard,
  Zap,
  BarChart3
} from 'lucide-react';

interface PresentationProps {
  onBack: () => void;
}

export const Presentation: React.FC<PresentationProps> = ({ onBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Placio: الـ OS لأعمالك",
      subtitle: "لماذا لا يكفي مجرد تطبيق إدارة؟",
      icon: <LayoutDashboard className="w-20 h-20 text-indigo-600" />,
      content: "في عصر السرعة، التقويم التقليدي هو عبء. Placio هو 'نظام تشغيل' (Operating System) يدير تدفق البيانات، يحلل الأداء، ويتفاعل مع الموظفين والعملاء بذكاء.",
      features: ["عمارة بيانات Multi-tenant", "تكامل فوري مع Gemini AI", "بيئة عمل موحدة"]
    },
    {
      title: "تحول جذري في الكفاءة",
      subtitle: "أتمتة ما وراء الجدولة",
      icon: <BarChart3 className="w-20 h-20 text-emerald-600" />,
      content: "نحن نستخدم الذكاء الاصطناعي ليس فقط للدردشة، بل لاتخاذ قرارات تسويقية دقيقة، إنشاء أوصاف منتجات، وتوقع احتياجات العملاء قبل حدوثها.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
    },
    {
      title: "بنية تحتية للمستقبل",
      subtitle: "الأمان هو الصميم",
      icon: <Layers className="w-20 h-20 text-blue-600" />,
      content: "كل تاجر يمتلك 'جزيرة بيانات' خاصة به (Tenant-Isolation). هذا يضمن أماناً بنسبة 100% ضد تسرب البيانات وسرعة استجابة فائقة بفضل تقنيات الـ Backend الحديثة.",
      features: ["JWT Encryption", "Real-time Monitoring", "Seamless Scaling"]
    }
  ];

  const next = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[200] flex flex-col items-center justify-center p-6 font-tajawal overflow-hidden">
      <div className="absolute top-0 left-0 right-0 p-10 flex justify-between items-center text-white/30">
        <button onClick={onBack} className="flex items-center gap-3 hover:text-white transition-colors font-black uppercase tracking-[0.2em] text-xs">
          <ArrowLeft className="w-4 h-4" /> Exit Deck
        </button>
        <div className="text-[10px] font-black uppercase tracking-[0.4em]">
          Executive Brief • Placio v2.5
        </div>
      </div>

      <div className="max-w-6xl w-full bg-white rounded-[64px] shadow-[0_80px_160px_rgba(0,0,0,0.4)] overflow-hidden min-h-[75vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-700">
        <div className="w-full md:w-1/2 bg-slate-50 flex flex-col items-center justify-center p-16 border-r border-slate-100 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
          {slides[currentSlide].image ? (
            <img src={slides[currentSlide].image} className="rounded-[40px] shadow-3xl relative z-10" alt="Slide Visual" />
          ) : (
            <div className="relative z-10 p-12 bg-white rounded-[50px] shadow-2xl transform hover:scale-105 transition-transform duration-700">
              {slides[currentSlide].icon}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-16 md:p-24 flex flex-col justify-center bg-white">
          <div className="space-y-8">
            <h4 className="text-indigo-600 font-[900] uppercase tracking-[0.3em] text-[10px] flex items-center gap-4">
              <Zap className="w-4 h-4 fill-indigo-600" /> {slides[currentSlide].subtitle}
            </h4>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              {slides[currentSlide].content}
            </p>
            {slides[currentSlide].features && (
              <div className="grid grid-cols-1 gap-4 pt-10">
                {slides[currentSlide].features.map((f, i) => (
                  <div key={i} className="flex items-center gap-4 font-black text-slate-800 text-sm">
                    <div className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-20 flex items-center gap-6">
             <button onClick={prev} className="w-16 h-16 rounded-3xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900">
               <ChevronLeft className="w-8 h-8" />
             </button>
             <button onClick={next} className="flex-1 h-16 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 shadow-2xl transition-all flex items-center justify-center gap-3">
               Next Pillar <ChevronRight className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
