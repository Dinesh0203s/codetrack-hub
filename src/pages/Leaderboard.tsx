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
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Leaderboard</h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Compare rankings across platforms
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card className="glass">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <TabsList className="h-auto flex-wrap bg-secondary">
                  <TabsTrigger value="leetcode" className="gap-1 text-xs sm:gap-2 sm:text-sm">
                    <span>🟡</span> <span className="hidden xs:inline">LeetCode</span><span className="xs:hidden">LC</span>
                  </TabsTrigger>
                  <TabsTrigger value="codeforces" className="gap-1 text-xs sm:gap-2 sm:text-sm">
                    <span>🔵</span> <span className="hidden xs:inline">Codeforces</span><span className="xs:hidden">CF</span>
                  </TabsTrigger>
                  <TabsTrigger value="codechef" className="gap-1 text-xs sm:gap-2 sm:text-sm">
                    <span>🟠</span> <span className="hidden xs:inline">CodeChef</span><span className="xs:hidden">CC</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex w-full gap-2 sm:w-auto">
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="flex-1 bg-secondary sm:w-[180px]">
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
                  <SelectTrigger className="flex-1 bg-secondary sm:w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="solved">Solved</SelectItem>
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
                      'flex flex-col gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center sm:gap-4 sm:p-4',
                      index === 0 && 'border-yellow-400/30 bg-yellow-400/5',
                      index === 1 && 'border-gray-400/30 bg-gray-400/5',
                      index === 2 && 'border-amber-600/30 bg-amber-600/5'
                    )}
                  >
                    {/* Top row - rank, avatar, name */}
                    <div className="flex items-center gap-3">
                      <div className="flex w-6 justify-center sm:w-8">
                        {getRankIcon(index)}
                      </div>
                      <Avatar className="h-9 w-9 border border-border sm:h-10 sm:w-10">
                        <AvatarImage src={item.user.avatar} alt={item.user.name} />
                        <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          <span className="truncate font-medium text-foreground text-sm sm:text-base">
                            {item.user.name}
                          </span>
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {item.user.department}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">
                          @{item.user.platformUsernames[platform] || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 rounded-lg bg-background/50 p-2 text-center sm:ml-auto sm:gap-6 sm:bg-transparent sm:p-0 sm:text-right">
                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">Rating</p>
                        <p className={cn('font-mono text-sm font-semibold sm:text-base', platformConfig[platform].color)}>
                          {item.rating}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">Solved</p>
                        <p className="font-mono text-sm font-semibold text-foreground sm:text-base">
                          {item.solved}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">Contests</p>
                        <p className="font-mono text-sm font-semibold text-foreground sm:text-base">
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
