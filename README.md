# docs-template

A basic [Astro](https://astro.build) template for building documentation sites under IgniteUI.

## 🚀 Features

- ⚡ Astro static site generation
- 📄 Content Collections for structured docs
- 🎨 Base layout with slot support
- 🟦 TypeScript support out of the box
- 📦 Ready to extend with any UI framework

## 📋 Prerequisites

- [Node.js](https://nodejs.org) v18.17.1 or higher
- [npm](https://www.npmjs.com/) v9+ (or pnpm / yarn)

## 🛠️ Getting Started

### 1. Use this template

Click **"Use this template"** on GitHub, or clone it directly:

```bash
git clone https://github.com/IgniteUI/docs-template.git my-docs
cd my-docs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

## 📁 Project Structure

```
docs-template/
├── public/                  # Static assets (images, fonts, etc.)
├── src/
│   ├── content/
│   │   ├── config.ts        # Content collections schema
│   │   └── docs/            # Markdown/MDX documentation pages
│   ├── layouts/
│   │   └── BaseLayout.astro # Base page layout
│   └── pages/
│       └── index.astro      # Homepage
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## 📝 Adding Documentation Pages

Add `.md` or `.mdx` files to `src/content/docs/`:

```markdown
---
title: My Page
description: A short description.
---

# My Page

Content goes here.
```

They will automatically be picked up by Astro's Content Collections.

## 🧞 Available Scripts

| Command           | Action                                       |
|-------------------|----------------------------------------------|
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build production site to `./dist/`           |
| `npm run preview` | Preview the production build locally         |
| `npm run astro`   | Run Astro CLI commands                       |

## 🚢 Deployment

Run the build command and deploy the `dist/` directory to any static hosting provider:

```bash
npm run build
```

Supports: GitHub Pages, Netlify, Vercel, Azure Static Web Apps, and more.

## 🤝 Contributing

This is an internal IgniteUI template. For changes, open a pull request and request a review from the docs team.

## 📄 License

Internal use only — © IgniteUI / Infragistics.