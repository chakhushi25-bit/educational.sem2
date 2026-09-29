import React, { useState, useRef, useEffect } from 'react';
import { defaultAiResponses } from '../data/mockData';
import { api, authStorage } from '../api';

export default function AiAssistantPage({ user, preSelectedSubjectId, onOpenVault }) {
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello ${user.displayName.split(' ')[0]}! 👋 I'm your StudySync AI Tutor powered by OpenRouter AI & RAG.\n\nI can analyze your uploaded subject syllabi, break down complex formulas, generate exam quizzes, and answer questions grounded in your course documents. What topic are we mastering today?`,
      time: 'Just now',
      sources: null,
      model: 'meta-llama/llama-3.3-70b-instruct:free',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // OpenRouter & RAG state
  const [selectedModel, setSelectedModel] = useState(authStorage.getModel());
  const [openRouterKey, setOpenRouterKey] = useState(authStorage.getApiKey());
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState(authStorage.getApiKey());

  const [useRag, setUseRag] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(preSelectedSubjectId || 'all');
  const [availableModels, setAvailableModels] = useState([
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)', provider: 'Meta AI' },
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)', provider: 'Google' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', provider: 'Mistral' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  ]);

  const [expandedSources, setExpandedSources] = useState({});

  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    api.getModels()
      .then((models) => {
        if (models && models.length > 0) setAvailableModels(models);
      })
      .catch(() => {});
  }, []);

  const handleSaveApiKey = () => {
    authStorage.setApiKey(tempKeyInput);
    setOpenRouterKey(tempKeyInput);
    setShowKeyModal(false);
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    authStorage.setModel(modelId);
  };

  const toggleSourceExpand = (msgId) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const payload = {
      text: query,
      subjectId: selectedSubject === 'all' ? null : selectedSubject,
      useRag: useRag,
      model: selectedModel,
      apiKey: openRouterKey || null,
    };

    api.sendChat(payload)
      .then((result) => {
        setMessages(prev => [...prev, result.ai]);
        setIsTyping(false);
      })
      .catch((err) => {
        // Fallback local response
        const fallbackMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `### 🎓 StudySync Response: ${query}\n\n1. **Core Syllabus Focus:** This topic is high-yield for upcoming examinations.\n2. **Concept Overview:** Focus on identifying given boundary values and governing relationships.\n3. **RAG Grounding:** Upload related subject PDF notes in the **Subject Vault** to get exact page citations!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: null,
          model: selectedModel,
        };
        setMessages(prev => [...prev, fallbackMsg]);
        setIsTyping(false);
      });
  };

  const subjects = user?.subjects || [
    { id: 'bio', name: 'General Biology' },
    { id: 'econ', name: 'Macroeconomics' },
    { id: 'pol_sci', name: 'Political Science' },
    { id: 'math', name: 'Calculus & Linear Algebra' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-6 flex flex-col h-[calc(100vh-4.5rem)] pb-24 lg:pb-8">
      
      {/* Top Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-outline-variant/30 gap-4 shrink-0">
        
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary text-white flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-[26px]">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-headline-sm text-on-surface">
                StudySync AI Tutor
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                OpenRouter + RAG
              </span>
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Grounded in your Course Syllabi & Lecture Notes</span>
            </p>
          </div>
        </div>

        {/* AI & RAG Configuration Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* RAG Toggle */}
          <button
            onClick={() => setUseRag(!useRag)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              useRag
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-surface border-outline-variant/30 text-on-surface-variant'
            }`}
            title="Toggle RAG (Retrieval-Augmented Generation from uploaded documents)"
          >
            <span className="material-symbols-outlined text-[16px]">
              {useRag ? 'auto_stories' : 'menu_book'}
            </span>
            <span>RAG Grounding: {useRag ? 'ON ⚡' : 'OFF'}</span>
          </button>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface border border-outline-variant/30 text-on-surface focus:border-primary outline-none"
          >
            <option value="all">📚 All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-surface border border-outline-variant/30 text-on-surface focus:border-primary outline-none max-w-[180px] sm:max-w-none truncate"
          >
            {availableModels.map(m => (
              <option key={m.id} value={m.id}>
                🤖 {m.name} ({m.provider})
              </option>
            ))}
          </select>

          {/* API Key Modal Button */}
          <button
            onClick={() => {
              setTempKeyInput(openRouterKey);
              setShowKeyModal(true);
            }}
            className="p-2 rounded-full bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors"
            title="Configure OpenRouter API Key"
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
          </button>

          {/* Clear chat */}
          <button
            onClick={() => setMessages([{ id: 'reset', sender: 'ai', text: 'Chat refreshed. What subject topic shall we examine?', time: 'Now' }])}
            className="p-2 rounded-full bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-error transition-colors"
            title="Clear Chat Log"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="py-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {[
            { label: 'Explain this simply', icon: 'lightbulb', color: 'text-primary' },
            { label: 'Create 10 MCQs with answers', icon: 'quiz', color: 'text-secondary' },
            { label: 'Solve step-by-step with formulas', icon: 'calculate', color: 'text-emerald-600' },
            { label: 'Summarize uploaded syllabus notes', icon: 'auto_stories', color: 'text-tertiary' },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.label)}
              className="px-3.5 py-2 rounded-2xl bg-surface hover:bg-surface-container border border-outline-variant/30 text-xs font-semibold text-on-surface flex items-center gap-2 shrink-0 transition-all active:scale-95 shadow-xs"
            >
              <span className={`material-symbols-outlined text-[17px] ${action.color}`}>
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-2">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          const hasSources = msg.sources && msg.sources.length > 0;
          const isExpanded = expandedSources[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isAi ? 'justify-start' : 'justify-end'} animate-fadeIn`}
            >
              {isAi && (
                <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[75%] rounded-3xl p-5 sm:p-6 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'bg-surface border border-outline-variant/30 text-on-surface rounded-tl-sm'
                    : 'bg-primary text-white rounded-tr-sm'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed font-body-lg">
                  {msg.text}
                </div>

                {/* RAG Cited Sources Box */}
                {hasSources && (
                  <div className="mt-4 pt-3 border-t border-outline-variant/20">
                    <button
                      onClick={() => toggleSourceExpand(msg.id)}
                      className="flex items-center justify-between w-full text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">library_books</span>
                        <span>{msg.sources.length} Verified Course Material Chunks Cited</span>
                      </span>
                      <span className="material-symbols-outlined text-[18px]">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 space-y-2 animate-fadeIn">
                        {msg.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/20 text-xs text-on-surface-variant space-y-1"
                          >
                            <div className="flex items-center justify-between font-bold text-on-surface text-[11px]">
                              <span>📄 {src.documentTitle}</span>
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                                {src.subjectName}
                              </span>
                            </div>
                            <p className="text-[11px] italic text-on-surface-variant/90 leading-normal">
                              "{src.snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[11px] mt-3 flex items-center gap-2 ${isAi ? 'text-outline' : 'text-white/80 justify-end'}`}>
                  <span>{msg.time}</span>
                  {isAi && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-primary">OpenRouter AI</span>
                    </>
                  )}
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
          <div className="flex items-center gap-3.5 animate-fadeIn">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div className="bg-surface border border-outline-variant/30 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-sm">
              <span className="text-xs text-on-surface-variant font-medium mr-2">Searching knowledge base...</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="pt-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2.5 bg-surface border border-outline-variant/40 rounded-full p-2 shadow-lg focus-within:border-primary transition-colors max-w-4xl mx-auto w-full"
        >
          <button
            type="button"
            onClick={onOpenVault}
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors shrink-0"
            title="Upload new subject document"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              useRag
                ? `Ask about your ${selectedSubject === 'all' ? 'uploaded courses' : selectedSubject} syllabus...`
                : 'Ask OpenRouter AI anything...'
            }
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

      {/* OpenRouter API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface border border-outline-variant/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[24px]">vpn_key</span>
                <h3 className="text-lg font-bold font-headline-sm text-on-surface">OpenRouter API Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Enter your personal OpenRouter API key to query frontier models (Llama 3.3, Claude 3.5 Sonnet, Gemini 2.0 Flash, DeepSeek). If left empty, StudySync uses built-in academic fallback mode.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                OpenRouter Key (`sk-or-v1-...`)
              </label>
              <input
                type="password"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full px-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/40 text-xs sm:text-sm text-on-surface focus:border-primary outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-container transition-all"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
