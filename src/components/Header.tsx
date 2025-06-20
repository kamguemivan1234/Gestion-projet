import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">WorkCollab</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-gray-600 hover:text-indigo-600 transition duration-300">Fonctionnalités</Link>
            <Link to="/#pricing" className="text-gray-600 hover:text-indigo-600 transition duration-300">Tarifs</Link>
            <Link to="/#testimonials" className="text-gray-600 hover:text-indigo-600 transition duration-300">Témoignages</Link>
            <Link to="/#faq" className="text-gray-600 hover:text-indigo-600 transition duration-300">FAQ</Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-300">Connexion</Link>
            <Link to="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
              Essai Gratuit
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/#features" 
                className="text-gray-600 hover:text-indigo-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link 
                to="/#pricing" 
                className="text-gray-600 hover:text-indigo-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link 
                to="/#testimonials" 
                className="text-gray-600 hover:text-indigo-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Témoignages
              </Link>
              <Link 
                to="/#faq" 
                className="text-gray-600 hover:text-indigo-600 transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                <Link 
                  to="/login" 
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  to="/dashboard" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Essai Gratuit
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;