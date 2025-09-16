import React from 'react';
import Link from 'next/link';

export default function ButtonElement({
  element,
  parentId,
  boxId,
  updateElement,
}) {
  const {
    content,
    fontSize,
    fontFamily,
    color,
    backgroundColor,
    margin,
    padding,
    borderRadius,
    border,
    link,
  } = element;

  const buttonStyle = {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    fontSize: `${fontSize}px`,
    fontFamily,
    color,
    backgroundColor,
    margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    borderRadius: `${borderRadius}px`,
    border,
    textDecoration: 'none', // to remove underline from link
  };

  if (link) {
    return (
      <Link
        href={link}
        style={buttonStyle}
        className="hover:opacity-80 hover:scale-105 active:scale-95"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      style={buttonStyle}
      className="hover:opacity-80 hover:scale-105 active:scale-95"
      onClick={(e) => {
        e.stopPropagation();
        console.log('Button clicked:', content);
      }}
      onDoubleClick={() => {
        const newContent = prompt('Edit button text:', content);
        if (newContent !== null) {
          updateElement(parentId, boxId, element.id, { content: newContent });
        }
      }}
    >
      {content}
    </button>
  );
}
