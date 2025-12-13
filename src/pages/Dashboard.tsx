import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { PlatformCard } from '@/components/stats/PlatformCard';
import { UsernameForm } from '@/components/dashboard/UsernameForm';
import { getPlatformStats } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, Building } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const leetcodeStats = getPlatformStats(user.id, 'leetcode');
  const codeforcesStats = getPlatformStats(user.id, 'codeforces');
  const codechefStats = getPlatformStats(user.id, 'codechef');

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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <Badge
                    variant={user.role === 'SUPER_ADMIN' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    {user.department}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
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
                  username={user.platformUsernames.leetcode}
                />
                <PlatformCard
                  platform="codeforces"
                  stats={codeforcesStats}
                  username={user.platformUsernames.codeforces}
                />
                <PlatformCard
                  platform="codechef"
                  stats={codechefStats}
                  username={user.platformUsernames.codechef}
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
