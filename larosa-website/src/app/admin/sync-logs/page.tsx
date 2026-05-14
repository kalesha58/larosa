"use client";

import { useGetSyncLogs } from "@/hooks/use-queries";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminSyncLogsPage() {
  const { data: logs, isLoading, isError } = useGetSyncLogs();

  return (
    <div className="space-y-10">
      <div className="pb-6 border-b border-border/50">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-2">
          Integrations
        </p>
        <h1 className="font-serif text-4xl text-foreground">Airbnb sync logs</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl">
          Recent imports from Airbnb iCal feeds (Vercel cron runs once daily; use Sync on Rooms for immediate import).
        </p>
      </div>

      <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Time</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Room</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Result</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Imported</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Removed</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                  Loading…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-destructive text-xs">
                  Failed to load logs (admin session required).
                </TableCell>
              </TableRow>
            ) : !logs?.length ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-xs">
                  No sync runs recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-[11px] whitespace-nowrap">
                    {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-sm">#{log.roomId}</TableCell>
                  <TableCell>
                    <Badge
                      variant={log.success ? "default" : "destructive"}
                      className="text-[9px] uppercase tracking-widest"
                    >
                      {log.success ? "OK" : "Error"}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.eventsImported}</TableCell>
                  <TableCell>{log.eventsRemoved}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-md truncate">
                    {log.errorMessage || "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
