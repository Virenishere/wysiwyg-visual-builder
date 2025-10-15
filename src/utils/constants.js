// utils/constants.js

// Element Types
export const ELEMENT_TYPES = {
  TEXT: 'text',
  PARAGRAPH: 'paragraph',
  BUTTON: 'button',
  IMAGE: 'image',
};

// Default Dimensions
export const DEFAULT_DIMENSIONS = {
  PARENT_HEIGHT: 300,
  BOX_WIDTH: 150,
  BOX_HEIGHT: 150,
  ELEMENT_SIZES: {
    text: { width: 100, height: 30 },
    paragraph: { width: 200, height: 60 },
    button: { width: 120, height: 35 },
    image: { width: 80, height: 80 },
  },
};

// Color Schemes
export const COLOR_SCHEMES = {
  PRIMARY: {
    blue: '#007bff',
    purple: '#6c5ce7',
    green: '#00b894',
    red: '#e74c3c',
    orange: '#e67e22',
  },
  GRADIENTS: {
    sunset: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ocean: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    forest: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)',
    sunset2: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
    cosmic: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
    warm: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)',
    cool: 'linear-gradient(135deg, #00cec9 0%, #55a3ff 100%)',
  },
};

// Font Families
export const FONT_FAMILIES = [
  'Arial, sans-serif',
  'Times New Roman, serif',
  'Courier New, monospace',
  'Georgia, serif',
  'Verdana, sans-serif',
  'Comic Sans MS, cursive',
  'Impact, sans-serif',
  'Trebuchet MS, sans-serif',
  'Palatino, serif',
  'Garamond, serif',
];

// Template Categories
export const TEMPLATE_CATEGORIES = {
  BUSINESS: 'business',
  ECOMMERCE: 'ecommerce',
  PORTFOLIO: 'portfolio',
  BLOG: 'blog',
  LANDING: 'landing',
};

// Animation Durations
export const ANIMATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Grid Settings
export const GRID = {
  SNAP_SIZE: 10,
  SHOW_GRID: false,
  GRID_COLOR: '#e0e0e0',
};

// Keyboard Shortcuts
export const SHORTCUTS = {
  SAVE: 'Ctrl+S',
  COPY: 'Ctrl+C',
  PASTE: 'Ctrl+V',
  DELETE: 'Delete',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Y',
};

// File Types
export const FILE_TYPES = {
  JSON: 'application/json',
  PNG: 'image/png',
  JPG: 'image/jpeg',
  SVG: 'image/svg+xml',
};

// Validation Rules
export const VALIDATION = {
  MIN_DIMENSIONS: {
    width: 10,
    height: 10,
  },
  MAX_DIMENSIONS: {
    width: 2000,
    height: 2000,
  },
  MIN_FONT_SIZE: 8,
  MAX_FONT_SIZE: 72,
};

// Storage Keys
export const STORAGE_KEYS = {
  DIV_STORE: 'div-store',
  USER_PREFERENCES: 'user-preferences',
  RECENT_TEMPLATES: 'recent-templates',
};

// UI States
export const UI_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  EDITING: 'editing',
  SAVING: 'saving',
  ERROR: 'error',
};

// Export Formats
export const EXPORT_FORMATS = {
  JSON: 'json',
  HTML: 'html',
  CSS: 'css',
  IMAGE: 'image',
};

export const SCREEN_ORDER = [
  '4k',
  'l-laptop',
  'laptop',
  'tablet',
  'mobile',
  'mobile-m',
  'mobile-s',
];

export const initialLayout = {
  parents: [
    {
      id: 1,
      size: { height: 300, background: '#ffffff' },
      rnds: [
        {
          id: 1,
          width: {
            '4k': 150,
            'l-laptop': 150,
            laptop: 150,
            tablet: 150,
            mobile: 150,
            'mobile-m': 150,
            'mobile-s': 150,
          },
          height: {
            '4k': 150,
            'l-laptop': 150,
            laptop: 150,
            tablet: 150,
            mobile: 150,
            'mobile-m': 150,
            'mobile-s': 150,
          },
          x: {
            '4k': 0,
            'l-laptop': 0,
            laptop: 0,
            tablet: 0,
            mobile: 0,
            'mobile-m': 0,
            'mobile-s': 0,
          },
          y: {
            '4k': 0,
            'l-laptop': 0,
            laptop: 0,
            tablet: 0,
            mobile: 0,
            'mobile-m': 0,
            'mobile-s': 0,
          },
          elements: [],
          customHtml: '',
          customCss: '',
        },
      ],
    },
  ],
};

export default {
  ELEMENT_TYPES,
  DEFAULT_DIMENSIONS,
  COLOR_SCHEMES,
  FONT_FAMILIES,
  TEMPLATE_CATEGORIES,
  ANIMATIONS,
  GRID,
  SHORTCUTS,
  FILE_TYPES,
  VALIDATION,
  STORAGE_KEYS,
  UI_STATES,
  EXPORT_FORMATS,
};
