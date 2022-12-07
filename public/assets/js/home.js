//select all references
const postImageInp = document.querySelector("#postImage");
const postImageContainer = document.querySelector("#postImageContainer");
const user_profile_info = document.querySelector(".user_profile_info");
const menu = document.querySelector(".menu");
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

//Logout btn toggle
user_profile_info.addEventListener("click", function () {
  menu.classList.toggle("active");
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

function clearInputData() {
  replyImageContainer.innerHTML = "";
  replyTextAreaContent.innerHTML = "";
  replyBtn.setAttribute("disabled", "");
  replyBtn.style.backgroundColor = "#8ecaf3";
}

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

//create tweet
function createTweet(data) {
  let repliedPost = "";
  let retweetNameDisplay = "";
  let newData = data;
  if (data.postData) {
    newData = data.postData;
    retweetNameDisplay =
      data.tweetedBy.username === user.username
        ? `<p class="tweetedUser">
<i class="fas fa-retweet"></i>You retweeted</a>
</p>`
        : `<p class="tweetedUser">
    <i class="fas fa-retweet"></i> retweeted By @<a href="/user/profile/"}>${data.tweetedBy.username}</a>
    </p>`;
  }
  if (data.replyTo?.tweetedBy?.username) {
    repliedPost = `
        <div class="replyUser">
            <p>Replying to <span>@</span><a href="/profile/${data.replyTo.tweetedBy.username}">${data.replyTo.tweetedBy.username}</a>
            </p>
        </div>`;
  }
  const {
    _id: postId,
    replyTweets,
    content,
    createdAt,
    images,
    likes,
    retweetUsers,
    tweetedBy: { _id, firstName, lastName, username, avatarProfile },
  } = newData;
  const times = moment(createdAt).fromNow();
  const div = document.createElement("div");

  div.innerHTML = `${retweetNameDisplay}
  <div class="tweet">
  <div class="avatar-area">
  <img src="${window.location.origin}/uploads/profile/${avatarProfile}" alt=""/>
</div>
<div class="tweet_body">
  <div class="header">
    <div class="displayUserInfo"><a class="displayName" href="profile/${username}">${
    firstName + " " + lastName
  }</a><span class="username">${username}.</span><span class="time">${times}</span></div>
  ${repliedPost}
    <div class="content"><span>${content}</span></div>
  </div>
  <div class="tweetsPostImages"></div>
  <div class="post_footer">
    <button class="comment" data-post='${JSON.stringify(
      data
    )}' data-bs-toggle="modal" data-bs-target="#replyModal" onclick="replyHandler(event,'${postId}')"><i class="far fa-comment"></i><span class="mx-1">${
    replyTweets.length || ""
  }</span></button>
    <button class="retweet ${
      retweetUsers.includes(user._id) ? "active" : ""
    }" onclick="retweetHandler(event,'${postId}')">
      <i class="fas fa-retweet"></i><span class="mx-1">${
        retweetUsers.length || ""
      }</span>
    </button>
    <button class="like ${
      user.likes.includes(postId) ? "active" : ""
    }" onclick="likeHandler(event,'${postId}')"><i class="fas fa-heart"></i><span class="mx-1">${
    likes.length || ""
  }</span></button>
  </div>
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

function replyHandler(e, postId) {
  const replyTweetBtn = document.querySelector("#replyBtn");
  const replyBtn = e.target;
  console.log();
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
