import { IoSettings } from 'react-icons/io5';
import { FaCircleUser } from 'react-icons/fa6';
import { FaPlusCircle } from 'react-icons/fa';
import { BsStack } from 'react-icons/bs';
import { FcGallery } from 'react-icons/fc';
import { IoIosPaper } from 'react-icons/io';
import { RiChatAiFill } from 'react-icons/ri';
import AddElementPanel from './LeftEditorPanelOptions/AddElementPanel';
import AddMediaPanel from './LeftEditorPanelOptions/AddMediaPanel';
import AddSectionPanel from './LeftEditorPanelOptions/AddSectionPanel';
import AiToolPanel from './LeftEditorPanelOptions/AiToolPanel';
import useDivStore from '@/store/UseDivStore';
import SiteActionsPanel from './LeftEditorPanelOptions/SiteActionsPanel';
import Link from 'next/link';

const topIcons = [
  {
    id: 'settings',
    icon: IoSettings,
    size: 30,
    className: 'text-[#9a27d5]',
    showLabel: false,
    label: 'Settings',
  },
];

const middleIcons = [
  {
    id: 'addelements',
    icon: FaPlusCircle,
    size: 25,
    className: 'text-green-500 hover:text-green-600',
    showLabel: true,
    label: 'Add Elements',
    panel: 'AddElementPanel',
  },
  {
    id: 'addsection',
    icon: BsStack,
    size: 25,
    className: 'text-blue-500 hover:text-blue-600',
    showLabel: true,
    label: 'Add Section',
    panel: 'AddSectionPanel',
  },
  {
    id: 'media',
    icon: FcGallery,
    size: 25,
    className: '',
    showLabel: true,
    label: 'Media',
    panel: 'AddMediaPanel',
  },
  {
    id: 'siteactions',
    icon: IoIosPaper,
    size: 25,
    className: 'text-orange-500 hover:text-orange-600',
    showLabel: true,
    label: 'Site Actions',
    panel: 'SiteActionsPanel',
  },
];

const bottomIcons = [
  {
    id: 'chat-ai',
    icon: RiChatAiFill,
    size: 28,
    className: 'text-[#06b6d4] relative z-10 circle-gradient',
    showLabel: true,
    label: 'AI Tools',
    panel: 'AiToolPanel',
  },
  {
    id: 'user',
    icon: FaCircleUser,
    size: 30,
    className: 'text-gray-500 hover:text-purple-600',
    showLabel: false,
    label: 'Profile',
  },
];

export default function LeftEditorPanel() {
  const { leftPanel, setLeftPanel } = useDivStore();

  const handleIconClick = (panel) => {
    setLeftPanel(panel);
  };

  const handleClosePanel = () => {
    setLeftPanel(null);
  };

  const renderPanel = () => {
    switch (leftPanel) {
      case 'AddElementPanel':
        return <AddElementPanel onClose={handleClosePanel} />;
      case 'AddMediaPanel':
        return <AddMediaPanel onClose={handleClosePanel} />;
      case 'AddSectionPanel':
        return <AddSectionPanel onClose={handleClosePanel} />;
      case 'AiToolPanel':
        return <AiToolPanel onClose={handleClosePanel} />;
      case 'SiteActionsPanel':
        return <SiteActionsPanel onClose={handleClosePanel} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex" style={{ height: '100vh' }}>
      <div className="flex pb-4 md:pb-10 pt-4 md:pt-8 flex-col items-center w-12 md:w-16 justify-between bg-white shadow-[4px_0_10px_rgba(0,0,0,0.15)] z-20">
        {/* Top */}
        <div className="mt-2 md:mt-4">
          {topIcons.map(
            ({ id, icon: Icon, size, className, label, showLabel }) => (
              <Link
                key={id}
                href="/"
                className="group relative flex justify-center items-center w-8 h-8 md:w-12 md:h-12 cursor-pointer hover:scale-110 transition-transform"
              >
                <Icon size={size * 1} className={`md:text-base ${className}`} />
                {showLabel && (
                  <span
                    className="icon-label absolute left-10 md:left-14 top-1/2 -translate-y-1/2 whitespace-nowrap
                           bg-white text-black text-xs px-2 py-1 rounded shadow-lg
                           opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 
                           transition-all duration-200 z-[100] pointer-events-none hidden md:block"
                  >
                    {label}
                  </span>
                )}
              </Link>
            )
          )}
        </div>

        {/* Middle */}
        <div className="flex flex-col gap-1 md:gap-2 z-100">
          {middleIcons.map(
            ({ id, icon: Icon, size, className, label, showLabel, panel }) => (
              <div
                key={id}
                className={`group relative flex justify-center items-center w-8 h-8 md:w-12 md:h-12 cursor-pointer hover:scale-110 transition-all ${className} font-semibold`}
                onClick={() => handleIconClick(panel)}
              >
                <Icon size={size * 1} className="md:text-base" />
                {showLabel && (
                  <span
                    className="icon-label absolute left-10 md:left-14 top-2/3 -translate-y-1/2 whitespace-nowrap
                           bg-white text-black text-xs px-2 py-1 rounded shadow-lg
                           opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 
                           transition-all duration-200 z-[100] pointer-events-none hidden md:block"
                  >
                    {label}
                  </span>
                )}
              </div>
            )
          )}
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-2 md:gap-4 z-100">
          {bottomIcons.map(
            ({ id, icon: Icon, size, className, label, showLabel, panel }) => (
              <div
                key={id}
                className={`group relative flex justify-center items-center w-8 h-8 md:w-12 md:h-12 cursor-pointer rounded-full hover:scale-110 transition-all`}
                onClick={() => panel && handleIconClick(panel)}
              >
                <Icon
                  size={size * 1}
                  className={`${className} w-8 h-8 md:w-12 md:h-12 px-1 py-1 md:px-2 md:py-1`}
                />
                {showLabel && (
                  <span
                    className="icon-label absolute left-10 md:left-14 top-2/3 -translate-y-1/2 whitespace-nowrap
                           bg-white text-black text-xs px-2 py-1 rounded shadow-lg
                           opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 
                           transition-all duration-200 z-[100] pointer-events-none font-semibold hidden md:block"
                  >
                    {label}
                  </span>
                )}
              </div>
            )
          )}
        </div>
      </div>
      <div
        className={`fixed top-0 left-12 md:left-16 h-full transition-transform duration-300 ease-in-out transform z-100 ${
          leftPanel ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {renderPanel()}
      </div>
    </div>
  );
}
