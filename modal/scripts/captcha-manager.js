export default class CaptchaManager {
  constructor() {
    this.isImageMode = true;
    this.numImageQuestionsAnswered = -1;
    this.numAudioQuestionsAnswered = -1;
  }
  
  nextQuestion() {
    if (this.isImageMode) {
      this.numImageQuestionsAnswered++;
    } else {
      this.numAudioQuestionsAnswered++;
    }
  }
  
  canSwithQuestionTypes() {
    if (this.isImageMode) {
      return this.numImageQuestionsAnswered >= 5;
    }
    return this.numAudioQuestionsAnswered >= 5;
  }
  
  switchQuestionTypes() {
    this.isImageMode = !this.isImageMode;
  }
}