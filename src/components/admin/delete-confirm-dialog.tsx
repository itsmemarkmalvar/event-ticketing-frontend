"use client";

import { Loader2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string | undefined;
  isDeleting: boolean;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  eventTitle,
  isDeleting,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!isDeleting) onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-red-400 flex items-center gap-2">
            <Trash className="h-5 w-5" /> Delete Event
          </DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">&ldquo;{eventTitle}&rdquo;</span>?
            This will permanently remove the event and{" "}
            <strong>all its bookings</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4 gap-3">
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-500 text-white gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              <>
                <Trash className="h-4 w-4" /> Yes, Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
