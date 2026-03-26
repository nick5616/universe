// src/pages/LifeGraphPage.tsx
// Public life graph — PUBLIC_THEME colors, user-editable, stored in localStorage.
import React, { useState, useRef } from "react";
import LifeGraphView, { GraphNodeInput, GraphEdgeInput, EdgeType, PUBLIC_THEME } from "../components/LifeGraphView";

// ── Demo graph (same structure as Nicole's) ───────────────────────────────────

const DEMO_NODES: GraphNodeInput[] = [
    { id: "sleep",         label: "Sleep",               layer: "foundation",     status: "active",  desc: "The non-negotiable substrate. Everything else degrades without this." },
    { id: "mentalHealth",  label: "Internal Work",       layer: "foundation",     status: "active",  desc: "Stay grounded. The work that makes all other work possible." },
    { id: "swejob",        label: "Full Time SWE",       layer: "foundation",     status: "active",  desc: "Financial foundation. Unlocks time, stability, and everything downstream." },
    { id: "socialLife",    label: "Social Life",         layer: "foundation",     status: "active",  desc: "Friends, community, Capitol Hill. The connective tissue of a real life." },
    { id: "voiceTraining", label: "Voice Training",      layer: "infrastructure", status: "active",  desc: "10 min/day, starting now. Infrastructure for the performer layer. TransVoiceLessons. Give it 3–6 months." },
    { id: "portfolio",     label: "Portfolio",           layer: "infrastructure", status: "active",  desc: "nicolebelovoskey.com. The thing that makes the career narrative hold." },
    { id: "lifting",       label: "Weightlifting",       layer: "body",           status: "active",  desc: "Already happening. Maintain baseline. Your body is changing and the lifting is part of it." },
    { id: "beingAWoman",   label: "Being a Woman",       layer: "body",           status: "ongoing", desc: "Not a destination. Ongoing, already happening, already real." },
    { id: "yoga",          label: "Yoga / Pilates",      layer: "body",           status: "active",  desc: "Less consistent than lifting. That's fine. Move when you can." },
    { id: "dance",         label: "Dance Lessons",       layer: "body",           status: "later",   desc: "Phase two. Requires: time + stability. Worth the wait." },
    { id: "drawing",       label: "Drawing",             layer: "maker",          status: "active",  desc: "Pencil, pen, acrylic, digital. The oldest practice. Keep it alive at whatever heat." },
    { id: "musicProd",     label: "Music Production",    layer: "maker",          status: "active",  desc: "Ableton Live Lite. FL Studio for beats. The dual-DAW workflow. This is the deepest thing." },
    { id: "dj",            label: "DJing",               layer: "maker",          status: "soon",    desc: "Rekordbox or Serato. The bar that motivated you. Requires: music production foundation." },
    { id: "inventor",      label: "Inventor / Products", layer: "maker",          status: "later",   desc: "The solopreneur half. Build things with real distribution. Requires: audience first." },
    { id: "singingLessons",label: "Singing Lessons",     layer: "maker",          status: "later",   desc: "Requires: voice training baseline. Phase two. Will feed the music artist node." },
    { id: "drawingTiktok", label: "Drawing TikTok",      layer: "performer",      status: "soon",    desc: "Hands only. No voice, no face. You already built this in Thailand. Could restart tomorrow." },
    { id: "instaModel",    label: "Instagram",           layer: "performer",      status: "soon",    desc: "Post as yourself. Any pronouns. Free posting. New account incoming." },
    { id: "musicArtist",   label: "Music Artist",        layer: "performer",      status: "later",   desc: "Public-facing. Requires: voice training + music production. Trans is cool in your genres." },
    { id: "devLogger",     label: "Dev Logger / YouTube",layer: "performer",      status: "later",   desc: "Phase one solopreneur. Requires: job + voice training. Build in public." },
    { id: "clubbing",      label: "Clubbing / DJ Sets",  layer: "performer",      status: "active",  desc: "Already happening. Capitol Hill. The thing that motivated the whole DJ thread." },
];

const DEMO_EDGES: GraphEdgeInput[] = [
    { s: "sleep",         t: "mentalHealth",    type: "assoc"  },
    { s: "sleep",         t: "lifting",         type: "prereq" },
    { s: "sleep",         t: "voiceTraining",   type: "prereq" },
    { s: "sleep",         t: "musicProd",       type: "prereq" },
    { s: "swejob",        t: "inventor",        type: "prereq" },
    { s: "swejob",        t: "devLogger",       type: "prereq" },
    { s: "swejob",        t: "voiceTraining",   type: "prereq" },
    { s: "mentalHealth",  t: "beingAWoman",     type: "assoc"  },
    { s: "mentalHealth",  t: "socialLife",      type: "assoc"  },
    { s: "socialLife",    t: "clubbing",        type: "assoc"  },
    { s: "socialLife",    t: "instaModel",      type: "assoc"  },
    { s: "voiceTraining", t: "singingLessons",  type: "prereq" },
    { s: "voiceTraining", t: "musicArtist",     type: "prereq" },
    { s: "voiceTraining", t: "devLogger",       type: "prereq" },
    { s: "portfolio",     t: "swejob",          type: "prereq" },
    { s: "portfolio",     t: "devLogger",       type: "assoc"  },
    { s: "musicProd",     t: "dj",              type: "prereq" },
    { s: "musicProd",     t: "musicArtist",     type: "prereq" },
    { s: "musicProd",     t: "singingLessons",  type: "assoc"  },
    { s: "drawing",       t: "drawingTiktok",   type: "prereq" },
    { s: "drawing",       t: "inventor",        type: "assoc"  },
    { s: "singingLessons",t: "musicArtist",     type: "prereq" },
    { s: "inventor",      t: "devLogger",       type: "assoc"  },
    { s: "lifting",       t: "beingAWoman",     type: "assoc"  },
    { s: "yoga",          t: "beingAWoman",     type: "assoc"  },
    { s: "dance",         t: "clubbing",        type: "assoc"  },
    { s: "dance",         t: "beingAWoman",     type: "assoc"  },
    { s: "beingAWoman",   t: "instaModel",      type: "assoc"  },
    { s: "beingAWoman",   t: "musicArtist",     type: "assoc"  },
    { s: "clubbing",      t: "dj",              type: "assoc"  },
    { s: "devLogger",     t: "inventor",        type: "assoc"  },
    { s: "drawingTiktok", t: "instaModel",      type: "assoc"  },
    { s: "musicArtist",   t: "dj",              type: "assoc"  },
];

// ── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lifegraph-user-data";

interface StoredEdge { from: string; to: string; type: EdgeType; }

function slugify(label: string): string {
    return label.trim().toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
}

function edgesToGraph(stored: StoredEdge[]): { nodes: GraphNodeInput[]; edges: GraphEdgeInput[] } {
    const labelSet = new Set<string>();
    stored.forEach(e => { labelSet.add(e.from.trim()); labelSet.add(e.to.trim()); });
    const nodes: GraphNodeInput[] = [...labelSet].map(label => ({ id: slugify(label), label }));
    const edges: GraphEdgeInput[] = stored.map(e => ({
        s: slugify(e.from.trim()), t: slugify(e.to.trim()), type: e.type,
    }));
    return { nodes, edges };
}

function loadStored(): StoredEdge[] | null {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
}
function saveStored(edges: StoredEdge[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(edges)); }

// ── Form ──────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
    flex: 1, minWidth: 90, height: 40,
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: 6, padding: "0 12px",
    color: "rgba(255,255,255,.85)", fontSize: 12,
    fontFamily: "'DM Mono',monospace", outline: "none",
};

const Form: React.FC<{
    initial: StoredEdge[];
    onBuild: (edges: StoredEdge[]) => void;
    onCancel?: () => void;
}> = ({ initial, onBuild, onCancel }) => {
    const [edges, setEdges] = useState<StoredEdge[]>(initial);
    const [from,  setFrom]  = useState("");
    const [to,    setTo]    = useState("");
    const [type,  setType]  = useState<EdgeType>("prereq");
    const [error, setError] = useState("");
    const fromRef = useRef<HTMLInputElement>(null);

    const add = () => {
        const f = from.trim(), t = to.trim();
        if (!f || !t) { setError("Both fields required."); return; }
        if (f.toLowerCase() === t.toLowerCase()) { setError("From and To must be different."); return; }
        setError("");
        setEdges(prev => [...prev, { from: f, to: t, type }]);
        setFrom(""); setTo(""); setType("prereq");
        fromRef.current?.focus();
    };

    const build = () => {
        if (edges.length === 0) { setError("Add at least one edge."); return; }
        saveStored(edges);
        onBuild(edges);
    };

    return (
        <div style={{ position:"fixed", inset:0, background:"#0a0a0f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Mono',monospace", color:"rgba(255,255,255,.85)", padding:"0 24px" }}>

            {/* Header */}
            <div style={{ marginBottom:40, textAlign:"center" }}>
                <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:28, color:"rgba(255,255,255,.9)", lineHeight:1 }}>Build Your Life Graph</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginTop:8, letterSpacing:"0.1em", textTransform:"uppercase" }}>declare edges · nodes are inferred automatically</div>
            </div>

            {/* Input row */}
            <div style={{ display:"flex", alignItems:"center", gap:10, width:"100%", maxWidth:640, marginBottom: error ? 8 : 20, flexWrap:"wrap" }}>
                <input
                    ref={fromRef}
                    value={from}
                    onChange={e=>setFrom(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&add()}
                    placeholder="from node"
                    style={inputStyle}
                    autoFocus
                />
                {/* Edge-type toggle */}
                <button
                    onClick={()=>setType(t=>t==="prereq"?"assoc":"prereq")}
                    title="click to toggle edge type"
                    style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.15)", color:"rgba(255,255,255,.6)", borderRadius:6, padding:"0 12px", height:40, fontSize:14, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", fontFamily:"'DM Mono',monospace" }}
                >
                    {type==="prereq"
                        ? <><span>→</span><span style={{fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>prereq</span></>
                        : <><span>↔</span><span style={{fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>assoc</span></>}
                </button>
                <input
                    value={to}
                    onChange={e=>setTo(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&add()}
                    placeholder="to node"
                    style={inputStyle}
                />
                <button
                    onClick={add}
                    style={{ background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.2)", color:"rgba(255,255,255,.7)", borderRadius:6, padding:"0 18px", height:40, fontSize:11, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", flexShrink:0, fontFamily:"'DM Mono',monospace" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.14)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
                >
                    + add
                </button>
            </div>

            {error && <div style={{ fontSize:10, color:"rgba(255,100,100,.8)", marginBottom:14, letterSpacing:"0.04em" }}>{error}</div>}

            {/* Edge list */}
            {edges.length > 0 && (
                <div style={{ width:"100%", maxWidth:640, marginBottom:28, maxHeight:"38vh", overflowY:"auto" }}>
                    {edges.map((e, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 10px", borderBottom:"1px solid rgba(255,255,255,.05)", fontSize:12 }}>
                            <span style={{ color:"rgba(255,255,255,.7)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.from}</span>
                            <span style={{ color:"rgba(255,255,255,.3)", flexShrink:0, fontSize:13 }}>{e.type==="prereq"?"→":"↔"}</span>
                            <span style={{ fontSize:8, letterSpacing:"0.07em", textTransform:"uppercase", color:"rgba(255,255,255,.25)", flexShrink:0 }}>{e.type}</span>
                            <span style={{ color:"rgba(255,255,255,.7)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"right" }}>{e.to}</span>
                            <button
                                onClick={()=>setEdges(prev=>prev.filter((_,j)=>j!==i))}
                                style={{ background:"none", border:"none", color:"rgba(255,255,255,.25)", cursor:"pointer", fontSize:14, flexShrink:0, padding:"0 4px", lineHeight:1 }}
                                onMouseEnter={e=>e.currentTarget.style.color="rgba(255,100,100,.7)"}
                                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.25)"}
                            >✕</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <button
                    onClick={build}
                    style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.25)", color:"rgba(255,255,255,.85)", borderRadius:8, padding:"10px 36px", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'DM Mono',monospace" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.18)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}
                >
                    build graph →
                </button>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        style={{ background:"none", border:"none", color:"rgba(255,255,255,.3)", cursor:"pointer", fontSize:11, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}
                        onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.6)"}
                        onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.3)"}
                    >
                        ← cancel
                    </button>
                )}
            </div>

            <div style={{ marginTop:28, fontSize:9, color:"rgba(255,255,255,.2)", letterSpacing:"0.06em", textTransform:"uppercase" }}>
                press enter to add · click the arrow to toggle edge type
            </div>
        </div>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

type View = "demo" | "user" | "form";

const LifeGraphPage: React.FC = () => {
    const [userEdges, setUserEdges] = useState<StoredEdge[] | null>(() => loadStored());
    // Start on "user" graph if one exists, otherwise show the demo
    const [view, setView] = useState<View>(() => loadStored() ? "user" : "demo");

    if (view === "form") {
        return (
            <Form
                initial={userEdges ?? []}
                onBuild={edges => { setUserEdges(edges); setView("user"); }}
                onCancel={() => setView(userEdges ? "user" : "demo")}
            />
        );
    }

    if (view === "user" && userEdges) {
        const { nodes, edges } = edgesToGraph(userEdges);
        return (
            <LifeGraphView
                nodes={nodes}
                edges={edges}
                theme={PUBLIC_THEME}
                title="Life Graph"
                subtitle="your roles · prereqs · associations"
                onEdit={() => setView("form")}
            />
        );
    }

    // Demo view — Nicole's graph with PUBLIC_THEME + "build your own" edit button
    return (
        <LifeGraphView
            nodes={DEMO_NODES}
            edges={DEMO_EDGES}
            theme={PUBLIC_THEME}
            title="Life Graph"
            subtitle="an example · build your own below"
            onEdit={() => setView("form")}
        />
    );
};

export default LifeGraphPage;
