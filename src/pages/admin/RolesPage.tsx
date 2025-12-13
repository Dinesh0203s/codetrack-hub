import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, UserCog, User, Check, X } from 'lucide-react';

const roles = [
  {
    name: 'SUPER_ADMIN',
    displayName: 'Super Admin',
    icon: Shield,
    description: 'Full system access with all permissions',
    permissions: [
      { name: 'Manage all users', allowed: true },
      { name: 'Change user roles', allowed: true },
      { name: 'Generate reports', allowed: true },
      { name: 'View all statistics', allowed: true },
      { name: 'Access admin panel', allowed: true },
      { name: 'Delete users', allowed: true },
      { name: 'System settings', allowed: true },
    ],
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    name: 'ADMIN',
    displayName: 'Admin',
    icon: UserCog,
    description: 'Administrative access with user management',
    permissions: [
      { name: 'Manage all users', allowed: true },
      { name: 'Change user roles', allowed: false },
      { name: 'Generate reports', allowed: true },
      { name: 'View all statistics', allowed: true },
      { name: 'Access admin panel', allowed: true },
      { name: 'Delete users', allowed: false },
      { name: 'System settings', allowed: false },
    ],
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    name: 'USER',
    displayName: 'User',
    icon: User,
    description: 'Standard user with personal access only',
    permissions: [
      { name: 'Manage all users', allowed: false },
      { name: 'Change user roles', allowed: false },
      { name: 'Generate reports', allowed: false },
      { name: 'View all statistics', allowed: false },
      { name: 'Access admin panel', allowed: false },
      { name: 'Delete users', allowed: false },
      { name: 'System settings', allowed: false },
    ],
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
];

export default function RolesPage() {
  return (
    <AppLayout requiredRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
          <p className="text-muted-foreground">
            View and understand system roles and permissions
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {roles.map(role => (
            <Card key={role.name} className="glass">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${role.bgColor}`}>
                    <role.icon className={`h-6 w-6 ${role.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.displayName}</CardTitle>
                    <Badge variant="outline" className="mt-1 text-xs font-mono">
                      {role.name}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Permissions</p>
                  <div className="space-y-1">
                    {role.permissions.map(permission => (
                      <div
                        key={permission.name}
                        className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2 text-sm"
                      >
                        <span className="text-muted-foreground">{permission.name}</span>
                        {permission.allowed ? (
                          <Check className="h-4 w-4 text-primary" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/50" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Role Hierarchy</CardTitle>
            <CardDescription>
              Understanding the permission inheritance structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 py-8">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Super Admin</span>
              </div>
              <div className="h-0.5 w-12 bg-border" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                  <UserCog className="h-8 w-8 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">Admin</span>
              </div>
              <div className="h-0.5 w-12 bg-border" />
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">User</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Each role inherits permissions from roles below it in the hierarchy
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
