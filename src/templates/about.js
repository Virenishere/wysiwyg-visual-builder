// templates/about.js
export const aboutPageTemplate = {
  id: 'about',
  name: 'About Us',
  description: 'Professional about page with team, mission, and company story',
  thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop',
  parents: [
    // Hero Section
    {
      size: { height: 500, background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)" },
      rnds: [
        {
          width: 600,
          height: 200,
          x: 100,
          y: 150,
          elements: [
            {
              type: 'text',
              x: 20,
              y: 20,
              width: 560,
              height: 60,
              content: 'About Our Company',
              fontSize: 42,
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
              y: 100,
              width: 560,
              height: 40,
              content: 'Dedicated to excellence and innovation since 2020',
              fontSize: 20,
              fontFamily: 'Arial, sans-serif',
              color: '#e8f4ff',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 20, bottom: 5, left: 20 },
              borderRadius: 0,
              border: 'none',
            }
          ]
        }
      ]
    },
    // Mission Section
    {
      size: { height: 400, background: "#ffffff" },
      rnds: [
        {
          width: 500,
          height: 300,
          x: 50,
          y: 50,
          elements: [
            {
              type: 'text',
              x: 10,
              y: 10,
              width: 480,
              height: 50,
              content: 'Our Mission',
              fontSize: 32,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
            {
              type: 'paragraph',
              x: 10,
              y: 70,
              width: 480,
              height: 150,
              content: '<p style="line-height: 1.8; font-size: 16px;">We believe in creating exceptional digital experiences that make a real difference. Our mission is to help businesses transform their ideas into powerful, user-friendly solutions that drive growth and success.</p><br/><p style="line-height: 1.8; font-size: 16px;">With a focus on innovation, quality, and customer satisfaction, we strive to exceed expectations in every project we undertake.</p>',
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
          width: 200,
          height: 200,
          x: 600,
          y: 100,
          elements: [
            {
              type: 'image',
              x: 10,
              y: 10,
              width: 180,
              height: 180,
              content: 'Mission Image',
              imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              borderRadius: 10,
              border: 'none',
            }
          ]
        }
      ]
    },
    // Team Section
    {
      size: { height: 450, background: "#f8f9fa" },
      rnds: [
        {
          width: 700,
          height: 60,
          x: 50,
          y: 40,
          elements: [
            {
              type: 'text',
              x: 10,
              y: 10,
              width: 680,
              height: 40,
              content: 'Meet Our Team',
              fontSize: 32,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            }
          ]
        },
        // Team Member 1
        {
          width: 200,
          height: 280,
          x: 80,
          y: 120,
          elements: [
            {
              type: 'image',
              x: 10,
              y: 10,
              width: 180,
              height: 150,
              content: 'Team Member',
              imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              borderRadius: 10,
              border: 'none',
            },
            {
              type: 'text',
              x: 10,
              y: 170,
              width: 180,
              height: 30,
              content: 'Sarah Johnson',
              fontSize: 18,
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
              y: 200,
              width: 180,
              height: 25,
              content: 'CEO & Founder',
              fontSize: 14,
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
        // Team Member 2
        {
          width: 200,
          height: 280,
          x: 320,
          y: 120,
          elements: [
            {
              type: 'image',
              x: 10,
              y: 10,
              width: 180,
              height: 150,
              content: 'Team Member',
              imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              borderRadius: 10,
              border: 'none',
            },
            {
              type: 'text',
              x: 10,
              y: 170,
              width: 180,
              height: 30,
              content: 'Mike Chen',
              fontSize: 18,
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
              y: 200,
              width: 180,
              height: 25,
              content: 'Lead Developer',
              fontSize: 14,
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
        // Team Member 3
        {
          width: 200,
          height: 280,
          x: 560,
          y: 120,
          elements: [
            {
              type: 'image',
              x: 10,
              y: 10,
              width: 180,
              height: 150,
              content: 'Team Member',
              imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              borderRadius: 10,
              border: 'none',
            },
            {
              type: 'text',
              x: 10,
              y: 170,
              width: 180,
              height: 30,
              content: 'Emma Davis',
              fontSize: 18,
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
              y: 200,
              width: 180,
              height: 25,
              content: 'Creative Director',
              fontSize: 14,
              fontFamily: 'Arial, sans-serif',
              color: '#666666',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            }
          ]
        }
      ]
    }
  ]
};