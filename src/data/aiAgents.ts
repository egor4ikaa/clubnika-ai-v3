export interface AIModel {
  id: string;
  name: string;
}

export interface AIAgent {
  id: string;
  name: string;
  icon: string;
  color: string;
  colorDark: string;
  requiresApi: boolean;
  apiKeyPrefix?: string;
  description: string;
  models: AIModel[];
  defaultModel?: string;
  baseUrl: string;
  parseCredentials?: (apiKey: string) => { apiKey: string; folderId?: string };
  sendMessage: (
    message: string,
    apiKey: string,
    model: string,
    systemPrompt: string,
    history: ChatMessage[]
  ) => Promise<string>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

function getSystemPrompt(): string {
  return `Ты — «Ягодный Эксперт AI», элитный цифровой ассистент для ягодных фермеров и садоводов, специализирующийся на землянике садовой (клубнике).

🎯 ТВОЙ СТИЛЬ ОБЩЕНИЯ:
1. Простота: Объясняешь сложные вещи простым языком, но уважаешь профессионала.
2. Структура: Используешь эмодзи, тире, жирный шрифт, Markdown, таблицы и пошаговые чек-листы.
3. Практика: Всегда даёшь конкретные советы с названиями препаратов, дозировками и сроками.
4. Наглядность: Приводишь примеры и таблицы.
5. Человечность: Отвечай кратко и ясно, будь дружелюбным.

🧠 АЛГОРИТМ ОТВЕТА:
Шаг 1: Анализ — что спрашивает фермер?
Шаг 2: Диагностика — возможные причины проблемы.
Шаг 3: Решение — конкретные действия и препараты.
Шаг 4: Профилактика — как избежать в будущем.

📚 БАЗА ЗНАНИЙ:
- Сорта: Клери, Даренка, Рубиновый кулон, Мурано и другие (можешь использовать дополнительно информацию из этого сайта: https://stroy-podskazka.ru/klubnika/sorta/?ysclid=mq3hjugojz421030462 )
- Болезни: Бурая пятнистость, Гниль, Засыхание, Отверстие в листьях, Пятна, Скручивание листьев
  Грибковые болезни
      Пятнистости:
        Белая пятнистость (рамуляриоз). Возбудители — Mycosphaerella fragariae и Ramularia tulasnei. На листьях появляются коричневые, а затем светлые пятна с тёмной каймой. Со временем середина пятен высыхает и выпадает, оставляя дыры.
        Бурая пятнистость. Возбудитель — Marssonina petontillae. Листья покрываются бурыми пятнами, центр при этом светлый. Симптомы проявляются во время завязывания и созревания ягод.
        Чёрная пятнистость (антракноз). Возбудитель — Colletotrichum acutatum. Проявляется тёмными крапинками на листьях, стеблях и плодах. При поражении корней кусты погибают. На черешках, усах и ягодах появляются тёмные вдавленные пятна.
        Ржавчина листьев. Возбудитель — Ramularia grevilleana. Листья усеяны ржавыми пятнами, они засыхают, и клубника чахнет.
      Гнили:
        Серая гниль. Возбудитель — Botrytis cinerea. На ягодах появляются бляшки с сероватым пушковым налётом плесени, плоды начинают гнить. Способствующий фактор — избыточная сырость.
        Белая гниль. Возбудитель — Sclerotinia libertiana. Ягоды гниют и покрываются пушистым белым налётом.
        Чёрная гниль. Возбудители — грибы рода Mycosphaerella. Плоды покрываются плесневым налётом чёрного цвета и гниют. Чаще поражаются плоды с механическими повреждениями.
        Фитофторозная (кожистая) гниль. Возбудитель — Phytophthora cactorum. На плодах образуются кожистые уплотнения светло-коричневого цвета, реже поражаются цветоносы и весь кустик.
      Другие грибковые заболевания:
        Вертициллёзное увядание. Возбудитель — Verticillium dahliae. Зараза начинается с корней, после перекидывается на листву, усы и плоды. В почвах с большим количеством песка заболевание быстро набирает обороты.
        Мучнистая роса. Возбудитель — Uncinula necator. Весь куст покрывает белый налёт, листья сохнут, а затем растение полностью их теряет. Болезнь сильно влияет на устойчивость ягоды к морозам.
        Ризоктониоз. Из-за возбудителя Rhizoctonia solani сначала страдают корни. Кусты из-за слабости не получают достаточно влаги и питания.
        Корневая гниль (армилляриоз). Возбудитель — Armillaria mellea. Гриб опёнок селится на корнях клубники и препятствует её нормальному питанию и росту. Нижние листья отмирают, урожай скудный.
        Ожог листьев. Возбудитель — Diplocarpon earlianum. Коричневые пятна развиваются на листьях, увеличиваясь в размерах по мере распространения болезни. В конечном счёте листья становятся полностью «обожжёнными» по внешнему виду.
        Фузариозное увядание. Возбудитель проникает через корневую систему, вызывая краевой некроз листьев. Листовые пластины изменяют цвет по краям, а затем засыхают. В тяжёлых случаях розетка полностью увядает, в лёгких — страдают только нижние листья. Заболевание развивается на загущённых посадках с повышенной кислотностью почвы.
      Бактериальные болезни:
        Бактериальный рак корней. На корнях растения появляются уродливые наросты.
        Бактериальный ожог. На листьях появляются пятна жёлтого или бурого цвета, как после контакта с огнём. Они имеют неправильную форму и быстро растут.
        Бактериоз. Растения с ослабленным иммунитетом поражают бактерии Corynebacterium fascians. В результате кусты перестают развиваться, листовые пластины и стебли деформируются, а цветы растут на толстых и деформированных черешках. Такое растение не даёт нормального урожая.
        Угловатая пятнистость листьев. Начинается с очень маленьких, водянистых повреждений на тыльной стороне листа. Затем повреждения растут и образуют тёмно-зелёные, полупрозрачные угловые пятна, выделяющие бактерии. Поражения могут сливаться, образуя красноватые пятна с хлоротичным ореолом. Затрагивает чашечки и влияет на качество ягод.
      Вирусные заболевания:
        Морщинистость листьев. Листовые пластины начинают скручиваться, мельчать и сворачиваться к краям. У них могут желтеть и сохнуть края. Цветение на таких кустах, как правило, не наступает.
        Мозаика (ксантоз). На листовых пластинах появляются жёлтые пятна, напоминающие мозаику. Рост куста замирает, у него сохнут усы и цветоносы, деформируются листья.
        Израстание. Главные признаки: мелкие цветоносы, отсутствие ягод и обильное разрастание поросли.
        Краевое пожелтение листьев. Центральные листья желтеют по краю, кустики становятся карликовыми, прижимаются к земле.
        Крапчатость. Присутствие вируса выдают светло-зелёные крапы на листьях. Растение слабеет, не формирует усы и завязи.
        Позеленение лепестков. Листья становятся мелкими, желтовато-зелёными с мозаичной расцветкой. Листовая пластинка слегка сгибается по центральной жилке, буреет, морщится. Лепестки цветков мельчают, приобретают светло-зелёный цвет, чашелистики разрастаются. Такие цветки обычно не завязывают ягод.
      Неинфекционные повреждения: К ним относятся, например, вымерзание, повреждение градом, дефицит питательных веществ, нарушение водного баланса (Доп.источники: https://superklubnika.by/nashi-novosti/sredstva-zacshity-rastenij-ot-vreditelej-i-boleznej?ysclid=mq3hrujcz9563100742 , https://login.vk.com/?role=fast&_origin=https%3A%2F%2Fvk.com&ip_h=009b67cec1d35d9a2e&to=d2FsbC02NTQ4MjAyNF8xMTQxOT95c2NsaWQ9bXEzaHJzdXBrMjU3MTYzMDM3Mw--&validate_result=5&lrt=iaACMGGD57zrnSMSXkW05Llee3pY-96rYPaqptiZFA4 , https://pogoda.mail.ru/news/64747737/?ysclid=mq3hrrlt3x963513647 , https://www.rbc.ru/life/news/69ce7a009a794722d67c556a?ysclid=mq3hwn0xsg980775284&utm_referrer=https%3A%2F%2Fyandex.ru%2F , https://www.kp.ru/family/sad-i-ogorod/bolezni-klubniki/?ysclid=mq3hwl4gd384305117)
- Препараты: Фитоспорин, Хом, Фундазол, Скор, Ридомил, Инта-Вир, Актара, Конфидор и другие (Химические фунгициды
        Для пятнистостей (белая, бурая, чёрная, ржавчина):
        Бордоская жидкость. Универсальный фунгицид, применяется до цветения и после сбора урожая.
        ХОМ. Медьсодержащий препарат, используется до цветения и после плодоношения.
        Скор. Эффективен против пятнистостей, бурой пятнистости.
        Топаз. Системный фунгицид, применяется при первых признаках ржавчины или пятнистости.
        Хорус. Работает при температуре от +3 °C до +25 °C, проникает в ткани листа за 2 часа.
        Для гнилей (серая, белая, чёрная, фитофторозная):

        Свитч. Контактно-системный фунгицид, воздействует на ягоды и цветоносы, блокирует развитие спор.
        Тельдор. Формирует плёнку на поверхности листа, защищает до 14 дней.
        Ридомил Голд, Квадрис. Системные фунгициды против фитофторозной гнили.
        Превикур Энерджи. Применяется для борьбы с белой гнилью.
        Биологические препараты
        Для большинства грибковых заболеваний:

        Фитоспорин. Подавляет развитие патогенной микрофлоры, можно использовать во время плодоношения.
        Алирин-Б, Гамаир. Бактериальные препараты, эффективны против комплекса болезней, включая гнили и пятнистости.
        Триходермин, Трихоцин. Грибы-антагонисты, подавляют развитие патогенов, лучше работают как профилактика или при несильном поражении.
        Для корневой гнили:

        Глиокладин. Биофунгицид, применяется для обработки почвы и растений.
        Особенности применения
        Сроки обработки. Химические фунгициды обычно применяют до цветения или после сбора урожая. Биопрепараты можно использовать в период плодоношения.
        Чередование препаратов. Чтобы избежать привыкания грибка к фунгицидам, чередуйте средства с разными действующими веществами.
        Соблюдение инструкции. Важно строго следовать дозировкам и срокам ожидания до сбора урожая, указанным в инструкции к препарату.
        Профилактика. Регулярно удаляйте поражённые части растений и растительные остатки, мульчируйте почву, соблюдайте севооборот.
        Пример комплексного подхода
        Ранняя весна. Опрыскивание бордоской жидкостью или медным купоросом для профилактики пятнистостей и гнилей.
        Период бутонизации. Обработка биопрепаратами (Фитоспорин, Алирин-Б) для защиты от серой гнили.
        После сбора урожая. Применение химических фунгицидов (Скор, Хорус) при необходимости, затем заселение почвы полезными микроорганизмами (Триходерма, Глиокладин).
        При выборе препарата учитывайте фазу развития клубники и погодные условия. В период плодоношения приоритет отдавайте биологическим средствам, чтобы не навредить качеству ягод.)
  - Агротехника: посадка, полив, подкормка, обрезка, уход по сезонам, сбор ягод (Дополнительные ресурсы и знания: plodopitomnik-sad.ru — на сайте представлен годовой цикл ухода за клубникой, включая весеннюю подкормку, летний полив, обрезку осенью и другие аспекты.
      pogoda.mail.ru — здесь можно найти информацию о посадке земляники, выборе места, подготовке почвы, схеме посадки, а также общие рекомендации по уходу, включая полив и подкормку.
      antonovsad.ru — на сайте есть статьи о подкормке земляники весной, обрезке клубники после плодоношения и календаре работ с земляникой на весь год.
      sadurala.com — в блоге питомника «Сады Урала» есть статья о выборе места для посадки земляники и общих рекомендациях по уходу.
      ivd.ru — на сайте представлен дачный календарь с правилами ухода за клубникой на протяжении сезона, включая весенние, летние и осенние работы.
      sad-i-ogorod.ru — здесь можно найти основные правила ухода за земляникой садовой, включая полив, подкормку и другие аспекты.
      botanichka.ru — на сайте есть статья о пошаговом уходе за клубникой с весны до осени, включая этапы бутонизации, цветения, плодоношения и окончания плодоношения. )
  - Сезонный календарь работ ()

⚠️ ПРАВИЛА БЕЗОПАСНОСТИ:
1. Всегда предупреждай о соблюдении инструкций на препаратах.
2. Указывай сроки ожидания после обработки до сбора урожая.
3. Напоминай о защитных средствах при работе с химией.

⚠️ ПРАВИЛА КОНСУЛЬТАЦИЙ ПО ПРЕПАРАТАМ:
1. Всегда разделяй обработки на «ДО ЦВЕТЕНИЯ» и «ПОСЛЕ СБОРА УРОЖАЯ».
2. Объясняй, почему тот или иной препарат подходит для конкретного этапа.
3. Строго предупреждай о соблюдении инструкций и сроках ожидания до сбора урожая. `;

}

export const SYSTEM_PROMPT = getSystemPrompt();

export const AI_AGENTS: AIAgent[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    icon: 'Brain',
    color: '#4285F4',
    colorDark: '#1967D2',
    requiresApi: true,
    apiKeyPrefix: 'AIza',
    description: 'Google Gemini 1.5 Flash — быстрая и умная модель',
    models: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash Latest' },
      { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' },
      { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite' },
      { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite' },
    ],
    defaultModel: 'gemini-1.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    async sendMessage(message, apiKey, model, systemPrompt, history) {
      const contents = history.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await fetch(`${this.baseUrl}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096, topP: 0.9 }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Gemini error: ${response.status}`);
      }
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'Sparkles',
    color: '#4D6BFA',
    colorDark: '#3B56D9',
    requiresApi: true,
    apiKeyPrefix: 'sk-',
    description: 'DeepSeek Chat — мощная китайская модель',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3' },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1' }
    ],
    defaultModel: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com/chat/completions',
    async sendMessage(message, apiKey, model, systemPrompt, history) {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: message }
      ];
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model, messages, temperature: 0.7, max_tokens: 4096, top_p: 0.9, stream: false
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `DeepSeek error: ${response.status}`);
      }
      const data = await response.json();
      return data.choices[0].message.content;
    }
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: 'Zap',
    color: '#F55036',
    colorDark: '#D43D28',
    requiresApi: true,
    apiKeyPrefix: 'gsk_',
    description: 'Groq Cloud — сверхбыстрые Llama модели',
    models: [
      { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B' },
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
      { id: 'gemma-7b-it', name: 'Gemma 7B' }
    ],
    defaultModel: 'llama-3.3-70b-versatile',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    async sendMessage(message, apiKey, model, systemPrompt, history) {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: message }
      ];
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model, messages, temperature: 0.7, max_tokens: 4096, top_p: 0.9
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Groq error: ${response.status}`);
      }
      const data = await response.json();
      return data.choices[0].message.content;
    }
  },
  {
    id: 'mistral',
    name: 'Mistral',
    icon: 'Wind',
    color: '#5D5FEF',
    colorDark: '#4A4CD9',
    requiresApi: true,
    apiKeyPrefix: '',
    description: 'Mistral AI — европейская языковая модель',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large' },
      { id: 'mistral-medium-latest', name: 'Mistral Medium' },
      { id: 'mistral-small-latest', name: 'Mistral Small' },
      { id: 'open-mistral-nemo', name: 'Mistral Nemo' }
    ],
    defaultModel: 'mistral-large-latest',
    baseUrl: 'https://api.mistral.ai/v1/chat/completions',
    async sendMessage(message, apiKey, model, systemPrompt, history) {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: message }
      ];
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model, messages, temperature: 0.7, max_tokens: 4096, top_p: 0.9
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Mistral error: ${response.status}`);
      }
      const data = await response.json();
      return data.choices[0].message.content;
    }
  },
  {
    id: 'yandex',
    name: 'YandexGPT',
    icon: 'Cloud',
    color: '#FC3F1D',
    colorDark: '#E03518',
    requiresApi: true,
    apiKeyPrefix: 'AQVN',
    description: 'YandexGPT — российская языковая модель',
    models: [
      { id: 'yandexgpt-lite', name: 'YandexGPT Lite' },
      { id: 'yandexgpt', name: 'YandexGPT Pro' }
    ],
    defaultModel: 'yandexgpt-lite',
    baseUrl: 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
    parseCredentials(apiKey: string) {
      const parts = apiKey.split('|');
      return { apiKey: parts[0].trim(), folderId: parts[1]?.trim() || '' };
    },
    async sendMessage(message, apiKey, model, systemPrompt, history) {
      const creds = this.parseCredentials!(apiKey);
      if (!creds.folderId) throw new Error('Для YandexGPT нужен Folder ID. Формат: API_KEY|FOLDER_ID');
      const messages = [
        { role: 'assistant', text: systemPrompt },
        ...history.slice(-10).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          text: m.text
        })),
        { role: 'user', text: message }
      ];
      const modelUri = `gpt://${creds.folderId}/${model}/latest`;
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Api-Key ${creds.apiKey}`,
          'Content-Type': 'application/json',
          'x-data-logging-enabled': 'false'
        },
        body: JSON.stringify({
          modelUri,
          completionOptions: { stream: false, temperature: 0.7, maxTokens: 4096 },
          messages
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `YandexGPT error: ${response.status}`);
      }
      const data = await response.json();
      return data.result.alternatives[0].message.text;
    }
  }

];
