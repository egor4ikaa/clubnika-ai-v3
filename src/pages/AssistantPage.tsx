import { useState, useRef, useEffect } from 'react';
import { AI_AGENTS, SYSTEM_PROMPT, type ChatMessage } from '@/data/aiAgents';
import {
  Brain, Sparkles, Zap, Wind, Cloud, Send,
  ArrowLeft, Loader2, User, Bot, Key, ChevronDown, Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const agentIcons: Record<string, typeof Brain> = {
  gemini: Brain,
  deepseek: Sparkles,
  groq: Zap,
  mistral: Wind,
  yandex: Cloud
};

const quickQuestions = [
  'Как бороться с серой гнилью на клубнике?',
  'Когда лучше сажать клубнику весной?',
  'Какой сорт выбрать для теплицы?',
  'Какие препараты эффективны от тли?',
  'Как правильно поливать клубнику?',
  'Как подготовить грядки к зиме?'
];

export function AssistantPage() {
  const [selectedAgent, setSelectedAgent] = useState(AI_AGENTS[0]);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(AI_AGENTS[0].defaultModel || AI_AGENTS[0].models[0]?.id || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Функция: получить ключ из переменной окружения по id провайдера
  const getEnvApiKey = (agentId: string): string => {
    switch (agentId) {
      case 'gemini': return import.meta.env.VITE_GEMINI_API_KEY || '';
      case 'deepseek': return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
      case 'groq': return import.meta.env.VITE_GROQ_API_KEY || '';
      case 'mistral': return import.meta.env.VITE_MISTRAL_API_KEY || '';
      case 'yandex': return import.meta.env.VITE_YANDEX_API_KEY || '';
      default: return '';
    }
  };

  // Автоматическая инициализация всех ключей из .env (при первом запуске)
  useEffect(() => {
    AI_AGENTS.forEach(agent => {
      const saved = localStorage.getItem(`api_key_${agent.id}`);
      if (!saved) {
        const envKey = getEnvApiKey(agent.id);
        if (envKey) {
          localStorage.setItem(`api_key_${agent.id}`, envKey);
        }
      }
    });
  }, []);

  // Загрузка ключа для выбранного провайдера
  useEffect(() => {
    const saved = localStorage.getItem(`api_key_${selectedAgent.id}`);
    if (saved) {
      setApiKey(saved);
      setShowApiInput(false);
    } else {
      // Попробуем ещё раз взять из окружения (на случай, если .env обновили после первого рендера)
      const envKey = getEnvApiKey(selectedAgent.id);
      if (envKey) {
        localStorage.setItem(`api_key_${selectedAgent.id}`, envKey);
        setApiKey(envKey);
        setShowApiInput(false);
      } else {
        setApiKey('');
        setShowApiInput(true);
      }
    }
  }, [selectedAgent]);

  // Сохранение ключа при ручном вводе
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(`api_key_${selectedAgent.id}`, apiKey);
      setShowApiInput(false);
      setError(null);
    } else {
      setError('API-ключ не может быть пустым');
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    if (selectedAgent.requiresApi && !apiKey) {
      setShowApiInput(true);
      setError('Необходим API-ключ. Введите его ниже или добавьте в .env');
      return;
    }

    const userMessage: ChatMessage = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await selectedAgent.sendMessage(
        userMessage.text,
        apiKey,
        selectedModel,
        SYSTEM_PROMPT,
        messages
      );
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (err: any) {
      setError(err.message || 'Ошибка при получении ответа');
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `❌ Ошибка: ${err.message || 'Не удалось получить ответ'}. Проверьте API-ключ.`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (q: string) => handleSend(q);
  const clearChat = () => { setMessages([]); setError(null); };

  // Индикатор наличия ключа для каждого провайдера
  const hasKey = (agentId: string) => {
    const key = localStorage.getItem(`api_key_${agentId}`);
    return !!key && key.length > 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex flex-col">
      {/* Header (без изменений) */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-green-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">ИИ-ассистент</h1>
                <p className="text-xs text-gray-500">Ягодный эксперт AI</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={clearChat} className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors" title="Очистить чат">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setShowApiInput(!showApiInput)} className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">API-ключ</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-64 bg-white border-r border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Провайдеры</h3>
          <div className="space-y-1">
            {AI_AGENTS.map((agent) => {
              const Icon = agentIcons[agent.id] || Brain;
              const keyPresent = hasKey(agent.id);
              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    setSelectedAgent(agent);
                    setSelectedModel(agent.defaultModel || agent.models[0]?.id || '');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                    selectedAgent.id === agent.id
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" style={{ color: selectedAgent.id === agent.id ? agent.color : undefined }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{agent.name}</div>
                  </div>
                  {keyPresent && (
                    <div className="w-2 h-2 rounded-full bg-green-500" title="API-ключ установлен" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedAgent.models.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Модель</h3>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none cursor-pointer"
                >
                  {selectedAgent.models.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
          <p className="mt-4 text-xs text-gray-400 leading-relaxed">{selectedAgent.description}</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
          {showApiInput && (
            <div className="p-4 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">API-ключ {selectedAgent.name}</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Начинается с ${selectedAgent.apiKeyPrefix || '...'}`}
                  className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  Сохранить
                </button>
              </div>
              {selectedAgent.id === 'yandex' && (
                <p className="text-xs text-blue-600 mt-1">Формат: API_KEY|FOLDER_ID</p>
              )}
            </div>
          )}

          {error && !showApiInput && (
            <div className="p-3 bg-red-50 border-b border-red-100">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ягодный эксперт AI</h3>
                <p className="text-gray-500 max-w-sm mb-6">
                  Задавайте вопросы о выращивании клубники. API-ключи автоматически загружаются из .env.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q)}
                      className="text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all text-sm text-gray-600"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-green-500 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Задайте вопрос о клубнике..."
                className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-xl transition-all"
              >
                {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}