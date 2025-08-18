"use client";
import React, { useState } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaMapPin,
  FaBars,
  FaTimes
} from 'react-icons/fa';

// Mock store data
const mockStoreData = {
  parents: [
    {
      id: 1,
      size: { height: 600, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      rnds: [
        {
          id: 1,
          width: 400,
          height: 200,
          x: 50,
          y: 50,
          elements: [
            {
              id: 1,
              type: 'text',
              x: 20,
              y: 20,
              width: 300,
              height: 60,
              content: 'Welcome to Our Amazing Website',
              fontSize: 28,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 10, right: 20, bottom: 10, left: 20 },
              borderRadius: 0,
              border: 'none',
            },
            {
              id: 2,
              type: 'button',
              x: 20,
              y: 100,
              width: 150,
              height: 45,
              content: 'Get Started',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              backgroundColor: '#ff6b6b',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 10, right: 20, bottom: 10, left: 20 },
              borderRadius: 25,
              border: 'none',
            }
          ]
        }
      ]
    },
    {
      id: 2,
      size: { height: 400, background: "#f8f9fa" },
      rnds: [
        {
          id: 2,
          width: 300,
          height: 150,
          x: 100,
          y: 50,
          elements: [
            {
              id: 3,
              type: 'text',
              x: 10,
              y: 10,
              width: 280,
              height: 40,
              content: 'About Our Services',
              fontSize: 24,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
            {
              id: 4,
              type: 'paragraph',
              x: 10,
              y: 60,
              width: 280,
              height: 80,
              content: '<p>We provide exceptional services tailored to your needs. Our team of experts is dedicated to delivering quality results.</p>',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              color: '#666666',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            }
          ]
        },
        {
          id: 3,
          width: 200,
          height: 200,
          x: 450,
          y: 50,
          elements: [
            {
              id: 5,
              type: 'image',
              x: 10,
              y: 10,
              width: 180,
              height: 180,
              content: 'Service Image',
              imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              borderRadius: 10,
              border: 'none',
            }
          ]
        }
      ]
    }
  ]
};

// ElementRenderer Component
const ElementRenderer = ({ element }) => {
  const baseStyle = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    margin: `${element.margin?.top || 0}px ${element.margin?.right || 0}px ${element.margin?.bottom || 0}px ${element.margin?.left || 0}px`,
    padding: `${element.padding?.top || 5}px ${element.padding?.right || 10}px ${element.padding?.bottom || 5}px ${element.padding?.left || 10}px`,
    fontSize: `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    color: element.color,
    backgroundColor: element.backgroundColor,
    borderRadius: `${element.borderRadius}px`,
    border: element.border,
    boxSizing: 'border-box',
  };

  switch (element.type) {
    case 'text':
      return (
        <div style={baseStyle} className="flex items-center justify-center font-bold">
          {element.content}
        </div>
      );
    case 'paragraph':
      return (
        <div style={baseStyle} dangerouslySetInnerHTML={{ __html: element.content }} />
      );
    case 'button':
      return (
        <button
          style={baseStyle}
          className="hover:opacity-80 transition-opacity cursor-pointer font-semibold shadow-lg"
          onClick={() => alert('Button clicked!')}
        >
          {element.content}
        </button>
      );
    case 'image':
      return (
        <div style={baseStyle}>
          {element.imageUrl ? (
            <img
              src={element.imageUrl}
              alt={element.content}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: `${element.borderRadius}px`,
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
      );
    default:
      return <div style={baseStyle}>Unknown Element</div>;
  }
};

// RndRenderer Component
const RndRenderer = ({ box }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${box.x}px`,
        top: `${box.y}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
      }}
    >
      {box.elements?.map((element) => (
        <ElementRenderer key={element.id} element={element} />
      ))}
    </div>
  );
};

// Header Component
const Header = ({ isMenuOpen, setIsMenuOpen }) => (
  <header className="bg-white shadow-lg sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center" 
            alt="Logo" 
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-2xl font-bold text-gray-800">YourBrand</span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </div>
    
    {isMenuOpen && (
      <div className="md:hidden bg-white border-t">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Home</a>
          <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">About</a>
          <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Services</a>
          <a href="#" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Contact</a>
        </div>
      </div>
    )}
  </header>
);

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">YourBrand</h3>
          <p className="text-gray-400 mb-4">
            Creating amazing digital experiences for businesses worldwide.
          </p>
          <div className="flex space-x-4">
            <FaFacebook size={20} className="text-gray-400 hover:text-white cursor-pointer" />
            <FaTwitter size={20} className="text-gray-400 hover:text-white cursor-pointer" />
            <FaInstagram size={20} className="text-gray-400 hover:text-white cursor-pointer" />
            <FaLinkedin size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Services</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Portfolio</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Services</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">Web Design</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Development</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Marketing</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Consulting</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <FaEnvelope size={16} className="mr-2 text-gray-400" />
              <span className="text-gray-400">hello@yourbrand.com</span>
            </div>
            <div className="flex items-center">
              <FaPhone size={16} className="mr-2 text-gray-400" />
              <span className="text-gray-400">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <FaMapPin size={16} className="mr-2 text-gray-400" />
              <span className="text-gray-400">New York, NY</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 YourBrand. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Main Landing Page Component
export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const parents = mockStoreData.parents;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="relative">
        {parents.map((parent) => (
          <div
            key={parent.id}
            style={{
              height: `${parent.size.height}px`,
              background: parent.size.background,
              position: 'relative',
            }}
            className="w-full"
          >
            {parent.rnds.map((box) => (
              <RndRenderer key={box.id} box={box} />
            ))}
          </div>
        ))}
        
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <p className="text-xl text-gray-600">We deliver exceptional results that exceed expectations</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Design</h3>
                <p className="text-gray-600">Modern, clean designs that represent your brand perfectly.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Performance</h3>
                <p className="text-gray-600">Optimized for speed and performance across all devices.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock support to help you succeed.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-xl text-gray-600">Ready to start your project? Contact us today!</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => alert('Message sent! (Demo)')}
                  className="md:col-span-2 bg-blue-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}