import { AdminLayout } from "@/components/AdminLayout";
import { AdminThemeProvider } from "@/hooks/use-admin-theme";

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <AdminLayout>{children}</AdminLayout>
    </AdminThemeProvider>
  );
}
