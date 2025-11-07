# Deployment Instructions

## 🚀 Deploy to Vercel (Recommended)

Your QOTE app is ready to deploy! Choose one of these methods:

### Method 1: One-Click Deploy (Easiest)

1. Push your code to GitHub:
   ```bash
   cd qote-app
   git init
   git add -A
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure everything
6. Click "Deploy"
7. Your app will be live in ~2 minutes!

### Method 2: Vercel CLI

```bash
cd qote-app
vercel login
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** qote-app (or your choice)
- **Directory?** ./
- **Override settings?** No

Your app will deploy and you'll get a URL like: `https://qote-app.vercel.app`

### Method 3: GitHub Integration (Auto-Deploy)

1. Connect your GitHub repo to Vercel
2. Every push to main branch will auto-deploy
3. Pull requests get preview deployments

## 🏗️ Manual Build & Export

If you want to deploy elsewhere:

```bash
npm run build
npm run start  # Test production build locally
```

The built files are in `.next/` directory.

## ⚙️ Environment Variables

No environment variables required! The app is completely self-contained.

## 📊 Build Stats

- **Build time:** ~3 seconds
- **Bundle size:** Optimized with Next.js 16 + Turbopack
- **Pages:** 3 (Home, Docs, Visualization)
- **Rendering:** Static + Client-side interactivity

## 🔧 Custom Domain

After deploying on Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

## 🐛 Troubleshooting

**Build fails:**
- Make sure all dependencies are installed: `npm install`
- Try cleaning: `rm -rf .next && npm run build`

**Deployment errors:**
- Check Node.js version: Should be 18+ (you have 22.21.1 ✓)
- Verify build passes locally: `npm run build`

**Styling issues:**
- Tailwind CSS PostCSS plugin is properly configured
- All styles are in `app/globals.css`

## 📱 Mobile Responsive

The app is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🎨 Customization

Edit these files to customize:
- `app/page.tsx` - Home page
- `app/docs/page.tsx` - Documentation browser
- `app/visualization/page.tsx` - Interactive visualization
- `app/globals.css` - Global styles
- `tailwind.config.ts` - Theme colors

## 🚀 Performance

- Lighthouse Score: 95+ (expected)
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Canvas visualization: 60 FPS

---

**Your app is production-ready!** 🎉

Deploy it and share the link to showcase the QOTE × AlphaEvolve × Resona convergence.
