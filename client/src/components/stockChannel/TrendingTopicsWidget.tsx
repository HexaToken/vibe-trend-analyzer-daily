import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Flame, Hash, DollarSign } from "lucide-react";

interface TrendingTopic {
  id: string;
  tag: string;
  type: "hashtag" | "ticker";
  mentions: number;
  sentiment: number;
  volume: "High" | "Medium" | "Low";
  change: number; // percentage change in mentions
  isRising: boolean;
}

interface TrendingTopicsWidgetProps {
  className?: string;
}

export const TrendingTopicsWidget: React.FC<TrendingTopicsWidgetProps> = ({
  className,
}) => {
  const [topics, setTopics] = useState<TrendingTopic[]>([
    {
      id: "1",
      tag: "#AIRevolution",
      type: "hashtag",
      mentions: 1247,
      sentiment: 85,
      volume: "High",
      change: 24.5,
      isRising: true,
    },
    {
      id: "2",
      tag: "$NVDA",
      type: "ticker",
      mentions: 892,
      sentiment: 78,
      volume: "High",
      change: 15.2,
      isRising: true,
    },
    {
      id: "3",
      tag: "#TechEarnings",
      type: "hashtag",
      mentions: 743,
      sentiment: -23,
      volume: "Medium",
      change: -8.4,
      isRising: false,
    },
    {
      id: "4",
      tag: "$TSLA",
      type: "ticker",
      mentions: 567,
      sentiment: 34,
      volume: "Medium",
      change: 12.1,
      isRising: true,
    },
    {
      id: "5",
      tag: "#FedWatch",
      type: "hashtag",
      mentions: 423,
      sentiment: -45,
      volume: "Low",
      change: 5.7,
      isRising: true,
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTopics((prev) =>
        prev.map((topic) => ({
          ...topic,
          mentions: Math.max(
            50,
            topic.mentions + Math.floor((Math.random() - 0.5) * 100),
          ),
          sentiment: Math.max(
            -100,
            Math.min(100, topic.sentiment + (Math.random() - 0.5) * 10),
          ),
          change: (Math.random() - 0.3) * 30, // Slight bias towards positive
        })),
      );
    }, 20000); // Update every 20 seconds

    return () => clearInterval(interval);
  }, []);

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Card
      className={`bg-gray-800/50 border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 overflow-hidden ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2 text-lg font-bold">
          🔥 Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div
              key={topic.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer border border-gray-600/20 hover:border-gray-500/50 overflow-hidden gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-gray-400 text-sm font-bold">
                    #{index + 1}
                  </div>
                  {topic.type === "hashtag" ? (
                    <Hash className="w-4 h-4 text-blue-400" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm truncate block">
                      {topic.tag}
                    </span>
                    {topic.isRising && (
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400 flex-shrink-0" />
                        <div
                          className={`px-2 py-1 rounded-md text-center min-w-[60px] max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap ${
                            topic.change > 0
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          <span className="text-[clamp(0.75rem,2vw,1rem)] font-medium">
                            {topic.change > 0 ? "+" : ""}
                            {topic.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatNumber(topic.mentions)} mentions</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Updated: Just now</span>
            <span className="flex items-center gap-1">
              📊{" "}
              {topics
                .reduce((sum, topic) => sum + topic.mentions, 0)
                .toLocaleString()}{" "}
              total mentions
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
