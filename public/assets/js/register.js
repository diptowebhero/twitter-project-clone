const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const passwordEyeIcon = document.querySelector("#passwordEyeIcon");
const confirmPasswordEyeIcon = document.querySelector(
  "#confirmPasswordEyeIcon"
);

//password show & hide function
function passShowHide(handler, field) {
  const i = handler.querySelector("i");
  handler.addEventListener("click", function () {
    if (i.className === "fas fa-eye") {
      i.className = "fas fa-eye-slash";
      field.type = "text";
    } else {
      i.className = "fas fa-eye";
      field.type = "password";
    }
  });
}

//password
passShowHide(passwordEyeIcon, passwordInput);

//password
passShowHide(confirmPasswordEyeIcon, confirmPasswordInput);
