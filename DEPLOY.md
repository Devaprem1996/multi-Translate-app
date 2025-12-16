# 🚀 Deployment Guide

This application is ready to be deployed to **Vercel** or **Netlify**. It is a static React application with no backend requirements (the translation logic runs in the browser via a public proxy).

## Option 1: Vercel (Recommended)

1.  **Push to GitHub**:
    *   Initialize git if you haven't:
        ```bash
        git init
        git add .
        git commit -m "Ready for deploy"
        ```
    *   Push this code to a new GitHub repository.

2.  **Deploy**:
    *   Go to [Vercel.com](https://vercel.com) and log in.
    *   Click **"Add New Project"**.
    *   Import your GitHub repository.
    *   **Settings**: Vercel will auto-detect Vite. The default settings are correct:
        *   **Framework Preset**: Vite
        *   **Build Command**: `vite build`
        *   **Output Directory**: `dist`
    *   Click **Deploy**.

## Option 2: Netlify

1.  **Push to GitHub** (same as above).

2.  **Deploy**:
    *   Go to [Netlify.com](https://netlify.com) and log in.
    *   Click **"Add new site"** -> **"Import from existing project"**.
    *   Select GitHub and choose your repo.
    *   **Build Settings**:
        *   **Base directory**: (leave empty)
        *   **Build command**: `vite build`
        *   **Publish directory**: `dist`
    *   Click **Deploy Site**.

## Option 3: Manual Static Hosting

You can also host the `dist` folder on any static file server:

1.  Run `npm run build` locally.
2.  Upload the contents of the `dist` folder to your server (e.g., Hostinger, GoDaddy, GitHub Pages).

---

## ⚠️ Important Note on Proxy

This app currently uses `api.allorigins.win` as a CORS proxy. This is a free public service.
*   **For Production**: It is highly recommended to set up your own simple proxy server if you expect high traffic, as public proxies can have rate limits or downtime.
