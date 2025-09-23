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
} from 'react-icons/fa';
import { MdOutlineFormatColorText, MdFormatColorFill } from 'react-icons/md';
import { LuHeading } from 'react-icons/lu';
import { BiUndo, BiRedo } from 'react-icons/bi';
import { FONT_FAMILIES } from './FontFamilies';
import { TEXT_FORMATS } from './FontFormat';

const ToolbarButton = ({ onClick, title, children }) => (
  <button
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()} // Prevents the editor from losing focus.
    title={title}
    className="p-2 rounded hover:bg-gray-200 cursor-pointer"
    type="button"
  >
    {children}
  </button>
);

// A reusable color picker button for the toolbar.
const ColorPicker = ({ onChange, title, children }) => {
  const colorRef = React.useRef(null);
  return (
    <div className="relative" title={title}>
      <button
        onClick={() => colorRef.current?.click()}
        onMouseDown={(e) => e.preventDefault()} // Prevents focus loss.
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        {children}
      </button>
      <input
        ref={colorRef}
        type="color"
        className="absolute opacity-0 w-0 h-0"
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1} // Hide from keyboard navigation.
      />
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-gray-50 cursor-pointer"
        onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {icon}
        <span className="text-sm">{selected}</span>
        <FaChevronDown className="text-xs" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 bg-white border rounded shadow-lg z-10 min-w-full">
          {options.map((option) => (
            <button
              key={option.value}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              onClick={() => {
                onSelect(option.value);
                setSelected(option.label);
                setIsOpen(false);
              }}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Toolbar = ({
  onAction,
  onFontChange,
  onHeadingChange,
  onColorChange,
  onBackgroundColorChange,
  onInsertLink,
  onInsertTable,
}) => {
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
        e.preventDefault();
        onAction('delete');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onAction]);

  return (
    <div className="bg-gray-100 rounded-md p-2 shadow-md flex flex-wrap gap-2 items-center">
      {/* Action Buttons */}
      <ToolbarButton onClick={() => onAction('undo')} title="Undo (Ctrl+Z)">
        <BiUndo />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('redo')} title="Redo (Ctrl+Y)">
        <BiRedo />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-2" />

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

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Style Buttons */}
      <ToolbarButton onClick={() => onAction('bold')} title="Bold (Ctrl+B)">
        <FaBold />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('italic')} title="Italic (Ctrl+I)">
        <FaItalic />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('underline')}
        title="Underline (Ctrl+U)"
      >
        <FaUnderline />
      </ToolbarButton>

      {/* Color Pickers */}
      <ColorPicker onChange={onColorChange} title="Text Color">
        <MdOutlineFormatColorText />
      </ColorPicker>
      <ColorPicker onChange={onBackgroundColorChange} title="Background Color">
        <MdFormatColorFill />
      </ColorPicker>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Alignment Buttons */}
      <ToolbarButton onClick={() => onAction('justifyLeft')} title="Align Left">
        <FaAlignLeft />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('justifyCenter')}
        title="Align Center"
      >
        <FaAlignCenter />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('justifyRight')}
        title="Align Right"
      >
        <FaAlignRight />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* List and Block Buttons */}
      <ToolbarButton
        onClick={() => onAction('insertOrderedList')}
        title="Numbered List"
      >
        <FaListOl />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onAction('insertUnorderedList')}
        title="Bullet List"
      >
        <FaListUl />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('quote')} title="Quote">
        <FaQuoteLeft />
      </ToolbarButton>

      {/* Insert Buttons */}
      <ToolbarButton onClick={onInsertLink} title="Insert Link">
        <FaLink />
      </ToolbarButton>
      <ToolbarButton onClick={onInsertTable} title="Insert Table">
        <FaTable />
      </ToolbarButton>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Clipboard and Deletion */}
      <ToolbarButton onClick={() => onAction('cut')} title="Cut (Ctrl+X)">
        <FaCut />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('copy')} title="Copy (Ctrl+C)">
        <FaCopy />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('paste')} title="Paste (Ctrl+V)">
        <FaPaste />
      </ToolbarButton>
      <ToolbarButton onClick={() => onAction('delete')} title="Delete">
        <FaTrashAlt />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
