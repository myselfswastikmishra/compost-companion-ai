import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Recycle, Loader2, Trash2, Sparkles, FlaskConical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function WasteAuditor() {
  const [wasteItems, setWasteItems] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteItems.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("compost-chat", {
        body: { type: "waste_audit", wasteItems: wasteItems.trim() },
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
          <div className="w-8 h-8 rounded-lg bg-compost-green-light/10 flex items-center justify-center">
            <FlaskConical className="h-4 w-4 text-compost-green-light" />
          </div>
          Waste Compatibility Lab
        </h2>
        <span className="text-[10px] text-compost-green-light/60 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> Neural Analysis
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        List your bio-waste materials for AI analysis of compostability, C:N ratio classification, optimal mixing ratios, and decomposition timelines.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 mb-5">
        <div>
          <Label htmlFor="wasteItems" className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Trash2 className="h-3.5 w-3.5 text-compost-brown-light" />
            Bio-Waste Materials
          </Label>
          <Textarea
            id="wasteItems"
            value={wasteItems}
            onChange={(e) => setWasteItems(e.target.value)}
            placeholder="e.g. Banana peels, coffee grounds, dry leaves, rice straw, vegetable scraps, eggshells..."
            rows={3}
            required
            className="bg-muted/30 border-border/30 focus:border-compost-green-light/50 resize-none"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full relative overflow-hidden group" size="lg">
          <div className="absolute inset-0 bg-gradient-to-r from-compost-green-light to-primary opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center gap-2 font-semibold text-primary-foreground">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Recycle className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Run Compatibility Analysis"}
          </span>
        </Button>
      </form>
      {result ? (
        <div className="prose prose-sm prose-invert max-w-none text-foreground/85 bg-muted/20 rounded-xl p-5 border border-border/20 [&_h3]:font-display [&_h3]:text-foreground [&_li]:text-foreground/75 [&_strong]:text-foreground [&_table]:text-foreground/80">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted/20 flex items-center justify-center mb-3 animate-float">
            <Recycle className="h-7 w-7 text-muted-foreground/15" />
          </div>
          <p className="text-sm text-muted-foreground">List your waste materials for neural compatibility analysis</p>
        </div>
      )}
    </div>
  );
}
