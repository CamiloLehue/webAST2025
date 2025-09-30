export interface Activity {
  id: string;
  action: string;
  entityType: 'blog' | 'page' | 'menu' | 'user' | 'system';
  entityId?: string;
  entityTitle?: string;
  userId?: string;
  userName: string;
  timestamp: Date;
  details?: string;
}

export class ActivityService {
  private static readonly STORAGE_KEY = 'admin_activities';
  private static readonly MAX_ACTIVITIES = 50;

  static getActivities(): Activity[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const activities = JSON.parse(stored);
      return activities.map((activity: Omit<Activity, 'timestamp'> & { timestamp: string }) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  }

  static addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Activity {
    const newActivity: Activity = {
      ...activity,
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    try {
      const activities = this.getActivities();
      activities.unshift(newActivity);
      
      // Keep only the latest MAX_ACTIVITIES
      const trimmedActivities = activities.slice(0, this.MAX_ACTIVITIES);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedActivities));
      return newActivity;
    } catch (error) {
      console.error('Error saving activity:', error);
      return newActivity;
    }
  }

  static getRecentActivities(limit: number = 10): Activity[] {
    return this.getActivities()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  static getActivitiesByType(entityType: Activity['entityType']): Activity[] {
    return this.getActivities().filter(activity => activity.entityType === entityType);
  }

  static clearActivities(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Helper methods for common activities
  static logBlogAction(action: string, postTitle?: string, userName: string = 'Usuario'): Activity {
    return this.addActivity({
      action: `Post "${postTitle || 'Sin título'}" ${action}`,
      entityType: 'blog',
      entityTitle: postTitle,
      userName
    });
  }

  static logPageAction(action: string, pageTitle?: string, userName: string = 'Usuario'): Activity {
    return this.addActivity({
      action: `Página "${pageTitle || 'Sin título'}" ${action}`,
      entityType: 'page',
      entityTitle: pageTitle,
      userName
    });
  }

  static logMenuAction(action: string, userName: string = 'Usuario'): Activity {
    return this.addActivity({
      action: `Menú ${action}`,
      entityType: 'menu',
      userName
    });
  }

  static logUserAction(action: string, targetUser?: string, userName: string = 'Usuario'): Activity {
    return this.addActivity({
      action: `Usuario "${targetUser || 'Sin especificar'}" ${action}`,
      entityType: 'user',
      entityTitle: targetUser,
      userName
    });
  }

  static logSystemAction(action: string, userName: string = 'Sistema'): Activity {
    return this.addActivity({
      action,
      entityType: 'system',
      userName
    });
  }
}