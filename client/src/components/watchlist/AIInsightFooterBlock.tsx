import { useState } from "react";
import { cn } from "@/lib/utils";
import { Brain, Sparkles, TrendingUp, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AIInsight } from "@/types/watchlist";

interface AIInsightFooterBlockProps {
  insight: string;
  ticker?: string;
  confidence?: number;
  category?: 'earnings' | 'news' | 'technical' | 'sentiment' | 'general';
  timestamp?: Date;
  expandable?: boolean;
  className?: string;
}

export const AIInsightFooterBlock = ({
  insight,
  ticker,
  confidence = 75,
  category = 'general',
  timestamp,
  expandable = false,
  className
}: AIInsightFooterBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getCategoryIcon = () => {
    switch (category) {
      case 'earnings':
        return <TrendingUp className="w-3 h-3" />;
      case 'news':
        return <AlertCircle className="w-3 h-3" />;
      case 'technical':
        return <Sparkles className="w-3 h-3" />;
      case 'sentiment':
        return <Brain className="w-3 h-3" />;
      default:
        return <Brain className="w-3 h-3" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'earnings':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'news':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'technical':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'sentiment':
        return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      default:
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    }
  };

  const getConfidenceColor = () => {
    if (confidence >= 80) return 'text-emerald-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn(
      "relative group",
      "bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80",
      "border border-gray-700/50 rounded-lg p-3",
      "backdrop-blur-sm",
      "hover:border-purple-500/30 transition-all duration-300",
      "hover:shadow-lg hover:shadow-purple-500/10",
      className
    )}>
      {/* Header with category and confidence */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn("text-xs border", getCategoryColor())}
          >
            {getCategoryIcon()}
            <span className="ml-1 capitalize">{category}</span>
          </Badge>
          
          {ticker && (
            <span className="text-xs text-gray-400 font-mono">{ticker}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {timestamp && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(timestamp)}
            </div>
          )}
          
          <div className={cn(
            "text-xs font-medium",
            getConfidenceColor()
          )}>
            {confidence}%
          </div>
        </div>
      </div>

      {/* AI Insight Text */}
      <div className="relative">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Brain className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm text-gray-300 leading-relaxed",
              !isExpanded && expandable && "line-clamp-2"
            )}>
              {insight}
            </p>
            
            {expandable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-auto p-0 mt-1 text-xs text-purple-400 hover:text-purple-300"
              >
                {isExpanded ? 'Show less' : 'Read more'}
                <ChevronRight className={cn(
                  "w-3 h-3 ml-1 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </Button>
            )}
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">Confidence:</span>
          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000 ease-out",
                confidence >= 80 ? "bg-emerald-400" :
                confidence >= 60 ? "bg-yellow-400" :
                "bg-red-400"
              )}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <span className={cn("text-xs font-medium", getConfidenceColor())}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

// Compact version for smaller spaces
export const AIInsightCompact = ({
  insight,
  confidence = 75,
  className
}: Pick<AIInsightFooterBlockProps, 'insight' | 'confidence' | 'className'>) => {
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded bg-gray-800/40 border border-gray-700/30",
      className
    )}>
      <Brain className="w-3 h-3 text-purple-400 flex-shrink-0" />
      <p className="text-xs text-gray-400 line-clamp-1 flex-1">{insight}</p>
      <div className={cn(
        "text-xs font-medium",
        confidence >= 80 ? 'text-emerald-400' :
        confidence >= 60 ? 'text-yellow-400' :
        'text-red-400'
      )}>
        {confidence}%
      </div>
    </div>
  );
};
