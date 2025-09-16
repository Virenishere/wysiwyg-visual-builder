const getElementStyle = (element) => {
  let style = ``;
  style += `  position: absolute;
`;
  style += `  left: ${element.x}px;
`;
  style += `  top: ${element.y}px;
`;
  style += `  width: ${element.width}px;
`;
  style += `  height: ${element.height}px;
`;
  style += `  font-size: ${element.fontSize}px;
`;
  style += `  font-family: ${element.fontFamily};
`;
  style += `  color: ${element.color};
`;
  style += `  background-color: ${element.backgroundColor};
`;
  style += `  margin: ${element.margin.top}px ${element.margin.right}px ${element.margin.bottom}px ${element.margin.left}px;
`;
  style += `  padding: ${element.padding.top}px ${element.padding.right}px ${element.padding.bottom}px ${element.padding.left}px;
`;
  style += `  border-radius: ${element.borderRadius}px;
`;
  style += `  border: ${element.border};
`;
  if (element.customStyles) {
    for (const [key, value] of Object.entries(element.customStyles)) {
      style += `  ${key}: ${value};
`;
    }
  }
  return style;
};

const getBoxStyle = (box) => {
  let style = ``;
  style += `  position: absolute;
`;
  style += `  left: ${box.x}px;
`;
  style += `  top: ${box.y}px;
`;
  style += `  width: ${box.width}px;
`;
  style += `  height: ${box.height}px;
`;
  if (box.customCss) {
    style += `  ${box.customCss}
`;
  }
  return style;
};

const getParentStyle = (parent) => {
  let style = ``;
  style += `  width: 100%;
`;
  style += `  height: ${parent.size.height}px;
`;
  style += `  background: ${parent.size.background || '#fff'};
`;
  style += `  position: relative;
`;
  style += `  overflow: hidden;
`;
  return style;
};

const generateStyleBlock = (parents) => {
  let css = `<style>
`;
  css += `body { margin: 0; }
`;
  parents.forEach((parent) => {
    css += `#parent-${parent.id} {
${getParentStyle(parent)}}
`;
    parent.rnds.forEach((box) => {
      css += `#box-${box.id} {
${getBoxStyle(box)}}
`;
      box.elements.forEach((element) => {
        const className = element.customClassName || `element-${element.id}`;
        css += `.${className} {
${getElementStyle(element)}}
`;
        if (element.customCss) {
          css += `${element.customCss}
`;
        }
      });
    });
  });
  css += `</style>`;
  return css;
};

const generateElementHtml = (element) => {
  const className = element.customClassName || `element-${element.id}`;
  switch (element.type) {
    case 'text':
      return `<div class="${className}">${element.content}</div>`;
    case 'button':
      if (element.link) {
        return `<a href="${element.link}" class="${className}">${element.content}</a>`;
      }
      return `<button class="${className}">${element.content}</button>`;
    case 'image':
      return `<img src="${element.imageUrl}" alt="" class="${className}" />`;
    default:
      return `<div class="${className}"></div>`;
  }
};

const generateBoxHtml = (box) => {
  let html = `<div id="box-${box.id}">
`;
  box.elements.forEach((element) => {
    html += `  ${generateElementHtml(element)}
`;
  });
  html += `</div>`;
  return html;
};

const generateParentHtml = (parent) => {
  let html = `<div id="parent-${parent.id}">
`;
  parent.rnds.forEach((box) => {
    html += `  ${generateBoxHtml(box)}
`;
  });
  html += `</div>`;
  return html;
};

export const generateHtmlCss = (parents) => {
  const styleBlock = generateStyleBlock(parents);
  let html = `<!DOCTYPE html>
<html>
<head>
${styleBlock}
</head>
<body>
`;
  parents.forEach((parent) => {
    html += generateParentHtml(parent);
  });
  html += `
</body>
</html>`;
  return { html };
};

const getElementStyleObject = (element) => {
  const style = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    fontSize: `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    color: element.color,
    backgroundColor: element.backgroundColor,
    margin: `${element.margin.top}px ${element.margin.right}px ${element.margin.bottom}px ${element.margin.left}px`,
    padding: `${element.padding.top}px ${element.padding.right}px ${element.padding.bottom}px ${element.padding.left}px`,
    borderRadius: `${element.borderRadius}px`,
    border: element.border,
  };

  if (element.customStyles) {
    for (const [key, value] of Object.entries(element.customStyles)) {
      const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      style[camelCaseKey] = value;
    }
  }

  return style;
};

export const generateReactCode = (parents) => {
  let code = `import React from 'react';\nimport Link from 'next/link';\n\nconst MyComponent = () => {\n  return (\n    <div>\n`;
  parents.forEach((parent) => {
    const parentStyle = {
      width: '100%',
      height: `${parent.size.height}px`,
      background: parent.size.background || '#fff',
      position: 'relative',
      overflow: 'hidden',
    };
    code += `      <div style={${JSON.stringify(parentStyle)}} >\n`;
    parent.rnds.forEach((box) => {
      const boxStyle = {
        position: 'absolute',
        left: `${box.x}px`,
        top: `${box.y}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
      };
      code += `        <div style={${JSON.stringify(boxStyle)}}>
`;
      box.elements.forEach((element) => {
        const elementStyle = getElementStyleObject(element);
        const className = element.customClassName || '';

        if (element.type === 'text') {
          code += `          <div style={${JSON.stringify(
            elementStyle
          )}} className="${className}">${element.content}</div>\n`;
        } else if (element.type === 'button') {
          if (element.link) {
            code += `          <Link href="${element.link}"><a style={${JSON.stringify(
              elementStyle
            )}} className="${className}">${element.content}</a></Link>\n`;
          } else {
            code += `          <button style={${JSON.stringify(
              elementStyle
            )}} className="${className}">${element.content}</button>\n`;
          }
        } else if (element.type === 'image') {
          code += `          <img src="${element.imageUrl}" alt="" style={${JSON.stringify(
            elementStyle
          )}} className="${className}"/>\n`;
        }
      });
      code += `        </div>
`;
    });
    code += `      </div>
`;
  });
  code += `    </div>
  );
};

export default MyComponent;
`;

  return code;
};

export const downloadFile = (filename, content) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};
