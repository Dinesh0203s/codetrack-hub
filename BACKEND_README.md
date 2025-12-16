# CP Tracker - Backend Setup Guide

This document outlines the backend requirements and setup instructions for the Competitive Programming Tracker application.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                     Lovable Cloud (Supabase)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Auth      │  │  Database   │  │    Edge Functions       │  │
│  │  (Google)   │  │ (PostgreSQL)│  │  (Scraping APIs)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
   │  LeetCode   │    │ Codeforces  │    │  CodeChef   │
   │   GraphQL   │    │  Official   │    │   Scraper   │
   │    API      │    │    API      │    │  (Cheerio)  │
   └─────────────┘    └─────────────┘    └─────────────┘
```

## 📊 Database Schema

### Tables

#### `profiles`
Stores user profile information.

| Column          | Type        | Description                    |
|-----------------|-------------|--------------------------------|
| id              | UUID (PK)   | References auth.users          |
| username        | TEXT        | Unique username                |
| name            | TEXT        | Display name                   |
| email           | TEXT        | Email address                  |
| avatar          | TEXT        | Avatar URL                     |
| department      | ENUM        | Department (CSBS, AIDS, etc.)  |
| year_of_passout | INTEGER     | Graduation year                |
| is_onboarded    | BOOLEAN     | Onboarding completion status   |
| created_at      | TIMESTAMPTZ | Account creation timestamp     |
| updated_at      | TIMESTAMPTZ | Last update timestamp          |

#### `platform_usernames`
Stores competitive programming platform usernames.

| Column             | Type        | Description              |
|--------------------|-------------|--------------------------|
| id                 | UUID (PK)   | Primary key              |
| user_id            | UUID (FK)   | References profiles      |
| leetcode_username  | TEXT        | LeetCode handle          |
| codeforces_username| TEXT        | Codeforces handle        |
| codechef_username  | TEXT        | CodeChef handle          |
| created_at         | TIMESTAMPTZ | Creation timestamp       |
| updated_at         | TIMESTAMPTZ | Last update timestamp    |

#### `user_roles`
Stores user roles for RBAC.

| Column   | Type      | Description                        |
|----------|-----------|-----------------------------------|
| id       | UUID (PK) | Primary key                        |
| user_id  | UUID (FK) | References auth.users              |
| role     | ENUM      | USER, ADMIN, or SUPER_ADMIN        |

### Enums

```sql
-- User roles
CREATE TYPE app_role AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- Departments
CREATE TYPE department AS ENUM ('CSBS', 'AIDS', 'CSE', 'AIML', 'ECE', 'EEE', 'CSE_CYBER');
```

## 🔐 Authentication Setup

### Google OAuth Configuration

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Configure OAuth Consent Screen**
   - Navigate to APIs & Services → OAuth consent screen
   - Add your Supabase domain: `<PROJECT_ID>.supabase.co`
   - Add required scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`

3. **Create OAuth Credentials**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → OAuth Client ID
   - Application type: Web application
   - Add Authorized JavaScript origins:
     - `https://your-app-domain.com`
     - `http://localhost:5173` (for development)
   - Add Authorized redirect URIs:
     - `https://<PROJECT_ID>.supabase.co/auth/v1/callback`

4. **Configure Lovable Cloud**
   - Go to Cloud → Authentication → Providers
   - Enable Google provider
   - Add Client ID and Client Secret from Google Cloud Console

5. **Set Redirect URLs**
   - In Cloud → Authentication → URL Configuration
   - Set Site URL: `https://your-app-domain.com`
   - Add Redirect URLs:
     - `https://your-app-domain.com`
     - Your Lovable preview URL

## 🔧 Edge Functions (To Be Implemented)

### Scraping APIs

#### `POST /functions/v1/scrape-leetcode`
Scrapes LeetCode user stats.

**Request:**
```json
{
  "username": "leetcode_handle"
}
```

**Response:**
```json
{
  "easySolved": 150,
  "mediumSolved": 200,
  "hardSolved": 50,
  "totalSolved": 400,
  "contestRating": 1850,
  "contestCount": 25,
  "globalRank": 50000,
  "topPercentage": 5.2
}
```

**Implementation Notes:**
- Use LeetCode GraphQL API
- Endpoint: `https://leetcode.com/graphql`
- Query user profile and contest data

#### `POST /functions/v1/scrape-codeforces`
Scrapes Codeforces user stats using official API.

**Request:**
```json
{
  "username": "codeforces_handle"
}
```

**Response:**
```json
{
  "currentRating": 1600,
  "maxRating": 1750,
  "currentRank": "expert",
  "maxRank": "expert",
  "problemsSolved": 500,
  "contestsAttended": 40
}
```

**Implementation Notes:**
- Use Official Codeforces API
- Endpoints:
  - `https://codeforces.com/api/user.info?handles={handle}`
  - `https://codeforces.com/api/user.status?handle={handle}`
  - `https://codeforces.com/api/user.rating?handle={handle}`

#### `POST /functions/v1/scrape-codechef`
Scrapes CodeChef user stats.

**Request:**
```json
{
  "username": "codechef_handle"
}
```

**Response:**
```json
{
  "currentRating": 1800,
  "maxRating": 1900,
  "stars": 4,
  "division": 2,
  "globalRank": 15000,
  "countryRank": 1500,
  "contestsAttended": 30
}
```

**Implementation Notes:**
- Primary: Use Axios + Cheerio for HTML scraping
- Fallback: Use Playwright if blocked
- Profile URL: `https://www.codechef.com/users/{handle}`

### Analytics APIs

#### `GET /functions/v1/stats/leetcode`
Returns aggregated LeetCode statistics.

**Response:**
```json
{
  "buckets": [
    { "range": "0-99", "count": 5 },
    { "range": "100-199", "count": 12 },
    { "range": "1800-1899", "count": 8 }
  ],
  "averageRating": 1420,
  "totalUsers": 150
}
```

#### `GET /functions/v1/stats/codeforces`
Returns aggregated Codeforces statistics (same structure).

#### `GET /functions/v1/stats/codechef`
Returns CodeChef division distribution.

**Response:**
```json
{
  "divisions": [
    { "division": "Div 1", "count": 5 },
    { "division": "Div 2", "count": 25 },
    { "division": "Div 3", "count": 80 },
    { "division": "Div 4", "count": 40 }
  ],
  "totalUsers": 150
}
```

## 📋 Additional Tables (To Be Added)

### `platform_stats`
Caches scraped platform statistics.

```sql
CREATE TABLE public.platform_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'leetcode', 'codeforces', 'codechef'
  stats JSONB NOT NULL,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);
```

### `scraping_queue`
Manages scraping job queue.

```sql
CREATE TABLE public.scraping_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  attempts INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
```

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Profiles
- **SELECT**: All authenticated users can view profiles
- **UPDATE**: Users can only update their own profile

### Platform Usernames
- **SELECT**: All authenticated users can view
- **INSERT**: Users can add their own usernames
- **UPDATE**: Only ADMIN/SUPER_ADMIN can update (handle immutability rule)

### User Roles
- **SELECT**: Users can view own role, SUPER_ADMIN can view all
- **ALL**: Only SUPER_ADMIN can manage roles

## 🚀 Deployment Checklist

- [ ] Configure Google OAuth in Google Cloud Console
- [ ] Set up Google provider in Lovable Cloud Authentication
- [ ] Configure Site URL and Redirect URLs
- [ ] Create scraping edge functions
- [ ] Add `platform_stats` table for caching
- [ ] Add `scraping_queue` table for job management
- [ ] Set up cron job for periodic scraping (24-hour cache)
- [ ] Test authentication flow end-to-end

## 📚 External API Documentation

- [LeetCode GraphQL API](https://leetcode.com/graphql) - Unofficial, requires GraphQL queries
- [Codeforces API](https://codeforces.com/apiHelp) - Official REST API
- [CodeChef](https://www.codechef.com) - Web scraping required

## 🛠️ Technology Stack

| Component      | Technology           |
|----------------|---------------------|
| Frontend       | React + Vite        |
| Styling        | Tailwind CSS        |
| Backend        | Lovable Cloud       |
| Database       | PostgreSQL          |
| Auth           | Google OAuth 2.0    |
| Edge Functions | Deno (TypeScript)   |
| Scraping       | Axios, Cheerio      |
| Charts         | Recharts            |
