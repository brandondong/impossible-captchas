(function () {
  'use strict';

  function createCaptchaElement(elem) {
    const width = "300";
    const height = "70";

    const fixedSizeDiv = document.createElement("div");
    fixedSizeDiv.style.width = `${width}px`;
    fixedSizeDiv.style.height = `${height}px`;

    const iframe = document.createElement("iframe");
    iframe.src = "https://brandondong.github.io/impossible-captchas/robot/index.html";
    iframe.width = width;
    iframe.height = height;
    iframe.style.border = "none";

    fixedSizeDiv.appendChild(iframe);
    elem.appendChild(fixedSizeDiv);
    return iframe;
  }

  class Modal {
    constructor() {
      const width = "428";
      const height = "600";

      const md = document.createElement("div");
      md.style.display = "none";
      md.style.position = "fixed";
      md.style["z-index"] = "2000000";
      md.style.left = "0";
      md.style.top = "0";
      md.style.width = "100%";
      md.style.height = "100%";
      md.style["background-color"] = "rgba(0,0,0,0.5)";

      const mc = document.createElement("div");
      mc.style.position = "relative";
      mc.style.margin = "auto";
      mc.style.width = `${width}px`;
      mc.style.height = `${height}px`;
      mc.style["box-shadow"] = "0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)";
      mc.style.top = "50%";
      mc.style["margin-top"] = `-${parseInt(height) / 2}px`;

      const iframe = document.createElement("iframe");
      iframe.src = "https://brandondong.github.io/impossible-captchas/modal/index.html";
      iframe.width = width;
      iframe.height = height;
      iframe.style.border = "none";

      const xButton = document.createElement("span");
      xButton.innerHTML = "&times;";
      xButton.style.position = "absolute";
      xButton.style.right = "0px";
      xButton.style.top = "-9px";
      xButton.style.cursor = "pointer";
      xButton.style.color = "white";
      xButton.style["font-size"] = "36px";
      xButton.style["font-weight"] = "bold";
      xButton.addEventListener("click", () => {
        md.style.display = "none";
      });

      mc.appendChild(iframe);
      md.appendChild(xButton);
      md.appendChild(mc);
      document.body.appendChild(md);
      this.md = md;
      this.mc = mc;
    }

    open() {
      this.md.style.display = "block";
      this.mc.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], { ease: "ease", duration: 400 });
    }

    close() {
      this.md.style.display = "none";
    }
  }

  function main() {
    const captchas = document.getElementsByClassName("i-captcha");
    const iframes = [];
    for (const elem of captchas) {
      iframes.push(createCaptchaElement(elem));
    }
    
    const modal = new Modal();
    window.addEventListener("message", e => {
      if (e.data === "robot_success") {
        modal.open();
      } else if (e.data === "modal_failure") {
        modal.close();
        for (const iframe of iframes) {
          iframe.contentWindow.postMessage("modal_fail", "*");
        }
      }
    }, false);
  }

  // Taken from https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded#Checking_whether_loading_is_already_complete.
  if (document.readyState === "loading") {  // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", main);
  } else {  // `DOMContentLoaded` has already fired
    main();
  }

}());
