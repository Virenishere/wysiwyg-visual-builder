import { IoSettings } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { BsStack } from "react-icons/bs";


export default function LeftEditorPanel() {
  return (
    <div className="flex pb-10 pt-8 flex-col items-center h-screen w-16 justify-between bg-white shadow-[4px_0_10px_rgba(0,0,0,0.15)]">
      <div className="text-[#9a27d5] mt-4">
        <IoSettings size={30} />
      </div>
      <div>
        <FaPlusCircle />
        <BsStack />
      </div>
      <div><FaCircleUser size={30} /></div>
    </div>
  )
}
