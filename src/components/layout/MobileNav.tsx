import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Settings,
  BarChart3,
  PieChart,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/dashboard', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  { icon: Trophy, label: 'Ranks', path: '/leaderboard', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  { icon: PieChart, label: 'Stats', path: '/stats', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  { icon: Users, label: 'Users', path: '/admin/users', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
];

export function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user.role)
  ).slice(0, 5); // Max 5 items for bottom nav

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
