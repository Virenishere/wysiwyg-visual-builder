'use client';
import { useState } from 'react';
import { FiCode, FiLayers } from 'react-icons/fi';

export default function CssStylesPanel({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const [activeTab, setActiveTab] = useState('classes');

  const handleClassChange = (e) => {
    updateElement(parentId, boxId, elementId, {
      customClassName: e.target.value,
    });
  };

  const handleCssChange = (e) => {
    updateElement(parentId, boxId, elementId, {
      customCss: e.target.value,
    });
  };

  const handleInlineStyleChange = (property, value) => {
    const currentStyles = selectedElement.inlineStyles || {};
    updateElement(parentId, boxId, elementId, {
      inlineStyles: {
        ...currentStyles,
        [property]: value,
      },
    });
  };

  const commonAnimations = [
    {
      name: 'Fade In',
      css: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
    },
    {
      name: 'Slide In',
      css: '@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }',
    },
    {
      name: 'Bounce',
      css: '@keyframes bounce { 0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); } 40%, 43% { transform: translate3d(0, -30px, 0); } 70% { transform: translate3d(0, -15px, 0); } 90% { transform: translate3d(0,-4px,0); } }',
    },
    {
      name: 'Pulse',
      css: '@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }',
    },
    {
      name: 'Rotate',
      css: '@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
          <FiCode className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          CSS Styles & Animation
        </h4>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
            activeTab === 'classes'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Classes
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
            activeTab === 'css'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Custom CSS
        </button>
        <button
          onClick={() => setActiveTab('inline')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
            activeTab === 'inline'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Inline Styles
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'classes' && (
          <>
            {/* CSS Classes */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                CSS Classes
              </label>
              <input
                type="text"
                value={selectedElement.customClassName || ''}
                onChange={handleClassChange}
                className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm"
                placeholder="e.g., my-custom-class hover:scale-105"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add multiple classes separated by spaces
              </p>
            </div>

            {/* Quick Animation Classes */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quick Animations
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    handleClassChange({
                      target: {
                        value:
                          (selectedElement.customClassName || '') +
                          ' animate-pulse',
                      },
                    })
                  }
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50"
                >
                  Pulse
                </button>
                <button
                  onClick={() =>
                    handleClassChange({
                      target: {
                        value:
                          (selectedElement.customClassName || '') +
                          ' animate-bounce',
                      },
                    })
                  }
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50"
                >
                  Bounce
                </button>
                <button
                  onClick={() =>
                    handleClassChange({
                      target: {
                        value:
                          (selectedElement.customClassName || '') +
                          ' animate-spin',
                      },
                    })
                  }
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50"
                >
                  Spin
                </button>
                <button
                  onClick={() =>
                    handleClassChange({
                      target: {
                        value:
                          (selectedElement.customClassName || '') +
                          ' hover:scale-110',
                      },
                    })
                  }
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50"
                >
                  Hover Scale
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'css' && (
          <>
            {/* Custom CSS */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Custom CSS
              </label>
              <textarea
                value={selectedElement.customCss || ''}
                onChange={handleCssChange}
                className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-mono"
                rows="6"
                placeholder={`.element-${elementId} {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
}

.element-${elementId}:hover {
  transform: scale(1.05);
}`}
              />
            </div>

            {/* Animation Presets */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Animation Presets
              </label>
              <div className="space-y-2">
                {commonAnimations.map((animation, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const currentCss = selectedElement.customCss || '';
                      const newCss =
                        currentCss +
                        '\n\n' +
                        animation.css +
                        `\n.element-${elementId} { animation: ${animation.name.toLowerCase().replace(' ', '')} 2s infinite; }`;
                      handleCssChange({ target: { value: newCss } });
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 text-left"
                  >
                    Add {animation.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'inline' && (
          <>
            {/* Common Inline Styles */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quick Styles
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600">Box Shadow</label>
                  <select
                    onChange={(e) =>
                      handleInlineStyleChange('boxShadow', e.target.value)
                    }
                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                  >
                    <option value="">None</option>
                    <option value="0 2px 4px rgba(0,0,0,0.1)">Small</option>
                    <option value="0 4px 8px rgba(0,0,0,0.15)">Medium</option>
                    <option value="0 8px 16px rgba(0,0,0,0.2)">Large</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Border Radius</label>
                  <input
                    type="number"
                    placeholder="px"
                    onChange={(e) =>
                      handleInlineStyleChange(
                        'borderRadius',
                        e.target.value + 'px'
                      )
                    }
                    className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Background</label>
                  <input
                    type="color"
                    onChange={(e) =>
                      handleInlineStyleChange('backgroundColor', e.target.value)
                    }
                    className="w-full h-8 bg-white border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Text Color</label>
                  <input
                    type="color"
                    onChange={(e) =>
                      handleInlineStyleChange('color', e.target.value)
                    }
                    className="w-full h-8 bg-white border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Custom Inline Style */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Custom Inline Styles
              </label>
              <div className="space-y-2">
                {Object.entries(selectedElement.inlineStyles || {}).map(
                  ([property, value], index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={property}
                        onChange={(e) => {
                          const newStyles = { ...selectedElement.inlineStyles };
                          delete newStyles[property];
                          newStyles[e.target.value] = value;
                          updateElement(parentId, boxId, elementId, {
                            inlineStyles: newStyles,
                          });
                        }}
                        className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                        placeholder="property"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleInlineStyleChange(property, e.target.value)
                        }
                        className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs"
                        placeholder="value"
                      />
                      <button
                        onClick={() => {
                          const newStyles = { ...selectedElement.inlineStyles };
                          delete newStyles[property];
                          updateElement(parentId, boxId, elementId, {
                            inlineStyles: newStyles,
                          });
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
                <button
                  onClick={() =>
                    handleInlineStyleChange('newProperty', 'newValue')
                  }
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600"
                >
                  Add Style Property
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
