import React, { useState } from "react";
import { PrivateRoomsMain } from "./PrivateRoomsMain";
import { CreateRoomModal } from "./CreateRoomModal";
import { PrivateRoomChat } from "./PrivateRoomChat";
import { PrivateRoom, User } from "@/types/privateRooms";
import { mockUsers } from "@/data/privateRoomsMockData";

export const PrivateRoomsContainer: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<PrivateRoom | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock current user - in real app this would come from auth context
  const currentUser: User = mockUsers[0]; // TechBull2024 (premium user)

  const handleRoomSelect = (room: PrivateRoom) => {
    setSelectedRoom(room);
    // Here we would navigate to the room chat view
    console.log("Selected room:", room.name);
  };

  const handleCreateRoom = () => {
    setShowCreateModal(true);
  };

  const handleRoomCreated = (roomData: Partial<PrivateRoom>) => {
    console.log("Creating room:", roomData);
    // Here we would call the API to create the room
    // For now, just close the modal
    setShowCreateModal(false);
  };

  return (
    <div className="h-full">
      {!selectedRoom ? (
        <PrivateRoomsMain
          onRoomSelect={handleRoomSelect}
          onCreateRoom={handleCreateRoom}
        />
      ) : (
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSelectedRoom(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Rooms
            </button>
            <h1 className="text-2xl font-bold">{selectedRoom.name}</h1>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Room Chat Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The chat interface for "{selectedRoom.name}" will be implemented
              in the next step.
            </p>
          </div>
        </div>
      )}

      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleRoomCreated}
        userTier={currentUser.tier}
      />
    </div>
  );
};
