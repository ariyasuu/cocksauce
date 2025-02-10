const clickButton = document.getElementById("clickButton");
const countElement = document.getElementById("count");
let clickCount = parseInt(localStorage.getItem("clickCount")) || 0;

countElement.textContent = clickCount;

clickButton.addEventListener("click", function () {
  clickCount++;
  countElement.textContent = clickCount;
  localStorage.setItem("clickCount", clickCount);

  // Play clickSound2 at multiples of 100
  if (clickCount % 100 === 0) {
    const soundElement = document.getElementById("clickSound2");
    soundElement.currentTime = 0;
    soundElement.play();
  } else {
    // Play clickSound1 for every click
    const soundElement = document.getElementById("clickSound1");
    soundElement.currentTime = 0;
    soundElement.play();
  }
});
