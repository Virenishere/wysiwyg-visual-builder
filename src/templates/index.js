// templates/index.js
import { landingPageTemplate } from './landing.js';
import { aboutPageTemplate } from './about.js';
import { contactPageTemplate } from './contact.js';
import { servicesPageTemplate } from './services.js';

// Quick additional templates
const testimonialPageTemplate = {
  id: 'testimonial',
  name: 'Testimonials',
  description: 'Customer testimonials and reviews page',
  thumbnail:
    'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=200&h=150&fit=crop',
  parents: [
    {
      size: {
        height: 500,
        background: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
      },
      rnds: [
        {
          width: 500,
          height: 150,
          x: 150,
          y: 175,
          elements: [
            {
              type: 'text',
              x: 20,
              y: 20,
              width: 460,
              height: 60,
              content: 'What Our Clients Say',
              fontSize: 36,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 10, right: 20, bottom: 10, left: 20 },
              borderRadius: 0,
              border: 'none',
            },
            {
              type: 'text',
              x: 20,
              y: 90,
              width: 460,
              height: 40,
              content: 'Real feedback from our satisfied customers',
              fontSize: 18,
              fontFamily: 'Arial, sans-serif',
              color: '#ffe8f0',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 20, bottom: 5, left: 20 },
              borderRadius: 0,
              border: 'none',
            },
          ],
        },
      ],
    },
    {
      size: { height: 600, background: '#ffffff' },
      rnds: [
        // Testimonial 1
        {
          width: 300,
          height: 200,
          x: 50,
          y: 50,
          elements: [
            {
              type: 'paragraph',
              x: 10,
              y: 10,
              width: 280,
              height: 100,
              content:
                '<p style="font-style: italic; line-height: 1.6; font-size: 16px;">"Exceptional service and outstanding results. They exceeded all our expectations and delivered exactly what we needed."</p>',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: '#f8f9fa',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 15, right: 15, bottom: 15, left: 15 },
              borderRadius: 10,
              border: '1px solid #e0e0e0',
            },
            {
              type: 'text',
              x: 10,
              y: 130,
              width: 280,
              height: 30,
              content: '⭐⭐⭐⭐⭐ Sarah Johnson, CEO',
              fontSize: 14,
              fontFamily: 'Arial, sans-serif',
              color: '#666666',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
          ],
        },
        // Testimonial 2
        {
          width: 300,
          height: 200,
          x: 400,
          y: 50,
          elements: [
            {
              type: 'paragraph',
              x: 10,
              y: 10,
              width: 280,
              height: 100,
              content:
                '<p style="font-style: italic; line-height: 1.6; font-size: 16px;">"Professional team with great communication. The project was completed on time and within budget."</p>',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: '#f8f9fa',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 15, right: 15, bottom: 15, left: 15 },
              borderRadius: 10,
              border: '1px solid #e0e0e0',
            },
            {
              type: 'text',
              x: 10,
              y: 130,
              width: 280,
              height: 30,
              content: '⭐⭐⭐⭐⭐ Mike Chen, CTO',
              fontSize: 14,
              fontFamily: 'Arial, sans-serif',
              color: '#666666',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
          ],
        },
      ],
    },
  ],
};

const productsPageTemplate = {
  id: 'products',
  name: 'Products',
  description: 'Product showcase and catalog page',
  thumbnail:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop',
  parents: [
    {
      size: {
        height: 450,
        background: 'linear-gradient(135deg, #00cec9 0%, #55a3ff 100%)',
      },
      rnds: [
        {
          width: 500,
          height: 150,
          x: 150,
          y: 150,
          elements: [
            {
              type: 'text',
              x: 20,
              y: 20,
              width: 460,
              height: 60,
              content: 'Our Products',
              fontSize: 36,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 10, right: 20, bottom: 10, left: 20 },
              borderRadius: 0,
              border: 'none',
            },
            {
              type: 'text',
              x: 20,
              y: 90,
              width: 460,
              height: 40,
              content: 'Innovative solutions designed for success',
              fontSize: 18,
              fontFamily: 'Arial, sans-serif',
              color: '#e8f8ff',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 20, bottom: 5, left: 20 },
              borderRadius: 0,
              border: 'none',
            },
          ],
        },
      ],
    },
    {
      size: { height: 500, background: '#ffffff' },
      rnds: [
        // Product 1
        {
          width: 250,
          height: 350,
          x: 80,
          y: 75,
          elements: [
            {
              type: 'image',
              x: 10,
              y: 10,
              width: 230,
              height: 180,
              content: 'Product 1',
              imageUrl:
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              borderRadius: 8,
              border: 'none',
            },
            {
              type: 'text',
              x: 10,
              y: 200,
              width: 230,
              height: 30,
              content: 'Premium Headphones',
              fontSize: 20,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
            {
              type: 'text',
              x: 10,
              y: 240,
              width: 230,
              height: 25,
              content: '$299.99',
              fontSize: 18,
              fontFamily: 'Arial, sans-serif',
              color: '#00cec9',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
            {
              type: 'paragraph',
              x: 10,
              y: 275,
              width: 230,
              height: 50,
              content:
                '<p style="line-height: 1.4;">High-quality wireless headphones with noise cancellation and premium sound.</p>',
              fontSize: 12,
              fontFamily: 'Arial, sans-serif',
              color: '#666666',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
          ],
        },
        // Product 2
        {
          width: 250,
          height: 350,
          x: 375,
          y: 75,
          elements: [
            {
              type: 'image',
              x: 10,
              y: 10,
              width: 230,
              height: 180,
              content: 'Product 2',
              imageUrl:
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              borderRadius: 8,
              border: 'none',
            },
            {
              type: 'text',
              x: 10,
              y: 200,
              width: 230,
              height: 30,
              content: 'Smart Watch Pro',
              fontSize: 20,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
            {
              type: 'text',
              x: 10,
              y: 240,
              width: 230,
              height: 25,
              content: '$199.99',
              fontSize: 18,
              fontFamily: 'Arial, sans-serif',
              color: '#00cec9',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
            {
              type: 'paragraph',
              x: 10,
              y: 275,
              width: 230,
              height: 50,
              content:
                '<p style="line-height: 1.4;">Advanced smartwatch with health tracking and long battery life.</p>',
              fontSize: 12,
              fontFamily: 'Arial, sans-serif',
              color: '#666666',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
          ],
        },
      ],
    },
  ],
};

// Template Registry
export const templateRegistry = {
  landing: landingPageTemplate,
  about: aboutPageTemplate,
  contact: contactPageTemplate,
  services: servicesPageTemplate,
  testimonial: testimonialPageTemplate,
  products: productsPageTemplate,
};

// Get all templates as array
export const getAllTemplates = () => {
  return Object.values(templateRegistry);
};

// Get template by ID
export const getTemplateById = (id) => {
  return templateRegistry[id] || null;
};

// Template categories
export const templateCategories = {
  business: ['landing', 'about', 'services'],
  ecommerce: ['products'],
  marketing: ['testimonial', 'contact'],
};

export default templateRegistry;
