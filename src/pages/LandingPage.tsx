import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Zap, 
  BarChart3, 
  Users,
  ArrowRight,
  Play,
  Star,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  ChevronUp,
  X,
  Mail,
  User,
  Phone,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const [activeFeature, setActiveFeature] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState(''); // 'signup', 'login', 'start'
  const [userRole, setUserRole] = useState(''); // 'admin', 'employee'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [expertForm, setExpertForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [authForm, setAuthForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company: ''
  });

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  // Animation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Scroll detection for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Suivi de la souris pour les effets parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Rotation automatique des features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll functions
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Auth modal functions
  const openAuthModal = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
    setUserRole('');
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      company: ''
    });
    setUserRole('');
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleAuthFormChange = (e) => {
    const { name, value } = e.target;
    setAuthForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!authForm.firstName || !authForm.lastName || !authForm.email || !authForm.password || !userRole) {
      setSubmitError('Veuillez remplir tous les champs obligatoires et choisir votre rôle');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authForm.email)) {
      setSubmitError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulation d'envoi des données - En production, vous devriez envoyer vers votre backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirection selon le rôle
      if (userRole === 'admin') {
        navigate('/dashboard');
      } else if (userRole === 'employee') {
        navigate('/employee-dashboard');
      }
      
      closeAuthModal();
    } catch (error) {
      setSubmitError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Expert modal functions
  const openExpertModal = () => {
    setShowExpertModal(true);
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const closeExpertModal = () => {
    setShowExpertModal(false);
    setExpertForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleExpertFormChange = (e) => {
    const { name, value } = e.target;
    setExpertForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendEmail = async (formData) => {
    // Simulation d'envoi d'email - En production, vous devriez utiliser un service comme EmailJS ou un backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation réussie
        console.log('Email envoyé à ivankamguem135@gmail.com avec les données:', formData);
        resolve({ success: true });
      }, 2000);
    });
  };

  const handleExpertFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!expertForm.firstName || !expertForm.lastName || !expertForm.email || !expertForm.subject) {
      setSubmitError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(expertForm.email)) {
      setSubmitError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Préparation des données pour l'email
      const emailData = {
        to: 'ivankamguem135@gmail.com',
        subject: `Nouvelle demande d'expert - ${expertForm.subject}`,
        html: `
          <h2>Nouvelle demande de contact d'un expert</h2>
          <p><strong>Nom:</strong> ${expertForm.lastName}</p>
          <p><strong>Prénom:</strong> ${expertForm.firstName}</p>
          <p><strong>Email:</strong> ${expertForm.email}</p>
          <p><strong>Téléphone:</strong> ${expertForm.phone || 'Non renseigné'}</p>
          <p><strong>Objet:</strong> ${expertForm.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${expertForm.message || 'Aucun message supplémentaire'}</p>
          <hr>
          <p><em>Message envoyé depuis la page de contact du site</em></p>
        `
      };

      await sendEmail(emailData);
      setSubmitSuccess(true);
      
      // Fermer le modal après 3 secondes
      setTimeout(() => {
        closeExpertModal();
      }, 3000);

    } catch (error) {
      setSubmitError('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <CheckCircle2 className="h-8 w-8" />,
      title: "Gestion des Tâches",
      description: "Créez, attribuez et suivez des tâches avec plusieurs vues: liste, Kanban, calendrier et diagramme de Gantt.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      stats: "98% plus efficace"
    },
    {
      icon: <LayoutDashboard className="h-8 w-8" />,
      title: "Gestion de Projets",
      description: "Organisez votre travail en projets avec des objectifs clairs, des jalons et une vue d'ensemble du portefeuille.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      stats: "3x plus rapide"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Communication",
      description: "Chat en temps réel, canaux thématiques et discussions contextuelles liées aux tâches.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      stats: "100% connecté"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Wiki & Base de Connaissances",
      description: "Créez et partagez de la documentation, des guides et organisez l'information de votre équipe.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      stats: "Savoir partagé"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Automatisation",
      description: "Automatisez les tâches répétitives avec des règles et des déclencheurs personnalisables.",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      stats: "80% automatisé"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Rapports & Analyses",
      description: "Visualisez les données clés et créez des rapports personnalisés pour suivre la performance.",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50",
      stats: "Insights précis"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Intégrations",
      description: "Connectez-vous avec vos outils préférés: calendriers, email, GitHub, CRM et plus encore.",
      color: "from-teal-500 to-blue-500",
      bgColor: "bg-teal-50",
      stats: "200+ intégrations"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Collaboration d'Équipe",
      description: "Travaillez ensemble efficacement avec des outils conçus pour la collaboration à distance ou en présentiel.",
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-50",
      stats: "Teams synchronisées"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "CEO, TechStart",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=100&h=100&fit=crop&crop=face",
      text: "Cette plateforme a révolutionné notre façon de travailler. Productivité +300%!"
    },
    {
      name: "Pierre Martin",
      role: "Chef de Projet, Innovation Corp",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      text: "Incroyable! Fini le chaos des emails et des fichiers éparpillés."
    },
    {
      name: "Sophie Laurent",
      role: "Directrice Produit, Digital Plus",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      text: "L'interface est magnifique et les fonctionnalités sont parfaites."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header 
        onLoginClick={() => openAuthModal('login')}
        onSignupClick={() => openAuthModal('signup')}
      />
      
      {/* Floating Navigation Menu */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-2 border border-white/30 shadow-2xl">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => scrollToSection(heroRef)}
              className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 tooltip"
              title="Accueil"
            >
              <div className="w-2 h-2 bg-white/60 group-hover:bg-white rounded-full transition-colors" />
            </button>
            <button 
              onClick={() => scrollToSection(featuresRef)}
              className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 tooltip"
              title="Fonctionnalités"
            >
              <div className="w-2 h-2 bg-white/60 group-hover:bg-white rounded-full transition-colors" />
            </button>
            <button 
              onClick={() => scrollToSection(testimonialsRef)}
              className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 tooltip"
              title="Témoignages"
            >
              <div className="w-2 h-2 bg-white/60 group-hover:bg-white rounded-full transition-colors" />
            </button>
            <button 
              onClick={() => scrollToSection(howItWorksRef)}
              className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 tooltip"
              title="Comment ça marche"
            >
              <div className="w-2 h-2 bg-white/60 group-hover:bg-white rounded-full transition-colors" />
            </button>
            <button 
              onClick={() => scrollToSection(ctaRef)}
              className="group p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 tooltip"
              title="Commencer"
            >
              <div className="w-2 h-2 bg-white/60 group-hover:bg-white rounded-full transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform ${
          showScrollTop ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
        aria-label="Retour en haut"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
      
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
          `
        }}
      >
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
            style={{ animationDelay: '2s' }}
          />
          <div 
            className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
            style={{ animationDelay: '4s' }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div 
              className="lg:w-1/2 text-white text-center lg:text-left"
              data-animate
              id="hero-text"
            >
              <div className={`transform transition-all duration-1000 ${isVisible['hero-text'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium">Nouvelle version 2.0 disponible</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Centralisez
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                    Tout Votre
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                    Travail d'Équipe
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed max-w-2xl">
                  Une plateforme révolutionnaire qui transforme votre productivité et 
                  <span className="text-yellow-300 font-semibold"> booste votre collaboration</span> 
                  comme jamais auparavant.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button 
                    onClick={() => openAuthModal('start')}
                    className="group relative bg-white text-purple-700 hover:text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    <span className="relative flex items-center gap-2">
                      Commencer Gratuitement
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  
                  <button className="group flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border border-white/30">
                    <div className="bg-white/20 rounded-full p-2 group-hover:bg-white/30 transition-colors">
                      <Play className="h-4 w-4 ml-0.5" />
                    </div>
                    Voir la Démo
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div className="group cursor-pointer">
                    <div className="text-3xl font-bold text-yellow-300 group-hover:scale-110 transition-transform">50k+</div>
                    <div className="text-blue-100">Équipes actives</div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="text-3xl font-bold text-green-300 group-hover:scale-110 transition-transform">99.9%</div>
                    <div className="text-blue-100">Temps de fonctionnement</div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="text-3xl font-bold text-pink-300 group-hover:scale-110 transition-transform">4.9★</div>
                    <div className="text-blue-100">Note utilisateurs</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className="lg:w-1/2 relative"
              data-animate
              id="hero-image"
            >
              <div className={`transform transition-all duration-1000 delay-300 ${isVisible['hero-image'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {/* Glassmorphism Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                  
                  {/* Mock Dashboard */}
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                      </div>
                      <div className="text-white/80 text-sm">Dashboard Pro</div>
                    </div>
                    
                    <div className="h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-4 border border-white/10">
                      <div className="h-full flex items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-white/60" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-white/10 rounded-xl border border-white/10 p-3">
                        <TrendingUp className="h-6 w-6 text-green-400 mb-2" />
                        <div className="text-white/60 text-xs">Performance</div>
                      </div>
                      <div className="h-20 bg-white/10 rounded-xl border border-white/10 p-3">
                        <Users className="h-6 w-6 text-blue-400 mb-2" />
                        <div className="text-white/60 text-xs">Équipe</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 rounded-2xl p-4 animate-bounce delay-1000">
                  <Star className="h-6 w-6 text-yellow-800" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-400 rounded-2xl p-4 animate-pulse">
                  <Shield className="h-6 w-6 text-green-800" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <button 
            onClick={() => scrollToSection(featuresRef)}
            className="flex flex-col items-center gap-2 hover:text-white transition-colors"
          >
            <span className="text-sm">Découvrir</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        id="features" 
        className="py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
        data-animate
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible['features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold">Fonctionnalités Premium</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Tout ce dont vous avez besoin
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Notre plateforme révolutionnaire offre une suite complète d'outils 
              conçus pour maximiser votre productivité et transformer votre façon de travailler.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden ${activeFeature === index ? 'ring-4 ring-purple-200 scale-105' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative z-10 ${feature.bgColor} rounded-2xl p-4 mb-6 w-fit group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}>
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 bg-gray-100 group-hover:bg-purple-100 rounded-full px-3 py-1 text-sm transition-colors">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="font-medium text-gray-700 group-hover:text-purple-700">
                      {feature.stats}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className="py-32 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Rejoignez des milliers d'équipes qui ont transformé leur productivité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-4 border-white/20"
                  />
                  <div>
                    <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-blue-200">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-blue-100 text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        ref={howItWorksRef}
        className="py-32 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Comment Ça Fonctionne
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trois étapes simples pour révolutionner votre productivité
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" />
            
            {[
              {
                step: "1",
                title: "Créez votre espace de travail",
                description: "Configurez votre environnement personnalisé et invitez votre équipe en quelques clics.",
                icon: <Users className="h-8 w-8" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "2", 
                title: "Organisez vos projets",
                description: "Structurez vos projets avec des outils visuels intuitifs et des workflows automatisés.",
                icon: <LayoutDashboard className="h-8 w-8" />,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "3",
                title: "Collaborez et progressez",
                description: "Travaillez ensemble en temps réel et suivez vos performances avec des analytics avancés.",
                icon: <TrendingUp className="h-8 w-8" />,
                color: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`w-24 h-24 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-100">
                    <span className="text-sm font-bold text-gray-700">{item.step}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-purple-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Clock className="h-5 w-5 text-yellow-300" />
              <span className="text-white font-medium">Offre limitée - 50% de réduction</span>
            </div>

            <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Prêt à transformer 
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                votre productivité?
              </span>
            </h2>
            
            <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
              Rejoignez plus de <span className="text-yellow-300 font-bold">50,000 équipes</span> qui ont révolutionné 
              leur façon de travailler avec notre plateforme.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <button 
                onClick={() => openAuthModal('signup')}
                className="group relative bg-white text-purple-700 hover:text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-xl overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <span className="relative flex items-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  Commencer Maintenant
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button 
                onClick={openExpertModal}
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 border-2 border-white/30 text-xl"
              >
                Parler à un Expert
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Sécurisé SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>4.9/5 étoiles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>50k+ utilisateurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {authType === 'signup' && 'Créer un compte'}
                  {authType === 'login' && 'Se connecter'}
                  {authType === 'start' && 'Commencer'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Rejoignez des milliers d'équipes qui collaborent efficacement
                </p>
              </div>
              <button 
                onClick={closeAuthModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-6">
              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-300">{submitError}</span>
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="firstName"
                    placeholder="Prénom *"
                    value={authForm.firstName}
                    onChange={handleAuthFormChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="lastName"
                    placeholder="Nom *"
                    value={authForm.lastName}
                    onChange={handleAuthFormChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Adresse email *"
                  value={authForm.email}
                  onChange={handleAuthFormChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Mot de passe *"
                  value={authForm.password}
                  onChange={handleAuthFormChange}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                  required
                />
              </div>

              {/* Company Field for Signup */}
              {authType === 'signup' && (
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="company"
                    placeholder="Entreprise"
                    value={authForm.company}
                    onChange={handleAuthFormChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                  />
                </div>
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Vous êtes : *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserRole('admin')}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      userRole === 'admin'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <Shield className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Administrateur</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Gérer l'équipe</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserRole('employee')}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      userRole === 'employee'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-2" />
                    <div className="font-medium">Employé</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Membre d'équipe</div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting || !userRole}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    {authType === 'signup' && 'Créer mon compte'}
                    {authType === 'login' && 'Se connecter'}
                    {authType === 'start' && 'Commencer'}
                  </>
                )}
              </button>

              {/* Footer Links */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {authType === 'signup' ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
                  <button
                    type="button"
                    onClick={() => setAuthType(authType === 'signup' ? 'login' : 'signup')}
                    className="ml-1 text-purple-600 hover:text-purple-500 font-medium"
                  >
                    {authType === 'signup' ? 'Se connecter' : 'Créer un compte'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expert Contact Modal */}
      {showExpertModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Parler à un Expert
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Notre équipe vous recontactera dans les plus brefs délais
                </p>
              </div>
              <button 
                onClick={closeExpertModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Success State */}
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Message envoyé avec succès!
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Nous avons bien reçu votre demande. Un expert vous contactera très prochainement.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Fermeture automatique dans quelques secondes...
                </div>
              </div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleExpertFormSubmit} className="space-y-6">
                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-700 dark:text-red-300">{submitError}</span>
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      name="firstName"
                      placeholder="Prénom *"
                      value={expertForm.firstName}
                      onChange={handleExpertFormChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                      required
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      name="lastName"
                      placeholder="Nom *"
                      value={expertForm.lastName}
                      onChange={handleExpertFormChange}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Adresse email *"
                    value={expertForm.email}
                    onChange={handleExpertFormChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                    required
                  />
                </div>

                {/* Phone Field */}
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Numéro de téléphone"
                    value={expertForm.phone}
                    onChange={handleExpertFormChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                  />
                </div>

                {/* Subject Field */}
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="subject"
                    placeholder="Objet de votre demande *"
                    value={expertForm.subject}
                    onChange={handleExpertFormChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base"
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="relative">
                  <FileText className="absolute left-4 top-6 h-5 w-5 text-gray-400" />
                  <textarea 
                    name="message"
                    placeholder="Décrivez votre projet ou vos besoins..."
                    value={expertForm.message}
                    onChange={handleExpertFormChange}
                    rows={4}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-base resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Envoyer ma demande
                    </>
                  )}
                </button>

                {/* Footer Note */}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  En envoyant ce formulaire, vous acceptez d'être recontacté par notre équipe.
                  <br />
                  * Champs obligatoires
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-float {
          animation: float 20s infinite ease-in-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }

        .comfortable-mode .compact-spacing {
          padding: 1rem;
        }
        
        .compact-mode .compact-spacing {
          padding: 0.5rem;
        }

        .tooltip:hover::after {
          content: attr(title);
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 10px;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;