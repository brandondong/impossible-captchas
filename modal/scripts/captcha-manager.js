export default class CaptchaManager {
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