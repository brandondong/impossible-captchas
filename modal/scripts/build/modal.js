(function () {
  'use strict';

  const RESOURCES = "resources/";
  const AUDIO = RESOURCES + "audio/";

  class CaptchaManager {
    constructor() {
      this._isImageMode = true;
      this.numImageQuestionsAnswered = -1;
      this.numAudioQuestionsAnswered = -1;
    }
    
    nextQuestion() {
      if (this._isImageMode) {
        this.numImageQuestionsAnswered++;
        const question = { sentence: "Select all squares that contain the colour", word: "green" };
        return { question: question };
      } else {
        this.numAudioQuestionsAnswered++;
        const question = { sentence: "Listen to the audio and type the", word: "words" };
        const details = { source: AUDIO + "meatball_parade.mp3" };
        return { question: question, details: details };
      }
    }
    
    canSwithQuestionTypes() {
      if (this._isImageMode) {
        return this.numImageQuestionsAnswered >= 3;
      }
      return this.numAudioQuestionsAnswered >= 3;
    }
    
    switchQuestionTypes() {
      this._isImageMode = !this._isImageMode;
    }
    
    isImageMode() {
      return this._isImageMode;
    }
  }

  function main() {
    const manager = new CaptchaManager();
    let numImagesSelected = 0;
    
    const sentence = document.getElementById("sentence");
    const word = document.getElementById("word");
    const submitButton = document.getElementById("submit");
    const toggleLink = document.getElementById("toggle");
    const imageContainers = document.getElementsByClassName("image-container");
    const imageSection = document.getElementById("images");
    const audioSection = document.getElementById("audio");
    const audioSource = document.getElementById("source");
    const audioTextInput = document.getElementById("audio-text");
    
    // Initialize the two UI components.
    let currentImageQuestion = _updateWithNextQuestion(manager, sentence, word, audioSource);
    manager.switchQuestionTypes();
    let currentAudioQuestion = _updateWithNextQuestion(manager, sentence, word, audioSource);
    manager.switchQuestionTypes();
    _updateQuestionText(currentImageQuestion, sentence, word);
    
    submitButton.addEventListener("click", () => {
      // Clear image selections.
      numImagesSelected = 0;
      _deselectImages(imageContainers);
      // Clear the input field.
      audioTextInput.innerHTML = "";
      // Disable the button.
      submitButton.disabled = true;
      // Update UI with next question.
      const nextQuestion = _updateWithNextQuestion(manager, sentence, word, audioSource);
      if (manager.isImageMode()) {
        currentImageQuestion = nextQuestion;
      } else {
        currentAudioQuestion = nextQuestion;
      }
      // Check if the question type switch link can now be shown.
      if (manager.canSwithQuestionTypes()) {
        toggleLink.style.visibility = "visible";
      }
    });
    toggleLink.addEventListener("click", () => {
      manager.switchQuestionTypes();
      submitButton.disabled = true;
      // Clear image selections and text input.
      numImagesSelected = 0;
      _deselectImages(imageContainers);
      audioTextInput.innerHTML = "";
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
    
    audioTextInput.addEventListener("input", () => {
      const text = audioTextInput.innerHTML;
      submitButton.disabled = text.length === 0;
    });
    
    audioTextInput.addEventListener("paste", e => _handlePaste(e, audioTextInput, submitButton));
  }

  function _updateWithNextQuestion(manager, sentence, word, audioSource) {
    const questionDetails = manager.nextQuestion();
    const question = questionDetails.question;
    _updateQuestionText(question, sentence, word);
    if (manager.isImageMode()) ; else {
      audioSource.src = questionDetails.details.source;
    }
    return question;
  }

  function _updateQuestionText(question, sentence, word) {
    sentence.innerHTML = question.sentence;
    word.innerHTML = question.word;
  }

  function _deselectImages(imageContainers) {
    for (const ic of imageContainers) {
      const img = ic.children[0];
      const circle = ic.children[1];
      _deselect(img, circle);
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

}());
