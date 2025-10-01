import React from 'react';

const LineElement = ({ element }) => {
  const { id, backgroundColor, height, borderRadius, border, style } = element;

  const combinedStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: backgroundColor || style?.backgroundColor || '#000000',
    minHeight: height < 2 ? '2px' : `${height}px`,
    padding: 0,
    border: border || 'none',
    borderRadius: `${borderRadius || 0}px`,
    ...style,
    height: height < 1 ? '1px' : `${height}px`,
  };

  return <div id={id} style={combinedStyle} />;
};

export default LineElement;
