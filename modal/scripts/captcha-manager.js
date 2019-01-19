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

export default class CaptchaManager {
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