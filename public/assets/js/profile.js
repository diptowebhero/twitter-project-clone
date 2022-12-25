//select all references
const tweetPostContainer = document.querySelector(".tweetPost_container");

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
