import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Clock,
  Settings,
  Users,
  MessageSquare,
  FileText,
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react';

// Import des vrais composants
import MyTasksView from '../components/employee/MyTasksViews';
import MyProjectsView from '../components/employee/MyProjectsView';
import EmployeeCalendarView from '../components/employee/CalendarView';
import EmployeeMessagesView from '../components/employee/MessagesView';
import EmployeeDocsView from '../components/employee/DocsView';
import EmployeeTeamView from '../components/employee/TeamView';
import EmployeeTimesheetView from '../components/employee/TimesheetView';
import ProfileView from '../components/employee/ProfileView';

const EmployeesDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Animation d'entrée pour les éléments
    const timer = setTimeout(() => {
      document.querySelectorAll('.animate-on-load').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-fade-in-up');
        }, index * 100);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const navigation = [
    { name: 'Tableau de bord', href: '/employee-dashboard', icon: LayoutDashboard },
    { name: 'Mes tâches', href: '/employee-dashboard/my-tasks', icon: CheckSquare },
    { name: 'Mes projets', href: '/employee-dashboard/my-projects', icon: Briefcase },
    { name: 'Calendrier', href: '/employee-dashboard/calendar', icon: Calendar },
    { name: 'Messages', href: '/employee-dashboard/messages', icon: MessageSquare },
    { name: 'Documents', href: '/employee-dashboard/docs', icon: FileText },
    { name: 'Équipe', href: '/employee-dashboard/team', icon: Users },
    { name: 'Feuilles de temps', href: '/employee-dashboard/timesheet', icon: Clock },
    { name: 'Mon profil', href: '/employee-dashboard/profile', icon: User },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.4); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .nav-item {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .nav-item:hover::before {
          left: 100%;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .sidebar-gradient {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #5d5cde 100%);
          position: relative;
        }

        .sidebar-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .modern-shadow {
          box-shadow:
            0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modern-shadow-lg {
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.15),
            0 10px 10px -5px rgba(99, 102, 241, 0.1);
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Sidebar for mobile */}
      <div className={`md:hidden fixed inset-0 z-50 flex transition-all duration-300 ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full sidebar-gradient animate-slide-in modern-shadow-lg">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all hover:bg-white hover:bg-opacity-20 hover:scale-110"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Fermer le menu</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <div className="text-white text-2xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent animate-float">
                WorkCollab
              </div>
            </div>

            <nav className="mt-5 px-2 space-y-2">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item animate-on-load group flex items-center px-3 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                    location.pathname === item.href
                      ? 'bg-white bg-opacity-20 text-white modern-shadow animate-glow'
                      : 'text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-white hover:scale-105'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon className="mr-4 h-6 w-6 transition-transform group-hover:scale-110" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
                  {item.name}
                  {location.pathname === item.href && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4 glass-effect">
            <div className="flex items-center w-full">
              <div className="relative">
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white ring-opacity-30 transition-all hover:ring-opacity-50 hover:scale-105" src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2 border-white animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">Marie Dubois</p>
                <p className="text-sm font-medium text-indigo-200 hover:text-white transition-colors cursor-pointer">Voir le profil</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className={`hidden md:flex md:flex-shrink-0 transition-all duration-500 ease-in-out ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col h-0 flex-1 sidebar-gradient modern-shadow-lg relative overflow-hidden">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto relative z-10">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="flex items-center justify-between w-full">
                  <div className={`text-white text-2xl font-bold bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent animate-float transition-all duration-300 ${sidebarCollapsed ? 'text-center w-full' : ''}`}>
                    {sidebarCollapsed ? 'WC' : 'WorkCollab'}
                  </div>
                  {!sidebarCollapsed && (
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="text-indigo-200 hover:text-white transition-all hover:bg-white hover:bg-opacity-10 p-2 rounded-lg hover:scale-110"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  {sidebarCollapsed && (
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="absolute top-4 left-1/2 transform -translate-x-1/2 text-indigo-200 hover:text-white transition-all hover:bg-white hover:bg-opacity-10 p-2 rounded-lg hover:scale-110"
                    >
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>

              <nav className="mt-5 flex-1 px-2 space-y-2">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-item animate-on-load group flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                      location.pathname === item.href
                        ? 'bg-white bg-opacity-20 text-white modern-shadow animate-glow'
                        : 'text-indigo-100 hover:bg-white hover:bg-opacity-10 hover:text-white hover:scale-105'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    <item.icon className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'} h-6 w-6 transition-transform group-hover:scale-110`} style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="transition-all">{item.name}</span>
                        {location.pathname === item.href && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        )}
                      </>
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4 glass-effect">
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} w-full`}>
                <div className="relative">
                  <img
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-white ring-opacity-30 transition-all hover:ring-opacity-50 hover:scale-105"
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                  />
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white animate-pulse"></div>
                </div>
                {!sidebarCollapsed && (
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Marie Dubois</p>
                    <p className="text-xs font-medium text-indigo-200 hover:text-white transition-colors cursor-pointer">Voir le profil</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white modern-shadow">
          <button
            className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all hover:text-indigo-600 hover:bg-gray-50"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex max-w-lg">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">Rechercher</label>
                <div className="relative w-full text-gray-400 focus-within:text-indigo-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Search className="h-5 w-5 transition-all" style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.3))' }} />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-10 pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-gray-50 focus:bg-white modern-shadow hover:shadow-lg"
                    placeholder="Rechercher..."
                    type="search"
                  />
                </div>
              </div>
            </div>

            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <button className="relative bg-white p-2 rounded-xl text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-110 modern-shadow hover:shadow-lg">
                <span className="sr-only">Voir les notifications</span>
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              <button className="bg-white p-2 rounded-xl text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-110 modern-shadow hover:shadow-lg">
                <span className="sr-only">Messages</span>
                <MessageSquare className="h-6 w-6" />
              </button>

              <div className="relative">
                <button className="bg-white flex items-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1 transition-all hover:scale-105 modern-shadow hover:shadow-lg">
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                    MD
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-white">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Welcome Section */}
              <div className="mb-8 animate-on-load">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Bonjour, NathanDev 👋
                </h1>
                <p className="text-gray-600">
                  Voici un aperçu de votre activité aujourd'hui
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card-hover animate-on-load bg-white rounded-2xl p-6 modern-shadow border border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <CheckSquare className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Mes tâches</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </div>

                <div className="card-hover animate-on-load bg-white rounded-2xl p-6 modern-shadow border border-gray-100" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Mes projets</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>
                </div>

                <div className="card-hover animate-on-load bg-white rounded-2xl p-6 modern-shadow border border-gray-100" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Heures cette semaine</p>
                      <p className="text-2xl font-bold text-gray-900">32h</p>
                    </div>
                  </div>
                </div>

                <div className="card-hover animate-on-load bg-white rounded-2xl p-6 modern-shadow border border-gray-100" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Réunions aujourd'hui</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-on-load">
                <Routes>
                  <Route path="/" element={<MyTasksView />} />
                  <Route path="/my-tasks" element={<MyTasksView />} />
                  <Route path="/my-projects" element={<MyProjectsView />} />
                  <Route path="/calendar" element={<EmployeeCalendarView />} />
                  <Route path="/timesheet" element={<EmployeeTimesheetView />} />
                  <Route path="/team" element={<EmployeeTeamView />} />
                  <Route path="/messages" element={<EmployeeMessagesView />} />
                  <Route path="/docs" element={<EmployeeDocsView />} />
                  <Route path="/profile" element={<ProfileView />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeesDashboard;