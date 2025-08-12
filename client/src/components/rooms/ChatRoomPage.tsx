import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Hash,
  Send,
  Heart,
  Reply,
  Share,
  Bookmark,
  MoreHorizontal,
  Image,
  Smile,
  ChevronDown,
  AlertCircle,
  Star,
  Calendar,
  Target,
  UserPlus,
  Eye,
  Filter,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Room {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  sentiment: {
    label: 'Bullish' | 'Bearish' | 'Neutral';
    pct: number;
  };
  membersOnline: number;
  messagesToday: number;
  activityPct: number;
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  time: string;
  text: string;
  type: 'text' | 'chart' | 'news';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  likes: number;
  replies: number;
  tags: string[];
  repBadge?: string;
  media?: {
    type: 'chart' | 'image';
    url: string;
    title?: string;
  };
}

interface ChatRoomPageProps {
  room: Room;
  onBack?: () => void;
}

export const ChatRoomPage: React.FC<ChatRoomPageProps> = ({ room, onBack }) => {
  const { user, isAuthenticated } = useAuth();
  
  // State management as specified in the prompt
  const [state, setState] = useState({
    joined: false,
    filter: 'all' as 'all' | 'charts' | 'options' | 'news',
    messageBody: '',
    sentiment: 'neutral' as 'bullish' | 'bearish' | 'neutral',
    threadFor: null as string | null,
    showRules: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample preview messages (shown when not joined)
  const previewMessages: Message[] = [
    {
      id: '1',
      user: 'AlphaTrader',
      avatar: '/api/placeholder/40/40',
      time: '2m ago',
      text: '$AAPL looking strong above $185. Volume confirming the breakout 🚀 #bullish',
      type: 'text',
      sentiment: 'bullish',
      likes: 47,
      replies: 12,
      tags: ['AAPL', 'bullish'],
      repBadge: 'Expert'
    },
    {
      id: '2',
      user: 'TechAnalyst',
      avatar: '/api/placeholder/40/40',
      time: '5m ago',
      text: 'iPhone 15 sales data looking promising. Could push us to $200 resistance. Watching closely.',
      type: 'news',
      sentiment: 'bullish',
      likes: 23,
      replies: 8,
      tags: ['iPhone15', 'earnings'],
      repBadge: 'Pro'
    },
    {
      id: '3',
      user: 'OptionsGuru',
      avatar: '/api/placeholder/40/40',
      time: '8m ago',
      text: 'Call volume unusual at $190 strike. Someone knows something 👀',
      type: 'chart',
      sentiment: 'neutral',
      likes: 34,
      replies: 15,
      tags: ['options', 'volume'],
      media: {
        type: 'chart',
        url: '/api/placeholder/400/200',
        title: 'AAPL Options Flow'
      }
    },
    {
      id: '4',
      user: 'MarketMover',
      avatar: '/api/placeholder/40/40',
      time: '12m ago',
      text: 'Fed meeting tomorrow. Expecting some volatility. $AAPL might see pressure if rates hawkish.',
      type: 'news',
      sentiment: 'bearish',
      likes: 18,
      replies: 6,
      tags: ['Fed', 'rates', 'bearish'],
      repBadge: 'Analyst'
    }
  ];

  // Full messages (shown when joined - includes preview + more)
  const [messages, setMessages] = useState<Message[]>(previewMessages);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle join room
  const handleJoin = () => {
    setState(prev => ({ ...prev, joined: true }));
    // Simulate adding more messages when joined
    const newMessages = [
      ...previewMessages,
      {
        id: '5',
        user: 'SwingTrader',
        avatar: '/api/placeholder/40/40',
        time: '15m ago',
        text: 'Just entered a position at $183.50. Stop loss at $180. Target $195.',
        type: 'text',
        sentiment: 'bullish',
        likes: 12,
        replies: 3,
        tags: ['position', 'stoploss']
      }
    ];
    setMessages(newMessages);
  };

  // Handle send message
  const handleSend = () => {
    if (!state.messageBody.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: user?.username || 'You',
      avatar: user?.avatar || '/api/placeholder/40/40',
      time: 'Just now',
      text: state.messageBody,
      type: 'text',
      sentiment: state.sentiment,
      likes: 0,
      replies: 0,
      tags: []
    };

    setMessages(prev => [newMessage, ...prev]);
    setState(prev => ({ ...prev, messageBody: '' }));
  };

  // Filter messages based on selected filter
  const filteredMessages = messages.filter(msg => {
    if (state.filter === 'all') return true;
    if (state.filter === 'charts') return msg.type === 'chart';
    if (state.filter === 'options') return msg.tags.includes('options');
    if (state.filter === 'news') return msg.type === 'news';
    return true;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return '#1DD882';
      case 'bearish': return '#FF7A7A';
      default: return '#F8C06B';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'rgba(29, 216, 130, 0.1)';
      case 'bearish': return 'rgba(255, 122, 122, 0.1)';
      default: return 'rgba(248, 192, 107, 0.1)';
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: '#0B1020',
        color: '#E7ECF4'
      }}
    >
      {/* Header / Ticker Bar */}
      <div 
        className="p-4 border-b"
        style={{ 
          background: '#10162A',
          borderColor: 'rgba(255, 255, 255, 0.06)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              {/* Room Info */}
              <div className="flex items-center gap-3">
                <div className="text-2xl">{room.icon}</div>
                <div>
                  <h1 className="text-xl font-bold text-white">{room.name}</h1>
                  <p className="text-sm text-gray-400">{room.description}</p>
                </div>
              </div>

              {/* Category & Sentiment Pills */}
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  {room.category}
                </Badge>
                <Badge 
                  className="border"
                  style={{ 
                    backgroundColor: getSentimentBg(room.sentiment.label.toLowerCase()),
                    color: getSentimentColor(room.sentiment.label.toLowerCase()),
                    borderColor: getSentimentColor(room.sentiment.label.toLowerCase()) + '50'
                  }}
                >
                  {room.sentiment.label} {room.sentiment.pct}%
                </Badge>
              </div>
            </div>

            {/* Stats Chips */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">{room.membersOnline}</span>
                <span className="text-gray-400">Online</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <span className="text-white font-medium">{room.messagesToday}</span>
                <span className="text-gray-400">Today</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-medium">+{room.activityPct}%</span>
                <span className="text-gray-400">Activity</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Main Columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 p-6">
        
        {/* Left Column - Feed */}
        <div className="space-y-4">
          {/* Preview Banner (shown when not joined) */}
          {!state.joined && (
            <Card 
              className="border-2 border-yellow-500/30"
              style={{ background: '#141A2B' }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      You're viewing in preview mode
                    </h3>
                    <ul className="text-gray-300 space-y-1 mb-4">
                      <li>• See the latest discussions and insights</li>
                      <li>• No ads or interruptions</li>
                      <li>• Join to post, react, and get alerts</li>
                    </ul>
                  </div>
                  <Button
                    onClick={handleJoin}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6"
                  >
                    Join Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded-lg w-fit">
            {['all', 'charts', 'options', 'news'].map((filter) => (
              <button
                key={filter}
                onClick={() => setState(prev => ({ ...prev, filter: filter as any }))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  state.filter === filter
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Message Feed */}
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card 
                key={message.id}
                className="transition-all duration-300 hover:bg-[#0F162C] cursor-pointer"
                style={{ background: '#10162A' }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>{message.user[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      {/* Message Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-medium">{message.user}</span>
                        {message.repBadge && (
                          <Badge className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                            {message.repBadge}
                          </Badge>
                        )}
                        <span className="text-gray-400 text-sm">{message.time}</span>
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: getSentimentBg(message.sentiment),
                            color: getSentimentColor(message.sentiment)
                          }}
                        >
                          {message.sentiment}
                        </Badge>
                      </div>

                      {/* Message Body */}
                      <div className="text-gray-300 mb-3 leading-relaxed">
                        {message.text.split(' ').map((word, idx) => {
                          if (word.startsWith('$') || word.startsWith('#')) {
                            return (
                              <span
                                key={idx}
                                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 mx-1"
                              >
                                {word}
                              </span>
                            );
                          }
                          return word + ' ';
                        })}
                      </div>

                      {/* Media Block */}
                      {message.media && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-gray-700">
                          <img 
                            src={message.media.url} 
                            alt={message.media.title || 'Chart'}
                            className="w-full h-48 object-cover"
                          />
                          {message.media.title && (
                            <div className="p-2 bg-gray-800/50">
                              <span className="text-sm text-gray-300">{message.media.title}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Row */}
                      <div className="flex items-center gap-4">
                        <button 
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            state.joined 
                              ? 'text-gray-400 hover:text-red-400' 
                              : 'text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!state.joined}
                          title={!state.joined ? 'Join to interact' : ''}
                        >
                          <Heart className="h-4 w-4" />
                          <span>{message.likes}</span>
                        </button>
                        
                        <button 
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            state.joined 
                              ? 'text-gray-400 hover:text-blue-400' 
                              : 'text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!state.joined}
                          onClick={() => state.joined && setState(prev => ({ ...prev, threadFor: message.id }))}
                          title={!state.joined ? 'Join to interact' : ''}
                        >
                          <Reply className="h-4 w-4" />
                          <span>{message.replies}</span>
                        </button>

                        <button 
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            state.joined 
                              ? 'text-gray-400 hover:text-green-400' 
                              : 'text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!state.joined}
                          title={!state.joined ? 'Join to interact' : ''}
                        >
                          <Share className="h-4 w-4" />
                        </button>

                        <button 
                          className={`flex items-center gap-1 text-sm transition-colors ${
                            state.joined 
                              ? 'text-gray-400 hover:text-yellow-400' 
                              : 'text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!state.joined}
                          title={!state.joined ? 'Join to interact' : ''}
                        >
                          <Bookmark className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer (joined only) */}
          {state.joined && (
            <Card 
              className="sticky bottom-6 z-10"
              style={{ background: '#10162A' }}
            >
              <CardContent className="p-4">
                {/* Sentiment Chips */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-400">Sentiment:</span>
                  {['bullish', 'bearish', 'neutral'].map((sentiment) => (
                    <button
                      key={sentiment}
                      onClick={() => setState(prev => ({ ...prev, sentiment: sentiment as any }))}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        state.sentiment === sentiment
                          ? 'ring-2 ring-offset-2 ring-offset-gray-900'
                          : ''
                      }`}
                      style={{
                        backgroundColor: getSentimentBg(sentiment),
                        color: getSentimentColor(sentiment),
                        ...(state.sentiment === sentiment && {
                          boxShadow: `0 0 10px ${getSentimentColor(sentiment)}50`
                        })
                      }}
                    >
                      {sentiment}
                    </button>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Textarea
                      value={state.messageBody}
                      onChange={(e) => setState(prev => ({ ...prev, messageBody: e.target.value }))}
                      placeholder="Share your setup, levels, or news insight…"
                      className="min-h-[80px] bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleSend}
                      disabled={!state.messageBody.trim()}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Join/Info Sidebar */}
        <div className="space-y-4">
          {!state.joined ? (
            /* Not Joined State */
            <>
              <Card style={{ background: '#10162A' }}>
                <CardHeader>
                  <CardTitle className="text-white text-lg">Why join {room.name}?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <span className="text-gray-300">Get real-time alerts on price movements</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">Post your analysis and trade setups</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <UserPlus className="h-5 w-5 text-purple-400 mt-0.5" />
                    <span className="text-gray-300">Follow and learn from top traders</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-red-400 mt-0.5" />
                    <span className="text-gray-300">React and engage with the community</span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={handleJoin}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold"
                    >
                      Join Room
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50"
                      onClick={() => setState(prev => ({ ...prev, showRules: true }))}
                    >
                      View Rules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Joined State */
            <>
              <Card style={{ background: '#10162A' }}>
                <CardHeader>
                  <CardTitle className="text-white text-sm">Room Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>• Keep discussions relevant to {room.name}</p>
                    <p>• Share quality analysis and insights</p>
                    <p>• Be respectful to other traders</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-blue-400 hover:text-blue-300"
                    onClick={() => setState(prev => ({ ...prev, showRules: true }))}
                  >
                    Read full rules
                  </Button>
                </CardContent>
              </Card>

              <Card style={{ background: '#10162A' }}>
                <CardHeader>
                  <CardTitle className="text-white text-sm">Hot Threads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">📈 Q4 earnings predictions</div>
                    <div className="text-xs text-gray-400">47 replies • 2h ago</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">🎯 Best entry points this week</div>
                    <div className="text-xs text-gray-400">23 replies • 4h ago</div>
                  </div>
                </CardContent>
              </Card>

              <Card style={{ background: '#10162A' }}>
                <CardHeader>
                  <CardTitle className="text-white text-sm">Upcoming Catalysts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-300">Q4 Earnings - Jan 25</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Product Launch - Feb 1</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Thread Drawer */}
      {state.threadFor && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setState(prev => ({ ...prev, threadFor: null }))}>
          <div className="fixed right-0 top-0 h-full w-96 bg-[#10162A] border-l border-gray-700 shadow-2xl">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Thread</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, threadFor: null }))}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="text-center text-gray-400">
                Thread view coming soon...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {state.showRules && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md" style={{ background: '#10162A' }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Room Rules</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, showRules: false }))}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300 space-y-2">
                <p>1. Keep discussions relevant to {room.name}</p>
                <p>2. No spam or self-promotion</p>
                <p>3. Be respectful to other members</p>
                <p>4. Share quality analysis and insights</p>
                <p>5. Use proper sentiment tags</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
