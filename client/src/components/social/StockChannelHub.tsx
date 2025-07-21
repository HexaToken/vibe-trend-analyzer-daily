import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingTickerBar } from "./TrendingTickerBar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import {
  Search,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  ThumbsUp,
  Pin,
  MessageSquare,
  Heart,
  Share,
  MoreHorizontal,
  Bell,
  Settings,
  Hash,
  ChevronRight,
  Users,
  Activity,
  Trophy,
  Target,
  Brain,
  Rocket,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { formatCurrency, cn } from "../../lib/utils";

interface StockChannel {
  ticker: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
  sentiment: "bullish" | "bearish" | "neutral";
  messageCount: number;
  engagementCount: number;
  isActive?: boolean;
}

interface StockMessage {
  id: string;
  username: string;
  avatar: string;
  timestamp: Date;
  content: string;
  sentiment: "bullish" | "bearish" | "neutral";
  badges: string[];
  likes: number;
  comments: number;
  isPinned?: boolean;
  tickers: string[];
}

interface TrendingTicker {
  ticker: string;
  companyName: string;
  change: number;
  changePercent: number;
  volume: number;
}

interface TopPoster {
  username: string;
  avatar: string;
  points: number;
  accuracy: number;
  badge: string;
}

export const StockChannelHub: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<StockChannel | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  // Mock stock channels data
  const stockChannels: StockChannel[] = [
    {
      ticker: "TSLA",
      companyName: "Tesla Inc",
      price: 248.5,
      change: 12.85,
      changePercent: 5.46,
      sentiment: "bullish",
      messageCount: 15420,
      engagementCount: 1847,
      isActive: true,
    },
    {
      ticker: "AAPL",
      companyName: "Apple Inc",
      price: 189.25,
      change: -2.15,
      changePercent: -1.12,
      sentiment: "neutral",
      messageCount: 8934,
      engagementCount: 923,
    },
    {
      ticker: "NVDA",
      companyName: "NVIDIA Corp",
      price: 891.34,
      change: 23.67,
      changePercent: 2.73,
      sentiment: "bullish",
      messageCount: 12683,
      engagementCount: 2156,
    },
    {
      ticker: "MSFT",
      companyName: "Microsoft Corp",
      price: 378.85,
      change: -5.42,
      changePercent: -1.41,
      sentiment: "bearish",
      messageCount: 6245,
      engagementCount: 734,
    },
    {
      ticker: "GOOGL",
      companyName: "Alphabet Inc",
      price: 142.56,
      change: 1.83,
      changePercent: 1.3,
      sentiment: "bullish",
      messageCount: 4567,
      engagementCount: 589,
    },
  ];

  // Mock messages for the selected channel
  const channelMessages: StockMessage[] = [
    {
      id: "1",
      username: "TechBull2024",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 300000),
      content:
        "$TSLA breaking above $245 resistance! This could be the start of the next leg up 🚀 Volume is looking healthy",
      sentiment: "bullish",
      badges: ["Verified", "Diamond Hands"],
      likes: 47,
      comments: 8,
      isPinned: true,
      tickers: ["TSLA"],
    },
    {
      id: "2",
      username: "CryptoAnalyst",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 600000),
      content:
        "RSI approaching overbought on the 4H chart. Expecting a pullback to $241.5 before continuation. What do you think?",
      sentiment: "neutral",
      badges: ["TA Expert"],
      likes: 23,
      comments: 12,
      tickers: ["TSLA"],
    },
    {
      id: "3",
      username: "HodlStrong",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 900000),
      content:
        "Just bought the dip at $242.01! Been DCA-ing since 2020 and not stopping now 💎 🙌",
      sentiment: "bullish",
      badges: ["Diamond Hands"],
      likes: 156,
      comments: 24,
      tickers: ["TSLA"],
    },
    {
      id: "4",
      username: "ElonWatcher",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 1200000),
      content:
        "Anyone else watching the Cybertruck production numbers? Could be a major catalyst if they hit targets 📈",
      sentiment: "bullish",
      badges: ["Industry Expert"],
      likes: 89,
      comments: 15,
      tickers: ["TSLA"],
    },
    {
      id: "5",
      username: "BearishBob",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 1500000),
      content:
        "EV competition is heating up. Ford, GM, and others are catching up fast. Not sure $TSLA can maintain this premium 📉",
      sentiment: "bearish",
      badges: ["Contrarian"],
      likes: 34,
      comments: 28,
      tickers: ["TSLA"],
    },
    {
      id: "6",
      username: "MarketSage",
      avatar: "/api/placeholder/32/32",
      timestamp: new Date(Date.now() - 1800000),
      content:
        "Key support at $240. If it holds, next target is $255. Clean breakout pattern forming on daily chart 📊",
      sentiment: "neutral",
      badges: ["Chart Master"],
      likes: 67,
      comments: 9,
      tickers: ["TSLA"],
    },
  ];

  // Mock trending tickers
  const trendingTickers: TrendingTicker[] = [
    {
      ticker: "AMD",
      companyName: "AMD",
      change: 8.45,
      changePercent: 6.12,
      volume: 45600000,
    },
    {
      ticker: "META",
      companyName: "Meta",
      change: -3.21,
      changePercent: -1.05,
      volume: 32100000,
    },
    {
      ticker: "NFLX",
      companyName: "Netflix",
      change: 15.67,
      changePercent: 3.42,
      volume: 28900000,
    },
  ];

  // Mock top posters
  const topPosters: TopPoster[] = [
    {
      username: "TechGuru99",
      avatar: "/api/placeholder/32/32",
      points: 2847,
      accuracy: 87,
      badge: "🏆 Top Analyst",
    },
    {
      username: "MarketMaven",
      avatar: "/api/placeholder/32/32",
      points: 1965,
      accuracy: 79,
      badge: "🎯 Sharp Shooter",
    },
    {
      username: "BullRunner",
      avatar: "/api/placeholder/32/32",
      points: 1456,
      accuracy: 82,
      badge: "🚀 Momentum King",
    },
  ];

  // Set default selected channel
  useEffect(() => {
    setSelectedChannel(stockChannels[0]);
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-500";
      case "bearish":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "📈";
      case "bearish":
        return "📉";
      default:
        return "⚖️";
    }
  };

  const filteredChannels = stockChannels.filter(
    (channel) =>
      channel.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full min-h-[600px] bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Left Sidebar - Stock Channels */}
      <div className="w-fit pr-[3%] max-w-[220px] bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            # Stock Channels
          </h2>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search tickers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-2 space-y-1">
            {filteredChannels.map((channel) => (
              <div
                key={channel.ticker}
                onClick={() => setSelectedChannel(channel)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
                  selectedChannel?.ticker === channel.ticker &&
                    "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      ${channel.ticker}
                    </span>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        channel.sentiment === "bullish"
                          ? "bg-green-500"
                          : channel.sentiment === "bearish"
                            ? "bg-red-500"
                            : "bg-gray-400",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      channel.change >= 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {channel.change >= 0 ? "+" : ""}
                    {channel.changePercent.toFixed(2)}%
                  </span>
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {channel.companyName}
                </div>

                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {formatCurrency(channel.price)}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {channel.messageCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {channel.engagementCount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Feed - Ticker Chatroom */}
      <div className="flex-1 flex flex-col min-h-0" style={{ flexGrow: 2 }}>
        {selectedChannel && (
          <>
            {/* Channel Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Hash className="w-6 h-6 text-blue-500" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      ${selectedChannel.ticker} - {selectedChannel.companyName}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Discuss ${selectedChannel.ticker} trades, news, and
                      analysis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedChannel.price)}
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        selectedChannel.change >= 0
                          ? "text-green-500"
                          : "text-red-500",
                      )}
                    >
                      {selectedChannel.change >= 0 ? "+" : ""}
                      {selectedChannel.change.toFixed(2)} (
                      {selectedChannel.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Rules Bar */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <span>📝 Use cashtags</span>
                <span>🚫 No spam</span>
                <span>💡 Quality ideas</span>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[550px] max-h-none lg:max-h-[600px]">
              {channelMessages.map((message) => (
                <div key={message.id} className="space-y-2">
                  {message.isPinned && (
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 mb-1">
                      <Pin className="w-3 h-3" />
                      <span>Pinned Message</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage
                        src={message.avatar}
                        alt={message.username}
                      />
                      <AvatarFallback>{message.username[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {message.username}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            getSentimentColor(message.sentiment),
                          )}
                        >
                          {getSentimentIcon(message.sentiment)}{" "}
                          {message.sentiment}
                        </span>
                        {message.badges.map((badge, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {badge}
                          </Badge>
                        ))}
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 break-words leading-relaxed">
                        {message.content}
                      </p>

                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {message.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {message.comments}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2"
                        >
                          <Pin className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex gap-2">
                <Input
                  placeholder={`Post your idea... Use $${selectedChannel.ticker} to link stocks`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  maxLength={150}
                  className="flex-1"
                />
                <Button>Post</Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {messageInput.length}/150 characters
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
