import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MessageComposer } from "./MessageComposer";
import { MessageCard } from "./MessageCard";
import {
  MessageSquare,
  Filter,
  Users,
  TrendingUp,
  Search,
  Hash,
  DollarSign,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sentiment: "bullish" | "bearish" | "neutral";
  timeframe: "day" | "swing" | "long";
  cashtags: string[];
  timestamp: Date;
  replyTo?: string;
  user: {
    username: string;
    avatar: string;
    role: "admin" | "member" | "premium" | "verified" | "pro";
  };
  reactions: Record<string, number>;
  replies: Message[];
  performance?: number;
  isTopPost?: boolean;
  isTopToday?: boolean;
  streak?: number;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "liked" | "replied">(
    "recent",
  );
  const [filterBy, setFilterBy] = useState<
    "all" | "bullish" | "bearish" | "neutral"
  >("all");
  const [selectedTicker, setSelectedTicker] = useState<string>("all");
  const [collapsedMessages, setCollapsedMessages] = useState<Set<string>>(
    new Set(),
  );
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set(),
  );
  const [replyInputs, setReplyInputs] = useState<Record<string, boolean>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simulate real-time messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new messages to simulate real-time activity
      if (Math.random() > 0.85) {
        const mockNewMessages = [
          {
            content:
              "Breaking: $TSLA just hit new resistance at $220! 📈 Could be a breakout incoming",
            sentiment: "bullish" as const,
            timeframe: "day" as const,
            cashtags: ["$TSLA"],
            user: {
              username: "TeslaTrader",
              avatar: "/api/placeholder/32/32",
              role: "member" as const,
            },
          },
          {
            content:
              "Fed minutes just released - more hawkish than expected. Preparing for $SPY dump 📉",
            sentiment: "bearish" as const,
            timeframe: "day" as const,
            cashtags: ["$SPY"],
            user: {
              username: "FedWatcher",
              avatar: "/api/placeholder/32/32",
              role: "verified" as const,
            },
          },
          {
            content:
              "Perfect setup on $NVDA - cup and handle formation completing. Target $1000 🎯",
            sentiment: "bullish" as const,
            timeframe: "swing" as const,
            cashtags: ["$NVDA"],
            user: {
              username: "ChartMaster",
              avatar: "/api/placeholder/32/32",
              role: "premium" as const,
            },
          },
        ];

        const randomMsg =
          mockNewMessages[Math.floor(Math.random() * mockNewMessages.length)];
        const newMessage: Message = {
          id: Date.now().toString(),
          content: randomMsg.content,
          sentiment: randomMsg.sentiment,
          timeframe: randomMsg.timeframe,
          cashtags: randomMsg.cashtags,
          timestamp: new Date(),
          user: randomMsg.user,
          reactions: {},
          replies: [],
        };

        setMessages((prev) => [newMessage, ...prev.slice(0, 19)]); // Keep only latest 20 messages
      }
    }, 8000); // Add new message every 8 seconds on average

    return () => clearInterval(interval);
  }, []);

  // Mock initial messages with more complex data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        content:
          "Just analyzed $NVDA earnings - **strong beat** on revenue! 🚀 My target is $950 with stop at $820. The AI narrative is far from over.",
        sentiment: "bullish",
        timeframe: "swing",
        cashtags: ["$NVDA"],
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        user: {
          username: "ChipWhisperer",
          avatar: "/api/placeholder/32/32",
          role: "premium",
        },
        reactions: { like: 23, smart: 8, yolo: 3 },
        replies: [
          {
            id: "1-1",
            content:
              "Completely agree! The guidance was incredible too. Adding to my position.",
            sentiment: "bullish",
            timeframe: "swing",
            cashtags: [],
            timestamp: new Date(Date.now() - 3 * 60 * 1000),
            replyTo: "1",
            user: {
              username: "TechBull2024",
              avatar: "/api/placeholder/32/32",
              role: "verified",
            },
            reactions: { like: 5 },
            replies: [],
          },
          {
            id: "1-2",
            content:
              "What about the supply chain concerns though? Still bullish but maybe $900 is more realistic target 🤔",
            sentiment: "neutral",
            timeframe: "swing",
            cashtags: ["$NVDA"],
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            replyTo: "1",
            user: {
              username: "CautiousTrader",
              avatar: "/api/placeholder/32/32",
              role: "member",
            },
            reactions: { smart: 3, like: 2 },
            replies: [],
          },
          {
            id: "1-3",
            content: "Just went all in! This is the next $TSLA moment 🚀🚀🚀",
            sentiment: "bullish",
            timeframe: "day",
            cashtags: ["$NVDA", "$TSLA"],
            timestamp: new Date(Date.now() - 1 * 60 * 1000),
            replyTo: "1",
            user: {
              username: "YOLOInvestor",
              avatar: "/api/placeholder/32/32",
              role: "member",
            },
            reactions: { yolo: 8, fire: 4 },
            replies: [],
          },
        ],
        isTopPost: true,
        performance: 8.6,
      },
      {
        id: "2",
        content:
          "📉 $SPY looking weak here. Fed hawkish tone tomorrow could trigger a selloff. Hedging with puts.",
        sentiment: "bearish",
        timeframe: "day",
        cashtags: ["$SPY"],
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        user: {
          username: "MarketBear",
          avatar: "/api/placeholder/32/32",
          role: "pro",
        },
        reactions: { bearish: 12, smart: 4 },
        replies: [
          {
            id: "2-1",
            content:
              "Agree on the bearish outlook but $SPY has strong support at 420. Might bounce from there 📈",
            sentiment: "neutral",
            timeframe: "day",
            cashtags: ["$SPY"],
            timestamp: new Date(Date.now() - 12 * 60 * 1000),
            replyTo: "2",
            user: {
              username: "SupportResistance",
              avatar: "/api/placeholder/32/32",
              role: "verified",
            },
            reactions: { smart: 6 },
            replies: [],
          },
        ],
        streak: 5,
      },
      {
        id: "3",
        content:
          "Quick scalp on $TSLA - in at 195, out at 198.50. Small wins add up! 💎",
        sentiment: "bullish",
        timeframe: "day",
        cashtags: ["$TSLA"],
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        user: {
          username: "DayTrader99",
          avatar: "/api/placeholder/32/32",
          role: "member",
        },
        reactions: { like: 8, fire: 2 },
        replies: [],
        performance: 1.8,
        isTopToday: true,
      },
    ];

    setMessages(mockMessages);
  }, []);

  const handleNewMessage = (message: any) => {
    if (message.replyTo) {
      // Add as reply to existing message
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === message.replyTo) {
            return { ...msg, replies: [...msg.replies, message] };
          }
          return msg;
        }),
      );
      setReplyingTo(null);
    } else {
      // Add as new top-level message
      setMessages((prev) => [message, ...prev]);
    }

    // Scroll to bottom
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    const updateMessageReaction = (msgs: Message[]): Message[] => {
      return msgs.map((msg) => {
        if (msg.id === messageId) {
          const currentCount = msg.reactions[reaction] || 0;
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [reaction]: currentCount + 1,
            },
          };
        }
        if (msg.replies.length > 0) {
          return { ...msg, replies: updateMessageReaction(msg.replies) };
        }
        return msg;
      });
    };

    setMessages((prev) => updateMessageReaction(prev));
  };

  const handleToggleCollapse = (messageId: string) => {
    setCollapsedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const getFilteredMessages = () => {
    let filtered = [...messages];

    // Filter by sentiment
    if (filterBy !== "all") {
      filtered = filtered.filter((msg) => msg.sentiment === filterBy);
    }

    // Filter by ticker
    if (selectedTicker !== "all") {
      filtered = filtered.filter(
        (msg) =>
          msg.cashtags.includes(selectedTicker) ||
          msg.replies.some((reply) => reply.cashtags.includes(selectedTicker)),
      );
    }

    // Sort messages
    switch (sortBy) {
      case "liked":
        filtered.sort((a, b) => {
          const aLikes = Object.values(a.reactions).reduce(
            (sum, count) => sum + count,
            0,
          );
          const bLikes = Object.values(b.reactions).reduce(
            (sum, count) => sum + count,
            0,
          );
          return bLikes - aLikes;
        });
        break;
      case "replied":
        filtered.sort((a, b) => b.replies.length - a.replies.length);
        break;
      default: // recent
        filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    return filtered;
  };

  const handleThreadToggle = (messageId: string) => {
    setExpandedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleReplyToggle = (messageId: string) => {
    setReplyInputs((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const handleQuickReply = (parentMessage: Message) => {
    setReplyingTo(parentMessage);
    setReplyInputs((prev) => ({
      ...prev,
      [parentMessage.id]: true,
    }));

    // Auto-expand thread if collapsed
    if (
      !expandedThreads.has(parentMessage.id) &&
      parentMessage.replies.length > 0
    ) {
      setExpandedThreads((prev) => new Set(prev).add(parentMessage.id));
    }
  };

  const handleReplySubmit = (content: string, parentId: string) => {
    if (!content.trim()) return;

    const replyMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sentiment: "neutral",
      timeframe: "day",
      cashtags: content.match(/\$[A-Z]{1,5}/g) || [],
      timestamp: new Date(),
      replyTo: parentId,
      user: {
        username: "You",
        avatar: "/api/placeholder/32/32",
        role: "member",
      },
      reactions: {},
      replies: [],
    };

    handleNewMessage(replyMessage);
    setReplyInputs((prev) => ({
      ...prev,
      [parentId]: false,
    }));
  };

  const renderMessage = (message: Message, depth = 0) => {
    const isCollapsed = collapsedMessages.has(message.id);
    const isThreadExpanded = expandedThreads.has(message.id);
    const showReplyInput = replyInputs[message.id];

    return (
      <div key={message.id} className="space-y-2">
        <MessageCard
          message={message}
          onReply={handleQuickReply}
          onReaction={handleReaction}
          depth={depth}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onThreadToggle={handleThreadToggle}
          onReplyToggle={handleReplyToggle}
          isThreadExpanded={isThreadExpanded}
          showReplyInput={showReplyInput}
          onReplySubmit={handleReplySubmit}
        />

        {/* Thread expansion */}
        {!isCollapsed && message.replies.length > 0 && (
          <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-2">
            {isThreadExpanded ? (
              message.replies.map((reply) => renderMessage(reply, depth + 1))
            ) : (
              <button
                onClick={() => handleThreadToggle(message.id)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
              >
                🔗 {message.replies.length}{" "}
                {message.replies.length === 1 ? "reply" : "replies"}
                {message.replies.some(
                  (reply) =>
                    reply.timestamp > new Date(Date.now() - 5 * 60 * 1000),
                ) && (
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-1 rounded">
                    New
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const getAllTickers = () => {
    const tickers = new Set<string>();
    const extractTickers = (msgs: Message[]) => {
      msgs.forEach((msg) => {
        msg.cashtags.forEach((tag) => tickers.add(tag));
        if (msg.replies.length > 0) extractTickers(msg.replies);
      });
    };
    extractTickers(messages);
    return Array.from(tickers).sort();
  };

  const getStats = () => {
    const allMessages = messages.reduce((acc, msg) => {
      acc.push(msg, ...msg.replies);
      return acc;
    }, [] as Message[]);

    return {
      total: allMessages.length,
      bullish: allMessages.filter((m) => m.sentiment === "bullish").length,
      bearish: allMessages.filter((m) => m.sentiment === "bearish").length,
      avgSentiment:
        allMessages.length > 0
          ? Math.round(
              (allMessages.filter((m) => m.sentiment === "bullish").length /
                allMessages.length) *
                100,
            )
          : 50,
    };
  };

  const stats = getStats();
  const filteredMessages = getFilteredMessages();
  const allTickers = getAllTickers();

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {stats.total} messages
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Filters */}
        <div className="p-4 border-b bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Filter:
              </span>
            </div>

            <Select
              value={sortBy}
              onValueChange={(value: any) => setSortBy(value)}
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="liked">Most Liked</SelectItem>
                <SelectItem value="replied">Most Replied</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterBy}
              onValueChange={(value: any) => setFilterBy(value)}
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sentiment</SelectItem>
                <SelectItem value="bullish">📈 Bullish</SelectItem>
                <SelectItem value="bearish">📉 Bearish</SelectItem>
                <SelectItem value="neutral">😐 Neutral</SelectItem>
              </SelectContent>
            </Select>

            {allTickers.length > 0 && (
              <Select value={selectedTicker} onValueChange={setSelectedTicker}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue placeholder="All Tickers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickers</SelectItem>
                  {allTickers.map((ticker) => (
                    <SelectItem key={ticker} value={ticker}>
                      {ticker}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>{stats.bullish} bullish</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
              <span>{stats.bearish} bearish</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{stats.avgSentiment}% bullish sentiment</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No messages match your filters
                </p>
              </div>
            ) : (
              filteredMessages.map((message) => renderMessage(message))
            )}
          </div>
        </ScrollArea>

        {/* Message Composer */}
        <div className="border-t bg-gray-50 dark:bg-gray-800/50">
          <MessageComposer
            onSubmit={handleNewMessage}
            replyTo={replyingTo}
            onCancel={() => setReplyingTo(null)}
            placeholder={
              replyingTo
                ? `Reply to ${replyingTo.user.username}...`
                : "Share your market insights... Use $TICKER for stocks"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
