'use client';
import { FiMaximize2 } from 'react-icons/fi';

export default function SectionHeight({ selectedParent, updateParentSize }) {
  const fields = [
    {
      label: 'Height',
      key: 'height',
      icon: <FiMaximize2 className="w-4 h-4" />,
      max: 10000,
    },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-4">
        {fields.map(({ label, key, icon, max }) => (
          <div
            key={key}
            className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100"
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                {icon}
                {label}
              </label>
              <span className="px-2 py-1 bg-white rounded-lg text-xs font-bold text-gray-600 border">
                {selectedParent?.size?.[key]
                  ? `${selectedParent.size[key]}px`
                  : 'auto'}
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="number"
                max={max}
                placeholder="Enter height (e.g., 300)"
                value={selectedParent?.size?.[key] || ''}
                onChange={(e) =>
                  updateParentSize(selectedParent.id, {
                    [key]: Number.parseInt(e.target.value) || undefined,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
