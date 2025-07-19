import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CommunityRooms } from "@/components/social/CommunityRooms";
import { ChatInterface } from "@/components/moorMeter/ChatInterface";

export const CommunityForum: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"chat" | "chat-rooms">("chat");

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Join the Community</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Sign in to share your market insights and join discussions with
            other traders.
          </p>
          <Button className="w-full">Sign In to Continue</Button>
        </CardContent>
      </Card>
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

        <TabsContent value="chat" className="space-y-6">
          <div className="h-[600px]">
            <ChatInterface />
          </div>
        </TabsContent>

        <TabsContent value="chat-rooms" className="space-y-6">
          <CommunityRooms />
        </TabsContent>
      </Tabs>
    </div>
  );
};
