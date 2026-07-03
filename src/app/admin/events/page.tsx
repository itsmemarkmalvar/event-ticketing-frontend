"use client";

import { useEffect, useState } from "react";
import { getEvents, deleteEvent, Event } from "@/lib/api";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EventsStatsCards } from "@/components/admin/events-stats-cards";
import { EventsTable } from "@/components/admin/events-table";
import { EventFormDialog } from "@/components/admin/event-form-dialog";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export default function EventsDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleFormDialogOpenChange = (open: boolean) => {
    setFormDialogOpen(open);
    if (!open) setEditingEvent(null);
  };

  const handleEditRequest = (event: Event) => {
    setEditingEvent(event);
    setFormDialogOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
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
    } catch {
      toast.error("Failed to delete event.");
    } finally {
      setDeleting(false);
      setConfirmDeleteOpen(false);
      setDeletingEventId(null);
    }
  };

  // Derived stats
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, e) => sum + e.total_capacity, 0);
  const totalBooked = events.reduce((sum, e) => sum + e.booked_tickets, 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
  const eventToDelete = events.find((e) => e.id === deletingEventId);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Dialogs */}
      <EventFormDialog
        open={formDialogOpen}
        onOpenChange={handleFormDialogOpenChange}
        editingEvent={editingEvent}
        onSuccess={fetchAllEvents}
      />
      <DeleteConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={(open) => { if (!open && !deleting) { setConfirmDeleteOpen(false); setDeletingEventId(null); } }}
        eventTitle={eventToDelete?.title}
        isDeleting={deleting}
        onConfirm={handleConfirmDelete}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-gradient">
            Events Dashboard
          </h1>
          <p className="text-muted-foreground font-light">Manage and track your ticketing capacity.</p>
        </div>
        <Button
          onClick={() => setFormDialogOpen(true)}
          className="gap-2 shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl h-12 px-6"
        >
          <Plus className="h-5 w-5" /> Create Event
        </Button>
      </div>

      {/* Analytics */}
      <EventsStatsCards
        loading={loading}
        totalEvents={totalEvents}
        totalCapacity={totalCapacity}
        totalBooked={totalBooked}
        overallOccupancy={overallOccupancy}
      />

      {/* Events Table */}
      <EventsTable
        events={events}
        loading={loading}
        onEdit={handleEditRequest}
        onDeleteRequest={handleDeleteRequest}
      />
    </div>
  );
}
