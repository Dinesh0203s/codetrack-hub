import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { PlatformCard } from '@/components/stats/PlatformCard';
import { UsernameForm } from '@/components/dashboard/UsernameForm';
import { getPlatformStats } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, Building } from 'lucide-react';
import { DEPARTMENTS } from '@/types';

export default function Dashboard() {
  const { user, profile, role } = useAuth();

  if (!user || !profile) return null;

  const leetcodeStats = getPlatformStats(user.id, 'leetcode');
  const codeforcesStats = getPlatformStats(user.id, 'codeforces');
  const codechefStats = getPlatformStats(user.id, 'codechef');

  const departmentLabel = DEPARTMENTS.find(d => d.value === profile.department)?.label || profile.department;

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Track your competitive programming progress
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - User info & form */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card className="glass overflow-hidden">
              <div className="h-20 bg-gradient-primary" />
              <CardContent className="-mt-10 space-y-4">
                <Avatar className="h-20 w-20 border-4 border-card">
                  <AvatarImage src={profile.avatar || ''} alt={profile.name || ''} />
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                    {(profile.name || 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                  <Badge
                    variant={role === 'SUPER_ADMIN' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {(role || 'USER').replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {profile.email || user.email}
                  </div>
                  {departmentLabel && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building className="h-4 w-4" />
                      {departmentLabel}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Joined {new Date(profile.created_at || user.created_at || '').toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Username Form */}
            <UsernameForm />
          </div>

          {/* Right column - Stats */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <PlatformCard
                  platform="leetcode"
                  stats={leetcodeStats}
                  username={undefined}
                />
                <PlatformCard
                  platform="codeforces"
                  stats={codeforcesStats}
                  username={undefined}
                />
                <PlatformCard
                  platform="codechef"
                  stats={codechefStats}
                  username={undefined}
                  className="md:col-span-2 xl:col-span-1"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
