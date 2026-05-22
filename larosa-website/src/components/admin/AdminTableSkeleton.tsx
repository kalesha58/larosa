import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

type AdminTableSkeletonProps = {
  rows?: number;
  cols?: number;
};

export function AdminTableSkeleton({ rows = 3, cols = 6 }: AdminTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={`skeleton-${rowIndex}-${colIndex}`} className="py-6">
              <Skeleton className="h-4 w-full max-w-[120px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
