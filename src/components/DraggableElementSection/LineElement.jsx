import React from 'react';

const LineElement = ({ id, style }) => {
  const combinedStyle = {
    ...style,
    width: '100%',
    height: '100%',
  };
  return <div id={id} style={combinedStyle} />;
};

export default LineElement;
