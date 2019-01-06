(function () {
  'use strict';

  function createCaptchaElement(elem) {
    const width = "300";
    const height = "70";
    
    const fixedSizeDiv = document.createElement("div");
    fixedSizeDiv.style.width = `${width}px`;
    fixedSizeDiv.style.height = `${height}px`;
    
    const iframe = document.createElement("iframe");
    iframe.src = "robot/index.html";
    iframe.width = width;
    iframe.height = height;
    iframe.style.border = "none";
    
    fixedSizeDiv.appendChild(iframe);
    elem.appendChild(fixedSizeDiv);
  }

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

}());
