import React, { useState } from 'react';
import { Lock, User, Key } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!onLogin(username, password)) {
      setError('Kode akses atau Username salah.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Login Sistem</h1>
          <p className="text-slate-500 mt-2 text-sm">Masukkan kode akses untuk melanjutkan</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Username / Jabatan</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Username"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Akses</label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Kode akses"
                required
              />
            </div>
          </div>
          
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};
