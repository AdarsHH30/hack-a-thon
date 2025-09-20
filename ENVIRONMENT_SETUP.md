# Environment Setup for Supabase Authentication

## Quick Setup

1. **Create `.env.local` file** in the frontend directory:
   ```bash
   cd frontend
   touch .env.local
   ```

2. **Add your Supabase credentials** to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be ready (usually takes 1-2 minutes)
4. Go to **Settings** → **API**
5. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Example `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2ODAwMCwiZXhwIjoyMDE0MzQ0MDAwfQ.example-key-here
```

## Testing Without Supabase (Demo Mode)

If you want to test the UI without setting up Supabase:

1. The app will use placeholder values
2. Authentication forms will work but won't actually authenticate
3. You can still see the beautiful UI and navigation flow
4. To enable real authentication, add your Supabase credentials

## Troubleshooting

- **"supabaseUrl is required" error**: Make sure your `.env.local` file exists and has the correct variables
- **Authentication not working**: Verify your Supabase credentials are correct
- **Server won't start**: Check that all dependencies are installed with `npm install`
