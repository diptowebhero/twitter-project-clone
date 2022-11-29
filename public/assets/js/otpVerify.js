const countDown = document.querySelector("#countDown");
const countDownTime = document.querySelector("#countDown span");
const resendBtn = document.querySelector("#resendOtp_btn");

let minutes = 1;
let seconds = 59;

const timer = setInterval(() => {
  if (!(minutes === 0 && seconds === 0)) {
    seconds--;
  } else {
    clearInterval(timer);
    countDown.innerText = "Your OTP is expire";
    countDown.style.setProperty("color", "#ba3a3a", "important");
  }
  if (seconds === 0) {
    if (!(minutes === 0 && seconds === 0)) {
      seconds = 59;
      minutes = 0;
    }
  }

  if (!(minutes === 0 && seconds === 0)) {
    countDownTime.textContent =
      "0" +
      minutes +
      " : " +
      (seconds.toString().length === 1 ? "0" + seconds : seconds);
  }
}, 1000);

//OTP resend handler
resendBtn.onclick = () => {
  window.location.reload();
};
