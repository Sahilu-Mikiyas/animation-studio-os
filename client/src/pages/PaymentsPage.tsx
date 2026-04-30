import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { TrendingUp, DollarSign, Send, Loader2, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, Bitcoin } from "lucide-react";

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
  green:   "#6A9A6A",
};

const WITHDRAWAL_METHODS = [
  { id: "bank",         label: "Bank Transfer",  icon: CreditCard  },
  { id: "mobile_money", label: "Mobile Money",   icon: Smartphone  },
  { id: "crypto",       label: "Cryptocurrency", icon: Bitcoin     },
] as const;

const SALARY_DATA = [
  { month: "Jan", amount: 800  },
  { month: "Feb", amount: 950  },
  { month: "Mar", amount: 1100 },
  { month: "Apr", amount: 1250 },
];

const MAX_SALARY = 1250;

export default function PaymentsPage() {
  const [withdrawalAmount, setWithdrawalAmount]   = useState("");
  const [withdrawalMethod, setWithdrawalMethod]   = useState<"bank" | "mobile_money" | "crypto">("bank");
  const [isSubmitting, setIsSubmitting]           = useState(false);

  const { data: payments, isLoading } = trpc.payments.list.useQuery();
  const withdrawalMutation = trpc.payments.requestWithdrawal.useMutation({
    onSuccess: () => {
      toast.success("Withdrawal request submitted");
      setWithdrawalAmount("");
    },
    onError: (err) => toast.error(err.message || "Request failed"),
  });

  const handleWithdrawal = async () => {
    const amt = parseFloat(withdrawalAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    setIsSubmitting(true);
    try {
      await withdrawalMutation.mutateAsync({ amount: amt, method: withdrawalMethod });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalEarnings = payments?.reduce((sum: number, p: any) => {
    return p.type === "payment"
      ? sum + parseFloat(p.amount ?? 0)
      : sum - parseFloat(p.amount ?? 0);
  }, 0) ?? 0;

  const pendingCount = payments?.filter((p: any) => p.type === "withdrawal" && p.status === "pending").length ?? 0;

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: C.bg }}>
        <Loader2 style={{ width: "20px", height: "20px", color: C.gold }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="page-enter"
      style={{ minHeight: "100vh", backgroundColor: C.bg, padding: "2.5rem" }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: `1px solid ${C.border}` }}>
        <p style={{ fontSize: "0.72rem", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px", color: C.dim, textTransform: "uppercase", marginBottom: "6px" }}>
          Financial
        </p>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.8px", color: C.white, marginBottom: "4px" }}>
          Earnings & Payments
        </h1>
        <p style={{ fontSize: "0.875rem", color: C.muted }}>
          Track income and manage withdrawal requests
        </p>
      </div>

      {/* ── Summary cards ────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", backgroundColor: C.border, border: `1px solid ${C.border}`, borderRadius: "6px", overflow: "hidden", marginBottom: "2rem" }}>
        {[
          { icon: DollarSign,  label: "Total Earnings",  value: `$${totalEarnings.toFixed(2)}`, sub: "All time"         },
          { icon: TrendingUp,  label: "This Month",      value: "$1,250",                        sub: "+15% from last"  },
          { icon: Send,        label: "Pending",         value: String(pendingCount),            sub: "Withdrawal reqs" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ backgroundColor: C.card, padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.75rem", color: C.muted }}>{s.label}</span>
                <Icon style={{ width: "13px", height: "13px", color: C.dim }} />
              </div>
              <div style={{ fontSize: "1.875rem", fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif", color: C.white, lineHeight: "1", marginBottom: "4px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.72rem", color: C.dim }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── Left: Salary chart + Transaction history ──────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Salary progression */}
          <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: "600", fontFamily: "'Space Grotesk', sans-serif", color: C.white }}>
                Salary Progression
              </span>
            </div>
            <div style={{ padding: "1.25rem" }}>
              {SALARY_DATA.map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < SALARY_DATA.length - 1 ? "10px" : 0 }}>
                  <span style={{ fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace", color: C.dim, width: "28px", flexShrink: 0 }}>
                    {row.month}
                  </span>
                  <div style={{ flex: 1, backgroundColor: C.raised, borderRadius: "2px", height: "2px", overflow: "hidden" }}>
                    <div
                      style={{
                        height:          "100%",
                        width:           `${(row.amount / MAX_SALARY) * 100}%`,
                        backgroundColor: i === SALARY_DATA.length - 1 ? C.gold : C.muted,
                        borderRadius:    "2px",
                        transition:      "width 600ms cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", color: i === SALARY_DATA.length - 1 ? C.gold : C.muted, width: "44px", textAlign: "right", flexShrink: 0 }}>
                    ${row.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction history */}
          <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: "600", fontFamily: "'Space Grotesk', sans-serif", color: C.white }}>
                Transaction History
              </span>
            </div>

            {payments && payments.length > 0 ? (
              payments.slice(0, 10).map((p: any, idx: number) => {
                const isPayment = p.type === "payment";
                return (
                  <div
                    key={idx}
                    style={{
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "space-between",
                      padding:        "0.875rem 1.25rem",
                      borderBottom:   idx < Math.min(payments.length, 10) - 1 ? `1px solid ${C.border}` : "none",
                      gap:            "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width:           "28px",
                          height:          "28px",
                          borderRadius:    "50%",
                          backgroundColor: C.raised,
                          border:          `1px solid ${C.border}`,
                          display:         "flex",
                          alignItems:      "center",
                          justifyContent:  "center",
                          flexShrink:      0,
                        }}
                      >
                        {isPayment
                          ? <ArrowDownLeft style={{ width: "12px", height: "12px", color: C.green }} />
                          : <ArrowUpRight  style={{ width: "12px", height: "12px", color: C.muted }} />
                        }
                      </div>
                      <div>
                        <p style={{ fontSize: "0.8125rem", color: C.white, marginBottom: "2px" }}>
                          {isPayment ? "Payment Received" : "Withdrawal"}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>
                          {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", color: isPayment ? C.white : C.muted, marginBottom: "3px" }}>
                        {isPayment ? "+" : "−"}${parseFloat(p.amount ?? 0).toFixed(2)}
                      </p>
                      <span
                        className={`chip ${p.status === "completed" ? "chip-white" : p.status === "pending" ? "chip-gold" : "chip-urgent"}`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "3rem", textAlign: "center", color: C.dim, fontSize: "0.875rem" }}>
                No transactions yet
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Withdrawal form ────────────────────────── */}
        <div
          style={{
            backgroundColor: C.card,
            border:          `1px solid ${C.border}`,
            borderRadius:    "6px",
            overflow:        "hidden",
            position:        "sticky",
            top:             "1.5rem",
          }}
        >
          <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: "600", fontFamily: "'Space Grotesk', sans-serif", color: C.white }}>
              Request Withdrawal
            </span>
          </div>

          <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Amount */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: C.muted, marginBottom: "6px", fontWeight: "500" }}>
                Amount (USD)
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="0.00"
                  className="studio-input"
                  style={{ flex: 1 }}
                />
                <button
                  className="btn-ghost"
                  style={{ padding: "8px 12px", fontSize: "0.75rem", whiteSpace: "nowrap" }}
                  onClick={() => setWithdrawalAmount(String(totalEarnings.toFixed(2)))}
                >
                  Max
                </button>
              </div>
            </div>

            {/* Method */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: C.muted, marginBottom: "8px", fontWeight: "500" }}>
                Withdrawal Method
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {WITHDRAWAL_METHODS.map((method) => {
                  const selected = withdrawalMethod === method.id;
                  const Icon     = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setWithdrawalMethod(method.id)}
                      style={{
                        display:         "flex",
                        alignItems:      "center",
                        gap:             "10px",
                        padding:         "10px 12px",
                        backgroundColor: selected ? "rgba(212,175,55,0.08)" : C.surface,
                        border:          `1px solid ${selected ? C.gold : C.border}`,
                        borderRadius:    "4px",
                        cursor:          "pointer",
                        transition:      "all 150ms",
                        textAlign:       "left",
                      }}
                    >
                      <Icon style={{ width: "14px", height: "14px", color: selected ? C.gold : C.dim, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.8125rem", color: selected ? C.white : C.muted, fontWeight: selected ? "500" : "400" }}>
                        {method.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info */}
            <div
              style={{
                backgroundColor: C.surface,
                border:          `1px solid ${C.border}`,
                borderRadius:    "4px",
                padding:         "10px 12px",
              }}
            >
              <p style={{ fontSize: "0.75rem", color: C.dim, marginBottom: "3px" }}>Processing time: 2–5 business days</p>
              <p style={{ fontSize: "0.75rem", color: C.dim }}>Minimum withdrawal: $50</p>
            </div>

            {/* Submit */}
            <button
              className="btn-gold"
              onClick={handleWithdrawal}
              disabled={isSubmitting || !withdrawalAmount}
              style={{
                width:          "100%",
                justifyContent: "center",
                padding:        "10px",
                opacity:        isSubmitting || !withdrawalAmount ? 0.5 : 1,
                cursor:         isSubmitting || !withdrawalAmount ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? (
                <Loader2 style={{ width: "14px", height: "14px" }} className="animate-spin" />
              ) : (
                <Send style={{ width: "14px", height: "14px" }} />
              )}
              {isSubmitting ? "Processing..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
