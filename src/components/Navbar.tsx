import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, LogOut, Menu, X, BookOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-border/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
            <Leaf className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-foreground tracking-tight">CompostIQ</span>
            <span className="hidden sm:inline text-[9px] text-primary font-medium ml-2 uppercase tracking-widest">v2.0</span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
            Dashboard
          </Link>
          <Link to="/tutorial" className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Guide
          </Link>
          <div className="w-px h-5 bg-border/30 mx-2" />
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-1.5" /> Logout
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground p-1.5 rounded-lg hover:bg-muted/50 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/20 bg-card/80 backdrop-blur-xl px-4 py-3 flex flex-col gap-1 animate-fade-in">
          <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          <Link to="/tutorial" className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all" onClick={() => setMobileOpen(false)}>Guide</Link>
          <Button variant="ghost" size="sm" className="justify-start mt-1" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1.5" /> Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
