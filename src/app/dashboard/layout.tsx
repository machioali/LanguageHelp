import { ClientDashboardLayout } from '@/components/layout/client-dashboard-layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientDashboardLayout>
      {children}
    </ClientDashboardLayout>
  );
}
