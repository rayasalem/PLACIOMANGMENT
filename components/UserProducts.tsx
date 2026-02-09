
import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Edit2, Trash2, X, Clock, CheckCircle } from 'lucide-react';

interface UserProductsProps {
  products: Product[];
  onAddProduct: (product: Partial<Product>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const UserProducts: React.FC<UserProductsProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const handleSave = () => {
    if (!editingProduct?.name || !editingProduct?.price) return alert("Please fill core fields");
    if (editingProduct?.id) {
      onUpdateProduct(editingProduct as Product);
    } else {
      onAddProduct({
        ...editingProduct,
        image: `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 100)}`
      });
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Inventory</h2>
          <p className="text-slate-500">Manage your product catalog.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct({ name: '', price: 0, category: '', description: '' }); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" /> New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden group shadow-sm relative">
            <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md ${p.status === 'Approved' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
              {p.status === 'Approved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {p.status}
            </div>
            
            <div className="h-56 relative overflow-hidden bg-slate-100">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-3 bg-white rounded-xl text-indigo-600 shadow-xl hover:scale-110 transition-transform"><Edit2 className="w-5 h-5" /></button>
                <button onClick={() => onDeleteProduct(p.id)} className="p-3 bg-white rounded-xl text-red-600 shadow-xl hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{p.category}</p>
              <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-1">{p.name}</h3>
              <p className="text-indigo-600 font-black text-xl">${p.price}</p>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold italic text-lg">Your inventory is currently empty.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-slate-900">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="text-2xl font-black">{editingProduct?.id ? 'Update Product' : 'Add Product'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500"
                  value={editingProduct?.name || ''}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Price ($)</label>
                  <input 
                    type="number"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500"
                    value={editingProduct?.price || ''}
                    onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500"
                    value={editingProduct?.category || ''}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500"
                  value={editingProduct?.description || ''}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>
            </div>
            <div className="p-10 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                {editingProduct?.id ? 'Save Changes' : 'Confirm Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
