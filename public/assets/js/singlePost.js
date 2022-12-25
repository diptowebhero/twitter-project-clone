const tweetPostContainer = document.querySelector(".tweetPost_container");

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
