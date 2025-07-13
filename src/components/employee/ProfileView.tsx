import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Save, User, Bell, Lock, Globe, Palette, Check, X, Eye, EyeOff, 
  Upload, Trash2, Camera, Edit3, MapPin, Phone, Mail, Calendar,
  Clock, Target, Award, TrendingUp, Activity, Settings, ChevronRight,
  Star, Briefcase, Users, FileText, BarChart, Shield, Download,
  Image as ImageIcon, Smartphone, Monitor, Moon, Sun, Languages,
  Zap, Coffee, HeartHandshake, MessageCircle, Github, Linkedin,
  Twitter, Instagram, Facebook
} from 'lucide-react';

// Système de traductions pour l'employé
const translations = {
  fr: {
    // Navigation et sections
    myProfile: 'Mon Profil',
    personalInfo: 'Informations personnelles',
    workInfo: 'Informations professionnelles',
    preferences: 'Préférences',
    security: 'Sécurité et confidentialité',
    statistics: 'Mes statistiques',
    socialLinks: 'Liens sociaux',
    
    // Informations personnelles
    profilePhoto: 'Photo de profil',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    email: 'Adresse email',
    phone: 'Téléphone',
    location: 'Localisation',
    birthDate: 'Date de naissance',
    bio: 'Biographie',
    changePhoto: 'Changer la photo',
    removePhoto: 'Supprimer la photo',
    uploadPhoto: 'Télécharger une photo',
    
    // Informations professionnelles
    employeeId: 'ID employé',
    role: 'Poste',
    department: 'Département',
    manager: 'Manager',
    hireDate: 'Date d\'embauche',
    experience: 'Expérience',
    skills: 'Compétences',
    workLocation: 'Lieu de travail',
    workSchedule: 'Horaires de travail',
    
    // Préférences
    appearance: 'Apparence',
    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    accentColor: 'Couleur d\'accent',
    language: 'Langue',
    timezone: 'Fuseau horaire',
    dateFormat: 'Format de date',
    notifications: 'Notifications',
    emailNotifications: 'Notifications email',
    pushNotifications: 'Notifications push',
    
    // Sécurité
    changePassword: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    updatePassword: 'Mettre à jour',
    twoFactor: 'Authentification à deux facteurs',
    activeSessions: 'Sessions actives',
    privacySettings: 'Paramètres de confidentialité',
    
    // Statistiques
    totalProjects: 'Projets totaux',
    completedTasks: 'Tâches terminées',
    hoursWorked: 'Heures travaillées',
    teamCollaborations: 'Collaborations équipe',
    efficiency: 'Efficacité',
    rating: 'Évaluation',
    achievements: 'Réalisations',
    thisMonth: 'Ce mois',
    thisYear: 'Cette année',
    
    // Actions
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    download: 'Télécharger',
    upload: 'Télécharger',
    connect: 'Connecter',
    disconnect: 'Déconnecter',
    
    // Messages
    profileUpdated: 'Profil mis à jour avec succès',
    passwordUpdated: 'Mot de passe mis à jour',
    photoUpdated: 'Photo de profil mise à jour',
    settingsUpdated: 'Paramètres mis à jour',
    error: 'Une erreur est survenue',
    loading: 'Chargement...',
    
    // Placeholder et exemples
    bioPlaceholder: 'Parlez-nous de vous, vos passions, vos objectifs...',
    skillsPlaceholder: 'JavaScript, React, Python, Gestion de projet...',
    locationPlaceholder: 'Paris, France',
    phonePlaceholder: '+33 6 12 34 56 78'
  },
  en: {
    // Navigation et sections
    myProfile: 'My Profile',
    personalInfo: 'Personal Information',
    workInfo: 'Work Information',
    preferences: 'Preferences',
    security: 'Security & Privacy',
    statistics: 'My Statistics',
    socialLinks: 'Social Links',
    
    // Informations personnelles
    profilePhoto: 'Profile Photo',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone',
    location: 'Location',
    birthDate: 'Birth Date',
    bio: 'Biography',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove Photo',
    uploadPhoto: 'Upload Photo',
    
    // Informations professionnelles
    employeeId: 'Employee ID',
    role: 'Role',
    department: 'Department',
    manager: 'Manager',
    hireDate: 'Hire Date',
    experience: 'Experience',
    skills: 'Skills',
    workLocation: 'Work Location',
    workSchedule: 'Work Schedule',
    
    // Préférences
    appearance: 'Appearance',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    accentColor: 'Accent Color',
    language: 'Language',
    timezone: 'Timezone',
    dateFormat: 'Date Format',
    notifications: 'Notifications',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    
    // Sécurité
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    updatePassword: 'Update',
    twoFactor: 'Two-Factor Authentication',
    activeSessions: 'Active Sessions',
    privacySettings: 'Privacy Settings',
    
    // Statistiques
    totalProjects: 'Total Projects',
    completedTasks: 'Completed Tasks',
    hoursWorked: 'Hours Worked',
    teamCollaborations: 'Team Collaborations',
    efficiency: 'Efficiency',
    rating: 'Rating',
    achievements: 'Achievements',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    download: 'Download',
    upload: 'Upload',
    connect: 'Connect',
    disconnect: 'Disconnect',
    
    // Messages
    profileUpdated: 'Profile updated successfully',
    passwordUpdated: 'Password updated',
    photoUpdated: 'Profile photo updated',
    settingsUpdated: 'Settings updated',
    error: 'An error occurred',
    loading: 'Loading...',
    
    // Placeholder et exemples
    bioPlaceholder: 'Tell us about yourself, your passions, your goals...',
    skillsPlaceholder: 'JavaScript, React, Python, Project Management...',
    locationPlaceholder: 'Paris, France',
    phonePlaceholder: '+33 6 12 34 56 78'
  }
};

// Context pour les paramètres du profil employé
const ProfileContext = createContext();

// Hook pour utiliser le contexte
const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// Provider pour le profil employé
const ProfileProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({});
  
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('employeeProfile');
    return saved ? JSON.parse(saved) : {
      personal: {
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@workcollab.com',
        phone: '+33 6 12 34 56 78',
        location: 'Paris, France',
        birthDate: '1990-05-15',
        bio: 'Développeuse passionnée avec 5 ans d\'expérience en développement web. J\'aime travailler en équipe et créer des solutions innovantes.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      work: {
        employeeId: 'EMP-2024-001',
        role: 'Développeuse Frontend Senior',
        department: 'Développement',
        manager: 'Jean Dupuis',
        hireDate: '2019-03-15',
        experience: '5 ans',
        skills: 'React, TypeScript, Node.js, GraphQL, UI/UX Design, Gestion de projet',
        workLocation: 'Bureau - Paris La Défense',
        workSchedule: 'Lun-Ven 9h00-18h00'
      },
      preferences: {
        theme: 'system',
        accentColor: 'indigo',
        language: 'fr',
        timezone: 'Europe/Paris',
        dateFormat: 'DD/MM/YYYY',
        notifications: {
          email: {
            projectUpdates: true,
            taskAssignments: true,
            deadlines: true,
            teamMessages: false,
            weeklyReports: true
          },
          push: {
            enabled: true,
            taskReminders: true,
            mentionsOnly: false,
            quietHours: { enabled: true, start: '18:00', end: '09:00' }
          }
        }
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: '2024-01-15',
        activeSessions: [
          {
            id: 1,
            device: 'Chrome sur Windows',
            location: 'Paris, France',
            lastActive: 'À l\'instant',
            current: true
          },
          {
            id: 2,
            device: 'Safari sur iPhone',
            location: 'Paris, France',
            lastActive: 'Il y a 2 heures',
            current: false
          }
        ],
        privacy: {
          profileVisibility: 'team',
          statusVisibility: 'all',
          activityTracking: true
        }
      },
      statistics: {
        totalProjects: 23,
        completedTasks: 187,
        hoursWorked: 1248,
        teamCollaborations: 45,
        efficiency: 94,
        rating: 4.8,
        monthlyStats: {
          projects: 3,
          tasks: 28,
          hours: 142,
          collaborations: 8
        }
      },
      socialLinks: {
        linkedin: 'https://linkedin.com/in/mariedubois',
        github: 'https://github.com/mariedubois',
        twitter: '',
        portfolio: 'https://mariedubois.dev'
      }
    };
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('employeeSettings');
    return saved ? JSON.parse(saved) : {
      language: { locale: 'fr' }
    };
  });

  // Fonction de traduction
  const t = (key) => translations[settings.language.locale]?.[key] || translations.fr[key] || key;

  // Appliquer les paramètres d'apparence
  useEffect(() => {
    localStorage.setItem('employeeProfile', JSON.stringify(profileData));
    localStorage.setItem('employeeSettings', JSON.stringify(settings));
    
    // Appliquer le thème
    const root = document.documentElement;
    root.classList.remove('dark');
    
    if (profileData.preferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (profileData.preferences.theme === 'system') {
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
    
    const colors = accentColors[profileData.preferences.accentColor];
    if (colors) {
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-primary-hover', colors.hover);
    }
  }, [profileData, settings]);

  const updateProfile = (section, updates) => {
    setProfileData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const showSaveStatus = (message) => {
    setSaveStatus(message);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const toggleEditMode = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <ProfileContext.Provider value={{
      profileData,
      updateProfile,
      settings,
      updateSettings,
      activeTab,
      setActiveTab,
      saveStatus,
      showSaveStatus,
      loading,
      setLoading,
      editMode,
      toggleEditMode,
      t
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Composant Modal personnalisé pour remplacer confirm()
const CustomModal = ({ isOpen, onClose, onConfirm, title, message, type = 'confirm' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded ${
              type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant en-tête de profil
const ProfileHeader = () => {
  const { profileData, updateProfile, showSaveStatus, t } = useProfile();
  const [showModal, setShowModal] = useState({ isOpen: false, type: '', action: null });
  const fileInputRef = React.useRef(null);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfile('personal', { avatar: e.target.result });
        showSaveStatus(t('photoUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    updateProfile('personal', { avatar: null });
    showSaveStatus(t('photoUpdated'));
  };

  const showConfirmModal = (type, action, title, message) => {
    setShowModal({
      isOpen: true,
      type,
      action,
      title,
      message
    });
  };

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl"></div>
        <div className="relative z-10 flex items-center space-x-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white ring-opacity-50 transition-all group-hover:ring-opacity-80">
              {profileData.personal.avatar ? (
                <img
                  src={profileData.personal.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white bg-opacity-20 flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                  title={t('changePhoto')}
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                {profileData.personal.avatar && (
                  <button
                    onClick={() => showConfirmModal('danger', handleRemovePhoto, 'Supprimer la photo', 'Êtes-vous sûr de vouloir supprimer votre photo de profil ?')}
                    className="p-2 bg-red-500 bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all"
                    title={t('removePhoto')}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {profileData.personal.firstName} {profileData.personal.lastName}
            </h1>
            <p className="text-white text-opacity-90 text-lg mb-1">{profileData.work.role}</p>
            <p className="text-white text-opacity-80">{profileData.work.department}</p>
            <div className="flex items-center mt-3 space-x-4 text-white text-opacity-80">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {profileData.personal.location}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Chez nous depuis {new Date(profileData.work.hireDate).getFullYear()}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-3">
              <div className="text-2xl font-bold text-white">{profileData.statistics.rating}/5</div>
              <div className="text-white text-opacity-80 text-sm">Évaluation</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{profileData.statistics.efficiency}%</div>
              <div className="text-white text-opacity-80 text-sm">Efficacité</div>
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        isOpen={showModal.isOpen}
        onClose={() => setShowModal({ isOpen: false })}
        onConfirm={showModal.action}
        title={showModal.title}
        message={showModal.message}
        type={showModal.type}
      />
    </>
  );
};

// Composant onglets de navigation
const ProfileTabs = () => {
  const { activeTab, setActiveTab, t } = useProfile();

  const tabs = [
    { key: 'personal', label: t('personalInfo'), icon: User },
    { key: 'work', label: t('workInfo'), icon: Briefcase },
    { key: 'statistics', label: t('statistics'), icon: BarChart },
    { key: 'preferences', label: t('preferences'), icon: Settings },
    { key: 'security', label: t('security'), icon: Shield }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                activeTab === tab.key
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                activeTab === tab.key ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// Composant informations personnelles
const PersonalInfoTab = () => {
  const { profileData, updateProfile, editMode, toggleEditMode, showSaveStatus, t } = useProfile();
  const [formData, setFormData] = useState(profileData.personal);

  const handleSave = (field) => {
    updateProfile('personal', { [field]: formData[field] });
    toggleEditMode(field);
    showSaveStatus(t('profileUpdated'));
  };

  const handleCancel = (field) => {
    setFormData(prev => ({ ...prev, [field]: profileData.personal[field] }));
    toggleEditMode(field);
  };

  const EditableField = ({ field, label, type = 'text', placeholder, multiline = false }) => {
    const isEditing = editMode[field];
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
          <button
            onClick={() => toggleEditMode(field)}
            className="text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
        
        {isEditing ? (
          <div className="space-y-3">
            {multiline ? (
              <textarea
                value={formData[field] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={placeholder}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <input
                type={type}
                value={formData[field] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave(field)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
              >
                {t('save')}
              </button>
              <button
                onClick={() => handleCancel(field)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-900 dark:text-white">
              {formData[field] || <span className="text-gray-400 italic">Non renseigné</span>}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations de base</h3>
        
        <EditableField 
          field="firstName" 
          label={t('firstName')} 
          placeholder="Votre prénom" 
        />
        
        <EditableField 
          field="lastName" 
          label={t('lastName')} 
          placeholder="Votre nom de famille" 
        />
        
        <EditableField 
          field="email" 
          label={t('email')} 
          type="email" 
          placeholder="votre.email@exemple.com" 
        />
        
        <EditableField 
          field="phone" 
          label={t('phone')} 
          type="tel" 
          placeholder={t('phonePlaceholder')} 
        />
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations complémentaires</h3>
        
        <EditableField 
          field="location" 
          label={t('location')} 
          placeholder={t('locationPlaceholder')} 
        />
        
        <EditableField 
          field="birthDate" 
          label={t('birthDate')} 
          type="date" 
        />
        
        <EditableField 
          field="bio" 
          label={t('bio')} 
          placeholder={t('bioPlaceholder')} 
          multiline 
        />
      </div>
    </div>
  );
};

// Composant informations professionnelles
const WorkInfoTab = () => {
  const { profileData, t } = useProfile();

  const InfoCard = ({ icon: Icon, label, value, accent = false }) => (
    <div className={`p-4 rounded-lg border ${accent ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
      <div className="flex items-center space-x-3">
        <Icon className={`w-5 h-5 ${accent ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'}`} />
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-base font-semibold ${accent ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}>
            {value || 'Non renseigné'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Informations professionnelles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard 
            icon={Target} 
            label={t('employeeId')} 
            value={profileData.work.employeeId} 
            accent 
          />
          <InfoCard 
            icon={User} 
            label={t('role')} 
            value={profileData.work.role} 
          />
          <InfoCard 
            icon={Users} 
            label={t('department')} 
            value={profileData.work.department} 
          />
          <InfoCard 
            icon={User} 
            label={t('manager')} 
            value={profileData.work.manager} 
          />
          <InfoCard 
            icon={Calendar} 
            label={t('hireDate')} 
            value={new Date(profileData.work.hireDate).toLocaleDateString()} 
          />
          <InfoCard 
            icon={Clock} 
            label={t('experience')} 
            value={profileData.work.experience} 
          />
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Détails du poste</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('skills')}</label>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {profileData.work.skills.split(', ').map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('workLocation')}</label>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-900 dark:text-white">{profileData.work.workLocation}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('workSchedule')}</label>
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-900 dark:text-white">{profileData.work.workSchedule}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant statistiques
const StatisticsTab = () => {
  const { profileData, t } = useProfile();

  const StatCard = ({ icon: Icon, label, value, subtitle, color = 'indigo' }) => {
    const colorClasses = {
      indigo: 'from-indigo-500 to-indigo-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      blue: 'from-blue-500 to-blue-600',
      pink: 'from-pink-500 to-pink-600'
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Vue d'ensemble</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            icon={Briefcase} 
            label={t('totalProjects')} 
            value={profileData.statistics.totalProjects} 
            subtitle="Tous projets confondus"
            color="indigo"
          />
          <StatCard 
            icon={CheckSquare} 
            label={t('completedTasks')} 
            value={profileData.statistics.completedTasks} 
            subtitle="Depuis le début"
            color="green"
          />
          <StatCard 
            icon={Clock} 
            label={t('hoursWorked')} 
            value={`${profileData.statistics.hoursWorked}h`} 
            subtitle="Cette année"
            color="purple"
          />
          <StatCard 
            icon={Users} 
            label={t('teamCollaborations')} 
            value={profileData.statistics.teamCollaborations} 
            subtitle="Collaborations actives"
            color="orange"
          />
          <StatCard 
            icon={TrendingUp} 
            label={t('efficiency')} 
            value={`${profileData.statistics.efficiency}%`} 
            subtitle="Taux de productivité"
            color="blue"
          />
          <StatCard 
            icon={Star} 
            label={t('rating')} 
            value={`${profileData.statistics.rating}/5`} 
            subtitle="Évaluation moyenne"
            color="pink"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ce mois-ci</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard 
            icon={Briefcase} 
            label="Projets" 
            value={profileData.statistics.monthlyStats.projects} 
            color="indigo"
          />
          <StatCard 
            icon={CheckSquare} 
            label="Tâches" 
            value={profileData.statistics.monthlyStats.tasks} 
            color="green"
          />
          <StatCard 
            icon={Clock} 
            label="Heures" 
            value={`${profileData.statistics.monthlyStats.hours}h`} 
            color="purple"
          />
          <StatCard 
            icon={Users} 
            label="Collaborations" 
            value={profileData.statistics.monthlyStats.collaborations} 
            color="orange"
          />
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold mb-2">Réalisations récentes</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5" />
                <span>Expert React certifié</span>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5" />
                <span>100% de projets livrés à temps ce trimestre</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5" />
                <span>Mentor de 3 nouveaux développeurs</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold mb-1">🏆</div>
            <p className="text-white text-opacity-80">Top Performer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant préférences
const PreferencesTab = () => {
  const { profileData, updateProfile, showSaveStatus, t } = useProfile();

  const handlePreferenceChange = (category, setting, value) => {
    const newPrefs = { ...profileData.preferences };
    if (category === 'notifications') {
      newPrefs.notifications = {
        ...newPrefs.notifications,
        [setting]: typeof value === 'object' ? { ...newPrefs.notifications[setting], ...value } : value
      };
    } else {
      newPrefs[setting] = value;
    }
    updateProfile('preferences', newPrefs);
    showSaveStatus(t('settingsUpdated'));
  };

  return (
    <div className="space-y-8">
      {/* Apparence */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('appearance')}</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">{t('theme')}</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: t('light'), icon: Sun },
                { value: 'dark', label: t('dark'), icon: Moon },
                { value: 'system', label: t('system'), icon: Monitor }
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.value}
                    onClick={() => handlePreferenceChange('appearance', 'theme', theme.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      profileData.preferences.theme === theme.value
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      profileData.preferences.theme === theme.value ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      profileData.preferences.theme === theme.value ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {theme.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">{t('accentColor')}</label>
            <div className="grid grid-cols-6 gap-3">
              {[
                { color: 'indigo', bg: '#4f46e5' },
                { color: 'purple', bg: '#7c3aed' },
                { color: 'pink', bg: '#ec4899' },
                { color: 'blue', bg: '#2563eb' },
                { color: 'green', bg: '#059669' },
                { color: 'red', bg: '#dc2626' }
              ].map((accent) => (
                <button
                  key={accent.color}
                  onClick={() => handlePreferenceChange('appearance', 'accentColor', accent.color)}
                  className="relative flex items-center justify-center"
                >
                  <div 
                    className={`h-10 w-10 rounded-full transition-all ${
                      profileData.preferences.accentColor === accent.color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: accent.bg }}
                  />
                  {profileData.preferences.accentColor === accent.color && (
                    <Check className="absolute w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Langue et région */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Langue et région</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('language')}</label>
            <select
              value={profileData.preferences.language}
              onChange={(e) => handlePreferenceChange('language', 'language', e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('timezone')}</label>
            <select
              value={profileData.preferences.timezone}
              onChange={(e) => handlePreferenceChange('language', 'timezone', e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('notifications')}</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('emailNotifications')}</h4>
            <div className="space-y-3">
              {Object.entries(profileData.preferences.notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {key === 'projectUpdates' ? 'Mises à jour de projets' :
                     key === 'taskAssignments' ? 'Nouvelles tâches assignées' :
                     key === 'deadlines' ? 'Rappels d\'échéances' :
                     key === 'teamMessages' ? 'Messages d\'équipe' :
                     key === 'weeklyReports' ? 'Rapports hebdomadaires' : key}
                  </span>
                  <button
                    onClick={() => handlePreferenceChange('notifications', 'email', { [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">{t('pushNotifications')}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Notifications push activées</span>
                <button
                  onClick={() => handlePreferenceChange('notifications', 'push', { 
                    ...profileData.preferences.notifications.push, 
                    enabled: !profileData.preferences.notifications.push.enabled 
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profileData.preferences.notifications.push.enabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profileData.preferences.notifications.push.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant sécurité
const SecurityTab = () => {
  const { profileData, updateProfile, showSaveStatus, t } = useProfile();
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      showSaveStatus('Les mots de passe ne correspondent pas');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setPasswordForm({ current: '', new: '', confirm: '' });
      setLoading(false);
      showSaveStatus(t('passwordUpdated'));
    }, 1000);
  };

  const toggleTwoFactor = () => {
    updateProfile('security', { 
      ...profileData.security, 
      twoFactorEnabled: !profileData.security.twoFactorEnabled 
    });
    showSaveStatus('Paramètres de sécurité mis à jour');
  };

  return (
    <div className="space-y-8">
      {/* Changement de mot de passe */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('changePassword')}</h3>
        
        <div className="max-w-md space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('currentPassword')}</label>
            <div className="mt-1 relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.current}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('newPassword')}</label>
            <div className="mt-1 relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.new}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('confirmPassword')}</label>
            <div className="mt-1 relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={loading || !passwordForm.current || !passwordForm.new || !passwordForm.confirm}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('loading') : t('updatePassword')}
          </button>
        </div>
      </div>

      {/* Authentification à deux facteurs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('twoFactor')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Ajoutez une couche de sécurité supplémentaire à votre compte
            </p>
          </div>
          <button
            onClick={toggleTwoFactor}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              profileData.security.twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                profileData.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Sessions actives */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{t('activeSessions')}</h3>
        
        <div className="space-y-4">
          {profileData.security.activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  {session.device.includes('iPhone') ? <Smartphone className="w-5 h-5 text-indigo-600" /> : <Monitor className="w-5 h-5 text-indigo-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.device}
                    {session.current && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Actuelle</span>}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{session.location} • {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                  Déconnecter
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Composant principal ProfileView
const ProfileView = () => {
  const { activeTab, saveStatus, t } = useProfile();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab />;
      case 'work':
        return <WorkInfoTab />;
      case 'statistics':
        return <StatisticsTab />;
      case 'preferences':
        return <PreferencesTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <PersonalInfoTab />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('myProfile')}</h1>
        {saveStatus && (
          <div className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
            <Check className="w-5 h-5 mr-2" />
            {saveStatus}
          </div>
        )}
      </div>

      <ProfileHeader />
      <ProfileTabs />
      {renderTabContent()}
    </div>
  );
};

// Composant racine avec détection du thème système
const ProfileViewWithProvider = () => {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const profileData = JSON.parse(localStorage.getItem('employeeProfile') || '{}');
      if (profileData.preferences?.theme === 'system') {
        if (event.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  }, []);

  return (
    <ProfileProvider>
      <ProfileView />
    </ProfileProvider>
  );
};

export default ProfileViewWithProvider;