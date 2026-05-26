import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initScrollAnimations = () => {
  // Fade in animation for sections
  gsap.utils.toArray('.fade-in').forEach((element: any) => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Stagger animation for project cards
  gsap.utils.toArray('.project-card').forEach((element: any, index) => {
    gsap.fromTo(element,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Skills animation
  gsap.utils.toArray('.skill-item').forEach((element: any, index) => {
    gsap.fromTo(element,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        delay: index * 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });
};

export const heroAnimation = () => {
  const tl = gsap.timeline();
  
  tl.fromTo('.hero-title', 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
  )
  .fromTo('.hero-subtitle', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 
    "-=0.5"
  )
  .fromTo('.hero-cta', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, 
    "-=0.3"
  );
};