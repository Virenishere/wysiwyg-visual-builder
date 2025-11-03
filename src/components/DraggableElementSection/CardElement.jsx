import React from 'react';

const CardElement = ({ id, style, content }) => {
  const combinedStyle = {
    ...style,
    width: '100%',
    height: '100%',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: style?.color || '#333', // Default text color
    backgroundColor: style?.backgroundColor || '#f8f9fa', // Default background
  };

  return (
    <div id={id} style={combinedStyle}>
      {content || 'Card Content'}
    </div>
  );
};

export default CardElement;
