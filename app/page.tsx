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
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ background: 'url(https://res.cloudinary.com/drxouwbms/image/upload/v1743682062/pattern_kldzo3.png)', backgroundSize: 'cover' }}>
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg overflow-hidden relative">
        {/* yellow right border */}
        <div className="absolute top-0 right-0 bottom-0 w-2 bg-yellow-500 rounded-r-3xl"></div>
        
        <div className="p-8 pt-6">
          <div className="flex justify-center mb-4">
            <div className="text-center">
              <Image 
                src="https://res.cloudinary.com/drxouwbms/image/upload/v1743507686/image_27_qtiin4.png" 
                alt="Sonatel Logo" 
                width={150} 
                height={40} 
              />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-sm font-medium mb-1">
              Bienvenue sur
            </h2>
            <h3 className="text-lg font-bold text-yellow-500">
              École du code Sonatel Academy
            </h3>
          </div>

          <h1 className="text-2xl font-bold text-gray-600 text-center mb-6">
            Se connecter
          </h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Login
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                  placeholder="Matricule ou email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200"
                  placeholder="Mot de passe"
                  required
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-sm text-yellow-500 hover:text-yellow-600 hover:underline transition-all duration-200">
                Mot de passe oublié ?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 font-medium shadow-sm hover:shadow-md"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
        
        <div className="py-3 px-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} yellow Digital Center. Tous droits réservés.
        </div>
      </div>
    </div>
  );
}