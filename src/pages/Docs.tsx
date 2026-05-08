import { useState } from "react"
import { Copy, Check, Menu, X, ChevronRight, Terminal, Zap, Settings, Book, Code, Rocket } from "lucide-react"
import { Link } from "react-router-dom"

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const sidebarSections = [
    {
      title: "Начало работы",
      id: "getting-started",
      icon: Rocket,
      items: [
        { title: "Установка", id: "installation" },
        { title: "Быстрый старт", id: "quick-start" },
        { title: "Конфигурация", id: "configuration" },
      ],
    },
    {
      title: "Команды",
      id: "commands",
      icon: Terminal,
      items: [
        { title: "flux init", id: "init" },
        { title: "flux generate", id: "generate" },
        { title: "flux review", id: "review" },
        { title: "flux deploy", id: "deploy" },
      ],
    },
    {
      title: "AI-модели",
      id: "models",
      icon: Zap,
      items: [
        { title: "Выбор модели", id: "model-selection" },
        { title: "Свои модели", id: "custom-models" },
        { title: "Настройка моделей", id: "model-config" },
      ],
    },
    {
      title: "Интеграции",
      id: "integrations",
      icon: Settings,
      items: [
        { title: "Настройка IDE", id: "ide-setup" },
        { title: "CI/CD интеграция", id: "cicd" },
        { title: "Свои агенты", id: "custom-agents" },
      ],
    },
    {
      title: "Справочник API",
      id: "api",
      icon: Code,
      items: [
        { title: "CLI API", id: "cli-api" },
        { title: "Configuration API", id: "config-api" },
        { title: "Plugin API", id: "plugin-api" },
      ],
    },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Начало работы с FLUX CLI</h1>
              <p className="text-xl text-gray-400 mb-8">
                FLUX CLI - это AI-инструмент для разработки, который помогает деплоить быстрее прямо из терминала.
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 border border-gray-600 flex items-center justify-center">
                  <span className="text-sm font-mono text-white">01</span>
                </div>
                Установка
              </h2>
              <p className="text-gray-400 mb-4">Установите FLUX CLI глобально через npm:</p>
              <div
                className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                onClick={() => copyToClipboard("npm install -g flux", "install-cmd")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <span className="text-white">npm install -g flux</span>
                </div>
                {copiedStates["install-cmd"] ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                )}
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 border border-gray-600 flex items-center justify-center">
                  <span className="text-sm font-mono text-white">02</span>
                </div>
                Быстрый старт
              </h2>
              <p className="text-gray-400 mb-4">Создайте свой первый AI-проект:</p>
              <div className="space-y-3">
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("flux init my-project", "init-cmd")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">flux init my-project</span>
                  </div>
                  {copiedStates["init-cmd"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("cd my-project", "cd-cmd")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">cd my-project</span>
                  </div>
                  {copiedStates["cd-cmd"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() =>
                    copyToClipboard("flux generate --model gpt-5 'Create a React component'", "generate-cmd")
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">flux generate --model gpt-5 "Создать React-компонент"</span>
                  </div>
                  {copiedStates["generate-cmd"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-900 border border-gray-600 flex items-center justify-center">
                  <span className="text-sm font-mono text-white">03</span>
                </div>
                Что дальше?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div
                  className="border border-gray-700 p-4 hover:border-gray-500 transition-colors cursor-pointer"
                  onClick={() => setActiveSection("configuration")}
                >
                  <h3 className="text-white font-bold mb-2">Настроить AI-модели</h3>
                  <p className="text-gray-400 text-sm">Выберите предпочитаемые модели и настройте параметры</p>
                </div>
                <div
                  className="border border-gray-700 p-4 hover:border-gray-500 transition-colors cursor-pointer"
                  onClick={() => setActiveSection("ide-setup")}
                >
                  <h3 className="text-white font-bold mb-2">Интеграция с IDE</h3>
                  <p className="text-gray-400 text-sm">Подключите FLUX CLI к вашей среде разработки</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "installation":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Установка</h1>
              <p className="text-xl text-gray-400 mb-8">Несколько способов установить FLUX CLI на вашу систему.</p>
            </div>

            <div className="grid gap-6">
              <div className="bg-gray-950 border border-gray-800 p-6">
                <h3 className="text-xl font-bold mb-3 text-white">NPM (рекомендуется)</h3>
                <p className="text-gray-400 mb-4">Установите глобально для доступа из любой директории:</p>
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("npm install -g flux", "npm-install")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">npm install -g flux</span>
                  </div>
                  {copiedStates["npm-install"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              <div className="bg-gray-950 border border-gray-800 p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Yarn</h3>
                <p className="text-gray-400 mb-4">Альтернативная установка через Yarn:</p>
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("yarn global add flux", "yarn-install")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">yarn global add flux</span>
                  </div>
                  {copiedStates["yarn-install"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              <div className="bg-gray-950 border border-gray-800 p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Прямая загрузка</h3>
                <p className="text-gray-400 mb-4">Скачайте готовые бинарники для вашей платформы:</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black border border-gray-700 hover:border-gray-500 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 w-20">macOS:</span>
                      <code className="text-white">flux-darwin-x64</code>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors text-sm">Скачать</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black border border-gray-700 hover:border-gray-500 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 w-20">Linux:</span>
                      <code className="text-white">flux-linux-x64</code>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors text-sm">Скачать</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black border border-gray-700 hover:border-gray-500 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 w-20">Windows:</span>
                      <code className="text-white">flux-win-x64.exe</code>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors text-sm">Скачать</button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-950 border border-gray-800 p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Проверка</h3>
                <p className="text-gray-400 mb-4">Проверьте установку:</p>
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("flux --version", "version-check")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">flux --version</span>
                  </div>
                  {copiedStates["version-check"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case "configuration":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Конфигурация</h1>
              <p className="text-xl text-gray-400 mb-8">Настройте FLUX CLI под свой рабочий процесс.</p>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Глобальные настройки</h2>
              <p className="text-gray-400 mb-4">Задайте глобальные параметры:</p>
              <div className="space-y-3">
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("flux config set model gpt-5", "config-model")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">flux config set model gpt-5</span>
                  </div>
                  {copiedStates["config-model"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("flux config set auto-review true", "config-review")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">flux config set auto-review true</span>
                  </div>
                  {copiedStates["config-review"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Конфигурация проекта</h2>
              <p className="text-gray-400 mb-4">
                Создайте файл <code className="text-white bg-black px-2 py-1">flux.config.json</code> в корне проекта:
              </p>
              <div className="bg-black border border-gray-700 p-4 font-mono text-sm">
                <pre className="text-gray-300">{`{
  "model": "claude-4-sonnet",
  "rules": [
    "Использовать TypeScript для новых файлов",
    "Следовать best practices React",
    "Добавлять обработку ошибок"
  ],
  "integrations": {
    "ide": "vscode",
    "ci": "github-actions"
  },
  "agents": {
    "reviewer": {
      "model": "claude-4",
      "focus": ["security", "performance"]
    }
  }
}`}</pre>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h2 className="text-2xl font-bold mb-4 text-white">Переменные окружения</h2>
              <div className="space-y-4">
                <div className="border-l-2 border-gray-700 pl-4">
                  <code className="text-white">FLUX_API_KEY</code>
                  <p className="text-gray-400 mt-1">Ваш API-ключ FLUX CLI для премиум-функций</p>
                </div>
                <div className="border-l-2 border-gray-700 pl-4">
                  <code className="text-white">FLUX_MODEL</code>
                  <p className="text-gray-400 mt-1">AI-модель по умолчанию (переопределяет конфиг)</p>
                </div>
                <div className="border-l-2 border-gray-700 pl-4">
                  <code className="text-white">FLUX_DEBUG</code>
                  <p className="text-gray-400 mt-1">Включить отладочные логи (true/false)</p>
                </div>
              </div>
            </div>
          </div>
        )

      case "generate":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">flux generate</h1>
              <p className="text-xl text-gray-400 mb-8">
                Генерируйте код, компоненты и целые фичи с помощью AI-моделей.
              </p>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3 text-white">Базовое использование</h3>
              <div
                className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between mb-4"
                onClick={() => copyToClipboard("flux generate [prompt]", "basic-generate")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <span className="text-white">flux generate [prompt]</span>
                </div>
                {copiedStates["basic-generate"] ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                )}
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3 text-white">Опции</h3>
              <div className="space-y-4">
                <div className="border-l-2 border-gray-700 pl-4">
                  <code className="text-white">--model, -m</code>
                  <p className="text-gray-400 mt-1">Указать AI-модель (gpt-5, claude-4, gemini-2.5)</p>
                </div>
                <div className="border-l-2 border-gray-700 pl-4">
                  <code className="text-white">--context, -c</code>
                  <p className="text-gray-400 mt-1">Включить контекст проекта (full, minimal, none)</p>
                </div>
                <div className="border-l-2 border-gray-700 pl-4">
                  <code className="text-white">--output, -o</code>
                  <p className="text-gray-400 mt-1">Указать выходной файл или директорию</p>
                </div>
                <div className="border-l-2 border-gray-700 pl-4">
                  <code className="text-white">--interactive, -i</code>
                  <p className="text-gray-400 mt-1">Интерактивный режим для уточнений</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3 text-white">Примеры</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 mb-2">Создать React-компонент:</p>
                  <div
                    className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                    onClick={() =>
                      copyToClipboard(
                        "flux generate 'Создать адаптивный navbar с переключением темы'",
                        "example-navbar",
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <span className="text-white">
                        flux generate "Создать адаптивный navbar с переключением темы"
                      </span>
                    </div>
                    {copiedStates["example-navbar"] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Создать API-эндпоинты:</p>
                  <div
                    className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                    onClick={() =>
                      copyToClipboard(
                        "flux generate --model claude-4 'Создать REST API для пользователей с авторизацией'",
                        "example-api",
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <span className="text-white">
                        flux generate --model claude-4 "Создать REST API для пользователей с авторизацией"
                      </span>
                    </div>
                    {copiedStates["example-api"] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "model-selection":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Выбор модели</h1>
              <p className="text-xl text-gray-400 mb-8">Выбирайте и настраивайте AI-модели для разных задач.</p>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3 text-white">Доступные модели</h3>
              <div className="space-y-4">
                <div className="border border-gray-700 p-4 hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold">GPT-5 (OpenAI)</h4>
                    <span className="text-green-400 text-sm">* Активна</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    Новейшая модель OpenAI с улучшенным рассуждением и генерацией кода
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Генерация кода</span>
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Рассуждение</span>
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Быстрая</span>
                  </div>
                </div>
                <div className="border border-gray-700 p-4 hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold">Claude-4 Sonnet (Anthropic)</h4>
                    <span className="text-green-400 text-sm">* Активна</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Отлично подходит для код-ревью и сложного анализа</p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Код-ревью</span>
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Анализ</span>
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Детальная</span>
                  </div>
                </div>
                <div className="border border-gray-700 p-4 hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold">Gemini-2.5 Pro (Google)</h4>
                    <span className="text-green-400 text-sm">* Активна</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    Идеальна для мультимодальных задач и работы с большим контекстом
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Мультимодальная</span>
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Большой контекст</span>
                    <span className="bg-gray-800 text-gray-300 px-2 py-1">Универсальная</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-950 border border-gray-800 p-6">
              <h3 className="text-xl font-bold mb-3 text-white">Команды для работы с моделями</h3>
              <div className="space-y-3">
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("flux model list", "model-list")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">flux model list</span>
                  </div>
                  {copiedStates["model-list"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("flux model set gpt-5", "model-set")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">flux model set gpt-5</span>
                  </div>
                  {copiedStates["model-set"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case "ide-setup":
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Настройка IDE</h1>
              <p className="text-xl text-gray-400 mb-8">Интегрируйте FLUX CLI с вашей средой разработки.</p>
            </div>

            <div className="grid gap-6">
              <div className="bg-gray-950 border border-gray-800 p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Интеграция с VS Code</h3>
                <p className="text-gray-400 mb-4">Установите расширение FLUX CLI для VS Code:</p>
                <div className="space-y-3">
                  <div
                    className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                    onClick={() =>
                      copyToClipboard("code --install-extension flux.vscode-extension", "vscode-install")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <span className="text-white">code --install-extension flux.vscode-extension</span>
                    </div>
                    {copiedStates["vscode-install"] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>Возможности:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Генерация кода прямо в редакторе</li>
                      <li>AI-автодополнение</li>
                      <li>Встроенные терминальные команды</li>
                      <li>Код-ревью в реальном времени</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-950 border border-gray-800 p-6">
                <h3 className="text-xl font-bold mb-3 text-white">JetBrains IDE</h3>
                <p className="text-gray-400 mb-4">Совместимо с IntelliJ IDEA, WebStorm, PyCharm и другими:</p>
                <div
                  className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                  onClick={() => copyToClipboard("flux ide setup jetbrains", "jetbrains-setup")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <span className="text-white">flux ide setup jetbrains</span>
                  </div>
                  {copiedStates["jetbrains-setup"] ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  )}
                </div>
              </div>

              <div className="bg-gray-950 border border-gray-800 p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Терминальная интеграция</h3>
                <p className="text-gray-400 mb-4">Добавьте автодополнение и алиасы для shell:</p>
                <div className="space-y-3">
                  <div
                    className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                    onClick={() => copyToClipboard("flux completion bash >> ~/.bashrc", "bash-completion")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <span className="text-white">flux completion bash {">"} ~/.bashrc</span>
                    </div>
                    {copiedStates["bash-completion"] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </div>
                  <div
                    className="bg-black border border-gray-700 p-4 font-mono text-sm cursor-pointer hover:border-gray-500 transition-colors flex items-center justify-between"
                    onClick={() => copyToClipboard("flux completion zsh >> ~/.zshrc", "zsh-completion")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <span className="text-white">flux completion zsh {">"} ~/.zshrc</span>
                    </div>
                    {copiedStates["zsh-completion"] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Документация</h1>
              <p className="text-xl text-gray-400 mb-8">Выберите раздел в боковом меню для начала работы.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className="bg-gray-950 border border-gray-800 p-6 hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => setActiveSection("getting-started")}
              >
                <Rocket className="w-8 h-8 text-white mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Начало работы</h3>
                <p className="text-gray-400">Быстрая установка и настройка</p>
              </div>
              <div
                className="bg-gray-950 border border-gray-800 p-6 hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => setActiveSection("commands")}
              >
                <Terminal className="w-8 h-8 text-white mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Команды</h3>
                <p className="text-gray-400">Полный справочник CLI-команд</p>
              </div>
              <div
                className="bg-gray-950 border border-gray-800 p-6 hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => setActiveSection("models")}
              >
                <Zap className="w-8 h-8 text-white mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">AI-модели</h3>
                <p className="text-gray-400">Настройка и использование AI-моделей</p>
              </div>
              <div
                className="bg-gray-950 border border-gray-800 p-6 hover:border-gray-600 transition-colors cursor-pointer"
                onClick={() => setActiveSection("integrations")}
              >
                <Settings className="w-8 h-8 text-white mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Интеграции</h3>
                <p className="text-gray-400">Настройка IDE и рабочих процессов</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <nav className="border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm p-4 relative z-50 sticky top-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <div className="w-3 h-3 bg-yellow-500"></div>
                <div className="w-3 h-3 bg-green-500"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">FLUX</span>
                <span className="text-gray-400 text-sm">CLI</span>
              </div>
            </Link>
            <div className="text-gray-500 text-sm">/ Документация</div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-gray-950 border-r border-gray-800 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <Book className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Документация</h2>
            </div>

            <nav className="space-y-6">
              {sidebarSections.map((section) => (
                <div key={section.id}>
                  <div
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-700 hover:bg-gray-900 ${
                      activeSection === section.id ? "bg-gray-900 border-gray-600" : ""
                    }`}
                    onClick={() => {
                      setActiveSection(section.id)
                      setSidebarOpen(false)
                    }}
                  >
                    <section.icon className="w-5 h-5 text-gray-400" />
                    <span className="text-white font-medium">{section.title}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                  </div>

                  <div className="ml-8 mt-2 space-y-1">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2 cursor-pointer text-sm transition-all duration-200 border border-transparent hover:border-gray-700 hover:bg-gray-900 ${
                          activeSection === item.id ? "bg-gray-900 border-gray-600 text-white" : "text-gray-400"
                        }`}
                        onClick={() => {
                          setActiveSection(item.id)
                          setSidebarOpen(false)
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto p-6 lg:p-12">{renderContent()}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
