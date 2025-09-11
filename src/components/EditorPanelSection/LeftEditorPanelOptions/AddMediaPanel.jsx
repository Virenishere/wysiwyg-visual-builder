import { useMemo } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { FaTrashAlt, FaEye } from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';

export default function AddMediaPanel({ onClose }) {
  const { parents, removeAllImageElements, removeElement, setPreviewingImage } =
    useDivStore();

  const allImageElements = useMemo(() => {
    const images = [];
    parents.forEach((parent) => {
      parent.rnds.forEach((rnd) => {
        rnd.elements.forEach((element) => {
          if (element.type === 'image' && element.imageUrl) {
            images.push({
              ...element,
              parentId: parent.id,
              boxId: rnd.id,
            });
          }
        });
      });
    });
    return images;
  }, [parents]);

  return (
    <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Image Gallery</h2>
        <RxCross1 size={24} className="cursor-pointer" onClick={onClose} />
      </div>

      <div className="-mx-4 border-b border-gray-300 mb-4"></div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => {
            if (
              window.confirm(
                'Are you sure you want to delete all image elements? This action cannot be undone.'
              )
            ) {
              removeAllImageElements();
            }
          }}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <FaTrashAlt />
          Delete All Image Elements
        </button>

        <div className="grid grid-cols-3 gap-2 mt-4 overflow-y-auto">
          {allImageElements.length > 0 ? (
            allImageElements.map((imageElement) => (
              <div key={imageElement.id} className="relative group">
                <img
                  src={imageElement.imageUrl}
                  alt={`media-${imageElement.id}`}
                  className="w-full h-24 object-cover rounded-md cursor-pointer"
                  onClick={() => setPreviewingImage(imageElement.imageUrl)}
                />
                <div className="absolute inset-0 bg-transparent flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setPreviewingImage(imageElement.imageUrl)}
                    className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to remove this image element?'
                        )
                      ) {
                        removeElement(
                          imageElement.parentId,
                          imageElement.boxId,
                          imageElement.id
                        );
                      }
                    }}
                    className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500 mt-10">
              <p>No images found on the canvas.</p>
              <p className="text-sm">Add an image element to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
