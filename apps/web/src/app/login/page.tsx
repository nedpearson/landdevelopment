'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Map, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Left Pane - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 border-r border-slate-800 flex-col justify-center items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <div className="absolute inset-0 opacity-20 blur-3xl mix-blend-screen bg-gradient-to-tr from-amber-900/50 via-slate-900 to-teal-900/50"></div>
        
        <div className="relative z-10 text-center px-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-800 rounded-2xl shadow-2xl shadow-black/50 border border-slate-700">
              <Map className="w-16 h-16 text-amber-500" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Land Intelligence OS</h1>
          <p className="text-xl text-slate-400 max-w-lg mx-auto">
            The dual-mode operating system for Landmen, Developers, Brokers, and Investors.
          </p>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <div className="flex lg:hidden justify-center mb-6">
              <Map className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-sm text-amber-500 hover:text-amber-400">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg py-3 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account? Contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
