import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  TrendingUp,
  TrendingDown,
  Crown,
  Shield,
  Bot,
  PlusCircle,
  BarChart3,
  Users,
  Clock,
  Star,
  Flame,
  Target,
  DollarSign,
  Zap,
  AlertCircle,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Play,
  Pause,
  Hash,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  canPostInStockTwist,
  canCreatePolls,
} from "@/utils/userLimitsEnforcement";
import { CreatePollModal } from "./CreatePollModal";
import { RoomMessage, StockTwistPoll, TradeIdea } from "@/types/rooms";
import {
  mockStockTwistMessages,
  mockStockTwistPolls,
  parseCashtags,
  formatTradeIdea,
  getUserWatchlistTickers,
} from "@/data/roomsMockData";

interface TrendingTopic {
  tag: string;
  mentions: number;
  sentiment: number;
  type: "cashtag" | "event";
}

interface TopDiscussedTicker {
  symbol: string;
  mentions: number;
  sentiment: number;
  change: number;
}

interface LeaderboardUser {
  username: string;
  avatar: string;
  score: number;
  accuracy: number;
  role: string;
  todayPosts: number;
}

export const StockTwistRoom: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [polls, setPolls] = useState<StockTwistPoll[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [showTradeIdeaHelper, setShowTradeIdeaHelper] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for enhanced features
  const [marketSentiment] = useState({
    score: 73,
    label: "Bullish",
    change: +5.2,
  });

  const [trendingTopics] = useState<TrendingTopic[]>([
    { tag: "$NVDA", mentions: 1247, sentiment: 85, type: "cashtag" },
    { tag: "#AIRevolution", mentions: 892, sentiment: 78, type: "event" },
    { tag: "$TSLA", mentions: 743, sentiment: -23, type: "cashtag" },
    { tag: "#FedMeeting", mentions: 621, sentiment: -45, type: "event" },
    { tag: "$AAPL", mentions: 534, sentiment: 12, type: "cashtag" },
  ]);

  const [topDiscussed] = useState<TopDiscussedTicker[]>([
    { symbol: "NVDA", mentions: 1247, sentiment: 85, change: 3.42 },
    { symbol: "TSLA", mentions: 743, sentiment: -23, change: -2.15 },
    { symbol: "AAPL", mentions: 534, sentiment: 12, change: 0.87 },
    { symbol: "MSFT", mentions: 421, sentiment: 34, change: 1.23 },
    { symbol: "GOOGL", mentions: 318, sentiment: -8, change: -0.45 },
  ]);

  const [leaderboard] = useState<LeaderboardUser[]>([
    {
      username: "TechBull2024",
      avatar: "/api/placeholder/32/32",
      score: 2847,
      accuracy: 87.3,
      role: "premium",
      todayPosts: 23,
    },
    {
      username: "MarketGuru",
      avatar: "/api/placeholder/32/32",
      score: 2156,
      accuracy: 82.1,
      role: "verified",
      todayPosts: 18,
    },
    {
      username: "CryptoWhale",
      avatar: "/api/placeholder/32/32",
      score: 1934,
      accuracy: 79.8,
      role: "member",
      todayPosts: 31,
    },
    {
      username: "OptionsKing",
      avatar: "/api/placeholder/32/32",
      score: 1723,
      accuracy: 85.2,
      role: "verified",
      todayPosts: 12,
    },
  ]);

  // Get user limits based on subscription
  const userLimits = {
    maxPrivateRooms: user?.isPremium ? 20 : 1,
    maxJoinedRooms: user?.isPremium ? 50 : 5,
    maxRoomMembers: user?.isPremium ? 50 : 10,
    maxInvitesPerHour: user?.isPremium ? 25 : 5,
    canCreateStockTwistPosts: user?.isVerified || user?.isPremium || false,
    canCreatePolls: user?.isPremium || false,
  };

  const canPostCheck = canPostInStockTwist(user?.id || "", userLimits);
  const canCreatePollsCheck = canCreatePolls(user?.id || "", userLimits);

  const canPost = canPostCheck.allowed;
  const canCreatePollsFeature = canCreatePollsCheck.allowed;

  useEffect(() => {
    setMessages(mockStockTwistMessages);
    setPolls(mockStockTwistPolls);
  }, []);

  useEffect(() => {
    if (isLive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLive]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !canPost || newMessage.length > 150)
      return;

    const cashtags = parseCashtags(newMessage);
    let tradeIdea: TradeIdea | undefined;

    // Enhanced trade idea detection
    const buyMatch = newMessage.match(/buy\s+\$(\w+)\s+at\s+(\d+\.?\d*)/i);
    const sellMatch = newMessage.match(/sell\s+\$(\w+)\s+at\s+(\d+\.?\d*)/i);
    const targetMatch = newMessage.match(/target\s+(\d+\.?\d*)/i);
    const slMatch = newMessage.match(/sl\s+(\d+\.?\d*)/i);

    if (buyMatch || sellMatch) {
      const match = buyMatch || sellMatch;
      tradeIdea = {
        ticker: match![1].toUpperCase(),
        action: buyMatch ? "buy" : "sell",
        entryPrice: parseFloat(match![2]),
        targetPrice: targetMatch ? parseFloat(targetMatch[1]) : undefined,
        stopLoss: slMatch ? parseFloat(slMatch[1]) : undefined,
        sentiment:
          newMessage.includes("📈") ||
          newMessage.toLowerCase().includes("bullish")
            ? "bullish"
            : newMessage.includes("📉") ||
                newMessage.toLowerCase().includes("bearish")
              ? "bearish"
              : "bullish",
        confidence: 3,
        timeframe: newMessage.toLowerCase().includes("swing")
          ? "swing"
          : newMessage.toLowerCase().includes("long")
            ? "long"
            : "day",
      };
    }

    const message: RoomMessage = {
      id: `st-msg-${Date.now()}`,
      roomId: "stocktwist",
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      userRole: user.isPremium
        ? "premium"
        : user.isVerified
          ? "verified"
          : "member",
      content: newMessage.trim(),
      cashtags,
      sentiment: tradeIdea?.sentiment,
      tradeIdea,
      reactions: [],
      isPinned: false,
      type: tradeIdea ? "trade_idea" : "message",
      createdAt: new Date(),
    };

    setMessages((prev) => [message, ...prev]);
    setNewMessage("");
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            const userReacted = existingReaction.users.includes(user?.id || "");
            return {
              ...msg,
              reactions: msg.reactions
                .map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: userReacted ? r.count - 1 : r.count + 1,
                        users: userReacted
                          ? r.users.filter((id) => id !== user?.id)
                          : [...r.users, user?.id || ""],
                        userReacted: !userReacted,
                      }
                    : r,
                )
                .filter((r) => r.count > 0),
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                {
                  emoji,
                  count: 1,
                  users: [user?.id || ""],
                  userReacted: true,
                },
              ],
            };
          }
        }
        return msg;
      }),
    );
  };

  const handleVote = (pollId: string, optionId: string) => {
    if (!user) return;

    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          const hasVoted = poll.options.some((opt) =>
            opt.voters.includes(user.id),
          );
          if (hasVoted) return poll;

          return {
            ...poll,
            options: poll.options.map((opt) =>
              opt.id === optionId
                ? {
                    ...opt,
                    votes: opt.votes + 1,
                    voters: [...opt.voters, user.id],
                  }
                : opt,
            ),
            totalVotes: poll.totalVotes + 1,
          };
        }
        return poll;
      }),
    );
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

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffMinutes < 1) return "now";
    if (diffMinutes < 60) return `${Math.floor(diffMinutes)}m`;
    const hours = Math.floor(diffMinutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const renderTradeIdea = (tradeIdea: TradeIdea) => (
    <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
      <div className="flex items-center gap-2 mb-2">
        <Target className="h-4 w-4 text-blue-500" />
        <span className="font-medium text-sm">Trade Signal</span>
        <Badge
          variant={
            tradeIdea.sentiment === "bullish" ? "default" : "destructive"
          }
          className="text-xs"
        >
          {tradeIdea.sentiment === "bullish" ? "BULLISH" : "BEARISH"}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {tradeIdea.timeframe.toUpperCase()}
        </Badge>
        <Badge variant="outline" className="text-xs">
          HIGH CONFIDENCE
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="h-3 w-3 text-green-500" />
          <span>Entry: ${tradeIdea.entryPrice}</span>
        </div>
        {tradeIdea.targetPrice && (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span>Target: ${tradeIdea.targetPrice}</span>
          </div>
        )}
        {tradeIdea.stopLoss && (
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-red-500" />
            <span>Stop: ${tradeIdea.stopLoss}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span>Confidence: {tradeIdea.confidence}/5</span>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">StockTwist Room</h3>
            <p className="text-muted-foreground mb-4">
              Join the community to share trade ideas and discuss market
              movements in real-time.
            </p>
            <Button>Sign In to Continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Market & Sentiment Overview */}
        <div className="col-span-3 space-y-6">
          {/* Live Polls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Live Polls
                {canCreatePollsFeature && (
                  <Button size="sm" variant="outline" className="ml-auto">
                    <PlusCircle className="h-3 w-3" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-3 space-y-3">
                <div className="text-sm font-medium">
                  Which ticker will moon today?
                </div>
                <div className="space-y-2">
                  {[
                    { text: "$NVDA", votes: 67, percentage: 45 },
                    { text: "$TSLA", votes: 34, percentage: 23 },
                    { text: "$AAPL", votes: 28, percentage: 19 },
                    { text: "$MSFT", votes: 19, percentage: 13 },
                  ].map((option, i) => (
                    <div key={i} className="w-full text-left">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{option.text}</span>
                        <span>{option.percentage}%</span>
                      </div>
                      <Progress value={option.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>148 votes</span>
                  <span>Expires in 2h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-sm">Market Sentiment</span>
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {marketSentiment.score}% {marketSentiment.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  +{marketSentiment.change}% from yesterday
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {topic.type === "cashtag" ? (
                      <DollarSign className="h-3 w-3 text-blue-500" />
                    ) : (
                      <Hash className="h-3 w-3 text-purple-500" />
                    )}
                    <span className="text-sm font-medium">{topic.tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {topic.mentions}
                    </span>
                    <Badge
                      variant={topic.sentiment > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {topic.sentiment > 0 ? "+" : ""}
                      {topic.sentiment}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Discussed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Top Discussed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topDiscussed.map((ticker, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">${ticker.symbol}</div>
                    <div className="text-xs text-muted-foreground">
                      {ticker.mentions} mentions
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        ticker.change > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {ticker.change > 0 ? "+" : ""}
                      {ticker.change}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {ticker.sentiment > 0 ? "+" : ""}
                      {ticker.sentiment}% sentiment
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Center Main Panel - StockTwist Room */}
        <div className="col-span-6">
          <Card className="h-[800px] flex flex-col">
            {/* Room Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  StockTwist Room
                  <Badge className={isLive ? "animate-pulse" : ""}>
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${
                        isLive ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    {isLive ? "LIVE" : "PAUSED"}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsLive(!isLive)}
                  >
                    {isLive ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  {canPost && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setShowTradeIdeaHelper(!showTradeIdeaHelper)
                      }
                    >
                      <Target className="h-4 w-4 mr-1" />
                      Trade Idea
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[580px]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3 group">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.userAvatar} />
                        <AvatarFallback className="text-xs">
                          {message.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {message.username}
                          </span>
                          {getUserRoleIcon(message.userRole)}
                          <span className="text-xs text-muted-foreground">
                            {formatMessageTime(message.createdAt)}
                          </span>
                        </div>

                        <div className="text-sm leading-relaxed break-words">
                          {message.content.split(" ").map((word, i) => {
                            if (word.startsWith("$") && word.length > 1) {
                              return (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="mx-1 text-xs"
                                >
                                  {word}
                                </Badge>
                              );
                            }
                            return word + " ";
                          })}
                        </div>

                        {message.tradeIdea &&
                          renderTradeIdea(message.tradeIdea)}

                        {/* Reactions */}
                        <div className="flex items-center gap-2 mt-2">
                          {["✅", "⚠️", "💬"].map((emoji) => {
                            const reaction = message.reactions.find(
                              (r) => r.emoji === emoji,
                            );
                            return (
                              <button
                                key={emoji}
                                onClick={() =>
                                  handleReaction(message.id, emoji)
                                }
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                  reaction?.userReacted
                                    ? "bg-primary/20 text-primary"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <span>{emoji}</span>
                                {reaction && <span>{reaction.count}</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Composer */}
            <div className="border-t p-4">
              {canPost ? (
                <div className="space-y-2">
                  {showTradeIdeaHelper && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-xs">
                      <strong>Trade Format:</strong> Buy $TICKER @ price /
                      Target price / SL price
                      <br />
                      <strong>Example:</strong> Buy $NVDA @ 850 / Target 900 /
                      SL 820 📈 Bullish swing trade
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Textarea
                        placeholder="$Cashtag your trade idea... Buy $TICKER @ price / Target / SL"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[60px] resize-none"
                        maxLength={150}
                      />
                      <div className="flex justify-between mt-1">
                        <div className="text-xs text-muted-foreground">
                          Format helper: Buy $TICKER @ price / Target / SL
                        </div>
                        <div
                          className={`text-xs ${
                            newMessage.length > 140
                              ? "text-red-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {newMessage.length}/150
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || newMessage.length > 150}
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">
                      {canPostCheck.reason ||
                        "You can read messages but need verification to post"}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    {canPostCheck.upgradeRequired
                      ? "Upgrade to Premium"
                      : "Get Verified"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Panel - Leaderboard + Trending */}
        <div className="col-span-3 space-y-6">
          {/* Top Posters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Top Posters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((user, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        i === 0
                          ? "text-yellow-500"
                          : i === 1
                            ? "text-gray-400"
                            : i === 2
                              ? "text-amber-600"
                              : "text-muted-foreground"
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm truncate">
                        {user.username}
                      </span>
                      {getUserRoleIcon(user.role)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.accuracy}% accuracy • {user.score} points
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Most Active Today */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Most Active Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard
                .sort((a, b) => b.todayPosts - a.todayPosts)
                .map((user, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">
                        {user.username}
                      </span>
                      {getUserRoleIcon(user.role)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {user.todayPosts} posts
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
