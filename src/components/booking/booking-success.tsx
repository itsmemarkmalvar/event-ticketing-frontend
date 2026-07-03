import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingSuccessProps {
  customerName: string;
  customerEmail: string;
  ticketQuantity: number;
}

export function BookingSuccess({ customerName, customerEmail, ticketQuantity }: BookingSuccessProps) {
  return (
    <Card className="shadow-[0_0_50px_rgba(16,185,129,0.15)] border border-emerald-500/30 bg-card overflow-hidden animate-in zoom-in-95 duration-500 rounded-3xl relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="text-center py-10 relative z-10">
        <div className="mx-auto h-20 w-20 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <Check className="h-10 w-10 stroke-[3]" />
        </div>
        <CardTitle className="text-3xl font-heading font-black text-emerald-400 drop-shadow-md">
          Booking Confirmed!
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-2">
          Payment Mock Simulation Completed Successfully
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8 px-6 sm:px-10 relative z-10">
        <div className="p-6 rounded-2xl bg-black/30 border border-emerald-500/20 text-sm space-y-4 shadow-inner">
          <h4 className="font-heading font-bold text-emerald-400 uppercase tracking-widest text-xs mb-4">
            Receipt Summary
          </h4>
          <div className="flex justify-between border-b border-white/5 pb-3">
            <span className="text-muted-foreground font-medium">Guest:</span>
            <span className="font-bold text-foreground text-right">{customerName}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-3">
            <span className="text-muted-foreground font-medium">Email:</span>
            <span className="font-mono text-sm text-foreground text-right">{customerEmail}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-muted-foreground font-medium">Allocated:</span>
            <span className="font-bold text-emerald-400 text-lg">
              {ticketQuantity} Seat{ticketQuantity > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground/80 font-light max-w-md mx-auto">
          Your tickets have been sent to your email. Show your digital receipt at the gate entry.
        </p>
      </CardContent>

      <CardFooter className="p-6 sm:px-10 pb-10 relative z-10">
        <Button
          asChild
          className="w-full h-12 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-foreground border border-white/10"
        >
          <Link href="/events">Back to Events</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
