import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, Calendar, Clock, Users, DollarSign, Target, 
  FileText, Tag, Plus, Minus, Save, CheckCircle, AlertTriangle,
  Briefcase, Settings, Link as LinkIcon, Trash2, Eye
} from 'lucide-react';

interface NewProjectViewProps {
  onCancel: () => void;
  onCreate: (project: any) => void;
  existingTasks?: any[];
  existingMembers?: string[];
}

interface ProjectTask {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedHours: number;
  priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
  assignee: string;
}

interface FileAttachment {
  id: string;
  file?: File;
  url?: string;
  name: string;
  type: 'file' | 'url';
  size?: number;
}

const taskCategories = [
  { value: 'frontend', label: '🖥️ Frontend', description: 'Interface utilisateur, React, HTML/CSS' },
  { value: 'backend', label: '⚙️ Backend', description: 'API, Base de données, Serveur' },
  { value: 'mobile', label: '📱 Mobile', description: 'Applications iOS/Android' },
  { value: 'design', label: '🎨 Design', description: 'UI/UX, Graphisme, Prototypage' },
  { value: 'marketing', label: '📢 Marketing', description: 'Campagnes, SEO, Contenu' },
  { value: 'devops', label: '🔧 DevOps', description: 'Déploiement, Infrastructure' },
  { value: 'qa', label: '🧪 QA/Tests', description: 'Tests, Qualité, Validation' },
  { value: 'documentation', label: '📚 Documentation', description: 'Guides, Manuels, API docs' },
  { value: 'security', label: '🔒 Sécurité', description: 'Audit, Vulnérabilités, Compliance' },
  { value: 'analytics', label: '📊 Analytics', description: 'Données, Rapports, Métriques' }
];

const teamMembers = [
  'Marie Dubois', 'Jean Martin', 'Sophie Bernard', 'Pierre Leroux', 
  'Emma Wilson', 'Thomas Martin', 'Lucie Petit', 'Paul Leroy'
];

const NewProjectView: React.FC<NewProjectViewProps> = ({ 
  onCancel, 
  onCreate, 
  existingTasks = [], 
  existingMembers = [] 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'Moyenne' as 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente',
    status: 'En attente' as 'En attente' | 'En cours' | 'En pause' | 'Terminé' | 'Annulé',
    budget: '',
    currency: 'EUR',
    tags: '',
    clientName: '',
    projectManager: '',
    autoCreateTasks: true,
    estimatedDuration: '',
    riskLevel: 'Moyen' as 'Faible' | 'Moyen' | 'Élevé',
    methodology: 'Agile' as 'Agile' | 'Waterfall' | 'Kanban' | 'Scrum'
  });

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'team' | 'tasks' | 'files' | 'advanced'>('basic');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    setFormData(prev => ({
      ...prev,
      startDate: now.toISOString().slice(0, 16),
      endDate: nextMonth.toISOString().slice(0, 16)
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addProjectTask = () => {
    const newTask: ProjectTask = {
      id: Date.now().toString(),
      name: '',
      description: '',
      category: 'frontend',
      estimatedHours: 8,
      priority: 'Moyenne',
      assignee: ''
    };
    setProjectTasks([...projectTasks, newTask]);
  };

  const updateProjectTask = (id: string, field: keyof ProjectTask, value: any) => {
    setProjectTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };

  const removeProjectTask = (id: string) => {
    setProjectTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert(`Le fichier ${file.name} est trop volumineux (max 50MB)`);
        return;
      }

      const attachment: FileAttachment = {
        id: Date.now().toString() + Math.random(),
        file,
        name: file.name,
        type: 'file',
        size: file.size
      };

      setAttachments(prev => [...prev, attachment]);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addUrlAttachment = () => {
    const url = urlInputRef.current?.value;
    if (!url) return;

    try {
      new URL(url); // Validation URL
      const attachment: FileAttachment = {
        id: Date.now().toString() + Math.random(),
        url,
        name: url.split('/').pop() || 'Lien externe',
        type: 'url'
      };

      setAttachments(prev => [...prev, attachment]);
      if (urlInputRef.current) {
        urlInputRef.current.value = '';
      }
    } catch {
      alert('URL invalide');
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom du projet est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!formData.startDate) newErrors.startDate = 'La date de début est obligatoire';
    if (!formData.endDate) newErrors.endDate = 'La date de fin est obligatoire';
    if (!formData.projectManager) newErrors.projectManager = 'Le chef de projet est obligatoire';

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
      }
    }

    if (selectedMembers.length === 0) {
      newErrors.members = 'Au moins un membre d\'équipe est requis';
    }

    if (formData.budget && parseFloat(formData.budget) < 0) {
      newErrors.budget = 'Le budget doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const projectData = {
        ...formData,
        id: Date.now(),
        members: selectedMembers,
        tasks: projectTasks,
        attachments,
        createdAt: new Date().toISOString(),
        progress: 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        budget: parseFloat(formData.budget) || 0
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      onCreate(projectData);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProjectMetrics = () => {
    const totalHours = projectTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const tasksByCategory = taskCategories.map(cat => ({
      ...cat,
      count: projectTasks.filter(task => task.category === cat.value).length
    }));

    return { totalHours, tasksByCategory };
  };

  const metrics = calculateProjectMetrics();

  const TabButton: React.FC<{ tab: typeof activeTab; icon: React.ReactNode; label: string }> = 
    ({ tab, icon, label }) => (
      <button
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === tab
            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Créer un Nouveau Projet</h2>
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
            <button onClick={onCancel} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <TabButton tab="basic" icon={<Briefcase className="h-4 w-4" />} label="Informations Générales" />
            <TabButton tab="team" icon={<Users className="h-4 w-4" />} label="Équipe" />
            <TabButton tab="tasks" icon={<CheckCircle className="h-4 w-4" />} label="Tâches" />
            <TabButton tab="files" icon={<FileText className="h-4 w-4" />} label="Documents" />
            <TabButton tab="advanced" icon={<Settings className="h-4 w-4" />} label="Paramètres Avancés" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Tab: Informations Générales */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du Projet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Refonte du site web e-commerce"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    >
                      <option value="Basse">🟢 Basse</option>
                      <option value="Moyenne">🟡 Moyenne</option>
                      <option value="Élevée">🟠 Élevée</option>
                      <option value="Urgente">🔴 Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut Initial</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    >
                      <option value="En attente">⏳ En attente</option>
                      <option value="En cours">🔄 En cours</option>
                      <option value="En pause">⏸️ En pause</option>
                      <option value="Terminé">✅ Terminé</option>
                      <option value="Annulé">❌ Annulé</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description du Projet *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Décrivez les objectifs, livrables et contraintes du projet..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de Début *
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                        errors.startDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de Fin *
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        min="0"
                        step="100"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-base"
                        placeholder="50000"
                      />
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="px-3 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 text-base bg-gray-50"
                      >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client/Demandeur</label>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                      placeholder="Nom du client ou département"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags/Mots-clés
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                      placeholder="web, ecommerce, frontend, urgent (séparés par des virgules)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Équipe */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chef de Projet *
                  </label>
                  <select
                    name="projectManager"
                    value={formData.projectManager}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                      errors.projectManager ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner un chef de projet</option>
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                  {errors.projectManager && <p className="text-red-500 text-sm mt-1">{errors.projectManager}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membres de l'Équipe *
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {teamMembers.map(member => (
                        <label key={member} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMembers([...selectedMembers, member]);
                              } else {
                                setSelectedMembers(selectedMembers.filter(m => m !== member));
                              }
                              if (errors.members) {
                                setErrors(prev => ({ ...prev, members: '' }));
                              }
                            }}
                            className="h-4 w-4 text-indigo-600 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{member}</span>
                        </label>
                      ))}
                    </div>
                    {errors.members && <p className="text-red-500 text-sm mt-2">{errors.members}</p>}
                  </div>

                  {selectedMembers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Équipe sélectionnée ({selectedMembers.length} membres)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMembers.map(member => (
                          <span
                            key={member}
                            className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full"
                          >
                            {member}
                            <button
                              type="button"
                              onClick={() => setSelectedMembers(selectedMembers.filter(m => m !== member))}
                              className="ml-2 text-indigo-500 hover:text-indigo-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Tâches */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Définition des Tâches</h3>
                  <button
                    type="button"
                    onClick={addProjectTask}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une Tâche
                  </button>
                </div>

                {/* Métriques du projet */}
                {projectTasks.length > 0 && (
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-medium text-indigo-900 mb-3">Résumé du Projet</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-indigo-600 font-medium">{projectTasks.length}</span>
                        <span className="text-indigo-700 ml-1">tâches</span>
                      </div>
                      <div>
                        <span className="text-indigo-600 font-medium">{metrics.totalHours}h</span>
                        <span className="text-indigo-700 ml-1">estimées</span>
                      </div>
                      <div>
                        <span className="text-indigo-600 font-medium">{selectedMembers.length}</span>
                        <span className="text-indigo-700 ml-1">membres</span>
                      </div>
                      <div>
                        <span className="text-indigo-600 font-medium">
                          {metrics.tasksByCategory.filter(c => c.count > 0).length}
                        </span>
                        <span className="text-indigo-700 ml-1">catégories</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {projectTasks.map((task, index) => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Tâche #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeProjectTask(task.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de la tâche
                          </label>
                          <input
                            type="text"
                            value={task.name}
                            onChange={(e) => updateProjectTask(task.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                            placeholder="Ex: Créer la page d'accueil"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Catégorie
                          </label>
                          <select
                            value={task.category}
                            onChange={(e) => updateProjectTask(task.id, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            {taskCategories.map(cat => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={task.description}
                            onChange={(e) => updateProjectTask(task.id, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                            placeholder="Description détaillée de la tâche..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heures estimées
                          </label>
                          <input
                            type="number"
                            value={task.estimatedHours}
                            onChange={(e) => updateProjectTask(task.id, 'estimatedHours', parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priorité
                          </label>
                          <select
                            value={task.priority}
                            onChange={(e) => updateProjectTask(task.id, 'priority', e.target.value as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            <option value="Basse">Basse</option>
                            <option value="Moyenne">Moyenne</option>
                            <option value="Élevée">Élevée</option>
                            <option value="Urgente">Urgente</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assigné à
                          </label>
                          <select
                            value={task.assignee}
                            onChange={(e) => updateProjectTask(task.id, 'assignee', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm"
                          >
                            <option value="">Non assigné</option>
                            {selectedMembers.map(member => (
                              <option key={member} value={member}>{member}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {projectTasks.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche définie</h3>
                      <p className="text-gray-500 mb-4">
                        Ajoutez des tâches pour structurer votre projet
                      </p>
                      <button
                        type="button"
                        onClick={addProjectTask}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer la première tâche
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Documents */}
            {activeTab === 'files' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Documents et Liens</h3>
                
                {/* Upload de fichiers */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Télécharger des fichiers</h4>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-700 mb-2">
                      Glissez-déposez vos fichiers ici ou cliquez pour parcourir
                    </p>
                    <p className="text-sm text-gray-500">
                      Tous types de fichiers acceptés (max 50MB par fichier)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Ajout de liens */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Ajouter des liens externes</h4>
                  <div className="flex space-x-2">
                    <input
                      ref={urlInputRef}
                      type="url"
                      placeholder="https://exemple.com/document"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={addUrlAttachment}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Liste des attachements */}
                {attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Fichiers attachés ({attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {attachment.type === 'file' ? (
                              <FileText className="h-5 w-5 text-gray-500" />
                            ) : (
                              <LinkIcon className="h-5 w-5 text-blue-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                              {attachment.size && (
                                <p className="text-xs text-gray-500">
                                  {(attachment.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {attachment.type === 'url' && (
                              <button
                                type="button"
                                onClick={() => window.open(attachment.url, '_blank')}
                                className="p-1 text-blue-500 hover:text-blue-700"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeAttachment(attachment.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Paramètres Avancés */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Paramètres Avancés</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Méthodologie de Projet
                    </label>
                    <select
                      name="methodology"
                      value={formData.methodology}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    >
                      <option value="Agile">🔄 Agile</option>
                      <option value="Scrum">🏃 Scrum</option>
                      <option value="Kanban">📋 Kanban</option>
                      <option value="Waterfall">🌊 Waterfall</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau de Risque
                    </label>
                    <select
                      name="riskLevel"
                      value={formData.riskLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    >
                      <option value="Faible">🟢 Faible</option>
                      <option value="Moyen">🟡 Moyen</option>
                      <option value="Élevé">🔴 Élevé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée Estimée (jours)
                    </label>
                    <input
                      type="number"
                      name="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                      placeholder="30"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="autoCreateTasks"
                        checked={formData.autoCreateTasks}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Créer automatiquement les tâches définies
                      </span>
                    </label>
                  </div>
                </div>

                {/* Résumé du projet */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Résumé du Projet</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{projectTasks.length}</div>
                      <div className="text-gray-600">Tâches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{metrics.totalHours}h</div>
                      <div className="text-gray-600">Estimées</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedMembers.length}</div>
                      <div className="text-gray-600">Membres</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formData.budget ? `${parseFloat(formData.budget).toLocaleString()} ${formData.currency}` : '0'}
                      </div>
                      <div className="text-gray-600">Budget</div>
                    </div>
                  </div>
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
                <button
                  type="button"
                  className="px-6 py-3 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder comme Brouillon
                </button>
                
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
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le Projet
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

export default NewProjectView;