"use client";

import React from 'react';
import { Send, Mic, Sparkles, Volume2, RefreshCw, MessageSquare, Key } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { processChatQuery } from '@/services/aiService';
import { showError } from '@/utils/toast';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const AIAssistant = ({ weather, distance }: { weather: string; distance: number }) => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([
    { role: 'ai', content: `Hello! I'm your AI Travel Concierge. I see you're looking at a ${distance}km trip. With ${weather.toLowerCase()} conditions, I can help you find the most reliable route. What's on your mind?` }
  ]);
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const hasKey = !!(import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('VITE_GEMINI_API_KEY'));

  const suggestions = [
    "Suggest a 3-day itinerary for Goa",
    "Best way to travel from Bangalore to Mysore?",
    "What are the top food spots in Hyderabad?",
    "How to handle travel delays due to rain?"
  ];

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    const messageText = text.trim();
    if (!messageText || isTyping) return;
    
    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await processChatQuery(messageText);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      showError("AI Service is currently unavailable");
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showError("Speech recognition not supported");
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };

  return (
    <div className="glass-card rounded-[2rem] flex flex-col h-[600px] overflow-hidden border-slate-200 shadow-sm bg-white">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Sparkles className="text-primary w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">AI Concierge</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full text-slate-400" onClick={() => setMessages([messages[0]])}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 p-5 space-y-4 overflow-y-auto bg-slate-50/30 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", msg.role === 'user' && "justify-end")}
          >
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="text-primary w-3.5 h-3.5" />
              </div>
            )}
            <div className={cn(
              "p-3.5 rounded-2xl text-sm max-w-[85%] leading-relaxed border",
              msg.role === 'ai' 
                ? "bg-white rounded-tl-none border-slate-100 text-slate-700" 
                : "bg-primary text-white rounded-tr-none border-primary/20 shadow-md"
            )}>
              <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap">
                {msg.content}
                {msg.content.includes("API Key Missing") && (
                  <div className="mt-4">
                    <Button 
                      onClick={() => navigate('/profile')}
                      className="bg-white text-primary hover:bg-slate-50 border-none font-black text-[10px] uppercase tracking-widest h-8 rounded-lg gap-2"
                    >
                      <Key size={12} /> Go to Profile
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="text-primary w-3.5 h-3.5" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 space-y-4">
        {!hasKey && (
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center justify-between">
            <p className="text-[10px] font-bold text-amber-700">AI is in demo mode. Add your API key to enable live chat.</p>
            <Button size="sm" variant="ghost" onClick={() => navigate('/profile')} className="h-7 text-[9px] font-black uppercase text-amber-700 hover:bg-amber-100">Setup</Button>
          </div>
        )}

        {messages.length === 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 hover:bg-primary/5 hover:border-primary/20 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-slate-50 border-slate-200 rounded-xl pr-20 h-12 focus:ring-primary/20 text-sm" 
            placeholder="Ask about your trip..." 
            disabled={isTyping}
          />
          <div className="absolute right-1.5 top-1.5 bottom-1.5 flex gap-1">
            <Button 
              type="button"
              size="icon" 
              variant="ghost"
              onClick={startListening}
              className={cn("rounded-lg w-9 h-9", isListening && "text-primary bg-primary/10")}
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button type="submit" size="icon" className="rounded-lg w-9 h-9 shadow-md" disabled={isTyping || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;