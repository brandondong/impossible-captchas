const RESOURCES = "resources/";
const AUDIO = RESOURCES + "audio/";
const IMAGES = RESOURCES + "images/";

export default class CaptchaManager {
  constructor() {
    this._isImageMode = true;
    this.numImageQuestionsAnswered = -1;
    this.numAudioQuestionsAnswered = -1;
  }
  
  nextQuestion() {
    if (this._isImageMode) {
      this.numImageQuestionsAnswered++;
      const question = { sentence: "Select all squares that contain the colour", word: "red" };
      const images = _imageSet("strawberries", "png");
      return { question: question, images: images };
    } else {
      this.numAudioQuestionsAnswered++;
      const question = { sentence: "Listen to the audio and type the", word: "words" };
      const source = AUDIO + "meatball_parade.mp3"
      return { question: question, source: source };
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

function _imageSet(filename, ext) {
  const imageSet = [];
  for (let i = 0; i < 16; i++) {
    imageSet.push(`${IMAGES}${filename}_${i}.${ext}`);
  }
  return imageSet;
}