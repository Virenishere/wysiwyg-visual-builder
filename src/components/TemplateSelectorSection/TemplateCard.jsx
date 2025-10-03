import React from 'react';
import { FaDownload, FaEye } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import Link from 'next/link';

export default function TemplateCard({
  template,
  isSelected,
  onSelect,
  onLoad,
}) {
  // Fallback image URL
  const fallbackImage =
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=entropy&auto=format';

  return (
    <div
      key={template.id}
      className={`cursor-pointer transition-all duration-200 hover-shadow-lg ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="mb-4">
        <div className="flex items-center bg-[#E9EBED] h-6">
          <div className="flex ml-2">
            <span className="text-red-500">
              <GoDotFill size={15} />
            </span>
            <span className="text-yellow-500">
              <GoDotFill size={15} />
            </span>
            <span className="text-green-500">
              <GoDotFill size={15} />
            </span>
          </div>
        </div>

        {/* Image with hover overlay */}
        <div className="relative group" onClick={() => onSelect(template)}>
          <img
            src={template.thumbnail || fallbackImage}
            alt={template.name}
            className="w-full h-52 object-cover"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
            onLoad={(e) => {
              // Ensure image loaded successfully
              e.target.style.opacity = '1';
            }}
            style={{ opacity: '0', transition: 'opacity 0.3s ease' }}
          />

          {/* Hover Overlay with Buttons */}
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Edit Button */}
              <Link href={`/edit/${template.id}`}>
                <button
                  className="flex items-center justify-center px-4 py-2 w-24 
                  bg-blue-600 text-white rounded-full font-medium cursor-pointer 
                  transition-colors duration-300 hover:bg-blue-500"
                >
                  Edit
                </button>
              </Link>

              {/* View Button */}
              <Link href={`/preview/${template.id}`}>
                <button
                  className="flex items-center justify-center px-4 py-2 w-24 
                  bg-white border border-blue-600 text-black rounded-full font-medium cursor-pointer 
                  transition-colors duration-300 hover:bg-blue-600 hover:text-white"
                >
                  View
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <p className="font-semibold">{template.name}</p>
    </div>
  );
}
