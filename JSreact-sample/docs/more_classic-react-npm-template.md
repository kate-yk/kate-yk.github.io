# classic-react-npm-template.md

A minimal, classic Node + npm + npx React repo template with a Dockerfile and a GitHub Actions workflow that builds, tests, and optionally pushes a Docker image to Docker Hub. Drop these files into a new repository created with `npx create-react-app my-app` (or use the provided files to replace/augment a fresh CRA project).

---
## Files included (paste into repo root)
- `package.json` (recommended scripts and dev deps)
- `.eslintrc.json`
- `.prettierrc`
- `Dockerfile` (multi-stage build -> nginx static)
- `.dockerignore`
- `.github/workflows/ci-docker.yml` (CI: npm ci, build, test, build docker image, push to Docker Hub)
- `README.md` (basic instructions)
- `nginx.conf` (optional basic nginx config for caching & gzip)
- notes on secrets for CI

---
## package.json (drop into your project or merge with CRA-generated package.json)
```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=16"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject",
    "lint": "eslint 'src/**/*.{js,jsx,ts,tsx}' || true",
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,json,css,md}'",
    "serve:build": "npx serve -s build",
    "docker:build": "docker build -t my-app:latest ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "eslint": "^8.43.0",
    "eslint-plugin-react": "^7.32.2",
    "prettier": "^3.0.0"
  }
}
```

---
## .eslintrc.json
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parserOptions": {
    "ecmaFeatures": { "jsx": true },
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "settings": { "react": { "version": "detect" } },
  "rules": {}
}
```

---
## .prettierrc
```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

---
## Dockerfile (multi-stage, static build served by nginx)
```dockerfile
# Stage 1 - build the React app
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2 - serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# Optional: custom nginx config (uncomment if you add nginx.conf to repo)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Notes: `npm ci` is used for CI-style reproducible installs. If you created project with `create-react-app`, keep the CRA build pipeline.

---
## .dockerignore
```
node_modules
build
.git
.gitignore
Dockerfile
npm-debug.log
README.md
```
---
## .github/workflows/ci-docker.yml
Create directory `.github/workflows/` and add this file. This workflow runs on pushes and pull requests to `main`. It builds, runs tests, builds Docker image, and pushes to Docker Hub if credentials are set.

```yaml
name: CI - build & docker

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci --legacy-peer-deps

      - name: Run lint
        run: npm run lint || true

      - name: Run tests
        run: npm test -- --watchAll=false

      - name: Build
        run: npm run build

      - name: Build Docker image
        run: |
          docker build -t ${{ env.DOCKER_IMAGE }} .
        env:
          DOCKER_IMAGE: ${{ secrets.DOCKERHUB_USERNAME }}/my-app:${{ github.sha }}

      - name: Log in to Docker Hub
        if: secrets.DOCKERHUB_USERNAME && secrets.DOCKERHUB_TOKEN
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Push to Docker Hub
        if: secrets.DOCKERHUB_USERNAME && secrets.DOCKERHUB_TOKEN
        run: |
          docker tag ${{ secrets.DOCKERHUB_USERNAME }}/my-app:${{ github.sha }} ${{ secrets.DOCKERHUB_USERNAME }}/my-app:latest
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/my-app:${{ github.sha }}
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/my-app:latest
```

### CI notes / Secrets
- Set repository secrets named `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` (Docker Hub Personal Access Token) to enable pushing images. The workflow checks for secrets before login/push steps; it still builds artifacts and runs tests without secrets.

---
## nginx.conf (optional; improves caching & gzip)
```nginx
server {
  listen 80;
  server_name _;
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
  # caching for static assets
  location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|ico|woff2|woff|ttf)$ {
    try_files $uri =404;
    expires 30d;
    add_header Cache-Control "public, immutable";
  }
}
```

---
## README.md (quick usage)
```
# my-app (classic node + npm + npx flow)

## local dev
npx create-react-app my-app
cd my-app
npm start

## build locally
npm run build
npx serve -s build

## docker build & run locally
docker build -t my-app:local .
docker run -p 8080:80 my-app:local

## CI via GitHub Actions
- To enable automatic image push to Docker Hub, add secrets DOCKERHUB_USERNAME and DOCKERHUB_TOKEN to your repo settings.
- Workflow will run on pushes to main and on pull requests.
```

---
## Additional notes / optional extras
- Consider adding `source-map-explorer` or `react-dev-utils/webpackHotDevClient` if you want bundle analysis.
- For production, place a CDN (CloudFront) in front of static files for global scale.
- Keep client-side env variables public-only (prefix `REACT_APP_`) and put secrets in backend or CI secrets.
- If you prefer building a static deploy to Netlify/Vercel/GitHub Pages instead of Docker, swap the CI step to upload `build/` to those providers.

---
## How to use this template
1. Create a new repo (or use an existing CRA repo). 2. Place files above into your repo root and commit. 3. Push to GitHub and enable the workflow. 4. (Optional) set Docker Hub secrets to enable pushing images.

---
EOF
