// Updated Toolbar.jsx
import React, { useEffect } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaLink,
  FaTable,
  FaCopy,
  FaPaste,
  FaCut,
  FaTrashAlt,
  FaChevronDown,
  FaTextHeight,
} from 'react-icons/fa';
import { MdOutlineFormatColorText, MdFormatColorFill } from 'react-icons/md';
import { LuHeading } from 'react-icons/lu';
import { BiUndo, BiRedo } from 'react-icons/bi';

import { FONT_FAMILIES } from '@/utils/RichTextEditor/FontFamilies';
import { TEXT_FORMATS } from '@/utils/RichTextEditor/FontFormat';

const ToolbarButton = ({ onClick, title, children, isActive = false }) => (
  <button
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()} // Prevents the editor from losing focus.
    title={title}
    className={`p-1.5 rounded cursor-pointer transition-colors flex items-center justify-center min-w-[28px] h-[28px] ${
      isActive
        ? 'bg-blue-500 text-white hover:bg-blue-600'
        : 'bg-white text-black hover:bg-gray-100 border border-gray-300'
    }`}
    type="button"
    style={{ fontSize: '12px', fontWeight: 'normal' }}
  >
    {children}
  </button>
);

// A reusable color picker button for the toolbar.
const ColorPicker = ({ onChange, title, children }) => {
  const colorRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef(null);

  const colors = [
    '#000000',
    '#333333',
    '#666666',
    '#999999',
    '#CCCCCC',
    '#FFFFFF',
    '#FF0000',
    '#FF6600',
    '#FFCC00',
    '#FFFF00',
    '#99FF00',
    '#00FF00',
    '#00FFCC',
    '#00CCFF',
    '#0066FF',
    '#0000FF',
    '#6600FF',
    '#CC00FF',
    '#FF0099',
    '#FF3366',
    '#FF6699',
    '#FF99CC',
    '#FFCCFF',
    '#CCCCFF',
  ];

  const handleColorChange = React.useCallback(
    (color) => {
      onChange(color);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleButtonClick = React.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={buttonRef}>
      <button
        onClick={handleButtonClick}
        onMouseDown={(e) => e.preventDefault()}
        className="p-1.5 rounded hover:bg-gray-100 cursor-pointer bg-white text-black border border-gray-300 flex items-center justify-center min-w-[28px] h-[28px]"
        type="button"
        title={title}
        style={{ fontSize: '12px', fontWeight: 'normal' }}
      >
        {children}
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 p-2"
          style={{ minWidth: '200px' }}
        >
          <div className="grid grid-cols-6 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                onMouseDown={(e) => e.preventDefault()}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Dropdown = ({ options, onSelect, placeholder, icon }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(placeholder);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = React.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    },
    [isOpen]
  );

  const handleOptionSelect = React.useCallback(
    (optionValue, optionLabel) => {
      onSelect(optionValue);
      setSelected(optionLabel);
      setIsOpen(false);
    },
    [onSelect]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-2 py-1.5 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer bg-white text-black min-h-[28px]"
        onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
        onClick={handleToggle}
        type="button"
        style={{ fontSize: '12px', fontWeight: 'normal' }}
      >
        {icon && <span style={{ fontSize: '10px' }}>{icon}</span>}
        <span
          className="text-xs whitespace-nowrap text-black"
          style={{ fontWeight: 'normal' }}
        >
          {selected}
        </span>
        <FaChevronDown className="text-xs" style={{ fontSize: '8px' }} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-full max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-xs cursor-pointer text-black"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              onClick={() => handleOptionSelect(option.value, option.label)}
              type="button"
              style={{ fontWeight: 'normal' }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

import { FONT_SIZES } from '@/utils/RichTextEditor/FontSize';
// import { FaTextHeight } from 'react-icons/fa';

const Toolbar = ({
  onAction,
  onFontChange,
  onFontSizeChange, // Add this prop
  onHeadingChange,
  onColorChange,
  onBackgroundColorChange,
  onInsertLink,
  onInsertTable,
}) => {
  // Get current formatting state (optional - for visual feedback)
  const [formatState, setFormatState] = React.useState({
    bold: false,
    italic: false,
    underline: false,
  });

  // Update format state based on current selection
  const updateFormatState = React.useCallback(() => {
    try {
      setFormatState({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
      });
    } catch (e) {
      // Ignore errors - some browsers might not support queryCommandState
    }
  }, []);

  // Update format state when selection changes
  React.useEffect(() => {
    const handleSelectionChange = () => {
      updateFormatState();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateFormatState]);

  // This effect handles keyboard shortcuts for the editor.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = /Mac|iP(hone|ad)/.test(navigator.platform);
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey) {
        const key = e.key.toLowerCase();
        const actions = {
          b: 'bold',
          i: 'italic',
          u: 'underline',
          z: 'undo',
          y: 'redo',
          c: 'copy',
          x: 'cut',
          v: 'paste',
        };

        if (actions[key]) {
          e.preventDefault();
          onAction(actions[key]);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Don't prevent default for delete/backspace - let them work normally
        // Only call onAction for special delete functionality if needed
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onAction]);

  return (
    <div
      className="bg-white rounded-md p-2 shadow-lg flex flex-wrap gap-1.5 items-center"
      style={{
        minWidth: '800px',
        width: 'auto',
        maxWidth: '100vw',
      }}
    >
      {/* Action Buttons */}
      <ToolbarButton onClick={() => onAction('undo')} title="Undo (Ctrl+Z)">
        <BiUndo style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('redo')} title="Redo (Ctrl+Y)">
        <BiRedo style={{ fontSize: '12px' }} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Formatting Dropdowns */}
      <Dropdown
        options={FONT_FAMILIES}
        onSelect={onFontChange}
        placeholder="Font Style"
        title="Font Style"
      />
      <Dropdown
        options={TEXT_FORMATS}
        onSelect={onHeadingChange}
        placeholder="Normal"
        icon={<LuHeading />}
        title="Headings"
      />
      <Dropdown
        options={FONT_SIZES}
        onSelect={onFontSizeChange} // Use the new prop
        placeholder="Font Size"
        icon={<FaTextHeight />}
        title="Font Size"
      />

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Style Buttons */}
      <ToolbarButton
        onClick={() => onAction('bold')}
        title="Bold (Ctrl+B)"
        isActive={formatState.bold}
      >
        <FaBold style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('italic')}
        title="Italic (Ctrl+I)"
        isActive={formatState.italic}
      >
        <FaItalic style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('underline')}
        title="Underline (Ctrl+U)"
        isActive={formatState.underline}
      >
        <FaUnderline style={{ fontSize: '12px' }} />
      </ToolbarButton>

      {/* Color Pickers */}
      <ColorPicker onChange={onColorChange} title="Text Color">
        <MdOutlineFormatColorText style={{ fontSize: '12px' }} />
      </ColorPicker>
      <ColorPicker onChange={onBackgroundColorChange} title="Background Color">
        <MdFormatColorFill style={{ fontSize: '12px' }} />
      </ColorPicker>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Alignment Buttons */}
      <ToolbarButton onClick={() => onAction('justifyLeft')} title="Align Left">
        <FaAlignLeft style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('justifyCenter')}
        title="Align Center"
      >
        <FaAlignCenter style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('justifyRight')}
        title="Align Right"
      >
        <FaAlignRight style={{ fontSize: '12px' }} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* List and Block Buttons */}
      <ToolbarButton
        onClick={() => onAction('insertOrderedList')}
        title="Numbered List"
      >
        <FaListOl style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('insertUnorderedList')}
        title="Bullet List"
      >
        <FaListUl style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('quote')} title="Quote">
        <FaQuoteLeft style={{ fontSize: '12px' }} />
      </ToolbarButton>

      {/* Insert Buttons */}
      <ToolbarButton onClick={onInsertLink} title="Insert Link">
        <FaLink style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton onClick={onInsertTable} title="Insert Table">
        <FaTable style={{ fontSize: '12px' }} />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Clipboard and Deletion */}
      <ToolbarButton onClick={() => onAction('cut')} title="Cut (Ctrl+X)">
        <FaCut style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('copy')} title="Copy (Ctrl+C)">
        <FaCopy style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('paste')} title="Paste (Ctrl+V)">
        <FaPaste style={{ fontSize: '12px' }} />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('delete')} title="Delete">
        <FaTrashAlt style={{ fontSize: '12px' }} />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
