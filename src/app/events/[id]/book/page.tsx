"use client";

import { useEffect, useState, use } from "react";
import { getEvent, createBooking, Event } from "@/lib/api";
import { ArrowLeft, ArrowRight, Check, CreditCard, Mail, User, Ticket, Loader2, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface BookWizardProps {
  params: Promise<{ id: string }>;
}

export default function BookingWizardPage({ params }: BookWizardProps) {
  const { id } = use(params);
  const eventId = parseInt(id, 10);
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoadingEvent(true);
        const data = await getEvent(eventId);
        setEvent(data);
      } catch (error) {
        toast.error("Failed to load event details.");
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const validateStep1 = () => {
    if (!event) return false;
    if (ticketQuantity < 1) {
      toast.error("Please select at least 1 ticket.");
      return false;
    }
    if (ticketQuantity > event.available_tickets) {
      toast.error(`Only ${event.available_tickets} tickets available.`);
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.name = "Full name is required.";
    }
    if (!customerEmail.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitBooking = async () => {
    try {
      setSubmitting(true);
      // Call booking API
      await createBooking({
        event_id: eventId,
        customer_name: customerName,
        customer_email: customerEmail,
        ticket_quantity: ticketQuantity,
      });

      // Show mock payment step (Step 4)
      setStep(4);
      toast.success("Booking placed successfully!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Oversold or error occurred. Please try again.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium text-lg">Preparing ticket booking wizard...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass-card max-w-md w-full p-8 text-center space-y-6 rounded-3xl animate-fade-in-up">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground">Event Not Found</h2>
            <p className="text-muted-foreground mt-2">The event you are attempting to book tickets for does not exist or has been cancelled.</p>
          </div>
          <Button asChild className="w-full h-12 rounded-xl">
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isSoldOut = event.available_tickets === 0;
  const progressValue = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 py-12 relative">
      {/* Dynamic Background */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-2xl space-y-8 z-10">
        <div className="space-y-3 animate-fade-in-up">
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel & Return
          </Link>
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-gradient line-clamp-2">{event.title}</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2 font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            {new Date(event.date).toLocaleDateString("en-US", { dateStyle: "full" })}
          </p>
        </div>

        {/* Step Indicator Progress */}
        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            <span className={`transition-colors duration-300 ${step >= 1 ? "text-primary" : ""}`}>1. Quantity</span>
            <span className={`transition-colors duration-300 ${step >= 2 ? "text-primary" : ""}`}>2. Details</span>
            <span className={`transition-colors duration-300 ${step >= 3 ? "text-primary" : ""}`}>3. Pay</span>
            <span className={`transition-colors duration-300 ${step >= 4 ? "text-emerald-400" : ""}`}>4. Done</span>
          </div>
          <Progress value={progressValue} className="h-2 bg-white/5" indicatorClassName={step === 4 ? "bg-emerald-500" : "bg-primary"} />
        </div>

        {/* Step Cards */}
        {step === 1 && (
          <Card className="glass-card border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="pb-6">
              <CardTitle className="font-heading text-2xl">Select Tickets</CardTitle>
              <CardDescription className="text-base">How many tickets would you like to purchase?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-center gap-8 py-8 bg-black/20 rounded-2xl border border-white/5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full font-bold text-xl border-white/10 hover:bg-white/10 hover:text-foreground transition-all"
                  disabled={ticketQuantity <= 1}
                  onClick={() => setTicketQuantity(ticketQuantity - 1)}
                >
                  -
                </Button>
                <div className="text-center w-24">
                  <span className="text-5xl font-heading font-black text-foreground">{ticketQuantity}</span>
                  <p className="text-sm text-primary font-semibold tracking-wide mt-1">TICKET{ticketQuantity > 1 ? "S" : ""}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full font-bold text-xl border-white/10 hover:bg-white/10 hover:text-foreground transition-all"
                  disabled={ticketQuantity >= event.available_tickets}
                  onClick={() => setTicketQuantity(ticketQuantity + 1)}
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
              <span className="text-xs text-muted-foreground/70 hidden sm:inline-block">Maximum booking depends on availability</span>
              <Button onClick={handleNextStep} disabled={isSoldOut} className="gap-2 h-12 px-8 rounded-xl font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] hover:scale-105 transition-all w-full sm:w-auto ml-auto">
                Continue <ArrowRight className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="glass-card border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="pb-6">
              <CardTitle className="font-heading text-2xl">Contact Information</CardTitle>
              <CardDescription className="text-base">Enter the primary contact person details for the tickets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold text-muted-foreground">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    placeholder="e.g., Sarah Parker"
                    className="pl-12 h-14 bg-black/20 border-white/10 rounded-xl focus-visible:ring-primary shadow-inner text-base"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                {errors.name && <p className="text-sm text-destructive font-medium pl-1">{errors.name}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., sarah@example.com"
                    className="pl-12 h-14 bg-black/20 border-white/10 rounded-xl focus-visible:ring-primary shadow-inner text-base"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive font-medium pl-1">{errors.email}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-white/5 pt-6 bg-black/10 gap-4">
              <Button variant="outline" onClick={handlePrevStep} className="h-12 rounded-xl border-white/10 hover:bg-white/5">
                Back
              </Button>
              <Button onClick={handleNextStep} className="gap-2 h-12 px-8 rounded-xl font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] hover:scale-105 transition-all">
                Review Order <ArrowRight className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="glass-card border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.1)] animate-in fade-in slide-in-from-right-4 duration-500">
            <CardHeader className="pb-6">
              <CardTitle className="font-heading text-2xl text-primary">Review & Checkout</CardTitle>
              <CardDescription className="text-base">Please verify your booking details before finalizing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden bg-black/30 shadow-inner">
                <div className="p-5 bg-white/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Selected Event</span>
                  <span className="font-bold text-base text-foreground line-clamp-1 text-right">{event.title}</span>
                </div>
                <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Tickets Reserved</span>
                  <span className="font-bold text-lg text-primary flex items-center gap-2">
                    <Ticket className="h-5 w-5" /> {ticketQuantity} Ticket{ticketQuantity > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Ticket Holder</span>
                  <span className="font-bold text-base">{customerName}</span>
                </div>
                <div className="p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Delivery Email</span>
                  <span className="font-mono text-sm text-muted-foreground">{customerEmail}</span>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 text-sm flex gap-3 shadow-inner">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>
                  <strong className="font-bold tracking-wide">Note:</strong> Double bookings are strictly monitored. Your seats will be confirmed once payment is simulated below.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-white/5 pt-6 bg-black/10 gap-4">
              <Button variant="outline" onClick={handlePrevStep} disabled={submitting} className="h-14 px-6 rounded-xl border-white/10 hover:bg-white/5">
                Back
              </Button>
              <Button onClick={handleSubmitBooking} disabled={submitting} className="gap-2 h-14 px-8 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] bg-emerald-600 hover:bg-emerald-500 text-white transition-all w-full sm:w-auto flex-1 sm:flex-none">
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Verifying Order...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" /> Pay & Confirm
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <Card className="shadow-[0_0_50px_rgba(16,185,129,0.15)] border border-emerald-500/30 bg-card overflow-hidden animate-in zoom-in-95 duration-500 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <CardHeader className="text-center py-10 relative z-10">
              <div className="mx-auto h-20 w-20 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Check className="h-10 w-10 stroke-[3]" />
              </div>
              <CardTitle className="text-3xl font-heading font-black text-emerald-400 drop-shadow-md">Booking Confirmed!</CardTitle>
              <CardDescription className="text-base text-muted-foreground mt-2">
                Payment Mock Simulation Completed Successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 px-6 sm:px-10 relative z-10">
              <div className="p-6 rounded-2xl bg-black/30 border border-emerald-500/20 text-sm space-y-4 shadow-inner">
                <h4 className="font-heading font-bold text-emerald-400 uppercase tracking-widest text-xs mb-4">Receipt Summary</h4>
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
                  <span className="font-bold text-emerald-400 text-lg">{ticketQuantity} Seat{ticketQuantity > 1 ? "s" : ""}</span>
                </div>
              </div>

              <p className="text-sm text-center text-muted-foreground/80 font-light max-w-md mx-auto">
                Your tickets have been sent to your email. Show your digital receipt at the gate entry.
              </p>
            </CardContent>
            <CardFooter className="p-6 sm:px-10 pb-10 relative z-10">
              <Button asChild className="w-full h-12 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-foreground border border-white/10">
                <Link href="/events">Back to Events</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
