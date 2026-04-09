import { Clock, Flame, Thermometer, Droplets, Wind, Database } from "lucide-react";

interface Reading {
  pm25: number;
  mq135: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
}

interface Props {
  readings: Reading[];
}

export default function SensorHistory({ readings }: Props) {
  if (readings.length === 0) return null;

  return (
    <div className="glow-card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyber-blue/10 flex items-center justify-center">
            <Database className="h-4 w-4 text-cyber-blue" />
          </div>
          Data Log
        </h2>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{readings.length} records</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {readings.map((r, i) => (
          <div key={i} className="flex items-center justify-between bg-muted/20 border border-border/10 rounded-xl px-4 py-3 text-sm hover:border-primary/20 transition-all group">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {r.timestamp.toLocaleTimeString()}
            </span>
            <div className="flex gap-5 flex-wrap">
              <span className="flex items-center gap-1 text-foreground/70 group-hover:text-foreground transition-colors"><Wind className="h-3 w-3 text-cyber-blue" />{r.pm25}</span>
              <span className="flex items-center gap-1 text-foreground/70 group-hover:text-foreground transition-colors"><Flame className="h-3 w-3 text-accent" />{r.mq135}</span>
              <span className="flex items-center gap-1 text-foreground/70 group-hover:text-foreground transition-colors"><Thermometer className="h-3 w-3 text-destructive" />{r.temperature}°C</span>
              <span className="flex items-center gap-1 text-foreground/70 group-hover:text-foreground transition-colors"><Droplets className="h-3 w-3 text-compost-green-light" />{r.humidity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
