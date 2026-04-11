// src/pages/NicolePage.tsx
// Easter egg — accessible only at /nicole, no link from the main app.
import React from "react";
import LifeGraphView, { LifeGraphData, NICOLE_THEME } from "../components/LifeGraphView";

// ── Default data ──────────────────────────────────────────────────────────────

const NICOLE_DATA: LifeGraphData = {
    meta: {
        title: "Nicole's Life Graph",
        subtitle: "roles · prerequisites · associations · april 2026",
        version: "2.0",
    },
    nodes: [
        { id: "sleep",            label: "Sleep",                layer: "foundation",     status: "active",  desc: "The non-negotiable substrate. Everything else degrades without this." },
        { id: "eating",           label: "Eating / Nutrition",   layer: "foundation",     status: "active",  desc: "Fuel. Not a hobby, a root node. What you eat shapes everything downstream." },
        { id: "mentalHealth",     label: "Internal Work",        layer: "foundation",     status: "active",  desc: "Therapy, self-inquiry, staying grounded. The work that makes all other work possible." },
        { id: "financialStab",    label: "Financial Stability",  layer: "foundation",     status: "active",  desc: "The unsexy root. Stress here cascades everywhere. Protect it." },
        { id: "swejob",           label: "Full-Time SWE",        layer: "foundation",     status: "active",  desc: "The engine of stability right now. Unlocks time, money, and everything downstream." },
        { id: "socialLife",       label: "Social Life",          layer: "foundation",     status: "active",  desc: "Friends, community, Capitol Hill. The connective tissue of a real life." },

        { id: "voiceTraining",    label: "Voice Training",       layer: "infrastructure", status: "active",  desc: "10 min/day. TransVoiceLessons. The infrastructure the performer layer is waiting on." },
        { id: "portfolio",        label: "Portfolio",            layer: "infrastructure", status: "active",  desc: "nicolebelovoskey.com. Makes the career narrative hold. Already real." },
        { id: "spanishStudy",     label: "Spanish",              layer: "infrastructure", status: "soon",    desc: "You grew up around it. Fluency by 30 is realistic. Start with 15 min/day. Duolingo + conversation." },
        { id: "reading",          label: "Reading (Nonfiction)", layer: "infrastructure", status: "soon",    desc: "Ideas you haven't had yet live in books. Feed the songwriter and the thinker." },
        { id: "fiction",          label: "Reading (Fiction)",    layer: "infrastructure", status: "later",   desc: "Not yet. But someday — fiction teaches you how humans feel described. It'll feed the songwriting." },

        { id: "lifting",          label: "Weightlifting",        layer: "body",           status: "active",  desc: "Already happening. Your body is changing and the lifting is part of it." },
        { id: "yoga",             label: "Yoga / Pilates",       layer: "body",           status: "active",  desc: "Less consistent than lifting. That's fine. Move when you can." },
        { id: "beingOutside",     label: "Being Outside",        layer: "body",           status: "active",  desc: "Not exercise. Just presence in natural environments. Different effect on the nervous system than anything else." },
        { id: "cooking",          label: "Cooking",              layer: "body",           status: "soon",    desc: "Body, craft, creativity, and connection all at once. Massively underrated root node." },
        { id: "dance",            label: "Dance Lessons",        layer: "body",           status: "later",   desc: "Phase two. Requires time + stability. Worth the wait." },
        { id: "beingAWoman",      label: "Being a Woman",        layer: "body",           status: "ongoing", desc: "Not a destination. Not a goal. Ongoing, already happening, already real. A lens on everything." },

        { id: "deepConversation", label: "Deep Conversation",    layer: "mind",           status: "active",  desc: "Not socializing — the kind of talk that changes how you see things. Rare. Protect it." },
        { id: "solitude",         label: "Intentional Solitude", layer: "mind",           status: "soon",    desc: "Not being alone — learning to be with yourself. Different thing." },
        { id: "mementoMori",      label: "Memento Mori",         layer: "mind",           status: "soon",    desc: "Sitting with finitude. Asking: does this matter? Clarifies everything. A lens, not a task." },
        { id: "abstraction",      label: "Abstraction Practice", layer: "mind",           status: "active",  desc: "Building frameworks. The life graph itself is this. Finding the pattern behind the pattern." },

        { id: "drawing",          label: "Drawing",              layer: "maker",          status: "active",  desc: "Pencil, pen, acrylic, digital. The oldest practice. Keep it alive at whatever heat." },
        { id: "musicProd",        label: "Music Production",     layer: "maker",          status: "active",  desc: "Ableton + FL Studio. The dual-DAW workflow. The deepest thing." },
        { id: "songwriting",      label: "Songwriting",          layer: "maker",          status: "active",  desc: "Where music production meets language meets feeling. This is the core creative act." },
        { id: "writing",          label: "Writing",              layer: "maker",          status: "soon",    desc: "Articulating your own ideas. Feeds songwriting, abstraction, everything. Start small." },
        { id: "dj",               label: "DJing",                layer: "maker",          status: "soon",    desc: "Rekordbox or Serato. The bar that motivated you. Requires music production foundation." },
        { id: "singingLessons",   label: "Singing Lessons",      layer: "maker",          status: "later",   desc: "Phase two. Requires voice training baseline. Will feed the music artist node." },
        { id: "inventor",         label: "Inventor / Products",  layer: "maker",          status: "later",   desc: "The solopreneur half. Build things with real distribution. Requires audience first." },

        { id: "drawingTiktok",    label: "Drawing TikTok",       layer: "performer",      status: "soon",    desc: "Hands only. No voice, no face. You already built this in Thailand. Could restart tomorrow." },
        { id: "instaModel",       label: "Instagram",            layer: "performer",      status: "soon",    desc: "Post as yourself. New account incoming. The world should see you." },
        { id: "clubbing",         label: "Clubbing / DJ Sets",   layer: "performer",      status: "active",  desc: "Already happening. Capitol Hill. The thing that motivated the whole DJ thread." },
        { id: "musicArtist",      label: "Music Artist",         layer: "performer",      status: "later",   desc: "Public-facing. Trans is cool in your genres. Requires voice training + music production." },
        { id: "devLogger",        label: "Dev Logger / YouTube", layer: "performer",      status: "later",   desc: "Build in public. Phase one solopreneur. Requires job + voice training." },
    ],
    edges: [
        { s: "sleep",            t: "mentalHealth",     type: "assoc"  },
        { s: "sleep",            t: "lifting",          type: "prereq" },
        { s: "sleep",            t: "voiceTraining",    type: "prereq" },
        { s: "sleep",            t: "musicProd",        type: "prereq" },
        { s: "sleep",            t: "songwriting",      type: "prereq" },
        { s: "sleep",            t: "drawing",          type: "prereq" },
        { s: "sleep",            t: "reading",          type: "prereq" },
        { s: "sleep",            t: "spanishStudy",     type: "prereq" },

        { s: "eating",           t: "lifting",          type: "prereq" },
        { s: "eating",           t: "mentalHealth",     type: "assoc"  },
        { s: "cooking",          t: "eating",           type: "assoc"  },

        { s: "financialStab",    t: "swejob",           type: "assoc"  },
        { s: "swejob",           t: "financialStab",    type: "prereq" },
        { s: "swejob",           t: "voiceTraining",    type: "prereq" },
        { s: "swejob",           t: "devLogger",        type: "prereq" },
        { s: "swejob",           t: "inventor",         type: "prereq" },
        { s: "portfolio",        t: "swejob",           type: "assoc"  },
        { s: "portfolio",        t: "devLogger",        type: "assoc"  },

        { s: "mentalHealth",     t: "beingAWoman",      type: "assoc"  },
        { s: "mentalHealth",     t: "socialLife",       type: "assoc"  },
        { s: "mentalHealth",     t: "solitude",         type: "assoc"  },
        { s: "mentalHealth",     t: "mementoMori",      type: "assoc"  },
        { s: "mentalHealth",     t: "abstraction",      type: "assoc"  },

        { s: "lifting",          t: "beingAWoman",      type: "assoc"  },
        { s: "yoga",             t: "beingAWoman",      type: "assoc"  },
        { s: "dance",            t: "beingAWoman",      type: "assoc"  },
        { s: "dance",            t: "clubbing",         type: "assoc"  },
        { s: "beingOutside",     t: "mentalHealth",     type: "assoc"  },
        { s: "beingOutside",     t: "lifting",          type: "prereq" },
        { s: "beingOutside",     t: "solitude",         type: "assoc"  },

        { s: "beingAWoman",      t: "instaModel",       type: "assoc"  },
        { s: "beingAWoman",      t: "musicArtist",      type: "assoc"  },
        { s: "beingAWoman",      t: "songwriting",      type: "assoc"  },
        { s: "beingAWoman",      t: "deepConversation", type: "assoc"  },

        { s: "voiceTraining",    t: "singingLessons",   type: "prereq" },
        { s: "voiceTraining",    t: "musicArtist",      type: "prereq" },
        { s: "voiceTraining",    t: "devLogger",        type: "prereq" },

        { s: "reading",          t: "songwriting",      type: "assoc"  },
        { s: "reading",          t: "writing",          type: "assoc"  },
        { s: "reading",          t: "abstraction",      type: "assoc"  },
        { s: "fiction",          t: "songwriting",      type: "assoc"  },
        { s: "fiction",          t: "writing",          type: "assoc"  },
        { s: "spanishStudy",     t: "deepConversation", type: "assoc"  },
        { s: "spanishStudy",     t: "abstraction",      type: "assoc"  },
        { s: "deepConversation", t: "songwriting",      type: "assoc"  },
        { s: "deepConversation", t: "abstraction",      type: "assoc"  },
        { s: "deepConversation", t: "writing",          type: "assoc"  },
        { s: "solitude",         t: "songwriting",      type: "assoc"  },
        { s: "solitude",         t: "abstraction",      type: "assoc"  },
        { s: "mementoMori",      t: "songwriting",      type: "assoc"  },
        { s: "mementoMori",      t: "deepConversation", type: "assoc"  },
        { s: "mementoMori",      t: "abstraction",      type: "assoc"  },
        { s: "abstraction",      t: "inventor",         type: "assoc"  },
        { s: "abstraction",      t: "writing",          type: "assoc"  },

        { s: "drawing",          t: "drawingTiktok",    type: "prereq" },
        { s: "drawing",          t: "inventor",         type: "assoc"  },
        { s: "drawing",          t: "songwriting",      type: "assoc"  },
        { s: "musicProd",        t: "dj",               type: "prereq" },
        { s: "musicProd",        t: "musicArtist",      type: "prereq" },
        { s: "musicProd",        t: "songwriting",      type: "assoc"  },
        { s: "songwriting",      t: "musicArtist",      type: "prereq" },
        { s: "songwriting",      t: "writing",          type: "assoc"  },
        { s: "writing",          t: "devLogger",        type: "assoc"  },
        { s: "writing",          t: "inventor",         type: "assoc"  },
        { s: "singingLessons",   t: "musicArtist",      type: "prereq" },

        { s: "socialLife",       t: "clubbing",         type: "assoc"  },
        { s: "socialLife",       t: "instaModel",       type: "assoc"  },
        { s: "socialLife",       t: "deepConversation", type: "prereq" },
        { s: "clubbing",         t: "dj",               type: "assoc"  },
        { s: "drawingTiktok",    t: "instaModel",       type: "assoc"  },
        { s: "musicArtist",      t: "dj",               type: "assoc"  },
        { s: "devLogger",        t: "inventor",         type: "assoc"  },
        { s: "inventor",         t: "devLogger",        type: "assoc"  },
    ],
};

// ── Page ──────────────────────────────────────────────────────────────────────

const NicolePage: React.FC = () => (
    <LifeGraphView
        nodes={NICOLE_DATA.nodes}
        edges={NICOLE_DATA.edges}
        theme={NICOLE_THEME}
        title={NICOLE_DATA.meta.title}
        subtitle={NICOLE_DATA.meta.subtitle}
    />
);

export default NicolePage;
