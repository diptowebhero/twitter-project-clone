const postImageInp = document.querySelector("#postImage");
const postImageContainer = document.querySelector("#postImageContainer");
const user_profile_info = document.querySelector(".user_profile_info");
const menu = document.querySelector(".menu");
const tweetBtn = document.querySelector("#tweetBtn");
const textAreaInp = document.querySelector("#textAreaContent");
const tweetPostContainer = document.querySelector(".tweetPost_container");

//set default style tweet btn
tweetBtn.style.backgroundColor = "#76b9e5";

//STORE POST IMAGES
let postImages = [];

//Logout btn toggle
user_profile_info.addEventListener("click", function () {
  menu.classList.toggle("active");
});

//tweet btn handler
textAreaInp.addEventListener("input", function () {
  const value = this.value.trim();
  if (value) {
    tweetBtn.removeAttribute("disabled", "");
    tweetBtn.style.background = "#1d9bf0";
  } else {
    tweetBtn.setAttribute("disabled", "");
    tweetBtn.style.background = "#76b9e5";
  }
});

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
        if (!postImages.length && !textAreaInp.value.trim()) {
          tweetBtn.setAttribute("disabled", "");
          tweetBtn.style.background = "#76b9e5";
        }
      }
    });
  } else {
    return;
  }
});

//submitting tweet handler
tweetBtn.addEventListener("click", function (e) {
  const content = textAreaInp.value.trim();
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
      textAreaInp.value = "";
      postImageContainer.innerText = "";
      tweetBtn.removeAttribute("disabled", "");
      tweetBtn.style.background = "#1d9bf0";
    })
    .catch((error) => console.log(error));
});

//create tweet
function createTweet(data) {
  const {
    _id: postId,
    content,
    createdAt,
    images,
    likes,
    tweetedBy: { _id, firstName, lastName, username, avatarProfile, updatedAt },
  } = data;

  const times = moment(createdAt).fromNow();
  const div = document.createElement("div");
  div.classList.add("tweet");

  div.innerHTML = `
        <div class="avatar-area">
          <img src="${
            window.location.origin
          }/uploads/profile/${avatarProfile}" alt=""/>
        </div>
        <div class="tweet_body">
          <div class="header">
            <div class="displayUserInfo"><a class="displayName" href="profile/${username}">${
    firstName + " " + lastName
  }</a><span class="username">${username}.</span><span class="time">${times}</span></div>
            <div class="content"><span>${content}</span></div>
          </div>
          <div class="tweetsPostImages"></div>
          <div class="post_footer">
            <button class="comment"><i class="far fa-comment"></i><span class="mx-1">5</span></button>
            <button class="retweet">
              <i class="fas fa-retweet"></i><span class="mx-1">5</span>
            </button>
            <button class="like ${
              user.likes.includes(postId) ? "active" : ""
            }" onclick="likeHandler(event,'${postId}')"><i class="fas fa-heart"></i><span class="mx-1">${
    likes.length || ""
  }</span></button>
          </div>
        </div>
  `;

  let imagesContainer = div.querySelector(".tweetsPostImages");
  images.forEach((img) => {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("tweetImg");
    imgDiv.innerHTML = `<img src="${window.location.origin}/uploads/tweets/${_id}/${img}" />`;
    imagesContainer.appendChild(imgDiv);
  });
  return div;
}

//Load all tweets
async function loadAllTweets() {
  const url = `${window.location.origin}/posts`;
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

//Like btn handler
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
      span.innerText = data.likes.length || "";
    });
}
