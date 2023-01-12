const chatImgEl = document.querySelector(".chatImage");
const displayChatUserName = document.querySelector(".chatName");
const chatHeader = document.querySelector(".chat_header");

const url = `${window.location.origin}/chat/${chatId}`;

fetch(url)
  .then((res) => res.json())
  .then((chatData) => {
    if (!chatData._id) {
      chatHeader.innerHTML = `<h4 class="chat_error">${chatData.error}</h4>`;
    }
    displayChatData(chatData);
  });

function displayChatData(chatData) {
  //get other user
  const otherUsers = chatData.users.filter((u) => u._id !== user._id);

  // console.log(otherUsers);
  // console.log(chatData.chatImg);

  //get chat user name
  let chatUserNameStr = chatData.chatName;
  chatUserNameStr = chatUserNameStr
    ? chatUserNameStr
    : getChatUserName(otherUsers);

  let remainingUsers = "";
  remainingUsers =
    otherUsers.length <= 2 ? "" : `<span>${otherUsers.length - 2}+</span>`;

  //get chat image
  let chatImage = chatData.chatImg;
  chatImage = chatImage
    ? `<img src='${chatImage}' alt='Avatar'>`
    : otherUsers.length === 1
    ? `<img src='${
        otherUsers[0].avatarProfile
          ? "/uploads/" +
            otherUsers[0]._id +
            "/profile/" +
            otherUsers[0].avatarProfile
          : "/uploads/profile/avatar.png"
      }'>`
    : `<img src='${
        otherUsers[0].avatarProfile
          ? "/uploads/" +
            otherUsers[0]._id +
            "/profile/" +
            otherUsers[0].avatarProfile
          : "/uploads/profile/avatar.png"
      }'> <img src='${
        otherUsers[otherUsers.length - 1].avatarProfile
          ? "/uploads/" +
            otherUsers[otherUsers.length - 1]._id +
            "/profile/" +
            otherUsers[otherUsers.length - 1].avatarProfile
          : "/uploads/profile/avatar.png"
      }'>
    ${remainingUsers}`;
  chatImgEl.innerHTML = chatImage;
  displayChatUserName.innerHTML = `<span>${chatUserNameStr}</span>`;

  //showing active status
  let isActive = otherUsers.some((otherUser) => otherUser.activeStatus);
  // console.log(isActive);
  const isGroupChat = chatData.isGroupChat;
  let activeStatusText;
  if (!isGroupChat) {
    activeStatusText = isActive
      ? "active now"
      : new Date(chatData.lastSeen).toLocaleString() !== "Invalid Date"
      ? "Last seen: " + chatData.lastSeen.toLocaleString()
      : "Not seen yet";
  } else {
    activeStatusText = isActive ? "active now" : "away";
  }

  const activeStatusEl = document.createElement("div");
  activeStatusEl.classList.add(
    "activeStatus",
    "tweetActiveStatus",
    "chatActiveStatus"
  );
  isActive && activeStatusEl.classList.add("active");
  activeStatusEl.dataset.activeStatus = activeStatusText;
  chatImgEl.prepend(activeStatusEl);
}
