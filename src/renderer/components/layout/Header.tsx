import React from 'react';
import { AppLogo, ConnectButton } from '@/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Header: React.FC = () => {
  const isCoreRegistryUiApp = useSelector((state: RootState) => state.app.isCoreRegistryUiApp);

  if (isCoreRegistryUiApp) {
    // if running as a child app, the parent app provides the header.
    // return hidden connect button to show connect message if unable to connect
    return (
      <div className="hidden">
        <ConnectButton />
      </div>
    );
  }

  return (
    <div style={{ height: '64px' }}>
      <div className="border-t-8 border-green-400 pt-1 pb-1 w-screen h-16 bg-[#00242C] dark:bg-gray-800 dark:border-gray-600">
        {/* Expanded the container to full width and adjusted padding for larger breakpoints */}
        <div className="flex justify-between items-center h-full px-4 lg:px-10 w-full">
          {/* App logo with left alignment */}
          <div className="flex items-center h-full mr-5">
            <AppLogo width="100%" height="80%" type="" />
          </div>
          {/* Right-aligned elements with explicit right margin on larger breakpoints */}
          <div className="flex items-center gap-5 text-white">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export { Header };
