const tweetPostContainer = document.querySelector(".tweetPost_container");

//for reply
const textAreaInpPostReply = document.querySelector("#replyTextAreaContent");
const replyBtn = document.querySelector("#replyBtn");
const replyPostImageInp = document.querySelector("#replyPostImage");
const replyImageContainer = document.querySelector(".replyImageContainer");

//set default style tweet btn
replyBtn.style.backgroundColor = "#76b9e5";

let replyImages = [];

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

//reply textarea handling
textAreaInpHandler(textAreaInpPostReply, replyBtn);

//Load all tweets
async function loadAllTweets() {
  const url = `${window.location.origin}/posts/singlePost/${postId}`;
  const result = await fetch(url, { method: "GET" });
  const posts = await result.json();

  if (posts === null) return (location.href = "/");

  const tweetEl = createTweet(posts);
  tweetPostContainer.appendChild(tweetEl);
  posts?.replyTweets?.forEach(async (postId) => {
    const url = `${window.location.origin}/posts/singlePost/${postId}`;
    const result = await fetch(url, { method: "GET" });
    const post = await result.json();

    const tweetEl = createTweet(post);
    tweetPostContainer.appendChild(tweetEl);
  });
}
loadAllTweets();
