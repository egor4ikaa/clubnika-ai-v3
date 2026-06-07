import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Sprout, Bug, Pill, Shovel, 
  Search, ChevronDown, CheckCircle2, AlertTriangle, Info
} from 'lucide-react';

type TabType = 'sorts' | 'diseases' | 'preparates' | 'agrotech';

interface SortInfo {
  name: string;
  description: string;
  origin: string;
  maturity: string;
  color_and_shape: string;
  farming: string;
}

interface DiseaseInfo {
  name: string;
  description: string;
  symptoms: string[];
  preparates: string[];
  treatment: string;
  prevention: string;
}

const tabs: { id: TabType; label: string; icon: typeof Sprout }[] = [
  { id: 'sorts', label: 'Сорта клубники', icon: Sprout },
  { id: 'diseases', label: 'Болезни и вредители', icon: Bug },
  { id: 'preparates', label: 'Препараты', icon: Pill },
  { id: 'agrotech', label: 'Агротехника', icon: Shovel }
];

const preparatesData = [
  { name: 'Фитоспорин', type: 'Биофунгицид', usage: 'Гниль, пятнистость, корневая гниль', dose: 'По инструкции', waiting: '0 дней' },
  { name: 'Хом', type: 'Фунгицид', usage: 'Бурая пятнистость, мучнистая роса', dose: '40 г/10л воды', waiting: '20 дней' },
  { name: 'Фундазол', type: 'Системный фунгицид', usage: 'Грибковые заболевания', dose: '10 г/10л воды', waiting: '30 дней' },
  { name: 'Скор', type: 'Фунгицид', usage: 'Пятнистость, ржавчина', dose: '2 мл/10л воды', waiting: '15 дней' },
  { name: 'Ридомил', type: 'Фунгицид', usage: 'Фитофтороз, гниль', dose: '25 г/10л воды', waiting: '20 дней' },
  { name: 'Инта-Вир', type: 'Инсектицид', usage: 'Тля, гусеницы', dose: '1 табл./10л воды', waiting: '7 дней' },
  { name: 'Актара', type: 'Инсектицид', usage: 'Тля, белокрылка, трипсы', dose: '1 г/10л воды', waiting: '14 дней' },
  { name: 'Конфидор', type: 'Инсектицид', usage: 'Колорадский жук, тля', dose: '1 мл/10л воды', waiting: '20 дней' },
  { name: 'Бордоская жидкость', type: 'Фунгицид', usage: 'Пятнистость, гниль', dose: '100 мл/10л воды', waiting: '21 день' },
  { name: 'Медный купорос', type: 'Фунгицид', usage: 'Бактериоз, гниль', dose: '50 г/10л воды', waiting: '14 дней' }
];

const agrotechData = [
  {
    title: 'Весенний уход',
    month: 'Март-май',
    tasks: [
      'Удаление укрытия после схода снега',
      'Очистка грядок от старых листьев',
      'Подкормка азотными удобрениями',
      'Мульчирование почвы',
      'Первые обработки от болезней'
    ]
  },
  {
    title: 'Летний уход',
    month: 'Июнь-август',
    tasks: [
      'Регулярный полив (избегать попадания на листья)',
      'Сбор ягод в сухую погоду',
      'Удаление усов',
      'Подкормка фосфорно-калийными удобрениями',
      'Обработка от вредителей и болезней'
    ]
  },
  {
    title: 'Осенний уход',
    month: 'Сентябрь-ноябрь',
    tasks: [
      'Последняя подкормка калийными удобрениями',
      'Обрезка листьев',
      'Перекопка междурядий',
      'Мульчирование на зиму',
      'Укрытие растений'
    ]
  },
  {
    title: 'Посадка',
    month: 'Август-сентябрь или май',
    tasks: [
      'Выбор солнечного места',
      'Подготовка почвы (перегной, зола)',
      'Расстояние 30-40 см между кустами',
      'Расстояние 60-70 см между рядами',
      'Полив после посадки'
    ]
  }
];

export function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<TabType>('sorts');
  const [search, setSearch] = useState('');
  const [sortsData, setSortsData] = useState<Record<string, SortInfo>>({});
  const [diseasesData, setDiseasesData] = useState<Record<string, DiseaseInfo>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/strawberry_data.json').then(r => r.json()).catch(() => ({})),
      fetch('/data/disease_data.json').then(r => r.json()).catch(() => ({}))
    ]).then(([sData, dData]) => {
      setSortsData(sData);
      setDiseasesData(dData);
    });
  }, []);

  const toggleExpanded = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const filteredSorts = Object.entries(sortsData).filter(([name]) => 
    name.toLowerCase().includes(search.toLowerCase()) ||
    sortsData[name].description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDiseases = Object.entries(diseasesData).filter(([name]) => 
    name.toLowerCase().includes(search.toLowerCase()) ||
    diseasesData[name].description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPreparates = preparatesData.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.usage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">База знаний</h1>
              <p className="text-sm text-gray-500">Справочник по выращиванию клубники</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'sorts' && (
          <div className="space-y-3">
            {filteredSorts.length === 0 && (
              <div className="text-center py-12 text-gray-400">Ничего не найдено</div>
            )}
            {filteredSorts.map(([name, data]) => (
              <div key={name} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleExpanded(name)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Sprout className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-gray-900">{name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedItem === name ? 'rotate-180' : ''}`} />
                </button>
                {expandedItem === name && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg text-sm text-gray-700">{data.description}</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500">Происхождение</div>
                        <div className="text-sm font-medium text-gray-800">{data.origin}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500">Срок созревания</div>
                        <div className="text-sm font-medium text-gray-800">{data.maturity}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500">Цвет и форма</div>
                      <div className="text-sm text-gray-700">{data.color_and_shape}</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="text-xs text-amber-700 font-medium">Выращивание</div>
                      <div className="text-sm text-amber-800 mt-1">{data.farming}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'diseases' && (
          <div className="space-y-3">
            {filteredDiseases.length === 0 && (
              <div className="text-center py-12 text-gray-400">Ничего не найдено</div>
            )}
            {filteredDiseases.map(([name, data]) => (
              <div key={name} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleExpanded(name)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Bug className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-gray-900">{name}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedItem === name ? 'rotate-180' : ''}`} />
                </button>
                {expandedItem === name && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg text-sm text-red-700">{data.description}</div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-500 font-medium mb-2">Симптомы:</div>
                      <div className="flex flex-wrap gap-2">
                        {data.symptoms.map((s, i) => (
                          <span key={i} className="flex items-center gap-1 text-sm text-gray-600">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-xs text-blue-600 font-medium mb-2">Препараты:</div>
                      <div className="flex flex-wrap gap-2">
                        {data.preparates.map((p, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="text-xs text-green-700 font-medium">Лечение:</div>
                      <div className="text-sm text-green-800 mt-1">{data.treatment}</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="text-xs text-amber-700 font-medium">Профилактика:</div>
                      <div className="text-sm text-amber-800 mt-1">{data.prevention}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'preparates' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Препарат</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Тип</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Применение</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Дозировка</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Срок ожидания</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPreparates.map((p, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">{p.type}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.usage}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.dose}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">{p.waiting}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'agrotech' && (
          <div className="space-y-4">
            {agrotechData.map((section, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <Shovel className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{section.title}</h3>
                    <span className="text-xs text-gray-500">{section.month}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {section.tasks.map((task, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Tips */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-800">Полезные советы</h3>
              </div>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• Клубника любит солнце — минимум 6 часов прямых лучей в день</li>
                <li>• Поливайте утром, чтобы листья успели высохнуть к вечеру</li>
                <li>• Не сажайте клубнику после томатов, картофеля и перцев</li>
                <li>• Мульчируйте грядки — это сохранит влагу и защитит от сорняков</li>
                <li>• Обновляйте плантацию каждые 3-4 года для высокой урожайности</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
