import { AlertCircle, CreditCard, Loader2, Ticket } from "lucide-react";
import { Event } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StepReviewProps {
  event: Event;
  ticketQuantity: number;
  customerName: string;
  customerEmail: string;
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function StepReview({
  event,
  ticketQuantity,
  customerName,
  customerEmail,
  submitting,
  onSubmit,
  onBack,
}: StepReviewProps) {
  return (
    <Card className="glass-card border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.1)] animate-in fade-in slide-in-from-right-4 duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="font-heading text-2xl text-primary">Review &amp; Checkout</CardTitle>
        <CardDescription className="text-base">
          Please verify your booking details before finalizing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-black/30 shadow-inner">
          <div className="p-5 bg-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
              Selected Event
            </span>
            <span className="font-bold text-base text-foreground line-clamp-1 text-right">
              {event.title}
            </span>
          </div>
          <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
              Tickets Reserved
            </span>
            <span className="font-bold text-lg text-primary flex items-center gap-2">
              <Ticket className="h-5 w-5" /> {ticketQuantity} Ticket{ticketQuantity > 1 ? "s" : ""}
            </span>
          </div>
          <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
              Ticket Holder
            </span>
            <span className="font-bold text-base">{customerName}</span>
          </div>
          <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
              Delivery Email
            </span>
            <span className="font-mono text-sm text-muted-foreground">{customerEmail}</span>
          </div>
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 text-sm flex gap-3 shadow-inner">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>
            <strong className="font-bold tracking-wide">Note:</strong> Double bookings are strictly
            monitored. Your seats will be confirmed once payment is simulated below.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-white/5 pt-6 bg-black/10 gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          className="h-14 px-6 rounded-xl border-white/10 hover:bg-white/5"
        >
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="gap-2 h-14 px-8 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] bg-emerald-600 hover:bg-emerald-500 text-white transition-all w-full sm:w-auto flex-1 sm:flex-none"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Verifying Order...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" /> Pay &amp; Confirm
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
