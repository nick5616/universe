// src/pages/LifeGraphPage.tsx
// Public life graph — PUBLIC_THEME colors, user-editable, stored in localStorage.
import React, { useState, useRef } from "react";
import LifeGraphView, { GraphNodeInput, GraphEdgeInput, EdgeType, PUBLIC_THEME, LifeGraphData } from "../components/LifeGraphView";

// ── Demo graph ────────────────────────────────────────────────────────────────

const DEMO_DATA: LifeGraphData = {
    meta: {
        title:    "The Life Graph",
        subtitle: "roles · prerequisites · associations",
        version:  "1.0",
    },
    nodes: [
        { id: "sleep",            label: "Sleep",                 layer: "foundation",  status: "active",  desc: "The non-negotiable substrate. Everything else degrades without this." },
        { id: "eating",           label: "Eating / Nutrition",    layer: "foundation",  status: "active",  desc: "Fuel. Not a hobby, a root node. What you eat shapes everything downstream." },
        { id: "mentalHealth",     label: "Mental Health",         layer: "foundation",  status: "active",  desc: "Therapy, self-inquiry, staying grounded. The work that makes all other work possible." },
        { id: "financialStab",    label: "Financial Stability",   layer: "foundation",  status: "active",  desc: "The unsexy root. Stress here cascades everywhere. Protect it." },
        { id: "work",             label: "Work / Career",         layer: "foundation",  status: "active",  desc: "How you sustain the life. Ideally meaningful. Always consequential." },
        { id: "socialLife",       label: "Social Life",           layer: "foundation",  status: "active",  desc: "Friends, community, belonging. The connective tissue of a real life." },

        { id: "exercise",         label: "Exercise",              layer: "body",        status: "active",  desc: "Move the body. Anything counts. The form matters less than the consistency." },
        { id: "beingOutside",     label: "Being Outside",         layer: "body",        status: "active",  desc: "Not exercise — just presence in natural environments. Different effect on the nervous system." },
        { id: "cooking",          label: "Cooking",               layer: "body",        status: "active",  desc: "Body, craft, creativity, and connection all at once. Massively underrated." },
        { id: "rest",             label: "Rest / Play",           layer: "body",        status: "active",  desc: "Pure enjoyment with no productive justification. Non-negotiable for sustained output." },

        { id: "reading",          label: "Reading",               layer: "mind",        status: "active",  desc: "Ideas you haven't had yet live in books. Both nonfiction and fiction. Different nutrients." },
        { id: "deepConversation", label: "Deep Conversation",     layer: "mind",        status: "active",  desc: "Not socializing — the kind of talk that changes how you see things. Rare. Protect it." },
        { id: "solitude",         label: "Intentional Solitude",  layer: "mind",        status: "active",  desc: "Not being alone — learning to be with yourself. Different thing entirely." },
        { id: "learning",         label: "Deliberate Learning",   layer: "mind",        status: "active",  desc: "A skill, a language, an instrument. Anything that requires sustained effort over time." },
        { id: "mementoMori",      label: "Memento Mori",          layer: "mind",        status: "active",  desc: "Sitting with finitude. Asking: does this matter? Clarifies everything. A lens, not a task." },
        { id: "abstraction",      label: "Abstraction",           layer: "mind",        status: "active",  desc: "Finding the pattern behind the pattern. Frameworks, models, systems thinking." },

        { id: "craft",            label: "A Craft",               layer: "maker",       status: "active",  desc: "Getting genuinely good at something. The satisfaction of excellence through sustained effort." },
        { id: "creating",         label: "Creating",              layer: "maker",       status: "active",  desc: "Output. Making things that didn't exist. The other half of consuming." },
        { id: "writing",          label: "Writing",               layer: "maker",       status: "active",  desc: "Articulating your own ideas. Even privately. Thinking that only happens through writing." },

        { id: "intimacy",         label: "Intimate Relationships", layer: "connection", status: "active",  desc: "Partnership, family, close friendship. The relationships where you are fully known." },
        { id: "community",        label: "Community",             layer: "connection",  status: "active",  desc: "Something larger than your immediate circle. Where you belong to something." },
        { id: "service",          label: "Service",               layer: "connection",  status: "active",  desc: "Giving. Mentoring. Contributing beyond yourself. Purpose that outlasts you." },
        { id: "mentorship",       label: "Mentorship",            layer: "connection",  status: "active",  desc: "Both directions. Receiving guidance and eventually giving it back." },

        { id: "identity",         label: "Identity",              layer: "spirit",      status: "ongoing", desc: "Knowing who you are and living congruently with it. Not performing a self — being one." },
        { id: "purpose",          label: "Purpose",               layer: "spirit",      status: "ongoing", desc: "Why any of this. What you're oriented toward. Doesn't have to be grand — just real." },
        { id: "presence",         label: "Presence",              layer: "spirit",      status: "active",  desc: "The ability to just be, without doing or striving. Awe, gratitude, stillness." },
    ],
    edges: [
        { s: "sleep",            t: "exercise",         type: "prereq" },
        { s: "sleep",            t: "mentalHealth",     type: "assoc"  },
        { s: "sleep",            t: "creating",         type: "prereq" },
        { s: "sleep",            t: "learning",         type: "prereq" },
        { s: "sleep",            t: "deepConversation", type: "prereq" },

        { s: "eating",           t: "exercise",         type: "prereq" },
        { s: "eating",           t: "mentalHealth",     type: "assoc"  },
        { s: "cooking",          t: "eating",           type: "assoc"  },
        { s: "cooking",          t: "community",        type: "assoc"  },
        { s: "cooking",          t: "craft",            type: "assoc"  },

        { s: "financialStab",    t: "work",             type: "assoc"  },
        { s: "work",             t: "financialStab",    type: "prereq" },
        { s: "work",             t: "purpose",          type: "assoc"  },
        { s: "work",             t: "community",        type: "assoc"  },

        { s: "mentalHealth",     t: "identity",         type: "assoc"  },
        { s: "mentalHealth",     t: "socialLife",       type: "assoc"  },
        { s: "mentalHealth",     t: "solitude",         type: "assoc"  },
        { s: "mentalHealth",     t: "purpose",          type: "assoc"  },
        { s: "mentalHealth",     t: "mementoMori",      type: "assoc"  },

        { s: "exercise",         t: "mentalHealth",     type: "assoc"  },
        { s: "exercise",         t: "rest",             type: "assoc"  },
        { s: "beingOutside",     t: "mentalHealth",     type: "assoc"  },
        { s: "beingOutside",     t: "solitude",         type: "assoc"  },
        { s: "beingOutside",     t: "presence",         type: "assoc"  },
        { s: "rest",             t: "creating",         type: "assoc"  },
        { s: "rest",             t: "mentalHealth",     type: "assoc"  },

        { s: "socialLife",       t: "deepConversation", type: "prereq" },
        { s: "socialLife",       t: "community",        type: "assoc"  },
        { s: "socialLife",       t: "intimacy",         type: "assoc"  },

        { s: "reading",          t: "writing",          type: "assoc"  },
        { s: "reading",          t: "abstraction",      type: "assoc"  },
        { s: "reading",          t: "creating",         type: "assoc"  },
        { s: "deepConversation", t: "abstraction",      type: "assoc"  },
        { s: "deepConversation", t: "writing",          type: "assoc"  },
        { s: "deepConversation", t: "identity",         type: "assoc"  },
        { s: "deepConversation", t: "purpose",          type: "assoc"  },
        { s: "solitude",         t: "writing",          type: "assoc"  },
        { s: "solitude",         t: "abstraction",      type: "assoc"  },
        { s: "solitude",         t: "identity",         type: "assoc"  },
        { s: "solitude",         t: "presence",         type: "assoc"  },
        { s: "learning",         t: "craft",            type: "prereq" },
        { s: "learning",         t: "abstraction",      type: "assoc"  },
        { s: "learning",         t: "purpose",          type: "assoc"  },
        { s: "mementoMori",      t: "purpose",          type: "assoc"  },
        { s: "mementoMori",      t: "presence",         type: "assoc"  },
        { s: "mementoMori",      t: "identity",         type: "assoc"  },
        { s: "abstraction",      t: "writing",          type: "assoc"  },
        { s: "abstraction",      t: "creating",         type: "assoc"  },

        { s: "craft",            t: "creating",         type: "prereq" },
        { s: "craft",            t: "purpose",          type: "assoc"  },
        { s: "creating",         t: "identity",         type: "assoc"  },
        { s: "creating",         t: "community",        type: "assoc"  },
        { s: "writing",          t: "creating",         type: "assoc"  },
        { s: "writing",          t: "identity",         type: "assoc"  },

        { s: "intimacy",         t: "identity",         type: "assoc"  },
        { s: "intimacy",         t: "mentalHealth",     type: "assoc"  },
        { s: "community",        t: "service",          type: "assoc"  },
        { s: "community",        t: "purpose",          type: "assoc"  },
        { s: "service",          t: "purpose",          type: "assoc"  },
        { s: "service",          t: "identity",         type: "assoc"  },
        { s: "mentorship",       t: "service",          type: "assoc"  },
        { s: "mentorship",       t: "craft",            type: "assoc"  },
        { s: "mentorship",       t: "community",        type: "assoc"  },

        { s: "identity",         t: "purpose",          type: "assoc"  },
        { s: "purpose",          t: "presence",         type: "assoc"  },
        { s: "presence",         t: "mentalHealth",     type: "assoc"  },
    ],
};

// ── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY    = "lifegraph-user-data";
const IMPORTED_KEY   = "lifegraph-imported-data";

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

function loadImported(): LifeGraphData | null {
    try { const raw = localStorage.getItem(IMPORTED_KEY); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
}
function saveImported(data: LifeGraphData) { localStorage.setItem(IMPORTED_KEY, JSON.stringify(data)); }

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
                <div style={{ fontSize:10, color:"rgba(255,255,255,.65)", marginTop:8, letterSpacing:"0.1em", textTransform:"uppercase" }}>declare edges · nodes are inferred automatically</div>
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
                    style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.15)", color:"rgba(255,255,255,.88)", borderRadius:6, padding:"0 12px", height:40, fontSize:14, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap", fontFamily:"'DM Mono',monospace" }}
                >
                    {type==="prereq"
                        ? <><span>→</span><span style={{fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>prereq</span></>
                        : <><span>↔</span><span style={{fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>assoc</span></>}
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
                            <span style={{ color:"rgba(255,255,255,.9)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.from}</span>
                            <span style={{ color:"rgba(255,255,255,.65)", flexShrink:0, fontSize:13 }}>{e.type==="prereq"?"→":"↔"}</span>
                            <span style={{ fontSize:8, letterSpacing:"0.07em", textTransform:"uppercase", color:"rgba(255,255,255,.55)", flexShrink:0 }}>{e.type}</span>
                            <span style={{ color:"rgba(255,255,255,.9)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"right" }}>{e.to}</span>
                            <button
                                onClick={()=>setEdges(prev=>prev.filter((_,j)=>j!==i))}
                                style={{ background:"none", border:"none", color:"rgba(255,255,255,.45)", cursor:"pointer", fontSize:14, flexShrink:0, padding:"0 4px", lineHeight:1 }}
                                onMouseEnter={e=>e.currentTarget.style.color="rgba(255,100,100,.9)"}
                                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.45)"}
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
                        style={{ background:"none", border:"none", color:"rgba(255,255,255,.6)", cursor:"pointer", fontSize:11, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:"'DM Mono',monospace" }}
                        onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.9)"}
                        onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.6)"}
                    >
                        ← cancel
                    </button>
                )}
            </div>

            <div style={{ marginTop:28, fontSize:9, color:"rgba(255,255,255,.6)", letterSpacing:"0.06em", textTransform:"uppercase" }}>
                press enter to add · click the arrow to toggle edge type
            </div>
        </div>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

type View = "demo" | "user" | "form" | "imported";

const LifeGraphPage: React.FC = () => {
    const [userEdges,    setUserEdges]    = useState<StoredEdge[] | null>(() => loadStored());
    const [importedData, setImportedData] = useState<LifeGraphData | null>(() => loadImported());
    const [graphKey,     setGraphKey]     = useState(0);
    // Priority: imported > form-built > demo
    const [view, setView] = useState<View>(() => {
        if (loadImported()) return "imported";
        if (loadStored())   return "user";
        return "demo";
    });

    const handleImport = (data: LifeGraphData) => {
        saveImported(data);
        setImportedData(data);
        setView("imported");
        setGraphKey(k => k + 1);
    };

    const makeExportHandler = (nodes: GraphNodeInput[], edges: GraphEdgeInput[], title: string, subtitle?: string) => () => {
        const data: LifeGraphData = { meta: { title, subtitle, version: "1.0" }, nodes, edges };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (view === "form") {
        return (
            <Form
                initial={userEdges ?? []}
                onBuild={edges => { setUserEdges(edges); setView("user"); }}
                onCancel={() => setView(userEdges ? "user" : importedData ? "imported" : "demo")}
            />
        );
    }

    if (view === "imported" && importedData) {
        return (
            <LifeGraphView
                key={graphKey}
                nodes={importedData.nodes}
                edges={importedData.edges}
                theme={PUBLIC_THEME}
                title={importedData.meta.title}
                subtitle={importedData.meta.subtitle}
                onEdit={() => setView("form")}
                onExport={makeExportHandler(importedData.nodes, importedData.edges, importedData.meta.title, importedData.meta.subtitle)}
                onImport={handleImport}
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
                onExport={makeExportHandler(nodes, edges, "Life Graph", "your roles · prereqs · associations")}
                onImport={handleImport}
            />
        );
    }

    // Demo view
    return (
        <LifeGraphView
            nodes={DEMO_DATA.nodes}
            edges={DEMO_DATA.edges}
            theme={PUBLIC_THEME}
            title={DEMO_DATA.meta.title}
            subtitle={DEMO_DATA.meta.subtitle}
            onEdit={() => setView("form")}
            onExport={makeExportHandler(DEMO_DATA.nodes, DEMO_DATA.edges, DEMO_DATA.meta.title, DEMO_DATA.meta.subtitle)}
            onImport={handleImport}
        />
    );
};

export default LifeGraphPage;
