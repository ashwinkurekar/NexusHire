
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
// Fixed: Added missing User and Bot imports from lucide-react
import { Mic, MicOff, Send, Play, Square, Loader2, Sparkles, MessageSquare, Award, History, User, Bot } from 'lucide-react';
import { PlacementDrive, StudentProfile, InterviewMessage } from '../types';

interface MockInterviewProps {
  profile: StudentProfile;
  drives: PlacementDrive[];
}

const MockInterview: React.FC<MockInterviewProps> = ({ profile, drives }) => {
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const startInterview = async (drive: PlacementDrive) => {
    setSelectedDrive(drive);
    setIsStarted(true);
    setIsThinking(true);
    
    setMessages([
      { role: 'interviewer', text: `Welcome to the mock interview for ${drive.companyName}. I'll be acting as your technical interviewer for the ${drive.role} position. Are you ready to begin?`, timestamp: new Date().toLocaleTimeString() }
    ]);
    setIsThinking(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || !selectedDrive) return;

    const userMsg: InterviewMessage = { role: 'candidate', text, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Fixed: Instantiate GoogleGenAI right before the call to ensure fresh API key usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an elite technical interviewer at ${selectedDrive.companyName}.
        The candidate is applying for the ${selectedDrive.role} position.
        
        Candidate Profile:
        Name: ${profile.name}
        Skills: ${profile.skills.join(', ')}
        CGPA: ${profile.cgpa}
        
        Context: This is a professional mock interview. Ask technical and behavioral questions one by one. 
        Analyze the candidate's last response and provide constructive follow-up or a new question.
        Keep your responses concise and professional.
        
        Interview History:
        ${messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}
        CANDIDATE: ${text}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { temperature: 0.7 }
      });

      // Fixed: Access response.text property directly as per Google GenAI SDK rules
      const aiText = response.text || "I apologize, something went wrong. Let's try that again.";
      setMessages(prev => [...prev, { role: 'interviewer', text: aiText, timestamp: new Date().toLocaleTimeString() }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'interviewer', text: "Connection interrupted. Let's resume.", timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-1000">
        <header className="space-y-4">
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
            <Award size={14} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Interview Readiness Studio</span>
          </div>
          <h1 className="text-6xl font-black font-heading tracking-tighter">Mock <span className="text-white/20">Studio</span></h1>
          <p className="text-white/40 font-medium max-w-xl">Master your placement interviews with personalized AI sessions. Select a company to begin your evaluation.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drives.map(drive => (
            <div key={drive.id} className="glass rounded-[40px] p-8 space-y-6 group hover:border-indigo-500/30 transition-all duration-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 p-2 border border-white/10">
                  <img src={drive.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{drive.companyName}</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-black">{drive.role}</p>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed italic">Simulate technical and HR rounds specific to {drive.companyName}'s culture and stack.</p>
              <button 
                onClick={() => startInterview(drive)}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl"
              >
                Start Session
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col glass rounded-[48px] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in duration-500">
      {/* Session Header */}
      <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Mic size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading">{selectedDrive?.companyName} Interview</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Live Session in Progress</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsStarted(false)}
          className="px-6 py-2.5 rounded-xl bg-white/5 text-rose-400 text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
        >
          End Session
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-5 max-w-[80%] ${msg.role === 'candidate' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/10 ${
                msg.role === 'candidate' ? 'bg-gradient-to-tr from-cyan-500 to-indigo-500' : 'bg-white/10'
              }`}>
                {msg.role === 'candidate' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-cyan-400" />}
              </div>
              <div className="space-y-2">
                <div className={`p-6 rounded-[32px] text-sm leading-relaxed shadow-xl ${
                  msg.role === 'candidate' 
                  ? 'bg-indigo-500/10 text-white rounded-tr-none border border-indigo-500/20' 
                  : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                }`}>
                  {msg.text}
                </div>
                <p className={`text-[8px] font-black uppercase tracking-widest text-white/20 ${msg.role === 'candidate' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="flex gap-4 items-center bg-white/5 px-6 py-4 rounded-3xl border border-white/5">
              <Loader2 size={16} className="text-indigo-400 animate-spin" />
              <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Interviewer is processing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-8 border-t border-white/5 bg-black/40">
        <div className="relative flex items-center gap-4">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`p-5 rounded-2xl transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/40' : 'bg-white/5 text-white/40 hover:text-white'}`}
          >
            {isRecording ? <Square size={20} /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Type your response here..."
            className="flex-1 bg-white/5 border border-white/10 rounded-[24px] py-5 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isThinking || !input.trim()}
            className="p-5 rounded-2xl bg-indigo-500 text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-indigo-500/20"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[9px] text-center text-white/20 uppercase tracking-[0.3em] mt-6 font-black">Powered by Nexus Intelligence Engine</p>
      </div>
    </div>
  );
};

export default MockInterview;
