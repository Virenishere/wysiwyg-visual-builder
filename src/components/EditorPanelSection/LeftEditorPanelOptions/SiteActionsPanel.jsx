import { RxCross1 } from "react-icons/rx";
import { IoEyeSharp } from "react-icons/io5";
import { MdSave } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import Link from "next/link";

export default function SiteActionsPanel({ onClose }) {
  return (
    <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Site Actions</h2>
        <RxCross1 size={24} className="cursor-pointer" onClick={onClose} />
      </div>

      {/* Divider (fixed to not overflow) */}
      <div className="-mx-4 border-b border-gray-300 mb-4"></div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        {/* Preview */}
        <Link href="/preview">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
            <IoEyeSharp className="text-blue-500" size={20} />
            <span className="text-gray-800 font-medium">Preview This Site</span>
          </button>
        </Link>

        {/* Save as Draft */}
        <Link href="/save-draft">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
            <MdSave className="text-green-600" size={20} />
            <span className="text-gray-800 font-medium">Save as Draft</span>
          </button>
        </Link>

        {/* Host Page */}
        <Link href="/host-site">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
            <FaGlobe className="text-purple-600" size={20} />
            <span className="text-gray-800 font-medium">Host This Page on Site</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
