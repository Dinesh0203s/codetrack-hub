import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Trophy,
  Settings,
  LogOut,
  Shield,
  BarChart3,
  Code2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  { icon: Users, label: 'Users', path: '/admin/users', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { icon: Shield, label: 'Roles', path: '/admin/roles', roles: ['SUPER_ADMIN'] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
];

export function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            Code Tracker
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator />

        {/* User section */}
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
}
