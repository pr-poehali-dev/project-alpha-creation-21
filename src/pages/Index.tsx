import { useEffect, useState } from "react"
import { Copy, Check } from "lucide-react"

export default function Index() {
  const [showCursor, setShowCursor] = useState(true)
  const [matrixChars, setMatrixChars] = useState<string[]>([])
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentTyping, setCurrentTyping] = useState("")
  const [currentCommand, setCurrentCommand] = useState(0)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [onlineCount, setOnlineCount] = useState<number | null>(null)
  const [maxOnline, setMaxOnline] = useState<number | null>(null)

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const SERVER_ADDRESS = "matreshka.hypixel.ws"

  const terminalSequences = [
    {
      command: `ping ${SERVER_ADDRESS}`,
      outputs: [
        "Подключение к серверу...",
        "Ответ от matreshka.hypixel.ws: 12ms",
        "Пакеты: отправлено=4, получено=4",
        "Сервер онлайн!",
      ],
    },
    {
      command: "status --players",
      outputs: [
        "Получение списка игроков...",
        "Режимы: Survival, Creative, MiniGames",
        "Версия: 1.20.x Java Edition",
        "Сервер работает стабильно!",
      ],
    },
    {
      command: "connect --server matreshka",
      outputs: [
        "Авторизация игрока...",
        "Загрузка мира...",
        "Добро пожаловать на Матрёшку!",
        "Приятной игры!",
      ],
    },
  ]

  const heroAsciiText = `
███╗   ███╗ █████╗ ████████╗███████╗    
████╗ ████║██╔══██╗╚══██╔══╝██╔════╝    
██╔████╔██║███████║   ██║   █████╗      
██║╚██╔╝██║██╔══██║   ██║   ██╔══╝      
██║ ╚═╝ ██║██║  ██║   ██║   ███████╗    
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    
██████╗ ███████╗ ██████╗ ██╗  ██╗ █████╗
██╔══██╗██╔════╝██╔════╝ ██║ ██╔╝██╔══██╗
██████╔╝█████╗  ██║      █████╔╝ ███████║
██╔══██╗██╔══╝  ██║      ██╔═██╗ ██╔══██║
██║  ██║███████╗╚██████╗ ██║  ██╗██║  ██║
╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝`

  useEffect(() => {
    const chars = "MATRESHKA#%@0101ABCDEF█▓▒░".split("")
    const newMatrixChars = Array.from({ length: 100 }, () => chars[Math.floor(Math.random() * chars.length)])
    setMatrixChars(newMatrixChars)
    const interval = setInterval(() => {
      setMatrixChars((prev) => prev.map(() => chars[Math.floor(Math.random() * chars.length)]))
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchOnline = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`)
        const data = await res.json()
        if (data.online) {
          setOnlineCount(data.players?.online ?? 0)
          setMaxOnline(data.players?.max ?? 0)
        } else {
          setOnlineCount(0)
          setMaxOnline(0)
        }
      } catch {
        setOnlineCount(null)
      }
    }
    fetchOnline()
    const interval = setInterval(fetchOnline, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const sequence = terminalSequences[currentCommand]
    const timeouts: ReturnType<typeof setTimeout>[] = []

    setTerminalLines([])
    setCurrentTyping("")

    const command = sequence.command
    for (let i = 0; i <= command.length; i++) {
      timeouts.push(setTimeout(() => setCurrentTyping(command.slice(0, i)), i * 50))
    }
    timeouts.push(
      setTimeout(() => {
        setCurrentTyping("")
        setTerminalLines((prev) => [...prev, `player@matreshka:~$ ${command}`])
      }, command.length * 50 + 400),
    )
    sequence.outputs.forEach((output, index) => {
      timeouts.push(
        setTimeout(
          () => setTerminalLines((prev) => [...prev, output]),
          command.length * 50 + 900 + index * 700,
        ),
      )
    })
    timeouts.push(
      setTimeout(
        () => setCurrentCommand((prev) => (prev + 1) % terminalSequences.length),
        command.length * 50 + 900 + sequence.outputs.length * 700 + 1800,
      ),
    )
    return () => timeouts.forEach(clearTimeout)
  }, [currentCommand])

  return (
    <div className="min-h-screen bg-black text-white font-pixel overflow-hidden relative">
      {/* Navigation */}
      <nav className="border-b border-green-900/50 bg-gray-950/95 backdrop-blur-sm p-4 relative z-10 sticky top-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold text-sm tracking-widest">МАТ&amp;РЕШКА</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 ml-8">
              <a href="#about" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer relative group text-xs tracking-wider">
                <span>О СЕРВЕРЕ</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#modes" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer relative group text-xs tracking-wider">
                <span>РЕЖИМЫ</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="#connect" className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer relative group text-xs tracking-wider">
                <span>ПОДКЛЮЧИТЬСЯ</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></div>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs border border-green-900 px-3 py-1 bg-black">
              <div className={`w-2 h-2 rounded-full ${onlineCount !== null && onlineCount > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
              <span className="text-green-400">
                {onlineCount === null ? "..." : `${onlineCount} онлайн`}
              </span>
            </div>

            <div
              className="group relative cursor-pointer"
              onClick={() => copyToClipboard(SERVER_ADDRESS, "nav-copy")}
            >
              <div className="absolute inset-0 border border-green-900 bg-green-950/20 transition-all duration-300 group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-500/20"></div>
              <div className="relative border border-green-700 bg-transparent text-green-400 font-medium px-4 py-2 text-xs transition-all duration-300 group-hover:border-green-400 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0">
                <div className="flex items-center gap-2">
                  {copiedStates["nav-copy"] ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-green-600" />
                  )}
                  <span>СКОПИРОВАТЬ IP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Matrix Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-25 gap-1 h-full">
          {matrixChars.map((char, i) => (
            <div key={i} className="text-green-500 text-xs animate-pulse">
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* Scan line */}
      <div className="scan-line" style={{ background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)" }}></div>

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:px-12" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-6 overflow-x-auto">
              <pre className="text-green-400 text-xs lg:text-sm font-bold leading-tight inline-block terminal-glow" style={{ textShadow: "0 0 10px rgba(74,222,128,0.8)" }}>{heroAsciiText}</pre>
            </div>

            {/* Online Counter */}
            <div className="mb-8 inline-flex items-center gap-4 border border-green-800 bg-green-950/20 px-8 py-4">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-green-400 font-pixel" style={{ textShadow: "0 0 20px rgba(74,222,128,0.9)" }}>
                  {onlineCount === null ? (
                    <span className="animate-pulse">---</span>
                  ) : (
                    onlineCount
                  )}
                </div>
                <div className="text-xs text-green-700 tracking-widest mt-1">ИГРОКОВ ОНЛАЙН</div>
              </div>
              {maxOnline !== null && maxOnline > 0 && (
                <>
                  <div className="w-px h-12 bg-green-900"></div>
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-gray-500 font-pixel">{maxOnline}</div>
                    <div className="text-xs text-gray-600 tracking-widest mt-1">МАКСИМУМ</div>
                  </div>
                </>
              )}
              <div className="w-px h-12 bg-green-900"></div>
              <div className="text-center">
                <div className={`w-4 h-4 mx-auto rounded-none ${onlineCount !== null && onlineCount > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                <div className="text-xs text-green-700 tracking-widest mt-1">СТАТУС</div>
              </div>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight font-pixel">
              Русский сервер Minecraft<br />
              на базе{" "}
              <span className="text-green-400" style={{ textShadow: "0 0 15px rgba(74,222,128,0.6)" }}>Hypixel</span>
            </h1>

            <p className="text-base text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10 font-pixel text-sm">
              Играй с друзьями, стройся и сражайся. Стабильный сервер с честной игрой и активным сообществом.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div
                className="group relative cursor-pointer w-full sm:w-auto"
                onClick={() => copyToClipboard(SERVER_ADDRESS, "hero-copy")}
              >
                <div className="absolute inset-0 border border-green-700 bg-green-950/20 transition-all duration-300 group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-500/30"></div>
                <div className="relative border border-green-500 bg-green-950/30 text-green-400 font-bold px-8 py-4 text-sm transition-all duration-300 group-hover:bg-green-950/50 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {copiedStates["hero-copy"] ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-green-600" />
                    )}
                    <span className="text-green-700">IP:</span>
                    <span>{SERVER_ADDRESS}</span>
                  </div>
                </div>
              </div>

              <a href="#connect" className="group relative cursor-pointer w-full sm:w-auto">
                <div className="absolute inset-0 border-2 border-dashed border-gray-700 bg-gray-900/20 transition-all duration-300 group-hover:border-gray-400"></div>
                <div className="relative border-2 border-dashed border-gray-500 bg-transparent text-gray-300 font-bold px-8 py-4 text-sm transition-all duration-300 group-hover:border-gray-300 group-hover:bg-gray-900/30 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">-&gt;</span>
                    <span>КАК ЗАЙТИ</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Terminal Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-950 border border-green-900/50 shadow-2xl shadow-green-950/30 backdrop-blur-sm">
              <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-green-900/50">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500"></div>
                    <div className="w-3 h-3 bg-yellow-500"></div>
                    <div className="w-3 h-3 bg-green-500"></div>
                  </div>
                  <span className="text-green-700 text-xs tracking-wider">matreshka-terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-xs">ONLINE</span>
                </div>
              </div>

              <div className="p-6 font-mono text-sm min-h-[200px]">
                {terminalLines.map((line, index) => (
                  <div
                    key={index}
                    className={`mb-1 ${line.startsWith("player@") ? "text-green-400" : line.includes("!") || line.includes("онлайн") || line.includes("Добро") ? "text-green-300" : "text-gray-400"}`}
                  >
                    {line}
                  </div>
                ))}
                <div className="flex items-center gap-2 text-green-400">
                  <span>player@matreshka:~$</span>
                  <span>{currentTyping}</span>
                  <span className={`w-2 h-4 bg-green-400 inline-block ${showCursor ? "opacity-100" : "opacity-0"}`}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Modes Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-green-900/30" id="modes">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 border border-green-900/50 px-4 py-2 mb-6 text-xs text-green-700 tracking-widest">
              <div className="w-2 h-2 bg-green-500"></div>
              ИГРОВЫЕ РЕЖИМЫ
              <div className="w-2 h-2 bg-green-500"></div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold font-pixel">Что тебя ждёт</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "⛏",
                title: "SURVIVAL",
                desc: "Классическое выживание с экономикой, магазинами и кланами. Строй, торгуй, побеждай.",
                tag: "ПОПУЛЯРНО",
              },
              {
                icon: "🏗",
                title: "CREATIVE",
                desc: "Огромные плоты для строительства. Покажи свои лучшие постройки сообществу.",
                tag: "ТВОРЧЕСТВО",
              },
              {
                icon: "⚔",
                title: "MINIGAMES",
                desc: "BedWars, SkyWars, Murder Mystery и другие мини-игры. Соревнуйся с другими.",
                tag: "АКТИВНО",
              },
            ].map((mode, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-black border border-green-900/40 p-6 hover:border-green-500/60 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-green-950/40">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{mode.icon}</span>
                    <span className="text-xs border border-green-900 text-green-700 px-2 py-0.5 tracking-wider">{mode.tag}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-green-400 font-pixel tracking-wider">{mode.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{mode.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 lg:px-12 border-t border-green-900/30 bg-green-950/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "24/7", label: "АПТАЙМ" },
              { value: "1.20", label: "ВЕРСИЯ" },
              { value: "RU", label: "ЯЗЫК" },
              { value: "FREE", label: "ДОСТУП" },
            ].map((stat, i) => (
              <div key={i} className="border border-green-900/40 bg-black p-6 hover:border-green-500/50 transition-colors">
                <div className="text-2xl lg:text-3xl font-bold text-green-400 font-pixel mb-2" style={{ textShadow: "0 0 10px rgba(74,222,128,0.5)" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Connect Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-green-900/30" id="connect">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 border border-green-900/50 px-4 py-2 mb-6 text-xs text-green-700 tracking-widest">
              <div className="w-2 h-2 bg-green-500"></div>
              КАК ЗАЙТИ
              <div className="w-2 h-2 bg-green-500"></div>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 font-pixel">Три шага до игры</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Нужен только лицензионный Minecraft Java Edition. Подключайся за пару минут.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                num: "01",
                title: "Запусти Minecraft",
                desc: "Открой игру Java Edition версии 1.20+",
                cmd: "Minecraft Java Edition",
              },
              {
                num: "02",
                title: "Добавь сервер",
                desc: "Multiplayer → Add Server → вставь IP",
                cmd: SERVER_ADDRESS,
                copyKey: "step2-copy",
              },
              {
                num: "03",
                title: "Заходи!",
                desc: "Нажми Join Server и начинай играть",
                cmd: "PLAY!",
              },
            ].map((step, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-950/10 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-black border border-green-900/40 p-6 flex flex-col justify-between hover:border-green-500/60 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-green-950/40">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 border border-green-900/50 flex items-center justify-center group-hover:border-green-400/50 transition-colors">
                      <span className="text-lg font-mono text-green-700">{step.num}</span>
                    </div>
                    <h3 className="text-sm font-bold mb-3 text-white font-pixel tracking-wide">{step.title}</h3>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed">{step.desc}</p>
                  </div>
                  <div
                    className={`bg-gray-900 border border-green-900/40 p-2.5 font-mono text-xs text-left transition-colors group-hover:border-green-700/50 group-hover:bg-gray-800 ${step.copyKey ? "cursor-pointer" : ""} flex items-center justify-between`}
                    onClick={step.copyKey ? () => copyToClipboard(step.cmd, step.copyKey!) : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-green-700">{">"}</span>
                      <span className="text-green-400">{step.cmd}</span>
                    </div>
                    {step.copyKey && (
                      copiedStates[step.copyKey] ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-gray-600 hover:text-green-400 transition-colors" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Big CTA */}
          <div
            className="group relative cursor-pointer inline-block w-full sm:w-auto"
            onClick={() => copyToClipboard(SERVER_ADDRESS, "cta-copy")}
          >
            <div className="absolute inset-0 border-2 border-green-700 bg-green-900/20 transition-all duration-300 group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-500/30"></div>
            <div className="relative border-2 border-green-500 bg-green-950/40 text-green-400 font-bold px-12 py-5 text-base transition-all duration-300 group-hover:bg-green-950/60 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 text-center font-pixel">
              <div className="flex items-center justify-center gap-3">
                {copiedStates["cta-copy"] ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-green-600" />
                )}
                <span>СКОПИРОВАТЬ IP СЕРВЕРА</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-600 tracking-wider">
            {SERVER_ADDRESS}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-900/30 bg-gray-950/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-bold text-sm tracking-widest font-pixel">МАТ&amp;РЕШКА</span>
            <span className="text-gray-700 text-xs">|</span>
            <span className="text-gray-600 text-xs">{SERVER_ADDRESS}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className={`w-2 h-2 rounded-none ${onlineCount !== null && onlineCount > 0 ? "bg-green-500 animate-pulse" : "bg-gray-600"}`}></div>
            <span>
              {onlineCount === null
                ? "Проверяем статус..."
                : onlineCount > 0
                  ? `${onlineCount} игроков сейчас онлайн`
                  : "Сервер недоступен"}
            </span>
          </div>
          <div className="text-gray-700 text-xs">
            Minecraft не является официальным продуктом Mojang
          </div>
        </div>
      </footer>
    </div>
  )
}
