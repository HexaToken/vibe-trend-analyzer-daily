import { useState } from "react";
import {
  ChartColumn,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard, type PostCardData } from "./social/PostCard";

interface PostData {
  id: string;
  user: {
    id: string;
    username: string;
    handle: string;
    avatar: string;
    verified: boolean;
    premium: boolean;
    credibilityScore: number;
  };
  timestamp: string;
  content: string;
  tickers: Array<{
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  tags: string[];
  engagement: {
    likes: number;
    comments: number;
    reposts: number;
    saves: number;
  };
  isFollowing: boolean;
  alertsEnabled: boolean;
  isLiked: boolean;
  isSaved: boolean;
}

export const Community = () => {
  const [activeTab, setActiveTab] = useState<"all" | "following">("all");
  const [newPost, setNewPost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for posts
  const mockPosts: PostData[] = [
    {
      id: "1",
      user: {
        id: "user1",
        username: "TechTrader",
        handle: "@techtrader",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
        verified: true,
        premium: true,
        credibilityScore: 94,
      },
      timestamp: "32 minutes ago",
      content: "🔥 $NVDA is showing incredible strength post-earnings. The AI momentum is unstoppable and I'm seeing massive institutional buying. This could easily hit $200 before Q1 ends. What are your thoughts? 🧠",
      tickers: [
        { symbol: "NVDA", price: 173.50, change: 8.25, changePercent: 4.98 }
      ],
      sentiment: "Bullish",
      tags: ["Prediction", "AI", "Earnings"],
      engagement: { likes: 127, comments: 34, reposts: 18, saves: 45 },
      isFollowing: false,
      alertsEnabled: false,
      isLiked: false,
      isSaved: false,
    },
    {
      id: "2",
      user: {
        id: "user2",
        username: "QuantAnalyst",
        handle: "@quantanalyst",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=faces",
        verified: true,
        premium: false,
        credibilityScore: 87,
      },
      timestamp: "1 hour ago",
      content: "Market volatility is creating some interesting opportunities. 🧊 $TSLA is oversold here - expecting a bounce back to $220 resistance. Risk/reward looking favorable for swing traders.",
      tickers: [
        { symbol: "TSLA", price: 198.32, change: -12.45, changePercent: -5.89 }
      ],
      sentiment: "Neutral",
      tags: ["Insight", "Technical Analysis"],
      engagement: { likes: 89, comments: 21, reposts: 12, saves: 28 },
      isFollowing: true,
      alertsEnabled: true,
      isLiked: true,
      isSaved: false,
    },
    {
      id: "3",
      user: {
        id: "user3",
        username: "CryptoSage",
        handle: "@cryptosage",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
        verified: false,
        premium: true,
        credibilityScore: 76,
      },
      timestamp: "2 hours ago",
      content: "⚠️ Seeing some concerning signals in the broader market. Fed uncertainty + rising yields = potential correction ahead. Might be time to hedge positions. $SPY $QQQ showing weakness.",
      tickers: [
        { symbol: "SPY", price: 445.21, change: -2.87, changePercent: -0.64 },
        { symbol: "QQQ", price: 378.95, change: -4.12, changePercent: -1.07 }
      ],
      sentiment: "Bearish",
      tags: ["Market Analysis", "Risk Management"],
      engagement: { likes: 156, comments: 67, reposts: 23, saves: 91 },
      isFollowing: false,
      alertsEnabled: false,
      isLiked: false,
      isSaved: true,
    },
  ];

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleAlerts = (userId: string) => {
    console.log(`Toggling alerts for user: ${userId}`);
  };

  const handleLike = (postId: string) => {
    console.log(`Liking post: ${postId}`);
  };

  const handleSave = (postId: string) => {
    console.log(`Saving post: ${postId}`);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
      case "Bearish":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300";
    if (score >= 80) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300";
    if (score >= 70) return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300";
    return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300";
  };

  const PostCard = ({ post }: { post: PostData }) => (
    <Card className="hover:shadow-md transition-all duration-200 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* User Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Avatar className="ring-2 ring-gray-100 dark:ring-gray-800">
                <AvatarImage src={post.user.avatar} alt={post.user.username} />
                <AvatarFallback>{post.user.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-lg">{post.user.username}</span>
                  <span className="text-muted-foreground text-sm">{post.user.handle}</span>
                  
                  {/* Verification Badge */}
                  {post.user.verified && (
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                  
                  {/* Premium Badge */}
                  {post.user.premium && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                  
                  {/* Credibility Score */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={`text-xs px-2 py-1 font-semibold ${getCredibilityColor(post.user.credibilityScore)}`}>
                          {post.user.credibilityScore}%
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Credibility Score: {post.user.credibilityScore}%</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {post.timestamp}
                </div>
              </div>
            </div>

            {/* Follow/Alerts Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleAlerts(post.user.id)}
                className={post.alertsEnabled ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
              >
                {post.alertsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
              
              <Button
                variant={post.isFollowing ? "default" : "outline"}
                size="sm"
                onClick={() => post.isFollowing ? handleUnfollow(post.user.id) : handleFollow(post.user.id)}
              >
                {post.isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Report Post</DropdownMenuItem>
                  <DropdownMenuItem>Mute User</DropdownMenuItem>
                  <DropdownMenuItem>Copy Link</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Post Content */}
          <div className="space-y-3">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            
            {/* Tickers */}
            {post.tickers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tickers.map((ticker) => (
                  <div key={ticker.symbol} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-lg">${ticker.symbol}</span>
                      <div className="text-right">
                        <div className="font-semibold">${ticker.price.toFixed(2)}</div>
                        <div className={`text-sm font-medium ${ticker.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)} ({ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge className={getSentimentColor(post.sentiment)}>
                {post.sentiment}
              </Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Engagement Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={`h-8 px-3 ${post.isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'}`}
              >
                <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                {post.engagement.likes}
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-600 hover:text-blue-600">
                <MessageSquare className="h-4 w-4 mr-2" />
                {post.engagement.comments}
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-600 hover:text-green-600">
                <Repeat2 className="h-4 w-4 mr-2" />
                {post.engagement.reposts}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSave(post.id)}
                className={`h-8 px-3 ${post.isSaved ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-600 hover:text-yellow-600'}`}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${post.isSaved ? 'fill-current' : ''}`} />
                {post.engagement.saves}
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {post.engagement.likes + post.engagement.comments + post.engagement.reposts} interactions
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const filteredPosts = activeTab === "following" 
    ? mockPosts.filter(post => post.isFollowing)
    : mockPosts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Market Discussion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time financial discussions and analysis from traders and sentiment AI
          </p>
        </div>

        {/* Tab Navigation - Sticky */}
        <div className="sticky top-16 z-40 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-4">
          <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
                  <TabsList className="grid w-64 grid-cols-2 bg-white dark:bg-slate-800">
                    <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <ChartColumn className="h-4 w-4" />
                      All
                    </TabsTrigger>
                    <TabsTrigger value="following" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <Users className="h-4 w-4" />
                      Following
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Post Composer */}
        <Card className="border-0 shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="ring-2 ring-blue-100 dark:ring-blue-900">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" />
                <AvatarFallback>YU</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea
                  placeholder="Share your market insights... Use $TICKER to mention stocks 📊"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] border-0 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 text-lg resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{newPost.length}/280</span>
                    <div className="flex gap-1">
                      {["$AAPL", "$NVDA", "$TSLA", "$MSFT"].map((ticker) => (
                        <Button
                          key={ticker}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setNewPost(prev => prev + ticker + " ")}
                        >
                          {ticker}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    disabled={!newPost.trim()} 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Post Insight
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts from followed users</h3>
                <p className="text-muted-foreground">
                  Start following traders and analysts to see their insights here
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("all")}
                >
                  Browse All Posts
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
