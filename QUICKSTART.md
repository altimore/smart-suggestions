# 🚀 Quick Start Guide

Get SuggestHub running locally in **3 minutes**!

## Prerequisites

- [Bun](https://bun.sh) installed: `curl -fsSL https://bun.sh/install | bash`

## Steps

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Database

The project is configured to use **SQLite** by default (no PostgreSQL needed!):

```bash
# Create the database and run migrations
bun run prisma:migrate

# When prompted, name your migration (e.g., "init")
```

### 3. Run the App

```bash
bun run dev
```

Visit **http://localhost:3000** 🎉

## What's Working Out of the Box

✅ Database (SQLite)
✅ User interface
✅ Basic suggestion CRUD
❌ OAuth login (needs credentials)
❌ AI summaries (needs OpenAI key)

## Optional: Configure OAuth & AI

To enable authentication and AI features:

1. Copy `.env.example` to `.env`
2. Add your credentials:
   - OAuth: Google, GitHub, Apple, Microsoft
   - OpenAI API key for AI summaries

See the [main README](./README.md) for detailed OAuth setup instructions.

## Switching to PostgreSQL

If you want to use PostgreSQL instead:

1. Install PostgreSQL
2. Rename `prisma/schema.postgresql.prisma` to `prisma/schema.prisma`
3. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:pass@localhost:5432/suggesthub"
   ```
4. Run migrations:
   ```bash
   bun run prisma:migrate
   ```

## Useful Commands

```bash
bun run dev              # Start dev server
bun run prisma:studio    # Open database GUI
bun run prisma:migrate   # Run database migrations
bun run build            # Build for production
```

## Need Help?

- Full documentation: [README.md](./README.md)
- OAuth setup guide: See README OAuth section
- Issues? Check the [GitHub repo](https://github.com)

Happy suggesting! 💡
