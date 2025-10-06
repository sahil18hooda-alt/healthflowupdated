'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, Loader2, Send, ArrowLeft, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { getMessages, addMessage, ChatMessage } from '@/lib/mock-data';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';


function DoctorChatContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const role = searchParams.get('role');
  const isDoctor = role === 'employee';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const doctorImage = `https://images.unsplash.com/photo-1612349316228-5942a9b489c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxkb2N0b3J8ZW58MHx8fHwxNzIyMzgxODg5fDA&ixlib=rb-4.1.0&q=80&w=1080`;
  const patientImage = `https://avatar.vercel.sh/guest.png`;

  const senderName = isDoctor ? 'Dr. Arjun Sharma' : 'Guest';
  const receiverName = isDoctor ? 'Guest' : 'Dr. Arjun Sharma';
  const senderAvatar = isDoctor ? doctorImage : patientImage;
  const receiverAvatar = isDoctor ? patientImage : doctorImage;

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

    // Fallback polling
    const interval = setInterval(fetchMessages, 5000);

    return () => {
        window.removeEventListener('storage-update', handleStorageUpdate);
        clearInterval(interval);
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
    addMessage(senderName, receiverName, input);
    setInput('');
  };
  
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
            title: "File Too Large",
            description: "Please select an image smaller than 2MB.",
            variant: "destructive"
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const imageBase64 = e.target?.result as string;
        addMessage(senderName, receiverName, '', imageBase64);
    };
    reader.readAsDataURL(file);
    
    // Reset file input value
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
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
                    'max-w-md rounded-lg px-3 py-2 text-sm',
                    message.sender === senderName
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.attachment && (
                    <div className="mb-2">
                        <Image src={message.attachment} alt="Attachment" width={200} height={200} className="rounded-md object-cover"/>
                    </div>
                  )}
                  {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
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
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button size="icon" variant="ghost" onClick={handleAttachmentClick}>
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

export default function DoctorChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DoctorChatContent />
        </Suspense>
    )
}
