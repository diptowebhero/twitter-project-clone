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

function createFollowElement(data) {
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

  div.innerHTML = `<div class="followUserInfo">
                      <div class="avatar">
                        <img src=${avatarUrl}>
                      </div>
                    <div class="displayName">
                      <a href="/profile/${data.username}">${name}</a>
                      <span>@${data.username}</span>
                    </div>
                    </div>
                    <div class="followBtn">
                          ${followDiv}
                    </div>
                  `;
  return div;
}
