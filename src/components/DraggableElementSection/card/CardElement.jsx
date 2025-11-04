import React from 'react';
import { Rnd } from 'react-rnd';
import DraggableCardItem from './DraggableCardItem';

function CardElement(props) {
  return (
    <Rnd cancel=".card-item">
      {/* render card items */}
      {/* Ensure items render DraggableCardItem and pass snapping props if you have them */}
      {items?.map((item) => (
        <DraggableCardItem
          key={item.id}
          item={item}
          isSelected={element.selectedItemId === item.id}
          onSelect={(id) =>
            updateElement(parentId, boxId, elementId, { selectedItemId: id })
          }
          onUpdate={(id, patch) => {
            const nextItems = items.map((it) =>
              it.id === id ? { ...it, ...patch } : it
            );
            updateElement(parentId, boxId, elementId, { items: nextItems });
          }}
          containerBounds={{ width: element.width, height: element.height }}
          screenSize={screenSize}
          snapEnabled={element?.snapEnabled ?? false}
          gridSize={element?.gridSize ?? 8}
        />
      ))}
    </Rnd>
  );
}
