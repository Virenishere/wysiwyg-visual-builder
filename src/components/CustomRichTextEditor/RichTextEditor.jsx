import React, { useEffect, useRef, useState } from 'react';
import Toolbar from './Toolbar';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const saveToHistory = (content) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(content);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      saveToHistory(content);
    }
  };

  const execCommand = (command, value) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
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
        navigator.clipboard.readText().then((text) => {
          execCommand('insertText', text);
        });
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
            '<td style="padding: 8px; border: 1px solid #ccc; min-width: 50px; min-height: 20px;"> </td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';

      execCommand('insertHTML', tableHTML);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div>
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
      <div
        ref={editorRef}
        className="min-h-[400px] p-4 border-2 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
        contentEditable
        onInput={handleInput}
        style={{ lineHeight: '1.6' }}
      />
    </div>
  );
};

export default RichTextEditor;
