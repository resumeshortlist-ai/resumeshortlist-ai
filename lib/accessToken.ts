21:50:23.700 Running build in Portland, USA (West) – pdx1
21:50:23.701 Build machine configuration: 2 cores, 8 GB
21:50:23.818 Cloning github.com/resumeshortlist-ai/resumeshortlist-ai (Branch: main, Commit: 54180d2)
21:50:24.334 Cloning completed: 515.000ms
21:50:24.482 Restored build cache from previous deployment (3zRUVwLUJ74kquNpYsQXrQrykxbP)
21:50:24.864 Running "vercel build"
21:50:25.379 Vercel CLI 50.0.1
21:50:25.675 Running "install" command: `npm install --include=dev`...
21:50:27.639 
21:50:27.641 up to date, audited 49 packages in 2s
21:50:27.641 
21:50:27.642 14 packages are looking for funding
21:50:27.642   run `npm fund` for details
21:50:27.642 
21:50:27.642 found 0 vulnerabilities
21:50:27.673 Detected Next.js version: 14.2.35
21:50:27.676 Running "npm run build"
21:50:27.775 
21:50:27.775 > build
21:50:27.775 > next build
21:50:27.775 
21:50:28.425   ▲ Next.js 14.2.35
21:50:28.426 
21:50:28.443    Creating an optimized production build ...
21:50:31.042 Failed to compile.
21:50:31.042 
21:50:31.044 ./app/api/access/issue/route.ts
21:50:31.044 Module not found: Can't resolve '@/lib/accessToken'
21:50:31.044 
21:50:31.044 https://nextjs.org/docs/messages/module-not-found
21:50:31.044 
21:50:31.044 ./app/api/resume/upload/route.ts
21:50:31.044 Module not found: Can't resolve '@vercel/blob'
21:50:31.044 
21:50:31.044 https://nextjs.org/docs/messages/module-not-found
21:50:31.044 
21:50:31.044 ./app/api/resume/upload/route.ts
21:50:31.045 Module not found: Can't resolve '@/lib/accessToken'
21:50:31.045 
21:50:31.045 https://nextjs.org/docs/messages/module-not-found
21:50:31.045 
21:50:31.045 ./app/app/page.tsx
21:50:31.045 Module not found: Can't resolve '@/lib/accessToken'
21:50:31.045 
21:50:31.045 https://nextjs.org/docs/messages/module-not-found
21:50:31.046 
21:50:31.062 
21:50:31.062 > Build failed because of webpack errors
21:50:31.089 Error: Command "npm run build" exited with 1
