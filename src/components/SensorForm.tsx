import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Droplets, Flame, Loader2, Thermometer, Wind, Zap } from "lucide-react";

interface SensorData {
  pm25: number;
  mq135: number;
  temperature: number;
  humidity: number;
}

interface Props {
  onSubmit: (data: SensorData) => void;
  loading: boolean;
}

export default function SensorForm({ onSubmit, loading }: Props) {
  const [pm25, setPm25] = useState("");
  const [mq135, setMq135] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pm25: parseFloat(pm25),
      mq135: parseFloat(mq135),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
    });
  };

  const fields = [
    { id: "pm25", label: "PM2.5", unit: "µg/m³", icon: Wind, color: "text-cyber-blue", value: pm25, set: setPm25, placeholder: "e.g. 35", step: "0.1", min: "0" },
    { id: "mq135", label: "MQ-135", unit: "ppm", icon: Flame, color: "text-accent", value: mq135, set: setMq135, placeholder: "e.g. 200", step: "0.1", min: "0" },
    { id: "temp", label: "Temperature", unit: "°C", icon: Thermometer, color: "text-destructive", value: temperature, set: setTemperature, placeholder: "e.g. 55", step: "0.1", min: "-40", max: "80" },
    { id: "hum", label: "Humidity", unit: "%", icon: Droplets, color: "text-compost-green-light", value: humidity, set: setHumidity, placeholder: "e.g. 60", step: "0.1", min: "0", max: "100" },
  ];

  return (
    <form onSubmit={handleSubmit} className="glow-card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          Sensor Input
        </h2>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Ready
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((f) => (
          <div key={f.id} className="group">
            <Label htmlFor={f.id} className="flex items-center gap-1.5 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              <f.icon className={`h-3.5 w-3.5 ${f.color}`} />
              {f.label}
              <span className="text-muted-foreground/50 ml-auto">{f.unit}</span>
            </Label>
            <Input
              id={f.id}
              type="number"
              step={f.step}
              min={f.min}
              max={f.max}
              value={f.value}
              onChange={e => f.set(e.target.value)}
              placeholder={f.placeholder}
              required
              className="bg-muted/30 border-border/30 focus:border-primary/50 focus:bg-muted/50 transition-all"
            />
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full group relative overflow-hidden" disabled={loading} size="lg">
        <div className="absolute inset-0 gradient-primary opacity-90 group-hover:opacity-100 transition-opacity" />
        <span className="relative z-10 flex items-center gap-2 font-semibold">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </span>
      </Button>
    </form>
  );
}
