# Tifferend — website

A bold, colourful, motion-led website for Tifferend, a creative branding studio. It has three pages: Home, the My Mithila case study and Careers.

```bash
npm install
npm run dev       # develop at http://localhost:5173
npm run build     # static site in dist/
npm run preview   # serve dist/ at http://localhost:4173
npm test          # layout + interaction QA (needs the preview running)
npm run perf      # transfer / LCP / CLS
node tests/smoke.mjs <url>/   # deployment smoke test (any base URL ending in /)
```

## Deployment

Every push to `main` is built and deployed to GitHub Pages by `.github/workflows/deploy.yml`, using the official Pages actions. You can also run it manually from the Actions tab (`workflow_dispatch`).

- **Live site:** https://spectertechnologies9-automation.github.io/tifferend-/
- **One-time setup:** in the repo, go to Settings → Pages → Build and deployment and set Source to **GitHub Actions**.
- **Base path:** Vite builds with `base: './'`, so every asset and link is relative. The same `dist/` works at `/tifferend-/`, at a custom domain root, or from any sub-folder. No per-host config is needed.

## Docs

- **Project state, test results, next steps:** `PROJECT_STATUS.md`
- **Reference analysis and art direction:** `docs/`
- **Rules for future work:** `CLAUDE.md`
