
import React, { useState, useEffect } from 'react';
import { User, PlanType } from '../types';
import { Ban, CheckCircle, Mail, Package, Search, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/apiService';

interface AdminUsersProps {
  users: (User & { productCount?: number })[];
  setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await apiService.patch(`/admin/users/${user.id}/status`, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(u => 
    u.role !== 'ADMIN' && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Merchant Directory</h2>
          <p className="text-slate-500">Monitor and govern all active store owners.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search merchants..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">Merchant Info</th>
              <th className="px-8 py-5">Tier</th>
              <th className="px-8 py-5 text-center">Products</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-100">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-lg">{u.name}</p>
                      <p className="text-sm text-slate-400 flex items-center font-medium"><Mail className="w-3.5 h-3.5 mr-1.5" /> {u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {/* Fix: Compare tier with PlanType enum values instead of 'PRO' which does not exist in the enum */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.tier && u.tier !== PlanType.FREE ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                    {u.tier || 'FREE'}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-xl text-indigo-600 font-black text-sm">
                    <Package className="w-4 h-4" />
                    {u.productCount || 0}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${u.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-black uppercase tracking-tight ${u.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{u.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => toggleStatus(u)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${u.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md' : 'bg-green-50 text-green-600 hover:bg-green-100 hover:shadow-md'}`}
                  >
                    {u.status === 'active' ? <><Ban className="w-4 h-4" /> Suspend</> : <><CheckCircle className="w-4 h-4" /> Activate</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-bold">No merchants found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
