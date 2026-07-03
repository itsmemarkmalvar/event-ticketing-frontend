"use client";

import { useEffect, useState } from "react";
import { getEvents, Event } from "@/lib/api";
import { Calendar, Ticket, User, ArrowRight, Loader2, ShieldCheck, Search, Users } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export default function EventsListingPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        toast.error("Failed to load events. Is the Laravel server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Premium Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 border border-primary/50 text-primary p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
              <Ticket className="h-6 w-6" />
            </div>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-gradient">
              TicketFlow
            </span>
          </Link>
          <Button asChild variant="outline" className="gap-2 border-white/10 hover:bg-white/5 transition-all duration-300">
            <Link href="/admin/events">
              <ShieldCheck className="h-4 w-4 text-primary" /> Admin Portal
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center relative z-10">
        <div className="container mx-auto max-w-4xl px-4 space-y-6">
          <Badge className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 font-medium animate-fade-in-up">
            Live Ticket Bookings
          </Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tight leading-none animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Book Tickets for <br className="md:hidden" /><span className="text-gradient">Popular Events</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Secure, reliable booking for concerts, conferences, art showcases, and charity drives. Get yours before they sell out.
          </p>

          {/* Search bar widget */}
          <div className="max-w-md mx-auto pt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative group">
              <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search events..."
                className="pl-12 h-14 bg-white/5 border-white/10 text-lg rounded-2xl focus-visible:ring-primary/50 shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-all placeholder:text-white/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Feed */}
      <main className="container mx-auto max-w-7xl px-4 md:px-8 pb-16 flex-1 z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3 animate-pulse">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium">Discovering latest events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 rounded-2xl p-8 max-w-xl mx-auto animate-fade-in-up">
            <Users className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-heading font-bold text-lg text-foreground">No events found</h3>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search filters or check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, index) => {
              const isSoldOut = event.available_tickets === 0;
              const fillPercentage = Math.round((event.booked_tickets / event.total_capacity) * 100);
              const delay = `${0.1 * (index % 6)}s`;

              return (
                <Card
                  key={event.id}
                  className="glass-card flex flex-col overflow-hidden hover:shadow-[0_0_25px_rgba(var(--primary),0.15)] hover:border-primary/30 transition-all duration-300 group hover:-translate-y-2 animate-fade-in-up border-white/10"
                  style={{ animationDelay: delay }}
                >
                  <CardHeader className="space-y-3 pb-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-white/10 bg-white/5 font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })}
                      </Badge>
                      {isSoldOut ? (
                        <Badge variant="destructive" className="shadow-[0_0_10px_rgba(var(--destructive),0.4)]">Sold Out</Badge>
                      ) : event.available_tickets < 10 ? (
                        <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30">
                          Only {event.available_tickets} left!
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                          Available
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="font-heading line-clamp-2 text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-5">
                    <CardDescription className="text-sm text-muted-foreground/80 font-light">
                      Join us for a wonderful experience. Secure your place now to avoid disappointment.
                    </CardDescription>

                    {/* Progress details */}
                    <div className="space-y-2 p-3 bg-black/20 rounded-xl border border-white/5">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>Booked: {event.booked_tickets}/{event.total_capacity}</span>
                        <span className="text-primary">{fillPercentage}% Full</span>
                      </div>
                      <Progress value={fillPercentage} className="h-2 bg-white/5" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 pb-5 px-6">
                    <Button
                      asChild
                      className={`w-full group/btn relative overflow-hidden h-12 rounded-xl text-md font-bold transition-all duration-300 ${
                        isSoldOut 
                          ? "bg-white/5 text-muted-foreground border border-white/10 cursor-not-allowed hover:bg-white/5"
                          : "shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)]"
                      }`}
                      variant={isSoldOut ? "outline" : "default"}
                    >
                      {isSoldOut ? (
                        <span className="flex items-center justify-center">Sold Out</span>
                      ) : (
                        <Link href={`/events/${event.id}/book`} className="flex items-center justify-center gap-2 w-full h-full">
                          Book Now
                          <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-black/20 backdrop-blur-md z-10 mt-auto">
        <div className="container mx-auto max-w-7xl px-4 md:px-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TicketFlow Booking Modules. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
