import React from "react";
import { getUserIdFromUsername } from "@/utils/profileNavigation";

interface MentionTextProps {
  text: string;
  onUserClick?: (userId: string) => void;
  className?: string;
}

/**
 * Component that parses text for @mentions and makes them clickable
 */
export const MentionText: React.FC<MentionTextProps> = ({ 
  text, 
  onUserClick,
  className = ""
}) => {
  const parseMentions = (text: string): (string | JSX.Element)[] => {
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
            onClick={() => onUserClick?.(userId)}
          >
            @{part}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <span className={className}>
      {parseMentions(text)}
    </span>
  );
};

export default MentionText;
