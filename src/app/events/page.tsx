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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background flex flex-col">
      {/* Premium Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/events" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
              <Ticket className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-primary/75 bg-clip-text text-transparent">
              TicketFlow
            </span>
          </Link>
          <Button asChild variant="outline" className="gap-2 border-primary/20 hover:border-primary transition-all duration-300">
            <Link href="/admin/events">
              <ShieldCheck className="h-4 w-4 text-primary" /> Admin Portal
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-4xl px-4 space-y-4">
          <Badge className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none font-medium">
            Live Ticket Bookings
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Book Tickets for <span className="bg-gradient-to-r from-primary via-primary/80 to-indigo-600 bg-clip-text text-transparent">Popular Events</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Secure, reliable booking for concerts, conferences, art showcases, and charity drives. Get yours before they sell out.
          </p>

          {/* Search bar widget */}
          <div className="max-w-md mx-auto pt-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 h-12 shadow-sm rounded-xl border-primary/10 focus-visible:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Feed */}
      <main className="container mx-auto max-w-7xl px-4 md:px-8 pb-16 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium">Discovering latest events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 border border-dashed rounded-2xl p-8 bg-card/50">
            <Users className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="font-bold text-lg">No events found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search filters or check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const isSoldOut = event.available_tickets === 0;
              const fillPercentage = Math.round((event.booked_tickets / event.total_capacity) * 100);

              return (
                <Card
                  key={event.id}
                  className="flex flex-col overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 group hover:-translate-y-1 bg-card/60 backdrop-blur-sm"
                >
                  <CardHeader className="space-y-2 pb-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-muted-foreground/20 font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          dateStyle: "medium",
                        })}
                      </Badge>
                      {isSoldOut ? (
                        <Badge variant="destructive">Sold Out</Badge>
                      ) : event.available_tickets < 10 ? (
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none">
                          Only {event.available_tickets} left!
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                          Available
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-xl font-bold group-hover:text-primary transition-colors duration-200">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <CardDescription className="text-sm">
                      Join us for a wonderful experience. Secure your place now to avoid disappointment.
                    </CardDescription>

                    {/* Progress details */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>Booked: {event.booked_tickets}/{event.total_capacity}</span>
                        <span>{fillPercentage}% Capacity</span>
                      </div>
                      <Progress value={fillPercentage} className="h-1.5" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t bg-muted/20">
                    <Button
                      asChild
                      className="w-full group/btn relative overflow-hidden"
                      disabled={isSoldOut}
                      variant={isSoldOut ? "secondary" : "default"}
                    >
                      {isSoldOut ? (
                        <span>Sold Out</span>
                      ) : (
                        <Link href={`/events/${event.id}/book`} className="flex items-center justify-center gap-2">
                          Book Now
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
      <footer className="border-t py-8 bg-card/50">
        <div className="container mx-auto max-w-7xl px-4 md:px-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TicketFlow Booking Modules. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
