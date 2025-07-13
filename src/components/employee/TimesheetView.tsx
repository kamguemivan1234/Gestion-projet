import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Pause, Square, Plus, Calendar, Filter, Search, 
  Eye, Edit3, Trash2, Save, Send, BarChart3, Timer, 
  CheckCircle, AlertTriangle, FileText, Download, Upload,
  ChevronLeft, ChevronRight, MoreHorizontal, Target, Briefcase, X
} from 'lucide-react';

// Types pour TypeScript
interface TimeEntry {
  id: number;
  date: string;
  project: string;
  task: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number; // en minutes
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  billable: boolean;
  category: string;
}

interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  elapsed: number;
  currentProject: string;
  currentTask: string;
  currentDescription: string;
}

// Données des projets disponibles
const availableProjects = [
  { id: 1, name: 'Refonte Site Web', code: 'RSW' },
  { id: 2, name: 'Application Mobile', code: 'AM' },
  { id: 3, name: 'Système CRM', code: 'CRM' },
  { id: 4, name: 'Campagne Marketing', code: 'CM' },
  { id: 5, name: 'Formation Équipe', code: 'FE' }
];

// Données des tâches par projet
const availableTasks = {
  'Refonte Site Web': ['Développement Frontend', 'Intégration API', 'Tests Utilisateurs', 'Documentation'],
  'Application Mobile': ['Design UI/UX', 'Développement iOS', 'Développement Android', 'Tests'],
  'Système CRM': ['Architecture Backend', 'Base de données', 'Interface Admin', 'Migration données'],
  'Campagne Marketing': ['Stratégie', 'Création contenu', 'Analyse performances', 'Optimisation SEO'],
  'Formation Équipe': ['Préparation supports', 'Animation sessions', 'Évaluation', 'Suivi participants']
};

// Données d'exemple des entrées de temps
const initialTimeEntries: TimeEntry[] = [
  {
    id: 1,
    date: '2024-06-10',
    project: 'Refonte Site Web',
    task: 'Développement Frontend',
    description: 'Implémentation du nouveau design responsive',
    startTime: '09:00',
    endTime: '12:30',
    duration: 210,
    status: 'submitted',
    billable: true,
    category: 'Développement'
  },
  {
    id: 2,
    date: '2024-06-10',
    project: 'Application Mobile',
    task: 'Design UI/UX',
    description: 'Création des maquettes pour les écrans principaux',
    startTime: '14:00',
    endTime: '17:00',
    duration: 180,
    status: 'approved',
    billable: true,
    category: 'Design'
  },
  {
    id: 3,
    date: '2024-06-09',
    project: 'Formation Équipe',
    task: 'Animation sessions',
    description: 'Formation React pour l\'équipe junior',
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    status: 'approved',
    billable: false,
    category: 'Formation'
  },
  {
    id: 4,
    date: '2024-06-09',
    project: 'Système CRM',
    task: 'Architecture Backend',
    description: 'Conception de l\'API REST pour les contacts',
    startTime: '15:00',
    endTime: '18:00',
    duration: 180,
    status: 'draft',
    billable: true,
    category: 'Développement'
  },
  {
    id: 5,
    date: '2024-06-08',
    project: 'Refonte Site Web',
    task: 'Tests Utilisateurs',
    description: 'Tests de navigation et d\'accessibilité',
    startTime: '09:30',
    endTime: '12:00',
    duration: 150,
    status: 'submitted',
    billable: true,
    category: 'Tests'
  }
];

// Composant Timer
const TimeTracker: React.FC<{
  timer: TimerState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onProjectChange: (project: string) => void;
  onTaskChange: (task: string) => void;
  onDescriptionChange: (description: string) => void;
}> = ({ timer, onStart, onPause, onStop, onProjectChange, onTaskChange, onDescriptionChange }) => {
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Timer className="h-5 w-5 mr-2 text-indigo-600" />
          Chronomètre de temps
        </h3>
        <div className="text-3xl font-bold text-indigo-600">
          {formatTime(timer.elapsed)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          value={timer.currentProject}
          onChange={(e) => onProjectChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
          disabled={timer.isRunning}
        >
          <option value="">Sélectionner un projet</option>
          {availableProjects.map(project => (
            <option key={project.id} value={project.name}>{project.name}</option>
          ))}
        </select>

        <select
          value={timer.currentTask}
          onChange={(e) => onTaskChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
          disabled={timer.isRunning || !timer.currentProject}
        >
          <option value="">Sélectionner une tâche</option>
          {timer.currentProject && availableTasks[timer.currentProject]?.map(task => (
            <option key={task} value={task}>{task}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Description de l'activité..."
          value={timer.currentDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
          disabled={timer.isRunning}
        />
      </div>

      <div className="flex items-center space-x-4">
        {!timer.isRunning ? (
          <button
            onClick={onStart}
            disabled={!timer.currentProject || !timer.currentTask}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="h-4 w-4 mr-2" />
            Démarrer
          </button>
        ) : (
          <button
            onClick={onPause}
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </button>
        )}
        
        <button
          onClick={onStop}
          disabled={timer.elapsed === 0}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Square className="h-4 w-4 mr-2" />
          Arrêter & Enregistrer
        </button>

        {timer.isRunning && (
          <div className="flex items-center text-green-600">
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse mr-2"></div>
            En cours d'enregistrement...
          </div>
        )}
      </div>
    </div>
  );
};

// Composant d'entrée de temps manuelle
const ManualTimeEntry: React.FC<{
  onAdd: (entry: Omit<TimeEntry, 'id'>) => void;
}> = ({ onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    project: '',
    task: '',
    description: '',
    startTime: '',
    endTime: '',
    billable: true,
    category: 'Développement'
  });

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
    return Math.max(0, endMinutes - startMinutes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = calculateDuration(formData.startTime, formData.endTime);
    
    if (duration > 0) {
      onAdd({
        ...formData,
        duration,
        status: 'draft'
      });
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        project: '',
        task: '',
        description: '',
        startTime: '',
        endTime: '',
        billable: true,
        category: 'Développement'
      });
      setShowForm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-indigo-600" />
          Saisie manuelle
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Annuler' : 'Ajouter une entrée'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            
            <select
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value, task: '' })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Sélectionner un projet</option>
              {availableProjects.map(project => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!formData.project}
              required
            >
              <option value="">Sélectionner une tâche</option>
              {formData.project && availableTasks[formData.project]?.map(task => (
                <option key={task} value={task}>{task}</option>
              ))}
            </select>

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Développement">Développement</option>
              <option value="Design">Design</option>
              <option value="Tests">Tests</option>
              <option value="Documentation">Documentation</option>
              <option value="Formation">Formation</option>
              <option value="Réunion">Réunion</option>
            </select>
          </div>

          <textarea
            placeholder="Description de l'activité..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="billable"
                checked={formData.billable}
                onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="billable" className="ml-2 text-sm text-gray-700">
                Temps facturable
              </label>
            </div>
          </div>

          {formData.startTime && formData.endTime && (
            <div className="text-sm text-gray-600">
              Durée: {Math.floor(calculateDuration(formData.startTime, formData.endTime) / 60)}h {calculateDuration(formData.startTime, formData.endTime) % 60}min
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Composant d'édition d'entrée
const EditTimeEntryForm: React.FC<{
  entry: TimeEntry;
  onSave: (updatedEntry: TimeEntry) => void;
  onCancel: () => void;
}> = ({ entry, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: entry.date,
    project: entry.project,
    task: entry.task,
    description: entry.description,
    startTime: entry.startTime,
    endTime: entry.endTime,
    billable: entry.billable,
    category: entry.category
  });

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
    const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
    return Math.max(0, endMinutes - startMinutes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = calculateDuration(formData.startTime, formData.endTime);
    
    if (duration > 0) {
      onSave({
        ...entry,
        ...formData,
        duration
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Modifier l'entrée de temps</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Projet</label>
              <select
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value, task: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Sélectionner un projet</option>
                {availableProjects.map(project => (
                  <option key={project.id} value={project.name}>{project.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tâche</label>
              <select
                value={formData.task}
                onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!formData.project}
                required
              >
                <option value="">Sélectionner une tâche</option>
                {formData.project && availableTasks[formData.project]?.map(task => (
                  <option key={task} value={task}>{task}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Développement">Développement</option>
                <option value="Design">Design</option>
                <option value="Tests">Tests</option>
                <option value="Documentation">Documentation</option>
                <option value="Formation">Formation</option>
                <option value="Réunion">Réunion</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Description de l'activité..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de fin</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex items-end">
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  id="edit-billable"
                  checked={formData.billable}
                  onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="edit-billable" className="ml-2 text-sm text-gray-700">
                  Temps facturable
                </label>
              </div>
            </div>
          </div>

          {formData.startTime && formData.endTime && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              Durée calculée: {Math.floor(calculateDuration(formData.startTime, formData.endTime) / 60)}h {calculateDuration(formData.startTime, formData.endTime) % 60}min
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Vue calendrier
const CalendarView: React.FC<{
  entries: TimeEntry[];
}> = ({ entries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Obtenir les jours du mois actuel
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Jours du mois suivant
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const getEntriesForDate = (date: Date) => {
    const dateString = date.toISOString().slice(0, 10);
    return entries.filter(entry => entry.date === dateString);
  };

  const getTotalHoursForDate = (date: Date) => {
    const dayEntries = getEntriesForDate(date);
    const totalMinutes = dayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return totalMinutes / 60;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthYear = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 capitalize">{monthYear}</h3>
        <div className="flex space-x-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, isCurrentMonth }, index) => {
          const dayEntries = getEntriesForDate(date);
          const totalHours = getTotalHoursForDate(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`min-h-[80px] p-2 border border-gray-200 rounded-lg ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${isToday ? 'text-indigo-600' : ''}`}>
                {date.getDate()}
              </div>
              
              {dayEntries.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-green-600 font-medium">
                    {totalHours.toFixed(1)}h
                  </div>
                  {dayEntries.slice(0, 2).map(entry => (
                    <div
                      key={entry.id}
                      className="text-xs p-1 bg-indigo-100 text-indigo-800 rounded truncate"
                      title={`${entry.project} - ${entry.task}`}
                    >
                      {entry.project}
                    </div>
                  ))}
                  {dayEntries.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEntries.length - 2} autres
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Composant d'entrée de temps modifié
const TimeEntryCard: React.FC<{
  entry: TimeEntry;
  onEdit: (entry: TimeEntry) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TimeEntry['status']) => void;
}> = ({ entry, onEdit, onDelete, onStatusChange }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: TimeEntry['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: TimeEntry['status']) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'submitted': return 'Soumis';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      default: return 'Inconnu';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée de temps ?')) {
      onDelete(entry.id);
      setShowMenu(false);
    }
  };

  const handleSubmit = () => {
    onStatusChange(entry.id, 'submitted');
    setShowMenu(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-semibold text-gray-900">{entry.project}</h4>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{entry.task}</span>
            {entry.billable && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Facturable
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{entry.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{new Date(entry.date).toLocaleDateString('fr-FR')}</span>
            <span>{entry.startTime} - {entry.endTime}</span>
            <span className="font-medium">{formatDuration(entry.duration)}</span>
            <span className="capitalize">{entry.category}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(entry.status)}`}>
            {getStatusText(entry.status)}
          </span>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => { onEdit(entry); setShowMenu(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={entry.status === 'approved'}
                  >
                    <Edit3 className="h-4 w-4 mr-3" />
                    Modifier
                  </button>
                  {entry.status === 'draft' && (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Send className="h-4 w-4 mr-3" />
                      Soumettre
                    </button>
                  )}
                  <div className="border-t border-gray-200"></div>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={entry.status === 'approved'}
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TimesheetView = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  
  // État du timer
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    currentProject: '',
    currentTask: '',
    currentDescription: ''
  });

  // Effect pour le timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.isRunning && timer.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - timer.startTime!.getTime()) / 60000);
        setTimer(prev => ({ ...prev, elapsed }));
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startTime]);

  // Fonctions du timer
  const handleTimerStart = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      startTime: new Date()
    }));
  };

  const handleTimerPause = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const handleTimerStop = () => {
    if (timer.elapsed > 0 && timer.currentProject && timer.currentTask) {
      const now = new Date();
      const startTime = new Date(now.getTime() - timer.elapsed * 60000);
      
      const newEntry: TimeEntry = {
        id: Date.now(),
        date: now.toISOString().slice(0, 10),
        project: timer.currentProject,
        task: timer.currentTask,
        description: timer.currentDescription,
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: now.toTimeString().slice(0, 5),
        duration: timer.elapsed,
        status: 'draft',
        billable: true,
        category: 'Développement'
      };

      setTimeEntries(prev => [newEntry, ...prev]);
    }

    setTimer({
      isRunning: false,
      startTime: null,
      elapsed: 0,
      currentProject: '',
      currentTask: '',
      currentDescription: ''
    });
  };

  // Filtrage des entrées
  const filteredEntries = timeEntries.filter(entry => {
    const matchesSearch = entry.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesProject = filterProject === 'all' || entry.project === filterProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  // Statistiques
  const stats = {
    today: timeEntries
      .filter(entry => entry.date === new Date().toISOString().slice(0, 10))
      .reduce((sum, entry) => sum + entry.duration, 0),
    thisWeek: timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        return entryDate >= weekStart;
      })
      .reduce((sum, entry) => sum + entry.duration, 0),
    thisMonth: timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.date);
        const now = new Date();
        return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, entry) => sum + entry.duration, 0),
    billableHours: timeEntries
      .filter(entry => entry.billable && entry.status === 'approved')
      .reduce((sum, entry) => sum + entry.duration, 0)
  };

  const formatStatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  // Fonctions CRUD
  const handleAddEntry = (entryData: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: Date.now()
    };
    setTimeEntries(prev => [newEntry, ...prev]);
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
  };

  const handleSaveEditedEntry = (updatedEntry: TimeEntry) => {
    setTimeEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: number) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleStatusChange = (id: number, status: TimeEntry['status']) => {
    setTimeEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, status } : entry
    ));
  };

  const handleSubmitTimesheet = () => {
    const draftEntries = timeEntries.filter(entry => entry.status === 'draft');
    if (draftEntries.length === 0) {
      alert('Aucune entrée en brouillon à soumettre.');
      return;
    }
    
    if (window.confirm(`Soumettre ${draftEntries.length} entrée(s) pour validation ?`)) {
      setTimeEntries(prev => prev.map(entry => 
        entry.status === 'draft' ? { ...entry, status: 'submitted' } : entry
      ));
      
      // Simulation notification de succès
      setTimeout(() => {
        alert(`${draftEntries.length} entrée(s) soumise(s) avec succès !`);
      }, 500);
    }
  };

  const statuses = ['all', 'draft', 'submitted', 'approved', 'rejected'];
  const projects = ['all', ...availableProjects.map(p => p.name)];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Feuilles de Temps</h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivez et gérez vos heures de travail
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSubmitTimesheet}
            disabled={!timeEntries.some(entry => entry.status === 'draft')}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4 mr-2" />
            Soumettre feuille
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Aujourd'hui</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{formatStatTime(stats.today)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Cette semaine</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{formatStatTime(stats.thisWeek)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ce mois</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{formatStatTime(stats.thisMonth)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Heures facturables</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{formatStatTime(stats.billableHours)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <TimeTracker
        timer={timer}
        onStart={handleTimerStart}
        onPause={handleTimerPause}
        onStop={handleTimerStop}
        onProjectChange={(project) => setTimer(prev => ({ ...prev, currentProject: project, currentTask: '' }))}
        onTaskChange={(task) => setTimer(prev => ({ ...prev, currentTask: task }))}
        onDescriptionChange={(description) => setTimer(prev => ({ ...prev, currentDescription: description }))}
      />

      {/* Saisie manuelle */}
      <ManualTimeEntry onAdd={handleAddEntry} />

      {/* Filtres */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full sm:w-96">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md text-base"
                placeholder="Rechercher dans les entrées..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="submitted">Soumis</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>

            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les projets</option>
              {availableProjects.map(project => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>

            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Liste
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 text-sm border-l border-gray-300 transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Calendrier
              </button>
            </div>
          </div>
        </div>

        {filteredEntries.length > 0 && viewMode === 'list' && (
          <div className="mt-4 text-sm text-gray-500">
            {filteredEntries.length} entrée{filteredEntries.length !== 1 ? 's' : ''} trouvée{filteredEntries.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Contenu principal */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredEntries.map(entry => (
            <TimeEntryCard
              key={entry.id}
              entry={entry}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
              onStatusChange={handleStatusChange}
            />
          ))}
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entrée trouvée</h3>
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all' || filterProject !== 'all'
                  ? 'Aucune entrée ne correspond à vos critères de recherche.'
                  : 'Commencez par enregistrer votre première entrée de temps.'
                }
              </p>
            </div>
          )}
        </div>
      ) : (
        <CalendarView entries={filteredEntries} />
      )}

      {/* Modal d'édition */}
      {editingEntry && (
        <EditTimeEntryForm
          entry={editingEntry}
          onSave={handleSaveEditedEntry}
          onCancel={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
};

export default TimesheetView;