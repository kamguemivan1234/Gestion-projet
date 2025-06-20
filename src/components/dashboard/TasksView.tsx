import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Filter, List, LayoutGrid, Calendar as CalendarIcon, GanttChart, 
  BarChart3, Clock, TrendingUp, AlertTriangle, ChevronLeft, ChevronRight, 
  Search, CheckCircle, XCircle, Pause, Play, Edit, Trash2, Eye, Download
} from 'lucide-react';
import NewTaskView from '../newintegration/NewTaskView';

// Types
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'À faire' | 'En cours' | 'En attente' | 'Terminé';
  priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
  startDate: string;
  endDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  tags: string[];
  progress: number;
  category: string;
  createdAt: Date;
  estimatedHours?: number;
  actualHours?: number;
  attachments?: any[];
}

// Données initiales enrichies
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Développer l'interface utilisateur",
    description: "Créer les composants React pour la page d'accueil avec design responsive et animations",
    status: "En cours",
    priority: "Élevée",
    startDate: "2024-01-15T09:00",
    endDate: "2024-01-20T17:00",
    assignee: {
      name: "Marie Dubois",
      avatar: "https://via.placeholder.com/40"
    },
    tags: ["frontend", "react", "ui"],
    progress: 65,
    category: "Développement",
    createdAt: new Date("2024-01-15T09:00:00"),
    estimatedHours: 32,
    actualHours: 28,
    attachments: []
  },
  {
    id: 2,
    title: "Révision du design système",
    description: "Mettre à jour la charte graphique et les composants selon les nouvelles directives",
    status: "À faire",
    priority: "Moyenne",
    startDate: "2024-01-18T10:00",
    endDate: "2024-01-25T16:00",
    assignee: {
      name: "Jean Martin",
      avatar: "https://via.placeholder.com/40"
    },
    tags: ["design", "système", "charte"],
    progress: 0,
    category: "Design",
    createdAt: new Date("2024-01-18T10:00:00"),
    estimatedHours: 24,
    actualHours: 0,
    attachments: []
  },
  {
    id: 3,
    title: "Test et débogage",
    description: "Effectuer les tests unitaires et corriger les bugs critiques identifiés",
    status: "Terminé",
    priority: "Élevée",
    startDate: "2024-01-10T14:00",
    endDate: "2024-01-15T18:00",
    assignee: {
      name: "Sophie Bernard",
      avatar: "https://via.placeholder.com/40"
    },
    tags: ["test", "debug", "qualité"],
    progress: 100,
    category: "Développement",
    createdAt: new Date("2024-01-10T14:00:00"),
    estimatedHours: 16,
    actualHours: 18,
    attachments: []
  },
  {
    id: 4,
    title: "Documentation technique",
    description: "Rédiger la documentation complète de l'API et des composants",
    status: "En attente",
    priority: "Basse",
    startDate: "2024-01-22T09:00",
    endDate: "2024-01-30T17:00",
    assignee: {
      name: "Pierre Leroux",
      avatar: "https://via.placeholder.com/40"
    },
    tags: ["documentation", "api"],
    progress: 25,
    category: "Documentation",
    createdAt: new Date("2024-01-22T09:00:00"),
    estimatedHours: 20,
    actualHours: 5,
    attachments: []
  }
];

const TasksView = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'calendar' | 'gantt' | 'analytics'>('list');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
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

  // Statistiques calculées en temps réel
  const statistics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Terminé').length;
    const inProgressTasks = tasks.filter(t => t.status === 'En cours').length;
    const overdueTasks = tasks.filter(t => 
      new Date(t.endDate) < currentTime && t.status !== 'Terminé'
    ).length;
    
    const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalActual = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
    const efficiency = totalEstimated > 0 ? (totalEstimated / totalActual * 100) : 100;
    
    const productivity = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0;
    const avgProgress = tasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      productivity: Math.round(productivity),
      efficiency: Math.round(efficiency),
      avgProgress: Math.round(avgProgress)
    };
  }, [tasks, currentTime]);

  // Filtrage des tâches
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !filterStatus || task.status === filterStatus;
      const matchesPriority = !filterPriority || task.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  const getTasksByStatus = () => {
    const tasksByStatus: Record<string, Task[]> = {};
    statuses.forEach(status => {
      tasksByStatus[status] = filteredTasks.filter(task => task.status === status);
    });
    return tasksByStatus;
  };

  const handleCreateTask = (newTask: any) => {
    const formattedTask: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      status: 'À faire',
      priority: newTask.priority,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      assignee: {
        name: newTask.assignee,
        avatar: 'https://via.placeholder.com/40'
      },
      tags: newTask.tags || [],
      progress: 0,
      category: newTask.category,
      createdAt: new Date(),
      estimatedHours: parseFloat(newTask.estimatedHours) || 0,
      actualHours: 0,
      attachments: newTask.attachments || []
    };
    setTasks([...tasks, formattedTask]);
    setShowNewTaskForm(false);
  };

  const updateTaskProgress = (taskId: number, newProgress: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              progress: newProgress,
              status: newProgress === 100 ? 'Terminé' : newProgress > 0 ? 'En cours' : 'À faire'
            }
          : task
      )
    );
  };

  const updateTaskStatus = (taskId: number, newStatus: Task['status']) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: newStatus,
              progress: newStatus === 'Terminé' ? 100 : task.progress
            }
          : task
      )
    );
  };

  const isOverdue = (task: Task) => {
    return new Date(task.endDate) < currentTime && task.status !== 'Terminé';
  };

  const getDaysUntilDeadline = (task: Task) => {
    const deadline = new Date(task.endDate);
    const diffTime = deadline.getTime() - currentTime.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Composant de statistiques en temps réel
  const StatisticsPanel = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Tableau de Bord</h2>
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
              <p className="text-sm opacity-80">Total Tâches</p>
              <p className="text-2xl font-bold">{statistics.totalTasks}</p>
            </div>
            <List className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Terminées</p>
              <p className="text-2xl font-bold">{statistics.completedTasks}</p>
            </div>
            <CheckCircle className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">En Retard</p>
              <p className="text-2xl font-bold">{statistics.overdueTasks}</p>
            </div>
            <AlertTriangle className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Productivité</p>
              <p className="text-2xl font-bold">{statistics.productivity}%</p>
            </div>
            <TrendingUp className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progression Globale</span>
          <span>{statistics.avgProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${statistics.avgProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Vue Liste améliorée
  const renderListView = () => (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Tâches</h3>
          <div className="text-sm text-gray-500">
            {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {filteredTasks.map(task => {
          const isTaskOverdue = isOverdue(task);
          const daysUntilDeadline = getDaysUntilDeadline(task);
          
          return (
            <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <input 
                    type="checkbox" 
                    checked={task.status === 'Terminé'}
                    onChange={() => updateTaskStatus(task.id, task.status === 'Terminé' ? 'À faire' : 'Terminé')}
                    className="h-5 w-5 text-indigo-600 rounded mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold text-lg ${task.status === 'Terminé' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        <p className="text-gray-600 mt-1">{task.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(task.endDate).toLocaleDateString('fr-FR')}
                          </div>
                          
                          <div className="flex items-center">
                            <img 
                              src={task.assignee.avatar} 
                              alt={task.assignee.name}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            <span className="text-gray-600">{task.assignee.name}</span>
                          </div>
                          
                          {isTaskOverdue && (
                            <span className="text-red-600 font-medium flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              En retard
                            </span>
                          )}
                          
                          {!isTaskOverdue && daysUntilDeadline <= 2 && daysUntilDeadline > 0 && (
                            <span className="text-orange-600 font-medium">
                              Échéance proche ({daysUntilDeadline}j)
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
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
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
                    </div>
                    
                    {/* Barre de progression interactive */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progression</span>
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
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={task.progress}
                          onChange={(e) => updateTaskProgress(task.id, parseInt(e.target.value))}
                          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Vue Kanban améliorée avec drag & drop
  const renderKanbanView = () => {
    const tasksByStatus = getTasksByStatus();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map(status => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{status}</h3>
              <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                {tasksByStatus[status]?.length || 0}
              </span>
            </div>
            
            <div className="space-y-3">
              {tasksByStatus[status]?.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'Urgente' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Élevée' ? 'bg-orange-100 text-orange-800' :
                      task.priority === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {task.description.length > 60 ? `${task.description.substring(0, 60)}...` : task.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">
                      {new Date(task.endDate).toLocaleDateString('fr-FR')}
                    </span>
                    <img 
                      src={task.assignee.avatar} 
                      alt={task.assignee.name}
                      className="h-6 w-6 rounded-full"
                    />
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progression</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-indigo-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {isOverdue(task) && (
                    <div className="text-xs text-red-600 font-medium">
                      🚨 En retard
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Vue Calendrier interactive
  const renderCalendarView = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const getDayTasks = (day: number) => {
      const dayDate = new Date(year, month, day);
      return tasks.filter(task => {
        const taskDate = new Date(task.endDate);
        return taskDate.toDateString() === dayDate.toDateString();
      });
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Calendrier des Tâches</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h4 className="text-lg font-medium min-w-[200px] text-center">
              {new Date(year, month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h4>
            
            <button
              onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-500 text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Jours vides avant le début du mois */}
          {Array.from({ length: startDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-24 p-1"></div>
          ))}

          {/* Jours du mois */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayTasks = getDayTasks(day);
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            return (
              <div
                key={day}
                className={`h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-indigo-50 border-indigo-300' : ''
                }`}
              >
                <div className={`font-medium text-sm ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                  {day}
                </div>
                <div className="mt-1 space-y-1">
                  {dayTasks.slice(0, 2).map(task => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded truncate ${
                        task.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                        task.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayTasks.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
            <span>Terminé</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
            <span>En cours</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
            <span>À faire</span>
          </div>
        </div>
      </div>
    );
  };

  // Vue Gantt interactive
  const renderGanttView = () => {
    const startDate = new Date(Math.min(...tasks.map(t => new Date(t.startDate).getTime())));
    const endDate = new Date(Math.max(...tasks.map(t => new Date(t.endDate).getTime())));
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Diagramme de Gantt Interactif</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {startDate.toLocaleDateString('fr-FR')} - {endDate.toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* En-tête avec dates */}
            <div className="flex border-b border-gray-200">
              <div className="w-64 flex-shrink-0 p-3 font-medium text-gray-900 bg-gray-50">
                Tâches
              </div>
              <div className="flex">
                {Array.from({ length: totalDays }, (_, i) => {
                  const date = new Date(startDate);
                  date.setDate(date.getDate() + i);
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  
                  return (
                    <div
                      key={i}
                      className={`w-8 flex-shrink-0 p-1 text-xs text-center border-r border-gray-200 ${
                        isWeekend ? 'bg-gray-100' : 'bg-gray-50'
                      }`}
                    >
                      <div>{date.getDate()}</div>
                      <div>{date.getMonth() + 1}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Barres de tâches */}
            <div className="divide-y divide-gray-200">
              {tasks.map(task => {
                const taskStart = new Date(task.startDate);
                const taskEnd = new Date(task.endDate);
                const startOffset = Math.floor((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const duration = Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                return (
                  <div key={task.id} className="flex items-center hover:bg-gray-50">
                    <div className="w-64 flex-shrink-0 p-3">
                      <div className="font-medium text-sm text-gray-900">{task.title}</div>
                      <div className="text-xs text-gray-500">{task.assignee.name}</div>
                      <div className="text-xs text-gray-400">
                        {task.progress}% • {task.priority}
                      </div>
                    </div>
                    
                    <div className="flex relative h-12 items-center">
                      {/* Grille de fond */}
                      {Array.from({ length: totalDays }, (_, i) => (
                        <div key={i} className="w-8 h-12 border-r border-gray-100"></div>
                      ))}
                      
                      {/* Barre de tâche */}
                      <div
                        className={`absolute h-6 rounded shadow-sm cursor-pointer transition-all hover:shadow-md ${
                          task.status === 'Terminé' ? 'bg-green-500' :
                          task.status === 'En cours' ? 'bg-blue-500' :
                          task.status === 'En attente' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}
                        style={{
                          left: `${startOffset * 32}px`,
                          width: `${duration * 32}px`
                        }}
                        title={`${task.title}: ${new Date(task.startDate).toLocaleDateString('fr-FR')} - ${new Date(task.endDate).toLocaleDateString('fr-FR')}`}
                      >
                        <div className="text-white text-xs p-1 truncate">
                          {task.title}
                        </div>
                        
                        {/* Barre de progression */}
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-50 rounded-b"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                        
                        {/* Indicateur de retard */}
                        {isOverdue(task) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>Terminé</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>En cours</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>En attente</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
            <span>À faire</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>En retard</span>
          </div>
        </div>
      </div>
    );
  };

  // Vue Analytiques
  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par statut */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition par Statut</h3>
          <div className="space-y-3">
            {statuses.map(status => {
              const count = tasks.filter(t => t.status === status).length;
              const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{status}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          status === 'Terminé' ? 'bg-green-500' :
                          status === 'En cours' ? 'bg-blue-500' :
                          status === 'En attente' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance par priorité */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Performance par Priorité</h3>
          <div className="space-y-3">
            {priorities.map(priority => {
              const priorityTasks = tasks.filter(t => t.priority === priority);
              const completed = priorityTasks.filter(t => t.status === 'Terminé').length;
              const completion = priorityTasks.length > 0 ? (completed / priorityTasks.length) * 100 : 0;
              
              return (
                <div key={priority} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{priority}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          priority === 'Urgente' ? 'bg-red-500' :
                          priority === 'Élevée' ? 'bg-orange-500' :
                          priority === 'Moyenne' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${completion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12">{Math.round(completion)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Métriques détaillées */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Métriques Détaillées</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{statistics.efficiency}%</div>
            <div className="text-sm text-gray-500">Efficacité Temps</div>
            <div className="text-xs text-gray-400 mt-1">
              Estimation vs Réel
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{statistics.avgProgress}%</div>
            <div className="text-sm text-gray-500">Progression Moyenne</div>
            <div className="text-xs text-gray-400 mt-1">
              Toutes tâches confondues
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{statistics.inProgressTasks}</div>
            <div className="text-sm text-gray-500">Tâches Actives</div>
            <div className="text-xs text-gray-400 mt-1">
              En cours actuellement
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasksView = () => {
    switch (viewMode) {
      case 'list': return renderListView();
      case 'kanban': return renderKanbanView();
      case 'calendar': return renderCalendarView();
      case 'gantt': return renderGanttView();
      case 'analytics': return renderAnalyticsView();
      default: return renderListView();
    }
  };

  return (
    <div className="space-y-6">
      {showNewTaskForm && (
        <NewTaskView
          onCancel={() => setShowNewTaskForm(false)}
          onCreate={handleCreateTask}
        />
      )}

      {!showNewTaskForm && (
        <>
          <StatisticsPanel />

          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Tâches</h1>
            <button
              onClick={() => setShowNewTaskForm(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Tâche
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
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'kanban' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'calendar' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('gantt')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'gantt' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <GanttChart className="h-5 w-5" />
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

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher des tâches..."
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
        </>
      )}
    </div>
  );
};

export default TasksView;