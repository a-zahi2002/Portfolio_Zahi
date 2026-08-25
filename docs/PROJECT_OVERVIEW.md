# Project Overview: Cyber Terminal Portfolio

A high-fidelity, immersive, and high-performance personal portfolio website for **A. Zahi Faleel**. The site features a striking "Cyber Terminal" sci-fi HUD aesthetic, interactive 3D WebGL scenes, ambient sound synthesizers, and a robust admin dashboard backed by a Supabase CMS.

---

## 🚀 1. Technology Stack

The project is built on a modern, robust, and highly optimized 5-system tech stack:

*   **Core Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) for component-driven frontend architecture and strict type safety.
*   **Build Tooling**: [Vite](https://vitejs.dev/) for extremely fast development and optimized asset compilation.
*   **Styling & Theming**: [Tailwind CSS v3](https://tailwindcss.com/) combined with custom CSS variables (`src/index.css`) for utility styling and dynamic real-time theme swapping between **Cyber Dark Mode** and **Blueprint Light Mode**.
*   **Animations & Motion Layer**:
    *   **Lenis Scroll**: Master smooth scroll driver providing kinetic interpolation.
    *   **GSAP + ScrollTrigger**: Hooks into Lenis scroll positions to orchestrate high-performance staggered reveals, parallax animations, and layout transitions.
    *   **Framer Motion**: Controls element-level interactions (magnetic cursor, 3D float parallax, HUD panels hover, cards spotlight effects).
*   **Interactive 3D Layer**: [Three.js](https://threejs.org/) mapped via [@react-three/fiber](https://r3f.docs.pmnd.rs/getting-started/introduction) (R3F) and [@react-three/drei](https://github.com/pmndrs/drei) to render a scroll-linked holographic 3D artifact and particle field in a background Canvas.
*   **Ambient Audio Engine**: Browser Web Audio API managed via `use-sound` to synthesize futuristic sci-fi sound effects and hums programmatically, avoiding large static assets.
*   **Backend & CMS**: [Supabase](https://supabase.com) (PostgreSQL database, Storage Buckets, Auth, Row Level Security) for database management.
*   **State & Query Caching**: [@tanstack/react-query](https://tanstack.com/query/latest) for declarative, reactive data fetching, automatic caching, and cache invalidation on edits.

---

## 📂 2. Directory Structure & Key Roles

```text
Portfolio_Zahi/
├── docs/                      # Documentation files
│   ├── PROJECT_SUMMARY.md     # Detailed architecture and animation layers breakdown
│   └── CMS_SETUP.md           # Step-by-step Supabase database and buckets setup
├── public/                    # Static site assets (icons, etc.)
├── src/                       # Application source code
│   ├── components/            # UI components and site sections
│   │   ├── admin/             # Guards, layouts, and page editor components for the CMS
│   │   ├── audio/             # Sound synthesizer and global AudioProvider state
│   │   ├── common/            # Reusable core styles and assets
│   │   ├── hud/               # Cyber terminal frames, beams, targeting corners, grids
│   │   ├── three/             # R3F Canvas components, Particle Field, and 3D Artifacts
│   │   ├── ui/                # Core visual atoms (buttons, panels, spotlight elements)
│   │   ├── About.tsx          # About section with 3D profile picture hover physics
│   │   ├── Hero.tsx           # Hero greeting with responsive action CTA
│   │   ├── Projects.tsx       # Dynamic Bento-box grid displaying selected works
│   │   └── ...                # Journey, Certificates, Skills, Contact, Footer, Navbar
│   ├── contexts/              # Contexts (e.g., Audio, UI states)
│   ├── hooks/                 # Custom React hooks
│   │   ├── cms/               # TanStack queries to retrieve data from Supabase
│   │   └── useDarkMode.ts     # Synchronizes dark/light modes using CSS variables
│   ├── lib/                   # Supabase client instantiation
│   ├── pages/                 # Full pages (Admin Login)
│   ├── services/              # API interfaces to Supabase
│   ├── types/                 # TypeScript type interfaces for CMS records
│   ├── utils/                 # GSAP orchestration scripts and markdown parsers
│   ├── App.tsx                # Routing, layouts, provider configurations
│   ├── index.css              # Global styles, variables, utility classes, and HUD animations
│   └── main.tsx               # Client entry point
├── supabase/                  # Backend configurations
│   ├── schema.sql             # SQL script for database tables setup
│   ├── seed.sql               # Seed data for immediate runtime testing
│   └── storage-policies.sql   # Storage RLS policies for file upload protection
├── tailwind.config.js         # Custom Tailwind theme mapped to CSS variables
└── vite.config.ts             # Vite bundler options
```

---

## 🛠️ 3. Current Project Status (What is Completed)

The application is fully functional and features a comprehensive list of completed components:

### A. Immersive Portfolio Frontend (`/`)
1.  **Holographic Hero Canvas (`HeroScene.tsx`)**: Responsive, interactive wireframe Icosahedron rotating and morphing on scroll/mouse gestures, complete with a floating particle field.
2.  **Smooth scrolling & Timelines**: Seamlessly integrated Lenis smooth scroll and GSAP scroll triggers for page-wide reveals.
3.  **Adaptive Responsive Bento Bento Grid (`Projects.tsx`)**: Re-engineered projects section using an algorithm that automatically computes grid dimensions and column spans dynamically based on the total number of projects. Large projects alternate layout seamlessly (`lg:col-span-4` and `lg:col-span-2`) with zero grid gaps.
4.  **Parallax Hover Layout (`About.tsx`)**: 3D mouse tracking on the profile picture using spring physics in Framer Motion.
5.  **Interactive Cyber Cursor (`CyberCursor.tsx`)**: A custom magnetic cursor that snaps onto interactive target areas.
6.  **HUD Styling & Framing**: `.glass-cyber` panels, dynamic laser section-beams, and neon terminal frames with custom borders.
7.  **Dynamic Theming**: Swap between Cyber Dark Mode and Blueprint Light Mode.
8.  **Programmatic Audio Engine**: Sounds triggered dynamically on hover and click; defaults to muted with a persistent navigation bar control.

### B. Admin Dashboard / CMS (`/.admin`)
A protected, comprehensive dashboard that allows complete management of the portfolio contents:
1.  **Overview Dashboard**: Displaying statistics and database status.
2.  **Sections Editors**:
    *   `HeroEditor`: Heading, highlight, subheading, and availability status.
    *   `AboutEditor`: Rich-text bio text (Markdown supported), profile picture upload, and system indicators.
    *   `ProjectEditor` & `ProjectsList`: CRUD operations on projects, technology badges, live and github links.
    *   `CertificateEditor` & `CertificatesList`: Upload and link credentials.
    *   `SkillsList`: Categories and custom colors for proficiency levels.
    *   `ContactEditor` & `SocialLinksList`: Contact details and social handle links.
    *   `SeoManager`: Route-specific title tags and metadata tags for search engines.
    *   `MediaLibrary`: Upload manager with drag-and-drop to Supabase storage buckets.

---

## ⚡ 4. Database Schema & RLS Security

The Supabase database consists of **12 main tables** fully configured with Row Level Security (RLS) policies:

| Table | Purpose | Security Rules (RLS) |
|---|---|---|
| `site_settings` | Site metadata, resume URLs, maintenance status | Public: Read-only \| Authenticated: Write |
| `hero_section` | Title headings, subtitle, and statuses | Public: Read-only \| Authenticated: Write |
| `about_section` | Primary/Secondary bio and highlights | Public: Read-only \| Authenticated: Write |
| `projects` | Selected projects, techs, URLs, order indexes | Public: Read-only \| Authenticated: Write |
| `certificates` | Certification items and credentials | Public: Read-only \| Authenticated: Write |
| `skills` | Name, categories, color, and proficiency | Public: Read-only \| Authenticated: Write |
| `experiences` | Professional experience cards | Public: Read-only \| Authenticated: Write |
| `education` | Academic history | Public: Read-only \| Authenticated: Write |
| `contact_info` | Email, location, and header prompts | Public: Read-only \| Authenticated: Write |
| `social_links` | Target URLs and icons | Public: Read-only \| Authenticated: Write |
| `seo_pages` | Page-specific titles and OpenGraph tags | Public: Read-only \| Authenticated: Write |
| `media_library` | Upload tracking for images and assets | Authenticated (Admin): Full Access |

*Note: Storage Buckets (`profile-images`, `project-images`, `certificates`, `seo-assets`, `resumes`, `general-media`) are configured for public read access while requiring authentication for file uploads/deletions.*

---

## 🎯 5. Target Product Expectations (The Road Ahead)

When preparing the final product, the development targets include:

1.  **Production Asset Optimization**: Ensure all user-uploaded CMS assets undergo automatic optimization (WebP formats, lazy-loading) to preserve the high-performance Lighthouse metrics.
2.  **Deployment**: Production build on Vercel utilizing global Edge caching for Supabase endpoints, and configuring rewrite files (`vercel.json`) to prevent 404 errors on routing to sub-routes.
3.  **Strict Security Checklist**:
    *   Row-level policies fully verified for `INSERT`, `UPDATE`, and `DELETE`.
    *   Zero usage of the Supabase `service_role` key client-side.
