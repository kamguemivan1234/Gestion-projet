import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, MoreHorizontal, Clock, CheckCircle2, AlertCircle,
  Edit, Trash2, Users, Calendar, TrendingUp, DollarSign,
  Settings, Eye, Play, Pause, Square, Filter, Search,
  BarChart3, Target, Award, Zap, ChevronDown, ChevronUp,
  FileText, Link as LinkIcon, Download, Share2, LayoutGrid, List,
  Github, ExternalLink, Columns, PlayCircle, Timer, Activity,
  ArrowLeft, Rocket, Flag, Hash, MessageSquare, X
} from 'lucide-react';

// Types
interface TaskComment {
  id: number;
  author: string;
  text: string;
  date: Date;
}

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
  comments?: TaskComment[];
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
  myTasks?: Task[];
  createdAt: Date;
  updatedAt: Date;
}

// Données simulées pour l'employé (uniquement projets où il est assigné)
const currentEmployee = "NathanDev";

const initialEmployeeProjects: Project[] = [
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
      { name: "NathanDev", role: "Frontend Dev" },
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
    myTasks: [
      {
        id: 1,
        title: "Composants UI de base",
        description: "Boutons, formulaires, navigation",
        status: "Terminé",
        priority: "Élevée",
        assignee: "NathanDev",
        estimatedHours: 20,
        actualHours: 22,
        storyPoints: 13,
        sprintId: 1,
        comments: [
          { id: 1, author: "Pierre Leroux", text: "Excellent travail sur les composants!", date: new Date("2024-01-28") }
        ],
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-28")
      },
      {
        id: 3,
        title: "Page d'accueil",
        description: "Landing page avec hero section et features",
        status: "En cours",
        priority: "Élevée",
        assignee: "NathanDev",
        estimatedHours: 24,
        actualHours: 16,
        storyPoints: 20,
        sprintId: 2,
        comments: [],
        createdAt: new Date("2024-01-30"),
        updatedAt: new Date()
      },
      {
        id: 6,
        title: "SEO et métadonnées",
        description: "Optimisation pour les moteurs de recherche",
        status: "À faire",
        priority: "Moyenne",
        assignee: "NathanDev",
        estimatedHours: 16,
        actualHours: 0,
        storyPoints: 13,
        comments: [],
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date()
      }
    ],
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
        tasks: [],
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
        tasks: [],
        createdAt: new Date("2024-01-30"),
        updatedAt: new Date()
      }
    ],
    backlog: []
  },
  {
    id: 2,
    name: "Application mobile",
    description: "Développement d'une application mobile pour les clients permettant de suivre leurs commandes et de gérer leur compte.",
    progress: 45,
    status: "En cours",
    priority: "Élevée",
    startDate: "2024-02-01T09:00",
    endDate: "2024-09-30T17:00",
    budget: 75000,
    spent: 28000,
    currency: "EUR",
    members: [
      { name: "NathanDev", role: "Frontend Dev" },
      { name: "Jean Martin", role: "Mobile Dev" },
      { name: "Lucie Petit", role: "UX Designer" }
    ],
    tasks: { total: 32, completed: 8, inProgress: 6, pending: 18 },
    client: "Direction Commerciale",
    projectManager: "Emma Wilson",
    tags: ["mobile", "react-native", "frontend"],
    attachments: 12,
    riskLevel: "Moyen",
    methodology: "Scrum",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date(),
    myTasks: [
      {
        id: 7,
        title: "Interface d'authentification",
        description: "Écrans de connexion et inscription",
        status: "En cours",
        priority: "Élevée",
        assignee: "NathanDev",
        estimatedHours: 16,
        actualHours: 8,
        storyPoints: 8,
        sprintId: 3,
        comments: [
          { id: 2, author: "Emma Wilson", text: "Pense à ajouter la validation en temps réel", date: new Date("2024-02-05") }
        ],
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date()
      }
    ],
    sprints: [],
    backlog: []
  }
];

const MyProjectsView = () => {
  const [projects, setProjects] = useState<Project[]>(initialEmployeeProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');

  // Mise à jour du temps en temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Statistiques personnelles de l'employé
  const personalStatistics = useMemo(() => {
    const allMyTasks = projects.flatMap(p => p.myTasks || []);
    const myTotalTasks = allMyTasks.length;
    const myCompletedTasks = allMyTasks.filter(t => t.status === 'Terminé').length;
    const myInProgressTasks = allMyTasks.filter(t => t.status === 'En cours').length;
    const myPendingTasks = allMyTasks.filter(t => t.status === 'À faire').length;
    
    const totalEstimatedHours = allMyTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const totalActualHours = allMyTasks.reduce((sum, t) => sum + t.actualHours, 0);
    const totalStoryPoints = allMyTasks.reduce((sum, t) => sum + t.storyPoints, 0);
    const completedStoryPoints = allMyTasks.filter(t => t.status === 'Terminé').reduce((sum, t) => sum + t.storyPoints, 0);

    const myActiveProjects = projects.filter(p => p.status === 'En cours' && p.myTasks?.length > 0).length;

    return {
      myTotalTasks,
      myCompletedTasks,
      myInProgressTasks,
      myPendingTasks,
      myActiveProjects,
      totalEstimatedHours,
      totalActualHours,
      totalStoryPoints,
      completedStoryPoints,
      productivity: myTotalTasks > 0 ? Math.round((myCompletedTasks / myTotalTasks) * 100) : 0,
      efficiency: totalEstimatedHours > 0 ? Math.round((totalEstimatedHours / Math.max(totalActualHours, 1)) * 100) : 100
    };
  }, [projects, currentTime]);

  // *** FONCTIONS CORRIGÉES - VRAIES INTERACTIONS ***

  // Mise à jour du statut d'une tâche - RÉELLEMENT FONCTIONNELLE
  const updateTaskStatus = (projectId: number, taskId: number, newStatus: Task['status']) => {
    console.log(`Mise à jour du statut de la tâche ${taskId} vers ${newStatus}`);
    
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          const updatedTasks = (project.myTasks || []).map(task => 
            task.id === taskId 
              ? { ...task, status: newStatus, updatedAt: new Date() }
              : task
          );
          return { ...project, myTasks: updatedTasks };
        }
        return project;
      })
    );

    // Mettre à jour aussi la tâche sélectionnée dans la modale
    if (selectedTask && selectedTask.id === taskId) {
      const updatedSelectedTask = { ...selectedTask, status: newStatus, updatedAt: new Date() };
      setSelectedTask(updatedSelectedTask);
    }
  };

  // Mise à jour de la priorité d'une tâche - RÉELLEMENT FONCTIONNELLE
  const updateTaskPriority = (projectId: number, taskId: number, newPriority: Task['priority']) => {
    console.log(`Mise à jour de la priorité de la tâche ${taskId} vers ${newPriority}`);
    
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          const updatedTasks = (project.myTasks || []).map(task => 
            task.id === taskId 
              ? { ...task, priority: newPriority, updatedAt: new Date() }
              : task
          );
          return { ...project, myTasks: updatedTasks };
        }
        return project;
      })
    );

    // Mettre à jour aussi la tâche sélectionnée dans la modale
    if (selectedTask && selectedTask.id === taskId) {
      const updatedSelectedTask = { ...selectedTask, priority: newPriority, updatedAt: new Date() };
      setSelectedTask(updatedSelectedTask);
    }
  };

  // Ajouter un commentaire à une tâche - RÉELLEMENT FONCTIONNEL
  const addTaskComment = (projectId: number, taskId: number, comment: string) => {
    if (!comment.trim()) {
      alert('Le commentaire ne peut pas être vide');
      return;
    }
    
    console.log(`Ajout d'un commentaire à la tâche ${taskId}: ${comment}`);
    
    const newCommentObj: TaskComment = {
      id: Date.now(),
      author: currentEmployee,
      text: comment.trim(),
      date: new Date()
    };

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          const updatedTasks = (project.myTasks || []).map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  comments: [...(task.comments || []), newCommentObj],
                  updatedAt: new Date()
                }
              : task
          );
          return { ...project, myTasks: updatedTasks };
        }
        return project;
      })
    );

    // Mettre à jour aussi la tâche sélectionnée dans la modale
    if (selectedTask && selectedTask.id === taskId) {
      const updatedSelectedTask = { 
        ...selectedTask, 
        comments: [...(selectedTask.comments || []), newCommentObj],
        updatedAt: new Date()
      };
      setSelectedTask(updatedSelectedTask);
    }

    // Vider le champ de commentaire
    setNewComment('');
  };

  const isOverdue = (project: Project) => {
    return new Date(project.endDate) < currentTime && project.status !== 'Terminé';
  };

  const getDaysUntilDeadline = (project: Project) => {
    const deadline = new Date(project.endDate);
    const diffTime = deadline.getTime() - currentTime.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Mes Tâches Totales</p>
              <p className="text-2xl font-bold">{personalStatistics.myTotalTasks}</p>
            </div>
            <Target className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Terminées</p>
              <p className="text-2xl font-bold">{personalStatistics.myCompletedTasks}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">En Cours</p>
              <p className="text-2xl font-bold">{personalStatistics.myInProgressTasks}</p>
            </div>
            <Play className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Projets Actifs</p>
              <p className="text-2xl font-bold">{personalStatistics.myActiveProjects}</p>
            </div>
            <Activity className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Productivité</span>
            <span>{personalStatistics.productivity}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${personalStatistics.productivity}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Story Points Complétés</span>
            <span>{personalStatistics.completedStoryPoints}/{personalStatistics.totalStoryPoints}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${personalStatistics.totalStoryPoints > 0 ? (personalStatistics.completedStoryPoints / personalStatistics.totalStoryPoints) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant de tâche pour l'employé - AVEC VRAIES INTERACTIONS
  const MyTaskCard: React.FC<{ 
    task: Task; 
    projectId: number; 
    projectName: string; 
  }> = ({ task, projectId, projectName }) => {
    const getPriorityColor = (priority: Task['priority']) => {
      switch (priority) {
        case 'Urgente': return 'bg-red-100 text-red-800';
        case 'Élevée': return 'bg-orange-100 text-orange-800';
        case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-green-100 text-green-800';
      }
    };

    const getStatusColor = (status: Task['status']) => {
      switch (status) {
        case 'Terminé': return 'text-green-600';
        case 'En cours': return 'text-blue-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm mb-1">{task.title}</h4>
            <p className="text-xs text-gray-500">{projectName}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between text-xs mb-3">
          <div className={`flex items-center space-x-1 ${getStatusColor(task.status)}`}>
            {task.status === 'Terminé' && <CheckCircle2 className="h-3 w-3" />}
            {task.status === 'En cours' && <Play className="h-3 w-3" />}
            {task.status === 'À faire' && <Clock className="h-3 w-3" />}
            <span>{task.status}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Hash className="h-3 w-3" />
            <span>{task.storyPoints} SP</span>
          </div>
        </div>

        {/* VRAIS CONTRÔLES INTERACTIFS */}
        <div className="flex flex-col space-y-2 mt-3">
          <div className="flex space-x-2">
            {/* Sélecteur de statut - FONCTIONNE VRAIMENT */}
            <select
              value={task.status}
              onChange={(e) => {
                console.log('Changement de statut détecté:', e.target.value);
                updateTaskStatus(projectId, task.id, e.target.value as Task['status']);
              }}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="À faire">À faire</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>

            {/* Sélecteur de priorité - FONCTIONNE VRAIMENT */}
            <select
              value={task.priority}
              onChange={(e) => {
                console.log('Changement de priorité détecté:', e.target.value);
                updateTaskPriority(projectId, task.id, e.target.value as Task['priority']);
              }}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="Basse">Basse</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Élevée">Élevée</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center text-xs text-gray-500">
              <Timer className="h-3 w-3 mr-1" />
              {task.actualHours}h / {task.estimatedHours}h
            </div>
            <div className="flex items-center space-x-2">
              {task.comments && task.comments.length > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {task.comments.length}
                </div>
              )}
              <button
                onClick={() => {
                  console.log('Ouverture des détails de la tâche:', task.id);
                  setSelectedTask(task);
                  setShowTaskDetails(true);
                }}
                className="text-indigo-600 hover:text-indigo-800 p-1 rounded hover:bg-indigo-50"
              >
                <Eye className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant de projet pour l'employé
  const MyProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const myTasksInProject = project.myTasks || [];
    const myCompletedTasks = myTasksInProject.filter(t => t.status === 'Terminé').length;
    const myInProgressTasks = myTasksInProject.filter(t => t.status === 'En cours').length;
    const myPendingTasks = myTasksInProject.filter(t => t.status === 'À faire').length;
    
    const isProjectOverdue = isOverdue(project);
    const daysUntilDeadline = getDaysUntilDeadline(project);

    return (
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              <p className="text-xs text-gray-500 mt-1">Chef de projet: {project.projectManager}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              project.priority === 'Urgente' ? 'bg-red-100 text-red-800' :
              project.priority === 'Élevée' ? 'bg-orange-100 text-orange-800' :
              project.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {project.priority}
            </span>
          </div>

          {/* Progression du projet */}
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
          </div>

          {/* Mes tâches dans ce projet */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{myCompletedTasks}</div>
              <div className="text-xs text-gray-500">Terminées</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{myInProgressTasks}</div>
              <div className="text-xs text-gray-500">En cours</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{myPendingTasks}</div>
              <div className="text-xs text-gray-500">À faire</div>
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
                <div key={index} className={`flex items-center ${member.name === currentEmployee ? 'bg-indigo-100' : 'bg-gray-100'} rounded-full px-2 py-1`}>
                  <div className={`w-5 h-5 ${member.name === currentEmployee ? 'bg-indigo-200' : 'bg-gray-200'} rounded-full flex items-center justify-center mr-1`}>
                    <span className={`text-xs font-medium ${member.name === currentEmployee ? 'text-indigo-700' : 'text-gray-700'}`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className={`text-xs ${member.name === currentEmployee ? 'text-indigo-700 font-medium' : 'text-gray-700'}`}>
                    {member.name} {member.name === currentEmployee ? '(Moi)' : ''}
                  </span>
                </div>
              ))}
              {project.members.length > 3 && (
                <div className="flex items-center text-xs text-gray-500">
                  +{project.members.length - 3} autres
                </div>
              )}
            </div>
          </div>

          {/* Échéance */}
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
          <button
            onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Mes tâches ({myTasksInProject.length})
            {expandedProject === project.id ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </button>
          <div className="flex items-center text-xs text-gray-500">
            <FileText className="h-4 w-4 mr-1" />
            <span>{project.attachments} fichiers</span>
          </div>
        </div>

        {/* Détails étendus - Mes tâches */}
        {expandedProject === project.id && (
          <div className="bg-white border-t border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4">Mes Tâches ({myTasksInProject.length})</h4>
            {myTasksInProject.length > 0 ? (
              <div className="space-y-3">
                {myTasksInProject.map(task => (
                  <MyTaskCard 
                    key={task.id} 
                    task={task} 
                    projectId={project.id}
                    projectName={project.name}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune tâche assignée dans ce projet</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Modal de détails de tâche - AVEC VRAIES INTERACTIONS
  const TaskDetailsModal = () => {
    if (!showTaskDetails || !selectedTask) return null;

    const findProjectForTask = (taskId: number) => {
      return projects.find(p => p.myTasks?.find(t => t.id === taskId));
    };

    const currentProject = findProjectForTask(selectedTask.id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Détails de la tâche</h3>
            <button
              onClick={() => {
                console.log('Fermeture de la modale');
                setShowTaskDetails(false);
                setNewComment('');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">{selectedTask.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>
              {currentProject && (
                <p className="text-xs text-gray-500 mt-1">Projet: {currentProject.name}</p>
              )}
            </div>

            {/* VRAIS CONTRÔLES DANS LA MODALE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={selectedTask.status}
                  onChange={(e) => {
                    console.log('Changement de statut dans la modale:', e.target.value);
                    if (currentProject) {
                      updateTaskStatus(currentProject.id, selectedTask.id, e.target.value as Task['status']);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base bg-white"
                >
                  <option value="À faire">À faire</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  value={selectedTask.priority}
                  onChange={(e) => {
                    console.log('Changement de priorité dans la modale:', e.target.value);
                    if (currentProject) {
                      updateTaskPriority(currentProject.id, selectedTask.id, e.target.value as Task['priority']);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base bg-white"
                >
                  <option value="Basse">Basse</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Élevée">Élevée</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temps estimé</label>
                <p className="text-gray-900">{selectedTask.estimatedHours}h</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temps passé</label>
                <p className="text-gray-900">{selectedTask.actualHours}h</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                <p className="text-gray-900">{selectedTask.storyPoints} SP</p>
              </div>
            </div>

            {/* Section commentaires - VRAIMENT FONCTIONNELLE */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Commentaires ({selectedTask.comments?.length || 0})
              </h4>
              
              {selectedTask.comments && selectedTask.comments.length > 0 && (
                <div className="space-y-3 mb-4 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3">
                  {selectedTask.comments.map(comment => (
                    <div key={comment.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {comment.date.toLocaleDateString('fr-FR')} à {comment.date.toLocaleTimeString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* INTERFACE D'AJOUT DE COMMENTAIRE FONCTIONNELLE */}
              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => {
                    console.log('Saisie du commentaire:', e.target.value);
                    setNewComment(e.target.value);
                  }}
                  placeholder="Tapez votre commentaire ici..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-base resize-none"
                  rows={3}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (currentProject && newComment.trim()) {
                        addTaskComment(currentProject.id, selectedTask.id, newComment);
                      }
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      console.log('Clic sur Ajouter commentaire');
                      if (currentProject && newComment.trim()) {
                        addTaskComment(currentProject.id, selectedTask.id, newComment);
                      } else {
                        alert('Veuillez saisir un commentaire');
                      }
                    }}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Ajouter commentaire
                  </button>
                  <button
                    onClick={() => {
                      console.log('Annulation du commentaire');
                      setNewComment('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Filtrage des projets
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !filterStatus || project.status === filterStatus;
      const matchesPriority = !filterPriority || project.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return filtered;
  }, [projects, searchTerm, filterStatus, filterPriority]);

  return (
    <div className="space-y-6">
      <PersonalStatisticsPanel />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">Mes Projets</h1>
        <div className="text-sm text-gray-600">
          {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} assigné{filteredProjects.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher mes projets..."
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
          </div>
        </div>
      </div>

      {/* Liste des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <MyProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus || filterPriority 
              ? 'Aucun projet ne correspond à vos critères de recherche.'
              : 'Vous n\'êtes assigné à aucun projet pour le moment.'}
          </p>
        </div>
      )}

      <TaskDetailsModal />
    </div>
  );
};

export default MyProjectsView;