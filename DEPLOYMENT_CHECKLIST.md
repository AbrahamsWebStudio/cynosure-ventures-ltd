# Vercel Deployment Checklist

## Pre-Deployment Checklist
- [ ] Code is working locally (`npm run dev`)
- [ ] All dependencies are in `package.json`
- [ ] Environment variables are documented
- [ ] Database is set up and accessible
- [ ] Git repository is created and code is pushed

## Environment Variables to Set in Vercel
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_VERCEL_URL` (will be auto-set)
- [ ] `MPESA_CONSUMER_KEY` (if using MPesa)
- [ ] `MPESA_CONSUMER_SECRET` (if using MPesa)
- [ ] `MPESA_PASSKEY` (if using MPesa)
- [ ] `MPESA_BUSINESS_SHORT_CODE` (if using MPesa)

## Deployment Steps
- [ ] Sign up for Vercel account
- [ ] Import GitHub repository
- [ ] Configure project settings
- [ ] Add environment variables
- [ ] Deploy application
- [ ] Test deployment

## Post-Deployment Checklist
- [ ] Application loads without errors
- [ ] User authentication works
- [ ] Database connections work
- [ ] All features are functional
- [ ] Update Supabase allowed origins
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)

## Performance Checklist
- [ ] Enable Vercel Analytics
- [ ] Check build performance
- [ ] Optimize images
- [ ] Implement caching strategies
- [ ] Monitor error rates

## Security Checklist
- [ ] Environment variables are secure
- [ ] API keys are not exposed
- [ ] Database RLS policies are configured
- [ ] HTTPS is enabled
- [ ] CORS is properly configured

## Monitoring Setup
- [ ] Set up error tracking
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Configure alerts

---

**Deployment URL**: `https://your-project-name.vercel.app`

**Status**: ⏳ Not Started / 🔄 In Progress / ✅ Complete 