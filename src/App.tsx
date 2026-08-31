import { useState, useEffect, useCallback, useRef } from "react";
import TreePortrait from "./TreePortrait";
import PlantCareShowcase, { plantCareCover } from "./PlantCareShowcase";
import UnityShowcase, { unityCover } from "./UnityShowcase";

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
  cover?: { src: string; alt: string; width: number; height: number; variant?: "artwork" };
  summary: string;
  contributions: readonly string[];
  detail: {
    overview: string;
    showcase?: () => React.ReactNode;
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
    cover: {
      src: plantCareCover,
      alt: "Leafy plant symbol centered on a light green background.",
      width: 1774,
      height: 887,
      variant: "artwork",
    },
    summary:
      "Connecting a personal garden, daily care tasks, plant identification and an encyclopedia in one plant care application.",
    contributions: [
      "Designed the application's interface and user experience in Figma.",
      "Built and deployed the application using React.",
      "Conducted structured usability experiments and analysed results using Python to inform design iterations.",
    ],
    detail: {
      overview:
        "A project spanning interface design, React development and usability evaluation. The application connects a personal garden with plant profiles, daily care tasks, camera-based identification and an encyclopedia. The aim is to help users move from discovering a plant to understanding and organising its care.",
      process: [
        {
          phase: "Design",
          description:
            "Mapped the main areas in an early storyboard, then developed the screens in Figma. The design connects everyday care with discovery, using task icons, colour and clear feedback to make the next action visible.",
        },
        {
          phase: "Development",
          description:
            "Built and deployed the application in React, translating the Figma designs into an interactive frontend for plant information and care routines.",
        },
        {
          phase: "Evaluation",
          description:
            "Ran structured usability experiments with participants. Collected interaction data and analysed results with Python to identify friction points and inform the next design iteration.",
        },
      ],
      showcase: () => <PlantCareShowcase />,
      screens: [],
    },
  },
  {
    id: "3d-game",
    title: "The Bard’s Flute",
    category: "Interaction Design · Unity Development",
    tools: ["Unity", "C#", "ProBuilder"],
    context: "University group project",
    cover: {
      src: unityCover,
      alt: "Illustrated cover for The Bard’s Flute: a low-poly golden flute and musical notes on a lavender background.",
      width: 1774,
      height: 887,
      variant: "artwork",
    },
    summary:
      "A Unity adventure prototype exploring movement, interaction and wayfinding through a dance-mat control scheme.",
    contributions: [
      "Created a level blockout in ProBuilder and iterated on it using Unity assets.",
      "Implemented movement, selection, manipulation, and navigation mechanics in C#.",
      "Playtested against usability criteria and refined the design.",
    ],
    detail: {
      overview:
        "The Bard’s Flute is a Unity prototype created for a university 3D User Interfaces group project. A dance mat serves as the input device for exploring a village, interacting with characters and objects, and navigating towards encounters. The project brings movement, selection, manipulation and wayfinding into one playable environment.",
      process: [
        {
          phase: "Level design",
          description:
            "Blocked out the level geometry in ProBuilder, iterating on spatial flow and sight lines before bringing in refined Unity assets. Streets, the marketplace and a central pavilion form the setting for exploration and encounters.",
        },
        {
          phase: "Input design",
          description:
            "The team mapped movement, looking, jumping, interaction, hints and wayfinding to a dance mat. This control scheme explores how a limited set of physical inputs can support different actions in a 3D environment.",
        },
        {
          phase: "Playtesting",
          description:
            "Playtesting reviewed gameplay feedback, navigation, input behaviour and the story. The presentation records critiques of health indicators, shooting, breadcrumb movement, beacon range and dance-mat behaviour on Windows, alongside suggestions for the marketplace and NPC conversations.",
        },
      ],
      showcase: () => <UnityShowcase />,
      screens: [],
    },
  },
];

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
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;
      const panel = modalRef.current;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Focus the close button on opening; return to the opener on closing.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const el = modalRef.current;
    if (el) {
      const first = el.querySelector<HTMLElement>("button, [href], input, [tabindex]");
      first?.focus();
    }
    return () => { if (opener?.isConnected) opener.focus(); };
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
        <div className="project-detail-header" style={{
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
        <div className="project-detail-body" style={{ padding: "40px 40px 64px" }}>
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
                <div key={step.phase} className="project-process-step" style={{
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
          {project.detail.showcase ? project.detail.showcase() : <div>
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
          </div>}
        </div>
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHeaderLinks, setShowHeaderLinks] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const treeNavigation = document.getElementById("tree-navigation");
      const leafLinks = treeNavigation?.querySelectorAll("a");
      const leavesBottom = leafLinks?.length
        ? Math.max(...Array.from(leafLinks, (link) => link.getBoundingClientRect().bottom))
        : 0;
      setShowHeaderLinks(leavesBottom <= 64);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
          maxWidth: 1232,
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

        <nav aria-label="Main navigation" className={`header-navigation${showHeaderLinks ? " header-navigation--visible" : ""}`}>
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
      className="portrait-hero"
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
            Hi! I&apos;m Berrak, an Informatik student at TUM. Through my studies and projects, I'm cultivating a designer&apos;s eye & a developer&apos;s mind.
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

        <TreePortrait colour={C.blush} />
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
        className="project-cover-button"
        style={{
          all: "unset",
          cursor: "pointer",
          display: "block",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: project.cover?.variant === "artwork" ? C.blush : project.cover ? "#1d2634" : C.blush,
            borderBottom: `1px solid ${C.border}`,
            height: project.cover?.variant === "artwork" ? "auto" : 280,
            aspectRatio: project.cover?.variant === "artwork" ? "2 / 1" : undefined,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: project.cover ? 0 : "32px 40px",
            gap: 12,
            position: "relative",
            overflow: "hidden",
            transition: "background-color 0.2s",
          }}
        >
          {project.cover ? (
            <img
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              className={project.cover.variant === "artwork" ? "project-cover-image project-cover-image--artwork" : "project-cover-image"}
              loading="lazy"
              decoding="async"
            />
          ) : <>
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
          </>}

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

        <div className="project-actions">
          <button
            type="button"
            className="project-action project-action--contributions"
            onClick={() => setExpanded((previous) => !previous)}
            aria-expanded={expanded}
            aria-controls={`contributions-${project.id}`}
          >
            <span>Contributions</span>
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

          <button
            type="button"
            className="project-action project-action--view"
            onClick={onOpen}
          >
            <span>View project</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div
          id={`contributions-${project.id}`}
          aria-hidden={!expanded}
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
              <em style={{ color: C.rose, fontStyle: "italic" }}>projects</em>
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
            I&apos;ve worked as a teaching assistant for first year students in computer architecture, which taught me to explain complex ideas clearly. Additionally, my experience in software engineering has shaped how I approach technical problems and evaluate my own implementations.
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", lineHeight: 1.75, color: C.muted }}>
            I find the space between design and engineering the most exciting place to work on: where visual decisions have consequences for user experience. Accessible and intuitive interfaces are the result of careful design, thoughtful implementation, and rigorous evaluation.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── CV ───────────────────────────────────────────────────────────────────────
function CV() {
  const background = [
    { label: "Education", entries: ["B.Sc. Informatik (in progress) — Technical University of Munich, 7th semester. \n Thesis: Qualitative Evaluation of Interactive Recommender Systems."] },
    { label: "Software Engineering", entries: ["Embedded C++ development, debugging, and automated testing with GTest and Docker."] },
    { label: "Teaching", entries: ["Teaching assistant for computer architecture and assembly programming. Took initiative to create online learning resources."] },
    { label: "Visual Communication", entries: ["Digital and print design for a student organisation's marketing."] },
  ];

  const skillGroups = [
    { label: "Design & Evaluation", items: "Figma, UI/UX design, agentic development, user research, usability experiments" },
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
