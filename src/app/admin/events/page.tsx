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

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this event? This will delete all its bookings.")) {
      try {
        await deleteEvent(id);
        toast.success("Event deleted successfully.");
        fetchAllEvents();
      } catch (error) {
        toast.error("Failed to delete event.");
      }
    }
  };

  // Stats computation
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, e) => sum + e.total_capacity, 0);
  const totalBooked = events.reduce((sum, e) => sum + e.booked_tickets, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Events</h1>
          <p className="text-muted-foreground">Manage and track your ticketing capacity.</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <Plus className="h-4 w-4" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
              <DialogDescription>
                Fill in the event details below. Click save to publish changes.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Summer Concert" {...field} />
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
                      <FormLabel>Event Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                      <FormLabel>Total Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormDescription>
                        Total seats or tickets available for booking.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:border-primary/30 transition-colors duration-300 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalEvents}</div>
            <p className="text-xs text-muted-foreground">Upcoming & active events</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-colors duration-300 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalCapacity}</div>
            <p className="text-xs text-muted-foreground">Available tickets configured</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-colors duration-300 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Booked</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalBooked}</div>
            <p className="text-xs text-muted-foreground">Across all bookings</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-colors duration-300 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Occupancy</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : `${overallOccupancy}%`}</div>
            <Progress value={overallOccupancy} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Events Table Section */}
      <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
        <CardHeader className="bg-card/50">
          <CardTitle>All Events</CardTitle>
          <CardDescription>View, edit, and delete scheduled events.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Fetching active events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p>No events found. Create one to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Total Capacity</TableHead>
                  <TableHead className="text-center">Booked</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="w-[200px]">Booking Capacity Rate</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const percentBooked = Math.round((event.booked_tickets / event.total_capacity) * 100);
                  const isSoldOut = event.available_tickets === 0;

                  return (
                    <TableRow key={event.id} className="hover:bg-accent/30 group">
                      <TableCell className="font-semibold pl-6">{event.title}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}</TableCell>
                      <TableCell className="text-center">{event.total_capacity}</TableCell>
                      <TableCell className="text-center font-medium text-primary">{event.booked_tickets}</TableCell>
                      <TableCell className="text-center">
                        {isSoldOut ? (
                          <Badge variant="destructive">Sold Out</Badge>
                        ) : (
                          <span className="font-semibold">{event.available_tickets}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={percentBooked} className="h-2 w-24" />
                          <span className="text-xs font-semibold text-muted-foreground">{percentBooked}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}/bookings`} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4 text-primary" /> View Bookings
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setEditingEvent(event);
                              setDialogOpen(true);
                            }} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit Event
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(event.id)} className="text-destructive focus:bg-destructive/10 cursor-pointer">
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
