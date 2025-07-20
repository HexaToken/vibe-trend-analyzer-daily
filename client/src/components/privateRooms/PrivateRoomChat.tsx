import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Send,
  TrendingUp,
  TrendingDown,
  Minus,
  Smile,
  Star,
  Users,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Share,
  Flag,
  Crown,
  Shield,
  Target,
  ThumbsUp,
  Brain,
  AlertTriangle,
  CheckCircle,
  Pin,
  Reply,
  Hash,
  Settings,
  UserPlus,
  Bell,
  BellOff,
  Archive,
  Copy,
  ExternalLink,
  DollarSign,
  Clock,
  Eye,
  Lock,
} from "lucide-react";

import {
  PrivateRoom,
  RoomMessage,
  TradeIdea,
  User,
} from "@/types/privateRooms";
import {
  mockRoomMessages,
  mockUsers,
  parseCashtags,
  getTimeAgo,
} from "@/data/privateRoomsMockData";

interface PrivateRoomChatProps {
  room: PrivateRoom;
  onBackToRooms: () => void;
}

const EMOJI_LIST = [
  "😀",
  "😂",
  "😍",
  "🤔",
  "😎",
  "🚀",
  "📈",
  "📉",
  "💎",
  "🐻",
  "🐂",
  "🔥",
  "💯",
  "👍",
  "👎",
  "✅",
  "⚠️",
  "🧠",
  "💪",
  "🎯",
  "⭐",
  "❤️",
  "👀",
  "🤝",
  "💰",
];

export const PrivateRoomChat: React.FC<PrivateRoomChatProps> = ({
  room,
  onBackToRooms,
}) => {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | "neutral">(
    "neutral",
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = useState<RoomMessage | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showMembersList, setShowMembersList] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock current user
  const currentUser: User = mockUsers[0]; // TechBull2024

  // Load messages for the room
  useEffect(() => {
    const roomMessages = mockRoomMessages[room.id] || [];
    setMessages(roomMessages);
  }, [room.id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

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
        sentiment: buyMatch ? "bullish" : "bearish",
        confidence: 3,
        timeframe: newMessage.toLowerCase().includes("swing")
          ? "swing"
          : newMessage.toLowerCase().includes("long")
            ? "long"
            : "day",
        strategy: "Manual trade idea",
        notes: newMessage,
      };
    }

    const message: RoomMessage = {
      id: `msg-${Date.now()}`,
      roomId: room.id,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: newMessage.trim(),
      cashtags,
      sentiment,
      tradeIdea,
      parentMessageId: replyingTo?.id,
      reactions: [],
      isPinned: false,
      type: tradeIdea ? "trade_idea" : "message",
      createdAt: new Date(),
      mentions: [],
      attachments: [],
    };

    if (replyingTo) {
      // Add as reply to existing message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === replyingTo.id
            ? { ...msg, reactions: [...(msg.reactions || []), message] as any }
            : msg,
        ),
      );
      setReplyingTo(null);
    } else {
      // Add as new message
      setMessages((prev) => [message, ...prev]);
    }

    setNewMessage("");
    setSentiment("neutral");
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

  const toggleThread = (messageId: string) => {
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "border-l-green-500 bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20";
      case "bearish":
        return "border-l-red-500 bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20";
      default:
        return "border-l-gray-300 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/20";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "bearish":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "premium":
        return <Crown className="w-3 h-3 text-purple-500" />;
      case "verified":
        return <Shield className="w-3 h-3 text-blue-500" />;
      case "admin":
        return <Star className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getReactionIcon = (reaction: string) => {
    if (["👍", "👎", "❤️", "😂", "😮", "😢", "😡"].includes(reaction)) {
      return reaction;
    }
    switch (reaction) {
      case "like":
        return <ThumbsUp className="w-3 h-3" />;
      case "smart":
        return <Brain className="w-3 h-3" />;
      case "risky":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
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
        {tradeIdea.strategy && (
          <div className="flex items-center gap-2">
            <Brain className="h-3 w-3 text-purple-500" />
            <span>Strategy: {tradeIdea.strategy}</span>
          </div>
        )}
      </div>
    </div>
  );

  const MessageCard: React.FC<{ message: RoomMessage; isReply?: boolean }> = ({
    message,
    isReply = false,
  }) => (
    <Card
      className={`${getSentimentColor(message.sentiment || "neutral")} border-l-4 ${
        isReply ? "ml-6 mt-2" : ""
      } shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.userAvatar} />
            <AvatarFallback className="text-xs">
              {message.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{message.username}</span>
              {getUserRoleIcon(message.userRole)}
              {message.sentiment && getSentimentIcon(message.sentiment)}
              <span className="text-xs text-gray-500">
                {getTimeAgo(message.createdAt)}
              </span>
              {message.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
            </div>

            <div className="text-sm leading-relaxed break-words">
              {message.content.split(" ").map((word, i) => {
                if (word.startsWith("$") && word.length > 1) {
                  return (
                    <Badge key={i} variant="outline" className="mx-1 text-xs">
                      {word}
                    </Badge>
                  );
                }
                if (word.startsWith("@") && word.length > 1) {
                  return (
                    <span key={i} className="mx-1 text-blue-600 font-medium">
                      {word}
                    </span>
                  );
                }
                return word + " ";
              })}
            </div>

            {message.tradeIdea && renderTradeIdea(message.tradeIdea)}

            {/* Reactions */}
            <div className="flex items-center gap-2 mt-3">
              {["📈", "📉", "💎", "🚀", "⚠️"].map((emoji) => {
                const reaction = message.reactions.find(
                  (r) => r.emoji === emoji,
                );
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(message.id, emoji)}
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

              <Separator orientation="vertical" className="h-4" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(message)}
                className="h-6 px-2 text-xs"
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  {currentUser.id === message.userId && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Pin className="h-4 w-4 mr-2" />
                        {message.isPinned ? "Unpin" : "Pin"} Message
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="p-4 border-b bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBackToRooms}>
                ← Back
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-gray-500" />
                  <h1 className="text-xl font-semibold">{room.name}</h1>
                  {room.type === "private" && (
                    <Lock className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {room.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {room.tickers.map((ticker) => (
                    <Badge key={ticker} variant="outline" className="text-xs">
                      ${ticker}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMembersList(!showMembersList)}
              >
                <Users className="h-4 w-4 mr-2" />
                Members ({room.members?.length || 0})
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Welcome to {room.name}!
                </h3>
                <p className="text-gray-500">
                  Start the conversation by sending the first message.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <div className="px-4 py-2 text-sm text-gray-500">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing...
          </div>
        )}

        {/* Reply Context */}
        {replyingTo && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 mx-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Replying to {replyingTo.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-2 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>
                {currentUser.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message... Use $TICKER for stocks, @username for mentions"
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select
                    value={sentiment}
                    onValueChange={(value: any) => setSentiment(value)}
                  >
                    <SelectTrigger className="w-32 h-7 text-xs">
                      <div className="flex items-center gap-1">
                        {getSentimentIcon(sentiment)}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bullish">📈 Bullish</SelectItem>
                      <SelectItem value="neutral">😐 Neutral</SelectItem>
                      <SelectItem value="bearish">📉 Bearish</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover
                    open={showEmojiPicker}
                    onOpenChange={setShowEmojiPicker}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7">
                        <Smile className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <div className="grid grid-cols-8 gap-1">
                        {EMOJI_LIST.map((emoji) => (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => insertEmoji(emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    Ctrl+Enter to send
                  </span>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      {showMembersList && (
        <div className="w-64 border-l bg-white dark:bg-gray-800">
          <div className="p-4">
            <h3 className="font-semibold mb-4">
              Members ({room.members?.length || 0})
            </h3>
            <div className="space-y-2">
              {room.members?.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-xs">
                      {member.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium truncate">
                        {member.username}
                      </span>
                      {getUserRoleIcon(member.role)}
                    </div>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          member.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs text-gray-500">
                        {member.isOnline
                          ? "Online"
                          : getTimeAgo(member.lastSeen)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
