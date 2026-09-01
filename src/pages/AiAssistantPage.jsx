import React, { useState, useRef, useEffect } from 'react';
import { defaultAiResponses } from '../data/mockData';
import { api } from '../api';

export default function AiAssistantPage({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello ${user.displayName.split(' ')[0]}! 👋 I'm your StudySync AI Tutor. I can explain complex syllabus concepts, generate practice quizzes, break down formulas step-by-step, or adapt your study timetable. What topic are we working on today?`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const localReply = () => {
      let replyText = "";
      const lower = query.toLowerCase();
      if (lower.includes('mcq') || lower.includes('quiz') || lower.includes('questions')) {
        replyText = defaultAiResponses["create 10 mcqs"];
      } else if (lower.includes('simply') || lower.includes('simple') || lower.includes('explain')) {
        replyText = defaultAiResponses["explain this simply"];
      } else if (lower.includes('revise') || lower.includes('revision') || lower.includes('recall')) {
        replyText = defaultAiResponses["help me revise"];
      } else if (lower.includes('solve') || lower.includes('step') || lower.includes('calculate')) {
        replyText = defaultAiResponses["solve step-by-step"];
      } else {
        replyText = `That's a great question regarding **${query}**.\n\nIn our syllabus analysis, this relates directly to your upcoming exam objectives. Here is how you should structure your mastery:\n\n1. **Core Concept:** First, grasp the fundamental definitions and underlying axioms.\n2. **Common Exam Trap:** Watch out for edge cases and sign changes in multi-step questions.\n3. **Quick Practice:** Would you like me to generate 3 practice questions or a 5-minute summary sheet for this topic?`;
      }
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    };

    api.sendChat(query)
      .then((result) => {
        setMessages(prev => [...prev, result.ai]);
        setIsTyping(false);
      })
      .catch(() => {
        setMessages(prev => [...prev, localReply()]);
        setIsTyping(false);
      });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-6 flex flex-col h-[calc(100vh-4.5rem)] pb-24 lg:pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-[26px]">smart_toy</span>
          </div>
          <div>
            <h1 className="text-xl font-bold font-headline-sm text-on-surface">
              StudySync AI Assistant
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              24/7 Context-Aware Academic Tutor
            </p>
          </div>
        </div>

        <button 
          onClick={() => setMessages([{ id: 'reset', sender: 'ai', text: 'Chat cleared! What new topic can I assist you with?', time: 'Now' }])}
          className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface border border-outline-variant/30 hover:bg-surface-container transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Quick Action Chips */}
      <div className="py-3.5 shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
          Quick Study Actions
        </span>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
          {[
            { label: 'Explain this simply', icon: 'lightbulb', color: 'text-primary' },
            { label: 'Create 10 MCQs', icon: 'quiz', color: 'text-secondary' },
            { label: 'Help me revise', icon: 'edit_document', color: 'text-tertiary' },
            { label: 'Solve step-by-step', icon: 'calculate', color: 'text-emerald-600' }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.label)}
              className="px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface flex items-center gap-2 shrink-0 transition-all active:scale-95 shadow-xs"
            >
              <span className={`material-symbols-outlined text-[18px] ${action.color}`}>
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-3xl p-5 sm:p-6 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'bg-surface border border-outline-variant/30 text-on-surface rounded-tl-sm'
                    : 'bg-primary text-white rounded-tr-sm'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>
                <div className={`text-[11px] mt-2.5 flex items-center gap-1.5 ${isAi ? 'text-outline' : 'text-white/80 justify-end'}`}>
                  <span>{msg.time}</span>
                  {isAi && <span className="font-semibold">• StudySync AI</span>}
                </div>
              </div>

              {!isAi && (
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 mt-1 ring-2 ring-primary/20">
                  <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing Bubble */}
        {isTyping && (
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div className="bg-surface border border-outline-variant/30 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="pt-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2.5 bg-surface border border-outline-variant/40 rounded-full p-2 shadow-lg focus-within:border-primary transition-colors max-w-4xl mx-auto w-full"
        >
          <button
            type="button"
            onClick={() => handleSend("Can you review this chapter syllabus?")}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors shrink-0"
            title="Attach prompt"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything about your syllabus, exam questions, or schedule..."
            className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-on-surface focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-10 h-10 rounded-full bg-primary hover:bg-primary-container text-white flex items-center justify-center shadow-md transition-all active:scale-90 disabled:opacity-50 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
          </button>
        </form>
      </div>

    </div>
  );
}
