# Vercel Deployment Troubleshooting

If you're experiencing "backend disconnected" issues on Vercel, follow these steps:

## 1. Check Deployment Status

- Go to your Vercel dashboard
- Check if the deployment is complete and successful
- Look for any build errors in the deployment logs

## 2. Verify API Routes

Your API routes should be accessible at:
- `/api` - Main API information
- `/api/health` - Health check
- `/api/execute` - Code execution

## 3. Test API Endpoints

Use the test script to verify your endpoints:

```bash
# Test locally
node test-api.js

# Test on Vercel (replace with your actual Vercel URL)
BASE_URL=https://your-app.vercel.app node test-api.js
```

## 4. Common Issues & Solutions

### CORS Issues
- ✅ Fixed: Added CORS headers to all API endpoints
- ✅ Fixed: Added OPTIONS method handling for preflight requests

### Function Timeouts
- ✅ Fixed: Increased function timeouts in vercel.json
- Execute function: 30 seconds
- Health/Index functions: 10 seconds

### API Route Configuration
- ✅ Fixed: Proper routing in vercel.json
- API routes go to `/api/*`
- All other routes go to the React app

## 5. Debugging Steps

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for network errors
   - Check console logs for connection status

2. **Check Network Tab**
   - Look for failed requests to `/api/*` endpoints
   - Check response status codes
   - Verify request/response headers

3. **Test Individual Endpoints**
   - Try accessing `/api/health` directly in browser
   - Check if `/api` returns the welcome message

## 6. Environment Variables

Make sure these are set in Vercel:
- `NODE_ENV=production`

## 7. Redeployment

If issues persist:
1. Make a small change to trigger redeployment
2. Wait for deployment to complete
3. Clear browser cache
4. Test again

## 8. Contact Support

If none of the above works:
1. Check Vercel deployment logs
2. Verify your Vercel plan supports serverless functions
3. Contact Vercel support with deployment logs

## 9. Local Development

To test locally:
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd client && npm start

# Terminal 3: Test API
node test-api.js
```

## 10. Expected Behavior

- ✅ Frontend should show "Backend Connected" status
- ✅ JavaScript code execution should work fully
- ✅ Python/Java/C++ should show demo output
- ✅ All API endpoints should return proper responses
