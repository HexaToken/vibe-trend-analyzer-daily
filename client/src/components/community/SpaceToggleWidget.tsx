import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  TrendingDown,
  Send,
  Hash,
  Users,
  ThumbsUp,
  MessageSquare,
  Star,
  Shield,
  Zap,
  DollarSign,
  Activity,
  Coffee,
  Image,
  Smile,
  Heart,
  Flame,
  Share2,
  Trophy,
  Pin,
  Award,
  Laugh,
} from "lucide-react";
import { useCryptoListings } from "@/hooks/useCoinMarketCap";
import { useAuth } from "@/contexts/AuthContext";

interface CryptoMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    badge?: string;
  };
  content: string;
  timestamp: string;
  ticker?: string;
  sentiment: number;
  likes: number;
  replies: number;
}

interface OffTopicPost {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags?: string[];
  isPinned?: boolean;
}

export const SpaceToggleWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("crypto");
  const [cryptoMessage, setCryptoMessage] = useState("");
  const [offTopicMessage, setOffTopicMessage] = useState("");
  const [selectedTicker, setSelectedTicker] = useState("BTC");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock crypto messages data
  const cryptoMessages: CryptoMessage[] = [
    {
      id: "1",
      user: { name: "CryptoKing", avatar: "/api/placeholder/32/32", badge: "Expert" },
      content: "BTC breaking resistance at $67k! This could be the start of the next leg up 🚀",
      timestamp: "2 min ago",
      ticker: "BTC",
      sentiment: 85,
      likes: 24,
      replies: 7,
    },
    {
      id: "2",
      user: { name: "BlockchainBae", avatar: "/api/placeholder/32/32", badge: "Verified" },
      content: "ETH merge anniversary showing strong fundamentals. Staking rewards looking solid 💎",
      timestamp: "5 min ago",
      ticker: "ETH",
      sentiment: 78,
      likes: 18,
      replies: 4,
    },
    {
      id: "3",
      user: { name: "DegenDave", avatar: "/api/placeholder/32/32" },
      content: "DOGE community stronger than ever! Much wow, very bullish 🐕",
      timestamp: "8 min ago",
      ticker: "DOGE",
      sentiment: 72,
      likes: 31,
      replies: 12,
    },
  ];

  // Mock off-topic posts data
  const offTopicPosts: OffTopicPost[] = [
    {
      id: "1",
      user: { name: "MemeLord", avatar: "/api/placeholder/32/32", verified: true },
      content: "When you finally understand options trading but your portfolio still looks like modern art 🎨📉",
      timestamp: "1 min ago",
      likes: 42,
      comments: 8,
      shares: 3,
      tags: ["meme", "trading"],
      isPinned: true,
    },
    {
      id: "2",
      user: { name: "VibeChecker", avatar: "/api/placeholder/32/32" },
      content: "Coffee update: Currently on cup #4. Market anxiety or caffeine addiction? Survey says... both! ☕",
      timestamp: "4 min ago",
      likes: 28,
      comments: 5,
      shares: 1,
      tags: ["coffee", "mood"],
    },
    {
      id: "3",
      user: { name: "ZenTrader", avatar: "/api/placeholder/32/32" },
      content: "Remember: The market is like a pendulum. It swings from optimism to pessimism, but gravity (value) always wins 🧘‍♂️",
      timestamp: "7 min ago",
      likes: 67,
      comments: 15,
      shares: 8,
      tags: ["wisdom", "mindset"],
    },
  ];

  const tickers = ["BTC", "ETH", "DOGE", "ADA", "SOL", "MATIC"];

  const handleSendCryptoMessage = () => {
    if (!cryptoMessage.trim() || !isAuthenticated) return;
    setCryptoMessage("");
  };

  const handleSendOffTopicMessage = () => {
    if (!offTopicMessage.trim() || !isAuthenticated) return;
    setOffTopicMessage("");
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return "text-green-500";
    if (sentiment >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getSentimentBg = (sentiment: number) => {
    if (sentiment >= 70) return "bg-green-500/10 border-green-500/20";
    if (sentiment >= 40) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Hash className="h-5 w-5 text-purple-400" />
            Space Central
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Users className="h-3 w-3 mr-1" />
            {activeTab === "crypto" ? "247 online" : "189 vibing"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Custom Tab Switcher */}
        <div className="relative">
          <div className="flex rounded-lg bg-gray-800/50 p-1 border border-gray-700">
            <button
              onClick={() => setActiveTab("crypto")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === "crypto"
                  ? "bg-gray-900 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Crypto
            </button>
            <button
              onClick={() => setActiveTab("offtopic")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === "offtopic"
                  ? "bg-gray-900 text-white shadow-lg"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Off-Topic
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "crypto" && (
          <div className="space-y-4">
            {/* Crypto Header */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-purple-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span className="text-white font-semibold">Crypto Chat</span>
              </div>
              <div className="flex items-center gap-1">
                {tickers.slice(0, 4).map((ticker) => (
                  <Badge
                    key={ticker}
                    variant={selectedTicker === ticker ? "default" : "secondary"}
                    className={`text-xs cursor-pointer ${
                      selectedTicker === ticker
                        ? "bg-green-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                    onClick={() => setSelectedTicker(ticker)}
                  >
                    ${ticker}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Crypto Messages */}
            <ScrollArea className="h-80">
              <div className="space-y-3 pr-4">
                {cryptoMessages.map((message) => (
                  <div
                    key={message.id}
                    className="group p-3 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.user.avatar} />
                        <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">
                            {message.user.name}
                          </span>
                          {message.user.badge && (
                            <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300">
                              {message.user.badge}
                            </Badge>
                          )}
                          {message.ticker && (
                            <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
                              ${message.ticker}
                            </Badge>
                          )}
                          <span className="text-gray-400 text-xs">{message.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{message.content}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                            <ThumbsUp className="h-3 w-3" />
                            <span className="text-xs">{message.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-xs">{message.replies}</span>
                          </button>
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-full border ${getSentimentBg(
                              message.sentiment
                            )}`}
                          >
                            <Activity className={`h-3 w-3 ${getSentimentColor(message.sentiment)}`} />
                            <span className={`text-xs ${getSentimentColor(message.sentiment)}`}>
                              {message.sentiment}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Crypto Message Input */}
            {isAuthenticated ? (
              <div className="flex gap-2">
                <Input
                  value={cryptoMessage}
                  onChange={(e) => setCryptoMessage(e.target.value)}
                  placeholder="Share your crypto insights..."
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && handleSendCryptoMessage()}
                />
                <Button
                  onClick={handleSendCryptoMessage}
                  disabled={!cryptoMessage.trim()}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-gray-400">Sign in to join the crypto discussion</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "offtopic" && (
          <div className="space-y-4">
            {/* Off-Topic Header */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-lg border border-violet-500/20">
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-violet-400" />
                <span className="text-white font-semibold">Off-Topic Central</span>
              </div>
              <div className="text-xs text-gray-400 italic">No tickers. Just vibes.</div>
            </div>

            {/* Off-Topic Posts */}
            <ScrollArea className="h-80">
              <div className="space-y-3 pr-4">
                {offTopicPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`group p-3 rounded-lg border transition-all duration-200 ${
                      post.isPinned
                        ? "bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20"
                        : "bg-gray-800/50 border-gray-700 hover:border-violet-500/50"
                    }`}
                  >
                    {post.isPinned && (
                      <div className="flex items-center gap-1 mb-2">
                        <Pin className="h-3 w-3 text-violet-400" />
                        <span className="text-xs text-violet-400 font-medium">Pinned</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.user.avatar} />
                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium text-sm">{post.user.name}</span>
                          {post.user.verified && (
                            <Shield className="h-3 w-3 text-blue-400" />
                          )}
                          <span className="text-gray-400 text-xs">{post.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{post.content}</p>
                        {post.tags && (
                          <div className="flex items-center gap-1 mt-2">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                            <Heart className="h-3 w-3" />
                            <span className="text-xs">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-xs">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors">
                            <Share2 className="h-3 w-3" />
                            <span className="text-xs">{post.shares}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Off-Topic Message Input */}
            {isAuthenticated ? (
              <div className="space-y-2">
                <Textarea
                  value={offTopicMessage}
                  onChange={(e) => setOffTopicMessage(e.target.value)}
                  placeholder="What's on your mind? Share something fun with the community..."
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 min-h-[60px] resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendOffTopicMessage}
                    disabled={!offTopicMessage.trim()}
                    className="bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-gray-400">Sign in to share your vibes</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
