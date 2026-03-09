/**
 * ANSH SHARMA - Game Developer Portfolio Logic
 * Optimized for Fixed Navbar & Smooth Scrolling
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

// 1. LOADING LOGIC
function runLoader() {
    if (!preloader || !loaderFill || !loaderPct) {
        body.classList.remove('loading');
        body.classList.add('loaded');
        return;
    }

    let value = 0;
    const timer = setInterval(() => {
        value += Math.floor(Math.random() * 12) + 5;
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

// 2. MOBILE MENU
function setupMenuAndScroll() {
    if (!nav) return;

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
        });
    }
}

// 3. HUD SCROLL ANIMATIONS
function initScrollAnimations() {
    const revealNodes = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                const stats = entry.target.querySelectorAll('.stat-value, .val');
                if (stats.length > 0) animateStats(stats);
            }
        });
    }, { threshold: 0.15 });

    revealNodes.forEach((node) => observer.observe(node));
}

// 4. STAT COUNTER
function animateStats(nodes) {
    nodes.forEach(node => {
        if (node.dataset.done) return;

        const text = node.innerText;
        const target = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[0-9]/g, '');

        let current = 0;

        const counter = setInterval(() => {
            current += Math.ceil(target / 50);

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

// 5. HUD PARALLAX
function setupHUDParallax() {
    const profileFrame = document.querySelector('.profile-frame');
    const grid = document.querySelector('.grid');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        if (profileFrame)
            profileFrame.style.transform = `translate(${x * 25}px, ${y * 25}px)`;

        if (grid)
            grid.style.transform = `translate(${x * 15}px, ${y * 15}px) scale(1.05)`;
    });
}

// 6. ACTIVE NAVIGATION
function setupActiveNav() {
    if (!sections.length || !navLinks.length) return;

    function updateActive() {
        const scrollPosition = window.scrollY + 100;
        const pageBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const id = section.getAttribute('id');

            if (
                (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) ||
                (pageBottom && id === sections[sections.length - 1].id)
            ) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');

                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActive);
}

// 7. NETWORK ANIMATION (optional)
function setupNetworkAnimation() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    const particleColor = 'rgba(0,255,157,1)';
    const lineColor = '0,255,157';

    const particleCount = Math.min(window.innerWidth / 15, 100);
    const connectionDistance = 150;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 1.5 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
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
        particles = Array.from({ length: particleCount }, () => new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, i) => {
            p.update();
            p.draw();

            for (let j = i + 1; j < particles.length; j++) {
                let dx = p.x - particles[j].x;
                let dy = p.y - particles[j].y;

                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${lineColor}, ${(1 - dist / connectionDistance) * 0.2})`;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
}

// EXECUTION
runLoader();
setupMenuAndScroll();
setupActiveNav();
setupHUDParallax();
setupSectionFadeScroll();
// setupNetworkAnimation();