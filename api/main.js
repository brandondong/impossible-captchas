import createCaptchaElement from "./captcha-element.js";
import Modal from "./modal.js";

function main() {
  const captchas = document.getElementsByClassName("i-captcha");
  for (const elem of captchas) {
    createCaptchaElement(elem);
  }
  
  const modal = new Modal();
  window.addEventListener("message", e => {
    if (e.data === "robot_success") {
      modal.open();
    }
  }, false);
}

// Taken from https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded#Checking_whether_loading_is_already_complete.
if (document.readyState === "loading") {  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {  // `DOMContentLoaded` has already fired
  main();
}