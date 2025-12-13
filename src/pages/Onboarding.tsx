import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowRight, User, Code, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

const onboardingSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  leetcode: z.string().max(50).optional().or(z.literal('')),
  codeforces: z.string().max(50).optional().or(z.literal('')),
  codechef: z.string().max(50).optional().or(z.literal('')),
});

const REGISTERED_USERNAMES_KEY = 'cp_tracker_usernames';

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    username: '',
    name: user?.name || '',
    leetcode: '',
    codeforces: '',
    codechef: '',
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  // Redirect if already onboarded
  if (user?.isOnboarded) {
    navigate('/dashboard');
    return null;
  }

  const checkUsernameUnique = (username: string): boolean => {
    const storedUsernames = localStorage.getItem(REGISTERED_USERNAMES_KEY);
    const usernames: string[] = storedUsernames ? JSON.parse(storedUsernames) : [];
    return !usernames.includes(username.toLowerCase());
  };

  const registerUsername = (username: string) => {
    const storedUsernames = localStorage.getItem(REGISTERED_USERNAMES_KEY);
    const usernames: string[] = storedUsernames ? JSON.parse(storedUsernames) : [];
    usernames.push(username.toLowerCase());
    localStorage.setItem(REGISTERED_USERNAMES_KEY, JSON.stringify(usernames));
  };

  const validateStep1 = () => {
    const result = onboardingSchema.pick({ username: true, name: true }).safeParse({
      username: formData.username,
      name: formData.name,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    if (!checkUsernameUnique(formData.username)) {
      setErrors({ username: 'This username is already taken' });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const result = onboardingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Register the username
    registerUsername(formData.username);

    // Update user with onboarding data
    updateUser({
      username: formData.username,
      name: formData.name,
      platformUsernames: {
        leetcode: formData.leetcode || undefined,
        codeforces: formData.codeforces || undefined,
        codechef: formData.codechef || undefined,
      },
      isOnboarded: true,
    });

    toast.success('Welcome aboard! Your profile has been set up.');
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Code className="w-5 h-5" />
          </div>
        </div>

        <Card className="glass border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === 1 ? 'Create Your Profile' : 'Link Your Platforms'}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? 'Choose a unique username and display name'
                : 'Add your competitive programming handles (optional)'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">
                      Username <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-secondary/50 font-mono"
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive">{errors.username}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      This cannot be changed later without admin approval
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Display Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-secondary/50"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full mt-6">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="leetcode" className="flex items-center gap-2">
                      <span className="text-lg">🟡</span> LeetCode
                    </Label>
                    <Input
                      id="leetcode"
                      placeholder="your_leetcode_username"
                      value={formData.leetcode}
                      onChange={(e) => setFormData(prev => ({ ...prev, leetcode: e.target.value }))}
                      className="bg-secondary/50 font-mono"
                    />
                    {errors.leetcode && (
                      <p className="text-sm text-destructive">{errors.leetcode}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codeforces" className="flex items-center gap-2">
                      <span className="text-lg">🔵</span> Codeforces
                    </Label>
                    <Input
                      id="codeforces"
                      placeholder="your_codeforces_handle"
                      value={formData.codeforces}
                      onChange={(e) => setFormData(prev => ({ ...prev, codeforces: e.target.value }))}
                      className="bg-secondary/50 font-mono"
                    />
                    {errors.codeforces && (
                      <p className="text-sm text-destructive">{errors.codeforces}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codechef" className="flex items-center gap-2">
                      <span className="text-lg">🟠</span> CodeChef
                    </Label>
                    <Input
                      id="codechef"
                      placeholder="your_codechef_username"
                      value={formData.codechef}
                      onChange={(e) => setFormData(prev => ({ ...prev, codechef: e.target.value }))}
                      className="bg-secondary/50 font-mono"
                    />
                    {errors.codechef && (
                      <p className="text-sm text-destructive">{errors.codechef}</p>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    ⚠️ Platform handles cannot be changed after setup. Contact an admin if you need to update them.
                  </p>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? 'Setting up...' : 'Complete Setup'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
