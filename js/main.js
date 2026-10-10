// check if user's system settings preference is set to reduced motion
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const enterBtn = document.getElementById("enter-btn");
  if (enterBtn) {
    const enterSite = (event) => {
      if (event) event.preventDefault();
      const destination = enterBtn.getAttribute("href");
      if (prefersReducedMotion) {
        window.location.href = destination;
        return;
      }
      document.body.classList.add("leaving");
      setTimeout(() => {
        window.location.href = destination;
      }, 350);
    };

    enterBtn.addEventListener("click", enterSite);

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "A" || tag === "BUTTON") return;
      enterSite();
    });

    enterBtn.focus({ preventScroll: true });
  }

  /* mobile nav toggle */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* home page: sections and elements slide in/out as they scroll past */
  if (
    document.querySelector(".hero") &&
    !prefersReducedMotion &&
    "IntersectionObserver" in window
  ) {
    // Each entry slides in as one single block (alternating left and right sid)
    // closest: animate the nearest matching ancestor of the match instead
    const targets = [
      { selector: ".hero > .container" },
      { selector: "#about > .container" },
      { selector: "#my-games > .container:first-child" },
      { selector: ".game-list .game-card", alternate: true },
      { selector: ".contact-text", closest: ".container" },
    ];

    // toggles both ways, so elements also slide back out when scrolled away
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: 0 },
    );

    targets.forEach(({ selector, closest, alternate = false }) => {
      document.querySelectorAll(selector).forEach((match, i) => {
        const el = closest ? match.closest(closest) : match;
        if (!el) return;
        el.classList.add("scroll-anim");
        if (alternate) {
          el.classList.add(i % 2 === 0 ? "from-left" : "from-right");
        }
        observer.observe(el);
      });
    });
  }

  // hero video: don't autoplay for people who prefer reduced motion
  const heroVideo = document.querySelector(".hero-video video");
  // if (heroVideo && prefersReducedMotion) {
  //   heroVideo.removeAttribute("autoplay");
  //   heroVideo.pause();
  // }

  // footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // restore page if user navigates back to it from the bfcache
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) document.body.classList.remove("leaving");
  });
});
