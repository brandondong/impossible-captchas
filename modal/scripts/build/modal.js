(function () {
  'use strict';

  class CaptchaManager {
    constructor() {
      this.numQuestionsAnswered = 0;
    }
    
    nextQuestion() {
      this.numQuestionsAnswered++;
    }
    
    canSwithQuestionTypes() {
      return this.numQuestionsAnswered >= 5;
    }
    
    switchQuestionTypes() {
      alert("Switching");
    }
  }

  function main() {
    const manager = new CaptchaManager();
    let numImagesSelected = 0;
    
    const submitButton = document.getElementById("submit");
    const toggleLink = document.getElementById("toggle");
    const imageContainers = document.getElementsByClassName("image-container");
    
    submitButton.addEventListener("click", () => {
      // Clear image selections.
      numImagesSelected = 0;
      for (const ic of imageContainers) {
        const img = ic.children[0];
        const circle = ic.children[1];
        _deselect(img, circle);
      }
      // Disable the button.
      submitButton.disabled = true;
      manager.nextQuestion();
      if (manager.canSwithQuestionTypes()) {
        toggleLink.style.visibility = "visible";
      }
    });
    toggleLink.addEventListener("click", () => {
      manager.switchQuestionTypes();
    });
    for (const ic of imageContainers) {
      ic.addEventListener("click", () => {
        // Toggle selections appropriately.
        const img = ic.children[0];
        const circle = ic.children[1];
        if (img.style.filter) {
          _deselect(img, circle);
          numImagesSelected--;
          if (numImagesSelected === 0) {
            submitButton.disabled = true;
          }
        } else {
          _select(img, circle);
          numImagesSelected++;
          if (numImagesSelected === 1) {
            submitButton.disabled = false;
          }
        }
      });
    }
  }

  function _deselect(img, circle) {
    img.style.filter = "";
    circle.style.visibility = "hidden";
  }

  function _select(img, circle) {
    img.style.filter = "brightness(0.7)";
    circle.style.visibility = "visible";
  }

  document.addEventListener("DOMContentLoaded", main);

}());
