const RESOURCES = "resources/";
const AUDIO = RESOURCES + "audio/";

export default class CaptchaManager {
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