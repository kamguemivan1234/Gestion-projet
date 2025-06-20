import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Mail, User, Shield, MessageSquare, Calendar, Users, 
  Plus, AlertTriangle, CheckCircle, Save, Clock, Tag, 
  FolderOpen, MapPin, Phone, Globe, Star
} from 'lucide-react';

interface NewTeamViewProps {
  onCancel: () => void;
  onCreate: (memberData: any) => void;
  existingProjects?: any[];
  existingMembers?: string[];
  initialData?: any;
  isEditing?: boolean;
}

interface FileAttachment {
  id: string;
  file: File;
  name: string;
  type: string;
  size: number;
}

const roles = [
  { value: 'admin', label: '👑 Administrateur', description: 'Accès complet à toutes les fonctionnalités' },
  { value: 'project_manager', label: '🎯 Chef de Projet', description: 'Gestion des projets et équipes' },
  { value: 'developer_senior', label: '💻 Développeur Senior', description: 'Développement et architecture' },
  { value: 'developer', label: '🔧 Développeur', description: 'Développement et maintenance' },
  { value: 'designer', label: '🎨 Designer', description: 'Interface et expérience utilisateur' },
  { value: 'marketing', label: '📢 Marketing', description: 'Stratégie et campagnes marketing' },
  { value: 'sales', label: '💼 Commercial', description: 'Ventes et relations clients' },
  { value: 'support', label: '🛠️ Support', description: 'Support technique et client' },
  { value: 'analyst', label: '📊 Analyste', description: 'Analyse de données et reporting' },
  { value: 'consultant', label: '🎓 Consultant', description: 'Expertise et conseil' },
  { value: 'viewer', label: '👁️ Observateur', description: 'Accès en lecture seule' }
];

const departments = [
  'Développement',
  'Design',
  'Marketing',
  'Ventes',
  'Support',
  'Gestion de Projet',
  'Finance',
  'Ressources Humaines',
  'Opérations',
  'Qualité'
];

const contractTypes = [
  'CDI',
  'CDD',
  'Freelance',
  'Stage',
  'Alternance',
  'Consultant'
];

const skillsList = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 
  'Java', 'PHP', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'HTML/CSS', 'SASS/SCSS', 'Tailwind CSS', 'Bootstrap', 'Material UI',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD',
  'Figma', 'Sketch', 'Adobe Creative Suite', 'UI/UX Design', 'Prototypage',
  'SEO', 'Analytics', 'Marketing Digital', 'Content Marketing', 'Social Media',
  'Gestion de projet', 'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence',
  'Négociation', 'CRM', 'Lead Generation', 'Customer Success'
];

const timezones = [
  'Europe/Paris',
  'Europe/London', 
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];

const NewTeamView: React.FC<NewTeamViewProps> = ({ 
  onCancel, 
  onCreate, 
  existingProjects = [], 
  existingMembers = [],
  initialData = null,
  isEditing = false
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'developer',
    department: 'Développement',
    contractType: 'CDI',
    location: '',
    timezone: 'Europe/Paris',
    skills: [] as string[],
    invitationMessage: '',
    invitationExpiry: '',
    selectedProjects: [] as number[],
    startDate: '',
    salary: '',
    currency: 'EUR',
    permissions: [] as string[],
    emergencyContact: '',
    emergencyPhone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    notes: '',
    language: 'Français',
    status: 'En attente',
    sendWelcomeEmail: true,
    createCalendarEvent: true,
    addToSlack: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'role' | 'projects' | 'advanced' | 'integration'>('basic');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mise à jour du temps en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialiser les données si mode édition
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        skills: initialData.skills || [],
        selectedProjects: initialData.projects?.map(p => p.id) || [],
        invitationExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
      }));
    } else {
      // Initialiser les dates par défaut
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      setFormData(prev => ({
        ...prev,
        invitationExpiry: nextWeek.toISOString().slice(0, 16),
        startDate: tomorrow.toISOString().slice(0, 10)
      }));
    }
  }, [isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Effacer l'erreur lors de la modification
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleProjectToggle = (projectId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedProjects: prev.selectedProjects.includes(projectId)
        ? prev.selectedProjects.filter(id => id !== projectId)
        : [...prev.selectedProjects, projectId]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
        return;
      }

      const attachment: FileAttachment = {
        id: Date.now().toString() + Math.random(),
        file,
        name: file.name,
        type: file.type,
        size: file.size
      };

      setAttachments(prev => [...prev, attachment]);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est obligatoire';
    if (!formData.email.trim()) newErrors.email = 'L\'email est obligatoire';
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Vérifier si l'email existe déjà (sauf en mode édition)
    if (!isEditing && existingMembers.some(member => 
      typeof member === 'object' ? member.email === formData.email : false
    )) {
      newErrors.email = 'Cet email est déjà utilisé par un autre membre';
    }

    if (!formData.role) newErrors.role = 'Le rôle est obligatoire';
    if (!formData.department) newErrors.department = 'Le département est obligatoire';

    if (formData.invitationExpiry && new Date(formData.invitationExpiry) <= new Date()) {
      newErrors.invitationExpiry = 'La date d\'expiration doit être dans le futur';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const memberData = {
        ...formData,
        id: isEditing ? initialData?.id : Date.now(),
        projects: existingProjects.filter(p => formData.selectedProjects.includes(p.id)),
        attachments,
        createdAt: isEditing ? initialData?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: getRolePermissions(formData.role),
        avatar: '', // Sera géré séparément
        lastActivity: new Date().toISOString()
      };

      // Simulation d'un délai
      await new Promise(resolve => setTimeout(resolve, 1500));

      onCreate(memberData);
    } catch (error) {
      console.error('Erreur lors de la création/modification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRolePermissions = (role: string): string[] => {
    const permissions = {
      admin: ['admin', 'create_project', 'manage_team', 'manage_settings', 'view_reports'],
      project_manager: ['create_project', 'manage_team', 'create_task', 'view_reports'],
      developer_senior: ['create_task', 'manage_code', 'mentor'],
      developer: ['create_task', 'view_code'],
      designer: ['create_task', 'manage_design'],
      marketing: ['create_task', 'manage_campaigns'],
      sales: ['create_task', 'view_reports'],
      support: ['create_task', 'view_tickets'],
      analyst: ['view_reports', 'create_reports'],
      consultant: ['create_task', 'view_reports'],
      viewer: ['view_only']
    };
    return permissions[role] || ['view_only'];
  };

  const filteredSkills = skillsList.filter(skill =>
    skill.toLowerCase().includes(skillInput.toLowerCase()) &&
    !formData.skills.includes(skill)
  );

  const getRoleInfo = (roleValue: string) => {
    return roles.find(r => r.value === roleValue);
  };

  const TabButton: React.FC<{ tab: typeof activeTab; icon: React.ReactNode; label: string; badge?: number }> = 
    ({ tab, icon, label, badge }) => (
      <button
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
          activeTab === tab
            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        {icon}
        <span>{label}</span>
        {badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isEditing ? 'Modifier le Membre' : 'Inviter un Nouveau Membre'}
              </h2>
              <p className="text-indigo-100 mt-1">
                {currentTime.toLocaleString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <TabButton tab="basic" icon={<User className="h-4 w-4" />} label="Informations de base" />
            <TabButton tab="role" icon={<Shield className="h-4 w-4" />} label="Rôle et permissions" />
            <TabButton 
              tab="projects" 
              icon={<FolderOpen className="h-4 w-4" />} 
              label="Projets" 
              badge={formData.selectedProjects.length}
            />
            <TabButton tab="advanced" icon={<Star className="h-4 w-4" />} label="Informations avancées" />
            <TabButton tab="integration" icon={<Plus className="h-4 w-4" />} label="Intégrations" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Tab: Informations de base */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations Personnelles
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: Marie Dupont"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse e-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="marie.dupont@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+33 6 12 34 56 78"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Localisation
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                        placeholder="Paris, France"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuseau horaire
                      </label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                      >
                        {timezones.map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Langue
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                      >
                        <option value="Français">Français</option>
                        <option value="English">English</option>
                        <option value="Español">Español</option>
                        <option value="Deutsch">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact d'urgence */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-3">Contact d'urgence</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du contact
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base"
                        placeholder="Nom et prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone d'urgence
                      </label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Rôle et permissions */}
            {activeTab === 'role' && (
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Rôle et Responsabilités
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rôle principal *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 text-base ${
                          errors.role ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                      
                      {formData.role && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {getRoleInfo(formData.role)?.description}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Département *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 text-base ${
                          errors.department ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de contrat
                      </label>
                      <select
                        name="contractType"
                        value={formData.contractType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-base"
                      >
                        {contractTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de début
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-base"
                      />
                    </div>
                  </div>

                  {/* Compétences */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compétences
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => {
                          setSkillInput(e.target.value);
                          setShowSkillSuggestions(e.target.value.length > 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (skillInput.trim()) {
                              handleSkillAdd(skillInput.trim());
                            }
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-base"
                        placeholder="Tapez une compétence et appuyez sur Entrée..."
                      />
                      
                      {showSkillSuggestions && filteredSkills.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {filteredSkills.slice(0, 8).map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleSkillAdd(skill)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {formData.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.skills.map(skill => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleSkillRemove(skill)}
                              className="ml-2 text-purple-600 hover:text-purple-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Permissions automatiques */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Permissions automatiques pour ce rôle
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getRolePermissions(formData.role).map(permission => (
                      <span key={permission} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                        {permission.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Projets */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2" />
                    Projets Assignés
                  </h3>
                  
                  {existingProjects.length > 0 ? (
                    <div className="space-y-3">
                      {existingProjects.map(project => (
                        <label key={project.id} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.selectedProjects.includes(project.id)}
                            onChange={() => handleProjectToggle(project.id)}
                            className="h-4 w-4 text-green-600 rounded"
                          />
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">
                              Projet #{project.id}
                            </div>
                          </div>
                        </label>
                      ))}
                      
                      {formData.selectedProjects.length > 0 && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-800">
                              {formData.selectedProjects.length} projet{formData.selectedProjects.length > 1 ? 's' : ''} sélectionné{formData.selectedProjects.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-green-700">
                            Le membre aura accès à {formData.selectedProjects.length > 1 ? 'ces projets' : 'ce projet'} dès son activation.
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun projet disponible</h4>
                      <p className="text-gray-500">
                        Créez d'abord des projets pour pouvoir les assigner à ce membre.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Informations avancées */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Informations Complémentaires
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Liens professionnels */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Liens professionnels</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-base"
                          placeholder="https://linkedin.com/in/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub
                        </label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-base"
                          placeholder="https://github.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Portfolio
                        </label>
                        <input
                          type="url"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-base"
                          placeholder="https://portfolio.com"
                        />
                      </div>
                    </div>

                    {/* Informations contractuelles */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Informations contractuelles</h4>
                      
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-base"
                          placeholder="Salaire"
                        />
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-base bg-gray-50"
                        >
                          <option value="EUR">EUR</option>
                          <option value="USD">USD</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-base"
                        >
                          <option value="En attente">En attente</option>
                          <option value="Actif">Actif</option>
                          <option value="Inactif">Inactif</option>
                          <option value="Suspendu">Suspendu</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes internes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 text-base"
                      placeholder="Notes privées sur ce membre (non visibles par le membre)..."
                    />
                  </div>
                </div>

                {!isEditing && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Paramètres d'invitation
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message d'invitation personnalisé
                        </label>
                        <textarea
                          name="invitationMessage"
                          value={formData.invitationMessage}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-base"
                          placeholder="Bienvenue dans notre équipe ! Nous sommes ravis de vous avoir parmi nous..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiration de l'invitation
                        </label>
                        <input
                          type="datetime-local"
                          name="invitationExpiry"
                          value={formData.invitationExpiry}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 text-base ${
                            errors.invitationExpiry ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.invitationExpiry && <p className="text-red-500 text-sm mt-1">{errors.invitationExpiry}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Intégrations */}
            {activeTab === 'integration' && (
              <div className="space-y-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Intégrations et Automatisations
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="sendWelcomeEmail"
                        checked={formData.sendWelcomeEmail}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 rounded mt-1"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">
                          Envoyer un email de bienvenue
                        </span>
                        <p className="text-xs text-gray-500">
                          Un email contenant les informations d'accès sera envoyé automatiquement
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="createCalendarEvent"
                        checked={formData.createCalendarEvent}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 rounded mt-1"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">
                          Créer un événement d'onboarding
                        </span>
                        <p className="text-xs text-gray-500">
                          Programmer une réunion d'intégration pour le premier jour
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="addToSlack"
                        checked={formData.addToSlack}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 rounded mt-1"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">
                          Ajouter aux canaux Slack de l'équipe
                        </span>
                        <p className="text-xs text-gray-500">
                          Invitation automatique aux canaux pertinents selon le rôle
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Documents et fichiers */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Documents annexes</h4>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Plus className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">
                        Ajouter CV, contrat, ou autres documents
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, Word, Images (max 5MB par fichier)
                      </p>
                    </button>
                  </div>

                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">
                        Fichiers attachés ({attachments.length})
                      </h5>
                      {attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{attachment.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer avec boutons d'action */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              
              <div className="flex space-x-3">
                {!isEditing && (
                  <button
                    type="button"
                    className="px-6 py-3 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder comme Brouillon
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditing ? 'Modification...' : 'Envoi invitation...'}
                    </>
                  ) : (
                    <>
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Enregistrer les modifications
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Envoyer l'invitation
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTeamView;