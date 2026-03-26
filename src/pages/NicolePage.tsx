// src/pages/NicolePage.tsx
// Easter egg — accessible only at /nicole, no link from the main app.
import React from "react";
import LifeGraphView, { GraphNodeInput, GraphEdgeInput, NICOLE_THEME } from "../components/LifeGraphView";

const NODES: GraphNodeInput[] = [
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

const EDGES: GraphEdgeInput[] = [
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

const NicolePage: React.FC = () => (
    <LifeGraphView
        nodes={NODES}
        edges={EDGES}
        theme={NICOLE_THEME}
        title="Nicole's Life Graph"
        subtitle="roles · prerequisites · associations · march 2026"
    />
);

export default NicolePage;
