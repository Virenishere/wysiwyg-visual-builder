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
import CustomizationPanel from './ElementPropertiesPanelSection/CustomizationPanel';
import { getResponsiveValue } from '@/utils/screen';
import CardPropertiesPanel from './DraggableElementSection/card/CardPropertiesPanel';
import { useState } from 'react';

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
    setSelectedElement, // <- use store to close panel
  } = useDivStore();

  const selectedParent = parents.find((p) => p.id === selectedParentId);
  const selectedBox = selectedParent?.rnds.find(
    (box) => box.id === selectedBoxId
  );
  const selectedElement = selectedBox?.elements?.find(
    (el) => el.id === selectedElementId
  );

  // Controls to show/hide Card properties and navigate back to element properties
  const [showCardPanel, setShowCardPanel] = useState(true);
  const closeCardPanel = () => setShowCardPanel(false);
  const openCardPanel = () => setShowCardPanel(true);
  const clearCardSelection = () => {
    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
      selectedItemId: null,
    });
  };

  // Back: exit Card view and go back to element properties
  const handleBackFromCard = () => {
    clearCardSelection();
    setShowCardPanel(false);
  };

  // Close: close the entire ElementPropertiesPanel (deselect element)
  const handleClosePanel = () => {
    setSelectedElement(null);
  };

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

  // Handlers: add card text/image from properties panel
  const addCardText = (payload) => {
    const existingItems = Array.isArray(selectedElement.items)
      ? selectedElement.items
      : [];
    const nextItems = [
      ...existingItems,
      {
        id: `text-${Date.now()}`,
        type: 'text',
        content: payload.content || 'Text',
        // Positioning is now flow-based; these sizes guide item box width
        x: 0,
        y: 0,
        width: Math.round(
          (getResponsiveValue(selectedElement.width, screenSize) || 300) * 0.5
        ),
        height: Math.round(
          (getResponsiveValue(selectedElement.height, screenSize) || 200) * 0.25
        ),
        zIndex: existingItems.length + 1,
        shadow: true,
        lockAspect: false,
        style: {
          fontSize: payload.style?.fontSize ?? 18,
          color: payload.style?.color ?? '#222',
          fontFamily: payload.style?.fontFamily ?? 'Arial, sans-serif',
          fontStyle: payload.style?.fontStyle ?? 'normal',
          fontWeight: payload.style?.fontWeight ?? 'normal',
          textAlign: payload.style?.textAlign ?? 'left',
          textDecoration: payload.style?.textDecoration ?? 'none',
        },
      },
    ];
    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
      items: nextItems,
    });
  };

  const addCardImage = (payload) => {
    const existingItems = Array.isArray(selectedElement.items)
      ? selectedElement.items
      : [];
    const nextItems = [
      ...existingItems,
      {
        id: `image-${Date.now()}`,
        type: 'image',
        imageUrl: payload.imageUrl || '',
        content: payload.content || 'Image',
        // Flow layout: use size hints, no absolute positions
        x: 0,
        y: 0,
        width: Math.round(
          (getResponsiveValue(selectedElement.width, screenSize) || 300) * 0.5
        ),
        height: Math.round(
          (getResponsiveValue(selectedElement.height, screenSize) || 200) * 0.3
        ),
        zIndex: existingItems.length + 1,
        shadow: true,
        lockAspect: true,
        style: {},
      },
    ];
    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
      items: nextItems,
    });
  };

  // Update/delete a selected card item (by selectedItemId on the card element)
  const selectedCardItem =
    selectedElement?.type === 'card' && Array.isArray(selectedElement.items)
      ? selectedElement.items.find(
          (it) => it.id === selectedElement.selectedItemId
        )
      : null;

  const updateCardItem = (patch) => {
    if (!selectedElement || selectedElement.type !== 'card') return;
    const targetId = selectedElement.selectedItemId;
    if (!targetId) return;
    const nextItems = (
      Array.isArray(selectedElement.items) ? selectedElement.items : []
    ).map((it) =>
      it.id === targetId
        ? {
            ...it,
            ...patch,
            style: patch.style ? { ...it.style, ...patch.style } : it.style,
          }
        : it
    );
    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
      items: nextItems,
    });
  };

  const deleteCardItem = (itemId) => {
    if (!selectedElement || selectedElement.type !== 'card') return;
    const nextItems = (
      Array.isArray(selectedElement.items) ? selectedElement.items : []
    ).filter((it) => it.id !== itemId);
    updateElement(selectedParentId, selectedBoxId, selectedElementId, {
      items: nextItems,
      selectedItemId: null, // Clear selection when deleting
    });
  };

  return (
    <div className="relative">
      {/* Background decoration must not block clicks */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl opacity-50 pointer-events-none z-0"></div>

      <div className="relative z-10 p-6 mb-4 rounded-2xl border border-purple-200 shadow-xl bg-white/80 backdrop-blur-sm overflow-y-auto overflow-x-hidden max-h-[calc(100vh-120px)] custom-scrollbar">
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

        {/* Inject Card properties panel */}
        {selectedElement?.type === 'card' && (
          <div className="mt-4 overflow-x-hidden">
            {/* Header row for Card section */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Card Properties
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBackFromCard}
                  className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleClosePanel}
                  className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>

            {showCardPanel ? (
              <CardPropertiesPanel
                element={selectedElement}
                onAddText={addCardText}
                onAddImage={addCardImage}
                selectedItem={selectedCardItem}
                onUpdateItem={updateCardItem}
                onDeleteItem={deleteCardItem}
                onClose={handleClosePanel}
                onGoBack={handleBackFromCard}
              />
            ) : (
              <button
                onClick={openCardPanel}
                className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
              >
                Open Card Panel
              </button>
            )}
          </div>
        )}

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

        {/* Styles (consolidated) */}
        <CssStylesPanel
          selectedElement={selectedElement}
          updateElement={updateElement}
          parentId={selectedParentId}
          boxId={selectedBoxId}
          elementId={selectedElementId}
        />

        {/* Advanced */}
        <CustomizationPanel
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
            {/* Spacing */}
            <Spacing
              selectedElement={selectedElement}
              updateElement={updateElement}
              parentId={selectedParentId}
              boxId={selectedBoxId}
              elementId={selectedElementId}
            />
            {/* Removed: Typography font size controls to simplify UI */}
            {/* Optional: keep Border Effects for non-line items if needed */}
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

function OtherPropertiesTab() {
  if (!selectedCardItem) return null;

  const isImage = selectedCardItem.type === 'image';
  const isText = selectedCardItem.type === 'text';

  const onChange = (patch) => {
    updateCardItem(patch);
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Border (applies to text and image items) */}
      <div>
        <h4 style={{ margin: '8px 0' }}>Border</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          <label>
            Border width (px)
            <input
              type="number"
              min="0"
              value={selectedCardItem.borderWidth ?? 0}
              onChange={(e) =>
                onChange({ borderWidth: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Border style
            <select
              value={selectedCardItem.borderStyle ?? 'solid'}
              onChange={(e) => onChange({ borderStyle: e.target.value })}
            >
              <option value="none">none</option>
              <option value="solid">solid</option>
              <option value="dashed">dashed</option>
              <option value="dotted">dotted</option>
              <option value="double">double</option>
              <option value="groove">groove</option>
              <option value="ridge">ridge</option>
              <option value="inset">inset</option>
              <option value="outset">outset</option>
            </select>
          </label>
          <label>
            Border color
            <input
              type="color"
              value={selectedCardItem.borderColor ?? '#000000'}
              onChange={(e) => onChange({ borderColor: e.target.value })}
            />
          </label>
          <label>
            Border radius (px)
            <input
              type="number"
              min="0"
              value={selectedCardItem.borderRadius ?? 0}
              onChange={(e) =>
                onChange({ borderRadius: Number(e.target.value) })
              }
            />
          </label>
        </div>
      </div>

      {/* Manual size (width/height) with optional lock */}
      <div>
        <h4 style={{ margin: '8px 0' }}>Size</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          <label>
            Width (px)
            <input
              type="number"
              min="0"
              value={selectedCardItem.width ?? 0}
              onChange={(e) => onChange({ width: Number(e.target.value) })}
            />
          </label>
          <label>
            Height (px)
            <input
              type="number"
              min="0"
              value={selectedCardItem.height ?? 0}
              onChange={(e) => onChange({ height: Number(e.target.value) })}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={!!selectedCardItem.lockSizing}
              onChange={(e) => onChange({ lockSizing: e.target.checked })}
            />
            Lock sizing to values above
          </label>
        </div>
      </div>

      {/* Image-only controls */}
      {isImage && (
        <div>
          <h4 style={{ margin: '8px 0' }}>Image</h4>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>
              Object fit
              <select
                value={selectedCardItem.objectFit ?? 'cover'}
                onChange={(e) => onChange({ objectFit: e.target.value })}
              >
                <option value="cover">cover</option>
                <option value="contain">contain</option>
                <option value="fill">fill</option>
                <option value="none">none</option>
                <option value="scale-down">scale-down</option>
              </select>
            </label>
            <label>
              Object position X (%)
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={selectedCardItem.objectPositionX ?? 50}
                onChange={(e) =>
                  onChange({ objectPositionX: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Object position Y (%)
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={selectedCardItem.objectPositionY ?? 50}
                onChange={(e) =>
                  onChange({ objectPositionY: Number(e.target.value) })
                }
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={!!selectedCardItem.optimizeImage}
                onChange={(e) => onChange({ optimizeImage: e.target.checked })}
              />
              Use Next.js image optimization
            </label>
          </div>
        </div>
      )}

      {/* Text-only controls */}
      {isText && (
        <div>
          <h4 style={{ margin: '8px 0' }}>Text</h4>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>
              Content
              <textarea
                rows={4}
                value={selectedCardItem.content ?? ''}
                onChange={(e) => onChange({ content: e.target.value })}
              />
            </label>
            <label>
              White-space
              <select
                value={selectedCardItem.whiteSpace ?? 'normal'}
                onChange={(e) => onChange({ whiteSpace: e.target.value })}
              >
                <option value="normal">normal</option>
                <option value="nowrap">nowrap</option>
                <option value="pre">pre</option>
                <option value="pre-wrap">pre-wrap</option>
                <option value="pre-line">pre-line</option>
              </select>
            </label>
            <label>
              Word-break
              <select
                value={selectedCardItem.wordBreak ?? 'normal'}
                onChange={(e) => onChange({ wordBreak: e.target.value })}
              >
                <option value="normal">normal</option>
                <option value="break-word">break-word</option>
                <option value="break-all">break-all</option>
                <option value="keep-all">keep-all</option>
              </select>
            </label>
            <label>
              Letter-spacing (px)
              <input
                type="number"
                step="0.5"
                value={selectedCardItem.letterSpacing ?? 0}
                onChange={(e) =>
                  onChange({ letterSpacing: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Line-height
              <input
                type="number"
                step="0.1"
                value={selectedCardItem.lineHeight ?? 1.4}
                onChange={(e) =>
                  onChange({ lineHeight: Number(e.target.value) })
                }
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
