import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Lock,
  Users,
  MessageSquare,
  ChevronDown,
  Bell,
  Settings,
  Star,
  Crown,
  Shield,
  Clock,
  Hash,
  TrendingUp,
  Eye,
  Archive,
  UserPlus,
  Zap,
  Target,
  DollarSign,
} from "lucide-react";

import { PrivateRoom, User } from "@/types/privateRooms";
import {
  mockPrivateRooms,
  mockUsers,
  getTimeAgo,
} from "@/data/privateRoomsMockData";
import { CreateRoomModal } from "./CreateRoomModal";

interface SocialRoomProps {
  onCreateRoom?: () => void;
}

export const SocialRoom: React.FC<SocialRoomProps> = ({ onCreateRoom }) => {
  const [selectedRoom, setSelectedRoom] = useState<PrivateRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock current user
  const currentUser: User = mockUsers[0]; // TechBull2024

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  const handleRoomCreated = (roomData: Partial<PrivateRoom>) => {
    console.log("Creating social room:", roomData);
    // Here we would call the API to create the room
    setShowCreateModal(false);
    // Optionally refresh the rooms list or add the new room locally
  };

  // Filter rooms for current user (social rooms only)
  const userRooms = mockPrivateRooms.filter(
    (room) =>
      room.members?.some((member) => member.userId === currentUser.id) &&
      room.type === "private", // Social rooms are private watchlist rooms
  );

  const filteredRooms = userRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tickers.some((ticker) =>
        ticker.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case "premium":
        return <Crown className="w-3 h-3 text-purple-500" />;
      case "verified":
        return <Shield className="w-3 h-3 text-blue-500" />;
      case "admin":
        return <Star className="w-3 h-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getRoomIcon = (room: PrivateRoom) => {
    if (room.createdBy === currentUser.id) {
      return <Crown className="w-4 h-4 text-purple-500" />;
    }
    return <Lock className="w-4 h-4 text-blue-500" />;
  };

  const MyRoomsDropdown = () => (
    <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 hover:from-blue-100 hover:to-purple-100"
        >
          <Lock className="w-4 h-4" />
          My Rooms
          {userRooms.reduce((sum, room) => sum + (room.unreadCount || 0), 0) >
            0 && (
            <Badge className="bg-red-500 text-white text-xs ml-1">
              {userRooms.reduce(
                (sum, room) => sum + (room.unreadCount || 0),
                0,
              )}
            </Badge>
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-96 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        {/* Dropdown Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              🔒 My Private Rooms
            </h3>
            <Badge variant="outline" className="text-xs">
              {userRooms.length} rooms
            </Badge>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search rooms, tickers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-sm"
            />
          </div>
        </div>

        {/* Rooms List */}
        <ScrollArea className="max-h-80">
          <div className="p-2">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? "No rooms found" : "No rooms yet"}
                <div className="text-xs mt-1">
                  {!searchQuery && "Create your first private room"}
                </div>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <DropdownMenuItem
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowDropdown(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg focus:bg-gray-50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative">
                      {getRoomIcon(room)}
                      {room.unreadCount && room.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">
                          {room.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(room.lastActivity)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {/* Tickers */}
                        <div className="flex gap-1">
                          {room.tickers.slice(0, 3).map((ticker) => (
                            <Badge
                              key={ticker}
                              variant="outline"
                              className="text-xs px-1 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200"
                            >
                              ${ticker}
                            </Badge>
                          ))}
                          {room.tickers.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{room.tickers.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                          <Users className="w-3 h-3" />
                          {room.members?.length || 0}
                        </div>

                        {room.unreadCount && room.unreadCount > 0 && (
                          <Badge className="h-4 px-1 text-xs bg-red-500 text-white">
                            {room.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Create Room Button */}
        <div className="p-3 border-t bg-gray-50 dark:bg-gray-800/50">
          <Button
            onClick={() => {
              handleCreateRoom();
              setShowDropdown(false);
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Private Room
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (selectedRoom) {
    return (
      <div className="space-y-6">
        {/* Room Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedRoom(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Social Rooms
          </Button>
          <div className="flex items-center gap-2">
            {getRoomIcon(selectedRoom)}
            <h1 className="text-2xl font-bold">{selectedRoom.name}</h1>
            <Badge variant="outline">
              {selectedRoom.createdBy === currentUser.id ? "Owner" : "Member"}
            </Badge>
          </div>
        </div>

        {/* Room Chat Placeholder */}
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Room Chat Interface</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Real-time chat for "{selectedRoom.name}" will be implemented here.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="flex gap-1">
                {selectedRoom.tickers.map((ticker) => (
                  <Badge key={ticker} variant="outline" className="text-xs">
                    ${ticker}
                  </Badge>
                ))}
              </div>
              <span>•</span>
              <span>{selectedRoom.members?.length || 0} members</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Dropdown */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Social Rooms
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Create and access invite-only chat rooms tied to your watchlist
            tickers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* My Rooms Dropdown */}
          <MyRoomsDropdown />

          {/* Notifications */}
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Welcome to Social Rooms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Social Rooms let you create private, invite-only chat spaces for
              discussing specific tickers from your watchlist with fellow
              traders and investors.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm">Private & Secure</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Invite-only rooms for trusted discussions without public
                  exposure
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-sm">Ticker-Based</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Rooms tied to specific watchlist tickers with live sentiment
                  data
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-sm">Real-Time Chat</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Instant messaging with reactions, threads, and sentiment
                  tracking
                </p>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-sm">Smart Alerts</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Get notified about sentiment shifts and ticker movements
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={onCreateRoom}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Social Room
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Room Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {userRooms.length}
                  </div>
                  <div className="text-xs text-gray-600">Joined Rooms</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {
                      userRooms.filter((r) => r.createdBy === currentUser.id)
                        .length
                    }
                  </div>
                  <div className="text-xs text-gray-600">Created</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {userRooms.reduce(
                      (sum, room) => sum + (room.unreadCount || 0),
                      0,
                    )}
                  </div>
                  <div className="text-xs text-gray-600">Unread</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {userRooms.reduce(
                      (sum, room) => sum + room.messageCount,
                      0,
                    )}
                  </div>
                  <div className="text-xs text-gray-600">Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userRooms.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userRooms.slice(0, 3).map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {getRoomIcon(room)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {room.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getTimeAgo(room.lastActivity)}
                        </div>
                      </div>
                      {room.unreadCount && room.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Tier Info */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {getUserRoleIcon(currentUser.tier)}
                <span className="font-medium">
                  {currentUser.tier === "premium"
                    ? "Premium Account"
                    : currentUser.tier === "verified"
                      ? "Verified Account"
                      : "Free Account"}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {currentUser.tier === "premium"
                  ? "Unlimited rooms and features"
                  : currentUser.tier === "verified"
                    ? "Up to 5 private rooms"
                    : "1 free private room"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
