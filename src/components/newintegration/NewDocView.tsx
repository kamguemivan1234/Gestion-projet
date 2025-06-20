import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, Calendar, Clock, Users, FileText, Tag, Save, Plus,
  AlertCircle, Eye, Link as LinkIcon, Trash2, Lock, Globe,
  BookOpen, Folder, Settings, CheckCircle, User
} from 'lucide-react';

interface NewDocViewProps {
  onCancel: () => void;
  onCreate: (document: any) => void;
  existingMembers?: string[];
  existingProjects?: any[];
  existingFolders?: any[];
}

interface FileAttachment {
  id: string;
  file?: File;
  url?: string;
  name: string;
  type: 'file' | 'url' | 'template';
  size?: number;
}

interface TeamMember {
  name: string;
  permission: 'read' | 'write' | 'admin';
}

const documentTypes = [
  { value: 'specification', label: '📋 Cahier des charges', description: 'Spécifications détaillées du projet' },
  { value: 'guide', label: '📚 Guide utilisateur', description: 'Instructions et mode d\'emploi' },
  { value: 'report', label: '📊 Rapport', description: 'Rapport d\'activité ou d\'analyse' },
  { value: 'meeting', label: '📝 Compte-rendu', description: 'Notes et décisions de réunion' },
  { value: 'procedure', label: '⚙️ Procédure', description: 'Processus et méthodologie' },
  { value: 'template', label: '📄 Modèle', description: 'Template réutilisable' },
  { value: 'contract', label: '📜 Contrat', description: 'Documents contractuels' },
  { value: 'presentation', label: '🎯 Présentation', description: 'Support de présentation' },
  { value: 'architecture', label: '🏗️ Architecture', description: 'Documentation technique' },
  { value: 'other', label: '📎 Autre', description: 'Document personnalisé' }
];

const documentTemplates = [
  { id: 'blank', name: 'Document vierge', description: 'Commencer avec un document vide' },
  { id: 'meeting-notes', name: 'Notes de réunion', description: 'Template pour compte-rendu de réunion' },
  { id: 'specification', name: 'Cahier des charges', description: 'Structure pour spécifications projet' },
  { id: 'user-guide', name: 'Guide utilisateur', description: 'Template pour documentation utilisateur' },
  { id: 'technical-doc', name: 'Documentation technique', description: 'Structure pour documentation API/tech' },
  { id: 'project-plan', name: 'Plan de projet', description: 'Template de planification projet' }
];

const teamMembers = [
  'Marie Dubois', 'Jean Martin', 'Sophie Bernard', 'Pierre Leroux', 
  'Emma Wilson', 'Thomas Martin', 'Lucie Petit', 'Paul Leroy'
];

const folders = [
  { id: 1, name: 'Documentation', path: '/Documentation' },
  { id: 2, name: 'Guides', path: '/Guides' },
  { id: 3, name: 'Comptes-rendus', path: '/Comptes-rendus' },
  { id: 4, name: 'Marketing', path: '/Marketing' },
  { id: 5, name: 'Ressources', path: '/Ressources' },
  { id: 6, name: 'Templates', path: '/Templates' },
  { id: 7, name: 'Archives', path: '/Archives' }
];

const NewDocView: React.FC<NewDocViewProps> = ({ 
  onCancel, 
  onCreate, 
  existingMembers = teamMembers,
  existingProjects = [],
  existingFolders = folders
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'permissions' | 'settings'>('basic');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'specification',
    category: 'Documentation',
    folderId: '',
    dueDate: '',
    priority: 'Moyenne' as 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente',
    status: 'Brouillon' as 'Brouillon' | 'En révision' | 'Approuvé' | 'Publié' | 'Archivé',
    tags: '',
    projectId: '',
    templateId: 'blank',
    content: '',
    isPublic: false,
    allowComments: true,
    versionControl: true,
    autoSave: true,
    notifyOnChange: true,
    language: 'fr'
  });

  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    tomorrow.setHours(17, 0, 0, 0);
    
    setFormData(prev => ({
      ...prev,
      dueDate: tomorrow.toISOString().slice(0, 16)
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

  const handleMemberToggle = (memberName: string) => {
    const existingMember = selectedMembers.find(m => m.name === memberName);
    
    if (existingMember) {
      setSelectedMembers(prev => prev.filter(m => m.name !== memberName));
    } else {
      setSelectedMembers(prev => [...prev, { name: memberName, permission: 'read' }]);
    }
  };

  const updateMemberPermission = (memberName: string, permission: 'read' | 'write' | 'admin') => {
    setSelectedMembers(prev => 
      prev.map(member => 
        member.name === memberName ? { ...member, permission } : member
      )
    );
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
      new URL(url);
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

    if (!formData.title.trim()) newErrors.title = 'Le titre est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!formData.type) newErrors.type = 'Le type de document est obligatoire';

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const now = new Date();
      if (dueDate <= now) {
        newErrors.dueDate = 'La date d\'échéance doit être dans le futur';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const documentData = {
        ...formData,
        id: Date.now(),
        author: 'Utilisateur Actuel', // Remplacer par l'utilisateur connecté
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        members: selectedMembers,
        attachments,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        projectId: formData.projectId ? parseInt(formData.projectId) : undefined,
        folderId: formData.folderId ? parseInt(formData.folderId) : undefined,
        starred: false,
        views: 0,
        version: '1.0'
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      onCreate(documentData);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocumentTypeInfo = () => {
    return documentTypes.find(type => type.value === formData.type);
  };

  const getSelectedTemplate = () => {
    return documentTemplates.find(template => template.id === formData.templateId);
  };

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
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Créer un Nouveau Document</h2>
              <p className="text-blue-100 mt-1">
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
            <TabButton tab="basic" icon={<FileText className="h-4 w-4" />} label="Informations Générales" />
            <TabButton tab="content" icon={<BookOpen className="h-4 w-4" />} label="Contenu & Template" />
            <TabButton tab="permissions" icon={<Users className="h-4 w-4" />} label="Équipe & Permissions" />
            <TabButton tab="settings" icon={<Settings className="h-4 w-4" />} label="Paramètres Avancés" />
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
                      Titre du Document *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Guide d'utilisation de l'application mobile"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de Document *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                        errors.type ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      {documentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                    {getDocumentTypeInfo() && (
                      <p className="text-xs text-gray-500 mt-1">{getDocumentTypeInfo()?.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dossier</label>
                    <select
                      name="folderId"
                      value={formData.folderId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    >
                      <option value="">Racine</option>
                      {existingFolders.map(folder => (
                        <option key={folder.id} value={folder.id.toString()}>
                          📁 {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Décrivez le contenu et l'objectif du document..."
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'Échéance (optionnelle)
                    </label>
                    <input
                      type="datetime-local"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-base ${
                        errors.dueDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
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
                      <option value="Brouillon">📝 Brouillon</option>
                      <option value="En révision">👀 En révision</option>
                      <option value="Approuvé">✅ Approuvé</option>
                      <option value="Publié">🌐 Publié</option>
                      <option value="Archivé">📦 Archivé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Projet Associé</label>
                    <select
                      name="projectId"
                      value={formData.projectId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    >
                      <option value="">Aucun projet</option>
                      {existingProjects.map(project => (
                        <option key={project.id} value={project.id.toString()}>
                          🎯 {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mots-clés/Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                      placeholder="guide, utilisateur, mobile, important (séparés par des virgules)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Contenu & Template */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modèle de Document
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documentTemplates.map(template => (
                      <label
                        key={template.id}
                        className={`relative flex p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          formData.templateId === template.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="templateId"
                          value={template.id}
                          checked={formData.templateId === template.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                            {formData.templateId === template.id && (
                              <CheckCircle className="h-4 w-4 text-indigo-600 ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {getSelectedTemplate() && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Template sélectionné:</strong> {getSelectedTemplate()?.description}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu Initial (optionnel)
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base font-mono"
                    placeholder="Saisissez le contenu initial du document... 

Vous pouvez utiliser du Markdown:
# Titre principal
## Sous-titre
- Liste à puces
**Texte en gras**
*Texte en italique*

Le contenu sera formaté automatiquement."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Support du format Markdown pour la mise en forme
                  </p>
                </div>

                {/* Upload de fichiers de référence */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Documents de Référence</h4>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-700 mb-2">
                      Ajoutez des documents de référence
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF, Word, Excel, Images, etc. (max 50MB par fichier)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                </div>

                {/* Ajout de liens */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Liens de Référence</h4>
                  <div className="flex space-x-2">
                    <input
                      ref={urlInputRef}
                      type="url"
                      placeholder="https://exemple.com/ressource"
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
                      Fichiers Attachés ({attachments.length})
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

            {/* Tab: Équipe & Permissions */}
            {activeTab === 'permissions' && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                    <h4 className="font-medium text-amber-800">Gestion des Accès</h4>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Définissez qui peut accéder au document et avec quelles permissions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Globe className="h-4 w-4 mr-2" />
                      Visibilité du Document
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPublic"
                          checked={!formData.isPublic}
                          onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900 flex items-center">
                            <Lock className="h-4 w-4 mr-1 text-gray-600" />
                            Privé
                          </span>
                          <p className="text-xs text-gray-500">Visible uniquement par les membres sélectionnés</p>
                        </div>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="isPublic"
                          checked={formData.isPublic}
                          onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <div className="ml-3">
                          <span className="text-sm font-medium text-gray-900 flex items-center">
                            <Globe className="h-4 w-4 mr-1 text-green-600" />
                            Public
                          </span>
                          <p className="text-xs text-gray-500">Visible par tous les membres de l'organisation</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Settings className="h-4 w-4 mr-2" />
                      Options de Collaboration
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="allowComments"
                          checked={formData.allowComments}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Autoriser les commentaires</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="versionControl"
                          checked={formData.versionControl}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Contrôle de version automatique</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="notifyOnChange"
                          checked={formData.notifyOnChange}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-indigo-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Notifier les modifications</span>
                      </label>
                    </div>
                  </div>
                </div>

                {!formData.isPublic && (
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                      <Users className="h-4 w-4 mr-2" />
                      Membres de l'Équipe
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {existingMembers.map(member => (
                          <label key={member} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedMembers.some(m => m.name === member)}
                              onChange={() => handleMemberToggle(member)}
                              className="h-4 w-4 text-indigo-600 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{member}</span>
                          </label>
                        ))}
                      </div>

                      {selectedMembers.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Permissions des Membres
                          </h4>
                          <div className="space-y-3">
                            {selectedMembers.map(member => (
                              <div key={member.name} className="flex items-center justify-between bg-white p-3 rounded border">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm font-medium text-gray-900">{member.name}</span>
                                </div>
                                <select
                                  value={member.permission}
                                  onChange={(e) => updateMemberPermission(member.name, e.target.value as any)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="read">👁️ Lecture seule</option>
                                  <option value="write">✏️ Modification</option>
                                  <option value="admin">👑 Administration</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Paramètres Avancés */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    >
                      <option value="Documentation">📚 Documentation</option>
                      <option value="Guide">📖 Guide</option>
                      <option value="Procedure">⚙️ Procédure</option>
                      <option value="Template">📄 Template</option>
                      <option value="Marketing">📢 Marketing</option>
                      <option value="Legal">⚖️ Légal</option>
                      <option value="Technical">🔧 Technique</option>
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
                      <option value="fr">🇫🇷 Français</option>
                      <option value="en">🇺🇸 English</option>
                      <option value="es">🇪🇸 Español</option>
                      <option value="de">🇩🇪 Deutsch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres Automatiques
                  </label>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">Sauvegarde automatique</span>
                        <p className="text-xs text-gray-500">Sauvegarde les modifications toutes les 30 secondes</p>
                      </div>
                      <input
                        type="checkbox"
                        name="autoSave"
                        checked={formData.autoSave}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Résumé du document */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Résumé du Document</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedMembers.length}</div>
                      <div className="text-gray-600">Collaborateurs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{attachments.length}</div>
                      <div className="text-gray-600">Fichiers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formData.tags.split(',').filter(tag => tag.trim()).length}
                      </div>
                      <div className="text-gray-600">Tags</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formData.isPublic ? 'Public' : 'Privé'}
                      </div>
                      <div className="text-gray-600">Visibilité</div>
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
                      Créer le Document
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

export default NewDocView;