import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { Code2, Trophy, Users, BarChart3 } from 'lucide-react';

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      icon: Trophy,
      title: 'Track Progress',
      description: 'Monitor your competitive programming journey across platforms',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Get detailed insights into your problem-solving patterns',
    },
    {
      icon: Users,
      title: 'Leaderboards',
      description: 'Compare with peers and climb the department rankings',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl md:h-[600px] md:w-[600px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl md:h-[600px] md:w-[600px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6 md:space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <div className="mb-4 flex justify-center md:mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary glow-primary md:h-16 md:w-16">
                <Code2 className="h-7 w-7 text-primary-foreground md:h-8 md:w-8" />
              </div>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              CP Tracker
            </h1>
            <p className="mt-2 text-base text-muted-foreground md:text-lg">
              Your competitive programming analytics hub
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-colors hover:bg-card/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <div className="space-y-4">
            <GoogleLoginButton />
            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Platform badges */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <span className="text-2xl" title="LeetCode">🟡</span>
            <span className="text-2xl" title="Codeforces">🔵</span>
            <span className="text-2xl" title="CodeChef">🟠</span>
          </div>
        </div>
      </div>
    </div>
  );
}
