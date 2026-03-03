document.addEventListener("DOMContentLoaded", () => {
  const originalHeader = document.querySelector("header");
  if (!originalHeader) return;

  // Clone the header to create a sticky version that doesn't disrupt page layout
  const stickyHeader = originalHeader.cloneNode(true);
  stickyHeader.classList.add("sticky-header");
  document.body.appendChild(stickyHeader);

  // Set the threshold for the first fold (e.g., 400px or half the viewport height)
  const foldThreshold = window.innerHeight * 0.6; // Appears after scrolling 60% of the screen

  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // "appears when scrolling beyond the first fold"
    if (currentScrollY > foldThreshold) {
      if (currentScrollY < lastScrollY) {
        // Scrolling UP
        // If the user meant "hide when scrolling up", they said "disappear when scrolling back up"
        // Most common pattern: show when scrolling UP, hide when scrolling DOWN.
        // But to strictly satisfy "disappears when scrolling back up", we'll implement it such that:
        // Wait, "The header should disappear when scrolling back up" might mean:
        // When you scroll back up PAST the fold, it disappears!
        stickyHeader.classList.add("visible");
      } else {
        // Scrolling DOWN
        stickyHeader.classList.add("visible");
      }
    } else {
      // Above the fold - Disappears when scrolling back up to the top
      stickyHeader.classList.remove("visible");
    }

    lastScrollY = currentScrollY;
  });

  // Carousel & Zoom Logic
  const thumbnails = document.querySelectorAll('.carousel-thumbnails .thumbnail');
  const mainImage = document.getElementById('mainImage');
  const mainImageContainer = document.getElementById('mainImageContainer');

  if (thumbnails.length > 0 && mainImage && mainImageContainer) {
    thumbnails.forEach(thumb => {
      // Switch image on hover for a smoother desktop experience as typical in modern e-commerce
      thumb.addEventListener('mouseenter', function() {
        mainImage.src = this.src;
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });

      // Also bind click for accessibility or touch screens
      thumb.addEventListener('click', function() {
        mainImage.src = this.src;
        thumbnails.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });

    // Zoom Effect
    mainImageContainer.addEventListener('mousemove', (e) => {
      const rect = mainImageContainer.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element.
      const y = e.clientY - rect.top;  // y position within the element.

      // Calculate percentage for transform-origin
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      // Move the transform origin to the cursor location
      mainImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    });

    // Reset origin completely on mouse leave
    mainImageContainer.addEventListener('mouseleave', () => {
      mainImage.style.transformOrigin = `center center`;
    });
  }
});
