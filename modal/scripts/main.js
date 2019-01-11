import CaptchaManager from "./captcha-manager";

function main() {
  const manager = new CaptchaManager();
  manager.nextQuestion();
  let numImagesSelected = 0;
  
  const submitButton = document.getElementById("submit");
  const toggleLink = document.getElementById("toggle");
  const imageContainers = document.getElementsByClassName("image-container");
  const imageSection = document.getElementById("images");
  const audioSection = document.getElementById("audio");
  const audioTextInput = document.getElementById("audio-text");
  
  submitButton.addEventListener("click", () => {
    // Clear image selections.
    numImagesSelected = 0;
    for (const ic of imageContainers) {
      const img = ic.children[0];
      const circle = ic.children[1];
      _deselect(img, circle);
    }
    // Clear the input field.
    audioTextInput.innerHTML = "";
    // Disable the button.
    submitButton.disabled = true;
    manager.nextQuestion();
    // Check if the question type switch link can now be shown.
    if (manager.canSwithQuestionTypes()) {
      toggleLink.style.visibility = "visible";
    }
  });
  toggleLink.addEventListener("click", () => {
    manager.switchQuestionTypes();
    // Check if the question type switch link should now be hidden.
    if (!manager.canSwithQuestionTypes()) {
      toggleLink.style.visibility = "hidden";
    }
    if (imageSection.style.display === "none") {
      // Switch to image questions.
      imageSection.style.display = "block";
      audioSection.style.display = "none";
      toggleLink.innerHTML = "I am visually impaired.";
    } else {
      // Switch to audio questions.
      imageSection.style.display = "none";
      audioSection.style.display = "block";
      toggleLink.innerHTML = "I am hearing impaired.";
    }
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
  audioTextInput.addEventListener("copy", e => {
    const copyText = "\u25AF".repeat(10);
    e.clipboardData.setData("text/plain", copyText);
    e.preventDefault();
  });
  
  audioTextInput.addEventListener("paste", e => {
    // Taken from https://developer.mozilla.org/en-US/docs/Web/Events/paste#JavaScript_2.
    e.preventDefault();
    e.stopPropagation();
    
    // Get the clipboard data
    let paste = (e.clipboardData || window.clipboardData).getData('text');
    
    // Insert spaces between characters.
    paste = paste.replace(/(.)/g, "$1 ");
    paste = paste.substring(0, paste.length - 1);

    // Find the cursor location or highlighted area
    const selection = window.getSelection();

    // Cancel the paste operation if the cursor or highlighted area isn't found
    if (!selection.rangeCount) return false;
    
    selection.deleteFromDocument();

    // Paste the modified clipboard content where it was intended to go
    selection.getRangeAt(0).insertNode(document.createTextNode(paste));
    selection.collapseToEnd();
  });
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