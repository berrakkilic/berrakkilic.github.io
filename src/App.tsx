import { useState, useEffect, useCallback, useRef } from "react";

// ─── tokens ──────────────────────────────────────────────────────────────────
const C = {
  ivory: "#F8F4EF",
  plum: "#643449",
  plumDark: "#4e2839",
  rose: "#A45F75",
  ink: "#35252D",
  blush: "#EEE1DD",
  border: "#DDD2CC",
  muted: "#8a6e76",
} as const;

// ─── project data ─────────────────────────────────────────────────────────────
type Project = {
  id: string;
  title: string;
  category: string;
  tools: readonly string[];
  context?: string;
  summary: string;
  contributions: readonly string[];
  detail: {
    overview: string;
    process: readonly { phase: string; description: string }[];
    screens: readonly {
      label: string;
      description: string;
      render: () => React.ReactNode;
    }[];
  };
};

const projects: Project[] = [
  {
    id: "plant-care",
    title: "Plant Care App",
    category: "UI/UX Design · Frontend Development",
    tools: ["Figma", "React", "Python"],
    summary:
      "Designing and building a plant care application, then using usability experiments to inform the next iteration.",
    contributions: [
      "Designed the application's interface and user experience in Figma.",
      "Built and deployed the application using React.",
      "Conducted structured usability experiments and analysed results using Python to inform design iterations.",
    ],
    detail: {
      overview:
        "A full-cycle project spanning interface design, React development, and evidence-based iteration. The goal was to make plant care routines accessible and legible — surfacing what needs attention without overwhelming the user.",
      process: [
        {
          phase: "Design",
          description:
            "Explored user needs through research, then designed the interface in Figma — focusing on clear watering status, plant identity, and low-friction task completion.",
        },
        {
          phase: "Development",
          description:
            "Built and deployed the application in React, translating Figma designs into a working frontend with dynamic plant state and care reminders.",
        },
        {
          phase: "Evaluation",
          description:
            "Ran structured usability experiments with participants. Collected interaction data and analysed results with Python to identify friction points and inform the next design iteration.",
        },
      ],
      screens: [
        {
          label: "Home — Plant Overview",
          description: "The main view lists all plants with their watering status at a glance.",
          render: () => <PlantHomeScreen />,
        },
        {
          label: "Plant Detail",
          description: "Tapping a plant reveals care history, next watering date, and species notes.",
          render: () => <PlantDetailScreen />,
        },
        {
          label: "Care Schedule",
          description: "A weekly view surfaces upcoming tasks without requiring the user to check each plant individually.",
          render: () => <PlantScheduleScreen />,
        },
      ],
    },
  },
  {
    id: "3d-game",
    title: "3D Game Prototype",
    category: "Interaction Design · Unity Development",
    tools: ["Unity", "C#", "ProBuilder"],
    context: "University group project",
    summary:
      "A Unity group project exploring how movement, selection, manipulation, and navigation shape an interactive experience.",
    contributions: [
      "Created a level blockout in ProBuilder and iterated on it using Unity assets.",
      "Implemented movement, selection, manipulation, and navigation mechanics in C#.",
      "Playtested against usability criteria and refined the design.",
    ],
    detail: {
      overview:
        "A university group project in Unity, exploring the core interaction verbs of a 3D environment: how the player moves through space, selects and manipulates objects, and builds a mental model of the level.",
      process: [
        {
          phase: "Level Design",
          description:
            "Blocked out the level geometry in ProBuilder, iterating on spatial flow and sight lines before bringing in refined Unity assets.",
        },
        {
          phase: "Mechanics",
          description:
            "Implemented movement, selection, manipulation, and navigation mechanics in C# — focusing on responsiveness and predictability from the player's perspective.",
        },
        {
          phase: "Playtesting",
          description:
            "Evaluated the prototype against usability criteria: were interactions learnable, consistent, and recoverable? Refined mechanics and layout based on findings.",
        },
      ],
      screens: [
        {
          label: "Level Blockout",
          description: "ProBuilder geometry establishing spatial layout, pathways, and key interaction zones.",
          render: () => <GameLevelScreen />,
        },
        {
          label: "Interaction Mechanics",
          description: "The four core verbs — movement, selection, manipulation, navigation — implemented in C#.",
          render: () => <GameMechanicsScreen />,
        },
        {
          label: "Playtesting Process",
          description: "Usability criteria used to evaluate and iterate on the prototype.",
          render: () => <GamePlaytestScreen />,
        },
      ],
    },
  },
];

// ─── Plant Care Screens ───────────────────────────────────────────────────────

function PhoneFrame({ children, bg = C.ivory }: { children: React.ReactNode; bg?: string }) {
  return (
    <div style={{
      width: 220,
      height: 420,
      backgroundColor: C.ink,
      borderRadius: 32,
      padding: 10,
      flexShrink: 0,
      boxShadow: "0 8px 32px rgba(53,37,45,0.18)",
    }}>
      {/* notch */}
      <div style={{
        width: 60,
        height: 10,
        backgroundColor: C.ink,
        borderRadius: 10,
        margin: "0 auto 4px",
        position: "relative",
        zIndex: 2,
      }} />
      <div style={{
        flex: 1,
        height: "calc(100% - 14px)",
        backgroundColor: bg,
        borderRadius: 24,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {children}
      </div>
    </div>
  );
}

function PlantHomeScreen() {
  const plants = [
    { name: "Monstera", status: "Water today", dot: C.rose, days: 0 },
    { name: "Pothos", status: "In 2 days", dot: "#b8c9a3", days: 2 },
    { name: "Cactus", status: "In 8 days", dot: "#b8c9a3", days: 8 },
    { name: "Peace Lily", status: "Overdue", dot: "#c97b60", days: -1 },
  ];
  return (
    <PhoneFrame bg={C.ivory}>
      {/* app bar */}
      <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 600, color: C.ink }}>My Plants</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.625rem", color: C.muted, marginTop: 2 }}>4 plants · 1 needs water</p>
      </div>
      {/* list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {plants.map((p) => (
          <div key={p.name} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            borderBottom: `1px solid ${C.border}44`,
          }}>
            {/* leaf icon placeholder */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: C.blush,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 14c0 0-5-3-5-7a5 5 0 0110 0c0 4-5 7-5 7z" fill={C.border} />
                <path d="M8 14V8" stroke={C.muted} strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, color: C.ink }}>{p.name}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", color: C.muted, marginTop: 1 }}>{p.status}</p>
            </div>
            <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: p.dot, flexShrink: 0 }} />
          </div>
        ))}
      </div>
      {/* bottom nav */}
      <div style={{
        display: "flex",
        borderTop: `1px solid ${C.border}`,
        padding: "8px 0 4px",
      }}>
        {["Plants", "Schedule", "Settings"].map((label, i) => (
          <div key={label} style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, backgroundColor: i === 0 ? C.plum : C.border }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", color: i === 0 ? C.plum : C.muted }}>{label}</p>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function PlantDetailScreen() {
  return (
    <PhoneFrame bg={C.ivory}>
      {/* header */}
      <div style={{
        backgroundColor: C.blush,
        padding: "14px 14px 18px",
        borderBottom: `1px solid ${C.border}`,
        position: "relative",
      }}>
        <div style={{ width: 16, height: 16, borderRadius: 3, backgroundColor: C.border, marginBottom: 8 }} aria-hidden="true" />
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.0625rem", fontWeight: 600, color: C.ink }}>Monstera</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", color: C.muted, marginTop: 2 }}>Monstera deliciosa</p>
        {/* watering badge */}
        <div style={{
          position: "absolute",
          right: 12,
          bottom: 14,
          backgroundColor: C.rose,
          borderRadius: 12,
          padding: "3px 9px",
        }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", fontWeight: 600, color: "#fff", letterSpacing: "0.06em" }}>WATER TODAY</p>
        </div>
      </div>
      {/* details */}
      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Last watered", value: "3 days ago" },
          { label: "Frequency", value: "Every 3 days" },
          { label: "Light", value: "Indirect, bright" },
          { label: "Location", value: "Living room" },
        ].map((row) => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: `1px solid ${C.border}44` }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", color: C.muted }}>{row.label}</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", fontWeight: 600, color: C.ink }}>{row.value}</p>
          </div>
        ))}
        <div style={{
          marginTop: 4,
          backgroundColor: C.blush,
          borderRadius: 8,
          padding: "8px 10px",
        }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", fontWeight: 600, color: C.rose, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Care History</p>
          {["Mon", "Wed", "Sat"].map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.rose }} />
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", color: C.muted }}>Watered — {d}</p>
            </div>
          ))}
        </div>
      </div>
      {/* CTA */}
      <div style={{ padding: "8px 14px 12px" }}>
        <div style={{ backgroundColor: C.plum, borderRadius: 8, padding: "7px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", fontWeight: 600, color: "#fff", letterSpacing: "0.06em" }}>Mark as watered</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

function PlantScheduleScreen() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const tasks: Record<string, string[]> = {
    Mon: ["Monstera", "Pothos"],
    Thu: ["Peace Lily"],
    Sat: ["Pothos", "Cactus"],
  };
  return (
    <PhoneFrame bg={C.ivory}>
      <div style={{ padding: "14px 14px 10px", borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 600, color: C.ink }}>This Week</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", color: C.muted, marginTop: 2 }}>5 care tasks scheduled</p>
      </div>
      {/* day columns */}
      <div style={{ display: "flex", padding: "10px 10px 4px", gap: 4 }}>
        {days.map((d) => (
          <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.4375rem", color: C.muted, fontWeight: 500 }}>{d}</p>
            <div style={{
              width: "100%",
              minHeight: 24,
              backgroundColor: tasks[d] ? `${C.blush}` : "transparent",
              borderRadius: 4,
              border: tasks[d] ? `1px solid ${C.border}` : "none",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: tasks[d] ? "3px 2px" : 0,
            }}>
              {(tasks[d] || []).map((t) => (
                <div key={t} style={{ backgroundColor: C.rose, borderRadius: 2, padding: "1px 2px" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.3125rem", color: "#fff", fontWeight: 600, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* upcoming list */}
      <div style={{ flex: 1, padding: "8px 12px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Upcoming</p>
        {[
          { plant: "Monstera", day: "Today", urgent: true },
          { plant: "Pothos", day: "Tuesday", urgent: false },
          { plant: "Peace Lily", day: "Thursday", urgent: false },
        ].map((item) => (
          <div key={item.plant} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 0",
            borderBottom: `1px solid ${C.border}44`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: item.urgent ? C.rose : C.border }} />
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", color: C.ink, fontWeight: item.urgent ? 600 : 400 }}>{item.plant}</p>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5rem", color: item.urgent ? C.rose : C.muted }}>{item.day}</p>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ─── 3D Game Screens ──────────────────────────────────────────────────────────

function GameLevelScreen() {
  return (
    <div style={{
      width: 320,
      height: 220,
      backgroundColor: "#2a2030",
      borderRadius: 8,
      border: `1px solid ${C.border}33`,
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* grid floor */}
      <svg width="320" height="220" viewBox="0 0 320 220" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#443040" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="320" height="220" fill="url(#grid)" />
        {/* level walls */}
        <rect x="30" y="30" width="260" height="160" rx="2" fill="none" stroke="#6b4d5e" strokeWidth="1.5" />
        {/* rooms */}
        <rect x="30" y="30" width="110" height="75" fill="#3d2a36" stroke="#6b4d5e" strokeWidth="1" />
        <rect x="140" y="30" width="150" height="75" fill="#332030" stroke="#6b4d5e" strokeWidth="1" />
        <rect x="30" y="115" width="260" height="75" fill="#2e1e2b" stroke="#6b4d5e" strokeWidth="1" />
        {/* doorways */}
        <rect x="130" y="55" width="20" height="8" fill="#2a2030" />
        <rect x="85" y="107" width="8" height="16" fill="#2a2030" />
        <rect x="200" y="107" width="8" height="16" fill="#2a2030" />
        {/* spawn point */}
        <circle cx="65" cy="67" r="6" fill="none" stroke={C.rose} strokeWidth="1.5" />
        <circle cx="65" cy="67" r="2" fill={C.rose} />
        {/* objects */}
        <rect x="170" y="48" width="14" height="14" rx="2" fill="#5a3a4d" stroke={C.border + "66"} strokeWidth="0.5" />
        <rect x="250" y="48" width="10" height="10" rx="2" fill="#5a3a4d" stroke={C.border + "66"} strokeWidth="0.5" />
        <rect x="80" y="130" width="18" height="12" rx="2" fill="#5a3a4d" stroke={C.border + "66"} strokeWidth="0.5" />
        <rect x="200" y="140" width="50" height="8" rx="2" fill="#5a3a4d" stroke={C.border + "66"} strokeWidth="0.5" />
        {/* legend */}
        <circle cx="18" cy="196" r="4" fill="none" stroke={C.rose} strokeWidth="1.5" />
        <circle cx="18" cy="196" r="1.5" fill={C.rose} />
        <text x="26" y="200" fontFamily="monospace" fontSize="7" fill="#9a7a88">Spawn</text>
        <rect x="80" y="192" width="8" height="8" rx="1" fill="#5a3a4d" stroke={C.border + "66"} strokeWidth="0.5" />
        <text x="92" y="200" fontFamily="monospace" fontSize="7" fill="#9a7a88">Object</text>
        <rect x="155" y="192" width="8" height="5" fill="none" stroke="#443040" strokeWidth="0.5" />
        <text x="167" y="200" fontFamily="monospace" fontSize="7" fill="#9a7a88">Wall</text>
      </svg>
      {/* label */}
      <div style={{
        position: "absolute",
        top: 8,
        left: 10,
        backgroundColor: "#1a1020cc",
        padding: "3px 8px",
        borderRadius: 3,
      }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", color: "#c4a0b4", letterSpacing: "0.1em", textTransform: "uppercase" }}>Level Blockout — Top View</p>
      </div>
    </div>
  );
}

function GameMechanicsScreen() {
  const mechanics = [
    { name: "Movement", icon: "↑↓←→", desc: "WASD / controller, responsive character controller with collision" },
    { name: "Selection", icon: "◎", desc: "Raycast-based hover highlight, confirm with interact key" },
    { name: "Manipulation", icon: "⟳", desc: "Grab, rotate, and place objects within range" },
    { name: "Navigation", icon: "⬡", desc: "Spatial cues, minimap, and landmark-based wayfinding" },
  ];
  return (
    <div style={{
      width: 320,
      backgroundColor: "#F8F4EF",
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <div style={{ padding: "12px 16px 10px", backgroundColor: C.blush, borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.875rem", fontWeight: 600, color: C.ink }}>Interaction Verbs</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: C.muted, marginTop: 2 }}>C# mechanics implemented in Unity</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {mechanics.map((m, i) => (
          <div key={m.name} style={{
            display: "flex",
            gap: 12,
            padding: "12px 16px",
            borderBottom: i < mechanics.length - 1 ? `1px solid ${C.border}` : "none",
            alignItems: "flex-start",
          }}>
            <div style={{
              width: 32,
              height: 32,
              flexShrink: 0,
              backgroundColor: C.blush,
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              color: C.plum,
              fontFamily: "monospace",
            }}>
              {m.icon}
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, color: C.ink, marginBottom: 2 }}>{m.name}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: C.muted, lineHeight: 1.5 }}>{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GamePlaytestScreen() {
  const criteria = [
    { criterion: "Learnability", question: "Could a new player discover core interactions without instruction?", result: "Iterated on" },
    { criterion: "Consistency", question: "Did similar objects behave in predictable ways?", result: "Confirmed" },
    { criterion: "Recoverability", question: "Could players undo or recover from mistakes?", result: "Improved" },
    { criterion: "Spatial clarity", question: "Was the player able to navigate without getting lost?", result: "Iterated on" },
  ];
  return (
    <div style={{
      width: 340,
      backgroundColor: C.ivory,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <div style={{ padding: "12px 16px 10px", backgroundColor: C.blush, borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.875rem", fontWeight: 600, color: C.ink }}>Usability Criteria</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: C.muted, marginTop: 2 }}>Evaluation framework used in playtesting</p>
      </div>
      <div>
        {criteria.map((c, i) => (
          <div key={c.criterion} style={{
            padding: "10px 16px",
            borderBottom: i < criteria.length - 1 ? `1px solid ${C.border}` : "none",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 12,
            alignItems: "start",
          }}>
            <div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, color: C.ink, marginBottom: 2 }}>{c.criterion}</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.625rem", color: C.muted, lineHeight: 1.5 }}>{c.question}</p>
            </div>
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.5625rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: c.result === "Confirmed" ? "#6b8f5e" : C.rose,
              backgroundColor: c.result === "Confirmed" ? "#e8f0e4" : `${C.blush}`,
              border: `1px solid ${c.result === "Confirmed" ? "#b8d4af" : C.border}`,
              padding: "2px 7px",
              borderRadius: 10,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}>
              {c.result}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Project Modal ────────────────────────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeScreen, setActiveScreen] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // focus trap
  useEffect(() => {
    const el = modalRef.current;
    if (el) {
      const first = el.querySelector<HTMLElement>("button, [href], input, [tabindex]");
      first?.focus();
    }
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — project detail`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(53,37,45,0.55)",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        ref={modalRef}
        style={{
          position: "relative",
          marginLeft: "auto",
          width: "min(800px, 100vw)",
          height: "100%",
          backgroundColor: C.ivory,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          borderLeft: `1px solid ${C.border}`,
          animation: "slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* header */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: C.ivory,
          borderBottom: `1px solid ${C.border}`,
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.rose,
              marginBottom: 4,
            }}>
              {project.category}
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: C.ink,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}>
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project detail"
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `1px solid ${C.border}`,
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = C.blush)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* body */}
        <div style={{ padding: "40px 40px 64px" }}>
          {/* tools */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {project.tools.map((t) => (
              <span key={t} style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.rose,
                border: `1px solid ${C.border}`,
                padding: "3px 10px",
              }}>
                {t}
              </span>
            ))}
            {"context" in project && project.context && (
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.muted,
                border: `1px solid ${C.border}`,
                padding: "3px 10px",
              }}>
                {project.context}
              </span>
            )}
          </div>

          {/* overview */}
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.0625rem",
            lineHeight: 1.75,
            color: C.ink,
            marginBottom: 40,
            maxWidth: 620,
          }}>
            {project.detail.overview}
          </p>

          {/* process */}
          <div style={{ marginBottom: 48 }}>
            <h3 style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 24,
              paddingBottom: 10,
              borderBottom: `1px solid ${C.border}`,
            }}>
              Process
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {project.detail.process.map((step, i) => (
                <div key={step.phase} style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 24,
                  padding: "16px 0",
                  borderBottom: i < project.detail.process.length - 1 ? `1px solid ${C.border}` : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.625rem",
                      fontWeight: 600,
                      color: C.muted,
                      letterSpacing: "0.08em",
                      marginTop: 1,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: C.rose,
                      letterSpacing: "0.04em",
                    }}>
                      {step.phase}
                    </p>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: C.muted,
                  }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* screens */}
          <div>
            <h3 style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.muted,
              marginBottom: 20,
              paddingBottom: 10,
              borderBottom: `1px solid ${C.border}`,
            }}>
              Screens
            </h3>

            {/* tab bar */}
            <div style={{
              display: "flex",
              gap: 0,
              marginBottom: 32,
              borderBottom: `1px solid ${C.border}`,
            }}
              role="tablist"
              aria-label="Project screens"
            >
              {project.detail.screens.map((s, i) => (
                <button
                  key={s.label}
                  role="tab"
                  aria-selected={activeScreen === i}
                  aria-controls={`screen-panel-${i}`}
                  id={`screen-tab-${i}`}
                  onClick={() => setActiveScreen(i)}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: activeScreen === i ? `2px solid ${C.plum}` : "2px solid transparent",
                    cursor: "pointer",
                    padding: "10px 16px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8125rem",
                    fontWeight: activeScreen === i ? 600 : 400,
                    color: activeScreen === i ? C.ink : C.muted,
                    letterSpacing: "0.01em",
                    transition: "color 0.15s, border-color 0.15s",
                    marginBottom: -1,
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* screen panel */}
            {project.detail.screens.map((s, i) => (
              <div
                key={s.label}
                role="tabpanel"
                id={`screen-panel-${i}`}
                aria-labelledby={`screen-tab-${i}`}
                hidden={activeScreen !== i}
              >
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.65,
                  color: C.muted,
                  marginBottom: 28,
                  maxWidth: 520,
                }}>
                  {s.description}
                </p>
                <div style={{
                  backgroundColor: C.blush,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "48px 32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 280,
                  overflow: "auto",
                }}>
                  {s.render()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
    { label: "CV", href: "#cv" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: scrolled ? "rgba(248,244,239,0.95)" : "#F8F4EF",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "background-color 0.3s, border-color 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1184,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <a
          href="#"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.125rem",
            fontWeight: 500,
            color: C.ink,
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
          aria-label="berrak kilic — home"
        >
          berrak kilic.
        </a>

        <nav aria-label="Main navigation">
          <ul
            style={{ display: "flex", gap: 36, listStyle: "none", margin: 0, padding: 0 }}
            className="hidden-mobile"
          >
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} style={navLinkStyle}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
            flexDirection: "column",
            gap: 5,
          }}
          className="show-mobile"
        >
          <span style={hamburgerLine(menuOpen, 0)} />
          <span style={hamburgerLine(menuOpen, 1)} />
          <span style={hamburgerLine(menuOpen, 2)} />
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          style={{
            borderTop: `1px solid ${C.border}`,
            backgroundColor: C.ivory,
            padding: "16px 24px 24px",
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {links.map((l) => (
              <li key={l.href} style={{ borderBottom: `1px solid ${C.border}` }}>
                <a
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "14px 0",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    color: C.ink,
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: C.muted,
  textDecoration: "none",
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  transition: "color 0.2s",
};

function hamburgerLine(open: boolean, idx: number): React.CSSProperties {
  return {
    display: "block",
    width: 22,
    height: 1.5,
    backgroundColor: C.ink,
    transition: "transform 0.2s, opacity 0.2s",
    transformOrigin: "center",
    transform:
      open && idx === 0
        ? "translateY(6.5px) rotate(45deg)"
        : open && idx === 2
          ? "translateY(-6.5px) rotate(-45deg)"
          : "none",
    opacity: open && idx === 1 ? 0 : 1,
  };
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{ paddingTop: 120, paddingBottom: 96, paddingLeft: 24, paddingRight: 24 }}
      aria-label="Introduction"
    >
      <div
        style={{
          maxWidth: 1184,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="hero-grid"
      >
        <div>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.rose,
            marginBottom: 20,
          }}>
            UI/UX Design &amp; Frontend Development
          </p>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 600,
            lineHeight: 1.12,
            color: C.ink,
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}>
            I bring design and code together to make digital experiences{" "}
            <em style={{ color: C.rose, fontStyle: "italic" }}>intuitive</em>{" "}
            and{" "}
            <em style={{ color: C.rose, fontStyle: "italic" }}>joyful.</em>
          </h1>

          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1.0625rem",
            lineHeight: 1.7,
            color: C.muted,
            marginBottom: 40,
            maxWidth: 480,
          }}>
            I&apos;m Berrak, an Informatik student at TUM. A designer&apos;s eye. A developer&apos;s mind.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="#portfolio"
              style={{
                display: "inline-block",
                backgroundColor: C.plum,
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.04em",
                padding: "13px 28px",
                textDecoration: "none",
                border: `1px solid ${C.plum}`,
                transition: "background-color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = C.plumDark;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = C.plumDark;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor = C.plum;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = C.plum;
              }}
            >
              Explore my work
            </a>
            <a
              href="#cv"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: C.plum,
                textDecoration: "none",
                letterSpacing: "0.04em",
                borderBottom: `1px solid ${C.rose}`,
                paddingBottom: 2,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.rose)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.plum)}
            >
              View my CV
            </a>
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            height: 440,
            backgroundColor: C.blush,
            border: `1px solid ${C.border}`,
            borderRadius: "48% 48% 50% 50% / 10% 10% 10% 10%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 40px",
            gap: 8,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: "18%", top: 0, bottom: 0, width: 1, backgroundColor: C.border, opacity: 0.5 }} />
          <div style={{ position: "absolute", right: "18%", top: 0, bottom: 0, width: 1, backgroundColor: C.border, opacity: 0.5 }} />
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 4 }}>
            Munich · TUM · 2025
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 4vw, 3.25rem)", fontWeight: 600, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1, textAlign: "center" }}>
            berrak
          </p>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.2rem, 4vw, 3.25rem)", fontWeight: 400, fontStyle: "italic", color: C.rose, letterSpacing: "-0.02em", lineHeight: 1, textAlign: "center" }}>
            kilic.
          </p>
          <div style={{ width: 48, height: 1, backgroundColor: C.border, margin: "12px auto" }} />
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: C.muted, textAlign: "center", lineHeight: 1.6, maxWidth: 180, letterSpacing: "0.02em" }}>
            Informatik · B.Sc.<br />UI/UX · Frontend
          </p>
          <div style={{ position: "absolute", bottom: -40, left: "10%", right: "10%", height: 80, borderTop: `1px solid ${C.border}`, borderRadius: "50%", opacity: 0.5 }} />
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      style={{
        border: `1px solid ${C.border}`,
        backgroundColor: C.ivory,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* clickable cover */}
      <button
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`Open ${project.title} detail view`}
        style={{
          all: "unset",
          cursor: "pointer",
          display: "block",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: C.blush,
            borderBottom: `1px solid ${C.border}`,
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 40px",
            gap: 12,
            position: "relative",
            overflow: "hidden",
            transition: "background-color 0.2s",
          }}
        >
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, ${C.border}44 31px, ${C.border}44 32px)`,
            opacity: 0.4,
          }} />

          {/* hover overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundColor: C.plum,
            opacity: hovered ? 0.06 : 0,
            transition: "opacity 0.2s",
          }} />

          <p style={{
            position: "relative",
            fontFamily: "var(--font-sans)",
            fontSize: "0.6875rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.muted,
          }}>
            Project imagery coming soon.
          </p>
          <p style={{
            position: "relative",
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 600,
            color: C.ink,
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1.2,
          }}>
            {project.title}
          </p>
          {"context" in project && project.context && (
            <p style={{
              position: "relative",
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              color: C.muted,
              letterSpacing: "0.06em",
            }}>
              {project.context}
            </p>
          )}

          {/* view detail hint */}
          <div style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(4px)",
            transition: "opacity 0.2s, transform 0.2s",
          }}>
            <span style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.plum,
            }}>View detail</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke={C.plum} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </button>

      {/* content */}
      <div style={{ padding: "32px 36px 36px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {project.tools.map((t) => (
            <span key={t} style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.rose,
              border: `1px solid ${C.border}`,
              padding: "3px 10px",
            }}>
              {t}
            </span>
          ))}
        </div>

        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.muted,
          marginBottom: 8,
        }}>
          {project.category}
        </p>

        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.375rem",
          fontWeight: 600,
          color: C.ink,
          marginBottom: 12,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}>
          {project.title}
        </h3>

        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.9375rem",
          lineHeight: 1.7,
          color: C.muted,
          marginBottom: 20,
          flexGrow: 1,
        }}>
          {project.summary}
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={onOpen}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: C.plum,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.rose)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.plum)}
          >
            <span>View project</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-controls={`contributions-${project.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: C.muted,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.ink)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = C.muted)}
          >
            <span>{expanded ? "Hide" : "Contribution"}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
            >
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div
          id={`contributions-${project.id}`}
          style={{
            overflow: "hidden",
            maxHeight: expanded ? 300 : 0,
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <ul style={{ marginTop: 16, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {project.contributions.map((c, i) => (
              <li key={i} style={{ display: "flex", gap: 12, fontFamily: "var(--font-sans)", fontSize: "0.875rem", lineHeight: 1.6, color: C.muted }}>
                <span style={{ color: C.rose, flexShrink: 0, marginTop: 2 }}>—</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function Portfolio() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <>
      <section
        id="portfolio"
        style={{
          paddingTop: 96,
          paddingBottom: 96,
          paddingLeft: 24,
          paddingRight: 24,
          backgroundColor: C.blush,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
        aria-labelledby="portfolio-heading"
      >
        <div style={{ maxWidth: 1184, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <h2
              id="portfolio-heading"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 600,
                color: C.ink,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Selected{" "}
              <em style={{ color: C.rose, fontStyle: "italic" }}>work.</em>
            </h2>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
            className="project-grid"
          >
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={() => setOpenProject(p)} />
            ))}
          </div>
        </div>
      </section>

      {openProject && (
        <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section
      id="about"
      style={{ paddingTop: 96, paddingBottom: 96, paddingLeft: 24, paddingRight: 24 }}
      aria-labelledby="about-heading"
    >
      <div style={{ maxWidth: 1184, margin: "0 auto", display: "grid", gridTemplateColumns: "5fr 7fr", gap: 80, alignItems: "start" }} className="about-grid">
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.rose, marginBottom: 16 }}>
            About
          </p>
          <h2
            id="about-heading"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 600, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.15 }}
          >
            Design and code,{" "}
            <em style={{ color: C.rose, fontStyle: "italic" }}>together.</em>
          </h2>
        </div>

        <div style={{ paddingTop: 4 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.75, color: C.ink, marginBottom: 24 }}>
            I&apos;m a 7th-semester Informatik student at the Technical University of Munich, focusing on UI/UX design and frontend development. My work connects interface design in Figma, implementation in React, and evaluation through structured usability experiments.
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.75, color: C.muted, marginBottom: 24 }}>
            I&apos;ve worked as a teaching assistant for computer architecture, which taught me to explain complex ideas clearly and think carefully about how people learn. Alongside that, experience in software engineering — embedded C++, debugging, automated testing — has shaped how I approach technical problems and evaluate my own implementations.
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.75, color: C.muted }}>
            I find the space between design and engineering the most interesting place to work: where visual decisions have consequences and technical choices have a human face.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── CV ───────────────────────────────────────────────────────────────────────
function CV() {
  const background = [
    { label: "Education", entries: ["B.Sc. Informatik, in progress — Technical University of Munich, 7th semester."] },
    { label: "Software Engineering", entries: ["Embedded C++ development, debugging, and automated testing with GTest and Docker."] },
    { label: "Teaching", entries: ["Teaching assistant — computer architecture, assembly programming, and online learning resources."] },
    { label: "Visual Communication", entries: ["Digital and print design for student organisation marketing."] },
  ];

  const skillGroups = [
    { label: "Design & Evaluation", items: "Figma, UI/UX design, user research, usability experiments" },
    { label: "Frontend", items: "React, TypeScript, JavaScript, HTML" },
    { label: "Additional Technical", items: "Python, C/C++, Java, SQL, Unity, Git" },
    { label: "Languages", items: "English, German, Turkish" },
  ];

  return (
    <section
      id="cv"
      style={{ paddingTop: 96, paddingBottom: 96, paddingLeft: 24, paddingRight: 24, backgroundColor: C.blush, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
      aria-labelledby="cv-heading"
    >
      <div style={{ maxWidth: 1184, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <h2
            id="cv-heading"
            style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: C.ink, letterSpacing: "-0.02em" }}
          >
            Background,{" "}
            <em style={{ color: C.rose, fontStyle: "italic" }}>briefly.</em>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="cv-grid">
          <div>
            <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: 32, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
              Selected Background
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {background.map((b) => (
                <div key={b.label}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.rose, marginBottom: 6 }}>{b.label}</p>
                  {b.entries.map((e, i) => (
                    <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", lineHeight: 1.65, color: C.ink }}>{e}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: 32, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
              Skills
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {skillGroups.map((g) => (
                <div key={g.label}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.rose, marginBottom: 6 }}>{g.label}</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", lineHeight: 1.65, color: C.ink }}>{g.items}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{ paddingTop: 48, paddingBottom: 48, paddingLeft: 24, paddingRight: 24, borderTop: `1px solid ${C.border}` }}
      aria-label="Site footer"
    >
      <div style={{ maxWidth: 1184, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 500, color: C.ink, letterSpacing: "-0.01em" }}>
          berrak kilic.
        </span>
        <a
          href="https://github.com/berrakkilic"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: "0.875rem", fontWeight: 500, color: C.muted, textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.ink)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = C.muted)}
          aria-label="Berrak Kilic on GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          github.com/berrakkilic
        </a>
      </div>
    </footer>
  );
}

// ─── responsive + animation styles ───────────────────────────────────────────
const responsiveCSS = `
  @keyframes slideInRight {
    from { transform: translateX(40px); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    @keyframes slideInRight {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  }

  @media (max-width: 768px) {
    .hero-grid    { grid-template-columns: 1fr !important; }
    .hero-grid > *:last-child { display: none !important; }
    .project-grid { grid-template-columns: 1fr !important; }
    .about-grid   { grid-template-columns: 1fr !important; gap: 32px !important; }
    .cv-grid      { grid-template-columns: 1fr !important; gap: 48px !important; }
    .hidden-mobile { display: none !important; }
    .show-mobile   { display: flex !important; }
  }
  @media (min-width: 769px) {
    .show-mobile  { display: none !important; }
    .hidden-mobile { display: flex !important; }
  }

  a:focus-visible, button:focus-visible {
    outline: 2px solid #A45F75;
    outline-offset: 3px;
  }

  ::selection {
    background-color: #EEE1DD;
    color: #35252D;
  }
`;

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{responsiveCSS}</style>
      <div style={{ minHeight: "100%", backgroundColor: "#F8F4EF" }}>
        <Nav />
        <main>
          <Hero />
          <Portfolio />
          <About />
          <CV />
        </main>
        <Footer />
      </div>
    </>
  );
}
