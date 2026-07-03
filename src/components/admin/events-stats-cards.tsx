"use client";

import { Calendar, Users, Ticket, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EventsStatsCardsProps {
  loading: boolean;
  totalEvents: number;
  totalCapacity: number;
  totalBooked: number;
  overallOccupancy: number;
}

export function EventsStatsCards({
  loading,
  totalEvents,
  totalCapacity,
  totalBooked,
  overallOccupancy,
}: EventsStatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="glass-card hover:-translate-y-1 transition-all duration-300 border-white/10 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Calendar className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-heading font-black">{loading ? "..." : totalEvents}</div>
          <p className="text-xs text-muted-foreground mt-1">Upcoming &amp; active events</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:-translate-y-1 transition-all duration-300 border-white/10 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-heading font-black">{loading ? "..." : totalCapacity}</div>
          <p className="text-xs text-muted-foreground mt-1">Available tickets configured</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:-translate-y-1 transition-all duration-300 border-white/10 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">Tickets Booked</CardTitle>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Ticket className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-heading font-black text-emerald-400">
            {loading ? "..." : totalBooked}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Across all bookings</p>
        </CardContent>
      </Card>

      <Card className="glass-card hover:-translate-y-1 transition-all duration-300 border-white/10 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">Overall Occupancy</CardTitle>
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-3xl font-heading font-black">
            {loading ? "..." : `${overallOccupancy}%`}
          </div>
          <Progress value={overallOccupancy} className="h-2 mt-3 bg-white/5" />
        </CardContent>
      </Card>
    </div>
  );
}
