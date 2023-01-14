const stickerContainer = document.querySelector(".sticker_container");
const gifContainer = document.querySelector(".gif_container");

const stickerHandlerBtn = document.querySelector("#stickerHandler");
const gifHandlerBtn = document.querySelector("#gifHandler");

const stickersBox = document.querySelector(".stickers");
const gifBox = document.querySelector(".gifs");
const overlay = document.querySelector(".overlay");

const stickerInput = document.querySelector("input#stickerInput");
const gifInput = document.querySelector("input#gifInput");

//Global variable
let timer;

//load all sticker
async function loadSticker(searchTerm) {
  const url = searchTerm
    ? `http://localhost:5000/external/stickers/search?q=${searchTerm}`
    : `http://localhost:5000/external/trending`;
  stickersBox.innerHTML = `
    <div class='spinner_container w-100'>
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      </div>`;
  const result = await fetch(url);
  const { data } = await result.json();

  if (data.length) {
    stickersBox.innerHTML = "";
    data.forEach((sticker) => {
      const stickersObj = sticker.images.fixed_width;
      const div = document.createElement("div");
      div.classList.add("sticker");
      div.dataset.sticker = JSON.stringify(stickersObj);
      div.addEventListener("click", (e) => sendStickerHandler(e));
      div.innerHTML = `<img src="${stickersObj.url}"/>`;

      stickersBox.appendChild(div);
    });
  } else {
    stickersBox.innerHTML = `<h5 class='stickerError'>No result found!</h5>`;
  }
}

//load all gifs
async function loadGif(searchTerm) {
  const url = searchTerm
    ? `http://localhost:5000/external/gifs/search?q=${searchTerm}`
    : `http://localhost:5000/external/gifs/trending`;

  const data = await fetch(url);
  const { results } = await data.json();

  gifBox.innerHTML = `
  <div class='spinner_container w-100'>
    <div class="spinner-border text-danger" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    </div>`;

  if (results.length) {
    gifBox.innerHTML = "";
    results.forEach((gif) => {
      const gifObj = gif.media_formats.gif.url;
      const div = document.createElement("div");
      div.addEventListener("click", (e) => sendGifHandler(e));
      div.classList.add("gif");
      div.dataset.gif = JSON.stringify(gif);
      div.innerHTML = `<img src="${gifObj}"/>`;

      gifBox.appendChild(div);
    });
  } else {
    gifBox.innerHTML = `<h5 class='stickerError'>No result found!</h5>`;
  }
}

//sticker handler
stickerHandlerBtn.addEventListener("click", function (e) {
  if (e.target.id === "stickerHandler") {
    stickerContainer.hidden = false;
    overlay.hidden = false;
  }
  loadSticker();
});
//gif handler
gifHandlerBtn.addEventListener("click", function (e) {
  if (e.target.id === "gifHandler") {
    gifContainer.hidden = false;
    overlay.hidden = false;
  }

  loadGif();
});

overlay.addEventListener("click", function () {
  stickerContainer.hidden = true;
  gifContainer.hidden = true;
  overlay.hidden = true;
});

//send sticker event handler
function sendStickerHandler(e) {
  const stickerObj = JSON.parse(e.target.dataset.sticker);
  console.log(stickerObj);
}
//send gif event handler
function sendGifHandler(e) {
  const gifObj = JSON.parse(e.target.dataset.gif);
  console.log(gifObj);
}

//search gif handler
stickerInput.addEventListener("input", function () {
  clearTimeout(timer);

  const searchTerm = stickerInput.value;
  if (searchTerm) {
    loadSticker(searchTerm);
  }
});
//search sticker handler
gifInput.addEventListener("input", function () {
  clearTimeout(timer);

  const searchTerm = gifInput.value;
  if (searchTerm) {
    loadGif(searchTerm);
  }
});
