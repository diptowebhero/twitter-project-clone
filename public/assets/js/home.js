//select all references
const postImageInp = document.querySelector("#postImage");
const postImageContainer = document.querySelector("#postImageContainer");
const tweetBtn = document.querySelector("#tweetBtn");
const textAreaInpPost = document.querySelector("#textAreaContent");
const tweetPostContainer = document.querySelector(".tweetPost_container");

//for reply
const textAreaInpPostReply = document.querySelector("#replyTextAreaContent");
const replyBtn = document.querySelector("#replyBtn");
const replyPostImageInp = document.querySelector("#replyPostImage");
const replyImageContainer = document.querySelector(".replyImageContainer");

//set default style tweet btn
tweetBtn.style.backgroundColor = "#76b9e5";
replyBtn.style.backgroundColor = "#76b9e5";

//STORE POST IMAGES
let postImages = [];
let replyImages = [];

//common function for textarea input handling
function textAreaInpHandler(input, btn) {
  input.addEventListener("input", function () {
    const value = this.value.trim();
    if (value || postImages.length) {
      btn.removeAttribute("disabled", "");
      btn.style.background = "#1d9bf0";
    } else {
      btn.setAttribute("disabled", "");
      btn.style.background = "#76b9e5";
    }
  });
}
//post textarea handling
textAreaInpHandler(textAreaInpPost, tweetBtn);

//reply textarea handling
textAreaInpHandler(textAreaInpPostReply, replyBtn);

//uploading post image handler
postImageInp.addEventListener("change", function () {
  const files = this.files;
  [...files].forEach((file) => {
    // toasts error
    const fileSizeLimitError = Toastify({
      text: "File is too large",
      duration: 4000,
    });
    const fileTypeLimitError = Toastify({
      text: "Only jpeg, jpg, png, svg file is allowed",
      duration: 4000,
    });
    if (
      !["image/png", "image/jpg", "image/jpeg", "images/svg+xml"].includes(
        file.type
      )
    ) {
      return fileTypeLimitError.showToast();
    }
    if (file.size > 1000000) {
      return fileSizeLimitError.showToast();
    }
    tweetBtn.removeAttribute("disabled", "");
    tweetBtn.style.background = "#1d9bf0";
    postImages.push(file);
    const fr = new FileReader();
    fr.onload = function () {
      const htmlEl = document.createElement("div");
      htmlEl.classList.add("image");
      htmlEl.dataset.name = file.name;
      htmlEl.innerHTML = `<span id="close_btn">
                            <i class="fas fa-times"></i>
                          </span><img>`;
      const img = htmlEl.querySelector("img");
      img.src = fr.result;
      postImageContainer.appendChild(htmlEl);
    };
    fr.readAsDataURL(file);
  });
});

//uploading reply image handler
replyPostImageInp.addEventListener("change", function () {
  const files = this.files;
  replyImages = [];
  [...files].forEach((file) => {
    // toasts error
    const fileSizeLimitError = Toastify({
      text: "File is too large",
      duration: 4000,
    });
    const fileTypeLimitError = Toastify({
      text: "Only jpeg, jpg, png, svg file is allowed",
      duration: 4000,
    });
    if (
      !["image/png", "image/jpg", "image/jpeg", "images/svg+xml"].includes(
        file.type
      )
    ) {
      return fileTypeLimitError.showToast();
    }
    if (file.size > 1000000) {
      return fileSizeLimitError.showToast();
    }
    replyBtn.removeAttribute("disabled", "");
    replyBtn.style.background = "#1d9bf0";
    replyImages.push(file);
    const fr = new FileReader();
    fr.onload = function () {
      const htmlEl = document.createElement("div");
      htmlEl.classList.add("image");
      htmlEl.dataset.name = file.name;
      htmlEl.innerHTML = `<span id="close_btn">
                            <i class="fas fa-times"></i>
                          </span><img>`;
      const img = htmlEl.querySelector("img");
      img.src = fr.result;
      replyImageContainer.appendChild(htmlEl);
    };
    fr.readAsDataURL(file);
  });
});

//remove post image
postImageContainer.addEventListener("click", function (e) {
  const closeBtn = e.target.id === "close_btn" ? e.target.id : null;
  if (closeBtn) {
    const imgEl = e.target.parentElement;
    const imgName = imgEl.dataset.name;
    postImages.forEach((img, i) => {
      if (imgName === img.name) {
        postImages.splice(i, 1);
        imgEl.remove();
        if (!postImages.length && !textAreaInpPost.value.trim()) {
          tweetBtn.setAttribute("disabled", "");
          tweetBtn.style.background = "#76b9e5";
        }
      }
    });
  } else {
    return;
  }
});

//remove reply image
replyImageContainer.addEventListener("click", function (e) {
  const closeBtn = e.target.id === "close_btn" ? e.target.id : null;
  if (closeBtn) {
    const imgEl = e.target.parentElement;
    const imgName = imgEl.dataset.name;
    replyImages.forEach((img, i) => {
      if (imgName === img.name) {
        replyImages.splice(i, 1);
        imgEl.remove();
        if (!replyImages.length && !replyTextAreaContent.value.trim()) {
          replyBtn.setAttribute("disabled", "");
          replyBtn.style.background = "#76b9e5";
        }
      }
    });
  } else {
    return;
  }
});

//submitting tweet handler
tweetBtn.addEventListener("click", function (e) {
  const content = textAreaInpPost.value.trim();
  if (!(postImages.length || content)) return;

  //store form data in formData api
  const formData = new FormData();
  formData.append("content", content);

  //store tweet image in formData
  postImages.forEach((file) => {
    formData.append(file.name, file);
  });

  //post & store data in database
  const url = `${window.location.origin}/posts`;
  fetch(url, { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      const tweetEl = createTweet(data);
      tweetPostContainer.insertAdjacentElement("afterbegin", tweetEl);
      postImages = [];
      textAreaInpPost.value = "";
      postImageContainer.innerText = "";
      tweetBtn.removeAttribute("disabled", "");
      tweetBtn.style.background = "#1d9bf0";
    })
    .catch((error) => console.log(error));
});

//Load all tweets
async function loadAllTweets() {
  const url = `${window.location.origin}/posts?followingOnly=true`;
  const result = await fetch(url, { method: "GET" });
  const posts = await result.json();
  if (posts.length) {
    posts.forEach((post) => {
      const tweetEl = createTweet(post);
      tweetPostContainer.insertAdjacentElement("afterbegin", tweetEl);
    });
  }
}
loadAllTweets();
