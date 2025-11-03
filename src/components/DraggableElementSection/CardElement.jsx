import React from 'react';

const CardElement = ({ id, style, children }) => {
  const combinedStyle = {
    ...style,
    width: '100%',
    height: '100%',
  };
  return (
    <div id={id} style={combinedStyle}>
      {children}
    </div>
  );
};

export default CardElement;
