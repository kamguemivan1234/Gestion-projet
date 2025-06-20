import React, { useState, useEffect, createContext, useContext } from 'react';
import { Save, User, Bell, Lock, Globe, Palette, Database, Check, X, Eye, EyeOff, Upload, Trash2, Home, FileText, Calendar, BarChart, BookOpen, Play, Pause, RotateCcw, Award, ChevronRight, Video, Users, Target, TrendingUp } from 'lucide-react';

// Système de traductions complet avec tutoriels
const translations = {
  fr: {
    // Navigation
    dashboard: 'Tableau de bord',
    projects: 'Projets',
    tasks: 'Tâches',
    calendar: 'Calendrier',
    reports: 'Rapports',
    settings: 'Paramètres',
    
    // Paramètres
    profile: 'Profil',
    notifications: 'Notifications', 
    security: 'Sécurité',
    appearance: 'Apparence',
    language: 'Langue et Région',
    integrations: 'Intégrations',
    tutorials: 'Tutoriels',
    
    // Tutoriels
    tutorialsTitle: 'Tutoriels Interactifs',
    tutorialsSubtitle: 'Découvrez toutes les fonctionnalités de votre application de gestion de projets',
    startTutorial: 'Commencer',
    continueTutorial: 'Continuer',
    restartTutorial: 'Recommencer',
    markAsCompleted: 'Marquer comme terminé',
    tutorialCompleted: 'Terminé',
    tutorialInProgress: 'En cours',
    tutorialNotStarted: 'Non commencé',
    overallProgress: 'Progression générale',
    
    // Titres des tutoriels
    gettingStartedTitle: 'Premiers pas',
    gettingStartedDesc: 'Apprenez les bases de navigation et de configuration de votre espace de travail',
    projectManagementTitle: 'Gestion de projets',
    projectManagementDesc: 'Créez, organisez et suivez vos projets de A à Z',
    taskManagementTitle: 'Gestion des tâches',
    taskManagementDesc: 'Créez, assignez et suivez les tâches de votre équipe',
    collaborationTitle: 'Collaboration d\'équipe',
    collaborationDesc: 'Travaillez efficacement avec votre équipe et communiquez en temps réel',
    reportsAnalyticsTitle: 'Rapports et analyses',
    reportsAnalyticsDesc: 'Analysez les performances et générez des rapports détaillés',
    advancedFeaturesTitle: 'Fonctionnalités avancées',
    advancedFeaturesDesc: 'Maîtrisez les outils avancés pour optimiser votre productivité',
    
    // Étapes des tutoriels
    step: 'Étape',
    of: 'sur',
    nextStep: 'Étape suivante',
    previousStep: 'Étape précédente',
    completeTutorial: 'Terminer le tutoriel',
    
    // Profil
    profileInfo: 'Informations du Profil',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Adresse email',
    role: 'Rôle',
    department: 'Département',
    bio: 'Bio',
    changePhoto: 'Changer la photo',
    delete: 'Supprimer',
    
    // Apparence
    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    accentColor: 'Couleur d\'accent',
    interfaceDensity: 'Densité de l\'interface',
    comfortable: 'Confortable',
    compact: 'Compact',
    
    // Notifications
    notificationPrefs: 'Préférences de Notifications',
    emailNotifications: 'Par Email',
    pushNotifications: 'Notifications Push',
    comments: 'Commentaires',
    taskAssignments: 'Attributions de tâches',
    deadlines: 'Échéances',
    allActivities: 'Toutes les activités',
    mentionsOnly: 'Mentions uniquement',
    noNotifications: 'Aucune notification',
    
    // Sécurité
    changePassword: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le nouveau mot de passe',
    updatePassword: 'Mettre à jour le mot de passe',
    twoFactor: 'Authentification à deux facteurs',
    activeSessions: 'Sessions actives',
    current: 'Actuelle',
    disconnect: 'Déconnecter',
    
    // Langue
    locale: 'Langue',
    timezone: 'Fuseau horaire',
    dateFormat: 'Format de date',
    firstDayOfWeek: 'Premier jour de la semaine',
    monday: 'Lundi',
    sunday: 'Dimanche',
    
    // Général
    save: 'Enregistrer',
    cancel: 'Annuler',
    loading: 'Chargement...',
    saved: 'Enregistré !',
    error: 'Erreur',
    success: 'Succès',
    connected: 'Connecté',
    connect: 'Connecter',
    
    // Messages
    profileUpdated: 'Profil mis à jour',
    settingsUpdated: 'Paramètres mis à jour',
    passwordUpdated: 'Mot de passe mis à jour',
    
    // Contenu exemple
    welcomeMessage: 'Bienvenue dans votre espace de travail !',
    recentProjects: 'Projets récents',
    upcomingTasks: 'Tâches à venir',
    quickActions: 'Actions rapides',
    createProject: 'Créer un projet',
    addTask: 'Ajouter une tâche',
    viewReports: 'Voir les rapports'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    projects: 'Projects',
    tasks: 'Tasks',
    calendar: 'Calendar',
    reports: 'Reports',
    settings: 'Settings',
    
    // Settings
    profile: 'Profile',
    notifications: 'Notifications',
    security: 'Security',
    appearance: 'Appearance',
    language: 'Language & Region',
    integrations: 'Integrations',
    tutorials: 'Tutorials',
    
    // Tutorials
    tutorialsTitle: 'Interactive Tutorials',
    tutorialsSubtitle: 'Discover all the features of your project management application',
    startTutorial: 'Start',
    continueTutorial: 'Continue',
    restartTutorial: 'Restart',
    markAsCompleted: 'Mark as completed',
    tutorialCompleted: 'Completed',
    tutorialInProgress: 'In progress',
    tutorialNotStarted: 'Not started',
    overallProgress: 'Overall progress',
    
    // Tutorial titles
    gettingStartedTitle: 'Getting Started',
    gettingStartedDesc: 'Learn the basics of navigation and workspace configuration',
    projectManagementTitle: 'Project Management',
    projectManagementDesc: 'Create, organize and track your projects from A to Z',
    taskManagementTitle: 'Task Management',
    taskManagementDesc: 'Create, assign and track your team\'s tasks',
    collaborationTitle: 'Team Collaboration',
    collaborationDesc: 'Work efficiently with your team and communicate in real time',
    reportsAnalyticsTitle: 'Reports & Analytics',
    reportsAnalyticsDesc: 'Analyze performance and generate detailed reports',
    advancedFeaturesTitle: 'Advanced Features',
    advancedFeaturesDesc: 'Master advanced tools to optimize your productivity',
    
    // Tutorial steps
    step: 'Step',
    of: 'of',
    nextStep: 'Next step',
    previousStep: 'Previous step',
    completeTutorial: 'Complete tutorial',
    
    // Profile
    profileInfo: 'Profile Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    role: 'Role',
    department: 'Department',
    bio: 'Bio',
    changePhoto: 'Change Photo',
    delete: 'Delete',
    
    // Appearance
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    accentColor: 'Accent Color',
    interfaceDensity: 'Interface Density',
    comfortable: 'Comfortable',
    compact: 'Compact',
    
    // Notifications
    notificationPrefs: 'Notification Preferences',
    emailNotifications: 'Email',
    pushNotifications: 'Push Notifications',
    comments: 'Comments',
    taskAssignments: 'Task Assignments',
    deadlines: 'Deadlines',
    allActivities: 'All Activities',
    mentionsOnly: 'Mentions Only',
    noNotifications: 'No Notifications',
    
    // Security
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    updatePassword: 'Update Password',
    twoFactor: 'Two-Factor Authentication',
    activeSessions: 'Active Sessions',
    current: 'Current',
    disconnect: 'Disconnect',
    
    // Language
    locale: 'Language',
    timezone: 'Timezone',
    dateFormat: 'Date Format',
    firstDayOfWeek: 'First Day of Week',
    monday: 'Monday',
    sunday: 'Sunday',
    
    // General
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    saved: 'Saved!',
    error: 'Error',
    success: 'Success',
    connected: 'Connected',
    connect: 'Connect',
    
    // Messages
    profileUpdated: 'Profile Updated',
    settingsUpdated: 'Settings Updated',
    passwordUpdated: 'Password Updated',
    
    // Sample content
    welcomeMessage: 'Welcome to your workspace!',
    recentProjects: 'Recent Projects',
    upcomingTasks: 'Upcoming Tasks',
    quickActions: 'Quick Actions',
    createProject: 'Create Project',
    addTask: 'Add Task',
    viewReports: 'View Reports'
  },
  es: {
    // Navigation
    dashboard: 'Panel',
    projects: 'Proyectos',
    tasks: 'Tareas',
    calendar: 'Calendario',
    reports: 'Informes',
    settings: 'Configuración',
    
    // Settings
    profile: 'Perfil',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    appearance: 'Apariencia',
    language: 'Idioma y Región',
    integrations: 'Integraciones',
    tutorials: 'Tutoriales',
    
    // Tutorials
    tutorialsTitle: 'Tutoriales Interactivos',
    tutorialsSubtitle: 'Descubre todas las funcionalidades de tu aplicación de gestión de proyectos',
    startTutorial: 'Comenzar',
    continueTutorial: 'Continuar',
    restartTutorial: 'Reiniciar',
    markAsCompleted: 'Marcar como completado',
    tutorialCompleted: 'Completado',
    tutorialInProgress: 'En progreso',
    tutorialNotStarted: 'No iniciado',
    overallProgress: 'Progreso general',
    
    // Tutorial titles
    gettingStartedTitle: 'Primeros Pasos',
    gettingStartedDesc: 'Aprende los conceptos básicos de navegación y configuración del espacio de trabajo',
    projectManagementTitle: 'Gestión de Proyectos',
    projectManagementDesc: 'Crea, organiza y da seguimiento a tus proyectos de principio a fin',
    taskManagementTitle: 'Gestión de Tareas',
    taskManagementDesc: 'Crea, asigna y da seguimiento a las tareas de tu equipo',
    collaborationTitle: 'Colaboración en Equipo',
    collaborationDesc: 'Trabaja eficientemente con tu equipo y comunícate en tiempo real',
    reportsAnalyticsTitle: 'Informes y Análisis',
    reportsAnalyticsDesc: 'Analiza el rendimiento y genera informes detallados',
    advancedFeaturesTitle: 'Funcionalidades Avanzadas',
    advancedFeaturesDesc: 'Domina las herramientas avanzadas para optimizar tu productividad',
    
    // Tutorial steps
    step: 'Paso',
    of: 'de',
    nextStep: 'Siguiente paso',
    previousStep: 'Paso anterior',
    completeTutorial: 'Completar tutorial',
    
    // Profile
    profileInfo: 'Información del Perfil',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo Electrónico',
    role: 'Rol',
    department: 'Departamento',
    bio: 'Biografía',
    changePhoto: 'Cambiar Foto',
    delete: 'Eliminar',
    
    // Appearance
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
    accentColor: 'Color de Acento',
    interfaceDensity: 'Densidad de Interfaz',
    comfortable: 'Cómodo',
    compact: 'Compacto',
    
    // Notifications
    notificationPrefs: 'Preferencias de Notificación',
    emailNotifications: 'Por Correo',
    pushNotifications: 'Notificaciones Push',
    comments: 'Comentarios',
    taskAssignments: 'Asignaciones de Tareas',
    deadlines: 'Fechas Límite',
    allActivities: 'Todas las Actividades',
    mentionsOnly: 'Solo Menciones',
    noNotifications: 'Sin Notificaciones',
    
    // Security
    changePassword: 'Cambiar Contraseña',
    currentPassword: 'Contraseña Actual',
    newPassword: 'Nueva Contraseña',
    confirmPassword: 'Confirmar Nueva Contraseña',
    updatePassword: 'Actualizar Contraseña',
    twoFactor: 'Autenticación de Dos Factores',
    activeSessions: 'Sesiones Activas',
    current: 'Actual',
    disconnect: 'Desconectar',
    
    // Language
    locale: 'Idioma',
    timezone: 'Zona Horaria',
    dateFormat: 'Formato de Fecha',
    firstDayOfWeek: 'Primer Día de la Semana',
    monday: 'Lunes',
    sunday: 'Domingo',
    
    // General
    save: 'Guardar',
    cancel: 'Cancelar',
    loading: 'Cargando...',
    saved: '¡Guardado!',
    error: 'Error',
    success: 'Éxito',
    connected: 'Conectado',
    connect: 'Conectar',
    
    // Messages
    profileUpdated: 'Perfil Actualizado',
    settingsUpdated: 'Configuración Actualizada',
    passwordUpdated: 'Contraseña Actualizada',
    
    // Sample content
    welcomeMessage: '¡Bienvenido a tu espacio de trabajo!',
    recentProjects: 'Proyectos Recientes',
    upcomingTasks: 'Próximas Tareas',
    quickActions: 'Acciones Rápidas',
    createProject: 'Crear Proyecto',
    addTask: 'Añadir Tarea',
    viewReports: 'Ver Informes'
  }
};

// Context pour les paramètres globaux
const AppContext = createContext();

// Hook pour utiliser le contexte
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Données des tutoriels
const tutorialsData = [
  {
    id: 'getting-started',
    titleKey: 'gettingStartedTitle',
    descriptionKey: 'gettingStartedDesc',
    icon: Home,
    duration: '10 min',
    difficulty: 'Débutant',
    steps: 5,
    category: 'basics'
  },
  {
    id: 'project-management',
    titleKey: 'projectManagementTitle',
    descriptionKey: 'projectManagementDesc',
    icon: Target,
    duration: '15 min',
    difficulty: 'Intermédiaire',
    steps: 8,
    category: 'projects'
  },
  {
    id: 'task-management',
    titleKey: 'taskManagementTitle',
    descriptionKey: 'taskManagementDesc',
    icon: Check,
    duration: '12 min',
    difficulty: 'Intermédiaire',
    steps: 6,
    category: 'tasks'
  },
  {
    id: 'collaboration',
    titleKey: 'collaborationTitle',
    descriptionKey: 'collaborationDesc',
    icon: Users,
    duration: '18 min',
    difficulty: 'Intermédiaire',
    steps: 7,
    category: 'team'
  },
  {
    id: 'reports-analytics',
    titleKey: 'reportsAnalyticsTitle',
    descriptionKey: 'reportsAnalyticsDesc',
    icon: TrendingUp,
    duration: '20 min',
    difficulty: 'Avancé',
    steps: 9,
    category: 'analytics'
  },
  {
    id: 'advanced-features',
    titleKey: 'advancedFeaturesTitle',
    descriptionKey: 'advancedFeaturesDesc',
    icon: Award,
    duration: '25 min',
    difficulty: 'Avancé',
    steps: 10,
    category: 'advanced'
  }
];

// Provider pour l'application complète
const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      profile: {
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@example.com',
        role: 'Chef de Projet',
        department: 'Gestion de Projet',
        bio: 'Chef de projet avec 8 ans d\'expérience dans la gestion de projets digitaux.',
        avatar: null
      },
      notifications: {
        email: { comments: true, taskAssignments: true, deadlines: false },
        push: 'mentions'
      },
      security: {
        twoFactor: false,
        sessions: [
          { id: 1, location: 'Paris, France', device: 'Chrome sur Windows', time: 'Aujourd\'hui à 14:30', current: true },
          { id: 2, location: 'Lyon, France', device: 'Safari sur macOS', time: 'Hier à 09:15', current: false }
        ]
      },
      appearance: { theme: 'light', accentColor: 'indigo', density: 'comfortable' },
      language: { locale: 'fr', timezone: 'europe-paris', dateFormat: 'dd-mm-yyyy', firstDayOfWeek: 'monday' },
      integrations: { googleCalendar: false, slack: true, github: false, dropbox: false },
      tutorials: {
        'getting-started': { status: 'completed', progress: 100, currentStep: 5 },
        'project-management': { status: 'in-progress', progress: 60, currentStep: 5 },
        'task-management': { status: 'not-started', progress: 0, currentStep: 0 },
        'collaboration': { status: 'not-started', progress: 0, currentStep: 0 },
        'reports-analytics': { status: 'not-started', progress: 0, currentStep: 0 },
        'advanced-features': { status: 'not-started', progress: 0, currentStep: 0 }
      }
    };
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('');

  // Fonction de traduction
  const t = (key) => translations[settings.language.locale]?.[key] || key;

  // Appliquer les paramètres à l'interface
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Appliquer le thème
    const root = document.documentElement;
    root.classList.remove('dark');
    
    if (settings.appearance.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.appearance.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) root.classList.add('dark');
    }
    
    // Appliquer la couleur d'accent
    const accentColors = {
      indigo: { primary: '#4f46e5', hover: '#4338ca' },
      purple: { primary: '#7c3aed', hover: '#6d28d9' },
      pink: { primary: '#ec4899', hover: '#db2777' },
      blue: { primary: '#2563eb', hover: '#1d4ed8' },
      green: { primary: '#059669', hover: '#047857' },
      red: { primary: '#dc2626', hover: '#b91c1c' }
    };
    
    const colors = accentColors[settings.appearance.accentColor];
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.hover);
    
    // Appliquer la densité
    root.classList.remove('comfortable-mode', 'compact-mode');
    root.classList.add(`${settings.appearance.density}-mode`);
    
  }, [settings]);

  const updateSettings = (section, updates) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const showSaveStatus = (message) => {
    setSaveStatus(message);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const updateTutorialProgress = (tutorialId, updates) => {
    updateSettings('tutorials', {
      [tutorialId]: { ...settings.tutorials[tutorialId], ...updates }
    });
  };

  return (
    <AppContext.Provider value={{
      currentView, setCurrentView,
      settings, updateSettings,
      activeTab, setActiveTab,
      saveStatus, showSaveStatus,
      updateTutorialProgress,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Composant Navigation
const Navigation = () => {
  const { currentView, setCurrentView, t } = useApp();
  
  const navItems = [
    { key: 'dashboard', icon: Home, label: t('dashboard') },
    { key: 'projects', icon: FileText, label: t('projects') },
    { key: 'tasks', icon: Check, label: t('tasks') },
    { key: 'calendar', icon: Calendar, label: t('calendar') },
    { key: 'reports', icon: BarChart, label: t('reports') },
    { key: 'settings', icon: Palette, label: t('settings') }
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 min-h-screen">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-8">{t('dashboard')}</h1>
        <ul className="space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.key}>
                <button
                  onClick={() => setCurrentView(item.key)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    currentView === item.key
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{
                    backgroundColor: currentView === item.key ? 'var(--color-primary, #4f46e5)' + '20' : undefined,
                    color: currentView === item.key ? 'var(--color-primary, #4f46e5)' : undefined
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

// Composant Dashboard (exemple de contenu traduit)
const Dashboard = () => {
  const { t } = useApp();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('welcomeMessage')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('recentProjects')}</h3>
          <p className="text-gray-600 dark:text-gray-400">3 {t('projects').toLowerCase()}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('upcomingTasks')}</h3>
          <p className="text-gray-600 dark:text-gray-400">8 {t('tasks').toLowerCase()}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('quickActions')}</h3>
          <div className="space-y-2">
            <button 
              className="w-full text-left p-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-primary, #4f46e5)' }}
            >
              {t('createProject')}
            </button>
            <button 
              className="w-full text-left p-2 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              style={{ color: 'var(--color-primary, #4f46e5)' }}
            >
              {t('addTask')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Tutoriels
const TutorialsView = () => {
  const { settings, updateTutorialProgress, t } = useApp();
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  
  const getTutorialStatus = (tutorialId) => {
    return settings.tutorials[tutorialId] || { status: 'not-started', progress: 0, currentStep: 0 };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return t('tutorialCompleted');
      case 'in-progress': return t('tutorialInProgress');
      default: return t('tutorialNotStarted');
    }
  };

  const startTutorial = (tutorialId) => {
    const tutorial = tutorialsData.find(t => t.id === tutorialId);
    updateTutorialProgress(tutorialId, {
      status: 'in-progress',
      progress: 10,
      currentStep: 1
    });
    setSelectedTutorial(tutorial);
  };

  const continueTutorial = (tutorialId) => {
    const tutorial = tutorialsData.find(t => t.id === tutorialId);
    setSelectedTutorial(tutorial);
  };

  const restartTutorial = (tutorialId) => {
    updateTutorialProgress(tutorialId, {
      status: 'in-progress',
      progress: 10,
      currentStep: 1
    });
    const tutorial = tutorialsData.find(t => t.id === tutorialId);
    setSelectedTutorial(tutorial);
  };

  const markAsCompleted = (tutorialId) => {
    const tutorial = tutorialsData.find(t => t.id === tutorialId);
    updateTutorialProgress(tutorialId, {
      status: 'completed',
      progress: 100,
      currentStep: tutorial.steps
    });
  };

  const calculateOverallProgress = () => {
    const tutorialProgresses = Object.values(settings.tutorials);
    const totalProgress = tutorialProgresses.reduce((sum, tutorial) => sum + tutorial.progress, 0);
    return Math.round(totalProgress / tutorialProgresses.length);
  };

  if (selectedTutorial) {
    return (
      <TutorialPlayer 
        tutorial={selectedTutorial}
        status={getTutorialStatus(selectedTutorial.id)}
        onClose={() => setSelectedTutorial(null)}
        onUpdate={updateTutorialProgress}
        t={t}
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('tutorialsTitle')}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('tutorialsSubtitle')}</p>
        
        {/* Progression globale */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('overallProgress')}</h4>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-primary, #4f46e5)' }}>
              {calculateOverallProgress()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-500"
              style={{ 
                backgroundColor: 'var(--color-primary, #4f46e5)',
                width: `${calculateOverallProgress()}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Liste des tutoriels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutorialsData.map((tutorial) => {
          const status = getTutorialStatus(tutorial.id);
          const Icon = tutorial.icon;
          
          return (
            <div key={tutorial.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="p-3 rounded-lg mr-4"
                    style={{ backgroundColor: 'var(--color-primary, #4f46e5)' + '20' }}
                  >
                    <Icon 
                      className="h-6 w-6"
                      style={{ color: 'var(--color-primary, #4f46e5)' }}
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {t(tutorial.titleKey)}
                    </h4>
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}
                    >
                      {getStatusText(status.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t(tutorial.descriptionKey)}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{tutorial.duration}</span>
                <span>{tutorial.difficulty}</span>
                <span>{tutorial.steps} étapes</span>
              </div>
              
              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progression</span>
                  <span>{status.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: 'var(--color-primary, #4f46e5)',
                      width: `${status.progress}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                {status.status === 'not-started' && (
                  <button
                    onClick={() => startTutorial(tutorial.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--color-primary, #4f46e5)' }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {t('startTutorial')}
                  </button>
                )}
                
                {status.status === 'in-progress' && (
                  <>
                    <button
                      onClick={() => continueTutorial(tutorial.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: 'var(--color-primary, #4f46e5)' }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {t('continueTutorial')}
                    </button>
                    <button
                      onClick={() => restartTutorial(tutorial.id)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </>
                )}
                
                {status.status === 'completed' && (
                  <button
                    onClick={() => restartTutorial(tutorial.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('restartTutorial')}
                  </button>
                )}
                
                {status.status !== 'completed' && (
                  <button
                    onClick={() => markAsCompleted(tutorial.id)}
                    className="px-4 py-2 text-green-700 bg-green-100 rounded-lg font-medium hover:bg-green-200 transition-colors"
                    title={t('markAsCompleted')}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Composant Lecteur de Tutoriel
const TutorialPlayer = ({ tutorial, status, onClose, onUpdate, t }) => {
  const [currentStep, setCurrentStep] = useState(status.currentStep || 1);
  
  const nextStep = () => {
    if (currentStep < tutorial.steps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onUpdate(tutorial.id, {
        currentStep: newStep,
        progress: Math.round((newStep / tutorial.steps) * 100),
        status: newStep === tutorial.steps ? 'completed' : 'in-progress'
      });
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onUpdate(tutorial.id, {
        currentStep: newStep,
        progress: Math.round((newStep / tutorial.steps) * 100),
        status: 'in-progress'
      });
    }
  };

  const completeTutorial = () => {
    onUpdate(tutorial.id, {
      currentStep: tutorial.steps,
      progress: 100,
      status: 'completed'
    });
    onClose();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t(tutorial.titleKey)}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {t('step')} {currentStep} {t('of')} {tutorial.steps}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Barre de progression */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              backgroundColor: 'var(--color-primary, #4f46e5)',
              width: `${(currentStep / tutorial.steps) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Contenu du tutoriel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: 'var(--color-primary, #4f46e5)' + '20' }}
          >
            <Video 
              className="h-8 w-8"
              style={{ color: 'var(--color-primary, #4f46e5)' }}
            />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Étape {currentStep}: Titre de l'étape
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Description détaillée de cette étape du tutoriel avec des instructions claires 
            et des exemples pratiques pour guider l'utilisateur.
          </p>
        </div>

        {/* Placeholder pour le contenu interactif */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Contenu interactif du tutoriel (vidéo, démonstration, exercice pratique)
          </p>
        </div>
      </div>

      {/* Contrôles de navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousStep}
          disabled={currentStep === 1}
          className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
          {t('previousStep')}
        </button>

        <div className="flex gap-3">
          {currentStep === tutorial.steps ? (
            <button
              onClick={completeTutorial}
              className="inline-flex items-center px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-primary, #4f46e5)' }}
            >
              <Check className="h-4 w-4 mr-2" />
              {t('completeTutorial')}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="inline-flex items-center px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-primary, #4f46e5)' }}
            >
              {t('nextStep')}
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant Paramètres (version mise à jour avec tutoriels)
const SettingsView = () => {
  const { settings, updateSettings, activeTab, setActiveTab, saveStatus, showSaveStatus, t } = useApp();
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (field, value) => {
    updateSettings('profile', { [field]: value });
    showSaveStatus(t('profileUpdated'));
  };

  const handleAppearanceChange = (setting, value) => {
    updateSettings('appearance', { [setting]: value });
    showSaveStatus(t('settingsUpdated'));
  };

  const handleLanguageChange = (setting, value) => {
    updateSettings('language', { [setting]: value });
    showSaveStatus(t('settingsUpdated'));
  };

  const handleNotificationChange = (type, subtype, value) => {
    if (type === 'push') {
      updateSettings('notifications', { push: value });
    } else {
      updateSettings('notifications', { [type]: { ...settings.notifications[type], [subtype]: value } });
    }
    showSaveStatus(t('settingsUpdated'));
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setPasswordForm({ current: '', new: '', confirm: '' });
      setLoading(false);
      showSaveStatus(t('passwordUpdated'));
    }, 1000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tutorials':
        return <TutorialsView />;
        
      case 'profile':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{t('profileInfo')}</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('firstName')}
                  </label>
                  <input
                    type="text"
                    value={settings.profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    style={{ borderColor: 'var(--color-primary, #4f46e5)' }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('lastName')}
                  </label>
                  <input
                    type="text"
                    value={settings.profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    style={{ borderColor: 'var(--color-primary, #4f46e5)' }}
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    style={{ borderColor: 'var(--color-primary, #4f46e5)' }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('role')}
                  </label>
                  <input
                    type="text"
                    value={settings.profile.role}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                    className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    style={{ borderColor: 'var(--color-primary, #4f46e5)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'appearance':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{t('appearance')}</h3>
            
            <div className="space-y-6">
              <fieldset>
                <legend className="text-base font-medium text-gray-900 dark:text-white">{t('theme')}</legend>
                <div className="mt-4 space-y-4">
                  {[
                    { value: 'light', label: t('light') },
                    { value: 'dark', label: t('dark') },
                    { value: 'system', label: t('system') }
                  ].map((theme) => (
                    <div key={theme.value} className="flex items-center">
                      <input
                        id={`theme-${theme.value}`}
                        name="theme"
                        type="radio"
                        checked={settings.appearance.theme === theme.value}
                        onChange={() => handleAppearanceChange('theme', theme.value)}
                        className="h-4 w-4 border-gray-300"
                        style={{ accentColor: 'var(--color-primary, #4f46e5)' }}
                      />
                      <label htmlFor={`theme-${theme.value}`} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {theme.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('accentColor')}</h4>
                <div className="mt-4 grid grid-cols-6 gap-4">
                  {[
                    { color: 'indigo', bg: '#4f46e5' },
                    { color: 'purple', bg: '#7c3aed' },
                    { color: 'pink', bg: '#ec4899' },
                    { color: 'blue', bg: '#2563eb' },
                    { color: 'green', bg: '#059669' },
                    { color: 'red', bg: '#dc2626' }
                  ].map((accent) => (
                    <div key={accent.color} className="relative flex items-center justify-center">
                      <button 
                        onClick={() => handleAppearanceChange('accentColor', accent.color)}
                        className="h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ 
                          backgroundColor: accent.bg,
                          border: settings.appearance.accentColor === accent.color ? `3px solid ${accent.bg}` : '1px solid #e5e7eb'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('interfaceDensity')}</h4>
                <div className="mt-4 space-y-4">
                  {[
                    { value: 'comfortable', label: t('comfortable') },
                    { value: 'compact', label: t('compact') }
                  ].map((density) => (
                    <div key={density.value} className="flex items-center">
                      <input
                        id={`density-${density.value}`}
                        name="density"
                        type="radio"
                        checked={settings.appearance.density === density.value}
                        onChange={() => handleAppearanceChange('density', density.value)}
                        className="h-4 w-4 border-gray-300"
                        style={{ accentColor: 'var(--color-primary, #4f46e5)' }}
                      />
                      <label htmlFor={`density-${density.value}`} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {density.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'language':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{t('language')}</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('locale')}
                </label>
                <select
                  value={settings.language.locale}
                  onChange={(e) => handleLanguageChange('locale', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                  style={{ borderColor: 'var(--color-primary, #4f46e5)' }}
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{t('notificationPrefs')}</h3>
            
            <div className="space-y-6">
              <fieldset>
                <legend className="text-base font-medium text-gray-900 dark:text-white">{t('emailNotifications')}</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="comments"
                        type="checkbox"
                        checked={settings.notifications.email.comments}
                        onChange={(e) => handleNotificationChange('email', 'comments', e.target.checked)}
                        className="h-4 w-4 border-gray-300 rounded"
                        style={{ accentColor: 'var(--color-primary, #4f46e5)' }}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="comments" className="font-medium text-gray-700 dark:text-gray-300">{t('comments')}</label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{t('security')}</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-gray-900 dark:text-white">{t('changePassword')}</h4>
                <div className="mt-4 space-y-4">
                  <input
                    type="password"
                    placeholder={t('currentPassword')}
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                    className="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    style={{ borderColor: 'var(--color-primary, #4f46e5)' }}
                  />
                  <input
                    type="password"
                    placeholder={t('newPassword')}
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                    className="block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    style={{ borderColor: 'var(--color-primary, #4f46e5)' }}
                  />
                  <button
                    onClick={handlePasswordChange}
                    disabled={loading || !passwordForm.current || !passwordForm.new}
                    className="px-4 py-2 text-white rounded-md font-medium disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary, #4f46e5)' }}
                  >
                    {loading ? t('loading') : t('updatePassword')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('settings')}</h1>
        {saveStatus && (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <Check className="h-5 w-5 mr-2" />
            {saveStatus}
          </div>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700">
            <nav className="space-y-1">
              {[
                { key: 'profile', icon: User, label: t('profile') },
                { key: 'notifications', icon: Bell, label: t('notifications') },
                { key: 'security', icon: Lock, label: t('security') },
                { key: 'appearance', icon: Palette, label: t('appearance') },
                { key: 'language', icon: Globe, label: t('language') },
                { key: 'tutorials', icon: BookOpen, label: t('tutorials') },
                { key: 'integrations', icon: Database, label: t('integrations') }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.key 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.key ? 'var(--color-primary, #4f46e5)' : undefined
                    }}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Principal
const App = () => {
  const { currentView } = useApp();
  
  const renderContent = () => {
    switch (currentView) {
      case 'settings':
        return <SettingsView />;
      case 'projects':
        return <div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{useApp().t('projects')}</h1></div>;
      case 'tasks':
        return <div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{useApp().t('tasks')}</h1></div>;
      case 'calendar':
        return <div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{useApp().t('calendar')}</h1></div>;
      case 'reports':
        return <div className="p-6"><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{useApp().t('reports')}</h1></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1 bg-white dark:bg-white">
        {renderContent()}
      </main>
    </div>
  );
};

// Composant racine avec détection du thème système
const AppWithTheme = () => {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
      if (settings.appearance?.theme === 'system') {
        if (event.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  }, []);

  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default AppWithTheme;