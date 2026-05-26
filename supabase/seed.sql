-- ============================================================
-- Portfolio CMS — Seed Data
-- Run this AFTER schema.sql to pre-populate with current content
-- ============================================================

-- site_settings
INSERT INTO site_settings (site_title, tagline, seo_description, brand_name, copyright_text)
VALUES (
  'A. Zahi Faleel – Portfolio',
  'Web Developer & Tech Explorer',
  'A. Zahi Faleel - Web Developer & Tech Explorer. Student and passionate developer creating clean, responsive, user-focused web experiences.',
  'A.ZAHI',
  '© 2025 A. Zahi Faleel. All rights reserved.'
);

-- hero_section
INSERT INTO hero_section (heading, heading_highlight, subheading, cta_text, cta_scroll_target, availability_status, availability_label)
VALUES (
  'A. Zahi',
  'Faleel',
  'Building immersive Digital Experiences with robust engineering and elegant design.',
  'Explore Work',
  'projects',
  TRUE,
  'OPEN TO WORK'
);

-- about_section
INSERT INTO about_section (
  title, title_highlight, bio_primary, bio_secondary,
  profile_image_url, availability_status, availability_label, highlights
)
VALUES (
  'About',
  'Me',
  'I am a passionate Creative Developer dedicated to building immersive web experiences. My work bridges the gap between robust engineering and elegant design, ensuring every pixel serves a purpose.',
  'With a strong foundation in modern web technologies, I focus on performance, accessibility, and creating interfaces that feel "alive" through subtle interactions and 3D elements.',
  './assets/profile.jpg',
  TRUE,
  'OPEN TO WORK',
  '[{"icon":"Code","title":"Clean Code","subtitle":"Scalable & Maintainable"},{"icon":"Zap","title":"Performance","subtitle":"Lightning Fast Loads"},{"icon":"Layout","title":"Responsive Design","subtitle":"Mobile-First Approach"},{"icon":"Smartphone","title":"Cross-Platform","subtitle":"Works Everywhere"}]'::jsonb
);

-- contact_info
INSERT INTO contact_info (email, phone, location, section_eyebrow, section_heading, section_heading_highlight)
VALUES (
  'a.zahi2002@gmail.com',
  '',
  'Sri Lanka',
  'What''s Next?',
  'Let''s build something',
  'extraordinary.'
);

-- social_links
INSERT INTO social_links (platform, url, icon, visible, order_index) VALUES
  ('GitHub', 'https://github.com/a-zahi2002', 'Github', TRUE, 0),
  ('LinkedIn', 'https://linkedin.com/in/a-zahi-faleel-a929411aa', 'Linkedin', TRUE, 1);

-- projects
INSERT INTO projects (title, slug, description, technologies, category, github_url, live_url, thumbnail_url, featured, visible, order_index)
VALUES
  (
    'Taste of Tradition',
    'taste-of-tradition',
    'A visually appealing recipe site showcasing traditional Sri Lankan dishes.',
    ARRAY['HTML', 'CSS', 'JS'],
    'Web',
    'https://github.com/a-zahi2002/Taste-of-Tradition-Cookbook',
    '',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    TRUE,
    TRUE,
    0
  ),
  (
    'BookMaster POS',
    'bookmaster-pos',
    'Electron-based desktop POS for bookstores with SQLite inventory tracking.',
    ARRAY['Electron', 'SQLite'],
    'Desktop',
    'https://github.com/a-zahi2002/BookMaster',
    '',
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
    FALSE,
    TRUE,
    1
  ),
  (
    'ExploreLanka',
    'explorelanka',
    'Tourist-friendly platform for Sri Lankan travel planning.',
    ARRAY['React', 'TypeScript'],
    'Web',
    'https://github.com/a-zahi2002/ExploreLanka-TravelAdvisor-web',
    '',
    'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=600',
    FALSE,
    TRUE,
    2
  ),
  (
    'Portfolio V1',
    'portfolio-v1',
    'My previous personal site built with Bootstrap 5.',
    ARRAY['Bootstrap'],
    'Web',
    'https://github.com/a-zahi2002/Portfolio',
    '',
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    TRUE,
    TRUE,
    3
  );

-- certificates
INSERT INTO certificates (title, issuer, image_url, visible, order_index)
VALUES
  ('Web Design for Beginners', 'Centre for Open & Distance Learning (CODL) - UoM', '/Portfolio_Zahi/assets/certificate1.jpg', TRUE, 0),
  ('Front-end Web Development', 'Centre for Open & Distance Learning (CODL) - UoM', '/Portfolio_Zahi/assets/certificate2.jpg', TRUE, 1),
  ('Server-side Web Programming', 'Centre for Open & Distance Learning (CODL) - UoM', '/Portfolio_Zahi/assets/certificate3.jpg', TRUE, 2),
  ('Python for Beginners', 'Centre for Open & Distance Learning (CODL) - UoM', '/Portfolio_Zahi/assets/certificate4.jpg', TRUE, 3);

-- skills
INSERT INTO skills (name, color, category, display_order, visible)
VALUES
  ('React',         '#61DAFB', 'Frontend', 0,  TRUE),
  ('Next.js',       '#ffffff', 'Frontend', 1,  TRUE),
  ('TypeScript',    '#3178C6', 'Frontend', 2,  TRUE),
  ('Tailwind CSS',  '#38B2AC', 'Frontend', 3,  TRUE),
  ('Three.js',      '#ffffff', '3D/Canvas', 4, TRUE),
  ('Node.js',       '#339933', 'Backend',  5,  TRUE),
  ('Python',        '#3776AB', 'Backend',  6,  TRUE),
  ('JavaScript',    '#F7DF1E', 'Frontend', 7,  TRUE),
  ('Framer Motion', '#0055FF', 'Frontend', 8,  TRUE),
  ('Git',           '#F05032', 'Tools',    9,  TRUE),
  ('Figma',         '#F24E1E', 'Design',   10, TRUE),
  ('PostgreSQL',    '#336791', 'Backend',  11, TRUE);

-- seo_pages
INSERT INTO seo_pages (route, title, description, keywords, og_title, og_description)
VALUES (
  '/',
  'A. Zahi Faleel – Portfolio',
  'A. Zahi Faleel - Web Developer & Tech Explorer. Student and passionate developer creating clean, responsive, user-focused web experiences.',
  'web developer, frontend developer, react developer, portfolio, A. Zahi Faleel',
  'A. Zahi Faleel – Portfolio',
);

-- experiences
INSERT INTO experiences (company, role, start_date, end_date, description, technologies, visible, order_index)
VALUES
  (
    'Digital Wonders Agency',
    'Creative Developer',
    'Jun 2023',
    'Present',
    'Building premium, high-performance web applications using **React**, **Three.js**, and **Tailwind CSS**. Focused on custom micro-interactions and smooth user experience.',
    ARRAY['React', 'Three.js', 'Framer Motion', 'Tailwind'],
    TRUE,
    0
  ),
  (
    'Tech Solutions Ltd',
    'Junior Frontend Developer',
    'Jan 2021',
    'May 2023',
    'Worked closely with designers to implement responsive, pixel-perfect user interfaces. Participated in migration of legacy codebase to TypeScript.',
    ARRAY['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Git'],
    TRUE,
    1
  );

-- education
INSERT INTO education (institution, degree, start_date, end_date, description, visible, order_index)
VALUES
  (
    'University of Moratuwa',
    'B.Sc. in Computer Science & Engineering',
    'Oct 2021',
    'Present',
    'Specializing in software engineering, database design, computer networks, and algorithms. Active member of the computer society.',
    TRUE,
    0
  ),
  (
    'Royal College Colombo',
    'Secondary Education',
    'Jan 2013',
    'Dec 2020',
    'Completed secondary schooling with outstanding distinctions in advanced level physical science stream.',
    TRUE,
    1
  );
