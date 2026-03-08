

# HashCap – AI Caption & Hashtag Generator Dashboard

## Overview
A modern SaaS dashboard with a clean, professional design inspired by Notion/ChatGPT aesthetics. Built with React, Tailwind CSS, and shadcn/ui components.

## Layout

### Left Sidebar
- **HashCap** logo/branding with a sparkle icon
- Navigation items: Caption Generator, Hashtag Generator, History, Settings
- Active route highlighting, collapsible sidebar with trigger in header

### Pages

**1. Caption Generator (main page)**
- Hero card: "AI Caption Generator" with subtitle
- **Topic input** – text field with placeholder examples
- **Tone dropdown** – Funny, Motivational, Casual, Professional
- **Generate Caption** button with gradient accent styling
- **Results section** (appears after generation):
  - Caption panel – displays generated caption with a "Copy Caption" button
  - Hashtags panel – displays generated hashtags with a "Copy Hashtags" button
- Loading spinner overlay while waiting for API response
- Toast notification on successful copy

**2. Hashtag Generator** – placeholder page
**3. History** – placeholder page
**4. Settings** – placeholder page

## API Integration
- POST to `http://127.0.0.1:5000/generate` with `{ topic, tone }` body
- Display returned `caption` and `hashtags` in result panels
- Error handling with toast notifications

## Design
- Dark sidebar with light main content area
- Gradient accent on primary CTA button (purple-to-blue)
- Rounded cards with soft shadows
- Clean typography, spacious layout
- Fully responsive (sidebar collapses on mobile)

