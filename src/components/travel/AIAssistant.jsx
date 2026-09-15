"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image, MoreVertical, Sparkles, Loader2, Bot, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ReactMarkdown from 'react-markdown';

const AIAssistant = ({ weather, distance }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI travel assistant powered by Gemini. I can help you find the best routes, check weather, suggest tourist places, and plan your trips. Where would you like to go today? 🌍",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [suggestions, setSuggestions] = useState([
    "Best routes from Delhi to Mumbai",
    "Cheapest train to Goa",
    "Weather in Jaipur this week",
    "Top tourist places in Kerala",
    "Plan a 3-day trip to Rajasthan"
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

    // Load past conversation history when the page loads
  useEffect(() => {
    const loadHistory = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/conversations/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            // Only load if there are messages, and don't overwrite the default welcome message
            setMessages(data.messages.map(msg => ({
              ...msg,
              id: msg._id || Date.now().toString(),
              timestamp: new Date(msg.timestamp)
            })));
          }
        }
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    loadHistory();
  }, [user?.id]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

    const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, { ...userMessage, id: crypto.randomUUID() }]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const response = await fetch('http://localhost:5000/api/gemini/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userId: user?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        // Split by 'data: ' which is the standard SSE format
        const lines = chunk.split('data: ');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed === '' || trimmed === '[DONE]') continue;

          try {
            const parsed = JSON.parse(trimmed);
            if (parsed.content) {
              accumulatedResponse += parsed.content;
              setStreamingContent(accumulatedResponse);
            }
            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (e) {
            // Ignore parsing errors from incomplete chunks
            if (!(e instanceof SyntaxError)) {
              console.error('Parse error:', e);
            }
          }
        }
      }

      // Add complete response to messages
      if (accumulatedResponse) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: accumulatedResponse,
          timestamp: new Date()
        }]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `⚠️ Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setTimeout(handleSendMessage, 100);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Travel Assistant</h3>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse"></span>
              Online • Powered by Gemini
            </p>
          </div>
        </div>
        <button className="text-white/70 hover:text-white transition p-1 rounded hover:bg-white/10">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.isError
                  ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="prose prose-sm max-w-none text-slate-800">
                <ReactMarkdown 
                  components={{
                    strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              <div className={`text-[10px] mt-1 ${
                msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
              }`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center ml-2 flex-shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {/* Streaming Response */}
        {isStreaming && streamingContent && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-[75%]">
              <div className="whitespace-pre-wrap">{streamingContent}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && !streamingContent && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-6 py-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (shown when few messages) */}
      {messages.length < 4 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-400 mb-2">Quick suggestions:</p>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition whitespace-nowrap"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about travel..."
              className="w-full px-4 py-2 pr-12 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[44px] max-h-32"
              rows={1}
              disabled={isLoading}
              style={{
                height: 'auto',
                minHeight: '44px'
              }}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <button 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                disabled={isLoading}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                disabled={isLoading}
              >
                <Image className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2 rounded-xl transition ${
              input.trim() && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          AI may provide inaccurate information • Powered by Google Gemini
        </p>
      </div>
    </div>
  );
};

// ✅ This is the critical line that fixes your error!
export default AIAssistant;