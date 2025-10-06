'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, Loader2, Send, ArrowLeft, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { getMessages, addMessage, ChatMessage } from '@/lib/mock-data';
import { useSearchParams } from 'next/navigation';

export default function DoctorChatPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  const isDoctor = role === 'employee';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const doctorImage = PlaceHolderImages.find(p => p.id === 'doctor-2');
  const patientImage = `https://avatar.vercel.sh/guest.png`;

  const senderName = isDoctor ? 'Dr. Arjun Sharma' : 'Guest';
  const receiverName = isDoctor ? 'Guest' : 'Dr. Arjun Sharma';
  const senderAvatar = isDoctor ? doctorImage?.imageUrl : patientImage;
  const receiverAvatar = isDoctor ? patientImage : doctorImage?.imageUrl;

  const fetchMessages = useCallback(() => {
    setMessages(getMessages());
  }, []);

  useEffect(() => {
    fetchMessages();

    const handleStorageUpdate = (e: Event) => {
        const event = e as CustomEvent;
        if (event.detail.key === 'chatMessages') {
            fetchMessages();
        }
    };
    window.addEventListener('storage-update', handleStorageUpdate);

    return () => {
        window.removeEventListener('storage-update', handleStorageUpdate);
    };
  }, [fetchMessages]);


  useEffect(() => {
    if (scrollAreaRef.current) {
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

    const newMessage = addMessage(senderName, receiverName, input);
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-1 flex flex-col bg-card border rounded-lg shadow-sm">
        <header className="flex items-center gap-4 p-4 border-b">
            <Button variant="ghost" size="icon" asChild>
                <Link href={isDoctor ? "/dashboard?role=employee" : "/appointments"}>
                    <ArrowLeft/>
                </Link>
            </Button>
            <Avatar>
                {receiverAvatar && <AvatarImage src={receiverAvatar} alt={receiverName} />}
                <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="font-semibold text-lg">{receiverName}</h2>
                <p className="text-sm text-muted-foreground">Online now</p>
            </div>
        </header>
        
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-3',
                  message.sender === senderName ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender !== senderName && (
                  <Avatar className="h-8 w-8">
                     {receiverAvatar && <AvatarImage src={receiverAvatar} alt={receiverName} />}
                     <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg px-4 py-2 text-sm',
                    message.sender === senderName
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs text-right mt-1 opacity-70">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                {message.sender === senderName && (
                  <Avatar className="h-8 w-8">
                    {senderAvatar && <AvatarImage src={senderAvatar} alt={senderName} />}
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-4 bg-background/50 rounded-b-lg">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
                <Paperclip className="h-5 w-5"/>
            </Button>
            <div className="relative flex-1">
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
    </div>
  );
}
