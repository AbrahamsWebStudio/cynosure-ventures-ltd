# Vercel Deployment Guide - Step by Step

## Prerequisites
1. **GitHub Account**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Supabase Project**: Your Supabase project should be set up and running

## Step 1: Prepare Your Code for Deployment

### 1.1 Environment Variables Setup
Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Vercel Configuration
NEXT_PUBLIC_VERCEL_URL=your_vercel_deployment_url

# MPesa Configuration (if using)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_BUSINESS_SHORT_CODE=your_business_short_code
```

### 1.2 Ensure Your Code is Ready
- ✅ Your `package.json` has all necessary dependencies
- ✅ Your `next.config.ts` is properly configured
- ✅ All imports use the correct paths
- ✅ Your database is set up and accessible

## Step 2: Push Your Code to GitHub

### 2.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it `cynosure-ventures-ltd`
4. Make it public or private (your choice)
5. Don't initialize with README (since you already have one)

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/cynosure-ventures-ltd.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Complete the onboarding process

### 3.2 Import Your Project
1. Click "New Project"
2. Select "Import Git Repository"
3. Choose your `cynosure-ventures-ltd` repository
4. Click "Import"

### 3.3 Configure Project Settings
Vercel will automatically detect it's a Next.js project. Configure these settings:

**Project Name**: `cynosure-ventures-ltd` (or your preferred name)

**Framework Preset**: Next.js (should be auto-detected)

**Root Directory**: `./` (leave as default)

**Build Command**: `npm run build` (should be auto-detected)

**Output Directory**: `.next` (should be auto-detected)

**Install Command**: `npm install` (should be auto-detected)

### 3.4 Add Environment Variables
In the Vercel dashboard, go to your project settings:

1. Click on your project
2. Go to "Settings" tab
3. Click "Environment Variables"
4. Add each variable from your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL = your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_actual_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_actual_service_role_key
```

**Important**: 
- Variables starting with `NEXT_PUBLIC_` will be available in the browser
- Other variables are only available on the server
- Make sure to use your actual Supabase credentials

### 3.5 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your application
3. Wait for the build to complete (usually 2-5 minutes)

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Settings
1. Go to your Supabase dashboard
2. Navigate to "Settings" → "API"
3. Add your Vercel domain to the allowed origins:
   - `https://your-project-name.vercel.app`
   - `https://your-custom-domain.com` (if you have one)

### 4.2 Test Your Application
1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Test all major functionality:
   - User registration/login
   - Product management
   - Finance features
   - Payment processing

### 4.3 Set Up Custom Domain (Optional)
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Step 5: Continuous Deployment

### 5.1 Automatic Deployments
- Every time you push to the `main` branch, Vercel will automatically redeploy
- You can also set up preview deployments for pull requests

### 5.2 Environment Management
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from other branches/PRs
- **Development**: Use `vercel dev` for local development

## Troubleshooting Common Issues

### Build Errors
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation

### Environment Variables
1. Make sure all required env vars are set in Vercel
2. Check that variable names match exactly
3. Redeploy after adding new environment variables

### Database Connection
1. Verify Supabase URL and keys are correct
2. Check Supabase RLS (Row Level Security) policies
3. Ensure database is accessible from Vercel's servers

### Performance Issues
1. Enable Vercel Analytics
2. Use Next.js Image optimization
3. Implement proper caching strategies

## Useful Vercel Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from command line
vercel

# Pull environment variables
vercel env pull .env.local

# View deployment logs
vercel logs
```

## Next Steps

1. **Monitor Performance**: Use Vercel Analytics
2. **Set Up Monitoring**: Configure error tracking
3. **Optimize**: Implement caching and CDN strategies
4. **Scale**: Upgrade to Vercel Pro if needed

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Your application should now be live at**: `https://your-project-name.vercel.app`

Remember to replace all placeholder values with your actual credentials and URLs! 