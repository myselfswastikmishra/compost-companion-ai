import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Loader2, Leaf, Sparkles, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function CropRecommender() {
  const [crop, setCrop] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("compost-chat", {
        body: { type: "crop_recommend", crop: crop.trim() },
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
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sprout className="h-4 w-4 text-primary" />
          </div>
          Crop Intelligence
        </h2>
        <span className="text-[10px] text-primary/60 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> AI-Powered
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Enter a crop name to get AI-driven recommendations on optimal bio-waste materials, composting methods, and nutrient profiles.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <Input
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="e.g. Tomato, Rice, Wheat, Corn..."
            required
            className="pl-10 bg-muted/30 border-border/30 focus:border-primary/50"
          />
        </div>
        <Button type="submit" disabled={loading} className="shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 gradient-primary opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center gap-1.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Analyze"}
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
            <Leaf className="h-7 w-7 text-muted-foreground/15" />
          </div>
          <p className="text-sm text-muted-foreground">Enter a crop to receive tailored compost intelligence</p>
        </div>
      )}
    </div>
  );
}
