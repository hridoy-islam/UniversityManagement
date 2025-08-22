import { TopNav } from '@/components/shared/top-nav';
import { SideNav } from '@/components/shared/side-nav';
import AutoLogout from '../shared/auto-logout';
import { Toaster } from '@/components/ui/toaster';
import { useSelector } from 'react-redux';
import VerifyPage from '@/pages/auth/verify';
import VerticalNav from '../shared/VericalNav';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from '../shared/app-sidebar';
import { SiteHeader } from '../shared/site-header';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useSelector((state: any) => state.auth);

  
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)'
        } as React.CSSProperties
      }
    >
      <div className="flex h-full w-full bg-gray-100">
        <AppSidebar />

        <SidebarInset className="flex w-full  flex-col overflow-hidden bg-white md:mb-2 md:ml-52  md:mr-2 md:mt-2 md:rounded-lg md:shadow-md">
          <SiteHeader />
          <main className="w-full p-4">{children}</main>
        </SidebarInset>
      </div>

      <Toaster />
    </SidebarProvider>
  );
}
