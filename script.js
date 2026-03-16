/**
 * ANSH SHARMA - Game Developer Portfolio Logic
 * Optimized for Fixed Navbar & Smooth Scrolling
 */

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


// =========================
// PROJECT DETAIL NAVIGATION
// =========================

const projectTiles = document.querySelectorAll(".project-tile");

projectTiles.forEach(tile => {
    tile.addEventListener("click", (e) => {
        // Don't navigate if clicking on buttons or links
        if (e.target.closest(".project-links") || e.target.closest(".project-btn")) {
            return;
        }

        // Collect all shot data attributes dynamically
        const shots = [];
        for (let i = 1; ; i++) {
            const shot = tile.dataset[`shot${i}`];
            if (shot) {
                shots.push(shot);
            } else {
                break;
            }
        }

        const params = new URLSearchParams({
            title: tile.dataset.title || "",
            desc: tile.dataset.desc || "",
            video: tile.dataset.video || "",
            shots: shots.join(','),
            tech: tile.dataset.tech || (tile.querySelector(".project-tech")?.textContent || ""),
            github: tile.dataset.github || "",
            itchio: tile.dataset.itchio || "",
            gameType: tile.dataset.gametype || "",
            keyFeatures: tile.dataset.keyfeatures || ""
        });

        window.location.href = `project.html?${params.toString()}`;
    });
});


// Certificate Popup
const certButtons = document.querySelectorAll(".view-cert-btn");
const certPopup = document.getElementById("certPopup");
const certPopupImg = document.getElementById("certImage");
const verifyBtn = document.getElementById("verifyBtn");
const certCloseBtn = document.querySelector(".cert-close");

let scrollPosition = 0;

if (certPopup && certPopupImg && certButtons.length) {

    function openPopup(imgSrc, verifyLink) {

        certPopupImg.src = imgSrc;
        verifyBtn.href = verifyLink;

        scrollPosition = window.scrollY;

        document.body.style.overflow = "hidden";

        certPopup.classList.add("active");
    }

    function closePopup() {

        certPopup.classList.remove("active");

        document.body.style.overflow = "";

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

    if (certCloseBtn) {
        certCloseBtn.addEventListener("click", closePopup);
    }

    certPopup.addEventListener("click", (e) => {
        if (e.target === certPopup) {
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
if (window.location.pathname.includes('project.html')) {
    // Populate detail page from query string and build Steam-like media viewer
    (function () {
        const params = new URLSearchParams(window.location.search);

        const title = params.get("title") || "Dummy Project Title";
        const desc = params.get("desc") || "This is a dummy description for the project. It provides an overview of what the game is about, its mechanics, and overall experience.";
        const tech = params.get("tech") || "Unreal Engine / C++ / Blueprints";
        const video = params.get("video") || "";
        const shots = params.get("shots") || "";
        const shotArray = shots ? shots.split(',').map(s => s.trim()).filter(s => s) : [];
        const github = params.get("github") || "";
        const itchio = params.get("itchio") || "";
        const gameType = params.get("gameType") || "Dummy Game Type";
        const keyFeatures = params.get("keyFeatures") || "Dummy feature 1 / Dummy feature 2 / Dummy feature 3 / Dummy feature 4";

        document.title = title ? `${title} - Ansh Sharma` : "Project Detail - Ansh Sharma";

        document.getElementById("detailTitle").textContent = title;
        document.getElementById("detailDesc").textContent = desc;
        const techList = tech.split('/').map(t => t.trim()).filter(t => t);
        const techUl = document.getElementById("detailTech");
        techUl.innerHTML = '';
        techList.forEach(techItem => {
            const li = document.createElement('li');
            li.textContent = techItem;
            techUl.appendChild(li);
        });

        // Hide Tech used section if no tech
        const techH3 = document.querySelector('.project-details h3:nth-of-type(1)');
        if (techList.length === 0) {
            techH3.classList.add("hidden");
            techUl.classList.add("hidden");
        } else {
            techH3.classList.remove("hidden");
            techUl.classList.remove("hidden");
        }
        document.getElementById("detailGameType").textContent = gameType;
        if (!gameType) {
            document.getElementById("detailGameType").classList.add("hidden");
        } else {
            document.getElementById("detailGameType").classList.remove("hidden");
        }
        const featuresList = keyFeatures.split('/').map(f => f.trim()).filter(f => f);
        const featuresUl = document.getElementById("detailFeatures");
        featuresUl.innerHTML = '';
        featuresList.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresUl.appendChild(li);
        });

        // Hide Key Features section if no features
        const keyFeaturesH3 = document.querySelector('.project-details h3:nth-of-type(2)');
        if (featuresList.length === 0) {
            keyFeaturesH3.classList.add("hidden");
            featuresUl.classList.add("hidden");
        } else {
            keyFeaturesH3.classList.remove("hidden");
            featuresUl.classList.remove("hidden");
        }

        // Setup GitHub and itch.io links
        const githubLink = document.getElementById("githubLinkDetail");
        const itchioLink = document.getElementById("itchioLinkDetail");

        if (github) {
            githubLink.href = github;
            githubLink.style.display = "flex";
        }

        if (itchio) {
            itchioLink.href = itchio;
            itchioLink.style.display = "flex";
        }

        const mediaMain = document.getElementById("mediaMain");
        const mediaStrip = document.getElementById("mediaStrip");
        const prevBtn = document.querySelector(".media-arrow-left");
        const nextBtn = document.querySelector(".media-arrow-right");

        const mediaItems = [];
        if (video) {
            mediaItems.push({ type: "video", src: video });
        }
        shotArray.forEach(shot => {
            mediaItems.push({ type: "image", src: shot });
        });

        // Add dummy media if none provided
        if (mediaItems.length === 0) {
            mediaItems.push({ type: "image", src: "images/Projects/Placeholder.png" });
        }

        function getYouTubeId(url) {
            try {
                const u = new URL(url);
                if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
                    return u.searchParams.get("v");
                }
                if (u.hostname === "youtu.be") {
                    return u.pathname.replace("/", "");
                }
                return null;
            } catch {
                return null;
            }
        }

        function toYouTubeEmbed(url) {
            const id = getYouTubeId(url);
            return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
        }

        function toYouTubeThumb(url) {
            const id = getYouTubeId(url);
            return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
        }

        let currentIndex = 0;

        function renderMain() {
            mediaMain.innerHTML = "";
            const item = mediaItems[currentIndex];
            if (!item) return;

            if (item.type === "video") {
                const iframe = document.createElement("iframe");
                iframe.src = toYouTubeEmbed(item.src);
                iframe.className = "media-main-frame";
                iframe.setAttribute("frameborder", "0");
                iframe.setAttribute("allowfullscreen", "");
                iframe.setAttribute(
                    "allow",
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                );
                mediaMain.appendChild(iframe);
            } else {
                const img = document.createElement("img");
                img.src = item.src;
                img.alt = "Project media";
                img.className = "media-main-image";
                mediaMain.appendChild(img);
            }
        }

        function renderStrip() {
            mediaStrip.innerHTML = "";
            mediaItems.forEach((item, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "media-thumb-button";
                if (index === currentIndex) {
                    button.classList.add("active");
                }

                if (item.type === "video") {
                    const wrapper = document.createElement("div");
                    wrapper.className = "media-thumb-video";

                    const img = document.createElement("img");
                    img.src = toYouTubeThumb(item.src);
                    img.alt = "Video thumbnail";
                    img.className = "media-thumb-image";
                    wrapper.appendChild(img);

                    const icon = document.createElement("div");
                    icon.className = "media-thumb-icon";
                    icon.innerHTML = '<i class="fa-solid fa-play"></i>';
                    wrapper.appendChild(icon);

                    button.appendChild(wrapper);
                } else {
                    const img = document.createElement("img");
                    img.src = item.src;
                    img.alt = "Media thumbnail";
                    img.className = "media-thumb-image";
                    button.appendChild(img);
                }

                button.addEventListener("click", () => {
                    currentIndex = index;
                    renderMain();
                    renderStrip();
                });

                mediaStrip.appendChild(button);
            });

            // Scroll active thumb into view
            const activeBtn = mediaStrip.querySelector('.media-thumb-button.active');
            if (activeBtn) {
                const strip = mediaStrip;
                const btnLeft = activeBtn.offsetLeft;
                const btnWidth = activeBtn.offsetWidth;
                const stripWidth = strip.offsetWidth;
                strip.scrollTo({
                    left: btnLeft - (stripWidth / 2) + (btnWidth / 2),
                    behavior: 'smooth'
                });
            }
        }

        if (mediaItems.length) {
            renderMain();
            renderStrip();

            if (prevBtn && nextBtn) {
                prevBtn.addEventListener("click", () => {
                    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
                    renderMain();
                    renderStrip();
                });
                nextBtn.addEventListener("click", () => {
                    currentIndex = (currentIndex + 1) % mediaItems.length;
                    renderMain();
                    renderStrip();
                });
            }
        }
    })();

}

setupMenuAndScroll();
setupActiveNav();
setupHUDParallax();
initScrollAnimations();

// DOT GRID VFX
(function () {
    const canvas = document.getElementById('dotCanvas');
    if (!canvas) return;

    const wrapper = canvas.parentElement;
    const ctx = canvas.getContext('2d');

    let W, H, dots = [];
    const mouse = { x: -9999, y: -9999 };

    const SPACING   = 28;
    const RADIUS    = 1.4;
    const INFLUENCE = 110;
    const MAX_PUSH  = 38;
    const STIFFNESS = 0.09;
    const DAMPING   = 0.72;

    function buildGrid() {
        W = wrapper.clientWidth;
        H = wrapper.clientHeight;
        canvas.width  = W;
        canvas.height = H;
        dots = [];

        const cols = Math.ceil(W / SPACING) + 1;
        const rows = Math.ceil(H / SPACING) + 1;
        const offX = (W - (cols - 1) * SPACING) / 2;
        const offY = (H - (rows - 1) * SPACING) / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                dots.push({
                    ox: offX + c * SPACING,
                    oy: offY + r * SPACING,
                    x:  offX + c * SPACING,
                    y:  offY + r * SPACING,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }

    // Mouse
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Touch
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
    }, { passive: false });
    canvas.addEventListener('touchend', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function animate() {
        ctx.clearRect(0, 0, W, H);

        dots.forEach(d => {
            const dx   = d.x - mouse.x;
            const dy   = d.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < INFLUENCE && dist > 0) {
                const force = 1 - dist / INFLUENCE;
                const pushX = (dx / dist) * force * MAX_PUSH;
                const pushY = (dy / dist) * force * MAX_PUSH;
                d.vx += (d.ox + pushX - d.x) * STIFFNESS;
                d.vy += (d.oy + pushY - d.y) * STIFFNESS;
            } else {
                d.vx += (d.ox - d.x) * STIFFNESS;
                d.vy += (d.oy - d.y) * STIFFNESS;
            }

            d.vx *= DAMPING;
            d.vy *= DAMPING;
            d.x  += d.vx;
            d.y  += d.vy;

            // Color based on displacement
            const disp = Math.sqrt((d.x - d.ox) ** 2 + (d.y - d.oy) ** 2);
            const t    = Math.min(1, disp / MAX_PUSH);

            const r     = Math.floor(30  + t * 225);
            const g     = Math.floor(15  + t * 165);
            const b     = Math.floor(60  + t * 196);
            const alpha  = 0.18 + t * 0.82;
            const radius = RADIUS + t * 2.2;

            ctx.beginPath();
            ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.fill();

            // Extra glow on highly displaced dots
            if (t > 0.5) {
                ctx.beginPath();
                ctx.arc(d.x, d.y, radius + 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(196,181,253,${(t - 0.5) * 0.35})`;
                ctx.fill();
            }
        });

        requestAnimationFrame(animate);
    }

    buildGrid();
    animate();
    window.addEventListener('resize', buildGrid);
})();

// 3D Model for Hero Section
if (!window.location.pathname.includes('project.html')) {
    const modelContainer = document.getElementById('model-container');
    if (modelContainer) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        modelContainer.appendChild(renderer.domElement);

        // Load GLTF
        let loadedModel = null;

        const loader = new THREE.GLTFLoader();
        loader.load('models/Dragon.glb', function(gltf) {
            loadedModel = gltf.scene;
            scene.add(loadedModel);
            loadedModel.scale.set(40.25, 40.25, 40.25);
            loadedModel.position.set(30, 180, 0);
            loadedModel.rotation.set(-0.81, 3.07, -2.19);

            camera.position.z = 12;
            camera.lookAt(loadedModel.position);

            // Wireframe
            loadedModel.traverse(function(child) {
                if (child.isMesh) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0x8B5CF6,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.8
                    });
                }
            });
        }, function(progress) {
            console.log('Loading progress:', progress);
        }, function(error) {
            console.error('Error loading model:', error);
        });

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(-1, -1, 1);
        scene.add(pointLight);

        // --- DEBUG DRAG TO POSITION ---
        const DEBUG = false;
        let isLeftDrag = false;
        let isRightDrag = false;
        let prevMouse = { x: 0, y: 0 };
        let autoRotate = false; // starts with auto rotation on

        if (DEBUG) {
            const debugBox = document.createElement('div');
            debugBox.style.cssText = `
        position: fixed; top: 80px; left: 10px; z-index: 9999;
        background: rgba(0,0,0,0.7); color: #a855f7;
        font-family: monospace; font-size: 13px;
        padding: 10px; border: 1px solid #a855f7; border-radius: 6px;
        line-height: 1.8; min-width: 320px;
    `;
            document.body.appendChild(debugBox);

            let editPosition = false;
            let editRotation = false;

            // Position toggle
            const posBtn = document.createElement('button');
            posBtn.style.cssText = `
        position: fixed; top: 220px; left: 10px; z-index: 10000;
        background: #555; color: #fff;
        font-family: monospace; font-size: 13px; font-weight: bold;
        padding: 8px 14px; border: none; border-radius: 6px; cursor: pointer;
        display: block; width: 180px; margin-bottom: 8px;
    `;
            posBtn.textContent = '📦 POSITION: OFF';
            document.body.appendChild(posBtn);

            // Rotation toggle
            const rotBtn = document.createElement('button');
            rotBtn.style.cssText = `
        position: fixed; top: 260px; left: 10px; z-index: 10000;
        background: #555; color: #fff;
        font-family: monospace; font-size: 13px; font-weight: bold;
        padding: 8px 14px; border: none; border-radius: 6px; cursor: pointer;
        display: block; width: 180px;
    `;
            rotBtn.textContent = '🔄 ROTATION: OFF';
            document.body.appendChild(rotBtn);

            posBtn.addEventListener('click', () => {
                editPosition = !editPosition;
                if (editPosition) editRotation = false; // only one active at a time
                posBtn.textContent = editPosition ? '📦 POSITION: ON' : '📦 POSITION: OFF';
                posBtn.style.background = editPosition ? '#22c55e' : '#555';
                rotBtn.textContent = '🔄 ROTATION: OFF';
                rotBtn.style.background = '#555';
                updateMode();
            });

            rotBtn.addEventListener('click', () => {
                editRotation = !editRotation;
                if (editRotation) editPosition = false;
                rotBtn.textContent = editRotation ? '🔄 ROTATION: ON' : '🔄 ROTATION: OFF';
                rotBtn.style.background = editRotation ? '#f59e0b' : '#555';
                posBtn.textContent = '📦 POSITION: OFF';
                posBtn.style.background = '#555';
                updateMode();
            });

            function updateMode() {
                const isEditing = editPosition || editRotation;
                const mc = document.getElementById('model-container');
                if (mc) mc.style.pointerEvents = isEditing ? 'auto' : 'none';
                renderer.domElement.style.zIndex = isEditing ? '1' : '-1';
                autoRotate = !isEditing;

                if (editPosition) {
                    debugBox.innerHTML = `
                📦 POSITION MODE<br>
                Left drag: move X/Y &nbsp;|&nbsp; Right drag: move Z<br><br>
                position.set(${loadedModel?.position.x.toFixed(2)}, ${loadedModel?.position.y.toFixed(2)}, ${loadedModel?.position.z.toFixed(2)});<br>
                rotation.set(${loadedModel?.rotation.x.toFixed(2)}, ${loadedModel?.rotation.y.toFixed(2)}, ${loadedModel?.rotation.z.toFixed(2)});<br>
                scale.set(${loadedModel?.scale.x.toFixed(2)}, ${loadedModel?.scale.y.toFixed(2)}, ${loadedModel?.scale.z.toFixed(2)});
            `;
                } else if (editRotation) {
                    debugBox.innerHTML = `
                🔄 ROTATION MODE<br>
                Left drag: rotate X/Y &nbsp;|&nbsp; Right drag: rotate Z<br><br>
                position.set(${loadedModel?.position.x.toFixed(2)}, ${loadedModel?.position.y.toFixed(2)}, ${loadedModel?.position.z.toFixed(2)});<br>
                rotation.set(${loadedModel?.rotation.x.toFixed(2)}, ${loadedModel?.rotation.y.toFixed(2)}, ${loadedModel?.rotation.z.toFixed(2)});<br>
                scale.set(${loadedModel?.scale.x.toFixed(2)}, ${loadedModel?.scale.y.toFixed(2)}, ${loadedModel?.scale.z.toFixed(2)});
            `;
                } else {
                    debugBox.innerHTML = `AUTO ROTATE ON<br>Toggle a mode to edit.`;
                }
            }

            function updateDebug() {
                if (!loadedModel) return;
                updateMode();
            }

            renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

            renderer.domElement.addEventListener('mousedown', (e) => {
                if (!editPosition && !editRotation) return;
                if (e.button === 0) isLeftDrag = true;
                if (e.button === 2) isRightDrag = true;
                prevMouse = { x: e.clientX, y: e.clientY };
            });

            renderer.domElement.addEventListener('mousemove', (e) => {
                if (!loadedModel) return;
                const dx = (e.clientX - prevMouse.x) * 0.01;
                const dy = (e.clientY - prevMouse.y) * 0.01;

                if (isLeftDrag && editPosition) {
                    loadedModel.position.x += dx;
                    loadedModel.position.y -= dy;
                }

                if (isRightDrag && editPosition) {
                    loadedModel.position.z += dy;
                }

                if (isLeftDrag && editRotation) {
                    loadedModel.rotation.x += dx;
                    loadedModel.rotation.y += dy;
                }

                if (isRightDrag && editRotation) {
                    loadedModel.rotation.z += dx;
                }

                if (isLeftDrag || isRightDrag) {
                    prevMouse = { x: e.clientX, y: e.clientY };
                    updateDebug();
                }
            });

            renderer.domElement.addEventListener('mouseup', () => {
                isLeftDrag = false;
                isRightDrag = false;
            });

            

            setInterval(() => { if (editPosition || editRotation) updateDebug(); }, 100);

            // init debug box
            updateMode();
        }
// --- END DEBUG ---

        function animateModel() {
            requestAnimationFrame(animateModel);
            renderer.render(scene, camera);
        }

        animateModel();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}
