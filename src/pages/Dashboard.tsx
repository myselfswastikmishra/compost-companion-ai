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
  BarChart3, Zap
} from "lucide-react";

interface Reading {
  pm25: number;
  mq135: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
}

function getCompostPhase(temp: number) {
  if (temp < 20) return { phase: "Cold / Inactive", color: "text-muted-foreground", bg: "bg-muted" };
  if (temp < 40) return { phase: "Mesophilic", color: "text-compost-green-light", bg: "bg-primary/10" };
  if (temp < 70) return { phase: "Thermophilic", color: "text-destructive", bg: "bg-destructive/10" };
  return { phase: "Overheating", color: "text-destructive", bg: "bg-destructive/20" };
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
  return { label: "High (Anaerobic Risk)", color: "text-destructive" };
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Live Data button */}
        <div className="mb-8 animate-fade-in flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-display font-bold text-foreground">Compost Dashboard</h1>
            </div>
            <p className="text-muted-foreground">AI-powered bioWaste composting intelligence with real-time sensor analysis</p>
          </div>
          <a
            href="https://compostiqweb.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm gradient-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-md">
              <Radio className="h-4 w-4 animate-pulse" />
              Live Data
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </a>
        </div>

        {/* Feature overview badges */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in">
          {[
            { icon: Activity, label: "Sensor Analysis" },
            { icon: Sprout, label: "Crop Advisor" },
            { icon: Calendar, label: "Timeline Planner" },
            { icon: Recycle, label: "Waste Auditor" },
            { icon: Brain, label: "AI Chatbot" },
            { icon: BarChart3, label: "Data History" },
            { icon: Gauge, label: "Phase Detection" },
            { icon: Zap, label: "Real-time Insights" },
          ].map((f) => (
            <span key={f.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <f.icon className="h-3 w-3" />
              {f.label}
            </span>
          ))}
        </div>

        {/* Quick stats cards */}
        {latest && phase && airQ && gasL && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 animate-fade-in">
            <div className="sensor-card text-center py-3">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-compost-warm" />
              <p className="text-lg font-bold text-foreground">{latest.pm25}</p>
              <p className="text-[10px] text-muted-foreground">PM2.5 µg/m³</p>
              <span className={`text-[10px] font-medium ${airQ.color}`}>{airQ.label}</span>
            </div>
            <div className="sensor-card text-center py-3">
              <Flame className="h-4 w-4 mx-auto mb-1 text-compost-warm" />
              <p className="text-lg font-bold text-foreground">{latest.mq135}</p>
              <p className="text-[10px] text-muted-foreground">MQ-135 ppm</p>
              <span className={`text-[10px] font-medium ${gasL.color}`}>{gasL.label}</span>
            </div>
            <div className="sensor-card text-center py-3">
              <Thermometer className="h-4 w-4 mx-auto mb-1 text-destructive" />
              <p className="text-lg font-bold text-foreground">{latest.temperature}°C</p>
              <p className="text-[10px] text-muted-foreground">Temperature</p>
            </div>
            <div className="sensor-card text-center py-3">
              <Droplets className="h-4 w-4 mx-auto mb-1 text-compost-green-light" />
              <p className="text-lg font-bold text-foreground">{latest.humidity}%</p>
              <p className="text-[10px] text-muted-foreground">Humidity</p>
            </div>
            <div className="sensor-card text-center py-3">
              <Leaf className="h-4 w-4 mx-auto mb-1 text-primary" />
              <p className={`text-sm font-bold ${phase.color}`}>{phase.phase}</p>
              <p className="text-[10px] text-muted-foreground">Compost Phase</p>
            </div>
            <div className="sensor-card text-center py-3">
              <BarChart3 className="h-4 w-4 mx-auto mb-1 text-compost-brown-light" />
              <p className="text-lg font-bold text-foreground">{readings.length}</p>
              <p className="text-[10px] text-muted-foreground">Readings</p>
            </div>
          </div>
        )}

        {/* Main tabbed interface */}
        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="analyze" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
              <Activity className="h-3.5 w-3.5" />
              Sensor Analysis
            </TabsTrigger>
            <TabsTrigger value="crop" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
              <Sprout className="h-3.5 w-3.5" />
              Crop Advisor
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
              <Calendar className="h-3.5 w-3.5" />
              Timeline Planner
            </TabsTrigger>
            <TabsTrigger value="waste" className="flex items-center gap-1.5 text-xs sm:text-sm py-2">
              <Recycle className="h-3.5 w-3.5" />
              Waste Auditor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <SensorForm onSubmit={handleAnalyze} loading={loading} />
            <AIAnalysis analysis={analysis} />
            <SensorHistory readings={readings} />
          </TabsContent>

          <TabsContent value="crop">
            <CropRecommender />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelinePlanner />
          </TabsContent>

          <TabsContent value="waste">
            <WasteAuditor />
          </TabsContent>
        </Tabs>
      </main>
      <ChatbotWidget />
    </div>
  );
}
