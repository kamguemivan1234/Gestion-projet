import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, Calendar, Clock, AlertTriangle, CheckCircle, 
  FileImage, FileText, Trash2, Plus, Save 
} from 'lucide-react';

interface NewTaskViewProps {
  onCancel: () => void;
  onCreate: (task: any) => void;
}

interface FileAttachment {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'document';
}

const NewTaskView: React.FC<NewTaskViewProps> = ({ onCancel, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Moyenne',
    startDate: '',
    endDate: '',
    estimatedHours: '',
    assignee: '',
    category: 'Développement',
    tags: '',
    alertStart: true,
    alertDeadline: true,
    alertOverdue: true,
    autoExtendDeadline: false,
    bufferHours: 24
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mise à jour du temps en temps réel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialiser les dates par défaut
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(17, 0, 0, 0); // 17h par défaut pour la fin

    setFormData(prev => ({
      ...prev,
      startDate: now.toISOString().slice(0, 16),
      endDate: tomorrow.toISOString().slice(0, 16)
    }));
  }, []);

  // Calcul automatique du délai avec buffer
  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.estimatedHours) {
      const start = new Date(formData.startDate);
      const estimated = parseFloat(formData.estimatedHours);
      const buffer = formData.bufferHours;
      
      const calculatedEnd = new Date(start);
      calculatedEnd.setHours(calculatedEnd.getHours() + estimated + buffer);
      
      if (new Date(formData.endDate) < calculatedEnd) {
        setFormData(prev => ({
          ...prev,
          endDate: calculatedEnd.toISOString().slice(0, 16)
        }));
      }
    }
  }, [formData.estimatedHours, formData.bufferHours, formData.startDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Effacer l'erreur lors de la modification
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
        return;
      }

      const attachment: FileAttachment = {
        id: Date.now().toString() + Math.random(),
        file,
        type: file.type.startsWith('image/') ? 'image' : 'document'
      };

      // Créer une preview pour les images
      if (attachment.type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [...prev, attachment]);
      }
    });

    // Reset l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est obligatoire';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est obligatoire';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'La date de fin doit être postérieure à la date de début';
      }
    }

    if (!formData.assignee) {
      newErrors.assignee = 'Veuillez sélectionner un assigné';
    }

    if (formData.estimatedHours && parseFloat(formData.estimatedHours) <= 0) {
      newErrors.estimatedHours = 'La durée doit être positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDeadlineStatus = () => {
    if (!formData.startDate || !formData.endDate) return null;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const now = new Date();
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // en heures

    let status = 'normal';
    let message = '';

    if (start < now) {
      status = 'started';
      message = 'La tâche devrait déjà avoir commencé';
    } else if (duration < 4) {
      status = 'urgent';
      message = 'Délai très court (moins de 4h)';
    } else if (duration < 24) {
      status = 'tight';
      message = 'Délai serré (moins de 24h)';
    } else {
      status = 'comfortable';
      message = `Délai confortable (${Math.round(duration)}h)`;
    }

    return { status, message, duration };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const deadlineInfo = calculateDeadlineStatus();
      
      const newTask = {
        ...formData,
        id: Date.now(),
        status: 'À faire',
        progress: 0,
        attachments: attachments,
        deadlineInfo,
        createdAt: new Date().toISOString(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      // Simulation d'un délai de création
      await new Promise(resolve => setTimeout(resolve, 1000));

      onCreate(newTask);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deadlineStatus = calculateDeadlineStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Créer une Nouvelle Tâche</h2>
              <p className="text-sm text-gray-500 mt-1">
                {currentTime.toLocaleString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-indigo-600" />
              Informations de Base
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de la Tâche *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Développer l'interface utilisateur du dashboard"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                >
                  <option value="Développement">💻 Développement</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Marketing">📈 Marketing</option>
                  <option value="Administration">📋 Administration</option>
                  <option value="Support">🛠️ Support</option>
                  <option value="Recherche">🔬 Recherche</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                  placeholder="Décrivez en détail ce qui doit être accompli..."
                />
              </div>
            </div>
          </div>

          {/* Planning et Délais */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Planning et Délais Intelligents
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et Heure de Début *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et Heure de Fin *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée Estimée (heures)
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleInputChange}
                  min="0.5"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
                  placeholder="Ex: 8.5"
                />
                {errors.estimatedHours && <p className="text-red-500 text-sm mt-1">{errors.estimatedHours}</p>}
              </div>
            </div>

            {/* Statut du délai */}
            {deadlineStatus && (
              <div className={`p-3 rounded-lg mb-4 ${
                deadlineStatus.status === 'urgent' ? 'bg-red-100 border border-red-300' :
                deadlineStatus.status === 'tight' ? 'bg-yellow-100 border border-yellow-300' :
                deadlineStatus.status === 'started' ? 'bg-orange-100 border border-orange-300' :
                'bg-green-100 border border-green-300'
              }`}>
                <div className="flex items-center">
                  {deadlineStatus.status === 'urgent' && <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />}
                  {deadlineStatus.status === 'tight' && <Clock className="h-5 w-5 text-yellow-600 mr-2" />}
                  {deadlineStatus.status === 'started' && <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />}
                  {deadlineStatus.status === 'comfortable' && <CheckCircle className="h-5 w-5 text-green-600 mr-2" />}
                  <span className={`font-medium ${
                    deadlineStatus.status === 'urgent' ? 'text-red-800' :
                    deadlineStatus.status === 'tight' ? 'text-yellow-800' :
                    deadlineStatus.status === 'started' ? 'text-orange-800' :
                    'text-green-800'
                  }`}>
                    {deadlineStatus.message}
                  </span>
                </div>
              </div>
            )}

            {/* Options de délai automatique */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Gestion Automatique des Délais</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoExtendDeadline"
                    checked={formData.autoExtendDeadline}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Extension automatique en cas de retard
                  </span>
                </label>
                
                {formData.autoExtendDeadline && (
                  <div className="ml-6">
                    <label className="block text-sm text-gray-600 mb-1">
                      Heures de buffer automatique:
                    </label>
                    <input
                      type="number"
                      name="bufferHours"
                      value={formData.bufferHours}
                      onChange={handleInputChange}
                      min="1"
                      max="72"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-sm text-gray-500 ml-2">heures</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assignation */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigné à *
                </label>
                <select
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 text-base ${
                    errors.assignee ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner un employé</option>
                  <option value="Marie Dubois">👩‍💻 Marie Dubois - Développeuse Senior</option>
                  <option value="Jean Martin">👨‍🎨 Jean Martin - Designer UX/UI</option>
                  <option value="Sophie Bernard">👩‍🔬 Sophie Bernard - Analyste QA</option>
                  <option value="Pierre Leroux">👨‍💼 Pierre Leroux - Chef de Projet</option>
                  <option value="Emma Wilson">👩‍📊 Emma Wilson - Data Analyst</option>
                </select>
                {errors.assignee && <p className="text-red-500 text-sm mt-1">{errors.assignee}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-base"
                  placeholder="urgent, frontend, révision, client"
                />
              </div>
            </div>
          </div>

          {/* Upload de Fichiers */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-green-600" />
              Fichiers et Documents
            </h3>

            <div
              className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-lg text-gray-700 mb-2">
                Glissez-déposez vos fichiers ici ou cliquez pour parcourir
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Images (JPG, PNG, GIF), Documents (PDF, DOC, DOCX), Feuilles de calcul (XLS, XLSX)
              </p>
              <button
                type="button"
                className="bg-green-100 hover:bg-green-200 text-green-700 px-6 py-2 rounded-lg transition-colors"
              >
                Parcourir les Fichiers
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Prévisualisation des fichiers */}
            {attachments.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Fichiers Attachés ({attachments.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          {attachment.type === 'image' ? (
                            <div className="flex-shrink-0">
                              {attachment.preview ? (
                                <img
                                  src={attachment.preview}
                                  alt={attachment.file.name}
                                  className="h-12 w-12 object-cover rounded"
                                />
                              ) : (
                                <FileImage className="h-12 w-12 text-blue-500" />
                              )}
                            </div>
                          ) : (
                            <FileText className="h-12 w-12 text-gray-500 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(attachment.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                              {attachment.file.type}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
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

          {/* Notifications et Alertes */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Notifications et Alertes Intelligentes
            </h3>

            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="alertStart"
                  checked={formData.alertStart}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-600 rounded mt-1"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">
                    Alerte au début de la tâche
                  </span>
                  <p className="text-xs text-gray-500">
                    Notification envoyée à l'heure de début prévue
                  </p>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="alertDeadline"
                  checked={formData.alertDeadline}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-600 rounded mt-1"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">
                    Alerte avant échéance (24h)
                  </span>
                  <p className="text-xs text-gray-500">
                    Rappel automatique 24h avant la date limite
                  </p>
                </div>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="alertOverdue"
                  checked={formData.alertOverdue}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-yellow-600 rounded mt-1"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">
                    Alerte automatique de retard
                  </span>
                  <p className="text-xs text-gray-500">
                    Notification immédiate si la tâche dépasse la date limite
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 -mb-6 rounded-b-xl">
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
                      Création...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer la Tâche
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

export default NewTaskView;