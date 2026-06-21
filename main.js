document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // 1. Custom Cursor
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

    if (window.matchMedia("(min-width: 1024px)").matches && cursor && follower) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: () => {
                posX += (mouseX - posX) / 6; posY += (mouseY - posY) / 6;
                gsap.set(follower, { css: { left: posX, top: posY } });
                gsap.set(cursor, { css: { left: mouseX, top: mouseY } });
            }
        });
        window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-active'); follower.classList.add('hover-active');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-active'); follower.classList.remove('hover-active');
            });
        });
    }

    // 2. Global Scroll Progress Bar
    gsap.to('#scroll-progress', {
        width: '100%',
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });

    // 3. Dynamic Background Color Changes based on Section Data Attributes
    const globalMesh = document.getElementById('global-mesh');
    document.querySelectorAll('section').forEach(section => {
        const color = section.getAttribute('data-color');
        if (color) {
            ScrollTrigger.create({
                trigger: section,
                start: "top 50%",
                end: "bottom 50%",
                onEnter: () => globalMesh.setAttribute('data-active', color),
                onEnterBack: () => globalMesh.setAttribute('data-active', color),
            });
        }
    });

    // 4. Hero Animations
    const heroTl = gsap.timeline();
    heroTl.to('.hero-title-word', { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power4.out" })
          .to('.hero-element', { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=1");

    // 5. Standard Text Reveals (Fade in Up)
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.fromTo(text, { opacity: 0, y: 30 }, {
            opacity: 1, y: 0, duration: 1.2, ease: "power2.out",
            scrollTrigger: { trigger: text, start: "top 85%" }
        });
    });

    // 6. Through the Wire - Fade In Without Pinning
    gsap.to('.wire-text', {
        opacity: 1, filter: "blur(0px)",
        stagger: 0.2,
        scrollTrigger: { 
            trigger: '#wire', 
            start: "top 60%", 
            end: "bottom 80%", 
            scrub: 1
        }
    });
    // Set initial state for wire text
    gsap.set('.wire-text', { opacity: 0.2, filter: "blur(10px)" });

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let menuOpen = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            if (menuOpen) {
                mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                mobileMenu.classList.add('opacity-0', 'pointer-events-none');
                document.body.style.overflow = '';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                mobileMenu.classList.add('opacity-0', 'pointer-events-none');
                document.body.style.overflow = '';
            });
        });
    }

    // 7. Horizontal Scroll for Trilogy (Responsive)
    let mm = gsap.matchMedia();
    const trilogyWrapper = document.querySelector('.trilogy-wrapper');

    mm.add("(min-width: 1024px)", () => {
        if (trilogyWrapper) {
            gsap.to(trilogyWrapper, {
                x: () => -(trilogyWrapper.scrollWidth - window.innerWidth) + "px",
                ease: "none",
                scrollTrigger: {
                    trigger: '#trilogy',
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => "+=" + (trilogyWrapper.scrollWidth - window.innerWidth),
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });
        }
    });

    mm.add("(max-width: 1023px)", () => {
        // Simple fade up for mobile albums instead of horizontal scroll
        gsap.utils.toArray('.trilogy-wrapper > div').forEach(item => {
            gsap.fromTo(item, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, y: 0, duration: 1, 
                    scrollTrigger: { trigger: item, start: "top 80%" }
                }
            );
        });
    });

    // 8. Parallax Images
    gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    // 9. Donda Circle Expansion
    gsap.to('#donda-circle', {
        width: "300vw", height: "300vw",
        scrollTrigger: { trigger: '#donda', start: "top 20%", end: "bottom bottom", scrub: 1 }
    });

    // 10. Quote Generator Logic
    const quotes = [
        "\"I refuse to accept other people's ideas of happiness for me. As if there's a 'one size fits all' standard for happiness.\"",
        "\"My greatest pain in life is that I will never be able to see myself perform live.\"",
        "\"I'm doing pretty good as far as geniuses go.\"",
        "\"If you have the opportunity to play this game of life you need to appreciate every moment.\"",
        "\"I leave my emojis bart Simpson color.\"",
        "\"You can't look at a glass half full or empty if it's overflowing.\"",
        "\"I still think I am the greatest.\""
    ];
    
    const quoteContainer = document.getElementById('quote-container');
    const quoteText = document.getElementById('quote-text');
    
    if(quoteContainer && quoteText) {
        quoteContainer.addEventListener('click', () => {
            gsap.to(quoteText, {
                opacity: 0, duration: 0.3, 
                onComplete: () => {
                    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                    quoteText.innerText = randomQuote;
                    gsap.to(quoteText, { opacity: 1, duration: 0.5 });
                }
            });
        });
    }

    // Smooth Scroll Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) gsap.to(window, { duration: 1.5, scrollTo: target, ease: "power4.inOut" });
        });
    });
});
