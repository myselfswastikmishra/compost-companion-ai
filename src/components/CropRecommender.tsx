import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Loader2, Leaf } from "lucide-react";
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
    <div className="sensor-card">
      <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2 mb-4">
        <Sprout className="h-5 w-5 text-primary" />
        Crop-Specific Compost Advisor
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Enter a crop name to get AI-powered recommendations on the best bio-waste materials and composting methods tailored for that crop.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <div className="flex-1">
          <Label htmlFor="crop" className="sr-only">Crop Name</Label>
          <Input
            id="crop"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            placeholder="e.g. Tomato, Rice, Wheat, Corn..."
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}
          {loading ? "Analyzing..." : "Get Advice"}
        </Button>
      </form>
      {result ? (
        <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/50 rounded-lg p-4 border border-border [&_h3]:font-display [&_h3]:text-foreground [&_li]:text-foreground/80 [&_strong]:text-foreground">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Leaf className="h-10 w-10 text-muted-foreground/20 mb-2" />
          <p className="text-sm text-muted-foreground">Enter a crop to get tailored compost recommendations</p>
        </div>
      )}
    </div>
  );
}
