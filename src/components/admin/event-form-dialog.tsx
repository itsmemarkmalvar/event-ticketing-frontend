"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createEvent, updateEvent, Event } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date."),
  total_capacity: z.number().int().min(1, "Capacity must be at least 1."),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEvent: Event | null;
  onSuccess: () => void;
}

export function EventFormDialog({
  open,
  onOpenChange,
  editingEvent,
  onSuccess,
}: EventFormDialogProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      date: "",
      total_capacity: 100,
    },
  });

  // Sync form values when editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      form.reset({
        title: editingEvent.title,
        date: editingEvent.date,
        total_capacity: editingEvent.total_capacity,
      });
    } else {
      form.reset({ title: "", date: "", total_capacity: 100 });
    }
  }, [editingEvent, form]);

  const onSubmit = async (values: EventFormValues) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, values);
        toast.success("Event updated successfully!");
      } else {
        await createEvent(values);
        toast.success("Event created successfully!");
      }
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      const apiMsg = error.response?.data?.message || "Something went wrong.";
      toast.error(apiMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {editingEvent ? "Edit Event" : "Create Event"}
          </DialogTitle>
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
                    <Input
                      placeholder="e.g., Summer Concert"
                      className="bg-black/20 border-white/10 focus-visible:ring-primary h-12"
                      {...field}
                    />
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
                    <Input
                      type="date"
                      className="bg-black/20 border-white/10 focus-visible:ring-primary h-12"
                      {...field}
                    />
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
              <Button
                type="button"
                variant="outline"
                className="border-white/10 hover:bg-white/5"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="shadow-[0_0_15px_rgba(var(--primary),0.3)]"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
