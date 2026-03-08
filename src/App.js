import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";

// ============================================================
// STAGE CONFIG - 画像を使用
// ============================================================
const STAGES = [
  { id: 1,  name: "👶 赤ちゃん誕生",  minXP: 0,    img: "/stage1.png" },
  { id: 2,  name: "🍼 ハイハイ",       minXP: 80,   img: "/stage2.png" },
  { id: 3,  name: "🚶 よちよち歩き",   minXP: 180,  img: "/stage3.png" },
  { id: 4,  name: "🧒 3歳児",          minXP: 300,  img: "/stage4.png" },
  { id: 5,  name: "🎒 小学生",         minXP: 440,  img: "/stage5.png" },
  { id: 6,  name: "👫 友達ができる",   minXP: 600,  img: "/stage6.png" },
  { id: 7,  name: "👗 おしゃれ",       minXP: 780,  img: "/stage7.png" },
  { id: 8,  name: "🎵 音楽",           minXP: 980,  img: "/stage8.png" },
  { id: 9,  name: "🎓 大学生",         minXP: 1200, img: "/stage9.png" },
  { id: 10, name: "💕 彼氏ができる",   minXP: 1440, img: "/stage10.png" },
  { id: 11, name: "✈️ 旅立ち",         minXP: 1700, img: "/stage11.png" },
];

const STAGE_MESSAGES = [
  "", "👶 赤ちゃんが誕生した！", "ハイハイ始めたよ〜！かわいい！",
  "よちよち歩き！がんばれ！", "3歳になったよ！", "小学校に入学！",
  "お友達ができたよ！", "おしゃれに目覚めた！", "音楽が大好き！",
  "大学生になった！🎓", "素敵な恋が始まった！💕", "世界へ旅立ち！✈️ GOAL！"
];

const today = () => new Date().toISOString().slice(0, 10);

// ============================================================
// CHARACTER DISPLAY - 画像表示コンポーネント
// ============================================================
const CharacterImage = ({ imgSrc, sick, animClass }) => (
  <div style={{
    width: 160, height: 160,
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  }}>
    <img
      src={imgSrc}
      alt="character"
      style={{
        width: "100%", height: "100%",
        objectFit: "contain",
        filter: sick ? "grayscale(0.7) brightness(0.8)" : "drop-shadow(0 4px 12px rgba(244,143,177,0.4))",
        transition: "filter 0.5s",
      }}
    />
    {sick && (
      <div style={{ position: "absolute", top: 0, right: 0, fontSize: 28 }}>🤒</div>
    )}
  </div>
);

// ============================================================
// MAIN APP
// ============================================================
export default function HealthTamagotchi() {
  const [xp, setXp] = useState(0);
  const [health, setHealth] = useState(100);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("home");
  const [log, setLog] = useState({ steps: "", gym: 0, food: 3, sleep: "" });
  const [message, setMessage] = useState("");
  const [stageUpMsg, setStageUpMsg] = useState("");
  const [particles, setParticles] = useState([]);
  const [charAnim, setCharAnim] = useState("idle");
  const [todayDone, setTodayDone] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hth_save");
      if (saved) {
        const d = JSON.parse(saved);
        setXp(d.xp ?? 0);
        setHealth(d.health ?? 100);
        setHistory(d.history ?? []);
        setTodayDone(d.lastDate === today());
      }
    } catch {}
  }, []);

  const save = useCallback((newXp, newHealth, newHistory) => {
    try {
      localStorage.setItem("hth_save", JSON.stringify({
        xp: newXp, health: newHealth, history: newHistory, lastDate: today()
      }));
    } catch {}
  }, []);

  const stage = STAGES.reduce((acc, s) => (xp >= s.minXP ? s : acc), STAGES[0]);
  const prevStage = useRef(stage.id);
  const nextStage = STAGES.find(s => s.minXP > xp);
  const progress = nextStage ? Math.min(100, ((xp - stage.minXP) / (nextStage.minXP - stage.minXP)) * 100) : 100;
  const sick = health < 30;

  // セリフを記録内容に応じて生成
  const getSpeech = () => {
    if (sick) return "😰 うぅ...体がしんどいよ...もっと大切にして...";
    if (history.length === 0) return "🌸 はじめまして！毎日記録してね！一緒に成長しよう💕";
    const last = history[0];
    const steps = parseInt(last.steps) || 0;
    const sleep = parseFloat(last.sleep) || 0;
    const food = last.food;
    const gym = last.gym;

    // 歩数に応じたセリフ
    if (steps >= 10000 && gym >= 2) return "💪 すごい！歩数もジムも完璧！あなたって最高！";
    if (steps >= 10000) return `🎉 ${steps.toLocaleString()}歩も歩いたの！？えらすぎる！`;
    if (steps >= 7000) return `✨ ${steps.toLocaleString()}歩！いい感じ！もう少しで1万歩だよ！`;
    if (steps < 3000) return "🥺 今日はあまり歩かなかったね...明日は外に出てみよう！";

    // 睡眠に応じたセリフ
    if (sleep >= 8) return `😴 ${sleep}時間もぐっすり眠れたんだね！最高の睡眠！`;
    if (sleep < 5) return `😨 ${sleep}時間しか寝てないの！？もっと寝なきゃダメだよ！`;
    if (sleep < 6) return `😟 睡眠${sleep}時間は少し短いな...早く寝てね💤`;

    // 食事に応じたセリフ
    if (food === 5) return "🥗 食事のバランス完璧！体の中からキレイになってるよ！";
    if (food === 4) return "😊 食事いい感じ！野菜たくさん食べてくれてありがとう！";
    if (food <= 2) return "🍔 食事のバランスが気になるな...野菜も食べてね！";

    // 運動に応じたセリフ
    if (gym === 2) return "🏋️ しっかり運動してくれたんだね！体が喜んでるよ！";
    if (gym === 0) return "🌟 今日もよく頑張ったね！明日も一緒に頑張ろう！";

    // ステージに応じたセリフ
    const stageSpeech = [
      "", "ばぶばぶ〜！毎日記録してね💕", "はいはーい！今日もよろしく！",
      "よちよち...一歩ずつ頑張るね！", "わーい！元気いっぱいだよ！",
      "今日も学校楽しかった！", "友達と一緒だと楽しいな！",
      "今日のコーデどうかな？", "音楽って最高！",
      "大学生活エンジョイ中！", "恋って素敵✨", "世界は広いな〜！"
    ];
    return stageSpeech[stage.id] || "今日も一緒に頑張ろう！💕";
  };

  const spawnParticles = () => {
    const ps = Array.from({ length: 30 }, (_, i) => ({ id: i, x: 30 + Math.random() * 40 }));
    setParticles(ps);
    setTimeout(() => setParticles([]), 2500);
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

  const handleSubmit = () => {
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

    setXp(newXp); setHealth(newHealth); setHistory(newHistory); setTodayDone(true);
    save(newXp, newHealth, newHistory);

    if (pts >= 40) setMessage("🌟 完璧な1日！どんどん成長するよ！");
    else if (pts >= 20) setMessage("✨ いい調子！継続が大事！");
    else if (pts > 0) setMessage("😊 まあまあ！もう少し頑張ろう！");
    else if (newHealth < 30) setMessage("🤒 体調が悪そう... 休んで回復しよう！");
    else setMessage("😟 今日は怠けちゃった... 明日頑張ろう！");

    setLog({ steps: "", gym: 0, food: 3, sleep: "" });
  };

  const healthColor = health > 60 ? "#ec407a" : health > 30 ? "#ff9800" : "#f44336";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fce4ec 0%, #f8bbd0 30%, #e1bee7 65%, #c5cae9 100%)",
      fontFamily: "'Hiragino Maru Gothic Pro', 'M PLUS Rounded 1c', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 12px 40px",
      position: "relative", overflow: "hidden",
    }}>
      {/* floating decorations */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${5 + Math.random() * 90}%`, top: `${Math.random() * 100}%`,
            fontSize: 10 + Math.random() * 14, opacity: 0.1 + Math.random() * 0.15,
            animation: `floatHeart ${4 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}>
            {["💕","⭐","✨","🌸","💫"][i % 5]}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatHeart { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
        @keyframes floatUp { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(-140px) scale(0.2);opacity:0} }
        @keyframes stageUp { 0%{transform:scale(0.5) translateY(20px);opacity:0} 60%{transform:scale(1.12);opacity:1} 100%{transform:scale(1);opacity:1} }
        @keyframes charJump { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-28px) scale(1.1)} 70%{transform:translateY(-12px) scale(0.97)} }
        @keyframes charIdle { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-8px) rotate(1deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(236,64,122,0.4)} 50%{box-shadow:0 0 0 14px rgba(236,64,122,0)} }
      `}</style>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: "900", color: "#ad1457", margin: 0, letterSpacing: 2,
          textShadow: "0 2px 8px rgba(255,128,171,0.5), 2px 2px 0 #fff" }}>
          🌸 さくら日和 🌸
        </h1>
        <p style={{ color: "#ec407a", margin: "4px 0 0", fontSize: 12, fontWeight: "bold" }}>健康習慣でキャラクターを育てよう✨</p>
      </div>

      {/* Stage Up Banner */}
      {stageUpMsg && (
        <div style={{
          position: "fixed", top: "18%", left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #f48fb1, #ffd700)",
          color: "#fff", padding: "18px 36px", borderRadius: 28,
          fontSize: 18, fontWeight: "bold", zIndex: 100,
          animation: "stageUp 0.5s ease forwards",
          boxShadow: "0 8px 32px rgba(244,143,177,0.6)",
          textAlign: "center", maxWidth: "80vw",
        }}>
          🎉 ステージアップ！<br />{stageUpMsg}
        </div>
      )}

      {/* Particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: "absolute", left: `${p.x}%`, top: "35%",
            fontSize: 18 + Math.random() * 10,
            animation: "floatUp 2.5s ease forwards",
            animationDelay: `${p.id * 0.06}s`,
          }}>
            {["💕","⭐","🌸","✨","🎀"][p.id % 5]}
          </div>
        ))}
      </div>

      {/* Character Card */}
      <div style={{
        position: "relative", zIndex: 2,
        background: "rgba(255,255,255,0.65)",
        border: "2px solid rgba(244,143,177,0.3)",
        borderRadius: 36, padding: "20px 28px 18px",
        textAlign: "center", marginBottom: 14, width: "100%", maxWidth: 340,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(236,64,122,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}>
        {/* 吹き出し */}
        <div style={{
          position: "relative", display: "inline-block",
          background: "#fff", border: "2px solid #f48fb1",
          borderRadius: 18, padding: "10px 16px", marginBottom: 12,
          fontSize: 13, color: "#ad1457", fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(244,143,177,0.25)",
          maxWidth: 260, lineHeight: 1.5,
        }}>
          {getSpeech()}
          {/* 吹き出しの三角 */}
          <div style={{
            position: "absolute", bottom: -12, left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "12px solid #f48fb1",
          }} />
          <div style={{
            position: "absolute", bottom: -9, left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "10px solid #fff",
          }} />
        </div>

        <div style={{
          animation: charAnim === "jump" ? "charJump 0.8s ease" : "charIdle 3.5s ease-in-out infinite",
          display: "inline-block",
        }}>
          <CharacterImage imgSrc={stage.img} sick={sick} />
        </div>

        <div style={{ color: "#ad1457", fontWeight: "900", fontSize: 17, marginBottom: 2 }}>
          {sick ? "🤒 体調が悪い..." : stage.name}
        </div>
        <div style={{ color: "#ec407a", fontSize: 12, marginBottom: 14 }}>
          {sick ? "もっと体を大切にして！" : `ステージ ${stage.id} / 11 💕`}
        </div>

        {/* XP Bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#ad1457", fontSize: 11, marginBottom: 4 }}>
            <span>⭐ XP {xp}</span>
            {nextStage && <span>次: {nextStage.minXP - xp} XP</span>}
          </div>
          <div style={{ height: 10, background: "rgba(244,143,177,0.2)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "linear-gradient(90deg, #f48fb1, #ffd700, #f48fb1)",
              backgroundSize: "200% auto",
              animation: "shimmer 2s linear infinite",
              borderRadius: 8, transition: "width 1s ease",
            }} />
          </div>
        </div>

        {/* Health Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#ad1457", fontSize: 11, marginBottom: 4 }}>
            <span>❤️ 体力</span><span>{health}%</span>
          </div>
          <div style={{ height: 10, background: "rgba(244,143,177,0.2)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${health}%`,
              background: `linear-gradient(90deg, ${healthColor}, ${healthColor}88)`,
              borderRadius: 8, transition: "width 1s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          zIndex: 2, background: "rgba(255,255,255,0.75)",
          border: "1.5px solid rgba(244,143,177,0.4)",
          borderRadius: 18, padding: "10px 20px",
          color: "#ad1457", fontSize: 13, fontWeight: "bold", marginBottom: 14,
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 14, zIndex: 2,
        background: "rgba(255,255,255,0.6)", borderRadius: 18, padding: 6,
        border: "1.5px solid rgba(244,143,177,0.2)",
      }}>
        {[["home","🏠"], ["log","📋"], ["history","📊"], ["stages","🗺️"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "8px 14px", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 13,
            background: tab === id ? "linear-gradient(135deg, #f48fb1, #ffd700)" : "transparent",
            color: tab === id ? "#fff" : "#ec407a", fontWeight: tab === id ? "bold" : "normal",
            transition: "all 0.2s",
            boxShadow: tab === id ? "0 2px 8px rgba(244,143,177,0.4)" : "none",
          }}>{label}</button>
        ))}
      </div>

      {/* HOME TAB */}
      {tab === "home" && (
        <div style={{ zIndex: 2, width: "100%", maxWidth: 340, textAlign: "center" }}>
          {todayDone ? (
            <div style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(244,143,177,0.3)", borderRadius: 24, padding: 20, color: "#ad1457" }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>🌸</div>
              <div style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>今日の記録完了！</div>
              <div style={{ fontSize: 13, color: "#ec407a" }}>また明日も頑張ろう！💕</div>
            </div>
          ) : (
            <button onClick={() => setTab("log")} style={{
              width: "100%", padding: "16px", borderRadius: 22, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #f48fb1, #ffd700)",
              color: "#fff", fontSize: 17, fontWeight: "bold",
              boxShadow: "0 4px 20px rgba(244,143,177,0.5)",
              animation: "pulse 2s ease-in-out infinite",
            }}>
              📋 今日の記録をつける
            </button>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {[["⭐ 合計XP", xp], ["❤️ 体力", `${health}%`], ["📅 記録日数", history.length], ["🏆 ステージ", `${stage.id}/11`]].map(([label, val]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.7)", borderRadius: 18, padding: "14px 10px", border: "1.5px solid rgba(244,143,177,0.2)" }}>
                <div style={{ color: "#ec407a", fontSize: 11 }}>{label}</div>
                <div style={{ color: "#ad1457", fontSize: 20, fontWeight: "bold" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOG TAB */}
      {tab === "log" && (
        <div style={{ zIndex: 2, width: "100%", maxWidth: 340 }}>
          <div style={{ background: "rgba(255,255,255,0.72)", border: "1.5px solid rgba(244,143,177,0.25)", borderRadius: 28, padding: 20 }}>
            <h2 style={{ color: "#ad1457", fontSize: 15, margin: "0 0 16px", textAlign: "center" }}>
              📋 今日の記録 ({today()})
            </h2>

            {[
              { label: "👟 歩数", key: "steps", placeholder: "例: 8000" },
              { label: "😴 睡眠時間（時間）", key: "sleep", placeholder: "例: 7.5", step: "0.5" },
            ].map(({ label, key, placeholder, step }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ color: "#ec407a", fontSize: 13, display: "block", marginBottom: 6, fontWeight: "bold" }}>{label}</label>
                <input type="number" step={step} placeholder={placeholder} value={log[key]}
                  onChange={e => setLog(l => ({ ...l, [key]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 14, border: "1.5px solid rgba(244,143,177,0.4)", background: "rgba(255,255,255,0.8)", color: "#ad1457", fontSize: 15, boxSizing: "border-box" }} />
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <label style={{ color: "#ec407a", fontSize: 13, display: "block", marginBottom: 6, fontWeight: "bold" }}>🏋️ 運動</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: 0, label: "なし" }, { v: 1, label: "少し" }, { v: 2, label: "しっかり" }].map(({ v, label }) => (
                  <button key={v} onClick={() => setLog(l => ({ ...l, gym: v }))} style={{
                    flex: 1, padding: "10px 4px", borderRadius: 14, border: `1.5px solid ${log.gym === v ? "transparent" : "rgba(244,143,177,0.3)"}`,
                    cursor: "pointer", background: log.gym === v ? "linear-gradient(135deg,#f48fb1,#ffd700)" : "rgba(255,255,255,0.8)",
                    color: log.gym === v ? "#fff" : "#ec407a", fontSize: 13, fontWeight: log.gym === v ? "bold" : "normal", transition: "all 0.2s",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#ec407a", fontSize: 13, display: "block", marginBottom: 6, fontWeight: "bold" }}>🥗 食事バランス</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ v: 1, e: "😞" }, { v: 2, e: "😕" }, { v: 3, e: "😐" }, { v: 4, e: "🙂" }, { v: 5, e: "😄" }].map(({ v, e }) => (
                  <button key={v} onClick={() => setLog(l => ({ ...l, food: v }))} style={{
                    flex: 1, padding: "10px 2px", borderRadius: 14, border: `1.5px solid ${log.food === v ? "transparent" : "rgba(244,143,177,0.3)"}`,
                    cursor: "pointer", fontSize: 22,
                    background: log.food === v ? "linear-gradient(135deg,#f48fb1,#ffd700)" : "rgba(255,255,255,0.8)",
                    transform: log.food === v ? "scale(1.15)" : "scale(1)", transition: "all 0.2s",
                  }}>{e}</button>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} style={{
              width: "100%", padding: "14px", borderRadius: 18, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #f48fb1 0%, #ffd700 100%)",
              color: "#fff", fontSize: 16, fontWeight: "bold",
              boxShadow: "0 4px 20px rgba(244,143,177,0.5)",
            }}>
              ✨ 記録して成長させる！
            </button>
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === "history" && (
        <div style={{ zIndex: 2, width: "100%", maxWidth: 340 }}>
          {history.length === 0 ? (
            <div style={{ color: "#ec407a", textAlign: "center", padding: 30, background: "rgba(255,255,255,0.6)", borderRadius: 24 }}>
              記録がまだありません。<br />記録タブから入力してみよう！🌸
            </div>
          ) : (
            <>
              {/* 睡眠グラフ */}
              <div style={{ background: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(244,143,177,0.25)", borderRadius: 24, padding: "16px 12px", marginBottom: 14 }}>
                <div style={{ color: "#ad1457", fontWeight: "bold", fontSize: 14, marginBottom: 12, textAlign: "center" }}>
                  😴 睡眠時間の記録（時間）
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={[...history].reverse().slice(-7).map(h => ({
                      date: h.date.slice(5),
                      sleep: parseFloat(h.sleep) || 0,
                    }))}
                    margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,143,177,0.2)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#ec407a" }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "#ec407a" }} />
                    <Tooltip
                      formatter={(v) => [`${v}時間`, "睡眠"]}
                      contentStyle={{ borderRadius: 12, border: "1.5px solid #f48fb1", background: "#fff" }}
                      labelStyle={{ color: "#ad1457", fontWeight: "bold" }}
                    />
                    <ReferenceLine y={7} stroke="#ffd700" strokeDasharray="4 4" label={{ value: "推奨7h", fill: "#f9a825", fontSize: 10 }} />
                    <Bar dataKey="sleep" fill="url(#sleepGrad)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f48fb1" />
                        <stop offset="100%" stopColor="#ce93d8" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ textAlign: "center", fontSize: 11, color: "#ec407a", marginTop: 4 }}>
                  ✨ 黄色の線が推奨睡眠時間（7時間）
                </div>
              </div>

              {/* 記録リスト */}
              {history.map((h, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(244,143,177,0.2)", borderRadius: 18, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#ad1457", fontSize: 13, fontWeight: "bold" }}>📅 {h.date}</span>
                    <span style={{ color: h.pts >= 0 ? "#4caf50" : "#f44336", fontSize: 14, fontWeight: "bold" }}>{h.pts >= 0 ? `+${h.pts}` : h.pts} XP</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, color: "#ec407a", fontSize: 13 }}>
                    <span>👟 {h.steps}歩</span>
                    <span>🏋️ {["なし","少し","しっかり"][h.gym]}</span>
                    <span>🥗 {"😞😕😐🙂😄"[h.food-1]}</span>
                    <span>😴 {h.sleep}h</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* STAGES TAB */}
      {tab === "stages" && (
        <div style={{ zIndex: 2, width: "100%", maxWidth: 340 }}>
          {STAGES.map(s => {
            const unlocked = xp >= s.minXP;
            const isCurrent = stage.id === s.id;
            return (
              <div key={s.id} style={{
                background: isCurrent ? "rgba(244,143,177,0.2)" : unlocked ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
                border: isCurrent ? "2px solid #f48fb1" : "1.5px solid rgba(244,143,177,0.2)",
                borderRadius: 18, padding: "10px 14px", marginBottom: 8,
                display: "flex", alignItems: "center", gap: 12,
                opacity: unlocked ? 1 : 0.5,
              }}>
                <img src={s.img} alt={s.name} style={{ width: 48, height: 48, objectFit: "contain", filter: unlocked ? "none" : "grayscale(1)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: isCurrent ? "#ad1457" : unlocked ? "#c2185b" : "#aaa", fontWeight: "bold", fontSize: 14 }}>
                    {s.id}. {s.name}
                  </div>
                  <div style={{ color: "#ec407a", fontSize: 11 }}>必要XP: {s.minXP}</div>
                </div>
                {isCurrent && (
                  <div style={{ background: "linear-gradient(135deg,#f48fb1,#ffd700)", color: "#fff", fontSize: 11, fontWeight: "bold", padding: "3px 10px", borderRadius: 20 }}>
                    NOW💕
                  </div>
                )}
                {!unlocked && <div style={{ fontSize: 20 }}>🔒</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
