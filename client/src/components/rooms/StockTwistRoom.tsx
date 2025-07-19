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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  canPostInStockTwist,
  canCreatePolls,
} from "@/utils/userLimitsEnforcement";
import { RoomMessage, StockTwistPoll, TradeIdea } from "@/types/rooms";
import {
  mockStockTwistMessages,
  mockStockTwistPolls,
  parseCashtags,
  formatTradeIdea,
  getUserWatchlistTickers,
} from "@/data/roomsMockData";

export const StockTwistRoom: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [polls, setPolls] = useState<StockTwistPoll[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTradeIdeaForm, setShowTradeIdeaForm] = useState(false);
  const [showPollForm, setShowPollForm] = useState(false);
  const [dailyStats, setDailyStats] = useState({
    totalMessages: 1247,
    activeUsers: 342,
    topTicker: "NVDA",
    sentimentScore: 73,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !canPost) return;

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
          {tradeIdea.sentiment === "bullish" ? "📈 BULLISH" : "📉 BEARISH"}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {tradeIdea.timeframe.toUpperCase()}
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
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-xl font-bold">
                  {dailyStats.totalMessages.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Messages Today
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-xl font-bold">
                  {dailyStats.activeUsers}
                </div>
                <div className="text-xs text-muted-foreground">
                  Active Users
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <div className="text-xl font-bold">${dailyStats.topTicker}</div>
                <div className="text-xs text-muted-foreground">
                  Trending Ticker
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-xl font-bold">
                  {dailyStats.sentimentScore}
                </div>
                <div className="text-xs text-muted-foreground">
                  Sentiment Score
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Active Polls Sidebar */}
        <div className="col-span-1">
          <Card className="mb-4">
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
              {polls.map((poll) => (
                <div key={poll.id} className="border rounded-lg p-3 space-y-3">
                  <div className="text-sm font-medium">{poll.question}</div>
                  <div className="space-y-2">
                    {poll.options.map((option) => {
                      const percentage =
                        poll.totalVotes > 0
                          ? (option.votes / poll.totalVotes) * 100
                          : 0;
                      const hasVoted = option.voters.includes(user?.id || "");

                      return (
                        <button
                          key={option.id}
                          onClick={() => handleVote(poll.id, option.id)}
                          disabled={poll.options.some((opt) =>
                            opt.voters.includes(user?.id || ""),
                          )}
                          className="w-full text-left"
                        >
                          <div className="flex justify-between text-xs mb-1">
                            <span>{option.text}</span>
                            <span>{Math.round(percentage)}%</span>
                          </div>
                          <Progress
                            value={percentage}
                            className={`h-2 ${hasVoted ? "bg-primary/20" : ""}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{poll.totalVotes} votes</span>
                    <span>Expires in 2h</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <strong>Top Discussed:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  <Badge variant="outline">$NVDA</Badge>
                  <Badge variant="outline">$TSLA</Badge>
                  <Badge variant="outline">$AAPL</Badge>
                </div>
              </div>
              <div className="text-sm">
                <strong>Sentiment Shift:</strong>
                <div className="text-green-600 text-xs">
                  📈 +12% bullish on tech
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated 5 minutes ago
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat */}
        <div className="col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  StockTwist Room
                  <Badge className="animate-pulse">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    LIVE
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  {canPost && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTradeIdeaForm(true)}
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
              <ScrollArea className="h-[500px]">
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
                          {["✅", "⚠️", "🧠"].map((emoji) => {
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

            {/* Message Input */}
            <div className="border-t p-4">
              {canPost ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Textarea
                      placeholder="Share your trade idea or market thoughts... Use $TICKER for symbols"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[60px] resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <strong>Format:</strong> Buy $TICKER at price / Target price
                    / SL price 📈 Bullish
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">
                      You can read messages but need verification to post
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Get Verified
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
