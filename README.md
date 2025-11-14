# Custom PC Builder

A modern, responsive website clone for building and customizing your dream PC. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Hero Section** with animated typewriter effect
- **PC Build Cards** showcasing different build tiers (GOOD, BETTER, ULTIMATE)
- **Performance Metrics** with visual progress bars for CPU, GPU, Memory, and Storage
- **Forum Section** for community engagement
- **Responsive Design** that works on all devices
- **Fixed Navigation Header** for easy navigation
- **Professional Footer** with quick links

## Tech Stack

- **Next.js 16.0.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout with Header and Footer
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section with animation
│   ├── BuildCard.tsx    # PC build card component
│   ├── ForumSection.tsx # Forum call-to-action
│   └── Footer.tsx       # Footer component
├── lib/
│   └── utils.ts         # Utility functions
└── public/
    ├── logo.png         # Site logo
    ├── bg-image-2.jpg   # Hero background
    ├── good-build.jpg   # GOOD tier build image
    ├── better-build.jpg # BETTER tier build image
    └── ultimate-build.jpg # ULTIMATE tier build image
```

## Components

### BuildCard
Displays PC build configurations with:
- Build tier (GOOD, BETTER, ULTIMATE)
- Price
- GPU model
- Performance metrics (Processor, Graphics, Memory, Storage)
- Call-to-action button

### Hero
Features:
- Full-screen hero section
- Animated typewriter effect
- Background image with overlay
- Call-to-action button

### Header
Fixed navigation with:
- Logo
- Navigation links (home, forum, builds, browse)
- Login/Signup button

### Footer
Professional footer with:
- Quick links
- Additional navigation
- Copyright information
- Terms & Privacy links

## Customization

To customize the build cards, edit the data in [app/page.tsx](app/page.tsx:12-49).

To change the color scheme, modify the CSS variables in [app/globals.css](app/globals.css:3-6).

## Build for Production

```bash
npm run build
npm start
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Original Website

This is a clone of: https://custom-computers.vercel.app
