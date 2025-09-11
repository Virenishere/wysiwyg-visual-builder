import React from 'react';
import { FaPlusSquare } from 'react-icons/fa';
import useDivStore from '@/store/UseDivStore';

export default function AddDivButton({ parentId }) {
  const { addRnd } = useDivStore();

  return (
    <button
      onClick={() => addRnd(parentId)}
      className="bg-green-500 text-white px-3 py-2 mt-2 rounded-lg mb-4 w-full flex justify-center items-center gap-2 font-semibold transition-all duration-300 hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
    >
      <FaPlusSquare className="text-lg" /> Add Div to Selected Box
    </button>
  );
}
