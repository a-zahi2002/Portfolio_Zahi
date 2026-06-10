# A. Zahi Faleel – Cyber Terminal Portfolio

A modern, immersive, and high-performance personal portfolio built with **React**, **TypeScript**, and **Tailwind CSS**. Showcasing projects, skills, certificates, and contact information with a sci-fi "Cyber Terminal" aesthetic featuring interactive 3D graphics, ambient audio, and buttery-smooth scroll animations.

## 📖 Documentation

For a detailed breakdown of the site's architecture, directory structure, UI/UX design, 3D Canvas integration, and animation systems, check out the [Project Summary & Architecture Documentation](./docs/PROJECT_SUMMARY.md).

For setting up the backend database, see the [CMS Setup Guide](./docs/CMS_SETUP.md).

## Features

- ⚡ **Cyber Terminal UI**: Built with custom Glassmorphism and HUD interfaces.
- 🌌 **Interactive 3D Hero**: React Three Fiber Canvas featuring a holographic floating artifact that responds to scroll and mouse movement.
- 🎞️ **Immersive Storytelling**: GSAP ScrollTrigger paired with Lenis smooth scrolling for a premium browsing experience.
- 🎧 **Ambient Audio Engine**: Synthesized web audio feedback for interactive UI elements.
- 🌙 **Persistent Dark Mode**: Defaults to Dark Mode across sessions with a dynamic Blueprint Light Mode fallback.
- 📊 **Dynamic Content**: Connected to a Supabase backend CMS for managing projects, skills, and certificates.

## Demo

[Live Demo](#) <!-- Replace with your deployed URL if available -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

Clone the repository:

```sh
git clone https://github.com/a-zahi2002/Portfolio_Zahi.git
cd Portfolio_Zahi
```

Install dependencies:

```sh
npm install
```

### Development

Start the development server:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build

To build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Customization

- **Content & CMS:** All dynamic data (Projects, Skills, Journey) is loaded via custom hooks pointing to your Supabase instance.
- **Styling:** Modify the Tailwind config in [`tailwind.config.js`](tailwind.config.js) or the global CSS variables in [`src/index.css`](src/index.css) to shift the accent colors.
- **3D Artifacts:** Modify the mesh logic inside [`src/components/three/CyberArtifact.tsx`](src/components/three/CyberArtifact.tsx).

## Dependencies

- [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/) (for 3D graphics)
- [GSAP](https://greensock.com/gsap/) & [Lenis](https://lenis.darkroom.engineering/) (for smooth scrolling and animations)
- [Framer Motion](https://www.framer.com/motion/) (for UI micro-interactions)
- [use-sound](https://github.com/joshwcomeau/use-sound) (for ambient audio)
- [Supabase](https://supabase.com/) (for backend CMS)

## License

This project is open source and available under the [MIT License](LICENSE).

---

> Designed and developed by **A. Zahi Faleel**  
> [GitHub](https://github.com/a-zahi2002) • [LinkedIn](https://linkedin.com/in/a-zahi-faleel-a929411aa)
