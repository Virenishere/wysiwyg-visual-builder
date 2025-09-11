'use client';
import React from 'react';

export default function QuickGuide() {
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="text-xs font-semibold text-blue-700 mb-2">Quick Guide:</h4>
      <ul className="text-xs text-blue-600 space-y-1">
        <li>• Choose a template to get started quickly</li>
        <li>• Click on any element to select and edit</li>
        <li>• Double-click text elements to edit inline</li>
        <li>• Drag elements around inside boxes</li>
        <li>• Use resize handles to adjust sizes</li>
        <li>• Export your work to save progress</li>
      </ul>
    </div>
  );
}
