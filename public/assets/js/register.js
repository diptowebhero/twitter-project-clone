const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const passwordEyeIcon = document.querySelector("#passwordEyeIcon");
const confirmPasswordEyeIcon = document.querySelector(
  "#confirmPasswordEyeIcon"
);

const passError = document.querySelector(".passError");
passError.hidden = true;

//typing detector
let typingTimer;
let doneTypingInterval = 500;

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

//auto password error show & hide
//password validator
function validate(pass) {
  const errors = [];

  if (pass.length < 8) {
    errors.push("8 character");
  }

  if (pass.search(/[a-z]/) < 0) {
    errors.push("1 lowercase later");
  }

  if (pass.search(/[A-Z]/) < 0) {
    errors.push("1 uppercase later");
  }
  if (pass.search(/[0-9]/) < 0) {
    errors.push("1 digit");
  }
  if (pass.search(/[\!\@\#\$\%\^\&\*\(\)\_\+\.\,\;\:\-]/) < 0) {
    errors.push("1 special character");
  }

  return errors;
}

//check password
function checkPassword(password) {
  //store errors
  let validationResult = [];
  if (password) {
    validationResult = validate(password);
  } else {
    return;
  }

  //show error msg
  if (validationResult.length > 0) {
    let errorMsg =
      "Your password must be contain at least " + validationResult.join(",");

    if (password) {
      passError.hidden = false;
      passError.textContent = errorMsg;
    } else {
      return;
    }
  } else {
    checkConfirmPassword();
  }
}

//on keyup start the count down
passwordInput.addEventListener("keyup", function () {
  clearTimeout(typingTimer);
  passError.hidden = true;

  if (passwordInput.value) {
    typingTimer = setTimeout(
      () => checkPassword(passwordInput.value),
      doneTypingInterval
    );
  }
});

//on keydown start the count down
passwordInput.addEventListener("keydown", function () {
  clearTimeout(typingTimer);
});

//on keyup start the count down
confirmPasswordInput.addEventListener("keyup", function () {
  clearTimeout(typingTimer);
  passError.hidden = true;

  if (confirmPasswordInput.value) {
    typingTimer = setTimeout(() => checkConfirmPassword(), doneTypingInterval);
  } else {
    return;
  }
});

//on keydown start the count down
confirmPasswordInput.addEventListener("keydown", function () {
  clearTimeout(typingTimer);
});

//check confirm password
function checkConfirmPassword() {
  if (!(passwordInput.value === confirmPasswordInput.value)) {
    passError.hidden = false;
    passError.textContent = "password doesn't match";
  } else {
    passError.hidden = true;
    passError.textContent = "";
  }
}
