/**
 * ANSH SHARMA - Game Developer Portfolio Logic
 * Optimized for Fixed Navbar & Smooth Scrolling
 */

const body = document.body;
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sections = [...document.querySelectorAll('section[id]')];


// 1. MOBILE MENU
function setupMenuAndScroll() {
    if (!nav) return;

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(isOpen));
        });
    }
}


// 2. HUD SCROLL ANIMATIONS
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


// 3. STAT COUNTER
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


// 4. CERTIFICATE POPUP
const certButtons = document.querySelectorAll(".view-cert-btn");
const popup = document.getElementById("certPopup");
const popupImg = document.getElementById("certImage");
const verifyBtn = document.getElementById("verifyBtn");
const closeBtn = document.querySelector(".cert-close");

let scrollPosition = 0;

if (popup && popupImg && certButtons.length) {

    function openPopup(imgSrc, verifyLink) {

        popupImg.src = imgSrc;
        verifyBtn.href = verifyLink;

        // lock page scroll (works on mobile)
        scrollPosition = window.scrollY;
        body.style.position = "fixed";
        body.style.top = `-${scrollPosition}px`;
        body.style.width = "100%";

        popup.classList.add("active");
    }

    function closePopup() {

        popup.classList.remove("active");

        // restore scroll
        body.style.position = "";
        body.style.top = "";
        body.style.width = "";

        window.scrollTo(0, scrollPosition);
    }

    certButtons.forEach(button => {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            const imgSrc = this.getAttribute("data-cert");
            const verifyLink = this.getAttribute("data-verify");

            openPopup(imgSrc, verifyLink);

        });

    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closePopup);
    }

    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    // ESC key close
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.classList.contains("active")) {
            closePopup();
        }
    });

}
// ABOUT TEXT WORD HOVER EFFECT
const paragraphs = document.querySelectorAll(".aboutParagraph");

paragraphs.forEach(paragraph => {

    const words = paragraph.innerText.split(" ");

    paragraph.innerHTML = words
        .map(word => `<span class="about-word">${word}</span>`)
        .join(" ");

});

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


// EXECUTION
setupMenuAndScroll();
setupActiveNav();
setupHUDParallax();
initScrollAnimations();