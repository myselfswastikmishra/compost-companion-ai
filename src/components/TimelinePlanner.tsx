import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2, Clock } from "lucide-react";
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
    <div className="sensor-card">
      <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-accent" />
        Compost Timeline Planner
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Set your target number of days and waste type to get a detailed day-by-day composting action plan with AI-optimized steps.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="days" className="flex items-center gap-1.5 mb-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              Target Days
            </Label>
            <Input
              id="days"
              type="number"
              min="7"
              max="365"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="e.g. 30"
              required
            />
          </div>
          <div>
            <Label htmlFor="wasteType" className="flex items-center gap-1.5 mb-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Waste Type (optional)
            </Label>
            <Input
              id="wasteType"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
              placeholder="e.g. Kitchen scraps, yard waste"
            />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
          {loading ? "Planning..." : "Generate Action Plan"}
        </Button>
      </form>
      {result ? (
        <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/50 rounded-lg p-4 border border-border [&_h3]:font-display [&_h3]:text-foreground [&_li]:text-foreground/80 [&_strong]:text-foreground">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/20 mb-2" />
          <p className="text-sm text-muted-foreground">Set your timeline to get a step-by-step composting plan</p>
        </div>
      )}
    </div>
  );
}
