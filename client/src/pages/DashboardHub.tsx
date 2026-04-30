import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  CheckSquare,
  BookOpen,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  Award,
  Zap,
  DollarSign,
  Bell,
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

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  gold = false,
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  sub?: string;
  gold?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: C.card,
        border:          `1px solid ${C.border}`,
        borderRadius:    "6px",
        padding:         "1.25rem 1.5rem",
        display:         "flex",
        flexDirection:   "column",
        gap:             "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.75rem", color: C.muted, fontWeight: "500" }}>{label}</span>
        <Icon style={{ width: "14px", height: "14px", color: gold ? C.gold : C.dim }} />
      </div>
      <div
        style={{
          fontSize:   "1.875rem",
          fontWeight: "700",
          fontFamily: "'Space Grotesk', sans-serif",
          color:      gold ? C.gold : C.white,
          lineHeight: "1",
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: "0.72rem", color: C.dim }}>{sub}</div>
      )}
    </div>
  );
}

function TaskRow({ task }: { task: any }) {
  const priorityMap: Record<string, { label: string; color: string }> = {
    urgent: { label: "URGENT", color: "#C06060" },
    high:   { label: "HIGH",   color: "#B8B8B8" },
    normal: { label: "NORMAL", color: "#555555" },
  };
  const p = priorityMap[task.priority] ?? priorityMap.normal;

  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "flex-start",
        justifyContent: "space-between",
        padding:        "1rem 1.25rem",
        borderBottom:   `1px solid ${C.border}`,
        transition:     "background-color 150ms",
        gap:            "1rem",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize:     "0.875rem",
            fontWeight:   "500",
            color:        C.white,
            marginBottom: "3px",
            whiteSpace:   "nowrap",
            overflow:     "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            style={{
              fontSize:     "0.78rem",
              color:        C.muted,
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {task.description}
          </p>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
        <span
          style={{
            fontSize:      "0.65rem",
            fontWeight:    "700",
            fontFamily:    "'JetBrains Mono', monospace",
            letterSpacing: "0.8px",
            color:         p.color,
          }}
        >
          {p.label}
        </span>
        {task.deadline && (
          <span
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "4px",
              fontSize:   "0.72rem",
              color:      C.dim,
            }}
          >
            <Clock style={{ width: "10px", height: "10px" }} />
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default function DashboardHub() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const { data: tasks } = trpc.tasks.list.useQuery();
  const { data: notifications } = trpc.notifications.list.useQuery({ unreadOnly: true });

  const xpProgress = ((profile?.xp ?? 0) % 1000) / 10;

  return (
    <div
      className="page-enter"
      style={{
        minHeight:       "100vh",
        backgroundColor: C.bg,
        padding:         "2.5rem",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        style={{
          display:       "flex",
          alignItems:    "flex-end",
          justifyContent: "space-between",
          marginBottom:  "2.5rem",
          borderBottom:  `1px solid ${C.border}`,
          paddingBottom: "1.5rem",
        }}
      >
        <div>
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
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1
            style={{
              fontSize:      "1.875rem",
              fontWeight:    "700",
              fontFamily:    "'Space Grotesk', sans-serif",
              letterSpacing: "-0.8px",
              color:         C.white,
            }}
          >
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p style={{ fontSize: "0.875rem", color: C.muted, marginTop: "4px" }}>
            {user?.role === "admin"
              ? "Studio overview and management"
              : "Continue your animation journey"}
          </p>
        </div>

        {/* Notification badge */}
        {notifications && notifications.length > 0 && (
          <div
            style={{
              display:         "flex",
              alignItems:      "center",
              gap:             "8px",
              padding:         "8px 14px",
              backgroundColor: C.card,
              border:          `1px solid ${C.border}`,
              borderRadius:    "6px",
            }}
          >
            <Bell style={{ width: "14px", height: "14px", color: C.gold }} />
            <span style={{ fontSize: "0.8125rem", color: C.white, fontWeight: "500" }}>
              {notifications.length} alert{notifications.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Stats row ──────────────────────────────────────────── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap:                 "1rem",
          marginBottom:        "2.5rem",
        }}
      >
        <StatCard
          icon={Award}
          label="Current Level"
          value={`L${profile?.level ?? 1}`}
          sub={`${profile?.xp ?? 0} XP total`}
          gold
        />
        <StatCard
          icon={CheckSquare}
          label="Active Tasks"
          value={String(tasks?.length ?? 0)}
          sub="Assigned to you"
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Salary"
          value={`$${profile?.salary ?? 0}`}
          sub="Current rate"
        />
        <StatCard
          icon={Bell}
          label="Notifications"
          value={String(notifications?.length ?? 0)}
          sub="Unread"
        />
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "1fr 320px",
          gap:                 "1.5rem",
          alignItems:          "start",
        }}
      >
        {/* Left — Tasks & Learning */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Tasks */}
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
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "1rem 1.25rem",
                borderBottom:   `1px solid ${C.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckSquare style={{ width: "15px", height: "15px", color: C.dim }} />
                <span
                  style={{
                    fontSize:   "0.8125rem",
                    fontWeight: "600",
                    fontFamily: "'Space Grotesk', sans-serif",
                    color:      C.white,
                  }}
                >
                  Your Tasks
                </span>
              </div>
              <Link href="/tasks">
                <span
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "4px",
                    fontSize:   "0.75rem",
                    color:      C.muted,
                    cursor:     "pointer",
                    transition: "color 150ms",
                  }}
                >
                  View all
                  <ChevronRight style={{ width: "12px", height: "12px" }} />
                </span>
              </Link>
            </div>

            {tasks && tasks.length > 0 ? (
              <>
                {tasks.slice(0, 4).map((task: any) => (
                  <TaskRow key={task.id} task={task} />
                ))}
                {tasks.length > 4 && (
                  <div
                    style={{
                      padding:    "0.75rem 1.25rem",
                      fontSize:   "0.75rem",
                      color:      C.dim,
                      textAlign:  "center",
                    }}
                  >
                    +{tasks.length - 4} more tasks
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  padding:   "3rem 1.5rem",
                  textAlign: "center",
                  color:     C.dim,
                  fontSize:  "0.875rem",
                }}
              >
                No tasks assigned yet
              </div>
            )}
          </div>

          {/* Learning Path */}
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
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "1rem 1.25rem",
                borderBottom:   `1px solid ${C.border}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen style={{ width: "15px", height: "15px", color: C.dim }} />
                <span
                  style={{
                    fontSize:   "0.8125rem",
                    fontWeight: "600",
                    fontFamily: "'Space Grotesk', sans-serif",
                    color:      C.white,
                  }}
                >
                  Learning Path
                </span>
              </div>
              <Link href="/learning">
                <span
                  style={{
                    display:    "flex",
                    alignItems: "center",
                    gap:        "4px",
                    fontSize:   "0.75rem",
                    color:      C.muted,
                    cursor:     "pointer",
                  }}
                >
                  View all
                  <ChevronRight style={{ width: "12px", height: "12px" }} />
                </span>
              </Link>
            </div>
            <div style={{ padding: "1.5rem 1.25rem" }}>
              <div
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  gap:          "1rem",
                  marginBottom: "1.25rem",
                }}
              >
                {[
                  { label: "Blocking",    done: true  },
                  { label: "Refinement",  done: true  },
                  { label: "Polish",      done: false },
                  { label: "Final",       done: false },
                ].map((stage, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width:           "8px",
                        height:          "8px",
                        borderRadius:    "50%",
                        backgroundColor: stage.done ? C.gold : C.raised,
                        border:          `1px solid ${stage.done ? C.gold : C.border}`,
                        flexShrink:      0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.78rem",
                        color:    stage.done ? C.white : C.dim,
                      }}
                    >
                      {stage.label}
                    </span>
                    {i < 3 && (
                      <div
                        style={{
                          width:           "20px",
                          height:          "1px",
                          backgroundColor: stage.done ? C.gold : C.border,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.78rem", color: C.muted, marginBottom: "1rem" }}>
                Currently in <strong style={{ color: C.white }}>Polish</strong> stage — complete "Character Movement" to advance.
              </p>
              <Link href="/learning">
                <button className="btn-gold" style={{ fontSize: "0.8125rem", padding: "8px 16px" }}>
                  Continue Training
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right — Level + Actions + Notifications */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Level badge */}
          <div
            style={{
              backgroundColor: C.card,
              border:          `1px solid ${C.border}`,
              borderRadius:    "6px",
              padding:         "1.5rem",
              textAlign:       "center",
            }}
          >
            <p style={{ fontSize: "0.72rem", color: C.dim, marginBottom: "12px", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px", textTransform: "uppercase" }}>
              Artist Level
            </p>
            <div
              style={{
                fontSize:      "3.5rem",
                fontWeight:    "700",
                fontFamily:    "'Space Grotesk', sans-serif",
                color:         C.gold,
                lineHeight:    "1",
                marginBottom:  "1rem",
                letterSpacing: "-2px",
              }}
            >
              L{profile?.level ?? 1}
            </div>

            {/* XP progress */}
            <div style={{ marginBottom: "8px" }}>
              <div className="progress-track" style={{ height: "3px" }}>
                <div
                  className="progress-fill"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
            <p style={{ fontSize: "0.72rem", color: C.dim }}>
              {profile?.xp ?? 0} / {((profile?.level ?? 1) * 1000)} XP
            </p>
          </div>

          {/* Quick actions */}
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
                padding:      "0.875rem 1.25rem",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <span
                style={{
                  fontSize:   "0.8125rem",
                  fontWeight: "600",
                  fontFamily: "'Space Grotesk', sans-serif",
                  color:      C.white,
                }}
              >
                Quick Actions
              </span>
            </div>
            {[
              { icon: Zap,         label: "Take Assessment",  href: "/assessment" },
              { icon: TrendingUp,  label: "View Earnings",    href: "/payments"   },
              { icon: Award,       label: "My Badges",        href: "/profile"    },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <div
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      padding:        "0.875rem 1.25rem",
                      borderBottom:   `1px solid ${C.border}`,
                      cursor:         "pointer",
                      transition:     "background-color 150ms",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Icon style={{ width: "14px", height: "14px", color: C.dim }} />
                      <span style={{ fontSize: "0.8125rem", color: C.muted }}>{action.label}</span>
                    </div>
                    <ChevronRight style={{ width: "12px", height: "12px", color: C.dim }} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Notifications */}
          {notifications && notifications.length > 0 && (
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
                  display:        "flex",
                  alignItems:     "center",
                  gap:            "8px",
                  padding:        "0.875rem 1.25rem",
                  borderBottom:   `1px solid ${C.border}`,
                }}
              >
                <AlertCircle style={{ width: "13px", height: "13px", color: C.gold }} />
                <span
                  style={{
                    fontSize:   "0.8125rem",
                    fontWeight: "600",
                    fontFamily: "'Space Grotesk', sans-serif",
                    color:      C.white,
                  }}
                >
                  Alerts
                </span>
              </div>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {notifications.slice(0, 5).map((n: any) => (
                  <div
                    key={n.id}
                    style={{
                      padding:      "0.75rem 1.25rem",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <p style={{ fontSize: "0.8125rem", fontWeight: "500", color: C.white, marginBottom: "2px" }}>
                      {n.title}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: C.muted }}>{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
