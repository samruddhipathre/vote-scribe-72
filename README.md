# VoteHub - Professional Voting Platform

A complete, secure voting platform built with React, TypeScript, Tailwind CSS, and designed for real-time polling and data-driven decision making. This project demonstrates modern web development practices with a focus on user experience, security, and scalability.

## 🚀 Live Demo

**Demo Credentials:**
- Email: `demo@votehub.com`
- Password: `demo123`

## ✨ Features

### Core Functionality
- **🔐 Secure Authentication** - JWT-based user registration and login with input validation
- **📊 Poll Creation** - Rich poll creation interface with multiple options and settings
- **🗳️ Real-time Voting** - Live vote counts with instant result updates
- **📈 Analytics Dashboard** - Comprehensive voting statistics and insights
- **📱 Responsive Design** - Mobile-first design that works on all devices
- **🎨 Modern UI** - Beautiful, accessible interface with dark/light mode support

### Advanced Features
- **Multi-Vote Support** - Configure polls to allow multiple selections per user
- **Vote History** - Track user participation across all polls
- **Poll Scheduling** - Set start and end times for voting periods
- **Real-time Updates** - Live vote count updates without page refresh
- **Export Functionality** - Download poll results as CSV
- **Admin Controls** - Administrative dashboard for poll management
- **Input Validation** - Comprehensive client and server-side validation
- **Audit Logging** - Complete vote tracking with timestamps and metadata

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for high-quality UI components
- **React Hook Form** with Zod validation
- **React Router** for navigation
- **Lucide React** for consistent iconography

### Styling & Design
- **Custom Design System** with CSS variables
- **HSL Color Space** for consistent theming
- **Responsive Breakpoints** for all device sizes
- **Accessibility Features** following WCAG guidelines
- **Modern CSS Grid & Flexbox** layouts

### Development Tools
- **TypeScript** for static type checking
- **ESLint** for code quality
- **Prettier** for code formatting
- **Component-based Architecture** for maintainability

## 📋 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx          # Login/Register form
│   ├── layout/
│   │   └── Navigation.tsx        # Main navigation
│   ├── voting/
│   │   ├── CreatePollForm.tsx    # Poll creation interface
│   │   ├── PollCard.tsx          # Poll preview cards
│   │   └── VotingInterface.tsx   # Main voting interface
│   └── ui/                       # Reusable UI components
├── pages/
│   ├── Index.tsx                 # Home page with poll list
│   ├── PollDetailsPage.tsx       # Individual poll voting
│   ├── CreatePollPage.tsx        # Poll creation page
│   ├── AuthPage.tsx              # Authentication pages
│   └── VoteHistoryPage.tsx       # User vote history
├── types/
│   └── voting.ts                 # TypeScript type definitions
├── utils/
│   └── mockData.ts               # Demo data and API simulation
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── App.tsx                       # Main app component
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone [your-git-url]
   cd votehub-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:8080` to see the application.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve static files
npm run serve
```

## 🎮 Demo Usage

### Quick Start Guide

1. **Visit the homepage** to see available polls
2. **Sign up** with any email/password or use demo credentials
3. **Browse polls** and participate in voting
4. **Create your own poll** using the "Create Poll" button
5. **View results** in real-time as votes are cast
6. **Check vote history** to see your participation

### Demo Features to Try

- **Multi-select voting** - Try the "Mobile App Features" poll
- **Real-time updates** - Vote and watch counts change instantly
- **Poll creation** - Create a poll with multiple options and scheduling
- **Responsive design** - Test on different screen sizes
- **Vote history** - Track your voting activity
- **Admin features** - Access admin dashboard (demo user has admin role)

## 🗄️ Database Schema

The application uses the following data structure (adaptable to any database):

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Polls Table
```sql
CREATE TABLE polls (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    creator_id UUID REFERENCES users(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    max_votes_per_user INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    total_votes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Poll Options Table
```sql
CREATE TABLE poll_options (
    id UUID PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    text VARCHAR(100) NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Votes Table (Audit Log)
```sql
CREATE TABLE votes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    poll_id UUID REFERENCES polls(id),
    option_id UUID REFERENCES poll_options(id),
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Recommended Indexes
```sql
CREATE INDEX idx_polls_creator ON polls(creator_id);
CREATE INDEX idx_polls_active ON polls(is_active, end_date);
CREATE INDEX idx_votes_user_poll ON votes(user_id, poll_id);
CREATE INDEX idx_votes_poll ON votes(poll_id);
CREATE INDEX idx_options_poll ON poll_options(poll_id);
```

## 🔒 Security Features

### Input Validation
- **Zod schemas** for all form inputs
- **Length limits** on all text fields
- **Email validation** for user registration
- **Date validation** for poll scheduling
- **Rate limiting** considerations for production

### Authentication Security
- **Password hashing** with bcrypt (production implementation)
- **Session management** with secure cookies
- **JWT tokens** with refresh token rotation
- **CSRF protection** for state-changing operations

### Data Protection
- **SQL injection prevention** through parameterized queries
- **XSS protection** through input sanitization
- **Vote integrity** with audit logging
- **User privacy** with anonymized analytics

## 🎨 Design System

### Color Palette
```css
:root {
    --primary: 220 85% 45%;           /* Professional blue */
    --success: 142 76% 36%;           /* Success green */
    --warning: 38 92% 50%;            /* Warning orange */
    --destructive: 0 84% 60%;         /* Error red */
}
```

### Typography Scale
- **Headlines**: Bold, large text for section headers
- **Body text**: Readable font sizes with proper line height
- **Captions**: Smaller text for metadata and descriptions
- **Interactive elements**: Medium weight for buttons and links

### Component Variants
- **Primary buttons** with gradient backgrounds
- **Vote cards** with hover effects and transitions
- **Progress bars** for real-time vote visualization
- **Badges** for status indicators and categories

## 🧪 Testing Strategy

### Recommended Tests

1. **Unit Tests** (Jest + Testing Library)
   ```bash
   # Test poll creation
   npm test CreatePollForm
   
   # Test voting logic
   npm test VotingInterface
   
   # Test authentication
   npm test AuthForm
   ```

2. **Integration Tests**
   ```bash
   # Test complete voting flow
   npm test voting-flow
   
   # Test poll management
   npm test poll-management
   ```

3. **E2E Tests** (Playwright/Cypress)
   ```javascript
   // Example test
   test('user can create and vote on poll', async () => {
     await page.goto('/register');
     await page.fill('[name="email"]', 'test@example.com');
     // ... continue test flow
   });
   ```

## 📊 API Endpoints (Reference)

### Authentication
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
POST /api/auth/refresh      # Token refresh
```

### Polls Management
```
GET    /api/polls           # List all polls
POST   /api/polls           # Create new poll
GET    /api/polls/:id       # Get specific poll
PUT    /api/polls/:id       # Update poll (admin only)
DELETE /api/polls/:id       # Delete poll (admin only)
```

### Voting
```
POST   /api/polls/:id/vote  # Cast vote
GET    /api/polls/:id/votes # Get poll results
GET    /api/users/votes     # User's vote history
```

### Export/Analytics
```
GET    /api/polls/:id/export    # Export results as CSV
GET    /api/analytics/stats     # Platform statistics
```

## 🚀 Production Deployment

### Environment Variables
Create a `.env.production` file:
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/votehub

# Authentication
JWT_SECRET=your-super-secure-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
SESSION_SECRET=your-session-secret

# Email (for notifications)
SMTP_HOST=smtp.example.com
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Analytics (optional)
GOOGLE_ANALYTICS_ID=GA-XXXXX-X

# Rate Limiting
REDIS_URL=redis://localhost:6379
```

### Security Checklist for Production
- [ ] Use HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Set up CORS properly
- [ ] Enable CSRF protection
- [ ] Configure security headers
- [ ] Set up monitoring and logging
- [ ] Regular security audits
- [ ] Database backup strategy
- [ ] User data encryption at rest

### Performance Optimizations
- **Code splitting** for reduced bundle size
- **Image optimization** for faster loading
- **CDN deployment** for global distribution
- **Database indexing** for query performance
- **Caching strategy** for frequently accessed data

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript strict mode
2. Use semantic commit messages
3. Write tests for new features
4. Update documentation for API changes
5. Follow the established design system

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Write self-documenting code
- Include JSDoc for complex functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛡️ Security Notes

**⚠️ Important for Production:**
- Never use the demo credentials in production
- Always use environment variables for secrets
- Implement proper rate limiting
- Regular security audits are recommended
- This demo uses mock data - integrate with a real database for production use

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](link-to-issues) section
2. Review the documentation above
3. Create a new issue with detailed information

---

**Built with ❤️ using modern web technologies for a secure, scalable voting experience.**