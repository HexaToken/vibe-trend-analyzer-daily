import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Plus, Settings, MoreHorizontal, Heart, MessageSquare, 
  Share2, Brain, Users, Volume2, VolumeX, Pin, Star, TrendingUp,
  Send, Smile, Paperclip, Hash, Shield, ChevronDown, ChevronRight,
  BarChart3, Zap, Clock, Target, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

// CSS Variables for refined dark mode theme
const cssVars = `
  .live-chat-theme {
    --bg: #0B1020;
    --panel: #10162A;
    --panel-soft: #141A2B;
    --text: #E7ECF4;
    --muted: #8EA0B6;
    --accent: #7FD1FF;
    --success: #1DD882;
    --warn: #F8C06B;
    --danger: #FF7A7A;
    --shadow: 0 8px 24px rgba(0,0,0,0.35);

    /* Sentiment colors with better contrast */
    --bullish-bg: rgba(29,216,130,.16);
    --bullish-text: #91F0C8;
    --bearish-bg: rgba(255,122,122,.16);
    --bearish-text: #FF9D9D;
    --neutral-bg: rgba(248,192,107,.16);
    --neutral-text: #FFD89A;

    /* AI button styling */
    --ai-border: rgba(127,209,255,.5);
    --ai-bg: rgba(127,209,255,.08);
    --ai-bg-hover: rgba(127,209,255,.14);
  }
`;

interface Room {
  id: string;
  name: string;
  icon: string;
  category: string;
  onlineCount: number;
  unreadCount: number;
  isPinned: boolean;
  isVip: boolean;
  description: string;
}

interface Message {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    reputation: number;
    sentiment: 'bullish' | 'bearish' | 'neutral';
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  isFollowing: boolean;
  badges: string[];
  tickers: string[];
  sentimentTags: string[];
}

interface ThreadReply {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
}

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'General Chat',
    icon: '💬',
    category: 'general',
    onlineCount: 89,
    unreadCount: 3,
    isPinned: true,
    isVip: false,
    description: 'General market discussion'
  },
  {
    id: '2',
    name: 'Crypto Central',
    icon: '₿',
    category: 'crypto',
    onlineCount: 156,
    unreadCount: 0,
    isPinned: false,
    isVip: true,
    description: 'Cryptocurrency discussions'
  },
  {
    id: '3',
    name: 'Stock Analysis',
    icon: '📈',
    category: 'stocks',
    onlineCount: 78,
    unreadCount: 7,
    isPinned: false,
    isVip: false,
    description: 'Stock market analysis'
  },
  {
    id: '4',
    name: 'Options Trading',
    icon: '📊',
    category: 'stocks',
    onlineCount: 42,
    unreadCount: 1,
    isPinned: false,
    isVip: false,
    description: 'Options strategies and trades'
  },
  {
    id: '5',
    name: 'VIP Signals',
    icon: '🎯',
    category: 'signals',
    onlineCount: 23,
    unreadCount: 0,
    isPinned: false,
    isVip: true,
    description: 'Premium trading signals'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    user: {
      name: 'Alex Chen',
      handle: '@alextrader',
      avatar: '/placeholder.svg',
      reputation: 8.7,
      sentiment: 'bullish'
    },
    content: 'Just analyzed $AAPL earnings report. Revenue growth looks solid at 8.2% YoY. Expecting a breakout above $185 resistance.',
    timestamp: '2 min ago',
    likes: 12,
    replies: 3,
    isLiked: false,
    isFollowing: true,
    badges: ['Community Favorite'],
    tickers: ['$AAPL'],
    sentimentTags: ['Bullish']
  },
  {
    id: '2',
    user: {
      name: 'Sarah Kim',
      handle: '@sarahcrypto',
      avatar: '/placeholder.svg',
      reputation: 9.2,
      sentiment: 'bearish'
    },
    content: 'Market correction might be incoming. Volume on $SPY is decreasing and we\'re seeing some unusual whale movements in $BTC.',
    timestamp: '5 min ago',
    likes: 8,
    replies: 1,
    isLiked: true,
    isFollowing: false,
    badges: ['Pinned'],
    tickers: ['$SPY', '$BTC'],
    sentimentTags: ['Bearish']
  }
];

const mockReplies: ThreadReply[] = [
  {
    id: '1',
    user: {
      name: 'Mike Johnson',
      handle: '@mikej',
      avatar: '/placeholder.svg'
    },
    content: 'Great analysis! What do you think about the guidance for next quarter?',
    timestamp: '1 min ago'
  }
];

export const LiveChatRooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState(mockRooms[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<'bullish' | 'bearish' | 'neutral' | null>(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [expandedCategories, setExpandedCategories] = useState({
    general: true,
    crypto: true,
    stocks: true,
    signals: true,
    vip: true
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomsByCategory = mockRooms.reduce((acc, room) => {
    if (!acc[room.category]) acc[room.category] = [];
    acc[room.category].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-500';
      case 'bearish': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return 'bg-[var(--bullish-bg)] text-[var(--bullish-text)] border-[var(--bullish-text)]/30';
      case 'Bearish': return 'bg-[var(--bearish-bg)] text-[var(--bearish-text)] border-[var(--bearish-text)]/30';
      default: return 'bg-[var(--neutral-bg)] text-[var(--neutral-text)] border-[var(--neutral-text)]/30';
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle message sending logic
      setMessageInput('');
      setSelectedSentiment(null);
    }
  };

  const handleThreadOpen = (message: Message) => {
    setSelectedMessage(message);
    setIsThreadOpen(true);
  };

  return (
    <>
      <style>{cssVars}</style>
      <div className="live-chat-theme h-[800px] bg-[#0B1020] text-[#E7ECF4] rounded-lg overflow-hidden relative flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 border-b border-gray-700/30 bg-[#10162A] flex items-center justify-between flex-shrink-0">
          <Button
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            className="bg-[#7FD1FF]/10 hover:bg-[#7FD1FF]/20 text-[#7FD1FF] border-[#7FD1FF]/30"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Rooms
          </Button>
          <div className="flex items-center gap-2">
            <div className="text-lg">{selectedRoom.icon}</div>
            <h2 className="text-lg font-semibold text-[#E7ECF4]">{selectedRoom.name}</h2>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#8EA0B6]">
            <Users className="h-4 w-4" />
            {selectedRoom.onlineCount}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 min-h-0">

          {/* Left Sidebar - Chat Rooms */}
          <div className="hidden lg:block lg:col-span-3 bg-[#0F1421] border-r border-gray-700/30">
            <div className="p-4 border-b border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#E7ECF4]">Chat Rooms</h3>
                <Button 
                  size="sm" 
                  className="bg-[#7FD1FF]/10 hover:bg-[#7FD1FF]/20 text-[#7FD1FF] border-[#7FD1FF]/30"
                  data-room="create"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8EA0B6]" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#141A2B] border-gray-600/30 text-[#E7ECF4] placeholder:text-[#8EA0B6] focus:border-[#7FD1FF]/50"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-2">
                {Object.entries(roomsByCategory).map(([category, rooms]) => (
                  <div key={category} className="mb-4">
                    <button
                      onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-[#8EA0B6] hover:text-[#E7ECF4] transition-colors"
                    >
                      {expandedCategories[category] ? 
                        <ChevronDown className="h-3 w-3" /> : 
                        <ChevronRight className="h-3 w-3" />
                      }
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                    
                    {expandedCategories[category] && (
                      <div className="space-y-1 ml-2">
                        {rooms.map((room) => (
                          <div
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-[var(--panel-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow)] group ${
                              selectedRoom.id === room.id ? 'bg-[var(--panel-soft)] shadow-lg' : ''
                            }`}
                            data-room={room.id}
                          >
                            <div className="text-lg">{room.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate text-[#E7ECF4]">{room.name}</span>
                                {room.isPinned && <Pin className="h-3 w-3 text-orange-400" />}
                                {room.isVip && <Shield className="h-3 w-3 text-purple-400" />}
                              </div>
                              <div className="text-xs text-[#8EA0B6]">{room.onlineCount} online</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {room.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                                  {room.unreadCount}
                                </Badge>
                              )}
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Center Panel - Messages */}
          <div className="col-span-1 lg:col-span-6 bg-[#0B1020] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700/30 bg-[#10162A]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{selectedRoom.icon}</div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#E7ECF4]">{selectedRoom.name}</h2>
                    <p className="text-sm text-[#8EA0B6]">{selectedRoom.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-[#8EA0B6]">
                    <Users className="h-4 w-4" />
                    {selectedRoom.onlineCount}
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Button size="sm" variant="ghost" className="text-[#8EA0B6] hover:text-[#E7ECF4]">
                    <VolumeX className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-[#8EA0B6] hover:text-[#E7ECF4]">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 min-h-0">
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className="group bg-[var(--panel)] rounded-2xl p-[18px] transition-all duration-200 hover:bg-[#0F162C] shadow-[var(--shadow)]"
                    data-message-id={message.id}
                    data-sentiment={message.user.sentiment}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.user.avatar} />
                          <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#10162A] ${getSentimentColor(message.user.sentiment)}`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-[15px] text-[var(--text)]">{message.user.name}</span>
                          <span className="text-[14px] text-[var(--muted)]">{message.user.handle}</span>
                          <Badge className="bg-[rgba(127,209,255,.15)] text-[var(--accent)] border-[var(--accent)]/30 text-xs px-2 py-0.5 rounded-full font-medium">
                            {message.user.reputation}
                          </Badge>
                          {message.badges.map((badge) => (
                            <Badge key={badge} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 text-xs px-2 py-0.5 rounded-full">
                              {badge}
                            </Badge>
                          ))}
                          <span className="text-[13px] text-[var(--muted)] ml-auto font-medium">{message.timestamp}</span>
                        </div>
                        
                        <p className="text-[15px] text-[var(--text)] leading-[1.55] mb-4 line-clamp-3">
                          {message.content}
                          {message.content.length > 150 && (
                            <button className="text-[var(--accent)] hover:text-[var(--accent)]/80 ml-2 text-sm font-medium">
                              Read more
                            </button>
                          )}
                        </p>

                        {/* Tickers and Sentiment Tags */}
                        <div className="flex items-center gap-2 mb-4">
                          {message.tickers.map((ticker) => (
                            <Badge
                              key={ticker}
                              className="bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30 text-xs px-2 py-1 rounded-lg hover:bg-[var(--accent)]/15 cursor-pointer transition-colors"
                              data-ticker={ticker}
                            >
                              {ticker}
                            </Badge>
                          ))}
                          {message.sentimentTags.map((tag) => (
                            <Badge
                              key={tag}
                              className={`text-xs px-2 py-1 rounded-lg cursor-pointer transition-colors ${getSentimentBadgeColor(tag)}`}
                              title={`${tag} sentiment — expecting ${tag.toLowerCase()} movement`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Action Row */}
                        <div className="flex items-center gap-3 text-sm">
                          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 ${message.isLiked ? 'text-red-400' : 'text-[var(--muted)] hover:text-red-400'}`}>
                            <Heart className={`h-4 w-4 ${message.isLiked ? 'fill-current' : ''}`} />
                            <span className="font-medium">{message.likes}</span>
                          </button>
                          <button
                            onClick={() => handleThreadOpen(message)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 text-[var(--muted)] hover:text-[var(--accent)]"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-medium">{message.replies}</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 text-[var(--muted)] hover:text-[var(--text)]">
                            <Share2 className="h-4 w-4" />
                            <span className="font-medium">Share</span>
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--ai-border)] bg-[var(--ai-bg)] text-[var(--accent)] hover:bg-[var(--ai-bg-hover)] transition-all font-medium">
                            <Brain className="h-4 w-4" />
                            <span>AI Summarize</span>
                          </button>
                          <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5 font-medium ${
                            message.isFollowing
                              ? 'text-[var(--success)]'
                              : 'text-[var(--muted)] hover:text-[var(--success)]'
                          }`}>
                            <Users className="h-4 w-4" />
                            <span>{message.isFollowing ? 'Following' : 'Follow'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Composer */}
            <div className="p-4 border-t-2 border-[#7FD1FF]/20 bg-[#141A2B] flex-shrink-0 shadow-lg">
              <div className="space-y-3">
                {/* Sentiment Chips */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#8EA0B6]">Sentiment:</span>
                  {(['bullish', 'bearish', 'neutral'] as const).map((sentiment) => (
                    <button
                      key={sentiment}
                      onClick={() => setSelectedSentiment(selectedSentiment === sentiment ? null : sentiment)}
                      className={`px-3 py-1 rounded-full text-xs transition-all ${
                        selectedSentiment === sentiment
                          ? sentiment === 'bullish' ? 'bg-green-500 text-white' :
                            sentiment === 'bearish' ? 'bg-red-500 text-white' :
                            'bg-yellow-500 text-white'
                          : 'bg-gray-700/50 text-[#8EA0B6] hover:bg-gray-600/50'
                      }`}
                    >
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Input */}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share an insight..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="min-h-[80px] bg-[#141A2B] border-gray-600/30 text-[#E7ECF4] placeholder:text-[#8EA0B6] focus:border-[#7FD1FF]/50 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="ghost" className="text-[#8EA0B6] hover:text-[#E7ECF4]">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-[#8EA0B6] hover:text-[#E7ECF4]">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-[#7FD1FF] hover:bg-[#7FD1FF]/80 text-black"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Insights */}
          <div className="hidden lg:block lg:col-span-3 bg-[#0F1421] border-l border-gray-700/30 p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                
                {/* Room Metrics */}
                <Card className="bg-[#10162A] border-gray-700/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-[#E7ECF4]">Room Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#8EA0B6]">Online now</span>
                      <span className="text-sm font-semibold text-[#E7ECF4]">{selectedRoom.onlineCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#8EA0B6]">Msgs last hour</span>
                      <span className="text-sm font-semibold text-[#E7ECF4]">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#8EA0B6]">Trend vs. daily avg</span>
                      <span className="text-sm font-semibold text-green-400">+32%</span>
                    </div>
                    <div className="h-16 bg-[#141A2B] rounded-lg flex items-center justify-center">
                      <Activity className="h-6 w-6 text-[#7FD1FF]" />
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Tickers */}
                <Card className="bg-[#10162A] border-gray-700/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-[#E7ECF4]">Trending Tickers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {['$AAPL', '$TSLA', '$BTC', '$ETH', '$NVDA'].map((ticker, index) => (
                      <div key={ticker} className="flex items-center justify-between p-2 bg-[#141A2B] rounded-lg">
                        <span className="text-sm font-medium text-[#7FD1FF]">{ticker}</span>
                        <div className="flex items-center gap-2">
                          <div className={`h-1 w-8 rounded-full ${index % 2 === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-xs ${index % 2 === 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {index % 2 === 0 ? '+' : '-'}{Math.floor(Math.random() * 5) + 1}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* AI Assistant */}
                <Card className="bg-[#10162A] border-gray-700/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-[#E7ECF4] flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-400" />
                      AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      size="sm" 
                      className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/30"
                    >
                      Summarize last 50 messages
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30"
                    >
                      Show sentiment shift (2h)
                    </Button>
                  </CardContent>
                </Card>

              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Mobile Rooms Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-80 bg-[#0F1421] transform transition-transform duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-700/30 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#E7ECF4]">Chat Rooms</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[#8EA0B6] hover:text-[#E7ECF4]"
                >
                  ×
                </Button>
              </div>

              <div className="relative p-4">
                <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8EA0B6]" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#141A2B] border-gray-600/30 text-[#E7ECF4] placeholder:text-[#8EA0B6] focus:border-[#7FD1FF]/50"
                />
              </div>

              <ScrollArea className="h-[500px] p-2">
                {Object.entries(roomsByCategory).map(([category, rooms]) => (
                  <div key={category} className="mb-4">
                    <button
                      onClick={() => setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-[#8EA0B6] hover:text-[#E7ECF4] transition-colors"
                    >
                      {expandedCategories[category] ?
                        <ChevronDown className="h-3 w-3" /> :
                        <ChevronRight className="h-3 w-3" />
                      }
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>

                    {expandedCategories[category] && (
                      <div className="space-y-1 ml-2">
                        {rooms.map((room) => (
                          <div
                            key={room.id}
                            onClick={() => {
                              setSelectedRoom(room);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[#141A2B]/70 group ${
                              selectedRoom.id === room.id ? 'bg-[#141A2B] shadow-lg' : ''
                            }`}
                            data-room={room.id}
                          >
                            <div className="text-lg">{room.icon}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate text-[#E7ECF4]">{room.name}</span>
                                {room.isPinned && <Pin className="h-3 w-3 text-orange-400" />}
                                {room.isVip && <Shield className="h-3 w-3 text-purple-400" />}
                              </div>
                              <div className="text-xs text-[#8EA0B6]">{room.onlineCount} online</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {room.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 rounded-full flex items-center justify-center">
                                  {room.unreadCount}
                                </Badge>
                              )}
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Thread Drawer */}
        {isThreadOpen && selectedMessage && (
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[#0F1421] border-l border-gray-700/30 z-50 transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-700/30 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#E7ECF4]">Thread</h3>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setIsThreadOpen(false)}
                className="text-[#8EA0B6] hover:text-[#E7ECF4]"
              >
                ×
              </Button>
            </div>
            
            <ScrollArea className="h-[600px] p-4">
              {/* Parent Message */}
              <div className="bg-[#10162A] rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedMessage.user.avatar} />
                    <AvatarFallback>{selectedMessage.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[#E7ECF4]">{selectedMessage.user.name}</span>
                      <span className="text-xs text-[#8EA0B6]">{selectedMessage.timestamp}</span>
                    </div>
                    <p className="text-sm text-[#E7ECF4]">{selectedMessage.content}</p>
                  </div>
                </div>
              </div>
              
              {/* Replies */}
              <div className="space-y-3">
                {mockReplies.map((reply) => (
                  <div key={reply.id} className="bg-[#141A2B] rounded-lg p-3 ml-6">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.user.avatar} />
                        <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-xs text-[#E7ECF4]">{reply.user.name}</span>
                          <span className="text-xs text-[#8EA0B6]">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-[#E7ECF4]">{reply.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </>
  );
};

export default LiveChatRooms;
