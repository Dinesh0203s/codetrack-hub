import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { departments } from '@/lib/mock-data';
import { FileImage, Download, Share2, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Platform, Report } from '@/types';

const mockReports: Report[] = [
  {
    id: '1',
    platform: 'leetcode',
    filters: { department: 'Computer Science' },
    generatedBy: 'Alex Chen',
    publicSlug: 'lc-cs-dec2024',
    createdAt: '2024-12-10T14:30:00Z',
    imageUrl: '/placeholder.svg',
  },
  {
    id: '2',
    platform: 'codeforces',
    filters: { department: 'All' },
    generatedBy: 'Sarah Johnson',
    publicSlug: 'cf-all-dec2024',
    createdAt: '2024-12-08T10:15:00Z',
    imageUrl: '/placeholder.svg',
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('leetcode');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport: Report = {
      id: Date.now().toString(),
      platform: selectedPlatform,
      filters: { department: selectedDepartment === 'all' ? 'All' : selectedDepartment },
      generatedBy: 'Current User',
      publicSlug: `${selectedPlatform.slice(0, 2)}-${selectedDepartment.slice(0, 3)}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      imageUrl: '/placeholder.svg',
    };

    setReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
    toast.success('Report generated successfully!');
  };

  const handleShare = (report: Report) => {
    const url = `${window.location.origin}/report/${report.publicSlug}`;
    navigator.clipboard.writeText(url);
    toast.success('Report link copied to clipboard!');
  };

  const platformConfig = {
    leetcode: { name: 'LeetCode', icon: '🟡', color: 'platform-leetcode' },
    codeforces: { name: 'Codeforces', icon: '🔵', color: 'platform-codeforces' },
    codechef: { name: 'CodeChef', icon: '🟠', color: 'platform-codechef' },
  };

  return (
    <AppLayout requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Report Generation</h1>
          <p className="text-muted-foreground">
            Generate and share leaderboard reports with images
          </p>
        </div>

        {/* Generate New Report */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5" />
              Generate New Report
            </CardTitle>
            <CardDescription>
              Create a shareable leaderboard report with platform-branded image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Platform</label>
                <Select value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as Platform)}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leetcode">🟡 LeetCode</SelectItem>
                    <SelectItem value="codeforces">🔵 Codeforces</SelectItem>
                    <SelectItem value="codechef">🟠 CodeChef</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileImage className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Reports */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map(report => (
                <div
                  key={report.id}
                  className="flex flex-col gap-4 rounded-lg border border-border/50 bg-secondary/30 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl">
                      {platformConfig[report.platform].icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${platformConfig[report.platform].color}`}>
                          {platformConfig[report.platform].name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {report.filters.department}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generated by {report.generatedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:ml-auto">
                    <Button variant="outline" size="sm" onClick={() => handleShare(report)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}

              {reports.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  No reports generated yet. Create your first report above!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
