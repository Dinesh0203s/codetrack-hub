import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeetCodeStats, CodeforcesStats, CodeChefStats, Platform } from '@/types';

interface PlatformCardProps {
  platform: Platform;
  stats: LeetCodeStats | CodeforcesStats | CodeChefStats | null;
  username?: string;
  className?: string;
}

const platformConfig = {
  leetcode: {
    name: 'LeetCode',
    gradient: 'bg-platform-leetcode',
    textColor: 'platform-leetcode',
    icon: '🟡',
  },
  codeforces: {
    name: 'Codeforces',
    gradient: 'bg-platform-codeforces',
    textColor: 'platform-codeforces',
    icon: '🔵',
  },
  codechef: {
    name: 'CodeChef',
    gradient: 'bg-platform-codechef',
    textColor: 'platform-codechef',
    icon: '🟠',
  },
};

function isLeetCodeStats(stats: any): stats is LeetCodeStats {
  return 'easySolved' in stats;
}

function isCodeforcesStats(stats: any): stats is CodeforcesStats {
  return 'currentRank' in stats && 'maxRank' in stats;
}

function isCodeChefStats(stats: any): stats is CodeChefStats {
  return 'stars' in stats;
}

export function PlatformCard({ platform, stats, username, className }: PlatformCardProps) {
  const config = platformConfig[platform];

  if (!stats) {
    return (
      <Card className={cn('glass overflow-hidden', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <span>{config.icon}</span>
              {config.name}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              Not connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add your {config.name} username to track your stats
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass overflow-hidden', className)}>
      <div className={cn('h-1', config.gradient)} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span>{config.icon}</span>
            {config.name}
          </CardTitle>
          {username && (
            <Badge variant="outline" className="font-mono text-xs">
              @{username}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLeetCodeStats(stats) && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <StatItem label="Easy" value={stats.easySolved} color="text-green-400" />
              <StatItem label="Medium" value={stats.mediumSolved} color="text-yellow-400" />
              <StatItem label="Hard" value={stats.hardSolved} color="text-red-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="Rating" value={stats.contestRating} highlight />
              <StatItem label="Total Solved" value={stats.totalSolved} />
              <StatItem label="Contests" value={stats.contestCount} />
              <StatItem label="Top" value={`${stats.topPercentage}%`} />
            </div>
          </>
        )}

        {isCodeforcesStats(stats) && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="Rating" value={stats.currentRating} highlight />
              <StatItem label="Max Rating" value={stats.maxRating} />
            </div>
            <div className="flex items-center gap-2">
              <Badge className={cn('bg-secondary text-xs', config.textColor)}>
                {stats.currentRank}
              </Badge>
              <span className="text-xs text-muted-foreground">
                (Max: {stats.maxRank})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="Problems" value={stats.problemsSolved} />
              <StatItem label="Contests" value={stats.contestsAttended} />
            </div>
          </>
        )}

        {isCodeChefStats(stats) && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="Rating" value={stats.currentRating} highlight />
              <StatItem label="Max Rating" value={stats.maxRating} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{'★'.repeat(stats.stars)}</span>
              <span className="text-xs text-muted-foreground">
                {stats.stars} Star
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatItem label="Global Rank" value={`#${stats.globalRank}`} />
              <StatItem label="Country Rank" value={`#${stats.countryRank}`} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StatItem({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string | number;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          'font-mono text-lg font-semibold',
          color,
          highlight && 'text-primary'
        )}
      >
        {value}
      </p>
    </div>
  );
}
