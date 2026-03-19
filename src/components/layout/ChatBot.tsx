'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// High-performance Markdown formatter for professional AI responses
function FormattedMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-4 last:mb-0 leading-[1.6]">{children}</p>,
        h1: ({ children }) => <h1 className="text-gold-light font-serif text-[1.2rem] font-bold mt-4 mb-2 tracking-tight">{children}</h1>,
        h2: ({ children }) => <h2 className="text-gold-light font-serif text-[1.1rem] font-bold mt-4 mb-2 tracking-tight">{children}</h2>,
        h3: ({ children }) => <h3 className="text-gold-light font-serif text-[1rem] font-bold mt-3 mb-2 tracking-tight">{children}</h3>,
        strong: ({ children }) => <strong className="text-gold-light font-bold">{children}</strong>,
        ul: ({ children }) => <ul className="list-disc ml-4 mb-4 space-y-1 text-ivory/90">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal ml-4 mb-4 space-y-1 text-ivory/90">{children}</ol>,
        li: ({ children }) => <li className="pl-1">{children}</li>,
        blockquote: ({ children }) => <blockquote className="border-l-2 border-gold/30 pl-4 italic my-4 text-stone">{children}</blockquote>,
        code: ({ children }) => <code className="bg-void/50 border border-border-subtle rounded px-1.5 py-0.5 font-mono text-gold-pale">{children}</code>
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! 🏛️📈 I am your Ethical Trader Assistant. How can I help you master ICT/SMC or navigate our terminal today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Error: ' + data.error }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Failed to connect. Please check your network or API key.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[75vh] sm:max-h-[600px] bg-void border border-border-mid rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
            style={{ 
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 15px rgba(201,149,42,0.1)' 
            }}
          >
            {/* Header */}
            <div className="p-4 bg-onyx border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
                  <Bot size={16} className="text-gold-light" />
                </div>
                <div>
                  <div className="text-[0.8rem] font-bold text-ivory leading-none">Trader Assistant</div>
                  <div className="text-[0.6rem] text-bull mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-bull rounded-full animate-pulse" />
                    NVIDIA NIM Powered
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/5 rounded-md text-stone transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[radial-gradient(circle_at_center,rgba(201,149,42,0.03)_0%,transparent_100%)]"
            >
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-xl p-3 text-[0.82rem] leading-[1.6] ${
                    m.role === 'user' 
                      ? 'bg-gold/10 border border-gold/20 text-ivory shadow-[0_4px_12px_rgba(201,149,42,0.1)]' 
                      : 'bg-onyx/80 border border-border-subtle text-parchment'
                  }`}>
                    <FormattedMessage content={m.content} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-onyx/80 border border-border-subtle rounded-xl p-3">
                    <Loader2 size={16} className="text-gold animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form 
              onSubmit={handleSubmit}
              className="p-4 border-t border-border-subtle bg-onyx/30 flex gap-3"
            >
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about trading strategies..."
                className="flex-1 bg-void border border-border-subtle rounded-md px-3 py-2 text-[0.8rem] text-ivory placeholder:text-stone focus:outline-none focus:border-gold/50 transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-gold text-void rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light transition-all"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gold to-gold-deep rounded-full shadow-[0_4px_20px_rgba(201,149,42,0.4)] flex items-center justify-center text-void relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <MessageSquare size={24} className="relative z-10" />
      </motion.button>
    </div>
  );
}
