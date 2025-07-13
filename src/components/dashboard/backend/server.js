const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');
const qrcode = require('qrcode-terminal');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5173;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuration
const CONFIG = {
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN'
  },
  email: {
    service: 'gmail',
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    password: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

// WhatsApp Client
let whatsappClient = null;
let isWhatsAppReady = false;

const initializeWhatsApp = () => {
  whatsappClient = new Client({
    authStrategy: new LocalAuth({
      dataPath: './whatsapp-session'
    }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  whatsappClient.on('qr', (qr) => {
    console.log('QR Code reçu, scannez-le avec WhatsApp:');
    qrcode.generate(qr, { small: true });
    console.log('Ou allez sur http://localhost:3001/whatsapp-qr pour voir le QR code');
  });

  whatsappClient.on('ready', () => {
    console.log('WhatsApp Client est prêt!');
    isWhatsAppReady = true;
  });

  whatsappClient.on('authenticated', () => {
    console.log('WhatsApp authentifié!');
  });

  whatsappClient.on('auth_failure', msg => {
    console.error('Échec de l\'authentification WhatsApp', msg);
    isWhatsAppReady = false;
  });

  whatsappClient.on('disconnected', (reason) => {
    console.log('WhatsApp déconnecté:', reason);
    isWhatsAppReady = false;
  });

  whatsappClient.initialize();
};

// Telegram Bot
let telegramBot = null;
let isTelegramReady = false;

const initializeTelegram = () => {
  if (CONFIG.telegram.token && CONFIG.telegram.token !== 'YOUR_TELEGRAM_BOT_TOKEN') {
    try {
      telegramBot = new TelegramBot(CONFIG.telegram.token, { polling: false });
      isTelegramReady = true;
      console.log('Telegram Bot initialisé!');
    } catch (error) {
      console.error('Erreur initialisation Telegram:', error);
    }
  } else {
    console.log('Token Telegram non configuré');
  }
};

// Email transporter
let emailTransporter = null;
let isEmailReady = false;

const initializeEmail = () => {
  try {
    emailTransporter = nodemailer.createTransporter({
      service: CONFIG.email.service,
      auth: {
        user: CONFIG.email.user,
        pass: CONFIG.email.password
      }
    });

    // Vérifier la configuration
    emailTransporter.verify((error, success) => {
      if (error) {
        console.error('Erreur configuration email:', error);
        isEmailReady = false;
      } else {
        console.log('Serveur email prêt!');
        isEmailReady = true;
      }
    });
  } catch (error) {
    console.error('Erreur initialisation email:', error);
  }
};

// Routes API

// Status des services
app.get('/api/status', (req, res) => {
  res.json({
    whatsapp: isWhatsAppReady,
    telegram: isTelegramReady,
    email: isEmailReady
  });
});

// WhatsApp QR Code
app.get('/whatsapp-qr', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WhatsApp QR Code</title>
      <meta http-equiv="refresh" content="5">
    </head>
    <body>
      <h1>Scannez ce QR Code avec WhatsApp</h1>
      <div id="qr"></div>
      <p>Cette page se rafraîchit automatiquement toutes les 5 secondes</p>
    </body>
    </html>
  `);
});

// Envoyer message WhatsApp
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!isWhatsAppReady || !whatsappClient) {
      return res.status(503).json({ 
        success: false, 
        error: 'WhatsApp client non disponible' 
      });
    }

    // Formatter le numéro (ajouter indicatif pays si nécessaire)
    let formattedNumber = phoneNumber.replace(/[^\d]/g, '');
    if (!formattedNumber.startsWith('237') && formattedNumber.length === 9) {
      formattedNumber = '237' + formattedNumber;
    }
    formattedNumber += '@c.us';

    // Vérifier si le numéro est enregistré sur WhatsApp
    const isRegistered = await whatsappClient.isRegisteredUser(formattedNumber);
    if (!isRegistered) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ce numéro n\'est pas enregistré sur WhatsApp' 
      });
    }

    // Envoyer le message
    const result = await whatsappClient.sendMessage(formattedNumber, message);
    
    res.json({ 
      success: true, 
      messageId: result.id.id,
      message: 'Message envoyé avec succès'
    });

  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Envoyer message Telegram
app.post('/api/telegram/send', async (req, res) => {
  try {
    const { chatId, message } = req.body;

    if (!isTelegramReady || !telegramBot) {
      return res.status(503).json({ 
        success: false, 
        error: 'Telegram bot non disponible' 
      });
    }

    // Supprimer @ du début si présent
    const cleanChatId = chatId.startsWith('@') ? chatId.substring(1) : chatId;

    const result = await telegramBot.sendMessage(`@${cleanChatId}`, message);
    
    res.json({ 
      success: true, 
      messageId: result.message_id,
      message: 'Message envoyé avec succès'
    });

  } catch (error) {
    console.error('Erreur envoi Telegram:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Envoyer email
app.post('/api/email/send', async (req, res) => {
  try {
    const { to, subject, content } = req.body;

    if (!isEmailReady || !emailTransporter) {
      return res.status(503).json({ 
        success: false, 
        error: 'Service email non disponible' 
      });
    }

    const mailOptions = {
      from: CONFIG.email.user,
      to: to,
      subject: subject || 'Message depuis l\'application',
      text: content,
      html: `<p>${content.replace(/\n/g, '<br>')}</p>`
    };

    const result = await emailTransporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      messageId: result.messageId,
      message: 'Email envoyé avec succès'
    });

  } catch (error) {
    console.error('Erreur envoi email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Interface WhatsApp QR: http://localhost:${PORT}/whatsapp-qr`);
  
  // Initialiser les services
  initializeWhatsApp();
  initializeTelegram();
  initializeEmail();
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('Arrêt du serveur...');
  if (whatsappClient) {
    await whatsappClient.destroy();
  }
  process.exit(0);
});