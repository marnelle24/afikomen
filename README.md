# Afikomen App

A responsive web application where users can log in, input a Bible verse, and receive both the verse text and AI-generated insights including context, modern reflection, weekly action plans, and prayers.

## Features

### 🔐 Authentication
- User registration and login
- Secure JWT-based session management
- Protected routes and API endpoints

### 📖 Main Features
- **Free-Form Verse Input**: Enter Bible verses in ANY format (e.g., "John 3:16", "john 3 16", "John chapter 3 verse 16")
- **Multiple Bible Versions**: Support for NIV, KJV, and ESV
- **AI-Powered Insights**: Structured analysis including:
  - Verse content
  - Historical context
  - Modern reflection
  - 7-day weekly action plan
  - Short prayer
- **Verse History**: Save and revisit past verse reflections
- **Responsive Design**: Mobile-first UI with Tailwind CSS

### 🎨 UI/UX
- Clean, modern interface
- Mobile-responsive design
- Intuitive navigation
- Beautiful card layouts for results
- 7-day action plan grid display

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL or PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Verse & AI Integration**: OpenAI GPT-4 (for both verse fetching and insights)
- **Icons**: Lucide React

## Database Configuration

This app supports both **MySQL** and **PostgreSQL** databases. You can switch between them using environment variables.

### Environment Variables

```bash
# Database provider - either "mysql" or "postgresql"
DATABASE_PROVIDER=mysql

# Database connection URL
DATABASE_URL="your-database-connection-string"
DIRECT_URL="your-database-connection-string"

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here
```

### Quick Setup

```bash
# Interactive database setup
npm run db:setup

# Or quick setup for specific database
npm run db:mysql      # For MySQL
npm run db:postgres   # For PostgreSQL
```

See [DATABASE_CONFIG.md](./DATABASE_CONFIG.md) for detailed configuration examples.

## Prerequisites

- Node.js 18+ 
- MySQL database (or PostgreSQL)
- OpenAI API key

<!-- ## Installation -->
<!-- 
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd afikomen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mysql://root:root@localhost:3306/bible_verse_app"

   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # OpenAI API Key (used for both verse fetching and AI insights)
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) -->

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Verses
- `POST /api/verse` - Process a Bible verse and generate insights
- `GET /api/verses` - Get user's saved verses

## Usage

1. **Create an Account**: Register with your email and password
2. **Explore Verses**: Enter a Bible verse in ANY format you prefer:
   - Standard format: "John 3:16"
   - Casual format: "john 3 16" 
   - Natural language: "John chapter 3 verse 16"
3. **Choose Version**: Select from NIV, KJV, or ESV
4. **Get Insights**: Receive AI-generated analysis including:
   - Verse content
   - Historical context
   - Modern application
   - 7-day action plan
   - Prayer
5. **Save & Revisit**: All insights are automatically saved to your history

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── verse/         # Verse processing endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── LoginForm.tsx      # Login form
│   ├── RegisterForm.tsx   # Registration form
│   ├── VerseForm.tsx      # Verse input form
│   ├── VerseResults.tsx   # Results display
│   └── VerseHistory.tsx   # History component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
└── lib/                   # Utility libraries
    ├── ai.ts              # OpenAI integration
    ├── auth.ts            # Authentication utilities
    ├── bible-api.ts       # Bible API integration
    └── db.ts              # Database connection
```

## Environment Setup

### Database (PostgreSQL)
1. Install PostgreSQL locally or use a cloud service
2. Create a database named `bible_verse_app`
3. Update the `DATABASE_URL` in your `.env.local`

### OpenAI API
1. Sign up at [OpenAI](https://openai.com)
2. Create an API key
3. Add it to your `.env.local` as `OPENAI_API_KEY`
4. Note: OpenAI is used for both fetching Bible verses and generating AI insights

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database for Production
- Use a managed PostgreSQL service like:
  - Vercel Postgres
  - Supabase
  - PlanetScale
  - Railway

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.