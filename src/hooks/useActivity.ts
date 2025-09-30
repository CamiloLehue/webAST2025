import { useState, useEffect } from 'react';
import type { Activity } from '../services/activityService';
import { ActivityService } from '../services/activityService';
import { useAuth } from './useAuth';

export const useActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    const recentActivities = ActivityService.getRecentActivities(10);
    setActivities(recentActivities);
  };

  const logActivity = (activity: Omit<Activity, 'id' | 'timestamp' | 'userName'>) => {
    const userName = user?.name || user?.email || 'Usuario';
    const newActivity = ActivityService.addActivity({
      ...activity,
      userName
    });
    loadActivities(); // Refresh the list
    return newActivity;
  };

  const logBlogAction = (action: string, postTitle?: string) => {
    const userName = user?.name || user?.email || 'Usuario';
    ActivityService.logBlogAction(action, postTitle, userName);
    loadActivities();
  };

  const logPageAction = (action: string, pageTitle?: string) => {
    const userName = user?.name || user?.email || 'Usuario';
    ActivityService.logPageAction(action, pageTitle, userName);
    loadActivities();
  };

  const logMenuAction = (action: string) => {
    const userName = user?.name || user?.email || 'Usuario';
    ActivityService.logMenuAction(action, userName);
    loadActivities();
  };

  const logUserAction = (action: string, targetUser?: string) => {
    const userName = user?.name || user?.email || 'Usuario';
    ActivityService.logUserAction(action, targetUser, userName);
    loadActivities();
  };

  const logSystemAction = (action: string) => {
    const userName = user?.name || user?.email || 'Sistema';
    ActivityService.logSystemAction(action, userName);
    loadActivities();
  };

  const clearActivities = () => {
    ActivityService.clearActivities();
    setActivities([]);
  };

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    
    return timestamp.toLocaleDateString();
  };

  return {
    activities,
    logActivity,
    logBlogAction,
    logPageAction,
    logMenuAction,
    logUserAction,
    logSystemAction,
    clearActivities,
    formatTimeAgo,
    refresh: loadActivities
  };
};