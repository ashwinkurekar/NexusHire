
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Send, Bot, User, Loader2 } from 'lucide-react';
import { StudentProfile } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AICareerAdvisorProps {
  profile: StudentProfile;
}

const AICareerAdvisor: React.FC<AICareerAdvisorProps> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello ${profile.name}! I'm your NexusHire AI Advisor. Based on your profile (CGPA: ${profile.cgpa}, Skills: ${profile.skills.join(', ')}), how can I help you prepare for placements today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Fixed: create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Fixed: Simplified contents parameter to string for direct prompt generation
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a world-class career placement advisor at a top engineering university. 
            The student's profile:
            Name: ${profile.name}
            Branch: ${profile.branch}
            CGPA: ${profile.cgpa}
            Skills: ${profile.skills.join(', ')}
            Year: ${profile.year}
            Backlogs: ${profile.backlogs}

            Provide concise, professional, and actionable advice. If they ask about specific companies, give them tips on interview questions for those roles. If they ask about skills, suggest what to learn next.
            Student's Query: ${userMessage}`,
        config: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 500,
        }
      });

      // Fixed: Access response text property directly as per coding guidelines
      const aiResponse = response.text || "I'm sorry, I couldn't process that request right now.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Our AI brain is briefly cooling down. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold font-heading">AI Placement Advisor</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">Powered by Gemini 3</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-cyan-500' : 'bg-white/10'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-cyan-400" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-500/20 text-white rounded-tr-none' : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center bg-white/5 p-4 rounded-2xl">
              <Loader2 size={16} className="text-cyan-400 animate-spin" />
              <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Consulting Knowledge Base...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about interview tips, resume building, or company prep..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-cyan-500 text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICareerAdvisor;
