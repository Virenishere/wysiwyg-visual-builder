import React, { useRef, useEffect, useCallback, useState } from 'react';
import Toolbar from './Toolbar';
import { getResponsiveValue } from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';

const RichTextEditor = ({
  content,
  onChange,
  isEditing,
  setIsEditing,
  element,
}) => {
  const editorRef = useRef(null);
  const lastContent = useRef(content);
  const savedSelection = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { screenSize } = useDivStore();

  const fontSize = getResponsiveValue(element?.fontSize, screenSize);
  const fontFamily = getResponsiveValue(element?.fontFamily, screenSize);
  const color = getResponsiveValue(element?.color, screenSize);
  const backgroundColor = getResponsiveValue(
    element?.backgroundColor,
    screenSize
  );
  const padding = getResponsiveValue(element?.padding, screenSize);

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
        editorRef.current.focus();
      }
    }
  }, []);

  // Check if there's any text selected - more reliable method
  const hasSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    // Check if range is collapsed (no selection) or if it has actual content
    if (range.collapsed) return false;

    // Check if the selection contains actual text content
    const selectedText = range.toString();
    return selectedText.length > 0;
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
          const newRange = document.createRange();
          newRange.selectNodeContents(editorRef.current);
          newRange.collapse(false);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    }
  }, [content, isInitialized, fontSize]);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      lastContent.current = newContent;
      onChange(newContent);
    }
  }, [onChange]);

  // Execute commands with proper text selection behavior
  const execCommand = useCallback(
    (command, value = null) => {
      if (!editorRef.current) return;

      // Ensure editor has focus
      editorRef.current.focus();

      // Restore selection if we have one saved
      if (savedSelection.current) {
        try {
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(savedSelection.current);
        } catch (e) {
          // If restore fails, continue with current selection
        }
      }

      const hasTextSelected = hasSelection();

      // Commands that should apply to all text when no selection exists
      // Now includes formatting commands (bold, italic, underline) as requested
      const globalStyleCommands = [
        'fontName',
        'fontSize',
        'foreColor',
        'hiliteColor',
        'backColor',
        'bold',
        'italic',
        'underline',
      ];

      // Special handling for different command types
      if (command === 'paste') {
        try {
          document.execCommand('paste');
        } catch (e) {
          console.warn('Paste failed:', e);
        }
      } else if (command === 'delete') {
        if (hasTextSelected) {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          range.deleteContents();
        }
      } else if (!hasTextSelected && globalStyleCommands.includes(command)) {
        // Apply to all text when no selection for style and formatting commands
        const selection = window.getSelection();
        const currentRange =
          selection.rangeCount > 0
            ? selection.getRangeAt(0).cloneRange()
            : null;

        // Select all content temporarily
        const allRange = document.createRange();
        allRange.selectNodeContents(editorRef.current);
        selection.removeAllRanges();
        selection.addRange(allRange);

        // Apply the command to all text
        document.execCommand(command, false, value);

        // Restore cursor position
        if (currentRange) {
          try {
            selection.removeAllRanges();
            selection.addRange(currentRange);
          } catch (e) {
            // If restore fails, place cursor at end
            const endRange = document.createRange();
            endRange.selectNodeContents(editorRef.current);
            endRange.collapse(false);
            selection.removeAllRanges();
            selection.addRange(endRange);
          }
        }
      } else {
        // For all other cases - apply command normally
        // This includes: selected text formatting, alignment, lists, etc.
        document.execCommand(command, false, value);
      }

      // Update content and save selection after a brief delay
      setTimeout(() => {
        handleInput();
        saveSelection();
      }, 10);
    },
    [hasSelection, handleInput, saveSelection]
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

  const handleFontChange = useCallback(
    (font) => {
      execCommand('fontName', font);
    },
    [execCommand]
  );

  const handleHeadingChange = useCallback(
    (heading) => {
      execCommand('formatBlock', heading);
    },
    [execCommand]
  );

  const handleFontSizeChange = useCallback(
    (size) => {
      execCommand('fontSize', size);
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
      execCommand('hiliteColor', color);
    },
    [execCommand]
  );

  const handleInsertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  const handleInsertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '2');
    const cols = prompt('Number of columns:', '2');
    if (rows && cols && !isNaN(rows) && !isNaN(cols)) {
      let tableHTML = `
        <table style="
          border-collapse: collapse; 
          width: 100%; 
          margin: 10px 0;
          border: 1px solid #ddd;
        ">`;

      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += `<td style="
            border: 1px solid #ddd; 
            padding: 8px; 
            min-width: 50px;
            min-height: 20px;
          ">&nbsp;</td>`;
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';

      restoreSelection();
      document.execCommand('insertHTML', false, tableHTML);
      handleInput();
    }
  }, [execCommand, restoreSelection, handleInput]);

  const handleFocus = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const handleBlur = useCallback(
    (e) => {
      // Don't blur if clicking on toolbar
      if (e.relatedTarget?.closest('[data-toolbar="true"]')) {
        return;
      }

      // Small delay to allow toolbar interactions
      setTimeout(() => {
        if (!document.activeElement?.closest('[data-toolbar="true"]')) {
          setIsEditing(false);
        }
      }, 100);
    },
    [setIsEditing]
  );

  const handleToolbarMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      saveSelection();
    },
    [saveSelection]
  );

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      saveSelection();
    }, 0);
  }, [setIsEditing, saveSelection]);

  // Handle selection changes
  const handleSelectionChange = useCallback(() => {
    saveSelection();
  }, [saveSelection]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isEditing && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 toolbar-container"
          data-toolbar="true"
          onMouseDown={handleToolbarMouseDown}
          style={{
            top: '60px',
            width: 'auto',
            minWidth: '800px',
            maxWidth: '95vw',
          }}
        >
          <Toolbar
            onAction={handleAction}
            onFontChange={handleFontChange}
            onFontSizeChange={handleFontSizeChange}
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
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onDoubleClick={handleDoubleClick}
        onMouseDown={(e) => {
          if (isEditing) {
            e.stopPropagation();
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
          fontSize: `${fontSize || 16}px`,
          fontFamily: fontFamily || 'Arial, sans-serif',
          color: color || '#000000',
          backgroundColor: backgroundColor || 'transparent',
          padding: `${padding?.top || 5}px ${
            padding?.right || 10
          }px ${padding?.bottom || 5}px ${padding?.left || 10}px`,
          minHeight: '100%',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          direction: 'ltr',
          textAlign: 'left',
          overflowWrap: 'break-word',
          lineHeight: '1.5',
          cursor: isEditing ? 'text' : 'inherit',
          // Remove custom border styling - let DraggableElement handle it
          ...element?.customStyles,
        }}
        className="rich-text-editor"
      />
    </div>
  );
};

export default RichTextEditor;
