import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { mockUsers, departments } from '@/lib/mock-data';
import { Search, UserCog, Shield, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role } from '@/types';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    toast.success('User role updated');
  };

  const handleActiveToggle = (userId: string, isActive: boolean) => {
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, isActive } : u
    ));
    toast.success(isActive ? 'User activated' : 'User deactivated');
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Shield className="h-4 w-4" />;
      case 'ADMIN':
        return <UserCog className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'default';
      case 'ADMIN':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <AppLayout requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and access permissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">
                {users.filter(u => u.isActive).length}
              </div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-accent">
                {users.filter(u => u.role === 'ADMIN').length}
              </div>
              <p className="text-sm text-muted-foreground">Admins</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">
                {departments.length}
              </div>
              <p className="text-sm text-muted-foreground">Departments</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-secondary/50 pl-10"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full bg-secondary/50 sm:w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full bg-secondary/50 sm:w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className={cn(
                    'flex flex-col gap-4 rounded-lg border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center',
                    !user.isActive && 'opacity-60'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{user.name}</span>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1 text-xs">
                          {getRoleIcon(user.role)}
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.department}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                    {/* Platform badges */}
                    <div className="flex gap-1">
                      {user.platformUsernames.leetcode && (
                        <span className="text-lg" title="LeetCode connected">🟡</span>
                      )}
                      {user.platformUsernames.codeforces && (
                        <span className="text-lg" title="Codeforces connected">🔵</span>
                      )}
                      {user.platformUsernames.codechef && (
                        <span className="text-lg" title="CodeChef connected">🟠</span>
                      )}
                    </div>

                    {/* Role change */}
                    <Select
                      value={user.role}
                      onValueChange={(v) => handleRoleChange(user.id, v as Role)}
                    >
                      <SelectTrigger className="h-8 w-[120px] bg-secondary text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Active toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(checked) => handleActiveToggle(user.id, checked)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
