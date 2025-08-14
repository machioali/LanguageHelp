import { AdminProtected } from '@/components/auth/AdminProtected';
import { AdminDashboardLayout } from '@/components/layout/admin-dashboard-layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtected>
      <AdminDashboardLayout>
        {children}
      </AdminDashboardLayout>
    </AdminProtected>
  );
}
