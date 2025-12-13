import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockUsers, mockLeetCodeStats, mockCodeforcesStats, mockCodeChefStats, departments } from '@/lib/mock-data';
import { Trophy, Medal, Award, RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Platform } from '@/types';

type SortField = 'rating' | 'solved' | 'contests';

export default function Leaderboard() {
  const [platform, setPlatform] = useState<Platform>('leetcode');
  const [department, setDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortField>('rating');

  const getLeaderboardData = () => {
    const users = department === 'all' 
      ? mockUsers.filter(u => u.isActive)
      : mockUsers.filter(u => u.isActive && u.department === department);

    const usersWithStats = users.map(user => {
      let stats: any = null;
      let rating = 0;
      let solved = 0;
      let contests = 0;

      switch (platform) {
        case 'leetcode':
          stats = mockLeetCodeStats[user.id];
          if (stats) {
            rating = stats.contestRating;
            solved = stats.totalSolved;
            contests = stats.contestCount;
          }
          break;
        case 'codeforces':
          stats = mockCodeforcesStats[user.id];
          if (stats) {
            rating = stats.currentRating;
            solved = stats.problemsSolved;
            contests = stats.contestsAttended;
          }
          break;
        case 'codechef':
          stats = mockCodeChefStats[user.id];
          if (stats) {
            rating = stats.currentRating;
            solved = 0;
            contests = stats.contestsAttended;
          }
          break;
      }

      return { user, stats, rating, solved, contests };
    }).filter(item => item.stats !== undefined);

    // Sort
    usersWithStats.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'solved':
          return b.solved - a.solved;
        case 'contests':
          return b.contests - a.contests;
        default:
          return 0;
      }
    });

    return usersWithStats;
  };

  const leaderboard = getLeaderboardData();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center text-sm text-muted-foreground">#{index + 1}</span>;
    }
  };

  const platformConfig = {
    leetcode: { name: 'LeetCode', color: 'platform-leetcode', icon: '🟡' },
    codeforces: { name: 'Codeforces', color: 'platform-codeforces', icon: '🔵' },
    codechef: { name: 'CodeChef', color: 'platform-codechef', icon: '🟠' },
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground">
              Compare rankings across competitive programming platforms
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <TabsList className="bg-secondary">
                  <TabsTrigger value="leetcode" className="gap-2">
                    <span>🟡</span> LeetCode
                  </TabsTrigger>
                  <TabsTrigger value="codeforces" className="gap-2">
                    <span>🔵</span> Codeforces
                  </TabsTrigger>
                  <TabsTrigger value="codechef" className="gap-2">
                    <span>🟠</span> CodeChef
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2">
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-[180px] bg-secondary">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortField)}>
                  <SelectTrigger className="w-[140px] bg-secondary">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="solved">Problems Solved</SelectItem>
                    <SelectItem value="contests">Contests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No users found with {platformConfig[platform].name} stats
                </div>
              ) : (
                leaderboard.map((item, index) => (
                  <div
                    key={item.user.id}
                    className={cn(
                      'flex items-center gap-4 rounded-lg border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50',
                      index === 0 && 'border-yellow-400/30 bg-yellow-400/5',
                      index === 1 && 'border-gray-400/30 bg-gray-400/5',
                      index === 2 && 'border-amber-600/30 bg-amber-600/5'
                    )}
                  >
                    <div className="flex w-8 justify-center">
                      {getRankIcon(index)}
                    </div>
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={item.user.avatar} alt={item.user.name} />
                      <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {item.user.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.user.department}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        @{item.user.platformUsernames[platform] || 'N/A'}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-right">
                      <div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <p className={cn('font-mono font-semibold', platformConfig[platform].color)}>
                          {item.rating}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Solved</p>
                        <p className="font-mono font-semibold text-foreground">
                          {item.solved}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Contests</p>
                        <p className="font-mono font-semibold text-foreground">
                          {item.contests}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
