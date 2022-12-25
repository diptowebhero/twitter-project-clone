const followers = (userProfileJs && userProfileJs.followers) || [];
const following = (userProfileJs && userProfileJs.following) || [];

const followFollowingContainer = document.querySelector(
  ".followFollowing_container"
);

if (tab == "followers") {
  followers.forEach((follower) => {
    const followersEl = createFollowElement(follower);
    followFollowingContainer.appendChild(followersEl);
  });
} else {
  following.forEach((followingUser) => {
    const followingEl = createFollowElement(followingUser);

    followFollowingContainer.appendChild(followingEl);
  });
}
