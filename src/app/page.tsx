import Link from "next/link";
import { Ticket, ShieldCheck, ArrowRight, Sparkles, CheckCircle, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col justify-between overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="container mx-auto max-w-7xl px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Ticket className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            TicketFlow
          </span>
        </div>
        <Button asChild variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Link href="/admin/events">
            <ShieldCheck className="h-4 w-4" /> Admin Portal
          </Link>
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto max-w-5xl px-6 py-12 md:py-24 text-center space-y-8 z-10 flex-1 flex flex-col justify-center items-center">
        <Badge className="px-3 py-1 gap-1.5 bg-primary/10 text-primary border-none font-semibold text-xs tracking-wider uppercase animate-bounce">
          <Sparkles className="h-3 w-3" /> Concurrency Safe Booking System
        </Badge>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none max-w-4xl">
          The Premium Way to <br />
          <span className="bg-gradient-to-r from-primary via-indigo-600 to-primary/80 bg-clip-text text-transparent">
            Secure Event Tickets
          </span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          Experience real-time ticket allocations built with database-level pessimistic locking. High concurrency protection prevents double sales, guaranteed.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full pt-8 pb-12">
          <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-muted-foreground/10 space-y-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Race Condition Guard</h3>
            <p className="text-xs text-muted-foreground text-center">Pessimistic locking handles thousands of requests at the exact same millisecond.</p>
          </div>

          <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-muted-foreground/10 space-y-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Multi-Step Booking</h3>
            <p className="text-xs text-muted-foreground text-center">Interactive 3-step wizard with client validation and simulated mock checkout.</p>
          </div>

          <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border border-muted-foreground/10 space-y-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm">Full Admin Dash</h3>
            <p className="text-xs text-muted-foreground text-center">Complete event controls, ticket limit adjustment, and live guest list management.</p>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Button asChild size="lg" className="w-full text-base font-bold shadow-lg hover:shadow-primary/20 transition-all duration-300 gap-2">
            <Link href="/events">
              Book Tickets <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full text-base font-bold gap-2">
            <Link href="/admin/events">
              Control Panel <ShieldCheck className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-card/30 backdrop-blur-sm z-10">
        <div className="container mx-auto max-w-7xl px-6 text-center text-xs text-muted-foreground">
          Built with Next.js, Shadcn UI, and Laravel for App Solutions Corporation Assessment.
        </div>
      </footer>
    </div>
  );
}
