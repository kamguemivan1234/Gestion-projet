import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">WorkCollab</h3>
            <p className="text-gray-400 mb-4">
              Une plateforme complète pour la gestion de travail collaborative, conçue pour augmenter la productivité et simplifier la collaboration.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Produit</h4>
            <ul className="space-y-2">
              <li><Link to="/#features" className="text-gray-400 hover:text-white transition duration-300">Fonctionnalités</Link></li>
              <li><Link to="/#pricing" className="text-gray-400 hover:text-white transition duration-300">Tarifs</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition duration-300">Essai Gratuit</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">Mises à jour</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">Blog</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">Documentation</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">Guides</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">Webinaires</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">À propos</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">Carrières</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">Contact</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition duration-300">Partenaires</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} WorkCollab. Tous droits réservés.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-gray-400 hover:text-white transition duration-300">Confidentialité</Link>
            <Link to="#" className="text-gray-400 hover:text-white transition duration-300">Conditions</Link>
            <Link to="#" className="text-gray-400 hover:text-white transition duration-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;