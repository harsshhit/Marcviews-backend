# Vercel Deployment Guide

This guide explains how to deploy the backend to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. [Git](https://git-scm.com/) installed on your machine
3. The [Vercel CLI](https://vercel.com/docs/cli) (optional but recommended)

## Deployment Steps

### 1. Push your code to GitHub

Make sure your code is pushed to a GitHub repository.

### 2. Set up Environment Variables in Vercel

Before deploying, you need to set up your environment variables in Vercel:

1. Go to your Vercel dashboard
2. Create a new project or select your existing project
3. Go to "Settings" > "Environment Variables"
4. Add the following environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `JWT_EXPIRES_IN`: JWT token expiration time in days
   - `JWT_COOKIE_EXPIRES_IN`: Cookie expiration time in days
   - Any other environment variables your application needs

### 3. Deploy to Vercel

#### Option 1: Deploy from the Vercel Dashboard

1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Set the Framework Preset to "Other"
   - Set the Root Directory to "backend" (if your backend is in a subdirectory)
   - Set the Build Command to `npm install`
   - Set the Output Directory to `.`
5. Click "Deploy"

#### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Navigate to your project directory:
   ```
   cd path/to/your/project
   ```

3. Run the deployment command:
   ```
   vercel
   ```

4. Follow the prompts to configure your deployment

## Vercel Configuration

The `vercel.json` file in this directory configures how Vercel deploys your application:

- It specifies that `server.js` is the entry point
- It sets up routes for API endpoints with appropriate CORS headers
- It configures environment variables

## Troubleshooting

If you encounter issues with your deployment:

1. Check the Vercel deployment logs
2. Ensure all required environment variables are set
3. Verify that your MongoDB connection string is correct and accessible from Vercel
4. Make sure your server.js file exports the Express app (module.exports = app)

## Local Development vs. Production

The server.js file has been modified to work both locally and in production:

- In development mode, it starts a server on the specified port
- In production (Vercel), it exports the Express app for serverless deployment

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Deploying Express.js to Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
