import React from 'react';
import useDivStore from '@/store/UseDivStore';
import RichTextEditor from '../CustomRichTextEditor/RichTextEditor';

const EditableTextElement = ({ element, isEditing, setIsEditing }) => {
  const { updateElementContent } = useDivStore();

  const handleContentChange = (newContent) => {
    updateElementContent(element.id, newContent);
  };

  return (
    <RichTextEditor
      content={element.content}
      onChange={handleContentChange}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      element={element}
    />
  );
};

export default EditableTextElement;
