import { Link } from 'react-router-dom';
import { Camera, Microscope, Bot, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Определитель сортов',
    description: 'Загрузите фото клубники и узнайте её сорт. ML-модель обучена на 10+ популярных сортах земляники садовой.',
    link: '/classifier',
    color: 'bg-green-50 text-green-600',
    borderColor: 'hover:border-green-300'
  },
  {
    icon: Microscope,
    title: 'Диагностика болезней',
    description: 'Определите болезнь по фото листьев или ягод. Получите рекомендации по лечению и список препаратов.',
    link: '/classifier',
    color: 'bg-red-50 text-red-600',
    borderColor: 'hover:border-red-300'
  },
  {
    icon: Bot,
    title: 'ИИ-ассистент',
    description: 'Задавайте любые вопросы по выращиванию, обработке и уходу. Поддержка Gemini, DeepSeek, YandexGPT и других моделей.',
    link: '/assistant',
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'hover:border-blue-300'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Возможности помощника
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Современные технологии искусственного интеллекта для заботы о вашем урожае
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className={`group relative p-8 rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${feature.borderColor}`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.color} mb-5`}>
                <feature.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-500 leading-relaxed mb-5">
                {feature.description}
              </p>
              
              <div className="inline-flex items-center gap-1 text-sm font-medium text-green-600 group-hover:gap-2 transition-all">
                Попробовать
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
