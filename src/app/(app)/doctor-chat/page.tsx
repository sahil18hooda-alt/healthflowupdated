'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Loader2, MessageSquare, Send, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

type Message = {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
};

const mockConversation: Message[] = [
    { role: 'model', content: "Hello! I've reviewed the report you sent over. I'm happy to discuss the results with you. What's on your mind?", timestamp: "10:30 AM"},
    { role: 'user', content: "Thanks, Doctor. I was a bit worried about the 'minor opacity' mentioned in the summary. What does that mean?", timestamp: "10:32 AM"},
    { role: 'model', content: "That's a very common question. An 'opacity' is just a term for an area that looks lighter on an X-ray. In your case, it's very small and likely just some leftover inflammation from a past cold. It's not something to be concerned about at this stage.", timestamp: "10:34 AM"},
];


export default function DoctorChatPage() {
  const [messages, setMessages] = useState<Message[]>(mockConversation);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const doctorImage = PlaceHolderImages.find(p => p.id === 'doctor-2');

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

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate doctor's response
    setTimeout(() => {
      const assistantMessage: Message = { role: 'model', content: "Thank you for your question. I will get back to you shortly.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
        
      <div className="flex-1 flex flex-col bg-card border rounded-lg shadow-sm">
        <header className="flex items-center gap-4 p-4 border-b">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/appointments"><ArrowLeft/></Link>
            </Button>
            <Avatar>
                {doctorImage && <AvatarImage src={doctorImage.imageUrl} alt="Dr. Sharma" />}
                <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold text-lg">Dr. Arjun Sharma</h2>
                <p className="text-sm text-muted-foreground">Online now</p>
            </div>
        </header>
        
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-end gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8">
                     {doctorImage && <AvatarImage src={doctorImage.imageUrl} alt="Dr. Sharma" />}
                     <AvatarFallback>AS</AvatarFallback>
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
                  <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
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
                  Sending...
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
