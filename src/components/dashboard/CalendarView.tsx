import React, { useState, useEffect, useMemo } from 'react';
import {
Plus, ChevronLeft, ChevronRight, Filter, Eye, Edit, Trash2,
Clock, Calendar as CalendarIcon, Users, MapPin, AlertTriangle,
TrendingUp, Target, Settings, Search, Bell, Download, Share2,
Play, Pause, CheckCircle2, Hash, Timer, Activity, Rocket,
BarChart3, Columns, Flag, PlayCircle, FileText, ExternalLink,
Github, Zap, Award
} from 'lucide-react';
import NewCalendarView from '../newintegration/NewCalendarView';

// Types d'événements étendus pour intégration complète avec projets et sprints
interface CalendarEvent {
id: number | string;
title: string;
description: string;
date: string;
time: string;
type: 'meeting' | 'presentation' | 'deadline' | 'training' | 'sprint-planning' | 'sprint-review' | 'daily-standup' | 'sprint';
startDateTime: string;
endDateTime: string;
recurrence: string;
members: string[];
priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Haute';
status: 'Prévu' | 'En cours' | 'Terminé' | 'Annulé';
location: string;
tags: string[];
projectId?: number;
sprintId?: number;
taskIds: number[];
attachments?: string[];
createdAt: Date;
updatedAt: Date;
// Champs spécifiques pour les événements de sprint
sprintGoal?: string;
capacity?: number;
velocity?: number;
methodology?: string;
}

// Types importés du module projet
interface Task {
id: number;
title: string;
description: string;
status: 'À faire' | 'En cours' | 'Terminé';
priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
assignee?: { name: string } | string;
estimatedHours: number;
actualHours: number;
storyPoints: number;
sprintId?: number;
projectId?: number;
endDate?: string;
tags?: string[];
createdAt: Date;
updatedAt: Date;
}

interface Sprint {
id: number;
name: string;
goal: string;
startDate: string;
endDate: string;
status: 'Planifié' | 'Actif' | 'Terminé' | 'Annulé';
capacity: number;
velocity: number;
projectId: number;
tasks: Task[];
createdAt: Date;
updatedAt: Date;
}

interface Project {
id: number;
name: string;
description: string;
progress: number;
status: 'En attente' | 'En cours' | 'En pause' | 'Terminé' | 'En retard' | 'Annulé';
priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
startDate: string;
endDate: string;
budget: number;
spent: number;
currency: string;
members: Array<{ name: string; role?: string; avatar?: string; }>;
tasks: { total: number; completed: number; inProgress: number; pending: number; };
sprints: Sprint[];
backlog: Task[];
client?: string;
projectManager: string;
tags: string[];
attachments?: number;
riskLevel: 'Faible' | 'Moyen' | 'Élevé';
methodology: string;
createdAt: Date;
updatedAt: Date;
}

// Props du composant avec callbacks pour synchronisation bidirectionnelle
interface CalendarViewProps {
projects?: Project[];
tasks?: Task[];
onUpdateProject?: (project: Project) => void;
onUpdateTask?: (task: Task) => void;
onCreateEvent?: (event: CalendarEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
projects = [],
tasks = [],
onUpdateProject,
onUpdateTask,
onCreateEvent
}) => {
// État enrichi pour la gestion du calendrier intégré
const [events, setEvents] = useState<CalendarEvent[]>([
{
id: 1,
title: 'Réunion d\'équipe',
description: 'Réunion hebdomadaire d\'équipe pour faire le point sur les projets en cours',
date: '2025-01-15',
time: '10:00 - 11:00',
type: 'meeting',
startDateTime: '2025-01-15T10:00',
endDateTime: '2025-01-15T11:00',
recurrence: 'Hebdomadaire',
members: ['Marie Dubois', 'Thomas Martin', 'Sophie Bernard'],
priority: 'Moyenne',
status: 'Prévu',
location: 'Salle de réunion A',
tags: ['équipe', 'hebdomadaire'],
projectId: 1,
taskIds: [],
createdAt: new Date('2025-01-10'),
updatedAt: new Date()
}
]);

const [currentTime, setCurrentTime] = useState(new Date());
const [viewDate, setViewDate] = useState(new Date());
const [showNewEventForm, setShowNewEventForm] = useState(false);
const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'sprint'>('month');
const [filters, setFilters] = useState({
type: '',
priority: '',
status: '',
member: '',
project: '',
sprint: ''
});
const [searchTerm, setSearchTerm] = useState('');
const [filterApplied, setFilterApplied] = useState(false);

// Membres d'équipe disponibles (calculés depuis les projets)
const teamMembers = useMemo(() => {
const members = new Set<string>();
projects.forEach(project => {
project.members?.forEach(member => {
members.add(typeof member === 'string' ? member : member.name);
});
});
return Array.from(members);
}, [projects]);

// Mise à jour du temps en temps réel
useEffect(() => {
const timer = setInterval(() => setCurrentTime(new Date()), 1000);
return () => clearInterval(timer);
}, []);

// Synchronisation automatique COMPLÈTE avec les projets et sprints
useEffect(() => {
const newEvents: CalendarEvent[] = [];

// 1. Événements de projets (échéances et jalons)
if (projects && projects.length > 0) {
projects.forEach(project => {
// Échéance du projet
if (project.endDate && project.status !== 'Terminé' && project.status !== 'Annulé') {
newEvents.push({
id: `project-deadline-${project.id}`,
title: `📋 Échéance: ${project.name}`,
description: `Date limite pour le projet "${project.name}" - ${project.description}`,
date: project.endDate.split('T')[0],
time: new Date(project.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
type: 'deadline',
startDateTime: project.endDate,
endDateTime: project.endDate,
recurrence: 'Aucune',
members: project.members?.map(m => typeof m === 'string' ? m : m.name) || [],
priority: project.priority === 'Urgente' ? 'Haute' :
project.priority === 'Élevée' ? 'Élevée' :
project.priority === 'Moyenne' ? 'Moyenne' : 'Basse',
status: 'Prévu',
location: 'Bureau',
tags: ['projet', 'échéance', ...(project.tags || [])],
projectId: project.id,
taskIds: [],
methodology: project.methodology,
createdAt: new Date(),
updatedAt: new Date()
});
}

// 2. Événements de sprints complets
if (project.sprints && project.sprints.length > 0) {
project.sprints.forEach(sprint => {
// Sprint Planning (début)
newEvents.push({
id: `sprint-planning-${sprint.id}`,
title: `🚀 Sprint Planning: ${sprint.name}`,
description: `Planification du sprint "${sprint.name}" - ${sprint.goal}`,
date: sprint.startDate.split('T')[0],
time: new Date(sprint.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' - ' +
new Date(new Date(sprint.startDate).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
type: 'sprint-planning',
startDateTime: sprint.startDate,
endDateTime: new Date(new Date(sprint.startDate).getTime() + 2 * 60 * 60 * 1000).toISOString(),
recurrence: 'Aucune',
members: project.members?.map(m => typeof m === 'string' ? m : m.name) || [],
priority: 'Élevée',
status: sprint.status === 'Actif' ? 'En cours' :
sprint.status === 'Terminé' ? 'Terminé' : 'Prévu',
location: 'Salle de réunion Agile',
tags: ['sprint', 'planning', 'agile', project.methodology.toLowerCase()],
projectId: project.id,
sprintId: sprint.id,
sprintGoal: sprint.goal,
capacity: sprint.capacity,
velocity: sprint.velocity,
methodology: project.methodology,
taskIds: sprint.tasks?.map(t => t.id) || [],
createdAt: new Date(),
updatedAt: new Date()
});

// Sprint Review et Rétrospective (fin)
newEvents.push({
id: `sprint-review-${sprint.id}`,
title: `🎯 Sprint Review: ${sprint.name}`,
description: `Review et Rétrospective du sprint "${sprint.name}" - Présentation des livrables`,
date: sprint.endDate.split('T')[0],
time: new Date(new Date(sprint.endDate).getTime() - 2 * 60 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' - ' +
new Date(sprint.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
type: 'sprint-review',
startDateTime: new Date(new Date(sprint.endDate).getTime() - 2 * 60 * 60 * 1000).toISOString(),
endDateTime: sprint.endDate,
recurrence: 'Aucune',
members: project.members?.map(m => typeof m === 'string' ? m : m.name) || [],
priority: 'Élevée',
status: sprint.status === 'Terminé' ? 'Terminé' :
new Date(sprint.endDate) < new Date() ? 'En cours' : 'Prévu',
location: 'Salle de réunion Agile',
tags: ['sprint', 'review', 'retrospective', 'demo'],
projectId: project.id,
sprintId: sprint.id,
sprintGoal: sprint.goal,
capacity: sprint.capacity,
velocity: sprint.velocity,
methodology: project.methodology,
taskIds: sprint.tasks?.map(t => t.id) || [],
createdAt: new Date(),
updatedAt: new Date()
});

// Daily Standups (uniquement pour les sprints actifs)
if (sprint.status === 'Actif') {
const startDate = new Date(sprint.startDate);
const endDate = new Date(sprint.endDate);
let currentDate = new Date(startDate);

while (currentDate <= endDate) {
// Skip weekends pour les standups
if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
const standupDate = new Date(currentDate);
newEvents.push({
id: `standup-${sprint.id}-${standupDate.toISOString().split('T')[0]}`,
title: `🗣️ Daily Standup`,
description: `Daily standup pour le sprint "${sprint.name}" - Point quotidien de l'équipe`,
date: standupDate.toISOString().split('T')[0],
time: '09:00 - 09:15',
type: 'daily-standup',
startDateTime: new Date(standupDate.setHours(9, 0)).toISOString(),
endDateTime: new Date(standupDate.setHours(9, 15)).toISOString(),
recurrence: 'Quotidienne',
members: project.members?.map(m => typeof m === 'string' ? m : m.name) || [],
priority: 'Moyenne',
status: standupDate < new Date() ? 'Terminé' : 'Prévu',
location: 'Visioconférence / Bureau',
tags: ['standup', 'daily', 'agile', 'équipe'],
projectId: project.id,
sprintId: sprint.id,
sprintGoal: sprint.goal,
methodology: project.methodology,
taskIds: [],
createdAt: new Date(),
updatedAt: new Date()
});
}
currentDate.setDate(currentDate.getDate() + 1);
}
}
});
}
});
}

// 3. Événements de tâches avec échéances
if (tasks && tasks.length > 0) {
tasks.forEach(task => {
if (task.endDate && task.status !== 'Terminé') {
const assigneeName = typeof task.assignee === 'string' ? task.assignee : task.assignee?.name;
newEvents.push({
id: `task-${task.id}`,
title: `📝 Tâche: ${task.title}`,
description: `Échéance pour la tâche "${task.title}" - ${task.description || 'Aucune description'}`,
date: task.endDate.split('T')[0],
time: new Date(task.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
type: 'deadline',
startDateTime: task.endDate,
endDateTime: task.endDate,
recurrence: 'Aucune',
members: assigneeName ? [assigneeName] : [],
priority: task.priority === 'Urgente' ? 'Haute' :
task.priority === 'Élevée' ? 'Élevée' :
task.priority === 'Moyenne' ? 'Moyenne' : 'Basse',
status: 'Prévu',
location: 'Bureau',
tags: ['tâche', 'deadline', ...(task.tags || [])],
projectId: task.projectId,
sprintId: task.sprintId,
taskIds: [task.id],
createdAt: new Date(),
updatedAt: new Date()
});
}
});
}

// Fusionner avec les événements manuels existants
setEvents(prevEvents => {
const manualEvents = prevEvents.filter(e =>
!String(e.id).startsWith('project-') &&
!String(e.id).startsWith('sprint-') &&
!String(e.id).startsWith('task-') &&
!String(e.id).startsWith('standup-')
);
return [...manualEvents, ...newEvents];
});
}, [projects, tasks]);

// Filtrage avancé incluant projets et sprints avec réactivité améliorée
const filteredEvents = useMemo(() => {
console.log('Filtrage des événements...', { searchTerm, filters, eventsCount: events.length });

const filtered = events.filter(event => {
const matchesSearch = searchTerm === '' ||
event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
(event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
(event.sprintGoal && event.sprintGoal.toLowerCase().includes(searchTerm.toLowerCase()));

const matchesType = !filters.type || event.type === filters.type;
const matchesPriority = !filters.priority || event.priority === filters.priority;
const matchesStatus = !filters.status || event.status === filters.status;
const matchesMember = !filters.member || event.members.includes(filters.member);
const matchesProject = !filters.project || (event.projectId && event.projectId.toString() === filters.project);
const matchesSprint = !filters.sprint || (event.sprintId && event.sprintId.toString() === filters.sprint);

return matchesSearch && matchesType && matchesPriority && matchesStatus &&
matchesMember && matchesProject && matchesSprint;
});

console.log('Événements filtrés:', filtered.length);
return filtered;
}, [events, searchTerm, filters]);

// Statistiques enrichies avec données des projets et sprints
const statistics = useMemo(() => {
const totalEvents = events.length;
const todayEvents = events.filter(e => e.date === currentTime.toISOString().split('T')[0]).length;
const upcomingEvents = events.filter(e => new Date(e.date) > currentTime).length;
const overdueEvents = events.filter(e =>
new Date(e.date) < currentTime && e.status !== 'Terminé'
).length;

const sprintEvents = events.filter(e =>
e.type === 'sprint-planning' || e.type === 'sprint-review' || e.type === 'daily-standup'
).length;

const activeSprintsCount = projects.reduce((count, project) =>
count + (project.sprints?.filter(s => s.status === 'Actif').length || 0), 0
);

const totalSprintsCount = projects.reduce((count, project) =>
count + (project.sprints?.length || 0), 0
);

const priorityDistribution = {
'Haute': events.filter(e => e.priority === 'Haute').length,
'Élevée': events.filter(e => e.priority === 'Élevée').length,
'Moyenne': events.filter(e => e.priority === 'Moyenne').length,
'Basse': events.filter(e => e.priority === 'Basse').length
};

const eventTypeDistribution = {
'Sprint Planning': events.filter(e => e.type === 'sprint-planning').length,
'Sprint Review': events.filter(e => e.type === 'sprint-review').length,
'Daily Standup': events.filter(e => e.type === 'daily-standup').length,
'Échéances': events.filter(e => e.type === 'deadline').length,
'Réunions': events.filter(e => e.type === 'meeting').length,
'Formations': events.filter(e => e.type === 'training').length
};

return {
totalEvents,
todayEvents,
upcomingEvents,
overdueEvents,
sprintEvents,
activeSprintsCount,
totalSprintsCount,
priorityDistribution,
eventTypeDistribution
};
}, [events, currentTime, projects]);

// Fonctions de gestion des filtres avec réactivité améliorée
const handleFilterChange = (filterType: string, value: string) => {
console.log('Changement de filtre:', filterType, value);
setFilters(prev => {
const newFilters = { ...prev, [filterType]: value };
console.log('Nouveaux filtres:', newFilters);
setFilterApplied(true);
return newFilters;
});
};

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const value = e.target.value;
console.log('Recherche:', value);
setSearchTerm(value);
setFilterApplied(true);
};

const clearFilters = () => {
console.log('Effacement des filtres');
setFilters({
type: '',
priority: '',
status: '',
member: '',
project: '',
sprint: ''
});
setSearchTerm('');
setFilterApplied(false);
};

// Fonctions de génération du calendrier
const generateCalendarDays = () => {
const year = viewDate.getFullYear();
const month = viewDate.getMonth();
const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);
const daysInMonth = lastDay.getDate();
const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

const days = [];
for (let i = 0; i < startDay; i++) {
days.push(null);
}
for (let i = 1; i <= daysInMonth; i++) {
days.push(i);
}
return days;
};

const getEventsForDay = (day: number) => {
if (!day) return [];
const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
return filteredEvents.filter(event => event.date === dateStr);
};

const navigateMonth = (direction: number) => {
setViewDate(prev => {
const newDate = new Date(prev);
newDate.setMonth(newDate.getMonth() + direction);
return newDate;
});
};

const goToToday = () => {
setViewDate(new Date());
};

const isToday = (day: number) => {
if (!day) return false;
const today = new Date();
return day === today.getDate() &&
viewDate.getMonth() === today.getMonth() &&
viewDate.getFullYear() === today.getFullYear();
};

// Couleurs et icônes pour tous les types d'événements
const getEventTypeColor = (type: string) => {
const colors = {
meeting: 'bg-blue-100 text-blue-800 border-blue-200',
presentation: 'bg-purple-100 text-purple-800 border-purple-200',
deadline: 'bg-red-100 text-red-800 border-red-200',
training: 'bg-green-100 text-green-800 border-green-200',
'sprint-planning': 'bg-indigo-100 text-indigo-800 border-indigo-200',
'sprint-review': 'bg-orange-100 text-orange-800 border-orange-200',
'daily-standup': 'bg-cyan-100 text-cyan-800 border-cyan-200'
};
return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getEventTypeIcon = (type: string) => {
switch (type) {
case 'meeting': return <Users className="h-3 w-3" />;
case 'presentation': return <FileText className="h-3 w-3" />;
case 'deadline': return <AlertTriangle className="h-3 w-3" />;
case 'training': return <Target className="h-3 w-3" />;
case 'sprint-planning': return <Rocket className="h-3 w-3" />;
case 'sprint-review': return <Flag className="h-3 w-3" />;
case 'daily-standup': return <Users className="h-3 w-3" />;
default: return <Clock className="h-3 w-3" />;
}
};

const getPriorityColor = (priority: string) => {
const colors = {
'Basse': 'bg-green-100 text-green-800',
'Moyenne': 'bg-yellow-100 text-yellow-800',
'Élevée': 'bg-orange-100 text-orange-800',
'Haute': 'bg-red-100 text-red-800'
};
return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

// Gestion des événements avec synchronisation
const handleCreateEvent = (eventData: any) => {
const newEvent: CalendarEvent = {
id: Date.now(),
...eventData,
date: eventData.startDateTime.split('T')[0],
time: `${new Date(eventData.startDateTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})} - ${new Date(eventData.endDateTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`,
createdAt: new Date(),
updatedAt: new Date()
};

setEvents(prevEvents => [...prevEvents, newEvent]);
setShowNewEventForm(false);

// Callback pour synchronisation externe
if (onCreateEvent) {
onCreateEvent(newEvent);
}
};

const handleUpdateEvent = (eventId: number | string, eventData: Partial<CalendarEvent>) => {
setEvents(prevEvents =>
prevEvents.map(event =>
event.id === eventId
? { ...event, ...eventData, updatedAt: new Date() }
: event
)
);
setSelectedEvent(null);
};

const handleDeleteEvent = (eventId: number | string) => {
if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
setSelectedEvent(null);
}
};

// Composant de statistiques enrichi
const StatisticsPanel = () => (
<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
<div className="flex justify-between items-center mb-4">
<h2 className="text-xl font-semibold text-gray-900 flex items-center">
<BarChart3 className="h-5 w-5 mr-2" />
Tableau de Bord du Calendrier Agile
</h2>
<div className="text-right">
<div className="text-lg font-bold text-indigo-600">
{currentTime.toLocaleTimeString('fr-FR')}
</div>
<div className="text-sm text-gray-500">
{currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
<div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">Total Événements</p>
<p className="text-2xl font-bold">{statistics.totalEvents}</p>
</div>
<CalendarIcon className="h-8 w-8 opacity-80" />
</div>
</div>

<div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">Aujourd'hui</p>
<p className="text-2xl font-bold">{statistics.todayEvents}</p>
</div>
<Clock className="h-8 w-8 opacity-80" />
</div>
</div>

<div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">Sprints Actifs</p>
<p className="text-2xl font-bold">{statistics.activeSprintsCount}</p>
</div>
<Rocket className="h-8 w-8 opacity-80" />
</div>
</div>

<div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm opacity-80">En retard</p>
<p className="text-2xl font-bold">{statistics.overdueEvents}</p>
</div>
<AlertTriangle className="h-8 w-8 opacity-80" />
</div>
</div>
</div>

{/* Distribution des types d'événements agiles */}
<div className="mt-6">
<h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
<Activity className="h-4 w-4 mr-2" />
Distribution des événements Agiles
</h3>
<div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
{Object.entries(statistics.eventTypeDistribution).map(([type, count]) => (
<div key={type} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
<span className="text-sm text-gray-600">{type}</span>
<span className="text-sm font-medium text-gray-900">{count}</span>
</div>
))}
</div>
</div>

{/* Progression globale des projets */}
<div className="mt-6">
<div className="flex justify-between text-sm text-gray-600 mb-1">
<span className="flex items-center">
<TrendingUp className="h-4 w-4 mr-1" />
Progression Globale des Projets
</span>
<span>{projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0}%</span>
</div>
<div className="w-full bg-gray-200 rounded-full h-3">
<div
className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
style={{ width: `${projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0}%` }}
></div>
</div>
</div>
</div>
);

// Composant de filtres enrichi avec interactivité améliorée
const FiltersPanel = () => (
<div className="bg-white p-6 rounded-lg shadow-lg mb-6">
<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
{/* Recherche améliorée */}
<div className="flex items-center space-x-4">
<div className="relative">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
<input
type="text"
placeholder="Rechercher événements, sprints, projets..."
value={searchTerm}
onChange={handleSearchChange}
className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-80 bg-white text-gray-900 text-base transition-all duration-200 hover:border-indigo-300 focus:shadow-lg"
/>
</div>
{/* Indication du nombre de résultats */}
<div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg font-medium">
{filteredEvents.length} événement{filteredEvents.length !== 1 ? 's' : ''} trouvé{filteredEvents.length !== 1 ? 's' : ''}
</div>
</div>

{/* Filtres avancés avec interactivité améliorée */}
<div className="flex flex-wrap items-center gap-3">
<select
value={filters.type}
onChange={(e) => handleFilterChange('type', e.target.value)}
className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 text-base transition-all duration-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transform hover:scale-105"
>
<option value="">Tous les types</option>
<option value="meeting">Réunions</option>
<option value="presentation">Présentations</option>
<option value="deadline">Échéances</option>
<option value="training">Formations</option>
<option value="sprint-planning">Sprint Planning</option>
<option value="sprint-review">Sprint Review</option>
<option value="daily-standup">Daily Standup</option>
</select>

<select
value={filters.project}
onChange={(e) => handleFilterChange('project', e.target.value)}
className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 text-base transition-all duration-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transform hover:scale-105"
>
<option value="">Tous les projets</option>
{projects.map(project => (
<option key={project.id} value={project.id}>{project.name}</option>
))}
</select>

<select
value={filters.sprint}
onChange={(e) => handleFilterChange('sprint', e.target.value)}
className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 text-base transition-all duration-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transform hover:scale-105"
>
<option value="">Tous les sprints</option>
{projects.flatMap(p => p.sprints || []).map(sprint => (
<option key={sprint.id} value={sprint.id}>
{projects.find(p => p.id === sprint.projectId)?.name} - {sprint.name}
</option>
))}
</select>

<select
value={filters.priority}
onChange={(e) => handleFilterChange('priority', e.target.value)}
className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 text-base transition-all duration-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transform hover:scale-105"
>
<option value="">Toutes les priorités</option>
<option value="Haute">Haute</option>
<option value="Élevée">Élevée</option>
<option value="Moyenne">Moyenne</option>
<option value="Basse">Basse</option>
</select>

<button
onClick={clearFilters}
className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200 flex items-center bg-gray-100 rounded-lg hover:bg-gray-200 hover:shadow-md transform hover:scale-105 active:scale-95"
>
<Filter className="h-4 w-4 mr-1" />
Effacer filtres
</button>
</div>
</div>
</div>
);

// Composant de détails d'événement enrichi
const EventDetails = ({ event }: { event: CalendarEvent }) => (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
<div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
<div className="p-6 border-b border-gray-200">
<div className="flex justify-between items-center">
<div className="flex items-center">
{getEventTypeIcon(event.type)}
<h2 className="text-2xl font-bold text-gray-900 ml-2">{event.title}</h2>
</div>
<div className="flex space-x-2">
<button
onClick={() => {
setSelectedEvent(null);
setShowNewEventForm(true);
}}
className="text-gray-400 hover:text-blue-600"
>
<Edit className="h-5 w-5" />
</button>
<button
onClick={() => handleDeleteEvent(event.id)}
className="text-gray-400 hover:text-red-600"
>
<Trash2 className="h-5 w-5" />
</button>
<button
onClick={() => setSelectedEvent(null)}
className="text-gray-400 hover:text-gray-600"
>
<Plus className="h-6 w-6 transform rotate-45" />
</button>
</div>
</div>
</div>

<div className="p-6 space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<h4 className="font-medium text-gray-900 mb-3 flex items-center">
<Settings className="h-4 w-4 mr-2" />
Informations générales
</h4>
<div className="space-y-3 text-sm">
<div className="flex justify-between">
<span className="text-gray-600">Type:</span>
<span className={`px-2 py-1 rounded-full text-xs flex items-center ${getEventTypeColor(event.type)}`}>
{getEventTypeIcon(event.type)}
<span className="ml-1">
{event.type === 'meeting' ? 'Réunion' :
event.type === 'presentation' ? 'Présentation' :
event.type === 'deadline' ? 'Échéance' :
event.type === 'training' ? 'Formation' :
event.type === 'sprint-planning' ? 'Sprint Planning' :
event.type === 'sprint-review' ? 'Sprint Review' :
event.type === 'daily-standup' ? 'Daily Standup' : event.type}
</span>
</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Priorité:</span>
<span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(event.priority)}`}>
{event.priority}
</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Statut:</span>
<span className="text-gray-900">{event.status}</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Lieu:</span>
<span className="text-gray-900">{event.location || 'Non spécifié'}</span>
</div>
{event.methodology && (
<div className="flex justify-between">
<span className="text-gray-600">Méthodologie:</span>
<span className="text-gray-900">{event.methodology}</span>
</div>
)}
</div>
</div>

<div>
<h4 className="font-medium text-gray-900 mb-3 flex items-center">
<Clock className="h-4 w-4 mr-2" />
Planification
</h4>
<div className="space-y-3 text-sm">
<div className="flex justify-between">
<span className="text-gray-600">Début:</span>
<span className="text-gray-900">
{new Date(event.startDateTime).toLocaleString('fr-FR')}
</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Fin:</span>
<span className="text-gray-900">
{new Date(event.endDateTime).toLocaleString('fr-FR')}
</span>
</div>
<div className="flex justify-between">
<span className="text-gray-600">Récurrence:</span>
<span className="text-gray-900">{event.recurrence}</span>
</div>
</div>
</div>
</div>

{event.description && (
<div>
<h4 className="font-medium text-gray-900 mb-2 flex items-center">
<FileText className="h-4 w-4 mr-2" />
Description
</h4>
<p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{event.description}</p>
</div>
)}

{/* Informations Sprint spécifiques */}
{(event.sprintId || event.sprintGoal) && (
<div>
<h4 className="font-medium text-gray-900 mb-3 flex items-center">
<Rocket className="h-4 w-4 mr-2" />
Informations Sprint
</h4>
<div className="bg-indigo-50 p-4 rounded-lg space-y-2">
{event.sprintGoal && (
<div className="flex items-start">
<Flag className="h-4 w-4 text-indigo-600 mr-2 mt-0.5" />
<div>
<span className="text-sm font-medium text-indigo-900">Objectif:</span>
<p className="text-sm text-indigo-700">{event.sprintGoal}</p>
</div>
</div>
)}
{event.capacity && (
<div className="flex items-center">
<Target className="h-4 w-4 text-indigo-600 mr-2" />
<span className="text-sm text-indigo-900">
<span className="font-medium">Capacité:</span> {event.capacity} story points
</span>
</div>
)}
{event.velocity !== undefined && (
<div className="flex items-center">
<TrendingUp className="h-4 w-4 text-indigo-600 mr-2" />
<span className="text-sm text-indigo-900">
<span className="font-medium">Vélocité:</span> {event.velocity} story points
</span>
</div>
)}
</div>
</div>
)}

<div>
<h4 className="font-medium text-gray-900 mb-3 flex items-center">
<Users className="h-4 w-4 mr-2" />
Participants ({event.members.length})
</h4>
<div className="flex flex-wrap gap-2">
{event.members.map((member, index) => (
<span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
<div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-2">
<span className="text-xs font-medium text-blue-700">
{member.split(' ').map(n => n[0]).join('')}
</span>
</div>
{member}
</span>
))}
{event.members.length === 0 && (
<span className="text-gray-500 text-sm">Aucun participant assigné</span>
)}
</div>
</div>

{event.tags.length > 0 && (
<div>
<h4 className="font-medium text-gray-900 mb-2">Tags</h4>
<div className="flex flex-wrap gap-2">
{event.tags.map((tag, index) => (
<span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
#{tag}
</span>
))}
</div>
</div>
)}

{/* Liens vers projet et sprint */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{event.projectId && (
<div>
<h4 className="font-medium text-gray-900 mb-2 flex items-center">
<Target className="h-4 w-4 mr-2" />
Projet associé
</h4>
<div className="bg-gray-50 p-3 rounded-lg">
<div className="flex items-center justify-between">
<span className="text-sm text-gray-700">
{projects.find(p => p.id === event.projectId)?.name || 'Projet inconnu'}
</span>
<ExternalLink className="h-4 w-4 text-gray-400" />
</div>
</div>
</div>
)}

{event.sprintId && (
<div>
<h4 className="font-medium text-gray-900 mb-2 flex items-center">
<Columns className="h-4 w-4 mr-2" />
Sprint associé
</h4>
<div className="bg-gray-50 p-3 rounded-lg">
<div className="flex items-center justify-between">
<span className="text-sm text-gray-700">
{projects.flatMap(p => p.sprints || []).find(s => s.id === event.sprintId)?.name || 'Sprint inconnu'}
</span>
<Rocket className="h-4 w-4 text-gray-400" />
</div>
</div>
</div>
)}
</div>

{event.taskIds.length > 0 && (
<div>
<h4 className="font-medium text-gray-900 mb-2 flex items-center">
<CheckCircle2 className="h-4 w-4 mr-2" />
Tâches associées ({event.taskIds.length})
</h4>
<div className="space-y-2">
{event.taskIds.map(taskId => {
const task = tasks.find(t => t.id === taskId);
return task ? (
<div key={taskId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
<div className="flex items-center space-x-2">
<Hash className="h-4 w-4 text-gray-400" />
<span className="text-sm text-gray-700">{task.title}</span>
</div>
<span className={`px-2 py-1 text-xs rounded ${
task.status === 'Terminé' ? 'bg-green-100 text-green-800' :
task.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
'bg-gray-100 text-gray-800'
}`}>
{task.status}
</span>
</div>
) : null;
})}
</div>
</div>
)}
</div>
</div>
</div>
);

const days = generateCalendarDays();
const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

return (
<div className="space-y-6">
{showNewEventForm && (
<NewCalendarView
onCancel={() => setShowNewEventForm(false)}
onCreate={handleCreateEvent}
existingMembers={teamMembers}
projects={projects}
tasks={tasks}
/>
)}

{!showNewEventForm && (
<>
<StatisticsPanel />
<FiltersPanel />

<div className="bg-white shadow-lg rounded-lg overflow-hidden">
{/* En-tête du calendrier enrichi */}
<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 space-y-4 lg:space-y-0">
<div>
<h1 className="text-2xl font-semibold text-gray-900 flex items-center">
<CalendarIcon className="h-6 w-6 mr-2" />
Calendrier Agile
</h1>
<p className="text-sm text-gray-600 mt-1">
{statistics.totalSprintsCount} sprints • {statistics.sprintEvents} événements agiles • {projects.length} projets actifs
</p>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
<div className="flex items-center space-x-2">
<button
onClick={() => navigateMonth(-1)}
className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-white/50 transition-colors"
>
<ChevronLeft className="h-5 w-5" />
</button>
<h2 className="text-lg font-medium text-gray-900 mx-4 min-w-[200px] text-center">
{viewDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
</h2>
<button
onClick={() => navigateMonth(1)}
className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-white/50 transition-colors"
>
<ChevronRight className="h-5 w-5" />
</button>
</div>

<div className="flex items-center space-x-2">
<button
onClick={goToToday}
className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-white/50 transition-colors"
>
Aujourd'hui
</button>

<button
onClick={() => setShowNewEventForm(true)}
className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
>
<Plus className="h-5 w-5 mr-2" />
Nouvel Événement
</button>
</div>
</div>
</div>

{/* En-tête des jours de la semaine */}
<div className="grid grid-cols-7 gap-px border-b border-gray-200">
{weekdays.map((day, index) => (
<div key={index} className="py-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
{day}
</div>
))}
</div>

{/* Grille du calendrier enrichie */}
<div className="grid grid-cols-7 gap-px bg-gray-200">
{days.map((day, index) => {
const dayEvents = getEventsForDay(day);
const isTodayDay = isToday(day);
const hasSprintEvents = dayEvents.some(e => e.type.includes('sprint') || e.type === 'daily-standup');

return (
<div
key={index}
className={`min-h-[140px] bg-white p-2 transition-all duration-200 cursor-pointer ${
isTodayDay ? 'bg-indigo-50 ring-2 ring-indigo-200' : ''
} ${!day ? 'bg-gray-50' : ''} ${
hasSprintEvents ? 'bg-gradient-to-br from-purple-50 to-indigo-50' : ''
} hover:bg-gray-50 hover:shadow-md`}
>
{day && (
<>
<div className="flex justify-between items-start mb-2">
<span className={`text-sm font-medium ${
isTodayDay ? 'text-indigo-600 font-bold' : 'text-gray-700'
}`}>
{day}
</span>
<div className="flex items-center space-x-1">
{isTodayDay && (
<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white animate-pulse">
•
</span>
)}
{hasSprintEvents && (
<Rocket className="h-3 w-3 text-purple-600" />
)}
</div>
</div>

<div className="space-y-1">
{dayEvents.slice(0, 4).map(event => (
<div
key={event.id}
onClick={() => setSelectedEvent(event)}
className={`px-2 py-1 text-xs rounded truncate cursor-pointer transition-all duration-200 transform hover:scale-105 ${getEventTypeColor(event.type)} hover:shadow-sm flex items-center`}
>
<div className="mr-1 flex-shrink-0">
{getEventTypeIcon(event.type)}
</div>
<div className="truncate">
<div className="font-medium truncate">{event.title}</div>
<div className="opacity-75 text-xs">{event.time}</div>
</div>
</div>
))}
{dayEvents.length > 4 && (
<div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
+{dayEvents.length - 4} autres
</div>
)}
</div>
</>
)}
</div>
);
})}
</div>
</div>

{/* Section événements à venir enrichie */}
<div className="mt-6">
<div className="flex justify-between items-center mb-4">
<h2 className="text-lg font-medium text-gray-900 flex items-center">
<TrendingUp className="h-5 w-5 mr-2" />
Événements à venir
</h2>
<div className="flex space-x-2">
<span className="text-sm text-gray-500">
{filteredEvents.filter(e => new Date(e.date) >= new Date()).length} événements
</span>
</div>
</div>

<div className="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
{filteredEvents
.filter(event => new Date(event.date) >= new Date())
.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
.slice(0, 15)
.map(event => (
<div
key={event.id}
className="p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-indigo-300 transform hover:scale-[1.01]"
onClick={() => setSelectedEvent(event)}
>
<div className="flex justify-between items-start">
<div className="flex-1">
<h3 className="text-sm font-medium text-gray-900 flex items-center">
{getEventTypeIcon(event.type)}
<span className="ml-2">{event.title}</span>
{event.sprintId && (
<span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
Sprint
</span>
)}
</h3>
<p className="mt-1 text-sm text-gray-500 flex items-center">
<Clock className="h-3 w-3 mr-1" />
{event.date} • {event.time}
</p>
{event.location && (
<p className="mt-1 text-xs text-gray-400 flex items-center">
<MapPin className="h-3 w-3 mr-1" />
{event.location}
</p>
)}
{event.sprintGoal && (
<p className="mt-1 text-xs text-purple-600 flex items-center">
<Flag className="h-3 w-3 mr-1" />
{event.sprintGoal}
</p>
)}
{event.methodology && (
<p className="mt-1 text-xs text-blue-600 flex items-center">
<Award className="h-3 w-3 mr-1" />
{event.methodology}
</p>
)}
</div>
<div className="flex items-center space-x-2 ml-4">
<span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
{event.priority}
</span>
<span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.type)} flex items-center`}>
{getEventTypeIcon(event.type)}
<span className="ml-1">
{event.type === 'meeting' ? 'Réunion' :
event.type === 'presentation' ? 'Présentation' :
event.type === 'deadline' ? 'Échéance' :
event.type === 'training' ? 'Formation' :
event.type === 'sprint-planning' ? 'Sprint Planning' :
event.type === 'sprint-review' ? 'Sprint Review' :
event.type === 'daily-standup' ? 'Daily Standup' : event.type}
</span>
</span>
</div>
</div>
{event.members.length > 0 && (
<div className="mt-2 flex items-center">
<Users className="h-3 w-3 text-gray-400 mr-1" />
<span className="text-xs text-gray-500">
{event.members.slice(0, 3).join(', ')}{event.members.length > 3 ? ` +${event.members.length - 3}` : ''}
</span>
</div>
)}
</div>
))}

{filteredEvents.filter(event => new Date(event.date) >= new Date()).length === 0 && (
<div className="p-8 text-center">
<CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
<h3 className="text-lg font-medium text-gray-900 mb-2">Aucun événement à venir</h3>
<p className="text-gray-500 mb-6">
Les événements de vos projets et sprints apparaîtront automatiquement ici.
</p>
<button
onClick={() => setShowNewEventForm(true)}
className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
>
<Plus className="h-4 w-4 mr-2" />
Créer un événement
</button>
</div>
)}
</div>
</div>
</>
)}

{selectedEvent && <EventDetails event={selectedEvent} />}
</div>
);
};

export default CalendarView;