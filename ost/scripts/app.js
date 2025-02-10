// Replace with your actual YouTube API key
const apiKey = "AIzaSyDgrrjCvgRM98yN1jCK4Smzn1UpkfNT7EA";
const playlistId = "PLTvK4cOB0oMToUKtwJCabc8UuWauNX1jL";
let videoData = [];
let currentIndex = 0;
let player;

function loadYouTubeAPI(callback) {
  const scriptTag = document.createElement("script");
  scriptTag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
  scriptTag.onload = callback;
}

function shufflePlaylist() {
  currentIndex = 0;
  videoData = shuffleArray(videoData);
  playVideoAtIndex(currentIndex);
  updatePlaylistDisplay();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function playVideoAtIndex(index) {
  if (typeof player !== "undefined") {
    player.loadVideoById(videoData[index].id);
    currentIndex = index;
  }
}

function playVideo() {
  if (typeof player !== "undefined") {
    player.playVideo();
  }
}

function pauseVideo() {
  if (typeof player !== "undefined") {
    player.pauseVideo();
  }
}

function skipVideo() {
  currentIndex = (currentIndex + 1) % videoData.length;
  playVideoAtIndex(currentIndex);
  updatePlaylistDisplay();
}

function returnVideo() {
  currentIndex = (currentIndex - 1 + videoData.length) % videoData.length;
  playVideoAtIndex(currentIndex);
  updatePlaylistDisplay();
}

function updatePlaylistDisplay() {
  const playlistContainer = document.getElementById("playlistContainer");
  playlistContainer.innerHTML = "";

  videoData.forEach((video, index) => {
    const listItem = document.createElement("p");
    listItem.textContent = `${index + 1}. ${video.title}`;
    listItem.className = index === currentIndex ? "current" : "";
    listItem.addEventListener("click", () => {
      playVideoAtIndex(index);
      updatePlaylistDisplay();
    });
    playlistContainer.appendChild(listItem);
  });
}

loadYouTubeAPI();

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    playerVars: {
      autoplay: 1, // Ensure this is set to 1 for autoplay
      modestbranding: 1,
      controls: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });
}

let videoState = -1; // Initialize video state to an invalid value

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    // Video ended, play the next video
    skipVideo();
  }

  videoState = event.data; // Update the current video state
}

function onPlayerReady(event) {
  fetchPlaylistItems(null);

  document.getElementById("shuffleButton").addEventListener("click", shufflePlaylist);
  document.getElementById("playButton").addEventListener("click", playVideo);
  document.getElementById("pauseButton").addEventListener("click", pauseVideo);
  document.getElementById("skipButton").addEventListener("click", skipVideo);
  document.getElementById("returnButton").addEventListener("click", returnVideo);
}

function fetchPlaylistItems(pageToken) {
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      videoData = videoData.concat(
        data.items.map((item) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
        }))
      );

      if (data.nextPageToken) {
        fetchPlaylistItems(data.nextPageToken);
      } else {
        shufflePlaylist();
      }
    });
}
function onPlayerReady(event) {
  fetchPlaylistItems(null);

  document.getElementById("shuffleButton").addEventListener("click", shufflePlaylist);
  document.getElementById("playButton").addEventListener("click", playVideo);
  document.getElementById("pauseButton").addEventListener("click", pauseVideo);
  document.getElementById("skipButton").addEventListener("click", skipVideo);
  document.getElementById("returnButton").addEventListener("click", returnVideo);
}

function fetchPlaylistItems(pageToken) {
  let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const videoItems = data.items;
      const videoIds = videoItems.map((item) => item.snippet.resourceId.videoId);

      // Check video availability
      fetchVideoDetails(videoIds).then((availableVideoIds) => {
        videoData = videoData.concat(
          videoItems
            .filter((item) => availableVideoIds.includes(item.snippet.resourceId.videoId))
            .map((item) => ({
              id: item.snippet.resourceId.videoId,
              title: item.snippet.title,
            }))
        );

        if (data.nextPageToken) {
          fetchPlaylistItems(data.nextPageToken);
        } else {
          shufflePlaylist();
        }
      });
    });
}

function fetchVideoDetails(videoIds) {
  const batchSize = 50; // Maximum batch size for API requests
  const batches = Array.from({ length: Math.ceil(videoIds.length / batchSize) }, (_, index) => videoIds.slice(index * batchSize, (index + 1) * batchSize));

  const promises = batches.map((batch) =>
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=id&id=${batch.join(",")}&key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => data.items.map((item) => item.id))
  );

  return Promise.all(promises).then((results) => results.flat());
}
function onPlayerError(event) {
  if (event.data === 150 || event.data === 101) {
    // Video is unavailable or restricted, skip to the next video
    skipVideo();
  }
}

const images = ["./assets/1.jpg", "./assets/2.webp", "./assets/3.jpg", "./assets/4.webp", "./assets/5.jpg"];
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * images.length);
  return `url('${images[randomIndex]}')`;
}

const penis = document.getElementById("peniss");
penis.style.backgroundImage = getRandomImage();

// Array of possible header content
const headerContent = [
  "NiiChan__: frimano sua familia ta sendo raptada e vc tem q ganhar pra salva eles?",
  "Diêgo Oliveira: tua mãe vai adoecer e morrer fdp. e tu vai lembrar de mim",
  "*DEAD* Scrappy Coco: report bigsauce",
  "・[Faw]: vai la chupa rola de traveco",
  "・[Faw]: Cala boca incel de merda",
  "essa é a steam do cara mais fudido do mundo, o maluco mais RACISTA que tu vai ver na sua vida, os cara nem da um A no chat e ele ja vai xingando os cara de preto macaco e morto de fome, enfim +rep",
];

// Get a random index for selecting header content
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// Update header content on page load
window.onload = function () {
  const headerElement = document.getElementById("quote");
  const randomIndex = getRandomIndex(headerContent.length);
  headerElement.textContent = headerContent[randomIndex];
};
