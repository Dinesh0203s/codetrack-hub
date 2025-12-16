import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { MobileNav } from './MobileNav';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  requiredRoles?: ('USER' | 'ADMIN' | 'SUPER_ADMIN')[];
}

export function AppLayout({ children, requiredRoles }: AppLayoutProps) {
  const { profile, role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles && role && !requiredRoles.includes(role as 'USER' | 'ADMIN' | 'SUPER_ADMIN')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile Header & Bottom Nav */}
      <MobileHeader />
      <MobileNav />
      
      {/* Main Content - responsive padding */}
      <main className="md:pl-64">
        <div className="min-h-screen p-4 pb-20 pt-16 md:p-6 md:pb-6 md:pt-6">{children}</div>
      </main>
    </div>
  );
}
