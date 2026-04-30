import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Play, CheckCircle, Lock, Loader2, X, ChevronRight, BookOpen, Flame } from "lucide-react";

const C = {
  bg:      "#0A0A0A",
  card:    "#111111",
  surface: "#161616",
  raised:  "#1A1A1A",
  border:  "#2A2A2A",
  white:   "#F5F5F5",
  muted:   "#B8B8B8",
  dim:     "#555555",
  gold:    "#D4AF37",
};

const MODULES = [
  {
    id: 1,
    title:       "Animation Fundamentals",
    description: "Master the 12 principles of animation",
    stage:       "Blocking",
    duration:    "45 min",
    lessons:     8,
    completed:   true,
    progress:    100,
    unlocked:    true,
  },
  {
    id: 2,
    title:       "Timing & Spacing",
    description: "Control motion through timing precision",
    stage:       "Blocking",
    duration:    "60 min",
    lessons:     6,
    completed:   true,
    progress:    100,
    unlocked:    true,
  },
  {
    id: 3,
    title:       "Character Movement",
    description: "Animate realistic character locomotion",
    stage:       "Refinement",
    duration:    "90 min",
    lessons:     10,
    completed:   false,
    progress:    65,
    unlocked:    true,
  },
  {
    id: 4,
    title:       "Motion Graphics",
    description: "Create dynamic motion graphic sequences",
    stage:       "Refinement",
    duration:    "60 min",
    lessons:     7,
    completed:   false,
    progress:    40,
    unlocked:    true,
  },
  {
    id: 5,
    title:       "Advanced Rigging",
    description: "Build complex character control rigs",
    stage:       "Polish",
    duration:    "120 min",
    lessons:     12,
    completed:   false,
    progress:    0,
    unlocked:    false,
  },
  {
    id: 6,
    title:       "VFX & Particles",
    description: "Master effects and particle systems",
    stage:       "Polish",
    duration:    "75 min",
    lessons:     9,
    completed:   false,
    progress:    0,
    unlocked:    false,
  },
];

const STAGES = ["Blocking", "Refinement", "Polish", "Final"];

function difficultyLabel(id: number) {
  if (id <= 2) return { label: "Beginner",     color: "#888" };
  if (id <= 4) return { label: "Intermediate", color: "#B8B8B8" };
  return         { label: "Advanced",     color: "#D4AF37" };
}

export default function LearningPage() {
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);

  const { isLoading } = trpc.learning.getModules.useQuery({});

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: C.bg }}>
        <Loader2 style={{ width: "20px", height: "20px", color: C.gold }} className="animate-spin" />
      </div>
    );
  }

  const completedCount = MODULES.filter((m) => m.completed).length;
  const totalXP        = completedCount * 100;

  return (
    <div
      className="page-enter"
      style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "2.5rem" }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div
        style={{
          marginBottom:  "2.5rem",
          paddingBottom: "1.5rem",
          borderBottom:  `1px solid ${C.border}`,
        }}
      >
        <p
          style={{
            fontSize:      "0.72rem",
            fontWeight:    "600",
            fontFamily:    "'JetBrains Mono', monospace",
            letterSpacing: "1.5px",
            color:         C.dim,
            textTransform: "uppercase",
            marginBottom:  "6px",
          }}
        >
          Skill Forging
        </p>
        <h1
          style={{
            fontSize:      "1.875rem",
            fontWeight:    "700",
            fontFamily:    "'Space Grotesk', sans-serif",
            letterSpacing: "-0.8px",
            color:         C.white,
            marginBottom:  "6px",
          }}
        >
          Learning Path
        </h1>
        <p style={{ fontSize: "0.875rem", color: C.muted }}>
          Master animation through structured skill stages
        </p>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "1px",
          backgroundColor:     C.border,
          border:              `1px solid ${C.border}`,
          borderRadius:        "6px",
          overflow:            "hidden",
          marginBottom:        "2.5rem",
        }}
      >
        {[
          {
            icon:  BookOpen,
            label: "Stages Completed",
            value: `${completedCount}/${MODULES.length}`,
            sub:   "modules",
            gold:  false,
          },
          {
            icon:  Flame,
            label: "Learning Streak",
            value: "7",
            sub:   "days",
            gold:  false,
          },
          {
            icon:  null,
            label: "XP from Learning",
            value: String(totalXP),
            sub:   "experience points",
            gold:  true,
          },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              style={{
                backgroundColor: C.card,
                padding:         "1.25rem 1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                {Icon && <Icon style={{ width: "13px", height: "13px", color: C.dim }} />}
                <span style={{ fontSize: "0.75rem", color: C.muted }}>{s.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span
                  style={{
                    fontSize:   "1.875rem",
                    fontWeight: "700",
                    fontFamily: "'Space Grotesk', sans-serif",
                    color:      s.gold ? C.gold : C.white,
                    lineHeight: "1",
                  }}
                >
                  {s.value}
                </span>
                <span style={{ fontSize: "0.75rem", color: C.dim }}>{s.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Production Pipeline map ──────────────────────────── */}
      <div
        style={{
          backgroundColor: C.card,
          border:          `1px solid ${C.border}`,
          borderRadius:    "6px",
          padding:         "1.5rem",
          marginBottom:    "2rem",
          overflowX:       "auto",
        }}
      >
        <p
          style={{
            fontSize:      "0.72rem",
            fontWeight:    "600",
            fontFamily:    "'JetBrains Mono', monospace",
            letterSpacing: "1.5px",
            color:         C.dim,
            textTransform: "uppercase",
            marginBottom:  "1.25rem",
          }}
        >
          Pipeline Stages
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0", minWidth: "480px" }}>
          {STAGES.map((stage, i) => {
            const stageModules = MODULES.filter((m) => m.stage === stage);
            const allDone      = stageModules.every((m) => m.completed);
            const anyStarted   = stageModules.some((m) => m.progress > 0);
            const isLocked     = stageModules.every((m) => !m.unlocked);

            const dotColor = allDone
              ? C.gold
              : anyStarted
              ? C.white
              : isLocked
              ? C.raised
              : C.border;

            const dotBorder = allDone
              ? C.gold
              : anyStarted
              ? "#555"
              : C.border;

            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width:           "12px",
                      height:          "12px",
                      borderRadius:    "50%",
                      backgroundColor: dotColor,
                      border:          `1px solid ${dotBorder}`,
                      marginBottom:    "6px",
                    }}
                  />
                  <span
                    style={{
                      fontSize:   "0.75rem",
                      color:      allDone ? C.gold : anyStarted ? C.white : C.dim,
                      fontWeight: anyStarted || allDone ? "600" : "400",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stage}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: C.dim, marginTop: "2px" }}>
                    {stageModules.length} module{stageModules.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    style={{
                      flex:            1,
                      height:          "1px",
                      backgroundColor: allDone ? C.gold : C.border,
                      margin:          "0 8px",
                      marginBottom:    "20px",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Module grid ──────────────────────────────────────── */}
      <h2
        style={{
          fontSize:      "0.8125rem",
          fontWeight:    "600",
          fontFamily:    "'Space Grotesk', sans-serif",
          color:         C.white,
          marginBottom:  "1rem",
          letterSpacing: "-0.1px",
        }}
      >
        All Modules
      </h2>
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap:                 "1px",
          backgroundColor:     C.border,
          border:              `1px solid ${C.border}`,
          borderRadius:        "6px",
          overflow:            "hidden",
        }}
      >
        {MODULES.map((module) => {
          const diff = difficultyLabel(module.id);
          return (
            <div
              key={module.id}
              style={{
                backgroundColor: module.unlocked ? C.card : C.surface,
                padding:         "1.5rem",
                opacity:         module.unlocked ? 1 : 0.5,
                cursor:          module.unlocked ? "pointer" : "default",
                transition:      "background-color 150ms",
              }}
              onClick={() => module.unlocked && setSelectedModule(module)}
            >
              {/* Top row */}
              <div
                style={{
                  display:        "flex",
                  alignItems:     "flex-start",
                  justifyContent: "space-between",
                  marginBottom:   "0.75rem",
                  gap:            "0.75rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <h3
                      style={{
                        fontSize:   "0.9rem",
                        fontWeight: "600",
                        color:      module.unlocked ? C.white : C.dim,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {module.title}
                    </h3>
                    {module.completed && (
                      <CheckCircle style={{ width: "13px", height: "13px", color: C.gold, flexShrink: 0 }} />
                    )}
                    {!module.unlocked && (
                      <Lock style={{ width: "11px", height: "11px", color: C.dim, flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: C.muted, lineHeight: "1.5" }}>
                    {module.description}
                  </p>
                </div>
              </div>

              {/* Meta row */}
              <div
                style={{
                  display:   "flex",
                  gap:       "12px",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ fontSize: "0.72rem", color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>
                  {module.lessons} lessons
                </span>
                <span style={{ fontSize: "0.72rem", color: C.dim }}>·</span>
                <span style={{ fontSize: "0.72rem", color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>
                  {module.duration}
                </span>
                <span style={{ fontSize: "0.72rem", color: C.dim }}>·</span>
                <span style={{ fontSize: "0.72rem", color: diff.color, fontFamily: "'JetBrains Mono', monospace" }}>
                  {diff.label}
                </span>
              </div>

              {/* Progress bar (unlocked only) */}
              {module.unlocked && (
                <div style={{ marginBottom: "1rem" }}>
                  <div className="progress-track" style={{ height: "2px" }}>
                    <div
                      className={module.completed ? "progress-fill" : "progress-fill-white"}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action button */}
              {module.unlocked && (
                <button
                  className={module.completed ? "btn-ghost" : "btn-gold"}
                  style={{ fontSize: "0.8rem", padding: "7px 14px" }}
                >
                  {module.completed ? (
                    <>
                      <CheckCircle style={{ width: "13px", height: "13px" }} />
                      Review
                    </>
                  ) : module.progress > 0 ? (
                    <>
                      <Play style={{ width: "13px", height: "13px" }} />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play style={{ width: "13px", height: "13px" }} />
                      Start
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Recommended ────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: C.card,
          border:          `1px solid rgba(212,175,55,0.2)`,
          borderRadius:    "6px",
          padding:         "1.5rem",
          marginTop:       "1.5rem",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
          gap:             "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize:      "0.72rem",
              fontWeight:    "600",
              fontFamily:    "'JetBrains Mono', monospace",
              letterSpacing: "1px",
              color:         C.gold,
              textTransform: "uppercase",
              marginBottom:  "4px",
            }}
          >
            Recommended Next
          </p>
          <p style={{ fontSize: "0.9rem", fontWeight: "600", color: C.white, marginBottom: "4px" }}>
            Complete "Character Movement"
          </p>
          <p style={{ fontSize: "0.8rem", color: C.muted }}>
            Finish this module to unlock Advanced Rigging and Polish stage.
          </p>
        </div>
        <button
          className="btn-gold"
          style={{ whiteSpace: "nowrap", fontSize: "0.8125rem" }}
          onClick={() => setSelectedModule(MODULES[2])}
        >
          <Play style={{ width: "13px", height: "13px" }} />
          Continue
        </button>
      </div>

      {/* ── Module detail modal ─────────────────────────────── */}
      {selectedModule && (
        <div
          style={{
            position:        "fixed",
            inset:           0,
            backgroundColor: "rgba(0,0,0,0.75)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            padding:         "1.5rem",
            zIndex:          60,
          }}
          onClick={(e) => e.target === e.currentTarget && setSelectedModule(null)}
        >
          <div
            style={{
              backgroundColor: C.card,
              border:          `1px solid ${C.border}`,
              borderRadius:    "8px",
              maxWidth:        "540px",
              width:           "100%",
              overflow:        "hidden",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display:        "flex",
                alignItems:     "flex-start",
                justifyContent: "space-between",
                padding:        "1.5rem",
                borderBottom:   `1px solid ${C.border}`,
                gap:            "1rem",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize:      "1.125rem",
                    fontWeight:    "700",
                    fontFamily:    "'Space Grotesk', sans-serif",
                    color:         C.white,
                    marginBottom:  "4px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {selectedModule.title}
                </h2>
                <p style={{ fontSize: "0.85rem", color: C.muted }}>
                  {selectedModule.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                style={{
                  background: "transparent",
                  border:     "none",
                  cursor:     "pointer",
                  color:      C.dim,
                  padding:    "2px",
                  flexShrink: 0,
                }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            {/* Lesson list */}
            <div style={{ padding: "1rem 1.5rem", maxHeight: "340px", overflowY: "auto" }}>
              {Array.from({ length: selectedModule.lessons }).map((_, idx) => {
                const done    = idx < 3;
                const current = idx === 3;
                const locked  = idx > 4;
                return (
                  <div
                    key={idx}
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      gap:          "12px",
                      padding:      "0.75rem 0",
                      borderBottom: idx < selectedModule.lessons - 1 ? `1px solid ${C.border}` : "none",
                      opacity:      locked ? 0.4 : 1,
                      cursor:       locked ? "default" : "pointer",
                    }}
                  >
                    <div
                      style={{
                        width:           "22px",
                        height:          "22px",
                        borderRadius:    "50%",
                        border:          `1px solid ${done ? C.gold : current ? "#555" : C.border}`,
                        display:         "flex",
                        alignItems:      "center",
                        justifyContent:  "center",
                        flexShrink:      0,
                        backgroundColor: done ? "rgba(212,175,55,0.1)" : "transparent",
                      }}
                    >
                      {done ? (
                        <CheckCircle style={{ width: "11px", height: "11px", color: C.gold }} />
                      ) : locked ? (
                        <Lock style={{ width: "9px", height: "9px", color: C.dim }} />
                      ) : (
                        <Play style={{ width: "9px", height: "9px", color: C.muted }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize:   "0.8125rem",
                          color:      done ? C.muted : current ? C.white : C.dim,
                          fontWeight: current ? "500" : "400",
                          marginBottom: "1px",
                        }}
                      >
                        Lesson {idx + 1}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: C.dim }}>15–20 minutes</p>
                    </div>
                    {current && (
                      <ChevronRight style={{ width: "13px", height: "13px", color: C.muted }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div
              style={{
                display:      "flex",
                gap:          "10px",
                padding:      "1.25rem 1.5rem",
                borderTop:    `1px solid ${C.border}`,
              }}
            >
              <button
                onClick={() => setSelectedModule(null)}
                className="btn-ghost"
                style={{ flex: 1, justifyContent: "center" }}
              >
                Close
              </button>
              <button className="btn-gold" style={{ flex: 1, justifyContent: "center" }}>
                <Play style={{ width: "13px", height: "13px" }} />
                {selectedModule.progress > 0 ? "Continue" : "Start Module"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
