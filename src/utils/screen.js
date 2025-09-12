export const calculateResponsiveStyles = (
  element,
  editorDimensions,
  previewDimensions
) => {
  if (!editorDimensions.width || !editorDimensions.height) {
    return element.style;
  }

  const widthRatio = previewDimensions.width / editorDimensions.width;
  const heightRatio = previewDimensions.height / editorDimensions.height;

  const newStyles = {
    ...element.style,
    left: `${element.x * widthRatio}px`,
    top: `${element.y * heightRatio}px`,
    width: `${element.width * widthRatio}px`,
    height: `${element.height * heightRatio}px`,
  };

  return newStyles;
};
