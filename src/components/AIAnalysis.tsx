import { CheckCircle2, AlertTriangle, Leaf, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  analysis: string | null;
}

export default function AIAnalysis({ analysis }: Props) {
  if (!analysis) {
    return (
      <div className="glow-card flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4 animate-float">
          <Leaf className="h-8 w-8 text-muted-foreground/20" />
        </div>
        <p className="text-muted-foreground text-sm">Enter sensor readings to activate AI analysis</p>
        <p className="text-muted-foreground/50 text-xs mt-1">Powered by Neural Composting Engine</p>
      </div>
    );
  }

  const isSuitable = analysis.toLowerCase().includes("suitable") && !analysis.toLowerCase().includes("not suitable") && !analysis.toLowerCase().includes("unsuitable");

  return (
    <div className="glow-card">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSuitable ? 'bg-primary/10' : 'bg-accent/10'}`}>
          {isSuitable ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-accent" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">
            {isSuitable ? "Conditions Optimal" : "Adjustments Required"}
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" /> AI Analysis Complete
          </p>
        </div>
      </div>
      <div className="prose prose-sm prose-invert max-w-none text-foreground/85 bg-muted/20 rounded-xl p-5 border border-border/20 [&_h3]:font-display [&_h3]:text-foreground [&_li]:text-foreground/75 [&_strong]:text-foreground [&_p]:leading-relaxed">
        <ReactMarkdown>{analysis}</ReactMarkdown>
      </div>
    </div>
  );
}
