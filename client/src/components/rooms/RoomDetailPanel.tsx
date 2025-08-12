import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Hash,
  Pin,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Image,
  ChevronRight,
  Bell,
  BellOff
} from "lucide-react";

interface Room {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  category: string;
  categoryColor: string;
  membersOnline: number;
  totalMembers: number;
  messagesToday: number;
  activityTrend: number;
  sentiment: {
    type: 'bullish' | 'bearish' | 'neutral';
    percentage: number;
  };
  isJoined: boolean;
  pinnedMessage?: {
    id: string;
    author: string;
    content: string;
    timestamp: string;
  };
  recentMessages: Array<{
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
    hasMedia?: boolean;
    mediaThumbnail?: string;
  }>;
  topContributors: Array<{
    id: string;
    name: string;
    avatar: string;
    messageCount: number;
  }>;
  tags: string[];
}

interface RoomDetailPanelProps {
  room: Room | null;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
  onOpenRoom: (roomId: string) => void;
  onNavigateToProfile?: (userId: string) => void;
}

export const RoomDetailPanel: React.FC<RoomDetailPanelProps> = ({
  room,
  onClose,
  onJoinRoom,
  onOpenRoom,
  onNavigateToProfile
}) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  if (!room) return null;

  const getSentimentColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'bearish': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getSentimentIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-3 w-3" />;
      case 'bearish': return <TrendingDown className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  const formatTime = (timestamp: string) => {
    // Simple time formatting - in real app, use proper date library
    return timestamp;
  };

  const handleJoinToggle = () => {
    if (room.isJoined) {
      onOpenRoom(room.id);
    } else {
      onJoinRoom(room.id);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      
      {/* Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 lg:static lg:inset-auto lg:z-auto lg:w-[360px] lg:h-auto">
        <Card 
          className="h-[85vh] lg:h-auto lg:max-h-[calc(100vh-200px)] bg-[#10162A] border-l border-white/10 lg:border lg:border-gray-700/50 rounded-t-3xl lg:rounded-xl overflow-hidden"
          style={{ background: "#10162A" }}
        >
          {/* Header */}
          <CardHeader className="pb-4 border-b border-gray-700/50">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-2xl border border-gray-700/50">
                  {room.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-bold text-xl mb-1 truncate">{room.name}</h2>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{room.tagline}</p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      className={`text-xs px-2 py-1 ${room.categoryColor}`}
                    >
                      {room.category}
                    </Badge>
                    
                    <Badge 
                      className={`text-xs px-2 py-1 border ${getSentimentColor(room.sentiment.type)}`}
                    >
                      {getSentimentIcon(room.sentiment.type)}
                      <span className="ml-1">
                        {room.sentiment.type === 'bullish' ? 'Bullish' : 
                         room.sentiment.type === 'bearish' ? 'Bearish' : 'Neutral'} 
                        {room.sentiment.percentage}%
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 px-6">
            <div className="py-4 space-y-6">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-[#141A2B] border-gray-700/50 p-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="text-lg font-bold text-white">{room.membersOnline.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Online</div>
                  </div>
                </Card>
                
                <Card className="bg-[#141A2B] border-gray-700/50 p-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-lg font-bold text-white">{room.messagesToday}</div>
                    <div className="text-xs text-gray-400">Today</div>
                  </div>
                </Card>
                
                <Card className="bg-[#141A2B] border-gray-700/50 p-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      {room.activityTrend > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-400" />
                      ) : room.activityTrend < 0 ? (
                        <ArrowDown className="h-4 w-4 text-red-400" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className={`text-lg font-bold ${
                      room.activityTrend > 0 ? 'text-green-400' : 
                      room.activityTrend < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {room.activityTrend > 0 ? '+' : ''}{room.activityTrend}%
                    </div>
                    <div className="text-xs text-gray-400">Activity</div>
                  </div>
                </Card>
              </div>

              {/* Pinned Message */}
              {room.pinnedMessage && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <Pin className="h-4 w-4 text-yellow-400" />
                    Pinned Message
                  </h3>
                  <Card className="bg-yellow-500/10 border-yellow-500/30 p-3">
                    <div className="flex items-start gap-2">
                      <div className="text-xs text-yellow-400 font-medium">{room.pinnedMessage.author}</div>
                      <div className="text-xs text-gray-400">{formatTime(room.pinnedMessage.timestamp)}</div>
                    </div>
                    <p className="text-sm text-gray-300 mt-1 line-clamp-3">{room.pinnedMessage.content}</p>
                  </Card>
                </div>
              )}

              {/* Recent Messages */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-sm">Recent Messages</h3>
                <div className="space-y-3">
                  {room.recentMessages.slice(0, 4).map((message, index) => (
                    <div 
                      key={message.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                        index === 3 ? 'opacity-50' : ''
                      }`}
                      onClick={() => onNavigateToProfile?.(message.author.name)}
                    >
                      <Avatar className="h-8 w-8 ring-1 ring-gray-700">
                        <AvatarImage src={message.author.avatar} />
                        <AvatarFallback className="text-xs">{message.author.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-300 truncate">
                            {message.author.name}
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        </div>
                        
                        <p className="text-sm text-gray-400 line-clamp-2 mb-1">
                          {message.content}
                        </p>
                        
                        {message.hasMedia && message.mediaThumbnail && (
                          <div className="flex items-center gap-1 text-xs text-blue-400">
                            <Image className="h-3 w-3" />
                            <span>Image attached</span>
                          </div>
                        )}
                      </div>
                      
                      {index === 3 && (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold text-sm">Top Contributors</h3>
                <div className="flex items-center gap-2">
                  {room.topContributors.slice(0, 5).map((contributor, index) => (
                    <div 
                      key={contributor.id}
                      className="group relative cursor-pointer"
                      onClick={() => onNavigateToProfile?.(contributor.id)}
                    >
                      <Avatar 
                        className={`h-10 w-10 ring-2 transition-all hover:scale-110 ${
                          index === 0 ? 'ring-yellow-400' : 
                          index === 1 ? 'ring-gray-400' : 
                          index === 2 ? 'ring-orange-400' : 'ring-gray-600'
                        }`}
                      >
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback className="text-xs">{contributor.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {contributor.name} • {contributor.messageCount} messages today
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Tags */}
              {room.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-sm">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.tags.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 cursor-pointer"
                      >
                        <Hash className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notification Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {isNotificationEnabled ? (
                    <Bell className="h-4 w-4 text-blue-400" />
                  ) : (
                    <BellOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-300">Notifications</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
                  className={`h-8 px-3 text-xs ${
                    isNotificationEnabled 
                      ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {isNotificationEnabled ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </ScrollArea>

          {/* Join/Open CTA - Fixed at bottom on mobile */}
          <div className="p-6 border-t border-gray-700/50 bg-[#10162A] lg:bg-transparent">
            <Button
              onClick={handleJoinToggle}
              className={`w-full h-12 font-semibold text-base ${
                room.isJoined
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
              } shadow-lg transition-all duration-200 hover:scale-105`}
            >
              {room.isJoined ? 'Open Room' : 'Join & Start Chatting'}
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              {room.isJoined 
                ? 'Continue your conversation with the community'
                : 'Get instant updates when new messages are posted'
              }
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};
