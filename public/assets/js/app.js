// const userProfileInfo = document.querySelector(".user_profile_info");
const menu = document.querySelector(".menu");

//Logout btn toggle
// userProfileInfo.addEventListener("click", function () {
//   menu.classList.toggle("active");
// });
//create tweet
function createTweet(data) {
  let repliedPost = "";
  let retweetNameDisplay = "";
  let deleteBtn = "";
  let newData = data;
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

  //delete post
  if (newData.tweetedBy._id === user._id) {
    deleteBtn = `<button onclick="deletePost('${data._id}')" class="deleteBtn">
                    <i class="fas fa-times"></i>
                  </button>`;
  }
  //for time track
  const times = moment(createdAt).fromNow();
  const div = document.createElement("div");

  div.innerHTML = `${retweetNameDisplay}
    <div onclick="openTweet(event,'${postId}')" class="tweet">
    <div class="avatar-area">
    <img src="${
      window.location.origin
    }/uploads/profile/${avatarProfile}" alt=""/>
  </div>
  <div class="tweet_body">
    <div class="header">
      <div class="displayUserInfo">
        <a class="displayName" href="/profile/${username}">${
    firstName + " " + lastName
  }</a>
        <span class="username">${username}.</span>
        <span class="time" style="flex:1">${times}</span>
        ${deleteBtn}
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
