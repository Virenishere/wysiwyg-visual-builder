import React from 'react';
import RichTextEditor from '../RichTextEditor';

export default function ParagraphElement({
  element,
  parentId,
  boxId,
  updateElement,
}) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <RichTextEditor
        value={element.content}
        onChange={(content) =>
          updateElement(parentId, boxId, element.id, { content })
        }
        height={Math.max(element.height - 20, 100)}
      />
    </div>
  );
}
