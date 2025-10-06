'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Loader2, MessageSquare, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { doctorChat } from '@/ai/flows/doctor-chat-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const welcomeMessage: Message = {
    role: 'model',
    content: "Hello! I'm your AI Doctor Assistant. Feel free to ask any questions about your health, symptoms, or treatment plans. How can I help you today?"
}

export default function DoctorChatPage() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      // A bit of a hack to scroll to the bottom.
      setTimeout(() => {
          const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
          if (viewport) {
              viewport.scrollTop = viewport.scrollHeight;
          }
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await doctorChat({ history: newMessages });
      const assistantMessage: Message = { role: 'model', content: result.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with AI chat:', error);
      const errorMessage: Message = {
        role: 'model',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="mb-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <MessageSquare /> Chat with Doctor
            </h1>
            <p className="text-muted-foreground">
                Get answers to your health questions from our AI assistant.
            </p>
        </div>

        <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Disclaimer</AlertTitle>
            <AlertDescription>
            This is an AI-powered simulation for demonstration purposes. For professional medical advice, please consult one of our qualified healthcare providers. If you are in a crisis, please contact an emergency service.
            </AlertDescription>
        </Alert>

      <div className="flex-1 flex flex-col bg-card border rounded-lg shadow-sm">
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg px-4 py-2 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-4 py-2 text-sm flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-background/50 rounded-b-lg">
          <div className="relative">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              className="pr-12"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
