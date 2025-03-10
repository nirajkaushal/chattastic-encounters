
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Send, SkipForward } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sent: boolean;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      text: inputValue,
      sent: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    // Simulate received message
    setTimeout(() => {
      const response: Message = {
        id: Math.random().toString(),
        text: "This is a simulated response",
        sent: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleConnect = () => {
    setIsConnected(true);
    setMessages([]);
  };

  const handleSkip = () => {
    setMessages([]);
    // Add connection logic here
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="glass-panel flex-1 p-4 mb-4 overflow-y-auto">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <h2 className="text-2xl font-semibold">Welcome to Anonymous Chat</h2>
            <p className="text-muted-foreground">Connect instantly with strangers</p>
            <Button onClick={handleConnect} className="animate-pulse-slow">
              Start Chatting
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message flex ${
                  message.sent ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.sent ? "chat-bubble-sent" : "chat-bubble-received"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message flex justify-start">
                <div className="chat-bubble chat-bubble-received animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {isConnected && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSkip}
            className="shrink-0"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <div className="flex-1 glass-panel flex space-x-2 p-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size="icon" onClick={handleSend} className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.location.reload()}
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
