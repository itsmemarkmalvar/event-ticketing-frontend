import { ArrowRight, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepInfoProps {
  customerName: string;
  customerEmail: string;
  errors: Record<string, string>;
  onChange: (field: "name" | "email", value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepInfo({
  customerName,
  customerEmail,
  errors,
  onChange,
  onNext,
  onBack,
}: StepInfoProps) {
  return (
    <Card className="glass-card border-white/10 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="font-heading text-2xl">Contact Information</CardTitle>
        <CardDescription className="text-base">
          Enter the primary contact person details for the tickets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="name" className="text-sm font-semibold text-muted-foreground">
            Full Name
          </Label>
          <div className="relative group">
            <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="name"
              placeholder="e.g., Sarah Parker"
              className="pl-12 h-14 bg-black/20 border-white/10 rounded-xl focus-visible:ring-primary shadow-inner text-base"
              value={customerName}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          {errors.name && (
            <p className="text-sm text-destructive font-medium pl-1">{errors.name}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="e.g., sarah@example.com"
              className="pl-12 h-14 bg-black/20 border-white/10 rounded-xl focus-visible:ring-primary shadow-inner text-base"
              value={customerEmail}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive font-medium pl-1">{errors.email}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-white/5 pt-6 bg-black/10 gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-12 rounded-xl border-white/10 hover:bg-white/5"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="gap-2 h-12 px-8 rounded-xl font-bold shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_rgba(var(--primary),0.6)] hover:scale-105 transition-all"
        >
          Review Order <ArrowRight className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
