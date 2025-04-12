"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authAPI } from '@/lib/api';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Réinitialiser les erreurs
    setFieldErrors({});
    setError('');
    
    // Valider le formulaire avant l'envoi
    let hasErrors = false;
    const newFieldErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newFieldErrors.email = "L'email est requis";
      hasErrors = true;
    }
    
    if (!password) {
      newFieldErrors.password = "Le mot de passe est requis";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      return;
    }
    
    try {
      setLoading(true);
      
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
      
      // Gestion structurée des erreurs venant du backend
      if (err.response?.data?.fieldErrors) {
        // Si le backend renvoie des erreurs par champ
        setFieldErrors(err.response.data.fieldErrors);
      } else if (err.response?.data?.error === 'invalid_credentials') {
        // Si le backend indique des identifiants invalides
        setError('Email ou mot de passe incorrect');
      } else if (err.response?.status === 401) {
        setError('Identifiants incorrects. Veuillez vérifier votre email et mot de passe.');
      } else if (err.response?.status === 429) {
        setError('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
      } else {
        // Erreur générique
        const errorMessage = err.response?.data?.error || 
                            'Une erreur est survenue lors de la connexion';
        console.error('Error message:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched({ ...touched, [field]: true });
    
    // Validation au blur
    if (field === 'email' && !email) {
      setFieldErrors({ ...fieldErrors, email: "L'email est requis" });
    } else if (field === 'password' && !password) {
      setFieldErrors({ ...fieldErrors, password: "Le mot de passe est requis" });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0 10px 15px rgba(241, 101, 41, 0.2)" },
    tap: { scale: 0.95 }
  };

  const orangeCardVariants = {
    initial: { rotate: 1, x: -8, y: -8 },
    animate: {
      rotate: [1, 2, 1],
      x: [-8, -9, -8],
      y: [-8, -7, -8],
      transition: { 
        duration: 6, 
        repeat: Infinity, 
        repeatType: "mirror" as const
      }
    }
  };

  const greenCardVariants = {
    initial: { rotate: -1, x: 8, y: 8 },
    animate: {
      rotate: [-1, -2, -1],
      x: [8, 9, 8],
      y: [8, 7, 8],
      transition: { 
        duration: 6, 
        repeat: Infinity, 
        repeatType: "mirror" as const,
        delay: 0.5
      }
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const errorMessageVariants = {
    initial: { opacity: 0, height: 0, marginTop: 0 },
    animate: { opacity: 1, height: "auto", marginTop: 4, transition: { duration: 0.3 } },
    exit: { opacity: 0, height: 0, marginTop: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 overflow-hidden" 
         style={{ 
           background: 'url(https://res.cloudinary.com/drxouwbms/image/upload/v1743682062/pattern_kldzo3.png)',
           backgroundSize: 'cover'
         }}>
      <motion.div 
        className="relative max-w-sm w-full mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* orange accent card with animation */}
        <motion.div 
          className="absolute -top-2 -left-2 w-full h-full bg-orange-500 rounded-2xl shadow-md"
          variants={orangeCardVariants}
          initial="initial"
          animate="animate"
        ></motion.div>
        
        {/* Green accent card with animation */}
        <motion.div 
          className="absolute -bottom-2 -right-2 w-full h-full bg-teal-500 rounded-2xl shadow-md"
          variants={greenCardVariants}
          initial="initial"
          animate="animate"
        ></motion.div>
        
        {/* Main white card */}
        <motion.div 
          className="relative bg-white rounded-2xl shadow-lg overflow-hidden z-10 border border-gray-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Logo Header with slight gradient background */}
            <motion.div 
              className="flex justify-center mb-4 -mx-6 -mt-6 pt-6 pb-4 bg-gradient-to-b from-gray-50 to-white"
              variants={itemVariants}
            >
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Image 
                  src="https://res.cloudinary.com/drxouwbms/image/upload/v1743507686/image_27_qtiin4.png" 
                  alt="Sonatel Logo" 
                  width={130} 
                  height={35} 
                  className="drop-shadow-sm"
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="text-center mb-4"
              variants={itemVariants}
            >
              <motion.h2 
                className="text-xs font-medium text-gray-600 mb-1"
                variants={fadeInUp}
              >
                Bienvenue sur
              </motion.h2>
              <motion.h3 
                className="text-lg font-bold text-orange-500 drop-shadow-sm"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                École du code Sonatel Academy
              </motion.h3>
            </motion.div>

            <motion.h1 
              className="text-xl font-bold text-gray-700 text-center mb-5"
              variants={itemVariants}
            >
              Se connecter
            </motion.h1>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs border-l-3 border-red-500 shadow-sm flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Login
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-auto">
                    <Mail size={16} className={`transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-gray-400 group-focus-within:text-orange-500'}`} />
                  </div>
                  <motion.input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email && fieldErrors.email) {
                        setFieldErrors(prev => ({...prev, email: undefined}));
                      }
                    }}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-9 pr-3 py-2 border ${fieldErrors.email ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 bg-gray-50 focus:ring-orange-200 focus:border-orange-500'} rounded-lg focus:ring-1 transition-all duration-200 text-sm shadow-sm`}
                    placeholder="Matricule ou email"
                  />
                </div>
                <AnimatePresence>
                  {fieldErrors.email && (
                    <motion.p 
                      className="text-red-500 text-xs mt-1 flex items-center"
                      variants={errorMessageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                      {fieldErrors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className={`transition-colors ${fieldErrors.password ? 'text-red-500' : 'text-gray-400 group-focus-within:text-orange-500'}`} />
                  </div>
                  <motion.input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password && fieldErrors.password) {
                        setFieldErrors(prev => ({...prev, password: undefined}));
                      }
                    }}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-9 pr-9 py-2 border ${fieldErrors.password ? 'border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 bg-gray-50 focus:ring-orange-200 focus:border-orange-500'} rounded-lg focus:ring-1 transition-all duration-200 text-sm shadow-sm`}
                    placeholder="Mot de passe"
                  />
                  <motion.button 
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </motion.button>
                </div>
                <AnimatePresence>
                  {fieldErrors.password && (
                    <motion.p 
                      className="text-red-500 text-xs mt-1 flex items-center"
                      variants={errorMessageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <AlertCircle size={12} className="mr-1 flex-shrink-0" />
                      {fieldErrors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.div 
                className="flex justify-end"
                variants={itemVariants}
              >
                <motion.a 
                  href="#" 
                  className="text-xs text-orange-500 hover:text-orange-600 hover:underline transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.05, x: 3 }}
                >
                  Mot de passe oublié ?
                </motion.a>
              </motion.div>
              
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-1 transition-all duration-200 disabled:opacity-70 font-medium text-sm shadow-md"
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : 'Se connecter'}
              </motion.button>
            </form>
            
            <motion.div 
              className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-500"
              variants={itemVariants}
            >
              © {new Date().getFullYear()} Orange Digital Center. Tous droits réservés.
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}