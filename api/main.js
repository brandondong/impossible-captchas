import createCaptchaElement from "./captcha-element.js";

function main() {
  const captchas = document.getElementsByClassName("i-captcha");
  for (const elem of captchas) {
    createCaptchaElement(elem);
  }
}

// Taken from https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded#Checking_whether_loading_is_already_complete.
if (document.readyState === "loading") {  // Loading hasn't finished yet
  document.addEventListener("DOMContentLoaded", main);
} else {  // `DOMContentLoaded` has already fired
  main();
}