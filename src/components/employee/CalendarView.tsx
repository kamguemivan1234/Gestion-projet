import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, ChevronLeft, ChevronRight, Filter, Eye, Clock, 
  Calendar as CalendarIcon, Users, MapPin, AlertTriangle,
  TrendingUp, Target, Search, Bell, CheckCircle2, Hash, 
  Timer, Activity, Rocket, Flag, FileText, User, Star,
  PlayCircle, Pause, BarChart3, Award, Zap, ChevronDown,
  Trash2, Edit
} from 'lucide-react';

// Types d'événements pour l'employé (version simplifiée et personnalisée)
interface CalendarEvent {
  id: number | string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'training' | 'sprint-planning' | 'sprint-review' | 'daily-standup' | 'personal' | 'review';
  startDateTime: string;
  endDateTime: string;
  recurrence: string;
  attendees: string[];
  priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
  status: 'En cours' | 'Terminé' | 'En attente' | 'Pause' | 'En retard' | 'Prévu' | 'Annulé';
  location: string;
  tags: string[];
  projectId?: number;
  sprintId?: number;
  taskIds: number[];
  isPersonal: boolean;
  isRequired: boolean;
  canEdit: boolean;
  organizer?: string;
  createdAt: Date;
  updatedAt: Date;
  // Champs spécifiques employé
  myStatus?: 'accepted' | 'declined' | 'pending' | 'tentative';
  myPreparation?: string;
  myNotes?: string;
}

// Types simplifiés pour l'employé
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

interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: 'En attente' | 'En cours' | 'En pause' | 'Terminé' | 'En retard' | 'Annulé';
  priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
  startDate: string;
  endDate: string;
  members: Array<{ name: string; role?: string; avatar?: string; }>;
  myRole?: string;
  sprints?: any[];
  methodology: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Props du composant employé
interface EmployeeCalendarViewProps {
  currentUser?: string;
  projects?: Project[];
  tasks?: Task[];
  onCreateEvent?: (event: CalendarEvent) => void;
  onUpdateEventStatus?: (eventId: string | number, status: string) => void;
}

// Formulaire de création d'événement personnel
const PersonalEventForm = ({ onCancel, onCreate, currentUser }: {
  onCancel: () => void;
  onCreate: (event: any) => void;
  currentUser: string;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    priority: 'Moyenne' as const,
    status: 'Prévu' as const,
    recurrence: 'Aucune',
    tags: '',
    myPreparation: '',
    myNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      type: 'personal',
      isPersonal: true,
      canEdit: true,
      isRequired: false,
      attendees: [currentUser],
      organizer: currentUser,
      taskIds: [],
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    onCreate(eventData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <User className="h-6 w-6 mr-2 text-emerald-600" />
              Nouvel Événement Personnel
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <Plus className="h-6 w-6 transform rotate-45" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'événement *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                placeholder="Ex: Rendez-vous médical, Formation personnelle..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                placeholder="Décrivez votre événement personnel..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure de début *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startDateTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startDateTime: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure de fin *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.endDateTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endDateTime: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                placeholder="Ex: Domicile, Cabinet médical..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
              >
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Élevée">Élevée</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Récurrence
              </label>
              <select
                value={formData.recurrence}
                onChange={(e) => setFormData(prev => ({ ...prev, recurrence: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
              >
                <option value="Aucune">Aucune</option>
                <option value="Quotidienne">Quotidienne</option>
                <option value="Hebdomadaire">Hebdomadaire</option>
                <option value="Mensuelle">Mensuelle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
              >
                <option value="Prévu">Prévu</option>
                <option value="En cours">En cours</option>
                <option value="En attente">En attente</option>
                <option value="Pause">Pause</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                placeholder="Ex: personnel, médical, formation"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Préparation nécessaire
              </label>
              <textarea
                value={formData.myPreparation}
                onChange={(e) => setFormData(prev => ({ ...prev, myPreparation: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                placeholder="Ce que je dois préparer pour cet événement..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes personnelles
              </label>
              <textarea
                value={formData.myNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, myNotes: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                placeholder="Mes notes personnelles sur cet événement..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
            >
              <User className="h-4 w-4 mr-2" />
              Créer l'événement personnel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmployeeCalendarView: React.FC<EmployeeCalendarViewProps> = ({
  currentUser = 'Marie Dubois',
  projects = [],
  tasks = [],
  onCreateEvent,
  onUpdateEventStatus
}) => {
  // État pour l'employé avec événements personnalisés
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: 'Réunion d\'équipe hebdomadaire',
      description: 'Point hebdomadaire avec l\'équipe projet',
      date: '2025-01-15',
      time: '10:00 - 11:00',
      type: 'meeting',
      startDateTime: '2025-01-15T10:00',
      endDateTime: '2025-01-15T11:00',
      recurrence: 'Hebdomadaire',
      attendees: ['Marie Dubois', 'Thomas Martin', 'Sophie Bernard'],
      priority: 'Moyenne',
      status: 'Prévu',
      location: 'Salle de réunion A',
      tags: ['équipe', 'hebdomadaire'],
      projectId: 1,
      taskIds: [],
      isPersonal: false,
      isRequired: true,
      canEdit: false,
      organizer: 'Thomas Martin',
      myStatus: 'accepted',
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'Révision de code',
      description: 'Session de révision de code personnelle',
      date: '2025-01-16',
      time: '14:00 - 15:30',
      type: 'personal',
      startDateTime: '2025-01-16T14:00',
      endDateTime: '2025-01-16T15:30',
      recurrence: 'Aucune',
      attendees: [currentUser],
      priority: 'Moyenne',
      status: 'Prévu',
      location: 'Mon bureau',
      tags: ['personnel', 'développement'],
      taskIds: [],
      isPersonal: true,
      isRequired: false,
      canEdit: true,
      myNotes: 'Revoir le module authentification',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [filters, setFilters] = useState({
    type: '',
    priority: '',
    status: '',
    myStatus: '',
    project: '',
    showPersonal: true,
    showWork: true
  });
  const [searchTerm, setSearchTerm] = useState('');

  // États pour les dropdowns
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  // Options pour les filtres
  const typeOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'meeting', label: 'Réunions' },
    { value: 'deadline', label: 'Mes échéances' },
    { value: 'training', label: 'Formations' },
    { value: 'personal', label: 'Personnel' },
    { value: 'sprint-planning', label: 'Sprint Planning' },
    { value: 'daily-standup', label: 'Daily Standup' }
  ];

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'En cours', label: 'En cours' },
    { value: 'Terminé', label: 'Terminé' },
    { value: 'En attente', label: 'En attente' },
    { value: 'Pause', label: 'Pause' },
    { value: 'En retard', label: 'En retard' }
  ];

  const priorityOptions = [
    { value: '', label: 'Toutes les priorités' },
    { value: 'Urgente', label: 'Urgente' },
    { value: 'Élevée', label: 'Élevée' },
    { value: 'Moyenne', label: 'Moyenne' },
    { value: 'Basse', label: 'Basse' }
  ];

  // Mise à jour du temps
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Synchronisation avec les tâches et projets de l'employé
  useEffect(() => {
    const newEvents: CalendarEvent[] = [];

    // 1. Mes échéances de tâches
    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        if (task.endDate && task.status !== 'Terminé') {
          const assigneeName = typeof task.assignee === 'string' ? task.assignee : task.assignee?.name;
          if (assigneeName === currentUser) {
            newEvents.push({
              id: `my-task-${task.id}`,
              title: `📝 Ma tâche: ${task.title}`,
              description: `Échéance pour ma tâche "${task.title}" - ${task.description || 'Aucune description'}`,
              date: task.endDate.split('T')[0],
              time: new Date(task.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              type: 'deadline',
              startDateTime: task.endDate,
              endDateTime: task.endDate,
              recurrence: 'Aucune',
              attendees: [currentUser],
              priority: task.priority === 'Urgente' ? 'Urgente' :
                        task.priority === 'Élevée' ? 'Élevée' :
                        task.priority === 'Moyenne' ? 'Moyenne' : 'Basse',
              status: 'Prévu',
              location: 'Mon espace de travail',
              tags: ['ma-tâche', 'deadline', ...(task.tags || [])],
              projectId: task.projectId,
              sprintId: task.sprintId,
              taskIds: [task.id],
              isPersonal: false,
              isRequired: true,
              canEdit: false,
              myStatus: 'accepted',
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      });
    }

    // 2. Événements des projets auxquels je participe
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        const isMyProject = project.members?.some(member => 
          (typeof member === 'string' ? member : member.name) === currentUser
        );

        if (isMyProject) {
          // Sprint events pour mes projets
          if (project.sprints && project.sprints.length > 0) {
            project.sprints.forEach(sprint => {
              // Sprint Planning
              newEvents.push({
                id: `my-sprint-planning-${sprint.id}`,
                title: `🚀 Sprint Planning: ${sprint.name}`,
                description: `Planification du sprint "${sprint.name}"`,
                date: sprint.startDate.split('T')[0],
                time: new Date(sprint.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' - ' +
                      new Date(new Date(sprint.startDate).getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                type: 'sprint-planning',
                startDateTime: sprint.startDate,
                endDateTime: new Date(new Date(sprint.startDate).getTime() + 2 * 60 * 60 * 1000).toISOString(),
                recurrence: 'Aucune',
                attendees: project.members?.map(m => typeof m === 'string' ? m : m.name) || [],
                priority: 'Élevée',
                status: sprint.status === 'Actif' ? 'En cours' :
                        sprint.status === 'Terminé' ? 'Terminé' : 'Prévu',
                location: 'Salle de réunion Agile',
                tags: ['sprint', 'planning', 'agile', project.methodology.toLowerCase()],
                projectId: project.id,
                sprintId: sprint.id,
                isPersonal: false,
                isRequired: true,
                canEdit: false,
                organizer: 'Scrum Master',
                myStatus: 'accepted',
                createdAt: new Date(),
                updatedAt: new Date()
              });

              // Daily Standups pour mes sprints actifs
              if (sprint.status === 'Actif') {
                const startDate = new Date(sprint.startDate);
                const endDate = new Date(sprint.endDate);
                let currentDate = new Date(startDate);

                while (currentDate <= endDate) {
                  if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                    const standupDate = new Date(currentDate);
                    newEvents.push({
                      id: `my-standup-${sprint.id}-${standupDate.toISOString().split('T')[0]}`,
                      title: `🗣️ Daily Standup`,
                      description: `Daily standup - mon point quotidien`,
                      date: standupDate.toISOString().split('T')[0],
                      time: '09:00 - 09:15',
                      type: 'daily-standup',
                      startDateTime: new Date(standupDate.setHours(9, 0)).toISOString(),
                      endDateTime: new Date(standupDate.setHours(9, 15)).toISOString(),
                      recurrence: 'Quotidienne',
                      attendees: project.members?.map(m => typeof m === 'string' ? m : m.name) || [],
                      priority: 'Moyenne',
                      status: standupDate < new Date() ? 'Terminé' : 'Prévu',
                      location: 'Visioconférence',
                      tags: ['standup', 'daily', 'agile'],
                      projectId: project.id,
                      sprintId: sprint.id,
                      isPersonal: false,
                      isRequired: true,
                      canEdit: false,
                      myStatus: 'accepted',
                      createdAt: new Date(),
                      updatedAt: new Date()
                    });
                  }
                  currentDate.setDate(currentDate.getDate() + 1);
                }
              }
            });
          }
        }
      });
    }

    // Fusionner avec les événements manuels
    setEvents(prevEvents => {
      const manualEvents = prevEvents.filter(e =>
        !String(e.id).startsWith('my-task-') &&
        !String(e.id).startsWith('my-sprint-') &&
        !String(e.id).startsWith('my-standup-')
      );
      return [...manualEvents, ...newEvents];
    });
  }, [projects, tasks, currentUser]);

  // Filtrage adapté pour l'employé
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = searchTerm === '' ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = !filters.type || event.type === filters.type;
      const matchesPriority = !filters.priority || event.priority === filters.priority;
      const matchesStatus = !filters.status || event.status === filters.status;
      const matchesMyStatus = !filters.myStatus || event.myStatus === filters.myStatus;
      const matchesProject = !filters.project || (event.projectId && event.projectId.toString() === filters.project);
      
      const matchesPersonalFilter = 
        (filters.showPersonal && event.isPersonal) || 
        (filters.showWork && !event.isPersonal);

      return matchesSearch && matchesType && matchesPriority && 
             matchesStatus && matchesMyStatus && matchesProject && matchesPersonalFilter;
    });
  }, [events, searchTerm, filters]);

  // Statistiques personnelles de l'employé
  const myStatistics = useMemo(() => {
    const totalEvents = events.length;
    const todayEvents = events.filter(e => e.date === currentTime.toISOString().split('T')[0]).length;
    const upcomingEvents = events.filter(e => new Date(e.date) > currentTime).length;
    const myTasks = events.filter(e => e.type === 'deadline' && e.attendees.includes(currentUser)).length;
    const pendingInvitations = events.filter(e => e.myStatus === 'pending').length;
    const personalEvents = events.filter(e => e.isPersonal).length;
    const sprintEvents = events.filter(e => 
      e.type === 'sprint-planning' || e.type === 'sprint-review' || e.type === 'daily-standup'
    ).length;

    const myProjectsCount = projects.filter(p => 
      p.members?.some(m => (typeof m === 'string' ? m : m.name) === currentUser)
    ).length;

    return {
      totalEvents,
      todayEvents,
      upcomingEvents,
      myTasks,
      pendingInvitations,
      personalEvents,
      sprintEvents,
      myProjectsCount
    };
  }, [events, currentTime, currentUser, projects]);

  // Fonctions utilitaires
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

  // Couleurs et icônes
  const getEventTypeColor = (type: string, isPersonal: boolean = false) => {
    if (isPersonal) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    
    const colors = {
      meeting: 'bg-blue-100 text-blue-800 border-blue-200',
      deadline: 'bg-red-100 text-red-800 border-red-200',
      training: 'bg-green-100 text-green-800 border-green-200',
      'sprint-planning': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'sprint-review': 'bg-orange-100 text-orange-800 border-orange-200',
      'daily-standup': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      personal: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      review: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getEventTypeIcon = (type: string, isPersonal: boolean = false) => {
    if (isPersonal) return <User className="h-3 w-3" />;
    
    switch (type) {
      case 'meeting': return <Users className="h-3 w-3" />;
      case 'deadline': return <AlertTriangle className="h-3 w-3" />;
      case 'training': return <Target className="h-3 w-3" />;
      case 'sprint-planning': return <Rocket className="h-3 w-3" />;
      case 'sprint-review': return <Flag className="h-3 w-3" />;
      case 'daily-standup': return <Users className="h-3 w-3" />;
      case 'personal': return <User className="h-3 w-3" />;
      case 'review': return <Star className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'Basse': 'bg-green-100 text-green-800',
      'Moyenne': 'bg-yellow-100 text-yellow-800',
      'Élevée': 'bg-orange-100 text-orange-800',
      'Urgente': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMyStatusColor = (status: string) => {
    const colors = {
      'accepted': 'bg-green-100 text-green-800',
      'declined': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'tentative': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Gestion des événements
  const handleUpdateMyStatus = (eventId: string | number, newStatus: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? { ...event, myStatus: newStatus as any, updatedAt: new Date() }
          : event
      )
    );
    
    if (onUpdateEventStatus) {
      onUpdateEventStatus(eventId, newStatus);
    }
  };

  const handleCreatePersonalEvent = (eventData: any) => {
    const newEvent: CalendarEvent = {
      id: `personal-${Date.now()}`,
      ...eventData,
      date: eventData.startDateTime.split('T')[0],
      time: `${new Date(eventData.startDateTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})} - ${new Date(eventData.endDateTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
    setShowNewEventForm(false);

    if (onCreateEvent) {
      onCreateEvent(newEvent);
    }
  };

  const handleDeletePersonalEvent = (eventId: string | number) => {
    const event = events.find(e => e.id === eventId);
    if (event && event.isPersonal && event.canEdit) {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement personnel ?')) {
        setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
        setSelectedEvent(null);
      }
    }
  };

  // Dropdown Component
  const DropdownButton = ({ 
    options, 
    value, 
    onChange, 
    isOpen, 
    setIsOpen, 
    placeholder 
  }: {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    placeholder: string;
  }) => {
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 text-base transition-all duration-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transform hover:scale-105 flex items-center justify-between min-w-[160px]"
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  value === option.value ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Composant des statistiques personnelles
  const MyStatisticsPanel = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Mon Tableau de Bord Personnel
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
              <p className="text-sm opacity-80">Mes événements</p>
              <p className="text-2xl font-bold">{myStatistics.totalEvents}</p>
            </div>
            <CalendarIcon className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Aujourd'hui</p>
              <p className="text-2xl font-bold">{myStatistics.todayEvents}</p>
            </div>
            <Clock className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Mes tâches</p>
              <p className="text-2xl font-bold">{myStatistics.myTasks}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Invitations</p>
              <p className="text-2xl font-bold">{myStatistics.pendingInvitations}</p>
            </div>
            <Bell className="h-8 w-8 opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Événements personnels</span>
            <span className="text-lg font-bold text-emerald-600">{myStatistics.personalEvents}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Événements Sprint</span>
            <span className="text-lg font-bold text-indigo-600">{myStatistics.sprintEvents}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Mes projets</span>
            <span className="text-lg font-bold text-blue-600">{myStatistics.myProjectsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Composant de filtres pour employé
  const MyFiltersPanel = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher mes événements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-80 bg-white text-gray-900 text-base"
            />
          </div>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg font-medium">
            {filteredEvents.length} événement{filteredEvents.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DropdownButton
            options={typeOptions}
            value={filters.type}
            onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
            isOpen={showTypeDropdown}
            setIsOpen={setShowTypeDropdown}
            placeholder="Tous les types"
          />

          <DropdownButton
            options={statusOptions}
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            isOpen={showStatusDropdown}
            setIsOpen={setShowStatusDropdown}
            placeholder="Tous les statuts"
          />

          <DropdownButton
            options={priorityOptions}
            value={filters.priority}
            onChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
            isOpen={showPriorityDropdown}
            setIsOpen={setShowPriorityDropdown}
            placeholder="Toutes les priorités"
          />

          <select
            value={filters.myStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, myStatus: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 text-base"
          >
            <option value="">Tous les statuts</option>
            <option value="accepted">Accepté</option>
            <option value="pending">En attente</option>
            <option value="tentative">Peut-être</option>
            <option value="declined">Décliné</option>
          </select>

          <div className="flex items-center space-x-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showWork}
                onChange={(e) => setFilters(prev => ({ ...prev, showWork: e.target.checked }))}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Travail</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showPersonal}
                onChange={(e) => setFilters(prev => ({ ...prev, showPersonal: e.target.checked }))}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm text-gray-700">Personnel</span>
            </label>
          </div>

          <button
            onClick={() => {
              setFilters({
                type: '',
                priority: '',
                status: '',
                myStatus: '',
                project: '',
                showPersonal: true,
                showWork: true
              });
              setSearchTerm('');
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all duration-200 flex items-center bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-4 w-4 mr-1" />
            Effacer
          </button>
        </div>
      </div>
    </div>
  );

  // Composant de détails d'événement pour employé
  const MyEventDetails = ({ event }: { event: CalendarEvent }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {getEventTypeIcon(event.type, event.isPersonal)}
              <h2 className="text-2xl font-bold text-gray-900 ml-2">{event.title}</h2>
              {event.isPersonal && (
                <span className="ml-3 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                  Personnel
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {event.isPersonal && event.canEdit && (
                <button
                  onClick={() => handleDeletePersonalEvent(event.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Supprimer cet événement personnel"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
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
          {/* Mon statut et actions */}
          {!event.isPersonal && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Mon statut
              </h4>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMyStatusColor(event.myStatus || 'pending')}`}>
                  {event.myStatus === 'accepted' ? 'Accepté' :
                   event.myStatus === 'declined' ? 'Décliné' :
                   event.myStatus === 'tentative' ? 'Peut-être' : 'En attente'}
                </span>
                {event.myStatus === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateMyStatus(event.id, 'accepted')}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => handleUpdateMyStatus(event.id, 'tentative')}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Peut-être
                    </button>
                    <button
                      onClick={() => handleUpdateMyStatus(event.id, 'declined')}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Décliner
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Détails</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getEventTypeColor(event.type, event.isPersonal)}`}>
                    {event.type === 'meeting' ? 'Réunion' :
                     event.type === 'deadline' ? 'Échéance' :
                     event.type === 'personal' ? 'Personnel' : event.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priorité:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(event.priority)}`}>
                    {event.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lieu:</span>
                  <span className="text-gray-900">{event.location}</span>
                </div>
                {event.organizer && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organisateur:</span>
                    <span className="text-gray-900">{event.organizer}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Planification</h4>
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
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{event.description}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Participants ({event.attendees.length})</h4>
            <div className="flex flex-wrap gap-2">
              {event.attendees.map((attendee, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-2 rounded-full text-sm flex items-center ${
                    attendee === currentUser ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    attendee === currentUser ? 'bg-indigo-200' : 'bg-blue-200'
                  }`}>
                    <span className="text-xs font-medium">
                      {attendee.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {attendee}
                  {attendee === currentUser && <span className="ml-1">(Moi)</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Mes notes personnelles */}
          {(event.myNotes || event.myPreparation) && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Mes notes</h4>
              <div className="bg-emerald-50 p-3 rounded-lg space-y-2">
                {event.myPreparation && (
                  <div>
                    <span className="text-sm font-medium text-emerald-900">Préparation:</span>
                    <p className="text-sm text-emerald-700">{event.myPreparation}</p>
                  </div>
                )}
                {event.myNotes && (
                  <div>
                    <span className="text-sm font-medium text-emerald-900">Notes:</span>
                    <p className="text-sm text-emerald-700">{event.myNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );

  const days = generateCalendarDays();
  const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="space-y-6">
      {showNewEventForm && (
        <PersonalEventForm
          onCancel={() => setShowNewEventForm(false)}
          onCreate={handleCreatePersonalEvent}
          currentUser={currentUser}
        />
      )}

      <MyStatisticsPanel />
      <MyFiltersPanel />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* En-tête du calendrier personnel */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
              <CalendarIcon className="h-6 w-6 mr-2" />
              Mon Calendrier
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {myStatistics.myProjectsCount} projets • {myStatistics.personalEvents} événements personnels • {myStatistics.pendingInvitations} invitations en attente
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                <User className="h-5 w-5 mr-2" />
                Nouvel Événement Personnel
              </button>
            </div>
          </div>
        </div>

        {/* En-tête des jours */}
        <div className="grid grid-cols-7 gap-px border-b border-gray-200">
          {weekdays.map((day, index) => (
            <div key={index} className="py-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isTodayDay = isToday(day);
            const hasPersonalEvents = dayEvents.some(e => e.isPersonal);
            const hasPendingInvitations = dayEvents.some(e => e.myStatus === 'pending');

            return (
              <div
                key={index}
                className={`min-h-[140px] bg-white p-2 transition-all duration-200 cursor-pointer ${
                  isTodayDay ? 'bg-indigo-50 ring-2 ring-indigo-200' : ''
                } ${!day ? 'bg-gray-50' : ''} ${
                  hasPersonalEvents ? 'bg-gradient-to-br from-emerald-50 to-green-50' : ''
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
                        {hasPersonalEvents && (
                          <User className="h-3 w-3 text-emerald-600" />
                        )}
                        {hasPendingInvitations && (
                          <Bell className="h-3 w-3 text-orange-600 animate-pulse" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 4).map(event => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`px-2 py-1 text-xs rounded truncate cursor-pointer transition-all duration-200 transform hover:scale-105 ${getEventTypeColor(event.type, event.isPersonal)} hover:shadow-sm flex items-center ${
                            event.myStatus === 'pending' ? 'ring-1 ring-orange-300 animate-pulse' : ''
                          }`}
                        >
                          <div className="mr-1 flex-shrink-0">
                            {getEventTypeIcon(event.type, event.isPersonal)}
                          </div>
                          <div className="truncate">
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="opacity-75 text-xs">{event.time}</div>
                          </div>
                          {event.myStatus === 'pending' && (
                            <div className="ml-auto">
                              <Bell className="h-2 w-2 text-orange-600" />
                            </div>
                          )}
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

      {/* Mes prochains événements */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Mes prochains événements
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
            .slice(0, 10)
            .map(event => (
              <div
                key={event.id}
                className="p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-indigo-300 transform hover:scale-[1.01]"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                      {getEventTypeIcon(event.type, event.isPersonal)}
                      <span className="ml-2">{event.title}</span>
                      {event.isPersonal && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded">
                          Personnel
                        </span>
                      )}
                      {event.myStatus === 'pending' && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded animate-pulse">
                          En attente
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
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(event.priority)}`}>
                      {event.priority}
                    </span>
                    {event.myStatus && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getMyStatusColor(event.myStatus)}`}>
                        {event.myStatus === 'accepted' ? 'Accepté' :
                         event.myStatus === 'declined' ? 'Décliné' :
                         event.myStatus === 'tentative' ? 'Peut-être' : 'En attente'}
                      </span>
                    )}
                  </div>
                </div>
                {event.attendees.length > 0 && (
                  <div className="mt-2 flex items-center">
                    <Users className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {event.attendees.slice(0, 3).join(', ')}{event.attendees.length > 3 ? ` +${event.attendees.length - 3}` : ''}
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
                Vos événements personnels et professionnels apparaîtront ici.
              </p>
              <button
                onClick={() => setShowNewEventForm(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                Créer un événement personnel
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedEvent && <MyEventDetails event={selectedEvent} />}
    </div>
  );
};

export default EmployeeCalendarView;