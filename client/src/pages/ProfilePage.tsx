import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Zap,
  TrendingUp,
  Star,
  Edit2,
  Lock,
  CheckCircle,
  Loader2,
  Shield,
  Clock,
  ArrowUpRight,
} from "lucide-react";

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

const SKILL_TREE = [
  { id: 1, name: "Animation Basics",    req: "L1", unlocked: true,  progress: 100 },
  { id: 2, name: "Timing & Spacing",    req: "L1", unlocked: true,  progress: 100 },
  { id: 3, name: "Character Movement",  req: "L2", unlocked: true,  progress: 65  },
  { id: 4, name: "3D Modeling",         req: "L2", unlocked: true,  progress: 80  },
  { id: 5, name: "Motion Graphics",     req: "L3", unlocked: true,  progress: 40  },
  { id: 6, name: "Facial Animation",    req: "L3", unlocked: false, progress: 0   },
  { id: 7, name: "Advanced Rigging",    req: "L4", unlocked: false, progress: 0   },
  { id: 8, name: "VFX Mastery",         req: "L4", unlocked: false, progress: 0   },
];

const BADGE_LIST = [
  { id: 1, icon: Zap,           name: "First Steps",      desc: "Complete first assessment"      },
  { id: 2, icon: Star,          name: "Quick Learner",    desc: "Complete 5 learning modules"    },
  { id: 3, icon: CheckCircle,   name: "Perfect Score",    desc: "Score 100% on an assessment"    },
  { id: 4, icon: TrendingUp,    name: "Consistency",      desc: "Complete tasks 7 days straight" },
  { id: 5, icon: Shield,        name: "Team Player",      desc: "Collaborate on 10 projects"     },
  { id: 6, icon: ArrowUpRight,  name: "Master Animator",  desc: "Reach level 10"                 },
];

const CAREER_TRACK = ["Trainee", "Junior", "Core", "Senior", "Lead"];

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Passionate animator and creative professional");

  const { data: profile, isLoading } = trpc.profile.get.useQuery();
  const { data: badges }             = trpc.profile.getBadges.useQuery();
  const { data: analytics }          = trpc.profile.getAnalytics.useQuery();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: C.bg }}>
        <Loader2 style={{ width: "20px", height: "20px", color: C.gold }} className="animate-spin" />
      </div>
    );
  }

  const level          = profile?.level ?? 1;
  const xp             = profile?.xp ?? 0;
  const xpProgress     = (xp % 1000) / 10;
  const careerIndex    = Math.min(Math.floor(level / 2), CAREER_TRACK.length - 1);

  return (
    <div
      className="page-enter"
      style={{
        minHeight:       "100vh",
        backgroundColor: C.bg,
        padding:         "2.5rem",
      }}
    >
      {/* ── Profile header ──────────────────────────────────────── */}
      <div
        style={{
          display:        "flex",
          alignItems:     "flex-start",
          justifyContent: "space-between",
          marginBottom:   "2.5rem",
          paddingBottom:  "1.5rem",
          borderBottom:   `1px solid ${C.border}`,
          gap:            "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {/* Avatar ring */}
          <div
            style={{
              width:           "64px",
              height:          "64px",
              borderRadius:    "50%",
              border:          `2px solid ${C.gold}`,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              backgroundColor: C.raised,
              fontSize:        "1.5rem",
              fontWeight:      "700",
              fontFamily:      "'Space Grotesk', sans-serif",
              color:           C.white,
              flexShrink:      0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div>
            <h1
              style={{
                fontSize:      "1.5rem",
                fontWeight:    "700",
                fontFamily:    "'Space Grotesk', sans-serif",
                letterSpacing: "-0.5px",
                color:         C.white,
                marginBottom:  "4px",
              }}
            >
              {user?.name}
            </h1>
            {isEditing ? (
              <input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="studio-input"
                style={{ maxWidth: "360px", fontSize: "0.875rem" }}
              />
            ) : (
              <p style={{ fontSize: "0.875rem", color: C.muted }}>{bio}</p>
            )}
            <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
              <span className="chip chip-gold">{CAREER_TRACK[careerIndex]}</span>
              <span className="chip chip-white">{user?.role}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-ghost"
          style={{ fontSize: "0.8125rem", padding: "7px 14px", whiteSpace: "nowrap" }}
        >
          <Edit2 style={{ width: "13px", height: "13px" }} />
          Edit Profile
        </button>
      </div>

      {/* ── Stats row ──────────────────────────────────────────── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap:                 "1px",
          backgroundColor:     C.border,
          border:              `1px solid ${C.border}`,
          borderRadius:        "6px",
          overflow:            "hidden",
          marginBottom:        "2rem",
        }}
      >
        {[
          { label: "Level",           value: `L${level}`,                   gold: true  },
          { label: "Total XP",        value: xp.toLocaleString(),            gold: false },
          { label: "Badges Earned",   value: String(badges?.length ?? 0),   gold: false },
          { label: "Tasks Completed", value: String(analytics?.tasks_completed ?? 0), gold: false },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              backgroundColor: C.card,
              padding:         "1.25rem 1.5rem",
              textAlign:       "center",
            }}
          >
            <div
              style={{
                fontSize:      "2rem",
                fontWeight:    "700",
                fontFamily:    "'Space Grotesk', sans-serif",
                color:         s.gold ? C.gold : C.white,
                lineHeight:    "1",
                marginBottom:  "6px",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: C.dim }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── XP Progress ────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: C.card,
          border:          `1px solid ${C.border}`,
          borderRadius:    "6px",
          padding:         "1.25rem 1.5rem",
          marginBottom:    "2rem",
        }}
      >
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            marginBottom:   "10px",
          }}
        >
          <span style={{ fontSize: "0.8125rem", fontWeight: "600", fontFamily: "'Space Grotesk', sans-serif", color: C.white }}>
            Level Progress
          </span>
          <span
            style={{
              fontSize:   "0.72rem",
              fontFamily: "'JetBrains Mono', monospace",
              color:      C.dim,
            }}
          >
            {xp % 1000} / 1000 XP → L{level + 1}
          </span>
        </div>
        <div className="progress-track" style={{ height: "3px" }}>
          <div className="progress-fill" style={{ width: `${xpProgress}%` }} />
        </div>
        {/* Career track */}
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            gap:            "0",
            marginTop:      "1rem",
          }}
        >
          {CAREER_TRACK.map((stage, i) => {
            const passed  = i < careerIndex;
            const current = i === careerIndex;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div
                    style={{
                      width:           "8px",
                      height:          "8px",
                      borderRadius:    "50%",
                      backgroundColor: current ? C.gold : passed ? C.white : C.raised,
                      border:          `1px solid ${current ? C.gold : passed ? "#555" : C.border}`,
                      marginBottom:    "4px",
                    }}
                  />
                  <span
                    style={{
                      fontSize:   "0.68rem",
                      color:      current ? C.gold : passed ? C.muted : C.dim,
                      fontWeight: current ? "600" : "400",
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {stage}
                  </span>
                </div>
                {i < CAREER_TRACK.length - 1 && (
                  <div
                    style={{
                      flex:            1,
                      height:          "1px",
                      backgroundColor: passed ? "#555" : C.border,
                      marginBottom:    "14px",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Skill Tree ─────────────────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize:      "1rem",
            fontWeight:    "600",
            fontFamily:    "'Space Grotesk', sans-serif",
            color:         C.white,
            marginBottom:  "1rem",
            letterSpacing: "-0.2px",
          }}
        >
          Skill Tree
        </h2>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap:                 "1px",
            backgroundColor:     C.border,
            border:              `1px solid ${C.border}`,
            borderRadius:        "6px",
            overflow:            "hidden",
          }}
        >
          {SKILL_TREE.map((skill) => (
            <div
              key={skill.id}
              style={{
                backgroundColor: skill.unlocked ? C.card : C.surface,
                padding:         "1.25rem",
                opacity:         skill.unlocked ? 1 : 0.45,
              }}
            >
              <div
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  marginBottom:   "10px",
                }}
              >
                <span
                  style={{
                    fontSize:   "0.8125rem",
                    fontWeight: "500",
                    color:      skill.unlocked ? C.white : C.dim,
                  }}
                >
                  {skill.name}
                </span>
                {skill.unlocked ? (
                  skill.progress === 100 ? (
                    <CheckCircle style={{ width: "13px", height: "13px", color: C.gold, flexShrink: 0 }} />
                  ) : (
                    <span
                      style={{
                        fontSize:   "0.68rem",
                        fontFamily: "'JetBrains Mono', monospace",
                        color:      C.muted,
                      }}
                    >
                      {skill.progress}%
                    </span>
                  )
                ) : (
                  <Lock style={{ width: "11px", height: "11px", color: C.dim, flexShrink: 0 }} />
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace", color: C.dim }}>
                  {skill.req}
                </span>
              </div>
              {skill.unlocked && (
                <div className="progress-track" style={{ height: "2px" }}>
                  <div
                    className={skill.progress === 100 ? "progress-fill" : "progress-fill-white"}
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Achievements ───────────────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize:      "1rem",
            fontWeight:    "600",
            fontFamily:    "'Space Grotesk', sans-serif",
            color:         C.white,
            marginBottom:  "1rem",
            letterSpacing: "-0.2px",
          }}
        >
          Achievements
        </h2>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap:                 "1px",
            backgroundColor:     C.border,
            border:              `1px solid ${C.border}`,
            borderRadius:        "6px",
            overflow:            "hidden",
          }}
        >
          {BADGE_LIST.map((badge) => {
            const earned = badges?.some((b: any) => b.badge_id === badge.id);
            const Icon   = badge.icon;
            return (
              <div
                key={badge.id}
                style={{
                  backgroundColor: earned ? C.card : C.surface,
                  padding:         "1.25rem",
                  opacity:         earned ? 1 : 0.4,
                  display:         "flex",
                  alignItems:      "center",
                  gap:             "12px",
                }}
              >
                <div
                  style={{
                    width:           "32px",
                    height:          "32px",
                    border:          `1px solid ${earned ? C.gold : C.border}`,
                    borderRadius:    "6px",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    flexShrink:      0,
                    backgroundColor: earned ? "rgba(212,175,55,0.08)" : "transparent",
                  }}
                >
                  <Icon
                    style={{
                      width:  "14px",
                      height: "14px",
                      color:  earned ? C.gold : C.dim,
                    }}
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize:   "0.8125rem",
                      fontWeight: "600",
                      color:      earned ? C.white : C.dim,
                      marginBottom: "2px",
                    }}
                  >
                    {badge.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: C.dim }}>{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Performance & Activity ─────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Performance */}
        <div
          style={{
            backgroundColor: C.card,
            border:          `1px solid ${C.border}`,
            borderRadius:    "6px",
            padding:         "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize:      "0.8125rem",
              fontWeight:    "600",
              fontFamily:    "'Space Grotesk', sans-serif",
              color:         C.white,
              marginBottom:  "1.25rem",
            }}
          >
            Performance Stats
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { icon: Zap,        label: "Average Score",  value: `${analytics?.average_score ?? 0}%` },
              { icon: TrendingUp, label: "Improvement",    value: `+${analytics?.average_score ?? 0}%` },
              { icon: Star,       label: "Studio Rank",    value: "Top 10%" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon style={{ width: "13px", height: "13px", color: C.dim }} />
                    <span style={{ fontSize: "0.8125rem", color: C.muted }}>{stat.label}</span>
                  </div>
                  <span
                    style={{
                      fontSize:   "0.8125rem",
                      fontWeight: "600",
                      color:      C.white,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <div
          style={{
            backgroundColor: C.card,
            border:          `1px solid ${C.border}`,
            borderRadius:    "6px",
            overflow:        "hidden",
          }}
        >
          <div
            style={{
              padding:      "1.25rem 1.5rem",
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <h3
              style={{
                fontSize:   "0.8125rem",
                fontWeight: "600",
                fontFamily: "'Space Grotesk', sans-serif",
                color:      C.white,
              }}
            >
              Recent Activity
            </h3>
          </div>
          {[
            { date: "Today",    note: "Completed Walk Cycle assessment",    type: "assessment" },
            { date: "Yesterday",note: "Earned Quick Learner badge",         type: "badge"      },
            { date: "2d ago",   note: "Reached Level 5",                   type: "level"      },
            { date: "3d ago",   note: "Completed 5 learning modules",      type: "learning"   },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display:      "flex",
                alignItems:   "flex-start",
                gap:          "12px",
                padding:      "0.875rem 1.5rem",
                borderBottom: idx < 3 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div
                style={{
                  width:           "6px",
                  height:          "6px",
                  borderRadius:    "50%",
                  backgroundColor: item.type === "level" ? C.gold : C.border,
                  marginTop:       "5px",
                  flexShrink:      0,
                }}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.8125rem", color: C.white, marginBottom: "2px" }}>
                  {item.note}
                </p>
                <p style={{ fontSize: "0.72rem", color: C.dim, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Clock style={{ width: "10px", height: "10px" }} />
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
