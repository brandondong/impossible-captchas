(function () {
  'use strict';

  function main() {
    let failedBefore = false;
    let animationPlaying = false;
    
    const checkbox = document.getElementById("checkbox");
    checkbox.addEventListener("click", () => {
      if (!animationPlaying) {
        animationPlaying = true;
        checkbox.style.cursor = "default";
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
      animationPlaying = false;
      checkbox.classList.remove(e.animationName);
      checkbox.style.cursor = "pointer";
      if (e.animationName === "success") {
        window.parent.postMessage("robot_success", "*");
      }
    }, false);
  }

  document.addEventListener("DOMContentLoaded", main);

}());
