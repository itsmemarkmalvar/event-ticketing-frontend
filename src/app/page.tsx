import Link from "next/link";
import { Ticket, ShieldCheck, ArrowRight, Sparkles, CheckCircle, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between overflow-hidden relative">
      {/* Dynamic Glowing Orbs Background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="container mx-auto max-w-7xl px-6 py-6 flex items-center justify-between z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 group">
          <div className="bg-primary/20 border border-primary/50 text-primary p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            <Ticket className="h-6 w-6" />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight text-gradient">
            TicketFlow
          </span>
        </div>
        <Button asChild variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
          <Link href="/admin/events">
            <ShieldCheck className="h-4 w-4" /> Admin Portal
          </Link>
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto max-w-5xl px-6 py-12 md:py-24 text-center space-y-8 z-10 flex-1 flex flex-col justify-center items-center">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Badge className="px-4 py-1.5 gap-1.5 bg-primary/10 text-primary border border-primary/20 font-semibold text-xs tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="h-3 w-3" /> Concurrency Safe Booking System
          </Badge>
        </div>

        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight leading-[1.1] max-w-4xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          The Premium Way to <br />
          <span className="text-gradient">
            Secure Event Tickets
          </span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Experience real-time ticket allocations built with database-level pessimistic locking. High concurrency protection prevents double sales, guaranteed.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full pt-10 pb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card flex flex-col items-center p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 space-y-3 group">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">Race Condition Guard</h3>
            <p className="text-sm text-muted-foreground text-center">Pessimistic locking handles thousands of requests at the exact same millisecond.</p>
          </div>

          <div className="glass-card flex flex-col items-center p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 space-y-3 group">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">Multi-Step Booking</h3>
            <p className="text-sm text-muted-foreground text-center">Interactive 3-step wizard with client validation and simulated mock checkout.</p>
          </div>

          <div className="glass-card flex flex-col items-center p-6 rounded-2xl hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 space-y-3 group">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground">Full Admin Dash</h3>
            <p className="text-sm text-muted-foreground text-center">Complete event controls, ticket limit adjustment, and live guest list management.</p>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button asChild size="lg" className="w-full text-base font-bold shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] hover:scale-105 transition-all duration-300 gap-2 h-14 rounded-xl">
            <Link href="/events">
              Book Tickets <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full text-base font-bold gap-2 h-14 rounded-xl border-white/10 hover:bg-white/5 hover:text-foreground transition-all duration-300">
            <Link href="/admin/events">
              Control Panel <ShieldCheck className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-black/20 backdrop-blur-md z-10">
        <div className="container mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          Built with Next.js, Shadcn UI, and Laravel for App Solutions Corporation Assessment.
        </div>
      </footer>
    </div>
  );
}
