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

  // Product Image Carousel
  const mainImage = document.getElementById("mainImage");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImageBack = document.querySelector(".main-image-preview-back");
  const mainImageNext = document.querySelector(".main-image-preview-next");

  let currentMainImageIndex = 0;

  function updateMainImage(index) {
    if (thumbnails.length === 0 || !mainImage) return;
    // Update main image source (assuming thumbnails have the correct src)
    mainImage.src = thumbnails[index].src;

    // Update active class on thumbnails
    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    thumbnails[index].classList.add("active");
    currentMainImageIndex = index;

    // Update lens image source
    const result = document.getElementById("zoomPreview");
    if (result) {
      result.style.backgroundImage = `url('${mainImage.src}')`;
    }
  }

  if (mainImageNext && mainImageBack) {
    mainImageNext.addEventListener("click", () => {
      let nextIndex = (currentMainImageIndex + 1) % thumbnails.length;
      updateMainImage(nextIndex);
    });

    mainImageBack.addEventListener("click", () => {
      let prevIndex = (currentMainImageIndex - 1 + thumbnails.length) % thumbnails.length;
      updateMainImage(prevIndex);
    });

    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        updateMainImage(index);
      });
    });
  }

  // Manufacturing Process Carousel
  const mfgCarouselImage = document.querySelector(".manufacturing-process-step-image-carousel-image > img:not(.manufacturing-process-step-image-carousel-back):not(.manufacturing-process-step-image-carousel-next)");
  const mfgBackBtn = document.querySelector(".manufacturing-process-step-image-carousel-back");
  const mfgNextBtn = document.querySelector(".manufacturing-process-step-image-carousel-next");
  const mfgDots = document.querySelectorAll(".manufacturing-process-step-image-carousel-dots .dot");

  let currentMfgIndex = 0;

  function updateMfgCarousel(index) {
    if (mfgDots.length === 0) return;

    // Update active class on dots
    mfgDots.forEach(dot => dot.classList.remove("active"));
    mfgDots[index].classList.add("active");
    currentMfgIndex = index;

    // In a real application, you might change the image source here if you have an array of image URLs
    // Example: if (mfgCarouselImage) mfgCarouselImage.src = mfgImagesArray[index];
  }

  if (mfgNextBtn && mfgBackBtn) {
    mfgNextBtn.closest('div').addEventListener("click", () => {
      let nextIndex = (currentMfgIndex + 1) % mfgDots.length;
      updateMfgCarousel(nextIndex);
    });

    mfgBackBtn.closest('div').addEventListener("click", () => {
      let prevIndex = (currentMfgIndex - 1 + mfgDots.length) % mfgDots.length;
      updateMfgCarousel(prevIndex);
    });

    mfgDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        updateMfgCarousel(index);
      });
    });
  }
});

const img = document.getElementById("mainImage");
const lens = document.getElementById("zoomLens");
const result = document.getElementById("zoomPreview");

const zoom = 3;

result.style.backgroundImage = `url(${img.src})`;

img.addEventListener("mouseenter", () => {
  lens.style.display = "block";
  result.style.display = "block";
});

img.addEventListener("mouseleave", () => {
  lens.style.display = "none";
  result.style.display = "none";
});

img.addEventListener("mousemove", moveLens);

function moveLens(e) {
  e.preventDefault();

  const rect = img.getBoundingClientRect();

  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  const lensWidth = lens.offsetWidth;
  const lensHeight = lens.offsetHeight;

  x = x - lensWidth / 2;
  y = y - lensHeight / 2;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  console.log('x', x)
  console.log('y', y)

  if (x > img.offsetWidth - lensWidth) x = img.offsetWidth - lensWidth;
  if (y > img.offsetHeight - lensHeight) y = img.offsetHeight - lensHeight;

  lens.style.left = x + "px";
  lens.style.top = y + "px";
  console.log('lensleft', lens.style.left)
  console.log('lenstop', lens.style.top)
  console.log('lenswidth', lensWidth)
  console.log('lensheight', lensHeight)

  const cx = result.offsetWidth / lensWidth;
  console.log("🚀 ~ moveLens ~ cx:", cx)
  const cy = result.offsetHeight / lensHeight;
  console.log("🚀 ~ moveLens ~ cy:", cy)


  result.style.backgroundImage = `url('${img.src}')`;
  result.style.backgroundSize = (img.offsetWidth * cx) + "px " + (img.offsetHeight * cy) + "px";
  result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
}
