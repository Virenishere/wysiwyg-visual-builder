'use client';
import React from 'react';
import Link from 'next/link';
import { FaGlobe } from 'react-icons/fa6';
import { MdRemoveRedEye } from 'react-icons/md';

export default function ActionButtons() {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <Link
        href="/preview"
        className="flex items-center justify-center bg-purple-500 px-3 py-2 gap-2 rounded-lg text-white font-semibold hover:bg-purple-600 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-xs"
      >
        <MdRemoveRedEye />
        Preview
      </Link>

      <button className="bg-green-500 flex items-center justify-center px-3 py-2 gap-2 rounded-lg text-white font-semibold hover:bg-green-600 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-xs">
        <FaGlobe />
        Publish
      </button>
    </div>
  );
}
