import { User, PlatformStats, LeetCodeStats, CodeforcesStats, CodeChefStats } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    role: 'SUPER_ADMIN',
    department: 'Computer Science',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    platformUsernames: {
      leetcode: 'alexchen',
      codeforces: 'alex_cf',
      codechef: 'alex_cc',
    },
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    role: 'ADMIN',
    department: 'Information Technology',
    isActive: true,
    createdAt: '2024-02-20T14:15:00Z',
    platformUsernames: {
      leetcode: 'sarahj',
      codeforces: 'sarah_codes',
      codechef: 'sarahchef',
    },
  },
  {
    id: '3',
    name: 'Mike Rivera',
    email: 'mike.r@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    role: 'USER',
    department: 'Computer Science',
    isActive: true,
    createdAt: '2024-03-10T09:00:00Z',
    platformUsernames: {
      leetcode: 'mikedev',
      codeforces: 'mike_cf',
    },
  },
  {
    id: '4',
    name: 'Emily Zhang',
    email: 'emily.z@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    role: 'USER',
    department: 'Data Science',
    isActive: true,
    createdAt: '2024-03-15T11:45:00Z',
    platformUsernames: {
      leetcode: 'emilyzhang',
      codechef: 'emily_chef',
    },
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    role: 'USER',
    department: 'Software Engineering',
    isActive: false,
    createdAt: '2024-04-01T16:30:00Z',
    platformUsernames: {
      codeforces: 'jameswilson',
      codechef: 'james_cc',
    },
  },
];

export const mockLeetCodeStats: Record<string, LeetCodeStats> = {
  '1': {
    easySolved: 245,
    mediumSolved: 312,
    hardSolved: 89,
    totalSolved: 646,
    contestRating: 2145,
    contestCount: 45,
    globalRank: 12543,
    topPercentage: 2.5,
  },
  '2': {
    easySolved: 180,
    mediumSolved: 220,
    hardSolved: 45,
    totalSolved: 445,
    contestRating: 1876,
    contestCount: 32,
    globalRank: 45678,
    topPercentage: 8.2,
  },
  '3': {
    easySolved: 120,
    mediumSolved: 85,
    hardSolved: 12,
    totalSolved: 217,
    contestRating: 1542,
    contestCount: 15,
    globalRank: 98765,
    topPercentage: 18.5,
  },
  '4': {
    easySolved: 200,
    mediumSolved: 150,
    hardSolved: 35,
    totalSolved: 385,
    contestRating: 1723,
    contestCount: 28,
    globalRank: 67890,
    topPercentage: 12.3,
  },
};

export const mockCodeforcesStats: Record<string, CodeforcesStats> = {
  '1': {
    currentRating: 2234,
    maxRating: 2301,
    currentRank: 'Master',
    maxRank: 'Master',
    problemsSolved: 1245,
    contestsAttended: 89,
  },
  '2': {
    currentRating: 1856,
    maxRating: 1923,
    currentRank: 'Candidate Master',
    maxRank: 'Candidate Master',
    problemsSolved: 876,
    contestsAttended: 56,
  },
  '3': {
    currentRating: 1456,
    maxRating: 1512,
    currentRank: 'Specialist',
    maxRank: 'Specialist',
    problemsSolved: 432,
    contestsAttended: 34,
  },
  '5': {
    currentRating: 1234,
    maxRating: 1345,
    currentRank: 'Pupil',
    maxRank: 'Specialist',
    problemsSolved: 287,
    contestsAttended: 23,
  },
};

export const mockCodeChefStats: Record<string, CodeChefStats> = {
  '1': {
    currentRating: 2156,
    maxRating: 2234,
    stars: 6,
    globalRank: 1234,
    countryRank: 89,
    contestsAttended: 67,
  },
  '2': {
    currentRating: 1923,
    maxRating: 1987,
    stars: 5,
    globalRank: 4567,
    countryRank: 234,
    contestsAttended: 45,
  },
  '4': {
    currentRating: 1654,
    maxRating: 1701,
    stars: 4,
    globalRank: 12345,
    countryRank: 567,
    contestsAttended: 32,
  },
  '5': {
    currentRating: 1432,
    maxRating: 1498,
    stars: 3,
    globalRank: 23456,
    countryRank: 890,
    contestsAttended: 21,
  },
};

export const departments = [
  'Computer Science',
  'Information Technology',
  'Data Science',
  'Software Engineering',
  'Electrical Engineering',
];

export function getPlatformStats(userId: string, platform: 'leetcode' | 'codeforces' | 'codechef') {
  switch (platform) {
    case 'leetcode':
      return mockLeetCodeStats[userId];
    case 'codeforces':
      return mockCodeforcesStats[userId];
    case 'codechef':
      return mockCodeChefStats[userId];
  }
}
