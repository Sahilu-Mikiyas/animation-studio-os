import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  LayoutDashboard,
  FilePlus,
  CheckSquare,
  BookOpen,
  User,
  DollarSign,
  Shield,
  LogOut,
  Film,
  ScanLine,
  FolderSearch,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";

const C = {
  bg:      "#0A0A0A",
  sidebar: "#111111",
  border:  "#2A2A2A",
  white:   "#F5F5F5",
  muted:   "#B8B8B8",
  gold:    "#D4AF37",
  surface: "#1A1A1A",
} as const;

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",  path: "/dashboard" },
  { icon: FilePlus,         label: "Apply",      path: "/apply" },
  { icon: ScanLine,         label: "Assessment", path: "/assessment" },
  { icon: CheckSquare,      label: "Tasks",      path: "/tasks" },
  { icon: BookOpen,         label: "Learning",   path: "/learning" },
  { icon: FolderSearch,     label: "Portfolio",  path: "/portfolio" },
  { icon: User,             label: "Profile",    path: "/profile" },
  { icon: DollarSign,       label: "Payments",   path: "/payments" },
];

const ADMIN_ITEM = { icon: Shield, label: "Admin", path: "/admin" };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading, user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [userHovered, setUserHovered] = useState(false);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  const navItems = user.role === "admin" ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.bg }}>
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        style={{
          position:        "fixed",
          left:            0,
          top:             0,
          width:           "60px",
          height:          "100vh",
          backgroundColor: C.sidebar,
          borderRight:     `1px solid ${C.border}`,
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          paddingTop:      "20px",
          paddingBottom:   "20px",
          zIndex:          40,
          gap:             0,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => setLocation("/dashboard")}
          title="Animation Studio OS"
          style={{
            width:           "36px",
            height:          "36px",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            marginBottom:    "28px",
            background:      "transparent",
            border:          "none",
            cursor:          "pointer",
            borderRadius:    "6px",
            padding:         0,
          }}
        >
          <Film style={{ width: "20px", height: "20px", color: C.gold }} />
        </button>

        {/* Nav items */}
        <nav
          style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            gap:            "4px",
            flex:           1,
          }}
        >
          {navItems.map((item) => {
            const isActive =
              location === item.path ||
              (item.path !== "/" && location.startsWith(item.path));
            const isHovered = hoveredPath === item.path;
            const Icon = item.icon;

            return (
              <div
                key={item.path}
                title={item.label}
                style={{ position: "relative", display: "flex" }}
              >
                {/* Active gold bar */}
                {isActive && (
                  <span
                    style={{
                      position:        "absolute",
                      left:            "-12px",
                      top:             "50%",
                      transform:       "translateY(-50%)",
                      width:           "3px",
                      height:          "16px",
                      backgroundColor: C.gold,
                      borderRadius:    "0 2px 2px 0",
                    }}
                  />
                )}
                <button
                  onClick={() => setLocation(item.path)}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  style={{
                    width:           "38px",
                    height:          "38px",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    borderRadius:    "6px",
                    border:          "none",
                    background:      isActive
                      ? "rgba(212,175,55,0.08)"
                      : isHovered
                      ? "rgba(255,255,255,0.04)"
                      : "transparent",
                    cursor:          "pointer",
                    transition:      "all 200ms ease-out",
                    color:           isActive ? C.gold : isHovered ? C.white : C.muted,
                    padding:         0,
                  }}
                >
                  <Icon style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            );
          })}
        </nav>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onMouseEnter={() => setUserHovered(true)}
              onMouseLeave={() => setUserHovered(false)}
              style={{
                width:           "32px",
                height:          "32px",
                borderRadius:    "50%",
                backgroundColor: C.surface,
                border:          `1px solid ${userHovered ? "#555" : C.border}`,
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                cursor:          "pointer",
                color:           C.muted,
                fontSize:        "12px",
                fontWeight:      "600",
                fontFamily:      "'Space Grotesk', sans-serif",
                transition:      "border-color 200ms",
                flexShrink:      0,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            style={{
              backgroundColor: "#161616",
              border:          `1px solid ${C.border}`,
              borderRadius:    "6px",
              padding:         "4px",
              minWidth:        "200px",
            }}
          >
            {/* User info header */}
            <div
              style={{
                padding:      "10px 12px",
                borderBottom: `1px solid ${C.border}`,
                marginBottom: "4px",
              }}
            >
              <p
                style={{
                  fontSize:   "0.8125rem",
                  fontWeight: "600",
                  color:      C.white,
                  fontFamily: "'Space Grotesk', sans-serif",
                  marginBottom: "2px",
                }}
              >
                {user?.name}
              </p>
              <p style={{ fontSize: "0.75rem", color: C.muted }}>
                {user?.email}
              </p>
              <span
                className="chip chip-white"
                style={{ marginTop: "6px", display: "inline-block" }}
              >
                {user?.role}
              </span>
            </div>
            <DropdownMenuItem
              onClick={logout}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "8px",
                padding:      "8px 12px",
                cursor:       "pointer",
                color:        C.muted,
                fontSize:     "0.8125rem",
                borderRadius: "4px",
                border:       "none",
                background:   "transparent",
              }}
            >
              <LogOut style={{ width: "14px", height: "14px" }} />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main
        style={{
          marginLeft:      "60px",
          flex:            1,
          minHeight:       "100vh",
          backgroundColor: C.bg,
        }}
      >
        {children}
      </main>
    </div>
  );
}
