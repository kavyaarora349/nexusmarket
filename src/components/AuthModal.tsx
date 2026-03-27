import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, authModalView, setAuthModalView } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isAuthModalOpen) return null;

  const isLogin = authModalView === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // In some setups, you might want to tell them to check their email
      }
      setAuthModalOpen(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setAuthModalOpen(false)}
      />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-[#1a2c38] rounded-lg shadow-2xl border border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0f212e]">
          <h2 className="text-white font-bold text-lg">
            {isLogin ? 'Sign In' : 'Create an Account'}
          </h2>
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3 text-red-400 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0f212e] border border-transparent focus:border-brand-accent/50 focus:bg-[#142836] text-white rounded-md pl-10 pr-4 py-2.5 outline-none transition-all placeholder-gray-500 font-medium"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs text-brand-accent hover:text-brand-accent/80 transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0f212e] border border-transparent focus:border-brand-accent/50 focus:bg-[#142836] text-white rounded-md pl-10 pr-4 py-2.5 outline-none transition-all placeholder-gray-500 font-medium"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-accent hover:bg-brand-accent/90 text-black font-bold uppercase tracking-wider py-3 rounded-md transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Play Now' : 'Register Instantly'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm font-medium text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setAuthModalView(isLogin ? 'signup' : 'login')}
              className="text-white hover:text-brand-accent transition-colors ml-1"
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
