# SkillSage
SkillSage: AI-Powered Adaptive Career Roadmap Generator. Transforms resumes into personalized skill gap analyses and visual roadmaps with dynamic course recommendations.

# 🚀 Welcome to SkillSage - The adaptive Career Roadmap Generator

A modern, production-ready web application scaffold powered by cutting-edge technologies, designed to accelerate the development of the SkillSage platform.

## ✨ Technology Stack

This scaffold provides a robust foundation built with:

### 🎯 Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### 🧩 UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### 📋 Forms & Validation
- **🎣 React Hook Form** - Performant forms with easy validation
- **✅ Zod** - TypeScript-first schema validation

### 🔄 State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Query** - Powerful data synchronization for React
- **🌐 Axios** - Promise-based HTTP client

### 🗄️ Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution

### 🎨 Advanced UI Features
- **📊 TanStack Table** - Headless UI for building tables and datagrids
- **🖱️ DND Kit** - Modern drag and drop toolkit for React
- **📊 Recharts** - Redefined chart library built with React and D3
- **🖼️ Sharp** - High performance image processing

### 🌍 Internationalization & Utilities
- **🌍 Next Intl** - Internationalization library for Next.js
- **📅 Date-fns** - Modern JavaScript date utility library
- **🪝 ReactUse** - Collection of essential React hooks for modern development

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

Open (http://localhost:3000) to see your application running.


🤖 Integration with the SkillSage Backend (FastAPI/Python)

This Next.js scaffold is specifically designed to act as the primary client for the separate FastAPI/Python backend responsible for the core AI logic:

API Client: Axios and TanStack Query are used to manage data flow from the Next.js frontend to the FastAPI endpoints (/upload_resume, /analyze_profile).

Data Model: Prisma will mirror the data models stored in Firestore/MongoDB (or be the primary ORM) for consistent data handling across the full stack.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

🎨 Available SkillSage Features & Components

🧩 SkillSage UI Components
Layout: Dynamic Card system for displaying different analysis sections.
Forms: Resume Upload Component, Goal Setting Forms.
Feedback: Loading Skeletons during the AI Analysis (LLM Call) phase.
Data Display: Badge components for displaying inferred skill proficiency.

📊 Advanced Data Features (The Core Value)
Charts: Skill Gap Bar Charts and proficiency meters with Recharts.
Forms: Type-safe forms for Refining AI Suggestions with React Hook Form + Zod.
Tables: Course/Resource Recommendation Tables with filtering and sorting (TanStack Table).

🎨 Interactive Features (The Aesthetic)
Animations: Framer Motion for smooth transitions on the Career Roadmap Timeline.
Theme Switching: Essential dark mode for the futuristic aesthetic.

🔐 Backend Integration
Authentication: Ready-to-use auth flows with NextAuth.js.
Database: Type-safe database operations with Prisma for Career Ontology Management.
API Client: HTTP requests with Axios + TanStack Query for FastAPI/AI communication.


Ready to build the future of career guidance? Start building SkillSage now!
