import Link from "next/link";
import { ShieldCheck, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/20 border border-primary/50 text-primary p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <Ticket className="h-6 w-6" />
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight text-gradient">
            TicketFlow
          </span>
        </Link>
        <Button
          asChild
          variant="outline"
          className="gap-2 border-white/10 hover:bg-white/5 transition-all duration-300"
        >
          <Link href="/admin/events">
            <ShieldCheck className="h-4 w-4 text-primary" /> Admin Portal
          </Link>
        </Button>
      </div>
    </header>
  );
}
