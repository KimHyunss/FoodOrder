
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, X } from "lucide-react";
import { ChatMessage } from "./AdminChat";

type UserChatProps = {
  isOpen: boolean;
  onClose: () => void;
  onNewMessage: () => void;
};

export const UserChat = ({ isOpen, onClose, onNewMessage }: UserChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName] = useState("Customer_" + Math.random().toString(36).substr(2, 9));
  const [language, setLanguage] = useState("id");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      const allMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(allMessages.filter((msg: ChatMessage) => msg.userId === userName));
    }
  }, [userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getLanguageText = () => {
    if (language === "en") {
      return {
        chatAdmin: "Chat Admin",
        startChatWithAdmin: "Start chat with admin",
        typeMessage: "Type message..."
      };
    }
    return {
      chatAdmin: "Chat Admin",
      startChatWithAdmin: "Mulai chat dengan admin",
      typeMessage: "Ketik pesan..."
    };
  };

  const text = getLanguageText();

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now(),
      message: newMessage,
      sender: 'user',
      timestamp: new Date(),
      userId: userName,
      userName: userName
    };

    const allMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
    const updatedMessages = [...allMessages, message];
    localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    
    setMessages(prev => [...prev, message]);
    setNewMessage("");
    onNewMessage();
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Card className="w-full max-w-md h-96 bg-white dark:bg-gray-800 shadow-xl border dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <MessageCircle size={20} />
            {text.chatAdmin}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="dark:text-gray-300">
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">{text.startChatWithAdmin}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Message */}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={text.typeMessage}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <Button onClick={sendMessage} size="sm" className="gap-1">
              <Send size={14} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
