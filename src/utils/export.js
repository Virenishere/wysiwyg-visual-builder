import { getResponsiveValue, screenSizes as appScreenSizes } from './screen';

const getElementStyle = (element, screenSize = '4k') => {
  let style = ``;

  // Base positioning and dimensions
  style += `  position: absolute;\n`;
  style += `  left: ${getResponsiveValue(element.x, screenSize) || 0}px;\n`;
  style += `  top: ${getResponsiveValue(element.y, screenSize) || 0}px;\n`;
  style += `  width: ${getResponsiveValue(element.width, screenSize) || 100}px;\n`;
  style += `  height: ${getResponsiveValue(element.height, screenSize) || 30}px;\n`;
  style += `  box-sizing: border-box;\n`;

  // Z-index
  if (element.zIndex !== undefined && element.zIndex !== null)
    style += `  z-index: ${getResponsiveValue(element.zIndex, screenSize)};\n`;

  // Typography
  style += `  font-size: ${getResponsiveValue(element.fontSize, screenSize) || 16}px;\n`;
  style += `  font-family: ${getResponsiveValue(element.fontFamily, screenSize) || 'Arial, sans-serif'};\n`;
  style += `  color: ${getResponsiveValue(element.color, screenSize) || '#000000'};\n`;

  // Text alignment
  if (element.textAlign) {
    style += `  text-align: ${getResponsiveValue(element.textAlign, screenSize)};\n`;
  }

  // Line height
  if (element.lineHeight) {
    style += `  line-height: ${getResponsiveValue(element.lineHeight, screenSize)};\n`;
  }

  // Background and borders
  style += `  background-color: ${getResponsiveValue(element.backgroundColor, screenSize) || 'transparent'};\n`;
  style += `  border-radius: ${getResponsiveValue(element.borderRadius, screenSize) || 0}px;\n`;
  style += `  border: ${getResponsiveValue(element.border, screenSize) || 'none'};\n`;

  // Image URL for image elements
  if (element.type === 'image' && element.imageUrl) {
    style += `  background-image: url(${element.imageUrl});\n`;
    style += `  background-size: ${element.backgroundSize || 'cover'};\n`;
    style += `  background-position: ${element.backgroundPosition || 'center'};\n`;
    style += `  background-repeat: ${element.backgroundRepeat || 'no-repeat'};\n`;
  }

  // Custom styles from element.style object
  if (element.style) {
    Object.entries(element.style).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        style += `  ${cssKey}: ${value};\n`;
      }
    });
  }

  // Custom styles from element.customStyles object
  if (element.customStyles) {
    Object.entries(element.customStyles).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        style += `  ${cssKey}: ${value};\n`;
      }
    });
  }

  // Margin and Padding
  if (element.margin) {
    const marginTop = getResponsiveValue(element.margin.top, screenSize) || 0;
    const marginRight =
      getResponsiveValue(element.margin.right, screenSize) || 0;
    const marginBottom =
      getResponsiveValue(element.margin.bottom, screenSize) || 0;
    const marginLeft = getResponsiveValue(element.margin.left, screenSize) || 0;
    style += `  margin: ${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px;\n`;
  }

  if (element.padding) {
    const paddingTop =
      getResponsiveValue(element.padding.top, screenSize) ||
      (element.type === 'image' ? 0 : 5);
    const paddingRight =
      getResponsiveValue(element.padding.right, screenSize) ||
      (element.type === 'image' ? 0 : 10);
    const paddingBottom =
      getResponsiveValue(element.padding.bottom, screenSize) ||
      (element.type === 'image' ? 0 : 5);
    const paddingLeft =
      getResponsiveValue(element.padding.left, screenSize) ||
      (element.type === 'image' ? 0 : 10);
    style += `  padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;\n`;
  }

  // Type-specific styles
  switch (element.type) {
    case 'text':
      style += `  display: flex;\n`;
      style += `  align-items: center;\n`;
      style += `  justify-content: flex-start;\n`;
      if (getResponsiveValue(element.fontSize, screenSize) > 24) {
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
      if (
        !getResponsiveValue(element.backgroundColor, screenSize) &&
        !getResponsiveValue(element.style?.backgroundColor, screenSize)
      ) {
        style += `  background-color: #f8f9fa;\n`;
      }
      if (
        !getResponsiveValue(element.border, screenSize) &&
        !getResponsiveValue(element.style?.border, screenSize)
      ) {
        style += `  border: 1px solid #e9ecef;\n`;
      }
      if (!getResponsiveValue(element.style?.boxShadow, screenSize)) {
        style += `  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n`;
      }
      break;

    case 'line':
      style += `  padding: 0;\n`;
      if (
        !getResponsiveValue(element.backgroundColor, screenSize) &&
        !getResponsiveValue(element.style?.backgroundColor, screenSize)
      ) {
        style += `  background-color: #000000;\n`;
      }
      if (getResponsiveValue(element.height, screenSize) < 2) {
        style += `  min-height: 2px;\n`;
        style += `  height: 2px;\n`;
      }
      break;

    case 'div':
      if (!getResponsiveValue(element.backgroundColor, screenSize)) {
        style += `  background-color: transparent;\n`;
      }
      if (!getResponsiveValue(element.border, screenSize)) {
        style += `  border: 1px solid #ddd;\n`;
      }
      break;
  }

  // Custom styles from element.style object
  if (element.style) {
    for (const [key, value] of Object.entries(element.style)) {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      style += `  ${cssKey}: ${getResponsiveValue(value, screenSize)};\n`;
    }
  }

  // Custom styles from panel
  if (element.customStyles) {
    for (const [key, value] of Object.entries(element.customStyles)) {
      style += `  ${key}: ${getResponsiveValue(value, screenSize)};\n`;
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
  <img src="${element.imageUrl}" alt="${element.content || 'Image'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: ${getResponsiveValue(element.borderRadius, screenSize) || 0}px; border: ${getResponsiveValue(element.border, screenSize) || 'none'};" />
</div>`;
      } else {
        return `<div class="${className}">
  <div style="width: 100%; height: 100%; background-color: #f0f0f0; border: 2px dashed #ccc; border-radius: ${getResponsiveValue(element.borderRadius, screenSize) || 0}px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #999; font-size: 12px;">
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

    case 'custom-code':
      return (
        element.customHtml || `<div class="${className}">Custom Code</div>`
      );

    default:
      return `<div class="${className}">Unknown Element: ${element.type}</div>`;
  }
};

const generateStyleBlock = (parents, screenSize = '4k') => {
  let css = `<style>\n`;
  css += `body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }\n`;
  css += `* { box-sizing: border-box; }\n`;

  // Add universal hover effects for interactive elements
  css += `.btn-hover:hover { opacity: 0.8; transform: scale(1.05); }\n`;
  css += `.btn-hover:active { transform: scale(0.95); }\n`;
  css += `.btn-hover { transition: all 0.3s ease; }\n`;

  // Collect all keyframes and animations from custom CSS
  let keyframes = '';
  let globalCustomCss = '';

  parents.forEach((parent) => {
    parent.rnds.forEach((box) => {
      // Extract keyframes from box custom CSS
      if (box.customCss) {
        const keyframeRegex = /(@keyframes[\s\S]*?})/g;
        let match;
        while ((match = keyframeRegex.exec(box.customCss)) !== null) {
          keyframes += match[0] + '\n';
        }

        // Extract non-keyframe CSS
        const nonKeyframeCss = box.customCss
          .replace(/@keyframes[\s\S]*?}/g, '')
          .trim();
        if (nonKeyframeCss) {
          globalCustomCss += `/* Box ${box.id} Custom CSS */\n${nonKeyframeCss}\n\n`;
        }
      }

      box.elements.forEach((element) => {
        // Extract keyframes from element custom CSS
        if (element.customCss) {
          const keyframeRegex = /(@keyframes[\s\S]*?})/g;
          let match;
          while ((match = keyframeRegex.exec(element.customCss)) !== null) {
            keyframes += match[0] + '\n';
          }

          // Extract non-keyframe CSS
          const nonKeyframeCss = element.customCss
            .replace(/@keyframes[\s\S]*?}/g, '')
            .trim();
          if (nonKeyframeCss) {
            globalCustomCss += `/* Element ${element.id} Custom CSS */\n${nonKeyframeCss}\n\n`;
          }
        }
      });
    });
  });

  // Add keyframes first
  if (keyframes) {
    css += `\n/* Keyframes */\n`;
    css += keyframes;
    css += `\n`;
  }

  // Add global custom CSS
  if (globalCustomCss) {
    css += `/* Custom CSS */\n`;
    css += globalCustomCss;
  }

  parents.forEach((parent) => {
    css += `#parent-${parent.id} {\n`;
    css += `  width: 100%;\n`;
    css += `  height: ${getResponsiveValue(parent.size.height, screenSize) || 300}px;\n`;

    // Handle background (solid colors and gradients)
    const bgVal =
      typeof parent.size.background === 'object'
        ? getResponsiveValue(parent.size.background, screenSize)
        : parent.size.background;
    const bgStr = bgVal || '#fff';
    if (
      String(bgStr).startsWith('linear') ||
      String(bgStr).startsWith('radial')
    ) {
      css += `  background: ${bgStr};\n`;
    } else {
      css += `  background-color: ${bgStr};\n`;
    }

    // Add background image support with responsive values
    if (parent.backgroundImage) {
      css += `  background-image: url(${getResponsiveValue(parent.backgroundImage, screenSize) || parent.backgroundImage});\n`;
      css += `  background-size: ${getResponsiveValue(parent.backgroundSize, screenSize) || parent.backgroundSize || 'cover'};\n`;
      css += `  background-position: ${getResponsiveValue(parent.backgroundPosition, screenSize) || parent.backgroundPosition || 'center'};\n`;
      css += `  background-repeat: ${getResponsiveValue(parent.backgroundRepeat, screenSize) || parent.backgroundRepeat || 'no-repeat'};\n`;
    }

    css += `  position: relative;\n`;
    css += `  overflow: hidden;\n`;
    css += `}\n`;

    parent.rnds.forEach((box) => {
      css += `#box-${box.id} {\n`;
      css += `  position: absolute;\n`;
      css += `  left: ${getResponsiveValue(box.x, screenSize) || 0}px;\n`;
      css += `  top: ${getResponsiveValue(box.y, screenSize) || 0}px;\n`;
      css += `  width: ${getResponsiveValue(box.width, screenSize) || 150}px;\n`;
      css += `  height: ${getResponsiveValue(box.height, screenSize) || 150}px;\n`;
      css += `}\n`;

      box.elements.forEach((element) => {
        const className = element.customClassName || `element-${element.id}`;

        // Base element styles
        css += `.${className} {\n`;
        css += getElementStyle(element, screenSize);
        css += `}\n`;

        // Add link styles for button elements with links
        if (element.type === 'button' && element.link) {
          css += `.${className} {\n`;
          css += `  text-decoration: none;\n`;
          css += `  display: inline-block;\n`;
          css += `}\n`;
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
  const sortedScreenSizes = Object.entries(appScreenSizes)
    .map(([name, width]) => ({ name, width: parseInt(width) }))
    .filter((screen) => screen.name !== '4k' && !isNaN(screen.width))
    .sort((a, b) => b.width - a.width);

  for (const screen of sortedScreenSizes) {
    const screenSize = screen.name;
    css += `@media (max-width: ${screen.width}px) {\n`;
    parents.forEach((parent) => {
      css += `  #parent-${parent.id} {\n`;
      css += `    height: ${
        getResponsiveValue(parent.size.height, screenSize) || 300
      }px;\n`;

      const bgV =
        typeof parent.size.background === 'object'
          ? getResponsiveValue(parent.size.background, screenSize)
          : parent.size.background;
      if (bgV) {
        if (
          String(bgV).startsWith('linear') ||
          String(bgV).startsWith('radial')
        ) {
          css += `    background: ${bgV};\n`;
        } else {
          css += `    background-color: ${bgV};\n`;
        }
      }

      // Add responsive background image support
      if (parent.backgroundImage) {
        css += `    background-image: url(${getResponsiveValue(parent.backgroundImage, screenSize) || parent.backgroundImage});\n`;
        css += `    background-size: ${getResponsiveValue(parent.backgroundSize, screenSize) || parent.backgroundSize || 'cover'};\n`;
        css += `    background-position: ${getResponsiveValue(parent.backgroundPosition, screenSize) || parent.backgroundPosition || 'center'};\n`;
        css += `    background-repeat: ${getResponsiveValue(parent.backgroundRepeat, screenSize) || parent.backgroundRepeat || 'no-repeat'};\n`;
      }

      css += `  }\n`;

      parent.rnds.forEach((box) => {
        css += `  #box-${box.id} {\n`;
        css += `    left: ${getResponsiveValue(box.x, screenSize) || 0}px;\n`;
        css += `    top: ${getResponsiveValue(box.y, screenSize) || 0}px;\n`;
        css += `    width: ${getResponsiveValue(box.width, screenSize) || 150}px;\n`;
        css += `    height: ${getResponsiveValue(box.height, screenSize) || 150}px;\n`;
        css += `  }\n`;

        box.elements.forEach((element) => {
          const className = element.customClassName || `element-${element.id}`;
          css += `  .${className} {\n`;
          css += getElementStyle(element, screenSize);
          css += `  }\n`;
        });
      });
    });
    css += `}\n`;
  }

  css += `</style>`;
  return css;
};

const generateBoxHtml = (box) => {
  let html = `<div id="box-${box.id}">\n`;

  // Add custom CSS as a style tag if it exists
  if (box.customCss) {
    html += `  <style>\n    #box-${box.id} {\n      ${box.customCss.replace(/\n/g, '\n      ')}\n    }\n  </style>\n`;
  }

  // Add custom HTML if it exists
  if (box.customHtml) {
    html += box.customHtml;
  }

  // Add elements
  box.elements.forEach((element) => {
    html += `  ${generateElementHtml(element)}\n`;
  });

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

export const generateHtmlCss = (parents, screenSize = '4k') => {
  const styleBlock = generateStyleBlock(parents, screenSize);
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
