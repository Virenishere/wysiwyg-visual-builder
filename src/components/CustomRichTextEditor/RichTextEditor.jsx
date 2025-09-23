// Updated RichTextEditor.jsx
import React, { useRef, useEffect, useCallback, useState } from 'react';
import Toolbar from './Toolbar';

const RichTextEditor = ({
  content,
  onChange,
  isEditing,
  setIsEditing,
  element,
}) => {
  const editorRef = useRef(null);
  const lastContent = useRef(content);
  const [selectionRange, setSelectionRange] = useState(null);

  // This effect is crucial for synchronizing external changes to the editor.
  // It runs ONLY when the `content` prop changes from the parent.
  // It explicitly avoids updating the DOM if the change came from the editor itself,
  // which is the key to preventing the "backward typing" issue.
  useEffect(() => {
    if (editorRef.current && content !== lastContent.current) {
      lastContent.current = content;
      editorRef.current.innerHTML = content;
      // Restore selection if needed, but for initial load, no selection.
    }
  }, [content]);

  // Save current selection before any potential re-render or command.
  const saveSelection = useCallback(() => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        setSelectionRange(sel.getRangeAt(0));
      }
    }
  }, []);

  // Restore selection after operations.
  const restoreSelection = useCallback(() => {
    if (selectionRange && window.getSelection) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(selectionRange);
    }
  }, [selectionRange]);

  // The `onInput` handler is the primary mechanism for updating the parent state.
  // It fires on every change inside the editor (typing, pasting, formatting).
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      // Update the ref immediately to mark that the change came from within.
      lastContent.current = newContent;
      // Propagate the change to the parent component.
      onChange(newContent);
    }
  }, [onChange]);

  // A robust wrapper for `document.execCommand`.
  const execCommand = useCallback(
    (command, value = null) => {
      if (editorRef.current) {
        saveSelection(); // Save before command.
        editorRef.current.focus(); // Ensure the editor is focused before executing.
        document.execCommand(command, false, value);
        restoreSelection(); // Restore after.
        handleInput(); // Manually trigger input handler to sync state after command.
      }
    },
    [saveSelection, restoreSelection, handleInput]
  );

  // Handles all actions from the toolbar.
  const handleAction = useCallback(
    (action) => {
      const simpleCommands = [
        'bold',
        'italic',
        'underline',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'insertOrderedList',
        'insertUnorderedList',
        'copy',
        'cut',
        'delete',
        'undo',
        'redo',
      ];

      if (simpleCommands.includes(action)) {
        execCommand(action);
      } else if (action === 'quote') {
        execCommand('formatBlock', '<blockquote>');
      } else if (action === 'paste') {
        // Use execCommand('paste') directly for simplicity; browser handles clipboard.
        execCommand('paste');
      }
    },
    [execCommand]
  );

  // Handlers for toolbar dropdowns and color pickers.
  const handleFontChange = useCallback(
    (font) => {
      execCommand('fontName', font);
    },
    [execCommand]
  );

  const handleHeadingChange = useCallback(
    (heading) => {
      execCommand('formatBlock', `<${heading}>`);
    },
    [execCommand]
  );

  const handleColorChange = useCallback(
    (color) => {
      execCommand('foreColor', color);
    },
    [execCommand]
  );

  const handleBackgroundColorChange = useCallback(
    (color) => {
      // Note: backColor may not work in all browsers; fallback to hiliteColor.
      if (!document.execCommand('backColor', false, color)) {
        execCommand('hiliteColor', color);
      } else {
        execCommand('backColor', color);
      }
    },
    [execCommand]
  );

  // Handler for inserting a link.
  const handleInsertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  // Handler for inserting a table.
  const handleInsertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '2');
    const cols = prompt('Number of columns:', '2');
    if (rows && cols) {
      let tableHTML =
        '<table border="1" style="border-collapse: collapse; margin: 10px 0; width: 100%;">';
      for (let i = 0; i < parseInt(rows, 10); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols, 10); j++) {
          tableHTML +=
            '<td style="padding: 8px; border: 1px solid #ccc; min-width: 50px; height: 20px;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      execCommand('insertHTML', tableHTML);
    }
  }, [execCommand]);

  // Manages the editing state and stops event propagation to parent elements.
  const handleFocus = useCallback(
    (e) => {
      setIsEditing(true);
      e.stopPropagation();
    },
    [setIsEditing]
  );

  // When the editor loses focus, we ensure the state is synced.
  const handleBlur = useCallback(
    (e) => {
      // Check if the new focused element is part of the toolbar.
      // If it is, we don't want to blur the editor.
      const toolbar = e.relatedTarget?.closest('.toolbar-container');
      if (toolbar) {
        return;
      }
      setIsEditing(false);
      // Final sync on blur.
      handleInput();
    },
    [setIsEditing, handleInput]
  );

  // Handle mouse up to save selection for future restores.
  const handleMouseUp = useCallback(() => {
    saveSelection();
  }, [saveSelection]);

  // Handle key up for potential selection changes.
  const handleKeyUp = useCallback(() => {
    saveSelection();
  }, [saveSelection]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isEditing && (
        <div
          className="absolute -top-36 left-0 w-full z-50 toolbar-container"
          onMouseDown={(e) => e.preventDefault()} // Prevents editor blur when toolbar is clicked.
        >
          <Toolbar
            onAction={handleAction}
            onFontChange={handleFontChange}
            onHeadingChange={handleHeadingChange}
            onColorChange={handleColorChange}
            onBackgroundColorChange={handleBackgroundColorChange}
            onInsertLink={handleInsertLink}
            onInsertTable={handleInsertTable}
          />
        </div>
      )}
      <div
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput} // This is the key for real-time updates.
        onMouseUp={handleMouseUp}
        onKeyUp={handleKeyUp}
        onMouseDown={(e) => {
          if (isEditing) {
            e.stopPropagation(); // Prevent parent drag while editing.
          }
        }}
        // Removed "rtl-editor" class to fix RTL typing issue
        className="editor" // Generic class; add CSS for .editor { direction: ltr; } if needed
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
          fontSize: `${element.fontSize || 16}px`,
          fontFamily: element.fontFamily || 'Arial, sans-serif',
          color: element.color || '#000000',
          backgroundColor: element.backgroundColor || 'transparent',
          padding: '4px',
          minHeight: '100%',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          direction: 'ltr', // Explicitly set LTR to fix typing direction and cursor position
          textAlign: 'left', // Ensure left alignment by default
          overflowWrap: 'break-word',
          ...element.customStyles,
        }}
        // We use a ref and an effect to set the initial content,
        // avoiding `dangerouslySetInnerHTML` which causes re-render issues.
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
    </div>
  );
};

export default RichTextEditor;
