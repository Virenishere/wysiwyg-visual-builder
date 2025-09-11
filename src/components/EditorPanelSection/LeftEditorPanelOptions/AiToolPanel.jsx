import { RxCross1 } from 'react-icons/rx';
import { MdConstruction } from 'react-icons/md';

export default function AiToolPanel({ onClose }) {
  return (
    <div className="w-96 bg-white h-full shadow-lg p-4 border-t-6 border-blue-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">AI Tools</h2>
        <RxCross1 size={24} className="cursor-pointer" onClick={onClose} />
      </div>

      {/* Full-width divider */}
      <div className="-mx-4 border-b border-gray-300 mb-4"></div>

      {/* Coming Soon Section */}
      <div className="flex flex-col items-center justify-center h-[70%] text-center text-gray-600">
        {/* Floating Icon */}
        <MdConstruction
          size={80}
          className="text-yellow-500 mb-4 animate-float"
        />

        {/* Text with subtle blink */}
        <h3 className="text-2xl font-bold text-gray-800 animate-blink">
          Coming Soon
        </h3>

        {/* Subtext */}
        <p className="text-sm text-gray-500 mt-2">
          We’re building AI-powered tools for you 🚀
        </p>
      </div>

      <style jsx>{`
        /* Smooth floating animation */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Gentle blink for text */
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-blink {
          animation: blink 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
