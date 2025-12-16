import { useAuth } from '@/contexts/AuthContext';
import { Code2, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MobileHeader() {
  const { profile, role, logout } = useAuth();

  if (!profile) return null;

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

      {/* User Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={profile.avatar || ''} alt={profile.name || ''} />
              <AvatarFallback className="bg-primary/10 text-xs text-primary">
                {(profile.name || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-card">
          <DropdownMenuLabel>
            <p className="font-medium">{profile.name}</p>
            <p className="text-xs font-normal text-muted-foreground">
              {(role || 'USER').replace('_', ' ')}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
