import { useState } from "react";
import Navbar from "@/components/Navbar";
import SensorForm from "@/components/SensorForm";
import AIAnalysis from "@/components/AIAnalysis";
import SensorHistory from "@/components/SensorHistory";
import CropRecommender from "@/components/CropRecommender";
import TimelinePlanner from "@/components/TimelinePlanner";
import WasteAuditor from "@/components/WasteAuditor";
import ChatbotWidget from "@/components/ChatbotWidget";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Flame, Leaf, TrendingUp, Thermometer, Droplets, Activity,
  ExternalLink, Sprout, Calendar, Recycle, Brain, Gauge, Radio,
  BarChart3, Zap, Cpu, Shield, Wifi, Database, GitBranch, Eye
} from "lucide-react";

interface Reading {
  pm25: number;
  mq135: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
}

function getCompostPhase(temp: number) {
  if (temp < 20) return { phase: "Cold / Inactive", color: "text-muted-foreground", icon: "❄️" };
  if (temp < 40) return { phase: "Mesophilic", color: "text-compost-green-light", icon: "🌱" };
  if (temp < 70) return { phase: "Thermophilic", color: "text-accent", icon: "🔥" };
  return { phase: "Overheating", color: "text-destructive", icon: "⚠️" };
}

function getAirQuality(pm25: number) {
  if (pm25 <= 12) return { label: "Good", color: "text-primary" };
  if (pm25 <= 35) return { label: "Moderate", color: "text-compost-warm" };
  if (pm25 <= 55) return { label: "Unhealthy (SG)", color: "text-accent" };
  return { label: "Unhealthy", color: "text-destructive" };
}

function getGasLevel(mq135: number) {
  if (mq135 <= 200) return { label: "Low", color: "text-primary" };
  if (mq135 <= 500) return { label: "Normal", color: "text-compost-green-light" };
  return { label: "High (Anaerobic)", color: "text-destructive" };
}

export default function Dashboard() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);

  const handleAnalyze = async (data: { pm25: number; mq135: number; temperature: number; humidity: number }) => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("compost-chat", {
        body: { type: "analyze", sensorData: data },
      });
      if (error) throw error;
      setAnalysis(result.response);
      setReadings(prev => [{ ...data, timestamp: new Date() }, ...prev].slice(0, 20));
    } catch (err: any) {
      toast.error("Failed to analyze: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const latest = readings.length > 0 ? readings[0] : null;
  const phase = latest ? getCompostPhase(latest.temperature) : null;
  const airQ = latest ? getAirQuality(latest.pm25) : null;
  const gasL = latest ? getGasLevel(latest.mq135) : null;

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl relative">
        {/* Hero header with glow */}
        <div className="hero-glow mb-10 animate-fade-in">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center animate-glow-pulse">
                    <Brain className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full pulse-dot" />
                </div>
                <div>
                  <h1 className="text-4xl font-display font-bold text-foreground text-glow">
                    CompostIQ
                  </h1>
                  <p className="text-xs text-primary font-medium tracking-widest uppercase">Intelligence Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground mt-2 max-w-lg">
                AI-powered bioWaste composting intelligence with real-time sensor fusion, 
                predictive analytics & autonomous optimization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://compostiqweb.netlify.app/" target="_blank" rel="noopener noreferrer">
                <button className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                  <div className="absolute inset-0 gradient-primary opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Radio className="h-4 w-4 text-primary-foreground relative z-10 animate-pulse" />
                  <span className="text-primary-foreground relative z-10 font-semibold">Live Data</span>
                  <ExternalLink className="h-3.5 w-3.5 text-primary-foreground/80 relative z-10" />
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* System status badges */}
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {[
            { icon: Activity, label: "Sensor Fusion", glow: true },
            { icon: Cpu, label: "AI Engine" },
            { icon: Sprout, label: "Crop Intelligence" },
            { icon: Calendar, label: "Timeline AI" },
            { icon: Recycle, label: "Waste Analysis" },
            { icon: Brain, label: "Neural Chatbot" },
            { icon: Shield, label: "Phase Detection" },
            { icon: Wifi, label: "IoT Connected" },
            { icon: Database, label: "Data Pipeline" },
            { icon: Eye, label: "Real-time Monitor" },
          ].map((f, i) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/5 text-primary/80 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 cursor-default"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <f.icon className="h-3 w-3" />
              {f.label}
              {f.glow && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
            </span>
          ))}
        </div>

        {/* Quick stats cards */}
        {latest && phase && airQ && gasL && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {[
              { icon: TrendingUp, value: latest.pm25, unit: "µg/m³", label: "PM2.5", sub: airQ.label, subColor: airQ.color, iconColor: "text-cyber-blue" },
              { icon: Flame, value: latest.mq135, unit: "ppm", label: "MQ-135", sub: gasL.label, subColor: gasL.color, iconColor: "text-accent" },
              { icon: Thermometer, value: `${latest.temperature}°C`, unit: "", label: "Temperature", sub: phase.phase, subColor: phase.color, iconColor: "text-destructive" },
              { icon: Droplets, value: `${latest.humidity}%`, unit: "", label: "Humidity", sub: latest.humidity > 60 ? "Optimal" : "Low", subColor: latest.humidity > 60 ? "text-primary" : "text-accent", iconColor: "text-compost-green-light" },
              { icon: Leaf, value: phase.icon, unit: "", label: "Phase", sub: phase.phase, subColor: phase.color, iconColor: "text-primary" },
              { icon: BarChart3, value: readings.length, unit: "", label: "Readings", sub: "Total", subColor: "text-muted-foreground", iconColor: "text-cyber-blue" },
            ].map((stat, i) => (
              <div key={i} className="stat-card text-center group cursor-default">
                <stat.icon className={`h-4 w-4 mx-auto mb-2 ${stat.iconColor} transition-transform group-hover:scale-110`} />
                <p className="text-lg font-bold text-foreground font-display">{stat.value}<span className="text-[10px] text-muted-foreground ml-0.5">{stat.unit}</span></p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <span className={`text-[10px] font-semibold ${stat.subColor}`}>{stat.sub}</span>
              </div>
            ))}
          </div>
        )}

        {/* Main tabbed interface */}
        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto bg-card/50 backdrop-blur-xl border border-border/30 rounded-xl p-1">
            <TabsTrigger value="analyze" className="flex items-center gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg transition-all">
              <Activity className="h-3.5 w-3.5" />
              Sensor Analysis
            </TabsTrigger>
            <TabsTrigger value="crop" className="flex items-center gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg transition-all">
              <Sprout className="h-3.5 w-3.5" />
              Crop Advisor
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg transition-all">
              <Calendar className="h-3.5 w-3.5" />
              Timeline Planner
            </TabsTrigger>
            <TabsTrigger value="waste" className="flex items-center gap-1.5 text-xs sm:text-sm py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-lg transition-all">
              <Recycle className="h-3.5 w-3.5" />
              Waste Auditor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6 animate-fade-in">
            <SensorForm onSubmit={handleAnalyze} loading={loading} />
            <AIAnalysis analysis={analysis} />
            <SensorHistory readings={readings} />
          </TabsContent>

          <TabsContent value="crop" className="animate-fade-in">
            <CropRecommender />
          </TabsContent>

          <TabsContent value="timeline" className="animate-fade-in">
            <TimelinePlanner />
          </TabsContent>

          <TabsContent value="waste" className="animate-fade-in">
            <WasteAuditor />
          </TabsContent>
        </Tabs>

        {/* Footer system info */}
        <div className="mt-12 pt-6 border-t border-border/20 flex flex-wrap items-center justify-center gap-6 text-[10px] text-muted-foreground/50 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> Gemini AI Engine</span>
          <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> ESP32 + DHT11 + PM2.5 + MQ-135</span>
          <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> End-to-End Encrypted</span>
          <span className="flex items-center gap-1"><Database className="h-3 w-3" /> Cloud Backend</span>
        </div>
      </main>
      <ChatbotWidget />
    </div>
  );
}
