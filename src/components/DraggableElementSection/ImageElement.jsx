'use client';
import { FiPlus, FiImage } from 'react-icons/fi';
import { RiImageAddFill } from 'react-icons/ri';
import { getResponsiveValue } from '@/utils/screen';
import useDivStore from '@/store/UseDivStore';

export default function ImageElement({
  element,
  parentId,
  boxId,
  updateElement,
  fileInputRef,
}) {
  const { screenSize } = useDivStore();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        updateElement(parentId, boxId, element.id, {
          imageUrl: ev.target.result,
          content: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const borderRadius = getResponsiveValue(element.borderRadius, screenSize);
  const border = getResponsiveValue(element.border, screenSize);

  return (
    <div className="relative w-full h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        className="absolute -top-2 -right-2 z-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        title={element.imageUrl ? 'Change image' : 'Add image'}
      >
        {element.imageUrl ? (
          <FiImage className="w-4 h-4" />
        ) : (
          <RiImageAddFill className="w-4 h-4" />
        )}
      </button>

      {element.imageUrl ? (
        /* removed all hover effects, scaling, and preview button from image display */
        <div
          className="w-full h-full overflow-hidden"
          style={{
            borderRadius: `${borderRadius || 0}px`,
            border: border || 'none',
          }}
        >
          <img
            src={element.imageUrl || '/placeholder.svg'}
            alt={element.content}
            className="w-full h-full object-cover select-none"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </div>
      ) : (
        /* kept placeholder div simple without any interactions */
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-3 h-full rounded-lg">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <FiImage className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-gray-500 block">
              No image selected
            </span>
            <span className="text-xs text-gray-400 mt-1 block">
              Use the + button to add an image
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
