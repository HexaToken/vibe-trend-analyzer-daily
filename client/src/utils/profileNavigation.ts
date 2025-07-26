/**
 * User profile navigation utilities
 * Provides consistent navigation to user profiles throughout the app
 */

export interface UserNavigationHandler {
  (section: string, userId?: string): void;
}

/**
 * Navigate to a user's profile page
 */
export const navigateToUserProfile = (
  navigationHandler: UserNavigationHandler,
  userId: string
) => {
  navigationHandler("trader-profile", userId);
};

/**
 * Navigate to current user's own profile
 */
export const navigateToOwnProfile = (
  navigationHandler: UserNavigationHandler
) => {
  navigationHandler("trader-profile");
};

/**
 * Extract user ID from username or handle
 * In a real app, this might call an API to resolve username to userId
 */
export const getUserIdFromUsername = (username: string): string => {
  // Mock implementation - in real app, this would resolve through API
  return `user-${username.toLowerCase().replace(/[@\s]/g, '')}`;
};

/**
 * Parse mentions in text and return clickable elements
 */
export const parseMentions = (
  text: string,
  onUserClick: (userId: string) => void
): (string | JSX.Element)[] => {
  const mentionRegex = /@(\w+)/g;
  const parts = text.split(mentionRegex);
  
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      // This is a username from a mention
      const userId = getUserIdFromUsername(part);
      return (
        <button
          key={index}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          onClick={() => onUserClick(userId)}
        >
          @{part}
        </button>
      );
    }
    return part;
  });
};

/**
 * Mock user data for profile navigation
 * In a real app, this would fetch from an API
 */
export const getMockUserData = (userId: string) => {
  const mockUsers: Record<string, any> = {
    "user-cryptowolf": {
      id: "user-cryptowolf",
      username: "cryptowolf",
      firstName: "Alex",
      lastName: "Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      premium: true,
    },
    "user-techtrader": {
      id: "user-techtrader", 
      username: "techtrader",
      firstName: "Sarah",
      lastName: "Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      premium: true,
    },
    "user-quantanalyst": {
      id: "user-quantanalyst",
      username: "quantanalyst", 
      firstName: "Michael",
      lastName: "Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      verified: false,
      premium: true,
    },
    "user-cryptosage": {
      id: "user-cryptosage",
      username: "cryptosage",
      firstName: "Emma",
      lastName: "Johnson", 
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      verified: true,
      premium: false,
    }
  };
  
  return mockUsers[userId] || null;
};