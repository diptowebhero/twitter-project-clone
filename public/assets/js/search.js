const searchInput = document.querySelector("input#searchInput");
const userContainer = document.querySelector(".followFollowing_container");
const tweetContainer = document.querySelector(".tweetPost_container");
let timer;
tweetContainer.innerHTML = `<h4 class="nothing">Please search with a keyword</h4>`;

searchInput.addEventListener("input", function (e) {
  const searchText = this.value.trim();

  if (searchText) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const url = `${window.location.origin}/${tab}?searchText=${searchText}`;
      tweetContainer.innerHTML = `<div class='spinner_container'>
        <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
      </div>`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          tweetContainer.innerHTML = "";
          userContainer.innerHTML = "";

          //search post
          if (tab === "posts") {
            if (!data.length) {
              return (tweetContainer.innerHTML = `<h4 class="nothing">No result found!! try again</h4>`);
            }

            data.forEach((post) => {
              const tweetEl = createTweet(post);
              tweetContainer.insertAdjacentElement("afterbegin", tweetEl);
            });
          }
          // search users
          if (tab === "users") {
            if (!data.length) {
              return (tweetContainer.innerHTML = `<h4 class="nothing">No result found!! try again</h4>`);
            }
            data.forEach((user) => {
              const userEl = createFollowElement(user);
              userContainer.appendChild(userEl);
            });
          }
        });
    }, 1000);
  } else {
    tweetContainer.innerHTML = `<h4 class="nothing">Please search with a keyword</h4>`;
    userContainer.innerHTML = "";
  }
});
