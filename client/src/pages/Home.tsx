import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { ArrowRight, Film, Users, Zap, TrendingUp, Award, ChevronRight } from "lucide-react";

const C = {
  bg:      "#0A0A0A",
  card:    "#111111",
  surface: "#161616",
  border:  "#2A2A2A",
  white:   "#F5F5F5",
  muted:   "#B8B8B8",
  dim:     "#666666",
  gold:    "#D4AF37",
};

const FEATURES = [
  {
    icon: Users,
    title: "Talent Recruitment",
    description:
      "Structured application pipeline with portfolio review, multi-step forms, and status tracking.",
  },
  {
    icon: Zap,
    title: "Skill Assessment",
    description:
      "Timed animation challenges scored across six quality dimensions by an AI evaluation engine.",
  },
  {
    icon: TrendingUp,
    title: "Personalized Training",
    description:
      "Adaptive learning modules calibrated to each artist's skill gaps and career trajectory.",
  },
  {
    icon: Award,
    title: "Mastery System",
    description:
      "Level progression, achievement badges, and production pipeline milestones that reward discipline.",
  },
];

const STEPS = [
  { step: "01", title: "Apply",  desc: "Submit your portfolio, resume, and motivation statement through the structured portal." },
  { step: "02", title: "Assess", desc: "Complete timed animation challenges. AI scoring evaluates fluidity, timing, and craft." },
  { step: "03", title: "Train",  desc: "Receive a personalized learning path targeting your specific skill gaps." },
  { step: "04", title: "Grow",   desc: "Ship production tasks, earn level upgrades, and build a studio career track." },
];

const STATS = [
  { value: "500+",  label: "Applicants Processed" },
  { value: "150+",  label: "Artists Trained" },
  { value: "1,200+", label: "Projects Completed" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="page-enter canvas-mood"
      style={{
        minHeight:       "100vh",
        backgroundColor: C.bg,
        color:           C.white,
        fontFamily:      "'Inter', sans-serif",
      }}
    >
      {/* ── Nav ────────────────────────────────────────────────── */}
      <nav
        style={{
          position:        "fixed",
          top:             0,
          left:            0,
          right:           0,
          zIndex:          50,
          borderBottom:    `1px solid rgba(42,42,42,0.6)`,
          backgroundColor: "rgba(10,10,10,0.85)",
          backdropFilter:  "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth:       "1200px",
            margin:         "0 auto",
            padding:        "0 1.5rem",
            height:         "56px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Film style={{ width: "18px", height: "18px", color: C.gold }} />
            <span
              style={{
                fontSize:   "0.875rem",
                fontWeight: "700",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "0.5px",
                color:      C.white,
              }}
            >
              ANIMATION STUDIO OS
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isAuthenticated ? (
              <a
                href="/dashboard"
                style={{
                  padding:         "7px 16px",
                  backgroundColor: C.gold,
                  color:           C.bg,
                  border:          "none",
                  borderRadius:    "4px",
                  fontSize:        "0.8125rem",
                  fontWeight:      "600",
                  cursor:          "pointer",
                  textDecoration:  "none",
                  display:         "inline-flex",
                  alignItems:      "center",
                  gap:             "6px",
                  transition:      "opacity 200ms",
                }}
              >
                Open Studio
                <ArrowRight style={{ width: "13px", height: "13px" }} />
              </a>
            ) : (
              <a
                href={getLoginUrl()}
                style={{
                  padding:        "7px 16px",
                  backgroundColor: C.gold,
                  color:          C.bg,
                  border:         "none",
                  borderRadius:   "4px",
                  fontSize:       "0.8125rem",
                  fontWeight:     "600",
                  cursor:         "pointer",
                  textDecoration: "none",
                  display:        "inline-flex",
                  alignItems:     "center",
                  gap:            "6px",
                }}
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop:    "130px",
          paddingBottom: "100px",
          paddingLeft:   "1.5rem",
          paddingRight:  "1.5rem",
          maxWidth:      "1200px",
          margin:        "0 auto",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           "8px",
            padding:       "4px 12px",
            border:        `1px solid rgba(212,175,55,0.25)`,
            borderRadius:  "3px",
            marginBottom:  "2rem",
          }}
        >
          <span
            style={{
              width:           "5px",
              height:          "5px",
              borderRadius:    "50%",
              backgroundColor: C.gold,
              display:         "inline-block",
            }}
          />
          <span
            style={{
              fontSize:   "0.72rem",
              fontWeight: "600",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "1px",
              color:      C.gold,
              textTransform: "uppercase",
            }}
          >
            Professional Animation Studio
          </span>
        </div>

        <h1
          style={{
            fontSize:      "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight:    "700",
            fontFamily:    "'Space Grotesk', sans-serif",
            letterSpacing: "-1.5px",
            lineHeight:    "1.05",
            maxWidth:      "700px",
            marginBottom:  "1.75rem",
            color:         C.white,
          }}
        >
          The Complete Animation Studio Operating System
        </h1>

        <p
          style={{
            fontSize:     "1.0625rem",
            color:        C.muted,
            lineHeight:   "1.7",
            maxWidth:     "520px",
            marginBottom: "2.5rem",
          }}
        >
          Recruit, evaluate, train, and manage animators — all inside one
          unified creative workspace built for discipline and mastery.
        </p>

        {/* CTA row */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a
            href={getLoginUrl()}
            style={{
              padding:         "10px 22px",
              backgroundColor: C.gold,
              color:           C.bg,
              borderRadius:    "4px",
              textDecoration:  "none",
              fontWeight:      "600",
              fontSize:        "0.875rem",
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "7px",
              transition:      "opacity 200ms",
            }}
          >
            Apply Now
            <ArrowRight style={{ width: "15px", height: "15px" }} />
          </a>
          <a
            href="#features"
            style={{
              padding:        "10px 22px",
              backgroundColor: "transparent",
              color:          C.white,
              border:         `1px solid ${C.border}`,
              borderRadius:   "4px",
              textDecoration: "none",
              fontWeight:     "500",
              fontSize:       "0.875rem",
              display:        "inline-flex",
              alignItems:     "center",
              gap:            "7px",
              transition:     "border-color 200ms",
            }}
          >
            Learn More
          </a>
        </div>

        {/* Stats row */}
        <div
          style={{
            display:       "flex",
            gap:           "0",
            marginTop:     "5rem",
            borderTop:     `1px solid ${C.border}`,
            paddingTop:    "2.5rem",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                flex:        1,
                paddingRight: "2.5rem",
                borderRight:  i < STATS.length - 1 ? `1px solid ${C.border}` : "none",
                paddingLeft:  i > 0 ? "2.5rem" : "0",
              }}
            >
              <div
                style={{
                  fontSize:   "2rem",
                  fontWeight: "700",
                  fontFamily: "'Space Grotesk', sans-serif",
                  color:      C.gold,
                  lineHeight: "1",
                  marginBottom: "6px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: C.dim }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section
        id="features"
        style={{
          borderTop:     `1px solid ${C.border}`,
          paddingTop:    "80px",
          paddingBottom: "80px",
          paddingLeft:   "1.5rem",
          paddingRight:  "1.5rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              fontSize:      "0.72rem",
              fontWeight:    "600",
              fontFamily:    "'JetBrains Mono', monospace",
              letterSpacing: "1.5px",
              color:         C.dim,
              textTransform: "uppercase",
              marginBottom:  "1rem",
            }}
          >
            Platform Features
          </p>
          <h2
            style={{
              fontSize:      "2rem",
              fontWeight:    "700",
              fontFamily:    "'Space Grotesk', sans-serif",
              letterSpacing: "-0.8px",
              marginBottom:  "3.5rem",
              color:         C.white,
            }}
          >
            Built for serious animation studios
          </h2>

          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap:                 "1px",
              border:              `1px solid ${C.border}`,
              borderRadius:        "6px",
              overflow:            "hidden",
              backgroundColor:     C.border,
            }}
          >
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: C.card,
                    padding:         "2rem",
                    transition:      "background-color 200ms",
                  }}
                >
                  <div
                    style={{
                      width:           "36px",
                      height:          "36px",
                      display:         "flex",
                      alignItems:      "center",
                      justifyContent:  "center",
                      border:          `1px solid rgba(212,175,55,0.2)`,
                      borderRadius:    "6px",
                      marginBottom:    "1.25rem",
                    }}
                  >
                    <Icon style={{ width: "16px", height: "16px", color: C.gold }} />
                  </div>
                  <h3
                    style={{
                      fontSize:      "1rem",
                      fontWeight:    "600",
                      fontFamily:    "'Space Grotesk', sans-serif",
                      marginBottom:  "0.6rem",
                      color:         C.white,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      color:      C.muted,
                      fontSize:   "0.85rem",
                      lineHeight: "1.65",
                    }}
                  >
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section
        style={{
          borderTop:     `1px solid ${C.border}`,
          backgroundColor: "#0D0D0D",
          paddingTop:    "80px",
          paddingBottom: "80px",
          paddingLeft:   "1.5rem",
          paddingRight:  "1.5rem",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              fontSize:      "0.72rem",
              fontWeight:    "600",
              fontFamily:    "'JetBrains Mono', monospace",
              letterSpacing: "1.5px",
              color:         C.dim,
              textTransform: "uppercase",
              marginBottom:  "1rem",
            }}
          >
            Production Pipeline
          </p>
          <h2
            style={{
              fontSize:      "2rem",
              fontWeight:    "700",
              fontFamily:    "'Space Grotesk', sans-serif",
              letterSpacing: "-0.8px",
              marginBottom:  "3.5rem",
              color:         C.white,
            }}
          >
            From applicant to senior artist
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {STEPS.map((item, i) => (
              <div
                key={i}
                style={{
                  display:      "flex",
                  gap:          "1.5rem",
                  paddingBottom: "2rem",
                  paddingTop:    i > 0 ? "2rem" : "0",
                  borderBottom:  i < STEPS.length - 1 ? `1px solid ${C.border}` : "none",
                  alignItems:   "flex-start",
                }}
              >
                <div
                  style={{
                    width:        "44px",
                    height:       "44px",
                    flexShrink:   0,
                    border:       `1px solid rgba(212,175,55,0.3)`,
                    borderRadius: "4px",
                    display:      "flex",
                    alignItems:   "center",
                    justifyContent: "center",
                    fontFamily:   "'JetBrains Mono', monospace",
                    fontSize:     "0.75rem",
                    fontWeight:   "600",
                    color:        C.gold,
                    letterSpacing: "1px",
                  }}
                >
                  {item.step}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize:      "1rem",
                      fontWeight:    "600",
                      fontFamily:    "'Space Grotesk', sans-serif",
                      marginBottom:  "0.4rem",
                      color:         C.white,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ color: C.muted, fontSize: "0.875rem", lineHeight: "1.65" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop:     `1px solid ${C.border}`,
          paddingTop:    "80px",
          paddingBottom: "80px",
          paddingLeft:   "1.5rem",
          paddingRight:  "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth:   "600px",
            margin:     "0 auto",
            textAlign:  "center",
          }}
        >
          <h2
            style={{
              fontSize:      "2.25rem",
              fontWeight:    "700",
              fontFamily:    "'Space Grotesk', sans-serif",
              letterSpacing: "-1px",
              marginBottom:  "1rem",
              color:         C.white,
            }}
          >
            Ready to join the studio?
          </h2>
          <p
            style={{
              color:        C.muted,
              fontSize:     "1rem",
              marginBottom: "2rem",
              lineHeight:   "1.65",
            }}
          >
            Start your application or manage your studio's talent pipeline.
          </p>
          <a
            href={getLoginUrl()}
            style={{
              padding:         "12px 28px",
              backgroundColor: C.gold,
              color:           C.bg,
              border:          "none",
              borderRadius:    "4px",
              textDecoration:  "none",
              fontWeight:      "600",
              fontSize:        "0.9rem",
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "8px",
            }}
          >
            Get Started
            <ChevronRight style={{ width: "16px", height: "16px" }} />
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop:   `1px solid ${C.border}`,
          padding:     "1.5rem",
          textAlign:   "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin:   "0 auto",
            display:  "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Film style={{ width: "14px", height: "14px", color: C.dim }} />
            <span
              style={{
                fontSize:   "0.75rem",
                color:      C.dim,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.5px",
              }}
            >
              ANIMATION STUDIO OS
            </span>
          </div>
          <p style={{ fontSize: "0.75rem", color: C.dim }}>
            © 2026 — Professional Creative Workspace
          </p>
        </div>
      </footer>
    </div>
  );
}
