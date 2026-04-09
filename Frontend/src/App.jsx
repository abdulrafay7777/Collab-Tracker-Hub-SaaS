import React, { useState, useMemo } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import Workspace from './pages/Workspace';
import FlagModal from './components/FlagModal';
import WorkSessions from './components/WorkSessions';
import FlagFeed from './components/FlagFeed';
import ProgressFeed from './components/ProgressFeed';

function App() {
  const [currentTab, setCurrentTab] = useState('My Tasks');
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);

  // Professional Tip: Use a Map for cleaner lookups than a switch case
  const tabComponents = {
    'My Tasks': <Workspace />,
    'Work Sessions': <WorkSessions />,
    'Progress Updates': <ProgressFeed />,
    'Flag Delay': <FlagFeed />,
  };

  const handleTabChange = (tabName) => {
    if (tabName === 'Flag Delay') {
      setIsFlagModalOpen(true);
    } else {
      setCurrentTab(tabName);
    }
  };

  return (
    <>
      <DashboardLayout 
        activeTab={currentTab} 
        onNavigateTab={handleTabChange} 
      >
        {/* Render the component based on the key, fallback to Workspace */}
        {tabComponents[currentTab] || <Workspace />}
      </DashboardLayout>

      <FlagModal 
        isOpen={isFlagModalOpen} 
        onClose={() => setIsFlagModalOpen(false)} 
        tasks={[]} 
        onSubmitSuccess={(tab) => setCurrentTab(tab)}
      />
    </>
  );
}

export default App;