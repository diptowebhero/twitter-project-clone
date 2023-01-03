//socket
const socket = io("http://localhost:5003");

//Global variable
let isConnected = false;

//setup socket
socket.emit("setup", user);

//connection confirmation
socket.on("connected", () => {
  isConnected = true;
});

const userProfileInfo = document.querySelector(".user_profile_info");
const menu = document.querySelector(".menu");
const textAreaInpPostReply = document.querySelector("#replyTextAreaContent");
const replyBtn = document.querySelector("#replyBtn");
const replyPostImageInp = document.querySelector("#replyPostImage");
const replyImageContainer = document.querySelector(".replyImageContainer");

//STORE POST IMAGES
let postImages = [];
let replyImages = [];

//set default style tweet btn
replyBtn.style.backgroundColor = "#76b9e5";

//Logout btn toggle
userProfileInfo.addEventListener("click", function () {
  menu.classList.toggle("activeToggle");
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

//create tweet
function createTweet(data, pinned) {
  let repliedPost = "";
  let retweetNameDisplay = "";
  let deleteBtn = "";
  let newData = data;
  let pinBtn = "";
  let toggleDeletePinBtn = "";
  //retweet flag
  if (data?.postData) {
    //delete post
    if (data?.tweetedBy?._id === user?._id) {
      deleteBtn = `<button onclick="deletePost('${data._id}')" class="deleteBtn">
                    <i class="fas fa-times"></i>
                  </button>`;
    }

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

  //reply flag
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
    tweetedBy: {
      _id,
      firstName,
      lastName,
      username,
      avatarProfile,
      activeStatus,
      lastSeen,
    },
  } = newData;

  //delete post && pinned post
  if (newData.tweetedBy._id === user._id) {
    if (
      window.location.pathname.split("/").includes("profile") &&
      !data.replyTo
    ) {
      pinBtn = `<button onclick="pinPost('${data._id}',${
        data.pinned
      })" class="pinBtn ${data.pinned ? "active" : ""}">
      <i class="fas fa-thumbtack"></i> ${
        data.pinned ? "Unpin this post" : "Pin this post"
      }
    </button>`;
    }
    deleteBtn = `
                  <button onclick="deletePost('${data._id}')" class="deleteBtn d-flex">
                    <i class="fas fa-times"></i> Delete this post
                  </button>`;
  }
  //for time track
  const times = moment(createdAt).fromNow();
  const div = document.createElement("div");
  //pin flag
  let pinFlag = "";
  if (pinned) {
    // console.log(pinned);
    div.classList.add("pinPost");
    pinFlag = `<div class="pinnedFlag">
                        <i class="fas fa-thumbtack"></i> Pinned post
                      </div>`;
  }

  if (user.username === username) {
    toggleDeletePinBtn = ` <div class="dropdown">
      <button
        class="toggle_btn dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="fas fa-ellipsis-h" aria-hidden="true"></i>
      </button>
      <ul class="pinDeleteBtn dropdown-menu">
        ${deleteBtn}
        ${pinBtn}
      </ul>
    </div>`;
  }

  //select avatar image
  const avatarUrl = avatarProfile
    ? `/uploads/${_id}/profile/${avatarProfile}`
    : `/uploads/profile/avatar.png`;

  //active status
  let activeStatusText = activeStatus
    ? "active now"
    : new Date(lastSeen).toLocaleString() !== "Invalid Date"
    ? "Last seen: " + lastSeen.toLocaleString()
    : "Not seen yet";

  const isActive =
    _id.toString() === user._id.toString() || activeStatusText == "active now";

  activeStatusText = isActive ? "active now" : activeStatusText;

  div.innerHTML = `
  ${pinFlag}
  ${retweetNameDisplay}
    <div onclick="openTweet(event,'${postId}')" class="tweet">
    <div class="avatar-area">
    <div class="activeStatus tweetActiveStatus ${
      isActive && "active"
    }" data-activeStatus="${activeStatusText}">
    </div>
    <img src="${window.location.origin}${avatarUrl}" alt=""/>
  </div>

  <div class="tweet_body">
    <div class="header">
      <div class="displayUserInfo">
        <a class="displayName" href="/profile/${username}">${
    firstName + " " + lastName
  }</a>
        <span class="username">${username}.</span>
        <span class="time" style="flex:1">${times}</span>
        
       
       ${toggleDeletePinBtn}
      </div>
      ${repliedPost}
      <div class="content">
        <span>${content}</span>
      </div>
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
    console.log("click");
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

//delete post
function deletePost(postId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${window.location.origin}/posts/${postId}`;
      fetch(url, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          if (data?._id) {
            // console.log(data?._id);
            window.location.reload();
          } else {
            console.log("delete post error");
            window.location.href = "/";
          }
        });
    }
  });
}

//pin post
function pinPost(postId, pinned) {
  console.log(pinned);
  Swal.fire({
    title: "Are you sure?",
    text: pinned ? "Unpin this post" : "You can pin only one post",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: pinned ? "Yes, unpin it!" : "Yes, pin it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const url = `${window.location.origin}/posts/${postId}/pin`;
      fetch(url, { method: "PUT" })
        .then((res) => res.json())
        .then((data) => {
          if (data?._id) {
            // return console.log(data);
            window.location.reload();
          } else {
            console.log("delete post error");
            window.location.href = "/";
          }
        });
    }
  });
}

//create follow user element
function createFollowElement(data, hideFollowBtn) {
  const avatarUrl = data.avatarProfile
    ? `/uploads/${data._id}/profile/${data.avatarProfile}`
    : `/uploads/profile/avatar.png`;

  const name = data.firstName + " " + data.lastName;
  const isFollowing = data?.followers?.includes(user._id);

  let followDiv = "";

  if (data._id !== user._id) {
    followDiv = `
      <button class="follow ${
        isFollowing ? "active" : ""
      }" id='followBtn' onclick="followHandler(event,'${data._id}')">
        ${isFollowing ? "Following" : "follow"}
      </button>
    `;
  }

  const div = document.createElement("div");
  div.classList.add("follow");

  //active status
  let activeStatusText = data?.activeStatus
    ? "active now"
    : new Date(data?.lastSeen).toLocaleString() !== "Invalid Date"
    ? "Last seen: " + data.lastSeen.toLocaleString()
    : "Not seen yet";

  const isActive =
    data._id.toString() === user._id.toString() ||
    activeStatusText == "active now";

  // console.log(data._id.toString() === user._id.toString());

  activeStatusText = isActive ? "active now" : activeStatusText;

  div.innerHTML = `<div class="followUserInfo">
                    <div class="avatar">
                    <div class="activeStatus tweetActiveStatus ${
                      isActive && "active"
                    }" data-activeStatus="${activeStatusText}">
                    </div>
                      <img src=${avatarUrl}>
                    </div>
                    <div class="displayName">
                      <a href="/profile/${data.username}">${name}</a>
                      <span>@${data.username}</span>
                    </div>
                    </div>
                    <div class="followBtn">
                    ${hideFollowBtn ? "" : followDiv}
                    </div>
                  `;
  return div;
}

//follow following handler
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
        if (userProfileJs._id === user._id) {
          following.textContent = parseInt(following.textContent) + 1;
        }
        followBtn.classList.add("active");
        followBtn.textContent = "Following";
      } else {
        if (userProfileJs._id === user._id) {
          following.textContent = parseInt(following.textContent) - 1;
        }
        followBtn.classList.remove("active");
        followBtn.textContent = "Follow";
      }

      if (data._id === userProfileJs._id) {
        following.textContent = data.following.length;
        followers.textContent = data.followers.length;
      }
    });
}

function getChatUserName(users) {
  let chatName = users.map((user) => user.firstName + " " + user.lastName);

  chatName = chatName.join(", ");
  return chatName;
}
