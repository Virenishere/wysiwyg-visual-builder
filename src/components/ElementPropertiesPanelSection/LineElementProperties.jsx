'use client';

export default function LineElementProperties({
  selectedElement,
  updateElement,
  parentId,
  boxId,
  elementId,
}) {
  const handleStyleChange = (property, value) => {
    updateElement(parentId, boxId, elementId, {
      style: { ...selectedElement.style, [property]: value },
    });
  };

  const handleSizeChange = (property, value) => {
    updateElement(parentId, boxId, elementId, {
      [property]: value,
    });
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-4">Line Properties</h4>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Thickness (height)
          </label>
          <input
            type="number"
            placeholder="e.g., 2"
            value={selectedElement.height}
            onChange={(e) =>
              handleSizeChange('height', parseInt(e.target.value, 10))
            }
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Color
          </label>
          <input
            type="color"
            value={
              selectedElement.style?.backgroundColor !== 'transparent'
                ? selectedElement.style?.backgroundColor
                : '#ffffff'
            }
            onChange={(e) =>
              handleStyleChange('backgroundColor', e.target.value)
            }
            className="w-full h-10 px-1 py-1 bg-white border border-gray-300 rounded-md cursor-pointer"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Shadow
          </label>
          <select
            value={selectedElement.style?.boxShadow}
            onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm"
          >
            <option value="none">None</option>
            <option value="0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)">
              Small
            </option>
            <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)">
              Medium
            </option>
            <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)">
              Large
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
