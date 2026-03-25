const fallbackImages = [
  {
    src: "assets/gallery/chocolate-drip-cake.jpg",
    title: "Chocolate Drip",
    description: "Smooth buttercream with a polished chocolate finish.",
  },
  {
    src: "assets/gallery/petals.jpg",
    title: "Petals",
    description: "Soft florals and pastel tones for a refined celebration look.",
  },
  {
    src: "assets/gallery/raspberry.jpg",
    title: "Sugar Dusted Raspberry",
    description: "Elegant berry styling with a fresh, romantic palette.",
  },
  {
    src: "assets/gallery/maccaroon-cupcakes.jpg",
    title: "Macaron Cupcakes",
    description: "Detailed decoration with a statement finish.",
  },
  {
    src: "assets/gallery/sweet-cupcake-treat.jpg",
    title: "Sweet Cupcake Treat",
    description: "Detailed decoration with a statement finish.",
  },
  {
    src: "assets/gallery/paint-splash-cake.jpg",
    title: "Paint Splash Cake",
    description: "Artistic cake with vibrant colors",
  },
  {
    src: "assets/gallery/elegant-crystal-cake.jpg",
    title: "Elegant Crystal Cake",
    description: "Eyecatching design with shimmering crystals.",
  },
  {
    src: "assets/gallery/candy-land-cake.jpg",
    title: "Candy Land Cake",
    description: "Vibrant and playful design with a variety of colorful candies.",
  },
  {
    src: "assets/gallery/icecream-delight.jpg",
    title: "Ice Cream Delight",
    description: "A sweet and creamy dessert with a delightful twist.",
  },
  {
    src: "assets/gallery/gooey-blondies.jpg",
    title: "Gooey Blondies",
    description: "Decadent and fudgy blondies with a gooey center.",
  },
];

const galleryRoot = document.querySelector("#gallery-grid");
const featuredImage = document.querySelector("#featured-image");
const featuredTitle = document.querySelector("#featured-title");
const featuredDescription = document.querySelector("#featured-description");
const galleryStatus = document.querySelector("#gallery-status");
const galleryLoadMore = document.querySelector("#gallery-load-more");
const gallerySentinel = document.querySelector("#gallery-sentinel");

const BATCH_SIZE = 12;

let galleryItems = [];
let renderedCount = 0;
let loadObserver;

function formatTitle(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function setGalleryStatus(message) {
  if (galleryStatus) {
    galleryStatus.textContent = message;
  }
}

function setFeatured(item, button) {
  featuredImage.src = item.src;
  featuredImage.alt = item.title;
  featuredTitle.textContent = item.title;
  featuredDescription.textContent = item.description;

  document.querySelectorAll(".thumb-button").forEach((thumb) => {
    thumb.setAttribute("aria-pressed", String(thumb === button));
  });
}

function createThumbButton(item, index) {
  const button = document.createElement("button");
  const imageLoading = index < 4 ? "eager" : "lazy";

  button.type = "button";
  button.className = "thumb-button";
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = `
    <span class="thumb-card">
      <img src="${item.src}" alt="${item.title}" loading="${imageLoading}" decoding="async">
      <strong>${item.title}</strong>
    </span>
  `;

  button.addEventListener("click", () => setFeatured(item, button));
  return button;
}

function updateGalleryControls() {
  if (!galleryItems.length) {
    if (galleryLoadMore) {
      galleryLoadMore.hidden = true;
    }
    return;
  }

  const allLoaded = renderedCount >= galleryItems.length;
  setGalleryStatus(`Showing ${renderedCount} of ${galleryItems.length} images`);

  if (galleryLoadMore) {
    galleryLoadMore.hidden = allLoaded;
    galleryLoadMore.disabled = allLoaded;
  }
}

function renderNextBatch() {
  if (!galleryRoot || renderedCount >= galleryItems.length) {
    updateGalleryControls();
    return;
  }

  const nextItems = galleryItems.slice(renderedCount, renderedCount + BATCH_SIZE);
  nextItems.forEach((item, offset) => {
    const button = createThumbButton(item, renderedCount + offset);
    galleryRoot.insertBefore(button, gallerySentinel);
  });

  renderedCount += nextItems.length;

  if (renderedCount === nextItems.length) {
    const firstThumb = galleryRoot.querySelector(".thumb-button");
    if (firstThumb) {
      setFeatured(galleryItems[0], firstThumb);
    }
  }

  updateGalleryControls();
}

function initializeGallery(items) {
  if (!galleryRoot || !items.length) {
    return;
  }

  galleryItems = items;
  renderedCount = 0;

  galleryRoot.querySelectorAll(".thumb-button").forEach((thumb) => thumb.remove());
  renderNextBatch();
}

function setupBatchLoading() {
  if (galleryLoadMore) {
    galleryLoadMore.addEventListener("click", renderNextBatch);
  }

  if (!gallerySentinel || !galleryRoot || typeof IntersectionObserver === "undefined") {
    return;
  }

  const overflowY = window.getComputedStyle(galleryRoot).overflowY;
  const observerRoot = overflowY === "auto" || overflowY === "scroll" ? galleryRoot : null;

  loadObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      renderNextBatch();
    }
  }, {
    root: observerRoot,
    rootMargin: "220px 0px",
  });

  loadObserver.observe(gallerySentinel);
}

async function loadRepoGallery() {
  const endpoint = "https://api.github.com/repos/johnnaojo/goodbatterbakeshop.github.io/contents/assets/gallery";
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error("Gallery folder could not be loaded from GitHub.");
  }

  const data = await response.json();
  const images = data
    .filter((item) => item.type === "file" && /\.(png|jpe?g|webp|gif|svg)$/i.test(item.name))
    .map((item) => ({
      src: item.download_url,
      title: formatTitle(item.name),
      description: "Uploaded gallery image.",
    }));

  return images.length ? images : fallbackImages;
}

setupBatchLoading();

loadRepoGallery()
  .then(initializeGallery)
  .catch(() => {
    setGalleryStatus("Showing fallback gallery");
    initializeGallery(fallbackImages);
  });
