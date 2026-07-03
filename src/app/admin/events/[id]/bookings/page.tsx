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
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="font-medium">Cancelled</Badge>;
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
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/admin/events"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {loading ? "Loading bookings..." : `${event?.title} — Bookings`}
          </h1>
          <p className="text-muted-foreground">
            {loading
              ? "Checking guest details..."
              : `Event Date: ${event ? new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'long' }) : ""}`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="w-fit self-end">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Analytics Widget */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalBookings}</div>
            <p className="text-xs text-muted-foreground">Reservations received</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Tickets Booked</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalTickets}</div>
            <p className="text-xs text-muted-foreground">Seats allocated successfully</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : pendingCount}</div>
            <p className="text-xs text-muted-foreground">Bookings awaiting action</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cancelled Bookings</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : cancelledCount}</div>
            <p className="text-xs text-muted-foreground">Returned to pool</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
        <CardHeader className="bg-card/50">
          <CardTitle>Guest Reservations</CardTitle>
          <CardDescription>Review name, email, seat count, and change booking status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Fetching reservation listings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p>No bookings found for this event.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Guest Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="text-center">Tickets</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked On</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-accent/30">
                    <TableCell className="font-semibold pl-6">{booking.customer_name}</TableCell>
                    <TableCell className="font-mono text-xs">{booking.customer_email}</TableCell>
                    <TableCell className="text-center font-bold text-primary">{booking.ticket_quantity}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(booking.created_at).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={statusLoadingMap[booking.id]}>
                          <Button variant="outline" size="sm" className="gap-2">
                            {statusLoadingMap[booking.id] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Status"
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="cursor-pointer text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                            disabled={booking.status === 'confirmed'}
                          >
                            Mark Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'pending')}
                            className="cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                            disabled={booking.status === 'pending'}
                          >
                            Mark Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-red-50"
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
