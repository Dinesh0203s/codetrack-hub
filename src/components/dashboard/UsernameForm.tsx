import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw, Lock } from 'lucide-react';

export function UsernameForm() {
  const { user } = useAuth();

  const handleRefresh = () => {
    toast.info('Fetching latest stats from platforms...');
    // Mock refresh - in real app would trigger background scraping
    setTimeout(() => {
      toast.success('Stats refreshed successfully!');
    }, 2000);
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Platform Usernames
          <Lock className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
        <CardDescription>
          Your platform handles are locked. Contact an admin to update them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leetcode" className="flex items-center gap-2">
              <span className="text-lg">🟡</span> LeetCode
            </Label>
            <Input
              id="leetcode"
              value={user?.platformUsernames.leetcode || 'Not set'}
              disabled
              className="bg-secondary/50 font-mono opacity-70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codeforces" className="flex items-center gap-2">
              <span className="text-lg">🔵</span> Codeforces
            </Label>
            <Input
              id="codeforces"
              value={user?.platformUsernames.codeforces || 'Not set'}
              disabled
              className="bg-secondary/50 font-mono opacity-70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codechef" className="flex items-center gap-2">
              <span className="text-lg">🟠</span> CodeChef
            </Label>
            <Input
              id="codechef"
              value={user?.platformUsernames.codechef || 'Not set'}
              disabled
              className="bg-secondary/50 font-mono opacity-70"
            />
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Stats
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
