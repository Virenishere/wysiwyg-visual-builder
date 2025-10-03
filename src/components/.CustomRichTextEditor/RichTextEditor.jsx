import React, { useRef, useEffect, useCallback, useState } from 'react';
import Toolbar from './Toolbar';
import { getResponsiveValue } from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';
import { applyStyle, insertList, setBlockFormat } from '@/utils/domUtils.js';

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
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

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

  const updateFormatState = useCallback(() => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let parent = range.startContainer.parentElement;

    const isBold = () => {
      let node = range.startContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'B') return true;
        node = node.parentNode;
      }
      return false;
    };

    const isItalic = () => {
      let node = range.startContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'I') return true;
        node = node.parentNode;
      }
      return false;
    };

    const isUnderline = () => {
      let node = range.startContainer;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'U') return true;
        node = node.parentNode;
      }
      return false;
    };

    setFormatState({
      bold: isBold(),
      italic: isItalic(),
      underline: isUnderline(),
    });
  }, []);

  // Handle toolbar actions
  const handleAction = useCallback(
    (action) => {
      restoreSelection();
      const commandMap = {
        bold: 'bold',
        italic: 'italic',
        underline: 'underline',
      };

      if (commandMap[action]) {
        applyStyle(commandMap[action]);
      } else if (action === 'quote') {
        setBlockFormat('blockquote');
      } else if (action === 'insertOrderedList') {
        insertList(true);
      } else if (action === 'insertUnorderedList') {
        insertList(false);
      }
      saveSelection();
      handleInput();
      updateFormatState();
    },
    [restoreSelection, saveSelection, handleInput, updateFormatState]
  );

  const handleFontChange = useCallback(
    (font) => {
      restoreSelection();
      applyStyle('fontName', font);
      saveSelection();
      handleInput();
    },
    [restoreSelection, saveSelection, handleInput]
  );

  const handleHeadingChange = useCallback(
    (heading) => {
      restoreSelection();
      setBlockFormat(heading);
      saveSelection();
      handleInput();
    },
    [restoreSelection, saveSelection, handleInput]
  );

  const handleFontSizeChange = useCallback(
    (size) => {
      restoreSelection();
      applyStyle('fontSize', size);
      saveSelection();
      handleInput();
    },
    [restoreSelection, saveSelection, handleInput]
  );

  const handleColorChange = useCallback(
    (color) => {
      restoreSelection();
      applyStyle('foreColor', color);
      saveSelection();
      handleInput();
    },
    [restoreSelection, saveSelection, handleInput]
  );

  const handleBackgroundColorChange = useCallback(
    (color) => {
      restoreSelection();
      applyStyle('hiliteColor', color);
      saveSelection();
      handleInput();
    },
    [restoreSelection, saveSelection, handleInput]
  );

  const handleInsertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      restoreSelection();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const a = document.createElement('a');
      a.href = url;
      a.textContent = range.toString();
      range.deleteContents();
      range.insertNode(a);
      saveSelection();
      handleInput();
    }
  }, [restoreSelection, saveSelection, handleInput]);

  const handleInsertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '2');
    const cols = prompt('Number of columns:', '2');
    if (rows && cols && !isNaN(rows) && !isNaN(cols)) {
      restoreSelection();
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
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const template = document.createElement('template');
      template.innerHTML = tableHTML.trim();
      range.deleteContents();
      range.insertNode(template.content.firstChild);
      saveSelection();
      handleInput();
    }
  }, [restoreSelection, saveSelection, handleInput]);

  const handleFocus = useCallback(
    (e) => {
      e.stopPropagation();
      setTimeout(() => {
        saveSelection();
      }, 0);
    },
    [saveSelection]
  );

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const handleBlur = useCallback(
    (e) => {
      const relatedTarget = e.relatedTarget;

      const isToolbarClick =
        relatedTarget &&
        (relatedTarget.closest('.toolbar-container') ||
          relatedTarget.closest('[data-toolbar]') ||
          relatedTarget.type === 'color');

      if (!isToolbarClick) {
        setIsEditing(false);
        handleInput();
        savedSelection.current = null;
      }
    },
    [setIsEditing, handleInput]
  );

  const handleSelectionChange = useCallback(() => {
    if (
      isEditing &&
      editorRef.current &&
      document.activeElement === editorRef.current
    ) {
      saveSelection();
      updateFormatState();
    }
  }, [isEditing, saveSelection, updateFormatState]);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', handleSelectionChange);
  }, [handleSelectionChange]);

  const handleToolbarMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      saveSelection();
    },
    [saveSelection]
  );

  // Get responsive toolbar width based on screen size
  const getToolbarMaxWidth = () => {
    if (screenSize === 'mobile') return '95vw';
    if (screenSize === 'tablet') return '90vw';
    return '1200px'; // desktop
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isEditing && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 toolbar-container"
          data-toolbar="true"
          onMouseDown={handleToolbarMouseDown}
          style={{
            top: 'calc(50% - 300px)',
            maxWidth: getToolbarMaxWidth(),
            width: '95%',
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
            formatState={formatState}
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
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
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
          ...element?.customStyles,
        }}
        className="rich-text-editor"
      />
    </div>
  );
};

export default RichTextEditor;
