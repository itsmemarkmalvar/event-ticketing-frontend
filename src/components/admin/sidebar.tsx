"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Home, LayoutDashboard, Menu, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const routes = [
  {
    label: "Back to Site",
    icon: Home,
    href: "/events",
  },
  {
    label: "Events Dashboard",
    icon: LayoutDashboard,
    href: "/admin/events",
    matchPrefix: "/admin/events",
  },
];

// Extracted at module level — no remount on every Sidebar render
function SidebarNav({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r">
      <div className="px-6 py-2 flex items-center">
        <Link href="/admin/events" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Ticket className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">Admin Panel</span>
        </Link>
      </div>
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = route.matchPrefix
              ? pathname === route.matchPrefix || pathname.startsWith(route.matchPrefix + "/")
              : false;

            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={onLinkClick}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200",
                  isActive ? "text-foreground bg-accent" : "text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mr-3 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {route.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="px-6 py-4 border-t text-xs text-muted-foreground">
        Event Ticketing System v1.0
      </div>
    </div>
  );
}

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn("hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80]", className)}>
        <SidebarNav />
      </aside>

      {/* Mobile Navigation Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-50">
        <Link href="/admin/events" className="flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Admin Panel</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarNav onLinkClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
