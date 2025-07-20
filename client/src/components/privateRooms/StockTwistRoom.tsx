import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Filter,
  Sparkles,
  TrendingDownIcon,
} from "lucide-react";

import {
  RoomMessage,
  TradeIdea,
  StockTwistPoll,
  TrendingTicker,
  LeaderboardUser,
  User,
} from "@/types/privateRooms";
import {
  mockRoomMessages,
  mockStockTwistPolls,
  mockTrendingTickers,
  mockLeaderboard,
  mockUsers,
  parseCashtags,
  formatTradeIdea,
  getTimeAgo,
} from "@/data/privateRoomsMockData";

interface StockTwistRoomProps {
  onBackToRooms?: () => void;
}

export const StockTwistRoom: React.FC<StockTwistRoomProps> = ({
  onBackToRooms,
}) => {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [polls, setPolls] = useState<StockTwistPoll[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [showTradeIdeaHelper, setShowTradeIdeaHelper] = useState(false);
  const [filterSentiment, setFilterSentiment] = useState<
    "all" | "bullish" | "bearish"
  >("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock current user
  const currentUser: User = mockUsers[0]; // TechBull2024

  // Mock market sentiment
  const [marketSentiment] = useState({
    score: 73,
    label: "Bullish",
    change: +5.2,
  });

  useEffect(() => {
    setMessages(mockRoomMessages["stocktwist-room"] || []);
    setPolls(mockStockTwistPolls);
  }, []);

  useEffect(() => {
    if (isLive) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLive]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || newMessage.length > 150) return;

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
          newMessage.includes("📈") || buyMatch ? "bullish" : "bearish",
        confidence: 3,
        timeframe: newMessage.toLowerCase().includes("swing")
          ? "swing"
          : newMessage.toLowerCase().includes("long")
            ? "long"
            : "day",
        strategy: "StockTwist trade idea",
        notes: newMessage,
      };
    }

    const message: RoomMessage = {
      id: `st-msg-${Date.now()}`,
      roomId: "stocktwist-room",
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: newMessage.trim(),
      cashtags,
      sentiment: tradeIdea?.sentiment,
      tradeIdea,
      reactions: [],
      isPinned: false,
      type: tradeIdea ? "trade_idea" : "message",
      createdAt: new Date(),
      mentions: [],
      attachments: [],
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
            const userReacted = existingReaction.users.includes(currentUser.id);
            return {
              ...msg,
              reactions: msg.reactions
                .map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: userReacted ? r.count - 1 : r.count + 1,
                        users: userReacted
                          ? r.users.filter((id) => id !== currentUser.id)
                          : [...r.users, currentUser.id],
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
                  users: [currentUser.id],
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
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          const hasVoted = poll.options.some((opt) =>
            opt.voters.includes(currentUser.id),
          );
          if (hasVoted) return poll;

          return {
            ...poll,
            options: poll.options.map((opt) => {
              if (opt.id === optionId) {
                const newVotes = opt.votes + 1;
                const newTotal = poll.totalVotes + 1;
                return {
                  ...opt,
                  votes: newVotes,
                  voters: [...opt.voters, currentUser.id],
                  percentage: Math.round((newVotes / newTotal) * 100),
                };
              }
              return {
                ...opt,
                percentage: Math.round(
                  (opt.votes / (poll.totalVotes + 1)) * 100,
                ),
              };
            }),
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

  const renderTradeIdea = (tradeIdea: TradeIdea) => (
    <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
      <div className="flex items-center gap-2 mb-3">
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
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < tradeIdea.confidence
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <DollarSign className="h-3 w-3 text-green-500" />
          <span>Entry: ${tradeIdea.entryPrice}</span>
        </div>
        {tradeIdea.targetPrice && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span>Target: ${tradeIdea.targetPrice}</span>
          </div>
        )}
        {tradeIdea.stopLoss && (
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3 w-3 text-red-500" />
            <span>Stop: ${tradeIdea.stopLoss}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Star className="h-3 w-3 text-yellow-500" />
          <span>Confidence: {tradeIdea.confidence}/5</span>
        </div>
      </div>
    </div>
  );

  const filteredMessages = messages.filter((msg) => {
    if (filterSentiment === "all") return true;
    return msg.sentiment === filterSentiment;
  });

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
                <Button size="sm" variant="outline" className="ml-auto">
                  <PlusCircle className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {polls.slice(0, 2).map((poll) => (
                <div key={poll.id} className="border rounded-lg p-3 space-y-3">
                  <div className="text-sm font-medium">{poll.question}</div>
                  <div className="space-y-2">
                    {poll.options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className="w-full h-auto p-2 hover:bg-blue-50"
                        onClick={() => handleVote(poll.id, option.id)}
                        disabled={poll.options.some((opt) =>
                          opt.voters.includes(currentUser.id),
                        )}
                      >
                        <div className="w-full">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{option.text}</span>
                            <span>{option.percentage}%</span>
                          </div>
                          <Progress
                            value={option.percentage}
                            className="h-1.5"
                          />
                        </div>
                      </Button>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{poll.totalVotes} votes</span>
                    <span>Expires in {Math.floor(Math.random() * 6) + 1}h</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Summary Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Market Summary
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

              <div className="space-y-2 text-sm">
                <div className="font-medium">Key Insights:</div>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>• Strong bullish sentiment on AI stocks</li>
                  <li>• 73% of trades are buy signals</li>
                  <li>• NVDA most discussed (+247 mentions)</li>
                  <li>• Average confidence: 3.2/5 stars</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Trending Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTrendingTickers.slice(0, 5).map((ticker, i) => (
                <div
                  key={ticker.symbol}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400">
                      #{i + 1}
                    </span>
                    <DollarSign className="h-3 w-3 text-blue-500" />
                    <span className="text-sm font-medium">{ticker.symbol}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {ticker.mentions}
                    </span>
                    <Badge
                      variant={ticker.sentiment > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {ticker.sentiment > 0 ? "+" : ""}
                      {ticker.sentiment}%
                    </Badge>
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
                  <Zap className="h-5 w-5 text-yellow-500" />
                  StockTwist Room
                  <Badge
                    className={`${isLive ? "animate-pulse" : ""} bg-yellow-500 text-black`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-1 ${
                        isLive ? "bg-white" : "bg-gray-400"
                      }`}
                    ></div>
                    {isLive ? "LIVE" : "PAUSED"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    2.8K online
                  </Badge>
                </CardTitle>

                <div className="flex gap-2">
                  <Select
                    value={filterSentiment}
                    onValueChange={(value: any) => setFilterSentiment(value)}
                  >
                    <SelectTrigger className="w-32 h-8">
                      <Filter className="h-3 w-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Posts</SelectItem>
                      <SelectItem value="bullish">📈 Bullish</SelectItem>
                      <SelectItem value="bearish">📉 Bearish</SelectItem>
                    </SelectContent>
                  </Select>

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

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTradeIdeaHelper(!showTradeIdeaHelper)}
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Format Helper
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[580px]">
                <div className="p-4 space-y-4">
                  {filteredMessages.map((message) => (
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
                            {getTimeAgo(message.createdAt)}
                          </span>
                          {message.type === "trade_idea" && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              <Target className="h-2 w-2 mr-1" />
                              Trade Idea
                            </Badge>
                          )}
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

                        {/* StockTwist Reactions */}
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

            {/* Message Composer */}
            <div className="border-t p-4">
              <div className="space-y-2">
                {showTradeIdeaHelper && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-xs">
                    <div className="font-semibold mb-1">Trade Idea Format:</div>
                    <div className="space-y-1">
                      <div>
                        <strong>Buy:</strong> Buy $TICKER at price / Target
                        price / SL price 📈
                      </div>
                      <div>
                        <strong>Sell:</strong> Sell $TICKER at price / Target
                        price / SL price 📉
                      </div>
                      <div>
                        <strong>Example:</strong> Buy $NVDA at 850 / Target 900
                        / SL 820 📈 AI earnings play
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your trade idea... Buy/Sell $TICKER at $PRICE / Target / SL"
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
                        Use $TICKER format for stocks. Add 📈/📉 for sentiment.
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
            </div>
          </Card>
        </div>

        {/* Right Panel - Leaderboard */}
        <div className="col-span-3 space-y-6">
          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockLeaderboard.users.slice(0, 5).map((user, i) => (
                <div key={user.userId} className="flex items-center gap-3">
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
                      {getUserRoleIcon(user.tier)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.accuracy}% accuracy • {user.score} points
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Room Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Room Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-xs text-muted-foreground">
                    Trade Ideas Today
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">73%</div>
                  <div className="text-xs text-muted-foreground">
                    Bullish Sentiment
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">2.8K</div>
                  <div className="text-xs text-muted-foreground">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">4.2</div>
                  <div className="text-xs text-muted-foreground">
                    Avg Confidence
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">Sentiment Breakdown</div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      Bullish
                    </span>
                    <span className="text-xs">73%</span>
                  </div>
                  <Progress value={73} className="h-1" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      Bearish
                    </span>
                    <span className="text-xs">19%</span>
                  </div>
                  <Progress value={19} className="h-1" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs flex items-center gap-1">
                      <Minus className="h-3 w-3 text-gray-500" />
                      Neutral
                    </span>
                    <span className="text-xs">8%</span>
                  </div>
                  <Progress value={8} className="h-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
