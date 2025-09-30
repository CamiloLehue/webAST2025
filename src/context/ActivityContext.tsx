import React, { createContext } from 'react';
import type { ReactNode } from 'react';
import { useActivity } from '../hooks/useActivity';
import type { Activity } from '../services/activityService';

interface ActivityContextType {
  activities: Activity[];
  logActivity: (activity: Omit<Activity, 'id' | 'timestamp' | 'userName'>) => Activity;
  logBlogAction: (action: string, postTitle?: string) => void;
  logPageAction: (action: string, pageTitle?: string) => void;
  logMenuAction: (action: string) => void;
  logUserAction: (action: string, targetUser?: string) => void;
  logSystemAction: (action: string) => void;
  formatTimeAgo: (timestamp: Date) => string;
  clearActivities: () => void;
  refresh: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

interface ActivityProviderProps {
  children: ReactNode;
}

export const ActivityProvider: React.FC<ActivityProviderProps> = ({ children }) => {
  const activityHook = useActivity();

  return (
    <ActivityContext.Provider value={activityHook}>
      {children}
    </ActivityContext.Provider>
  );
};

export { ActivityContext };
export type { ActivityContextType };