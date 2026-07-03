"use client";

import { useEffect, useState, use } from "react";
import { getEvent, createBooking, Event } from "@/lib/api";
import { ArrowLeft, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepQuantity } from "@/components/booking/step-quantity";
import { StepInfo } from "@/components/booking/step-info";
import { StepReview } from "@/components/booking/step-review";
import { BookingSuccess } from "@/components/booking/booking-success";

interface BookWizardProps {
  params: Promise<{ id: string }>;
}

export default function BookingWizardPage({ params }: BookWizardProps) {
  const { id } = use(params);
  const eventId = parseInt(id, 10);

  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoadingEvent(true);
        const data = await getEvent(eventId);
        setEvent(data);
      } catch {
        toast.error("Failed to load event details.");
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const validateStep1 = (): boolean => {
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

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.name = "Full name is required.";
    if (!customerEmail.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(customerEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFieldChange = (field: "name" | "email", value: string) => {
    if (field === "name") setCustomerName(value);
    else setCustomerEmail(value);
    // Clear error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmitBooking = async () => {
    try {
      setSubmitting(true);
      await createBooking({
        event_id: eventId,
        customer_name: customerName,
        customer_email: customerEmail,
        ticket_quantity: ticketQuantity,
      });
      setStep(4);
      toast.success("Booking placed successfully!");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "An error occurred. Please try again.";
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
          <p className="text-muted-foreground font-medium text-lg">
            Preparing ticket booking wizard...
          </p>
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
            <p className="text-muted-foreground mt-2">
              The event you are attempting to book tickets for does not exist or has been cancelled.
            </p>
          </div>
          <Button asChild className="w-full h-12 rounded-xl">
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const progressValue = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 py-12 relative">
      {/* Background blobs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-2xl space-y-8 z-10">
        {/* Header */}
        <div className="space-y-3 animate-fade-in-up">
          <Link
            href="/events"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md"
          >
            <ArrowLeft className="h-4 w-4" /> Cancel &amp; Return
          </Link>
          <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-gradient line-clamp-2">
            {event.title}
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2 font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            {new Date(event.date).toLocaleDateString("en-US", { dateStyle: "full" })}
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
            <span className={`transition-colors duration-300 ${step >= 1 ? "text-primary" : ""}`}>
              1. Quantity
            </span>
            <span className={`transition-colors duration-300 ${step >= 2 ? "text-primary" : ""}`}>
              2. Details
            </span>
            <span className={`transition-colors duration-300 ${step >= 3 ? "text-primary" : ""}`}>
              3. Pay
            </span>
            <span className={`transition-colors duration-300 ${step >= 4 ? "text-emerald-400" : ""}`}>
              4. Done
            </span>
          </div>
          <Progress
            value={progressValue}
            className="h-2 bg-white/5"
            indicatorClassName={step === 4 ? "bg-emerald-500" : "bg-primary"}
          />
        </div>

        {/* Step Components */}
        {step === 1 && (
          <StepQuantity
            event={event}
            ticketQuantity={ticketQuantity}
            onQuantityChange={setTicketQuantity}
            onNext={handleNextStep}
          />
        )}
        {step === 2 && (
          <StepInfo
            customerName={customerName}
            customerEmail={customerEmail}
            errors={errors}
            onChange={handleFieldChange}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        )}
        {step === 3 && (
          <StepReview
            event={event}
            ticketQuantity={ticketQuantity}
            customerName={customerName}
            customerEmail={customerEmail}
            submitting={submitting}
            onSubmit={handleSubmitBooking}
            onBack={handlePrevStep}
          />
        )}
        {step === 4 && (
          <BookingSuccess
            customerName={customerName}
            customerEmail={customerEmail}
            ticketQuantity={ticketQuantity}
          />
        )}
      </div>
    </div>
  );
}
