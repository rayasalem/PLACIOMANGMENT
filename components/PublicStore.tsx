
import React from 'react';
import { User, Product } from '../types';
import { ShoppingCart, Share2, Search, ArrowLeft, Store, MapPin, Star, ShieldCheck } from 'lucide-react';

interface PublicStoreProps {
  merchant: User;
  products: Product[];
}

export const PublicStore: React.FC<PublicStoreProps> = ({ merchant, products }) => {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Merchant Header Section */}
      <header className="relative pt-10 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50/50 -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
            {/* Cover Decoration */}
            <div className="h-40 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 relative">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>
            
            <div className="px-10 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-16 relative z-10">
              <div className="w-40 h-40 bg-white rounded-[32px] p-2 shadow-2xl flex items-center justify-center">
                <div className="w-full h-full bg-indigo-600 text-white rounded-[24px] flex items-center justify-center text-5xl font-black shadow-inner">
                  {merchant.storeName ? merchant.storeName[0] : merchant.name[0]}
                </div>
              </div>
              
              <div className="flex-1 space-y-2 pb-2 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{merchant.storeName || merchant.name}</h1>
                  <div className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    <ShieldCheck className="w-3 h-3" /> Verified Merchant
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 font-bold text-sm">
                  <div className="flex items-center gap-1.5"><Store className="w-4 h-4" /> {merchant.category || 'General Store'}</div>
                  {merchant.location && <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {merchant.location}</div>}
                  <div className="flex items-center gap-1.5 text-amber-500"><Star className="w-4 h-4 fill-amber-500" /> 4.9 (120+ Reviews)</div>
                </div>
              </div>

              <div className="flex gap-2 pb-2">
                <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-100">
               <p className="max-w-3xl text-slate-500 font-medium leading-relaxed italic">
                 "{merchant.bio || 'Welcome to our premium digital store. We are committed to providing high-quality products and an exceptional shopping experience for our community.'}"
               </p>
            </div>
          </div>
        </div>
      </header>

      {/* Products Discovery Area */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Collections</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Discover our latest inventory</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              placeholder="Find in this store..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 ring-indigo-500 font-medium transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(p => (
            <div key={p.id} className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-indigo-100 hover:shadow-2xl transition-all duration-500">
              <div className="aspect-[4/5] relative overflow-hidden bg-slate-50">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                    {p.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center translate-y-4 group-hover:translate-y-0 duration-300">
                   <button className="px-8 py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                     <ShoppingCart className="w-4 h-4" /> Add to Cart
                   </button>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-black text-slate-900 text-lg leading-tight mb-2 line-clamp-1">{p.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-black text-indigo-600 tracking-tighter">${p.price}</p>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Available Now
                  </div>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full py-32 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
               <Store className="w-16 h-16 text-slate-200 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-slate-400">This store has no active products yet.</h3>
               <p className="text-slate-300 font-medium">Check back soon for new arrivals!</p>
            </div>
          )}
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="py-20 text-center border-t border-slate-100">
         <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">Placio</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Secure Shopping Experience</p>
      </footer>
    </div>
  );
};
