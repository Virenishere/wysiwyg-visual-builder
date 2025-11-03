'use client';
import React, { useState, useCallback, useRef } from 'react';
import {
  LuType,
  LuImage,
  LuUpload,
  LuLink,
  LuBold,
  LuItalic,
  LuUnderline,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlertCircle,
} from 'react-icons/lu';

export default function CardPropertiesPanel({
  element,
  onAddText,
  onAddImage,
  onUpdateItem,
  onDeleteItem,
}) {
  const [activeTab, setActiveTab] = useState('add');
  const [textInput, setTextInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const selectedItem = null; // editing in panel is optional; card handles in-canvas edits

  const [textFormat, setTextFormat] = useState({
    fontSize: 16,
    fontFamily: 'Arial, sans-serif',
    color: '#222222',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    textDecoration: 'none',
  });

  const validateText = useCallback((text) => {
    if (!text || text.trim().length === 0)
      return 'Text content cannot be empty';
    if (text.length > 500)
      return 'Text content must be less than 500 characters';
    return null;
  }, []);

  const validateImageUrl = useCallback((url) => {
    if (!url || url.trim().length === 0) return 'Image URL cannot be empty';
    try {
      new URL(url);
    } catch {
      return 'Please enter a valid URL';
    }
    if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      return 'URL must point to an image file (jpg, jpeg, png, gif, webp, svg)';
    }
    return null;
  }, []);

  const handleAddText = useCallback(() => {
    const error = validateText(textInput);
    if (error) {
      setValidationError(error);
      return;
    }
    onAddText({
      content: textInput.trim(),
      style: { ...textFormat },
    });
    setTextInput('');
    setValidationError('');
    setActiveTab('add');
  }, [textInput, textFormat, onAddText, validateText]);

  const handleAddImageUrl = useCallback(() => {
    const error = validateImageUrl(imageUrl);
    if (error) {
      setValidationError(error);
      return;
    }
    onAddImage({
      imageUrl: imageUrl.trim(),
      content: 'Image',
    });
    setImageUrl('');
    setValidationError('');
    setActiveTab('add');
  }, [imageUrl, onAddImage, validateImageUrl]);

  const handleFileUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image file must be less than 5MB');
        return;
      }
      setIsUploading(true);
      setUploadError('');

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result;
          if (url) {
            onAddImage({ imageUrl: url.toString(), content: file.name });
          }
          setIsUploading(false);
        };
        reader.onerror = () => {
          setUploadError('Failed to read image file');
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch {
        setUploadError('Failed to upload image');
        setIsUploading(false);
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [onAddImage]
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setValidationError('');
    setUploadError('');
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => handleTabChange('add')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'add'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Add Content
        </button>
      </div>

      {activeTab === 'add' && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <LuType className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-gray-900">Add Text</h3>
            </div>

            <div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter your text content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Example of formatting icons if used elsewhere */}
            <div className="flex items-center gap-2">
              <LuBold className="w-4 h-4" />
              <LuItalic className="w-4 h-4" />
              <LuUnderline className="w-4 h-4" />
              <LuAlignLeft className="w-4 h-4" />
              <LuAlignCenter className="w-4 h-4" />
              <LuAlignRight className="w-4 h-4" />
            </div>

            <button
              onClick={handleAddText}
              disabled={!textInput.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add Text to Card
            </button>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <LuImage className="w-4 h-4 text-green-600" />
              <h3 className="font-medium text-gray-900">Add Image</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <LuUpload className="w-4 h-4" />
                <span>
                  {isUploading ? 'Uploading...' : 'Choose Image File'}
                </span>
              </button>
            </div>

            <div className="text-center text-gray-500 text-sm">or</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddImageUrl}
                  disabled={!imageUrl.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <LuLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {(validationError || uploadError) && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <LuAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700">
                {validationError || uploadError}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
