/**
 * RAHUL WALIA - Game Developer Portfolio Logic
 * Updated for Cyberpunk/HUD Aesthetic
 */

const body = document.body;
const preloader = document.getElementById('preloader');
const loaderFill = document.getElementById('loaderFill');
const loaderPct = document.getElementById('loaderPct');
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.site-nav');
const yearNode = document.getElementById('year');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('section[id]')];

body.classList.add('loading');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

/**
 * 1. LOADING LOGIC
 * Simulates a high-speed system boot
 */
function runLoader() {
  if (!preloader || !loaderFill || !loaderPct) {
    body.classList.remove('loading');
    body.classList.add('loaded');
    return;
  }

  let value = 0;
  const timer = setInterval(() => {
    value += Math.floor(Math.random() * 12) + 5; // Faster, aggressive loading
    if (value >= 100) {
      value = 100;
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('hide');
        body.classList.remove('loading');
        body.classList.add('loaded');
        initScrollAnimations();
      }, 300);
    }

    loaderFill.style.width = `${value}%`;
    loaderPct.textContent = String(value);
  }, 70);
}

/**
 * 2. MOBILE MENU
 */
function setupMenu() {
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 3. HUD SCROLL ANIMATIONS
 * Triggers number counting and visibility reveals
 */
function initScrollAnimations() {
  const revealNodes = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        
        // Trigger stat counting if visible
        const stats = entry.target.querySelectorAll('.stat-value, .val');
        if (stats.length > 0) {
          animateStats(stats);
        }
      }
    });
  }, { threshold: 0.15 });

  revealNodes.forEach((node) => observer.observe(node));
}

/**
 * 4. STAT COUNTER ENGINE
 * Animates numbers from 0 to target (e.g., "1000" or "100%")
 */
function animateStats(nodes) {
  nodes.forEach(node => {
    if (node.dataset.done) return;
    
    const text = node.innerText;
    const target = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[0-9]/g, '');
    let current = 0;
    const duration = 1500; // 1.5 seconds
    const stepTime = Math.abs(Math.floor(duration / target));

    const counter = setInterval(() => {
      current += Math.ceil(target / 50); // Increment steps
      if (current >= target) {
        node.innerText = target + suffix;
        node.dataset.done = "true";
        clearInterval(counter);
      } else {
        node.innerText = current + suffix;
      }
    }, 20);
  });
}

/**
 * 5. HUD PARALLAX
 * Makes the profile image and background move with the mouse
 */
function setupHUDParallax() {
  const profileFrame = document.querySelector('.profile-frame');
  const grid = document.querySelector('.grid');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    if (profileFrame) {
      profileFrame.style.transform = `translate(${x * 25}px, ${y * 25}px)`;
    }
    if (grid) {
      grid.style.transform = `translate(${x * 15}px, ${y * 15}px) scale(1.05)`;
    }
  });
}

/**
 * 6. NAVIGATION TRACKER
 */
function setupActiveNav() {
  if (!sections.length || !navLinks.length) return;

  function updateActive() {
    const marker = window.scrollY + window.innerHeight * 0.4;
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (marker >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', active);
    });
  }

  window.addEventListener('scroll', updateActive);
}

// EXECUTION
runLoader();
setupMenu();
setupActiveNav();
setupHUDParallax();


/**
 * 7. PARTICLE NETWORK BACKGROUND
 * Creates the "Constellation" effect seen in the video
 */
function setupNetworkAnimation() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  
  // Configuration
  const particleColor = 'rgba(0, 255, 157, 1)'; // Neon Green
  const lineColor = '0, 255, 157'; // RGB values for rgba()
  const particleCount = window.innerWidth / 15; // Density based on screen width
  const connectionDistance = 150; // Distance to trigger line
  const mouseDistance = 200; // Mouse interaction radius

  // Mouse tracking
  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Resize handling
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5; // Slow horizontal speed
      this.vy = (Math.random() - 0.5) * 0.5; // Slow vertical speed
      this.size = Math.random() * 2 + 1; // Size between 1 and 3
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction (optional - particles flee slightly)
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouseDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseDistance - distance) / mouseDistance;
          const directionX = forceDirectionX * force * 3;
          const directionY = forceDirectionY * force * 3;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Draw connections
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          // Opacity depends on distance (fade out as they get further)
          let opacity = 1 - (distance / connectionDistance);
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.5})`; 
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  init();
  animate();
}

// Add this to your existing execution block at the bottom
setupNetworkAnimation();