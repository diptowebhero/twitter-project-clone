const messagesContainer = document.querySelector(".messages_container");

const url = `${window.location.origin}/chat`;
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    if (data.length) {
      data.forEach((message) => {
        const messageItem = createMessageHtml(message);
        // console.log(messageItem);
        messagesContainer.appendChild(messageItem);
      });
    } else {
      messagesContainer.innerHTML = `<h4 class='nothingShow'>No chat found!</h4>`;
    }
  });

function createMessageHtml(chatData) {
  const otherUsers = chatData.users.filter((u) => u._id !== user._id);
  console.log(otherUsers);
  console.log(otherUsers.length);

  //get chat user name
  let chatUserNameStr = chatData.chatName;
  chatUserNameStr = chatUserNameStr
    ? chatUserNameStr
    : getChatUserName(otherUsers);

  //get chat image
  let chatImage = chatData.chatImage;
  chatImage = chatImage
    ? `<img style='width:100%' src='${chatImage}' alt='Avatar'>`
    : otherUsers.length === 1
    ? `<img style='width:100%' src='${
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
      }'>`;
  let latestMessage = chatData.latestMessage
    ? `<div class='sub-text'>
        <p>${latestMessage.content}</p>
        <span class='times'>11.00 am</span>
      </div>`
    : `<div class='sub-text'>
          <p>New chat</p>
          <span class='times'></span>
        </div>`;

  //showing active status
  let isActive = otherUsers.some((otherUser) => otherUser.activeStatus);
  // console.log(isActive);
  const isGroupChat = chatData.isGroupChat;
  let activeStatusText;
  if (!isGroupChat) {
    activeStatusText = isActive
      ? "active now"
      : new Date(otherUsers.lastSeen).toLocaleString() !== "Invalid Date"
      ? "Last seen: " + otherUsers.lastSeen.toLocaleString()
      : "Not seen yet";
  } else {
    activeStatusText = isActive ? "active now" : "away";
  }

  const a = document.createElement("a");
  a.href = `/messages/${chatData._id}`;
  a.classList.add("chatBox-container");
  a.innerHTML = `
       <div class="chatItem">
            <div class='chatImage'>
              <div class="activeStatus tweetActiveStatus message ${
                isActive && "active"
              }" data-activeStatus="${activeStatusText}">
              </div>
                  ${chatImage}
            </div>
            <div class='chatDetails'>
                <h4 class='chatTitle'>${chatUserNameStr}</h4>
                ${latestMessage}
            </div>
       </div>
       `;
  return a;
}
