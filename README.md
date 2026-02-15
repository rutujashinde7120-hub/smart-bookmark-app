# Smart Bookmark App

## Description
This is a web application that allows users to log in with Google, add, view, and delete bookmarks. It is built using *Next.js, **Supabase, and **Tailwind CSS*.

## Live App
[View the live app here](https://smart-bookmark-app-26zs.vercel.app/)

## GitHub Repository
[Smart Bookmark App Repository](https://github.com/rutujashinde7120-hub/smart-bookmark-app)

## Tech Stack
- *Frontend:* Next.js, React, Tailwind CSS
- *Backend / Database:* Supabase
- *Authentication:* Google OAuth via Supabase

## Challenges I Faced
1. *Supabase environment variables:*  
   Initially, the app didn’t work on Vercel because the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY were not correctly added to Vercel’s environment variables.

2. *Prerendering error on Next.js:*  
   I kept getting Error: supabaseKey is required during build.  
   *Solution:* Ensured environment variables were correctly prefixed with NEXT_PUBLIC_ and added them in Vercel under Environment Variables.

3. *Deployment issues with Vercel:*  
   At first, login worked locally but failed on the live URL because of the redirect URL in Supabase authentication settings.  
   *Solution:* Added the correct Vercel URL as the Redirect URL in Supabase authentication configuration.

## How I Solved the Problems
- Verified all *environment variables* in .env.local and Vercel.
- Used the *App Router* structure correctly in Next.js.
- Ensured the *live Vercel URL* is added as the redirect URL for Google OAuth.
- Tested login and bookmark functionalities before submitting.

## GitHub Repository
[View the code here](https://github.com/rutujashinde7120-hub/smart-bookmark-app)

## How to Run Locally

```bash
npm install
npm run dev