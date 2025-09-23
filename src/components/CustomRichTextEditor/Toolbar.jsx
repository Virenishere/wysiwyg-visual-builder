import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+c': 'copy',
  'mod+v': 'paste',
  'mod+x': 'cut',
  delete: 'delete',
  'mod+z': 'undo',
  'mod+y': 'redo',
};

const FONTS = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Courier New',
  'Comic Sans MS',
  'Impact',
  'Trebuchet MS',
  'Palatino',
];

const HEADINGS = [
  { label: 'Normal', value: 'div' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
  { label: 'Heading 5', value: 'h5' },
  { label: 'Heading 6', value: 'h6' },
];

const Dropdown = ({ options, onSelect, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(placeholder);
  const dropdownRef = useRef(null);

  useEffect(() => {
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
  const textColorRef = useRef(null);
  const bgColorRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
      const mod = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key.toLowerCase();

      let action;

      if (mod && HOTKEYS[`mod+${key}`]) {
        action = HOTKEYS[`mod+${key}`];
      } else if (key === 'delete') {
        action = 'delete';
      }

      if (action) {
        e.preventDefault();
        onAction(action);
      }
    },
    [onAction]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent focus loss on all toolbar interactions
  const handleButtonMouseDown = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-gray-100 rounded-md p-2 shadow-md flex flex-wrap gap-2 items-center">
      <Dropdown
        options={FONTS.map((font) => ({ label: font, value: font }))}
        onSelect={onFontChange}
        placeholder="Font Style"
      />

      <Dropdown
        options={HEADINGS}
        onSelect={onHeadingChange}
        placeholder="Normal"
        icon={<LuHeading />}
      />

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button
        onClick={() => onAction('bold')}
        onMouseDown={handleButtonMouseDown}
        title="Bold (Ctrl+B)"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaBold />
      </button>

      <button
        onClick={() => onAction('italic')}
        onMouseDown={handleButtonMouseDown}
        title="Italic (Ctrl+I)"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaItalic />
      </button>

      <button
        onClick={() => onAction('underline')}
        onMouseDown={handleButtonMouseDown}
        title="Underline (Ctrl+U)"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaUnderline />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <div className="relative">
        <button
          onClick={() => textColorRef.current?.click()}
          onMouseDown={handleButtonMouseDown}
          title="Text Color"
          className="p-2 rounded hover:bg-gray-200 cursor-pointer"
          type="button"
        >
          <MdOutlineFormatColorText />
        </button>
        <input
          ref={textColorRef}
          type="color"
          className="absolute opacity-0 w-0 h-0"
          onChange={(e) => onColorChange(e.target.value)}
          tabIndex={-1}
        />
      </div>

      <div className="relative">
        <button
          onClick={() => bgColorRef.current?.click()}
          onMouseDown={handleButtonMouseDown}
          title="Background Color"
          className="p-2 rounded hover:bg-gray-200 cursor-pointer"
          type="button"
        >
          <MdFormatColorFill />
        </button>
        <input
          ref={bgColorRef}
          type="color"
          className="absolute opacity-0 w-0 h-0"
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          tabIndex={-1}
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button
        onClick={() => onAction('alignLeft')}
        onMouseDown={handleButtonMouseDown}
        title="Align Left"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaAlignLeft />
      </button>
      <button
        onClick={() => onAction('alignCenter')}
        onMouseDown={handleButtonMouseDown}
        title="Align Center"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaAlignCenter />
      </button>
      <button
        onClick={() => onAction('alignRight')}
        onMouseDown={handleButtonMouseDown}
        title="Align Right"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaAlignRight />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button
        onClick={() => onAction('orderedList')}
        onMouseDown={handleButtonMouseDown}
        title="Numbered List"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaListOl />
      </button>
      <button
        onClick={() => onAction('unorderedList')}
        onMouseDown={handleButtonMouseDown}
        title="Bullet List"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaListUl />
      </button>

      <button
        onClick={() => onAction('quote')}
        onMouseDown={handleButtonMouseDown}
        title="Quote"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaQuoteLeft />
      </button>

      <button
        onClick={onInsertLink}
        onMouseDown={handleButtonMouseDown}
        title="Insert Link"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaLink />
      </button>

      <button
        onClick={onInsertTable}
        onMouseDown={handleButtonMouseDown}
        title="Insert Table"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaTable />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button
        onClick={() => onAction('undo')}
        onMouseDown={handleButtonMouseDown}
        title="Undo (Ctrl+Z)"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <BiUndo />
      </button>
      <button
        onClick={() => onAction('redo')}
        onMouseDown={handleButtonMouseDown}
        title="Redo (Ctrl+Y)"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <BiRedo />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button
        onClick={() => onAction('cut')}
        onMouseDown={handleButtonMouseDown}
        title="Cut (Ctrl+X)"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaCut />
      </button>

      <button
        onClick={() => onAction('copy')}
        onMouseDown={handleButtonMouseDown}
        title="Copy (Ctrl+C)"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaCopy />
      </button>

      <button
        onClick={() => onAction('paste')}
        onMouseDown={handleButtonMouseDown}
        title="Paste (Ctrl+V)"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaPaste />
      </button>

      <button
        onClick={() => onAction('delete')}
        onMouseDown={handleButtonMouseDown}
        title="Delete"
        className="p-2 rounded hover:bg-gray-200 cursor-pointer"
        type="button"
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default Toolbar;
