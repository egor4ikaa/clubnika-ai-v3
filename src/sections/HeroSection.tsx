import { Link } from 'react-router-dom';
import { Camera, MessageCircle, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-strawberry.jpg)' }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/90 text-sm">AI + ML для ягодных фермеров</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Умный помощник
          <br />
          <span className="text-green-400">ягодного фермера</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Искусственный интеллект и машинное обучение для определения сортов, 
          диагностики болезней и профессиональных консультаций по выращиванию клубники
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            to="/classifier"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
          >
            <Camera className="w-5 h-5" />
            Определить сорт
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/assistant"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            Задать вопрос ИИ
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">10+</div>
            <div className="text-xs sm:text-sm text-white/60 mt-1">сортов клубники</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">6</div>
            <div className="text-xs sm:text-sm text-white/60 mt-1">болезней в базе</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">24/7</div>
            <div className="text-xs sm:text-sm text-white/60 mt-1">ИИ-помощник</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
