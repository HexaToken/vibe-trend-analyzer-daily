'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Users, MessageSquare, Star, Shield, TrendingUp, Hash, Clock, Target, Lock, Send, Smile, Paperclip } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RoomDetailPanel } from '@/components/rooms/RoomDetailPanel';

// CSS Variables for the dark mode theme
const cssVars = `
  .unified-rooms-builder {
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
  }
`;

// Room interface matching the requirements
interface Room {
  id: string;
  name: string;
  type: 'general' | 'stocks' | 'crypto' | 'options' | 'vip';
  membersOnline: number;
  msgsPerHr: number;
  sentimentPct: number;
  sentimentLabel: 'Bullish' | 'Bearish' | 'Neutral';
  unread: number;
  pinnedCount: number;
  isVIP: boolean;
  icon: string;
}

// Mock room data as specified
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'General Chat',
    type: 'general',
    membersOnline: 112,
    msgsPerHr: 260,
    sentimentPct: 62,
    sentimentLabel: 'Bullish',
    unread: 0,
    pinnedCount: 3,
    isVIP: false,
    icon: '💬'
  },
  {
    id: '2',
    name: '$AAPL Traders',
    type: 'stocks',
    membersOnline: 892,
    msgsPerHr: 180,
    sentimentPct: 51,
    sentimentLabel: 'Neutral',
    unread: 2,
    pinnedCount: 7,
    isVIP: false,
    icon: '🍎'
  },
  {
    id: '3',
    name: 'Crypto Central',
    type: 'crypto',
    membersOnline: 1247,
    msgsPerHr: 340,
    sentimentPct: 58,
    sentimentLabel: 'Bearish',
    unread: 0,
    pinnedCount: 12,
    isVIP: false,
    icon: '₿'
  },
  {
    id: '4',
    name: 'Options Trading',
    type: 'options',
    membersOnline: 234,
    msgsPerHr: 95,
    sentimentPct: 54,
    sentimentLabel: 'Bullish',
    unread: 1,
    pinnedCount: 2,
    isVIP: false,
    icon: '📊'
  },
  {
    id: '5',
    name: 'VIP Signals',
    type: 'vip',
    membersOnline: 23,
    msgsPerHr: 42,
    sentimentPct: 71,
    sentimentLabel: 'Bullish',
    unread: 0,
    pinnedCount: 15,
    isVIP: true,
    icon: '🎯'
  },
  {
    id: '6',
    name: '$TSLA Bulls',
    type: 'stocks',
    membersOnline: 567,
    msgsPerHr: 125,
    sentimentPct: 68,
    sentimentLabel: 'Bullish',
    unread: 3,
    pinnedCount: 5,
    isVIP: false,
    icon: '🚗'
  },
  {
    id: '7',
    name: '$NVDA Tech Talk',
    type: 'stocks',
    membersOnline: 445,
    msgsPerHr: 85,
    sentimentPct: 45,
    sentimentLabel: 'Bearish',
    unread: 0,
    pinnedCount: 8,
    isVIP: false,
    icon: '🎮'
  },
  {
    id: '8',
    name: 'DeFi Alpha',
    type: 'crypto',
    membersOnline: 89,
    msgsPerHr: 67,
    sentimentPct: 73,
    sentimentLabel: 'Bullish',
    unread: 5,
    pinnedCount: 4,
    isVIP: true,
    icon: '🦄'
  }
];

// Sample posts for room preview
const samplePosts = [
  {
    id: '1',
    username: 'TraderJoe',
    avatar: '/placeholder.svg',
    content: 'Just spotted huge volume on $AAPL calls expiring this Friday. Something big brewing? 🚀',
    timestamp: '2m ago'
  },
  {
    id: '2',
    username: 'CryptoQueen',
    avatar: '/placeholder.svg',
    content: 'BTC breaking above 50k resistance. Time to load up? #bitcoin #bullish',
    timestamp: '5m ago'
  }
];

type FilterType = 'all' | 'general' | 'stocks' | 'crypto' | 'options' | 'vip';
type SortType = 'active' | 'quality' | 'new';

interface UnifiedRoomsState {
  query: string;
  filter: FilterType;
  sort: SortType;
  selectedRoomId: string | null;
  rooms: Room[];
  showDetailPanel: boolean;
  detailPanelRoomId: string | null;
}

interface UnifiedRoomsBuilderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  showFilters?: boolean;
  showSort?: boolean;
  maxRooms?: number;
  onNavigateToProfile?: (userId: string) => void;
}

export const UnifiedRoomsBuilder: React.FC<UnifiedRoomsBuilderProps> = ({
  title = "Rooms",
  subtitle = "Join real-time discussions by ticker, sector, and strategy.",
  showSearch = true,
  showFilters = true,
  showSort = true,
  maxRooms = 8,
  onNavigateToProfile
}) => {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<UnifiedRoomsState>({
    query: '',
    filter: 'all',
    sort: 'active',
    selectedRoomId: null,
    rooms: mockRooms.slice(0, maxRooms),
    showDetailPanel: false,
    detailPanelRoomId: null
  });

  // Enhanced state for chat functionality
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !state.selectedRoomId) return;

    const message = {
      id: `msg-${Date.now()}`,
      userId: user.id,
      username: user.username || 'Anonymous',
      userAvatar: user.avatar || '/placeholder.svg',
      content: newMessage.trim(),
      timestamp: 'now',
      likes: 0,
      replies: 0,
      roomId: state.selectedRoomId
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // Handle room joining
  const handleJoinRoom = (room: Room) => {
    if (room.isVIP && !user?.isPremium) {
      alert('VIP room access requires Pro membership. Please upgrade to continue.');
      return;
    }

    if (!isAuthenticated) {
      alert('Please sign in to join rooms.');
      return;
    }

    setShowChatInterface(true);
    setState(prev => ({ ...prev, selectedRoomId: room.id }));
  };

  // Filter and sort rooms
  const filteredAndSortedRooms = useMemo(() => {
    let filtered = state.rooms;

    // Apply search filter
    if (state.query) {
      filtered = filtered.filter(room =>
        room.name.toLowerCase().includes(state.query.toLowerCase())
      );
    }

    // Apply type filter
    if (state.filter !== 'all') {
      if (state.filter === 'vip') {
        filtered = filtered.filter(room => room.isVIP);
      } else {
        filtered = filtered.filter(room => room.type === state.filter);
      }
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (state.sort) {
        case 'active':
          if (b.msgsPerHr !== a.msgsPerHr) return b.msgsPerHr - a.msgsPerHr;
          return b.membersOnline - a.membersOnline;
        case 'quality':
          if (b.pinnedCount !== a.pinnedCount) return b.pinnedCount - a.pinnedCount;
          return Math.abs(b.sentimentPct - 50) - Math.abs(a.sentimentPct - 50);
        case 'new':
          return parseInt(b.id) - parseInt(a.id);
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.query, state.filter, state.sort, state.rooms]);

  const selectedRoom = state.rooms.find(room => room.id === state.selectedRoomId);

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'Bullish': return '#1DD882';
      case 'Bearish': return '#FF7A7A';
      case 'Neutral': return '#F8C06B';
      default: return '#8EA0B6';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'general': return { bg: 'rgba(107, 114, 128, 0.2)', text: '#9CA3AF' };
      case 'stocks': return { bg: 'rgba(59, 130, 246, 0.2)', text: '#93C5FD' };
      case 'crypto': return { bg: 'rgba(249, 115, 22, 0.2)', text: '#FDBA74' };
      case 'options': return { bg: 'rgba(168, 85, 247, 0.2)', text: '#C4B5FD' };
      case 'vip': return { bg: 'linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2))', text: '#FCD34D' };
      default: return { bg: 'rgba(107, 114, 128, 0.2)', text: '#9CA3AF' };
    }
  };

  // Authentication check component
  if (!isAuthenticated) {
    return (
      <>
        <style>{cssVars}</style>
        <div className="unified-rooms-builder" style={{
          minHeight: '60vh',
          background: 'var(--bg)',
          color: 'var(--text)',
          padding: '48px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <Users size={64} color="var(--muted)" style={{ margin: '0 auto 24px' }} />
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '12px',
              color: 'var(--text)'
            }}>
              Join the Community
            </h3>
            <p style={{
              color: 'var(--muted)',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Sign in to access community rooms and chat with other traders.
            </p>
            <button style={{
              background: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Sign In to Continue
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{cssVars}</style>
      <div className="unified-rooms-builder" style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header - Builder Box */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: 'var(--text)',
              marginBottom: '8px'
            }}>
              {title}
            </h1>
            <p style={{
              color: 'var(--muted)',
              fontSize: '1.125rem'
            }}>
              {subtitle}
            </p>
          </div>

          {/* Controls Row - Builder Columns */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center'
            }}>
              {/* Search Input - Builder Input */}
              {showSearch && (
                <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
                  <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--muted)'
                  }}>
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search rooms or tickers…"
                    value={state.query}
                    onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '12px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      background: 'var(--panel)',
                      border: '1px solid rgba(142, 160, 182, 0.3)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              {/* Filter Tabs - Builder Tabs/Segmented Control */}
              {showFilters && (
                <div style={{
                  display: 'flex',
                  background: 'var(--panel)',
                  borderRadius: '8px',
                  padding: '4px'
                }}>
                  {(['all', 'general', 'stocks', 'crypto', 'options', 'vip'] as FilterType[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setState(prev => ({ ...prev, filter }))}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: state.filter === filter ? 'var(--accent)' : 'transparent',
                        color: state.filter === filter ? '#000' : 'var(--muted)'
                      }}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Sort Dropdown - Builder Select */}
              {showSort && (
                <select
                  value={state.sort}
                  onChange={(e) => setState(prev => ({ ...prev, sort: e.target.value as SortType }))}
                  style={{
                    width: '192px',
                    padding: '12px',
                    background: 'var(--panel)',
                    border: '1px solid rgba(142, 160, 182, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="active">🔥 Active</option>
                  <option value="quality">⭐ High Quality</option>
                  <option value="new">🕒 New</option>
                </select>
              )}
            </div>
          </div>

          {/* Content Area - Builder Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: '24px'
          }}>
            {/* Room List - Builder Repeater */}
            <div>
              <div style={{
                height: '600px',
                overflowY: 'auto',
                paddingRight: '16px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredAndSortedRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setState(prev => ({ ...prev, selectedRoomId: room.id }))}
                      style={{
                        background: 'var(--panel)',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        transform: state.selectedRoomId === room.id ? 'translateY(-2px)' : 'none',
                        boxShadow: state.selectedRoomId === room.id ? 'var(--shadow)' : 'none',
                        border: state.selectedRoomId === room.id ? '2px solid var(--accent)' : '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--panel-soft)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow)';
                      }}
                      onMouseLeave={(e) => {
                        if (state.selectedRoomId !== room.id) {
                          e.currentTarget.style.background = 'var(--panel)';
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Icon - Builder Icon */}
                        <div style={{ fontSize: '32px' }}>{room.icon}</div>

                        {/* Content - Builder Box */}
                        <div style={{ flex: '1', minWidth: '0' }}>
                          {/* Name and Type Badge */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <h3 style={{
                              fontWeight: 'bold',
                              color: 'var(--text)',
                              fontSize: '16px',
                              margin: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {room.name}
                            </h3>
                            <span style={{
                              fontSize: '12px',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              background: getTypeBadgeColor(room.type).bg,
                              color: getTypeBadgeColor(room.type).text,
                              fontWeight: '500'
                            }}>
                              {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                            </span>
                            {room.isVIP && (
                              <span style={{
                                fontSize: '12px',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                background: 'linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2))',
                                color: '#FCD34D',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <Shield size={12} />
                                Pro
                              </span>
                            )}
                          </div>

                          {/* Metadata Chips */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Users size={16} color="var(--muted)" />
                              <span style={{ color: 'var(--text)', fontWeight: '500' }}>{room.membersOnline}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MessageSquare size={16} color="var(--muted)" />
                              <span style={{ color: 'var(--text)', fontWeight: '500' }}>{room.msgsPerHr}</span>
                            </div>
                            <span style={{
                              fontSize: '12px',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              background: getSentimentColor(room.sentimentLabel),
                              color: 'white',
                              fontWeight: '500'
                            }}>
                              {room.sentimentLabel} {room.sentimentPct}%
                            </span>
                          </div>
                        </div>

                        {/* Right Side Indicators - Builder Box */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          {room.unread > 0 && (
                            <span style={{
                              background: 'var(--danger)',
                              color: 'white',
                              fontSize: '12px',
                              minWidth: '20px',
                              height: '20px',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '500'
                            }}>
                              {room.unread}
                            </span>
                          )}
                          {room.pinnedCount > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--muted)' }}>
                              <Star size={12} color="#FCD34D" />
                              <span>{room.pinnedCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Preview - Builder Card */}
            <div>
              <div style={{
                background: 'var(--panel)',
                borderRadius: '16px',
                padding: '24px',
                height: '600px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {selectedRoom ? (
                  <>
                    {/* Preview Header - Builder Box */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '32px' }}>{selectedRoom.icon}</div>
                        <div style={{ flex: '1' }}>
                          <h3 style={{
                            fontWeight: 'bold',
                            fontSize: '18px',
                            color: 'var(--text)',
                            margin: '0 0 4px 0'
                          }}>
                            {selectedRoom.name}
                          </h3>
                          <span style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            background: getTypeBadgeColor(selectedRoom.type).bg,
                            color: getTypeBadgeColor(selectedRoom.type).text,
                            fontWeight: '500'
                          }}>
                            {selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1)}
                          </span>
                        </div>
                        <button
                          style={{
                            background: 'var(--accent)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                          onClick={() => handleJoinRoom(selectedRoom)}
                        >
                          {selectedRoom.isVIP && <Lock size={16} style={{ marginRight: '8px', display: 'inline' }} />}
                          Join
                        </button>
                      </div>

                      {/* Meta Chips */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={16} color="var(--muted)" />
                          <span style={{ color: 'var(--text)', fontWeight: '500' }}>{selectedRoom.membersOnline}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageSquare size={16} color="var(--muted)" />
                          <span style={{ color: 'var(--text)', fontWeight: '500' }}>{selectedRoom.msgsPerHr}</span>
                        </div>
                        <span style={{
                          fontSize: '12px',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          background: getSentimentColor(selectedRoom.sentimentLabel),
                          color: 'white',
                          fontWeight: '500'
                        }}>
                          {selectedRoom.sentimentLabel} {selectedRoom.sentimentPct}%
                        </span>
                      </div>
                    </div>

                    {/* Sample Posts - Builder Repeater */}
                    <div style={{ flex: '1' }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--muted)',
                        margin: '0 0 12px 0'
                      }}>
                        Recent Messages
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {samplePosts.map((post) => (
                          <div key={post.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '16px',
                              background: 'var(--accent)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#000',
                              fontWeight: 'bold',
                              fontSize: '14px'
                            }}>
                              {post.username[0]}
                            </div>
                            <div style={{ flex: '1', minWidth: '0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{
                                  fontWeight: '500',
                                  fontSize: '14px',
                                  color: 'var(--text)'
                                }}>
                                  {post.username}
                                </span>
                                <span style={{
                                  fontSize: '12px',
                                  color: 'var(--muted)'
                                }}>
                                  {post.timestamp}
                                </span>
                              </div>
                              <p style={{
                                fontSize: '14px',
                                color: 'var(--text)',
                                margin: '0',
                                lineHeight: '1.4',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {post.content.split(' ').map((word, idx) => 
                                  word.startsWith('$') ? (
                                    <span
                                      key={idx}
                                      style={{
                                        background: 'rgba(127, 209, 255, 0.2)',
                                        color: 'var(--accent)',
                                        fontSize: '12px',
                                        padding: '2px 4px',
                                        margin: '0 2px',
                                        borderRadius: '4px'
                                      }}
                                    >
                                      {word}
                                    </span>
                                  ) : word + ' '
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA - Builder Button */}
                    <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(142, 160, 182, 0.2)' }}>
                      <button
                        style={{
                          width: '100%',
                          background: 'var(--accent)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onClick={() => selectedRoom && handleJoinRoom(selectedRoom)}
                      >
                        <Hash size={16} />
                        Open Room
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{
                    flex: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <MessageSquare size={48} color="var(--muted)" style={{ margin: '0 auto 12px' }} />
                      <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0' }}>
                        Select a room to see preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Fixed Bottom Button */}
          <div style={{
            position: 'fixed',
            bottom: '16px',
            left: '16px',
            right: '16px',
            zIndex: '50',
            display: 'none'
          }}>
            {selectedRoom && (
              <button
                style={{
                  width: '100%',
                  background: 'var(--accent)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px',
                  boxShadow: 'var(--shadow)'
                }}
                onClick={() => selectedRoom && handleJoinRoom(selectedRoom)}
              >
                Open {selectedRoom.name}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
