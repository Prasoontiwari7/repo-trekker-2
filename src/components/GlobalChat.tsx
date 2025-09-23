import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Globe, Users } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface ChatMessage {
  id: string;
  username: string;
  country_tag: string;
  message: string;
  created_at: string;
}

export const GlobalChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const mockMessage: ChatMessage = {
      id: Date.now().toString(),
      username: user.user_metadata?.name || 'Anonymous',
      country_tag: 'IN', // This would come from user's location
      message: newMessage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, mockMessage]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-96 h-[500px]"
    >
      <Card className="h-full bg-card/95 backdrop-blur-lg border-border/50 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-primary" />
              Global Chat
              <Badge variant="secondary" className="ml-2">
                <Users className="w-3 h-3 mr-1" />
                {messages.length}
              </Badge>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 px-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {message.country_tag}
                    </Badge>
                    <span className="font-medium text-sm">{message.username}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          {user && (
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  maxLength={500}
                />
                <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}
          
          {!user && (
            <div className="p-4 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Please sign in to join the chat
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};