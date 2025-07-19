import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Flag,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Smile,
  Meh,
  Frown,
  Hash,
  Clock,
  Users,
  BarChart3,
  ChevronUp,
  ChevronDown,
  Reply,
  Send,
  Search,
  Filter,
  Target,
  DollarSign,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CommunityRooms } from "@/components/social/CommunityRooms";
import { ChatInterface } from "@/components/moorMeter/ChatInterface";
import { TradeIdea } from "@/types/rooms";

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  tickers: string[];
  tags: string[];
  sentiment: "bullish" | "bearish" | "neutral";
  likes: number;
  dislikes: number;
  comments: Comment[];
  reposts: number;
  createdAt: Date;
  isUserLiked: boolean;
  isUserDisliked: boolean;
  tradeIdea?: TradeIdea;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: Date;
  replies: Comment[];
  isUserLiked: boolean;
}

interface TrendingItem {
  tag: string;
  count: number;
  change: number;
  type: "ticker" | "topic";
}

export const CommunityForum: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"chat" | "chat-rooms">("chat");
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState<
    "bullish" | "bearish" | "neutral"
  >("neutral");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">(
    "recent",
  );
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Mock data
  const mockPosts: Post[] = [
    {
      id: "post-1",
      userId: "user-1",
      username: "TechBull2024",
      userAvatar: "/api/placeholder/40/40",
      content:
        "Buy $NVDA at 875 / Target 950 / SL 820 📈 AI earnings season is looking incredibly strong! Expecting a breakout above resistance.",
      tickers: ["NVDA"],
      tags: ["Tech", "Earnings"],
      sentiment: "bullish",
      likes: 47,
      dislikes: 3,
      comments: [
        {
          id: "comment-1",
          userId: "user-2",
          username: "ValueInvestor",
          userAvatar: "/api/placeholder/32/32",
          content:
            "Great analysis! I'm also bullish on NVDA but watching for any earnings guidance surprises.",
          likes: 12,
          createdAt: new Date(Date.now() - 15 * 60 * 1000),
          replies: [],
          isUserLiked: false,
        },
      ],
      reposts: 8,
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      isUserLiked: false,
      isUserDisliked: false,
      tradeIdea: {
        ticker: "NVDA",
        action: "buy",
        entryPrice: 875,
        targetPrice: 950,
        stopLoss: 820,
        sentiment: "bullish",
        confidence: 4,
        timeframe: "swing",
      },
    },
    {
      id: "post-2",
      userId: "user-3",
      username: "CryptoWhale",
      userAvatar: "/api/placeholder/40/40",
      content:
        "Sell $SPY at 425 / Target 410 / SL 430 📉 Fed meeting tomorrow has me nervous. Expecting volatility across all markets.",
      tickers: ["SPY"],
      tags: ["Fed", "Options"],
      sentiment: "bearish",
      likes: 23,
      dislikes: 11,
      comments: [],
      reposts: 4,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isUserLiked: false,
      isUserDisliked: false,
      tradeIdea: {
        ticker: "SPY",
        action: "sell",
        entryPrice: 425,
        targetPrice: 410,
        stopLoss: 430,
        sentiment: "bearish",
        confidence: 3,
        timeframe: "day",
      },
    },
    {
      id: "post-3",
      userId: "user-4",
      username: "DividendHunter",
      userAvatar: "/api/placeholder/40/40",
      content:
        "While everyone's chasing growth, I'm quietly building my dividend portfolio. $JNJ, $PG, $KO - boring but reliable cash flow 💰",
      tickers: ["JNJ", "PG", "KO"],
      tags: ["Dividends", "Value"],
      sentiment: "neutral",
      likes: 34,
      dislikes: 2,
      comments: [],
      reposts: 6,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isUserLiked: false,
      isUserDisliked: false,
    },
  ];

  const trendingItems: TrendingItem[] = [
    { tag: "NVDA", count: 156, change: +24, type: "ticker" },
    { tag: "Fed Meeting", count: 89, change: +45, type: "topic" },
    { tag: "TSLA", count: 67, change: -12, type: "ticker" },
    { tag: "Earnings", count: 134, change: +18, type: "topic" },
    { tag: "Crypto", count: 78, change: +8, type: "topic" },
  ];

  const moodPollData = {
    bullish: 45,
    neutral: 32,
    bearish: 23,
  };

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const handleSubmitPost = () => {
    if (!newPost.trim() || !user) return;

    const tickers = (newPost.match(/\$([A-Z]{1,5})/g) || []).map((ticker) =>
      ticker.substring(1),
    );
    const hashtags = (newPost.match(/#([A-Za-z0-9_]+)/g) || []).map((tag) =>
      tag.substring(1),
    );

    // Enhanced trade idea detection
    let tradeIdea: TradeIdea | undefined;
    const buyMatch = newPost.match(/buy\s+\$(\w+)\s+at\s+(\d+\.?\d*)/i);
    const sellMatch = newPost.match(/sell\s+\$(\w+)\s+at\s+(\d+\.?\d*)/i);
    const targetMatch = newPost.match(/target\s+(\d+\.?\d*)/i);
    const slMatch = newPost.match(/sl\s+(\d+\.?\d*)/i);

    if (buyMatch || sellMatch) {
      const match = buyMatch || sellMatch;
      tradeIdea = {
        ticker: match![1].toUpperCase(),
        action: buyMatch ? "buy" : "sell",
        entryPrice: parseFloat(match![2]),
        targetPrice: targetMatch ? parseFloat(targetMatch[1]) : undefined,
        stopLoss: slMatch ? parseFloat(slMatch[1]) : undefined,
        sentiment: selectedSentiment,
        confidence: 3,
        timeframe: newPost.toLowerCase().includes("swing")
          ? "swing"
          : newPost.toLowerCase().includes("long")
            ? "long"
            : "day",
      };
    }

    const post: Post = {
      id: `post-${Date.now()}`,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar,
      content: newPost,
      tickers,
      tags: hashtags,
      sentiment: selectedSentiment,
      likes: 0,
      dislikes: 0,
      comments: [],
      reposts: 0,
      createdAt: new Date(),
      isUserLiked: false,
      isUserDisliked: false,
      tradeIdea,
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost("");
    setSelectedSentiment("neutral");
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isUserLiked ? post.likes - 1 : post.likes + 1,
              dislikes: post.isUserDisliked ? post.dislikes - 1 : post.dislikes,
              isUserLiked: !post.isUserLiked,
              isUserDisliked: false,
            }
          : post,
      ),
    );
  };

  const handleDislikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              dislikes: post.isUserDisliked
                ? post.dislikes - 1
                : post.dislikes + 1,
              likes: post.isUserLiked ? post.likes - 1 : post.likes,
              isUserDisliked: !post.isUserDisliked,
              isUserLiked: false,
            }
          : post,
      ),
    );
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSubmitReply = (postId: string) => {
    if (!replyContent.trim() || !user) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `comment-${Date.now()}`,
                  userId: user.id,
                  username: user.username,
                  userAvatar: user.avatar,
                  content: replyContent,
                  likes: 0,
                  createdAt: new Date(),
                  replies: [],
                  isUserLiked: false,
                },
              ],
            }
          : post,
      ),
    );

    setReplyContent("");
    setReplyingTo(null);
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <Smile className="h-4 w-4 text-green-500" />;
      case "bearish":
        return <Frown className="h-4 w-4 text-red-500" />;
      default:
        return <Meh className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "bg-green-100 text-green-800 border-green-200";
      case "bearish":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const renderTradeIdea = (tradeIdea: TradeIdea) => (
    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
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

  const filteredPosts = posts.filter(
    (post) =>
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tickers.some((ticker) =>
        ticker.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to share your market insights and join discussions with
              other traders.
            </p>
            <Button>Sign In to Continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="chat-rooms" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Chat Rooms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Main Content */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Select
                    value={sortBy}
                    onValueChange={(value: any) => setSortBy(value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="popular">Popular</SelectItem>
                      <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts, tickers, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Post Composer */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>
                        {user?.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <Textarea
                        placeholder="What's your market sentiment? Use $TICKER for stocks and #tags for topics... Format: Buy $TICKER at price / Target price / SL price"
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Select
                            value={selectedSentiment}
                            onValueChange={(value: any) =>
                              setSelectedSentiment(value)
                            }
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bullish">
                                <div className="flex items-center gap-2">
                                  <Smile className="h-4 w-4 text-green-500" />
                                  Bullish
                                </div>
                              </SelectItem>
                              <SelectItem value="neutral">
                                <div className="flex items-center gap-2">
                                  <Meh className="h-4 w-4 text-yellow-500" />
                                  Neutral
                                </div>
                              </SelectItem>
                              <SelectItem value="bearish">
                                <div className="flex items-center gap-2">
                                  <Frown className="h-4 w-4 text-red-500" />
                                  Bearish
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          onClick={handleSubmitPost}
                          disabled={!newPost.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.userAvatar} />
                            <AvatarFallback>
                              {post.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {post.username}
                              </span>
                              <Badge
                                className={`text-xs ${getSentimentBadgeColor(post.sentiment)}`}
                              >
                                {getSentimentEmoji(post.sentiment)}
                                <span className="ml-1">{post.sentiment}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(post.createdAt)}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Post Content */}
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed">
                          {post.content}
                        </p>

                        {/* Trade Signal */}
                        {post.tradeIdea && renderTradeIdea(post.tradeIdea)}

                        {/* Tags and Tickers */}
                        {(post.tickers.length > 0 || post.tags.length > 0) && (
                          <div className="flex flex-wrap gap-2">
                            {post.tickers.map((ticker) => (
                              <Badge
                                key={ticker}
                                variant="outline"
                                className="text-xs"
                              >
                                ${ticker}
                              </Badge>
                            ))}
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={post.isUserLiked ? "text-green-600" : ""}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDislikePost(post.id)}
                            className={
                              post.isUserDisliked ? "text-red-600" : ""
                            }
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {post.dislikes}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleComments(post.id)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.comments.length}
                          </Button>

                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            {post.reposts}
                          </Button>
                        </div>
                      </div>

                      {/* Comments Section */}
                      {expandedComments.has(post.id) && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          {/* Existing Comments */}
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 ml-4">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.userAvatar} />
                                <AvatarFallback>
                                  {comment.username[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">
                                      {comment.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimeAgo(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-1 ml-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {comment.likes}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                  >
                                    <Reply className="h-3 w-3 mr-1" />
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Reply Input */}
                          <div className="flex gap-3 ml-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user?.avatar} />
                              <AvatarFallback>
                                {user?.username?.[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Input
                                placeholder="Write a reply..."
                                value={
                                  replyingTo === post.id ? replyContent : ""
                                }
                                onChange={(e) => {
                                  setReplyContent(e.target.value);
                                  setReplyingTo(post.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmitReply(post.id);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleSubmitReply(post.id)}
                                disabled={
                                  !replyContent.trim() || replyingTo !== post.id
                                }
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Daily Mood Poll */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Daily Market Mood
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smile className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Bullish</span>
                      </div>
                      <span className="text-sm font-medium">
                        {moodPollData.bullish}%
                      </span>
                    </div>
                    <Progress value={moodPollData.bullish} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Meh className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Neutral</span>
                      </div>
                      <span className="text-sm font-medium">
                        {moodPollData.neutral}%
                      </span>
                    </div>
                    <Progress value={moodPollData.neutral} className="h-2" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Frown className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Bearish</span>
                      </div>
                      <span className="text-sm font-medium">
                        {moodPollData.bearish}%
                      </span>
                    </div>
                    <Progress value={moodPollData.bearish} className="h-2" />
                  </div>

                  <Button className="w-full" size="sm">
                    Cast Your Vote
                  </Button>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trending Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingItems.map((item, index) => (
                      <div
                        key={item.tag}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-4">
                            #{index + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            {item.type === "ticker" ? (
                              <span className="font-medium text-sm">
                                ${item.tag}
                              </span>
                            ) : (
                              <span className="font-medium text-sm">
                                #{item.tag}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {item.count}
                          </span>
                          <div
                            className={`flex items-center gap-1 ${
                              item.change > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.change > 0 ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                            <span className="text-xs">
                              {Math.abs(item.change)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        2.4K
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Online
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        567
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Posts Today
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      15.7K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Members
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <CommunityRooms />
        </TabsContent>
      </Tabs>
    </div>
  );
};
