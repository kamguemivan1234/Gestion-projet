import React, { useState } from 'react';
import { X, Send, Paperclip, Users, Mail, MessageCircle, Phone, Tag, AlertCircle } from 'lucide-react';

interface NewMessageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (messageData: any) => void;
}

const teamMembers = [
  { id: 1, name: 'Marie Dupont', email: 'marie.dupont@company.com', whatsapp: '+33612345678', telegram: '@marie_dupont' },
  { id: 2, name: 'Thomas Martin', email: 'thomas.martin@company.com', whatsapp: '+33687654321', telegram: '@thomas_martin' },
  { id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@company.com', whatsapp: '+33698765432', telegram: '@sophie_bernard' },
  { id: 4, name: 'Jean Dubois', email: 'jean.dubois@company.com', whatsapp: '+33676543210', telegram: '@jean_dubois' },
];

const NewMessageView: React.FC<NewMessageFormProps> = ({ isOpen, onClose, onSend }) => {
  const [messageData, setMessageData] = useState({
    channel: 'email', // email, whatsapp, telegram
    recipients: [],
    recipientInput: '',
    subject: '',
    content: '',
    priority: 'normale',
    tags: '',
    attachments: []
  });

  const [showRecipientSuggestions, setShowRecipientSuggestions] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState(teamMembers);

  if (!isOpen) return null;

  const handleChannelChange = (channel: string) => {
    setMessageData({ ...messageData, channel, recipientInput: '', recipients: [] });
  };

  const handleRecipientInputChange = (value: string) => {
    setMessageData({ ...messageData, recipientInput: value });
    
    if (value.length > 0) {
      const filtered = teamMembers.filter(member => 
        member.name.toLowerCase().includes(value.toLowerCase()) ||
        member.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMembers(filtered);
      setShowRecipientSuggestions(true);
    } else {
      setShowRecipientSuggestions(false);
    }
  };

  const addRecipient = (member: any) => {
    const contactInfo = messageData.channel === 'email' ? member.email : 
                       messageData.channel === 'whatsapp' ? member.whatsapp : 
                       member.telegram;
    
    if (!messageData.recipients.some(r => r.id === member.id)) {
      setMessageData({
        ...messageData,
        recipients: [...messageData.recipients, { ...member, contactInfo }],
        recipientInput: ''
      });
    }
    setShowRecipientSuggestions(false);
  };

  const removeRecipient = (memberId: number) => {
    setMessageData({
      ...messageData,
      recipients: messageData.recipients.filter(r => r.id !== memberId)
    });
  };

  const handleSend = () => {
    if (messageData.recipients.length === 0 || !messageData.content.trim()) {
      alert('Veuillez sélectionner au moins un destinataire et saisir un message.');
      return;
    }

    const messageToSend = {
      ...messageData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    onSend(messageToSend);
    
    // Reset form
    setMessageData({
      channel: 'email',
      recipients: [],
      recipientInput: '',
      subject: '',
      content: '',
      priority: 'normale',
      tags: '',
      attachments: []
    });
    
    onClose();
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-5 w-5" />;
      case 'whatsapp': return <MessageCircle className="h-5 w-5" />;
      case 'telegram': return <Send className="h-5 w-5" />;
      default: return <Mail className="h-5 w-5" />;
    }
  };

  const getPlaceholderText = () => {
    switch (messageData.channel) {
      case 'email': return 'Rechercher par nom ou email...';
      case 'whatsapp': return 'Rechercher par nom ou numéro WhatsApp...';
      case 'telegram': return 'Rechercher par nom ou username Telegram...';
      default: return 'Rechercher un contact...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nouveau Message</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Canal de communication
            </label>
            <div className="flex space-x-4">
              {[
                { id: 'email', label: 'Email', icon: 'mail' },
                { id: 'whatsapp', label: 'WhatsApp', icon: 'message' },
                { id: 'telegram', label: 'Telegram', icon: 'send' }
              ].map(channel => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelChange(channel.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                    messageData.channel === channel.id
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {getChannelIcon(channel.id)}
                  <span>{channel.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destinataire(s)
            </label>
            
            {/* Selected Recipients */}
            {messageData.recipients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {messageData.recipients.map(recipient => (
                  <div
                    key={recipient.id}
                    className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{recipient.name}</span>
                    <button
                      onClick={() => removeRecipient(recipient.id)}
                      className="ml-2 hover:text-indigo-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recipient Input */}
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={getPlaceholderText()}
                value={messageData.recipientInput}
                onChange={(e) => handleRecipientInputChange(e.target.value)}
                onFocus={() => messageData.recipientInput.length > 0 && setShowRecipientSuggestions(true)}
              />
              
              {/* Suggestions */}
              {showRecipientSuggestions && filteredMembers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredMembers.map(member => (
                    <button
                      key={member.id}
                      onClick={() => addRecipient(member)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">
                          {messageData.channel === 'email' ? member.email :
                           messageData.channel === 'whatsapp' ? member.whatsapp :
                           member.telegram}
                        </div>
                      </div>
                      <Users className="h-4 w-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subject (for email) */}
          {messageData.channel === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objet
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Objet du message..."
                value={messageData.subject}
                onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
              />
            </div>
          )}

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Écrivez votre message..."
              value={messageData.content}
              onChange={(e) => setMessageData({ ...messageData, content: e.target.value })}
            />
          </div>

          {/* Priority and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={messageData.priority}
                onChange={(e) => setMessageData({ ...messageData, priority: e.target.value })}
              >
                <option value="basse">Basse</option>
                <option value="normale">Normale</option>
                <option value="élevée">Élevée</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Étiquettes
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="urgent, projet, réunion..."
                value={messageData.tags}
                onChange={(e) => setMessageData({ ...messageData, tags: e.target.value })}
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pièces jointes
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Paperclip className="mx-auto h-8 w-8 text-gray-400" />
                <div className="mt-2">
                  <button className="text-indigo-600 hover:text-indigo-500">
                    Cliquez pour ajouter des fichiers
                  </button>
                  <p className="text-sm text-gray-500">ou glissez-déposez ici</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <AlertCircle className="h-4 w-4 mr-1" />
            Le message sera envoyé via {messageData.channel === 'email' ? 'Email' : messageData.channel === 'whatsapp' ? 'WhatsApp' : 'Telegram'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessageView;