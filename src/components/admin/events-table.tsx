"use client";

import Link from "next/link";
import { AlertCircle, Edit, Eye, Loader2, MoreHorizontal, Trash } from "lucide-react";
import { Event } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  onEdit: (event: Event) => void;
  onDeleteRequest: (id: number) => void;
}

export function EventsTable({ events, loading, onEdit, onDeleteRequest }: EventsTableProps) {
  return (
    <Card className="glass-card border-white/10 overflow-hidden">
      <CardHeader className="bg-white/5 border-b border-white/5 pb-4">
        <CardTitle className="font-heading text-xl">All Events</CardTitle>
        <CardDescription>View, edit, and delete scheduled events.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4 animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Fetching active events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
            <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-lg">No events found. Create one to get started!</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="pl-6 font-semibold text-muted-foreground h-12">Title</TableHead>
                <TableHead className="font-semibold text-muted-foreground h-12">Date</TableHead>
                <TableHead className="text-center font-semibold text-muted-foreground h-12">Total Capacity</TableHead>
                <TableHead className="text-center font-semibold text-muted-foreground h-12">Booked</TableHead>
                <TableHead className="text-center font-semibold text-muted-foreground h-12">Available</TableHead>
                <TableHead className="w-[200px] font-semibold text-muted-foreground h-12">Occupancy Rate</TableHead>
                <TableHead className="text-right pr-6 font-semibold text-muted-foreground h-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const percentBooked = Math.round((event.booked_tickets / event.total_capacity) * 100);
                const isSoldOut = event.available_tickets === 0;

                return (
                  <TableRow
                    key={event.id}
                    className="border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <TableCell className="font-semibold pl-6">{event.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", { dateStyle: "medium" })}
                    </TableCell>
                    <TableCell className="text-center">{event.total_capacity}</TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {event.booked_tickets}
                    </TableCell>
                    <TableCell className="text-center">
                      {isSoldOut ? (
                        <Badge variant="destructive" className="bg-red-500/20 text-red-400 border border-red-500/30">
                          Sold Out
                        </Badge>
                      ) : (
                        <span className="font-semibold">{event.available_tickets}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={percentBooked} className="h-2 w-24 bg-white/5" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {percentBooked}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[160px] bg-card/95 backdrop-blur-xl border-white/10"
                        >
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem asChild className="hover:bg-white/10 focus:bg-white/10">
                            <Link
                              href={`/admin/events/${event.id}/bookings`}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4 text-primary" /> View Bookings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit(event)}
                            className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            onClick={() => onDeleteRequest(event.id)}
                            className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer"
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
