import DivBoxMaker from "@/components/DivBoxMaker";
import { RxCross1 } from "react-icons/rx";

export default function AddElementPanel({ onClose }) {
  return (
    <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Add Elements</h2>
        <RxCross1 size={24} className="cursor-pointer" onClick={onClose} />
      </div>

      {/* Full-width divider */}
      <div className="-mx-4 border-b border-gray-300 mb-4">

      <DivBoxMaker />
      </div>
      <div>
        
      </div>
    </div>
  );
}
