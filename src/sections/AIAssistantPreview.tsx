import { Link } from 'react-router-dom';
import { Brain, Sparkles, Zap, Wind, Cloud, ArrowRight } from 'lucide-react';

const providers = [
  { icon: Brain, name: 'Gemini', color: 'text-blue-500' },
  { icon: Sparkles, name: 'DeepSeek', color: 'text-indigo-500' },
  { icon: Zap, name: 'Groq', color: 'text-orange-500' },
  { icon: Wind, name: 'Mistral', color: 'text-purple-500' },
  { icon: Cloud, name: 'YandexGPT', color: 'text-red-500' },
];

export function AIAssistantPreview() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ваш личный
              <br />
              <span className="text-green-200">ИИ-советник</span>
            </h2>
            
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Подключите API-ключ выбранного провайдера и получите доступ 
              к мощным языковым моделям. Задавайте вопросы по выращиванию, 
              обработке от болезней, подбору препаратов — получайте 
              профессиональные ответы 24/7.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {providers.map((provider, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                >
                  <provider.icon className={`w-4 h-4 ${provider.color}`} />
                  <span className="text-white text-sm font-medium">{provider.name}</span>
                </div>
              ))}
            </div>

            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-xl"
            >
              Перейти к ИИ-ассистенту
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Robot Image */}
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-75" />
              <img
                src="/images/ai-assistant.png"
                alt="AI Assistant"
                className="relative w-80 h-80 object-contain drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
