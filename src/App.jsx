import React, { useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sidebar } from './components/Sidebar';
import { ToastMessage } from './components/ToastMessage';
import { HomeScreen } from './screens/HomeScreen';
import { EncounterScreen } from './screens/EncounterScreen';
import { TrackerScreen } from './screens/TrackerScreen';
import { CampaignsScreen } from './screens/CampaignsScreen';
import { BestiaryScreen } from './screens/BestiaryScreen';
import { HomebrewScreen } from './screens/HomebrewScreen';
import { ItemsScreen } from './screens/ItemsScreen';
import { GrimoireScreen } from './screens/GrimoireScreen';
import { DMScreenTab } from './screens/DMScreenTab';
import { MenuScreen } from './screens/MenuScreen';

const AppContent = () => {
  const [currentRoute, setCurrentRoute] = useState('menu');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, lang } = useAppContext();

  return (
    <div className="min-h-screen bg-[#2B2C30] text-gray-200 font-sans selection:bg-[#FF1457]/30">
      <header className="bg-[#35313B] border-b border-[#453745] py-4 px-4 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-300 hover:text-[#FF1457] p-2 -ml-2 rounded-lg hover:bg-[#453745] transition-colors">
            <MenuIcon size={24} />
        </button>
        <h1 className="text-xl font-black text-[#FF1457] tracking-tight leading-none text-center flex-1">
            MESTRE DE BOLSO
        </h1>
        <div className="w-10"></div>
      </header>
      
      <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          onNavigate={setCurrentRoute}
          currentRoute={currentRoute}
          t={t}
          lang={lang}
      />
      
      <main className="w-full relative">
        {currentRoute === 'home' && <HomeScreen onNavigate={setCurrentRoute} />}
        {currentRoute === 'encounter' && <EncounterScreen onNavigate={setCurrentRoute} />}
        {currentRoute === 'tracker' && <TrackerScreen />}
        {currentRoute === 'campaigns' && <CampaignsScreen onNavigate={setCurrentRoute} />}
        {currentRoute === 'bestiary' && <BestiaryScreen />}
        {currentRoute === 'homebrew' && <HomebrewScreen onNavigate={setCurrentRoute} />}
        {currentRoute === 'items' && <ItemsScreen />}
        {currentRoute === 'grimoire' && <GrimoireScreen />}
        {currentRoute === 'library' && <DMScreenTab />}
        {currentRoute === 'menu' && <MenuScreen />}
      </main>

      <ToastMessage />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
