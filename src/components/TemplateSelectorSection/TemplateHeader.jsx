import React from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import Link from 'next/link';

export default function TemplateHeader({ onClose }) {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">Choose a Template</h2>
      <div className="flex items-center gap-4">
        <Link href="/edit/blank">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            <FaPlus />
            Create New Page
          </button>
        </Link>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaTimes className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
