import React, { useState } from 'react';
import { Search, Eye, MessageSquare, Users, Crown, Shield, Mail, Phone, 
         Filter, Calendar, Clock, CheckCircle, AlertTriangle, MapPin,
         UserCheck, Building, Award, Activity } from 'lucide-react';

// Données des membres d'équipe (vue employé)
const teamMembers = [
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
    projects: ['Refonte Site Web', 'Application Mobile'],
    tasksCompleted: 45,
    tasksActive: 8,
    performance: 95,
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    skills: ['Gestion de projet', 'Agile', 'Scrum'],
    contractType: 'CDI',
    bio: 'Experte en gestion de projet avec 8 ans d\'expérience en méthodologies agiles.'
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
    projects: ['Refonte Site Web', 'Système CRM'],
    tasksCompleted: 67,
    tasksActive: 12,
    performance: 88,
    location: 'Lyon, France',
    timezone: 'Europe/Paris',
    skills: ['React', 'TypeScript', 'CSS'],
    contractType: 'CDI',
    bio: 'Développeur passionné spécialisé dans les technologies React et l\'UX moderne.'
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
    projects: ['Application Mobile', 'Système CRM'],
    tasksCompleted: 52,
    tasksActive: 6,
    performance: 92,
    location: 'Marseille, France',
    timezone: 'Europe/Paris',
    skills: ['Node.js', 'Python', 'PostgreSQL'],
    contractType: 'CDI',
    bio: 'Architecte backend avec une expertise en bases de données et APIs.'
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
    projects: ['Refonte Site Web'],
    tasksCompleted: 34,
    tasksActive: 5,
    performance: 90,
    location: 'Toulouse, France',
    timezone: 'Europe/Paris',
    skills: ['Figma', 'Photoshop', 'UI/UX'],
    contractType: 'Freelance',
    bio: 'Designer créatif avec un œil pour les interfaces utilisateur intuitives.'
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
    projects: ['Campagne Q3 2024'],
    tasksCompleted: 28,
    tasksActive: 7,
    performance: 85,
    location: 'Bordeaux, France',
    timezone: 'Europe/Paris',
    skills: ['Marketing Digital', 'SEO', 'Analytics'],
    contractType: 'CDI',
    bio: 'Stratège marketing digital avec une passion pour l\'analyse de données.'
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
    projects: ['Expansion Commerciale'],
    tasksCompleted: 41,
    tasksActive: 3,
    performance: 78,
    location: 'Nice, France',
    timezone: 'Europe/Paris',
    skills: ['Négociation', 'CRM', 'Lead Generation'],
    contractType: 'CDI',
    bio: 'Expert commercial avec 10 ans d\'expérience en développement business.'
  }
];

// Composant de carte de membre d'équipe (version employé)
const TeamMemberCard: React.FC<{
  member: any;
  onViewDetails: (member: any) => void;
  onMessage: (member: any) => void;
}> = ({ member, onViewDetails, onMessage }) => {
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
            <Eye className="h-5 w-5 text-gray-500" />
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
                  onClick={() => { onMessage(member); setShowMenu(false); }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <MessageSquare className="h-4 w-4 mr-3" />
                  Envoyer message
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

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">{member.tasksCompleted} terminées</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">{member.tasksActive} actives</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4 text-purple-500" />
            <span className="text-gray-600">Performance:</span>
          </div>
          <span className="font-semibold text-indigo-600">{member.performance}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Projets:</span>
          </div>
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

// Composant de vue détaillée du membre (version employé - sans édition)
const MemberDetailView: React.FC<{
  member: any;
  onClose: () => void;
}> = ({ member, onClose }) => {
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
          {/* Informations de contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations de contact</h3>
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
                <span className="text-sm font-medium text-gray-500">Membre depuis:</span>
                <p className="text-sm text-gray-900">{new Date(member.dateJoined).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Bio */}
            {member.bio && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">À propos</h4>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            )}
          </div>

          {/* Statistiques et activité */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Activité et collaboration</h3>
            
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
                <div className="text-sm text-purple-700">Projets</div>
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

            {/* Projets collaboratifs */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Projets collaboratifs</h4>
              <div className="space-y-2">
                {member.projects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-900">{project}</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Actif</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Dernière activité: {new Date(member.lastActivity).toLocaleString('fr-FR')}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.open(`mailto:${member.email}`, '_blank')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Contacter
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showMemberDetail, setShowMemberDetail] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Filtrage des membres
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Fonction pour voir les détails d'un membre
  const handleViewMemberDetails = (member: any) => {
    setSelectedMember(member);
    setShowMemberDetail(true);
  };

  // Fonction pour envoyer un message
  const handleMessage = (member: any) => {
    // Redirection vers le module de messages avec le destinataire pré-sélectionné
    console.log('Envoyer message à:', member.name);
    // Dans une vraie application, cela pourrait ouvrir le module de messages
  };

  // Statistiques de l'équipe (vue employé)
  const teamStats = {
    total: teamMembers.length,
    online: teamMembers.filter(m => m.status === 'En ligne').length,
    departments: [...new Set(teamMembers.map(m => m.department))].length,
    collaborativeProjects: [...new Set(teamMembers.flatMap(m => m.projects))].length
  };

  const departments = [...new Set(teamMembers.map(m => m.department))];
  const statuses = [...new Set(teamMembers.map(m => m.status))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notre Équipe</h1>
          <p className="text-sm text-gray-500 mt-1">
            Découvrez vos collègues et collaborez efficacement
          </p>
        </div>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Membres de l'équipe</dt>
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
                <Activity className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Actuellement en ligne</dt>
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
                <Building className="h-8 w-8 text-purple-500" />
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
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Projets collaboratifs</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{teamStats.collaborativeProjects}</dd>
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
                placeholder="Rechercher un collègue..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projets</th>
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
                      <div className="text-sm text-gray-900">{member.projects.length} projet{member.projects.length !== 1 ? 's' : ''}</div>
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
                          onClick={() => handleMessage(member)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <MessageSquare className="h-4 w-4" />
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
          <p className="text-gray-500">
            Aucun membre ne correspond à vos critères de recherche.
          </p>
        </div>
      )}

      {/* Modal de détails */}
      {showMemberDetail && selectedMember && (
        <MemberDetailView
          member={selectedMember}
          onClose={() => { setShowMemberDetail(false); setSelectedMember(null); }}
        />
      )}
    </div>
  );
};

export default TeamView;