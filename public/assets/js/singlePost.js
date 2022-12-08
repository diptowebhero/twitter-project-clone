const tweetPostContainer = document.querySelector(".tweetPost_container");

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
    <div onclick="openTweet(event,'${postId}')" class="tweet">
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
  const url = `${window.location.origin}/posts/singlePost/${postId}`;
  const result = await fetch(url, { method: "GET" });
  const posts = await result.json();

  const tweetEl = createTweet(posts);
  tweetPostContainer.appendChild(tweetEl);
}
loadAllTweets();
