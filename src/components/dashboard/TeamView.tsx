import React, { useState } from 'react';
import { Plus, Mail, Phone, Search, Edit3, Trash2, MoreHorizontal, Users, Crown, Shield, Eye, UserCheck, UserX, MessageSquare, Filter, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import NewTeamView from '../newintegration/NewTeamView';

// Données des membres d'équipe étendues
const initialTeamMembers = [
  {
    id: 1,
    name: 'Marie Dupont',
    role: 'Chef de Projet',
    department: 'Gestion de Projet',
    email: 'marie.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    status: 'En ligne',
    avatar: '',
    dateJoined: '2024-01-15',
    lastActivity: '2024-06-10 14:30',
    permissions: ['admin', 'create_project', 'manage_team'],
    projects: ['Refonte Site Web', 'Application Mobile'],
    tasksCompleted: 45,
    tasksActive: 8,
    performance: 95,
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    skills: ['Gestion de projet', 'Agile', 'Scrum'],
    invitedBy: 'Système',
    contractType: 'CDI'
  },
  {
    id: 2,
    name: 'Thomas Martin',
    role: 'Développeur Frontend',
    department: 'Développement',
    email: 'thomas.martin@example.com',
    phone: '+33 6 23 45 67 89',
    status: 'En ligne',
    avatar: '',
    dateJoined: '2024-02-01',
    lastActivity: '2024-06-10 15:45',
    permissions: ['user', 'create_task'],
    projects: ['Refonte Site Web', 'Système CRM'],
    tasksCompleted: 67,
    tasksActive: 12,
    performance: 88,
    location: 'Lyon, France',
    timezone: 'Europe/Paris',
    skills: ['React', 'TypeScript', 'CSS'],
    invitedBy: 'Marie Dupont',
    contractType: 'CDI'
  },
  {
    id: 3,
    name: 'Sophie Bernard',
    role: 'Développeuse Backend',
    department: 'Développement',
    email: 'sophie.bernard@example.com',
    phone: '+33 6 34 56 78 90',
    status: 'Absent',
    avatar: '',
    dateJoined: '2024-01-20',
    lastActivity: '2024-06-10 09:15',
    permissions: ['user', 'create_task', 'manage_database'],
    projects: ['Application Mobile', 'Système CRM'],
    tasksCompleted: 52,
    tasksActive: 6,
    performance: 92,
    location: 'Marseille, France',
    timezone: 'Europe/Paris',
    skills: ['Node.js', 'Python', 'PostgreSQL'],
    invitedBy: 'Marie Dupont',
    contractType: 'CDI'
  },
  {
    id: 4,
    name: 'Jean Dubois',
    role: 'Designer UI/UX',
    department: 'Design',
    email: 'jean.dubois@example.com',
    phone: '+33 6 45 67 89 01',
    status: 'En ligne',
    avatar: '',
    dateJoined: '2024-03-01',
    lastActivity: '2024-06-10 16:20',
    permissions: ['user', 'create_task'],
    projects: ['Refonte Site Web'],
    tasksCompleted: 34,
    tasksActive: 5,
    performance: 90,
    location: 'Toulouse, France',
    timezone: 'Europe/Paris',
    skills: ['Figma', 'Photoshop', 'UI/UX'],
    invitedBy: 'Marie Dupont',
    contractType: 'Freelance'
  },
  {
    id: 5,
    name: 'Lucie Petit',
    role: 'Responsable Marketing',
    department: 'Marketing',
    email: 'lucie.petit@example.com',
    phone: '+33 6 56 78 90 12',
    status: 'Occupé',
    avatar: '',
    dateJoined: '2024-02-15',
    lastActivity: '2024-06-10 13:00',
    permissions: ['user', 'create_task'],
    projects: ['Campagne Q3 2024'],
    tasksCompleted: 28,
    tasksActive: 7,
    performance: 85,
    location: 'Bordeaux, France',
    timezone: 'Europe/Paris',
    skills: ['Marketing Digital', 'SEO', 'Analytics'],
    invitedBy: 'Marie Dupont',
    contractType: 'CDI'
  },
  {
    id: 6,
    name: 'Paul Leroy',
    role: 'Responsable Commercial',
    department: 'Ventes',
    email: 'paul.leroy@example.com',
    phone: '+33 6 67 89 01 23',
    status: 'Hors ligne',
    avatar: '',
    dateJoined: '2024-01-10',
    lastActivity: '2024-06-09 18:30',
    permissions: ['user', 'view_reports'],
    projects: ['Expansion Commerciale'],
    tasksCompleted: 41,
    tasksActive: 3,
    performance: 78,
    location: 'Nice, France',
    timezone: 'Europe/Paris',
    skills: ['Négociation', 'CRM', 'Lead Generation'],
    invitedBy: 'Marie Dupont',
    contractType: 'CDI'
  }
];

// Projets existants pour les invitations
const existingProjects = [
  { id: 1, name: 'Refonte Site Web' },
  { id: 2, name: 'Application Mobile' },
  { id: 3, name: 'Système CRM' },
  { id: 4, name: 'Campagne Q3 2024' },
  { id: 5, name: 'Expansion Commerciale' }
];

// Composant de carte de membre d'équipe
const TeamMemberCard: React.FC<{
  member: any;
  onEdit: (member: any) => void;
  onDelete: (member: any) => void;
  onViewDetails: (member: any) => void;
  onMessage: (member: any) => void;
}> = ({ member, onEdit, onDelete, onViewDetails, onMessage }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En ligne': return 'bg-green-100 text-green-800 border-green-200';
      case 'Occupé': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Absent': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Hors ligne': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('Chef') || role.includes('Responsable')) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (role.includes('Admin')) return <Shield className="h-4 w-4 text-red-500" />;
    return <Users className="h-4 w-4 text-blue-500" />;
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    if (performance >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-indigo-600">
              {member.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
            <div className="flex items-center space-x-2">
              {getRoleIcon(member.role)}
              <span className="text-sm text-gray-600">{member.role}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => { onViewDetails(member); setShowMenu(false); }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4 mr-3" />
                  Voir détails
                </button>
                <button
                  onClick={() => { onEdit(member); setShowMenu(false); }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit3 className="h-4 w-4 mr-3" />
                  Modifier
                </button>
                <button
                  onClick={() => { onMessage(member); setShowMenu(false); }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MessageSquare className="h-4 w-4 mr-3" />
                  Envoyer message
                </button>
                <div className="border-t border-gray-200"></div>
                <button
                  onClick={() => { onDelete(member); setShowMenu(false); }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(member.status)}`}>
            {member.status}
          </span>
          <span className="text-sm text-gray-500">{member.department}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Performance:</span>
          <span className={`font-semibold ${getPerformanceColor(member.performance)}`}>
            {member.performance}%
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tâches actives:</span>
          <span className="font-medium">{member.tasksActive}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Projets:</span>
          <span className="font-medium">{member.projects.length}</span>
        </div>

        <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
          <button
            onClick={() => window.open(`mailto:${member.email}`, '_blank')}
            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span className="text-sm">Email</span>
          </button>
          <button
            onClick={() => window.open(`tel:${member.phone}`, '_blank')}
            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="text-sm">Appel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant de vue détaillée du membre
const MemberDetailView: React.FC<{
  member: any;
  onClose: () => void;
  onEdit: (member: any) => void;
}> = ({ member, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-indigo-600">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{member.name}</h2>
              <p className="text-gray-600">{member.role} - {member.department}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Eye className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-sm text-gray-900">{member.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Téléphone:</span>
                <p className="text-sm text-gray-900">{member.phone}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Localisation:</span>
                <p className="text-sm text-gray-900">{member.location}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Fuseau horaire:</span>
                <p className="text-sm text-gray-900">{member.timezone}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Type de contrat:</span>
                <p className="text-sm text-gray-900">{member.contractType}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Date d'arrivée:</span>
                <p className="text-sm text-gray-900">{new Date(member.dateJoined).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Invité par:</span>
                <p className="text-sm text-gray-900">{member.invitedBy}</p>
              </div>
            </div>
          </div>

          {/* Statistiques et performance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance et statistiques</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{member.tasksCompleted}</div>
                <div className="text-sm text-green-700">Tâches terminées</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{member.tasksActive}</div>
                <div className="text-sm text-blue-700">Tâches actives</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{member.projects.length}</div>
                <div className="text-sm text-purple-700">Projets assignés</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{member.performance}%</div>
                <div className="text-sm text-yellow-700">Performance</div>
              </div>
            </div>

            {/* Compétences */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Compétences</h4>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Projets */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Projets assignés</h4>
              <div className="space-y-2">
                {member.projects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-900">{project}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => onEdit(member)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamView = () => {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Filtrage des membres
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Fonction pour créer un nouveau membre
  const handleCreateMember = (memberData: any) => {
    const newMember = {
      ...memberData,
      id: Date.now(),
      dateJoined: new Date().toISOString().slice(0, 10),
      lastActivity: new Date().toISOString(),
      tasksCompleted: 0,
      tasksActive: 0,
      performance: 100,
      invitedBy: 'Marie Dupont' // ou l'utilisateur actuel
    };

    setTeamMembers(prev => [...prev, newMember]);
    setShowInviteForm(false);
  };

  // Fonction pour éditer un membre
  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowEditForm(true);
    setShowMemberDetail(false);
  };

  // Fonction pour supprimer un membre
  const handleDeleteMember = (member: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${member.name} de l'équipe ?`)) {
      setTeamMembers(prev => prev.filter(m => m.id !== member.id));
    }
  };

  // Fonction pour voir les détails d'un membre
  const handleViewMemberDetails = (member: any) => {
    setSelectedMember(member);
    setShowMemberDetail(true);
  };

  // Fonction pour envoyer un message
  const handleMessage = (member: any) => {
    // Intégration avec le module de message
    console.log('Envoyer message à:', member.name);
  };

  // Statistiques de l'équipe
  const teamStats = {
    total: teamMembers.length,
    online: teamMembers.filter(m => m.status === 'En ligne').length,
    departments: [...new Set(teamMembers.map(m => m.department))].length,
    avgPerformance: Math.round(teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length)
  };

  const departments = [...new Set(teamMembers.map(m => m.department))];
  const statuses = [...new Set(teamMembers.map(m => m.status))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion de l'Équipe</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez les membres de votre équipe, leurs rôles et leurs accès
          </p>
        </div>
        <button 
          onClick={() => setShowInviteForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Inviter un Membre
        </button>
      </div>

      {/* Statistiques de l'équipe */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total des Membres</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{teamStats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Membres Actifs</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{teamStats.online}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Départements</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{teamStats.departments}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Performance Moyenne</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{teamStats.avgPerformance}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Recherche */}
          <div className="w-full sm:w-96">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md text-base"
                placeholder="Rechercher un membre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les statuts</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}
              >
                Tableau
              </button>
            </div>
          </div>
        </div>

        {filteredMembers.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            {filteredMembers.length} membre{filteredMembers.length !== 1 ? 's' : ''} trouvé{filteredMembers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Liste des membres */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={handleEditMember}
              onDelete={handleDeleteMember}
              onViewDetails={handleViewMemberDetails}
              onMessage={handleMessage}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        member.status === 'En ligne' ? 'bg-green-100 text-green-800' : 
                        member.status === 'Occupé' ? 'bg-yellow-100 text-yellow-800' : 
                        member.status === 'Absent' ? 'bg-purple-100 text-purple-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.performance}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`mailto:${member.email}`, '_blank')}
                          className="text-gray-400 hover:text-indigo-600"
                        >
                          <Mail className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => window.open(`tel:${member.phone}`, '_blank')}
                          className="text-gray-400 hover:text-indigo-600"
                        >
                          <Phone className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewMemberDetails(member)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterStatus !== 'all' || filterDepartment !== 'all'
              ? 'Aucun membre ne correspond à vos critères de recherche.'
              : 'Commencez par inviter votre premier membre d\'équipe.'
            }
          </p>
          {!searchQuery && filterStatus === 'all' && filterDepartment === 'all' && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Inviter un membre
            </button>
          )}
        </div>
      )}

      {/* Modal d'invitation */}
      {showInviteForm && (
        <NewTeamView
          onCancel={() => setShowInviteForm(false)}
          onCreate={handleCreateMember}
          existingProjects={existingProjects}
          existingMembers={teamMembers.map(m => m.name)}
        />
      )}

      {/* Modal d'édition */}
      {showEditForm && selectedMember && (
        <NewTeamView
          onCancel={() => { setShowEditForm(false); setSelectedMember(null); }}
          onCreate={(updatedData) => {
            setTeamMembers(prev => prev.map(member => 
              member.id === selectedMember.id ? { ...member, ...updatedData } : member
            ));
            setShowEditForm(false);
            setSelectedMember(null);
          }}
          existingProjects={existingProjects}
          existingMembers={teamMembers.map(m => m.name)}
          initialData={selectedMember}
          isEditing={true}
        />
      )}

      {/* Modal de détails */}
      {showMemberDetail && selectedMember && (
        <MemberDetailView
          member={selectedMember}
          onClose={() => { setShowMemberDetail(false); setSelectedMember(null); }}
          onEdit={handleEditMember}
        />
      )}
    </div>
  );
};

export default TeamView;