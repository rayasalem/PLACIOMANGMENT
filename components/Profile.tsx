
import React from 'react';
import { User } from '../types';
import { Camera, Store, Mail, MapPin, Save } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl"></div>
        <div className="absolute -bottom-12 left-8 flex items-end space-x-4">
          <div className="relative group">
            <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-indigo-600 overflow-hidden">
              {user.profileImage ? <img src={user.profileImage} /> : user.name[0]}
            </div>
            <button className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
              <Camera className="w-6 h-6" />
            </button>
          </div>
          <div className="pb-4">
            <h2 className="text-3xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500">{user.storeName || 'Merchant'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Store Identity</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-2">Store Name</label>
                <input defaultValue={user.storeName} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-2">Shop Bio</label>
                <textarea rows={4} defaultValue={user.bio} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-indigo-700 transition-colors">
                <Save className="w-5 h-5 mr-2" />
                Update Profile
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-500">Joined</span>
                <span className="text-sm font-bold text-slate-800">{user.createdAt}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-500">Tier</span>
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Premium Merchant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
