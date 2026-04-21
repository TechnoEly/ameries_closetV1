import { useState, useRef, useMemo, useEffect } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

const API = "";

const DEFAULTS = {
  bg:          "#f5ede0",
  nav:         "#7a3b1e",
  bar:         "#c97c5d",
  accent:      "#c97c5d",
  panel:       "#faf3e8",
  panelBorder: "rgba(160,100,60,0.15)",
  text:        "#3d2314",
  subText:     "rgba(61,35,20,0.45)",
  grid:        "rgba(160,100,60,0.06)",
  font:        "Syne",
};

const FONTS = ["Syne","Inter","Roboto","Open Sans","Lato","Montserrat","Poppins","Raleway","Nunito","Playfair Display","Oswald"];

const PRESET_THEMES = {
  warm: {
    bg: "#f5ede0", nav: "#7a3b1e", bar: "#c97c5d", accent: "#c97c5d",
    panel: "#faf3e8", panelBorder: "rgba(160,100,60,0.15)",
    text: "#3d2314", subText: "rgba(61,35,20,0.45)", grid: "rgba(160,100,60,0.06)",
    font: "Syne",
  },
  dark: {
    bg: "#0d0d12", nav: "#1a0a2e", bar: "#6b21a8", accent: "#a855f7",
    panel: "#16102a", panelBorder: "rgba(168,85,247,0.22)",
    text: "#e2d9f3", subText: "rgba(226,217,243,0.42)", grid: "rgba(168,85,247,0.06)",
    font: "Syne",
  },
  sakura: {
    bg: "#fff0f5", nav: "#b5476e", bar: "#e88fac", accent: "#d45f8a",
    panel: "#fff5f8", panelBorder: "rgba(212,95,138,0.18)",
    text: "#5c2040", subText: "rgba(92,32,64,0.45)", grid: "rgba(212,95,138,0.06)",
    font: "Nunito",
  },
  cyber: {
    bg: "#060b18", nav: "#0b1628", bar: "#1d4ed8", accent: "#38bdf8",
    panel: "#0c1830", panelBorder: "rgba(56,189,248,0.2)",
    text: "#e0f2fe", subText: "rgba(224,242,254,0.42)", grid: "rgba(56,189,248,0.05)",
    font: "Oswald",
  },
};

const SHARED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@400;700;800&family=Roboto:wght@400;700;900&family=Open+Sans:wght@400;700;800&family=Lato:wght@400;700;900&family=Montserrat:wght@400;700;800&family=Poppins:wght@400;700;800&family=Raleway:wght@400;700;800&family=Nunito:wght@400;700;800&family=Playfair+Display:wght@400;700;800&family=Oswald:wght@400;700&family=DM+Mono:wght@400;500&family=Caveat:wght@500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #c97c5d66; border-radius: 4px; }
`;

function stableNum(str, salt = "") {
  let h = 5381;
  for (let c of str + salt) h = ((h << 5) + h) ^ c.charCodeAt(0);
  return (Math.abs(h) % 1000) / 1000;
}

function LoginScreen({ onSuccess, theme: t }) {
  const [mode,     setMode]     = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit() {
    if (!username.trim() || !password) {
      setError("Enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const res  = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Something went wrong."); return; }
      onSuccess(data.token, data.username);
    } catch {
      setError("Could not connect — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  const field = {
    width: "100%", padding: "12px 14px",
    background: "#fdf6ee",
    border: `1px solid ${t.panelBorder}`,
    borderRadius: 8,
    color: t.text, fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  };

  return (
    <>
      <style>{`${SHARED_STYLE} body { font-family: '${t.font}', sans-serif; }`}</style>
      <div style={{
        height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: t.bg, fontFamily: `'${t.font}', sans-serif`, padding: 20,
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, ${t.grid} 39px, ${t.grid} 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, ${t.grid} 39px, ${t.grid} 40px)
        `,
      }}>
        <div style={{
          background: "#fff9f0",
          border: `1px solid ${t.panelBorder}`,
          borderRadius: 20,
          width: "100%", maxWidth: 380,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(61,35,20,0.2)",
        }}>
          <div style={{ background: t.nav, padding: "28px 26px" }}>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,240,220,0.55)", textTransform: "uppercase", marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
              amerie's closet
            </p>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
          </div>

          <div style={{ padding: "28px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: t.accent, textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="your username"
                style={field}
                autoFocus
              />
            </div>

            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: t.accent, textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                style={field}
              />
            </div>

            {error && (
              <div style={{ fontSize: 12, color: "#d63031", padding: "9px 12px", background: "rgba(214,48,49,0.07)", borderRadius: 7, border: "1px solid rgba(214,48,49,0.2)" }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                borderRadius: 10, border: "none",
                background: loading ? t.subText : t.accent,
                color: "#fff", fontSize: 14, fontWeight: 800,
                cursor: loading ? "wait" : "pointer",
                fontFamily: "inherit", letterSpacing: "0.03em",
                transition: "background 0.15s",
              }}
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
            </button>

            <button
              onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(""); }}
              style={{
                background: "none", border: "none",
                color: t.subText, fontSize: 12,
                cursor: "pointer", fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.04em", textDecoration: "underline",
              }}
            >
              {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function PolaroidCard({ item, onDelete, onDragStart, onDragEnd, onSelect, beingDragged }) {
  const rot       = (stableNum(item.id, "r") * 18) - 9;
  const dy        = (stableNum(item.id, "y") * 16) - 8;
  const tapeAngle = stableNum(item.id, "ta") * 30 - 15;
  const tapeLeft  = 18 + stableNum(item.id, "tl") * 42;
  const tapeColors = ["#e8b87a","#d4907a","#c2d4a8","#f5c8b0","#a8c8d4","#d4b8c8"];
  const tapeColor  = tapeColors[Math.floor(stableNum(item.id, "tc") * tapeColors.length)];

  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.effectAllowed = "move"; onDragStart(item); }}
      onDragEnd={onDragEnd}
      onClick={() => onSelect && onSelect(item)}
      style={{
        position: "relative",
        background: "#fdfaf3",
        padding: "7px",
        flexShrink: 0,
        width: 96,
        transform: `rotate(${rot}deg) translateY(${dy}px)`,
        boxShadow: beingDragged ? "none" : "3px 5px 20px rgba(61,35,20,0.3)",
        opacity: beingDragged ? 0.2 : 1,
        cursor: "grab",
        userSelect: "none",
        transition: "opacity 0.2s, transform 0.15s",
        zIndex: 1,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.zIndex = 10;
        e.currentTarget.style.transform = `rotate(${rot * 0.4}deg) translateY(${dy - 4}px) scale(1.05)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.zIndex = 1;
        e.currentTarget.style.transform = `rotate(${rot}deg) translateY(${dy}px)`;
      }}
    >
      <div style={{
        position: "absolute", top: -8, left: `${tapeLeft}%`,
        width: 36, height: 13, background: tapeColor,
        opacity: 0.82, transform: `rotate(${tapeAngle}deg)`,
        borderRadius: 1,
      }} />
      <img
        src={item.imageUrl}
        alt={item.itemType}
        style={{ width: 82, height: 105, objectFit: "cover", objectPosition: "center top", display: "block", pointerEvents: "none" }}
        draggable={false}
      />
      <button
        onClick={e => { e.stopPropagation(); onDelete(item.id); }}
        style={{
          position: "absolute", top: -8, right: -8, width: 20, height: 20,
          background: "#d63031", border: "2.5px solid #fdfaf3", borderRadius: "50%",
          color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          lineHeight: 1, padding: 0, zIndex: 2,
        }}
      >×</button>
    </div>
  );
}

function ScatteredPanel({ label, items, draggedItem, onDragStart, onDragEnd, onDelete, onSelect, theme: t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14,
        borderBottom: `1px solid ${t.panelBorder}`, paddingBottom: 10, flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: t.text, letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontSize: 10, color: t.subText, fontFamily: "'DM Mono', monospace" }}>/{items.length}/</span>
      </div>
      <div style={{
        flex: 1, display: "flex", flexWrap: "wrap", gap: 20,
        alignContent: "flex-start", padding: "10px 6px",
        overflowY: "auto",
      }}>
        {items.length === 0 ? (
          <div style={{ padding: "16px 4px", color: t.subText, fontSize: 12, fontStyle: "italic", lineHeight: 1.6 }}>
            No {label.toLowerCase()} yet.<br />Add some ↑
          </div>
        ) : items.map(item => (
          <PolaroidCard
            key={item.id}
            item={item}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDelete={onDelete}
            onSelect={onSelect}
            beingDragged={draggedItem?.id === item.id}
          />
        ))}
      </div>
    </div>
  );
}

function DropZone({ zone, item, draggedItem, dragOverZone, onDrop, onDragOver, onDragLeave, theme: t }) {
  const isOver      = dragOverZone === zone;
  const expectedCat = zone === "top" ? "top" : "bottom";
  const canAccept   = draggedItem?.category === expectedCat;
  const wrongType   = isOver && draggedItem && !canAccept;

  const borderColor = wrongType ? "#d63031" : isOver && canAccept ? t.accent : t.panelBorder;
  const bgColor     = wrongType ? "rgba(214,48,49,0.07)" : isOver && canAccept ? `${t.accent}20` : "rgba(255,255,255,0.45)";

  return (
    <div
      onDragOver={e => { e.preventDefault(); onDragOver(zone); }}
      onDragLeave={onDragLeave}
      onDrop={() => onDrop(zone)}
      style={{
        position: "relative", width: "100%",
        border: `2px dashed ${borderColor}`, borderRadius: 10,
        background: bgColor, overflow: "hidden",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      {item ? (
        <>
          <img
            src={item.imageUrl}
            alt={item.itemType}
            style={{ width: "100%", height: "auto", display: "block", maxHeight: 320 }}
          />
          <button
            onClick={() => onDrop(zone === "top" ? "clear-top" : "clear-bottom")}
            style={{
              position: "absolute", top: 6, right: 6, width: 20, height: 20,
              background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%", color: "#fff", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >×</button>
        </>
      ) : (
        <div style={{ height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, pointerEvents: "none" }}>
          <svg width="32" height="32" viewBox="0 0 36 36" style={{ opacity: isOver && canAccept ? 1 : 0.2 }}>
            {zone === "top" ? (
              <path d="M7 8 L29 8 L36 13 L30 17 L30 32 L6 32 L6 17 L0 13 Z" fill={isOver && canAccept ? t.accent : t.text} />
            ) : (
              <path d="M3 3 L33 3 L34 18 L25 18 L24 33 L12 33 L11 18 L2 18 Z" fill={isOver && canAccept ? t.accent : t.text} />
            )}
          </svg>
          <p style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", color: wrongType ? "#d63031" : isOver && canAccept ? t.accent : t.subText, transition: "color 0.15s" }}>
            {wrongType ? "wrong zone!" : `drop ${zone} here`}
          </p>
        </div>
      )}
    </div>
  );
}

function MannequinCenter({ currentTop, currentBottom, draggedItem, dragOverZone, onDragOver, onDragLeave, onDrop, mannequinPhoto, onMannequinPhoto, theme: t }) {
  const photoRef = useRef();

  function handleDrop(zone) {
    if (zone === "clear-top")    { onDrop("clear-top"); return; }
    if (zone === "clear-bottom") { onDrop("clear-bottom"); return; }
    onDrop(zone);
  }

  const isTopOver    = dragOverZone === "top";
  const isBottomOver = dragOverZone === "bottom";
  const topWrong     = isTopOver    && draggedItem?.category !== "top";
  const bottomWrong  = isBottomOver && draggedItem?.category !== "bottom";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 300 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 8 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.2em", color: t.subText, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
          {mannequinPhoto ? "drag or tap clothing to try on →" : "← drag or tap to dress →"}
        </span>
        <button
          onClick={() => mannequinPhoto ? onMannequinPhoto(null) : photoRef.current.click()}
          style={{
            fontSize: 10, fontFamily: "'DM Mono', monospace", color: t.subText,
            background: "none", border: `1px solid ${t.panelBorder}`, borderRadius: 5,
            padding: "3px 8px", cursor: "pointer", letterSpacing: "0.05em", whiteSpace: "nowrap",
          }}
        >
          {mannequinPhoto ? "clear photo" : "+ upload your photo"}
        </button>
      </div>
      <input ref={photoRef} type="file" accept="image/*" onChange={e => {
        const f = e.target.files[0];
        if (f) onMannequinPhoto(URL.createObjectURL(f));
        e.target.value = "";
      }} style={{ display: "none" }} />

      {mannequinPhoto ? (
        /* ── TRY-ON MODE: clothing overlaid onto the user's photo ── */
        <div style={{ position: "relative", width: "100%", height: 480, borderRadius: 14, overflow: "hidden", border: `1px solid ${t.panelBorder}` }}>

          {/* User's full-body photo as base */}
          <img src={mannequinPhoto} alt="you" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />

          {/* Top clothing — torso area (leaves head visible above, waist below) */}
          <div
            onDragOver={e => { e.preventDefault(); onDragOver("top"); }}
            onDragLeave={onDragLeave}
            onDrop={() => handleDrop("top")}
            style={{
              position: "absolute", top: "18%", left: 0, right: 0, height: "36%",
              outline: topWrong ? "2px solid #d63031" : isTopOver && !topWrong ? `2px solid ${t.accent}` : "none",
              background: topWrong ? "rgba(214,48,49,0.18)" : isTopOver && !currentTop ? `${t.accent}28` : "transparent",
              overflow: "hidden", transition: "outline 0.12s, background 0.12s",
            }}
          >
            {currentTop ? (
              <>
                <img src={currentTop.imageUrl} alt="top"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
                <button onClick={() => handleDrop("clear-top")} style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>×</button>
                <div style={{ position: "absolute", bottom: 4, left: 8, pointerEvents: "none" }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Mono', monospace" }}>{currentTop.color} {currentTop.itemType}</span>
                </div>
              </>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>drag top here</span>
              </div>
            )}
          </div>

          {/* Bottom clothing — legs area (leaves feet visible below) */}
          <div
            onDragOver={e => { e.preventDefault(); onDragOver("bottom"); }}
            onDragLeave={onDragLeave}
            onDrop={() => handleDrop("bottom")}
            style={{
              position: "absolute", top: "52%", left: 0, right: 0, height: "36%",
              outline: bottomWrong ? "2px solid #d63031" : isBottomOver && !bottomWrong ? `2px solid ${t.accent}` : "none",
              background: bottomWrong ? "rgba(214,48,49,0.18)" : isBottomOver && !currentBottom ? `${t.accent}28` : "transparent",
              overflow: "hidden", transition: "outline 0.12s, background 0.12s",
            }}
          >
            {currentBottom ? (
              <>
                <img src={currentBottom.imageUrl} alt="bottom"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                />
                <button onClick={() => handleDrop("clear-bottom")} style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>×</button>
                <div style={{ position: "absolute", bottom: 4, left: 8, pointerEvents: "none" }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Mono', monospace" }}>{currentBottom.color} {currentBottom.itemType}</span>
                </div>
              </>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>drag bottom here</span>
              </div>
            )}
          </div>
        </div>

      ) : (
        /* ── DEFAULT MODE: two stacked drop zones ── */
        <>
          <p style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", color: currentTop ? t.accent : t.subText, textTransform: "uppercase", marginBottom: 4, alignSelf: "flex-start" }}>
            {currentTop ? `${currentTop.color} ${currentTop.itemType}` : "top"}
          </p>
          <div style={{ width: "100%" }}>
            <DropZone zone="top" item={currentTop} draggedItem={draggedItem} dragOverZone={dragOverZone}
              onDrop={handleDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} theme={t} />
          </div>
          <div style={{ height: 1, width: "80%", background: t.panelBorder, opacity: 0.3 }} />
          <div style={{ width: "100%" }}>
            <DropZone zone="bottom" item={currentBottom} draggedItem={draggedItem} dragOverZone={dragOverZone}
              onDrop={handleDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} theme={t} />
          </div>
          <p style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", color: currentBottom ? t.accent : t.subText, textTransform: "uppercase", marginTop: 4, alignSelf: "flex-start" }}>
            {currentBottom ? `${currentBottom.color} ${currentBottom.itemType}` : "bottom"}
          </p>
        </>
      )}
    </div>
  );
}

function AddItemModal({ onClose, onAdd, theme: t }) {
  const [category,   setCategory]   = useState("top");
  const [itemType,   setItemType]   = useState("");
  const [color,      setColor]      = useState("");
  const [imageFile,  setImageFile]  = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [error,      setError]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();


  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  }

  async function handleSubmit() {
    if (!imageFile)    { setError("A photo is required — snap or upload one."); return; }
    if (!itemType)     { setError("Select an item type."); return; }
    if (!color.trim()) { setError("Enter a color name."); return; }
    setSubmitting(true);
    try {
      await onAdd({ category, itemType, color: color.trim(), imageFile });
    } catch {
      setError("Could not save — is the backend running on port 8000?");
    } finally {
      setSubmitting(false);
    }
  }

  const field = {
    width: "100%", padding: "10px 14px", background: "#fdf6ee",
    border: `1px solid ${t.panelBorder}`, borderRadius: 8,
    color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(61,35,20,0.88)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: "#fff9f0", border: `1px solid ${t.panelBorder}`,
        borderRadius: 20, width: "100%", maxWidth: 410, overflow: "hidden",
        boxShadow: "0 32px 80px rgba(61,35,20,0.35)",
      }}>
        <div style={{ background: t.nav, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,240,220,0.55)", textTransform: "uppercase", marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>wardrobe / new</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Add Item</h2>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 15 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: t.accent, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Photo</label>
              <span style={{ fontSize: 10, color: "#d63031", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'DM Mono', monospace" }}>REQUIRED</span>
            </div>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: `2px dashed ${preview ? t.accent : error.includes("photo") ? "#d63031" : t.panelBorder}`,
                borderRadius: 12, cursor: "pointer", background: "#fdf6ee",
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: 96, padding: preview ? 10 : 20, transition: "border-color 0.15s",
              }}
            >
              {preview ? (
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={preview} alt="preview" style={{ height: 76, width: 76, objectFit: "cover", borderRadius: 6, boxShadow: "2px 3px 12px rgba(61,35,20,0.2)" }} />
                  <div>
                    <p style={{ fontSize: 12, color: t.accent }}>Photo ready</p>
                    <p style={{ fontSize: 10, color: t.subText, marginTop: 4 }}>Click to change</p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" style={{ margin: "0 auto 8px", display: "block" }}>
                    <rect x="1" y="5" width="28" height="22" rx="4" stroke={t.panelBorder} strokeWidth="1.5" />
                    <circle cx="20" cy="12" r="2.5" stroke={t.panelBorder} strokeWidth="1.5" />
                    <path d="M1 20 L9 13 L15 19 L20 15 L29 22" stroke={t.panelBorder} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="15" y1="1" x2="15" y2="9" stroke={t.accent} strokeWidth="2" strokeLinecap="round" />
                    <path d="M11 5 L15 1 L19 5" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p style={{ fontSize: 12, color: t.subText }}>Tap to upload photo</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: t.accent, textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>Category</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["top","bottom"].map(cat => (
                <button key={cat} onClick={() => { setCategory(cat); setItemType(""); }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 8,
                    border: `1px solid ${category === cat ? t.accent : t.panelBorder}`,
                    background: category === cat ? `${t.accent}18` : "#fdf6ee",
                    color: category === cat ? t.accent : t.subText,
                    fontWeight: category === cat ? 700 : 400, fontSize: 13,
                    cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit",
                    transition: "all 0.12s",
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: t.accent, textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>Type</label>
            <input
              value={itemType}
              onChange={e => setItemType(e.target.value)}
              placeholder="e.g. Button-up, Sundress, Cargo Pants…"
              style={field}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: t.accent, textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>Color</label>
            <input value={color} onChange={e => setColor(e.target.value)}
              placeholder="Navy, Cream, Forest Green…" style={field} />
          </div>

          {error && (
            <div style={{ fontSize: 12, color: "#d63031", padding: "9px 12px", background: "rgba(214,48,49,0.07)", borderRadius: 7, border: "1px solid rgba(214,48,49,0.2)" }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting} style={{
            width: "100%", padding: "13px", borderRadius: 10, border: "none",
            background: submitting ? t.subText : t.accent,
            color: "#fff", fontSize: 14, fontWeight: 800, cursor: submitting ? "wait" : "pointer",
            fontFamily: "inherit", letterSpacing: "0.03em",
            transition: "background 0.15s",
          }}>
            {submitting ? "Uploading…" : "Add to wardrobe →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: "#c97c5d", color: "#fff", padding: "10px 24px",
      borderRadius: 30, fontSize: 13, fontWeight: 800, zIndex: 2000,
      whiteSpace: "nowrap", fontFamily: "inherit", letterSpacing: "0.03em",
      boxShadow: "0 6px 24px rgba(61,35,20,0.3)",
    }}>
      {message}
    </div>
  );
}

function ThemePanel({ theme: t, onUpdate, bgImage, onBgImage, onClose }) {
  const bgRef = useRef();

  const row = (label, key) => (
    <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${t.panelBorder}` }}>
      <span style={{ fontSize: 12, color: t.text, fontFamily: "'DM Mono', monospace" }}>{label}</span>
      <input
        type="color"
        value={t[key]}
        onChange={e => onUpdate(key, e.target.value)}
        style={{ width: 36, height: 28, padding: 2, border: `1px solid ${t.panelBorder}`, borderRadius: 4, cursor: "pointer", background: "none" }}
      />
    </div>
  );

  return (
    <div style={{
      position: "fixed", right: 0, top: 0, bottom: 0, width: 260,
      background: t.panel, borderLeft: `1px solid ${t.panelBorder}`,
      zIndex: 900, padding: 20, overflowY: "auto",
      boxShadow: "-8px 0 32px rgba(61,35,20,0.15)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: t.text, fontFamily: "inherit", letterSpacing: "0.04em" }}>CUSTOMIZE</span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: t.subText, lineHeight: 1 }}>×</button>
      </div>

      <div style={{ padding: "0 0 14px", borderBottom: `1px solid ${t.panelBorder}`, marginBottom: 4 }}>
        <p style={{ fontSize: 10, color: t.subText, fontFamily: "'DM Mono', monospace", marginBottom: 10, letterSpacing: "0.1em" }}>PRESETS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { key: "warm",   label: "Warm",   swatches: ["#7a3b1e","#c97c5d","#f5ede0"] },
            { key: "dark",   label: "Dark",   swatches: ["#1a0a2e","#6b21a8","#a855f7"] },
            { key: "sakura", label: "Sakura", swatches: ["#b5476e","#e88fac","#fff0f5"] },
            { key: "cyber",  label: "Cyber",  swatches: ["#0b1628","#1d4ed8","#38bdf8"] },
          ].map(({ key, label, swatches }) => (
            <button key={key} onClick={() => onUpdate("__preset__", PRESET_THEMES[key])} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 8, border: `1px solid ${t.panelBorder}`,
              background: "none", cursor: "pointer", width: "100%", textAlign: "left",
              fontFamily: "inherit", transition: "background 0.12s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${t.accent}14`}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                {swatches.map((c, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c, border: "1px solid rgba(0,0,0,0.1)" }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: t.text, fontWeight: 700 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 10, color: t.subText, fontFamily: "'DM Mono', monospace", margin: "10px 0 4px", letterSpacing: "0.1em" }}>CUSTOM</p>
      {row("Background", "bg")}
      {row("Navigation", "nav")}
      {row("Accent / Buttons", "accent")}
      {row("Side Panels", "panel")}

      <div style={{ padding: "14px 0", borderBottom: `1px solid ${t.panelBorder}` }}>
        <p style={{ fontSize: 12, color: t.text, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Background Image</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => bgRef.current.click()}
            style={{ flex: 1, padding: "8px 0", background: t.accent, color: "#fff", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}
          >
            Upload Image
          </button>
          {bgImage && (
            <button
              onClick={() => onBgImage(null)}
              style={{ padding: "8px 10px", background: "none", border: `1px solid ${t.panelBorder}`, borderRadius: 6, fontSize: 11, cursor: "pointer", color: t.subText }}
            >
              Clear
            </button>
          )}
        </div>
        <input ref={bgRef} type="file" accept="image/*" onChange={e => {
          const f = e.target.files[0];
          if (f) onBgImage(URL.createObjectURL(f));
          e.target.value = "";
        }} style={{ display: "none" }} />
        {bgImage && (
          <img src={bgImage} alt="background preview" style={{ width: "100%", marginTop: 10, borderRadius: 8, height: 80, objectFit: "cover" }} />
        )}
      </div>

      <div style={{ padding: "14px 0", borderBottom: `1px solid ${t.panelBorder}` }}>
        <p style={{ fontSize: 12, color: t.text, fontFamily: "'DM Mono', monospace", marginBottom: 10 }}>Font</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {FONTS.map(font => (
            <button key={font} onClick={() => onUpdate("font", font)} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 11,
              fontFamily: `'${font}', sans-serif`,
              border: `1px solid ${t.font === font ? t.accent : t.panelBorder}`,
              background: t.font === font ? `${t.accent}18` : "none",
              color: t.font === font ? t.accent : t.subText,
              cursor: "pointer",
            }}>{font}</button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onUpdate("__reset__", null)}
        style={{ width: "100%", padding: "10px 0", marginTop: 16, background: "none", border: `1px solid ${t.panelBorder}`, borderRadius: 8, fontSize: 12, cursor: "pointer", color: t.subText, fontFamily: "inherit" }}
      >
        Reset to warm defaults
      </button>
    </div>
  );
}

function ClothesHanger({ item, onDelete, theme: t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 88, flexShrink: 0, position: "relative" }}>
      <svg width="88" height="42" viewBox="0 0 88 42">
        <path d="M44 3 C44 3, 51 3, 51 9.5 C51 16, 44 16, 44 16" stroke={t.nav} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <line x1="44" y1="16" x2="5"  y2="37" stroke={t.nav} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="44" y1="16" x2="83" y2="37" stroke={t.nav} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="2"  y1="39" x2="86" y2="39" stroke={t.nav} strokeWidth="3"   strokeLinecap="round"/>
      </svg>
      <img src={item.imageUrl} alt={item.itemType}
        style={{ width: 78, height: 104, objectFit: "cover", objectPosition: "center top", borderRadius: 6, boxShadow: "2px 3px 10px rgba(61,35,20,0.22)", marginTop: -1 }}
      />
      <p style={{ fontSize: 9, color: t.subText, fontFamily: "'DM Mono', monospace", marginTop: 5, textAlign: "center", letterSpacing: "0.04em", lineHeight: 1.4 }}>
        {item.color}<br/>{item.itemType}
      </p>
      <button onClick={() => onDelete(item.id)} style={{
        position: "absolute", top: 2, right: 2, width: 16, height: 16,
        background: "#d63031", border: "1.5px solid #fff9f0", borderRadius: "50%",
        color: "#fff", fontSize: 9, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
      }}>×</button>
    </div>
  );
}

function HangerRow({ label, items, onDelete, theme: t }) {
  const [page, setPage] = useState(0);
  const PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const visible  = items.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const canPrev  = page > 0;
  const canNext  = page < totalPages - 1;
  const showArrows = items.length > PER_PAGE;

  const arrowBtn = (enabled, onClick, label) => (
    <button onClick={onClick} disabled={!enabled} style={{
      width: 28, height: 28, borderRadius: "50%", border: `1px solid ${t.panelBorder}`,
      background: enabled ? t.panel : "transparent",
      color: enabled ? t.text : "transparent",
      cursor: enabled ? "pointer" : "default", fontSize: 11,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      transition: "all 0.12s",
    }}>{label}</button>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "18px 20px 10px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14, borderBottom: `1px solid ${t.panelBorder}`, paddingBottom: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 800, color: t.text, letterSpacing: "0.1em" }}>{label}</span>
        <span style={{ fontSize: 10, color: t.subText, fontFamily: "'DM Mono', monospace" }}>/{items.length}/</span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
        {showArrows && arrowBtn(canPrev, () => setPage(p => p - 1), "◄")}
        <div style={{ flex: 1, display: "flex", gap: 14, alignItems: "flex-start", justifyContent: showArrows ? "flex-start" : "center", flexWrap: "nowrap", overflowX: "hidden" }}>
          {items.length === 0
            ? <p style={{ color: t.subText, fontSize: 12, fontStyle: "italic", fontFamily: "'DM Mono', monospace" }}>No {label.toLowerCase()} yet — add some above.</p>
            : visible.map(item => <ClothesHanger key={item.id} item={item} onDelete={onDelete} theme={t} />)
          }
        </div>
        {showArrows && arrowBtn(canNext, () => setPage(p => p + 1), "►")}
      </div>
    </div>
  );
}

function OutfitViewModal({ outfit, items, mannequinPhoto, canPrev, canNext, onPrev, onNext, onDelete, onClose, index, total, theme: t }) {
  const top    = items.find(i => i.id === String(outfit.top_id));
  const bottom = items.find(i => i.id === String(outfit.bottom_id));
  if (!top || !bottom) return null;

  const navBtn = (label, enabled, onClick) => (
    <button onClick={onClick} disabled={!enabled} style={{
      padding: "9px 20px", borderRadius: 8, border: `1px solid ${t.panelBorder}`,
      background: enabled ? t.panel : "transparent",
      color: enabled ? t.text : t.subText,
      cursor: enabled ? "pointer" : "default",
      fontSize: 12, fontFamily: "inherit", fontWeight: 700,
      transition: "all 0.12s",
    }}>{label}</button>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(61,35,20,0.92)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff9f0", borderRadius: 20, overflow: "hidden", width: "100%", maxWidth: 500, boxShadow: "0 32px 80px rgba(61,35,20,0.4)", display: "flex", flexDirection: "column" }}>

        <div style={{ background: t.nav, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,240,220,0.55)", textTransform: "uppercase", marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>
              outfit {index + 1} of {total}
            </p>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              {top.color} {top.itemType} + {bottom.color} {bottom.itemType}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => onDelete(outfit.id)} style={{
              background: "rgba(214,48,49,0.22)", border: "1px solid rgba(214,48,49,0.35)",
              borderRadius: 6, padding: "5px 12px", color: "#ffccc7", fontSize: 10,
              cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em",
            }}>delete</button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>

        <div style={{ display: "flex", padding: 20, gap: 16 }}>
          {mannequinPhoto && (
            <img src={mannequinPhoto} alt="mannequin" style={{ width: 108, borderRadius: 12, objectFit: "cover", objectPosition: "top center", flexShrink: 0, boxShadow: "2px 4px 14px rgba(61,35,20,0.18)" }} />
          )}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {[[top, "TOP"], [bottom, "BOTTOM"]].map(([item, label]) => (
              <div key={label}>
                <p style={{ fontSize: 9, letterSpacing: "0.16em", color: t.accent, textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>{label}</p>
                <img src={item.imageUrl} alt={item.itemType} style={{ width: "100%", height: 185, objectFit: "cover", objectPosition: "center top", borderRadius: 10, boxShadow: "2px 3px 12px rgba(61,35,20,0.15)", display: "block" }} />
                <p style={{ fontSize: 11, color: t.subText, fontFamily: "'DM Mono', monospace", marginTop: 5 }}>{item.color} {item.itemType}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 20px 18px", display: "flex", justifyContent: "space-between" }}>
          {navBtn("← prev", canPrev, onPrev)}
          {navBtn("next →", canNext, onNext)}
        </div>
      </div>
    </div>
  );
}

function SavedOutfitCard({ outfit, items, mannequinPhoto, onDelete, onClick, theme: t }) {
  const top    = items.find(i => i.id === String(outfit.top_id));
  const bottom = items.find(i => i.id === String(outfit.bottom_id));
  if (!top || !bottom) return null;

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative", borderRadius: 10, overflow: "hidden",
        border: `1px solid ${t.panelBorder}`, background: "#fff9f0",
        display: "flex", flexShrink: 0, cursor: "pointer",
        transition: "box-shadow 0.15s, transform 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(61,35,20,0.2)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      {mannequinPhoto && (
        <img src={mannequinPhoto} alt="mannequin" style={{ width: 42, objectFit: "cover", objectPosition: "top center" }} />
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <img src={top.imageUrl}    alt="top"    style={{ width: "100%", height: 72, objectFit: "cover", objectPosition: "center top" }} />
        <img src={bottom.imageUrl} alt="bottom" style={{ width: "100%", height: 72, objectFit: "cover", objectPosition: "center top" }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 6px", background: "rgba(61,35,20,0.55)", textAlign: "center" }}>
        <span style={{ fontSize: 8, color: "rgba(255,246,238,0.8)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>tap to view</span>
      </div>
      <button onClick={e => { e.stopPropagation(); onDelete(outfit.id); }} style={{
        position: "absolute", top: 5, right: 5, width: 18, height: 18,
        background: "rgba(61,35,20,0.55)", border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "50%", color: "#fff", fontSize: 11, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>×</button>
    </div>
  );
}

function ClosetView({ tops, bottoms, items, savedOutfits, sharedWithMe, mannequinPhoto, onDelete, onDeleteOutfit, onDismissShare, onClose, theme: t }) {
  const [showShared,       setShowShared]       = useState(false);
  const [viewingOutfitIdx, setViewingOutfitIdx] = useState(null);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 500, fontFamily: "inherit",
      display: "flex", flexDirection: "column",
      background: t.bg,
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 39px, ${t.grid} 39px, ${t.grid} 40px),
        repeating-linear-gradient(90deg, transparent, transparent 39px, ${t.grid} 39px, ${t.grid} 40px)
      `,
    }}>
      {/* Header */}
      <div style={{ background: t.nav, height: 54, display: "flex", alignItems: "center", padding: "0 24px", flexShrink: 0, gap: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>My Closet</span>
        <span style={{ fontSize: 9, color: "rgba(255,240,220,0.5)", letterSpacing: "0.22em", textTransform: "uppercase", paddingTop: 3, fontFamily: "'DM Mono', monospace" }}>
          {tops.length + bottoms.length} items · {savedOutfits.length} outfits
        </span>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: Clothes racks */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t.panel + "88", borderRight: `1px solid ${t.panelBorder}` }}>
          <HangerRow label="TOPS"    items={tops}    onDelete={onDelete} theme={t} />
          <div style={{ height: 1, background: t.panelBorder, margin: "0 20px" }} />
          <HangerRow label="BOTTOMS" items={bottoms} onDelete={onDelete} theme={t} />
        </div>

        {/* Right: Outfits + Shared */}
        <div style={{ width: 252, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${t.panelBorder}`, flexShrink: 0, display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: t.text, letterSpacing: "0.1em" }}>SAVED OUTFITS</span>
            <span style={{ fontSize: 10, color: t.subText, fontFamily: "'DM Mono', monospace" }}>/{savedOutfits.length}/</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {savedOutfits.length === 0 ? (
              <p style={{ color: t.subText, fontSize: 12, fontStyle: "italic", fontFamily: "'DM Mono', monospace", textAlign: "center", padding: "24px 0", lineHeight: 1.6 }}>
                No saved outfits yet.<br/>Build one on the main screen!
              </p>
            ) : savedOutfits.map((outfit, idx) => (
              <SavedOutfitCard key={outfit.id} outfit={outfit} items={items} mannequinPhoto={mannequinPhoto} onDelete={onDeleteOutfit} onClick={() => setViewingOutfitIdx(idx)} theme={t} />
            ))}
          </div>

          {/* Shared toggle */}
          <div style={{ borderTop: `1px solid ${t.panelBorder}`, flexShrink: 0 }}>
            <button onClick={() => setShowShared(v => !v)} style={{
              width: "100%", padding: "11px 16px", background: "none", border: "none",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", color: t.text, fontFamily: "inherit",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            }}>
              <span>SHARED WITH ME {sharedWithMe.length > 0 && <span style={{ background: t.accent, color: "#fff", borderRadius: 8, fontSize: 9, padding: "1px 5px", marginLeft: 4 }}>{sharedWithMe.length}</span>}</span>
              <span style={{ fontSize: 9, display: "inline-block", transition: "transform 0.2s", transform: showShared ? "rotate(180deg)" : "none" }}>▼</span>
            </button>
            {showShared && (
              <div style={{ maxHeight: 200, overflowY: "auto", padding: "0 16px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                {sharedWithMe.length === 0 ? (
                  <p style={{ color: t.subText, fontSize: 11, fontStyle: "italic", fontFamily: "'DM Mono', monospace" }}>Nothing shared yet.</p>
                ) : sharedWithMe.map(s => (
                  <div key={s.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px", borderRadius: 8, background: "rgba(201,124,93,0.06)", border: `1px solid ${t.panelBorder}` }}>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      <img src={`/${s.top_image_path.replace(/^app\//, "")}`}    alt="top"    style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4 }} />
                      <img src={`/${s.bottom_image_path.replace(/^app\//, "")}`} alt="bottom" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4 }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: t.text, fontFamily: "inherit" }}>{s.from_username}</p>
                      <p style={{ fontSize: 9, color: t.subText, fontFamily: "'DM Mono', monospace", marginTop: 1 }}>{s.top_color} + {s.bottom_color}</p>
                    </div>
                    <button onClick={() => onDismissShare(s.id)} style={{ fontSize: 9, color: t.subText, background: "none", border: `1px solid ${t.panelBorder}`, borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingOutfitIdx !== null && savedOutfits[viewingOutfitIdx] && (
        <OutfitViewModal
          outfit={savedOutfits[viewingOutfitIdx]}
          items={items}
          mannequinPhoto={mannequinPhoto}
          index={viewingOutfitIdx}
          total={savedOutfits.length}
          canPrev={viewingOutfitIdx > 0}
          canNext={viewingOutfitIdx < savedOutfits.length - 1}
          onPrev={() => setViewingOutfitIdx(i => i - 1)}
          onNext={() => setViewingOutfitIdx(i => i + 1)}
          onDelete={id => { onDeleteOutfit(id); setViewingOutfitIdx(null); }}
          onClose={() => setViewingOutfitIdx(null)}
          theme={t}
        />
      )}
    </div>
  );
}

function ShareModal({ currentTop, currentBottom, onClose, onShare, theme: t }) {
  const [toUsername, setToUsername] = useState("");
  const [sending,    setSending]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);

  async function handleSend() {
    if (!toUsername.trim()) { setError("Enter a username to share with."); return; }
    setSending(true);
    setError("");
    try {
      await onShare(toUsername.trim(), currentTop.id, currentBottom.id);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to share.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(61,35,20,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff9f0", border: `1px solid ${t.panelBorder}`, borderRadius: 20, width: "100%", maxWidth: 380, overflow: "hidden", boxShadow: "0 32px 80px rgba(61,35,20,0.35)" }}>
        <div style={{ background: t.nav, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,240,220,0.55)", textTransform: "uppercase", marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>outfits / share</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Share Outfit</h2>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 16 }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: t.accent }}>Shared!</p>
              <p style={{ fontSize: 12, color: t.subText, marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{toUsername} can now see your outfit</p>
              <button onClick={onClose} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, background: t.accent, border: "none", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Done</button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                {[["TOP", currentTop], ["BOTTOM", currentBottom]].map(([label, item]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 9, color: t.subText, fontFamily: "'DM Mono', monospace", marginBottom: 5, letterSpacing: "0.1em" }}>{label}</p>
                    <img src={item.imageUrl} alt={label} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, boxShadow: "2px 3px 10px rgba(61,35,20,0.2)" }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: t.accent, textTransform: "uppercase", display: "block", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>Share with</label>
                <input
                  value={toUsername} onChange={e => setToUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder="enter their username" autoFocus
                  style={{ width: "100%", padding: "10px 14px", background: "#fdf6ee", border: `1px solid ${t.panelBorder}`, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none" }}
                />
              </div>
              {error && <div style={{ fontSize: 12, color: "#d63031", padding: "9px 12px", background: "rgba(214,48,49,0.07)", borderRadius: 7, border: "1px solid rgba(214,48,49,0.2)" }}>{error}</div>}
              <button onClick={handleSend} disabled={sending} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: sending ? t.subText : t.accent, color: "#fff", fontSize: 14, fontWeight: 800, cursor: sending ? "wait" : "pointer", fontFamily: "inherit" }}>
                {sending ? "Sharing…" : "Share →"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SharedInboxModal({ shared, onDismiss, onClose, theme: t }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(61,35,20,0.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff9f0", border: `1px solid ${t.panelBorder}`, borderRadius: 20, width: "100%", maxWidth: 420, overflow: "hidden", boxShadow: "0 32px 80px rgba(61,35,20,0.35)", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ background: t.nav, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,240,220,0.55)", textTransform: "uppercase", marginBottom: 3, fontFamily: "'DM Mono', monospace" }}>outfits / inbox</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Shared with you</h2>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 32, height: 32, color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ padding: "16px 22px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {shared.length === 0 ? (
            <p style={{ textAlign: "center", padding: "30px 0", color: t.subText, fontSize: 13, fontFamily: "'DM Mono', monospace", fontStyle: "italic" }}>No shared outfits yet.</p>
          ) : shared.map(s => (
            <div key={s.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px", borderRadius: 12, background: "rgba(201,124,93,0.06)", border: `1px solid ${t.panelBorder}` }}>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <img src={`/${s.top_image_path.replace(/^app\//, "")}`} alt="top" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }} />
                <img src={`/${s.bottom_image_path.replace(/^app\//, "")}`} alt="bottom" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "inherit" }}>from {s.from_username}</p>
                <p style={{ fontSize: 10, color: t.subText, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{s.top_color} {s.top_item_type} + {s.bottom_color} {s.bottom_item_type}</p>
              </div>
              <button onClick={() => onDismiss(s.id)} style={{ padding: "5px 10px", borderRadius: 6, background: "none", border: `1px solid ${t.panelBorder}`, color: t.subText, fontSize: 11, cursor: "pointer", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>dismiss</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [token,         setToken]         = useState(() => localStorage.getItem("ameries-token") || "");
  const [username,      setUsername]      = useState(() => localStorage.getItem("ameries-username") || "");
  const [items,         setItems]         = useState([]);
  const [showModal,     setShowModal]     = useState(false);
  const [draggedItem,   setDraggedItem]   = useState(null);
  const [dragOverZone,  setDragOverZone]  = useState(null);
  const [currentTop,    setCurrentTop]    = useState(null);
  const [currentBottom, setCurrentBottom] = useState(null);
  const [toast,         setToast]         = useState("");
  const [saving,        setSaving]        = useState(false);
  const [outfitCount,   setOutfitCount]   = useState(0);
  const [theme,         setTheme]         = useState(() => {
    try {
      const saved = localStorage.getItem("ameries-theme");
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch { return DEFAULTS; }
  });
  const [bgImage,        setBgImage]        = useState(null);
  const [mannequinPhoto, setMannequinPhoto] = useState(null);
  const [showTheme,      setShowTheme]      = useState(false);
  const [sharedWithMe,   setSharedWithMe]   = useState([]);
  const [showShare,      setShowShare]      = useState(false);
  const [showInbox,      setShowInbox]      = useState(false);
  const [savedOutfits,   setSavedOutfits]   = useState([]);
  const [showCloset,     setShowCloset]     = useState(false);

  const tops    = useMemo(() => items.filter(i => i.category === "top"),    [items]);
  const bottoms = useMemo(() => items.filter(i => i.category === "bottom"), [items]);

  useEffect(() => {
    if (token) { loadItems(); loadShared(); loadOutfits(); }
  }, [token]);

  useEffect(() => {
    function onVisible() {
      if (!document.hidden && token) { loadItems(); loadOutfits(); loadShared(); }
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [token]);

  function handleLoginSuccess(tok, user) {
    setToken(tok);
    setUsername(user);
    localStorage.setItem("ameries-token", tok);
    localStorage.setItem("ameries-username", user);
  }

  async function handleLogout() {
    try {
      await fetch("/auth/logout", { method: "POST", headers: { Authorization: token } });
    } catch { /* still clear local state */ }
    setToken("");
    setUsername("");
    setItems([]);
    localStorage.removeItem("ameries-token");
    localStorage.removeItem("ameries-username");
  }

  async function authFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: token },
    });
    if (res.status === 401) {
      handleLogout();
      throw new Error("Session expired — please sign in again.");
    }
    return res;
  }

  async function loadItems() {
    try {
      const res = await authFetch(`${API}/clothing?t=${Date.now()}`);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); }
      catch { showToast("ERROR: server returned HTML instead of items — restart the service"); console.error("loadItems got HTML:", text.slice(0, 200)); return; }
      if (!res.ok) { showToast("ERROR fetching items: " + (data.detail || res.status)); return; }
      setItems(data.map(item => ({
        id:       String(item.id),
        category: item.category,
        itemType: item.item_type,
        color:    item.color,
        imageUrl: `${API}/${item.image_path.replace(/^app\//, "")}`,
      })));
    } catch (err) { showToast("FETCH ERROR: " + err.message); }
  }

  async function loadShared() {
    try {
      const res = await authFetch(`${API}/shared`);
      if (!res.ok) return;
      setSharedWithMe(await res.json());
    } catch { /* ignore */ }
  }

  async function handleShare(toUsername, topId, bottomId) {
    const res = await authFetch(`${API}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to_username: toUsername, top_id: Number(topId), bottom_id: Number(bottomId) }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Failed to share");
    }
  }

  async function loadOutfits() {
    try {
      const res = await authFetch(`${API}/outfit`);
      if (!res.ok) return;
      setSavedOutfits(await res.json());
    } catch { /* ignore */ }
  }

  async function handleDeleteOutfit(id) {
    try {
      await authFetch(`${API}/outfit/${id}`, { method: "DELETE" });
      setSavedOutfits(prev => prev.filter(o => o.id !== id));
      showToast("Outfit removed");
    } catch (err) {
      if (!err.message?.includes("Session expired")) showToast("Failed to remove outfit");
    }
  }

  async function handleDismissShare(shareId) {
    try {
      await authFetch(`${API}/shared/${shareId}`, { method: "DELETE" });
      setSharedWithMe(prev => prev.filter(s => s.id !== shareId));
    } catch { /* ignore */ }
  }

  function updateTheme(key, value) {
    if (key === "__reset__") {
      setTheme(DEFAULTS);
      setBgImage(null);
      localStorage.removeItem("ameries-theme");
      return;
    }
    if (key === "__preset__") {
      setTheme(value);
      localStorage.setItem("ameries-theme", JSON.stringify(value));
      return;
    }
    const next = { ...theme, [key]: value };
    setTheme(next);
    localStorage.setItem("ameries-theme", JSON.stringify(next));
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  async function handleAdd({ category, itemType, color, imageFile }) {
    const form = new FormData();
    form.append("file", imageFile);
    const uploadRes = await authFetch(`${API}/upload`, { method: "POST", body: form });
    if (!uploadRes.ok) throw new Error("Upload failed");
    const { image_path } = await uploadRes.json();

    const params = new URLSearchParams({ category, item_type: itemType, color, image_path });
    const addRes = await authFetch(`${API}/clothing?${params}`, { method: "POST" });
    if (!addRes.ok) throw new Error("Add failed");

    await loadItems();
    showToast(`${color} ${itemType} added!`);
    setMobileTab(category === "top" ? "tops" : "bottoms");
  }

  function handleSelect(item) {
    if (item.category === "top") { setCurrentTop(item); showToast(`${item.color} ${item.itemType} → top`); }
    else { setCurrentBottom(item); showToast(`${item.color} ${item.itemType} → bottom`); }
  }

  async function handleDelete(id) {
    try {
      await authFetch(`${API}/clothing/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(i => i.id !== id));
      if (currentTop?.id === id)    setCurrentTop(null);
      if (currentBottom?.id === id) setCurrentBottom(null);
      showToast("Removed");
    } catch (err) {
      if (!err.message?.includes("Session expired")) showToast("Failed to remove");
    }
  }

  function handleDrop(zone) {
    if (zone === "clear-top")    { setCurrentTop(null);    return; }
    if (zone === "clear-bottom") { setCurrentBottom(null); return; }
    if (!draggedItem) return;
    const expectedCat = zone === "top" ? "top" : "bottom";
    if (draggedItem.category !== expectedCat) {
      showToast(`That's a ${draggedItem.category} — wrong zone!`);
      setDraggedItem(null); setDragOverZone(null); return;
    }
    if (zone === "top") setCurrentTop(draggedItem);
    else                setCurrentBottom(draggedItem);
    setDraggedItem(null); setDragOverZone(null);
  }

  async function handleSaveOutfit() {
    if (!currentTop || !currentBottom) {
      showToast(!currentTop && !currentBottom ? "Build an outfit first!" : "Need both a top and a bottom!");
      return;
    }
    setSaving(true);
    try {
      const params = new URLSearchParams({ top_id: currentTop.id, bottom_id: currentBottom.id });
      const res = await authFetch(`${API}/outfit?${params}`, { method: "POST" });
      if (!res.ok) throw new Error();
      setOutfitCount(n => n + 1);
      await loadOutfits();
      showToast("Outfit saved!");
    } catch (err) {
      if (!err.message?.includes("Session expired")) showToast("Failed to save outfit");
    } finally {
      setSaving(false);
    }
  }

  const t = theme;
  const isMobile = useWindowWidth() < 768;
  const [mobileTab, _setMobileTab] = useState(() => sessionStorage.getItem("mobileTab") || "outfit");
  function setMobileTab(tab) { sessionStorage.setItem("mobileTab", tab); _setMobileTab(tab); }

  if (!token) {
    return <LoginScreen onSuccess={handleLoginSuccess} theme={t} />;
  }

  return (
    <>
      <style>{`
        ${SHARED_STYLE}
        body { font-family: '${t.font}', sans-serif; }
        select option { background: #fff9f0; color: ${t.text}; }
      `}</style>

      <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: `'${t.font}', sans-serif`, overflow: "hidden" }}>

        {/* Navbar */}
        <nav style={{ background: t.nav, height: 54, display: "flex", alignItems: "center", padding: "0 24px", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Amerie's</span>
          <span style={{ fontSize: 9, color: "rgba(255,240,220,0.5)", letterSpacing: "0.22em", textTransform: "uppercase", paddingTop: 3, fontFamily: "'DM Mono', monospace" }}>Closet</span>
          <button
            onClick={() => setShowCloset(true)}
            style={{
              marginLeft: 16, height: 30, padding: "0 14px", borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)", color: "#fff",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.04em",
            }}
          >Closet</button>
          <div style={{ marginLeft: "auto", display: "flex", gap: isMobile ? 6 : 14, alignItems: "center" }}>
            {!isMobile && <span style={{ fontSize: 11, color: "rgba(255,240,220,0.65)", fontFamily: "'DM Mono', monospace" }}>{items.length} items</span>}
            {!isMobile && outfitCount > 0 && (
              <span style={{ fontSize: 11, color: "#fff", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.22)", padding: "3px 12px", borderRadius: 20, fontFamily: "'DM Mono', monospace" }}>
                {outfitCount} saved
              </span>
            )}
            {!isMobile && <span style={{ fontSize: 11, color: "rgba(255,240,220,0.65)", fontFamily: "'DM Mono', monospace" }}>{username}</span>}
            <button
              onClick={() => { setShowInbox(true); loadShared(); }}
              title="Shared with you"
              style={{
                position: "relative",
                background: showInbox ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.22)", borderRadius: 7,
                padding: "0 10px", height: 30, cursor: "pointer", color: "rgba(255,240,220,0.8)",
                fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              inbox
              {sharedWithMe.length > 0 && (
                <span style={{ background: t.accent, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 800, padding: "1px 5px", lineHeight: 1.4 }}>
                  {sharedWithMe.length}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.22)", borderRadius: 7,
                padding: "0 10px", height: 30, cursor: "pointer", color: "rgba(255,240,220,0.8)",
                fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
                transition: "background 0.12s",
              }}
            >sign out</button>
            <button
              onClick={() => setShowTheme(v => !v)}
              title="Customize theme"
              style={{
                background: showTheme ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.22)", borderRadius: 7,
                width: 30, height: 30, cursor: "pointer", color: "#fff", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.12s",
              }}
            >⚙</button>
          </div>
        </nav>

        {/* Control Bar */}
        <div style={{ background: t.bar, height: 44, display: "flex", alignItems: "center", padding: "0 24px", gap: 12, flexShrink: 0 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              height: 30, padding: "0 14px", borderRadius: 7,
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)", color: "#fff",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit",
              letterSpacing: "0.04em",
            }}
          >+ Add Item</button>

          {!isMobile && (
            <div style={{ flex: 1, textAlign: "center" }}>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Mono', monospace", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                drag photos onto the mannequin to build outfits
              </span>
            </div>
          )}
          {isMobile && <div style={{ flex: 1 }} />}

          <button
            onClick={() => setShowShare(true)}
            disabled={!currentTop || !currentBottom}
            title={!currentTop || !currentBottom ? "Add both a top and bottom first" : "Share this outfit"}
            style={{
              height: 30, padding: "0 14px", borderRadius: 7, border: "none",
              background: currentTop && currentBottom ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
              color: currentTop && currentBottom ? "#fff" : "rgba(255,255,255,0.3)",
              fontSize: 12, fontWeight: 700, cursor: currentTop && currentBottom ? "pointer" : "not-allowed",
              fontFamily: "inherit", letterSpacing: "0.04em",
              transition: "all 0.15s",
            }}
          >Share</button>
          <button
            onClick={handleSaveOutfit}
            disabled={saving}
            style={{
              height: 30, padding: "0 16px", borderRadius: 7, border: "none",
              background: saving ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.28)",
              color: "#fff",
              fontSize: 12, fontWeight: 800, cursor: saving ? "wait" : "pointer",
              fontFamily: "inherit", letterSpacing: "0.04em",
              transition: "background 0.15s",
            }}
          >
            {saving ? "Saving…" : "Save Outfit →"}
          </button>
        </div>

        {/* Board */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: bgImage ? `url(${bgImage}) center/cover no-repeat` : t.bg }} />
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, ${t.grid} 39px, ${t.grid} 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, ${t.grid} 39px, ${t.grid} 40px)`,
          }} />

          {isMobile ? (
            /* ── MOBILE: tabbed layout ── */
            <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
              <div style={{ display: "flex", background: `${t.panel}f2`, borderBottom: `1px solid ${t.panelBorder}`, flexShrink: 0 }}>
                {[["tops", "TOPS"], ["outfit", "OUTFIT"], ["bottoms", "BOTTOMS"]].map(([key, label]) => (
                  <button key={key} onClick={() => setMobileTab(key)} style={{
                    flex: 1, padding: "12px 0", background: "none", border: "none",
                    borderBottom: mobileTab === key ? `2px solid ${t.accent}` : "2px solid transparent",
                    color: mobileTab === key ? t.accent : t.subText,
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>{label}</button>
                ))}
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
                {mobileTab === "tops" && (
                  <ScatteredPanel label="TOPS" items={tops} draggedItem={draggedItem}
                    onDragStart={setDraggedItem} onDragEnd={() => { setDraggedItem(null); setDragOverZone(null); }}
                    onDelete={handleDelete} onSelect={handleSelect} theme={t} />
                )}
                {mobileTab === "outfit" && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <MannequinCenter
                      currentTop={currentTop} currentBottom={currentBottom}
                      draggedItem={draggedItem} dragOverZone={dragOverZone}
                      onDragOver={setDragOverZone} onDragLeave={() => setDragOverZone(null)}
                      onDrop={handleDrop}
                      mannequinPhoto={mannequinPhoto} onMannequinPhoto={setMannequinPhoto}
                      theme={t}
                    />
                  </div>
                )}
                {mobileTab === "bottoms" && (
                  <ScatteredPanel label="BOTTOMS" items={bottoms} draggedItem={draggedItem}
                    onDragStart={setDraggedItem} onDragEnd={() => { setDraggedItem(null); setDragOverZone(null); }}
                    onDelete={handleDelete} onSelect={handleSelect} theme={t} />
                )}
              </div>
            </div>
          ) : (
            /* ── DESKTOP: three-column layout ── */
            <div style={{ position: "relative", display: "flex", height: "100%", zIndex: 1 }}>
              <div style={{ width: 218, padding: "20px 14px 20px 20px", borderRight: `1px solid ${t.panelBorder}`, overflow: "hidden", display: "flex", flexDirection: "column", background: bgImage ? `${t.panel}ee` : "transparent" }}>
                <ScatteredPanel label="TOPS" items={tops} draggedItem={draggedItem}
                  onDragStart={setDraggedItem} onDragEnd={() => { setDraggedItem(null); setDragOverZone(null); }}
                  onDelete={handleDelete} onSelect={handleSelect} theme={t} />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 20px" }}>
                <MannequinCenter
                  currentTop={currentTop} currentBottom={currentBottom}
                  draggedItem={draggedItem} dragOverZone={dragOverZone}
                  onDragOver={setDragOverZone} onDragLeave={() => setDragOverZone(null)}
                  onDrop={handleDrop}
                  mannequinPhoto={mannequinPhoto} onMannequinPhoto={setMannequinPhoto}
                  theme={t}
                />
              </div>
              <div style={{ width: 218, padding: "20px 20px 20px 14px", borderLeft: `1px solid ${t.panelBorder}`, overflow: "hidden", display: "flex", flexDirection: "column", background: bgImage ? `${t.panel}ee` : "transparent" }}>
                <ScatteredPanel label="BOTTOMS" items={bottoms} draggedItem={draggedItem}
                  onDragStart={setDraggedItem} onDragEnd={() => { setDraggedItem(null); setDragOverZone(null); }}
                  onDelete={handleDelete} onSelect={handleSelect} theme={t} />
              </div>
            </div>
          )}
        </div>
      </div>

      {showTheme && (
        <ThemePanel
          theme={t} onUpdate={updateTheme}
          bgImage={bgImage} onBgImage={setBgImage}
          onClose={() => setShowTheme(false)}
        />
      )}
      {showModal && (
        <AddItemModal
          onClose={() => setShowModal(false)}
          onAdd={async data => { await handleAdd(data); setShowModal(false); }}
          theme={t}
        />
      )}
      {showCloset && (
        <ClosetView
          tops={tops} bottoms={bottoms} items={items}
          savedOutfits={savedOutfits} sharedWithMe={sharedWithMe}
          mannequinPhoto={mannequinPhoto}
          onDelete={handleDelete}
          onDeleteOutfit={handleDeleteOutfit}
          onDismissShare={handleDismissShare}
          onClose={() => setShowCloset(false)}
          theme={t}
        />
      )}
      {showShare && currentTop && currentBottom && (
        <ShareModal
          currentTop={currentTop} currentBottom={currentBottom}
          onClose={() => setShowShare(false)}
          onShare={handleShare}
          theme={t}
        />
      )}
      {showInbox && (
        <SharedInboxModal
          shared={sharedWithMe}
          onDismiss={handleDismissShare}
          onClose={() => setShowInbox(false)}
          theme={t}
        />
      )}
      {toast && <Toast message={toast} />}
    </>
  );
}
