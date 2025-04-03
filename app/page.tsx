"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authAPI } from '@/lib/api';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Attempting login with:', { email, password });
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      if (response && response.accessToken) {
        // Save the token and user data to localStorage
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify({
          email: response.user.email,
          role: response.user.role,
        }));
        
        console.log('Login successful, redirecting to dashboard');
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('Login failed: Invalid response format', response);
        setError('Connexion échouée. Veuillez réessayer.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      const errorMessage = err.response?.data?.error || 
                          'Une erreur est survenue lors de la connexion';
      console.error('Error message:', errorMessage);
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50" 
         style={{ 
           background: 'url(https://res.cloudinary.com/drxouwbms/image/upload/v1743682062/pattern_kldzo3.png)',
           backgroundSize: 'cover'
         }}>
      <div className="relative max-w-md w-full mx-auto">
        {/* Yellow accent card */}
        <div className="absolute -top-3 -left-3 w-full h-full bg-yellow-500 rounded-3xl transform rotate-1 shadow-md"></div>
        
        {/* Green accent card */}
        <div className="absolute -bottom-3 -right-3 w-full h-full bg-green-500 rounded-3xl transform -rotate-1 shadow-md"></div>
        
        {/* Main white card */}
        <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden z-10 border border-gray-100">
          <div className="p-8">
            {/* Logo Header with slight gradient background */}
            <div className="flex justify-center mb-6 -mx-8 -mt-8 pt-8 pb-6 bg-gradient-to-b from-gray-50 to-white">
              <div className="text-center transform hover:scale-105 transition-transform duration-300">
                <Image 
                  src="https://res.cloudinary.com/drxouwbms/image/upload/v1743507686/image_27_qtiin4.png" 
                  alt="Sonatel Logo" 
                  width={160} 
                  height={45} 
                  className="drop-shadow-sm"
                />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-sm font-medium text-gray-600 mb-1">
                Bienvenue sur
              </h2>
              <h3 className="text-xl font-bold text-yellow-500 drop-shadow-sm">
                École du code Sonatel Academy
              </h3>
            </div>

            <h1 className="text-2xl font-bold text-gray-700 text-center mb-8">
              Se connecter
            </h1>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border-l-4 border-red-500 shadow-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Login
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 shadow-sm"
                    placeholder="Matricule ou email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 bg-gray-50 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 shadow-sm"
                    placeholder="Mot de passe"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600 hover:underline transition-all duration-200 font-medium">
                  Mot de passe oublié ?
                </a>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : 'Se connecter'}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Orange Digital Center. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}