import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { useMoodTheme } from '../contexts/MoodThemeContext';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Users,
  Trophy,
  Target,
  Timer,
  Zap,
  Award,
  Crown,
  Star,
  ArrowUp,
  ArrowDown,
  Clock,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  CheckCircle,
  Fire,
  Eye,
  TrendingDownIcon,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface PollVote {
  id: string;
  ticker: string;
  sentiment: 'bullish' | 'bearish' | 'holding';
  timestamp: string;
  userId: string;
  username: string;
}

interface PollStats {
  ticker: string;
  bullish: number;
  bearish: number;
  holding: number;
  totalVotes: number;
  lastUpdated: string;
  userVote?: 'bullish' | 'bearish' | 'holding';
  aiSentiment?: number;
  priceChange24h?: number;
}

interface User {
  id: string;
  username: string;
  accuracy: number;
  totalVotes: number;
  streak: number;
  badges: string[];
  rank: number;
}

const mockPolls: PollStats[] = [
  {
    ticker: 'AAPL',
    bullish: 68,
    bearish: 22,
    holding: 10,
    totalVotes: 1247,
    lastUpdated: '2 min ago',
    userVote: 'bullish',
    aiSentiment: 72,
    priceChange24h: 2.3
  },
  {
    ticker: 'TSLA',
    bullish: 45,
    bearish: 38,
    holding: 17,
    totalVotes: 892,
    lastUpdated: '5 min ago',
    userVote: 'bearish',
    aiSentiment: 58,
    priceChange24h: -1.8
  },
  {
    ticker: 'NVDA',
    bullish: 82,
    bearish: 12,
    holding: 6,
    totalVotes: 2156,
    lastUpdated: '1 min ago',
    aiSentiment: 85,
    priceChange24h: 4.7
  },
  {
    ticker: 'BTC',
    bullish: 71,
    bearish: 19,
    holding: 10,
    totalVotes: 3421,
    lastUpdated: '3 min ago',
    userVote: 'holding',
    aiSentiment: 68,
    priceChange24h: 1.2
  },
  {
    ticker: 'ETH',
    bullish: 64,
    bearish: 25,
    holding: 11,
    totalVotes: 1876,
    lastUpdated: '4 min ago',
    aiSentiment: 61,
    priceChange24h: 0.8
  }
];

const mockUsers: User[] = [
  { id: '1', username: 'CryptoKing', accuracy: 87.3, totalVotes: 245, streak: 12, badges: ['🧙', '🔁', '📈'], rank: 1 },
  { id: '2', username: 'StockWizard', accuracy: 84.1, totalVotes: 198, streak: 8, badges: ['🧙', '🔁'], rank: 2 },
  { id: '3', username: 'MarketSeer', accuracy: 81.7, totalVotes: 312, streak: 15, badges: ['🧙', '📈'], rank: 3 },
  { id: '4', username: 'TradeMaster', accuracy: 79.2, totalVotes: 167, streak: 6, badges: ['🔁'], rank: 4 },
  { id: '5', username: 'BullBear', accuracy: 76.8, totalVotes: 134, streak: 4, badges: ['📈'], rank: 5 }
];

const badges = {
  '🧙': { name: 'Sentiment Oracle', description: 'High prediction accuracy (>85%)' },
  '🔁': { name: 'Daily Voter', description: 'Vote consistently every day' },
  '📈': { name: 'Trend Aligner', description: 'Often aligned with market movements' },
  '🎯': { name: 'Sharp Shooter', description: '90%+ accuracy on volatile stocks' },
  '🔥': { name: 'Hot Streak', description: '10+ consecutive correct predictions' }
};

export default function CommunitySentimentPolls() {
  const { themeMode } = useMoodTheme();
  const [polls, setPolls] = useState<PollStats[]>(mockPolls);
  const [searchTicker, setSearchTicker] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1d' | '7d' | '30d'>('1d');
  const [sortBy, setSortBy] = useState<'volume' | 'sentiment' | 'activity'>('volume');
  const [selectedPoll, setSelectedPoll] = useState<PollStats | null>(null);
  const [voteModalOpen, setVoteModalOpen] = useState(false);

  const handleVote = (ticker: string, sentiment: 'bullish' | 'bearish' | 'holding') => {
    setPolls(prev => prev.map(poll => {
      if (poll.ticker === ticker) {
        // Remove previous vote if exists
        let newBullish = poll.bullish;
        let newBearish = poll.bearish;
        let newHolding = poll.holding;
        let newTotal = poll.totalVotes;

        if (poll.userVote) {
          // Remove previous vote
          if (poll.userVote === 'bullish') newBullish -= 1;
          else if (poll.userVote === 'bearish') newBearish -= 1;
          else if (poll.userVote === 'holding') newHolding -= 1;
          newTotal -= 1;
        }

        // Add new vote
        if (sentiment === 'bullish') newBullish += 1;
        else if (sentiment === 'bearish') newBearish += 1;
        else if (sentiment === 'holding') newHolding += 1;
        newTotal += 1;

        return {
          ...poll,
          bullish: newBullish,
          bearish: newBearish,
          holding: newHolding,
          totalVotes: newTotal,
          userVote: sentiment,
          lastUpdated: 'now'
        };
      }
      return poll;
    }));
    setVoteModalOpen(false);
  };

  const filteredPolls = polls.filter(poll =>
    poll.ticker.toLowerCase().includes(searchTicker.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'volume') return b.totalVotes - a.totalVotes;
    if (sortBy === 'sentiment') return b.bullish - a.bullish;
    if (sortBy === 'activity') return a.lastUpdated.localeCompare(b.lastUpdated);
    return 0;
  });

  const getSentimentColor = (percentage: number) => {
    if (percentage > 60) return 'text-green-400';
    if (percentage < 40) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentBg = (percentage: number) => {
    if (percentage > 60) return 'bg-green-500';
    if (percentage < 40) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const PollCard = ({ poll }: { poll: PollStats }) => (
    <Card className={themeMode === 'light' ? 'enhanced-card-light hover:shadow-lg transition-all duration-200' : 'bg-black/40 border-gray-700/50 hover:border-purple-500/50 transition-all duration-200'}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
              themeMode === 'light' 
                ? 'bg-[#3F51B5]/10 text-[#3F51B5]' 
                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300'
            }`}>
              {poll.ticker}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                ${poll.ticker}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                  {poll.totalVotes.toLocaleString()} votes
                </span>
                {poll.priceChange24h !== undefined && (
                  <Badge className={`${
                    poll.priceChange24h >= 0 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {poll.priceChange24h >= 0 ? '+' : ''}{poll.priceChange24h}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
              Updated {poll.lastUpdated}
            </div>
            {poll.aiSentiment && (
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs ${themeMode === 'light' ? 'text-[#888]' : 'text-gray-500'}`}>AI:</span>
                <span className={`text-xs font-medium ${getSentimentColor(poll.aiSentiment)}`}>
                  {poll.aiSentiment}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sentiment Bars */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                Bullish
              </span>
            </div>
            <span className="text-sm font-bold text-green-400">{poll.bullish}%</span>
          </div>
          <Progress value={poll.bullish} className="h-2">
            <div 
              className="h-full bg-green-500 transition-all duration-500 rounded-full"
              style={{ width: `${poll.bullish}%` }}
            />
          </Progress>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-yellow-400" />
              <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                Holding
              </span>
            </div>
            <span className="text-sm font-bold text-yellow-400">{poll.holding}%</span>
          </div>
          <Progress value={poll.holding} className="h-2">
            <div 
              className="h-full bg-yellow-500 transition-all duration-500 rounded-full"
              style={{ width: `${poll.holding}%` }}
            />
          </Progress>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                Bearish
              </span>
            </div>
            <span className="text-sm font-bold text-red-400">{poll.bearish}%</span>
          </div>
          <Progress value={poll.bearish} className="h-2">
            <div 
              className="h-full bg-red-500 transition-all duration-500 rounded-full"
              style={{ width: `${poll.bearish}%` }}
            />
          </Progress>
        </div>

        {/* User Vote Status & Vote Button */}
        <div className="flex items-center justify-between">
          {poll.userVote ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                You voted {poll.userVote}
              </span>
            </div>
          ) : (
            <span className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
              Haven't voted yet
            </span>
          )}
          
          <Button
            size="sm"
            onClick={() => {
              setSelectedPoll(poll);
              setVoteModalOpen(true);
            }}
            className={`${
              themeMode === 'light'
                ? 'ai-analysis-btn-light hover:opacity-90'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            } text-xs`}
          >
            {poll.userVote ? 'Change Vote' : 'Vote Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`rounded-2xl p-6 ${
        themeMode === 'light'
          ? 'enhanced-card-light border border-[#E0E0E0]'
          : 'bg-black/80 backdrop-blur-xl border border-purple-500/20'
      }`}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
              themeMode === 'light'
                ? 'bg-gradient-to-r from-[#3F51B5]/20 to-[#673AB7]/20 shadow-[#3F51B5]/20'
                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 shadow-purple-500/20'
            }`}>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className={`text-4xl font-bold ${
              themeMode === 'light'
                ? 'text-[#1E1E1E]'
                : 'bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent'
            }`}>
              Community Sentiment Polls
            </h1>
          </div>
          <p className={`text-xl max-w-2xl mx-auto mb-6 ${
            themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'
          }`}>
            Vote on market sentiment and see real-time community predictions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'}`}>
                  Active Polls
                </span>
              </div>
              <div className={`text-2xl font-bold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                {polls.length}
              </div>
            </CardContent>
          </Card>

          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'}`}>
                  Total Votes
                </span>
              </div>
              <div className={`text-2xl font-bold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                {polls.reduce((sum, poll) => sum + poll.totalVotes, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'}`}>
                  Avg Bullish
                </span>
              </div>
              <div className={`text-2xl font-bold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                {Math.round(polls.reduce((sum, poll) => sum + poll.bullish, 0) / polls.length)}%
              </div>
            </CardContent>
          </Card>

          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="w-5 h-5 text-yellow-400" />
                <span className={`text-sm font-medium ${themeMode === 'light' ? 'text-[#444]' : 'text-gray-300'}`}>
                  Your Votes
                </span>
              </div>
              <div className={`text-2xl font-bold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                {polls.filter(poll => poll.userVote).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              themeMode === 'light' ? 'text-[#888]' : 'text-gray-400'
            }`} />
            <Input
              placeholder="Search tickers (e.g., AAPL, BTC)..."
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              className={`pl-10 ${
                themeMode === 'light' 
                  ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                  : 'bg-black/40 border-gray-700 text-white'
              }`}
            />
          </div>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className={`w-48 ${
              themeMode === 'light' 
                ? 'bg-white border-[#E0E0E0] text-[#1C1E21]' 
                : 'bg-black/40 border-gray-700 text-white'
            }`}>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">Most Votes</SelectItem>
              <SelectItem value="sentiment">Most Bullish</SelectItem>
              <SelectItem value="activity">Recently Active</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className={`flex items-center gap-2 ${
              themeMode === 'light' 
                ? 'border-[#E0E0E0] text-[#666] hover:bg-[#F5F5F5]' 
                : 'border-gray-700 text-gray-300 hover:bg-gray-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="polls" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${
          themeMode === 'light' 
            ? 'bg-[#F5F5F5] border border-[#E0E0E0]' 
            : 'bg-black/40 border border-gray-700/50'
        }`}>
          <TabsTrigger
            value="polls"
            className={
              themeMode === 'light'
                ? 'data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white text-[#666]'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400'
            }
          >
            Live Polls
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className={
              themeMode === 'light'
                ? 'data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white text-[#666]'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400'
            }
          >
            Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="my-votes"
            className={
              themeMode === 'light'
                ? 'data-[state=active]:bg-[#3F51B5] data-[state=active]:text-white text-[#666]'
                : 'data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400'
            }
          >
            My Votes
          </TabsTrigger>
        </TabsList>

        {/* Live Polls Tab */}
        <TabsContent value="polls" className="mt-6 space-y-4">
          {filteredPolls.length === 0 ? (
            <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
              <CardContent className="p-8 text-center">
                <Users className={`w-12 h-12 mx-auto mb-4 ${themeMode === 'light' ? 'text-[#888]' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                  No polls found
                </h3>
                <p className={themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}>
                  Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolls.map((poll) => (
                <PollCard key={poll.ticker} poll={poll} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="mt-6 space-y-6">
          <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                <Trophy className="w-5 h-5 text-yellow-400" />
                Top Predictors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/10">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-500 text-black' :
                        themeMode === 'light' ? 'bg-[#3F51B5] text-white' : 'bg-purple-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className={`font-semibold ${themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}`}>
                          {user.username}
                        </div>
                        <div className="flex items-center gap-2">
                          {user.badges.map((badge, i) => (
                            <span key={i} className="text-lg" title={badges[badge as keyof typeof badges]?.name}>
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-green-400`}>
                        {user.accuracy}%
                      </div>
                      <div className={`text-sm ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                        {user.totalVotes} votes • {user.streak} streak
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Votes Tab */}
        <TabsContent value="my-votes" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.filter(poll => poll.userVote).map((poll) => (
              <PollCard key={poll.ticker} poll={poll} />
            ))}
          </div>
          
          {polls.filter(poll => poll.userVote).length === 0 && (
            <Card className={themeMode === 'light' ? 'enhanced-card-light' : 'bg-black/40 border-gray-700/50'}>
              <CardContent className="p-8 text-center">
                <Target className={`w-12 h-12 mx-auto mb-4 ${themeMode === 'light' ? 'text-[#888]' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${themeMode === 'light' ? 'text-[#333]' : 'text-gray-300'}`}>
                  No votes yet
                </h3>
                <p className={themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}>
                  Start voting on polls to see your predictions here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Vote Modal */}
      <Dialog open={voteModalOpen} onOpenChange={setVoteModalOpen}>
        <DialogContent className={`max-w-md ${
          themeMode === 'light' 
            ? 'bg-white border-[#E0E0E0]' 
            : 'bg-black/95 border-purple-500/30'
        }`}>
          <DialogHeader>
            <DialogTitle className={themeMode === 'light' ? 'text-[#1E1E1E]' : 'text-white'}>
              Vote on ${selectedPoll?.ticker}
            </DialogTitle>
            <DialogDescription className={themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}>
              Share your sentiment prediction for the next 24 hours.
            </DialogDescription>
          </DialogHeader>

          {selectedPoll && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleVote(selectedPoll.ticker, 'bullish')}
                  className={`flex flex-col items-center gap-2 h-20 ${
                    selectedPoll.userVote === 'bullish' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : themeMode === 'light'
                        ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                        : 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm font-medium">Bullish</span>
                </Button>

                <Button
                  onClick={() => handleVote(selectedPoll.ticker, 'holding')}
                  className={`flex flex-col items-center gap-2 h-20 ${
                    selectedPoll.userVote === 'holding' 
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                      : themeMode === 'light'
                        ? 'bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30'
                  }`}
                >
                  <Minus className="w-6 h-6" />
                  <span className="text-sm font-medium">Holding</span>
                </Button>

                <Button
                  onClick={() => handleVote(selectedPoll.ticker, 'bearish')}
                  className={`flex flex-col items-center gap-2 h-20 ${
                    selectedPoll.userVote === 'bearish' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : themeMode === 'light'
                        ? 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                        : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  <TrendingDown className="w-6 h-6" />
                  <span className="text-sm font-medium">Bearish</span>
                </Button>
              </div>

              <div className={`text-sm text-center ${themeMode === 'light' ? 'text-[#666]' : 'text-gray-400'}`}>
                You can change your vote within 24 hours
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
