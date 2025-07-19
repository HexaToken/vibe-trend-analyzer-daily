import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Star,
  Calendar,
  Users,
  Target,
  Flame,
  Crown,
  Shield,
} from "lucide-react";

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  userRole: "admin" | "member" | "premium" | "verified";
  score: number;
  change: number;
  metric: string;
  details?: string;
}

interface TopTradeIdea {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  ticker: string;
  action: "buy" | "sell";
  entryPrice: number;
  likes: number;
  accuracy?: number;
  performance?: number;
  timeframe: string;
  postedAt: Date;
}

export const StockTwistLeaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("today");

  // Mock leaderboard data
  const todayLeaders: LeaderboardEntry[] = [
    {
      userId: "user-1",
      username: "ChipWhisperer",
      avatar: "/api/placeholder/32/32",
      userRole: "premium",
      score: 2847,
      change: +234,
      metric: "Total Likes",
      details: "15 posts, 89% accuracy",
    },
    {
      userId: "user-2",
      username: "TechBull2024",
      avatar: "/api/placeholder/32/32",
      userRole: "verified",
      score: 1923,
      change: +156,
      metric: "Total Likes",
      details: "12 posts, 76% accuracy",
    },
    {
      userId: "user-3",
      username: "OptionsKing",
      avatar: "/api/placeholder/32/32",
      userRole: "premium",
      score: 1654,
      change: +98,
      metric: "Total Likes",
      details: "8 posts, 92% accuracy",
    },
    {
      userId: "user-4",
      username: "ValueHunter",
      avatar: "/api/placeholder/32/32",
      userRole: "member",
      score: 1234,
      change: +67,
      metric: "Total Likes",
      details: "6 posts, 83% accuracy",
    },
    {
      userId: "user-5",
      username: "SwingTrader99",
      avatar: "/api/placeholder/32/32",
      userRole: "verified",
      score: 987,
      change: +45,
      metric: "Total Likes",
      details: "4 posts, 100% accuracy",
    },
  ];

  const mostActiveUsers: LeaderboardEntry[] = [
    {
      userId: "user-6",
      username: "ChatMaster",
      avatar: "/api/placeholder/32/32",
      userRole: "premium",
      score: 47,
      change: +8,
      metric: "Posts Today",
      details: "156 total likes",
    },
    {
      userId: "user-7",
      username: "MarketGuru",
      avatar: "/api/placeholder/32/32",
      userRole: "verified",
      score: 34,
      change: +12,
      metric: "Posts Today",
      details: "89 total likes",
    },
  ];

  const topTradeIdeas: TopTradeIdea[] = [
    {
      id: "trade-1",
      userId: "user-1",
      username: "ChipWhisperer",
      avatar: "/api/placeholder/32/32",
      content: "Buy $NVDA at 875 / Target 950 / SL 820 📈",
      ticker: "NVDA",
      action: "buy",
      entryPrice: 875,
      likes: 234,
      accuracy: 89,
      performance: 8.6,
      timeframe: "swing",
      postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "trade-2",
      userId: "user-2",
      username: "OptionsKing",
      avatar: "/api/placeholder/32/32",
      content: "Sell $SPY at 425 / Target 410 / SL 430 📉",
      ticker: "SPY",
      action: "sell",
      entryPrice: 425,
      likes: 156,
      accuracy: 92,
      performance: 3.5,
      timeframe: "day",
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "trade-3",
      userId: "user-3",
      username: "TechBull2024",
      avatar: "/api/placeholder/32/32",
      content: "Buy $TSLA at 195 / Target 220 / SL 185 🚀",
      ticker: "TSLA",
      action: "buy",
      entryPrice: 195,
      likes: 98,
      accuracy: 76,
      performance: 12.8,
      timeframe: "swing",
      postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "premium":
        return <Crown className="h-3 w-3 text-purple-500" />;
      case "verified":
        return <Shield className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    }
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Daily Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
            <TabsTrigger value="today" className="text-xs">
              <ThumbsUp className="h-3 w-3 mr-1" />
              Top Liked
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Most Active
            </TabsTrigger>
            <TabsTrigger value="trades" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Best Trades
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="m-0">
            <ScrollArea className="h-64 px-4">
              <div className="space-y-3">
                {todayLeaders.map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm truncate">
                          {user.username}
                        </span>
                        {getUserRoleIcon(user.userRole)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.details}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        {user.score.toLocaleString()}
                      </div>
                      <div
                        className={`text-xs flex items-center gap-1 ${
                          user.change > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <TrendingUp className="h-3 w-3" />+{user.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="active" className="m-0">
            <ScrollArea className="h-64 px-4">
              <div className="space-y-3">
                {mostActiveUsers.map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-sm truncate">
                          {user.username}
                        </span>
                        {getUserRoleIcon(user.userRole)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.details}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm">{user.score}</div>
                      <div className="text-xs text-muted-foreground">posts</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="trades" className="m-0">
            <ScrollArea className="h-64 px-4">
              <div className="space-y-3">
                {topTradeIdeas.map((trade, index) => (
                  <div
                    key={trade.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRankIcon(index + 1)}
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={trade.avatar} />
                          <AvatarFallback className="text-xs">
                            {trade.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {trade.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          ${trade.ticker}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(trade.postedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm">{trade.content}</div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {trade.likes}
                        </div>
                        {trade.accuracy && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {trade.accuracy}% accuracy
                          </div>
                        )}
                        {trade.performance && (
                          <div
                            className={`flex items-center gap-1 ${
                              trade.performance > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            <TrendingUp className="h-3 w-3" />
                            {trade.performance > 0 ? "+" : ""}
                            {trade.performance}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer Stats */}
        <div className="border-t p-4 bg-muted/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">67</div>
              <div className="text-xs text-muted-foreground">Active Today</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">234</div>
              <div className="text-xs text-muted-foreground">Trade Ideas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">1.2K</div>
              <div className="text-xs text-muted-foreground">Total Likes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
