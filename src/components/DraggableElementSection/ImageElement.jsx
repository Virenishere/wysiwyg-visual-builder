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
  const objectFit =
    getResponsiveValue(element.objectFit, screenSize) || 'cover';
  const objectPosition =
    getResponsiveValue(element.objectPosition, screenSize) || 'center';
  const filter = getResponsiveValue(element.filter, screenSize);
  const transform = getResponsiveValue(element.transform, screenSize);
  const opacity = getResponsiveValue(element.opacity, screenSize) || 1;

  // Check if imageUrl exists and is valid (handle both string and object cases)
  const imageUrl =
    typeof element.imageUrl === 'string' ? element.imageUrl : null;
  const hasValidImage = imageUrl && imageUrl !== null && imageUrl !== '';

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
        title={hasValidImage ? 'Change image' : 'Add image'}
      >
        {hasValidImage ? (
          <FiImage className="w-4 h-4" />
        ) : (
          <RiImageAddFill className="w-4 h-4" />
        )}
      </button>

      {hasValidImage ? (
        <div
          className="w-full h-full overflow-hidden"
          style={{
            borderRadius: `${borderRadius || 0}px`,
            border: border || 'none',
          }}
        >
          <img
            src={imageUrl}
            alt={element.content || 'Image'}
            className="w-full h-full select-none"
            style={{
              objectFit: objectFit,
              objectPosition: objectPosition,
              filter: filter,
              transform: transform,
              opacity: opacity,
            }}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              // Hide the broken image and show placeholder instead
              e.target.parentElement.style.display = 'none';
              e.target.parentElement.nextElementSibling.style.display = 'flex';
            }}
            onLoad={(e) => {
              e.target.style.display = 'block';
            }}
          />
        </div>
      ) : null}

      {/* Always render placeholder, but hide it when image is loaded */}
      <div
        className="border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-3 h-full rounded-lg"
        style={{ display: hasValidImage ? 'none' : 'flex' }}
      >
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
    </div>
  );
}
