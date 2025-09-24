// Fixed RichTextEditor.jsx
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
  const savedSelection = useRef(null); // Store selection when toolbar is clicked
  const [isInitialized, setIsInitialized] = useState(false);

  // Save current selection
  const saveSelection = useCallback(() => {
    const selection = window.getSelection();
    if (
      selection.rangeCount > 0 &&
      editorRef.current &&
      editorRef.current.contains(selection.anchorNode)
    ) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  // Restore saved selection
  const restoreSelection = useCallback(() => {
    if (savedSelection.current && editorRef.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      try {
        selection.addRange(savedSelection.current);
        editorRef.current.focus();
      } catch (e) {
        // If restore fails, focus editor anyway
        editorRef.current.focus();
      }
    }
  }, []);

  // Initialize editor content only once
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = content || '';
      lastContent.current = content;
      setIsInitialized(true);
    }
  }, [content, isInitialized]);

  // Sync external changes (but avoid internal change loops)
  useEffect(() => {
    if (editorRef.current && content !== lastContent.current && isInitialized) {
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const startOffset = range ? range.startOffset : 0;
      const endOffset = range ? range.endOffset : 0;
      const startContainer = range ? range.startContainer : null;

      lastContent.current = content;
      editorRef.current.innerHTML = content || '';

      // Restore cursor position if possible
      if (startContainer && editorRef.current.contains(startContainer)) {
        try {
          const newRange = document.createRange();
          newRange.setStart(
            startContainer,
            Math.min(startOffset, startContainer.textContent?.length || 0)
          );
          newRange.setEnd(
            startContainer,
            Math.min(endOffset, startContainer.textContent?.length || 0)
          );
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (e) {
          // If restoration fails, place cursor at end
          const newRange = document.createRange();
          newRange.selectNodeContents(editorRef.current);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    }
  }, [content, isInitialized]);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      lastContent.current = newContent;
      onChange(newContent);
    }
  }, [onChange]);

  // Execute commands with proper selection handling
  const execCommand = useCallback(
    (command, value = null) => {
      // Restore selection before executing command
      restoreSelection();

      if (editorRef.current) {
        // Ensure editor is focused
        editorRef.current.focus();

        // Special handling for different commands
        if (command === 'paste') {
          // Handle paste specially
          try {
            document.execCommand('paste');
          } catch (e) {
            console.warn('Paste failed:', e);
          }
        } else if (command === 'delete') {
          // Handle delete
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (range.collapsed) {
              // If no selection, delete one character forward
              try {
                range.setEnd(range.endContainer, range.endOffset + 1);
              } catch (e) {
                // Handle case where we can't extend selection
                console.warn('Could not extend selection for delete');
              }
            }
            range.deleteContents();
          }
        } else {
          // Regular commands
          const success = document.execCommand(command, false, value);
          if (!success) {
            console.warn(`Command ${command} failed`);
          }
        }

        // Update content after command
        requestAnimationFrame(() => {
          handleInput();
          // Save selection after command execution
          saveSelection();
        });
      }
    },
    [restoreSelection, handleInput, saveSelection]
  );

  // Handle toolbar actions
  const handleAction = useCallback(
    (action) => {
      const commandMap = {
        bold: 'bold',
        italic: 'italic',
        underline: 'underline',
        justifyLeft: 'justifyLeft',
        justifyCenter: 'justifyCenter',
        justifyRight: 'justifyRight',
        insertOrderedList: 'insertOrderedList',
        insertUnorderedList: 'insertUnorderedList',
        copy: 'copy',
        cut: 'cut',
        paste: 'paste',
        delete: 'delete',
        undo: 'undo',
        redo: 'redo',
      };

      if (commandMap[action]) {
        execCommand(commandMap[action]);
      } else if (action === 'quote') {
        execCommand('formatBlock', 'blockquote');
      }
    },
    [execCommand]
  );

  // Handle font changes
  const handleFontChange = useCallback(
    (font) => {
      execCommand('fontName', font);
    },
    [execCommand]
  );

  // Handle heading changes
  const handleHeadingChange = useCallback(
    (heading) => {
      execCommand('formatBlock', heading);
    },
    [execCommand]
  );

  // Handle color changes
  const handleColorChange = useCallback(
    (color) => {
      execCommand('foreColor', color);
    },
    [execCommand]
  );

  // Handle background color changes
  const handleBackgroundColorChange = useCallback(
    (color) => {
      execCommand('hiliteColor', color);
    },
    [execCommand]
  );

  // Handle link insertion
  const handleInsertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  // Handle table insertion with better styling
  const handleInsertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '2');
    const cols = prompt('Number of columns:', '2');
    if (rows && cols && !isNaN(rows) && !isNaN(cols)) {
      let tableHTML = `
        <table style="
          border-collapse: collapse; 
          margin: 10px 0; 
          width: 100%; 
          border: 2px solid #333;
        ">`;

      for (let i = 0; i < parseInt(rows, 10); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols, 10); j++) {
          tableHTML += `
            <td style="
              padding: 12px; 
              border: 1px solid #666; 
              min-width: 80px; 
              min-height: 30px;
              background-color: #f9f9f9;
              vertical-align: top;
            ">
              &nbsp;
            </td>`;
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table><p>&nbsp;</p>';
      execCommand('insertHTML', tableHTML);
    }
  }, [execCommand]);

  // Handle focus
  const handleFocus = useCallback(
    (e) => {
      setIsEditing(true);
      e.stopPropagation();
      // Save selection when editor gets focus
      setTimeout(() => {
        saveSelection();
      }, 0);
    },
    [setIsEditing, saveSelection]
  );

  // Handle blur with toolbar check
  const handleBlur = useCallback(
    (e) => {
      const relatedTarget = e.relatedTarget;

      // Check if the focus moved to toolbar or any of its children
      const isToolbarClick =
        relatedTarget &&
        (relatedTarget.closest('.toolbar-container') ||
          relatedTarget.closest('[data-toolbar]') ||
          relatedTarget.type === 'color');

      if (!isToolbarClick) {
        setIsEditing(false);
        handleInput(); // Final sync
        savedSelection.current = null; // Clear saved selection
      }
    },
    [setIsEditing, handleInput]
  );

  // Save selection before toolbar interaction
  const handleSelectionChange = useCallback(() => {
    if (
      isEditing &&
      editorRef.current &&
      document.activeElement === editorRef.current
    ) {
      saveSelection();
    }
  }, [isEditing, saveSelection]);

  // Listen for selection changes
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  // Prevent toolbar clicks from blurring editor and save selection
  const handleToolbarMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      // Save current selection before toolbar interaction
      saveSelection();
    },
    [saveSelection]
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isEditing && (
        <div
          className="absolute -top-36 left-0 w-full z-50 toolbar-container"
          data-toolbar="true"
          onMouseDown={handleToolbarMouseDown}
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
        onInput={handleInput}
        onMouseUp={saveSelection} // Save selection on mouse up
        onKeyUp={saveSelection} // Save selection on key up
        onMouseDown={(e) => {
          if (isEditing) {
            e.stopPropagation();
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
          fontSize: `${element?.fontSize || 16}px`,
          fontFamily: element?.fontFamily || 'Arial, sans-serif',
          color: element?.color || '#000000',
          backgroundColor: element?.backgroundColor || 'transparent',
          padding: '8px',
          minHeight: '100%',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          direction: 'ltr',
          textAlign: 'left',
          overflowWrap: 'break-word',
          lineHeight: '1.5',
          ...element?.customStyles,
        }}
        className="rich-text-editor"
      />
    </div>
  );
};

export default RichTextEditor;
