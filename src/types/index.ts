export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export type Platform = 'leetcode' | 'codeforces' | 'codechef';

export interface User {
  id: string;
  username?: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  department: string;
  isActive: boolean;
  isOnboarded: boolean;
  createdAt: string;
  platformUsernames: {
    leetcode?: string;
    codeforces?: string;
    codechef?: string;
  };
}

export interface LeetCodeStats {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSolved: number;
  contestRating: number;
  contestCount: number;
  globalRank: number;
  topPercentage: number;
}

export interface CodeforcesStats {
  currentRating: number;
  maxRating: number;
  currentRank: string;
  maxRank: string;
  problemsSolved: number;
  contestsAttended: number;
}

export interface CodeChefStats {
  currentRating: number;
  maxRating: number;
  stars: number;
  globalRank: number;
  countryRank: number;
  contestsAttended: number;
}

export interface PlatformStats {
  userId: string;
  platform: Platform;
  data: LeetCodeStats | CodeforcesStats | CodeChefStats;
  lastUpdated: string;
}

export interface Report {
  id: string;
  platform: Platform;
  filters: {
    department?: string;
    batch?: string;
  };
  generatedBy: string;
  publicSlug: string;
  createdAt: string;
  imageUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
