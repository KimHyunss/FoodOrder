
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, User } from "lucide-react";

export type ChatMessage = {
  id: number;
  message: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  userId: string;
  userName: string;
};

export const AdminChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message: ChatMessage = {
      id: Date.now(),
      message: newMessage,
      sender: 'admin',
      timestamp: new Date(),
      userId: selectedUser,
      userName: selectedUser
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    setNewMessage("");

    // Trigger notification for user
    const userNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    userNotifications.push({
      id: Date.now(),
      message: `Admin: ${newMessage}`,
      timestamp: new Date(),
      read: false
    });
    localStorage.setItem("userNotifications", JSON.stringify(userNotifications));
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get unique users who have sent messages
  const uniqueUsers = Array.from(new Set(messages.map(msg => msg.userId)));
  const selectedUserMessages = messages.filter(msg => msg.userId === selectedUser);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* User List */}
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
            <MessageCircle size={20} />
            Daftar Customer
          </CardTitle>
          <CardDescription>
            Pilih customer untuk membalas chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uniqueUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
              <p>Belum ada pesan dari customer</p>
            </div>
          ) : (
            <div className="space-y-2">
              {uniqueUsers.map((userId) => {
                const userMessages = messages.filter(msg => msg.userId === userId);
                const lastMessage = userMessages[userMessages.length - 1];
                const unreadCount = userMessages.filter(msg => msg.sender === 'user').length;
                
                return (
                  <div
                    key={userId}
                    onClick={() => setSelectedUser(userId)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser === userId 
                        ? 'bg-primary/10 border-primary border' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-800">{userId}</span>
                      </div>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {lastMessage.sender === 'admin' ? 'Anda: ' : ''}{lastMessage.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2 bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">
            {selectedUser ? `Chat dengan ${selectedUser}` : 'Pilih Customer'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[480px]">
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto mb-4 opacity-50" />
                <p>Pilih customer dari daftar untuk memulai chat</p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                {selectedUserMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'admin'
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'admin' ? 'text-primary-foreground/70' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Message */}
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik balasan..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} className="gap-2">
                  <Send size={16} />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
