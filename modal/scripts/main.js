import CaptchaManager from "./captcha-manager";

function main() {
  const manager = new CaptchaManager();
  let numImagesSelected = 0;
  let isSubmitting = false;
  
  const sentence = document.getElementById("sentence");
  const word = document.getElementById("word");
  const submitButton = document.getElementById("submit");
  const toggleLink = document.getElementById("toggle");
  const imageContainers = document.getElementsByClassName("image-container");
  const imageSection = document.getElementById("images");
  const audioSection = document.getElementById("audio");
  const audio = document.getElementById("audio-load");
  const audioSource = document.getElementById("source");
  const audioTextInput = document.getElementById("audio-text");
  
  // Initialize the two UI components.
  let currentImageQuestion = _updateWithNextQuestion(manager, sentence, word, audio, audioSource, imageContainers);
  manager.switchQuestionTypes();
  let currentAudioQuestion = _updateWithNextQuestion(manager, sentence, word, audio, audioSource, imageContainers);
  manager.switchQuestionTypes();
  _updateQuestionText(currentImageQuestion, sentence, word);
  
  submitButton.addEventListener("click", () => {
    isSubmitting = true;
    // Disable the button.
    submitButton.disabled = true;
    audio.pause();
    setTimeout(() => {
      isSubmitting = false;
      // Clear image selections.
      numImagesSelected = 0;
      _deselectImages(imageContainers);
      // Clear the input field.
      audioTextInput.innerHTML = "";
      // Update UI with next question.
      const nextQuestion = _updateWithNextQuestion(manager, sentence, word, audio, audioSource, imageContainers);
      if (manager.isImageMode()) {
        currentImageQuestion = nextQuestion;
      } else {
        currentAudioQuestion = nextQuestion;
      }
      // Check if the question type switch link can now be shown.
      if (manager.canSwithQuestionTypes()) {
        toggleLink.style.visibility = "visible";
      }
    }, 500);
  });
  toggleLink.addEventListener("click", () => {
    manager.switchQuestionTypes();
    submitButton.disabled = true;
    // Reset the image component.
    numImagesSelected = 0;
    _deselectImages(imageContainers);
    // And the audio component.
    audioTextInput.innerHTML = "";
    audio.pause();		
    audio.currentTime = 0;
    // Check if the question type switch link should now be hidden.
    if (!manager.canSwithQuestionTypes()) {
      toggleLink.style.visibility = "hidden";
    }
    if (manager.isImageMode()) {
      // Switch to image questions.
      imageSection.style.display = "block";
      audioSection.style.display = "none";
      toggleLink.innerHTML = "I am visually impaired.";
      _updateQuestionText(currentImageQuestion, sentence, word);
    } else {
      // Switch to audio questions.
      imageSection.style.display = "none";
      audioSection.style.display = "block";
      toggleLink.innerHTML = "I am hearing impaired.";
      _updateQuestionText(currentAudioQuestion, sentence, word);
    }
  });
  for (const ic of imageContainers) {
    ic.addEventListener("click", () => {
      if (isSubmitting) {
        return;
      }
      // Toggle selections appropriately.
      const circle = ic.children[1];
      if (_isSelected(circle)) {
        _deselect(circle);
        numImagesSelected--;
        if (numImagesSelected === 0) {
          submitButton.disabled = true;
        }
      } else {
        _select(circle);
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
  
  audioTextInput.addEventListener("input", () => {
    const text = audioTextInput.innerHTML;
    submitButton.disabled = text.length === 0;
  });
  
  audioTextInput.addEventListener("paste", e => _handlePaste(e, audioTextInput, submitButton));
}

function _updateWithNextQuestion(manager, sentence, word, audio, audioSource, imageContainers) {
  const questionDetails = manager.nextQuestion();
  const question = questionDetails.question;
  _updateQuestionText(question, sentence, word);
  if (manager.isImageMode()) {
    const images = questionDetails.images;
    for (let i = 0; i < 16; i++) {
      const image = imageContainers[i].children[0];
      image.src = images[i];
    }
  } else {
    audioSource.src = questionDetails.source;
    audio.load();
  }
  return question;
}

function _updateQuestionText(question, sentence, word) {
  sentence.innerHTML = question.sentence;
  word.innerHTML = question.word;
}

function _deselectImages(imageContainers) {
  for (const ic of imageContainers) {
    const circle = ic.children[1];
    _deselect(circle);
  }
}

function _deselect(circle) {
  circle.style.visibility = "hidden";
}

function _select(circle) {
  circle.style.visibility = "visible";
}

function _isSelected(circle) {
  return circle.style.visibility === "visible";
}

function _handlePaste(e, audioTextInput, submitButton) {
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
  const text = audioTextInput.innerHTML;
  submitButton.disabled = text.length === 0;
}

document.addEventListener("DOMContentLoaded", main);