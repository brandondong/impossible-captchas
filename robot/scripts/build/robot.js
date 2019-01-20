(function () {
  'use strict';

  function main() {
    let failedBefore = false;
    let animationPlaying = false;
    
    const checkbox = document.getElementById("checkbox");
    checkbox.addEventListener("click", () => {
      if (!animationPlaying) {
        animationPlaying = true;
        // Randomly choose the animation to play. Ensure no consecutive failures occur.
        if (failedBefore || Math.random() >= 0.5) {
          checkbox.classList.add("success");
          failedBefore = false;
        } else {
          checkbox.classList.add("failure");
          failedBefore = true;
        }
      }
    });
    checkbox.addEventListener("animationend", e => {
      if (e.animationName === "perm-failure") {
        // Keep the checkbox permanently disabled.
        return;
      }
      animationPlaying = false;
      checkbox.classList.remove(e.animationName);
      if (e.animationName === "success") {
        window.parent.postMessage("robot_success", "*");
      }
    }, false);
    window.addEventListener("message", e => {
      if (e.data === "modal_fail") {
        animationPlaying = true;
        checkbox.classList.add("perm-failure");
      }
    }, false);
  }

  document.addEventListener("DOMContentLoaded", main);

}());
