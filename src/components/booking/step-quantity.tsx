import { ArrowRight, Ticket } from "lucide-react";
import { Event } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StepQuantityProps {
  event: Event;
  ticketQuantity: number;
  onQuantityChange: (qty: number) => void;
  onNext: () => void;
}

export function StepQuantity({ event, ticketQuantity, onQuantityChange, onNext }: StepQuantityProps) {
  const isSoldOut = event.available_tickets === 0;

  return (
    <Card className="glass-card border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="font-heading text-2xl">Select Tickets</CardTitle>
        <CardDescription className="text-base">
          How many tickets would you like to purchase?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center justify-center gap-8 py-8 bg-black/20 rounded-2xl border border-white/5">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full font-bold text-xl border-white/10 hover:bg-white/10 hover:text-foreground transition-all"
            disabled={ticketQuantity <= 1}
            onClick={() => onQuantityChange(ticketQuantity - 1)}
          >
            -
          </Button>
          <div className="text-center w-24">
            <span className="text-5xl font-heading font-black text-foreground">{ticketQuantity}</span>
            <p className="text-sm text-primary font-semibold tracking-wide mt-1">
              TICKET{ticketQuantity > 1 ? "S" : ""}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full font-bold text-xl border-white/10 hover:bg-white/10 hover:text-foreground transition-all"
            disabled={ticketQuantity >= event.available_tickets}
            onClick={() => onQuantityChange(ticketQuantity + 1)}
          >
            +
          </Button>
        </div>

        <div className="flex justify-between items-center text-sm p-4 border border-primary/20 bg-primary/5 rounded-xl text-primary shadow-[inset_0_0_20px_rgba(var(--primary),0.05)]">
          <span className="font-medium flex items-center gap-2">
            <Ticket className="h-5 w-5" /> Remaining Availability:
          </span>
          <span className="font-bold text-base">{event.available_tickets} seats left</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-white/5 pt-6 bg-black/10">
        <span className="text-xs text-muted-foreground/70 hidden sm:inline-block">
          Maximum booking depends on availability
        </span>
        <Button
          onClick={onNext}
          disabled={isSoldOut}
          className="gap-2 h-12 px-8 rounded-xl font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] hover:scale-105 transition-all w-full sm:w-auto ml-auto"
        >
          Continue <ArrowRight className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
