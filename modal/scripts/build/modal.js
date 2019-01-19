(function () {
  'use strict';

  const RESOURCES = "resources/";
  const AUDIO = RESOURCES + "audio/";
  const IMAGES = RESOURCES + "images/";

  const IMAGE_QUESTIONS = [
    { question: { sentence: "Select all squares that contain the colour", word: "white" }, imagesFunc: () => _shuffleArray(_imageSet("white", "jpg"), 0, 14) },
    { question: { sentence: "Select all squares that contain", word: "animals" }, imagesFunc: () => _shuffleArray(_imageSet("animals", "jpg"), 0, 14) },
    { question: { sentence: "Select all squares that contain the colour", word: "red" }, imagesFunc: () => _imageSet("strawberries", "png") },
    { question: { sentence: "Select all squares that contain", word: "black dots" }, imagesFunc: () => _imageSet("grid_illusion", "png") },
    { question: { sentence: "Select squares with text printed in a colour with", word: "five letters" }, imagesFunc: _stroopEffect }
  ];

  const AUDIO_QUESTIONS = [
    { source: _audioPath("pair_pear.mp3") },
    { source: _audioPath("poland.mp3") },
    { source: _audioPath("vinny.mp3") },
    { source: _audioPath("bark.mp3") },
    { source: _audioPath("meatball_parade.mp3") }
  ];

  class CaptchaManager {
    constructor() {
      this._isImageMode = true;
      this.numImageQuestionsAnswered = -1;
      this.numAudioQuestionsAnswered = -1;
    }
    
    nextQuestion() {
      if (this._isImageMode) {
        this.numImageQuestionsAnswered++;
      } else {
        this.numAudioQuestionsAnswered++;
      }
      const hasImageQuestions = this._hasImageQuestionsLeft();
      const hasAudioQuestions = this._hasAudioQuestionsLeft();
      if (!hasImageQuestions && !hasAudioQuestions) {
        return;
      }
      if (!hasAudioQuestions || (this._isImageMode && hasImageQuestions)) {
        this._isImageMode = true;
        const questionDetails = this._nextQuestionDetail(IMAGE_QUESTIONS, this.numImageQuestionsAnswered);
        const question = questionDetails.question;
        const images = questionDetails.imagesFunc();
        return { question: question, images: images };
      } else {
        this._isImageMode = false;
        const questionDetails = this._nextQuestionDetail(AUDIO_QUESTIONS, this.numAudioQuestionsAnswered);
        const question = { sentence: "Listen to the audio and type the", word: "words" };
        const source = questionDetails.source;
        return { question: question, source: source };
      }
    }
    
    canSwithQuestionTypes() {
      if (this._isImageMode) {
        return this.numImageQuestionsAnswered >= 3 && this._hasAudioQuestionsLeft();
      }
      return this.numAudioQuestionsAnswered >= 3 && this._hasImageQuestionsLeft();
    }
    
    switchQuestionTypes() {
      this._isImageMode = !this._isImageMode;
    }
    
    isImageMode() {
      return this._isImageMode;
    }
    
    _hasImageQuestionsLeft() {
      return this.numImageQuestionsAnswered < IMAGE_QUESTIONS.length;
    }
    
    _hasAudioQuestionsLeft() {
      return this.numAudioQuestionsAnswered < AUDIO_QUESTIONS.length;
    }
    
    _nextQuestionDetail(a, numAnswered) {
      if (numAnswered >= a.length) {
        return a[a.length - 1];
      }
      return a[numAnswered];
    }
  }

  function _imageSet(filename, ext) {
    const imageSet = [];
    for (let i = 0; i < 16; i++) {
      imageSet.push(`${IMAGES}${filename}/${filename}_${i}.${ext}`);
    }
    return imageSet;
  }

  function _stroopEffect() {
    const images = _imageSet("stroop", "png");
    _shuffleArray(images, 0, 3);
    _shuffleArray(images, 4, 15);
    return images;
  }

  function _audioPath(filename) {
     return AUDIO + filename;
  }

  function _shuffleArray(array, start, end) {
    // Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array.
    for (let i = end - start; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const actualI = i + start;
      const actualJ = j + start;
      [array[actualI], array[actualJ]] = [array[actualJ], array[actualI]];
    }
    return array;
  }

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
    let currentImageQuestion = _updateWithNextQuestion(manager, sentence, word, audio, audioSource, imageContainers, imageSection, audioSection, toggleLink);
    manager.switchQuestionTypes();
    let currentAudioQuestion = _updateWithNextQuestion(manager, sentence, word, audio, audioSource, imageContainers, imageSection, audioSection, toggleLink);
    manager.switchQuestionTypes();
    _switchToImageSection(imageSection, audioSection, toggleLink, currentImageQuestion, sentence, word);
    
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
        const nextQuestion = _updateWithNextQuestion(manager, sentence, word, audio, audioSource, imageContainers, imageSection, audioSection, toggleLink);
        if (!nextQuestion) {
          alert("Out of questions!");
          return;
        }
        if (manager.isImageMode()) {
          currentImageQuestion = nextQuestion;
        } else {
          currentAudioQuestion = nextQuestion;
        }
        // Update toggle link visibility.
        _updateToggleLink(manager, toggleLink);
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
      // Update toggle link visibility.
      _updateToggleLink(manager, toggleLink);
      if (manager.isImageMode()) {
        // Switch to image questions.
        _switchToImageSection(imageSection, audioSection, toggleLink, currentImageQuestion, sentence, word);
      } else {
        // Switch to audio questions.
        _switchToAudioSection(imageSection, audioSection, toggleLink, currentAudioQuestion, sentence, word);
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

  function _updateWithNextQuestion(manager, sentence, word, audio, audioSource, imageContainers, imageSection, audioSection, toggleLink) {
    const questionDetails = manager.nextQuestion();
    if (!questionDetails) {
      return;
    }
    const question = questionDetails.question;
    if (manager.isImageMode()) {
      const images = questionDetails.images;
      for (let i = 0; i < 16; i++) {
        const image = imageContainers[i].children[0];
        image.src = images[i];
      }
      // Switch to image questions if needed.
      _switchToImageSection(imageSection, audioSection, toggleLink, question, sentence, word);
    } else {
      audioSource.src = questionDetails.source;
      audio.load();
      // Switch to audio questions if needed.
      _switchToAudioSection(imageSection, audioSection, toggleLink, question, sentence, word);
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

  function _switchToImageSection(imageSection, audioSection, toggleLink, currentImageQuestion, sentence, word) {
    imageSection.style.display = "block";
    audioSection.style.display = "none";
    toggleLink.innerHTML = "I am visually impaired.";
    _updateQuestionText(currentImageQuestion, sentence, word);
  }

  function _switchToAudioSection(imageSection, audioSection, toggleLink, currentAudioQuestion, sentence, word) {
    imageSection.style.display = "none";
    audioSection.style.display = "block";
    toggleLink.innerHTML = "I am hearing impaired.";
    _updateQuestionText(currentAudioQuestion, sentence, word);
  }

  function _updateToggleLink(manager, toggleLink) {
    if (manager.canSwithQuestionTypes()) {
      toggleLink.style.visibility = "visible";
    } else {
      toggleLink.style.visibility = "hidden";
    }
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
