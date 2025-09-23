import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './Toolbar';

const RichTextEditor = ({
  content,
  onChange,
  isEditing,
  setIsEditing,
  element,
}) => {
  const editorRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedRange, setSavedRange] = useState(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // Improved selection saving
  const saveSelection = () => {
    const selection = window.getSelection();
    if (
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      const range = selection.getRangeAt(0);
      setSavedRange(range.cloneRange());
    }
  };

  // Improved selection restoration
  const restoreSelection = () => {
    if (savedRange && editorRef.current) {
      try {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
        editorRef.current.focus();
      } catch (error) {
        console.warn('Could not restore selection:', error);
        editorRef.current.focus();
      }
    }
  };

  const saveToHistory = (newContent) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
      saveToHistory(newContent);
      saveSelection(); // Save selection after input
    }
  };

  const execCommand = (command, value) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    if (savedRange) {
      restoreSelection();
    }
    setTimeout(() => {
      try {
        const success = document.execCommand(command, false, value);
        if (success && editorRef.current) {
          onChange(editorRef.current.innerHTML);
          saveSelection();
        }
      } catch (error) {
        console.warn('execCommand failed:', command, error);
      }
    }, 10);
  };

  const handleAction = (action) => {
    switch (action) {
      case 'bold':
        execCommand('bold');
        break;
      case 'italic':
        execCommand('italic');
        break;
      case 'underline':
        execCommand('underline');
        break;
      case 'alignLeft':
        execCommand('justifyLeft');
        break;
      case 'alignCenter':
        execCommand('justifyCenter');
        break;
      case 'alignRight':
        execCommand('justifyRight');
        break;
      case 'orderedList':
        execCommand('insertOrderedList');
        break;
      case 'unorderedList':
        execCommand('insertUnorderedList');
        break;
      case 'quote':
        execCommand('formatBlock', 'blockquote');
        break;
      case 'copy':
        execCommand('copy');
        break;
      case 'cut':
        execCommand('cut');
        break;
      case 'paste':
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard
            .readText()
            .then((text) => {
              execCommand('insertText', text);
            })
            .catch(() => {
              execCommand('paste');
            });
        } else {
          execCommand('paste');
        }
        break;
      case 'delete':
        execCommand('delete');
        break;
      case 'undo':
        if (historyIndex > 0) {
          const prevContent = history[historyIndex - 1];
          setHistoryIndex(historyIndex - 1);
          if (editorRef.current) {
            editorRef.current.innerHTML = prevContent;
            onChange(prevContent);
            editorRef.current.focus();
          }
        }
        break;
      case 'redo':
        if (historyIndex < history.length - 1) {
          const nextContent = history[historyIndex + 1];
          setHistoryIndex(historyIndex + 1);
          if (editorRef.current) {
            editorRef.current.innerHTML = nextContent;
            onChange(nextContent);
            editorRef.current.focus();
          }
        }
        break;
      default:
        break;
    }
  };

  const handleFontChange = (font) => {
    execCommand('fontName', font);
  };
  const handleHeadingChange = (heading) => {
    execCommand('formatBlock', heading);
  };
  const handleColorChange = (color) => {
    execCommand('foreColor', color);
  };
  const handleBackgroundColorChange = (color) => {
    execCommand('backColor', color);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
      setTimeout(() => {
        const links = editorRef.current?.querySelectorAll('a');
        links?.forEach((link) => {
          link.style.color = '#2563eb';
          link.style.textDecoration = 'underline';
        });
      }, 100);
    }
  };

  const handleInsertTable = () => {
    const rows = prompt('Number of rows:');
    const cols = prompt('Number of columns:');
    if (rows && cols) {
      const numRows = parseInt(rows);
      const numCols = parseInt(cols);
      let tableHTML =
        '<table border="1" style="border-collapse: collapse; margin: 10px 0;">';
      for (let i = 0; i < numRows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < numCols; j++) {
          tableHTML +=
            '<td style="padding: 8px; border: 1px solid #ccc; min-width: 50px; min-height: 20px;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      execCommand('insertHTML', tableHTML);
    }
  };

  const handleFocus = (e) => {
    setIsEditing(true);
    e.stopPropagation();
    saveSelection();
  };

  const handleBlur = (e) => {
    const relatedTarget = e.relatedTarget;
    const toolbar = document.querySelector('.toolbar-container');
    if (relatedTarget && toolbar?.contains(relatedTarget)) {
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 10);
      return;
    }
    saveSelection();
    setTimeout(() => setIsEditing(false), 100);
  };

  const handleMouseUp = () => {
    saveSelection();
  };
  const handleKeyUp = () => {
    saveSelection();
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isEditing && (
        <div
          className="absolute -top-36 left-0 w-full z-50 toolbar-container"
          onMouseDown={(e) => e.preventDefault()}
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
        onMouseUp={handleMouseUp}
        onKeyUp={handleKeyUp}
        onMouseDown={(e) => {
          if (isEditing) {
            e.stopPropagation();
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          outline: 'none',
          fontSize: `${element.fontSize}px`,
          fontFamily: element.fontFamily,
          color: element.color,
          backgroundColor: element.backgroundColor,
          padding: '4px',
          minHeight: '100%',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          ...element.customStyles,
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default RichTextEditor;
