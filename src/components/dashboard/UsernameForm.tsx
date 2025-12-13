import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';

export function UsernameForm() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [usernames, setUsernames] = useState({
    leetcode: user?.platformUsernames.leetcode || '',
    codeforces: user?.platformUsernames.codeforces || '',
    codechef: user?.platformUsernames.codechef || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateUser({
      platformUsernames: usernames,
    });

    toast.success('Platform usernames updated successfully!');
    setIsLoading(false);
  };

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
        <CardTitle className="text-lg">Platform Usernames</CardTitle>
        <CardDescription>
          Add your competitive programming usernames to track your progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leetcode" className="flex items-center gap-2">
              <span className="text-lg">🟡</span> LeetCode
            </Label>
            <Input
              id="leetcode"
              placeholder="your_leetcode_username"
              value={usernames.leetcode}
              onChange={(e) =>
                setUsernames((prev) => ({ ...prev, leetcode: e.target.value }))
              }
              className="bg-secondary/50 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codeforces" className="flex items-center gap-2">
              <span className="text-lg">🔵</span> Codeforces
            </Label>
            <Input
              id="codeforces"
              placeholder="your_codeforces_handle"
              value={usernames.codeforces}
              onChange={(e) =>
                setUsernames((prev) => ({ ...prev, codeforces: e.target.value }))
              }
              className="bg-secondary/50 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codechef" className="flex items-center gap-2">
              <span className="text-lg">🟠</span> CodeChef
            </Label>
            <Input
              id="codechef"
              placeholder="your_codechef_username"
              value={usernames.codechef}
              onChange={(e) =>
                setUsernames((prev) => ({ ...prev, codechef: e.target.value }))
              }
              className="bg-secondary/50 font-mono"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
