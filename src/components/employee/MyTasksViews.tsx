import React, { useState, useEffect, useMemo } from 'react';
import {
Plus, Filter, List, LayoutGrid, Calendar as CalendarIcon, GanttChart,
BarChart3, Clock, TrendingUp, AlertTriangle, ChevronLeft, ChevronRight,
Search, CheckCircle, XCircle, Pause, Play, Edit, Trash2, Eye, Download,
MessageCircle, PlusCircle, FileText, User, CheckSquare
} from 'lucide-react';

// Types
interface MyTask {
id: number;
title: string;
description: string;
status: 'À faire' | 'En cours' | 'En attente' | 'Terminé';
priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
startDate: string;
endDate: string;
assignedBy: {
name: string;
avatar: string;
role: string;
};
assignedTo: {
name: string;
avatar: string;
role: string;
};
project: {
id: number;
name: string;
color: string;
};
tags: string[];
progress: number;
category: string;
createdAt: Date;
estimatedHours?: number;
actualHours?: number;
attachments?: any[];
notes?: string[];
lastUpdated: Date;
isPersonal: boolean; // Tâche créée par l'employé lui-même
}

// Informations de l'employé connecté
const currentEmployee = {
id: 1,
name: "Marie Dubois",
avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
role: "Développeuse Frontend"
};

// Données initiales - SEULEMENT les tâches assignées à Marie Dubois
const initialMyTasks: MyTask[] = [
{
id: 1,
title: "Développer les composants React",
description: "Créer les composants de base pour le module de gestion des utilisateurs",
status: "En cours",
priority: "Élevée",
startDate: "2024-01-15T09:00",
endDate: "2024-01-20T17:00",
assignedBy: {
name: "Tom Cook",
avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
role: "Chef de projet"
},
assignedTo: currentEmployee,
project: {
id: 1,
name: "Système de gestion",
color: "bg-blue-500"
},
tags: ["frontend", "react", "ui"],
progress: 65,
category: "Développement",
createdAt: new Date("2024-01-15T09:00:00"),
estimatedHours: 32,
actualHours: 28,
attachments: [],
notes: ["Avancement bon, quelques difficultés avec les animations"],
lastUpdated: new Date(),
isPersonal: false
},
{
id: 2,
title: "Tests unitaires composants",
description: "Écrire les tests unitaires pour les nouveaux composants développés",
status: "À faire",
priority: "Moyenne",
startDate: "2024-01-18T10:00",
endDate: "2024-01-25T16:00",
assignedBy: {
name: "Tom Cook",
avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
role: "Chef de projet"
},
assignedTo: currentEmployee,
project: {
id: 1,
name: "Système de gestion",
color: "bg-blue-500"
},
tags: ["test", "jest", "react"],
progress: 0,
category: "Développement",
createdAt: new Date("2024-01-18T10:00:00"),
estimatedHours: 16,
actualHours: 0,
attachments: [],
notes: [],
lastUpdated: new Date(),
isPersonal: false
},
{
id: 4,
title: "Formation TypeScript",
description: "Suivre la formation TypeScript avancé pour améliorer mes compétences",
status: "En cours",
priority: "Moyenne",
startDate: "2024-01-20T09:00",
endDate: "2024-01-30T17:00",
assignedBy: currentEmployee,
assignedTo: currentEmployee,
project: {
id: 3,
name: "Formation personnelle",
color: "bg-purple-500"
},
tags: ["formation", "typescript", "personnel"],
progress: 40,
category: "Formation",
createdAt: new Date("2024-01-20T09:00:00"),
estimatedHours: 20,
actualHours: 8,
attachments: [],
notes: ["Très intéressant, concepts avancés"],
lastUpdated: new Date(),
isPersonal: true
}
];

const MyTasksView = () => {
const [myTasks, setMyTasks] = useState<MyTask[]>(initialMyTasks);
const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar' | 'gantt' | 'analytics'>('list');
const [showNewPersonalTaskForm, setShowNewPersonalTaskForm] = useState(false);
const [showTaskDetails, setShowTaskDetails] = useState<number | null>(null);
const [currentTime, setCurrentTime] = useState(new Date());
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('');
const [filterPriority, setFilterPriority] = useState('');
const [filterProject, setFilterProject] = useState('');
const [calendarDate, setCalendarDate] = useState(new Date());

const statuses = ['À faire', 'En cours', 'En attente', 'Terminé'];
const priorities = ['Basse', 'Moyenne', 'Élevée', 'Urgente'];

// Mise à jour du temps en temps réel
useEffect(() => {
const timer = setInterval(() => {
setCurrentTime(new Date());
}, 1000);
return () => clearInterval(timer);
}, []);

// Filtrer SEULEMENT les tâches assignées à l'employé connecté
const myAssignedTasks = useMemo(() => {
return myTasks.filter(task => task.assignedTo.name === currentEmployee.name);
}, [myTasks]);

// Statistiques personnelles calculées SEULEMENT sur les tâches assignées à l'employé
const personalStatistics = useMemo(() => {
const totalTasks = myAssignedTasks.length;
const completedTasks = myAssignedTasks.filter(t => t.status === 'Terminé').length;
const inProgressTasks = myAssignedTasks.filter(t => t.status === 'En cours').length;
const overdueTasks = myAssignedTasks.filter(t =>
new Date(t.endDate) < currentTime && t.status !== 'Terminé'
).length;
const personalTasks = myAssignedTasks.filter(t => t.isPersonal).length;

const totalEstimated = myAssignedTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
const totalActual = myAssignedTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
const efficiency = totalEstimated > 0 ? (totalEstimated / totalActual * 100) : 100;

const productivity = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0;
const avgProgress = totalTasks > 0 ? myAssignedTasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks : 0;

// Tâches urgentes
const urgentTasks = myAssignedTasks.filter(t => t.priority === 'Urgente' && t.status !== 'Terminé').length;

return {
totalTasks,
completedTasks,
inProgressTasks,
overdueTasks,
personalTasks,
urgentTasks,
productivity: Math.round(productivity),
efficiency: Math.round(efficiency),
avgProgress: Math.round(avgProgress),
totalEstimated,
totalActual
};
}, [myAssignedTasks, currentTime]);

// Filtrage des tâches (SEULEMENT sur les tâches assignées à l'employé)
const filteredTasks = useMemo(() => {
return myAssignedTasks.filter(task => {
const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
task.project.name.toLowerCase().includes(searchTerm.toLowerCase());
const matchesStatus = !filterStatus || task.status === filterStatus;
const matchesPriority = !filterPriority || task.priority === filterPriority;
const matchesProject = !filterProject || task.project.name === filterProject;

return matchesSearch && matchesStatus && matchesPriority && matchesProject;
});
}, [myAssignedTasks, searchTerm, filterStatus, filterPriority, filterProject]);

const getTasksByStatus = () => {
const tasksByStatus: Record<string, MyTask[]> = {};
statuses.forEach(status => {
tasksByStatus[status] = filteredTasks.filter(task => task.status === status);
});
return tasksByStatus;
};

// Vérifier si l'employé peut modifier une tâche (seulement ses propres tâches)
const canModifyTask = (task: MyTask) => {
return task.assignedTo.name === currentEmployee.name;
};

// Créer SEULEMENT des tâches personnelles
const handleCreatePersonalTask = (newTask: any) => {
const formattedTask: MyTask = {
id: Date.now(),
title: newTask.title,
description: newTask.description,
status: 'À faire',
priority: newTask.priority,
startDate: newTask.startDate,
endDate: newTask.endDate,
assignedBy: currentEmployee,
assignedTo: currentEmployee, // Toujours assignée à soi-même
project: {
id: 3,
name: "Tâches personnelles",
color: "bg-purple-500"
},
tags: newTask.tags || [],
progress: 0,
category: newTask.category || "Personnel",
createdAt: new Date(),
estimatedHours: parseFloat(newTask.estimatedHours) || 0,
actualHours: 0,
attachments: newTask.attachments || [],
notes: [],
lastUpdated: new Date(),
isPersonal: true
};
setMyTasks([...myTasks, formattedTask]);
setShowNewPersonalTaskForm(false);
};

// Mise à jour AVEC vérification des permissions
const updateTaskProgress = (taskId: number, newProgress: number) => {
setMyTasks(prevTasks =>
prevTasks.map(task => {
if (task.id === taskId && canModifyTask(task)) {
return {
...task,
progress: newProgress,
status: newProgress === 100 ? 'Terminé' : newProgress > 0 ? 'En cours' : 'À faire',
lastUpdated: new Date(),
actualHours: (task.actualHours || 0) + 0.5 // Simulation d'ajout d'heures
};
}
return task;
})
);
};

const updateTaskStatus = (taskId: number, newStatus: MyTask['status']) => {
setMyTasks(prevTasks =>
prevTasks.map(task => {
if (task.id === taskId && canModifyTask(task)) {
return {
...task,
status: newStatus,
progress: newStatus === 'Terminé' ? 100 : task.progress,
lastUpdated: new Date()
};
}
return task;
})
);
};

const addTaskNote = (taskId: number, note: string) => {
setMyTasks(prevTasks =>
prevTasks.map(task => {
if (task.id === taskId && canModifyTask(task)) {
return {
...task,
notes: [...(task.notes || []), `${new Date().toLocaleString()}: ${note}`],
lastUpdated: new Date()
};
}
return task;
})
);
};

const isOverdue = (task: MyTask) => {
return new Date(task.endDate) < currentTime && task.status !== 'Terminé';
};

const getDaysUntilDeadline = (task: MyTask) => {
const deadline = new Date(task.endDate);
const diffTime = deadline.getTime() - currentTime.getTime();
return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getUniqueProjects = () => {
const projects = myAssignedTasks.map(task => task.project.name);
return [...new Set(projects)];
};

// Composant de statistiques personnelles
const PersonalStatisticsPanel = () => (
<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
<div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-semibold text-gray-900">Mon Tableau de Bord Personnel</h2>
<div className="text-right">
<div className="text-lg font-bold text-indigo-600">
{currentTime.toLocaleTimeString('fr-FR')}
</div>
<div className="text-sm text-gray-500">
{currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">Mes Tâches</p>
<p className="text-2xl font-bold">{personalStatistics.totalTasks}</p>
</div>
<CheckSquare className="h-8 w-8 opacity-80" />
</div>
</div>

<div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">Terminées</p>
<p className="text-2xl font-bold">{personalStatistics.completedTasks}</p>
</div>
<CheckCircle className="h-8 w-8 opacity-80" />
</div>
</div>

<div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">En Retard</p>
<p className="text-2xl font-bold">{personalStatistics.overdueTasks}</p>
</div>
<AlertTriangle className="h-8 w-8 opacity-80" />
</div>
</div>

<div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">Personnelles</p>
<p className="text-2xl font-bold">{personalStatistics.personalTasks}</p>
</div>
<User className="h-8 w-8 opacity-80" />
</div>
</div>

<div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">Urgentes</p>
<p className="text-2xl font-bold">{personalStatistics.urgentTasks}</p>
</div>
<Clock className="h-8 w-8 opacity-80" />
</div>
</div>
</div>

{/* Barre de progression personnelle */}
<div className="mb-4">
<div className="flex justify-between text-sm text-gray-600 mb-1">
<span>Ma Progression Globale</span>
<span>{personalStatistics.avgProgress}%</span>
</div>
<div className="w-full bg-gray-200 rounded-full h-3">
<div
className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
style={{ width: `${personalStatistics.avgProgress}%` }}
></div>
</div>
</div>

{/* Métriques de temps */}
<div className="grid grid-cols-2 gap-4 text-center">
<div>
<div className="text-2xl font-bold text-indigo-600">{personalStatistics.totalActual}h</div>
<div className="text-sm text-gray-500">Temps travaillé</div>
</div>
<div>
<div className="text-2xl font-bold text-green-600">{personalStatistics.efficiency}%</div>
<div className="text-sm text-gray-500">Efficacité</div>
</div>
</div>
</div>
);

// Vue Liste pour employé
const renderListView = () => (
<div className="bg-white shadow-lg rounded-lg overflow-hidden">
<div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
<div className="flex items-center justify-between">
<h3 className="text-lg font-semibold text-gray-900">Mes Tâches Assignées</h3>
<div className="text-sm text-gray-500">
{filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''}
</div>
</div>
</div>

<div className="divide-y divide-gray-200">
{filteredTasks.length === 0 ? (
<div className="p-6 text-center text-gray-500">
<CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
<p className="text-lg font-medium mb-2">Aucune tâche trouvée</p>
<p>Vous n'avez aucune tâche assignée pour le moment.</p>
</div>
) : (
filteredTasks.map(task => {
const isTaskOverdue = isOverdue(task);
const canModify = canModifyTask(task);

return (
<div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
<div className="flex items-start justify-between">
<div className="flex items-start space-x-4 flex-1">
<input
type="checkbox"
checked={task.status === 'Terminé'}
onChange={() => canModify && updateTaskStatus(task.id, task.status === 'Terminé' ? 'En cours' : 'Terminé')}
disabled={!canModify}
className="h-5 w-5 text-indigo-600 rounded mt-1"
/>

<div className="flex-1">
<div className="flex items-center space-x-2 mb-1">
<h4 className={`font-semibold text-lg ${task.status === 'Terminé' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
{task.title}
</h4>
{task.isPersonal && (
<span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
Personnel
</span>
)}
{!canModify && (
<span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
Lecture seule
</span>
)}
</div>
<p className="text-gray-600 mt-1">{task.description}</p>

<div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
<div className="flex items-center text-gray-500">
<Clock className="h-4 w-4 mr-1" />
{new Date(task.endDate).toLocaleDateString('fr-FR')}
</div>

<div className="flex items-center">
<span className={`w-3 h-3 rounded-full mr-2 ${task.project.color}`}></span>
<span className="text-gray-600">{task.project.name}</span>
</div>

<div className="flex items-center">
<span className="text-gray-500 text-xs">Assigné par:</span>
<img
src={task.assignedBy.avatar}
alt={task.assignedBy.name}
className="h-5 w-5 rounded-full ml-1 mr-1"
/>
<span className="text-gray-600 text-xs">{task.assignedBy.name}</span>
</div>

{isTaskOverdue && (
<span className="text-red-600 font-medium flex items-center">
<AlertTriangle className="h-4 w-4 mr-1" />
En retard
</span>
)}
</div>

<div className="flex flex-wrap gap-2 mt-3">
{task.tags.map((tag, index) => (
<span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
{tag}
</span>
))}
</div>

{/* Notes de la tâche */}
{task.notes && task.notes.length > 0 && (
<div className="mt-3">
<div className="text-xs text-gray-500 mb-1">Dernière note:</div>
<div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
{task.notes[task.notes.length - 1]}
</div>
</div>
)}
</div>

<div className="flex flex-col items-end space-y-2 ml-4">
<div className="flex items-center space-x-2">
<span className={`px-3 py-1 text-xs font-semibold rounded-full ${
task.priority === 'Urgente' ? 'bg-red-100 text-red-800' :
task.priority === 'Élevée' ? 'bg-orange-100 text-orange-800' :
task.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
'bg-green-100 text-green-800'
}`}>
{task.priority}
</span>

<span className={`px-3 py-1 text-xs font-semibold rounded-full ${
task.status === 'Terminé' ? 'bg-green-100 text-green-800' :
task.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
task.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
'bg-gray-100 text-gray-800'
}`}>
{task.status}
</span>
</div>

<div className="flex items-center space-x-1">
<button
className={`p-1 rounded ${canModify ? 'text-gray-400 hover:text-indigo-600' : 'text-gray-300 cursor-not-allowed'}`}
title={canModify ? "Ajouter une note" : "Pas autorisé à modifier"}
disabled={!canModify}
onClick={() => {
if (canModify) {
const note = prompt('Ajouter une note:');
if (note) addTaskNote(task.id, note);
}
}}
>
<MessageCircle className="h-4 w-4" />
</button>
</div>

<div className="text-xs text-gray-500">
{task.actualHours || 0}h / {task.estimatedHours || 0}h
</div>
</div>
</div>

{/* Barre de progression interactive */}
<div className="mt-4">
<div className="flex justify-between text-sm text-gray-600 mb-2">
<span>Ma progression</span>
<span>{task.progress}%</span>
</div>
<div className="relative">
<div className="w-full bg-gray-200 rounded-full h-2">
<div
className={`h-2 rounded-full transition-all duration-300 ${
task.progress === 100 ? 'bg-green-500' :
task.progress >= 75 ? 'bg-blue-500' :
task.progress >= 50 ? 'bg-yellow-500' :
task.progress >= 25 ? 'bg-orange-500' : 'bg-red-500'
}`}
style={{ width: `${task.progress}%` }}
></div>
</div>
{canModify && (
<input
type="range"
min="0"
max="100"
value={task.progress}
onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
/>
)}
</div>
</div>
</div>
</div>
);
})
)}
</div>
</div>
);

const renderTasksView = () => {
switch (viewMode) {
case 'list': return renderListView();
default: return renderListView();
}
};

return (
<div className="space-y-6">
<PersonalStatisticsPanel />

<div className="flex justify-between items-center">
<h1 className="text-3xl font-bold text-gray-900">Mes Tâches</h1>
<button
onClick={() => setShowNewPersonalTaskForm(true)}
className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
>
<PlusCircle className="h-5 w-5 mr-2" />
Créer une Tâche Personnelle
</button>
</div>

{/* Filtres et boutons de vue */}
<div className="bg-white p-6 rounded-lg shadow-lg">
<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
<div className="flex flex-wrap items-center gap-2">
<button
onClick={() => setViewMode('list')}
className={`p-3 rounded-lg transition-colors ${
viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
}`}
>
<List className="h-5 w-5" />
</button>
</div>

<div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
<div className="relative">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
<input
type="text"
placeholder="Rechercher mes tâches..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 text-base"
/>
</div>

<select
value={filterStatus}
onChange={(e) => setFilterStatus(e.target.value)}
className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
>
<option value="">Tous les statuts</option>
{statuses.map(status => (
<option key={status} value={status}>{status}</option>
))}
</select>

<select
value={filterPriority}
onChange={(e) => setFilterPriority(e.target.value)}
className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
>
<option value="">Toutes les priorités</option>
{priorities.map(priority => (
<option key={priority} value={priority}>{priority}</option>
))}
</select>
</div>
</div>
</div>

{renderTasksView()}
</div>
);
};

export default MyTasksView;