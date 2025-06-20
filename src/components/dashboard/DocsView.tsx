import React, { useState } from 'react';
import { Plus, Search, FolderOpen, FileText, Star, Clock, Trash2, MoreHorizontal, Edit3, Eye, Download, Archive, AlertTriangle, CheckCircle, X, Calendar, User, Tag, FolderIcon } from 'lucide-react';
import NewDocView from '../newintegration/NewDocView';

// Exemples de documents data avec contenu étendu
const initialDocuments = [
{
id : 1,
titre : 'Cahier des Charges - Application Collaborative',
description : 'Spécifications détaillées pour le développement de l\'application de gestion de travail collaboratif.',
auteur : 'Marie Dupont',
'dernière modification' : '2025-06-10',
'catégorie' : 'Documentation',
'étoilé' : true,
type : 'spécification',
'priorité' : 'Élevée',
statut : 'Approuvé',
tags : 'application, collaborative, spécifications',
dossierId : '1',
projectId : '1',
contenu : 'Ce document présente les spécifications complètes pour le développement d\'une application collaborative. Il inclut les exigences fonctionnelles, les contraintes techniques, les délais de livraison et les critères d\'acceptation. L\'application devra permettre la gestion de projets en équipe avec des fonctionnalités de partage de documents, de communication en temps réel et de suivi des tâches.',
taille : '2.4 MB',
version : '1.2',
'créé' : '2025-05-15'
},
{
id : 2,
titre : 'Guide d\'Utilisation - Interface Admin',
description : 'Instructions détaillées pour l\'utilisation de l\'interface d\'administration.',
auteur : 'Thomas Martin',
'dernière modification' : '2025-06-05',
'catégorie' : 'Guide',
'étoilé' : false,
type : 'guide',
'priorité' : 'Moyenne',
statut : 'Publié',
tags : 'guide, admin, interface',
dossierId : '2',
projectId : '',
contenu : 'Ce guide complet explique toutes les fonctionnalités de l\'interface d\'administration. Il couvre la gestion des utilisateurs, la configuration du système, la supervision des activités et la maintenance des données. Chaque section inclut des captures d\'écran et des exemples pratiques.',
taille : '1.8 MB',
version : '2.0',
'créé' : '2025-04-20'
},
{
id : 3,
titre : 'Architecture Technique',
description : 'Description de l\'architecture technique de l\'application, incluant les technologies utilisées et les flux de données.',
auteur : 'Sophie Bernard',
'dernière modification' : '2025-06-02',
'catégorie' : 'Documentation',
'étoilé' : true,
type : 'architecture',
'priorité' : 'Élevée',
statut : 'En révision',
tags : 'architecture, technique, flux',
dossierId : '1',
projectId : '2',
contenu : 'Document technique détaillant l\'architecture de l\'application. Comprend les diagrammes de flux, les choix technologiques, les patterns utilisés et les considérations de performance. L\'architecture suit une approche microservices avec une base de données distribuée.',
taille : '3.1 MB',
version : '1.0',
'créé' : '2025-05-25'
},
{
id : 4,
titre : 'Compte-rendu - Réunion de Lancement',
description : 'Résumé des discussions et décisions prises lors de la réunion de lancement du projet.',
auteur : 'Jean Dubois',
'dernière modification' : '2025-05-28',
'catégorie' : 'Compte-rendu',
'étoilé' : false,
type : 'meeting',
'priorité' : 'Moyenne',
statut : 'Approuvé',
tags : 'réunion, lancement, décisions',
dossierId : '3',
projectId : '1',
contenu : 'Compte-rendu de la réunion de lancement du projet. Participants présents, objectifs définis, planning établi et responsabilités assignées. Les prochaines étapes et les jalons importants ont été identifiés.',
taille : '0.8 MB',
version : '1.0',
'créé' : '2025-05-28'
},
{
id : 5,
titre : 'Plan Marketing - Q3 2025',
description : 'Stratégie marketing détaillée pour le troisième trimestre 2025, incluant les objectifs et les actions à mener.',
auteur : 'Lucie Petit',
'dernière modification' : '2025-05-20',
'catégorie' : 'Marketing',
'étoilé' : false,
type : 'report',
'priorité' : 'Moyenne',
statut : 'Brouillon',
tags : 'marketing, stratégie, Q3',
dossierId : '4',
projectId : '3',
contenu : 'Plan marketing complet pour Q3 2025. Analyse du marché, segmentation client, stratégies de communication, budgets alloués et KPIs de mesure. Inclut les campagnes digitales et traditionnelles.',
taille : '2.2 MB',
version : '0.8',
'créé' : '2025-05-10'
}
];

// Exemples de dossiers
const folders = [
{ id: 1, name: 'Documentation', count: 8 },
{ id: 2, name: 'Guides', count: 3 },
{ id: 3, name: 'Comptes-rendus', count: 12 },
{ id: 4, name: 'Marketing', count: 5 },
{ id: 5, name: 'Ressources', count: 7 }
];

// Exemple de données existantes pour le NewDocView
const existingProjects = [
{ id: 1, name: 'Refonte Site Web' },
{ id: 2, name: 'Application Mobile' },
{ id: 3, name: 'Système CRM' }
];

const existingMembers = [
'Marie Dupont', 'Thomas Martin', 'Sophie Bernard', 'Jean Dubois', 'Lucie Petit'
];

// Composant de vue détaillée du document
const DocumentDetailView: React.FC<{
document: any;
onClose: () => void;
onEdit: (doc: any) => void;
onDelete: (doc: any) => void;
onToggleStar: (id: number) => void;
}> = ({ document, onClose, onEdit, onDelete, onToggleStar }) => {
const getStatusColor = (status: string) => {
switch (status) {
case 'Brouillon': return 'bg-gray-100 text-gray-800';
case 'En révision': return 'bg-yellow-100 text-yellow-800';
case 'Approuvé': return 'bg-green-100 text-green-800';
case 'Publié': return 'bg-blue-100 text-blue-800';
case 'Archivé': return 'bg-gray-100 text-gray-500';
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
</div>
</div>
</div>
<div className="flex items-center space-x-2">
<button
onClick={() => onToggleStar(document.id)}
className={`p-2 rounded-md hover:bg-gray-100 ${document['étoilé'] ? 'text-yellow-500' : 'text-gray-400'}`}
>
<Star className={`h-5 w-5 ${document['étoilé'] ? 'fill-current' : ''}`} />
</button>
<button
onClick={() => onEdit(document)}
className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
>
<Edit3 className="h-5 w-5" />
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
{/* Informations principales */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
<div className="space-y-4">
<div>
<h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
<p className="text-sm text-gray-700">{document.description}</p>
</div>

<div>
<h3 className="text-sm font-medium text-gray-900 mb-2">Contenu</h3>
<div className="bg-gray-50 rounded-md p-4">
<p className="text-sm text-gray-700 leading-relaxed">{document.contenu}</p>
</div>
</div>
</div>

<div className="space-y-4">
{/* Métadonnées */}
<div className="bg-gray-50 rounded-lg p-4">
<h3 className="text-sm font-medium text-gray-900 mb-3">Informations</h3>
<div className="space-y-3">
<div className="flex items-center">
<User className="h-4 w-4 text-gray-400 mr-2" />
<span className="text-sm text-gray-600">Auteur:</span>
<span className="text-sm text-gray-900 ml-2">{document.auteur}</span>
</div>

<div className="flex items-center">
<Calendar className="h-4 w-4 text-gray-400 mr-2" />
<span className="text-sm text-gray-600">Créé le:</span>
<span className="text-sm text-gray-900 ml-2">{document['créé']}</span>
</div>

<div className="flex items-center">
<Clock className="h-4 w-4 text-gray-400 mr-2" />
<span className="text-sm text-gray-600">Modifié le:</span>
<span className="text-sm text-gray-900 ml-2">{document['dernière modification']}</span>
</div>

<div className="flex items-center">
<FolderIcon className="h-4 w-4 text-gray-400 mr-2" />
<span className="text-sm text-gray-600">Catégorie:</span>
<span className="text-sm text-gray-900 ml-2">{document['catégorie']}</span>
</div>

<div className="flex items-center">
<FileText className="h-4 w-4 text-gray-400 mr-2" />
<span className="text-sm text-gray-600">Type:</span>
<span className="text-sm text-gray-900 ml-2">{document.type}</span>
</div>

<div className="flex items-center">
<Archive className="h-4 w-4 text-gray-400 mr-2" />
<span className="text-sm text-gray-600">Taille:</span>
<span className="text-sm text-gray-900 ml-2">{document.taille}</span>
</div>

<div className="flex items-center">
<span className="text-sm text-gray-600">Version:</span>
<span className="text-sm text-gray-900 ml-2">{document.version}</span>
</div>
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
</div>
</div>
</div>

{/* Footer */}
<div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
<div className="flex items-center space-x-3">
<button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
<Download className="h-4 w-4 mr-2" />
Télécharger
</button>
<button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
<Archive className="h-4 w-4 mr-2" />
Archiver
</button>
</div>
<div className="flex items-center space-x-3">
<button
onClick={() => onDelete(document)}
className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
>
<Trash2 className="h-4 w-4 mr-2" />
Supprimer
</button>
<button
onClick={() => onEdit(document)}
className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
<Edit3 className="h-4 w-4 mr-2" />
Modifier
</button>
</div>
</div>
</div>
</div>
);
};

// Composant de confirmation de suppression
const DeleteConfirmationModal: React.FC<{
document: any;
onConfirm: () => void;
onCancel: () => void;
}> = ({ document, onConfirm, onCancel }) => {
return (
<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
<div className="bg-white rounded-lg shadow-xl max-w-md w-full">
<div className="p-6">
<div className="flex items-center mb-4">
<div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
<AlertTriangle className="h-6 w-6 text-red-600" />
</div>
<div className="ml-4">
<h3 className="text-lg font-medium text-gray-900"> Supprimer le document </h3>
<p className="text-sm text-gray-500"> Cette action est irréversible </p>
</div>
</div>

<div className="mb-6">
<p className="text-sm text-gray-700">
Êtes-vous sûr de vouloir supprimer le document{' '}
<span className="font-medium">"{document.titre}"</span> ?
</p>
<p className="text-xs text-gray-500 mt-2">
Ce document sera définitivement supprimé et ne pourra pas être récupéré.
</p>
</div>

<div className="flex justify-end space-x-3">
<button
onClick={onCancel}
className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
Annuler
</button>
<button
onClick={onConfirm}
className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
>
Supprimer
</button>
</div>
</div>
</div>
</div>
);
};

// Composant du menu d'actions
const DocumentActionsMenu: React.FC<{
document: any;
onEdit: () => void;
onDelete: () => void;
onToggleStar: () => void;
onView: () => void;
isOpen: boolean;
onClose: () => void;
}> = ({ document, onEdit, onDelete, onToggleStar, onView, isOpen, onClose }) => {
if (!isOpen) return null;

return (
<div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
<div className="py-1">
<button
onClick={() => { onEdit(); onClose(); }}
className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
>
<Edit3 className="h-4 w-4 mr-3" />
Modifier
</button>

<button
onClick={() => { onView(); onClose(); }}
className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
>
<Eye className="h-4 w-4 mr-3" />
Voir détails
</button>

<button
onClick={() => { onToggleStar(); onClose(); }}
className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
>
<Star className={`h-4 w-4 mr-3 ${document['étoilé'] ? 'text-yellow-400 fill-current' : ''}`} />
{document['étoilé'] ? 'Retirer des favoris' : 'Ajouter aux favoris'}
</button>

<button
onClick={() => { console.log('Télécharger document:', document.id); onClose(); }}
className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
>
<Download className="h-4 w-4 mr-3" />
Télécharger
</button>

<button
onClick={() => { console.log('Archiver document:', document.id); onClose(); }}
className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
>
<Archive className="h-4 w-4 mr-3" />
Archiver
</button>

<div className="border-t border-gray-200"></div>

<button
onClick={() => { onDelete(); onClose(); }}
className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
>
<Trash2 className="h-4 w-4 mr-3" />
Supprimer
</button>
</div>
</div>
);
};

const DocsView = () => {
const [activeFilter, setActiveFilter] = useState('all');
const [searchQuery, setSearchQuery] = useState('');
const [showNewDocForm, setShowNewDocForm] = useState(false);
const [showEditDocForm, setShowEditDocForm] = useState(false);
const [showDocumentDetail, setShowDocumentDetail] = useState(false);
const [documentsList, setDocumentsList] = useState(initialDocuments);
const [editingDocument, setEditingDocument] = useState<any>(null);
const [viewingDocument, setViewingDocument] = useState<any>(null);
const [documentToDelete, setDocumentToDelete] = useState<any>(null);
const [openMenuId, setOpenMenuId] = useState<number | null>(null);
const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

const filteredDocuments = documentsList.filter(doc => {
const matchesSearch = doc.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
doc.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
doc.tags.toLowerCase().includes(searchQuery.toLowerCase());

if (activeFilter === 'all') return matchesSearch;
if (activeFilter === 'starred') return doc['étoilé'] && matchesSearch;
if (activeFilter === 'recent') {
const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);
return new Date(doc['dernière modification']) >= lastWeek && matchesSearch;
}
return doc['catégorie'].toLowerCase() === activeFilter.toLowerCase() && matchesSearch;
});

// Fonction pour afficher une notification
const showNotification = (type: 'success' | 'error', message: string) => {
setNotification({ type, message });
setTimeout(() => setNotification(null), 3000);
};

// Fonction pour créer un nouveau document
const handleCreateDocument = (newDoc: any) => {
const formattedDoc = {
id: Date.now(),
titre: newDoc.titre,
description: newDoc.description,
auteur: newDoc.auteur || 'Utilisateur Actuel',
'dernière modification': new Date().toISOString().slice(0, 10),
'catégorie': newDoc['catégorie'],
'étoilé': false,
type: newDoc.type,
'priorité': newDoc['priorité'],
statut: newDoc.statut,
tags: newDoc.tags,
dossierId: newDoc.dossierId,
projectId: newDoc.projectId,
contenu: newDoc.contenu || 'Contenu du document à remplir...',
taille: '0.1 MB',
version: '1.0',
'créé': new Date().toISOString().slice(0, 10)
};

setDocumentsList(prev => [formattedDoc, ...prev]);
setShowNewDocForm(false);
showNotification('success', 'Document créé avec succès');
};

// Fonction pour modifier un document
const handleEditDocument = (updatedDoc: any) => {
setDocumentsList(prev =>
prev.map(doc =>
doc.id === updatedDoc.id
? {
...doc,
...updatedDoc,
'dernière modification': new Date().toISOString().slice(0, 10)
}
: doc
)
);
setShowEditDocForm(false);
setEditingDocument(null);
showNotification('success', 'Document modifié avec succès');
};

// Fonction pour supprimer un document
const handleDeleteDocument = (documentId: number) => {
setDocumentsList(prev => prev.filter(doc => doc.id !== documentId));
setDocumentToDelete(null);
setShowDocumentDetail(false);
showNotification('success', 'Document supprimé avec succès');
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

// Fonction pour ouvrir le formulaire d'édition
const handleOpenEdit = (document: any) => {
setEditingDocument(document);
setShowEditDocForm(true);
setShowDocumentDetail(false);
};

// Fonction pour ouvrir la vue détaillée
const handleViewDocument = (document: any) => {
setViewingDocument(document);
setShowDocumentDetail(true);
};

// Fonction pour fermer les modales
const handleCancelForms = () => {
setShowNewDocForm(false);
setShowEditDocForm(false);
setShowDocumentDetail(false);
setEditingDocument(null);
setViewingDocument(null);
};

// Fonction pour fermer le menu
const handleCloseMenu = () => {
setOpenMenuId(null);
};

// Fonction pour basculer le menu
const handleToggleMenu = (documentId: number, event: React.MouseEvent) => {
event.stopPropagation();
setOpenMenuId(openMenuId === documentId ? null : documentId);
};

// Effet pour fermer le menu quand on clique ailleurs
React.useEffect(() => {
const handleClickOutside = () => {
setOpenMenuId(null);
};

document.addEventListener('click', handleClickOutside);
return () => {
document.removeEventListener('click', handleClickOutside);
};
}, []);

const getStatusColor = (status: string) => {
switch (status) {
case 'Brouillon': return 'bg-gray-100 text-gray-800';
case 'En révision': return 'bg-yellow-100 text-yellow-800';
case 'Approuvé': return 'bg-green-100 text-green-800';
case 'Publié': return 'bg-blue-100 text-blue-800';
case 'Archivé': return 'bg-gray-100 text-gray-500';
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
notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}`}>
<div className="flex items-center">
{notification.type === 'success' ? (
<CheckCircle className="h-5 w-5 mr-2" />
) : (
<AlertTriangle className="h-5 w-5 mr-2" />
)}
{notification.message}
</div>
</div>
)}

<div className="flex justify-between items-center mb-6">
<div>
<h1 className="text-2xl font-semibold text-gray-900">Documents & Wiki</h1>
<p className="text-sm text-gray-500 mt-1">
Gérez vos documents, guides et ressources de l'équipe
</p>
</div>
<button 
onClick={() => setShowNewDocForm(true)}
className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
>
<Plus className="h-5 w-5 mr-2" />
Nouveau Document
</button>
</div>

<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
<div className="lg:col-span-1">
<div className="bg-white shadow rounded-lg overflow-hidden">
<div className="p-4 border-b border-gray-200">
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<Search className="h-4 w-4 text-gray-400" />
</div>
<input
type="text"
className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-base"
placeholder="Rechercher des documents"
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
/>
</div>
</div>

<div className="p-4">
<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Filtres</h3>
<nav className="space-y-1">
<button
className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
activeFilter === 'all'
? 'bg-indigo-100 text-indigo-700'
: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}`}
onClick={() => setActiveFilter('all')}
>
<FileText className="mr-3 h-5 w-5" />
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
<Star className="mr-3 h-5 w-5" />
Favoris
</button>
<button
className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
activeFilter === 'recent'
? 'bg-indigo-100 text-indigo-700'
: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}`}
onClick={() => setActiveFilter('recent')}
>
<Clock className="mr-3 h-5 w-5" />
Récents
</button>
<button
className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
activeFilter === 'trash'
? 'bg-indigo-100 text-indigo-700'
: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}`}
onClick={() => setActiveFilter('trash')}
>
<Trash2 className="mr-3 h-5 w-5" />
Corbeille
</button>
</nav>
</div>

<div className="p-4 border-t border-gray-200">
<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dossiers</h3>
<nav className="space-y-1">
{folders.map(folder => (
<button
key={folder.id}
className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
activeFilter === folder.name.toLowerCase()
? 'bg-indigo-100 text-indigo-700'
: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
}`}
onClick={() => setActiveFilter(folder.name.toLowerCase())}
>
<div className="flex items-center">
<FolderOpen className="mr-3 h-5 w-5" />
{folder.name}
</div>
<span className="text-xs text-gray-500">{folder.count}</span>
</button>
))}
</nav>
</div>
</div>
</div>

<div className="lg:col-span-3">
<div className="bg-white shadow rounded-lg overflow-hidden">
<div className="border-b border-gray-200 px-4 py-4 sm:px-6">
<div className="flex justify-between items-center">
<div>
<h2 className="text-lg font-medium text-gray-900">
{activeFilter === 'all' ? 'Tous les documents' :
activeFilter === 'starred' ? 'Documents favoris' :
activeFilter === 'recent' ? 'Documents récents' :
activeFilter === 'trash' ? 'Corbeille' :
`Dossier: ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
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
<option>Priorité</option>
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
: 'Commencez par créer votre premier document.'
}
</p>
<button
onClick={() => setShowNewDocForm(true)}
className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
>
<Plus className="h-4 w-4 mr-2" />
Créer un document
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
<span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(doc['priorité'])}`}>
•
</span>
</div>
<p className="text-sm text-gray-500 mt-1 line-clamp-2">{doc.description}</p>

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

<div className="relative">
<button 
onClick={(e) => handleToggleMenu(doc.id, e)}
className="text-gray-400 hover:text-gray-500 p-1 rounded hover:bg-gray-100 transition-colors"
>
<MoreHorizontal className="h-5 w-5" />
</button>

<DocumentActionsMenu
document={doc}
onEdit={() => handleOpenEdit(doc)}
onDelete={() => setDocumentToDelete(doc)}
onToggleStar={() => handleToggleStar(doc.id)}
onView={() => handleViewDocument(doc)}
isOpen={openMenuId === doc.id}
onClose={handleCloseMenu}
/>
</div>
</div>
</div>

<div className="mt-2 flex items-center space-x-4">
<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800`}>
{doc['catégorie']}
</span>
<span className="text-xs text-gray-500">
Priorité: <span className={getPriorityColor(doc['priorité'])}>{doc['priorité']}</span>
</span>
</div>
</div>
</li>
))}
</ul>
)}
</div>
</div>
</div>

{/* Modal de création de document */}
{showNewDocForm && (
<NewDocView
onCancel={handleCancelForms}
onCreate={handleCreateDocument}
existingMembers={existingMembers}
existingProjects={existingProjects}
existingFolders={folders}
/>
)}

{/* Modal d'édition de document */}
{showEditDocForm && editingDocument && (
<NewDocView
onCancel={handleCancelForms}
onCreate={handleEditDocument}
existingMembers={existingMembers}
existingProjects={existingProjects}
existingFolders={folders}
initialData={editingDocument}
/>
)}

{/* Modal de vue détaillée */}
{showDocumentDetail && viewingDocument && (
<DocumentDetailView
document={viewingDocument}
onClose={handleCancelForms}
onEdit={handleOpenEdit}
onDelete={setDocumentToDelete}
onToggleStar={handleToggleStar}
/>
)}

{/* Modal de confirmation de suppression */}
{documentToDelete && (
<DeleteConfirmationModal
document={documentToDelete}
onConfirm={() => handleDeleteDocument(documentToDelete.id)}
onCancel={() => setDocumentToDelete(null)}
/>
)}
</div>
);
};

export default DocsView;