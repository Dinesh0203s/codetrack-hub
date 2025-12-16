import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import cors from 'cors'
import { prisma } from './db'

const app = express()

// Backend port – driven by env, default 3000
const PORT = process.env.PORT || process.env.BACKEND_PORT || '3000'

// Frontend base URL – driven by env, falls back to localhost with frontend port
const FRONTEND_PORT = process.env.FRONTEND_PORT || process.env.VITE_PORT || '5000'
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${FRONTEND_PORT}`

app.use(cors({
  origin: [
    FRONTEND_URL,
    // also allow 0.0.0.0 form if using localhost
    FRONTEND_URL.replace('localhost', '0.0.0.0'),
  ],
  credentials: true
}))

app.use(express.json())

// Health check endpoint (after CORS middleware)
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: error instanceof Error ? error.message : 'Unknown error' })
  }
})

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 * 7
  }
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const CALLBACK_URL = process.env.GOOGLE_REDIRECT_URI
  || `${FRONTEND_URL}/api/auth/google/callback`

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value
      if (!email) {
        return done(new Error('No email found in Google profile'), undefined)
      }

      let user = await prisma.user.findUnique({ where: { googleId: profile.id } })
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            email,
            name: profile.displayName || 'User',
            avatar: profile.photos?.[0]?.value || null
          }
        })
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: profile.displayName || user.name,
            avatar: profile.photos?.[0]?.value || user.avatar
          }
        })
      }

      return done(null, user)
    } catch (error) {
      return done(error as Error, undefined)
    }
  }))
}

app.get('/api/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
  (req, res) => {
    const user = req.user as any
    if (user && !user.isOnboarded) {
      res.redirect('/onboarding')
    } else {
      res.redirect('/dashboard')
    }
  }
)

app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    res.status(401).json({ user: null })
  }
})

app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ error: 'Logout failed' })
    } else {
      res.json({ success: true })
    }
  })
})

app.patch('/api/user', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const user = req.user as any
  const { department, yearOfPassout, leetcodeUsername, codeforcesUsername, codechefUsername, isOnboarded } = req.body

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(department !== undefined && { department }),
        ...(yearOfPassout !== undefined && { yearOfPassout }),
        ...(leetcodeUsername !== undefined && { leetcodeUsername }),
        ...(codeforcesUsername !== undefined && { codeforcesUsername }),
        ...(codechefUsername !== undefined && { codechefUsername }),
        ...(isOnboarded !== undefined && { isOnboarded })
      }
    })
    res.json({ user: updatedUser })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' })
  }
})

app.get('/api/users', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const user = req.user as any
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Not authorized' })
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json({ users })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set!')
  console.error('Please create a .env file with DATABASE_URL=your_postgres_connection_string')
  process.exit(1)
}

// Test database connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ Database connection successful')
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
      console.log(`✅ Frontend URL: ${FRONTEND_URL}`)
    })
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message)
    console.error('Please check your DATABASE_URL in .env file')
    process.exit(1)
  })
