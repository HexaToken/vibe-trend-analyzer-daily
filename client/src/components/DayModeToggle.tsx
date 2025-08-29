import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DayModeToggleProps {
  isDayMode: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Day/Night Mode Toggle Component
 * Switches between TradingView Light theme and Dark theme
 */
export const DayModeToggle = ({ isDayMode, onToggle, className }: DayModeToggleProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={cn(
        "h-9 w-20 relative transition-all duration-300",
        // Light mode styling
        isDayMode && [
          "bg-white border-gray-300 hover:bg-gray-50",
          "text-gray-600 hover:text-gray-900",
          "shadow-sm hover:shadow-md"
        ],
        // Dark mode styling  
        !isDayMode && [
          "bg-slate-800 border-slate-600 hover:bg-slate-700",
          "text-slate-300 hover:text-white",
          "shadow-slate-900/10"
        ],
        className
      )}
      data-testid="day-mode-toggle"
    >
      <div className="flex items-center justify-center w-full">
        {isDayMode ? (
          <div className="flex items-center gap-1">
            <Sun className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium">Day</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Moon className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium">Night</span>
          </div>
        )}
      </div>

      {/* Visual toggle indicator */}
      <div
        className={cn(
          "absolute top-1 h-7 w-8 rounded transition-all duration-300",
          isDayMode ? [
            "left-1 bg-gradient-to-r from-amber-100 to-amber-50",
            "border border-amber-200"
          ] : [
            "right-1 bg-gradient-to-r from-slate-700 to-slate-800", 
            "border border-slate-600"
          ]
        )}
      />
    </Button>
  );
};