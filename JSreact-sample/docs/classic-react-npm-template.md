# classic-react-npm-template.md

classic Node/npm/npx flow it is. Below is a compact, professional, production-ready recipe for a React app using only Node + npm + npx (no Volta/nvm/pnpm). It covers local dev, build, deploy options, production considerations for decent scale, and small examples (package.json, Dockerfile, GitHub Actions). I kept it concise and pragmatic.

# Quick start (classic)

```bash
# create app (choose TypeScript template if you want)
npx create-react-app my-app
# or
npx create-react-app my-app --template typescript

cd my-app
# run dev
npm start
# run tests
npm test
# build production bundle
npm run build
```

(Create React App docs). [Create React App](https://create-react-app.dev/docs/getting-started/?utm_source=chatgpt.com)[GitHub](https://github.com/facebook/create-react-app?utm_source=chatgpt.com)

# Project essentials to commit

- `package.json` (scripts, deps)  
- `package-lock.json` (commit lockfile for reproducible installs). [Create React App](https://create-react-app.dev/docs/deployment?utm_source=chatgpt.com)  
- `src/` code and `public/` static assets.

# Minimal professional `package.json` scripts

Add/keep these scripts in `package.json`:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "lint": "eslint 'src/**/*.{js,jsx,ts,tsx}'",
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,json,css,md}'",
    "serve:build": "npx serve -s build"        // local simple static server
  }
}
```

Use `npm ci` in CI for clean reproducible installs when `package-lock.json` is present.

# Environment & secrets (classic CRA)

- CRA reads `.env` files; client env vars must be prefixed `REACT_APP_`. Never put secrets in client-side env vars — store secrets in backend/CI secrets. (CRA docs: deployment/env instructions). [Create React App](https://create-react-app.dev/docs/deployment?utm_source=chatgpt.com)

# Production build & how it behaves

- `npm run build` outputs an optimized `build/` folder with hashed filenames for long-term caching. Serve that folder from any static host or CDN. CRA docs: deployment. [Create React App](https://create-react-app.dev/docs/deployment?utm_source=chatgpt.com)

# Deployment options (pick one)

1.  Vercel — connect your Git repo, it auto-detects CRA and builds; PNG/JPG/JS assets served from edge. (zero-config option available). [Vercel+1](https://vercel.com/docs/frameworks/frontend/create-react-app?utm_source=chatgpt.com)
    
2.  Netlify — connect repo or use `netlify-cli` and set `npm run build` and `build` folder as publish dir. Good CI + previews. [Netlify Docs](https://docs.netlify.com/build/frameworks/framework-setup-guides/react/?utm_source=chatgpt.com)[Netlify](https://www.netlify.com/with/react/?utm_source=chatgpt.com)
    
3.  GitHub Pages — quick for static sites (use `gh-pages` package + `homepage` field and `npm run deploy`). Works for marketing/demo sites. [Create React App](https://create-react-app.dev/docs/deployment?utm_source=chatgpt.com)[DEV Community](https://dev.to/kathryngrayson/deploying-your-cra-react-app-on-github-pages-2614?utm_source=chatgpt.com)
    
4.  Container / VPS — build locally or in CI and serve `build/` via nginx or any CDN-backed static host (example Dockerfile below).

# Example Dockerfile (nginx static)

```dockerfile
# build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve stage
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# Optional: copy a custom nginx.conf to enable gzip and caching headers
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Use this to run on any container host (ECS, GKE, DigitalOcean App Platform, etc.).

# GitHub Actions: build + deploy to GitHub Pages (example)

```yaml
name: build-and-deploy
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          publish_dir: ./build
          publish_branch: gh-pages
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

(There are also simple Vercel/Netlify integrations that skip a custom workflow). [Create React App](https://create-react-app.dev/docs/deployment?utm_source=chatgpt.com)[Vercel](https://vercel.com/guides/deploying-react-with-vercel?utm_source=chatgpt.com)

# Scale-minded frontend practices (CRA + classic stack)

- Code-splitting / route-based chunking: use `React.lazy` + `Suspense` to load routes/components on demand.  
- Use hashed filenames (CRA already does that) and set far-future cache headers on CDNs/servers.  
- Offload large media to a CDN (S3 + CloudFront / other CDN).  
- Critical assets: compress (gzip/brotli) at CDN or server; enable HTTP/2/QUIC on hosting if possible.  
- Monitor bundle size: run `source-map-explorer` or `webpack-bundle-analyzer` on build outputs.  
- Use a lightweight runtime backend (Node/Express, or serverless functions) for APIs, auth, and secret handling — keep client thin.  
- Consider adding a small reverse-proxy (nginx) or edge CDN to terminate TLS and serve static assets.  
If you need SSR, switching to Next.js (or Remix) is the canonical move; CRA is client-side only. (Next.js/Remix = different architecture for SEO/SSR).

# CI/CD notes (classic)

- Use `npm ci` in CI for speed and determinism.  
- Cache `~/.npm` or use built-in actions cache for node modules to speed repeated builds.  
- Keep `package-lock.json` in repo so CI builds reproducibly.

# Small checklist before first production deploy

1.  Commit `package-lock.json`.  
2.  Replace placeholder `<title>` and meta tags in `public/index.html`.  
3.  Configure `.env.production` with non-secret public values. Keep real secrets in backend/CI.  
4.  Run `npm run build`, test `serve -s build` or test Docker image locally.  
5.  Add basic monitoring/analytics and Sentry (or similar) for error reporting.  
6.  Set CSP / security headers at CDN/nginx level.

# TL;DR

- Use `npx create-react-app my-app` → develop with `npm start` → `npm run build` → deploy `build/` to Vercel/Netlify/GitHub Pages or a container host. Commit `package-lock.json`, use `npm ci` in CI, and apply caching/CDN + code-splitting for scale. CRA is classic and fully viable for many production apps; if you later need SSR or advanced routing, consider migrating to Next.js. [Create React App+1](https://create-react-app.dev/docs/getting-started/?utm_source=chatgpt.com)[Vercel](https://vercel.com/docs/frameworks/frontend/create-react-app?utm_source=chatgpt.com)
