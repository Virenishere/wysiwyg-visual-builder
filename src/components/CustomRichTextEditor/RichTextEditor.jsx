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
  const textAlign = getResponsiveValue(element?.textAlign, screenSize);
  const lineHeight = getResponsiveValue(element?.lineHeight, screenSize);
  const direction = getResponsiveValue(element?.direction, screenSize);

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

  // Modern text formatting functions using Selection API
  const applyFormatting = useCallback(
    (tag, style = null) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      if (range.collapsed) {
        // No selection - apply to all text
        const allRange = document.createRange();
        allRange.selectNodeContents(editorRef.current);
        selection.removeAllRanges();
        selection.addRange(allRange);
      }

      const selectedContent = range.extractContents();
      const wrapper = document.createElement(tag);

      if (style) {
        Object.assign(wrapper.style, style);
      }

      wrapper.appendChild(selectedContent);
      range.insertNode(wrapper);

      // Restore selection to the newly created element
      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(newRange);

      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection]
  );

  const toggleInlineStyle = useCallback(
    (property, value) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      let range = selection.getRangeAt(0);

      if (range.collapsed) {
        // No selection - toggle style for all text
        const currentValue = editorRef.current.style[property];
        if (currentValue === value) {
          // Remove the style
          editorRef.current.style[property] = '';
        } else {
          // Apply the style
          editorRef.current.style[property] = value;
        }
      } else {
        // Check if selected text already has this style
        let selectedContent = range.extractContents();
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(selectedContent.cloneNode(true));

        // Check if the selection is already wrapped in a span with this style
        const hasStyle =
          tempDiv.querySelector(`span[style*="${property}: ${value}"]`) !==
          null;

        if (hasStyle) {
          // Remove the style - extract content from styled spans
          const walker = document.createTreeWalker(
            selectedContent,
            NodeFilter.SHOW_ELEMENT,
            {
              acceptNode: function (node) {
                return node.tagName === 'SPAN' && node.style[property] === value
                  ? NodeFilter.FILTER_ACCEPT
                  : NodeFilter.FILTER_SKIP;
              },
            }
          );

          const styledSpans = [];
          let node;
          while ((node = walker.nextNode())) {
            styledSpans.push(node);
          }

          // Replace styled spans with their content
          styledSpans.forEach((span) => {
            const parent = span.parentNode;
            while (span.firstChild) {
              parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
          });
        } else {
          // Apply the style
          const span = document.createElement('span');
          span.style[property] = value;
          span.appendChild(selectedContent);
          selectedContent = span;
        }

        range.insertNode(selectedContent);

        // Clear selection and place cursor after the styled text
        range.setStartAfter(selectedContent);
        range.setEndAfter(selectedContent);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection]
  );

  const insertText = useCallback(
    (text) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      range.deleteContents();

      const textNode = document.createTextNode(text);
      range.insertNode(textNode);

      // Move cursor after inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);

      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection]
  );

  const deleteSelection = useCallback(() => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (!range.collapsed) {
      range.deleteContents();
      handleInput();
      saveSelection();
    }
  }, [handleInput, saveSelection]);

  const undoRedoStack = useRef({ undo: [], redo: [] });
  const maxHistorySize = 50;

  const saveToHistory = useCallback(() => {
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML;
    const history = undoRedoStack.current;

    // Don't save if content is the same as last entry
    if (
      history.undo.length > 0 &&
      history.undo[history.undo.length - 1] === content
    ) {
      return;
    }

    history.undo.push(content);
    history.redo = []; // Clear redo stack when new action is performed

    // Limit history size
    if (history.undo.length > maxHistorySize) {
      history.undo.shift();
    }
  }, []);

  const performUndo = useCallback(() => {
    if (!editorRef.current) return;

    const history = undoRedoStack.current;
    if (history.undo.length <= 1) return; // Keep at least current state

    const currentContent = history.undo.pop();
    history.redo.push(currentContent);

    const previousContent = history.undo[history.undo.length - 1];
    editorRef.current.innerHTML = previousContent;

    handleInput();
    saveSelection();
  }, [handleInput, saveSelection]);

  const performRedo = useCallback(() => {
    if (!editorRef.current) return;

    const history = undoRedoStack.current;
    if (history.redo.length === 0) return;

    const nextContent = history.redo.pop();
    history.undo.push(nextContent);

    editorRef.current.innerHTML = nextContent;

    handleInput();
    saveSelection();
  }, [handleInput, saveSelection]);

  // Handle link insertion
  const handleLinkInsertion = useCallback(
    (url, text = null) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      if (range.collapsed) {
        // No selection - insert link with provided text or URL
        link.textContent = text || url;
        range.insertNode(link);
      } else {
        // Wrap selected text in link
        const selectedContent = selection.extractContents();
        link.appendChild(selectedContent);
        range.insertNode(link);
      }

      selection.removeAllRanges();
      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection]
  );

  // Handle table insertion
  const handleTableInsertion = useCallback(
    (rows = 3, cols = 3) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';

      for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
          const cell = document.createElement(i === 0 ? 'th' : 'td');
          cell.style.border = '1px solid #ccc';
          cell.style.padding = '8px';
          cell.textContent = i === 0 ? `Header ${j + 1}` : `Cell ${i},${j + 1}`;
          row.appendChild(cell);
        }
        table.appendChild(row);
      }

      range.deleteContents();
      range.insertNode(table);

      selection.removeAllRanges();
      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection]
  );

  // Handle toolbar actions
  const handleAction = useCallback(
    (action) => {
      switch (action) {
        case 'bold':
          toggleInlineStyle('fontWeight', 'bold');
          break;
        case 'italic':
          toggleInlineStyle('fontStyle', 'italic');
          break;
        case 'underline':
          toggleInlineStyle('textDecoration', 'underline');
          break;
        case 'justifyLeft':
          if (editorRef.current) {
            editorRef.current.style.textAlign = 'left';
            // Save alignment to element data
            const { updateElement } = useDivStore.getState();
            const parentId = element?.parentId;
            const boxId = element?.boxId;
            if (parentId && boxId && element?.id) {
              updateElement(parentId, boxId, element.id, {
                textAlign: 'left',
              });
            }
            handleInput();
          }
          break;
        case 'justifyCenter':
          if (editorRef.current) {
            editorRef.current.style.textAlign = 'center';
            // Save alignment to element data
            const { updateElement } = useDivStore.getState();
            const parentId = element?.parentId;
            const boxId = element?.boxId;
            if (parentId && boxId && element?.id) {
              updateElement(parentId, boxId, element.id, {
                textAlign: 'center',
              });
            }
            handleInput();
          }
          break;
        case 'justifyRight':
          if (editorRef.current) {
            editorRef.current.style.textAlign = 'right';
            // Save alignment to element data
            const { updateElement } = useDivStore.getState();
            const parentId = element?.parentId;
            const boxId = element?.boxId;
            if (parentId && boxId && element?.id) {
              updateElement(parentId, boxId, element.id, {
                textAlign: 'right',
              });
            }
            handleInput();
          }
          break;
        case 'insertOrderedList':
          applyFormatting('ol');
          break;
        case 'insertUnorderedList':
          applyFormatting('ul');
          break;
        case 'copy':
          // Let browser handle copy naturally
          break;
        case 'cut':
          // Let browser handle cut naturally
          break;
        case 'paste':
          // Let browser handle paste naturally
          break;
        case 'delete':
          deleteSelection();
          break;
        case 'undo':
          performUndo();
          break;
        case 'redo':
          performRedo();
          break;
        case 'quote':
          applyFormatting('blockquote');
          break;
        default:
          break;
      }
    },
    [
      toggleInlineStyle,
      applyFormatting,
      deleteSelection,
      performUndo,
      performRedo,
      handleInput,
    ]
  );

  const handleFontChange = useCallback(
    (font) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      if (range.collapsed) {
        // No selection - apply to all text
        editorRef.current.style.fontFamily = font;
      } else {
        // Apply to selected text
        const selectedContent = selection.extractContents();
        const span = document.createElement('span');
        span.style.fontFamily = font;
        span.appendChild(selectedContent);
        range.insertNode(span);
        selection.removeAllRanges();
      }

      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection]
  );

  const handleHeadingChange = useCallback(
    (heading) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      // Default heading sizes (standard HTML heading sizes)
      const headingSizes = {
        h1: '2em', // 32px (default browser size)
        h2: '1.5em', // 24px
        h3: '1.17em', // 18.72px
        h4: '1em', // 16px
        h5: '0.83em', // 13.28px
        h6: '0.67em', // 10.72px
        normal: '1em', // Normal text size
      };

      if (range.collapsed) {
        // No selection - apply to all content
        const content = editorRef.current.innerHTML;

        if (heading === 'normal') {
          // Convert back to normal text - remove heading wrapper and reset styles
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content;

          // Extract text content and remove heading elements
          const textContent = tempDiv.textContent || tempDiv.innerText || '';
          editorRef.current.innerHTML = textContent;
          editorRef.current.style.fontSize = '1em';
          editorRef.current.style.fontWeight = 'normal';
          editorRef.current.style.margin = '0';
        } else {
          // Apply heading
          const wrapper = document.createElement(heading);
          wrapper.innerHTML = content;
          wrapper.style.fontSize = headingSizes[heading] || '1em';
          wrapper.style.fontWeight = 'bold';
          wrapper.style.margin = '0.67em 0';
          editorRef.current.innerHTML = '';
          editorRef.current.appendChild(wrapper);
        }
      } else {
        // Apply to selected text
        const selectedContent = range.extractContents();

        if (heading === 'normal') {
          // Convert to normal text - just insert the content without special formatting
          const span = document.createElement('span');
          span.style.fontSize = '1em';
          span.style.fontWeight = 'normal';
          span.appendChild(selectedContent);
          range.insertNode(span);
        } else {
          // Apply heading
          const headingElement = document.createElement(heading);
          headingElement.appendChild(selectedContent);
          headingElement.style.fontSize = headingSizes[heading] || '1em';
          headingElement.style.fontWeight = 'bold';
          headingElement.style.margin = '0.67em 0';
          range.insertNode(headingElement);
        }

        // Clear selection and place cursor after the styled text
        const insertedElement =
          range.startContainer.nextSibling || range.startContainer.lastChild;
        if (insertedElement) {
          range.setStartAfter(insertedElement);
          range.setEndAfter(insertedElement);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }

      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection]
  );

  const handleFontSizeChange = useCallback(
    (size) => {
      if (!editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      if (range.collapsed) {
        // No selection - apply to all text in the editor
        const allElements = editorRef.current.querySelectorAll('*');
        if (allElements.length === 0) {
          // If no child elements, apply to the editor itself
          editorRef.current.style.fontSize = size;
        } else {
          // Apply to all text content
          allElements.forEach((el) => {
            if (el.nodeType === Node.ELEMENT_NODE) {
              el.style.fontSize = size;
            }
          });
          // Also apply to direct text nodes
          editorRef.current.style.fontSize = size;
        }
      } else {
        // Apply to selected text
        const selectedContent = range.extractContents();
        const span = document.createElement('span');
        span.style.fontSize = size;
        span.appendChild(selectedContent);
        range.insertNode(span);

        // Clear selection and place cursor after the styled text
        range.setStartAfter(span);
        range.setEndAfter(span);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection]
  );

  const handleColorChange = useCallback(
    (color) => {
      if (!editorRef.current) return;

      // First try to restore any saved selection
      restoreSelection();

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      if (range.collapsed) {
        // No selection - apply to all text
        editorRef.current.style.color = color;
      } else {
        // Apply to selected text
        try {
          const selectedContent = range.extractContents();
          const span = document.createElement('span');
          span.style.color = color;
          span.appendChild(selectedContent);
          range.insertNode(span);

          // Clear selection and place cursor after the styled text
          range.setStartAfter(span);
          range.setEndAfter(span);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.error('Error applying color change:', error);
        }
      }

      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection, restoreSelection]
  );

  const handleBackgroundColorChange = useCallback(
    (color) => {
      if (!editorRef.current) return;

      // Always try to restore selection first
      restoreSelection();

      const selection = window.getSelection();

      // If no selection after restore, try to get it from saved state
      if (!selection.rangeCount && savedSelection.current) {
        try {
          const range = document.createRange();
          range.setStart(
            savedSelection.current.startContainer,
            savedSelection.current.startOffset
          );
          range.setEnd(
            savedSelection.current.endContainer,
            savedSelection.current.endOffset
          );
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.log('Could not restore saved selection');
        }
      }

      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      if (range.collapsed) {
        // No selection - apply to all text
        editorRef.current.style.backgroundColor = color;
      } else {
        // Apply to selected text
        try {
          const selectedContent = range.extractContents();
          const span = document.createElement('span');
          span.style.backgroundColor = color;
          span.appendChild(selectedContent);
          range.insertNode(span);

          // Clear selection and place cursor after the styled text
          range.setStartAfter(span);
          range.setEndAfter(span);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.error('Error applying background color change:', error);
        }
      }

      handleInput();
      saveSelection();
    },
    [handleInput, saveSelection, restoreSelection]
  );

  const handleInsertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      handleLinkInsertion(url);
    }
  }, [handleLinkInsertion]);

  const handleInsertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '2');
    const cols = prompt('Number of columns:', '2');
    if (rows && cols && !isNaN(rows) && !isNaN(cols)) {
      handleTableInsertion(parseInt(rows), parseInt(cols));
    }
  }, [handleTableInsertion]);

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

  // Handle mouse events to disable dragging during text selection
  const handleMouseDown = useCallback(
    (e) => {
      // Enable editing mode when user starts interacting with text
      if (setIsEditing) {
        setIsEditing(true);
      }
    },
    [setIsEditing]
  );

  const handleMouseUp = useCallback(
    (e) => {
      // Check if there's a text selection
      const selection = window.getSelection();
      const hasTextSelection = selection && selection.toString().length > 0;

      // Keep editing mode active if there's text selection
      if (hasTextSelection && setIsEditing) {
        setIsEditing(true);
      }

      handleSelectionChange();
    },
    [setIsEditing, handleSelectionChange]
  );

  // Handle clipboard events
  const handlePaste = useCallback(
    (e) => {
      // Save state for undo before paste
      saveToHistory();

      // Update content after paste (let browser handle the actual paste)
      setTimeout(() => {
        handleInput();
        saveSelection();
      }, 10);
    },
    [handleInput, saveSelection, saveToHistory]
  );

  const handleCopy = useCallback((e) => {
    // Let the browser handle copy naturally - no interference
  }, []);

  const handleCut = useCallback(
    (e) => {
      // Save state for undo before cut
      saveToHistory();

      // Update content after cut (let browser handle the actual cut)
      setTimeout(() => {
        handleInput();
        saveSelection();
      }, 10);
    },
    [handleInput, saveSelection, saveToHistory]
  );
  const handleKeyDown = useCallback(
    (e) => {
      // Check for keyboard shortcuts first
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            toggleInlineStyle('fontWeight', 'bold');
            return;
          case 'i':
            e.preventDefault();
            toggleInlineStyle('fontStyle', 'italic');
            return;
          case 'u':
            e.preventDefault();
            toggleInlineStyle('textDecoration', 'underline');
            return;
          case 'v':
            // Check for Ctrl+Shift+V (paste and clear formatting)
            if (e.shiftKey) {
              e.preventDefault();
              // Clear all content and add default text
              if (editorRef.current) {
                editorRef.current.innerHTML = 'Type your text here...';
                handleInput();
                // Select all the default text
                const range = document.createRange();
                range.selectNodeContents(editorRef.current);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
              }
              return;
            }
            // Let browser handle normal paste naturally
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              performRedo();
            } else {
              performUndo();
            }
            return;
          case 'y':
            e.preventDefault();
            performRedo();
            return;
          case 'c':
          case 'x':
          case 'a':
            // Let browser handle copy, cut, select all naturally
            break;
          default:
            break;
        }
      }

      // Save current state for undo/redo before making changes (for regular typing)
      if (!e.ctrlKey && !e.metaKey && e.key.length === 1) {
        saveToHistory();
      }
    },
    [toggleInlineStyle, performUndo, performRedo, saveToHistory, handleInput]
  );

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
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
          fontFamily: fontFamily || 'Arial, sans-serif',
          color: color || '#000000',
          backgroundColor: backgroundColor || 'transparent',
          padding: `${padding?.top || 5}px ${
            padding?.right || 10
          }px ${padding?.bottom || 5}px ${padding?.left || 10}px`,
          minHeight: '100%',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          direction: direction || 'ltr',
          textAlign: textAlign || 'left',
          overflowWrap: 'break-word',
          lineHeight: lineHeight || '1.5',
          userSelect: 'text',
          cursor: 'text',
          // Remove custom border styling - let DraggableElement handle it
          ...element?.customStyles,
        }}
        className="rich-text-editor"
      />
    </div>
  );
};

export default RichTextEditor;
