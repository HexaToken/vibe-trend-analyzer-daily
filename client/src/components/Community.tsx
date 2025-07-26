import { useState } from "react";
import {
  MessageSquare,
  Users,
  ThumbsUp,
  Share2,
  Clock,
  Trophy,
  ChevronDown,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Pin,
  Flame,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostInteractionBar } from "./social/PostInteractionBar";
import {
  CheckCircle,
  AlertTriangle,
  Award,
  Star,
  BookOpen,
  Target,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "General" | "Crypto"
  >("General");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");

  const handleFollow = (userId: string) => {
    console.log(`Following user: ${userId}`);
  };

  const handleUnfollow = (userId: string) => {
    console.log(`Unfollowing user: ${userId}`);
  };

  const handleToggleAlerts = (userId: string, enabled: boolean) => {
    console.log(`${enabled ? 'Enabling' : 'Disabling'} alerts for user: ${userId}`);
  };

  const forumPosts = [
    {
      id: 1,
      userId: "user-sentiment-analyst",
      author: "SentimentAnalyst",
      avatar: "SA",
      time: "2 hours ago",
      content:
        "Today's spike in positive sentiment seems to be driven by the tech innovation summit. The AI breakthrough announcements are really resonating across social media platforms.",
      likes: 24,
      replies: 8,
      shares: 3,
      views: 156,
      badge: "Expert",
      credibilityScore: 9.2,
      needsReview: false,
      communityFavorite: true,
      verified: true,
      isPinned: false,
      isTrending: true,
    },
    {
      id: 2,
      userId: "user-market-watcher",
      author: "MarketWatcher",
      avatar: "MW",
      time: "4 hours ago",
      content:
        "Interesting correlation between the stock market performance and social sentiment today. The +8.4% change in market sentiment is unprecedented this week.",
      likes: 17,
      replies: 12,
      shares: 7,
      views: 234,
      badge: "Pro",
      credibilityScore: 8.7,
      needsReview: false,
      communityFavorite: false,
      verified: true,
      isPinned: true,
      isTrending: false,
    },
    {
      id: 3,
      userId: "user-data-digger",
      author: "DataDigger",
      avatar: "DD",
      time: "6 hours ago",
      content:
        "Has anyone noticed the regional differences in sentiment? North American data is showing much more optimism compared to European sources today.",
      likes: 31,
      replies: 15,
      shares: 2,
      views: 89,
      badge: "Verified",
      credibilityScore: 7.5,
      needsReview: true,
      communityFavorite: false,
      verified: true,
      isPinned: false,
      isTrending: false,
    },
    {
      id: 4,
      userId: "user-trend-spotter",
      author: "TrendSpotter",
      avatar: "TS",
      time: "8 hours ago",
      content:
        "Prediction: Tomorrow's mood score will hit 75+ if the current momentum continues. The 'innovation' keyword is trending massively.",
      likes: 42,
      replies: 23,
      shares: 12,
      views: 324,
      badge: "Predictor",
      credibilityScore: 8.9,
      needsReview: false,
      communityFavorite: true,
      verified: false,
      isPinned: false,
      isTrending: true,
    },
  ];

  const leaderboard = [
    { rank: 1, user: "TrendSpotter", predictions: 89, accuracy: 94, score: 9.2 },
    { rank: 2, user: "SentimentAnalyst", predictions: 76, accuracy: 91, score: 8.8 },
    { rank: 3, user: "MarketWatcher", predictions: 63, accuracy: 88, score: 8.5 },
    { rank: 4, user: "DataDigger", predictions: 58, accuracy: 85, score: 8.1 },
    { rank: 5, user: "MoodReader", predictions: 45, accuracy: 82, score: 7.8 },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Expert":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
      case "Pro":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case "Verified":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "Predictor":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 9.0) return "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300";
    if (score >= 8.0) return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300";
    if (score >= 7.0) return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300";
    if (score >= 6.0) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300";
    return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300";
  };

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case "popular": return <Flame className="w-4 h-4" />;
      case "trending": return <TrendingUp className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Header */}
        <div className="text-center space-y-3 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow sentiment analysts, share insights, and discuss predictions with the most active trading community
          </p>
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">847 online</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">156 posts today</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span className="font-medium">12.4K members</span>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-slate-800">
                      {selectedCategory === "Crypto" ? "🪙" : "💬"} {selectedCategory}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("General")}
                      className="flex items-center cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      General
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedCategory("Crypto")}
                      className="flex items-center cursor-pointer"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Crypto
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-slate-800">
                      {getSortIcon(sortBy)}
                      {sortBy === "recent" ? "Recent" : sortBy === "popular" ? "Popular" : "Trending"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-32">
                    <DropdownMenuItem onClick={() => setSortBy("recent")}>
                      <Clock className="w-4 h-4 mr-2" />
                      Recent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>
                      <Flame className="w-4 h-4 mr-2" />
                      Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("trending")}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Trending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" className="bg-white dark:bg-slate-800">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={
                      selectedCategory === "Crypto"
                        ? "Search crypto, $BTC, $ETH..."
                        : "Search posts, topics..."
                    }
                    className="pl-10 w-64 bg-white dark:bg-slate-800"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-4">
            {/* Create Post Card */}
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="ring-2 ring-blue-100 dark:ring-blue-900">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      YU
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Textarea
                      placeholder="What's your take on today's sentiment trends? Share your analysis..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[80px] border-0 bg-gray-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        <span>Share insights, predictions, or market analysis</span>
                      </div>
                      <Button 
                        disabled={!newPost.trim()} 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Post Insight
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {forumPosts.map((post) => (
                <Card key={post.id} className={`border-0 shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all hover:shadow-md ${post.isPinned ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="ring-2 ring-gray-100 dark:ring-gray-800">
                            <AvatarFallback className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                              {post.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-lg">{post.author}</span>

                              {/* Verified Badge */}
                              {post.verified && (
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                              )}

                              {/* Credibility Score */}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      className={`text-xs px-2 py-1 font-semibold ${getCredibilityColor(post.credibilityScore)}`}
                                    >
                                      {post.credibilityScore.toFixed(1)}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Credibility Score: {post.credibilityScore.toFixed(1)}/10.0</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              {/* User Badge */}
                              <Badge
                                variant="outline"
                                className={getBadgeColor(post.badge)}
                              >
                                {post.badge}
                              </Badge>

                              {/* Status Badges */}
                              {post.isPinned && (
                                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
                                  <Pin className="h-3 w-3 mr-1" />
                                  Pinned
                                </Badge>
                              )}

                              {post.isTrending && (
                                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300">
                                  <Flame className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}

                              {post.needsReview && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Needs Review
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>This post requires community review</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}

                              {post.communityFavorite && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400">
                                        <Award className="h-3 w-3 mr-1" />
                                        Community Favorite
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Highly appreciated by the community</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {post.views} views
                              </div>
                            </div>
                          </div>
                        </div>

                        <PostInteractionBar
                          userId={post.userId}
                          username={post.author}
                          compact={true}
                          onFollow={handleFollow}
                          onUnfollow={handleUnfollow}
                          onToggleAlerts={handleToggleAlerts}
                        />
                      </div>

                      {/* Post Content */}
                      <div className="pl-14">
                        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                          {post.content}
                        </p>
                      </div>

                      {/* Post Actions */}
                      <div className="pl-14 flex items-center gap-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {post.replies}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                          <Share2 className="h-4 w-4 mr-2" />
                          {post.shares}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      12.4K
                    </div>
                    <div className="text-sm text-muted-foreground">Total Members</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-green-600">847</div>
                      <div className="text-xs text-muted-foreground">Online Now</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">156</div>
                      <div className="text-xs text-muted-foreground">Posts Today</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Predictors */}
            <Card className="border-0 shadow-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Predictors
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                            user.rank === 1
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
                              : user.rank === 2
                                ? "bg-gradient-to-r from-gray-300 to-gray-400 text-black"
                                : user.rank === 3
                                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                          }`}
                        >
                          {user.rank}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.user}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.predictions} predictions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className={`text-xs mb-1 ${getCredibilityColor(user.score)}`}
                        >
                          {user.score}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {user.accuracy}% accuracy
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Challenge */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-blue-500" />
                  Daily Challenge
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div>
                  <div className="font-semibold text-sm mb-2">
                    🎯 Predict Tomorrow's Mood Score
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Current Score: <span className="font-medium text-blue-600">72</span></div>
                    <div>Your Prediction: <span className="font-medium text-purple-600">?</span></div>
                    <div>Deadline: <span className="font-medium">11:59 PM UTC</span></div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Star className="w-4 h-4 mr-2" />
                  Make Prediction
                </Button>
                <div className="text-xs text-center text-muted-foreground">
                  Win points and climb the leaderboard!
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
