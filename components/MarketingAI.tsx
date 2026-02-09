import React, { useState } from 'react';
import { Sparkles, Megaphone, Copy, Check, Loader2, Wand2, Star, Zap } from 'lucide-react';
import { Language, translations } from '../translations';
import { generateMarketingSlogan } from '../services/geminiService';
import { mockProducts } from '../server/controllers/productController';

interface MarketingAIProps {
  lang: Language;
}

export const MarketingAI: React.FC<MarketingAIProps> = ({ lang }) => {
  const t = translations[lang];
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ slogan: string; socialPost: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const product = mockProducts.find(p => p.id === selectedProductId);
    if (!product) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await generateMarketingSlogan(product.name, product.description);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600/90 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 rotate-6 backdrop-blur-sm">
               <Sparkles className="w-6 h-6 text-white" />
            </div>
            {t.marketing_ai}
          </h2>
          <p className="text-slate-500 font-medium text-lg">Harness Gemini AI to architect high-conversion campaigns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="premium-card !p-10 space-y-8 backdrop-blur-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Megaphone className="w-5 h-5 text-indigo-600" /> Target Inventory
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select one product</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {mockProducts.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 group backdrop-blur-md ${
                    selectedProductId === p.id 
                    ? 'border-indigo-600 bg-white shadow-md' 
                    : 'border-white/60 bg-white/20 hover:border-indigo-200'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-white/80">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 text-start">
                    <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.category}</p>
                  </div>
                  {selectedProductId === p.id && <Check className="w-5 h-5 text-indigo-600" />}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedProductId || loading}
              className="btn-premium-primary w-full !py-5 shadow-2xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-5 h-5" /> Architect Content</>}
            </button>
          </div>
        </div>

        <div className="relative min-h-[500px]">
          {!result && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 premium-card bg-white/30 border-dashed backdrop-blur-xl">
               <div className="w-20 h-20 bg-white/60 rounded-[32px] flex items-center justify-center shadow-sm mb-6 backdrop-blur-md">
                  <Star className="w-8 h-8 text-indigo-200" />
               </div>
               <h4 className="text-xl font-bold text-slate-900">Creative Hub</h4>
               <p className="text-slate-400 font-medium text-sm mt-2 max-w-[280px]">Select an asset and let the AI generate optimized marketing copy.</p>
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 premium-card shadow-2xl backdrop-blur-2xl">
               <div className="relative mb-10">
                  <div className="w-32 h-32 bg-indigo-50/40 rounded-full animate-ping absolute -inset-0"></div>
                  <div className="w-32 h-32 bg-indigo-600/90 rounded-[40px] flex items-center justify-center relative z-10 shadow-2xl rotate-12 animate-pulse backdrop-blur-sm">
                     <Sparkles className="w-14 h-14 text-white" />
                  </div>
               </div>
               <h4 className="text-2xl font-black text-slate-900 tracking-tighter">Architecting...</h4>
               <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Gemini 3 Flash Pro is composing</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in zoom-in-95 duration-700">
              <div className="premium-card !p-10 relative overflow-hidden group backdrop-blur-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Zap className="w-32 h-32 text-indigo-600" />
                </div>
                <h4 className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-4">Strategic Slogan</h4>
                <p className="text-2xl font-black text-slate-900 leading-tight mb-8">"{result.slogan}"</p>
                <button 
                  onClick={() => copyToClipboard(result.slogan)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                >
                  <Copy className="w-4 h-4" /> Copy Hook
                </button>
              </div>

              <div className="premium-card bg-slate-900/90 !p-10 shadow-2xl relative overflow-hidden group backdrop-blur-xl border border-white/10">
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4 relative z-10">Social Copy</h4>
                <p className="text-base text-slate-100 font-medium leading-relaxed mb-8 relative z-10 opacity-90">
                  {result.socialPost}
                </p>
                <div className="flex justify-between items-center relative z-10">
                   <div className="flex gap-2.5">
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-rose-500 rounded-full opacity-50"></div>
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full opacity-30"></div>
                   </div>
                   <button 
                    onClick={() => copyToClipboard(result.socialPost)}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all border border-white/5 backdrop-blur-md"
                  >
                    {copied ? <><Check className="w-4 h-4 text-emerald-400" /> Success</> : <><Copy className="w-4 h-4" /> Copy Post</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};