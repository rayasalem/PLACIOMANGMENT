
import React, { useState } from 'react';
import { UserRole } from '../types';
import { LogIn, ArrowLeft, ArrowRight, ShieldCheck, User as UserIcon, Briefcase, Loader2, Zap } from 'lucide-react';
import { apiService } from '../services/apiService';

interface AuthProps {
  onLoginSuccess: (user: any) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickLogin = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // Fix: apiService.login expects two arguments (email, password)
      const user = await apiService.login(email, pass);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { name: 'Admin', email: 'admin@placio.com', pass: 'Admin@123', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'Employee', email: 'employee@placio.com', pass: 'pass123', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Customer', email: 'customer@placio.com', pass: 'pass123', icon: UserIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <button onClick={onBack} className="absolute top-10 left-10 flex items-center text-slate-500 font-bold hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-12 text-center text-white relative">
          <Zap className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
          <h1 className="text-3xl font-black tracking-tighter">Access Placio</h1>
          <p className="text-indigo-100 font-medium">Select a role to enter the dashboard</p>
        </div>

        <div className="p-10 space-y-4">
          {error && <p className="text-red-500 text-center font-bold">{error}</p>}
          <div className="grid grid-cols-1 gap-3">
            {demoAccounts.map((acc) => (
              <button 
                key={acc.email}
                onClick={() => quickLogin(acc.email, acc.pass)}
                disabled={loading}
                className={`flex items-center gap-4 p-5 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group ${acc.bg}`}
              >
                <div className={`p-3 rounded-2xl bg-white shadow-sm ${acc.color}`}>
                  <acc.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-800">{acc.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{acc.email}</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-slate-500" />
              </button>
            ))}
          </div>
          {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-indigo-600" /></div>}
        </div>
      </div>
    </div>
  );
};
