import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Send, Paperclip, Smile, MoreVertical, Phone, Video, Info, X, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

// Service WhatsApp avec API backend réelle
class WhatsAppService {
  static async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          message: message
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Message WhatsApp envoyé:', result.messageId);
        return true;
      } else {
        console.error('Erreur WhatsApp:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur connexion WhatsApp:', error);
      throw error;
    }
  }

  static async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/api/status');
      const status = await response.json();
      return status.whatsapp;
    } catch (error) {
      return false;
    }
  }
}

// Service Telegram avec API backend réelle
class TelegramService {
  static async sendMessage(chatId: string, message: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/api/telegram/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
          message: message
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Message Telegram envoyé:', result.messageId);
        return true;
      } else {
        console.error('Erreur Telegram:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur connexion Telegram:', error);
      throw error;
    }
  }

  static async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/api/status');
      const status = await response.json();
      return status.telegram;
    } catch (error) {
      return false;
    }
  }
}

// Service Email avec backend réel
class GmailService {
  static async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          subject: subject,
          content: content
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Email envoyé:', result.messageId);
        return true;
      } else {
        console.error('Erreur Email:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur connexion Email:', error);
      throw error;
    }
  }

  static async checkStatus(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/api/status');
      const status = await response.json();
      return status.email;
    } catch (error) {
      return false;
    }
  }
}

// Service de vérification du statut des services
class ServiceStatusChecker {
  static async checkAllServices(): Promise<{ whatsapp: boolean; telegram: boolean; email: boolean }> {
    try {
      const response = await fetch('http://localhost:3001/api/status');
      const status = await response.json();
      return status;
    } catch (error) {
      console.error('Erreur vérification statut services:', error);
      return { whatsapp: false, telegram: false, email: false };
    }
  }
}

const MessagesView = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration du nouveau message
  const [newMessageForm, setNewMessageForm] = useState({
    platform: 'whatsapp',
    contact: '',
    content: '',
    subject: '' // Pour Gmail
  });

  // État de connexion des services
  const [serviceStatus, setServiceStatus] = useState({
    whatsapp: false,
    telegram: false,
    email: false
  });

  // État de connexion du backend
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    // Vérifier la connexion au backend et initialiser les services
    checkBackendConnection();
    
    // Vérifier le statut des services toutes les 10 secondes
    const statusInterval = setInterval(checkServicesStatus, 10000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/status');
      if (response.ok) {
        setBackendConnected(true);
        checkServicesStatus();
      } else {
        setBackendConnected(false);
      }
    } catch (error) {
      setBackendConnected(false);
      addNotification('Backend non accessible. Assurez-vous que le serveur est démarré.', 'error');
    }
  };

  const checkServicesStatus = async () => {
    if (!backendConnected) return;
    
    try {
      const status = await ServiceStatusChecker.checkAllServices();
      setServiceStatus(status);
    } catch (error) {
      console.error('Erreur vérification statut:', error);
    }
  };

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 7000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    if (!backendConnected) {
      addNotification('Backend non connecté. Veuillez démarrer le serveur.', 'error');
      return;
    }

    setIsLoading(true);
    let success = false;
    let error = null;

    try {
      switch (activeConversation.platform) {
        case 'whatsapp':
          success = await WhatsAppService.sendMessage(activeConversation.contact, newMessage);
          break;
        case 'telegram':
          success = await TelegramService.sendMessage(activeConversation.contact, newMessage);
          break;
        case 'email':
          success = await GmailService.sendEmail(
            activeConversation.contact,
            'Message depuis l\'application',
            newMessage
          );
          break;
      }

      if (success) {
        // Ajouter le message à la conversation
        const newMsg = {
          id: Date.now(),
          sender: 'me',
          senderName: 'Moi',
          content: newMessage,
          timestamp: new Date(),
          platform: activeConversation.platform,
          delivered: true,
          read: false
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        
        addNotification(
          `Message envoyé avec succès via ${activeConversation.platform.charAt(0).toUpperCase() + activeConversation.platform.slice(1)}!`,
          'success'
        );
      }
    } catch (error) {
      console.error('Erreur envoi:', error);
      addNotification(`Erreur: ${error.message || 'Impossible d\'envoyer le message'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessageForm.contact || !newMessageForm.content) {
      addNotification('Veuillez remplir tous les champs', 'error');
      return;
    }

    if (!backendConnected) {
      addNotification('Backend non connecté. Veuillez démarrer le serveur.', 'error');
      return;
    }

    if (!serviceStatus[newMessageForm.platform as keyof typeof serviceStatus]) {
      addNotification(`Le service ${newMessageForm.platform} n'est pas disponible`, 'error');
      return;
    }

    setIsLoading(true);
    let success = false;

    try {
      switch (newMessageForm.platform) {
        case 'whatsapp':
          success = await WhatsAppService.sendMessage(newMessageForm.contact, newMessageForm.content);
          break;
        case 'telegram':
          success = await TelegramService.sendMessage(newMessageForm.contact, newMessageForm.content);
          break;
        case 'email':
          success = await GmailService.sendEmail(
            newMessageForm.contact,
            newMessageForm.subject || 'Nouveau message',
            newMessageForm.content
          );
          break;
      }

      if (success) {
        // Créer nouvelle conversation
        const newConversation = {
          id: Date.now(),
          name: newMessageForm.contact.includes('@') ? 
            newMessageForm.contact.split('@')[0] : 
            newMessageForm.contact,
          contact: newMessageForm.contact,
          platform: newMessageForm.platform,
          lastMessage: newMessageForm.content,
          timestamp: new Date(),
          online: false,
          unread: 0
        };

        setConversations(prev => [newConversation, ...prev]);
        setActiveConversation(newConversation);
        
        addNotification(
          `Message envoyé avec succès via ${newMessageForm.platform.charAt(0).toUpperCase() + newMessageForm.platform.slice(1)}!`,
          'success'
        );
        
        // Reset form
        setNewMessageForm({ platform: 'whatsapp', contact: '', content: '', subject: '' });
        setIsNewMessageModalOpen(false);
      }
    } catch (error) {
      console.error('Erreur envoi nouveau message:', error);
      addNotification(`Erreur: ${error.message || 'Impossible d\'envoyer le message'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'whatsapp': return '💬';
      case 'telegram': return '✈️';
      case 'email': return '📧';
      default: return '📱';
    }
  };

  const getPlatformStatus = (platform: string) => {
    return serviceStatus[platform as keyof typeof serviceStatus];
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-400' : 'bg-red-400';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Connecté' : 'Déconnecté';
  };

  return (
    <>
      <div className="flex h-[calc(100vh-180px)] bg-gray-50">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <div className="flex space-x-2">
                <button 
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                  onClick={() => setIsNewMessageModalOpen(true)}
                  title="Nouveau message"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <button 
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                  onClick={checkServicesStatus}
                  title="Actualiser le statut"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Status du backend */}
            <div className={`mb-3 p-3 rounded-lg ${backendConnected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center text-sm">
                <div className={`w-2 h-2 rounded-full mr-2 ${backendConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={backendConnected ? 'text-green-700' : 'text-red-700'}>
                  Backend: {backendConnected ? 'Connecté' : 'Déconnecté'}
                </span>
              </div>
              {!backendConnected && (
                <p className="text-xs text-red-600 mt-1">
                  Démarrez le serveur avec: npm run dev
                </p>
              )}
            </div>

            {/* Status des services */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-xs font-medium text-gray-700 mb-2">État des Services</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(serviceStatus.whatsapp)}`}></div>
                    WhatsApp
                  </span>
                  <span className={`text-xs ${serviceStatus.whatsapp ? 'text-green-600' : 'text-red-600'}`}>
                    {getStatusText(serviceStatus.whatsapp)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(serviceStatus.telegram)}`}></div>
                    Telegram
                  </span>
                  <span className={`text-xs ${serviceStatus.telegram ? 'text-green-600' : 'text-red-600'}`}>
                    {getStatusText(serviceStatus.telegram)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(serviceStatus.email)}`}></div>
                    Email
                  </span>
                  <span className={`text-xs ${serviceStatus.email ? 'text-green-600' : 'text-red-600'}`}>
                    {getStatusText(serviceStatus.email)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                placeholder="Rechercher des conversations..."
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>Aucune conversation</p>
                <p className="text-sm">Cliquez sur + pour commencer</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {conversations.map(conversation => (
                  <li 
                    key={conversation.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${activeConversation?.id === conversation.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''}`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 relative">
                        <div className="h-12 w-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white">
                          <span className="text-sm font-semibold">{conversation.name[0]}</span>
                        </div>
                        <div className="absolute -top-1 -right-1 text-sm">
                          {getPlatformIcon(conversation.platform)}
                        </div>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold text-gray-900 truncate">{conversation.name}</p>
                          <div className="flex items-center">
                            {!getPlatformStatus(conversation.platform) && (
                              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                        <p className="text-xs text-gray-500">{conversation.contact}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white mr-3">
                      <span className="text-sm font-semibold">{activeConversation.name[0]}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-gray-900">{activeConversation.name}</p>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          {activeConversation.platform.charAt(0).toUpperCase() + activeConversation.platform.slice(1)}
                        </span>
                        {!getPlatformStatus(activeConversation.platform) && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                            Service hors ligne
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{activeConversation.contact}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Info className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'me' 
                        ? 'bg-indigo-600 text-white rounded-l-lg rounded-tr-lg' 
                        : 'bg-white text-gray-900 border border-gray-200 rounded-r-lg rounded-tl-lg'
                    } shadow-sm`}>
                      <p className="break-words">{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                        message.sender === 'me' ? 'text-indigo-200' : 'text-gray-500'
                      }`}>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.sender === 'me' && (
                          <span>
                            {message.read ? (
                              <CheckCheck className="h-3 w-3 text-blue-300" />
                            ) : message.delivered ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                {!getPlatformStatus(activeConversation.platform) && (
                  <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    ⚠️ Le service {activeConversation.platform} n'est pas disponible
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-full px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                      placeholder="Écrivez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                      disabled={isLoading || !getPlatformStatus(activeConversation.platform)}
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <button 
                    className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading || !getPlatformStatus(activeConversation.platform)}
                  >
                    {isLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Commencez une conversation</h3>
                <p className="text-gray-500 mb-4">Sélectionnez une conversation ou créez-en une nouvelle</p>
                <button
                  onClick={() => setIsNewMessageModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={!backendConnected}
                >
                  Nouveau message
                </button>
                {!backendConnected && (
                  <p className="text-sm text-red-500 mt-2">Backend déconnecté</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {isNewMessageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Nouveau Message</h3>
                <button
                  onClick={() => setIsNewMessageModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleNewMessageSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plateforme de Communication
                  </label>
                  <select
                    value={newMessageForm.platform}
                    onChange={(e) => setNewMessageForm(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  >
                    <option value="whatsapp">
                      WhatsApp {serviceStatus.whatsapp ? '✅' : '❌'}
                    </option>
                    <option value="telegram">
                      Telegram {serviceStatus.telegram ? '✅' : '❌'}
                    </option>
                    <option value="email">
                      Email {serviceStatus.email ? '✅' : '❌'}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newMessageForm.platform === 'email' ? 'Adresse Email' : 
                     newMessageForm.platform === 'telegram' ? 'Nom d\'utilisateur Telegram' : 
                     'Numéro de Téléphone WhatsApp'}
                  </label>
                  <input
                    type="text"
                    value={newMessageForm.contact}
                    onChange={(e) => setNewMessageForm(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                    placeholder={
                      newMessageForm.platform === 'email' ? 'exemple@email.com' :
                      newMessageForm.platform === 'telegram' ? '@username ou username' :
                      '+237699029748 ou 699029748'
                    }
                  />
                </div>

                {newMessageForm.platform === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      value={newMessageForm.subject}
                      onChange={(e) => setNewMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                      placeholder="Sujet de l'email"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={newMessageForm.content}
                    onChange={(e) => setNewMessageForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                    placeholder="Écrivez votre message..."
                  />
                </div>
                
                <div className={`border rounded-lg p-3 ${
                  serviceStatus[newMessageForm.platform as keyof typeof serviceStatus] 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex">
                    <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${
                      serviceStatus[newMessageForm.platform as keyof typeof serviceStatus] 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`} />
                    <div className={`text-sm ${
                      serviceStatus[newMessageForm.platform as keyof typeof serviceStatus] 
                        ? 'text-green-700' 
                        : 'text-red-700'
                    }`}>
                      <p className="font-medium">
                        {serviceStatus[newMessageForm.platform as keyof typeof serviceStatus] 
                          ? 'Service disponible' 
                          : 'Service non disponible'}
                      </p>
                      <p className="mt-1">
                        {serviceStatus[newMessageForm.platform as keyof typeof serviceStatus] 
                          ? `Le message sera envoyé directement via ${newMessageForm.platform}.`
                          : `Le service ${newMessageForm.platform} n'est pas configuré ou disponible.`}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsNewMessageModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !serviceStatus[newMessageForm.platform as keyof typeof serviceStatus]}
                  >
                    {isLoading ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-40">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
              notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
              notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
              'bg-blue-100 border border-blue-400 text-blue-700'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm">{notification.message}</p>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MessagesView;