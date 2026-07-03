"use client";

import { useEffect, useState, use } from "react";
import { getBookings, updateBookingStatus, getEvent, Event, Booking } from "@/lib/api";
import { ArrowLeft, Ticket, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookingsPageProps {
  params: Promise<{ id: string }>;
}

export default function EventBookingsPage({ params }: BookingsPageProps) {
  const { id } = use(params);
  const eventId = parseInt(id, 10);

  const [event, setEvent] = useState<Event | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoadingMap, setStatusLoadingMap] = useState<Record<number, boolean>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventData, bookingsData] = await Promise.all([
        getEvent(eventId),
        getBookings(eventId),
      ]);
      setEvent(eventData);
      setBookings(bookingsData);
    } catch (error) {
      toast.error("Failed to load booking details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const handleStatusChange = async (bookingId: number, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      setStatusLoadingMap((prev) => ({ ...prev, [bookingId]: true }));
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking status updated to ${status}`);
      // Refresh event details too, because available_tickets/booked_tickets will have changed!
      const [updatedEvent, updatedBookings] = await Promise.all([
        getEvent(eventId),
        getBookings(eventId),
      ]);
      setEvent(updatedEvent);
      setBookings(updatedBookings);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to update booking status.";
      toast.error(errMsg);
    } finally {
      setStatusLoadingMap((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30 font-medium">Cancelled</Badge>;
      default:
        return null;
    }
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const totalTickets = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.ticket_quantity, 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href="/admin/events"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-gradient">
            {loading ? "Loading bookings..." : `${event?.title} — Bookings`}
          </h1>
          <p className="text-muted-foreground font-light">
            {loading
              ? "Checking guest details..."
              : `Event Date: ${event ? new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' }) : ""}`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="w-fit self-end h-10 px-4 rounded-xl border-white/10 hover:bg-white/5 shadow-sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* Analytics Widget */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card hover:-translate-y-1 transition-all duration-300 border-white/10 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Ticket className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-heading font-black">{loading ? "..." : totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Reservations received</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-1 transition-all duration-300 border-white/10 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tickets</CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-heading font-black text-emerald-400">{loading ? "..." : totalTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">Seats allocated successfully</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-1 transition-all duration-300 border-white/10 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-heading font-black text-amber-400">{loading ? "..." : pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Bookings awaiting action</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:-translate-y-1 transition-all duration-300 border-white/10 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <XCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-heading font-black text-red-400">{loading ? "..." : cancelledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Returned to pool</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="glass-card border-white/10 overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
          <CardTitle className="font-heading text-xl">Guest Reservations</CardTitle>
          <CardDescription>Review name, email, seat count, and change booking status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Fetching reservation listings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
              <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg">No bookings found for this event.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="pl-6 font-semibold text-muted-foreground h-12">Guest Name</TableHead>
                  <TableHead className="font-semibold text-muted-foreground h-12">Email Address</TableHead>
                  <TableHead className="text-center font-semibold text-muted-foreground h-12">Tickets</TableHead>
                  <TableHead className="font-semibold text-muted-foreground h-12">Status</TableHead>
                  <TableHead className="font-semibold text-muted-foreground h-12">Booked On</TableHead>
                  <TableHead className="text-right pr-6 font-semibold text-muted-foreground h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-semibold pl-6">{booking.customer_name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{booking.customer_email}</TableCell>
                    <TableCell className="text-center font-bold text-primary">{booking.ticket_quantity}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(booking.created_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={statusLoadingMap[booking.id]}>
                          <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/10 rounded-lg">
                            {statusLoadingMap[booking.id] ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Status"
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-white/10">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="cursor-pointer text-emerald-400 focus:text-emerald-300 focus:bg-emerald-500/20"
                            disabled={booking.status === 'confirmed'}
                          >
                            Mark Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'pending')}
                            className="cursor-pointer text-amber-400 focus:text-amber-300 focus:bg-amber-500/20"
                            disabled={booking.status === 'pending'}
                          >
                            Mark Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/20"
                            disabled={booking.status === 'cancelled'}
                          >
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
