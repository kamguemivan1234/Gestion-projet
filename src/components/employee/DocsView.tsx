import React, { useState } from 'react';
import { Search, FolderOpen, FileText, Star, Clock, Download, Eye, Filter, Calendar, User, Tag, BookOpen, Share2, ChevronDown, AlertCircle, CheckCircle, X, Plus, Copy, ExternalLink } from 'lucide-react';

// Documents accessibles à l'employé (limités à ses projets et équipe)
const employeeDocuments = [
  {
    id: 1,
    titre: 'Guide d\'Onboarding - Équipe Dev',
    description: 'Guide complet pour les nouveaux développeurs de l\'équipe.',
    auteur: 'Marie Dupont',
    'dernière modification': '2025-06-10',
    'catégorie': 'Guide',
    'étoilé': true,
    type: 'guide',
    'priorité': 'Élevée',
    statut: 'Publié',
    tags: 'onboarding, développement, équipe',
    projectId: '1',
    projectName: 'Refonte Site Web',
    contenu: 'Ce guide présente tous les processus et outils utilisés par l\'équipe de développement. Il couvre la configuration de l\'environnement, les standards de code, les processus de déploiement et les bonnes pratiques.',
    taille: '1.2 MB',
    version: '2.1',
    'créé': '2025-05-15',
    canEdit: false,
    canDownload: true,
    shared: true
  },
  {
    id: 2,
    titre: 'Spécifications Techniques - Module Auth',
    description: 'Documentation technique du module d\'authentification.',
    auteur: 'Thomas Martin',
    'dernière modification': '2025-06-08',
    'catégorie': 'Documentation',
    'étoilé': false,
    type: 'spécification',
    'priorité': 'Élevée',
    statut: 'Approuvé',
    tags: 'authentification, sécurité, api',
    projectId: '1',
    projectName: 'Refonte Site Web',
    contenu: 'Spécifications détaillées du module d\'authentification incluant les flux OAuth, la gestion des tokens, les politiques de sécurité et les endpoints API.',
    taille: '2.8 MB',
    version: '1.5',
    'créé': '2025-05-20',
    canEdit: false,
    canDownload: true,
    shared: true
  },
  {
    id: 3,
    titre: 'Plan de Tests - Sprint 3',
    description: 'Plan de tests pour les fonctionnalités du sprint 3.',
    auteur: 'Sophie Bernard',
    'dernière modification': '2025-06-05',
    'catégorie': 'Test',
    'étoilé': true,
    type: 'test',
    'priorité': 'Moyenne',
    statut: 'En cours',
    tags: 'tests, sprint3, qa',
    projectId: '2',
    projectName: 'Application Mobile',
    contenu: 'Plan de tests complet pour le sprint 3 incluant les tests unitaires, tests d\'intégration et tests end-to-end. Couvre les nouvelles fonctionnalités et les cas de régression.',
    taille: '0.9 MB',
    version: '1.0',
    'créé': '2025-06-01',
    canEdit: true,
    canDownload: true,
    shared: false
  },
  {
    id: 4,
    titre: 'Mes Notes - Réunion Équipe',
    description: 'Notes personnelles de la réunion d\'équipe du 03/06.',
    auteur: 'Moi',
    'dernière modification': '2025-06-03',
    'catégorie': 'Personnel',
    'étoilé': false,
    type: 'notes',
    'priorité': 'Basse',
    statut: 'Brouillon',
    tags: 'réunion, notes, personnel',
    projectId: '',
    projectName: '',
    contenu: 'Notes prises pendant la réunion d\'équipe : nouvelles procédures, objectifs du trimestre, points à retenir pour les prochaines tâches.',
    taille: '0.3 MB',
    version: '1.0',
    'créé': '2025-06-03',
    canEdit: true,
    canDownload: true,
    shared: false
  },
  {
    id: 5,
    titre: 'Standards de Code - Frontend',
    description: 'Guide des standards et conventions de code pour le frontend.',
    auteur: 'Jean Dubois',
    'dernière modification': '2025-05-30',
    'catégorie': 'Guide',
    'étoilé': true,
    type: 'guide',
    'priorité': 'Élevée',
    statut: 'Publié',
    tags: 'standards, frontend, code',
    projectId: '1',
    projectName: 'Refonte Site Web',
    contenu: 'Guide complet des standards de développement frontend : conventions de nommage, structure des composants, gestion des styles, optimisation des performances.',
    taille: '1.8 MB',
    version: '3.2',
    'créé': '2025-04-15',
    canEdit: false,
    canDownload: true,
    shared: true
  }
];

// Projets de l'employé
const myProjects = [
  { id: '1', name: 'Refonte Site Web' },
  { id: '2', name: 'Application Mobile' },
  { id: '3', name: 'Système CRM' }
];

// Composant pour le partage
const ShareModal: React.FC<{
  document: any;
  onClose: () => void;
  onShare: (message: string) => void;
}> = ({ document, onClose, onShare }) => {
  const shareOptions = [
    { name: 'WhatsApp', icon: '💬', color: 'bg-green-500', url: (text: string, url: string) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}` },
    { name: 'Telegram', icon: '✈️', color: 'bg-blue-500', url: (text: string, url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}` },
    { name: 'Twitter', icon: '🐦', color: 'bg-blue-400', url: (text: string, url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', icon: '💼', color: 'bg-blue-700', url: (text: string, url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: 'Email', icon: '✉️', color: 'bg-gray-600', url: (text: string, url: string) => `mailto:?subject=${encodeURIComponent('Document partagé: ' + document.titre)}&body=${encodeURIComponent(text + '\n\n' + url)}` },
    { name: 'Discord', icon: '🎮', color: 'bg-indigo-600', url: (text: string, url: string) => `https://discord.com/channels/@me` },
    { name: 'Slack', icon: '💬', color: 'bg-purple-600', url: (text: string, url: string) => `https://slack.com/intl/fr-fr/` },
    { name: 'GitHub', icon: '🐱', color: 'bg-gray-800', url: (text: string, url: string) => `https://github.com` }
  ];

  const shareText = `Découvrez ce document: ${document.titre} - ${document.description}`;
  const shareUrl = `${window.location.origin}/document/${document.id}`;

  const handleShare = (option: any) => {
    const url = option.url(shareText, shareUrl);
    window.open(url, '_blank');
    onShare(`Document partagé via ${option.name}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      onShare('Lien copié dans le presse-papiers !');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Partager le document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">{document.titre}</h4>
            <p className="text-sm text-gray-500">{document.description}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Lien du document</label>
            <div className="flex">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
              />
              <button 
                onClick={copyToClipboard}
                className="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Partager via</label>
            <div className="grid grid-cols-4 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleShare(option)}
                  className={`flex flex-col items-center p-3 rounded-lg ${option.color} text-white hover:opacity-90 transition-opacity`}
                >
                  <span className="text-xl mb-1">{option.icon}</span>
                  <span className="text-xs font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour créer une note
const CreateNoteModal: React.FC<{
  onClose: () => void;
  onSave: (note: any) => void;
  projects: any[];
}> = ({ onClose, onSave, projects }) => {
  const [noteData, setNoteData] = useState({
    titre: '',
    description: '',
    contenu: '',
    projectId: '',
    tags: ''
  });

  const handleSave = () => {
    if (!noteData.titre.trim() || !noteData.contenu.trim()) {
      alert('Veuillez remplir au moins le titre et le contenu');
      return;
    }

    const newDocument = {
      id: Date.now(),
      titre: noteData.titre,
      description: noteData.description || 'Note personnelle',
      auteur: 'Moi',
      'dernière modification': new Date().toISOString().split('T')[0],
      'catégorie': 'Personnel',
      'étoilé': false,
      type: 'notes',
      'priorité': 'Basse',
      statut: 'Brouillon',
      tags: noteData.tags || 'personnel, notes',
      projectId: noteData.projectId,
      projectName: projects.find(p => p.id === noteData.projectId)?.name || '',
      contenu: noteData.contenu,
      taille: Math.round(noteData.contenu.length / 1024 * 100) / 100 + ' KB',
      version: '1.0',
      'créé': new Date().toISOString().split('T')[0],
      canEdit: true,
      canDownload: true,
      shared: false
    };

    onSave(newDocument);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900">Créer une nouvelle note</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={noteData.titre}
                onChange={(e) => setNoteData({...noteData, titre: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                placeholder="Titre de votre note..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={noteData.description}
                onChange={(e) => setNoteData({...noteData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                placeholder="Brève description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Projet</label>
              <select
                value={noteData.projectId}
                onChange={(e) => setNoteData({...noteData, projectId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
              >
                <option value="">Aucun projet spécifique</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={noteData.tags}
                onChange={(e) => setNoteData({...noteData, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                placeholder="Séparez les tags par des virgules..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu <span className="text-red-500">*</span>
              </label>
              <textarea
                value={noteData.contenu}
                onChange={(e) => setNoteData({...noteData, contenu: e.target.value})}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                placeholder="Écrivez votre note ici..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Créer la note
          </button>
        </div>
      </div>
    </div>
  );
};

// Vue détaillée du document (version employé - lecture seule principalement)
const DocumentDetailView: React.FC<{
  document: any;
  onClose: () => void;
  onToggleStar: (id: number) => void;
  onDownload: (document: any) => void;
  onShare: (document: any) => void;
}> = ({ document, onClose, onToggleStar, onDownload, onShare }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Brouillon': return 'bg-gray-100 text-gray-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'Publié': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorité: string) => {
    switch (priorité) {
      case 'Basse': return 'text-green-600 bg-green-100';
      case 'Moyenne': return 'text-yellow-600 bg-yellow-100';
      case 'Élevée': return 'text-orange-600 bg-orange-100';
      case 'Urgente': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.titre}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.statut)}`}>
                  {document.statut}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(document['priorité'])}`}>
                  {document['priorité']}
                </span>
                {document.shared && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Share2 className="h-3 w-3 mr-1" />
                    Partagé
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleStar(document.id)}
              className={`p-2 rounded-md hover:bg-gray-100 ${document['étoilé'] ? 'text-yellow-500' : 'text-gray-400'}`}
              title={document['étoilé'] ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Star className={`h-5 w-5 ${document['étoilé'] ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contenu principal */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-700">{document.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Contenu</h3>
                  <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{document.contenu}</p>
                  </div>
                </div>

                {/* Tags */}
                {document.tags && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {document.tags.split(',').map((tag: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar avec métadonnées */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Informations</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Auteur:</span>
                      <span className="text-gray-900 ml-2">{document.auteur}</span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Créé:</span>
                      <span className="text-gray-900 ml-2">{document['créé']}</span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Modifié:</span>
                      <span className="text-gray-900 ml-2">{document['dernière modification']}</span>
                    </div>

                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900 ml-2">{document.type}</span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-600">Taille:</span>
                      <span className="text-gray-900 ml-2">{document.taille}</span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-gray-600">Version:</span>
                      <span className="text-gray-900 ml-2">{document.version}</span>
                    </div>

                    {document.projectName && (
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Projet:</span>
                        <span className="text-gray-900 ml-2">{document.projectName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions disponibles */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
                  <div className="space-y-2">
                    {document.canDownload && (
                      <button 
                        onClick={() => onDownload(document)}
                        className="w-full flex items-center justify-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </button>
                    )}
                    
                    {document.canEdit && (
                      <button className="w-full flex items-center justify-center px-3 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition-colors">
                        <FileText className="h-4 w-4 mr-2" />
                        Modifier mes notes
                      </button>
                    )}

                    <button 
                      onClick={() => onShare(document)}
                      className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager le lien
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeDocsView = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [documentsList, setDocumentsList] = useState(employeeDocuments);
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [showDocumentDetail, setShowDocumentDetail] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [documentToShare, setDocumentToShare] = useState<any>(null);

  const filteredDocuments = documentsList.filter(doc => {
    const matchesSearch = doc.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject = selectedProject === '' || doc.projectId === selectedProject;

    let matchesFilter = true;
    if (activeFilter === 'starred') matchesFilter = doc['étoilé'];
    else if (activeFilter === 'my-docs') matchesFilter = doc.auteur === 'Moi';
    else if (activeFilter === 'shared') matchesFilter = doc.shared;
    else if (activeFilter === 'recent') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      matchesFilter = new Date(doc['dernière modification']) >= lastWeek;
    }

    return matchesSearch && matchesProject && matchesFilter;
  });

  // Fonction pour afficher une notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fonction pour basculer le statut favori
  const handleToggleStar = (documentId: number) => {
    setDocumentsList(prev =>
      prev.map(doc =>
        doc.id === documentId ? { ...doc, 'étoilé': !doc['étoilé'] } : doc
      )
    );

    const doc = documentsList.find(d => d.id === documentId);
    showNotification('success', doc?.['étoilé'] ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  // Fonction pour ouvrir la vue détaillée
  const handleViewDocument = (document: any) => {
    setViewingDocument(document);
    setShowDocumentDetail(true);
  };

  // Fonction pour fermer les modales
  const handleCloseDetail = () => {
    setShowDocumentDetail(false);
    setViewingDocument(null);
  };

  // Fonction améliorée pour télécharger un document - GARANTIE DE FONCTIONNER
  const handleDownload = (document: any) => {
    console.log('🔽 Début du téléchargement pour:', document.titre);

    try {
      // Créer le contenu formaté
      const content = `================================
📄 DOCUMENT: ${document.titre}
================================

📋 INFORMATIONS GÉNÉRALES:
-----------------------
Titre: ${document.titre}
Description: ${document.description}
Auteur: ${document.auteur}
Date de création: ${document['créé']}
Dernière modification: ${document['dernière modification']}
Projet: ${document.projectName || 'Aucun'}
Type: ${document.type}
Catégorie: ${document['catégorie']}
Version: ${document.version}
Taille: ${document.taille}
Statut: ${document.statut}
Priorité: ${document['priorité']}
Tags: ${document.tags}

📝 CONTENU DU DOCUMENT:
-------------------
${document.contenu}

================================
⏰ Téléchargé le: ${new Date().toLocaleString('fr-FR')}
🌐 Source: Gestionnaire de Documents
================================`;

      // Nom de fichier sécurisé avec timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const safeTitle = document.titre
        .replace(/[^a-zA-Z0-9\s\-_]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase()
        .substring(0, 30);
      
      const filename = `${safeTitle}_${timestamp}.txt`;

      console.log('📁 Nom du fichier:', filename);
      console.log('📄 Taille du contenu:', content.length, 'caractères');

      // Méthode 1: Blob + URL.createObjectURL (la plus fiable)
      const blob = new Blob([content], { 
        type: 'text/plain;charset=utf-8' 
      });

      console.log('🧩 Blob créé, taille:', blob.size, 'bytes');

      // Créer une URL temporaire
      const url = URL.createObjectURL(blob);
      console.log('🔗 URL créée:', url);

      // Créer un élément de lien
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      
      // Ajouter au DOM pour certains navigateurs
      document.body.appendChild(downloadLink);
      
      console.log('⬇️ Déclenchement du téléchargement...');
      
      // Déclencher le téléchargement
      downloadLink.click();
      
      // Nettoyer immédiatement
      setTimeout(() => {
        console.log('🧹 Nettoyage...');
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      }, 100);

      console.log('✅ Téléchargement déclenché avec succès !');
      showNotification('success', `📁 Document "${document.titre}" téléchargé !`);

    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      
      // Méthode de secours: Data URI
      try {
        console.log('🔄 Tentative avec Data URI...');
        
        const content = `DOCUMENT: ${document.titre}\n\n${document.contenu}\n\nTéléchargé le: ${new Date().toLocaleString()}`;
        const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute("href", dataStr);
        downloadLink.setAttribute("download", `${document.titre.replace(/[^a-z0-9]/gi, '_')}.txt`);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        console.log('✅ Téléchargement Data URI réussi !');
        showNotification('success', '📁 Document téléchargé (méthode alternative) !');
        
      } catch (dataUriError) {
        console.error('❌ Erreur Data URI:', dataUriError);
        
        // Dernière méthode: Nouvelle fenêtre avec bouton de téléchargement
        console.log('🔄 Ouverture d\'une nouvelle fenêtre...');
        
        const content = `DOCUMENT: ${document.titre}\n\n${document.contenu}`;
        const newWindow = window.open('', '_blank');
        
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${document.titre}</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .download-btn { 
                    position: fixed; 
                    top: 10px; 
                    right: 10px; 
                    padding: 10px 20px; 
                    background: #4F46E5; 
                    color: white; 
                    border: none; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    font-size: 14px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  }
                  .download-btn:hover { background: #4338CA; }
                  .content { white-space: pre-wrap; line-height: 1.6; }
                </style>
              </head>
              <body>
                <button class="download-btn" onclick="downloadFile()">
                  📥 Télécharger le fichier
                </button>
                <div class="content">${content.replace(/\n/g, '\\n').replace(/"/g, '\\"')}</div>
                
                <script>
                  function downloadFile() {
                    const content = \`${content.replace(/`/g, '\\`')}\`;
                    const blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '${document.titre.replace(/[^a-z0-9]/gi, '_')}.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    alert('✅ Fichier téléchargé !');
                  }
                </script>
              </body>
            </html>
          `);
          
          console.log('✅ Nouvelle fenêtre ouverte avec succès !');
          showNotification('info', '🔗 Document ouvert dans une nouvelle fenêtre. Cliquez sur le bouton bleu pour télécharger.');
        } else {
          console.error('❌ Impossible d\'ouvrir une nouvelle fenêtre');
          showNotification('error', '❌ Téléchargement impossible. Veuillez autoriser les pop-ups ou essayer un autre navigateur.');
        }
      }
    }
  };

  // Fonction pour partager un document
  const handleShare = (document: any) => {
    setDocumentToShare(document);
    setShowShareModal(true);
  };

  // Fonction pour créer une nouvelle note
  const handleCreateNote = (newDocument: any) => {
    setDocumentsList(prev => [newDocument, ...prev]);
    setShowCreateNote(false);
    showNotification('success', 'Note créée avec succès !');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Brouillon': return 'bg-gray-100 text-gray-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'Publié': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorité: string) => {
    switch (priorité) {
      case 'Basse': return 'text-green-600';
      case 'Moyenne': return 'text-yellow-600';
      case 'Élevée': return 'text-orange-600';
      case 'Urgente': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mes Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Accédez aux documents de vos projets et créez vos notes personnelles
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCreateNote(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer une note
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Recherche */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-base"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Filtres</h3>
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveFilter('all')}
                >
                  <FileText className="mr-3 h-4 w-4" />
                  Tous les documents
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === 'starred'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveFilter('starred')}
                >
                  <Star className="mr-3 h-4 w-4" />
                  Favoris
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === 'my-docs'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveFilter('my-docs')}
                >
                  <User className="mr-3 h-4 w-4" />
                  Mes documents
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === 'shared'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveFilter('shared')}
                >
                  <Share2 className="mr-3 h-4 w-4" />
                  Partagés avec moi
                </button>
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeFilter === 'recent'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setActiveFilter('recent')}
                >
                  <Clock className="mr-3 h-4 w-4" />
                  Récents
                </button>
              </nav>
            </div>

            {/* Projets */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Mes Projets</h3>
              <div className="relative">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Tous les projets</option>
                  {myProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Zone principale */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {activeFilter === 'all' ? 'Tous mes documents' :
                    activeFilter === 'starred' ? 'Documents favoris' :
                    activeFilter === 'my-docs' ? 'Mes documents personnels' :
                    activeFilter === 'shared' ? 'Documents partagés' :
                    activeFilter === 'recent' ? 'Documents récents' : 'Documents'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} trouvé{filteredDocuments.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {filteredDocuments.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Trier par:</span>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Date modifiée</option>
                      <option>Nom</option>
                      <option>Auteur</option>
                      <option>Projet</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {filteredDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? 'Aucun document ne correspond à votre recherche.' 
                    : 'Vous n\'avez pas encore de documents dans cette catégorie.'
                  }
                </p>
                <button 
                  onClick={() => setShowCreateNote(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer ma première note
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredDocuments.map(doc => (
                  <li key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                            <FileText className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center">
                              <h3 
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                onClick={() => handleViewDocument(doc)}
                              >
                                {doc.titre}
                              </h3>
                              {doc['étoilé'] && (
                                <Star className="ml-2 h-4 w-4 text-yellow-400 fill-current" />
                              )}
                              {doc.shared && (
                                <Share2 className="ml-2 h-4 w-4 text-blue-500" />
                              )}
                              <span className={`ml-2 inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${getPriorityColor(doc['priorité'])}`}>
                                •
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{doc.description}</p>

                            {/* Informations supplémentaires */}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              {doc.projectName && (
                                <span className="flex items-center">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {doc.projectName}
                                </span>
                              )}
                              <span>v{doc.version}</span>
                              <span>{doc.taille}</span>
                            </div>

                            {/* Tags */}
                            {doc.tags && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {doc.tags.split(',').slice(0, 3).map((tag: string, index: number) => (
                                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    {tag.trim()}
                                  </span>
                                ))}
                                {doc.tags.split(',').length > 3 && (
                                  <span className="text-xs text-gray-400">+{doc.tags.split(',').length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">{doc.auteur}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.statut)}`}>
                                {doc.statut}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Modifié le {doc['dernière modification']}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleStar(doc.id)}
                              className={`p-2 rounded-md hover:bg-gray-100 ${doc['étoilé'] ? 'text-yellow-500' : 'text-gray-400'}`}
                              title={doc['étoilé'] ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            >
                              <Star className={`h-4 w-4 ${doc['étoilé'] ? 'fill-current' : ''}`} />
                            </button>
                            
                            {doc.canDownload && (
                              <button
                                onClick={() => handleDownload(doc)}
                                className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Télécharger le document"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}

                            <button
                              onClick={() => handleShare(doc)}
                              className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                              title="Partager"
                            >
                              <Share2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleViewDocument(doc)}
                              className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal de vue détaillée */}
      {showDocumentDetail && viewingDocument && (
        <DocumentDetailView
          document={viewingDocument}
          onClose={handleCloseDetail}
          onToggleStar={handleToggleStar}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}

      {/* Modal de création de note */}
      {showCreateNote && (
        <CreateNoteModal
          onClose={() => setShowCreateNote(false)}
          onSave={handleCreateNote}
          projects={myProjects}
        />
      )}

      {/* Modal de partage */}
      {showShareModal && documentToShare && (
        <ShareModal
          document={documentToShare}
          onClose={() => {
            setShowShareModal(false);
            setDocumentToShare(null);
          }}
          onShare={(message) => {
            showNotification('success', message);
            setShowShareModal(false);
            setDocumentToShare(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeDocsView;