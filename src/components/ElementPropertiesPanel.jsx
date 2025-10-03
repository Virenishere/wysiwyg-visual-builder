'use client';
import useDivStore from '@/store/UseDivStore';
import { FiTarget } from 'react-icons/fi';
import Header from './ElementPropertiesPanelSection/Header';
import PositionSize from './ElementPropertiesPanelSection/PositionSize';
import Spacing from './ElementPropertiesPanelSection/Spacing';
import Typography from './ElementPropertiesPanelSection/Typography';
import BorderEffects from './ElementPropertiesPanelSection/BorderEffects';
import ContentInput from './ElementPropertiesPanelSection/ContentInput';
import LineElementProperties from './ElementPropertiesPanelSection/LineElementProperties';
import ImagePropertiesPanel from './ElementPropertiesPanelSection/ImagePropertiesPanel';
import CssStylesPanel from './ElementPropertiesPanelSection/CssStylesPanel';

export default function ElementPropertiesPanel() {
  const {
    parents,
    selectedParentId,
    selectedBoxId,
    selectedElementId,
    updateElement,
    removeElement,
    duplicateElement,
    copyDesktopToAllScreens,
    screenSize,
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find(
    (box) => box.id === selectedBoxId
  );
  const selectedElement = selectedBox?.elements?.find(
    (el) => el.id === selectedElementId
  );

  if (!selectedElement) {
    return (
      <div className="p-8 mb-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
            <FiTarget className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-2">
            No Element Selected
          </p>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Click on any element in your design to start customizing its
            properties with our modern controls
          </p>

          {/* Desktop-first responsive helper */}
          {screenSize === '4k' && (
            <button
              onClick={copyDesktopToAllScreens}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition-colors"
            >
              Copy Desktop Layout to All Screens
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl opacity-50"></div>

      <div className="relative p-6 mb-4 rounded-2xl border border-purple-200 shadow-xl bg-white/80 backdrop-blur-sm overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
        {/* Header */}
        <Header
          selectedElement={selectedElement}
          selectedParentId={selectedParentId}
          selectedBoxId={selectedBoxId}
          selectedElementId={selectedElementId}
          removeElement={removeElement}
          duplicateElement={duplicateElement}
        />

        {/* Desktop-first helper */}
        {screenSize === '4k' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 mb-2">
              🖥️ Desktop-first design: Changes here will be copied to all screen
              sizes
            </p>
            <button
              onClick={copyDesktopToAllScreens}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Copy to All Screens
            </button>
          </div>
        )}

        {/* Content Input */}
        <ContentInput
          selectedElement={selectedElement}
          updateElement={updateElement}
          parentId={selectedParentId}
          boxId={selectedBoxId}
          elementId={selectedElementId}
        />

        {/* Position & Size */}
        <PositionSize
          selectedElement={selectedElement}
          updateElement={updateElement}
          parentId={selectedParentId}
          boxId={selectedBoxId}
          elementId={selectedElementId}
        />

        {/* Image Properties (only for images) */}
        <ImagePropertiesPanel
          selectedElement={selectedElement}
          updateElement={updateElement}
          parentId={selectedParentId}
          boxId={selectedBoxId}
          elementId={selectedElementId}
        />

        {/* CSS Styles & Animation */}
        <CssStylesPanel
          selectedElement={selectedElement}
          updateElement={updateElement}
          parentId={selectedParentId}
          boxId={selectedBoxId}
          elementId={selectedElementId}
        />

        {selectedElement.type === 'line' ? (
          <LineElementProperties
            selectedElement={selectedElement}
            updateElement={updateElement}
            parentId={selectedParentId}
            boxId={selectedBoxId}
            elementId={selectedElementId}
          />
        ) : (
          <>
            <Spacing
              selectedElement={selectedElement}
              updateElement={updateElement}
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={selectedElementId}
            />

            <Typography
              selectedElement={selectedElement}
              updateElement={updateElement}
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={selectedElementId}
            />

            <BorderEffects
              selectedElement={selectedElement}
              updateElement={updateElement}
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={selectedElementId}
            />
          </>
        )}
      </div>
    </div>
  );
}
