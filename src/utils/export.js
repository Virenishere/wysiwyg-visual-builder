const getElementStyle = (element) => {
  let style = ``;

  // Base positioning and dimensions
  style += `  position: absolute;\n`;
  style += `  left: ${element.x}px;\n`;
  style += `  top: ${element.y}px;\n`;
  style += `  width: ${element.width}px;\n`;
  style += `  height: ${element.height}px;\n`;
  style += `  box-sizing: border-box;\n`;

  // Z-index
  if (element.zIndex) style += `  z-index: ${element.zIndex};\n`;

  // Typography
  style += `  font-size: ${element.fontSize || 16}px;\n`;
  style += `  font-family: ${element.fontFamily || 'Arial, sans-serif'};\n`;
  style += `  color: ${element.color || '#000000'};\n`;

  // Background and borders
  style += `  background-color: ${element.backgroundColor || 'transparent'};\n`;
  style += `  border-radius: ${element.borderRadius || 0}px;\n`;
  style += `  border: ${element.border || 'none'};\n`;

  // Margin and Padding
  if (element.margin) {
    style += `  margin: ${element.margin.top || 0}px ${element.margin.right || 0}px ${element.margin.bottom || 0}px ${element.margin.left || 0}px;\n`;
  }

  if (element.padding) {
    style += `  padding: ${element.padding.top || 5}px ${element.padding.right || 10}px ${element.padding.bottom || 5}px ${element.padding.left || 10}px;\n`;
  }

  // Type-specific styles
  switch (element.type) {
    case 'text':
      style += `  display: flex;\n`;
      style += `  align-items: center;\n`;
      style += `  justify-content: flex-start;\n`;
      if (element.fontSize > 24) {
        style += `  font-weight: bold;\n`;
      }
      break;

    case 'button':
      style += `  cursor: pointer;\n`;
      style += `  transition: all 0.3s ease;\n`;
      style += `  font-weight: 600;\n`;
      style += `  display: flex;\n`;
      style += `  align-items: center;\n`;
      style += `  justify-content: center;\n`;
      break;

    case 'image':
      style += `  padding: 0;\n`;
      break;

    case 'card':
      // Apply card-specific defaults if not set
      if (!element.backgroundColor && !element.style?.backgroundColor) {
        style += `  background-color: #f8f9fa;\n`;
      }
      if (!element.border && !element.style?.border) {
        style += `  border: 1px solid #e9ecef;\n`;
      }
      if (!element.style?.boxShadow) {
        style += `  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n`;
      }
      break;

    case 'line':
      style += `  padding: 0;\n`;
      if (!element.backgroundColor && !element.style?.backgroundColor) {
        style += `  background-color: #000000;\n`;
      }
      if (element.height < 2) {
        style += `  min-height: 2px;\n`;
        style += `  height: 2px;\n`;
      }
      break;

    case 'div':
      if (!element.backgroundColor) {
        style += `  background-color: transparent;\n`;
      }
      if (!element.border) {
        style += `  border: 1px solid #ddd;\n`;
      }
      break;
  }

  // Custom styles from element.style object
  if (element.style) {
    for (const [key, value] of Object.entries(element.style)) {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      style += `  ${cssKey}: ${value};\n`;
    }
  }

  // Custom styles from panel
  if (element.customStyles) {
    for (const [key, value] of Object.entries(element.customStyles)) {
      style += `  ${key}: ${value};\n`;
    }
  }

  return style;
};

const generateElementHtml = (element) => {
  const className = element.customClassName || `element-${element.id}`;

  switch (element.type) {
    case 'text':
      return `<div class="${className}">${element.content || 'Sample Text'}</div>`;

    case 'paragraph':
      return `<div class="${className}">${element.content || '<p>Sample paragraph content</p>'}</div>`;

    case 'button':
      const buttonContent = element.content || 'Click Me';
      if (element.link) {
        return `<a href="${element.link}" class="${className} btn-hover">${buttonContent}</a>`;
      }
      return `<button class="${className} btn-hover">${buttonContent}</button>`;

    case 'image':
      if (element.imageUrl) {
        return `<div class="${className}">
  <img src="${element.imageUrl}" alt="${element.content || 'Image'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: ${element.borderRadius || 0}px; border: ${element.border || 'none'};" />
</div>`;
      } else {
        return `<div class="${className}">
  <div style="width: 100%; height: 100%; background-color: #f0f0f0; border: 2px dashed #ccc; border-radius: ${element.borderRadius || 0}px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #999; font-size: 12px;">
    <span style="font-size: 24px; margin-bottom: 8px;">🖼️</span>
    <span>No Image</span>
  </div>
</div>`;
      }

    case 'card':
      let cardContent = '';
      if (element.content) {
        cardContent = `<div style="padding: 8px; font-size: 12px; color: ${element.color || '#333'}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${element.content}</div>`;
      } else if (element.height <= 30) {
        cardContent = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 10px; color: #999; pointer-events: none;">Card</div>`;
      }
      return `<div class="${className}">${cardContent}</div>`;

    case 'line':
      let lineIndicator = '';
      if (element.height <= 2) {
        lineIndicator = `<div style="position: absolute; top: -15px; left: 0; font-size: 8px; color: #999; pointer-events: none; white-space: nowrap; background: rgba(255,255,255,0.8); padding: 1px 3px; border-radius: 2px; display: ${element.height < 2 ? 'block' : 'none'};">Line (${element.height}px)</div>`;
      }
      return `<div class="${className}">${lineIndicator}</div>`;

    case 'div':
      let divContent = '';
      if (element.content) {
        divContent = `<div style="padding: 4px; font-size: ${element.fontSize || 12}px; color: ${element.color || '#333'};">${element.content}</div>`;
      }
      return `<div class="${className}">${divContent}</div>`;

    default:
      return `<div class="${className}">Unknown Element: ${element.type}</div>`;
  }
};

const generateStyleBlock = (parents) => {
  let css = `<style>\n`;
  css += `body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }\n`;
  css += `* { box-sizing: border-box; }\n`;

  // Add universal hover effects for interactive elements
  css += `.btn-hover:hover { opacity: 0.8; transform: scale(1.05); }\n`;
  css += `.btn-hover:active { transform: scale(0.95); }\n`;
  css += `.btn-hover { transition: all 0.3s ease; }\n`;

  // Add smooth transitions for all elements
  css += `[class*="element-"] { transition: all 0.3s ease; }\n`;

  parents.forEach((parent) => {
    css += `#parent-${parent.id} {\n`;
    css += `  width: 100%;\n`;
    css += `  height: ${parent.size.height}px;\n`;
    css += `  background: ${parent.size.background || '#fff'};\n`;
    css += `  position: relative;\n`;
    css += `  overflow: hidden;\n`;
    css += `}\n`;

    parent.rnds.forEach((box) => {
      css += `#box-${box.id} {\n`;
      css += `  position: absolute;\n`;
      css += `  left: ${box.x}px;\n`;
      css += `  top: ${box.y}px;\n`;
      css += `  width: ${box.width}px;\n`;
      css += `  height: ${box.height}px;\n`;
      css += `}\n`;

      // Add custom CSS for boxes
      if (box.customCss) {
        css += `#box-${box.id} {\n`;
        css += `  ${box.customCss}\n`;
        css += `}\n`;
      }

      box.elements.forEach((element) => {
        const className = element.customClassName || `element-${element.id}`;

        // Base element styles
        css += `.${className} {\n`;
        css += getElementStyle(element);
        css += `}\n`;

        // Add custom CSS for individual elements
        if (element.customCss) {
          // Handle both class-based and direct CSS
          if (
            element.customCss.includes(`.${className}`) ||
            element.customCss.includes(`#${element.id}`)
          ) {
            // Custom CSS already targets the element specifically
            css += `${element.customCss}\n`;
          } else {
            // Apply custom CSS to the element class
            css += `.${className} {\n`;
            css += `  ${element.customCss}\n`;
            css += `}\n`;
          }
        }

        // Add hover effects for buttons and interactive elements
        if (element.type === 'button') {
          css += `.${className}:hover {\n`;
          css += `  opacity: 0.8;\n`;
          css += `  transform: scale(1.05);\n`;
          css += `}\n`;
          css += `.${className}:active {\n`;
          css += `  transform: scale(0.95);\n`;
          css += `}\n`;
        }

        // Add specific hover effects if defined in customStyles
        if (element.customStyles) {
          const hoverStyles = Object.keys(element.customStyles).filter((key) =>
            key.includes('hover')
          );
          if (hoverStyles.length > 0) {
            css += `.${className}:hover {\n`;
            hoverStyles.forEach((hoverKey) => {
              const cssKey = hoverKey
                .replace('hover-', '')
                .replace(/([A-Z])/g, '-$1')
                .toLowerCase();
              css += `  ${cssKey}: ${element.customStyles[hoverKey]};\n`;
            });
            css += `}\n`;
          }
        }
      });
    });
  });

  css += `\n/* Responsive Design */\n`;
  css += `@media (max-width: 768px) {\n`;
  css += `  [class*="parent-"] { overflow-x: auto; }\n`;
  css += `}\n`;

  css += `</style>`;
  return css;
};

const generateBoxHtml = (box) => {
  let html = `<div id="box-${box.id}">\n`;

  // Add custom CSS as a style tag if it exists
  if (box.customCss) {
    html += `  <style>\n    #box-${box.id} {\n      ${box.customCss.replace(/\n/g, '\n      ')}\n    }\n  </style>\n`;
  }

  if (box.customHtml) {
    html += box.customHtml;
  } else {
    box.elements.forEach((element) => {
      html += `  ${generateElementHtml(element)}\n`;

      // Add element-specific custom CSS
      if (element.customCss) {
        const className = element.customClassName || `element-${element.id}`;
        html += `  <style>\n`;
        if (
          element.customCss.includes(`.${className}`) ||
          element.customCss.includes(`#${element.id}`)
        ) {
          html += `    ${element.customCss.replace(/\n/g, '\n    ')}\n`;
        } else {
          html += `    .${className} {\n      ${element.customCss.replace(/\n/g, '\n      ')}\n    }\n`;
        }
        html += `  </style>\n`;
      }
    });
  }

  html += `</div>`;
  return html;
};

const generateParentHtml = (parent) => {
  let html = `<div id="parent-${parent.id}">\n`;
  parent.rnds.forEach((box) => {
    html += `  ${generateBoxHtml(box)}\n`;
  });
  html += `</div>`;
  return html;
};

export const generateHtmlCss = (parents) => {
  const styleBlock = generateStyleBlock(parents);
  let html = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Generated Website</title>\n${styleBlock}\n</head>\n<body>\n`;

  parents.forEach((parent) => {
    html += generateParentHtml(parent);
  });

  html += `\n</body>\n</html>`;
  return { html };
};

export const downloadFile = (filename, content) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
