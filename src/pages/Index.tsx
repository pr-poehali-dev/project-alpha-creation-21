import { useEffect, useState, useRef } from "react"
import { Copy, Check, ArrowUp } from "lucide-react"

const MATRYOSHKA_IMG = "https://cdn.poehali.dev/projects/b964269c-dfc0-4015-8416-62c45be9b32e/files/a42cdd79-0086-4cb2-95d6-e6c801f1d859.jpg"
const SERVER_ADDRESS = "matreshka.hypixel.ws"

// Matryoshka tab definitions
const TABS = [
  { id: "about", label: "О СЕРВЕРЕ" },
  { id: "modes", label: "РЕЖИМЫ" },
  { id: "mods", label: "МОДЫ" },
  { id: "connect", label: "ПОДКЛЮЧИТЬСЯ" },
]

// Horizontal nesting dolls animation for Mods page
function MatryoshkaNestingAnimation() {
  const dolls = [
    { size: 80, delay: 0 },
    { size: 64, delay: 0.3 },
    { size: 50, delay: 0.6 },
    { size: 38, delay: 0.9 },
    { size: 28, delay: 1.2 },
  ]

  return (
    <div className="flex items-end justify-center gap-0 mt-8 mb-4" style={{ height: 100 }}>
      {dolls.map((d, i) => (
        <div
          key={i}
          className="relative flex-shrink-0"
          style={{
            width: d.size,
            height: d.size,
            animation: `matryoshka-slide-in 0.7s ease-out forwards`,
            animationDelay: `${d.delay}s`,
            opacity: 0,
          }}
        >
          <img
            src={MATRYOSHKA_IMG}
            alt="matryoshka"
            className="w-full h-full object-cover"
            style={{
              imageRendering: "pixelated",
              filter: `brightness(${0.5 + i * 0.12}) drop-shadow(0 0 4px rgba(74,222,128,0.4))`,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes matryoshka-slide-in {
          0% { transform: translateX(-60px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Matryoshka menu that pops out on hover
function MatryoshkaNav({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center select-none mt-6 mb-2">
      {/* Main matryoshka */}
      <div
        className="relative cursor-pointer group"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ width: 90, height: 90 }}
      >
        <img
          src={MATRYOSHKA_IMG}
          alt="матрёшка"
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
          style={{
            imageRendering: "pixelated",
            filter: "drop-shadow(0 0 12px rgba(74,222,128,0.7))",
          }}
        />
        {/* Glow ring on hover */}
        <div className="absolute inset-0 border-2 border-green-400/0 group-hover:border-green-400/60 transition-all duration-300" />
        {/* Tooltip */}
        {!open && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-green-700 text-xs whitespace-nowrap font-pixel" style={{ fontSize: 7 }}>
            НАВЕСТИ
          </div>
        )}
      </div>

      {/* Pop-out tabs */}
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`flex gap-2 mt-3 transition-all duration-500 overflow-hidden ${open ? "opacity-100 max-h-40" : "opacity-0 max-h-0 pointer-events-none"}`}
      >
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id)
              setOpen(false)
              const el = document.getElementById(tab.id)
              if (el) el.scrollIntoView({ behavior: "smooth" })
            }}
            className={`flex flex-col items-center gap-1 px-2 py-2 border transition-all duration-300 group/tab
              ${activeTab === tab.id ? "border-green-400 bg-green-950/40" : "border-green-900/50 bg-black hover:border-green-500/70"}`}
            style={{
              animation: open ? `matryoshka-pop 0.35s ease-out forwards` : "none",
              animationDelay: `${i * 0.07}s`,
              opacity: 0,
            }}
          >
            <img
              src={MATRYOSHKA_IMG}
              alt=""
              style={{
                width: 32,
                height: 32,
                imageRendering: "pixelated",
                filter: activeTab === tab.id ? "drop-shadow(0 0 6px rgba(74,222,128,0.9))" : "brightness(0.6)",
              }}
              className="transition-all duration-200 group-hover/tab:scale-110"
            />
            <span className={`text-center leading-tight ${activeTab === tab.id ? "text-green-400" : "text-gray-500 group-hover/tab:text-green-500"}`}
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6 }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes matryoshka-pop {
          0% { transform: translateY(-20px) scale(0.7); opacity: 0; }
          80% { transform: translateY(3px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function Index() {
  const [showCursor, setShowCursor] = useState(true)
  const [matrixChars, setMatrixChars] = useState<string[]>([])
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentTyping, setCurrentTyping] = useState("")
  const [currentCommand, setCurrentCommand] = useState(0)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [onlineCount, setOnlineCount] = useState<number | null>(null)
  const [maxOnline, setMaxOnline] = useState<number | null>(null)
  const [serverVersion, setServerVersion] = useState<string>("...")
  const [activeTab, setActiveTab] = useState("about")
  const [showScrollTop, setShowScrollTop] = useState(false)

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates((prev) => ({ ...prev, [key]: true }))
      setTimeout(() => setCopiedStates((prev) => ({ ...prev, [key]: false })), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

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
        `Версия: ${serverVersion} Java Edition`,
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
███╗   ███╗ █████╗ ████████╗     
████╗ ████║██╔══██╗╚══██╔══╝     
██╔████╔██║███████║   ██║        
██║╚██╔╝██║██╔══██║   ██║        
██║ ╚═╝ ██║██║  ██║   ██║        
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝        
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
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const fetchOnline = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`)
        const data = await res.json()
        if (data.online) {
          setOnlineCount(data.players?.online ?? 0)
          setMaxOnline(data.players?.max ?? 0)
          if (data.version) setServerVersion(data.version)
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
                <div className="w-3 h-3 bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
                <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
                <div className="w-3 h-3 bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
              </div>
              <span className="text-green-400 font-bold tracking-widest" style={{ fontSize: 10 }}>
                МАТ<span className="text-red-400">&amp;</span>РЕШКА
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6 ml-8">
              {TABS.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  className="text-gray-400 hover:text-green-400 transition-colors cursor-pointer relative group"
                  style={{ fontSize: 8 }}
                >
                  <span>{tab.label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 border border-green-900 px-3 py-1 bg-black" style={{ fontSize: 9 }}>
              <div className={`w-2 h-2 ${onlineCount !== null && onlineCount > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-green-400">
                {onlineCount === null ? "..." : `${onlineCount} онлайн`}
              </span>
            </div>

            <div
              className="group relative cursor-pointer"
              onClick={() => copyToClipboard(SERVER_ADDRESS, "nav-copy")}
            >
              <div className="absolute inset-0 border border-green-900 transition-all duration-300 group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-500/20" />
              <div className="relative border border-green-700 bg-transparent text-green-400 font-medium px-4 py-2 transition-all duration-300 group-hover:border-green-400 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0" style={{ fontSize: 8 }}>
                <div className="flex items-center gap-2">
                  {copiedStates["nav-copy"] ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-green-600" />}
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
            <div key={i} className="text-green-500 text-xs animate-pulse">{char}</div>
          ))}
        </div>
      </div>

      {/* Scan line */}
      <div className="scan-line" style={{ background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)" }} />

      {/* Hero Section */}
      <section className="relative px-6 py-16 lg:px-12" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* ASCII */}
            <div className="mb-4 overflow-x-auto">
              <pre className="text-green-400 text-xs font-bold leading-tight inline-block terminal-glow" style={{ textShadow: "0 0 10px rgba(74,222,128,0.8)", fontSize: 10 }}>{heroAsciiText}</pre>
            </div>

            {/* Matryoshka nav widget */}
            <MatryoshkaNav activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Online Counter */}
            <div className="mt-8 mb-8 inline-flex items-center gap-4 border border-green-800 bg-green-950/20 px-8 py-4">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-green-400" style={{ textShadow: "0 0 20px rgba(74,222,128,0.9)" }}>
                  {onlineCount === null ? <span className="animate-pulse">---</span> : onlineCount}
                </div>
                <div className="text-gray-600 tracking-widest mt-1" style={{ fontSize: 8 }}>ИГРОКОВ ОНЛАЙН</div>
              </div>
              {maxOnline !== null && maxOnline > 0 && (
                <>
                  <div className="w-px h-12 bg-green-900" />
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-gray-500">{maxOnline}</div>
                    <div className="text-gray-600 tracking-widest mt-1" style={{ fontSize: 8 }}>МАКСИМУМ</div>
                  </div>
                </>
              )}
              <div className="w-px h-12 bg-green-900" />
              <div className="text-center">
                <div className={`w-4 h-4 mx-auto ${onlineCount !== null && onlineCount > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                <div className="text-gray-600 tracking-widest mt-1" style={{ fontSize: 8 }}>СТАТУС</div>
              </div>
            </div>

            <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
              Русский сервер Minecraft<br />
              на базе{" "}
              <span className="text-green-400" style={{ textShadow: "0 0 15px rgba(74,222,128,0.6)" }}>Hypixel</span>
            </h1>

            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10" style={{ fontSize: 9 }}>
              Играй с друзьями, стройся и сражайся. Стабильный сервер с честной игрой и активным сообществом.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="group relative cursor-pointer w-full sm:w-auto" onClick={() => copyToClipboard(SERVER_ADDRESS, "hero-copy")}>
                <div className="absolute inset-0 border border-green-700 transition-all duration-300 group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-500/30" />
                <div className="relative border border-green-500 bg-green-950/30 text-green-400 font-bold px-8 py-4 transition-all duration-300 group-hover:bg-green-950/50 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 text-center" style={{ fontSize: 9 }}>
                  <div className="flex items-center justify-center gap-3">
                    {copiedStates["hero-copy"] ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-green-600" />}
                    <span className="text-green-700">IP:</span>
                    <span>{SERVER_ADDRESS}</span>
                  </div>
                </div>
              </div>

              <a href="#connect" className="group relative cursor-pointer w-full sm:w-auto">
                <div className="absolute inset-0 border-2 border-dashed border-gray-700 transition-all duration-300 group-hover:border-gray-400" />
                <div className="relative border-2 border-dashed border-gray-500 bg-transparent text-gray-300 font-bold px-8 py-4 transition-all duration-300 group-hover:border-gray-300 group-hover:bg-gray-900/30 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" style={{ fontSize: 9 }}>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">-&gt;</span>
                    <span>КАК ЗАЙТИ</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Terminal */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-950 border border-green-900/50 shadow-2xl shadow-green-950/30">
              <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-green-900/50">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500" />
                    <div className="w-3 h-3 bg-yellow-500" />
                    <div className="w-3 h-3 bg-green-500" />
                  </div>
                  <span className="text-green-700 tracking-wider" style={{ fontSize: 9 }}>matreshka-terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-700" style={{ fontSize: 9 }}>ONLINE</span>
                </div>
              </div>
              <div className="p-6 font-mono text-sm min-h-[200px]">
                {terminalLines.map((line, index) => (
                  <div key={index} className={`mb-1 ${line.startsWith("player@") ? "text-green-400" : line.includes("!") || line.includes("онлайн") || line.includes("Добро") ? "text-green-300" : "text-gray-400"}`} style={{ fontSize: 11 }}>
                    {line}
                  </div>
                ))}
                <div className="flex items-center gap-2 text-green-400" style={{ fontSize: 11 }}>
                  <span>player@matreshka:~$</span>
                  <span>{currentTyping}</span>
                  <span className={`w-2 h-4 bg-green-400 inline-block ${showCursor ? "opacity-100" : "opacity-0"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-green-900/30" id="modes">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 border border-green-900/50 px-4 py-2 mb-6 text-green-700 tracking-widest" style={{ fontSize: 8 }}>
              <div className="w-2 h-2 bg-green-500" />
              ИГРОВЫЕ РЕЖИМЫ
              <div className="w-2 h-2 bg-green-500" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">Что тебя ждёт</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "⛏", title: "SURVIVAL", desc: "Классическое выживание с экономикой, магазинами и кланами. Строй, торгуй, побеждай.", tag: "ПОПУЛЯРНО" },
              { icon: "🏗", title: "CREATIVE", desc: "Огромные плоты для строительства. Покажи свои лучшие постройки сообществу.", tag: "ТВОРЧЕСТВО" },
              { icon: "⚔", title: "MINIGAMES", desc: "BedWars, SkyWars, Murder Mystery и другие мини-игры. Соревнуйся с другими.", tag: "АКТИВНО" },
            ].map((mode, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
                <div className="relative bg-black border border-green-900/40 p-6 hover:border-green-500/60 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-green-950/40">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{mode.icon}</span>
                    <span className="border border-green-900 text-green-700 px-2 py-0.5 tracking-wider" style={{ fontSize: 7 }}>{mode.tag}</span>
                  </div>
                  <h3 className="font-bold mb-3 text-green-400 tracking-wider" style={{ fontSize: 11 }}>{mode.title}</h3>
                  <p className="text-gray-400 leading-relaxed" style={{ fontSize: 9 }}>{mode.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 lg:px-12 border-t border-green-900/30 bg-green-950/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "24/7", label: "АПТАЙМ" },
              { value: serverVersion === "..." ? "..." : serverVersion, label: "ВЕРСИЯ" },
              { value: "RU", label: "ЯЗЫК" },
              { value: "FREE", label: "ДОСТУП" },
            ].map((stat, i) => (
              <div key={i} className="border border-green-900/40 bg-black p-6 hover:border-green-500/50 transition-colors">
                <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-2" style={{ textShadow: "0 0 10px rgba(74,222,128,0.5)", wordBreak: "break-all" }}>
                  {stat.value}
                </div>
                <div className="text-gray-600 tracking-widest" style={{ fontSize: 8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mods Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-green-900/30" id="mods">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 border border-green-900/50 px-4 py-2 mb-6 text-green-700 tracking-widest" style={{ fontSize: 8 }}>
              <div className="w-2 h-2 bg-green-500" />
              СПИСОК МОДОВ
              <div className="w-2 h-2 bg-green-500" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Моды сервера</h2>
          </div>

          {/* Matryoshka nesting animation — limited width to not overlap text */}
          <div className="overflow-hidden w-full flex justify-center mb-8">
            <div style={{ maxWidth: 400 }}>
              <MatryoshkaNestingAnimation />
            </div>
          </div>

          <div className="border border-green-900/40 bg-black p-10 inline-block min-w-[280px]">
            <p className="text-green-400 animate-pulse" style={{ fontSize: 12 }}>
              скоро будет<span className="terminal-glow">...</span>
            </p>
            <p className="text-gray-600 mt-4" style={{ fontSize: 8 }}>
              МЫ ГОТОВИМ СПИСОК МОДОВ СЕРВЕРА
            </p>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="px-6 py-20 lg:px-12 border-t border-green-900/30" id="connect">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 border border-green-900/50 px-4 py-2 mb-6 text-green-700 tracking-widest" style={{ fontSize: 8 }}>
              <div className="w-2 h-2 bg-green-500" />
              КАК ЗАЙТИ
              <div className="w-2 h-2 bg-green-500" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Три шага до игры</h2>
            <p className="text-gray-400 max-w-xl mx-auto" style={{ fontSize: 9 }}>
              Нужен только лицензионный Minecraft Java Edition. Подключайся за пару минут.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { num: "01", title: "Запусти Minecraft", desc: "Открой игру Java Edition версии " + serverVersion + "+", cmd: "Minecraft Java Edition" },
              { num: "02", title: "Добавь сервер", desc: "Multiplayer → Add Server → вставь IP", cmd: SERVER_ADDRESS, copyKey: "step2-copy" },
              { num: "03", title: "Заходи!", desc: "Нажми Join Server и начинай играть", cmd: "PLAY!" },
            ].map((step, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-950/10 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
                <div className="relative bg-black border border-green-900/40 p-6 flex flex-col justify-between hover:border-green-500/60 transition-all duration-300">
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 border border-green-900/50 flex items-center justify-center group-hover:border-green-400/50 transition-colors">
                      <span className="font-mono text-green-700" style={{ fontSize: 11 }}>{step.num}</span>
                    </div>
                    <h3 className="font-bold mb-3 text-white tracking-wide" style={{ fontSize: 9 }}>{step.title}</h3>
                    <p className="text-gray-400 mb-4 leading-relaxed" style={{ fontSize: 8 }}>{step.desc}</p>
                  </div>
                  <div
                    className={`bg-gray-900 border border-green-900/40 p-2.5 font-mono text-left transition-colors group-hover:border-green-700/50 group-hover:bg-gray-800 ${step.copyKey ? "cursor-pointer" : ""} flex items-center justify-between`}
                    onClick={step.copyKey ? () => copyToClipboard(step.cmd, step.copyKey!) : undefined}
                    style={{ fontSize: 9 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-green-700">{">"}</span>
                      <span className="text-green-400">{step.cmd}</span>
                    </div>
                    {step.copyKey && (
                      copiedStates[step.copyKey] ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-600 hover:text-green-400 transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="group relative cursor-pointer inline-block w-full sm:w-auto" onClick={() => copyToClipboard(SERVER_ADDRESS, "cta-copy")}>
            <div className="absolute inset-0 border-2 border-green-700 transition-all duration-300 group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-500/30" />
            <div className="relative border-2 border-green-500 bg-green-950/40 text-green-400 font-bold px-12 py-5 transition-all duration-300 group-hover:bg-green-950/60 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 text-center" style={{ fontSize: 10 }}>
              <div className="flex items-center justify-center gap-3">
                {copiedStates["cta-copy"] ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-green-600" />}
                <span>СКОПИРОВАТЬ IP СЕРВЕРА</span>
              </div>
            </div>
          </div>
          <div className="mt-6 text-gray-600 tracking-wider" style={{ fontSize: 9 }}>{SERVER_ADDRESS}</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-900/30 bg-gray-950/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={MATRYOSHKA_IMG} alt="" style={{ width: 28, height: 28, imageRendering: "pixelated" }} />
            <span className="text-green-400 font-bold tracking-widest" style={{ fontSize: 9 }}>
              МАТ<span className="text-red-400">&amp;</span>РЕШКА
            </span>
            <span className="text-gray-700" style={{ fontSize: 9 }}>|</span>
            <span className="text-gray-600" style={{ fontSize: 9 }}>{SERVER_ADDRESS}</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: 9 }}>
            <div className={`w-2 h-2 ${onlineCount !== null && onlineCount > 0 ? "bg-green-500 animate-pulse" : "bg-gray-600"}`} />
            <span className="text-gray-600">
              {onlineCount === null ? "Проверяем статус..." : onlineCount > 0 ? `${onlineCount} игроков сейчас онлайн` : "Сервер недоступен"}
            </span>
          </div>
          <div className="text-gray-700" style={{ fontSize: 8 }}>Minecraft не является официальным продуктом Mojang</div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 group transition-all duration-300 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Наверх"
      >
        <div className="absolute inset-0 border border-green-700 transition-all duration-300 group-hover:border-green-400 group-hover:shadow-lg group-hover:shadow-green-500/40" />
        <div className="relative border border-green-500 bg-black text-green-400 p-3 transition-all duration-300 group-hover:bg-green-950/50 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0">
          <ArrowUp className="w-5 h-5" />
        </div>
      </button>
    </div>
  )
}
