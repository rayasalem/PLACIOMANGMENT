
import React from 'react';
import { Product, User } from '../types';
import { Trash2, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '../services/apiService';

interface AdminProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  users: User[];
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, setProducts, users }) => {
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await apiService.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === 'Approved' ? 'Pending' : 'Approved';
    try {
      await apiService.patch(`/products/${product.id}/status`, { status: newStatus });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Platform Moderation</h2>
          <p className="text-slate-500">Global product management and safety controls.</p>
        </div>
        <div className="flex gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100 items-center">
          <ShieldAlert className="text-indigo-600 w-5 h-5" />
          <span className="text-indigo-600 font-bold text-sm">Active Moderation Mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map(p => (
          <div key={p.id} className={`bg-white p-6 rounded-3xl border ${p.status === 'Approved' ? 'border-slate-100' : 'border-amber-100 bg-amber-50/20'} shadow-sm flex items-center justify-between group transition-all`}>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img src={p.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" />
                {p.status === 'Pending' && <Clock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 w-8 h-8 opacity-80 bg-white/50 rounded-full" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-lg">{p.name}</h4>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${p.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-indigo-600 font-black">${p.price}</p>
                <p className="text-xs text-slate-400 mt-1">Store: {users.find(u => u.id === p.userId)?.storeName || 'Merchant'}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleToggleStatus(p)}
                title={p.status === 'Approved' ? 'Set to Pending' : 'Approve Product'}
                className={`p-3 rounded-xl transition-all ${p.status === 'Approved' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
              >
                {p.status === 'Approved' ? <Clock className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => handleDelete(p.id)}
                className="p-3 bg-red-50 rounded-xl text-red-500 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed">
            <p className="text-slate-400 font-bold">No products found on the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
};
