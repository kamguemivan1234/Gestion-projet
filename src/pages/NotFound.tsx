import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowLeft, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Github,
  Facebook,
  Sparkles
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar: string;
  loginDate?: string;
  registerDate?: string;
  rememberMe?: boolean;
}

interface AuthError {
  message: string;
  show: boolean;
}

interface AuthSuccess {
  title: string;
  message: string;
  show: boolean;
}

const NotFound = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError>({ message: '', show: false });
  const [success, setSuccess] = useState<AuthSuccess>({ title: '', message: '', show: false });
  const navigate = useNavigate();

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  });

  // Dark mode detection
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Floating particles effect
  useEffect(() => {
    createParticles();
  }, []);

  const createParticles = () => {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-white rounded-full opacity-60 animate-float';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 20) + 's';
        particlesContainer.appendChild(particle);
      }
    }
  };

  const saveUserData = (userData: UserData, token: string) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginTimestamp', new Date().toISOString());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const getUserData = () => {
    try {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      return {
        user: user ? JSON.parse(user) : null,
        token,
        isLoggedIn
      };
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      return { user: null, token: null, isLoggedIn: false };
    }
  };

  const checkAuthStatus = () => {
    const { user, token, isLoggedIn } = getUserData();
    if (isLoggedIn && user && token) {
      showSuccess(
        'Déjà connecté!',
        `Bonjour ${user.name}, vous êtes déjà connecté. Redirection vers le dashboard...`
      );
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const showError = (message: string) => {
    setError({ message, show: true });
    setTimeout(() => {
      setError({ message: '', show: false });
    }, 5000);
  };

  const showSuccess = (title: string, message: string) => {
    setSuccess({ title, message, show: true });
  };

  const simulateLogin = async (email: string, password: string, rememberMe: boolean): Promise<{ userData: UserData; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const token = 'jwt_token_' + Math.random().toString(36).substr(2, 9);
          const userData: UserData = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=100&h=100&fit=crop&crop=face`,
            loginDate: new Date().toISOString(),
            rememberMe
          };
          resolve({ userData, token });
        } else {
          reject(new Error('Email ou mot de passe incorrect'));
        }
      }, 2000);
    });
  };

  const simulateRegister = async (formData: typeof registerForm): Promise<{ userData: UserData; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (formData.email && formData.password.length >= 6 && formData.firstName && formData.lastName) {
          const token = 'jwt_token_' + Math.random().toString(36).substr(2, 9);
          const userData: UserData = {
            id: Math.random().toString(36).substr(2, 9),
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            firstName: formData.firstName,
            lastName: formData.lastName,
            avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=100&h=100&fit=crop&crop=face`,
            registerDate: new Date().toISOString()
          };
          resolve({ userData, token });
        } else {
          reject(new Error('Veuillez remplir tous les champs requis'));
        }
      }, 2000);
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      showError('Veuillez remplir tous les champs');
      return;
    }

    if (loginForm.password.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const { userData, token } = await simulateLogin(
        loginForm.email, 
        loginForm.password, 
        loginForm.rememberMe
      );
      saveUserData(userData, token);
      
      showSuccess(
        'Connexion réussie!',
        `Bienvenue ${userData.name}! Vous allez être redirigé vers votre dashboard.`
      );
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || 
        !registerForm.password || !registerForm.confirmPassword) {
      showError('Veuillez remplir tous les champs requis');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerForm.password.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!registerForm.acceptTerms) {
      showError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);

    try {
      const { userData, token } = await simulateRegister(registerForm);
      saveUserData(userData, token);
      
      showSuccess(
        'Compte créé avec succès!',
        `Bienvenue ${userData.name}! Votre compte a été créé et vous êtes maintenant connecté.`
      );
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div id="particles" className="absolute inset-0"></div>
      </div>

      {/* Main Container */}
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenue</h1>
            <p className="text-white/80">Connectez-vous à votre espace de travail</p>
          </div>

          {/* Auth Container */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-fadeIn">
            {/* Tab Switcher */}
            <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 ${
                  isLogin ? 'bg-white/20' : 'text-white/70 hover:text-white'
                }`}
              >
                Connexion
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 ${
                  !isLogin ? 'bg-white/20' : 'text-white/70 hover:text-white'
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input 
                      type="email" 
                      placeholder="Adresse email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-base"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input 
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-base"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-white/80">
                    <input 
                      type="checkbox" 
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      className="mr-2 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                    />
                    Se souvenir de moi
                  </label>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Mot de passe oublié?
                  </a>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-white text-purple-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                      <input 
                        type="text" 
                        placeholder="Prénom"
                        value={registerForm.firstName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-base"
                        required
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                      <input 
                        type="text" 
                        placeholder="Nom"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input 
                      type="email" 
                      placeholder="Adresse email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-base"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input 
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Mot de passe"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-base"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input 
                      type="password" 
                      placeholder="Confirmer le mot de passe"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start text-white/80 text-sm">
                    <input 
                      type="checkbox" 
                      checked={registerForm.acceptTerms}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                      className="mr-3 mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                      required
                    />
                    <span>
                      J'accepte les <a href="#" className="underline hover:text-white">conditions d'utilisation</a> et la{' '}
                      <a href="#" className="underline hover:text-white">politique de confidentialité</a>
                    </span>
                  </label>
                  
                  <label className="flex items-start text-white/80 text-sm">
                    <input 
                      type="checkbox" 
                      checked={registerForm.newsletter}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, newsletter: e.target.checked }))}
                      className="mr-3 mt-0.5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                    />
                    <span>Je souhaite recevoir les actualités produit (optionnel)</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-white text-purple-700 font-bold py-4 px-6 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    'Créer mon compte'
                  )}
                </button>
              </form>
            )}

            {/* Social Login */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/60">Ou continuer avec</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 transition-all duration-300 transform hover:scale-105">
                  <svg className="h-5 w-5 text-white mx-auto" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                
                <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 transition-all duration-300 transform hover:scale-105">
                  <Facebook className="h-5 w-5 text-white mx-auto" />
                </button>
                
                <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 transition-all duration-300 transform hover:scale-105">
                  <Github className="h-5 w-5 text-white mx-auto" />
                </button>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {success.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center animate-fadeIn">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{success.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{success.message}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 mx-auto"
            >
              <Sparkles className="h-5 w-5" />
              Accéder au Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error.show && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-2xl shadow-lg z-50 animate-slideIn">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span>{error.message}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          33% { transform: translateY(-10px) rotate(120deg); opacity: 0.8; }
          66% { transform: translateY(5px) rotate(240deg); opacity: 0.4; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-float {
          animation: float 20s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default NotFound;