import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RatingHistogram } from '@/components/stats/RatingHistogram';
import { DivisionPieChart } from '@/components/stats/DivisionPieChart';
import { mockLeetCodeStats, mockCodeforcesStats, mockCodeChefStats } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BarChart3, PieChart } from 'lucide-react';

function createRatingBuckets(ratings: number[], bucketSize: number = 100) {
  if (ratings.length === 0) return [];
  
  const minRating = Math.floor(Math.min(...ratings) / bucketSize) * bucketSize;
  const maxRating = Math.ceil(Math.max(...ratings) / bucketSize) * bucketSize;
  
  const buckets: { range: string; count: number }[] = [];
  
  for (let start = minRating; start < maxRating; start += bucketSize) {
    const end = start + bucketSize - 1;
    const count = ratings.filter(r => r >= start && r <= end).length;
    buckets.push({
      range: `${start}-${end}`,
      count
    });
  }
  
  return buckets;
}

function getCodeChefDivision(rating: number): string {
  if (rating >= 2000) return 'Div 1';
  if (rating >= 1600) return 'Div 2';
  if (rating >= 1400) return 'Div 3';
  return 'Div 4';
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

export default function Stats() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('leetcode');
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // Compute LeetCode stats
  const leetcodeData = useMemo(() => {
    const stats = isAdmin 
      ? Object.values(mockLeetCodeStats)
      : user?.platformUsernames?.leetcode 
        ? [mockLeetCodeStats[user.platformUsernames.leetcode]]
        : [];
    
    const validStats = stats.filter(Boolean);
    const ratings = validStats.map(s => s.contestRating).filter(r => r > 0);
    
    return {
      buckets: createRatingBuckets(ratings),
      totalUsers: validStats.length,
      averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      maxRating: ratings.length > 0 ? Math.max(...ratings) : 0,
      minRating: ratings.length > 0 ? Math.min(...ratings) : 0
    };
  }, [isAdmin, user]);

  // Compute Codeforces stats
  const codeforcesData = useMemo(() => {
    const stats = isAdmin 
      ? Object.values(mockCodeforcesStats)
      : user?.platformUsernames?.codeforces 
        ? [mockCodeforcesStats[user.platformUsernames.codeforces]]
        : [];
    
    const validStats = stats.filter(Boolean);
    const ratings = validStats.map(s => s.currentRating).filter(r => r > 0);
    
    return {
      buckets: createRatingBuckets(ratings),
      totalUsers: validStats.length,
      averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
      maxRating: ratings.length > 0 ? Math.max(...ratings) : 0,
      minRating: ratings.length > 0 ? Math.min(...ratings) : 0
    };
  }, [isAdmin, user]);

  // Compute CodeChef stats
  const codechefData = useMemo(() => {
    const stats = isAdmin 
      ? Object.values(mockCodeChefStats)
      : user?.platformUsernames?.codechef 
        ? [mockCodeChefStats[user.platformUsernames.codechef]]
        : [];
    
    const validStats = stats.filter(Boolean);
    const ratings = validStats.map(s => s.currentRating);
    
    const divisionCounts = {
      'Div 1': 0,
      'Div 2': 0,
      'Div 3': 0,
      'Div 4': 0
    };
    
    ratings.forEach(rating => {
      const div = getCodeChefDivision(rating);
      divisionCounts[div as keyof typeof divisionCounts]++;
    });
    
    const total = validStats.length;
    const divisionData = Object.entries(divisionCounts).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0
    }));
    
    return {
      divisions: divisionData,
      totalUsers: total,
      averageRating: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
    };
  }, [isAdmin, user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stats & Visualizations</h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? 'Platform-wise statistical insights for all users'
              : 'Your personal platform statistics'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="leetcode" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              LeetCode
            </TabsTrigger>
            <TabsTrigger value="codeforces" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Codeforces
            </TabsTrigger>
            <TabsTrigger value="codechef" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              CodeChef
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leetcode" className="space-y-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <RatingHistogram
                title="LeetCode Rating Distribution"
                description="User distribution across rating ranges (buckets of 100)"
                data={leetcodeData.buckets}
                color="#22c55e"
                totalUsers={leetcodeData.totalUsers}
                averageRating={leetcodeData.averageRating}
                maxRating={leetcodeData.maxRating}
                minRating={leetcodeData.minRating}
              />
            )}
          </TabsContent>

          <TabsContent value="codeforces" className="space-y-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <RatingHistogram
                title="Codeforces Rating Distribution"
                description="User distribution across rating ranges (buckets of 100)"
                data={codeforcesData.buckets}
                color="#3b82f6"
                totalUsers={codeforcesData.totalUsers}
                averageRating={codeforcesData.averageRating}
                maxRating={codeforcesData.maxRating}
                minRating={codeforcesData.minRating}
              />
            )}
          </TabsContent>

          <TabsContent value="codechef" className="space-y-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <DivisionPieChart
                title="CodeChef Division Distribution"
                description="User distribution across CodeChef divisions"
                data={codechefData.divisions}
                totalUsers={codechefData.totalUsers}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
