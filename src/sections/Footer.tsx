import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const links = [
  { path: '/', label: 'Главная' },
  { path: '/classifier', label: 'Определитель' },
  { path: '/assistant', label: 'ИИ-ассистент' },
  { path: '/knowledge', label: 'База знаний' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">Ягодный Помощник AI</span>
          </div>

          <p className="text-gray-400 max-w-md mb-8">
            ИИ-платформа для ягодных фермеров. Определение сортов, диагностика болезней 
            и профессиональные консультации по выращиванию клубники.
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-800 pt-8">
            <p className="text-gray-500 text-sm">
              © 2025 Ягодный Помощник AI. Все права защищены.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
