"use client";

import { useEffect, useState } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent, Event } from "@/lib/api";
import { Calendar, Plus, Ticket, Users, TrendingUp, AlertCircle, MoreHorizontal, Edit, Trash, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Zod Validation Schema
const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date."),
  total_capacity: z.number().int().min(1, "Capacity must be at least 1."),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventsDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      date: "",
      total_capacity: 100,
    },
  });

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load events. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Set form values when editing
  useEffect(() => {
    if (editingEvent) {
      form.reset({
        title: editingEvent.title,
        date: editingEvent.date,
        total_capacity: editingEvent.total_capacity,
      });
    } else {
      form.reset({
        title: "",
        date: "",
        total_capacity: 100,
      });
    }
  }, [editingEvent, form]);

  const onSubmit = async (values: EventFormValues) => {
    try {
      if (editingEvent) {
        // Update Event
        await updateEvent(editingEvent.id, values);
        toast.success("Event updated successfully!");
      } else {
        // Create Event
        await createEvent(values);
        toast.success("Event created successfully!");
      }
      setDialogOpen(false);
      setEditingEvent(null);
      fetchAllEvents();
    } catch (error: any) {
      const apiMsg = error.response?.data?.message || "Something went wrong.";
      toast.error(apiMsg);
    }
  };

  const openDeleteConfirm = (id: number) => {
    setDeletingEventId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingEventId) return;
    try {
      setDeleting(true);
      await deleteEvent(deletingEventId);
      toast.success("Event deleted successfully.");
      fetchAllEvents();
    } catch (error) {
      toast.error("Failed to delete event.");
    } finally {
      setDeleting(false);
      setConfirmDeleteOpen(false);
      setDeletingEventId(null);
    }
  };

  // Stats computation
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, e) => sum + e.total_capacity, 0);
  const totalBooked = events.reduce((sum, e) => sum + e.booked_tickets, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  const eventToDelete = events.find((e) => e.id === deletingEventId);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={(open) => { if (!open && !deleting) { setConfirmDeleteOpen(false); setDeletingEventId(null); } }}>
        <DialogContent className="sm:max-w-[400px] bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-red-400 flex items-center gap-2">
              <Trash className="h-5 w-5" /> Delete Event
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">&ldquo;{eventToDelete?.title}&rdquo;</span>?
              This will permanently remove the event and <strong>all its bookings</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 gap-3">
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5"
              onClick={() => { setConfirmDeleteOpen(false); setDeletingEventId(null); }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-500 text-white gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all"
            >
              {deleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</> : <><Trash className="h-4 w-4" /> Yes, Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-gradient">Events Dashboard</h1>
          <p className="text-muted-foreground font-light">Manage and track your ticketing capacity.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl h-12 px-6">
              <Plus className="h-5 w-5" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
              <DialogDescription>
                Fill in the event details below. Click save to publish changes.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Summer Concert" className="bg-black/20 border-white/10 focus-visible:ring-primary h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Event Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-black/20 border-white/10 focus-visible:ring-primary h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Total Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="bg-black/20 border-white/10 focus-visible:ring-primary h-12"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Total seats or tickets available for booking.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="shadow-[0_0_15px_rgba(var(--primary),0.3)]">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
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
            <p className="text-xs text-muted-foreground mt-1">Upcoming & active events</p>
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
            <div className="text-3xl font-heading font-black text-emerald-400">{loading ? "..." : totalBooked}</div>
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
            <div className="text-3xl font-heading font-black">{loading ? "..." : `${overallOccupancy}%`}</div>
            <Progress value={overallOccupancy} className="h-2 mt-3 bg-white/5" />
          </CardContent>
        </Card>
      </div>

      {/* Events Table Section */}
      <Card className="glass-card border-white/10 overflow-hidden">
        <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
          <CardTitle className="font-heading text-xl">All Events</CardTitle>
          <CardDescription>View, edit, and delete scheduled events.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 animate-pulse">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Fetching active events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
              <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-lg">No events found. Create one to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="pl-6 font-semibold text-muted-foreground h-12">Title</TableHead>
                  <TableHead className="font-semibold text-muted-foreground h-12">Date</TableHead>
                  <TableHead className="text-center font-semibold text-muted-foreground h-12">Total Capacity</TableHead>
                  <TableHead className="text-center font-semibold text-muted-foreground h-12">Booked</TableHead>
                  <TableHead className="text-center font-semibold text-muted-foreground h-12">Available</TableHead>
                  <TableHead className="w-[200px] font-semibold text-muted-foreground h-12">Occupancy Rate</TableHead>
                  <TableHead className="text-right pr-6 font-semibold text-muted-foreground h-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const percentBooked = Math.round((event.booked_tickets / event.total_capacity) * 100);
                  const isSoldOut = event.available_tickets === 0;

                  return (
                    <TableRow key={event.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-semibold pl-6">{event.title}</TableCell>
                      <TableCell className="text-muted-foreground">{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</TableCell>
                      <TableCell className="text-center">{event.total_capacity}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{event.booked_tickets}</TableCell>
                      <TableCell className="text-center">
                        {isSoldOut ? (
                          <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30">Sold Out</Badge>
                        ) : (
                          <span className="font-semibold">{event.available_tickets}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={percentBooked} className="h-2 w-24 bg-white/5" />
                          <span className="text-xs font-semibold text-muted-foreground">{percentBooked}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px] bg-card/95 backdrop-blur-xl border-white/10">
                            <DropdownMenuLabel className="text-xs text-muted-foreground">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10">
                              <Link href={`/admin/events/${event.id}/bookings`} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4 text-primary" /> View Bookings
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditingEvent(event);
                              setDialogOpen(true);
                            }} className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                              <Edit className="mr-2 h-4 w-4" /> Edit Event
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem onClick={() => openDeleteConfirm(event.id)} className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer">
                              <Trash className="mr-2 h-4 w-4" /> Delete Event
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
