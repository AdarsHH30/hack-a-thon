# Supabase Authentication Setup

## Quick Start

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Get Your Credentials**
   - In your Supabase dashboard, go to Settings > API
   - Copy the Project URL and anon/public key

3. **Set Environment Variables**
   - Create a `.env.local` file in the frontend directory
   - Add your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   **Important**: Without these environment variables, the app will use placeholder values and authentication won't work properly.

4. **Start the Application**
   ```bash
   npm run dev
   ```

## Features Implemented

✅ **Authentication Flow**
- User registration with email/password
- User login with email/password
- Protected routes for job-descriptions and job-list
- Automatic redirect to login for unauthenticated users
- Logout functionality

✅ **UI Components**
- Beautiful shadcn/ui components (Card, Input, Button)
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Loading states and error handling

✅ **Routes**
- `/` → HeroPage (public)
- `/student-login` → StudentLogin (public)
- `/register` → RegisterPage (public)
- `/job-descriptions` → JobDescription (protected)
- `/job-list` → JobList (protected)

## Testing the Flow

1. **Visit Homepage** (`http://localhost:3000`)
   - Click "Login as Student" or "Job List"

2. **Register New User**
   - Go to `/register`
   - Fill in name, email, password
   - Check your email for verification (if email confirmation is enabled)

3. **Login**
   - Go to `/student-login`
   - Enter your credentials
   - You'll be redirected to `/job-descriptions`

4. **Protected Routes**
   - Try accessing `/job-descriptions` or `/job-list` without login
   - You'll be redirected to login page

5. **Logout**
   - Click the logout button in the top-right corner
   - You'll be redirected to the login page

## Notes

- The authentication uses Supabase's built-in auth system
- Email verification is optional (can be configured in Supabase dashboard)
- All protected routes automatically redirect unauthenticated users
- User session persists across browser refreshes
