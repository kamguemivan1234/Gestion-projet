import React, { useState, useEffect, useMemo } from 'react';
import {
Plus, MoreHorizontal, Clock, CheckCircle2, AlertCircle,
Edit, Trash2, Users, Calendar, TrendingUp, DollarSign,
Settings, Eye, Play, Pause, Square, Filter, Search,
BarChart3, Target, Award, Zap, ChevronDown, ChevronUp,
FileText, Link as LinkIcon, Download, Share2, LayoutGrid, List,
Github, ExternalLink, Columns, PlayCircle, Timer, Activity,
ArrowLeft, Rocket, Flag, Hash
} from 'lucide-react';
import NewProjectView from '../newintegration/NewProjectView';

// Types
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'À faire' | 'En cours' | 'Terminé';
  priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
  assignee?: string;
  estimatedHours: number;
  actualHours: number;
  storyPoints: number;
  sprintId?: number;
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
  capacity: number; // en story points
  velocity: number; // story points complétés
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
members: Array<{
name: string;
role?: string;
avatar?: string;
}>;
tasks: {
total: number;
completed: number;
inProgress: number;
pending: number;
};
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

// Données initiales enrichies avec sprints
const initialProjects: Project[] = [
{
id: 1,
name: "Refonte du site web",
description: "Modernisation complète du site web de l'entreprise avec une nouvelle identité visuelle et une meilleure expérience utilisateur.",
progress: 75,
status: "En cours",
priority: "Élevée",
startDate: "2024-01-15T09:00",
endDate: "2024-08-15T17:00",
budget: 50000,
spent: 32000,
currency: "EUR",
members: [
{ name: "Marie Dubois", role: "Frontend Dev" },
{ name: "Thomas Martin", role: "Backend Dev" },
{ name: "Sophie Bernard", role: "Designer" }
],
tasks: { total: 24, completed: 18, inProgress: 4, pending: 2 },
client: "Direction Marketing",
projectManager: "Pierre Leroux",
tags: ["web", "frontend", "design"],
attachments: 8,
riskLevel: "Moyen",
methodology: "Agile",
createdAt: new Date("2024-01-15"),
updatedAt: new Date(),
sprints: [
{
id: 1,
name: "Sprint 1 - Design System",
goal: "Créer le design system et les composants de base",
startDate: "2024-01-15T09:00",
endDate: "2024-01-29T17:00",
status: "Terminé",
capacity: 40,
velocity: 38,
projectId: 1,
tasks: [
{
id: 1,
title: "Créer la charte graphique",
description: "Définir les couleurs, typographies et styles de base",
status: "Terminé",
priority: "Élevée",
assignee: "Sophie Bernard",
estimatedHours: 16,
actualHours: 18,
storyPoints: 8,
sprintId: 1,
createdAt: new Date("2024-01-15"),
updatedAt: new Date("2024-01-25")
},
{
id: 2,
title: "Composants UI de base",
description: "Boutons, formulaires, navigation",
status: "Terminé",
priority: "Élevée",
assignee: "Marie Dubois",
estimatedHours: 20,
actualHours: 22,
storyPoints: 13,
sprintId: 1,
createdAt: new Date("2024-01-16"),
updatedAt: new Date("2024-01-28")
}
],
createdAt: new Date("2024-01-15"),
updatedAt: new Date("2024-01-29")
},
{
id: 2,
name: "Sprint 2 - Pages principales",
goal: "Développer les pages d'accueil, à propos et contact",
startDate: "2024-01-30T09:00",
endDate: "2024-02-13T17:00",
status: "Actif",
capacity: 45,
velocity: 32,
projectId: 1,
tasks: [
{
id: 3,
title: "Page d'accueil",
description: "Landing page avec hero section et features",
status: "Terminé",
priority: "Élevée",
assignee: "Marie Dubois",
estimatedHours: 24,
actualHours: 26,
storyPoints: 20,
sprintId: 2,
createdAt: new Date("2024-01-30"),
updatedAt: new Date("2024-02-08")
},
{
id: 4,
title: "Page à propos",
description: "Présentation de l'entreprise et équipe",
status: "En cours",
priority: "Moyenne",
assignee: "Thomas Martin",
estimatedHours: 12,
actualHours: 8,
storyPoints: 8,
sprintId: 2,
createdAt: new Date("2024-02-01"),
updatedAt: new Date()
},
{
id: 5,
title: "Formulaire de contact",
description: "Formulaire avec validation et envoi email",
status: "À faire",
priority: "Moyenne",
assignee: "Thomas Martin",
estimatedHours: 8,
actualHours: 0,
storyPoints: 5,
sprintId: 2,
createdAt: new Date("2024-02-01"),
updatedAt: new Date()
}
],
createdAt: new Date("2024-01-30"),
updatedAt: new Date()
}
],
backlog: [
{
id: 6,
title: "SEO et métadonnées",
description: "Optimisation pour les moteurs de recherche",
status: "À faire",
priority: "Moyenne",
assignee: "Marie Dubois",
estimatedHours: 16,
actualHours: 0,
storyPoints: 13,
createdAt: new Date("2024-02-01"),
updatedAt: new Date()
},
{
id: 7,
title: "Tests automatisés",
description: "Tests unitaires et d'intégration",
status: "À faire",
priority: "Basse",
assignee: "Thomas Martin",
estimatedHours: 20,
actualHours: 0,
storyPoints: 8,
createdAt: new Date("2024-02-01"),
updatedAt: new Date()
}
]
},
{
id: 2,
name: "Application mobile",
description: "Développement d'une application mobile pour les clients permettant de suivre leurs commandes et de gérer leur compte.",
progress: 30,
status: "En cours",
priority: "Élevée",
startDate: "2024-02-01T09:00",
endDate: "2024-09-30T17:00",
budget: 75000,
spent: 18000,
currency: "EUR",
members: [
{ name: "Jean Martin", role: "Mobile Dev" },
{ name: "Lucie Petit", role: "UX Designer" }
],
tasks: { total: 32, completed: 10, inProgress: 8, pending: 14 },
client: "Direction Commerciale",
projectManager: "Emma Wilson",
tags: ["mobile", "ios", "android"],
attachments: 12,
riskLevel: "Élevé",
methodology: "Scrum",
createdAt: new Date("2024-02-01"),
updatedAt: new Date(),
sprints: [],
backlog: []
}
];

// Composant de planification des sprints
const SprintPlanningView: React.FC<{
  project: Project;
  onUpdateProject: (project: Project) => void;
  onBack: () => void;
}> = ({ project, onUpdateProject, onBack }) => {
  const [activeTab, setActiveTab] = useState<'board' | 'backlog' | 'analytics'>('board');
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const activeSprint = project.sprints.find(s => s.status === 'Actif');
  const upcomingSprints = project.sprints.filter(s => s.status === 'Planifié');
  const completedSprints = project.sprints.filter(s => s.status === 'Terminé');

  // Composant de création de sprint
  const CreateSprintModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      goal: '',
      startDate: '',
      endDate: '',
      capacity: 40
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newSprint: Sprint = {
        id: Date.now(),
        ...formData,
        status: 'Planifié',
        velocity: 0,
        projectId: project.id,
        tasks: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedProject = {
        ...project,
        sprints: [...project.sprints, newSprint]
      };
      onUpdateProject(updatedProject);
      setShowCreateSprint(false);
      setFormData({ name: '', goal: '', startDate: '', endDate: '', capacity: 40 });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Créer un nouveau sprint</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du sprint
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objectif du sprint
                </label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacité (story points)
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCreateSprint(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Créer le sprint
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Composant de création de tâche
  const CreateTaskModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      priority: 'Moyenne' as Task['priority'],
      assignee: '',
      estimatedHours: 1,
      storyPoints: 1,
      sprintId: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newTask: Task = {
        id: Date.now(),
        ...formData,
        status: 'À faire',
        actualHours: 0,
        estimatedHours: parseInt(formData.estimatedHours.toString()),
        storyPoints: parseInt(formData.storyPoints.toString()),
        sprintId: formData.sprintId ? parseInt(formData.sprintId) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedProject = { ...project };
      
      if (newTask.sprintId) {
        // Ajouter à un sprint
        const sprintIndex = updatedProject.sprints.findIndex(s => s.id === newTask.sprintId);
        if (sprintIndex !== -1) {
          updatedProject.sprints[sprintIndex].tasks.push(newTask);
        }
      } else {
        // Ajouter au backlog
        updatedProject.backlog.push(newTask);
      }

      onUpdateProject(updatedProject);
      setShowCreateTask(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Créer une nouvelle tâche</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de la tâche
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as Task['priority']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
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
                    value={formData.assignee}
                    onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                  >
                    <option value="">Non assigné</option>
                    {project.members.map(member => (
                      <option key={member.name} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimation (heures)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({...formData, estimatedHours: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Story Points
                  </label>
                  <input
                    type="number"
                    value={formData.storyPoints}
                    onChange={(e) => setFormData({...formData, storyPoints: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sprint
                </label>
                <select
                  value={formData.sprintId}
                  onChange={(e) => setFormData({...formData, sprintId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                >
                  <option value="">Backlog (aucun sprint)</option>
                  {project.sprints
                    .filter(sprint => sprint.status !== 'Terminé')
                    .map(sprint => (
                      <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowCreateTask(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Créer la tâche
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Composant de tâche
  const TaskCard: React.FC<{ 
    task: Task; 
    onUpdateTask: (taskId: number, task: Task) => void;
    onDeleteTask: (taskId: number) => void;
  }> = ({ task, onUpdateTask, onDeleteTask }) => {
    const handleStatusChange = (newStatus: Task['status']) => {
      onUpdateTask(task.id, { ...task, status: newStatus, updatedAt: new Date() });
    };

    const getPriorityColor = (priority: Task['priority']) => {
      switch (priority) {
        case 'Urgente': return 'bg-red-100 text-red-800';
        case 'Élevée': return 'bg-orange-100 text-orange-800';
        case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-green-100 text-green-800';
      }
    };

    const getStatusIcon = (status: Task['status']) => {
      switch (status) {
        case 'À faire': return <Clock className="h-4 w-4 text-gray-600" />;
        case 'En cours': return <Play className="h-4 w-4 text-blue-600" />;
        case 'Terminé': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
        default: return <Clock className="h-4 w-4 text-gray-600" />;
      }
    };

    return (
      <div 
        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab"
        draggable
        onDragStart={(e) => {
          setDraggedTask(task);
          e.dataTransfer.effectAllowed = 'move';
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
          <div className="flex items-center space-x-1">
            <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <button 
              onClick={() => onDeleteTask(task.id)}
              className="text-gray-400 hover:text-red-600 p-1"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center space-x-1">
            {getStatusIcon(task.status)}
            <span>{task.status}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Hash className="h-3 w-3" />
            <span>{task.storyPoints} SP</span>
          </div>
        </div>

        {task.assignee && (
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-medium text-indigo-700">
                {task.assignee.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="text-xs text-gray-600">{task.assignee}</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="À faire">À faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
          <div className="flex items-center text-xs text-gray-500">
            <Timer className="h-3 w-3 mr-1" />
            {task.actualHours}h / {task.estimatedHours}h
          </div>
        </div>
      </div>
    );
  };

  // Tableau Kanban pour un sprint
  const SprintBoard: React.FC<{ sprint: Sprint }> = ({ sprint }) => {
    const todoTasks = sprint.tasks.filter(t => t.status === 'À faire');
    const inProgressTasks = sprint.tasks.filter(t => t.status === 'En cours');
    const doneTasks = sprint.tasks.filter(t => t.status === 'Terminé');

    const handleTaskUpdate = (taskId: number, updatedTask: Task) => {
      const updatedProject = { ...project };
      const sprintIndex = updatedProject.sprints.findIndex(s => s.id === sprint.id);
      const taskIndex = updatedProject.sprints[sprintIndex].tasks.findIndex(t => t.id === taskId);
      updatedProject.sprints[sprintIndex].tasks[taskIndex] = updatedTask;
      onUpdateProject(updatedProject);
    };

    const handleTaskDelete = (taskId: number) => {
      const updatedProject = { ...project };
      const sprintIndex = updatedProject.sprints.findIndex(s => s.id === sprint.id);
      updatedProject.sprints[sprintIndex].tasks = updatedProject.sprints[sprintIndex].tasks.filter(t => t.id !== taskId);
      onUpdateProject(updatedProject);
    };

    const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
      e.preventDefault();
      if (draggedTask && draggedTask.status !== targetStatus) {
        handleTaskUpdate(draggedTask.id, { ...draggedTask, status: targetStatus });
      }
      setDraggedTask(null);
    };

    const allowDrop = (e: React.DragEvent) => {
      e.preventDefault();
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* À faire */}
        <div 
          className="bg-gray-50 rounded-lg p-4 min-h-[400px]"
          onDrop={(e) => handleDrop(e, 'À faire')}
          onDragOver={allowDrop}
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            À faire ({todoTasks.length})
          </h3>
          <div className="space-y-3">
            {todoTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdateTask={handleTaskUpdate}
                onDeleteTask={handleTaskDelete}
              />
            ))}
          </div>
        </div>

        {/* En cours */}
        <div 
          className="bg-blue-50 rounded-lg p-4 min-h-[400px]"
          onDrop={(e) => handleDrop(e, 'En cours')}
          onDragOver={allowDrop}
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            En cours ({inProgressTasks.length})
          </h3>
          <div className="space-y-3">
            {inProgressTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdateTask={handleTaskUpdate}
                onDeleteTask={handleTaskDelete}
              />
            ))}
          </div>
        </div>

        {/* Terminé */}
        <div 
          className="bg-green-50 rounded-lg p-4 min-h-[400px]"
          onDrop={(e) => handleDrop(e, 'Terminé')}
          onDragOver={allowDrop}
        >
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Terminé ({doneTasks.length})
          </h3>
          <div className="space-y-3">
            {doneTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onUpdateTask={handleTaskUpdate}
                onDeleteTask={handleTaskDelete}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Backlog avec possibilité de drag vers les sprints
  const BacklogView = () => {
    const handleTaskUpdate = (taskId: number, updatedTask: Task) => {
      const updatedProject = { ...project };
      const taskIndex = updatedProject.backlog.findIndex(t => t.id === taskId);
      updatedProject.backlog[taskIndex] = updatedTask;
      onUpdateProject(updatedProject);
    };

    const handleTaskDelete = (taskId: number) => {
      const updatedProject = { ...project };
      updatedProject.backlog = updatedProject.backlog.filter(t => t.id !== taskId);
      onUpdateProject(updatedProject);
    };

    const moveTaskToSprint = (taskId: number, sprintId: string) => {
      const updatedProject = { ...project };
      const taskIndex = updatedProject.backlog.findIndex(t => t.id === taskId);
      const task = updatedProject.backlog[taskIndex];
      
      // Retirer du backlog
      updatedProject.backlog.splice(taskIndex, 1);
      
      // Ajouter au sprint
      const sprintIndex = updatedProject.sprints.findIndex(s => s.id === parseInt(sprintId));
      task.sprintId = parseInt(sprintId);
      updatedProject.sprints[sprintIndex].tasks.push(task);
      
      onUpdateProject(updatedProject);
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <LayoutGrid className="h-5 w-5 mr-2" />
            Product Backlog ({project.backlog.length} tâches)
          </h3>
          <button
            onClick={() => setShowCreateTask(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.backlog.map(task => (
            <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border">
              <TaskCard 
                task={task} 
                onUpdateTask={handleTaskUpdate}
                onDeleteTask={handleTaskDelete}
              />
              <div className="mt-3 pt-3 border-t">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Assigner au sprint
                </label>
                <select
                  onChange={(e) => e.target.value && moveTaskToSprint(task.id, e.target.value)}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  value=""
                >
                  <option value="">Choisir un sprint...</option>
                  {project.sprints
                    .filter(sprint => sprint.status !== 'Terminé')
                    .map(sprint => (
                      <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Vue analytics avec statistiques des sprints
  const AnalyticsView = () => {
    const sprintStats = useMemo(() => {
      return project.sprints.map(sprint => {
        const totalPoints = sprint.tasks.reduce((sum, task) => sum + task.storyPoints, 0);
        const completedPoints = sprint.tasks
          .filter(task => task.status === 'Terminé')
          .reduce((sum, task) => sum + task.storyPoints, 0);
        
        return {
          ...sprint,
          totalPoints,
          completedPoints,
          progress: totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0
        };
      });
    }, [project.sprints]);

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Analytics des Sprints
        </h3>
        
        {/* Métriques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{project.sprints.length}</div>
                <div className="text-sm opacity-80">Total Sprints</div>
              </div>
              <Rocket className="h-8 w-8 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{completedSprints.length}</div>
                <div className="text-sm opacity-80">Sprints Terminés</div>
              </div>
              <CheckCircle2 className="h-8 w-8 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {completedSprints.reduce((sum, s) => sum + s.velocity, 0)}
                </div>
                <div className="text-sm opacity-80">Vélocité Totale</div>
              </div>
              <Activity className="h-8 w-8 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {completedSprints.length > 0 
                    ? Math.round(completedSprints.reduce((sum, s) => sum + s.velocity, 0) / completedSprints.length)
                    : 0
                  }
                </div>
                <div className="text-sm opacity-80">Vélocité Moyenne</div>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Progression des sprints */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold mb-4">Progression des Sprints</h4>
          <div className="space-y-4">
            {sprintStats.map(sprint => (
              <div key={sprint.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{sprint.name}</h5>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    sprint.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                    sprint.status === 'Actif' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sprint.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="font-medium">Points complétés:</span> {sprint.completedPoints}/{sprint.totalPoints}
                  </div>
                  <div>
                    <span className="font-medium">Capacité:</span> {sprint.capacity}
                  </div>
                  <div>
                    <span className="font-medium">Vélocité:</span> {sprint.velocity}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${sprint.progress}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600 mt-1">
                  {Math.round(sprint.progress)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux projets
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Columns className="h-6 w-6 mr-2" />
            Sprints - {project.name}
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateSprint(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Sprint
          </button>
          <button
            onClick={() => setShowCreateTask(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Flag className="h-4 w-4 mr-2" />
            Nouvelle Tâche
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'board' as const, name: 'Sprint Board', icon: Columns },
            { id: 'backlog' as const, name: 'Backlog', icon: LayoutGrid },
            { id: 'analytics' as const, name: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Sprint actif info */}
      {activeSprint && activeTab === 'board' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-blue-900 flex items-center">
                <PlayCircle className="h-5 w-5 mr-2" />
                {activeSprint.name}
              </h3>
              <p className="text-blue-700 text-sm mt-1">{activeSprint.goal}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-blue-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(activeSprint.startDate).toLocaleDateString('fr-FR')} - {new Date(activeSprint.endDate).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center">
                  <Flag className="h-4 w-4 mr-1" />
                  {activeSprint.tasks.length} tâches
                </span>
                <span className="flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  {activeSprint.velocity}/{activeSprint.capacity} points
                </span>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow-sm">
        {activeTab === 'board' && activeSprint && (
          <div className="p-6">
            <SprintBoard sprint={activeSprint} />
          </div>
        )}
        
        {activeTab === 'board' && !activeSprint && (
          <div className="p-12 text-center">
            <PlayCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun sprint actif</h3>
            <p className="text-gray-500 mb-6">
              Créez un nouveau sprint ou activez un sprint existant pour commencer à travailler.
            </p>
            <button
              onClick={() => setShowCreateSprint(true)}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Créer le Premier Sprint
            </button>
          </div>
        )}

        {activeTab === 'backlog' && (
          <div className="p-6">
            <BacklogView />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6">
            <AnalyticsView />
          </div>
        )}
      </div>

      {/* Modales */}
      {showCreateSprint && <CreateSprintModal />}
      {showCreateTask && <CreateTaskModal />}
    </div>
  );
};

const ProjectsView = () => {
  // Tous les hooks doivent être en haut, avant tout return conditionnel
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showSprintPlanning, setShowSprintPlanning] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'deadline' | 'budget'>('name');
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  // Mise à jour du temps en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fonction pour ouvrir GitHub dans un nouvel onglet
  const openGitHub = () => {
    window.open('https://github.com/kamguemivan1234', '_blank', 'noopener,noreferrer');
  };

  // Statistiques calculées en temps réel
  const statistics = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'En cours').length;
    const completedProjects = projects.filter(p => p.status === 'Terminé').length;
    const overdueProjects = projects.filter(p =>
      new Date(p.endDate) < currentTime && p.status !== 'Terminé'
    ).length;

    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      overdueProjects,
      totalBudget,
      totalSpent,
      avgProgress: Math.round(avgProgress),
      budgetUtilization: Math.round((totalSpent / totalBudget) * 100)
    };
  }, [projects, currentTime]);

  // Filtrage et tri des projets
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !filterStatus || project.status === filterStatus;
      const matchesPriority = !filterPriority || project.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.progress - a.progress;
        case 'deadline':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'budget':
          return b.budget - a.budget;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, filterStatus, filterPriority, sortBy]);

  const handleCreateProject = (newProject: any) => {
    const formattedProject: Project = {
      ...newProject,
      id: Date.now(),
      progress: 0,
      spent: 0,
      tasks: {
        total: newProject.tasks?.length || 0,
        completed: 0,
        inProgress: 0,
        pending: newProject.tasks?.length || 0
      },
      members: newProject.members.map((name: string) => ({ name, role: 'Membre' })),
      attachments: newProject.attachments?.length || 0,
      sprints: [],
      backlog: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setProjects([...projects, formattedProject]);
    setShowNewProjectForm(false);
  };

  const updateProjectProgress = (projectId: number, newProgress: number) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              progress: newProgress,
              status: newProgress === 100 ? 'Terminé' :
                newProgress > 0 ? 'En cours' : 'En attente',
              updatedAt: new Date()
            }
          : project
      )
    );
  };

  const updateProjectStatus = (projectId: number, newStatus: Project['status']) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              status: newStatus,
              updatedAt: new Date()
            }
          : project
      )
    );
  };

  const updateProjectBudget = (projectId: number, field: 'budget' | 'spent', value: number) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              [field]: value,
              updatedAt: new Date()
            }
          : project
      )
    );
  };

  const deleteProject = (projectId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const isOverdue = (project: Project) => {
    return new Date(project.endDate) < currentTime && project.status !== 'Terminé';
  };

  const getDaysUntilDeadline = (project: Project) => {
    const deadline = new Date(project.endDate);
    const diffTime = deadline.getTime() - currentTime.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Composant de statistiques
  const StatisticsPanel = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Tableau de Bord des Projets</h2>
        <div className="flex items-center space-x-4">
          {/* Bouton GitHub */}
          <button
            onClick={openGitHub}
            className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors group"
            title="Voir les projets sur GitHub"
          >
            <Github className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Projets GitHub
            <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
          </button>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">
              {currentTime.toLocaleTimeString('fr-FR')}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Projets</p>
              <p className="text-2xl font-bold">{statistics.totalProjects}</p>
            </div>
            <Target className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Actifs</p>
              <p className="text-2xl font-bold">{statistics.activeProjects}</p>
            </div>
            <Play className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Terminés</p>
              <p className="text-2xl font-bold">{statistics.completedProjects}</p>
            </div>
            <Award className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">En Retard</p>
              <p className="text-2xl font-bold">{statistics.overdueProjects}</p>
            </div>
            <AlertCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progression Globale</span>
          <span>{statistics.avgProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${statistics.avgProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Composant de projet (vue grille)
  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const isProjectOverdue = isOverdue(project);
    const daysUntilDeadline = getDaysUntilDeadline(project);
    const budgetUtilization = (project.spent / project.budget) * 100;

    return (
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                project.priority === 'Urgente' ? 'bg-red-100 text-red-800' :
                project.priority === 'Élevée' ? 'bg-orange-100 text-orange-800' :
                project.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {project.priority}
              </span>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Statut et Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {project.status === 'Terminé' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                {project.status === 'En cours' && <Play className="h-4 w-4 text-blue-600" />}
                {project.status === 'En pause' && <Pause className="h-4 w-4 text-yellow-600" />}
                {project.status === 'En retard' && <AlertCircle className="h-4 w-4 text-red-600" />}
                {project.status === 'En attente' && <Clock className="h-4 w-4 text-gray-600" />}
                <span className={`text-sm font-medium ${
                  project.status === 'Terminé' ? 'text-green-600' :
                  project.status === 'En cours' ? 'text-blue-600' :
                  project.status === 'En retard' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {project.status}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
            </div>
            
            {/* Barre de progression interactive */}
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    project.progress === 100 ? 'bg-green-500' :
                    project.progress >= 75 ? 'bg-blue-500' :
                    project.progress >= 50 ? 'bg-yellow-500' :
                    project.progress >= 25 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) => updateProjectProgress(project.id, parseInt(e.target.value))}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                title="Glissez pour modifier la progression"
              />
            </div>
          </div>

          {/* Métriques avec sprints */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{project.tasks.completed}/{project.tasks.total}</div>
              <div className="text-xs text-gray-500">Tâches</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">
                {project.sprints?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Sprints</div>
            </div>
          </div>

          {/* Équipe */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Équipe</span>
              <span className="text-xs text-gray-500">{project.members.length} membres</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.members.slice(0, 3).map((member, index) => (
                <div key={index} className="flex items-center bg-indigo-50 rounded-full px-2 py-1">
                  <div className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center mr-1">
                    <span className="text-xs font-medium text-indigo-700">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-xs text-indigo-700">{member.name}</span>
                </div>
              ))}
              {project.members.length > 3 && (
                <div className="flex items-center text-xs text-gray-500">
                  +{project.members.length - 3} autres
                </div>
              )}
            </div>
          </div>

          {/* Échéance et alertes */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(project.endDate).toLocaleDateString('fr-FR')}
            </div>
            {isProjectOverdue && (
              <span className="text-red-600 font-medium">🚨 En retard</span>
            )}
            {!isProjectOverdue && daysUntilDeadline <= 7 && daysUntilDeadline > 0 && (
              <span className="text-orange-600 font-medium">⚠️ {daysUntilDeadline}j restants</span>
            )}
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSelectedProject(project);
                setShowSprintPlanning(true);
              }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
            >
              <Columns className="h-4 w-4 mr-1" />
              Sprints
            </button>
            <button
              onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center"
            >
              <Eye className="h-4 w-4 mr-1" />
              Détails
              {expandedProject === project.id ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-indigo-600">
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => deleteProject(project.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Détails étendus */}
        {expandedProject === project.id && (
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informations Projet</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Chef de projet:</span> {project.projectManager}</div>
                  <div><span className="text-gray-500">Client:</span> {project.client}</div>
                  <div><span className="text-gray-500">Méthodologie:</span> {project.methodology}</div>
                  <div><span className="text-gray-500">Risque:</span> 
                    <span className={`ml-1 ${
                      project.riskLevel === 'Élevé' ? 'text-red-600' :
                      project.riskLevel === 'Moyen' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>{project.riskLevel}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sprint & Backlog</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sprints actifs:</span>
                    <span className="font-medium">{project.sprints?.filter(s => s.status === 'Actif').length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total sprints:</span>
                    <span className="font-medium">{project.sprints?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Backlog:</span>
                    <span className="font-medium">{project.backlog?.length || 0} tâches</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex space-x-2">
                <select
                  value={project.status}
                  onChange={(e) => updateProjectStatus(project.id, e.target.value as Project['status'])}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="En pause">En pause</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>{project.attachments} fichiers</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Affichage conditionnel en fonction de l'état
  if (showSprintPlanning && selectedProject) {
    return (
      <SprintPlanningView
        project={selectedProject}
        onUpdateProject={(updatedProject) => {
          setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
          setSelectedProject(updatedProject);
        }}
        onBack={() => {
          setShowSprintPlanning(false);
          setSelectedProject(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {showNewProjectForm && (
        <NewProjectView
          onCancel={() => setShowNewProjectForm(false)}
          onCreate={handleCreateProject}
          existingMembers={Array.from(new Set(projects.flatMap(p => p.members.map(m => m.name))))}
        />
      )}

      {!showNewProjectForm && (
        <>
          <StatisticsPanel />

          {/* Header avec contrôles */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Projets Agiles</h1>
            <div className="flex items-center space-x-3">
              {/* Bouton GitHub supplémentaire dans le header */}
              <button
                onClick={openGitHub}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors group"
                title="Consulter les projets sur GitHub"
              >
                <Github className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                GitHub
              </button>
              <button
                onClick={() => setShowNewProjectForm(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau Projet
              </button>
            </div>
          </div>

          {/* Filtres et vues */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              {/* Boutons de vue */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('analytics')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'analytics' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
              </div>

              {/* Contrôles de recherche et filtrage */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher des projets..."
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
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="En retard">En retard</option>
                  <option value="En attente">En attente</option>
                  <option value="En pause">En pause</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                >
                  <option value="">Toutes les priorités</option>
                  <option value="Urgente">Urgente</option>
                  <option value="Élevée">Élevée</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Basse">Basse</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base"
                >
                  <option value="name">Trier par nom</option>
                  <option value="progress">Trier par progression</option>
                  <option value="deadline">Trier par échéance</option>
                  <option value="budget">Trier par budget</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredAndSortedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
            
            {/* Carte d'ajout de projet */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-indigo-400 transition-colors cursor-pointer"
                 onClick={() => setShowNewProjectForm(true)}>
              <Plus className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Créer un nouveau projet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Commencez à organiser et suivre un nouveau projet avec des sprints
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Projet
              </button>
            </div>
          </div>

          {filteredAndSortedProjects.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterStatus || filterPriority 
                  ? 'Aucun projet ne correspond à vos critères de recherche.'
                  : 'Créez votre premier projet pour commencer.'}
              </p>
              {!searchTerm && !filterStatus && !filterPriority && (
                <button
                  onClick={() => setShowNewProjectForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Créer le Premier Projet
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsView;