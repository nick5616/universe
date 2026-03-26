// src/pages/LifeGraphPage.tsx
// Public life graph — B&W, user-editable, stored in localStorage.
import React, { useState, useRef } from "react";
import LifeGraphView, { GraphNodeInput, GraphEdgeInput, EdgeType } from "../components/LifeGraphView";

const STORAGE_KEY = "lifegraph-user-data";

interface StoredEdge {
    from: string;   // node label (also used as id after slugification)
    to:   string;
    type: EdgeType;
}

function slugify(label: string): string {
    return label.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function edgesToGraph(stored: StoredEdge[]): { nodes: GraphNodeInput[]; edges: GraphEdgeInput[] } {
    const labelSet = new Set<string>();
    stored.forEach(e => { labelSet.add(e.from.trim()); labelSet.add(e.to.trim()); });
    const nodes: GraphNodeInput[] = [...labelSet].map(label => ({ id: slugify(label), label }));
    const edges: GraphEdgeInput[] = stored.map(e => ({
        s:    slugify(e.from.trim()),
        t:    slugify(e.to.trim()),
        type: e.type,
    }));
    return { nodes, edges };
}

function load(): StoredEdge[] | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

function save(edges: StoredEdge[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(edges));
}

// ── Form component ────────────────────────────────────────────────────────────

const Form: React.FC<{
    initial: StoredEdge[];
    onBuild: (edges: StoredEdge[]) => void;
}> = ({ initial, onBuild }) => {
    const [edges, setEdges]   = useState<StoredEdge[]>(initial);
    const [from,  setFrom]    = useState("");
    const [to,    setTo]      = useState("");
    const [type,  setType]    = useState<EdgeType>("prereq");
    const [error, setError]   = useState("");
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

    const remove = (i: number) => setEdges(prev => prev.filter((_,j)=>j!==i));

    const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") add(); };

    const build = () => {
        if (edges.length === 0) { setError("Add at least one edge first."); return; }
        save(edges);
        onBuild(edges);
    };

    return (
        <div style={{ position:"fixed", inset:0, background:"#0a0a0f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'DM Mono',monospace", color:"rgba(255,255,255,.85)", padding:"0 24px" }}>
            {/* Header */}
            <div style={{ marginBottom:40, textAlign:"center" }}>
                <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:28, color:"rgba(255,255,255,.9)", lineHeight:1 }}>Build Your Life Graph</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", marginTop:8, letterSpacing:"0.1em", textTransform:"uppercase" }}>declare edges · nodes are inferred</div>
            </div>

            {/* Input row */}
            <div style={{ display:"flex", alignItems:"center", gap:10, width:"100%", maxWidth:640, marginBottom:error?8:20, flexWrap:"wrap" }}>
                <input
                    ref={fromRef}
                    value={from}
                    onChange={e=>setFrom(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="from node"
                    style={inputStyle}
                    autoFocus
                />
                {/* Type toggle */}
                <button
                    onClick={()=>setType(t=>t==="prereq"?"assoc":"prereq")}
                    title={type==="prereq" ? "prerequisite (click to toggle)" : "association (click to toggle)"}
                    style={{
                        background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.15)",
                        color:"rgba(255,255,255,.6)", borderRadius:6, padding:"0 12px", height:40,
                        fontSize:14, cursor:"pointer", flexShrink:0, letterSpacing:0,
                        display:"flex", alignItems:"center", gap:6, whiteSpace:"nowrap",
                        fontFamily:"'DM Mono',monospace",
                    }}
                >
                    {type==="prereq" ? <><span>→</span><span style={{fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>prereq</span></> : <><span>↔</span><span style={{fontSize:9,letterSpacing:"0.07em",textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>assoc</span></>}
                </button>
                <input
                    value={to}
                    onChange={e=>setTo(e.target.value)}
                    onKeyDown={handleKey}
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
                <div style={{ width:"100%", maxWidth:640, marginBottom:28, maxHeight:"40vh", overflowY:"auto" }}>
                    {edges.map((e, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 10px", borderBottom:"1px solid rgba(255,255,255,.05)", fontSize:12 }}>
                            <span style={{ color:"rgba(255,255,255,.7)", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.from}</span>
                            <span style={{ color:"rgba(255,255,255,.3)", flexShrink:0, fontSize:13 }}>{e.type==="prereq"?"→":"↔"}</span>
                            <span style={{ fontSize:8, letterSpacing:"0.07em", textTransform:"uppercase", color:"rgba(255,255,255,.25)", flexShrink:0 }}>{e.type}</span>
                            <span style={{ color:"rgba(255,255,255,.7)", flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"right" }}>{e.to}</span>
                            <button
                                onClick={()=>remove(i)}
                                style={{ background:"none", border:"none", color:"rgba(255,255,255,.25)", cursor:"pointer", fontSize:14, flexShrink:0, lineHeight:1, padding:"0 4px" }}
                                onMouseEnter={e=>e.currentTarget.style.color="rgba(255,100,100,.7)"}
                                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.25)"}
                            >✕</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Build button */}
            <button
                onClick={build}
                style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.25)", color:"rgba(255,255,255,.85)", borderRadius:8, padding:"10px 36px", fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", fontFamily:"'DM Mono',monospace" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.18)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}
            >
                build graph →
            </button>

            <div style={{ marginTop:32, fontSize:9, color:"rgba(255,255,255,.2)", letterSpacing:"0.06em", textTransform:"uppercase" }}>
                tip: press enter to add · click the arrow to toggle edge type
            </div>
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    flex:1, minWidth:100, height:40,
    background:"rgba(255,255,255,.05)",
    border:"1px solid rgba(255,255,255,.15)",
    borderRadius:6, padding:"0 12px",
    color:"rgba(255,255,255,.85)", fontSize:12,
    fontFamily:"'DM Mono',monospace",
    outline:"none",
};

// ── Page ──────────────────────────────────────────────────────────────────────

const LifeGraphPage: React.FC = () => {
    const [storedEdges, setStoredEdges] = useState<StoredEdge[] | null>(() => load());
    const [editing,     setEditing]     = useState(false);

    // If no data or editing → show form
    if (!storedEdges || editing) {
        return (
            <Form
                initial={storedEdges ?? []}
                onBuild={edges => { setStoredEdges(edges); setEditing(false); }}
            />
        );
    }

    const { nodes, edges } = edgesToGraph(storedEdges);
    return (
        <LifeGraphView
            nodes={nodes}
            edges={edges}
            colorMode="mono"
            title="Life Graph"
            subtitle="your roles · prereqs · associations"
            onEdit={() => setEditing(true)}
        />
    );
};

export default LifeGraphPage;
