'use client';
import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import useDivStore from '@/store/UseDivStore';
import toast from 'react-hot-toast';

export default function SaveTemplateModal({ onClose }) {
  const [templateName, setTemplateName] = useState('');
  const { layouts, saveState } = useDivStore();

  const handleSave = () => {
    if (templateName.trim() === '') {
      toast.error('Please enter a template name.');
      return;
    }

    // First, save the current state to update layouts
    saveState();

    // Get the latest layouts after saving
    const updatedLayouts = useDivStore.getState().layouts;

    const savedTemplates = JSON.parse(
      localStorage.getItem('savedTemplates') || '{}'
    );
    savedTemplates[templateName] = {
      id: templateName,
      name: templateName,
      description: 'A custom saved template.',
      thumbnail:
        'https://images.unsplash.com/photo-1621155346337-7d1947ea715d?w=200&h=150&fit=crop',
      layouts: updatedLayouts, // Save the entire layouts object
    };
    localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
    toast.success(`Template "${templateName}" saved successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Save Template</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <RxCross1 size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <label
            htmlFor="templateName"
            className="block text-sm font-medium text-gray-700"
          >
            Template Name
          </label>
          <input
            type="text"
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., My Awesome Design"
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
