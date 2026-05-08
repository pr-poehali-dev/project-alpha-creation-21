import { useEffect, useState, useRef } from "react"
import { Copy, Check, ArrowUp, Download, Upload, X, LogIn, UserPlus, LogOut, User as UserIcon, Sword, Skull, Clock, Pickaxe, Shield } from "lucide-react"

const MATRYOSHKA_IMG = "https://cdn.poehali.dev/projects/b964269c-dfc0-4015-8416-62c45be9b32e/files/a42cdd79-0086-4cb2-95d6-e6c801f1d859.jpg"
const SERVER_ADDRESS = "matreshka.hypixel.ws"
const AUTH_URL = "https://functions.poehali.dev/14c6f044-a887-4041-9b83-11931ad77157"
const MODS_URL = "https://functions.poehali.dev/267bd7e6-7b22-4226-a21f-aa39bcb4aed6"

const TABS = [
  { id: "about", label: "О СЕРВЕРЕ" },
  { id: "modes", label: "РЕЖИМЫ" },
  { id: "mods", label: "МОДЫ" },
  { id: "connect", label: "ПОДКЛЮЧИТЬСЯ" },
]

interface User { id: number; nickname: string; is_admin: boolean }
interface Mod { id: number; name: string; filename: string; url: string; size_bytes: number; uploaded_at: string }
interface PlayerProfile {
  nickname: string; is_admin: boolean; skin_url: string | null; head_url: string | null
  stats: { playtime_h: number; blocks_mined: number; kills: number; deaths: number; kd: number }
  join_date: string | null; last_seen: string | null
}

function PixBtn({ children, onClick, className = "", type = "button" as "button" | "submit", disabled = false }: {
  children: React.ReactNode; onClick?: () => void; className?: string; type?: "button" | "submit"; disabled?: boolean
}) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`relative group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      <div className="absolute inset-0 border border-red-800 bg-red-950/20 transition-all duration-200 group-hover:border-red-400 group-hover:shadow-lg group-hover:shadow-red-500/20" />
      <div className="relative border border-red-600 bg-red-950/40 text-red-300 px-5 py-2 transition-all duration-200 group-hover:bg-red-900/50 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0 flex items-center gap-2">
        {children}
      </div>
    </button>
  )
}

// --- Profile Modal ---
function ProfileModal({ user, onClose }: { user: User; onClose: () => void }) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${AUTH_URL}?action=profile&id=${user.id}`)
      .then(r => r.json())
      .then(d => { setProfile(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user.id])

  const BR = "border-red-900/40"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-black border border-red-800 w-full max-w-lg mx-4 overflow-hidden"
        style={{ boxShadow: "0 0 40px rgba(200,20,20,0.25)", fontFamily: "'Press Start 2P', monospace" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${BR} bg-red-950/10`}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 animate-pulse" />
            <span className="text-red-400 tracking-widest" style={{ fontSize: 9 }}>ЛИЧНЫЙ КАБИНЕТ</span>
          </div>
          <button onClick={onClose} className="text-red-900 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-red-900 animate-pulse" style={{ fontSize: 9 }}>ЗАГРУЗКА...</div>
        ) : profile ? (
          <div className="p-6">
            {/* Player card */}
            <div className={`flex gap-5 mb-6 p-4 border ${BR} bg-red-950/5`}>
              {profile.skin_url ? (
                <img src={profile.skin_url} alt="skin" style={{ height: 96, imageRendering: "pixelated" }} className="flex-shrink-0" />
              ) : (
                <div className="w-16 h-24 bg-red-950/30 border border-red-900/40 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-8 h-8 text-red-900" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-red-400" style={{ fontSize: 13 }}>{profile.nickname}</span>
                  {profile.is_admin && (
                    <span className="border border-red-700 bg-red-950/40 text-red-500 px-2 py-0.5" style={{ fontSize: 7 }}>ADMIN</span>
                  )}
                </div>
                <div className="space-y-1" style={{ fontSize: 8 }}>
                  {profile.join_date && <div className="text-gray-600">Дата входа: <span className="text-gray-400">{profile.join_date}</span></div>}
                  {profile.last_seen && <div className="text-gray-600">Последний раз: <span className="text-gray-400">{profile.last_seen}</span></div>}
                  {!profile.join_date && !profile.last_seen && (
                    <div className="text-gray-700">Ещё не заходил на сервер</div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mb-2" style={{ fontSize: 8 }}>
              <span className="text-red-900 tracking-widest">СТАТИСТИКА ИГРОКА</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Clock className="w-4 h-4" />, label: "ВРЕМЯ В ИГРЕ", value: profile.stats.playtime_h > 0 ? `${profile.stats.playtime_h}ч` : "0ч" },
                { icon: <Pickaxe className="w-4 h-4" />, label: "БЛОКОВ СЛОМАНО", value: profile.stats.blocks_mined.toLocaleString("ru") },
                { icon: <Sword className="w-4 h-4" />, label: "УБИЙСТВ", value: profile.stats.kills.toString() },
                { icon: <Skull className="w-4 h-4" />, label: "СМЕРТЕЙ", value: profile.stats.deaths.toString() },
                { icon: <Shield className="w-4 h-4" />, label: "K/D РЕЙТИНГ", value: profile.stats.kd.toString() },
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 border ${BR} bg-black`}>
                  <span className="text-red-800 flex-shrink-0">{s.icon}</span>
                  <div>
                    <div className="text-gray-700" style={{ fontSize: 7 }}>{s.label}</div>
                    <div className="text-red-400 mt-0.5" style={{ fontSize: 11 }}>{s.value}</div>
                  </div>
                </div>
              ))}
              <div className={`flex items-center gap-3 p-3 border ${BR} bg-black`}>
                <span className="text-red-800 flex-shrink-0"><UserIcon className="w-4 h-4" /></span>
                <div>
                  <div className="text-gray-700" style={{ fontSize: 7 }}>НА СЕРВЕРЕ</div>
                  <div className="text-red-400 mt-0.5" style={{ fontSize: 9 }}>МАТ&amp;РЕШКА</div>
                </div>
              </div>
            </div>

            {profile.stats.playtime_h === 0 && (
              <div className={`mt-4 border ${BR} bg-red-950/5 p-3 text-center text-red-900`} style={{ fontSize: 8 }}>
                Статистика появится после первого входа на сервер
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-red-700" style={{ fontSize: 9 }}>Не удалось загрузить профиль</div>
        )}
      </div>
    </div>
  )
}

// --- Auth Modal ---
function AuthModal({ onClose, onLogin }: { onClose: () => void; onLogin: (user: User) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const inputCls = "w-full bg-black border border-red-900/60 text-white px-3 py-2 focus:outline-none focus:border-red-500 transition-colors placeholder-red-900/40 font-mono"

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setMsg(""); setLoading(true)
    try {
      const body: Record<string, string> = { email, password }
      if (mode === "register") body.nickname = nickname
      const res = await fetch(`${AUTH_URL}?action=${mode}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Ошибка"); setLoading(false); return }
      if (mode === "register") { setMsg(data.message || "Проверь почту!") }
      else { localStorage.setItem("mc_user", JSON.stringify(data.user)); onLogin(data.user); onClose() }
    } catch { setError("Ошибка соединения") }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-black border border-red-800 p-8 w-full max-w-md mx-4"
        style={{ boxShadow: "0 0 30px rgba(200,20,20,0.3)", fontFamily: "'Press Start 2P', monospace" }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-red-800 hover:text-red-400 transition-colors"><X className="w-5 h-5" /></button>
        <div className="flex items-center gap-3 mb-6">
          <img src={MATRYOSHKA_IMG} alt="" style={{ width: 36, height: 36, imageRendering: "pixelated" }} />
          <h2 className="text-red-400 font-bold tracking-widest" style={{ fontSize: 11 }}>{mode === "login" ? "ВХОД" : "РЕГИСТРАЦИЯ"}</h2>
        </div>
        {msg ? (
          <div className="border border-red-800 bg-red-950/20 p-4 text-red-300 text-center" style={{ fontSize: 9 }}>
            {msg}
            <div className="mt-4"><PixBtn onClick={() => { setMode("login"); setMsg("") }}><span style={{ fontSize: 8 }}>К ВХОДУ</span></PixBtn></div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-red-800 block mb-1" style={{ fontSize: 8 }}>EMAIL</label>
              <input className={inputCls} style={{ fontSize: 11 }} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            {mode === "register" && (
              <div>
                <label className="text-red-800 block mb-1" style={{ fontSize: 8 }}>НИКНЕЙМ В ИГРЕ</label>
                <input className={inputCls} style={{ fontSize: 11 }} value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Steve" required />
              </div>
            )}
            <div>
              <label className="text-red-800 block mb-1" style={{ fontSize: 8 }}>ПАРОЛЬ ОТ СЕРВЕРА</label>
              <input className={inputCls} style={{ fontSize: 11 }} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required />
            </div>
            {error && <p className="text-red-500 border border-red-900/50 p-2" style={{ fontSize: 9 }}>{error}</p>}
            <PixBtn type="submit" disabled={loading} className="w-full">
              <span style={{ fontSize: 9 }}>{loading ? "ЗАГРУЗКА..." : mode === "login" ? "ВОЙТИ" : "ЗАРЕГИСТРИРОВАТЬСЯ"}</span>
            </PixBtn>
            <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError("") }}
              className="w-full text-red-900 hover:text-red-500 transition-colors text-center mt-2" style={{ fontSize: 8 }}>
              {mode === "login" ? "→ Нет аккаунта? Зарегистрироваться" : "→ Уже есть аккаунт? Войти"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// --- Admin upload ---
function AdminUploadPanel({ adminToken, onUploaded }: { adminToken: string; onUploaded: () => void }) {
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const inputCls = "w-full bg-black border border-red-900/60 text-white px-3 py-2 focus:outline-none focus:border-red-500 transition-colors font-mono"

  const upload = async (e: React.FormEvent) => {
    e.preventDefault(); if (!file || !name) return
    setLoading(true); setMsg(""); setError("")
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const b64 = (reader.result as string).split(",")[1]
        const res = await fetch(`${MODS_URL}?action=upload`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin_token: adminToken, name, filename: file.name, file_b64: b64 }),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error); setLoading(false); return }
        setMsg("Мод загружен!"); setName(""); setFile(null); onUploaded()
      } catch { setError("Ошибка загрузки") }
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="border border-red-900/40 bg-red-950/10 p-6 mb-8">
      <h3 className="text-red-500 mb-4 tracking-widest" style={{ fontSize: 9 }}>ПАНЕЛЬ АДМИНИСТРАТОРА — ЗАГРУЗКА МОДА</h3>
      <form onSubmit={upload} className="space-y-3">
        <input className={inputCls} style={{ fontSize: 11 }} value={name} onChange={e => setName(e.target.value)} placeholder="Название мода" required />
        <input className={`${inputCls} file:bg-red-950 file:border file:border-red-800 file:text-red-400 file:px-3 file:py-1 file:mr-3 file:cursor-pointer`}
          style={{ fontSize: 11 }} type="file" accept=".zip,.jar,.rar,.7z" onChange={e => setFile(e.target.files?.[0] || null)} required />
        {error && <p className="text-red-500" style={{ fontSize: 8 }}>{error}</p>}
        {msg && <p className="text-green-400" style={{ fontSize: 8 }}>{msg}</p>}
        <PixBtn type="submit" disabled={loading}>
          <Upload className="w-3 h-3" /><span style={{ fontSize: 8 }}>{loading ? "ЗАГРУЗКА..." : "ЗАГРУЗИТЬ МОД"}</span>
        </PixBtn>
      </form>
    </div>
  )
}

function MatryoshkaNestingAnimation() {
  const dolls = [{ size: 80, delay: 0 }, { size: 64, delay: 0.3 }, { size: 50, delay: 0.6 }, { size: 38, delay: 0.9 }, { size: 28, delay: 1.2 }]
  return (
    <div className="flex items-end justify-center gap-0 mt-8 mb-4" style={{ height: 100 }}>
      {dolls.map((d, i) => (
        <div key={i} style={{ width: d.size, height: d.size, animation: "mry-slide 0.7s ease-out forwards", animationDelay: `${d.delay}s`, opacity: 0 }}>
          <img src={MATRYOSHKA_IMG} alt="" className="w-full h-full object-cover"
            style={{ imageRendering: "pixelated", filter: `brightness(${0.4 + i * 0.15}) drop-shadow(0 0 4px rgba(200,20,20,0.5))` }} />
        </div>
      ))}
      <style>{`@keyframes mry-slide{0%{transform:translateX(-60px);opacity:0}100%{transform:translateX(0);opacity:1}}`}</style>
    </div>
  )
}

function MatryoshkaNav({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h)
  }, [])
  return (
    <div ref={ref} className="flex flex-col items-center select-none mt-6 mb-2">
      <div className="relative cursor-pointer group" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} style={{ width: 90, height: 90 }}>
        <img src={MATRYOSHKA_IMG} alt="матрёшка" className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
          style={{ imageRendering: "pixelated", filter: "drop-shadow(0 0 14px rgba(200,20,20,0.8))" }} />
        <div className="absolute inset-0 border-2 border-red-500/0 group-hover:border-red-500/60 transition-all duration-300" />
        {!open && <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-red-900 whitespace-nowrap"
          style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7 }}>НАВЕСТИ</div>}
      </div>
      <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        className={`flex gap-2 mt-3 transition-all duration-500 overflow-hidden ${open ? "opacity-100 max-h-40" : "opacity-0 max-h-0 pointer-events-none"}`}>
        {TABS.map((tab, i) => (
          <button key={tab.id}
            onClick={() => { onTabChange(tab.id); setOpen(false); document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth" }) }}
            className={`flex flex-col items-center gap-1 px-2 py-2 border transition-all duration-300 group/tab ${activeTab === tab.id ? "border-red-500 bg-red-950/40" : "border-red-900/40 bg-black hover:border-red-600/60"}`}
            style={{ animation: open ? "mry-pop 0.35s ease-out forwards" : "none", animationDelay: `${i * 0.07}s`, opacity: 0 }}>
            <img src={MATRYOSHKA_IMG} alt="" style={{ width: 32, height: 32, imageRendering: "pixelated", filter: activeTab === tab.id ? "drop-shadow(0 0 6px rgba(200,20,20,0.9))" : "brightness(0.4)" }}
              className="transition-all duration-200 group-hover/tab:scale-110" />
            <span className={`text-center leading-tight ${activeTab === tab.id ? "text-red-400" : "text-gray-700 group-hover/tab:text-red-600"}`}
              style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6 }}>{tab.label}</span>
          </button>
        ))}
      </div>
      <style>{`@keyframes mry-pop{0%{transform:translateY(-20px) scale(0.7);opacity:0}80%{transform:translateY(3px) scale(1.05);opacity:1}100%{transform:translateY(0) scale(1);opacity:1}}`}</style>
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
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [mods, setMods] = useState<Mod[]>([])
  const [modsLoaded, setModsLoaded] = useState(false)
  const [verifyMsg, setVerifyMsg] = useState("")

  const ADMIN_TOKEN = "matreshka_admin_2024"

  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); setCopiedStates(p => ({ ...p, [key]: true })); setTimeout(() => setCopiedStates(p => ({ ...p, [key]: false })), 2000) } catch { /* ignore */ }
  }

  const loadMods = async () => {
    try { const r = await fetch(`${MODS_URL}?action=list`); const d = await r.json(); setMods(d.mods || []) } catch { /* ignore */ }
    setModsLoaded(true)
  }

  const deleteMod = async (id: number) => {
    if (!confirm("Удалить мод?")) return
    await fetch(`${MODS_URL}?action=delete`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ admin_token: ADMIN_TOKEN, id }) })
    loadMods()
  }

  const fmtBytes = (b: number) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`

  const termSeqs = [
    { command: `ping ${SERVER_ADDRESS}`, outputs: ["Подключение к серверу...", "Ответ: 12ms", "Пакеты: 4/4", "Сервер онлайн!"] },
    { command: "status --players", outputs: ["Режимы: Survival, Creative, Adventure", `Версия: ${serverVersion} Java`, "Ваниль без лишнего", "Стабильно!"] },
    { command: "connect --server matreshka", outputs: ["Авторизация...", "Загрузка мира...", "Добро пожаловать!", "Приятной игры!"] },
  ]

  const asciiArt = `
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
    const stored = localStorage.getItem("mc_user"); if (stored) setUser(JSON.parse(stored))
    const params = new URLSearchParams(window.location.search)
    const token = params.get("verify")
    if (token) fetch(`${AUTH_URL}?action=verify&token=${token}`).then(r => r.json()).then(d => setVerifyMsg(d.message || d.error || ""))
  }, [])

  useEffect(() => {
    const chars = "MATRESHKA#%@01█▓▒░".split("")
    const mk = () => Array.from({ length: 100 }, () => chars[Math.floor(Math.random() * chars.length)])
    setMatrixChars(mk())
    const i = setInterval(() => setMatrixChars(mk()), 1200); return () => clearInterval(i)
  }, [])

  useEffect(() => { const i = setInterval(() => setShowCursor(p => !p), 500); return () => clearInterval(i) }, [])
  useEffect(() => { const h = () => setShowScrollTop(window.scrollY > 400); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h) }, [])

  useEffect(() => {
    const go = async () => {
      try {
        const r = await fetch(`https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`); const d = await r.json()
        if (d.online) { setOnlineCount(d.players?.online ?? 0); setMaxOnline(d.players?.max ?? 0); if (d.version) setServerVersion(d.version) }
        else { setOnlineCount(0); setMaxOnline(0) }
      } catch { setOnlineCount(null) }
    }; go(); const i = setInterval(go, 30000); return () => clearInterval(i)
  }, [])

  useEffect(() => { loadMods() }, [])

  useEffect(() => {
    const seq = termSeqs[currentCommand]; const T: ReturnType<typeof setTimeout>[] = []
    setTerminalLines([]); setCurrentTyping("")
    const cmd = seq.command
    for (let i = 0; i <= cmd.length; i++) T.push(setTimeout(() => setCurrentTyping(cmd.slice(0, i)), i * 50))
    T.push(setTimeout(() => { setCurrentTyping(""); setTerminalLines(p => [...p, `player@matreshka:~$ ${cmd}`]) }, cmd.length * 50 + 400))
    seq.outputs.forEach((out, idx) => T.push(setTimeout(() => setTerminalLines(p => [...p, out]), cmd.length * 50 + 900 + idx * 700)))
    T.push(setTimeout(() => setCurrentCommand(p => (p + 1) % termSeqs.length), cmd.length * 50 + 900 + seq.outputs.length * 700 + 1800))
    return () => T.forEach(clearTimeout)
  }, [currentCommand])

  const BR = "border-red-900/40"

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      {/* Nav */}
      <nav className={`border-b ${BR} bg-gray-950/95 backdrop-blur-sm p-4 relative z-10 sticky top-0`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-700 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 bg-yellow-800 hover:bg-yellow-600 transition-colors cursor-pointer" />
                <div className="w-3 h-3 bg-green-800 hover:bg-green-600 transition-colors cursor-pointer" />
              </div>
              <span className="text-red-500 font-bold tracking-widest" style={{ fontSize: 10 }}>МАТ<span className="text-white">&amp;</span>РЕШКА</span>
            </div>
            <div className="hidden md:flex items-center gap-6 ml-8">
              {TABS.map(tab => (
                <a key={tab.id} href={`#${tab.id}`} className="text-gray-600 hover:text-red-400 transition-colors relative group" style={{ fontSize: 8 }}>
                  {tab.label}<div className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 border ${BR} px-3 py-1 bg-black`} style={{ fontSize: 9 }}>
              <div className={`w-2 h-2 ${onlineCount !== null && onlineCount > 0 ? "bg-green-600 animate-pulse" : "bg-red-800"}`} />
              <span className="text-red-500">{onlineCount === null ? "..." : `${onlineCount} онлайн`}</span>
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowProfile(true)}
                  className={`flex items-center gap-2 border ${BR} px-3 py-1.5 text-red-500 hover:border-red-600 hover:text-red-400 transition-colors`}
                  style={{ fontSize: 8 }}>
                  <UserIcon className="w-3 h-3" />{user.nickname}
                </button>
                <button onClick={() => { localStorage.removeItem("mc_user"); setUser(null) }} className="text-red-900 hover:text-red-500 transition-colors p-1"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <PixBtn onClick={() => setShowAuth(true)}><LogIn className="w-3 h-3" /><span style={{ fontSize: 8 }}>ВОЙТИ</span></PixBtn>
            )}
            <div className="group relative cursor-pointer" onClick={() => copy(SERVER_ADDRESS, "nav-ip")}>
              <div className={`absolute inset-0 border ${BR} transition-all duration-300 group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-500/20`} />
              <div className="relative border border-red-700 bg-transparent text-red-500 px-4 py-2 transition-all duration-300 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0" style={{ fontSize: 8 }}>
                <div className="flex items-center gap-2">
                  {copiedStates["nav-ip"] ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-red-800" />}
                  СКОПИРОВАТЬ IP
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Matrix bg */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-25 gap-1 h-full">
          {matrixChars.map((c, i) => <div key={i} className="text-red-900 text-xs animate-pulse">{c}</div>)}
        </div>
      </div>
      <div className="scan-line" style={{ background: "linear-gradient(90deg,transparent,rgba(200,20,20,0.4),transparent)" }} />

      {verifyMsg && (
        <div className={`bg-red-950/80 border-b ${BR} px-6 py-3 text-center text-red-300 relative z-10`} style={{ fontSize: 9 }}>
          {verifyMsg}<button onClick={() => setVerifyMsg("")} className="ml-4 text-red-800 hover:text-red-400"><X className="w-3 h-3 inline" /></button>
        </div>
      )}

      {/* Hero */}
      <section className="relative px-6 py-16 lg:px-12" id="about">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-4 overflow-x-auto">
              <pre className="text-red-600 font-bold leading-tight inline-block" style={{ textShadow: "0 0 15px rgba(200,20,20,0.7)", fontSize: 10 }}>{asciiArt}</pre>
            </div>
            <MatryoshkaNav activeTab={activeTab} onTabChange={setActiveTab} />
            <div className={`mt-8 mb-8 inline-flex items-center gap-4 border ${BR} bg-red-950/10 px-8 py-4`}>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-red-500" style={{ textShadow: "0 0 20px rgba(200,20,20,0.8)" }}>
                  {onlineCount === null ? <span className="animate-pulse">---</span> : onlineCount}
                </div>
                <div className="text-red-900 tracking-widest mt-1" style={{ fontSize: 8 }}>ИГРОКОВ ОНЛАЙН</div>
              </div>
              {maxOnline !== null && maxOnline > 0 && <>
                <div className="w-px h-12 bg-red-900/40" />
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-gray-600">{maxOnline}</div>
                  <div className="text-gray-700 tracking-widest mt-1" style={{ fontSize: 8 }}>МАКСИМУМ</div>
                </div>
              </>}
              <div className="w-px h-12 bg-red-900/40" />
              <div className="text-center">
                <div className={`w-4 h-4 mx-auto ${onlineCount !== null && onlineCount > 0 ? "bg-green-600 animate-pulse" : "bg-red-800"}`} />
                <div className="text-red-900 tracking-widest mt-1" style={{ fontSize: 8 }}>СТАТУС</div>
              </div>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
              Русский ванильный<br />Minecraft-сервер
            </h1>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10" style={{ fontSize: 9 }}>
              Чистый ваниль без лишнего. Survival, Creative и Adventure — классика, в которую приятно играть.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="group relative cursor-pointer w-full sm:w-auto" onClick={() => copy(SERVER_ADDRESS, "hero-ip")}>
                <div className={`absolute inset-0 border ${BR} transition-all duration-300 group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-500/30`} />
                <div className="relative border border-red-700 bg-red-950/20 text-red-400 font-bold px-8 py-4 transition-all duration-300 group-hover:bg-red-950/40 transform translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 text-center" style={{ fontSize: 9 }}>
                  <div className="flex items-center justify-center gap-3">
                    {copiedStates["hero-ip"] ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-red-800" />}
                    <span className="text-red-800">IP:</span>{SERVER_ADDRESS}
                  </div>
                </div>
              </div>
              {!user && <PixBtn onClick={() => setShowAuth(true)}><UserPlus className="w-4 h-4" /><span style={{ fontSize: 9 }}>РЕГИСТРАЦИЯ</span></PixBtn>}
            </div>
          </div>

          {/* Terminal */}
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gray-950 border ${BR} shadow-2xl`} style={{ boxShadow: "0 0 30px rgba(200,20,20,0.08)" }}>
              <div className={`flex items-center justify-between px-6 py-3 bg-gray-900 border-b ${BR}`}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2"><div className="w-3 h-3 bg-red-700" /><div className="w-3 h-3 bg-yellow-800" /><div className="w-3 h-3 bg-green-800" /></div>
                  <span className="text-red-900 tracking-wider" style={{ fontSize: 9 }}>matreshka-terminal</span>
                </div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-700 rounded-full animate-pulse" /><span className="text-red-900" style={{ fontSize: 9 }}>ONLINE</span></div>
              </div>
              <div className="p-6 font-mono text-sm min-h-[200px]">
                {terminalLines.map((line, idx) => (
                  <div key={idx} className={`mb-1 ${line.startsWith("player@") ? "text-red-400" : line.includes("!") || line.includes("Добро") ? "text-red-300" : "text-gray-600"}`} style={{ fontSize: 11 }}>{line}</div>
                ))}
                <div className="flex items-center gap-2 text-red-500" style={{ fontSize: 11 }}>
                  <span>player@matreshka:~$</span><span>{currentTyping}</span>
                  <span className={`w-2 h-4 bg-red-600 inline-block ${showCursor ? "opacity-100" : "opacity-0"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Minecraft */}
      <section className={`px-6 py-16 lg:px-12 border-t ${BR} bg-red-950/5`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-3 border ${BR} px-4 py-2 mb-6 text-red-900 tracking-widest`} style={{ fontSize: 8 }}>
              <div className="w-2 h-2 bg-red-800" />ЧТО ТАКОЕ MINECRAFT<div className="w-2 h-2 bg-red-800" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold mb-8">Если ты слышишь об этом впервые</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`border ${BR} bg-black p-6`}>
              <div className="text-3xl mb-4">🧱</div>
              <h3 className="text-red-400 mb-3 tracking-wider" style={{ fontSize: 10 }}>МИР ИЗ КУБИКОВ</h3>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: 9 }}>
                Minecraft — это игра, в которой весь мир состоит из блоков. Ты можешь сломать любой блок и поставить его в другом месте. Представь бесконечный конструктор LEGO, только в компьютере.
              </p>
            </div>
            <div className={`border ${BR} bg-black p-6`}>
              <div className="text-3xl mb-4">⛏</div>
              <h3 className="text-red-400 mb-3 tracking-wider" style={{ fontSize: 10 }}>ЧЕМ ТЫ ЗАНИМАЕШЬСЯ</h3>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: 9 }}>
                Копаешь землю в поисках ресурсов, строишь дома и замки, готовишь еду, сражаешься с монстрами ночью. Никакого сюжета — делаешь что хочешь, как в жизни, только интереснее.
              </p>
            </div>
            <div className={`border ${BR} bg-black p-6`}>
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-red-400 mb-3 tracking-wider" style={{ fontSize: 10 }}>ВМЕСТЕ ВЕСЕЛЕЕ</h3>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: 9 }}>
                На сервере — это когда несколько людей играют в одном мире одновременно. Ты можешь строить с друзьями, торговать, помогать или соревноваться. Наш сервер именно для этого.
              </p>
            </div>
            <div className={`border ${BR} bg-black p-6`}>
              <div className="text-3xl mb-4">🏆</div>
              <h3 className="text-red-400 mb-3 tracking-wider" style={{ fontSize: 10 }}>ЦЕЛЬ ИГРЫ</h3>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: 9 }}>
                Формально — победить финального босса Дракона Края. На практике — большинство игроков просто строят красивые постройки, общаются и исследуют мир. Каждый играет по-своему.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modes */}
      <section className={`px-6 py-20 lg:px-12 border-t ${BR}`} id="modes">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-3 border ${BR} px-4 py-2 mb-6 text-red-900 tracking-widest`} style={{ fontSize: 8 }}>
              <div className="w-2 h-2 bg-red-800" />ИГРОВЫЕ РЕЖИМЫ<div className="w-2 h-2 bg-red-800" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold">Режимы на нашем сервере</h2>
            <p className="text-gray-600 mt-3 max-w-xl mx-auto" style={{ fontSize: 8 }}>Только стандартные режимы Minecraft — ничего лишнего</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "⛏",
                title: "ВЫЖИВАНИЕ",
                sub: "Survival Mode",
                desc: "Самый популярный режим. Ты появляешься в случайном месте мира с пустыми руками. Нужно добыть еду, построить дом до ночи, когда появляются зомби и скелеты. Здесь важна каждая смерть — теряешь все предметы.",
                tag: "КЛАССИКА"
              },
              {
                icon: "🏗",
                title: "ТВОРЧЕСТВО",
                sub: "Creative Mode",
                desc: "Все блоки и предметы уже есть в инвентаре бесплатно. Ты летаешь, не умираешь, ничего не ломается. Режим для строителей — возводи архитектурные шедевры без ограничений.",
                tag: "ДЛЯ СТРОИТЕЛЕЙ"
              },
              {
                icon: "🗺",
                title: "ПРИКЛЮЧЕНИЕ",
                sub: "Adventure Mode",
                desc: "Режим для исследователей. Нельзя просто ломать блоки руками — только специальными инструментами. Создан для прохождения карт и историй, созданных другими игроками.",
                tag: "ИССЛЕДОВАНИЕ"
              },
            ].map((m, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
                <div className={`relative bg-black border ${BR} p-6 hover:border-red-700/60 transition-all duration-300 h-full`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{m.icon}</span>
                    <span className={`border ${BR} text-red-900 px-2 py-0.5 tracking-wider`} style={{ fontSize: 7 }}>{m.tag}</span>
                  </div>
                  <h3 className="font-bold mb-1 text-red-500 tracking-wider" style={{ fontSize: 11 }}>{m.title}</h3>
                  <p className="text-red-900 mb-3 italic" style={{ fontSize: 8 }}>{m.sub}</p>
                  <p className="text-gray-500 leading-relaxed" style={{ fontSize: 9 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`px-6 py-16 lg:px-12 border-t ${BR} bg-red-950/5`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[{ value: "24/7", label: "АПТАЙМ" }, { value: serverVersion, label: "ВЕРСИЯ" }, { value: "RU", label: "ЯЗЫК" }, { value: "FREE", label: "ДОСТУП" }].map((s, i) => (
              <div key={i} className={`border ${BR} bg-black p-6 hover:border-red-700/50 transition-colors`}>
                <div className="text-2xl lg:text-3xl font-bold text-red-600 mb-2" style={{ textShadow: "0 0 10px rgba(200,20,20,0.4)", wordBreak: "break-all" }}>{s.value}</div>
                <div className="text-red-900 tracking-widest" style={{ fontSize: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mods */}
      <section className={`px-6 py-20 lg:px-12 border-t ${BR}`} id="mods">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-3 border ${BR} px-4 py-2 mb-6 text-red-900 tracking-widest`} style={{ fontSize: 8 }}>
              <div className="w-2 h-2 bg-red-800" />СПИСОК МОДОВ<div className="w-2 h-2 bg-red-800" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Моды сервера</h2>
          </div>

          {user?.is_admin && <AdminUploadPanel adminToken={ADMIN_TOKEN} onUploaded={loadMods} />}

          {!modsLoaded ? (
            <div className="text-center text-red-900 animate-pulse" style={{ fontSize: 9 }}>ЗАГРУЗКА...</div>
          ) : mods.length === 0 ? (
            <div className="text-center">
              <div className="overflow-hidden flex justify-center mb-8"><div style={{ maxWidth: 400 }}><MatryoshkaNestingAnimation /></div></div>
              <div className={`border ${BR} bg-black p-10 inline-block min-w-[280px]`}>
                <p className="text-red-400 animate-pulse" style={{ fontSize: 12 }}>скоро будет...</p>
                <p className="text-gray-700 mt-4" style={{ fontSize: 8 }}>МЫ ГОТОВИМ СПИСОК МОДОВ СЕРВЕРА</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {mods.map(mod => (
                <div key={mod.id} className={`flex items-center justify-between border ${BR} bg-black p-4 hover:border-red-700/50 transition-colors`}>
                  <div className="flex-1 min-w-0">
                    <div className="text-red-400 mb-1" style={{ fontSize: 10 }}>{mod.name}</div>
                    <div className="text-gray-700 flex gap-4" style={{ fontSize: 8 }}><span>{mod.filename}</span><span>{fmtBytes(mod.size_bytes)}</span></div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <a href={mod.url} download className={`flex items-center gap-2 text-red-600 hover:text-red-400 transition-colors border ${BR} px-3 py-2 hover:border-red-700`} style={{ fontSize: 8 }}>
                      <Download className="w-3 h-3" />СКАЧАТЬ
                    </a>
                    {user?.is_admin && <button onClick={() => deleteMod(mod.id)} className="text-red-900 hover:text-red-500 transition-colors p-1"><X className="w-4 h-4" /></button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Connect */}
      <section className={`px-6 py-20 lg:px-12 border-t ${BR}`} id="connect">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <div className={`inline-flex items-center gap-3 border ${BR} px-4 py-2 mb-6 text-red-900 tracking-widest`} style={{ fontSize: 8 }}>
              <div className="w-2 h-2 bg-red-800" />КАК ЗАЙТИ<div className="w-2 h-2 bg-red-800" />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Три шага до игры</h2>
            <p className="text-gray-600 max-w-xl mx-auto" style={{ fontSize: 9 }}>Нужен Minecraft Java Edition.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { num: "01", title: "Запусти Minecraft", desc: `Java Edition ${serverVersion}+`, cmd: "Minecraft Java" },
              { num: "02", title: "Добавь сервер", desc: "Multiplayer → Add Server → IP", cmd: SERVER_ADDRESS, copyKey: "step2" },
              { num: "03", title: "Заходи!", desc: "Join Server и играй", cmd: "PLAY!" },
            ].map((step, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 to-gray-900 transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
                <div className={`relative bg-black border ${BR} p-6 flex flex-col justify-between hover:border-red-700/60 transition-all duration-300`}>
                  <div>
                    <div className="w-12 h-12 mx-auto mb-4 bg-gray-900 border border-red-900/50 flex items-center justify-center">
                      <span className="font-mono text-red-900" style={{ fontSize: 11 }}>{step.num}</span>
                    </div>
                    <h3 className="font-bold mb-3 text-white tracking-wide" style={{ fontSize: 9 }}>{step.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed" style={{ fontSize: 8 }}>{step.desc}</p>
                  </div>
                  <div className={`bg-gray-900 border ${BR} p-2.5 font-mono text-left transition-colors ${step.copyKey ? "cursor-pointer hover:border-red-700" : ""} flex items-center justify-between`}
                    onClick={step.copyKey ? () => copy(step.cmd, step.copyKey!) : undefined} style={{ fontSize: 9 }}>
                    <div className="flex items-center gap-2"><span className="text-red-900">{">"}</span><span className="text-red-500">{step.cmd}</span></div>
                    {step.copyKey && (copiedStates[step.copyKey] ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-red-900" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="group relative cursor-pointer inline-block" onClick={() => copy(SERVER_ADDRESS, "cta-ip")}>
            <div className="absolute inset-0 border-2 border-red-800 transition-all duration-300 group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-500/30" />
            <div className="relative border-2 border-red-600 bg-red-950/30 text-red-400 font-bold px-12 py-5 transition-all duration-300 group-hover:bg-red-950/50 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" style={{ fontSize: 10 }}>
              <div className="flex items-center justify-center gap-3">
                {copiedStates["cta-ip"] ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-red-700" />}
                СКОПИРОВАТЬ IP СЕРВЕРА
              </div>
            </div>
          </div>
          <div className="mt-6 text-red-900 tracking-wider" style={{ fontSize: 9 }}>{SERVER_ADDRESS}</div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${BR} bg-gray-950/50 py-8 px-6`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={MATRYOSHKA_IMG} alt="" style={{ width: 28, height: 28, imageRendering: "pixelated" }} />
            <span className="text-red-600 font-bold tracking-widest" style={{ fontSize: 9 }}>МАТ<span className="text-white">&amp;</span>РЕШКА</span>
            <span className="text-gray-800" style={{ fontSize: 9 }}>|</span>
            <span className="text-gray-700" style={{ fontSize: 9 }}>{SERVER_ADDRESS}</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: 9 }}>
            <div className={`w-2 h-2 ${onlineCount !== null && onlineCount > 0 ? "bg-green-700 animate-pulse" : "bg-red-900"}`} />
            <span className="text-gray-700">{onlineCount === null ? "Проверяем..." : onlineCount > 0 ? `${onlineCount} игроков онлайн` : "Недоступен"}</span>
          </div>
          <div className="text-gray-800" style={{ fontSize: 8 }}>Не является продуктом Mojang</div>
        </div>
      </footer>

      {/* Scroll top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 group transition-all duration-300 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <div className="absolute inset-0 border border-red-800 transition-all duration-300 group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-500/40" />
        <div className="relative border border-red-600 bg-black text-red-600 p-3 transition-all duration-300 group-hover:bg-red-950/50 transform translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:translate-y-0">
          <ArrowUp className="w-5 h-5" />
        </div>
      </button>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={u => setUser(u)} />}
      {showProfile && user && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
    </div>
  )
}
