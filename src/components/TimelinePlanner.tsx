import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2, Clock, Sparkles, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function TimelinePlanner() {
  const [days, setDays] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!days) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("compost-chat", {
        body: { type: "timeline_plan", days: parseInt(days), wasteType: wasteType.trim() },
      });
      if (error) throw error;
      setResult(data.response);
    } catch (err: any) {
      toast.error("Failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glow-card">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-accent" />
          </div>
          Timeline Planner
        </h2>
        <span className="text-[10px] text-accent/60 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> AI-Optimized
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Set your target composting duration and waste type to generate a detailed AI-optimized day-by-day action plan.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 mb-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="days" className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Timer className="h-3.5 w-3.5 text-accent" />
              Target Days
            </Label>
            <Input id="days" type="number" min="7" max="365" value={days} onChange={(e) => setDays(e.target.value)} placeholder="e.g. 30" required className="bg-muted/30 border-border/30 focus:border-accent/50" />
          </div>
          <div>
            <Label htmlFor="wasteType" className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Waste Type <span className="text-muted-foreground/40 ml-1">(optional)</span>
            </Label>
            <Input id="wasteType" value={wasteType} onChange={(e) => setWasteType(e.target.value)} placeholder="e.g. Kitchen scraps, yard waste" className="bg-muted/30 border-border/30 focus:border-primary/50" />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full relative overflow-hidden group" size="lg">
          <div className="absolute inset-0 gradient-warm opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center gap-2 font-semibold text-primary-foreground">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
            {loading ? "Planning..." : "Generate Action Plan"}
          </span>
        </Button>
      </form>
      {result ? (
        <div className="prose prose-sm prose-invert max-w-none text-foreground/85 bg-muted/20 rounded-xl p-5 border border-border/20 [&_h3]:font-display [&_h3]:text-foreground [&_li]:text-foreground/75 [&_strong]:text-foreground">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted/20 flex items-center justify-center mb-3 animate-float">
            <Clock className="h-7 w-7 text-muted-foreground/15" />
          </div>
          <p className="text-sm text-muted-foreground">Set your timeline to generate an optimized composting schedule</p>
        </div>
      )}
    </div>
  );
}
