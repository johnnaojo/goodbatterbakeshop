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
];

const galleryRoot = document.querySelector("#gallery-grid");
const featuredImage = document.querySelector("#featured-image");
const featuredTitle = document.querySelector("#featured-title");
const featuredDescription = document.querySelector("#featured-description");

function formatTitle(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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

function renderGallery(items) {
  if (!galleryRoot) {
    return;
  }

  galleryRoot.innerHTML = "";

  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "thumb-button";
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");

    button.innerHTML = `
      <span class="thumb-card">
        <img src="${item.src}" alt="${item.title}">
        <strong>${item.title}</strong>
      </span>
    `;

    button.addEventListener("click", () => setFeatured(item, button));
    galleryRoot.appendChild(button);
  });

  setFeatured(items[0], galleryRoot.querySelector(".thumb-button"));
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

loadRepoGallery()
  .then(renderGallery)
  .catch(() => renderGallery(fallbackImages));
