import React from 'react';
import { getResponsiveValue } from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';

const LineElement = ({ element }) => {
  const { screenSize } = useDivStore();
  const { id, style } = element;

  const backgroundColor = getResponsiveValue(
    element.backgroundColor,
    screenSize
  );
  const height = getResponsiveValue(element.height, screenSize);
  const borderRadius = getResponsiveValue(element.borderRadius, screenSize);
  const border = getResponsiveValue(element.border, screenSize);

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
