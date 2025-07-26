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

export const Community = () => {
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "General" | "Crypto"
  >("General");

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
      badge: "Expert",
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
      badge: "Pro",
    },
    {
      id: 3,
      author: "DataDigger",
      avatar: "DD",
      time: "6 hours ago",
      content:
        "Has anyone noticed the regional differences in sentiment? North American data is showing much more optimism compared to European sources today.",
      likes: 31,
      replies: 15,
      badge: "Verified",
    },
    {
      id: 4,
      author: "TrendSpotter",
      avatar: "TS",
      time: "8 hours ago",
      content:
        "Prediction: Tomorrow's mood score will hit 75+ if the current momentum continues. The 'innovation' keyword is trending massively.",
      likes: 42,
      replies: 23,
      badge: "Predictor",
    },
  ];

  const leaderboard = [
    { rank: 1, user: "TrendSpotter", predictions: 89, accuracy: 94 },
    { rank: 2, user: "SentimentAnalyst", predictions: 76, accuracy: 91 },
    { rank: 3, user: "MarketWatcher", predictions: 63, accuracy: 88 },
    { rank: 4, user: "DataDigger", predictions: 58, accuracy: 85 },
    { rank: 5, user: "MoodReader", predictions: 45, accuracy: 82 },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Expert":
        return "bg-positive/10 text-positive border-positive/20";
      case "Pro":
        return "bg-primary/10 text-primary border-primary/20";
      case "Verified":
        return "bg-neutral/10 text-neutral border-neutral/20";
      case "Predictor":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Community Hub</h1>
        <p className="text-xl text-muted-foreground">
          Connect with fellow sentiment analysts, share insights, and discuss
          predictions
        </p>
      </div>

      {/* Category Selection and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
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
          <div className="text-sm text-muted-foreground">
            {selectedCategory === "Crypto"
              ? "Focused on crypto tickers, trends, and blockchain discussions"
              : "Open discussions on all topics, memes, and general market talk"}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={
              selectedCategory === "Crypto"
                ? "Search crypto, $BTC, $ETH..."
                : "Search posts, topics..."
            }
            className="pl-10 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Forum */}
        <div className="lg:col-span-2 space-y-6">
          {/* New Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Share Your Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's your take on today's sentiment trends?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Share your analysis, predictions, or questions with the
                  community
                </div>
                <Button disabled={!newPost.trim()}>Post Insight</Button>
              </div>
            </CardContent>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-4">
            {forumPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.author}</span>
                        <Badge
                          variant="outline"
                          className={getBadgeColor(post.badge)}
                        >
                          {post.badge}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {post.time}
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {post.replies}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                  <div className="text-2xl font-bold text-primary">12.4K</div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-positive">847</div>
                  <div className="text-sm text-muted-foreground">Online</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral">156</div>
                <div className="text-sm text-muted-foreground">Posts today</div>
              </div>
            </CardContent>
          </Card>

          {/* Prediction Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top Predictors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          user.rank === 1
                            ? "bg-yellow-500 text-black"
                            : user.rank === 2
                              ? "bg-gray-400 text-black"
                              : user.rank === 3
                                ? "bg-orange-600 text-white"
                                : "bg-muted text-muted-foreground"
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
                    <Badge variant="outline" className="text-xs">
                      {user.accuracy}% accuracy
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Challenge */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <strong>Predict tomorrow's mood score!</strong>
              </div>
              <div className="text-sm text-muted-foreground">
                Current score: 72
                <br />
                Your prediction: ?
              </div>
              <Button className="w-full" size="sm">
                Make Prediction
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                Deadline: 11:59 PM UTC
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
