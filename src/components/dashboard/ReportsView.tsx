import React, { useState, useEffect } from 'react';
import { 
  Filter, Download, X, Calendar, BarChart3, PieChart, TrendingUp, 
  FileText, Users, Clock, Target, AlertTriangle, CheckCircle,
  Settings, RefreshCw, Eye, EyeOff, Search, ChevronDown,
  ArrowUp, ArrowDown, Minus, Plus, FileSpreadsheet, FileDown
} from 'lucide-react';

// Types pour la gestion des données
interface FilterState {
  dateRange: {
    start: string;
    end: string;
    preset: string;
  };
  status: string[];
  priority: string[];
  category: string[];
  assignee: string[];
  projects: string[];
  showCompleted: boolean;
  showOverdue: boolean;
}

interface ReportData {
  tasks: any[];
  projects: any[];
  calendar: any[];
  documents: any[];
  members: string[];
}

// Données mockées pour la démonstration (en production, ces données viendraient de vos APIs)
const mockData: ReportData = {
  tasks: [
    { id: 1, title: 'Développer API REST', status: 'En cours', priority: 'Élevée', assignee: 'Marie Dubois', project: 'Application Mobile', createdAt: '2024-01-15', completedAt: null, estimatedHours: 16, actualHours: 12, category: 'Développement' },
    { id: 2, title: 'Design interface utilisateur', status: 'Terminée', priority: 'Moyenne', assignee: 'Jean Martin', project: 'Site Web', createdAt: '2024-01-10', completedAt: '2024-01-20', estimatedHours: 8, actualHours: 10, category: 'Design' },
    { id: 3, title: 'Tests unitaires', status: 'En retard', priority: 'Élevée', assignee: 'Sophie Bernard', project: 'Application Mobile', createdAt: '2024-01-12', completedAt: null, estimatedHours: 12, actualHours: 8, category: 'QA' },
    { id: 4, title: 'Documentation API', status: 'À faire', priority: 'Moyenne', assignee: 'Pierre Leroux', project: 'API Backend', createdAt: '2024-01-18', completedAt: null, estimatedHours: 6, actualHours: 0, category: 'Documentation' },
    { id: 5, title: 'Optimisation base de données', status: 'En cours', priority: 'Urgente', assignee: 'Emma Wilson', project: 'API Backend', createdAt: '2024-01-14', completedAt: null, estimatedHours: 20, actualHours: 15, category: 'Développement' },
  ],
  projects: [
    { id: 1, name: 'Application Mobile', status: 'En cours', progress: 65, budget: 50000, spent: 32000, startDate: '2024-01-01', endDate: '2024-03-31', manager: 'Pierre Leroux' },
    { id: 2, name: 'Site Web', status: 'Terminé', progress: 100, budget: 25000, spent: 24500, startDate: '2023-12-01', endDate: '2024-01-31', manager: 'Marie Dubois' },
    { id: 3, name: 'API Backend', status: 'En cours', progress: 45, budget: 35000, spent: 18000, startDate: '2024-01-15', endDate: '2024-04-15', manager: 'Thomas Martin' },
  ],
  calendar: [
    { id: 1, title: 'Sprint Review', date: '2024-01-25', type: 'meeting', attendees: 5 },
    { id: 2, title: 'Livraison MVP', date: '2024-02-15', type: 'deadline', critical: true },
    { id: 3, title: 'Formation équipe', date: '2024-02-01', type: 'training', attendees: 8 },
  ],
  documents: [
    { id: 1, title: 'Cahier des charges', category: 'Spécification', author: 'Marie Dupont', createdAt: '2024-01-10', views: 25 },
    { id: 2, title: 'Guide utilisateur', category: 'Documentation', author: 'Thomas Martin', createdAt: '2024-01-15', views: 18 },
    { id: 3, title: 'Architecture technique', category: 'Technique', author: 'Sophie Bernard', createdAt: '2024-01-12', views: 12 },
  ],
  members: ['Marie Dubois', 'Jean Martin', 'Sophie Bernard', 'Pierre Leroux', 'Emma Wilson', 'Thomas Martin']
};

const ReportsView = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [currentData, setCurrentData] = useState<ReportData>(mockData);
  const [filteredData, setFilteredData] = useState<ReportData>(mockData);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      start: '2024-01-01',
      end: new Date().toISOString().split('T')[0],
      preset: 'current-month'
    },
    status: [],
    priority: [],
    category: [],
    assignee: [],
    projects: [],
    showCompleted: true,
    showOverdue: true
  });

  // Application des filtres
  useEffect(() => {
    applyFilters();
  }, [filters, currentData]);

  const applyFilters = () => {
    setLoading(true);
    
    setTimeout(() => {
      const filtered = {
        ...currentData,
        tasks: currentData.tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          
          const dateMatch = taskDate >= startDate && taskDate <= endDate;
          const statusMatch = filters.status.length === 0 || filters.status.includes(task.status);
          const priorityMatch = filters.priority.length === 0 || filters.priority.includes(task.priority);
          const categoryMatch = filters.category.length === 0 || filters.category.includes(task.category);
          const assigneeMatch = filters.assignee.length === 0 || filters.assignee.includes(task.assignee);
          const projectMatch = filters.projects.length === 0 || filters.projects.includes(task.project);
          
          const completedFilter = !filters.showCompleted && task.status === 'Terminée' ? false : true;
          const overdueFilter = !filters.showOverdue && task.status === 'En retard' ? false : true;
          
          return dateMatch && statusMatch && priorityMatch && categoryMatch && assigneeMatch && projectMatch && completedFilter && overdueFilter;
        })
      };
      
      setFilteredData(filtered);
      setLoading(false);
    }, 500);
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {
        start: '2024-01-01',
        end: new Date().toISOString().split('T')[0],
        preset: 'current-month'
      },
      status: [],
      priority: [],
      category: [],
      assignee: [],
      projects: [],
      showCompleted: true,
      showOverdue: true
    });
  };

  const updateDatePreset = (preset: string) => {
    const today = new Date();
    let start = new Date();
    
    switch (preset) {
      case 'today':
        start = new Date(today);
        break;
      case 'this-week':
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        break;
      case 'this-month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'last-month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        today.setDate(0);
        break;
      case 'this-quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case 'this-year':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        start = new Date('2024-01-01');
    }
    
    setFilters(prev => ({
      ...prev,
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        preset
      }
    }));
  };

  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  // Fonction pour générer un fichier CSV
  const generateCSV = (data: any) => {
    const { summary, tasks, projects } = data;
    
    let csvContent = '\uFEFF'; // BOM pour UTF-8
    
    // En-tête du rapport
    csvContent += 'RAPPORT D\'ACTIVITÉ\n';
    csvContent += `Généré le: ${new Date().toLocaleDateString('fr-FR')}\n`;
    csvContent += `Période: ${new Date(filters.dateRange.start).toLocaleDateString('fr-FR')} - ${new Date(filters.dateRange.end).toLocaleDateString('fr-FR')}\n\n`;
    
    // Résumé des métriques
    csvContent += 'RÉSUMÉ DES MÉTRIQUES\n';
    csvContent += 'Indicateur,Valeur\n';
    csvContent += `Total des tâches,${summary.tasks.total}\n`;
    csvContent += `Tâches terminées,${summary.tasks.completed}\n`;
    csvContent += `Tâches en retard,${summary.tasks.overdue}\n`;
    csvContent += `Taux de completion,${summary.tasks.completionRate.toFixed(1)}%\n`;
    csvContent += `Heures travaillées,${summary.hours.total}\n`;
    csvContent += `Efficacité,${summary.hours.efficiency.toFixed(1)}%\n`;
    csvContent += `Projets actifs,${summary.projects.active}\n\n`;
    
    // Liste des tâches
    csvContent += 'DÉTAIL DES TÂCHES\n';
    csvContent += 'ID,Titre,Statut,Priorité,Assigné,Projet,Créé le,Complété le,Heures estimées,Heures réelles,Catégorie\n';
    
    tasks.forEach(task => {
      const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString('fr-FR') : '';
      csvContent += `${task.id},"${task.title}","${task.status}","${task.priority}","${task.assignee}","${task.project}","${new Date(task.createdAt).toLocaleDateString('fr-FR')}","${completedDate}",${task.estimatedHours},${task.actualHours},"${task.category}"\n`;
    });
    
    csvContent += '\n';
    
    // Liste des projets
    csvContent += 'DÉTAIL DES PROJETS\n';
    csvContent += 'ID,Nom,Statut,Progression,Budget,Dépensé,Date début,Date fin,Manager\n';
    
    projects.forEach(project => {
      csvContent += `${project.id},"${project.name}","${project.status}",${project.progress}%,${project.budget},${project.spent},"${new Date(project.startDate).toLocaleDateString('fr-FR')}","${new Date(project.endDate).toLocaleDateString('fr-FR')}","${project.manager}"\n`;
    });
    
    return csvContent;
  };

  // Fonction pour générer un fichier Excel
  const generateExcel = async (data: any) => {
    // Import des bibliothèques nécessaires
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        const { summary, tasks, projects } = data;
        
        // Créer un nouveau workbook
        const wb = (window as any).XLSX.utils.book_new();
        
        // Feuille 1: Résumé
        const summaryData = [
          ['RAPPORT D\'ACTIVITÉ'],
          ['Généré le:', new Date().toLocaleDateString('fr-FR')],
          ['Période:', `${new Date(filters.dateRange.start).toLocaleDateString('fr-FR')} - ${new Date(filters.dateRange.end).toLocaleDateString('fr-FR')}`],
          [''],
          ['MÉTRIQUES PRINCIPALES'],
          ['Indicateur', 'Valeur'],
          ['Total des tâches', summary.tasks.total],
          ['Tâches terminées', summary.tasks.completed],
          ['Tâches en retard', summary.tasks.overdue],
          ['Taux de completion', `${summary.tasks.completionRate.toFixed(1)}%`],
          ['Heures travaillées', summary.hours.total],
          ['Efficacité', `${summary.hours.efficiency.toFixed(1)}%`],
          ['Projets actifs', summary.projects.active]
        ];
        
        const ws1 = (window as any).XLSX.utils.aoa_to_sheet(summaryData);
        (window as any).XLSX.utils.book_append_sheet(wb, ws1, 'Résumé');
        
        // Feuille 2: Tâches
        const tasksData = [
          ['ID', 'Titre', 'Statut', 'Priorité', 'Assigné', 'Projet', 'Créé le', 'Complété le', 'Heures estimées', 'Heures réelles', 'Catégorie'],
          ...tasks.map(task => [
            task.id,
            task.title,
            task.status,
            task.priority,
            task.assignee,
            task.project,
            new Date(task.createdAt).toLocaleDateString('fr-FR'),
            task.completedAt ? new Date(task.completedAt).toLocaleDateString('fr-FR') : '',
            task.estimatedHours,
            task.actualHours,
            task.category
          ])
        ];
        
        const ws2 = (window as any).XLSX.utils.aoa_to_sheet(tasksData);
        (window as any).XLSX.utils.book_append_sheet(wb, ws2, 'Tâches');
        
        // Feuille 3: Projets
        const projectsData = [
          ['ID', 'Nom', 'Statut', 'Progression', 'Budget', 'Dépensé', 'Date début', 'Date fin', 'Manager'],
          ...projects.map(project => [
            project.id,
            project.name,
            project.status,
            `${project.progress}%`,
            project.budget,
            project.spent,
            new Date(project.startDate).toLocaleDateString('fr-FR'),
            new Date(project.endDate).toLocaleDateString('fr-FR'),
            project.manager
          ])
        ];
        
        const ws3 = (window as any).XLSX.utils.aoa_to_sheet(projectsData);
        (window as any).XLSX.utils.book_append_sheet(wb, ws3, 'Projets');
        
        // Convertir en blob
        const wbout = (window as any).XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        resolve(blob);
        
        // Nettoyer
        document.head.removeChild(script);
      };
    });
  };

  // Fonction pour générer un fichier PDF
  const generatePDF = async (data: any) => {
    // Import de jsPDF
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);
    
    return new Promise((resolve) => {
      script.onload = () => {
        const { jsPDF } = (window as any).jspdf;
        const { summary, tasks, projects } = data;
        const doc = new jsPDF();
        
        // Configuration
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let currentY = margin;
        
        // Titre principal
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('RAPPORT D\'ACTIVITÉ', margin, currentY);
        currentY += 15;
        
        // Informations du rapport
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, margin, currentY);
        currentY += 6;
        doc.text(`Période: ${new Date(filters.dateRange.start).toLocaleDateString('fr-FR')} - ${new Date(filters.dateRange.end).toLocaleDateString('fr-FR')}`, margin, currentY);
        currentY += 15;
        
        // Section Métriques
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('MÉTRIQUES PRINCIPALES', margin, currentY);
        currentY += 10;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        const metrics = [
          ['Total des tâches:', summary.tasks.total],
          ['Tâches terminées:', summary.tasks.completed],
          ['Tâches en retard:', summary.tasks.overdue],
          ['Taux de completion:', `${summary.tasks.completionRate.toFixed(1)}%`],
          ['Heures travaillées:', summary.hours.total],
          ['Efficacité:', `${summary.hours.efficiency.toFixed(1)}%`],
          ['Projets actifs:', summary.projects.active]
        ];
        
        metrics.forEach(([label, value]) => {
          doc.text(`${label} ${value}`, margin, currentY);
          currentY += 6;
        });
        
        currentY += 10;
        
        // Section Tâches
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('DÉTAIL DES TÂCHES', margin, currentY);
        currentY += 10;
        
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        
        // En-têtes du tableau des tâches
        const headers = ['ID', 'Titre', 'Statut', 'Priorité', 'Assigné', 'Projet'];
        let startX = margin;
        const colWidth = (pageWidth - 2 * margin) / headers.length;
        
        doc.setFont(undefined, 'bold');
        headers.forEach((header, index) => {
          doc.text(header, startX + index * colWidth, currentY);
        });
        currentY += 8;
        
        doc.setFont(undefined, 'normal');
        
        // Données des tâches (limitées pour éviter le débordement)
        tasks.slice(0, 15).forEach(task => {
          if (currentY > 280) { // Nouvelle page si nécessaire
            doc.addPage();
            currentY = margin;
          }
          
          const rowData = [
            task.id.toString(),
            task.title.substring(0, 15) + (task.title.length > 15 ? '...' : ''),
            task.status,
            task.priority,
            task.assignee.split(' ')[0], // Prénom seulement
            task.project.substring(0, 12) + (task.project.length > 12 ? '...' : '')
          ];
          
          rowData.forEach((data, index) => {
            doc.text(data, startX + index * colWidth, currentY);
          });
          currentY += 6;
        });
        
        if (tasks.length > 15) {
          currentY += 5;
          doc.text(`... et ${tasks.length - 15} tâches supplémentaires`, margin, currentY);
        }
        
        currentY += 15;
        
        // Section Projets
        if (currentY > 250) {
          doc.addPage();
          currentY = margin;
        }
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('DÉTAIL DES PROJETS', margin, currentY);
        currentY += 10;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        projects.forEach(project => {
          if (currentY > 270) {
            doc.addPage();
            currentY = margin;
          }
          
          doc.setFont(undefined, 'bold');
          doc.text(`${project.name} (${project.progress}%)`, margin, currentY);
          currentY += 6;
          
          doc.setFont(undefined, 'normal');
          doc.text(`Statut: ${project.status} | Manager: ${project.manager}`, margin + 5, currentY);
          currentY += 6;
          doc.text(`Budget: ${project.budget}€ | Dépensé: ${project.spent}€`, margin + 5, currentY);
          currentY += 6;
          doc.text(`Période: ${new Date(project.startDate).toLocaleDateString('fr-FR')} - ${new Date(project.endDate).toLocaleDateString('fr-FR')}`, margin + 5, currentY);
          currentY += 10;
        });
        
        // Pied de page sur toutes les pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.text(`Page ${i} sur ${pageCount}`, pageWidth - margin - 20, 290);
        }
        
        // Retourner le blob PDF
        const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
        resolve(blob);
        
        // Nettoyer
        document.head.removeChild(script);
      };
    });
  };

  const exportData = async (format: 'csv' | 'excel' | 'pdf') => {
    setLoading(true);
    
    try {
      const data = {
        summary: calculateMetrics(),
        tasks: filteredData.tasks,
        projects: filteredData.projects,
        filters: filters,
        generatedAt: new Date().toISOString()
      };
      
      let blob: Blob;
      let filename: string;
      const dateStr = new Date().toISOString().split('T')[0];
      
      switch (format) {
        case 'csv':
          const csvContent = generateCSV(data);
          blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          filename = `rapport-${dateStr}.csv`;
          break;
          
        case 'excel':
          blob = await generateExcel(data) as Blob;
          filename = `rapport-${dateStr}.xlsx`;
          break;
          
        case 'pdf':
          blob = await generatePDF(data) as Blob;
          filename = `rapport-${dateStr}.pdf`;
          break;
          
        default:
          throw new Error('Format non supporté');
      }
      
      // Télécharger le fichier
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setLoading(false);
      setShowExportModal(false);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setLoading(false);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    }
  };

  const calculateMetrics = () => {
    const tasks = filteredData.tasks;
    const projects = filteredData.projects;
    
    const completedTasks = tasks.filter(t => t.status === 'Terminée').length;
    const overdueTasks = tasks.filter(t => t.status === 'En retard').length;
    const inProgressTasks = tasks.filter(t => t.status === 'En cours').length;
    const totalHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
    const estimatedHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    
    const activeProjects = projects.filter(p => p.status === 'En cours').length;
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length || 0;
    
    return {
      tasks: {
        total: tasks.length,
        completed: completedTasks,
        overdue: overdueTasks,
        inProgress: inProgressTasks,
        completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0
      },
      hours: {
        total: totalHours,
        estimated: estimatedHours,
        efficiency: estimatedHours > 0 ? (totalHours / estimatedHours) * 100 : 0
      },
      projects: {
        total: projects.length,
        active: activeProjects,
        avgProgress: avgProgress
      }
    };
  };

  const metrics = calculateMetrics();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rapports & Analyses</h1>
          <p className="text-sm text-gray-500 mt-1">
            Analyse détaillée des performances et de l'activité de l'équipe
          </p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
              showFilters || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : false)
                ? 'border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : false) && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                {Object.values(filters).filter(f => Array.isArray(f) ? f.length > 0 : false).length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
          <button 
            onClick={applyFilters}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Panneau de filtrage */}
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filtres de Rapport</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Plage de dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <div className="space-y-2">
                <select
                  value={filters.dateRange.preset}
                  onChange={(e) => updateDatePreset(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-base"
                >
                  <option value="today">Aujourd'hui</option>
                  <option value="this-week">Cette semaine</option>
                  <option value="this-month">Ce mois</option>
                  <option value="last-month">Mois dernier</option>
                  <option value="this-quarter">Ce trimestre</option>
                  <option value="this-year">Cette année</option>
                  <option value="custom">Personnalisé</option>
                </select>
                {filters.dateRange.preset === 'custom' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <div className="space-y-2">
                {['À faire', 'En cours', 'Terminée', 'En retard'].map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleFilter('status', status)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <div className="space-y-2">
                {['Basse', 'Moyenne', 'Élevée', 'Urgente'].map(priority => (
                  <label key={priority} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(priority)}
                      onChange={() => toggleFilter('priority', priority)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <div className="space-y-2">
                {['Développement', 'Design', 'QA', 'Documentation', 'Marketing'].map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => toggleFilter('category', category)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Assigné */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigné</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {mockData.members.map(member => (
                  <label key={member} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.assignee.includes(member)}
                      onChange={() => toggleFilter('assignee', member)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{member}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Projets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Projets</label>
              <div className="space-y-2">
                {mockData.projects.map(project => (
                  <label key={project.name} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.projects.includes(project.name)}
                      onChange={() => toggleFilter('projects', project.name)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{project.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Options d'affichage */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Options d'affichage</h4>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showCompleted}
                  onChange={(e) => setFilters(prev => ({ ...prev, showCompleted: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Afficher les tâches terminées</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showOverdue}
                  onChange={(e) => setFilters(prev => ({ ...prev, showOverdue: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Afficher les tâches en retard</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'export */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Exporter le Rapport</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Sélectionnez le format d'export pour vos données filtrées.
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => exportData('csv')}
                    disabled={loading}
                    className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-6 w-6 text-green-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">CSV</div>
                        <div className="text-sm text-gray-500">Tableur Excel/Google Sheets</div>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400 rotate-270" />
                  </button>

                  <button
                    onClick={() => exportData('excel')}
                    disabled={loading}
                    className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Excel</div>
                        <div className="text-sm text-gray-500">Fichier Microsoft Excel</div>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400 rotate-270" />
                  </button>

                  <button
                    onClick={() => exportData('pdf')}
                    disabled={loading}
                    className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <FileDown className="h-6 w-6 text-red-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">PDF</div>
                        <div className="text-sm text-gray-500">Document PDF avec graphiques</div>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 text-gray-400 rotate-270" />
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Contenu inclus :</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Résumé des métriques</li>
                    <li>• Liste des tâches filtrées</li>
                    <li>• Détails des projets</li>
                    <li>• Paramètres de filtrage appliqués</li>
                    <li>• Date de génération</li>
                  </ul>
                </div>
              </div>

              {loading && (
                <div className="mt-4 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 animate-spin text-indigo-600 mr-2" />
                  <span className="text-sm text-gray-600">Génération en cours...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards avec données filtrées */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="ml-0 w-full">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Tâches Complétées
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{metrics.tasks.completed}</div>
                  <div className="text-sm text-green-600">
                    {metrics.tasks.completionRate.toFixed(1)}% de taux de réussite
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="ml-0 w-full">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                  Tâches En Retard
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{metrics.tasks.overdue}</div>
                  <div className="text-sm text-red-600">
                    {metrics.tasks.total > 0 ? ((metrics.tasks.overdue / metrics.tasks.total) * 100).toFixed(1) : 0}% du total
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="ml-0 w-full">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  Projets Actifs
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{metrics.projects.active}</div>
                  <div className="text-sm text-gray-500">
                    {metrics.projects.avgProgress.toFixed(1)}% progression moyenne
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="ml-0 w-full">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-purple-500" />
                  Heures Travaillées
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{metrics.hours.total}h</div>
                  <div className={`text-sm ${metrics.hours.efficiency >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                    {metrics.hours.efficiency.toFixed(1)}% d'efficacité
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                Progression des Tâches
              </h3>
              <div className="text-sm text-gray-500">
                {filteredData.tasks.length} tâches
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              {/* Simulation d'un graphique en barres */}
              <div className="w-full h-full p-4">
                <div className="flex items-end justify-center space-x-4 h-full">
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-green-500 rounded-t" 
                      style={{height: `${(metrics.tasks.completed / metrics.tasks.total) * 100}%`}}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">Terminées</span>
                    <span className="text-xs font-semibold">{metrics.tasks.completed}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-blue-500 rounded-t" 
                      style={{height: `${(metrics.tasks.inProgress / metrics.tasks.total) * 100}%`}}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">En cours</span>
                    <span className="text-xs font-semibold">{metrics.tasks.inProgress}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-red-500 rounded-t" 
                      style={{height: `${(metrics.tasks.overdue / metrics.tasks.total) * 100}%`}}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">En retard</span>
                    <span className="text-xs font-semibold">{metrics.tasks.overdue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                Répartition par Priorité
              </h3>
              <div className="text-sm text-gray-500">
                Distribution des tâches
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              {/* Simulation d'un graphique en secteurs */}
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4">
                  {['Urgente', 'Élevée', 'Moyenne', 'Basse'].map((priority, index) => {
                    const count = filteredData.tasks.filter(t => t.priority === priority).length;
                    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
                    return (
                      <div key={priority} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${colors[index]}`}></div>
                        <div className="text-sm">
                          <div className="font-medium">{priority}</div>
                          <div className="text-gray-500">{count} tâches</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-6">
        {/* Performance par membre */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Performance par Membre
            </h3>
            <div className="space-y-3">
              {mockData.members.slice(0, 5).map(member => {
                const memberTasks = filteredData.tasks.filter(t => t.assignee === member);
                const completed = memberTasks.filter(t => t.status === 'Terminée').length;
                const total = memberTasks.length;
                const percentage = total > 0 ? (completed / total) * 100 : 0;
                
                return (
                  <div key={member} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{member}</span>
                        <span className="text-sm text-gray-500">{completed}/{total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                          style={{width: `${percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline des projets */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Timeline des Projets
            </h3>
            <div className="space-y-4">
              {filteredData.projects.map(project => (
                <div key={project.id} className="border-l-4 border-indigo-400 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      project.status === 'En cours' ? 'bg-blue-100 text-blue-800' : 
                      project.status === 'Terminé' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(project.startDate).toLocaleDateString('fr-FR')} - {new Date(project.endDate).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full" 
                      style={{width: `${project.progress}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{project.progress}% complété</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Métriques avancées */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
              Métriques Avancées
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">Vélocité moyenne</div>
                  <div className="text-xs text-gray-500">Tâches/semaine</div>
                </div>
                <div className="text-lg font-semibold text-indigo-600">
                  {(metrics.tasks.completed / 4).toFixed(1)}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">Temps moyen</div>
                  <div className="text-xs text-gray-500">Par tâche</div>
                </div>
                <div className="text-lg font-semibold text-purple-600">
                  {metrics.tasks.completed > 0 ? (metrics.hours.total / metrics.tasks.completed).toFixed(1) : 0}h
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">Taux de retard</div>
                  <div className="text-xs text-gray-500">% des tâches</div>
                </div>
                <div className="text-lg font-semibold text-red-600">
                  {metrics.tasks.total > 0 ? ((metrics.tasks.overdue / metrics.tasks.total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900">Charge de travail</div>
                  <div className="text-xs text-gray-500">Heures/membre</div>
                </div>
                <div className="text-lg font-semibold text-green-600">
                  {mockData.members.length > 0 ? (metrics.hours.total / mockData.members.length).toFixed(1) : 0}h
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Mise à jour avec données filtrées */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Activité Récente Filtrée</h3>
              <p className="mt-1 text-sm text-gray-500">
                Dernières actions dans la période sélectionnée ({filteredData.tasks.length} éléments)
              </p>
            </div>
            {loading && (
              <RefreshCw className="h-5 w-5 animate-spin text-indigo-600" />
            )}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {filteredData.tasks.slice(0, 6).map(task => (
              <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                      task.status === 'Terminée' ? 'bg-green-400' :
                      task.status === 'En cours' ? 'bg-blue-400' :
                      task.status === 'En retard' ? 'bg-red-400' :
                      'bg-gray-400'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.assignee}</p>
                      <p className="text-sm text-gray-500">
                        {task.status === 'Terminée' ? 'A terminé' : 
                         task.status === 'En cours' ? 'Travaille sur' :
                         task.status === 'En retard' ? 'En retard sur' :
                         'A créé'} "{task.title}"
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Projet: {task.project} • Priorité: {task.priority}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {task.actualHours}h / {task.estimatedHours}h
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {filteredData.tasks.length === 0 && (
            <div className="px-4 py-8 text-center">
              <div className="text-gray-400 mb-2">
                <Search className="h-8 w-8 mx-auto" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Aucune activité trouvée</h3>
              <p className="text-sm text-gray-500">
                Aucune tâche ne correspond aux filtres sélectionnés.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;