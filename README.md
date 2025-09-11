# 🎨 React WYSIWYG Visual Builder

A powerful, intuitive drag-and-drop visual website builder built with React, featuring nested resizable elements, rich text editing, and real-time visual editing capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![NextJs](https://img.shields.io/badge/Nextjs-15+-3178C6.svg)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

## ✨ Features

### 🎯 Core Functionality

- **Drag & Drop Interface**: Intuitive visual builder with real-time editing
- **Nested Elements**: Create complex layouts with elements inside resizable containers
- **Multi-Level Hierarchy**: Parent containers → RND boxes → Interactive elements
- **Real-time Preview**: See changes instantly as you build

### 🧱 Element Types

- **📝 Text Elements**: Inline editable text with typography controls
- **📄 Rich Text/Paragraphs**: Full WYSIWYG editor powered by TinyMCE
- **🔘 Interactive Buttons**: Customizable buttons with click handlers
- **🖼️ Image Elements**: Drag-and-drop image upload with resizing capabilities
- **📦 Container Boxes**: Resizable containers for organizing elements

### 🎨 Advanced Styling

- **Spacing Controls**: Individual margin and padding adjustments for all 4 sides
- **Typography System**: Font family, size, color, and weight controls
- **Color Management**: Background colors, gradients, and transparency options
- **Border System**: Border radius, styles, and width controls
- **Responsive Design**: Elements adapt and maintain proportions

### 🛠️ Professional Tools

- **Visual Properties Panel**: Comprehensive styling controls
- **Element Inspector**: Select and edit any element's properties
- **Size Indicators**: Real-time size tooltips during resizing
- **Nested Selection**: Click-through selection for complex layouts
- **Undo/Redo Support**: (Coming soon)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- React 18+
- Nextjs 15+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/react-wysiwyg-builder.git

# Navigate to the project directory
cd react-wysiwyg-builder

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Required Dependencies

```json
{
  "dependencies": {
    "@tinymce/tinymce-react": "^4.3.2",
    "react-rnd": "^10.4.1",
    "zustand": "^4.4.1",
    "react-icons": "^4.11.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## 🏗️ Architecture

### State Management

The application uses **Zustand** for lightweight, scalable state management:

```javascript
// Store Structure
{
  parents: [
    // Top-level containers
    {
      id: 1,
      size: { height: 300, background: '#ffffff' },
      rnds: [
        // Resizable & draggable boxes
        {
          id: 1,
          width: 150,
          height: 150,
          x: 0,
          y: 0,
          elements: [
            // Interactive elements inside boxes
            {
              id: 1,
              type: 'text',
              content: 'Sample Text',
              styling: { fontSize: 16, color: '#000000' },
            },
          ],
        },
      ],
    },
  ];
}
```

### Component Structure

```
src/
├── components/
│   ├── DivComponent.jsx          # Main canvas/workspace
│   ├── DraggableElement.jsx      # Individual element renderer
│   ├── RichTextEditor.jsx        # TinyMCE integration
│   ├── DivBoxMaker.jsx           # Container management
│   ├── ElementPropertiesPanel.jsx # Styling controls
│   ├── PropertiesTab.jsx         # Right sidebar panel
│   └── SizeToaster.jsx           # Size indicator tooltips
├── store/
│   └── UseDivStore.js            # Zustand state management
├── utils/
│   └── styles.js                 # Shared styling utilities
└── pages/
    └── HomePage.jsx              # Main application layout
```

## 🎯 Usage Examples

### Creating a Simple Layout

```javascript
// 1. Add a parent container
addParent();

// 2. Add a resizable box inside the container
addRnd(parentId);

// 3. Add elements inside the box
addElement(parentId, boxId, 'text'); // Add text
addElement(parentId, boxId, 'image'); // Add image
addElement(parentId, boxId, 'button'); // Add button
```

### Styling Elements

```javascript
// Update element properties
updateElement(parentId, boxId, elementId, {
  fontSize: 18,
  color: '#ff0000',
  margin: { top: 10, right: 5, bottom: 10, left: 5 },
  padding: { top: 8, right: 12, bottom: 8, left: 12 },
});
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports

- Use the issue tracker to report bugs
- Include steps to reproduce
- Provide browser/OS information
- Add screenshots if applicable

### 💡 Feature Requests

- Check existing issues first
- Provide detailed use cases
- Explain the expected behavior
- Consider implementation complexity

### 🔧 Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### 🎯 Areas for Contribution

#### 🚀 High Priority

- [ ] **Undo/Redo System** - Implement command pattern for action history
- [ ] **Export Functionality** - Export designs as HTML/CSS/React components
- [ ] **Template System** - Pre-built templates and component library
- [ ] **Mobile Responsiveness** - Better mobile editing experience

#### 🔥 Medium Priority

- [ ] **Advanced Styling** - Box shadows, gradients, animations
- [ ] **Grid System** - Snap-to-grid and alignment guides
- [ ] **Layer Management** - Z-index controls and layer panels
- [ ] **Component Nesting** - Nested RND boxes within elements

#### 💡 Nice to Have

- [ ] **Keyboard Shortcuts** - Power user keyboard navigation
- [ ] **Dark Mode** - Dark theme for the builder interface
- [ ] **Collaboration** - Real-time collaborative editing
- [ ] **Version History** - Save and restore different versions

#### 🧩 Element Types to Add

- [ ] **Form Elements** - Input fields, selectors, checkboxes
- [ ] **Media Elements** - Video players, audio players
- [ ] **Chart Elements** - Basic charts and graphs
- [ ] **Social Elements** - Social media embeds
- [ ] **Navigation Elements** - Menus, breadcrumbs, pagination

#### 🏗️ Architecture Improvements

- [ ] **TypeScript Migration** - Convert codebase to TypeScript
- [ ] **Testing Suite** - Unit and integration tests
- [ ] **Performance Optimization** - Virtualization for large canvases
- [ ] **Plugin System** - Extensible plugin architecture

### 📋 Development Guidelines

#### Code Style

- Use functional components with hooks
- Follow ESLint configuration
- Use descriptive variable names
- Add JSDoc comments for complex functions

#### State Management

- Keep Zustand actions pure and simple
- Use immutable updates
- Separate business logic from UI logic

#### Component Guidelines

- Keep components focused and single-purpose
- Use prop-types or TypeScript for type safety
- Handle loading and error states appropriately
- Make components accessible (WCAG guidelines)

#### Performance

- Use React.memo for expensive renders
- Implement proper key props for lists
- Avoid inline functions in render methods
- Use useCallback and useMemo when appropriate

## 📚 API Reference

### Store Actions

#### Parent Management

```javascript
addParent(); // Add new parent container
updateParentSize(parentId, size); // Update container dimensions
setSelectedParent(parentId); // Select active parent
```

#### RND Box Management

```javascript
addRnd(parentId); // Add resizable box
updateRnd(parentId, boxId, updates); // Update box properties
removeRnd(parentId, boxId); // Delete box
setSelectedBox(boxId); // Select active box
```

#### Element Management

```javascript
addElement(parentId, boxId, type); // Add new element
updateElement(parentId, boxId, elementId, props); // Update element
removeElement(parentId, boxId, elementId); // Delete element
setSelectedElement(elementId); // Select active element
```

## 🔧 Configuration

### TinyMCE Setup

For production use, obtain a TinyMCE API key:

```javascript
// In RichTextEditor.jsx
init={{
  apiKey: 'your-tinymce-api-key',
  // ... other config
}}
```

### Custom Styling

Modify `utils/styles.js` for global styling:

```javascript
export const parentBoundary = {
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  margin: '10px',
  // Add your custom styles
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React RND** - For the drag and resize functionality
- **TinyMCE** - For the rich text editing capabilities
- **Zustand** - For lightweight state management
- **React Icons** - For the beautiful icon set
- **All Contributors** - Thanks to everyone who contributes to this project!

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/react-wysiwyg-builder/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/react-wysiwyg-builder/discussions)
- 📧 **Email**: your.email@example.com
- 💬 **Discord**: [Join our community](https://discord.gg/your-invite)

## 🗺️ Roadmap

### v1.1.0 - Enhanced Editing

- [ ] Undo/Redo system
- [ ] Copy/paste elements
- [ ] Multi-select elements
- [ ] Alignment tools

### v1.2.0 - Export & Templates

- [ ] HTML/CSS export
- [ ] React component export
- [ ] Template library
- [ ] Save/load projects

### v2.0.0 - Advanced Features

- [ ] Plugin system
- [ ] Real-time collaboration
- [ ] Mobile app companion
- [ ] Cloud storage integration

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ by the open source community
