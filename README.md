# SuggestHub 🚀

A modern, community-driven suggestion platform built with Nuxt 4, where users can share ideas, vote on suggestions, and collaborate on product development.

## ✨ Features

- **User Authentication**: OAuth integration with Google, Apple, Microsoft/GitHub
- **Smart Suggestions**: Create and manage software feature requests and product ideas
- **Upvoting System**: Vote on suggestions to prioritize what matters most
- **Rich Comments**: Nested comment threads for detailed discussions
- **AI-Powered Summaries**: Automatic summarization of comment discussions
- **Admin Dashboard**: Comprehensive tools for suggestion management
- **Media Support**: Attach images, videos, and reference links
- **Search & Filters**: Advanced filtering and search capabilities
- **Real-time Updates**: Instant reflection of votes and comments

## 🛠️ Tech Stack

- **Framework**: Nuxt 4
- **UI**: TailwindCSS with custom components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI GPT-4 for comment summarization
- **TypeScript**: Full type safety

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OAuth credentials (Google, Apple, GitHub, Microsoft)
- OpenAI API key (for AI summaries)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd smart-suggestions
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/suggesthub"

# Auth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secret-key-here"
AUTH_ORIGIN="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Apple OAuth
APPLE_CLIENT_ID="your-apple-client-id"
APPLE_CLIENT_SECRET="your-apple-client-secret"

# Microsoft OAuth
MICROSOFT_CLIENT_ID="your-microsoft-client-id"
MICROSOFT_CLIENT_SECRET="your-microsoft-client-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔐 OAuth Setup Guide

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`

### Apple OAuth

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Create a new Sign in with Apple service
3. Configure redirect URIs

### Microsoft OAuth

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Set redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`

## 📂 Project Structure

```
smart-suggestions/
├── components/           # Vue components
│   └── suggestions/     # Suggestion-specific components
├── layouts/             # Nuxt layouts
├── pages/               # Application pages
│   ├── admin/          # Admin dashboard
│   ├── auth/           # Authentication pages
│   └── suggestions/    # Suggestion pages
├── prisma/             # Database schema and migrations
├── server/             # Server-side code
│   ├── api/           # API endpoints
│   └── utils/         # Server utilities
├── middleware/         # Route middleware
├── nuxt.config.ts     # Nuxt configuration
└── package.json       # Dependencies
```

## 🎨 Key Components

### User Roles

- **USER**: Default role, can create suggestions, vote, and comment
- **ADMIN**: Full access including status management and AI summary generation

### Suggestion Types

- **SOFTWARE_FEATURE**: Ideas for software features and improvements
- **PRODUCT_IDEA**: New product proposals with media attachments

### Suggestion Statuses

- **PENDING**: Newly created, awaiting review
- **IN_REVIEW**: Under admin consideration
- **APPROVED**: Approved for development
- **REJECTED**: Not selected for development
- **IMPLEMENTED**: Successfully implemented

## 📡 API Endpoints

### Suggestions

- `GET /api/suggestions` - List suggestions with filters
- `GET /api/suggestions/:id` - Get single suggestion
- `POST /api/suggestions` - Create new suggestion
- `PUT /api/suggestions/:id` - Update suggestion
- `DELETE /api/suggestions/:id` - Delete suggestion
- `POST /api/suggestions/:id/summarize` - Generate AI summary (admin only)

### Votes

- `POST /api/votes` - Toggle vote on suggestion

### Comments

- `POST /api/comments` - Create comment or reply
- `DELETE /api/comments/:id` - Delete comment

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
```

## 🎯 Use Cases

### 1. Software Development

Perfect for collecting feature requests from users:
- Bug reports and fixes
- UI/UX improvements
- New functionality requests
- Performance enhancements

### 2. Product Development

Ideal for e-commerce and product teams:
- New product ideas
- Product variations
- Customer feedback
- Market research

## 🔒 Security Features

- Secure OAuth authentication
- Row-level security with Prisma
- Input validation with Zod
- CSRF protection
- Secure session management

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

The app is ready for deployment to platforms like:
- Vercel
- Netlify
- Railway
- Render

Make sure to:
1. Set all environment variables
2. Configure database connection
3. Set up OAuth redirect URIs for production domain

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🎉 Credits

Built with love using Nuxt 4, TailwindCSS, and modern web technologies.

---

**Need help?** Open an issue or contact the maintainers.
