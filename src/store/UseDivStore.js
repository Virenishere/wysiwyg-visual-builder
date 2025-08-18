import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

let nextParentId = 1;
let nextBoxId = 1;
let nextElementId = 1;

// Landing page template data
const landingPageTemplate = {
  parents: [
    // Hero Section
    {
      id: nextParentId++,
      size: { height: 600, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      rnds: [
        {
          id: nextBoxId++,
          width: 500,
          height: 250,
          x: 100,
          y: 150,
          elements: [
            {
              id: nextElementId++,
              type: 'text',
              x: 20,
              y: 20,
              width: 460,
              height: 80,
              content: 'Welcome to Our Amazing Website',
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
              id: nextElementId++,
              type: 'text',
              x: 20,
              y: 110,
              width: 460,
              height: 40,
              content: 'Transform your business with our innovative solutions',
              fontSize: 18,
              fontFamily: 'Arial, sans-serif',
              color: '#e8e8e8',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 20, bottom: 5, left: 20 },
              borderRadius: 0,
              border: 'none',
            },
            {
              id: nextElementId++,
              type: 'button',
              x: 20,
              y: 170,
              width: 160,
              height: 50,
              content: 'Get Started Today',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              backgroundColor: '#ff6b6b',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 12, right: 24, bottom: 12, left: 24 },
              borderRadius: 25,
              border: 'none',
            },
            {
              id: nextElementId++,
              type: 'button',
              x: 200,
              y: 170,
              width: 140,
              height: 50,
              content: 'Learn More',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 12, right: 24, bottom: 12, left: 24 },
              borderRadius: 25,
              border: '2px solid #ffffff',
            }
          ]
        }
      ]
    },
    // About/Services Section
    {
      id: nextParentId++,
      size: { height: 500, background: "#f8f9fa" },
      rnds: [
        // Main content box
        {
          id: nextBoxId++,
          width: 400,
          height: 200,
          x: 50,
          y: 80,
          elements: [
            {
              id: nextElementId++,
              type: 'text',
              x: 10,
              y: 10,
              width: 380,
              height: 50,
              content: 'About Our Services',
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
              id: nextElementId++,
              type: 'paragraph',
              x: 10,
              y: 70,
              width: 380,
              height: 120,
              content: '<p style="line-height: 1.6;">We provide exceptional services tailored to your specific needs. Our team of experienced professionals is dedicated to delivering high-quality results that exceed expectations and drive your business forward.</p>',
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
        // Image box
        {
          id: nextBoxId++,
          width: 250,
          height: 250,
          x: 500,
          y: 80,
          elements: [
            {
              id: nextElementId++,
              type: 'image',
              x: 10,
              y: 10,
              width: 230,
              height: 230,
              content: 'Service Image',
              imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              borderRadius: 15,
              border: 'none',
            }
          ]
        },
        // Features boxes
        {
          id: nextBoxId++,
          width: 180,
          height: 120,
          x: 50,
          y: 320,
          elements: [
            {
              id: nextElementId++,
              type: 'text',
              x: 10,
              y: 10,
              width: 160,
              height: 30,
              content: '🎯 Professional Design',
              fontSize: 14,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: '#ffffff',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 8, right: 10, bottom: 8, left: 10 },
              borderRadius: 8,
              border: '1px solid #e0e0e0',
            },
            {
              id: nextElementId++,
              type: 'paragraph',
              x: 10,
              y: 50,
              width: 160,
              height: 60,
              content: '<p style="font-size: 12px; line-height: 1.4;">Modern, clean designs that represent your brand perfectly.</p>',
              fontSize: 12,
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
          id: nextBoxId++,
          width: 180,
          height: 120,
          x: 290,
          y: 320,
          elements: [
            {
              id: nextElementId++,
              type: 'text',
              x: 10,
              y: 10,
              width: 160,
              height: 30,
              content: '⚡ Fast Performance',
              fontSize: 14,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: '#ffffff',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 8, right: 10, bottom: 8, left: 10 },
              borderRadius: 8,
              border: '1px solid #e0e0e0',
            },
            {
              id: nextElementId++,
              type: 'paragraph',
              x: 10,
              y: 50,
              width: 160,
              height: 60,
              content: '<p style="font-size: 12px; line-height: 1.4;">Optimized for speed and performance across all devices.</p>',
              fontSize: 12,
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
          id: nextBoxId++,
          width: 180,
          height: 120,
          x: 530,
          y: 320,
          elements: [
            {
              id: nextElementId++,
              type: 'text',
              x: 10,
              y: 10,
              width: 160,
              height: 30,
              content: '🛠️ 24/7 Support',
              fontSize: 14,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: '#ffffff',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 8, right: 10, bottom: 8, left: 10 },
              borderRadius: 8,
              border: '1px solid #e0e0e0',
            },
            {
              id: nextElementId++,
              type: 'paragraph',
              x: 10,
              y: 50,
              width: 160,
              height: 60,
              content: '<p style="font-size: 12px; line-height: 1.4;">Round-the-clock support to help you succeed.</p>',
              fontSize: 12,
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
    },
    // Contact Section
    {
      id: nextParentId++,
      size: { height: 400, background: "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)" },
      rnds: [
        {
          id: nextBoxId++,
          width: 500,
          height: 300,
          x: 150,
          y: 50,
          elements: [
            {
              id: nextElementId++,
              type: 'text',
              x: 20,
              y: 20,
              width: 460,
              height: 50,
              content: 'Get In Touch',
              fontSize: 32,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 10, right: 20, bottom: 10, left: 20 },
              borderRadius: 0,
              border: 'none',
            },
            {
              id: nextElementId++,
              type: 'text',
              x: 20,
              y: 80,
              width: 460,
              height: 40,
              content: 'Ready to start your project? Contact us today!',
              fontSize: 18,
              fontFamily: 'Arial, sans-serif',
              color: '#f0f0f0',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 20, bottom: 5, left: 20 },
              borderRadius: 0,
              border: 'none',
            },
            {
              id: nextElementId++,
              type: 'button',
              x: 20,
              y: 140,
              width: 140,
              height: 45,
              content: 'Contact Us',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              color: '#333333',
              backgroundColor: '#ffffff',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 10, right: 20, bottom: 10, left: 20 },
              borderRadius: 25,
              border: 'none',
            },
            {
              id: nextElementId++,
              type: 'text',
              x: 20,
              y: 200,
              width: 200,
              height: 30,
              content: '📧 hello@yourbrand.com',
              fontSize: 14,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              backgroundColor: 'transparent',
              margin: { top: 0, right: 0, bottom: 0, left: 0 },
              padding: { top: 5, right: 10, bottom: 5, left: 10 },
              borderRadius: 0,
              border: 'none',
            },
            {
              id: nextElementId++,
              type: 'text',
              x: 20,
              y: 240,
              width: 200,
              height: 30,
              content: '📞 +1 (555) 123-4567',
              fontSize: 14,
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
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

const useDivStore = create(
  persist(
    (set, get) => ({
      parents: [
        {
          id: nextParentId++,
          size: { height: 300, background: "#ffffff" },
          rnds: [{ 
            id: nextBoxId++, 
            width: 150, 
            height: 150, 
            x: 0, 
            y: 0,
            elements: []
          }],
        },
      ],
      selectedParentId: null,
      selectedBoxId: null,
      selectedElementId: null,
      isResizing: false,

      // 🔹 Load Landing Page Template
      loadLandingPageTemplate: () =>
        set((state) => {
          // Reset IDs to avoid conflicts
          const resetIds = (parents) => {
            return parents.map(parent => ({
              ...parent,
              id: nextParentId++,
              rnds: parent.rnds.map(rnd => ({
                ...rnd,
                id: nextBoxId++,
                elements: rnd.elements.map(element => ({
                  ...element,
                  id: nextElementId++
                }))
              }))
            }));
          };
          
          return {
            parents: resetIds(landingPageTemplate.parents),
            selectedParentId: null,
            selectedBoxId: null,
            selectedElementId: null,
          };
        }),

      // 🔹 Reset to default
      resetToDefault: () =>
        set(() => ({
          parents: [
            {
              id: nextParentId++,
              size: { height: 300, background: "#ffffff" },
              rnds: [{ 
                id: nextBoxId++, 
                width: 150, 
                height: 150, 
                x: 0, 
                y: 0,
                elements: []
              }],
            },
          ],
          selectedParentId: null,
          selectedBoxId: null,
          selectedElementId: null,
        })),

      // 🔹 Parent actions
      addParent: () =>
        set((state) => ({
          parents: [
            ...state.parents,
            {
              id: nextParentId++,
              size: { height: 300, background: "#f8f8f8" },
              rnds: [],
            },
          ],
        })),

      updateParentSize: (parentId, size) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId ? { ...p, size: { ...p.size, ...size } } : p
          ),
        })),

      // 🔹 RND actions inside a parent
      addRnd: (parentId) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: [
                    ...p.rnds,
                    { 
                      id: nextBoxId++, 
                      width: 150, 
                      height: 150, 
                      x: 50, 
                      y: 50,
                      elements: []
                    },
                  ],
                }
              : p
          ),
        })),

      updateRnd: (parentId, boxId, updates) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.map((box) =>
                    box.id === boxId ? { ...box, ...updates } : box
                  ),
                }
              : p
          ),
        })),

      removeRnd: (parentId, boxId) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? { ...p, rnds: p.rnds.filter((box) => box.id !== boxId) }
              : p
          ),
        })),

      // 🔹 Element actions inside RND boxes
      addElement: (parentId, boxId, elementType) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.map((box) =>
                    box.id === boxId
                      ? {
                          ...box,
                          elements: [
                            ...box.elements,
                            {
                              id: nextElementId++,
                              type: elementType,
                              x: 10,
                              y: 10,
                              width: elementType === 'text' ? 100 : elementType === 'image' ? 80 : 120,
                              height: elementType === 'text' ? 30 : elementType === 'image' ? 80 : elementType === 'paragraph' ? 60 : 35,
                              content: elementType === 'text' ? 'Sample Text' : 
                                      elementType === 'paragraph' ? '<p>Sample paragraph content</p>' :
                                      elementType === 'button' ? 'Click Me' : '',
                              fontSize: elementType === 'text' ? 16 : 14,
                              fontFamily: 'Arial, sans-serif',
                              color: '#000000',
                              backgroundColor: elementType === 'button' ? '#007bff' : 'transparent',
                              margin: { top: 0, right: 0, bottom: 0, left: 0 },
                              padding: { top: 5, right: 10, bottom: 5, left: 10 },
                              borderRadius: elementType === 'button' ? 5 : 0,
                              border: 'none',
                              imageUrl: null,
                            },
                          ],
                        }
                      : box
                  ),
                }
              : p
          ),
        })),

      updateElement: (parentId, boxId, elementId, updates) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.map((box) =>
                    box.id === boxId
                      ? {
                          ...box,
                          elements: box.elements.map((element) =>
                            element.id === elementId
                              ? { ...element, ...updates }
                              : element
                          ),
                        }
                      : box
                  ),
                }
              : p
          ),
        })),

      removeElement: (parentId, boxId, elementId) =>
        set((state) => ({
          parents: state.parents.map((p) =>
            p.id === parentId
              ? {
                  ...p,
                  rnds: p.rnds.map((box) =>
                    box.id === boxId
                      ? {
                          ...box,
                          elements: box.elements.filter((element) => element.id !== elementId),
                        }
                      : box
                  ),
                }
              : p
          ),
        })),

      setSelectedParent: (id) => set({ selectedParentId: id }),
      setSelectedBox: (id) => set({ selectedBoxId: id }),
      setSelectedElement: (id) => set({ selectedElementId: id }),
      setIsResizing: (status) => set({ isResizing: status }),
    }),
    {
      name: 'div-store', // Name of the storage key in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

export default useDivStore;