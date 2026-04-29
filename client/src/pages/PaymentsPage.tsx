import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { TrendingUp, DollarSign, Send, Loader2, CheckCircle } from "lucide-react";

export default function PaymentsPage() {
  const { user } = useAuth();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState<"bank" | "mobile_money" | "crypto">("bank");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: payments, isLoading } = trpc.payments.list.useQuery();
  const withdrawalMutation = trpc.payments.requestWithdrawal.useMutation({
    onSuccess: () => {
      toast.success("Withdrawal request submitted!");
      setWithdrawalAmount("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit withdrawal request");
    },
  });

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await withdrawalMutation.mutateAsync({
        amount: parseFloat(withdrawalAmount),
        method: withdrawalMethod,
      });
    } catch (error) {
      console.error("Withdrawal error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalEarnings = payments?.reduce((sum: number, p: any) => {
    if (p.type === "payment") return sum + parseFloat(p.amount || 0);
    return sum - parseFloat(p.amount || 0);
  }, 0) || 0;

  const pendingWithdrawals = payments?.filter((p: any) => p.type === "withdrawal" && p.status === "pending").length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Earnings & Payments</h1>
          <p className="text-muted-foreground">Manage your income and withdrawal requests</p>
        </div>

        {/* Financial Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Total Earnings</h3>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">${totalEarnings.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">This Month</h3>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">$1,250</p>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </Card>

          <Card className="bg-card border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
              <Send className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">{pendingWithdrawals}</p>
            <p className="text-xs text-muted-foreground">Withdrawal requests</p>
          </Card>
        </div>

        {/* Withdrawal Section */}
        <Card className="bg-card border-border p-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Request Withdrawal</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount (USD)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-input border-border"
                />
                <Button variant="outline">Max</Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Withdrawal Method</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "bank", label: "Bank Transfer", icon: "🏦" },
                  { id: "mobile_money", label: "Mobile Money", icon: "📱" },
                  { id: "crypto", label: "Cryptocurrency", icon: "₿" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setWithdrawalMethod(method.id as any)}
                    className={`p-4 rounded-lg border-2 transition-all text-center space-y-2 ${
                      withdrawalMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-2xl">{method.icon}</div>
                    <p className="text-sm font-medium text-foreground">{method.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-input/50 p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">Processing time: 2-5 business days</p>
              <p className="text-sm text-muted-foreground">Minimum withdrawal: $50</p>
            </div>

            <Button
              onClick={handleWithdrawal}
              disabled={isSubmitting || !withdrawalAmount}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Request Withdrawal
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Earnings History */}
        <Card className="bg-card border-border p-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>

          <div className="space-y-3">
            {payments && payments.length > 0 ? (
              payments.slice(0, 10).map((payment: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-input/50 rounded-lg hover:bg-input transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">
                      {payment.type === "payment" ? "💰" : "📤"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {payment.type === "payment" ? "Payment Received" : "Withdrawal"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className={`font-bold ${payment.type === "payment" ? "text-primary" : "text-destructive"}`}>
                      {payment.type === "payment" ? "+" : "-"}${parseFloat(payment.amount || 0).toFixed(2)}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      payment.status === "completed" ? "bg-primary/10 text-primary" :
                      payment.status === "pending" ? "bg-accent/10 text-accent" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </div>
        </Card>

        {/* Salary Progression Chart */}
        <Card className="bg-card border-border p-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Salary Progression</h2>

          <div className="space-y-4">
            {[
              { month: "January", amount: 800 },
              { month: "February", amount: 950 },
              { month: "March", amount: 1100 },
              { month: "April", amount: 1250 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{item.month}</span>
                  <span className="font-medium text-primary">${item.amount}</span>
                </div>
                <div className="w-full h-2 bg-input rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${(item.amount / 1250) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
