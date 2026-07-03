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
      <div className="min-h-screen bg-muted/10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Preparing ticket booking wizard...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-muted/10 flex items-center justify-center">
        <div className="max-w-md w-full p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Event Not Found</h2>
          <p className="text-muted-foreground">The event you are attempting to book tickets for does not exist or has been cancelled.</p>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isSoldOut = event.available_tickets === 0;
  const progressValue = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="space-y-2">
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel & Return
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{event.title}</h1>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <Calendar className="h-4 w-4 text-primary" />
            {new Date(event.date).toLocaleDateString("en-US", { dateStyle: "full" })}
          </p>
        </div>

        {/* Step Indicator Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span className={step >= 1 ? "text-primary" : ""}>1. Quantity</span>
            <span className={step >= 2 ? "text-primary" : ""}>2. Details</span>
            <span className={step >= 3 ? "text-primary" : ""}>3. Pay & Confirm</span>
            <span className={step >= 4 ? "text-primary" : ""}>4. Done</span>
          </div>
          <Progress value={progressValue} className="h-1.5 transition-all duration-300" />
        </div>

        {/* Step Cards */}
        {step === 1 && (
          <Card className="shadow-lg animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle>Select Tickets</CardTitle>
              <CardDescription>How many tickets would you like to purchase?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center gap-6 py-6 bg-muted/30 rounded-xl border">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full font-bold text-lg"
                  disabled={ticketQuantity <= 1}
                  onClick={() => setTicketQuantity(ticketQuantity - 1)}
                >
                  -
                </Button>
                <div className="text-center w-16">
                  <span className="text-3xl font-black">{ticketQuantity}</span>
                  <p className="text-xs text-muted-foreground font-semibold">ticket{ticketQuantity > 1 ? "s" : ""}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full font-bold text-lg"
                  disabled={ticketQuantity >= event.available_tickets}
                  onClick={() => setTicketQuantity(ticketQuantity + 1)}
                >
                  +
                </Button>
              </div>

              <div className="flex justify-between items-center text-sm p-3 border border-primary/10 bg-primary/5 rounded-lg text-primary">
                <span className="font-medium flex items-center gap-1.5">
                  <Ticket className="h-4 w-4" /> Remaining Availability:
                </span>
                <span className="font-bold">{event.available_tickets} seats left</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground">Maximum booking depends on availability</span>
              <Button onClick={handleNextStep} disabled={isSoldOut} className="gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg animate-in fade-in duration-300">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Enter the primary contact person details for tickets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="e.g., Sarah Parker"
                    className="pl-10"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., sarah@example.com"
                    className="pl-10"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="ghost" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleNextStep} className="gap-2">
                Review Order <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="shadow-lg animate-in fade-in duration-300 border-primary/20">
            <CardHeader>
              <CardTitle>Review & Checkout</CardTitle>
              <CardDescription>Please check your booking specification before finalizing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="divide-y border rounded-xl overflow-hidden bg-card">
                <div className="p-4 bg-muted/20 flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground text-sm">Selected Event</span>
                  <span className="font-bold text-sm text-right max-w-[200px] line-clamp-1">{event.title}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground text-sm">Tickets Reserved</span>
                  <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                    <Ticket className="h-4 w-4" /> {ticketQuantity} Ticket{ticketQuantity > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground text-sm">Ticket Holder</span>
                  <span className="font-bold text-sm">{customerName}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground text-sm">Delivery Email</span>
                  <span className="font-mono text-xs text-muted-foreground">{customerEmail}</span>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-xs flex gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-yellow-600" />
                <p>
                  <strong>Note:</strong> Double bookings are strictly monitored. Your seats will be confirmed once payment is mock-simulated below.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="ghost" onClick={handlePrevStep} disabled={submitting}>
                Back
              </Button>
              <Button onClick={handleSubmitBooking} disabled={submitting} className="gap-2 shadow-lg bg-emerald-600 hover:bg-emerald-700">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying Order...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> Pay & Confirm
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <Card className="shadow-2xl border-emerald-500/20 bg-card overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="h-2 bg-emerald-500" />
            <CardHeader className="text-center py-8">
              <div className="mx-auto h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <CardTitle className="text-2xl font-black text-emerald-800">Booking Confirmed!</CardTitle>
              <CardDescription className="text-emerald-600 font-medium">
                Payment Mock Simulation Completed Successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-8">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 text-sm space-y-3">
                <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-xs">Receipt Summary</h4>
                <div className="flex justify-between border-b border-emerald-100/50 pb-2">
                  <span className="text-muted-foreground">Guest:</span>
                  <span className="font-bold text-emerald-950">{customerName}</span>
                </div>
                <div className="flex justify-between border-b border-emerald-100/50 pb-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-mono text-xs text-emerald-950">{customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Allocated:</span>
                  <span className="font-bold text-primary">{ticketQuantity} Seat{ticketQuantity > 1 ? "s" : ""}</span>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Your tickets have been sent to your email. Show your digital receipt at the gate entry.
              </p>
            </CardContent>
            <CardFooter className="p-6 bg-muted/10 border-t flex flex-col md:flex-row gap-3">
              <Button asChild className="w-full">
                <Link href="/events">Back to Events</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/events">Manage Bookings (Admin)</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
