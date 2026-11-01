# Ansh Sharma – Portfolio

Personal portfolio website: https://81-ansh.github.io/Portfolio/

Plain HTML, CSS and JavaScript. There is no build step and nothing to install: what is in this
folder is exactly what gets published by GitHub Pages.

## Folder structure

```
index.html              Home page (hero, skills, experience, projects, about, certificates, contact)
project.html            One page that shows ANY project: project.html?id=aura
404.html                Page shown for addresses that don't exist
sitemap.xml             List of pages for search engines

assets/
  css/
    base.css            Fonts, colours (design tokens), reset, buttons, shared styles
    header.css          Top bar and mobile menu (every page)
    home.css            Styles for the home page sections
    project-detail.css  Styles for the project page
    no-js.css           Fallback if JavaScript is switched off
  js/
    main.js             Home page: switches everything on
    project.js          Project page: fills the page from the data file
    data/
      projects.js       <-- ALL project info lives here
      certificates.js   <-- ALL certificate info lives here
    modules/            One small file per feature (nav, dragon, gallery, ...)
    dev/dragon-debug.js Tool for placing the dragon (only loads with ?debug)
  images/               projects/<id>/, certificates/, skills/
  fonts/                Self-hosted fonts and icons
  models/dragon.glb     The 3D dragon
  vendor/               three.js (pinned version), copied here so the site works offline
  docs/                 Resume PDF
  favicon/              Browser tab icon and web manifest
tools/optimize-images.py  Converts screenshots to the right size and format
```

## How the pages talk to each other

1. `index.html` has an empty projects area. `main.js` reads `assets/js/data/projects.js` and builds
   one card per project. Each card is a normal link: `project.html?id=aura`.
2. `project.html` is a template. `project.js` reads the `id` from the address, finds that project in
   the same data file, and fills in the title, description, gallery and links.

So a project is defined in exactly one place, and the home page and project page can never disagree.

## Everyday tasks

### Add a project
1. Run the image tool (needs `pip install pillow`):
   `python tools/optimize-images.py my-raw-screenshots assets/images/projects/my-game`
2. Put a square `logo.webp` in that same folder.
3. Copy a block in `assets/js/data/projects.js`, change the values (`id` must match the folder name,
   `screenshots` is the number the tool printed).

### Add a certificate
Put the image in `assets/images/certificates/` and copy a block in `assets/js/data/certificates.js`.

### Change the About / Experience text
Edit the text directly in `index.html` (sections `id="about"` and `id="experience"`).
Keep `class="about-text aboutParagraph"` on About paragraphs: it powers the hover effect.

### Add a new section to the home page
1. Add `<section class="section reveal" id="my-section"> ... </section>` inside `<main>` in `index.html`.
2. Add `<a href="#my-section">MY SECTION</a>` to the nav in `index.html` (and `project.html`).
3. That's all. The dragon and the active-link highlight read the sections from the page.
   Without a dragon keyframe the dragon simply waits above the screen at that section.
   To make it appear there, add an entry to `KEYFRAMES` in `assets/js/modules/dragon.js`.

### Position the dragon
Open `index.html?debug`, use the POSITION / ROTATION buttons, then copy the numbers into `KEYFRAMES`.

### Replace the resume
Overwrite `assets/docs/Ansh-Resume.pdf` (keep the same file name).

## Run it on your computer
The pages load JavaScript modules, which browsers block when you double-click the file.
Use a tiny local server instead, for example:

- VS Code: install the "Live Server" extension, right-click `index.html` -> Open with Live Server
- or in a terminal in this folder: `python -m http.server 8000`, then open http://localhost:8000

## Publishing
Commit and push to `main`. GitHub Pages updates in a minute or two. If a change doesn't show up,
hard refresh with Ctrl+Shift+R.

## Security policy
Each page has a `Content-Security-Policy` meta tag in `<head>`. It only allows this site's own files
plus YouTube (for project videos). If you ever add a third-party script, font or image host
(analytics, a contact form...), add its address to that tag or the browser will block it.

## Credits
- three.js r128 (MIT) – `assets/vendor/`
- Skill icons from devicon (MIT) – `assets/images/skills/`
- Icons: trimmed Font Awesome Free (icons CC BY 4.0, font SIL OFL 1.1)
- Fonts: Space Grotesk, Orbitron, Archivo Black (SIL OFL 1.1, via Fontsource); Ethnocentric (Typodermic Fonts – check the licence before any commercial use)
