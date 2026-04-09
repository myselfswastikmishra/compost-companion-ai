import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Recycle, Loader2, Trash2 } from "lucide-react";
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
    <div className="sensor-card">
      <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2 mb-4">
        <Recycle className="h-5 w-5 text-compost-green-light" />
        Bio-Waste Compatibility Analyzer
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        List your available bio-waste materials and get an AI analysis of compostability, optimal mixing ratios, and preparation steps.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <div>
          <Label htmlFor="wasteItems" className="flex items-center gap-1.5 mb-1.5">
            <Trash2 className="h-3.5 w-3.5 text-compost-brown-light" />
            List Your Bio-Waste Materials
          </Label>
          <Textarea
            id="wasteItems"
            value={wasteItems}
            onChange={(e) => setWasteItems(e.target.value)}
            placeholder="e.g. Banana peels, coffee grounds, dry leaves, rice straw, vegetable scraps, eggshells..."
            rows={3}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Recycle className="h-4 w-4" />}
          {loading ? "Auditing..." : "Analyze Waste Compatibility"}
        </Button>
      </form>
      {result ? (
        <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/50 rounded-lg p-4 border border-border [&_h3]:font-display [&_h3]:text-foreground [&_li]:text-foreground/80 [&_strong]:text-foreground [&_table]:text-foreground/80">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Recycle className="h-10 w-10 text-muted-foreground/20 mb-2" />
          <p className="text-sm text-muted-foreground">List your waste materials to check compatibility</p>
        </div>
      )}
    </div>
  );
}
