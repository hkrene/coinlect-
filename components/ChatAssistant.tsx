'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botImage = "https://res.cloudinary.com/drsd8adkq/image/upload/v1765188975/coinlectbot-0_f4fkuh.jpg";

  // Reset/Set initial message when language changes
  useEffect(() => {
    setMessages([{ role: 'assistant', content: t.chat.greeting }]);
  }, [language, t.chat.greeting]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      const responseText = data.response || "I'm having trouble processing your request right now. Please try again later.";
      
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble processing your request right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed z-50 flex flex-col items-end bottom-6 right-6">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] glass-card rounded-2xl flex flex-col border border-coinlect-accent/30 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 text-black bg-gradient-to-r from-coinlect-accent to-yellow-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 overflow-hidden bg-black border rounded-full border-black/10">
                <img src={botImage} alt="AI" className="object-cover w-full h-full" />
              </div>
              <span className="text-sm font-bold">{t.chat.supportName}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 transition-colors rounded-full hover:bg-black/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-black/80">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                {msg.role === 'assistant' && (
                   <div className="flex-shrink-0 w-6 h-6 mb-1 overflow-hidden border rounded-full border-white/10">
                      <img src={botImage} alt="Bot" className="object-cover w-full h-full" />
                   </div>
                )}
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-coinlect-accent text-black rounded-br-none' 
                    : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end justify-start gap-2">
                 <div className="flex-shrink-0 w-6 h-6 mb-1 overflow-hidden border rounded-full border-white/10">
                    <img src={botImage} alt="Bot" className="object-cover w-full h-full" />
                 </div>
                <div className="flex gap-1 p-3 text-xs text-gray-400 rounded-lg rounded-bl-none bg-white/10">
                  {t.chat.typing}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2 p-3 border-t bg-neutral-900 border-white/10">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.chat.placeholder}
              className="flex-1 px-3 py-2 text-sm text-white transition-colors border rounded-md bg-black/50 border-white/10 focus:outline-none focus:border-coinlect-accent"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="p-2 text-black transition-colors rounded-md bg-coinlect-accent hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        data-chat-trigger
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-coinlect-accent shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center text-black hover:scale-110 transition-transform duration-300 group overflow-hidden relative"
      >
        {isOpen ? (
            <X className="relative z-10 w-6 h-6" /> 
        ) : (
            <img src={botImage} alt="Chat" className="object-cover w-full h-full" />
        )}
        
        {!isOpen && (
            <span className="absolute px-3 py-1 mr-4 text-xs font-bold text-black transition-opacity duration-300 bg-white rounded-md opacity-0 pointer-events-none right-full whitespace-nowrap group-hover:opacity-100">
                AI Assistant
            </span>
        )}
      </button>
    </div>
  );
};
