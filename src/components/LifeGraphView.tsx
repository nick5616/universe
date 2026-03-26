// src/components/LifeGraphView.tsx
import React, { useEffect, useRef } from "react";

// ── Theme ─────────────────────────────────────────────────────────────────────

export interface GraphTheme {
    /** Map of layer name → hex color. Nodes without a matching layer use fallbackColor. */
    layerColors: Record<string, string>;
    fallbackColor: string;
    /** Whether to render small status-indicator dots on nodes */
    showStatusDots: boolean;
}

export const NICOLE_THEME: GraphTheme = {
    layerColors: {
        foundation:     "#55cdfc",
        infrastructure: "#f7a8b8",
        maker:          "#ffffff",
        performer:      "#ff9de2",
        body:           "#a8e6cf",
    },
    fallbackColor:  "#ffffff",
    showStatusDots: true,
};

export const PUBLIC_THEME: GraphTheme = {
    layerColors: {
        foundation:     "#fbbf24",
        infrastructure: "#a78bfa",
        maker:          "#34d399",
        performer:      "#f472b6",
        body:           "#60a5fa",
    },
    fallbackColor:  "#e2e2e2",
    showStatusDots: false,
};

// ── Public types ──────────────────────────────────────────────────────────────

export type EdgeType = "prereq" | "assoc";

export interface GraphNodeInput {
    id: string;
    label: string;
    layer?: string;
    status?: "active" | "ongoing" | "soon" | "later";
    desc?: string;
}

export interface GraphEdgeInput {
    s: string;
    t: string;
    type: EdgeType;
}

interface LifeGraphViewProps {
    nodes: GraphNodeInput[];
    edges: GraphEdgeInput[];
    theme: GraphTheme;
    title?: string;
    subtitle?: string;
    /** If provided, shows an edit button bottom-left when nothing is hovered */
    onEdit?: () => void;
}

// ── Internal working type ─────────────────────────────────────────────────────

interface WorkingNode extends GraphNodeInput {
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
}

// ── Color helpers ─────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<string, string> = {
    active: "current", ongoing: "ongoing", soon: "starting soon", later: "phase two",
};
const STATUS_COLOR: Record<string, string> = {
    active: "#55cdfc", ongoing: "#a8e6cf", soon: "#ff9de2", later: "rgba(255,255,255,0.3)",
};
const STATUS_DOT: Record<string, string> = {
    active: "#55cdfc", ongoing: "#a8e6cf", soon: "#f7a8b8", later: "#444",
};

function hexToRgb(hex: string): string {
    if (!hex.startsWith("#") || hex.length < 7) return "200,200,200";
    return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

function getNodeColor(node: GraphNodeInput, theme: GraphTheme): string {
    return (node.layer && theme.layerColors[node.layer]) || theme.fallbackColor;
}

// ── Physics ───────────────────────────────────────────────────────────────────

function spherePos(i: number, total: number, radius: number) {
    const phi   = Math.acos(-1 + (2 * i) / Math.max(total, 1));
    const theta = Math.sqrt(total * Math.PI) * phi;
    return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
    };
}

function buildWorkingNodes(inputs: GraphNodeInput[]): WorkingNode[] {
    const layerOrder  = [...new Set(inputs.map(n => n.layer ?? "default"))];
    const layerGroups: Record<string, GraphNodeInput[]> = {};
    layerOrder.forEach(l => { layerGroups[l] = inputs.filter(n => (n.layer ?? "default") === l); });

    return inputs.map(n => {
        const layer      = n.layer ?? "default";
        const layerIdx   = layerOrder.indexOf(layer);
        const group      = layerGroups[layer];
        const idxInGroup = group.indexOf(n);
        const radius     = 140 + layerIdx * 40;
        const pos        = spherePos(idxInGroup, group.length, radius);
        const angle      = (layerIdx / layerOrder.length) * Math.PI * 2;
        return {
            ...n,
            x:  pos.x + Math.cos(angle) * 60,
            y:  pos.y + (layerIdx - layerOrder.length / 2) * 55,
            z:  pos.z + Math.sin(angle) * 60,
            vx: 0, vy: 0, vz: 0,
        };
    });
}

function simulate(nodes: WorkingNode[], edges: GraphEdgeInput[], iterations = 300) {
    const k = 180, repulsion = 8000;
    for (let iter = 0; iter < iterations; iter++) {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const dx=b.x-a.x, dy=b.y-a.y, dz=b.z-a.z;
                const dist = Math.sqrt(dx*dx+dy*dy+dz*dz) || 0.01;
                const f = repulsion / (dist*dist);
                a.vx-=(dx/dist)*f; a.vy-=(dy/dist)*f; a.vz-=(dz/dist)*f;
                b.vx+=(dx/dist)*f; b.vy+=(dy/dist)*f; b.vz+=(dz/dist)*f;
            }
        }
        edges.forEach(e => {
            const a=nodes.find(n=>n.id===e.s), b=nodes.find(n=>n.id===e.t);
            if (!a||!b) return;
            const dx=b.x-a.x, dy=b.y-a.y, dz=b.z-a.z;
            const dist=Math.sqrt(dx*dx+dy*dy+dz*dz)||0.01;
            const f=(dist-k)*0.015;
            a.vx+=(dx/dist)*f; a.vy+=(dy/dist)*f; a.vz+=(dz/dist)*f;
            b.vx-=(dx/dist)*f; b.vy-=(dy/dist)*f; b.vz-=(dz/dist)*f;
        });
        nodes.forEach(n => { n.vx-=n.x*0.005; n.vy-=n.y*0.005; n.vz-=n.z*0.005; });
        nodes.forEach(n => {
            n.x+=n.vx; n.y+=n.vy; n.z+=n.vz;
            n.vx*=0.85; n.vy*=0.85; n.vz*=0.85;
        });
    }
}

// ── Component ─────────────────────────────────────────────────────────────────

const LifeGraphView: React.FC<LifeGraphViewProps> = ({
    nodes: nodeInputs,
    edges,
    theme,
    title = "Life Graph",
    subtitle = "",
    onEdit,
}) => {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const stateRef   = useRef({
        rotX: -0.3, rotY: 0.4, zoom: 1,
        dragging: false, lastMX: 0, lastMY: 0,
        mouseX: -9999, mouseY: -9999,
        hoveredNode: null as WorkingNode | null,
        time: 0, W: 0, H: 0, raf: 0,
    });
    const nodesRef   = useRef<WorkingNode[]>([]);

    const bannerRef   = useRef<HTMLDivElement>(null);
    const hbTitleRef  = useRef<HTMLSpanElement>(null);
    const hbDescRef   = useRef<HTMLSpanElement>(null);
    const hbStatusRef = useRef<HTMLSpanElement>(null);
    const hbEdgesRef  = useRef<HTMLDivElement>(null);
    const editBtnRef  = useRef<HTMLButtonElement>(null);

    // ── Canvas / render loop ──────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const s   = stateRef.current;

        const nodes = buildWorkingNodes(nodeInputs);
        simulate(nodes, edges, 300);
        nodesRef.current = nodes;

        const edgeLengths = edges.map(e => {
            const a=nodes.find(n=>n.id===e.s), b=nodes.find(n=>n.id===e.t);
            if (!a||!b) return 0;
            const dx=a.x-b.x, dy=a.y-b.y, dz=a.z-b.z;
            return Math.sqrt(dx*dx+dy*dy+dz*dz);
        });
        const elMax = Math.max(...edgeLengths) || 1;
        const elMin = Math.min(...edgeLengths.filter(l=>l>0)) || 1;

        const resize = () => { s.W=canvas.width=window.innerWidth; s.H=canvas.height=window.innerHeight; };
        resize();
        window.addEventListener("resize", resize);

        const onMouseDown = (e: MouseEvent) => { s.dragging=true; s.lastMX=e.clientX; s.lastMY=e.clientY; };
        const onMouseUp   = ()              => { s.dragging=false; };
        const onMouseMove = (e: MouseEvent) => {
            s.mouseX=e.clientX; s.mouseY=e.clientY;
            if (s.dragging) {
                s.rotY+=(e.clientX-s.lastMX)*0.008; s.rotX+=(e.clientY-s.lastMY)*0.008;
                s.lastMX=e.clientX; s.lastMY=e.clientY;
            }
        };
        const onWheel = (e: WheelEvent) => {
            s.zoom *= e.deltaY>0 ? 0.93 : 1.07;
            s.zoom  = Math.max(0.4, Math.min(3, s.zoom));
        };
        const onTouchStart = (e: TouchEvent) => { s.dragging=true; s.lastMX=e.touches[0].clientX; s.lastMY=e.touches[0].clientY; };
        const onTouchEnd   = ()              => { s.dragging=false; };
        const onTouchMove  = (e: TouchEvent) => {
            e.preventDefault();
            if (s.dragging) {
                s.rotY+=(e.touches[0].clientX-s.lastMX)*0.008;
                s.rotX+=(e.touches[0].clientY-s.lastMY)*0.008;
                s.lastMX=e.touches[0].clientX; s.lastMY=e.touches[0].clientY;
            }
        };
        canvas.addEventListener("mousedown",  onMouseDown);
        canvas.addEventListener("mouseup",    onMouseUp);
        canvas.addEventListener("mousemove",  onMouseMove);
        canvas.addEventListener("wheel",      onWheel, { passive: true });
        canvas.addEventListener("touchstart", onTouchStart);
        canvas.addEventListener("touchend",   onTouchEnd);
        canvas.addEventListener("touchmove",  onTouchMove, { passive: false });

        const project = (x: number, y: number, z: number) => {
            const cosY=Math.cos(s.rotY), sinY=Math.sin(s.rotY);
            const x1=x*cosY-z*sinY, z1=x*sinY+z*cosY;
            const cosX=Math.cos(s.rotX), sinX=Math.sin(s.rotX);
            const y2=y*cosX-z1*sinX, z2=y*sinX+z1*cosX;
            const fov=600*s.zoom, dist=fov+z2+200;
            return { px:(x1*fov)/dist+s.W/2, py:(y2*fov)/dist+s.H/2, scale:fov/dist, z:z2 };
        };

        const draw = () => {
            s.time += 0.016;
            ctx.clearRect(0,0,s.W,s.H);
            ctx.fillStyle="#0a0a0f"; ctx.fillRect(0,0,s.W,s.H);

            const proj: Record<string,{px:number;py:number;scale:number;camZ:number}> = {};
            nodes.forEach(n => { const p=project(n.x,n.y,n.z); proj[n.id]={px:p.px,py:p.py,scale:p.scale,camZ:p.z}; });

            const camZs   = Object.values(proj).map(p=>p.camZ);
            const camZMin = Math.min(...camZs), camZMax=Math.max(...camZs);
            const camZRange = (camZMax-camZMin)||1;
            const depthT = (id: string) => (proj[id].camZ-camZMin)/camZRange;

            // Edges
            edges.forEach((e, ei) => {
                const a=proj[e.s], b=proj[e.t];
                if (!a||!b) return;
                const isHl  = s.hoveredNode && (s.hoveredNode.id===e.s||s.hoveredNode.id===e.t);
                const avgDt = (depthT(e.s)+depthT(e.t))/2;
                const lenF  = 1-((edgeLengths[ei]-elMin)/(elMax-elMin));
                const baseA = 0.28+avgDt*0.52+lenF*0.20;
                const alpha = isHl ? 0.95 : (s.hoveredNode ? baseA*0.15 : baseA);
                const lw    = isHl ? 2.5 : (0.7+lenF*1.1);

                const na  = nodes.find(n=>n.id===e.s)!;
                const nb  = nodes.find(n=>n.id===e.t)!;
                const rgbA = hexToRgb(getNodeColor(na, theme));
                const rgbB = hexToRgb(getNodeColor(nb, theme));

                const grd = ctx.createLinearGradient(a.px,a.py,b.px,b.py);
                if (e.type==="assoc") {
                    ctx.setLineDash([4,6]);
                    grd.addColorStop(0,`rgba(${rgbA},${alpha*0.75})`);
                    grd.addColorStop(1,`rgba(${rgbB},${alpha*0.75})`);
                    ctx.lineWidth=lw*0.8;
                } else {
                    ctx.setLineDash([]);
                    grd.addColorStop(0,`rgba(${rgbA},${alpha})`);
                    grd.addColorStop(1,`rgba(${rgbB},${alpha*0.75})`);
                    ctx.lineWidth=lw;
                }
                ctx.beginPath();
                ctx.moveTo(a.px,a.py);
                ctx.quadraticCurveTo(
                    (a.px+b.px)/2+(b.py-a.py)*0.08,
                    (a.py+b.py)/2-(b.px-a.px)*0.08,
                    b.px, b.py
                );
                ctx.strokeStyle=grd; ctx.stroke(); ctx.setLineDash([]);

                if (e.type==="prereq" && isHl) {
                    const ang=Math.atan2(b.py-a.py,b.px-a.px);
                    const tip={ x:b.px-Math.cos(ang)*(12*b.scale+4), y:b.py-Math.sin(ang)*(12*b.scale+4) };
                    ctx.beginPath();
                    ctx.moveTo(tip.x,tip.y);
                    ctx.lineTo(tip.x-Math.cos(ang-0.4)*8, tip.y-Math.sin(ang-0.4)*8);
                    ctx.moveTo(tip.x,tip.y);
                    ctx.lineTo(tip.x-Math.cos(ang+0.4)*8, tip.y-Math.sin(ang+0.4)*8);
                    ctx.strokeStyle=`rgba(${rgbA},0.9)`; ctx.lineWidth=1.5; ctx.stroke();
                }
            });

            // Nodes
            const drawOrder = [...nodes].sort((a,b)=>proj[a.id].camZ-proj[b.id].camZ);
            let newHovered: WorkingNode|null = null;
            let minDist = 999;

            drawOrder.forEach(node => {
                const p    = proj[node.id];
                const dt   = depthT(node.id);
                const col  = getNodeColor(node, theme);
                const rgb  = hexToRgb(col);
                const isHov = s.hoveredNode?.id === node.id;
                const r    = Math.max(5, 11*p.scale);
                const nr   = r * (isHov ? 1+Math.sin(s.time*4)*0.15 : 1);

                const dx=s.mouseX-p.px, dy=s.mouseY-p.py;
                if (Math.sqrt(dx*dx+dy*dy) < nr+12 && Math.sqrt(dx*dx+dy*dy) < minDist) {
                    minDist = Math.sqrt(dx*dx+dy*dy);
                    newHovered = node;
                }

                const na = 0.18+dt*0.82;
                if (isHov) {
                    const g=ctx.createRadialGradient(p.px,p.py,0,p.px,p.py,nr*3.5);
                    g.addColorStop(0,`rgba(${rgb},0.3)`); g.addColorStop(1,`rgba(${rgb},0)`);
                    ctx.beginPath(); ctx.arc(p.px,p.py,nr*3.5,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
                }
                ctx.beginPath(); ctx.arc(p.px,p.py,nr+3,0,Math.PI*2);
                ctx.strokeStyle=`rgba(${rgb},${na*(isHov?0.65:0.18)})`; ctx.lineWidth=1; ctx.stroke();

                const g2=ctx.createRadialGradient(p.px-nr*0.3,p.py-nr*0.3,0,p.px,p.py,nr);
                g2.addColorStop(0,`rgba(${rgb},${na})`); g2.addColorStop(1,`rgba(${rgb},${na*0.55})`);
                ctx.beginPath(); ctx.arc(p.px,p.py,nr,0,Math.PI*2); ctx.fillStyle=g2; ctx.fill();

                if (theme.showStatusDots && node.status) {
                    ctx.beginPath();
                    ctx.arc(p.px+nr*0.62, p.py-nr*0.62, Math.max(2,2.8*p.scale), 0, Math.PI*2);
                    ctx.fillStyle = STATUS_DOT[node.status]||"#444"; ctx.fill();
                }

                const isConn = s.hoveredNode && s.hoveredNode.id!==node.id &&
                    edges.some(e=>(e.s===s.hoveredNode!.id&&e.t===node.id)||(e.t===s.hoveredNode!.id&&e.s===node.id));
                const lA = isHov?1:isConn?0.95:(p.scale>0.5?0.6:0.38);
                ctx.font=`${isHov||isConn?500:300} ${Math.max(9,11*p.scale)}px 'DM Mono',monospace`;
                ctx.fillStyle=`rgba(255,255,255,${lA})`; ctx.textAlign="center";
                ctx.fillText(node.label, p.px, p.py+nr+Math.max(10,13*p.scale));
            });

            s.hoveredNode = newHovered;
            s.raf = requestAnimationFrame(draw);
        };

        s.raf = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(s.raf);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousedown",  onMouseDown);
            canvas.removeEventListener("mouseup",    onMouseUp);
            canvas.removeEventListener("mousemove",  onMouseMove);
            canvas.removeEventListener("wheel",      onWheel);
            canvas.removeEventListener("touchstart", onTouchStart);
            canvas.removeEventListener("touchend",   onTouchEnd);
            canvas.removeEventListener("touchmove",  onTouchMove);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Banner + edit-button RAF ──────────────────────────────────────────────
    useEffect(() => {
        let raf: number;
        let lastId: string | null = "INIT";
        const update = () => {
            const node    = stateRef.current.hoveredNode;
            const banner  = bannerRef.current;
            const editBtn = editBtnRef.current;

            if (editBtn) {
                editBtn.style.opacity      = node ? "0" : "1";
                editBtn.style.pointerEvents = node ? "none" : "auto";
            }

            if (banner) {
                if (node) {
                    if (node.id !== lastId) {
                        lastId = node.id;
                        banner.classList.add("lgv-visible");
                        if (hbTitleRef.current) {
                            hbTitleRef.current.textContent = node.label;
                            hbTitleRef.current.style.color = getNodeColor(node, theme);
                        }
                        if (hbDescRef.current) hbDescRef.current.textContent = node.desc || "";
                        if (hbStatusRef.current) {
                            hbStatusRef.current.textContent = node.status ? STATUS_LABEL[node.status] : "";
                            hbStatusRef.current.style.color = node.status ? (STATUS_COLOR[node.status]||"rgba(255,255,255,.3)") : "";
                        }
                        if (hbEdgesRef.current) {
                            hbEdgesRef.current.innerHTML = "";
                            edges.filter(e=>e.s===node.id||e.t===node.id).forEach(e => {
                                const isSrc  = e.s === node.id;
                                const other  = nodesRef.current.find(n=>n.id===(isSrc?e.t:e.s));
                                const otherColor = other ? getNodeColor(other, theme) : "#ccc";
                                const arrow    = e.type==="prereq" ? (isSrc?"→":"←") : "↔";
                                const typeLabel = e.type==="prereq" ? (isSrc?"prereq for":"requires") : "feeds";
                                const chip = document.createElement("span");
                                chip.className = "lgv-edge";
                                chip.innerHTML = `<span class="lgv-ea">${arrow}</span><span class="lgv-el" style="color:${otherColor}">${other?.label||""}</span><span class="lgv-et">${typeLabel}</span>`;
                                hbEdgesRef.current!.appendChild(chip);
                            });
                        }
                    }
                } else if (lastId !== null) {
                    lastId = null;
                    banner.classList.remove("lgv-visible");
                }
            }
            raf = requestAnimationFrame(update);
        };
        raf = requestAnimationFrame(update);
        return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme, edges]);

    // ── Render ────────────────────────────────────────────────────────────────
    const layerLegend = Object.entries(theme.layerColors);

    return (
        <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#0a0a0f", fontFamily:"'DM Mono',monospace", overflow:"hidden" }}>
            <style>{`
                .lgv-visible { opacity:1!important; transform:translateY(0)!important; }
                .lgv-edge { font-size:9px; letter-spacing:.04em; display:inline-flex; align-items:center; gap:5px; color:rgba(255,255,255,.38); margin-right:14px; }
                .lgv-ea   { opacity:.5; }
                .lgv-el   { font-weight:400; }
                .lgv-et   { font-size:8px; letter-spacing:.06em; text-transform:uppercase; opacity:.45; }
            `}</style>

            <canvas ref={canvasRef} style={{ position:"absolute", inset:0, cursor:"grab" }} />

            {/* Header */}
            <div style={{ position:"absolute", top:28, left:32, pointerEvents:"none" }}>
                <div style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:22, color:"rgba(255,255,255,.85)", letterSpacing:"-0.02em", lineHeight:1 }}>{title}</div>
                {subtitle && <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginTop:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>{subtitle}</div>}
            </div>

            {/* Instructions */}
            <div style={{ position:"absolute", top:28, right:32, fontSize:9, color:"rgba(255,255,255,.35)", letterSpacing:"0.06em", textTransform:"uppercase", textAlign:"right", lineHeight:2, pointerEvents:"none" }}>
                drag to rotate · scroll to zoom<br/>hover nodes to explore
            </div>

            {/* Hover banner */}
            <div ref={bannerRef} style={{ position:"absolute", bottom:44, left:0, right:0, minHeight:52, background:"rgba(14,14,22,.97)", borderTop:"1px solid rgba(255,255,255,.1)", display:"flex", flexDirection:"column", justifyContent:"center", gap:7, padding:"10px 32px 12px", opacity:0, transform:"translateY(4px)", transition:"opacity .18s ease, transform .18s ease", pointerEvents:"none" }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:12, flexWrap:"wrap" }}>
                    <span ref={hbTitleRef}  style={{ fontFamily:"'Instrument Serif',serif", fontStyle:"italic", fontSize:16, whiteSpace:"nowrap", flexShrink:0 }}/>
                    <span style={{ color:"rgba(255,255,255,.2)", fontSize:11, flexShrink:0 }}>—</span>
                    <span ref={hbDescRef}   style={{ fontSize:10.5, color:"rgba(255,255,255,.55)", letterSpacing:"0.025em", flex:1, minWidth:160, lineHeight:1.5 }}/>
                    <span ref={hbStatusRef} style={{ fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 8px", borderRadius:3, background:"rgba(255,255,255,.07)", whiteSpace:"nowrap", flexShrink:0, alignSelf:"center" }}/>
                </div>
                <div ref={hbEdgesRef} style={{ display:"flex", flexWrap:"wrap", gap:"6px 0" }}/>
            </div>

            {/* Footer legend */}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, display:"flex", alignItems:"center", background:"rgba(10,10,15,.88)", borderTop:"1px solid rgba(255,255,255,.08)", backdropFilter:"blur(14px)", padding:"0 28px", height:44, gap:20, pointerEvents:"none" }}>
                {layerLegend.length > 0 && (
                    <div style={{ display:"flex", alignItems:"center", gap:14, paddingRight:20, height:"100%", borderRight:"1px solid rgba(255,255,255,.07)", flexShrink:0 }}>
                        {layerLegend.map(([layer, color]) => (
                            <div key={layer} style={{ display:"flex", alignItems:"center", gap:6, fontSize:9, color:"rgba(255,255,255,.35)", letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                                <div style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0 }}/>
                                {layer}
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:9, color:"rgba(255,255,255,.35)", letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                        <div style={{ width:20, height:1, background:"rgba(255,255,255,.4)", flexShrink:0 }}/>prereq
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:9, color:"rgba(255,255,255,.35)", letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                        <div style={{ width:20, height:1, borderTop:"1px dashed rgba(255,255,255,.25)", flexShrink:0 }}/>assoc
                    </div>
                </div>
            </div>

            {/* Edit button — hidden while hovering a node */}
            {onEdit && (
                <button
                    ref={editBtnRef}
                    onClick={onEdit}
                    style={{ position:"absolute", bottom:56, left:28, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.15)", color:"rgba(255,255,255,.5)", borderRadius:6, padding:"5px 14px", fontSize:10, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", transition:"opacity .2s ease, background .15s ease", fontFamily:"'DM Mono',monospace" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}
                >
                    ✎ edit graph
                </button>
            )}
        </div>
    );
};

export default LifeGraphView;
