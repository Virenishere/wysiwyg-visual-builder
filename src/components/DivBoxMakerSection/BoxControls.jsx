import React from 'react';
import useDivStore from '@/store/UseDivStore';

export default function BoxControls({ parentId, box }) {
  const { updateRnd } = useDivStore();

  const update = (key, value) => {
    updateRnd(parentId, box.id, { [key]: parseInt(value) || 0 });
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-3">
      {['width', 'height', 'x', 'y'].map((prop) => (
        <div className="flex flex-col" key={prop}>
          <label className="text-xs font-medium text-gray-600 mb-1">
            {prop.charAt(0).toUpperCase() + prop.slice(1)}
          </label>
          <input
            type="number"
            value={box[prop]}
            onChange={(e) => update(prop, e.target.value)}
            className="border p-2 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            placeholder={prop}
          />
        </div>
      ))}
    </div>
  );
}
