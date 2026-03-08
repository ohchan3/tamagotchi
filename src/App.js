import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// SVG CHARACTER COMPONENTS (anime-style)
// ============================================================

const EggCharacter = ({ cracked = false, sick = false }) => (
  <svg viewBox="0 0 120 140" width="120" height="140">
    <defs>
      <radialGradient id="eggGrad" cx="40%" cy="35%">
        <stop offset="0%" stopColor={sick ? "#b0b0b0" : "#fffde7"} />
        <stop offset="100%" stopColor={sick ? "#787878" : "#ffe082"} />
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="78" rx="42" ry="54" fill="url(#eggGrad)" stroke={sick ? "#999" : "#f9a825"} strokeWidth="2" />
    {cracked && (
      <polyline points="45,55 55,68 42,75 58,88" fill="none" stroke={sick ? "#666" : "#e65100"} strokeWidth="2.5" strokeLinejoin="round" />
    )}
    {!sick && (
      <>
        <ellipse cx="48" cy="62" rx="5" ry="6" fill="#fff" opacity="0.7" />
        <ellipse cx="46" cy="60" rx="2" ry="2.5" fill="#5d4037" />
        <ellipse cx="72" cy="62" rx="5" ry="6" fill="#fff" opacity="0.7" />
        <ellipse cx="70" cy="60" rx="2" ry="2.5" fill="#5d4037" />
        <path d="M50 76 Q60 82 70 76" fill="none" stroke="#e65100" strokeWidth="1.8" strokeLinecap="round" />
      </>
    )}
    {sick && (
      <>
        <ellipse cx="48" cy="62" rx="5" ry="6" fill="#fff" opacity="0.5" />
        <line x1="45" y1="59" x2="51" y2="65" stroke="#888" strokeWidth="2" />
        <line x1="51" y1="59" x2="45" y2="65" stroke="#888" strokeWidth="2" />
        <ellipse cx="72" cy="62" rx="5" ry="6" fill="#fff" opacity="0.5" />
        <line x1="69" y1="59" x2="75" y2="65" stroke="#888" strokeWidth="2" />
        <line x1="75" y1="59" x2="69" y2="65" stroke="#888" strokeWidth="2" />
        <path d="M50 78 Q60 72 70 78" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round" />
        <text x="55" y="50" fontSize="16" textAnchor="middle">💫</text>
      </>
    )}
  </svg>
);

const BabyCharacter = ({ sick = false }) => (
  <svg viewBox="0 0 120 160" width="110" height="140">
    <defs>
      <radialGradient id="skinGrad" cx="40%" cy="35%">
        <stop offset="0%" stopColor={sick ? "#d4b8a0" : "#ffccbc"} />
        <stop offset="100%" stopColor={sick ? "#a08060" : "#ff8a65"} />
      </radialGradient>
    </defs>
    {/* body */}
    <ellipse cx="60" cy="118" rx="26" ry="22" fill={sick ? "#c5cae9" : "#e1f5fe"} />
    {/* head */}
    <circle cx="60" cy="72" r="32" fill="url(#skinGrad)" stroke={sick ? "#a08060" : "#ff8a65"} strokeWidth="1.5" />
    {/* hair */}
    <ellipse cx="60" cy="43" rx="28" ry="10" fill={sick ? "#888" : "#5d4037"} />
    {/* eyes */}
    {sick ? (
      <>
        <line x1="48" y1="68" x2="54" y2="74" stroke="#666" strokeWidth="2.5" />
        <line x1="54" y1="68" x2="48" y2="74" stroke="#666" strokeWidth="2.5" />
        <line x1="66" y1="68" x2="72" y2="74" stroke="#666" strokeWidth="2.5" />
        <line x1="72" y1="68" x2="66" y2="74" stroke="#666" strokeWidth="2.5" />
      </>
    ) : (
      <>
        <ellipse cx="51" cy="71" rx="6" ry="7" fill="#fff" />
        <ellipse cx="50" cy="70" rx="3" ry="3.5" fill="#3e2723" />
        <circle cx="51" cy="69" r="1" fill="#fff" />
        <ellipse cx="69" cy="71" rx="6" ry="7" fill="#fff" />
        <ellipse cx="68" cy="70" rx="3" ry="3.5" fill="#3e2723" />
        <circle cx="69" cy="69" r="1" fill="#fff" />
      </>
    )}
    {/* cheeks */}
    {!sick && <><ellipse cx="43" cy="77" rx="5" ry="3" fill="#ff8a80" opacity="0.5" /><ellipse cx="77" cy="77" rx="5" ry="3" fill="#ff8a80" opacity="0.5" /></>}
    {/* mouth */}
    {sick
      ? <path d="M52 84 Q60 80 68 84" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" />
      : <path d="M53 83 Q60 90 67 83" fill="none" stroke="#e53935" strokeWidth="1.8" strokeLinecap="round" />
    }
    {/* arms */}
    <ellipse cx="34" cy="115" rx="8" ry="14" fill="url(#skinGrad)" transform="rotate(-20,34,115)" />
    <ellipse cx="86" cy="115" rx="8" ry="14" fill="url(#skinGrad)" transform="rotate(20,86,115)" />
    {sick && <text x="60" y="55" fontSize="14" textAnchor="middle">🤒</text>}
  </svg>
);

const ChildCharacter = ({ stage, sick = false }) => {
  const hairColors = ["#5d4037", "#4a148c", "#bf360c", "#1a237e", "#33691e"];
  const hairColor = sick ? "#888" : hairColors[stage % hairColors.length];
  const outfitColors = {
    4: ["#e3f2fd", "#1565c0"],   // crawling - blue
    5: ["#f3e5f5", "#6a1b9a"],   // walking - purple
    6: ["#e8f5e9", "#2e7d32"],   // school - green
    7: ["#fff8e1", "#f57f17"],   // friends - yellow
    8: ["#fce4ec", "#c62828"],   // fashion - red
    9: ["#e0f7fa", "#00695c"],   // music - teal
    10: ["#fce4ec", "#ad1457"],  // love - pink
    11: ["#e8eaf6", "#283593"],  // travel - indigo
  };
  const [bg, accent] = outfitColors[stage] || ["#f5f5f5", "#616161"];

  return (
    <svg viewBox="0 0 120 200" width="110" height="160">
      <defs>
        <radialGradient id="faceGrad2" cx="40%" cy="35%">
          <stop offset="0%" stopColor={sick ? "#d4b8a0" : "#ffe0b2"} />
          <stop offset="100%" stopColor={sick ? "#a08060" : "#ffb74d"} />
        </radialGradient>
      </defs>
      {/* legs */}
      <rect x="44" y="148" width="14" height="36" rx="7" fill={sick ? "#b0bec5" : accent} />
      <rect x="62" y="148" width="14" height="36" rx="7" fill={sick ? "#b0bec5" : accent} />
      {/* shoes */}
      <ellipse cx="51" cy="184" rx="12" ry="6" fill={sick ? "#888" : "#37474f"} />
      <ellipse cx="69" cy="184" rx="12" ry="6" fill={sick ? "#888" : "#37474f"} />
      {/* body */}
      <rect x="36" y="102" width="48" height="50" rx="14" fill={sick ? "#cfd8dc" : bg} stroke={sick ? "#b0bec5" : accent} strokeWidth="1.5" />
      {/* arms */}
      <rect x="18" y="104" width="20" height="12" rx="6" fill={sick ? "#cfd8dc" : bg} stroke={sick ? "#b0bec5" : accent} strokeWidth="1" />
      <rect x="82" y="104" width="20" height="12" rx="6" fill={sick ? "#cfd8dc" : bg} stroke={sick ? "#b0bec5" : accent} strokeWidth="1" />
      {/* hands */}
      <circle cx="16" cy="110" r="8" fill="url(#faceGrad2)" />
      <circle cx="104" cy="110" r="8" fill="url(#faceGrad2)" />
      {/* neck */}
      <rect x="52" y="90" width="16" height="16" rx="6" fill="url(#faceGrad2)" />
      {/* head */}
      <circle cx="60" cy="68" r="34" fill="url(#faceGrad2)" stroke={sick ? "#a08060" : "#ffb74d"} strokeWidth="1.5" />
      {/* hair */}
      <ellipse cx="60" cy="38" rx="30" ry="14" fill={hairColor} />
      <ellipse cx="38" cy="55" rx="8" ry="18" fill={hairColor} />
      <ellipse cx="82" cy="55" rx="8" ry="18" fill={hairColor} />
      {/* eyes */}
      {sick ? (
        <>
          <line x1="47" y1="63" x2="55" y2="71" stroke="#666" strokeWidth="2.5" />
          <line x1="55" y1="63" x2="47" y2="71" stroke="#666" strokeWidth="2.5" />
          <line x1="65" y1="63" x2="73" y2="71" stroke="#666" strokeWidth="2.5" />
          <line x1="73" y1="63" x2="65" y2="71" stroke="#666" strokeWidth="2.5" />
        </>
      ) : (
        <>
          <ellipse cx="51" cy="67" rx="7" ry="8" fill="#fff" />
          <ellipse cx="50" cy="66" rx="3.5" ry="4" fill="#3e2723" />
          <circle cx="51.5" cy="64.5" r="1.2" fill="#fff" />
          <ellipse cx="69" cy="67" rx="7" ry="8" fill="#fff" />
          <ellipse cx="68" cy="66" rx="3.5" ry="4" fill="#3e2723" />
          <circle cx="69.5" cy="64.5" r="1.2" fill="#fff" />
        </>
      )}
      {!sick && <><ellipse cx="42" cy="74" rx="5" ry="3" fill="#ff8a80" opacity="0.5" /><ellipse cx="78" cy="74" rx="5" ry="3" fill="#ff8a80" opacity="0.5" /></>}
      {sick
        ? <path d="M50 80 Q60 75 70 80" fill="none" stroke="#999" strokeWidth="1.8" strokeLinecap="round" />
        : <path d="M51 80 Q60 88 69 80" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" />
      }
      {/* stage-specific accessories */}
      {stage === 6 && !sick && <rect x="46" y="88" width="28" height="14" rx="4" fill="#1565c0" opacity="0.7" />}
      {stage === 8 && !sick && <ellipse cx="60" cy="38" rx="28" ry="8" fill="#f48fb1" opacity="0.6" />}
      {stage === 9 && !sick && <text x="90" y="115" fontSize="20">🎵</text>}
      {stage === 10 && !sick && <text x="88" y="100" fontSize="18">💕</text>}
      {stage === 11 && !sick && <text x="90" y="115" fontSize="20">✈️</text>}
      {sick && <text x="60" y="45" fontSize="14" textAnchor="middle">🤒</text>}
    </svg>
  );
};

// ============================================================
// STAGE CONFIG
// ============================================================
const STAGES = [
  { id: 1, name: "たまご", minXP: 0, char: "egg" },
  { id: 2, name: "ひびが入った卵", minXP: 30, char: "egg_cracked" },
  { id: 3, name: "👶 赤ちゃん誕生", minXP: 80, char: "baby" },
  { id: 4, name: "🍼 ハイハイ", minXP: 150, char: "child" },
  { id: 5, name: "🚶 よちよち歩き", minXP: 240, char: "child" },
  { id: 6, name: "🎒 学校へ", minXP: 360, char: "child" },
  { id: 7, name: "👫 友達ができた", minXP: 500, char: "child" },
  { id: 8, name: "👗 おしゃれ", minXP: 660, char: "child" },
  { id: 9, name: "🎵 音楽を楽しむ", minXP: 840, char: "child" },
  { id: 10, name: "💕 恋人ができた", minXP: 1040, char: "child" },
  { id: 11, name: "✈️ 世界へ旅立ち", minXP: 1280, char: "child" },
];

const STAGE_MESSAGES = [
  "", "", "", "おめでとう！赤ちゃんが産まれた！🎉", "ハイハイ始めたよ〜！",
  "よちよち歩き！かわいい！", "学校に行き始めた！", "お友達ができたよ！",
  "おしゃれに目覚めた！", "音楽が大好き！", "素敵な恋が始まった！💕", "世界へ旅立ち！✈️ GOAL！"
];

const today = () => new Date().toISOString().slice(0, 10);

// ============================================================
// MAIN APP
// ============================================================
export default function HealthTamagotchi() {
  const [xp, setXp] = useState(0);
  const [health, setHealth] = useState(100);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("home");
  const [log, setLog] = useState({ steps: "", gym: 0, food: 3, sleep: "", foodImage: null, foodAnalysis: null, analyzing: false });
  const [message, setMessage] = useState("");
  const [stageUpMsg, setStageUpMsg] = useState("");
  const [particles, setParticles] = useState([]);
  const [charAnim, setCharAnim] = useState("idle");
  const [todayDone, setTodayDone] = useState(false);
  const fileRef = useRef();

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("hth_save");
        if (r) {
          const d = JSON.parse(r.value);
          setXp(d.xp ?? 0);
          setHealth(d.health ?? 100);
          setHistory(d.history ?? []);
          setTodayDone(d.lastDate === today());
        }
      } catch {}
    })();
  }, []);

  const save = useCallback(async (newXp, newHealth, newHistory) => {
    try {
      await window.storage.set("hth_save", JSON.stringify({
        xp: newXp, health: newHealth, history: newHistory, lastDate: today()
      }));
    } catch {}
  }, []);

  const stage = STAGES.reduce((acc, s) => (newXp => newXp >= s.minXP ? s : acc)(xp), STAGES[0]);
  const prevStage = useRef(stage.id);
  const nextStage = STAGES.find(s => s.minXP > xp);
  const progress = nextStage ? Math.min(100, ((xp - stage.minXP) / (nextStage.minXP - stage.minXP)) * 100) : 100;
  const sick = health < 30;

  const spawnParticles = () => {
    const ps = Array.from({ length: 24 }, (_, i) => ({
      id: i, x: 40 + Math.random() * 40, y: 50,
      vx: (Math.random() - 0.5) * 6, vy: -(2 + Math.random() * 5),
      color: ["#ff6b35","#ffd700","#ff69b4","#00e5ff","#69ff47"][i % 5],
      size: 6 + Math.random() * 8,
    }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 2000);
  };

  const calcXP = (data) => {
    let pts = 0;
    const steps = parseInt(data.steps) || 0;
    if (steps >= 10000) pts += 15; else if (steps >= 7000) pts += 10; else if (steps >= 3000) pts += 5; else pts -= 5;
    if (data.gym >= 2) pts += 20; else if (data.gym === 1) pts += 10; else pts -= 5;
    const foodPts = [0, -15, -8, 5, 12, 22][data.food] ?? 0;
    pts += foodPts;
    const sleep = parseFloat(data.sleep) || 0;
    if (sleep >= 7) pts += 15; else if (sleep >= 6) pts += 8; else if (sleep >= 5) pts += 2; else pts -= 10;
    return pts;
  };

  const analyzeFood = async () => {
    if (!log.foodImage) return;
    setLog(l => ({ ...l, analyzing: true, foodAnalysis: null }));
    try {
      const base64 = log.foodImage.split(",")[1];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
              { type: "text", text: `この食事の写真を栄養バランスの観点から分析してください。以下のJSON形式のみで返してください（余計な文字は不要）:
{"score":1〜5の数値,"summary":"1文の日本語コメント","good":"良い点（20字以内）","bad":"改善点（20字以内）"}
スコア基準: 1=とても悪い 2=悪い 3=普通 4=良い 5=最高` }
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setLog(l => ({ ...l, analyzing: false, foodAnalysis: parsed, food: parsed.score }));
    } catch {
      setLog(l => ({ ...l, analyzing: false, foodAnalysis: { score: 3, summary: "分析できませんでした", good: "—", bad: "—" } }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLog(l => ({ ...l, foodImage: ev.target.result, foodAnalysis: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!log.steps || !log.sleep) { setMessage("⚠️ 歩数と睡眠時間を入力してね！"); return; }
    const pts = calcXP(log);
    const newXp = Math.max(0, xp + pts);
    const newHealth = Math.max(0, Math.min(100, health + (pts > 0 ? 12 : -18)));
    const newHistory = [{ date: today(), steps: log.steps, gym: log.gym, food: log.food, sleep: log.sleep, pts }, ...history.slice(0, 13)];

    setCharAnim("jump");
    setTimeout(() => setCharAnim("idle"), 800);

    const newStage = STAGES.reduce((acc, s) => (newXp >= s.minXP ? s : acc), STAGES[0]);
    if (newStage.id > prevStage.current) {
      spawnParticles();
      setStageUpMsg(STAGE_MESSAGES[newStage.id] || `ステージアップ！${newStage.name}`);
      setTimeout(() => setStageUpMsg(""), 4000);
      prevStage.current = newStage.id;
    }

    setXp(newXp);
    setHealth(newHealth);
    setHistory(newHistory);
    setTodayDone(true);
    save(newXp, newHealth, newHistory);

    if (pts >= 40) setMessage("🌟 完璧な1日！どんどん成長するよ！");
    else if (pts >= 20) setMessage("✨ いい調子！継続が大事！");
    else if (pts > 0) setMessage("😊 まあまあ！もう少し頑張ろう！");
    else if (newHealth < 30) setMessage("🤒 体調が悪そう... 休んで回復しよう！");
    else setMessage("😟 今日は怠けちゃった... 明日頑張ろう！");

    setLog({ steps: "", gym: 0, food: 3, sleep: "", foodImage: null, foodAnalysis: null, analyzing: false });
  };

  const CharComponent = () => {
    if (stage.char === "egg") return <EggCharacter cracked={false} sick={sick} />;
    if (stage.char === "egg_cracked") return <EggCharacter cracked={true} sick={sick} />;
    if (stage.char === "baby") return <BabyCharacter sick={sick} />;
    return <ChildCharacter stage={stage.id} sick={sick} />;
  };

  const healthColor = health > 60 ? "#4caf50" : health > 30 ? "#ff9800" : "#f44336";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1a0533 0%, #2d0b5a 40%, #0d2461 100%)",
      fontFamily: "'Hiragino Maru Gothic Pro', 'M PLUS Rounded 1c', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 12px 40px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Stars BG */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: 2 + Math.random() * 3, height: 2 + Math.random() * 3,
            background: "#fff", borderRadius: "50%", opacity: 0.3 + Math.random() * 0.5,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-120px) scale(0.3);opacity:0} }
        @keyframes stageUp { 0%{transform:scale(0.5) translateY(20px);opacity:0} 50%{transform:scale(1.1);opacity:1} 100%{transform:scale(1);opacity:1} }
        @keyframes charJump { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-24px) scale(1.08)} 70%{transform:translateY(-10px) scale(0.97)} }
        @keyframes charIdle { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,107,53,0.4)} 50%{box-shadow:0 0 0 12px rgba(255,107,53,0)} }
      `}</style>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: "900", color: "#fff", margin: 0, letterSpacing: 3,
          textShadow: "0 0 20px rgba(255,182,255,0.8), 0 2px 4px rgba(0,0,0,0.5)" }}>
          ✨ わたしのたまごっち ✨
        </h1>
        <p style={{ color: "#c9b3e8", margin: "4px 0 0", fontSize: 12 }}>健康習慣でキャラクターを育てよう</p>
      </div>

      {/* Stage Up Banner */}
      {stageUpMsg && (
        <div style={{
          position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #ff6b35, #ffd700)",
          color: "#fff", padding: "16px 32px", borderRadius: 24,
          fontSize: 18, fontWeight: "bold", zIndex: 100,
          animation: "stageUp 0.5s ease forwards",
          boxShadow: "0 8px 32px rgba(255,215,0,0.5)",
          textAlign: "center", maxWidth: "80vw",
        }}>
          🎉 ステージアップ！<br />{stageUpMsg}
        </div>
      )}

      {/* Particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: "absolute", left: `${p.x}%`, top: "40%",
            width: p.size, height: p.size,
            background: p.color, borderRadius: "50%",
            animation: "floatUp 2s ease forwards",
            animationDelay: `${p.id * 0.05}s`,
          }} />
        ))}
      </div>

      {/* Character Card */}
      <div style={{
        position: "relative", zIndex: 2,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 32, padding: "24px 32px 20px",
        textAlign: "center", marginBottom: 16, width: "100%", maxWidth: 340,
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}>
        <div style={{
          animation: charAnim === "jump" ? "charJump 0.8s ease" : "charIdle 3s ease-in-out infinite",
          display: "inline-block",
        }}>
          <CharComponent />
        </div>

        <div style={{ color: "#fff", fontWeight: "bold", fontSize: 17, marginBottom: 2 }}>
          {sick ? "🤒 体調が悪い..." : stage.name}
        </div>
        <div style={{ color: "#c9b3e8", fontSize: 12, marginBottom: 14 }}>
          {sick ? "もっと体を大切にして！" : `ステージ ${stage.id} / 11`}
        </div>

        {/* XP Bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#c9b3e8", fontSize: 11, marginBottom: 4 }}>
            <span>⭐ XP {xp}</span>
            {nextStage && <span>次: {nextStage.minXP - xp} XP</span>}
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "linear-gradient(90deg, #ff6b35, #ffd700, #ff6b35)",
              backgroundSize: "200% auto",
              animation: "shimmer 2s linear infinite",
              borderRadius: 6, transition: "width 1s ease",
            }} />
          </div>
        </div>

        {/* Health Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#c9b3e8", fontSize: 11, marginBottom: 4 }}>
            <span>❤️ 体力</span><span>{health}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${health}%`,
              background: `linear-gradient(90deg, ${healthColor}, ${healthColor}88)`,
              borderRadius: 6, transition: "width 1s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          zIndex: 2, background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 16, padding: "10px 20px",
          color: "#fff", fontSize: 13, marginBottom: 14,
          backdropFilter: "blur(8px)",
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 16, zIndex: 2,
        background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: 6,
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        {[["home","🏠 ホーム"], ["log","📋 記録"], ["history","📊 履歴"], ["stages","🗺️ ステージ"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "8px 14px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 12,
            background: tab === id ? "linear-gradient(135deg, #ff6b35, #ffd700)" : "transparent",
            color: tab === id ? "#fff" : "#c9b3e8", fontWeight: tab === id ? "bold" : "normal",
            transition: "all 0.2s",
          }}>{label}</button>
        ))}
      </div>

      {/* ===== HOME TAB ===== */}
      {tab === "home" && (
        <div style={{ zIndex: 2, width: "100%", maxWidth: 340, textAlign: "center" }}>
          {todayDone ? (
            <div style={{
              background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.4)",
              borderRadius: 20, padding: 20, color: "#fff",
            }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>今日の記録完了！</div>
              <div style={{ fontSize: 13, color: "#a5d6a7" }}>また明日も頑張ろう！</div>
            </div>
          ) : (
            <button onClick={() => setTab("log")} style={{
              width: "100%", padding: "16px", borderRadius: 20, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #ff6b35, #ffd700)",
              color: "#fff", fontSize: 17, fontWeight: "bold",
              boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
              animation: "pulse 2s ease-in-out infinite",
            }}>
              📋 今日の記録をつける
            </button>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {[["⭐ 合計XP", xp], ["❤️ 体力", `${health}%`], ["📅 記録日数", history.length], ["🏆 ステージ", `${stage.id}/11`]].map(([label, val]) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 10px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <div style={{ color: "#c9b3e8", fontSize: 11 }}>{label}</div>
                <div style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== LOG TAB ===== */}
      {tab === "log" && (
        <div style={{ zIndex: 2, width: "100%", maxWidth: 340 }}>
          <div style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 24, padding: 20,
            backdropFilter: "blur(12px)",
          }}>
            <h2 style={{ color: "#fff", fontSize: 15, margin: "0 0 16px", textAlign: "center" }}>
              📋 今日の記録 ({today()})
            </h2>

            {/* Steps */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#c9b3e8", fontSize: 13, display: "block", marginBottom: 6 }}>👟 歩数</label>
              <input type="number" placeholder="例: 8000" value={log.steps}
                onChange={e => setLog(l => ({ ...l, steps: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)", color: "#fff",
                  fontSize: 15, boxSizing: "border-box",
                }} />
            </div>

            {/* Gym */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#c9b3e8", fontSize: 13, display: "block", marginBottom: 6 }}>🏋️ 運動</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: 0, label: "なし" }, { v: 1, label: "少し" }, { v: 2, label: "しっかり" }].map(({ v, label }) => (
                  <button key={v} onClick={() => setLog(l => ({ ...l, gym: v }))} style={{
                    flex: 1, padding: "10px 4px", borderRadius: 12, border: "none", cursor: "pointer",
                    background: log.gym === v ? "linear-gradient(135deg,#ff6b35,#ffd700)" : "rgba(255,255,255,0.08)",
                    color: log.gym === v ? "#fff" : "#c9b3e8", fontSize: 13, fontWeight: log.gym === v ? "bold" : "normal",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.2s",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Food */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#c9b3e8", fontSize: 13, display: "block", marginBottom: 6 }}>🥗 食事バランス</label>

              {/* Photo Upload */}
              <div style={{
                border: "1.5px dashed rgba(255,255,255,0.2)", borderRadius: 14,
                padding: 12, marginBottom: 10, textAlign: "center",
              }}>
                {log.foodImage ? (
                  <>
                    <img src={log.foodImage} alt="food" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 10, marginBottom: 8 }} />
                    {log.foodAnalysis ? (
                      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 10 }}>
                        <div style={{ color: "#ffd700", fontSize: 18, marginBottom: 4 }}>
                          {"⭐".repeat(log.foodAnalysis.score)}{"☆".repeat(5 - log.foodAnalysis.score)}
                        </div>
                        <div style={{ color: "#fff", fontSize: 13, marginBottom: 4 }}>{log.foodAnalysis.summary}</div>
                        <div style={{ color: "#a5d6a7", fontSize: 12 }}>✅ {log.foodAnalysis.good}</div>
                        <div style={{ color: "#ef9a9a", fontSize: 12 }}>⚠️ {log.foodAnalysis.bad}</div>
                      </div>
                    ) : (
                      <button onClick={analyzeFood} disabled={log.analyzing} style={{
                        padding: "8px 20px", borderRadius: 12, border: "none", cursor: "pointer",
                        background: log.analyzing ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#7c4dff,#00e5ff)",
                        color: "#fff", fontSize: 13, fontWeight: "bold",
                      }}>
                        {log.analyzing ? "🔍 AI分析中..." : "🤖 AIで食事を分析"}
                      </button>
                    )}
                  </>
                ) : (
                  <div>
                    <div style={{ color: "#c9b3e8", fontSize: 13, marginBottom: 8 }}>📷 食事の写真をアップロード</div>
                    <button onClick={() => fileRef.current?.click()} style={{
                      padding: "8px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.08)", color: "#c9b3e8", cursor: "pointer", fontSize: 13,
                    }}>写真を選ぶ</button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                  </div>
                )}
              </div>

              {/* Manual score */}
              <div style={{ display: "flex", gap: 6 }}>
                {[{ v: 1, e: "😞" }, { v: 2, e: "😕" }, { v: 3, e: "😐" }, { v: 4, e: "🙂" }, { v: 5, e: "😄" }].map(({ v, e }) => (
                  <button key={v} onClick={() => setLog(l => ({ ...l, food: v }))} style={{
                    flex: 1, padding: "10px 2px", borderRadius: 12, border: "none", cursor: "pointer",
                    fontSize: 22,
                    background: log.food === v ? "linear-gradient(135deg,#ff6b35,#ffd700)" : "rgba(255,255,255,0.08)",
                    transform: log.food === v ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.2s",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>{e}</button>
                ))}
              </div>
              <div style={{ color: "#c9b3e8", fontSize: 11, textAlign: "center", marginTop: 4 }}>
                または手動で5段階評価
              </div>
            </div>

            {/* Sleep */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#c9b3e8", fontSize: 13, display: "block", marginBottom: 6 }}>😴 睡眠時間（時間）</label>
              <input type="number" step="0.5" placeholder="例: 7.5" value={log.sleep}
                onChange={e => setLog(l => ({ ...l, sleep: e.target.value }))}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)", color: "#fff",
                  fontSize: 15, boxSizing: "border-box",
                }} />
            </div>

            <button onClick={handleSubmit} style={{
              width: "100%", padding: "14px", borderRadius: 16, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #ff6b35 0%, #ffd700 100%)",
              color: "#fff", fontSize: 16, fontWeight: "bold",
              boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
              transition: "transform 0.1s",
            }}
              onMouseDown={e => e.target.style.transform = "scale(0.97)"}
              onMouseUp={e => e.target.style.transform = "scale(1)"}
            >
              ✨ 記録して成長させる！
            </button>
          </div>
        </div>
      )}

      {/* ===== HISTORY TAB ===== */}
      {tab === "history" && (
        <div style={{ zIndex: 2, width: "100%", maxWidth: 340 }}>
          {history.length === 0 ? (
            <div style={{ color: "#c9b3e8", textAlign: "center", padding: 30 }}>
              記録がまだありません。<br />記録タブから入力してみよう！
            </div>
          ) : history.map((h, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16, padding: "14px 16px", marginBottom: 10,
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#ffd700", fontSize: 13, fontWeight: "bold" }}>📅 {h.date}</span>
                <span style={{
                  color: h.pts >= 0 ? "#a5d6a7" : "#ef9a9a",
                  fontSize: 14, fontWeight: "bold",
                }}>
                  {h.pts >= 0 ? `+${h.pts}` : h.pts} XP
                </span>
              </div>
              <div style={{ display: "flex", gap: 12, color: "#c9b3e8", fontSize: 13 }}>
                <span>👟 {h.steps}歩</span>
                <span>🏋️ {["なし", "少し", "しっかり"][h.gym]}</span>
                <span>🥗 {"😞😕😐🙂😄"[h.food - 1]}</span>
                <span>😴 {h.sleep}h</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== STAGES TAB ===== */}
      {tab === "stages" && (
        <div style={{ zIndex: 2, width: "100%", maxWidth: 340 }}>
          {STAGES.map(s => {
            const unlocked = xp >= s.minXP;
            const isCurrent = stage.id === s.id;
            return (
              <div key={s.id} style={{
                background: isCurrent ? "rgba(255,107,53,0.2)" : unlocked ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.04)",
                border: isCurrent ? "1.5px solid #ff6b35" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: "12px 16px", marginBottom: 8,
                display: "flex", alignItems: "center", gap: 12,
                opacity: unlocked ? 1 : 0.5,
              }}>
                <div style={{ fontSize: 24, minWidth: 34 }}>
                  {unlocked ? "✅" : "🔒"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: isCurrent ? "#ffd700" : unlocked ? "#fff" : "#666", fontWeight: "bold", fontSize: 14 }}>
                    {s.id}. {s.name}
                  </div>
                  <div style={{ color: "#c9b3e8", fontSize: 11 }}>
                    必要XP: {s.minXP}
                  </div>
                </div>
                {isCurrent && (
                  <div style={{ background: "linear-gradient(135deg,#ff6b35,#ffd700)", color: "#fff", fontSize: 11, fontWeight: "bold", padding: "3px 10px", borderRadius: 20 }}>
                    NOW
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
