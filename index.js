const folderId = "10njW2YGgJcqY2Lw2XRtv5v7Z4BWy_HtN";
const imagesContainer = document.getElementById("images-container");
let isLoadingImages = false;
let nextPageToken = null;
let isScrolling = false; // Flag to prevent unnecessary calls to loadMoreImages

async function fetchImagesFromDrive() {
  try {
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&pageSize=1000&key=AIzaSyBj15F5M7QXJZP76CHVqCxeZLsvoNTy7gI${
      nextPageToken ? `&pageToken=${nextPageToken}` : ""
    }`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.files) {
      const imageFiles = data.files.filter((file) => file.mimeType.startsWith("image/"));
      nextPageToken = data.nextPageToken;
      return imageFiles;
    } else {
      throw new Error("No image files found in the folder.");
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}

async function loadMoreImages() {
  if (isLoadingImages || isScrolling) return;
  isLoadingImages = true;

  try {
    const imageFiles = await fetchImagesFromDrive();
    const fragment = document.createDocumentFragment();

    imageFiles.forEach((image) => {
      const imageUrl = `https://drive.google.com/thumbnail?id=${image.id}&sz=w512`;
      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.alt = image.name;
      imgElement.addEventListener("click", () => openModal(imageUrl, imgElement.alt));
      fragment.appendChild(imgElement);
    });

    imagesContainer.appendChild(fragment);
    isLoadingImages = true;

    if (nextPageToken) {
      isScrolling = true;
    }
  } catch (error) {
    console.error("Error loading more images:", error);
    isLoadingImages = false;
  }
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    isScrolling = false;
    loadMoreImages();
  }
}

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalAltText = document.getElementById("modalAltText");
const closeBtn = document.getElementsByClassName("close")[0];

function openModal(imageUrl, altText) {
  modal.style.display = "flex";
  modalImage.src = imageUrl;
  modalAltText.textContent = altText;
}

closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (event) => event.target === modal && (modal.style.display = "none");

window.addEventListener("scroll", handleScroll);
loadMoreImages();