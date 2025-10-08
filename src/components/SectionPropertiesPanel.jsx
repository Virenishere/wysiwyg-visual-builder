'use client';
import useDivStore from '@/store/UseDivStore';
import { FiMaximize2 } from 'react-icons/fi';
import SectionHeight from './SectionPropertiesPanel/SectionHeight';

export default function SectionPropertiesPanel() {
  const { parents, selectedParentId, updateParentSize } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);

  if (!selectedParent) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl opacity-50"></div>
      <div className="relative p-6 mb-4 rounded-2xl border border-purple-200 shadow-xl bg-white/80 backdrop-blur-sm overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
            <FiMaximize2 className="w-3.5 h-3.5 text-white" />
          </div>
          <h4 className="text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Section Properties
          </h4>
        </div>
        <SectionHeight
          selectedParent={selectedParent}
          updateParentSize={updateParentSize}
        />
      </div>
    </div>
  );
}
