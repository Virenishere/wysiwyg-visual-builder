import React from 'react';

export default function UnknownElement({ element }) {
  return (
    <div style={{ padding: '10px', color: 'red' }}>
      Unknown Element: {element.type}
    </div>
  );
}
