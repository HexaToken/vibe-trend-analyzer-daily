import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

// Types for app state
export type ViewType = 
  | "sentiment" 
  | "analytics" 
  | "history" 
  | "community" 
  | "profile" 
  | "settings" 
  | "database" 
  | "social" 
  | "crypto" 
  | "nlp" 
  | "spacy-nlp" 
  | "finnhub" 
  | "sentiment-scoring" 
  | "ai-analysis" 
  | "yfinance" 
  | "channels" 
  | "moorMeter";

export interface NotificationState {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface AppState {
  // Navigation state
  activeSection: ViewType;
  setActiveSection: (section: ViewType) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme state
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Notifications state
  notifications: NotificationState[];
  addNotification: (notification: Omit<NotificationState, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // App-wide loading states
  isInitializing: boolean;
  setIsInitializing: (loading: boolean) => void;
  
  // Feature flags
  features: {
    aiChat: boolean;
    cryptoTrading: boolean;
    socialFeeds: boolean;
    realTimeUpdates: boolean;
  };
  toggleFeature: (feature: keyof AppState['features']) => void;

  // User preferences (persisted)
  preferences: {
    defaultView: ViewType;
    autoRefresh: boolean;
    compactMode: boolean;
    showNotifications: boolean;
  };
  updatePreferences: (prefs: Partial<AppState['preferences']>) => void;

  // Performance monitoring
  performanceMetrics: {
    lastRenderTime: number;
    componentMountCount: number;
    errorCount: number;
  };
  updatePerformanceMetrics: (metrics: Partial<AppState['performanceMetrics']>) => void;
}

// Create the store with middleware
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Navigation state
        activeSection: 'moorMeter',
        setActiveSection: (section) => set({ activeSection: section }, false, 'setActiveSection'),

        // UI state
        sidebarOpen: false,
        setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),
        
        // Theme state
        isDarkMode: false,
        toggleDarkMode: () => set((state) => ({ 
          isDarkMode: !state.isDarkMode 
        }), false, 'toggleDarkMode'),
        
        // Notifications state
        notifications: [],
        addNotification: (notification) => set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: crypto.randomUUID(),
              timestamp: new Date(),
              read: false,
            }
          ]
        }), false, 'addNotification'),
        
        markNotificationRead: (id) => set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }), false, 'markNotificationRead'),
        
        clearNotifications: () => set({ notifications: [] }, false, 'clearNotifications'),
        
        // App-wide loading states
        isInitializing: true,
        setIsInitializing: (loading) => set({ isInitializing: loading }, false, 'setIsInitializing'),
        
        // Feature flags
        features: {
          aiChat: true,
          cryptoTrading: true,
          socialFeeds: true,
          realTimeUpdates: true,
        },
        toggleFeature: (feature) => set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature]
          }
        }), false, 'toggleFeature'),

        // User preferences (persisted)
        preferences: {
          defaultView: 'moorMeter',
          autoRefresh: true,
          compactMode: false,
          showNotifications: true,
        },
        updatePreferences: (prefs) => set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        }), false, 'updatePreferences'),

        // Performance monitoring
        performanceMetrics: {
          lastRenderTime: 0,
          componentMountCount: 0,
          errorCount: 0,
        },
        updatePerformanceMetrics: (metrics) => set((state) => ({
          performanceMetrics: { ...state.performanceMetrics, ...metrics }
        }), false, 'updatePerformanceMetrics'),
      }),
      {
        name: 'moorMeter-app-storage',
        partialize: (state) => ({
          // Only persist certain parts of the state
          activeSection: state.activeSection,
          isDarkMode: state.isDarkMode,
          preferences: state.preferences,
          features: state.features,
        }),
      }
    ),
    { name: 'MoorMeter App Store' }
  )
);

// Selectors for commonly used state combinations
export const useNavigation = () => {
  const activeSection = useAppStore((state) => state.activeSection);
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  return { activeSection, setActiveSection };
};

export const useUI = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  return { sidebarOpen, setSidebarOpen, isDarkMode, toggleDarkMode };
};

export const useNotifications = () => {
  const notifications = useAppStore((state) => state.notifications);
  const addNotification = useAppStore((state) => state.addNotification);
  const markNotificationRead = useAppStore((state) => state.markNotificationRead);
  const clearNotifications = useAppStore((state) => state.clearNotifications);
  return { notifications, addNotification, markNotificationRead, clearNotifications };
};

export const useFeatures = () => {
  const features = useAppStore((state) => state.features);
  const toggleFeature = useAppStore((state) => state.toggleFeature);
  return { features, toggleFeature };
};

export const usePreferences = () => {
  const preferences = useAppStore((state) => state.preferences);
  const updatePreferences = useAppStore((state) => state.updatePreferences);
  return { preferences, updatePreferences };
};
