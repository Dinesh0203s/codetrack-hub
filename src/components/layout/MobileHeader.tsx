import { useAuth } from '@/contexts/AuthContext';
import { Code2, Menu, LogOut, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Trophy,
  Settings,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  { icon: Trophy, label: 'Leaderboard', path: '/leaderboard', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
  { icon: Users, label: 'Users', path: '/admin/users', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports', roles: ['ADMIN', 'SUPER_ADMIN'] },
  { icon: Shield, label: 'Roles', path: '/admin/roles', roles: ['SUPER_ADMIN'] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
];

export function MobileHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-lg md:hidden">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
          <Code2 className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-display text-base font-bold text-foreground">
          Code Tracker
        </span>
      </div>

      {/* Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72 bg-card">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          
          {/* User info */}
          <div className="mt-6 flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
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

          <Separator className="my-4" />

          {/* Navigation */}
          <nav className="space-y-1">
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

          <Separator className="my-4" />

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </SheetContent>
      </Sheet>
    </header>
  );
}
