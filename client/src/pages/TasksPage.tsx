import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Clock,
  ChevronRight,
  Upload,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Circle,
  Loader2,
  X,
  FilePlus,
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
  red:     "#C06060",
};

const STATUS_CONFIG: Record<string, { icon: typeof Circle; label: string; color: string }> = {
  pending:      { icon: Circle,        label: "Pending",      color: "#555555" },
  in_progress:  { icon: AlertCircle,   label: "In Progress",  color: "#B8B8B8" },
  submitted:    { icon: Upload,        label: "Submitted",    color: "#D4AF37" },
  under_review: { icon: AlertCircle,   label: "Under Review", color: "#B8B8B8" },
  completed:    { icon: CheckCircle,   label: "Completed",    color: "#6A9A6A" },
  revision:     { icon: MessageSquare, label: "Revision",     color: "#C06060" },
  rejected:     { icon: X,             label: "Rejected",     color: "#C06060" },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  urgent: { label: "URGENT",  color: "#C06060" },
  high:   { label: "HIGH",    color: "#B8B8B8" },
  medium: { label: "MEDIUM",  color: "#888888" },
  normal: { label: "NORMAL",  color: "#555555" },
  low:    { label: "LOW",     color: "#555555" },
};

const MOCK_TASKS = [
  {
    id: 1,
    title:       "Walk Cycle — Biped Character",
    description: "Animate a full looping walk cycle for the main character rig. Must include anticipation, contact, down, passing, and up positions.",
    priority:    "urgent",
    status:      "in_progress",
    deadline:    "2026-05-05",
    type:        "production",
    feedback:    null,
  },
  {
    id: 2,
    title:       "Facial Rig Expression Sheet",
    description: "Create 6 key facial expressions using the provided face rig. Export as individual PNG frames.",
    priority:    "high",
    status:      "revision",
    deadline:    "2026-05-08",
    type:        "production",
    feedback:    "Eyebrow arc needs more exaggeration on the 'surprise' expression. Check the reference sheet.",
  },
  {
    id: 3,
    title:       "12 Principles Study — Squash & Stretch",
    description: "Complete the squash and stretch exercise from the learning module. Submit a 3-second clip.",
    priority:    "normal",
    status:      "submitted",
    deadline:    "2026-05-12",
    type:        "learning",
    feedback:    null,
  },
  {
    id: 4,
    title:       "Run Cycle Refinement",
    description: "Polish the run cycle animation based on previous feedback. Focus on hip rotation and arm swing.",
    priority:    "high",
    status:      "pending",
    deadline:    "2026-05-15",
    type:        "production",
    feedback:    null,
  },
  {
    id: 5,
    title:       "Timing & Spacing Module Quiz",
    description: "Complete the module assessment. Minimum passing score is 75%.",
    priority:    "normal",
    status:      "completed",
    deadline:    "2026-04-28",
    type:        "learning",
    feedback:    "Score: 92%. Excellent work on the spacing section.",
  },
];

const FILTERS = ["All", "Production", "Learning", "Pending", "In Progress", "Revision"] as const;

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedTask, setSelectedTask] = useState<typeof MOCK_TASKS[0] | null>(null);

  const { data: tasks, isLoading } = trpc.tasks.list.useQuery();

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: C.bg }}>
        <Loader2 style={{ width: "20px", height: "20px", color: C.gold }} className="animate-spin" />
      </div>
    );
  }

  const allTasks: any[] = (tasks && tasks.length > 0) ? tasks : MOCK_TASKS;

  const displayTasks = allTasks.filter((t: any) => {
    if (activeFilter === "All")         return true;
    if (activeFilter === "Production")  return t.type === "production";
    if (activeFilter === "Learning")    return t.type === "learning";
    if (activeFilter === "Pending")     return t.status === "pending";
    if (activeFilter === "In Progress") return t.status === "in_progress";
    if (activeFilter === "Revision")    return t.status === "revision";
    return true;
  });

  const counts = {
    total:     allTasks.length,
    active:    allTasks.filter((t: any) => t.status === "in_progress").length,
    revision:  allTasks.filter((t: any) => t.status === "revision").length,
    completed: allTasks.filter((t: any) => t.status === "completed").length,
  };

  return (
    <div
      className="page-enter"
      style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "2.5rem" }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: "0.72rem", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px", color: C.dim, textTransform: "uppercase", marginBottom: "6px" }}>
          Production
        </p>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.8px", color: C.white, marginBottom: "4px" }}>
          Task Workspace
        </h1>
        <p style={{ fontSize: "0.875rem", color: C.muted }}>
          Manage your learning and production assignments
        </p>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: C.border, border: `1px solid ${C.border}`, borderRadius: "6px", overflow: "hidden", marginBottom: "1.5rem" }}>
        {[
          { label: "Total Tasks",  value: counts.total,    gold: false },
          { label: "Active",       value: counts.active,   gold: false },
          { label: "Needs Revision", value: counts.revision, gold: false },
          { label: "Completed",    value: counts.completed, gold: true  },
        ].map((s, i) => (
          <div key={i} style={{ backgroundColor: C.card, padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif", color: s.gold ? C.gold : C.white, lineHeight: "1", marginBottom: "4px" }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.72rem", color: C.dim }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ──────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding:         "5px 12px",
              backgroundColor: activeFilter === f ? C.white : "transparent",
              color:           activeFilter === f ? C.bg : C.muted,
              border:          `1px solid ${activeFilter === f ? C.white : C.border}`,
              borderRadius:    "3px",
              fontSize:        "0.75rem",
              fontWeight:      activeFilter === f ? "600" : "400",
              cursor:          "pointer",
              transition:      "all 150ms",
              fontFamily:      "'JetBrains Mono', monospace",
              letterSpacing:   "0.3px",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Task list ────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: C.card,
          border:          `1px solid ${C.border}`,
          borderRadius:    "6px",
          overflow:        "hidden",
        }}
      >
        {displayTasks.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: C.dim, fontSize: "0.875rem" }}>
            No tasks match this filter
          </div>
        ) : (
          displayTasks.map((task, idx) => {
            const status   = STATUS_CONFIG[task.status]   ?? STATUS_CONFIG.pending;
            const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.normal;
            const StatusIcon = status.icon;
            const overdue    = task.deadline && new Date(task.deadline) < new Date() && task.status !== "completed";

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "space-between",
                  padding:        "1rem 1.25rem",
                  borderBottom:   idx < displayTasks.length - 1 ? `1px solid ${C.border}` : "none",
                  cursor:         "pointer",
                  transition:     "background-color 150ms",
                  gap:            "1rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.surface)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {/* Status icon */}
                <StatusIcon style={{ width: "14px", height: "14px", color: status.color, flexShrink: 0 }} />

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: "500", color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {task.title}
                    </p>
                    <span className={`chip ${task.type === "learning" ? "chip-white" : "chip-gold"}`}>
                      {task.type}
                    </span>
                    {task.feedback && (
                      <MessageSquare style={{ width: "11px", height: "11px", color: C.dim, flexShrink: 0 }} />
                    )}
                  </div>
                  <p style={{ fontSize: "0.78rem", color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {task.description}
                  </p>
                </div>

                {/* Right meta */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.8px", color: priority.color }}>
                    {priority.label}
                  </span>
                  {task.deadline && (
                    <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.72rem", color: overdue ? C.red : C.dim }}>
                      <Clock style={{ width: "9px", height: "9px" }} />
                      {new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>

                <ChevronRight style={{ width: "13px", height: "13px", color: C.dim, flexShrink: 0 }} />
              </div>
            );
          })
        )}
      </div>

      {/* ── Task detail panel (modal) ────────────────────────── */}
      {selectedTask && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "flex-end", zIndex: 60 }}
          onClick={(e) => e.target === e.currentTarget && setSelectedTask(null)}
        >
          <div
            style={{
              width:           "460px",
              height:          "100vh",
              backgroundColor: C.card,
              borderLeft:      `1px solid ${C.border}`,
              display:         "flex",
              flexDirection:   "column",
              overflow:        "hidden",
            }}
          >
            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "1.5rem", borderBottom: `1px solid ${C.border}`, gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                  <span className={`chip ${selectedTask.type === "learning" ? "chip-white" : "chip-gold"}`}>{selectedTask.type}</span>
                  <span className={`chip ${selectedTask.priority === "urgent" ? "chip-urgent" : "chip-white"}`}>
                    {PRIORITY_CONFIG[selectedTask.priority]?.label}
                  </span>
                </div>
                <h2 style={{ fontSize: "1rem", fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif", color: C.white, letterSpacing: "-0.3px", marginBottom: "6px" }}>
                  {selectedTask.title}
                </h2>
                {selectedTask.deadline && (
                  <p style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.75rem", color: C.dim }}>
                    <Clock style={{ width: "11px", height: "11px" }} />
                    Due {new Date(selectedTask.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>
              <button onClick={() => setSelectedTask(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.dim, padding: "2px", flexShrink: 0 }}>
                <X style={{ width: "15px", height: "15px" }} />
              </button>
            </div>

            {/* Panel body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Status */}
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px", color: C.dim, textTransform: "uppercase", marginBottom: "8px" }}>Status</p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const active = selectedTask.status === key;
                    const Ic = cfg.icon;
                    return (
                      <div
                        key={key}
                        style={{
                          display:         "flex",
                          alignItems:      "center",
                          gap:             "5px",
                          padding:         "4px 10px",
                          backgroundColor: active ? C.raised : "transparent",
                          border:          `1px solid ${active ? "#555" : C.border}`,
                          borderRadius:    "3px",
                        }}
                      >
                        <Ic style={{ width: "10px", height: "10px", color: active ? cfg.color : C.dim }} />
                        <span style={{ fontSize: "0.72rem", color: active ? C.white : C.dim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px" }}>
                          {cfg.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px", color: C.dim, textTransform: "uppercase", marginBottom: "8px" }}>Instructions</p>
                <p style={{ fontSize: "0.875rem", color: C.muted, lineHeight: "1.65" }}>
                  {selectedTask.description}
                </p>
              </div>

              {/* Feedback (if any) */}
              {selectedTask.feedback && (
                <div style={{ backgroundColor: selectedTask.status === "revision" ? "rgba(192,96,96,0.08)" : C.surface, border: `1px solid ${selectedTask.status === "revision" ? "rgba(192,96,96,0.2)" : C.border}`, borderRadius: "4px", padding: "1rem" }}>
                  <p style={{ fontSize: "0.72rem", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px", color: selectedTask.status === "revision" ? C.red : C.dim, textTransform: "uppercase", marginBottom: "6px" }}>
                    Reviewer Feedback
                  </p>
                  <p style={{ fontSize: "0.8125rem", color: C.muted, lineHeight: "1.6" }}>
                    {selectedTask.feedback}
                  </p>
                </div>
              )}

              {/* Version timeline placeholder */}
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1px", color: C.dim, textTransform: "uppercase", marginBottom: "8px" }}>
                  Version History
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {["v1 — Initial submission", "v2 — Revised walk cycle"].map((v, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", paddingBottom: i < 1 ? "10px" : 0, borderBottom: i < 1 ? `1px solid ${C.border}` : "none", paddingTop: i > 0 ? "10px" : 0 }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: i === 0 ? C.gold : C.border, border: `1px solid ${i === 0 ? C.gold : C.border}`, marginTop: "4px", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.8rem", color: i === 0 ? C.white : C.dim, fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel footer */}
            <div style={{ padding: "1.25rem 1.5rem", borderTop: `1px solid ${C.border}`, display: "flex", gap: "10px" }}>
              <button className="btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: "0.8125rem" }}>
                <MessageSquare style={{ width: "13px", height: "13px" }} />
                Comment
              </button>
              {selectedTask.status !== "completed" && (
                <button
                  className="btn-gold"
                  style={{ flex: 1, justifyContent: "center", fontSize: "0.8125rem" }}
                >
                  <FilePlus style={{ width: "13px", height: "13px" }} />
                  Submit Work
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
