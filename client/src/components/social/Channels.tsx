import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Heart, Hash, Coffee } from "lucide-react";
import { CryptoChannels } from "./CryptoChannels";
import { OffTopicLounge } from "./OffTopicLounge";

export const Channels: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"crypto" | "off-topic">("crypto");

  return (
    <div className="w-full h-full">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "crypto" | "off-topic")}
        className="w-full h-full flex flex-col"
      >
        {/* Tab Header */}
        <div className="border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Hash className="w-6 h-6 text-blue-500" />
                Channels
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Choose your conversation space
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Social Hub
            </Badge>
          </div>

          {/* Tab Switcher */}
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger
              value="crypto"
              className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4" />
              📈 Crypto
            </TabsTrigger>
            <TabsTrigger
              value="off-topic"
              className="flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              <Coffee className="w-4 h-4" />
              💬 Off-Topic
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="crypto" className="h-full m-0 p-0">
            <div className="h-full">
              <CryptoChannels />
            </div>
          </TabsContent>

          <TabsContent value="off-topic" className="h-full m-0 p-0">
            <div className="h-full">
              <OffTopicLounge />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
