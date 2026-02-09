
import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  Zap, 
  Shield, 
  Users, 
  Clock, 
  TrendingUp,
  Star,
  ShieldCheck,
  ArrowRight,
  Monitor,
  LayoutDashboard,
  Cpu,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewPresentation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewPresentation }) => {
  
  const values = [
    { 
      title: "أتمتة ذكية بالكامل", 
      desc: "Placio ليس مجرد تقويم؛ إنه المحرك الذي يدير قراراتك التسويقية والتشغيلية عبر Gemini AI.", 
      icon: Cpu, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50" 
    },
    { 
      title: "نظام تشغيل متكامل", 
      desc: "تحكم في الموظفين، الجلسات، والعملاء من لوحة قيادة واحدة مصممة للسرعة القصوى.", 
      icon: LayoutDashboard, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" 
    },
    { 
      title: "قابلية توسع لا نهائية", 
      desc: "بنية Multi-tenant تضمن لك الاستقرار مهما زاد حجم أعمالك، مع عزل بيانات فائق الأمان.", 
      icon: Globe, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 selection:bg-indigo-100 overflow-x-hidden bg-dot-pattern">
      {/* Executive Header */}
      <nav className="glass-nav h-24 flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">Placio</span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={onViewPresentation} className="hidden md:block text-sm font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Architectural View</button>
            <button onClick={onGetStarted} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200">Enter Ecosystem</button>
          </div>
        </div>
      </nav>

      {/* Strategic Hero Section */}
      <section className="pt-40 pb-20 px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-white border border-slate-100 px-6 py-2.5 rounded-full shadow-xl mb-12 animate-in slide-in-from-bottom-4 duration-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational OS v2.5 is Live</span>
          </div>
          
          <h1 className="heading-executive mb-12">
            ليس مجرد تقويم <br />
            <span className="text-indigo-600">نظام تشغيل لأعمالك.</span>
          </h1>
          
          <p className="subheading-executive mb-20">
            حوّل الفوضى التشغيلية إلى كفاءة مطلقة. Placio يدمج الذكاء الاصطناعي في صميم عملياتك اليومية لرفع الإنتاجية بنسبة تفوق 40%.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button onClick={onGetStarted} className="btn-executive bg-indigo-600 text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700">
              ابدأ التحول الآن <ArrowLeft className="w-5 h-5 ml-2 rtl-flip" />
            </button>
            <button onClick={onViewPresentation} className="btn-executive bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
              مشاهدة العرض الفني <Monitor className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <div key={i} className="presentation-card group">
                <div className={`w-20 h-20 ${v.bg} ${v.color} rounded-[24px] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <v.icon className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-6 text-slate-900 tracking-tight">{v.title}</h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  {v.desc}
                </p>
                <div className="mt-10 pt-10 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2">Learn More <ArrowRight className="w-4 h-4 rtl-flip" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Efficiency Section */}
      <section className="py-40 px-8 bg-slate-900 text-white rounded-[80px] mx-4 my-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-[900] tracking-tighter mb-8 leading-tight">الكفاءة هي <br/> المعيار الجديد.</h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                نحن لا نقدم ميزات، نحن نقدم حلاً استراتيجياً. من خلال أتمتة المهام المتكررة، نمنحك الوقت للتركيز على ما يهم حقاً: نمو عملك.
              </p>
              <div className="space-y-6">
                {[
                  "زيادة 65% في دقة المواعيد",
                  "توفير 20 ساعة عمل أسبوعياً للمدراء",
                  "تحليل فوري لأداء الموظفين"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-black">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[60px] shadow-3xl transform rotate-3 flex items-center justify-center">
                  <div className="text-center">
                     <TrendingUp className="w-32 h-32 text-white/20 mb-4 mx-auto" />
                     <p className="text-6xl font-black">+45%</p>
                     <p className="text-xs font-black uppercase tracking-[0.4em] opacity-50">Growth Index</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-40 px-8 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tight">جاهز للتحول إلى <span className="text-indigo-600">Ecosystem</span> متكامل؟</h2>
        <button onClick={onGetStarted} className="btn-executive bg-slate-900 text-white mx-auto px-16 py-6 text-lg hover:shadow-indigo-500/10">
          انضم إلى Placio اليوم
        </button>
      </section>

      {/* Executive Footer */}
      <footer className="py-20 px-8 border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-50 font-bold text-xs uppercase tracking-widest">
           <p>© 2024 Placio Operational Operating System</p>
           <div className="flex gap-10 mt-8 md:mt-0">
              <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Enterprise</a>
           </div>
        </div>
      </footer>
    </div>
  );
};
