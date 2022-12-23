//select all references
const tweetPostContainer = document.querySelector(".tweetPost_container");
const textAreaInpPostReply = document.querySelector("#replyTextAreaContent");
const replyBtn = document.querySelector("#replyBtn");
const replyPostImageInp = document.querySelector("#replyPostImage");
const replyImageContainer = document.querySelector(".replyImageContainer");

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

//reply textarea handling
textAreaInpHandler(textAreaInpPostReply, replyBtn);

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

//Like handler
function likeHandler(e, postId) {
  const likeBtn = e.target;
  const span = likeBtn.querySelector("span");
  const url = `${window.location.origin}/posts/like/${postId}`;
  fetch(url, { method: "PUT" })
    .then((res) => res.json())
    .then((data) => {
      if (data.likes.includes(user._id)) {
        likeBtn.classList.add("active");
      } else {
        likeBtn.classList.remove("active");
      }
      span.innerText = data?.likes?.length || "";
    });
}

//retweet handler
function retweetHandler(e, postId) {
  const retweetBtn = e.target;
  const span = retweetBtn.querySelector("span");
  const url = `${window.location.origin}/posts/retweet/${postId}`;
  fetch(url, { method: "POST" })
    .then((res) => res.json())
    .then((data) => {
      if (data.retweetUsers.includes(user._id)) {
        retweetBtn.classList.add("active");
      } else {
        retweetBtn.classList.remove("active");
      }
      span.innerText = data.retweetUsers.length || "";
    });
  window.location.reload();
}

//reply handler
function replyHandler(e, postId) {
  const replyTweetBtn = document.querySelector("#replyBtn");
  const replyBtn = e.target;

  const postObj = JSON.parse(replyBtn.dataset.post);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = "";
  const tweetEl = createTweet(postObj);
  replyTweetBtn.addEventListener("click", function (e) {
    const content = replyTextAreaContent.value.trim();
    console.log(content);
    if (!(replyImages.length || content)) return;

    //store form data in formData api
    const formData = new FormData();
    formData.append("content", content);

    //store tweet image in formData
    replyImages.forEach((file) => {
      formData.append(file.name, file);
    });
    //post & store data in database
    const url = `${window.location.origin}/posts/reply/${postId}`;
    fetch(url, { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          window.location.reload();
        }
      });
    // .catch((error) => console.log(error));
  });

  modalBody.appendChild(tweetEl);
}

//open tweet
function openTweet(e, postId) {
  const targetEl = e.target;
  if (targetEl.localName === "button" || targetEl.localName === "a") return;

  window.location.href = `${window.location.origin}/posts/${postId}`;
}

function clearInputData() {
  replyImageContainer.innerHTML = "";
  replyTextAreaContent.innerHTML = "";
  replyBtn.setAttribute("disabled", "");
  replyBtn.style.backgroundColor = "#8ecaf3";
}

async function loadAllTweets() {
  const url = `${window.location.origin}/posts?tweetedBy=${
    userProfileObj._id
  }&replyTo=${tab === "replies"}`;
  const result = await fetch(url, { method: "GET" });
  const posts = await result.json();
  if (posts.length) {
    posts.forEach((post) => {
      const tweetEl = createTweet(post);
      tweetPostContainer.insertAdjacentElement("afterbegin", tweetEl);
    });
  } else {
    return (tweetPostContainer.innerHTML = `<h4 class='nothing'>Nothing to show!!</h4>`);
  }

  if (tab === "post") {
    const pinPostResult = await fetch(
      `${window.location.origin}/posts?tweetedBy=${userProfileObj._id}&pinned=true`
    );

    const pinPost = await pinPostResult.json();

    pinPost?.forEach((post) => {
      console.log(post);
      const tweetEl = createTweet(post, true);
      tweetPostContainer.insertAdjacentElement("afterbegin", tweetEl);
    });
  }
}
loadAllTweets();

//follow handling
function followHandler(e, userId) {
  const url = `${window.location.origin}/profile/${userId}/follow`;
  fetch(url, { method: "PUT" })
    .then((res) => res.json())
    .then((data) => {
      const followBtn = e.target;
      const isFollowing = data.followers.includes(user._id);

      const following = document.querySelector("a.following span");
      const followers = document.querySelector("a.followers span");

      if (isFollowing) {
        followBtn.classList.add("active");
        followBtn.textContent = "Following";
        following.textContent = data?.following?.length;
        followers.textContent = data?.followers?.length;
      } else {
        followBtn.classList.remove("active");
        followBtn.textContent = "Follow";
        following.textContent = data?.following?.length;
        followers.textContent = data?.followers?.length;
      }
    });
}
