"use client";

import type { FormEvent } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Loader2, User, Bot } from 'lucide-react';
import { askDoubt, type AskDoubtInput, type AskDoubtOutput } from '@/ai/flows/ask-doubt-flow';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface DoubtChatboxProps {
  lectureTitle: string;
  lectureSubject: string;
}

export default function DoubtChatbox({ lectureTitle, lectureSubject }: DoubtChatboxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = { role: 'user', content: userInput.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = userInput.trim();
    setUserInput('');
    setIsLoading(true);

    try {
      const input: AskDoubtInput = {
        lectureTitle,
        lectureSubject,
        userQuestion: currentInput,
        chatHistory: messages.map(m => ({ role: m.role, content: m.content })), 
      };
      const result: AskDoubtOutput = await askDoubt(input);
      
      const aiMessage: ChatMessage = { role: 'model', content: result.aiAnswer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error calling askDoubt flow:", error);
      const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: "Chatbot Error",
        description: `Failed to get response: ${errorMsg}`,
        variant: "destructive",
      });
      setMessages(prev => [...prev, {role: 'model', content: `Sorry, I encountered an error trying to respond. Please try again.`}]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="text-primary" />
          AI Doubt Chatbox
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4 space-y-4" ref={scrollViewportRef}>
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Ask any questions you have about the lecture.
              </p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0 mb-1" />}
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border' 
                  }`}
                >
                  {msg.content.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                  ))}
                </div>
                {msg.role === 'user' && <User className="h-6 w-6 text-secondary-foreground flex-shrink-0 mb-1" />}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <Bot className="h-6 w-6 text-primary flex-shrink-0 mb-1" />
                <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm shadow bg-card border">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
            aria-label="Your question"
          />
          <Button type="submit" disabled={isLoading || !userInput.trim()} size="icon" aria-label="Send question">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
