import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockUsers, departments } from '@/lib/mock-data';
import { Search, UserCog, Shield, User as UserIcon, Edit, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Role, User } from '@/types';
import { toast } from 'sonner';

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    username: '',
    name: '',
    leetcode: '',
    codeforces: '',
    codechef: '',
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
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

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditForm({
      username: user.username || '',
      name: user.name,
      leetcode: user.platformUsernames.leetcode || '',
      codeforces: user.platformUsernames.codeforces || '',
      codechef: user.platformUsernames.codechef || '',
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    setUsers(prev => prev.map(u =>
      u.id === editingUser.id
        ? {
            ...u,
            username: editForm.username || u.username,
            name: editForm.name,
            platformUsernames: {
              leetcode: editForm.leetcode || undefined,
              codeforces: editForm.codeforces || undefined,
              codechef: editForm.codechef || undefined,
            },
          }
        : u
    ));
    toast.success('User details updated');
    setEditingUser(null);
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
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">User Management</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Manage users, roles, and access
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Card className="glass">
            <CardContent className="p-4 md:pt-6">
              <div className="text-xl font-bold text-foreground md:text-2xl">{users.length}</div>
              <p className="text-xs text-muted-foreground md:text-sm">Total Users</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 md:pt-6">
              <div className="text-xl font-bold text-primary md:text-2xl">
                {users.filter(u => u.isActive).length}
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">Active</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 md:pt-6">
              <div className="text-xl font-bold text-accent md:text-2xl">
                {users.filter(u => u.role === 'ADMIN').length}
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">Admins</p>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 md:pt-6">
              <div className="text-xl font-bold text-foreground md:text-2xl">
                {departments.length}
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">Departments</p>
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
                        {user.username && (
                          <span className="text-sm text-muted-foreground font-mono">@{user.username}</span>
                        )}
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
                        <span className="text-lg" title={`LeetCode: ${user.platformUsernames.leetcode}`}>🟡</span>
                      )}
                      {user.platformUsernames.codeforces && (
                        <span className="text-lg" title={`Codeforces: ${user.platformUsernames.codeforces}`}>🔵</span>
                      )}
                      {user.platformUsernames.codechef && (
                        <span className="text-lg" title={`CodeChef: ${user.platformUsernames.codechef}`}>🟠</span>
                      )}
                    </div>

                    {/* Edit button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User Details</DialogTitle>
                          <DialogDescription>
                            Update user profile and platform handles
                          </DialogDescription>
                        </DialogHeader>
                        {editingUser?.id === user.id && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-username">Username</Label>
                              <Input
                                id="edit-username"
                                value={editForm.username}
                                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                className="font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Display Name</Label>
                              <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-leetcode" className="flex items-center gap-2">
                                <span>🟡</span> LeetCode Handle
                              </Label>
                              <Input
                                id="edit-leetcode"
                                value={editForm.leetcode}
                                onChange={(e) => setEditForm(prev => ({ ...prev, leetcode: e.target.value }))}
                                className="font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-codeforces" className="flex items-center gap-2">
                                <span>🔵</span> Codeforces Handle
                              </Label>
                              <Input
                                id="edit-codeforces"
                                value={editForm.codeforces}
                                onChange={(e) => setEditForm(prev => ({ ...prev, codeforces: e.target.value }))}
                                className="font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-codechef" className="flex items-center gap-2">
                                <span>🟠</span> CodeChef Handle
                              </Label>
                              <Input
                                id="edit-codechef"
                                value={editForm.codechef}
                                onChange={(e) => setEditForm(prev => ({ ...prev, codechef: e.target.value }))}
                                className="font-mono"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleSaveEdit}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

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
