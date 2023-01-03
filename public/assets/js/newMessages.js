const userSearchInp = document.querySelector("input#userSearchInput");
const createNewChatBtn = document.querySelector("#createNewChatBtn");
const userContainer = document.querySelector(".followFollowing_container");
const selectedUserContainer = document.querySelector("#selectedUser");

userContainer.innerHTML = `<h4 class="nothing">Please search with a keyword</h4>`;
createNewChatBtn.disabled = true;

let timer;
let selectedUsers = [];

userSearchInp.addEventListener("input", function () {
  clearTimeout(timer);
  const searchText = this.value.trim();
  if (searchText) {
    timer = setTimeout(function () {
      const url = `${window.location.origin}/users?searchText=${searchText}`;
      userContainer.innerHTML = `
      <div class='spinner_container'>
        <div class="spinner-border text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        </div>`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          userContainer.innerHTML = "";
          if (!data.length) {
            userContainer.innerHTML = `<h4 class="nothing text-danger">No result found!! try again</h4>`;
          }

          data.forEach((userData) => {
            if (
              selectedUsers.some(
                (selectedUser) => selectedUser._id === userData._id
              ) ||
              userData._id === user._id
            ) {
              return;
            }

            const userEl = createFollowElement(userData, true);
            userEl.addEventListener("click", function (e) {
              selectedUsers.push(userData);
              userSearchInp.value = "";
              userSearchInp.focus();
              userContainer.innerHTML = "";
              displaySelectedUser(selectedUsers);
            });

            userContainer.appendChild(userEl);
          });
        });
    }, 1000);
  }
});

function displaySelectedUser(usersSelected) {
  if (usersSelected.length) {
    createNewChatBtn.disabled = false;
  }

  selectedUserContainer.innerHTML = "";

  usersSelected.forEach((selectedUser) => {
    const fullName = selectedUser.firstName + " " + selectedUser.lastName;

    const avatarImg = selectedUser.avatarProfile
      ? `/uploads/${selectedUser._id}/profile/${selectedUser.avatarProfile}`
      : `/uploads/profile/avatar.png`;

    // return console.log(fullName, avatarImg);

    let div = document.createElement("div");
    div.classList.add("selectedUser");

    div.innerHTML = `
      <img src=${avatarImg} alt='Avatar'>
      <span>${fullName}</span>
      <button onclick="deselectUser(event,'${selectedUser._id}')"><i class="fas fa-times"></i></button>
    `;
    selectedUserContainer.appendChild(div);
  });
}

function deselectUser(e, userId) {
  selectedUsers = selectedUsers.filter(
    (selectedUser) => selectedUser._id !== userId
  );
  displaySelectedUser(selectedUsers);
  // return console.log(e.target, selectedUsers);

  e.target.remove();
}

createNewChatBtn.addEventListener("click", () => {
  const url = `${window.location.origin}/chat`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(selectedUsers),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data._id) {
        location.href = `${window.location.origin}/messages/${data._id}`;
      } else {
        alert("something is wrong");
      }
    });
});
