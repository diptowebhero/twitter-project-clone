const stickerContainer = document.querySelector(".sticker_container");
const gifContainer = document.querySelector(".gif_container");

const stickerHandlerBtn = document.querySelector("#stickerHandler");
const gifHandlerBtn = document.querySelector("#gifHandler");

const stickersBox = document.querySelector(".stickers");
const gifBox = document.querySelector(".gifs");
const overlay = document.querySelector(".overlay");

const stickerInput = document.querySelector("input#stickerInput");
const gifInput = document.querySelector("input#gifInput");

const msgInput = document.querySelector("textarea#msgInput");
const msgSendBtn = document.querySelector("button.sendMassageBtn");

//select image reference
const selectedImages = document.querySelector(".selectedImages");
const imageInput = document.querySelector("input#image");
const imageContainer = document.querySelector(".image-container");

//Global variable
let timer;
let messageImages = [];

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
  sendMessage(null, null, null, stickerObj);
}
//send gif event handler
function sendGifHandler(e) {
  const gifObj = JSON.parse(e.target.dataset.gif);
  sendMessage(null, null, gifObj);
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

//select images
imageInput.addEventListener("change", function () {
  // toasts error
  const fileSizeLimitError = Toastify({
    text: "File size must not exceed 1MB",
    duration: 4000,
  });

  const fileTypeLimitError = Toastify({
    text: "Only jpeg, jpg, png, svg file is allowed",
    duration: 4000,
  });

  const files = this.files;

  imageInput.files = new DataTransfer().files;
  [...files].forEach((file) => {
    /* Checking if the file type is not include in the array. it will return the
    error message. */
    if (
      !["image/png", "image/jpg", "image/jpeg", "images/svg+xml"].includes(
        file.type
      )
    ) {
      return fileTypeLimitError.showToast();
    }

    /* Checking if the file size is greater than 1MB. If it is, it will return the error message. */
    if (file.size > 1000000) {
      return fileSizeLimitError.showToast();
    }

    let filename = file.name;
    filename = filename.replace(" ", "-");
    filename = filename.split(".");
    const fileExt = filename[filename.length - 1];
    filename.pop();

    filename = filename.join("-") + "-" + new Date().getTime() + "." + fileExt;

    // change file original name
    file = new File([file], filename, {
      type: file.type,
    });
    selectedImages.removeAttribute("hidden");
    messageImages.push(file);

    const fr = new FileReader();

    fr.onload = (e) => {
      const div = document.createElement("div");
      div.classList.add("img");
      div.dataset.name = file.name;
      div.innerHTML = `
        <button id="crossBtn" class="crossBtn"><i class="fas fa-times" aria-hidden="true"></i></button><img src="${fr.result}" alt="">
        `;
      imageContainer.appendChild(div);
    };

    fr.readAsDataURL(file);
  });
});

//remove specific image
imageContainer.addEventListener("click", function (e) {
  const crossBtn = e.target.id === "crossBtn" ? e.target.id : null;
  if (crossBtn) {
    const imgEl = e.target.parentElement;
    const imgName = imgEl.dataset.name;
    messageImages.forEach((img, i) => {
      if (imgName === img.name) {
        messageImages.splice(i, 1);
        imgEl.remove();

        if (!messageImages.length) {
          selectedImages.setAttribute("hidden", "");
        }
      }
    });
  } else {
    return;
  }
});

//Handle send message

msgInput.addEventListener("keyup", function (e) {
  const message = this.value.trim();
  if (e.key === "Enter" && !e.shiftKey) {
    if (message || messageImages.length) {
      msgInput.value = "";
      sendMessage(message, messageImages);
    } else {
      console.log("empty message");
    }
  }
});

msgSendBtn.addEventListener("click", function (e) {
  const message = msgInput.value.trim();
  if (message || messageImages.length) {
    msgInput.value = "";
    sendMessage(message, messageImages);
  }
});

//send message
function sendMessage(message, images = [], sticker, gif) {
  const url = `${window.location.origin}/messages/${chatId}`;
  let payload = {
    message: message ? message : "",
    gif: gif ? gif : null,
    sticker: sticker ? sticker : null,
    replyTo: null,
  };

  const isImages = images && images.length;
  if (isImages) {
    payload = new FormData();
    payload.append("message", message ? message : "");
    payload.append("replyTo", null);

    images.forEach((file) => {
      payload.append(file.name, file);
    });
  }

  const options = isImages
    ? { method: "POST", body: payload }
    : {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log(data.sender);

      if (data.message || data.images.length) {
        imageContainer.innerHTML = "";
        selectedImages.hidden = true;
        messageImages = [];
      }
    });
}
